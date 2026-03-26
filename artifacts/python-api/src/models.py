from pydantic import BaseModel
from typing import Optional

class BookingCreate(BaseModel):
    name: str
    phone: str
    address: str
    service: str
    date: str

class ListingCreate(BaseModel):
    title: str
    type: str
    price: float
    location: str
    contact: str
    description: Optional[str] = None
    imageUrl: Optional[str] = None

class VendorSubmitInput(BaseModel):
    name: str
    phone: str
    submissionType: str
    serviceCategory: Optional[str] = None
    serviceDescription: Optional[str] = None
    roomTitle: Optional[str] = None
    roomPrice: Optional[float] = None
    roomLocation: Optional[str] = None
    roomType: Optional[str] = None

class SiteConfigUpdate(BaseModel):
    phone: Optional[str] = None
    whatsapp: Optional[str] = None
    location: Optional[str] = None
    tagline: Optional[str] = None

class ServiceCreate(BaseModel):
    category: str
    name: str

class PasswordVerify(BaseModel):
    password: str

class PasswordChange(BaseModel):
    currentPassword: str
    newPassword: str
