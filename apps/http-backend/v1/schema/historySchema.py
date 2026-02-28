from pydantic import BaseModel, Field
from typing import Literal
from datetime import datetime

class Message(BaseModel):
    historyId: str
    userID: str
    role: Literal["user", "assistant"]
    content: str
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)
    tokensUsed: int
