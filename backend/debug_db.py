import os
from sqlalchemy import create_engine, text
from dotenv import load_dotenv

load_dotenv()

url = os.getenv("DATABASE_URL")
print(f"Testing connection to: {url}")

try:
    engine = create_engine(url)
    with engine.connect() as conn:
        print("Successfully connected!")
        result = conn.execute(text("SELECT current_schema()"))
        print(f"Current schema: {result.scalar()}")
except Exception as e:
    # Print repr to avoid unicode errors with localized strings
    print(f"Connection failed: {repr(e)}")
