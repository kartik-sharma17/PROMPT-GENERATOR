from v1.agent.core import graph
from langchain_core.messages import HumanMessage
from v1.utils.response import response
from v1.db.ConnectDB import getDB
from v1.model import messageModel
from datetime import datetime
from bson import ObjectId


async def chatWithAgent(history: dict):
    try:
        db = getDB()

        if history.get("status"):

            content = history.get("content")
            userId = history.get("current_user").get("data").get("userId")

            if not userId:
                return response(
                    message="User not found",
                    code=500,
                    status=False,
                )

            result = graph.invoke({"messages": [HumanMessage(content=content)]})

            ai_response = result["messages"][-1].text

            historyId = history.get("historyId")

            if historyId is None:
                return response(
                    message="Chat not found, please start a new chat",
                    code=500,
                    status=False,
                )

            newMessage = messageModel.Message(
                historyId=historyId,
                userID=userId,
                role="assistant",
                content=ai_response,
            )

            await db["Message"].insert_one(newMessage.dict())

            await db["historyModel"].update_one(
                {"_id": ObjectId(historyId)},
                {"$set": {"updatedAt": datetime.utcnow()}},
            )

            return response(
                data={"reply": ai_response, "historyId": historyId},
                message="Response from AI Model",
            )

        else:
            return response(
                status=False,
                code=500,
                message=history.get("message"),
            )

    except Exception as e:
        print(f"somethings went wrong = {e}")
        return response(
            status=False,
            code=500,
            message="somethings went wrong, please try again later",
        )
