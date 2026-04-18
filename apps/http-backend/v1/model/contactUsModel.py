from typing import Optional, List
from pydantic import BaseModel, Field
from datetime import datetime


class contactUsModel(BaseModel):
    full_name: str
    have_account: bool
    account_email: Optional[str] = None
    description: str
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)
