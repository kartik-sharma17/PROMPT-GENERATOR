from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime


class SubscriptionModel(BaseModel):
    id: Optional[str] = Field(default=None, alias="_id")
    userId: str
    planId: str
    status: str = "active"
    startDate: str = Field(default_factory=datetime.utcnow().date().isoformat())
    endDate: str = None
    createdAt: datetime = Field(default_factory=datetime.utcnow)
    updatedAt: datetime = Field(default_factory=datetime.utcnow)

    class Config:
        populate_by_name = True
