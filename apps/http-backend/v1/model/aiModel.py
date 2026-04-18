from typing import Optional

from pydantic import BaseModel

class aiModel(BaseModel):
    id: Optional[str] = None
    name: str
    description: str
    promptDescription: str