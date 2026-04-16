from fastapi import APIRouter
from v1.utils.response import response
from v1.db.ConnectDB import getDB
from bson import ObjectId
from v1.model import aiModel


async def getAiModel(current_user):
    try:
        db = getDB()

        if current_user.get("message") == "Token Expired Please Try Again":
            return response(
                message="Token expire please try login again",
                code=401,
                status=False,
            )

        userId = current_user.get("data").get("userId")

        userDetails = await db["users"].find_one({"_id": ObjectId(userId)})

        if not userDetails:
            return response(
                message="User not found",
                code=500,
                status=False,
            )

        Models = await db["aiModel"].find({}).to_list(length=None)

        data = [
            aiModel(
                id = str(details.get("_id")),
                name=details.get("name"),
                description=details.get("description"),
                promptDescription=details.get("promptDescription"),
            ).dict() 
            for details in Models
        ]

        return response(
            message="Successfully retrieved AI Model",
            data=data,
            code=200,
        )

    except Exception as e:
        print(f"Unexpected error occurred {str(e)}")
        return response(
            message=f"somethings went wrong, please try again",
            code=500,
            status=False,
        )


async def createAiModel(details: aiModel, current_user):
    try:
        db = getDB()

        if current_user.get("message") == "Token Expired Please Try Again":
            return response(
                message="Token expire please try login again",
                code=500,
                status=False,
            )

        userId = current_user.get("data").get("userId")

        userDetails = await db["users"].find_one({"_id": ObjectId(userId)})

        if not userDetails:
            return response(
                message="User not found",
                code=500,
                status=False,
            )

        existingAiMoodel = await db["aiModel"].find_one(
            {"name": details.name}
        )

        if existingAiMoodel:
            return response(
                message=f"Ai Model Already exist with name: {details.name}",
                code=500,
                status=False,
            )

        newAiModel = aiModel(
            name=details.name,
            description=details.description,
            promptDescription=details.promptDescription,
        )

        await db["aiModel"].insert_one(newAiModel.dict())

        return response(
            message="AI Model Added Successfully",
            code=201,
        )

    except Exception as e:
        print(f"Unexpected error occurred {str(e)}")
        return response(
            message=f"somethings went wrong, please try again",
            code=500,
            status=False,
        )
