from v1.db.ConnectDB import getDB
from datetime import datetime
from bson import ObjectId
from fastapi import HTTPException
from v1.model.userSubscriptionModel import SubscriptionModel
from dateutil.relativedelta import relativedelta
from v1.utils.response import response
from v1.payment.paymentService import setupOrder
from v1.payment import paymentService
from v1.schema import verifyPaymentSchema, getSubscriptionSchema


async def getUserSubscription(userId: str):
    try:
        db = getDB()
        subscription = await db["SubscriptionModel"].find_one(
            {"userId": userId, "status": "active"}
        )

        if subscription is None:
            return {
                "status": False,
                "message": "Subscription not found",
                "subscription": None,
            }

        plan = await db["planModel"].find_one(
            {"_id": ObjectId(subscription.get("planId"))}
        )

        if plan is None:
            raise HTTPException(
            status_code=403,
            detail={
                "status": False,
                "message": "Plan not found",
                "data": None,
            },
        )

        subscription = {
            **subscription,
            "planName": plan.get("name") if plan.get("name") else None,
            "planPrice": plan.get("price") if plan.get("price") else None,
            "planDuration": plan.get("duration") if plan.get("duration") else None,
            "plandailyLimit": (
                plan.get("dailyLimit") if plan.get("dailyLimit") else None
            ),
        }

        return {
            "status": True,
            "message": "Subscription retrieved successfully",
            "subscription": subscription,
        }
    
    except Exception:
        raise
    except Exception as e:
        print(f"something went wrong while fetching the subscription, {e}")
        raise HTTPException(
            status_code=403,
            detail={
                "status": False,
                "message": "Something Went wront while fetching the subscription",
                "data": None,
            },
        )


async def getUserSubscriptionDto(current_user):
    userId = current_user.get("data").get("userId")

    subscription = await getUserSubscription(userId)

    if subscription["status"]:
        subscriptionDetails = getSubscriptionSchema(
            planId=subscription["subscription"].get("planId"),
            planName=subscription["subscription"].get("planName"),
            planPrice=subscription["subscription"].get("planPrice"),
            planDuration=subscription["subscription"].get("planDuration"),
            planDailyLimit=subscription["subscription"].get("plandailyLimit"),
            startDate=subscription["subscription"].get("startDate"),
            endDate=subscription["subscription"].get("endDate"),
            isActive=True,
        ).dict()
    else:
        subscriptionDetails = getSubscriptionSchema(isActive=False).dict()

    return response(message="Subscription retrieved Successfully", data=subscriptionDetails)


async def checkUsage(userId: str):
    try:
        db = getDB()
        today = datetime.utcnow().date().isoformat()

        usage = await db["usage"].find_one({"userId": userId, "date": today})

        if not usage:
            return {"status": True, "message": "Usage 0"}

        planId = usage.get("planId")
        if not planId:
            raise HTTPException(
                status_code=404,
                detail={
                    "status": False,
                    "message": "Plan ID not found please try again",
                    "data": None,
                },
            )

        plan = await db["planModel"].find_one({"_id": ObjectId(planId)})

        if plan is None:
            raise HTTPException(
                status_code=404,
                detail={
                    "status": False,
                    "message": "Plan not found please try again",
                    "data": None,
                },
            )

        dailyLimit = plan.get("dailyLimit")

        if dailyLimit is None:
            raise HTTPException(
                status_code=404,
                detail={
                    "status": False,
                    "message": "Limit not found please try again",
                    "data": None,
                },
            )

        if dailyLimit == -1:
            return {"status": True, "message": "Unlimited plan"}

        if usage["promptCount"] < dailyLimit:
            return {"status": True, "message": "Prompt Available"}
        else:
            raise HTTPException(
                status_code=403,
                detail={
                    "status": False,
                    "message": "Limit Reached, please upgrade your plan",
                    "data": None,
                },
            )

    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail={
                "status": False,
                "message": "Something went wrong while checking the usage",
                "data": None,
            },
        )


async def incrementUsage(userId: str):
    try:
        db = getDB()
        today = datetime.utcnow().date().isoformat()

        result = await db["usage"].update_one(
            {"userId": userId, "date": today},
            {"$inc": {"promptCount": 1}, "$set": {"updatedAt": today}},
            upsert=True,
        )

        return {"status": True, "message": "usage updated successfully"}

    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail={
                "status": False,
                "message": "Something went wrong, please try again",
                "data": None,
            },
        )


