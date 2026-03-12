from optparse import Option
from typing import Literal, Optional
from pydantic import BaseModel, Field
from datetime import date, datetime

class historySchema(BaseModel):
    content: str
    historyId: Optional[str] = None
    role: Literal["user", "assistant"]
    continueChat: bool = False

class historyResponseSchema(BaseModel):
    title: str
    historyId: str
    updatedAt: str

class messagesResponseSchema(BaseModel):
    role: Literal["user", "assistant"]
    content: str
    created_at: str
    tokensUsed: Optional[int] = 0