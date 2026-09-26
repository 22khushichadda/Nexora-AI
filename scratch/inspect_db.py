import os
import sys

sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "backend")))

from app.database.database import SessionLocal
from app.database.models import User, Workspace, WorkspaceMember, RolePermission

db = SessionLocal()

print("--- USERS ---")
users = db.query(User).all()
for u in users:
    print(f"User ID: {u.id}, Name: {u.name}, Email: {u.email}")

print("\n--- WORKSPACES ---")
workspaces = db.query(Workspace).all()
for w in workspaces:
    print(f"WS ID: {w.id}, Name: {w.name}")

print("\n--- WORKSPACE MEMBERS ---")
members = db.query(WorkspaceMember).all()
for m in members:
    print(f"Member ID: {m.id}, WS ID: {m.workspace_id}, User ID: {m.user_id}, Name: {m.name}, Email: {m.email}, Role: {m.role}")

print("\n--- ROLE PERMISSIONS ---")
perms = db.query(RolePermission).all()
for p in perms:
    print(f"ID: {p.id}, WS ID: {p.workspace_id}, Role: {p.role}, Perm: {p.permission}, Enabled: {p.enabled}")

db.close()
