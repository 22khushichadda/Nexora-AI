import os
import sys

# Ensure backend root is on sys.path
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "backend")))

from fastapi.testclient import TestClient
from app.main import app
from app.database.database import SessionLocal
from app.database.models import User, Workspace, WorkspaceMember, RolePermission
from app.utils.auth import create_access_token

client = TestClient(app)

def run_tests():
    db = SessionLocal()
    try:
        # Create test workspace
        ws1 = db.query(Workspace).filter(Workspace.name == "Test Workspace A").first()
        if not ws1:
            ws1 = Workspace(name="Test Workspace A", description="Test WS A")
            db.add(ws1)
            db.commit()
            db.refresh(ws1)

        ws2 = db.query(Workspace).filter(Workspace.name == "Test Workspace B").first()
        if not ws2:
            ws2 = Workspace(name="Test Workspace B", description="Test WS B")
            db.add(ws2)
            db.commit()
            db.refresh(ws2)

        # Create test users
        def get_or_create_user(email, name):
            u = db.query(User).filter(User.email == email).first()
            if not u:
                u = User(name=name, email=email, password_hash="dummyhash")
                db.add(u)
                db.commit()
                db.refresh(u)
            return u

        owner_user = get_or_create_user("owner_test@nexora.ai", "Owner Test")
        admin_user = get_or_create_user("admin_test@nexora.ai", "Admin Test")
        member_user = get_or_create_user("member_test@nexora.ai", "Member Test")

        # Set up memberships in WS1
        def set_membership(ws_id, user, role):
            m = db.query(WorkspaceMember).filter(
                WorkspaceMember.workspace_id == ws_id,
                WorkspaceMember.user_id == user.id
            ).first()
            if not m:
                m = WorkspaceMember(workspace_id=ws_id, user_id=user.id, email=user.email, name=user.name, role=role)
                db.add(m)
            else:
                m.role = role
            db.commit()

        set_membership(ws1.id, owner_user, "Owner")
        set_membership(ws1.id, admin_user, "Admin")
        set_membership(ws1.id, member_user, "Member")

        # Set up memberships in WS2 (opposite roles for Test 7)
        set_membership(ws2.id, member_user, "Owner") # member_user is Owner in WS2!
        set_membership(ws2.id, owner_user, "Member") # owner_user is Member in WS2!

        owner_token = create_access_token({"sub": str(owner_user.id)})
        admin_token = create_access_token({"sub": str(admin_user.id)})
        member_token = create_access_token({"sub": str(member_user.id)})

        owner_headers = {"Authorization": f"Bearer {owner_token}"}
        admin_headers = {"Authorization": f"Bearer {admin_token}"}
        member_headers = {"Authorization": f"Bearer {member_token}"}

        print("=== RUNNING RBAC VERIFICATION TESTS ===")

        # TEST 1 & 2: Member Upload Documents ON / OFF
        print("\n--- TEST 1 & 2: Toggle Member upload_documents ON/OFF ---")
        # Enable Member upload_documents
        resp = client.patch(f"/rbac/toggle/{ws1.id}", json={"role": "Member", "permission": "upload_documents", "enabled": True}, headers=owner_headers)
        assert resp.status_code == 200, f"Toggle ON failed: {resp.text}"
        
        # Check Member my-permissions
        resp = client.get(f"/rbac/my-permissions/{ws1.id}", headers=member_headers)
        assert resp.status_code == 200
        assert resp.json()["permissions"]["upload_documents"] == True, "Member upload_documents should be True"
        print("[PASS] Member upload_documents ON verified!")

        # Disable Member upload_documents
        resp = client.patch(f"/rbac/toggle/{ws1.id}", json={"role": "Member", "permission": "upload_documents", "enabled": False}, headers=owner_headers)
        assert resp.status_code == 200, f"Toggle OFF failed: {resp.text}"

        # Check Member upload API directly -> expect 403
        resp = client.post(f"/documents/upload/{ws1.id}", files={"file": ("test.pdf", b"%PDF-1.4 dummy", "application/pdf")}, headers=member_headers)
        assert resp.status_code == 403, f"Expected 403 for upload when disabled, got {resp.status_code}"
        print("[PASS] Direct Member upload when OFF returned 403 Forbidden!")

        # TEST 3 & 4: Admin View Permissions = ON, Manage Permissions = OFF
        print("\n--- TEST 3 & 4: Admin View Permissions ON / Manage Permissions OFF ---")
        client.patch(f"/rbac/toggle/{ws1.id}", json={"role": "Admin", "permission": "view_permissions", "enabled": True}, headers=owner_headers)
        client.patch(f"/rbac/toggle/{ws1.id}", json={"role": "Admin", "permission": "manage_permissions", "enabled": False}, headers=owner_headers)

        # Admin can view matrix
        resp = client.get(f"/rbac/matrix/{ws1.id}", headers=admin_headers)
        assert resp.status_code == 200, f"Admin viewing matrix failed: {resp.text}"
        print("[PASS] Admin with view_permissions=ON can view permissions matrix!")

        # Admin cannot toggle permissions when manage_permissions=OFF
        resp = client.patch(f"/rbac/toggle/{ws1.id}", json={"role": "Member", "permission": "ai_chat", "enabled": False}, headers=admin_headers)
        assert resp.status_code == 403, f"Expected 403 for Admin toggle without manage_permissions, got {resp.status_code}"
        print("[PASS] Admin without manage_permissions returned 403 on toggle attempt!")

        # TEST 5: Admin Manage Permissions = ON (Auto-enables View Permissions)
        print("\n--- TEST 5: Admin Manage Permissions = ON ---")
        client.patch(f"/rbac/toggle/{ws1.id}", json={"role": "Admin", "permission": "view_permissions", "enabled": False}, headers=owner_headers)
        client.patch(f"/rbac/toggle/{ws1.id}", json={"role": "Admin", "permission": "manage_permissions", "enabled": True}, headers=owner_headers)

        # Verify view_permissions was automatically set to True
        resp = client.get(f"/rbac/my-permissions/{ws1.id}", headers=admin_headers)
        assert resp.json()["permissions"]["view_permissions"] == True, "view_permissions should auto-enable when manage_permissions=True"
        print("[PASS] view_permissions auto-enabled when manage_permissions set to True!")

        # Admin can toggle Member permissions
        resp = client.patch(f"/rbac/toggle/{ws1.id}", json={"role": "Member", "permission": "ai_chat", "enabled": True}, headers=admin_headers)
        assert resp.status_code == 200, f"Admin toggling Member permission failed: {resp.text}"
        print("[PASS] Admin with manage_permissions=ON can manage Member permissions!")

        # Admin CANNOT toggle Owner or Admin permissions
        resp = client.patch(f"/rbac/toggle/{ws1.id}", json={"role": "Admin", "permission": "delete_documents", "enabled": False}, headers=admin_headers)
        assert resp.status_code == 403, f"Expected 403 when Admin toggles Admin permissions, got {resp.status_code}"
        print("[PASS] Admin attempting to modify Admin permissions returned 403 Forbidden!")

        # TEST 6: Member cannot access /rbac/matrix or toggle
        print("\n--- TEST 6: Member RBAC API direct access ---")
        client.patch(f"/rbac/toggle/{ws1.id}", json={"role": "Member", "permission": "view_permissions", "enabled": False}, headers=owner_headers)
        client.patch(f"/rbac/toggle/{ws1.id}", json={"role": "Member", "permission": "manage_permissions", "enabled": False}, headers=owner_headers)

        resp = client.get(f"/rbac/matrix/{ws1.id}", headers=member_headers)
        assert resp.status_code == 403, f"Expected 403 for Member matrix access, got {resp.status_code}"
        
        resp = client.patch(f"/rbac/toggle/{ws1.id}", json={"role": "Member", "permission": "ai_chat", "enabled": True}, headers=member_headers)
        assert resp.status_code == 403, f"Expected 403 for Member toggle access, got {resp.status_code}"
        print("[PASS] Member direct RBAC API access returned 403 Forbidden!")

        # TEST 7: Workspace-specific roles & permissions
        print("\n--- TEST 7: Workspace-specific Role Resolution ---")
        # In WS1: member_user is Member
        resp1 = client.get(f"/rbac/my-permissions/{ws1.id}", headers=member_headers)
        assert resp1.json()["role"] == "Member" and resp1.json()["is_owner"] == False

        # In WS2: member_user is Owner
        resp2 = client.get(f"/rbac/my-permissions/{ws2.id}", headers=member_headers)
        assert resp2.json()["role"] == "Owner" and resp2.json()["is_owner"] == True
        print("[PASS] User member_user has Member role in WS1 and Owner role in WS2 correctly!")

        print("\nALL 7 TESTS PASSED SUCCESSFULLY! RBAC SYSTEM IS FULLY FUNCTIONAL!")

    finally:
        db.close()

if __name__ == "__main__":
    run_tests()
