from v1.db.ConnectDB import getDB
from datetime import datetime
from bson import ObjectId
from fastapi import HTTPException


async def getUserSubscription(userId: str):
    try:
        db = getDB()
        subscription = await db["SubscriptionModel"].find_one(
            {"userId": userId, "status": "active"}
        )

        if subscription is None:
            raise HTTPException(
                status_code=401,
                detail={
                    "status": False,
                    "message": "No Subscription found for user",
                    "data": None,
                },
            )

        return {
            "status": True,
            "message": "Subscription retrieved successfully",
            "subscription": subscription,
        }
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=404,
            status=False,
            message="Something Went wront while fetching the subscription",
            data=None,
        )


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
                status_code=404,
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
            status_code=404,
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
        return {"status": False, "message": "Something went wrong while updating usage"}
