from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime, date


class UsageModel(BaseModel):
    id: Optional[str] = Field(default=None, alias="_id")
    userId: str
    planId: str
    date: str
    promptCount: int = 0
    createdAt: datetime = Field(default_factory=datetime.utcnow)
    updatedAt: datetime = Field(default_factory=datetime.utcnow)

    class Config:
        populate_by_name = True
