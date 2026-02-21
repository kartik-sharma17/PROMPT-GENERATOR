from pydantic import BaseModel, Field
from datetime import datetime

class ProjectInfoTable(BaseModel):
    userId: str
    projectName: str
    projectDescription: str
    technologiesUsed: list[str]
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)