from typing import Optional
from pydantic import BaseModel

class verifyPaymentSchema(BaseModel):
    order_id: str 
    payment_id: str 
    signature: str
    razorpayResponse: Optional[dict] = None