async def subscribe(current_user, planId: str):
    try:
        db = getDB()

        userId = current_user.get("data").get("userId")

        if not planId:
            raise HTTPException(
                status_code=400,
                detail={
                    "status": False,
                    "message": "PlanId not found, please try again",
                    "data": None,
                },
            )

        plan = await db["planModel"].find_one({"_id": ObjectId(planId)})

        if not plan:
            raise HTTPException(
                status_code=404,
                detail={
                    "status": False,
                    "message": "Plan not found, please try again",
                    "data": None,
                },
            )

        if plan["price"] != 0:
            existing = await getUserSubscription(userId)
            newPlanAmount = plan.get("price")

            if existing["status"]:
                # upgrate case have to find the amount
                subscription = existing["subscription"]
                currentPlanId = subscription.get("planId")
                currentPlan = await db["planModel"].find_one(
                    {"_id": ObjectId(currentPlanId)}
                )
                currentPlanAmount = currentPlan.get("price")

                if currentPlanId == planId:
                    raise HTTPException(
                        status_code=400,
                        detail={
                            "status": False,
                            "message": "you have already subscribed to this plan, please choose another plan to upgrade",
                            "data": None,
                        },
                    )

                # Checking user is not downgrading as downgrading is not allowed
                if newPlanAmount < currentPlanAmount:
                    raise HTTPException(
                        status_code=400,
                        detail={
                            "status": False,
                            "message": "You can't downGrade your, plan will automatically downgrade to trail once expired",
                            "data": None,
                        },
                    )

                currentPlanDuration = currentPlan.get("duration")
                currentPlanEndDate = datetime.fromisoformat(subscription.get("endDate"))
                perDayAmount = currentPlanAmount / (
                    (currentPlanDuration * 30) if (currentPlanDuration * 30) != 0 else 1
                )
                leftDays = max(0, (currentPlanEndDate - datetime.utcnow()).days)
                finalPrice = max(0, int(newPlanAmount - (leftDays * perDayAmount)))

                order = await setupOrder(userId, planId, updatedPrice=finalPrice)
                return response(code=200, status=True, data=order)

            else:
                # normal case
                print("this is running")
                order = await setupOrder(userId, planId)
                return response(code=200, status=True, data=order)

        else:
            return await createSubscription(userId, planId, plan)

    except HTTPException:
        raise
    except Exception as e:
        print(f"something went wrong: {e}")
        raise HTTPException(
            status_code=500,
            detail={
                "status": False,
                "message": "Something went wrong while subscription, please try again",
                "data": None,
            },
        )


async def createSubscription(userId, planId, plan):
    try:
        db = getDB()

        existing = await getUserSubscription(userId)

        duration = plan.get("duration")
        start_date = datetime.utcnow()
        expiry_date = start_date + relativedelta(months=duration)

        if existing["status"]:
            subscription = existing["subscription"]
            existingPlan = await db["planModel"].find_one(
                {"_id": ObjectId(subscription.get("planId"))}
            )

            if subscription.get("planId") == planId:
                raise HTTPException(
                    status_code=404,
                    detail={
                        "status": False,
                        "message": "Already Subscribe to this plan, please choose another plan to upgrade",
                        "data": None,
                    },
                )

            if existingPlan.get("price") > plan.get("price"):
                raise HTTPException(
                    status_code=500,
                    detail={
                        "status": False,
                        "message": "degrade plan is not allowed, free plan will be automatically activated one paid plan period is over",
                        "data": None,
                    },
                )

            await db["SubscriptionModel"].update_one(
                {"userId": userId},
                {
                    "$set": {
                        "planId": planId,
                        "status": "active",
                        "startDate": datetime.utcnow().isoformat(),
                        "endDate": expiry_date.isoformat(),
                        "updatedAt": datetime.utcnow().isoformat(),
                    }
                },
                upsert=True,
            )

            return response(
                message="Congratulation, your plan is upgarded now",
                code=200,
                status=True,
            )

        newSubscription = SubscriptionModel(
            userId=userId,
            planId=str(plan.get("_id")),
            status="active",
            endDate=expiry_date.isoformat(),
            startDate=datetime.utcnow().isoformat(),
        )

        await db["SubscriptionModel"].insert_one(newSubscription.dict())

        return response(
            message="Congratulation, your plan is active now",
            code=201,
            status=True,
        )
    except HTTPException:
        raise
    except Exception as e:
        print(f"Order Error: {e}")
        raise HTTPException(
            status_code=500,
            detail={
                "status": False,
                "message": "Something went wrong while subscription, please try again",
                "data": None,
            },
        )


async def verifyPaymentAndSubscribe(data: verifyPaymentSchema, current_user):
    try:
        db = getDB()

        userId = current_user.get("data").get("userId")

        payment = await db["PaymentModel"].find_one(
            {"userId": userId, "orderId": (data.razorpay_order_id).strip()}
        )

        if payment is None:
            raise HTTPException(
                status_code=404,
                detail={
                    "status": False,
                    "message": "Something went wrong, Transaction not found, please contact the support team in case amount is deducted from your account",
                    "data": None,
                },
            )

        if data.razorpayResponse:
            await db["PaymentModel"].update_one(
                {"userId": userId, "orderId": data.razorpay_order_id},
                {"$set": {"razorpayResponse": data.razorpayResponse}},
            )

        if payment.get("status") == "success":
            raise HTTPException(
                status_code=400,
                detail={
                    "status": False,
                    "message": "Payment already verified",
                    "data": None,
                },
            )

        if not paymentService.verifyPayment(
            data.razorpay_order_id, data.razorpay_payment_id, data.razorpay_signature
        ):
            raise HTTPException(
                status_code=400,
                detail={
                    "status": False,
                    "message": "Something went wrong, payment is not verified, please contact the support team in case amount is deducted from your account",
                    "data": None,
                },
            )

        planId = payment.get("planId")

        plan = await db["planModel"].find_one({"_id": ObjectId(planId)})

        if not plan:
            raise HTTPException(
                status_code=404,
                detail={
                    "status": False,
                    "message": "Plan not found, please try again",
                    "data": None,
                },
            )

        await db["PaymentModel"].update_one(
            {"orderId": data.razorpay_order_id},
            {"$set": {"paymentId": data.razorpay_payment_id, "status": "success"}},
        )

        return await createSubscription(userId, planId, plan)
    except HTTPException:
        raise
    except Exception as e:
        print(f"Order Error: {e}")
        raise HTTPException(
            status_code=500,
            detail={
                "status": False,
                "message": "Something went wrong while subscription, please try again",
                "data": None,
            },
        )
