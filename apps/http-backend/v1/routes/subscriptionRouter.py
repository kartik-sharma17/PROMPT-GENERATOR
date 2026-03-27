from fastapi import APIRouter, Depends
from v1.services import subscribe, verifyPaymentAndSubscribe
from v1.dependency import getCurrentUser
from v1.schema import verifyPaymentSchema


router = APIRouter(prefix="/subscribe", tags=["subscribe"])


@router.get("")
async def subscribeRouter(planId: str, current_user: dict = Depends(getCurrentUser)):
    return await subscribe(current_user, planId)

@router.post("/verify-payment")
async def verifyPaymentRouter(data: verifyPaymentSchema, currentUser: dict = Depends(getCurrentUser)):
    return await verifyPaymentAndSubscribe(data,currentUser)
