from typing import Optional, List
from pydantic import BaseModel, Field
from datetime import datetime


class historyModel(BaseModel):
    userId: str
    title: str
    projectId: Optional[str] = None
    constraints: Optional[List[str]] = Field(default_factory=list)
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)
    lastMessage: Optional[str] = None
    lastMessageAt: Optional[str] = None
