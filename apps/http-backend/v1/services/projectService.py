from v1.schema.projectInfo.projectInfo import createProject
from v1.db.ConnectDB import getDB
from v1.utils.response import response
from v1.model.projectInfo import ProjectInfoTable
from bson import ObjectId


async def createProjectService(details: createProject, current_user):
    try:
        db = getDB()

        userId = current_user.get("data").get("userId")

        userDetails = await db["users"].find_one({"_id": ObjectId(userId)})

        if not userDetails:
            return response(
                message="User not found",
                code=500,
                status=False,
            )

        userDetails = await db["ProjectInfoTable"].find_one(
            {"projectName": details.projectName}
        )

        if userDetails:
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
