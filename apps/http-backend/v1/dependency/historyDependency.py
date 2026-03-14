from v1.schema.historySchema import historySchema
from v1.model import messageModel, historyModel
from .getCurrentUser import getCurrentUser
from v1.utils.response import response
from v1.db.ConnectDB import getDB
from bson import ObjectId
from datetime import datetime
from fastapi import Depends


async def manageHistory(
    body: historySchema, current_user: dict = Depends(getCurrentUser)
):
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

        if body.historyId:

            existingHistory = await db["historyModel"].find_one(
                {"_id": ObjectId(body.historyId), "userId": userId}
            )

            if existingHistory is None:
                return {
                    "message": "Chat not found, please start a new chat",
                    "code": 500,
                    "status": False,
                }

            newMessage = messageModel.Message(
                historyId=body.historyId,
                userID=userId,
                role=body.role,
                content=body.content,
            )

            await db["Message"].insert_one(newMessage.dict())

            await db["historyModel"].update_one(
                {"_id": ObjectId(body.historyId)},
                {"$set": {"updatedAt": datetime.utcnow()}},
            )

            return {
                "status": True,
                "historyId": body.historyId,
                "current_user": current_user,
                "content": body.content,
                "continueChat": body.continueChat
            }

        else:
            title = " ".join(body.content.split()[:3])

            newHistory = historyModel.historyModel(
                userId=userId,
                title=title,
            )

            createdHistory = await db["historyModel"].insert_one(newHistory.dict())

            newMessage = messageModel.Message(
                historyId=str(createdHistory.inserted_id),
                userID=userId,
                role=body.role,
                content=body.content,
            )

            await db["Message"].insert_one(newMessage.dict())

            return {
                "status": True,
                "historyId": str(createdHistory.inserted_id),
                "current_user": current_user,
                "content": body.content,
                "continueChat": body.continueChat
            }

    except Exception as e:
        print(f"Unexpected error occurred {str(e)}")
        return {"status": False, "current_user": current_user, "content": body.content}
