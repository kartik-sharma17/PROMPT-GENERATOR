from datetime import datetime
from fastapi import Depends, HTTPException
from .getCurrentUser import getCurrentUser
from v1.db.ConnectDB import getDB
from v1.services.subscriptionService import (
    checkUsage,
    createSubscription,
    getUserSubscription,
)
from bson import ObjectId
import logging

log = logging.getLogger(__name__)


async def subscriptionCheck(current_user: dict = Depends(getCurrentUser)):
    try:
        db = getDB()

        if current_user.get("message") == "Token Expired Please Try Again":
            return {
                "message": "Token expire please try login again",
                "code": 500,
                "status": False,
            }

        userId = current_user.get("data").get("userId")

        if userId is None:
            return {
                "message": "User not found",
                "code": 500,
                "status": False,
            }

        subscription_res = await getUserSubscription(userId)
        subscription = subscription_res["subscription"]

        endDate = subscription.get("endDate")
        status = subscription.get("status")

        if endDate:
            end_date_obj = datetime.fromisoformat(endDate)
            today_obj = datetime.utcnow()

            if end_date_obj < today_obj:
                result = await db["SubscriptionModel"].update_one(
                    {"_id": ObjectId(subscription.get("_id")), "status": "active"},
                    {"$set": {"status": "expired"}},
                )

                if result.modified_count == 1:
                    free_plan = await db["planModel"].find_one({"price": 0})

                    if free_plan is None:
                        raise HTTPException(
                            status_code=403,
                            detail={
                                "status": False,
                                "message": "No free plan exist, please subscribe to paid plain to continue",
                                "data": None,
                            },
                        )

                    log.info("old subscription is expired, downgrading to free one")
                    await createSubscription(userId, free_plan.get("_id"), free_plan)

        else:
            raise HTTPException(
                status_code=403,
                detail={
                    "status": False,
                    "message": "plan expiry not found, please try again.",
                    "data": None,
                },
            )

        await checkUsage(userId)

        return True

    except HTTPException:
        raise
    except Exception as e:
        print(f"something went wrong, {e}")
        raise HTTPException(
            status_code=500,
            detail={
                "status": False,
                "message": "Something went wrong, please try again",
                "data": None,
            },
        )
