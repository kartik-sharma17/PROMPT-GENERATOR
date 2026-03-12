from v1.agent.core import graph
from langchain_core.messages import HumanMessage, AIMessage
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
            historyId = history.get("historyId")

            if not userId:
                return response(
                    message="User not found",
                    code=500,
                    status=False,
                )
            
            if historyId is None:
                return {
                    "message": "Chat not found, please start a new chat",
                    "code": 500,
                    "status": False,
                }
            
            chat_messages = []

            messages = await (db["Message"].find({"historyId": historyId, "userID": userId}).sort("created_at", -1).to_list(length=30))
            
            messages.reverse()
            
            for msg in messages:
                if msg["role"] == "user":
                    chat_messages.append(HumanMessage(content=msg["content"]))
                else:
                    chat_messages.append(AIMessage(content=msg["content"]))

            chat_messages.append(HumanMessage(content=content))

            result = graph.invoke({"messages": chat_messages})

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
