from fastapi import APIRouter, Depends
from v1.schema.projectInfo.projectInfo import createProject, updateProjectParam
from v1.services.projectService import createProjectService, deleteProject, getProject, updateProject
from v1.dependency.getCurrentUser import getCurrentUser

router = APIRouter(prefix="/project", tags=["project"])

@router.post("/create")
async def createProject(
    details: createProject,
    current_user: dict = Depends(getCurrentUser)
    ):
    return await createProjectService(details,current_user)

@router.get("/list")
async def getProjectRouter(
    current_user: dict = Depends(getCurrentUser)
    ):
    return await getProject(current_user)

@router.delete("/delete")
async def deleteProjectRouter(
    projectId: str,
    current_user: dict = Depends(getCurrentUser)
    ):
    return await deleteProject(projectId,current_user)

@router.patch("/update")
async def updateProjectRouter(
    projectDetails: updateProjectParam,
    current_user: dict = Depends(getCurrentUser)
    ):
    return await updateProject(projectDetails,current_user)
