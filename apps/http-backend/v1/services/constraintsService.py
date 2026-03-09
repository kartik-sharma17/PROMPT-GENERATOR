from fastapi import APIRouter
from v1.utils.response import response
from v1.db.ConnectDB import getDB
from bson import ObjectId
from v1.model.constraintsModel import constraintModel


async def getContraints(current_user):
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

        constraints = await db["constraintModel"].find({}).to_list(length=None)

        data = [
            constraintModel(
                id = str(details.get("_id")),
                name=details.get("name"),
                description=details.get("description"),
                promptDescription=details.get("promptDescription"),
            ).dict() 
            for details in constraints
        ]

        return response(
            message="Successfully retrieved constraints",
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


async def createConstraint(details: constraintModel, current_user):
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

        existingConstraints = await db["constraintModel"].find_one(
            {"name": details.name}
        )

        if existingConstraints:
            return response(
                message=f"constraint Already exist with name: {details.name}",
                code=500,
                status=False,
            )

        newConstraints = constraintModel(
            name=details.name,
            description=details.description,
            promptDescription=details.promptDescription,
        )

        await db["constraintModel"].insert_one(newConstraints.dict())

        return response(
            message="constraint is Successfully added",
            code=201,
        )

    except Exception as e:
        print(f"Unexpected error occurred {str(e)}")
        return response(
            message=f"somethings went wrong, please try again",
            code=500,
            status=False,
        )
