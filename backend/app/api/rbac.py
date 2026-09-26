from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from pydantic import BaseModel
from typing import Dict, List

from app.database.database import get_db
from app.database.models import User, WorkspaceMember, RolePermission
from app.utils.auth import get_current_user, get_current_workspace_member

router = APIRouter(
    prefix="/rbac",
    tags=["RBAC / Permissions"]
)

# ---------------------------------
# Default Permission Configuration
# ---------------------------------

PERMISSION_DEFINITIONS = [
    {"key": "view_documents", "label": "View Documents"},
    {"key": "upload_documents", "label": "Create / Upload Document"},
    {"key": "delete_documents", "label": "Delete Document"},
    {"key": "ai_chat", "label": "AI Chat"},
    {"key": "view_history", "label": "View History"},
    {"key": "view_bookmarks", "label": "Bookmarks"},
    {"key": "invite_members", "label": "Invite Member"},
    {"key": "remove_members", "label": "Remove Member"},
    {"key": "change_member_roles", "label": "Change Member Roles"},
    {"key": "view_permissions", "label": "View Permissions"},
    {"key": "manage_permissions", "label": "Manage Permissions"},
    {"key": "manage_billing", "label": "Manage Billing"},
]

DEFAULT_PERMISSIONS: Dict[str, Dict[str, bool]] = {
    "Owner": {
        "view_documents": True,
        "upload_documents": True,
        "delete_documents": True,
        "ai_chat": True,
        "view_history": True,
        "view_bookmarks": True,
        "invite_members": True,
        "remove_members": True,
        "change_member_roles": True,
        "view_permissions": True,
        "manage_permissions": True,
        "manage_billing": True,
    },
    "Admin": {
        "view_documents": True,
        "upload_documents": True,
        "delete_documents": True,
        "ai_chat": True,
        "view_history": True,
        "view_bookmarks": True,
        "invite_members": True,
        "remove_members": True,
        "change_member_roles": True,
        "view_permissions": True,
        "manage_permissions": False,
        "manage_billing": False,
    },
    "Member": {
        "view_documents": True,
        "upload_documents": False,
        "delete_documents": False,
        "ai_chat": True,
        "view_history": True,
        "view_bookmarks": True,
        "invite_members": False,
        "remove_members": False,
        "change_member_roles": False,
        "view_permissions": False,
        "manage_permissions": False,
        "manage_billing": False,
    }
}


class TogglePermissionRequest(BaseModel):
    role: str
    permission: str
    enabled: bool


def get_or_init_permissions(db: Session, workspace_id: int) -> Dict[str, Dict[str, bool]]:
    """
    Fetch stored permissions from PostgreSQL. If missing, seed defaults.
    Returns: {"Owner": {key: val}, "Admin": {key: val}, "Member": {key: val}}
    """
    db_perms = db.query(RolePermission).filter(
        RolePermission.workspace_id == workspace_id
    ).all()

    existing_map = {}
    for p in db_perms:
        role = p.role.capitalize()
        if role not in existing_map:
            existing_map[role] = {}
        existing_map[role][p.permission] = p.enabled

    # Ensure all defaults are seeded
    seeded = False
    for role, def_map in DEFAULT_PERMISSIONS.items():
        if role not in existing_map:
            existing_map[role] = {}
        for perm_def in PERMISSION_DEFINITIONS:
            pkey = perm_def["key"]
            if pkey not in existing_map[role]:
                default_val = def_map.get(pkey, False)
                new_rec = RolePermission(
                    workspace_id=workspace_id,
                    role=role,
                    permission=pkey,
                    enabled=default_val
                )
                db.add(new_rec)
                existing_map[role][pkey] = default_val
                seeded = True

    if seeded:
        db.commit()

    return existing_map


def check_user_permission(user: User, workspace_id: int, permission_name: str, db: Session) -> bool:
    """
    Helper function to check permissions on any backend endpoint.
    Owner always has full access (returns True).
    Admin and Member are evaluated against stored PostgreSQL permissions.
    """
    if not user or not workspace_id:
        return False

    member = get_current_workspace_member(workspace_id, user, db)
    if not member:
        return False

    user_role = (member.role or "Member").strip().capitalize()

    if user_role == "Owner":
        return True

    permissions_map = get_or_init_permissions(db, workspace_id)
    role_perms = permissions_map.get(user_role, {})

    # Default to False if permission is unknown
    return role_perms.get(permission_name, False)


def verify_owner_access(user: User, workspace_id: int, db: Session):
    """
    Verifies that current user is the Workspace Owner.
    If not, raises HTTP 403 Forbidden.
    """
    member = get_current_workspace_member(workspace_id, user, db)
    if not member:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Access forbidden: Not a member of this workspace."
        )
    user_role = (member.role or "Member").strip().capitalize()
    if user_role != "Owner":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Access forbidden: Owner access required."
        )
    return member


# ======================================================
# Get Permission Matrix (Owner / Authorized Users)
# ======================================================

