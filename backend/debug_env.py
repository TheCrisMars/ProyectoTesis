from dotenv import load_dotenv
import os

try:
    load_dotenv()
    print("DATABASE_URL:", os.getenv("DATABASE_URL"))
    print("Successfully loaded .env")
except Exception as e:
    print(f"Error loading .env: {e}")
