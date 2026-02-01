from fastapi import FastAPI, Depends, HTTPException, Header, status, WebSocket, WebSocketDisconnect, BackgroundTasks
from sqlalchemy.orm import Session
from fastapi.middleware.cors import CORSMiddleware
from typing import List, Optional
import json
import asyncio
from . import crud, models, schemas
from .database import engine, get_db

app = FastAPI(title="ULEAM IoT Backend")

# CORS Setup
origins = [
    "http://localhost:5173", # Vite Dev Server
    "*" # Allow all for now during dev
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
         # Warn but don't crash if env not set in dev, but strictly normally 500
         # print("WARNING: SENSOR_API_TOKEN not set in .env")
         pass 
    if x_sensor_token != SENSOR_API_TOKEN:
        raise HTTPException(status_code=401, detail="Invalid Sensor Token")
    return x_sensor_token

# --- WebSocket Manager ---
class ConnectionManager:
    def __init__(self):
        self.active_connections: List[WebSocket] = []

    async def connect(self, websocket: WebSocket):
        await websocket.accept()
        self.active_connections.append(websocket)

    def disconnect(self, websocket: WebSocket):
        self.active_connections.remove(websocket)

    async def broadcast(self, message: dict):
        # Prevent "RuntimeError: Set changed size during iteration" by iterating over a copy
        print(f"📡 WS BROADCAST: {message}")
        for connection in list(self.active_connections):
            try:
                await connection.send_json(message)
            except Exception:
                # Handle disconnected clients that didn't close cleanly
                # print("WS Error sending message")
                pass

manager = ConnectionManager()

@app.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket):
    await manager.connect(websocket)
    try:
        while True:
            await websocket.receive_text()
            # We can handle incoming commands here if needed
            # For now, just echo or ignore
    except WebSocketDisconnect:
        manager.disconnect(websocket)

# --- Background Tasks for Automation ---
import websockets

EXTERNAL_WS_URL = os.getenv("EXTERNAL_WS_URL", "ws://api.ingeniericast.uk/ws")

async def listen_to_external_ws():
    """
    Connects to the external sensor server and bridges messages to our internal WS.
    """
    print(f"🔌 ATTEMPTING CONNECTION TO EXTERNAL WS: {EXTERNAL_WS_URL}")
    while True:
        try:
            async with websockets.connect(EXTERNAL_WS_URL) as websocket:
                print("✅ CONNECTED TO EXTERNAL SENSOR SERVER")
                while True:
                    message_text = await websocket.recv()
                    # print(f"📩 RAW EXTERNAL MSG: {message_text}")
                    
                    try:
                        data = json.loads(message_text)
                        msg_type = data.get("type")
                        payload = data.get("data")

                        # 1. Relay the message to our Frontend immediately
                        await manager.broadcast(data)

                        # 2. Process Data for Database (Persist history)
                        if msg_type == "nuevo_sensor":
                            # Payload ex: {"humedad_suelo": 45, "sensor": "1", ...}
                            try:
                                from .database import SessionLocal
                                db = SessionLocal()
                                try:
                                    # Map external data to our schema
                                    # Note: External payload might have nulls or different keys
                                    hum = payload.get("humedad_suelo")
                                    # If temp is not in payload, default to 0 or try to find it
                                    temp = payload.get("temperatura", 0.0) 
                                    sens_id = str(payload.get("sensor", "unknown"))

                                    # Only save if we have valid-ish data
                                    if hum is not None:
                                        from . import schemas, crud
                                        reading_in = schemas.SensorReadingCreate(
                                            sensor_id=sens_id,
                                            humidity=float(hum),
                                            temperature=float(temp)
                                        )
                                        crud.create_sensor_reading(db, reading_in)
                                        print(f"💾 SAVED READING: ID={sens_id} H={hum}%")
                                finally:
                                    db.close()
                            except Exception as db_e:
                                print(f"⚠️ DB Save Error: {db_e}") 

                    except json.JSONDecodeError:
                        print("❌ JSON Error from external WS")
                    except Exception as e:
                        print(f"⚠️ Error processing external msg: {e}")

        except (websockets.exceptions.ConnectionClosed, OSError) as e:
            print(f"❌ EXTERNAL WS DISCONNECTED: {e}. Retrying in 5s...")
            await asyncio.sleep(5)
        except Exception as e:
             print(f"❌ UNEXPECTED WS ERROR: {e}. Retrying in 5s...")
             await asyncio.sleep(5)

@app.on_event("startup")
async def startup_event():
    # Start the bridge in the background
    asyncio.create_task(listen_to_external_ws())

