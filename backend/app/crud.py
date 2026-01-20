from sqlalchemy.orm import Session
from sqlalchemy import func
from . import models, schemas
from passlib.context import CryptContext
from datetime import datetime, timedelta

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# --- Utils ---
def get_password_hash(password):
    # bcrypt has a 72 BYTE limit. Need to truncate by bytes, not characters
    password_bytes = password.encode('utf-8')[:72]
    # Decode back safely, ignoring partial characters at the boundary
    safe_password = password_bytes.decode('utf-8', errors='ignore')
    return pwd_context.hash(safe_password)

def verify_password(plain_password, hashed_password):
    return pwd_context.verify(plain_password, hashed_password)

# --- User CRUD ---
def get_user_by_email(db: Session, email: str):
    return db.query(models.User).filter(models.User.email == email).first()

def get_users(db: Session, skip: int = 0, limit: int = 100):
    return db.query(models.User).offset(skip).limit(limit).all()

def get_user(db: Session, user_id: int):
    return db.query(models.User).filter(models.User.id == user_id).first()

def create_user(db: Session, user: schemas.UserCreate):
    hashed_password = get_password_hash(user.password)
    db_user = models.User(email=user.email, full_name=user.full_name, hashed_password=hashed_password)
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user

def update_user(db: Session, db_user: models.User, user_update: schemas.UserUpdate):
    update_data = user_update.model_dump(exclude_unset=True)
    if "password" in update_data:
        update_data["hashed_password"] = get_password_hash(update_data["password"])
        del update_data["password"]
    
    for key, value in update_data.items():
        setattr(db_user, key, value)
    
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user

def update_user_admin(db: Session, db_user: models.User, user_update: schemas.UserAdminUpdate):
    update_data = user_update.model_dump(exclude_unset=True)
    if "password" in update_data:
        update_data["hashed_password"] = get_password_hash(update_data["password"])
        del update_data["password"]
    
    for key, value in update_data.items():
        setattr(db_user, key, value)
    
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user

def delete_user(db: Session, user_id: int):
    user = db.query(models.User).filter(models.User.id == user_id).first()
    if user:
        db.delete(user)
        db.commit()
    return user

# --- Sensor CRUD ---
def create_sensor_reading(db: Session, reading: schemas.SensorReadingCreate):
    db_reading = models.SensorReading(**reading.model_dump())
    db.add(db_reading)
    db.commit()
    db.refresh(db_reading)
    return db_reading

def get_recent_readings(db: Session, limit: int = 100):
    return db.query(models.SensorReading).order_by(models.SensorReading.timestamp.desc()).limit(limit).all()

def get_dashboard_stats(db: Session):
    # Calculate averages
    stats = db.query(
        func.avg(models.SensorReading.temperature).label("avg_temp"),
        func.avg(models.SensorReading.humidity).label("avg_hum"),
        func.count(models.SensorReading.id).label("total")
    ).first()

    # Count distinct active sensors (simple approximation)
    active_count = db.query(models.SensorReading.sensor_id).distinct().count()

    return {
        "avg_temperature": stats.avg_temp if stats.avg_temp else 0.0,
        "avg_humidity": stats.avg_hum if stats.avg_hum else 0.0,
        "total_readings": stats.total if stats.total else 0,
        "active_sensors": active_count
    }

# --- Irrigation CRUD ---
def get_irrigation_zones(db: Session, skip: int = 0, limit: int = 100):
    return db.query(models.IrrigationZone).order_by(models.IrrigationZone.id.asc()).offset(skip).limit(limit).all()

def get_irrigation_zone(db: Session, zone_id: int):
    return db.query(models.IrrigationZone).filter(models.IrrigationZone.id == zone_id).first()

def create_irrigation_zone(db: Session, zone: schemas.IrrigationZoneCreate):
    db_zone = models.IrrigationZone(
        name=zone.name,
        is_pump_active=zone.is_pump_active,
        mode=zone.mode
    )
    db.add(db_zone)
    db.commit()
    db.refresh(db_zone)
    return db_zone

def update_irrigation_zone(db: Session, db_zone: models.IrrigationZone, zone_update: schemas.IrrigationZoneUpdate):
    update_data = zone_update.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        setattr(db_zone, key, value)
    
    db.add(db_zone)
    db.commit()
    db.refresh(db_zone)
    return db_zone

# --- Admin/Message CRUD ---
def update_last_login(db: Session, user_id: int):
    user = db.query(models.User).filter(models.User.id == user_id).first()
    if user:
        user.last_login = datetime.utcnow()
        db.commit()

def create_user_message(db: Session, message: schemas.UserMessageCreate, user_id: int):
    db_message = models.UserMessage(**message.model_dump(), user_id=user_id)
    db.add(db_message)
    db.commit()
    db.refresh(db_message)
    return db_message

def get_messages(db: Session, skip: int = 0, limit: int = 100):
    msgs = db.query(models.UserMessage).order_by(models.UserMessage.created_at.desc()).offset(skip).limit(limit).all()
    # Enrich with user email for convenience
    for m in msgs:
        if m.user: m.user_email = m.user.email
    return msgs

def get_admin_stats(db: Session):
    total_users = db.query(models.User).count()
    
    # Active users in last 24h
    one_day_ago = datetime.utcnow() - timedelta(days=1)
    active_24h = db.query(models.User).filter(models.User.last_login >= one_day_ago).count()
    
    # Inactive users (> 7 days)
    seven_days_ago = datetime.utcnow() - timedelta(days=7)
    # Users who haven't logged in for 7 days OR have never logged in (and created > 7 days ago)
    inactive_7d = db.query(models.User).filter(
        (models.User.last_login < seven_days_ago) | 
        ((models.User.last_login == None) & (models.User.created_at < seven_days_ago))
    ).count()

    return {
        "total_users": total_users,
        "active_users_24h": active_24h,
        "system_uptime": "99.9%", # Placeholder or could be calculated from app start
        "inactive_users_7d": inactive_7d
    }
