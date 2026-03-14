from pydantic import BaseModel

class constraintModel(BaseModel):
    id: str
    name: str
    description: str
    promptDescription: str