from fastapi import APIRouter, Depends
from v1.services import subscribe, verifyPaymentAndSubscribe
from v1.dependency import getCurrentUser
from v1.schema import verifyPaymentSchema


router = APIRouter(prefix="/subscribe", tags=["subscribe"])


@router.get("")
async def subscribeRouter(planId: str, currentUser: dict = Depends(getCurrentUser)):
    return await subscribe(currentUser, planId)

@router.get("/verify-payment")
async def verifyPaymentRouter(data: verifyPaymentSchema, currentUser: dict = Depends(getCurrentUser)):
    return await verifyPaymentAndSubscribe(currentUser, planId)
