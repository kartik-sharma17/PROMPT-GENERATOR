from fastApi import APIRouter
from v1.schema.projectInfo.projectInfo import createProject
from v1.services.projectService import createProjectService

router = APIRouter(prefix="/project", tags=["project"])

@router.post("/create")
async def createProject(createProject):
    return createProjectService(createProject)

