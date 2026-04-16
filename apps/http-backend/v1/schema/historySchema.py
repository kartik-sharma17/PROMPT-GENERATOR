from optparse import Option
from typing import List, Literal, Optional
from pydantic import BaseModel, Field
from datetime import date, datetime

class historySchema(BaseModel):
    content: str
    historyId: Optional[str] = None
    projectId: Optional[str] = None
    constraints: Optional[List[str]] = []
    modelId: Optional[str] = None
    modelName: Optional[str] = None
    role: Literal["user", "assistant"]
    continueChat: bool = False

class historyResponseSchema(BaseModel):
    historyId: str
    title: str
    updatedAt: str
    projectId: Optional[str] = None
    modelId: Optional[str] = None
    constraints: Optional[List[str]] = []

class messagesResponseSchema(BaseModel):
    role: Literal["user", "assistant"]
    content: str
    created_at: str
    tokensUsed: Optional[int] = 0