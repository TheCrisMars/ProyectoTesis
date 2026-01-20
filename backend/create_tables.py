from dotenv import load_dotenv
import os
from sqlalchemy import create_engine, text
from app.database import Base, engine
from app import models

# Load env variables explicitly
load_dotenv()

def create_tables():
    print("--- Starting Table Creation Debug Script ---")
    
    # Check Database URL
    url = os.getenv("DATABASE_URL")
    print(f"Database URL: {url}")
    
    try:
        # 1. Create Schema
        print("1. Attempting to create schema 'dev'...")
        with engine.connect() as connection:
            connection.execute(text("CREATE SCHEMA IF NOT EXISTS dev"))
            connection.commit()
        print("   Schema 'dev' ensured.")

        # 2. Check Registered Models
        print("2. Checking registered models in metadata...")
        tables = list(Base.metadata.tables.keys())
        print(f"   Found tables: {tables}")
        
        if not tables:
            print("   ERROR: No tables found in metadata! Models might not be imported correctly.")
            return

        # 3. Create Tables
        print("3. Running create_all...")
        Base.metadata.create_all(bind=engine)
        print("   create_all executed.")
        
        print("--- SUCCESS: Check your database now. ---")

    except Exception as e:
        print(f"--- FAILURE: An error occurred ---")
        print(e)

if __name__ == "__main__":
    create_tables()
