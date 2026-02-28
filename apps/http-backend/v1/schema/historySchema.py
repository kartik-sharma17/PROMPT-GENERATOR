from typing import Literal, Optional
from pydantic import BaseModel, Field
from datetime import datetime

class historySchema(BaseModel):
    content: str
    historyId: Optional[str] = None
    role: Literal["user", "assistant"]