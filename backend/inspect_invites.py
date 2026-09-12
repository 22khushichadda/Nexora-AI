from app.database.database import SessionLocal
from app.database.models import WorkspaceInvitation, WorkspaceMember, User
from sqlalchemy import func

def main():
    db = SessionLocal()

    print("=== ALL USERS ===")
    for u in db.query(User).all():
        print(f"id={u.id}, email='{u.email}', name='{u.name}'")

    print("\n=== WORKSPACE MEMBERS ===")
    for m in db.query(WorkspaceMember).all():
        print(f"id={m.id}, user_id={m.user_id}, email='{m.email}', workspace_id={m.workspace_id}, role='{m.role}'")

    print("\n=== WORKSPACE INVITATIONS matching 'khushichadda22@gmail.com' ===")
    self_invites = db.query(WorkspaceInvitation).filter(func.lower(WorkspaceInvitation.email) == 'khushichadda22@gmail.com').all()
    for inv in self_invites:
        print(f"id={inv.id}, workspace_id={inv.workspace_id}, email='{inv.email}', status='{inv.status}', role='{inv.role}', created_at={inv.created_at}")

    print("\n=== ALL PENDING INVITATIONS IN WORKSPACE 7 ===")
    all_invites_7 = db.query(WorkspaceInvitation).filter(WorkspaceInvitation.workspace_id == 7, WorkspaceInvitation.status == 'pending').all()
    print("Total pending in workspace 7:", len(all_invites_7))
    for inv in all_invites_7:
        print(f"id={inv.id}, workspace_id={inv.workspace_id}, name='{inv.name}', email='{inv.email}', status='{inv.status}', created_at={inv.created_at}")

if __name__ == "__main__":
    main()
