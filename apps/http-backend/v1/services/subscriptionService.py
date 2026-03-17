from v1.db.ConnectDB import getDB
from datetime import datetime


async def getUserPlan(userId: str):
    db = getDB()
    subscription = await db["SubscriptionModel"].find_one(
        {"userId": userId, "status": "active"}
    )

    return subscription


async def checkUsage(userId: str, daily_limit: int):
    db = getDB()
    today = datetime.utcnow().date().isoformat()

    usage = await db["usage"].find_one({"userId": userId, "date": today})

    if not usage:
        return True

    if daily_limit == -1:
        return True

    return usage["promptCount"] < daily_limit


async def incrementUsage(userId: str):
    db = getDB()

    today = datetime.utcnow().date().isoformat()

    await db["usage"].update_one(
        {"userId": userId, "date": today}, {"$inc": {"promptCount": 1}}, upsert=True
    )
