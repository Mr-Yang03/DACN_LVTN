
from pydantic import BaseModel, Field
from typing import Optional

class UserBase(BaseModel):
    full_name: str
    date_of_birth: str
    phone_number: str
    license_number: str
    account_id: Optional[str] = Field(default=None, description="Mongo ObjectId as string")

class UserCreate(UserBase):
    pass

class UserUpdate(UserBase):
    pass

class PasswordResetRequest(BaseModel):
    new_password: str
