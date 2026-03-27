from typing import Optional

import razorpay
from config import settings
from datetime import datetime, timedelta
from v1.db.ConnectDB import getDB
from fastapi import HTTPException
from bson import ObjectId
from v1.model.paymentModel import PaymentModel

client = razorpay.Client(auth=(settings.RAZOR_PAY_API_KEY, settings.RAZOR_PAY_SECRET))


async def setupOrder(userId: str, planId: str, updatedPrice: Optional[int] = None):
    try:
        db = getDB()

        if not userId:
            raise HTTPException(
                status_code=400,
                detail={
                    "status": False,
                    "message": "User id not found, please try again",
                    "data": None,
                },
            )

        if not planId:
            raise HTTPException(
                status_code=400,
                detail={
                    "status": False,
                    "message": "Plan id not found, please try again",
                    "data": None,
                },
            )

        plan = await db["planModel"].find_one({"_id": ObjectId(planId)})

        if not plan:
            raise HTTPException(
                status_code=404,
                detail={
                    "status": False,
                    "message": "plan not found",
                    "data": None,
                },
            )

        if updatedPrice is not None:
            price = updatedPrice
        else:
            price = plan.get("price")

        if price is None:
            raise HTTPException(
                status_code=500,
                detail={
                    "status": False,
                    "message": "Invalid plan price",
                    "data": None,
                },
            )

        order = await createPaymentOrder(userId, price, planId)

        payment = PaymentModel(
            userId=userId,
            planId=planId,
            orderId=order["id"],
            amount=price,
            status="created",
            createdAt=datetime.utcnow(),
            updatedAt=datetime.utcnow(),
        )

        await db["payments"].insert_one(payment.dict(by_alias=True))

        return order

    except HTTPException:
        raise
    except Exception as e:
        print(f"Order Error: {e}")
        raise HTTPException(
            status_code=400,
            detail={
                "status": False,
                "message": "Something went wrong while creating the payment order, please try again",
                "data": None,
            },
        )


async def createPaymentOrder(userId: str, amount: int, planId: str):
    # convert ₹ to paise
    paisaAmount = amount * 100

    order = client.order.create(
        {
            "amount": paisaAmount,
            "currency": "INR",
            "receipt": f"user_{userId}_{int(datetime.utcnow().timestamp())}",
            "notes": {"userId": userId, "planId": planId},
        }
    )

    return order


def verifyPayment(order_id, payment_id, signature):

    import hmac
    import hashlib

    body = f"{order_id}|{payment_id}"

    generated_signature = hmac.new(
        bytes(settings.RAZOR_PAY_SECRET, "utf-8"), bytes(body, "utf-8"), hashlib.sha256
    ).hexdigest()

    return generated_signature == signature
