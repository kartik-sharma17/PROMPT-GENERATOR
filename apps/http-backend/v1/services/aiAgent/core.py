from v1.agent.core import graph
from langchain_core.messages import HumanMessage, AIMessage, SystemMessage
from v1.utils.response import response
from v1.db.ConnectDB import getDB
from v1.model import messageModel
from datetime import datetime
from bson import ObjectId
from v1.services.subscriptionService import incrementUsage
import logging

logging.basicConfig(level=logging.INFO)
log = logging.getLogger(__name__)


async def chatWithAgent(history: dict):
    try:
        db = getDB()

        if history.get("status"):

            content = history.get("content")
            userId = history.get("current_user").get("data").get("userId")
            historyId = history.get("historyId")
            projectId = history.get("projectId")
            constraints = history.get("constraints")
            modelId = history.get("modelId")
            modelName = history.get("modelName")

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

            messages = await (
                db["Message"]
                .find({"historyId": historyId, "userID": userId})
                .sort("created_at", -1)
                .to_list(length=30)
            )

            if projectId:
                projectDetails = await db["ProjectInfoTable"].find_one(
                    {"_id": ObjectId(projectId)}
                )
                if projectDetails is None:
                    return response(
                        message="Project not found, please try again",
                        code=500,
                        status=False,
                    )

                projectPrompt = f"""
                        Use the following project details when generate prompt.

                        Project Name: {projectDetails.get("projectName")}
                        Project Description: {projectDetails.get("projectDescription")}
                        Technologies Used: {projectDetails.get("technologiesUsed", "Not defined")}
                    """
                chat_messages.append(SystemMessage(content=projectPrompt))

                log.info(f"{projectDetails.get('projectName')}project included")

            if modelId:
                modelDetails = await db["aiModel"].find_one(
                    {"_id": ObjectId(modelId)}
                )
                if modelDetails is None:
                    return response(
                        message="AI Model not found, please try again",
                        code=500,
                        status=False,
                    )

                aiModelPrompt = f"""
                        Generate the prompt for {modelDetails.get("name")}
                    """
                chat_messages.append(SystemMessage(content=aiModelPrompt))

                log.info(f"{modelDetails.get("name")}Model included")

            if modelName:
                aiModelPrompt = f"""
                        Generate the prompt for {modelName}
                    """
                chat_messages.append(SystemMessage(content=aiModelPrompt))

                log.info(f"{modelName} Model included")

            if constraints:
                constraint_ids = [ObjectId(id) for id in constraints]
                constraintsDetails = (
                    await db["constraintModel"]
                    .find({"_id": {"$in": constraint_ids}})
                    .to_list(length=None)
                )

                if constraintsDetails is None:
                    return response(
                        message="Constraints not found, please try again",
                        code=500,
                        status=False,
                    )

                constraintDescription = "\n".join(
                        f"- {constraint.get('promptDescription')}"
                        for constraint in constraintsDetails
                    )

                constraintsPrompt = f"""
                        add the following constraints while generating the prompt.
                        {constraintDescription}
                    """

                chat_messages.append(SystemMessage(content=constraintsPrompt))
                log.info(f"Contraints added")

            messages.reverse()

            for msg in messages:
                if msg["role"] == "user":
                    chat_messages.append(HumanMessage(content=msg["content"]))
                else:
                    chat_messages.append(AIMessage(content=msg["content"]))

            chat_messages.append(HumanMessage(content=content))

            result = await graph.ainvoke({"messages": chat_messages, "userId": userId})

            ai_response = result["messages"][-1].text

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
