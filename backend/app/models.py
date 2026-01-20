from sqlalchemy import Column, Integer, String, Float, DateTime, Boolean, ForeignKey
from sqlalchemy.orm import relationship
from datetime import datetime
from .database import Base

class User(Base):
    __tablename__ = "users"
    __table_args__ = {"schema": "dev"}

    id = Column(Integer, primary_key=True, index=True)
    full_name = Column(String, index=True)
    email = Column(String, unique=True, index=True)
    hashed_password = Column(String)
    profile_image_url = Column(String, nullable=True) # New field
    role = Column(String, default="user") # 'admin' or 'user'
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    last_login = Column(DateTime, nullable=True) # Track user activity

class UserMessage(Base):
    __tablename__ = "user_messages"
    __table_args__ = {"schema": "dev"}

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("dev.users.id"))
    subject = Column(String)
    message = Column(String)
    created_at = Column(DateTime, default=datetime.utcnow)
    is_read = Column(Boolean, default=False)

    user = relationship("User", backref="messages")

class SensorReading(Base):
    __tablename__ = "sensor_readings"
    __table_args__ = {"schema": "dev"}

    id = Column(Integer, primary_key=True, index=True)
    sensor_id = Column(String, index=True) # e.g., "ESP32-001"
    temperature = Column(Float)
    humidity = Column(Float)
    timestamp = Column(DateTime, default=datetime.utcnow)

class IrrigationZone(Base):
    __tablename__ = "irrigation_zones"
    __table_args__ = {"schema": "dev"}

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True) # User editable name (e.g., "Sector Norte")
    is_pump_active = Column(Boolean, default=False)
    mode = Column(String, default="manual") # 'manual' or 'timer'
    last_watered = Column(DateTime, nullable=True)
    timer_seconds_remaining = Column(Integer, default=0) # For tracking active timers
