from pydantic import BaseModel, Field
from datetime import datetime
from v1.schema.historySchema import Message

class historyModel(BaseModel):
    userId: str
    title: str
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)
    lastMessage: str
    lastMessageAt: str