async def automation_cycle(zone_id: int):
    """
    Turn pump ON, wait, turn pump OFF.
    """
    print(f"🤖 AUTOMATION: Triggering Irrigation for Zone {zone_id}")
    
    # We need a fresh DB session for the background task
    from .database import SessionLocal
    
    # 1. Turn ON
    with SessionLocal() as db_bg:
        try:
            db_zone = crud.get_irrigation_zone(db_bg, zone_id=zone_id)
            if db_zone:
                crud.update_irrigation_zone(db_bg, db_zone, schemas.IrrigationZoneUpdate(is_pump_active=True, mode="auto"))
                await manager.broadcast({"type": "zone_update", "data": {"id": zone_id, "is_pump_active": True, "mode": "auto"}})
        except Exception as e:
            print(f"Error turning ON: {e}")

    # 2. Wait
    await asyncio.sleep(1) # 1 second delay as per requirement

    # 3. Turn OFF
    with SessionLocal() as db_bg:
        try:
            db_zone = crud.get_irrigation_zone(db_bg, zone_id=zone_id)
            if db_zone:
                crud.update_irrigation_zone(db_bg, db_zone, schemas.IrrigationZoneUpdate(is_pump_active=False, mode="auto"))
                await manager.broadcast({"type": "zone_update", "data": {"id": zone_id, "is_pump_active": False, "mode": "auto"}})
        except Exception as e:
            print(f"Error turning OFF: {e}")
    
    print(f"🤖 AUTOMATION: Cycle Complete for Zone {zone_id}")


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
async def create_sensor_reading(
    reading: schemas.SensorReadingCreate, 
    background_tasks: BackgroundTasks,
    db: Session = Depends(get_db)
):
    """
    Endpoint protected by API Token. Only authorized sensors can post data.
    """
    # 1. Save Reading
    new_reading = crud.create_sensor_reading(db=db, reading=reading)

    # 2. Broadcast Valid Reading to WS
    await manager.broadcast({
        "type": "new_reading",
        "data": {
            "sensor_id": new_reading.sensor_id,
            "temperature": new_reading.temperature,
            "humidity": new_reading.humidity,
            "timestamp": new_reading.timestamp.isoformat()
        }
    })

    # 3. Check Automation Logic
    HUM_MIN = 41.0
    if new_reading.humidity is not None and new_reading.humidity < HUM_MIN:
        # Trigger automation for Zone 1 (or 4, adapting to available zones)
        # We will use ID 1 as default for now
        target_zone_id = 1 
        
        # We trigger the cycle in background
        background_tasks.add_task(automation_cycle, zone_id=target_zone_id)

    return new_reading

# Pulse Control (Legacy Endpoint Configured for New Backend)
@app.post("/api/pulse", dependencies=[Depends(verify_sensor_token)])
async def control_pulse(
    control: schemas.PulseControl,
    background_tasks: BackgroundTasks,
    db: Session = Depends(get_db)
):
    print(f"📡 PULSE API: Received {control.accion} for Pulse {control.pulse}")
    zone_id = control.pulse
    
    try:
        zone = crud.get_irrigation_zone(db, zone_id=zone_id)
    except Exception:
        zone = None

    if not zone:
         raise HTTPException(status_code=404, detail=f"Pulse/Zone {zone_id} not found")

    is_active = (control.accion == "on")
    
    # Update DB
    crud.update_irrigation_zone(db, zone, schemas.IrrigationZoneUpdate(is_pump_active=is_active, mode="pulse_api"))
    
    # Broadcast
    await manager.broadcast({
        "type": "zone_update", 
        "data": {
            "id": zone.id, 
            "is_pump_active": is_active, 
            "mode": "pulse_api"
        }
    })

    # Trigger Automation if ON (Mimics legacy apagar_pulse_despues)
    if is_active:
        background_tasks.add_task(automation_cycle, zone_id=zone.id)
        
    return {"status": "ok", "message": f"Pulse {zone_id} set to {control.accion}"}

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
async def update_irrigation_zone(
    zone_id: int, 
    zone_update: schemas.IrrigationZoneUpdate, 
    db: Session = Depends(get_db)
):
    """
    Update zone status and broadcast to WS.
    """
    db_zone = crud.get_irrigation_zone(db, zone_id=zone_id)
    if db_zone is None:
        raise HTTPException(status_code=404, detail="Zone not found")
    
    updated_zone = crud.update_irrigation_zone(db, db_zone, zone_update)
    
    # Broadcast update
    await manager.broadcast({
        "type": "zone_update",
        "data": {
            "id": updated_zone.id,
            "is_pump_active": updated_zone.is_pump_active,
            "mode": updated_zone.mode
        }
    })
    
    return updated_zone

@app.post("/irrigation/zones/{zone_id}/toggle", response_model=schemas.IrrigationZone)
async def toggle_irrigation_pump(
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
    
    updated_zone = crud.update_irrigation_zone(db, db_zone, update_data)
    
    # Broadcast update
    await manager.broadcast({
        "type": "zone_update",
        "data": {
            "id": updated_zone.id,
            "is_pump_active": updated_zone.is_pump_active,
            "mode": updated_zone.mode
        }
    })
    
    return updated_zone

@app.post("/irrigation/zones/{zone_id}/timer", response_model=schemas.IrrigationZone)
async def set_irrigation_timer(
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
    
    updated_zone = crud.update_irrigation_zone(db, db_zone, update_data)
    
    # Broadcast update
    await manager.broadcast({
        "type": "zone_update",
        "data": {
            "id": updated_zone.id,
            "is_pump_active": updated_zone.is_pump_active,
            "mode": updated_zone.mode,
            "timer": seconds
        }
    })
    
    return updated_zone
