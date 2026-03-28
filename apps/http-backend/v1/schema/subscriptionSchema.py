from typing import Optional
from pydantic import BaseModel

class getSubscriptionSchema(BaseModel):
    planId: Optional[str] = None
    planName: Optional[str] = None
    planPrice: Optional[int] = None
    planDuration: Optional[int] = None
    planDailyLimit: Optional[int] = None
    startDate: Optional[str] = None
    endDate: Optional[str] = None
    isActive: bool
