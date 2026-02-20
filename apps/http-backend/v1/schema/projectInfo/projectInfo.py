from pydantic import BaseModel

class createProject(BaseModel):
    projectName: str
    projectDescription: str
    technologiesUsed: list[str]