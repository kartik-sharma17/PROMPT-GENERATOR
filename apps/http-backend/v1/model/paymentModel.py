from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime


class PaymentModel(BaseModel):
    id: Optional[str] = Field(default=None, alias="_id")
    userId: str
    planId: str
    orderId: str               # Razorpay order_id
    paymentId: Optional[str] = None   # Razorpay payment_id (after success)
    signature: Optional[str] = None  # Razorpay signature
    amount: int                # in INR (not paise)
    razorpayResponse: Optional[dict] = None
    currency: str = "INR"
    status: str = "created"    # created | success | failed 
    method: Optional[str] = None   # card, upi, netbanking (future use)
    createdAt: datetime = Field(default_factory=datetime.utcnow)
    updatedAt: datetime = Field(default_factory=datetime.utcnow)

    class Config:
        populate_by_name = True