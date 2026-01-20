from fastapi import FastAPI, Depends, HTTPException, Header, status
from sqlalchemy.orm import Session
from fastapi.middleware.cors import CORSMiddleware
from typing import List, Optional
from . import crud, models, schemas
from .database import engine, get_db

# Database initialization is now handled by Alembic migrations
# Run `alembic upgrade head` to apply changes
# (No more automatic create_all on startup to prevent hangs and managing schema updates professionally)

app = FastAPI(title="ULEAM IoT Backend")

# CORS Setup
origins = [
    "http://localhost:5173" # Vite Dev Server
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- Dependencies ---
import os
from dotenv import load_dotenv

load_dotenv()

# Simple API Key for Sensors (Thesis "Security" Requirement)
SENSOR_API_TOKEN = os.getenv("SENSOR_API_TOKEN")

async def verify_sensor_token(x_sensor_token: Optional[str] = Header(None)):
    if not SENSOR_API_TOKEN:
         raise HTTPException(status_code=500, detail="Server Configuration Error: Token not set")
    if x_sensor_token != SENSOR_API_TOKEN:
        raise HTTPException(status_code=401, detail="Invalid Sensor Token")
    return x_sensor_token

# --- Endpoints ---

@app.get("/")
def read_root():
    return {"message": "ULEAM IoT Backend Running"}

# User Registration
@app.post("/users/", response_model=schemas.User)
def create_user(user: schemas.UserCreate, db: Session = Depends(get_db)):
    try:
        db_user = crud.get_user_by_email(db, email=user.email)
        if db_user:
            raise HTTPException(status_code=400, detail="Email already registered")
        return crud.create_user(db=db, user=user)
    except Exception as e:
        print(f"❌ CRITICAL ERROR in /users/: {e}")
        raise HTTPException(status_code=500, detail=str(e))

# --- Authentication ---
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from datetime import timedelta, datetime
from jose import jwt

# Load Secret Key
SECRET_KEY = os.getenv("SECRET_KEY")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30

def create_access_token(data: dict, expires_delta: Optional[timedelta] = None):
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=15)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

@app.post("/token", response_model=schemas.Token)
def login_for_access_token(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    user = crud.get_user_by_email(db, email=form_data.username)
    if not user or not crud.verify_password(form_data.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    if not user.is_active:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="User account is inactive"
        )
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": user.email}, expires_delta=access_token_expires
    )
    crud.update_last_login(db, user.id)
    return {"access_token": access_token, "token_type": "bearer"}

# --- User Me Endpoint ---
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")

async def get_current_user(token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        email: str = payload.get("sub")
        if email is None:
            raise credentials_exception
    except Exception:
        raise credentials_exception
    user = crud.get_user_by_email(db, email=email)
    if user is None:
        raise credentials_exception
    if not user.is_active:
        raise credentials_exception
    return user

@app.get("/users/me", response_model=schemas.User)
async def read_users_me(current_user: schemas.User = Depends(get_current_user)):
    return current_user

# Admin Dependency
async def get_current_admin(current_user: schemas.User = Depends(get_current_user)):
    if current_user.role != "admin":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Se requieren privilegios de administrador"
        )
    return current_user



# --- Message Endpoints ---
@app.post("/messages", response_model=schemas.UserMessage)
def send_message(
    message: schemas.UserMessageCreate,
    db: Session = Depends(get_db),
    current_user: schemas.User = Depends(get_current_user)
):
    return crud.create_user_message(db=db, message=message, user_id=current_user.id)

# --- Admin Endpoints ---
@app.get("/admin/users", response_model=List[schemas.User])
def read_users_admin(
    skip: int = 0, 
    limit: int = 100, 
    db: Session = Depends(get_db), 
    current_user: schemas.User = Depends(get_current_admin)
):
    users = crud.get_users(db, skip=skip, limit=limit)
    return users

@app.get("/admin/stats", response_model=schemas.AdminStats)
def read_admin_stats(
    db: Session = Depends(get_db),
    current_user: schemas.User = Depends(get_current_admin)
):
    return crud.get_admin_stats(db)

@app.get("/admin/messages", response_model=List[schemas.UserMessage])
def read_admin_messages(
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db),
    current_user: schemas.User = Depends(get_current_admin)
):
    return crud.get_messages(db, skip=skip, limit=limit)

@app.put("/admin/users/{user_id}", response_model=schemas.User)
def update_user_admin(
    user_id: int, 
    user_update: schemas.UserAdminUpdate, 
    db: Session = Depends(get_db), 
    current_user: schemas.User = Depends(get_current_admin)
):
    db_user = crud.get_user(db, user_id=user_id)
    if db_user is None:
        raise HTTPException(status_code=404, detail="User not found")
    return crud.update_user_admin(db=db, db_user=db_user, user_update=user_update)

# Protected Sensor Ingestion
@app.post("/sensors/data", response_model=schemas.SensorReading, dependencies=[Depends(verify_sensor_token)])
def create_sensor_reading(reading: schemas.SensorReadingCreate, db: Session = Depends(get_db)):
    """
    Endpoint protected by API Token. Only authorized sensors can post data.
    """
    return crud.create_sensor_reading(db=db, reading=reading)

