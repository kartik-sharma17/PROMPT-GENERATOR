from fastapi import APIRouter, Depends
from v1.schema.projectInfo.projectInfo import createProject
from v1.services.projectService import createProjectService, getPorject
from v1.dependency.getCurrentUser import getCurrentUser

router = APIRouter(prefix="/project", tags=["project"])

@router.post("/create")
async def createProject(
    details: createProject,
    current_user: dict = Depends(getCurrentUser)
    ):
    return await createProjectService(details,current_user)

@router.get("/list")
async def createProject(
    current_user: dict = Depends(getCurrentUser)
    ):
    return await getPorject(current_user)
