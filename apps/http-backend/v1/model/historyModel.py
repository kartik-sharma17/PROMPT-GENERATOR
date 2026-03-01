from typing import Optional
from pydantic import BaseModel, Field
from datetime import datetime

class historyModel(BaseModel):
    userId: str
    title: str
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)
    lastMessage: Optional[str] = None
    lastMessageAt: Optional[str] = None