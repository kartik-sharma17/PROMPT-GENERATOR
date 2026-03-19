from datetime import datetime
from fastapi import Depends, HTTPException
from .getCurrentUser import getCurrentUser
from v1.db.ConnectDB import getDB
from v1.services.subscriptionService import getUserSubscription

async def subscriptionCheck(current_user: dict = Depends(getCurrentUser)):
    try:
        db = getDB()
        today = datetime.utcnow().date().isoformat()

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
        
        subscription = getUserSubscription(userId).subscription
        
        endDate = subscription.get("endDate")
        status = subscription.get("status")

        if status != "active" and endDate < today:
            raise HTTPException(
                status_code=404,
                status= False,
                message="Your plan is expired and not active, please subscribe to move futher",
                data= None
            )
        
        






    except Exception as e:
