from sqlalchemy import create_engine
from sqlalchemy.engine import URL
from sqlalchemy.orm import sessionmaker

engine = create_engine(
    URL.create(
        drivername="postgresql+psycopg2",
        username="postgres",
        password="Nexora@123",
        host="localhost",
        port=5432,
        database="Nexora_ai",
    )
)

SessionLocal = sessionmaker(
    autocommit=False,
    autoflush=False,
    bind=engine,
)

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()