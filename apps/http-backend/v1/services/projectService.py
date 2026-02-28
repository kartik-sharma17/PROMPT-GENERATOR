from v1.schema.projectInfo.projectInfo import createProject, updateProjectParam
from v1.db.ConnectDB import getDB
from v1.utils.response import response
from v1.model.projectInfo import ProjectInfoTable
from bson import ObjectId


async def createProjectService(details: createProject, current_user):
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


async def getProject(current_user):
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

        projects = (
            await db["ProjectInfoTable"].find({"userId": userId}).to_list(length=None)
        )

        projectList = []

        for project in projects:
            projectList.append(
                {
                    "projectId": str(project.get("_id")),
                    "projectName": project.get("projectName"),
                    "projectDescription": project.get("projectDescription"),
                    "technologiesUsed": project.get("technologiesUsed"),
                }
            )

        return response(
            message="Successfully retrieved projects",
            data=projectList,
            code=200,
        )

    except Exception as e:
        print(f"Unexpected error occurred {str(e)}")
        return response(
            message=f"somethings went wrong, please try again",
            code=500,
            status=False,
        )


async def deleteProject(projectId, current_user):
    try:
        db = getDB()

        project = await db["ProjectInfoTable"].find_one({"_id": ObjectId(projectId)})

        if not project:
            return response(
                message="Project Not Found",
                code=500,
                status=False,
            )

        await db["ProjectInfoTable"].delete_one({"_id": ObjectId(projectId)})

        return response(
            message="project deleted successfully",
            code=200,
        )

    except Exception as e:
        print(f"Unexpected error occurred {str(e)}")
        return response(
            message=f"somethings went wrong, please try again",
            code=500,
            status=False,
        )


async def updateProject(projectDetails: updateProjectParam, current_user):
    try:
        db = getDB()

        print(projectDetails)

        projectId = projectDetails.projectId

        project = await db["ProjectInfoTable"].find_one(
            {
                "_id": ObjectId(projectId),
                "userId": current_user.get("data").get("userId")
            }
        )

        if not project:
            return response(
                message="Project Not Found",
                code=500,
                status=False,
            )

        await db["ProjectInfoTable"].update_one(
            {"_id": ObjectId(projectId)},
            {
                "$set": {
                    "projectName": projectDetails.projectName,
                    "projectDescription": projectDetails.projectDescription,
                    "technologiesUsed": projectDetails.technologiesUsed,
                }
            },
        )

        return response(
            message="project Updated successfully",
            code=200,
        )

    except Exception as e:
        print(f"Unexpected error occurred {str(e)}")
        return response(
            message=f"somethings went wrong, please try again",
            code=500,
            status=False,
        )
