from typing import Optional
from pydantic import BaseModel


class planModel(BaseModel):
    id: Optional[str] = None 
    name: str
    price: int
    dailyLimit: int
