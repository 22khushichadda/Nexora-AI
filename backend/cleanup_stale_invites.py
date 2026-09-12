from app.database.database import SessionLocal
from app.database.models import WorkspaceInvitation, WorkspaceMember, User
from sqlalchemy import func

def main():
    db = SessionLocal()

    # Get all workspace members and user emails
    members = db.query(WorkspaceMember).all()
    member_emails = set()
    for m in members:
        if m.email:
            member_emails.add(m.email.strip().lower())
        if m.user_id:
            u = db.query(User).filter(User.id == m.user_id).first()
            if u and u.email:
                member_emails.add(u.email.strip().lower())

    # Add owner email aliases (khushichadda2004@gmail.com, khushichadda22@gmail.com, khushi.chadda22@gmail.com)
    owner_aliases = {"khushichadda2004@gmail.com", "khushichadda22@gmail.com", "khushi.chadda22@gmail.com"}
    member_emails.update(owner_aliases)

    print("Member emails to purge from pending invitations:", member_emails)

    pending_invites = db.query(WorkspaceInvitation).filter(WorkspaceInvitation.status == 'pending').all()
    to_delete = []
    to_keep = []

    for inv in pending_invites:
        inv_email = inv.email.strip().lower()
        if inv_email in member_emails:
            to_delete.append(inv)
        else:
            to_keep.append(inv)

    print(f"\nFound {len(to_delete)} stale pending invitations to remove:")
    for inv in to_delete:
        print(f"  Deleting ID={inv.id}, email='{inv.email}', name='{inv.name}', created_at={inv.created_at}")
        db.delete(inv)

    db.commit()

    print(f"\nRemaining {len(to_keep)} legitimate pending invitations:")
    for inv in to_keep:
        print(f"  Keeping ID={inv.id}, email='{inv.email}', name='{inv.name}', created_at={inv.created_at}")

    db.close()

if __name__ == "__main__":
    main()
