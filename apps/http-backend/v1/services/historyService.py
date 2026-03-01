from v1.schema.historySchema import historyResponseSchema
from v1.db.ConnectDB import getDB
from v1.utils.response import response
from v1.model.projectInfo import ProjectInfoTable
from bson import ObjectId


async def createHistory(current_user):
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

        existingProject = await db["ProjectInfoTable"].find_one(
            {"projectName": details.projectName}
        )

        if existingProject:
            return response(
                message=f"Project Already exist with name: {details.projectName}",
                code=500,
                status=False,
            )

        newProject = ProjectInfoTable(
            userId=userId,
            projectName=details.projectName,
            projectDescription=details.projectDescription,
            technologiesUsed=details.technologiesUsed,
        )

        await db["ProjectInfoTable"].insert_one(newProject.dict())

        return response(
            message="Project is Successfully added",
            code=201,
        )

    except Exception as e:
        print(f"Unexpected error occurred {str(e)}")
        return response(
            message=f"somethings went wrong, please try again",
            code=500,
            status=False,
        )


async def getHistory(current_user):
    try:
        db = getDB()

        if current_user.get("message") == "Token Expired Please Try Again":
            return response(
                message="Token expire please try login again",
                code=500,
                status=False,
            )

        userId = current_user.get("data").get("userId")

        histories = await (
             db["historyModel"]
            .find({"userId": userId})
            .sort("updated_at", -1)
            .limit(10).to_list(length=10)
        )

        historyResponse = []

        for history in histories:
            create = historyResponseSchema(
                title=history.get("title"),
                historyId=str(history.get("_id")),
                updatedAt=history.get("updated_at").isoformat(),
            )
            historyResponse.append(create.dict())

        return response(
            message="history retrieved successfully",
            data=historyResponse,
            code=201,
        )

    except Exception as e:
        print(f"Unexpected error occurred {str(e)}")
        return response(
            message=f"somethings went wrong, please try again",
            code=500,
            status=False,
        )
