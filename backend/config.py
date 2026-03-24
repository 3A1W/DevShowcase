from dotenv import load_dotenv
import os

load_dotenv()

CLERK_SECRET_KEY = os.getenv("CLERK_SECRET_KEY")
FRONTEND_URL = os.getenv("FRONTEND_URL", "http://localhost:5173")
MONGODB_URI = os.getenv("MONGODB_URI")

if not CLERK_SECRET_KEY:
    raise ValueError("CLERK_SECRET_KEY is not set in .env")