@router.get("/matrix/{workspace_id}")
@router.get("/permissions/{workspace_id}")
def get_permission_matrix(
    workspace_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    member = get_current_workspace_member(workspace_id, current_user, db)
    if not member:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Permission denied. You are not a member of this workspace."
        )

    user_role = (member.role or "Member").strip().capitalize()
    can_view = (
        user_role == "Owner"
        or check_user_permission(current_user, workspace_id, "view_permissions", db)
        or check_user_permission(current_user, workspace_id, "manage_permissions", db)
    )

    if not can_view:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Permission denied. Viewing permissions is disabled for your role."
        )

    perm_map = get_or_init_permissions(db, workspace_id)

    matrix = []
    for defn in PERMISSION_DEFINITIONS:
        pkey = defn["key"]
        matrix.append({
            "key": pkey,
            "label": defn["label"],
            "owner": perm_map.get("Owner", {}).get(pkey, DEFAULT_PERMISSIONS["Owner"].get(pkey, True)),
            "admin": perm_map.get("Admin", {}).get(pkey, DEFAULT_PERMISSIONS["Admin"].get(pkey, True)),
            "member": perm_map.get("Member", {}).get(pkey, DEFAULT_PERMISSIONS["Member"].get(pkey, False))
        })

    return {
        "workspace_id": workspace_id,
        "roles": ["Owner", "Admin", "Member"],
        "matrix": matrix
    }


# ======================================================
# Toggle Permission (PATCH / PUT)
# ======================================================

@router.put("/toggle/{workspace_id}")
@router.patch("/toggle/{workspace_id}")
@router.put("/permissions/{workspace_id}")
@router.patch("/permissions/{workspace_id}")
def toggle_permission(
    workspace_id: int,
    request: TogglePermissionRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    member = get_current_workspace_member(workspace_id, current_user, db)
    if not member:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Permission denied. Not a member of this workspace."
        )

    user_role = (member.role or "Member").strip().capitalize()
    can_manage = (
        user_role == "Owner"
        or check_user_permission(current_user, workspace_id, "manage_permissions", db)
    )

    if not can_manage:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Permission denied. Managing permissions is disabled for your role."
        )

    target_role = request.role.strip().capitalize()
    if target_role not in ["Owner", "Admin", "Member"]:
        raise HTTPException(
            status_code=400,
            detail="Can only modify Owner, Admin, or Member permissions."
        )

    # Non-owners can ONLY modify Member permissions (Admin permissions must be controlled by Owner)
    if user_role != "Owner" and target_role != "Member":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Permission denied. Only the Workspace Owner can modify Owner or Admin permissions."
        )

    pkey = request.permission.strip()

    # Protect locked Owner permissions (View Permissions & Manage Permissions must stay ON)
    if target_role == "Owner" and pkey in ["view_permissions", "manage_permissions"] and not request.enabled:
        raise HTTPException(
            status_code=400,
            detail="View Permissions and Manage Permissions for Workspace Owner are locked ON and cannot be disabled."
        )

    valid_keys = [d["key"] for d in PERMISSION_DEFINITIONS]
    if pkey not in valid_keys:
        raise HTTPException(
            status_code=400,
            detail=f"Invalid permission key: {pkey}"
        )

    rec = db.query(RolePermission).filter(
        RolePermission.workspace_id == workspace_id,
        RolePermission.role == target_role,
        RolePermission.permission == pkey
    ).first()

    if not rec:
        rec = RolePermission(
            workspace_id=workspace_id,
            role=target_role,
            permission=pkey,
            enabled=request.enabled
        )
        db.add(rec)
    else:
        rec.enabled = request.enabled

    # Auto-synchronize related permissions:
    # If manage_permissions is set to True -> view_permissions must automatically be True
    if pkey == "manage_permissions" and request.enabled:
        view_rec = db.query(RolePermission).filter(
            RolePermission.workspace_id == workspace_id,
            RolePermission.role == target_role,
            RolePermission.permission == "view_permissions"
        ).first()
        if not view_rec:
            db.add(RolePermission(
                workspace_id=workspace_id,
                role=target_role,
                permission="view_permissions",
                enabled=True
            ))
        else:
            view_rec.enabled = True

    # If view_permissions is set to False -> manage_permissions must automatically be False
    if pkey == "view_permissions" and not request.enabled:
        manage_rec = db.query(RolePermission).filter(
            RolePermission.workspace_id == workspace_id,
            RolePermission.role == target_role,
            RolePermission.permission == "manage_permissions"
        ).first()
        if manage_rec:
            manage_rec.enabled = False

    db.commit()
    db.refresh(rec)

    return get_permission_matrix(workspace_id, current_user, db)


# ======================================================
# Get Effective Permissions for Current User
# ======================================================

@router.get("/my-permissions/{workspace_id}")
def get_my_permissions(
    workspace_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    member = get_current_workspace_member(workspace_id, current_user, db)
    if not member:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Permission denied. You are not a member of this workspace."
        )

    user_role = (member.role or "Member").strip().capitalize()

    if user_role == "Owner":
        user_perms = {defn["key"]: True for defn in PERMISSION_DEFINITIONS}
    else:
        perm_map = get_or_init_permissions(db, workspace_id)
        role_perms = perm_map.get(user_role, {})
        user_perms = {
            defn["key"]: role_perms.get(defn["key"], DEFAULT_PERMISSIONS.get(user_role, {}).get(defn["key"], False))
            for defn in PERMISSION_DEFINITIONS
        }

    return {
        "role": user_role,
        "is_owner": user_role == "Owner",
        "permissions": user_perms
    }

