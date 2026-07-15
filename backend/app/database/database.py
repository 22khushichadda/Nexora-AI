from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

from app.database.config import DATABASE_URL
from app.database.models import Base

# Create Database Engine
engine = create_engine(
    DATABASE_URL,
    echo=True
)

# Session
SessionLocal = sessionmaker(
    autocommit=False,
    autoflush=False,
    bind=engine
)

# Create Tables Automatically
Base.metadata.create_all(bind=engine)


# Dependency
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()