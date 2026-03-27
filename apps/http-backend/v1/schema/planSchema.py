from typing import Optional
from pydantic import BaseModel

class getPlanSchema(BaseModel):
    id: Optional[str] = None 
    name: str
    price: int
    duration: int # in months
    dailyLimit: int
