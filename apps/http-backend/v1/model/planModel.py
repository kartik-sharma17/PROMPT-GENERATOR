from typing import List, Optional
from pydantic import BaseModel


class planModel(BaseModel):
    id: Optional[str] = None 
    name: str
    price: int
    duration: int # in months
    dailyLimit: int
    features: Optional[List[str]]
