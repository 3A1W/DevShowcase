from contextlib import asynccontextmanager
from fastapi import FastAPI, Depends, Body
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from mongoengine import connect, disconnect
from auth import get_current_user
from config import MONGODB_URI
from models.usermodel import User

# Define the security scheme for Swagger UI to handle Clerk JWTs
security = HTTPBearer()

# Modern lifespan context manager to replace deprecated @app.on_event("startup")
@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup logic: Connects to MongoDB Atlas before the app starts
    try:
        connect(host=MONGODB_URI)
        print("--- Successfully connected to MongoDB Atlas ---")
    except Exception as e:
        print(f"--- Connection Failed: {e} ---")
    
    yield  # The application serves requests here
    
    # Shutdown logic: Disconnects from MongoDB when the server stops
    disconnect()
    print("--- Successfully disconnected from MongoDB ---")

# Initialize FastAPI with the lifespan handler
app = FastAPI(lifespan=lifespan)

# CORS configuration to allow requests from the Vite frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def root():
    return {"message": "DevShowcase backend is running"}

# Protected route to verify Clerk authentication
@app.get("/protected")
async def protected_route(user=Depends(get_current_user)):
    return {
        "message": "You reached a protected route",
        "user": user,
    }

# POST route to receive and store portfolio builds in MongoDB Atlas
@app.post("/save-portfolio")
async def save_portfolio(
    data: dict = Body(...), 
    user=Depends(get_current_user),
    token: HTTPAuthorizationCredentials = Depends(security)
):
    # clerk_id is retrieved from the verified JWT payload
    clerk_id = user['payload']['sub']
    
    # Store the user information in the 'user' collection
    # Note: This uses the User model defined in your models/usermodel.py
    new_entry = User(
        username=user['payload'].get('username', 'DefaultUser'),
        email=user['payload'].get('email', 'no-email@clerk.com')
    ).save()
    
    return {
        "message": "Data successfully stored in MongoDB Atlas!",
        "clerk_id": clerk_id,
        "database_id": str(new_entry.id),
        "data_preview": data.get("template")
    }