# Dashboard Stats (Averages)
@app.get("/dashboard/stats", response_model=schemas.DashboardStats)
def get_dashboard_stats(db: Session = Depends(get_db)):
    """
    Returns aggregated data for the dashboard (Averages, Totals).
    """
    return crud.get_dashboard_stats(db)

# Sensor History
@app.get("/sensors/history", response_model=List[schemas.SensorReading])
def get_sensor_history(limit: int = 100, db: Session = Depends(get_db)):
    return crud.get_recent_readings(db, limit=limit)

# --- Profile Management ---
from fastapi import File, UploadFile
from fastapi.staticfiles import StaticFiles
import shutil
import uuid

# Mount static directory for images
app.mount("/static", StaticFiles(directory="static"), name="static")

@app.put("/users/me", response_model=schemas.User)
async def update_user_me(
    user_update: schemas.UserUpdate, 
    current_user: schemas.User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    return crud.update_user(db, current_user, user_update)

@app.post("/users/me/avatar")
async def upload_avatar(
    file: UploadFile = File(...),
    current_user: schemas.User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    # Validate file type
    if not file.content_type.startswith("image/"):
        raise HTTPException(status_code=400, detail="File must be an image")
    
    # Create unique filename
    file_extension = file.filename.split(".")[-1]
    filename = f"{uuid.uuid4()}.{file_extension}"
    file_location = f"static/images/{filename}"
    
    # Save file
    with open(file_location, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)
        
    # Update user profile_image_url
    # Construct URL (Assuming local dev, in prod use full domain or CDN)
    image_url = f"/static/images/{filename}"
    
    current_user.profile_image_url = image_url
    db.commit()
    db.refresh(current_user)
    
    return {"info": "Image uploaded successfully", "url": image_url}

@app.delete("/users/me/avatar", status_code=204)
async def delete_avatar(
    current_user: schemas.User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    if not current_user.profile_image_url:
        return None
        
    # Optional: Delete file from filesystem if needed
    # filepath = current_user.profile_image_url.lstrip("/")
    # if os.path.exists(filepath):
    #     os.remove(filepath)

    current_user.profile_image_url = None
    db.commit()
    db.refresh(current_user)
    return None

@app.delete("/admin/users/{user_id}", status_code=204)
def delete_user_admin(
    user_id: int, 
    db: Session = Depends(get_db), 
    current_user: schemas.User = Depends(get_current_admin)
):
    db_user = crud.get_user(db, user_id=user_id)
    if db_user is None:
        raise HTTPException(status_code=404, detail="User not found")
    crud.delete_user(db, user_id=user_id)
    return None

# --- Irrigation Endpoints ---
@app.get("/irrigation/zones", response_model=List[schemas.IrrigationZone])
def read_irrigation_zones(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    zones = crud.get_irrigation_zones(db, skip=skip, limit=limit)
    # Init default zones if empty (First run logic)
    if not zones:
        defaults = ["Sector Norte", "Sector Sur", "Invernadero", "Jardín Principal"]
        for name in defaults:
            crud.create_irrigation_zone(db, schemas.IrrigationZoneCreate(name=name))
        zones = crud.get_irrigation_zones(db, skip=skip, limit=limit)
    return zones

@app.put("/irrigation/zones/{zone_id}", response_model=schemas.IrrigationZone)
def update_irrigation_zone(
    zone_id: int, 
    zone_update: schemas.IrrigationZoneUpdate, 
    db: Session = Depends(get_db)
):
    db_zone = crud.get_irrigation_zone(db, zone_id=zone_id)
    if db_zone is None:
        raise HTTPException(status_code=404, detail="Zone not found")
    return crud.update_irrigation_zone(db, db_zone, zone_update)

@app.post("/irrigation/zones/{zone_id}/toggle", response_model=schemas.IrrigationZone)
def toggle_irrigation_pump(
    zone_id: int, 
    db: Session = Depends(get_db)
):
    db_zone = crud.get_irrigation_zone(db, zone_id=zone_id)
    if db_zone is None:
        raise HTTPException(status_code=404, detail="Zone not found")
    
    # Toggle logic
    new_state = not db_zone.is_pump_active
    
    # If turning ON, set mode to manual
    update_data = schemas.IrrigationZoneUpdate(
        is_pump_active=new_state,
        mode="manual" if new_state else db_zone.mode
    )
    
    # TODO: Here we would send MQTT/Serial command to ESP32
    print(f"COMMAND: Pump {zone_id} {'ON' if new_state else 'OFF'}")
    
    return crud.update_irrigation_zone(db, db_zone, update_data)

@app.post("/irrigation/zones/{zone_id}/timer", response_model=schemas.IrrigationZone)
def set_irrigation_timer(
    zone_id: int, 
    seconds: int,
    db: Session = Depends(get_db)
):
    """
    Sets the pump ON and configures the timer.
    """
    db_zone = crud.get_irrigation_zone(db, zone_id=zone_id)
    if db_zone is None:
        raise HTTPException(status_code=404, detail="Zone not found")
    
    update_data = schemas.IrrigationZoneUpdate(
        is_pump_active=True,
        mode="timer",
        timer_seconds_remaining=seconds
    )
    
    # TODO: Send 'TIMER: {seconds}' command to ESP32
    print(f"COMMAND: Set Timer {zone_id} for {seconds}s")
    
    return crud.update_irrigation_zone(db, db_zone, update_data)
