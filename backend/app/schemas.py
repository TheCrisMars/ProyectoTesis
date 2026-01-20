from pydantic import BaseModel, EmailStr, Field, field_validator
from datetime import datetime
from typing import Optional, List

# --- User Schemas ---
class UserBase(BaseModel):
    email: EmailStr
    full_name: Optional[str] = None

class UserCreate(UserBase):
    password: str = Field(..., min_length=6)
    
    @field_validator('password')
    def validate_password_bytes(cls, v):
        # Truncar la contraseña a 72 bytes si es necesario (límite de bcrypt)
        password_bytes = v.encode('utf-8')
        if len(password_bytes) > 72:
            # Truncar a 72 bytes y decodificar de forma segura
            truncated = password_bytes[:72].decode('utf-8', errors='ignore')
            return truncated
        return v

class User(UserBase):
    id: int
    profile_image_url: Optional[str] = None
    role: str # 'admin' or 'user'
    is_active: bool
    created_at: datetime
    last_login: Optional[datetime] = None

    class Config:
        from_attributes = True

class UserUpdate(BaseModel):
    full_name: Optional[str] = None
    email: Optional[EmailStr] = None
    password: Optional[str] = Field(None, min_length=6)
    
    @field_validator('password')
    def validate_password_bytes(cls, v):
        if v is None: return v
        password_bytes = v.encode('utf-8')
        if len(password_bytes) > 72:
            truncated = password_bytes[:72].decode('utf-8', errors='ignore')
            return truncated
        return v

class UserAdminUpdate(BaseModel):
    full_name: Optional[str] = None
    email: Optional[EmailStr] = None
    password: Optional[str] = Field(None, min_length=6)
    role: Optional[str] = None
    is_active: Optional[bool] = None

    @field_validator('password')
    def validate_password_bytes(cls, v):
        if v is None: return v
        password_bytes = v.encode('utf-8')
        if len(password_bytes) > 72:
            truncated = password_bytes[:72].decode('utf-8', errors='ignore')
            return truncated
        return v

# --- Token Schemas ---
class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    email: Optional[str] = None

# --- Sensor Schemas ---
class SensorReadingBase(BaseModel):
    sensor_id: str
    temperature: float
    humidity: float

class SensorReadingCreate(SensorReadingBase):
    pass

class SensorReading(SensorReadingBase):
    id: int
    timestamp: datetime

    class Config:
        from_attributes = True

# --- Dashboard Stats Schema ---
class DashboardStats(BaseModel):
    avg_temperature: float
    avg_humidity: float
    total_readings: int
    active_sensors: int

# --- Irrigation Schemas ---
class IrrigationZoneBase(BaseModel):
    name: str
    is_pump_active: bool = False
    mode: str = "manual"

class IrrigationZoneCreate(IrrigationZoneBase):
    pass

class IrrigationZoneUpdate(BaseModel):
    name: Optional[str] = None
    is_pump_active: Optional[bool] = None
    mode: Optional[str] = None
    timer_seconds_remaining: Optional[int] = None

class IrrigationZone(IrrigationZoneBase):
    id: int
    last_watered: Optional[datetime] = None
    timer_seconds_remaining: int = 0

    class Config:
        from_attributes = True

# --- User Message Schemas ---
class UserMessageBase(BaseModel):
    subject: str
    message: str

class UserMessageCreate(UserMessageBase):
    pass

class UserMessage(UserMessageBase):
    id: int
    user_id: int
    created_at: datetime
    is_read: bool
    user_email: Optional[EmailStr] = None # For display convenience

    class Config:
        from_attributes = True

# --- Admin Stats Schema ---
class AdminStats(BaseModel):
    total_users: int
    active_users_24h: int
    system_uptime: str
    inactive_users_7d: int
