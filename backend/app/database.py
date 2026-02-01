from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
import os
from dotenv import load_dotenv

load_dotenv()

# Format: postgresql://user:password@postgresserver/db
SQLALCHEMY_DATABASE_URL = os.getenv("DATABASE_URL")

if not SQLALCHEMY_DATABASE_URL:
    print("WARNING: DATABASE_URL not found in .env, using default local")
    SQLALCHEMY_DATABASE_URL = "postgresql://postgres:password@localhost/tesis_iot"
else:
     print(f"🔌 LOADING DB URL: {SQLALCHEMY_DATABASE_URL.split('@')[1] if '@' in SQLALCHEMY_DATABASE_URL else 'HIDDEN'}")

# Ensure clean connection args
connect_args = {"options": "-c search_path=dev"}

engine = create_engine(
    SQLALCHEMY_DATABASE_URL,
    connect_args=connect_args
)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
