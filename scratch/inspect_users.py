import sys
sys.path.append("backend")

from app.database.database import SessionLocal
from app.database.models import User

db = SessionLocal()
users = db.query(User).all()
print(f"Total users in DB: {len(users)}")
for u in users:
    print(f"ID: {u.id}, Email: {u.email}, Name: {u.name}")
