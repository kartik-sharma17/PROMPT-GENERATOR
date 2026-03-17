from typing import Optional

from pydantic import BaseModel

class constraintModel(BaseModel):
    id: Optional[str]
    name: str
    description: str
    promptDescription: str