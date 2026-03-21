from datetime import datetime
from email.policy import default
from fastapi import Depends, HTTPException
from .getCurrentUser import getCurrentUser
from v1.db.ConnectDB import getDB
from v1.services.subscriptionService import checkUsage, getUserSubscription


async def subscriptionCheck(current_user: dict = Depends(getCurrentUser)):
    try:
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

        if status != "active":
            raise HTTPException(
                status_code=403,
                detail={
                    "status": False,
                    "message": "Your plan is not active, please subscribe to move futher",
                    "data": None,
                },
            )

        if endDate:
            end_date_obj = datetime.fromisoformat(endDate)
            today_obj = datetime.utcnow()

            if status != "active" or end_date_obj < today_obj:
                raise HTTPException(
                    status_code=403,
                    detail={
                        "status": False,
                        "message": "Your plan is expired and not active, please subscribe to move futher",
                        "data": None,
                    },
                )
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
