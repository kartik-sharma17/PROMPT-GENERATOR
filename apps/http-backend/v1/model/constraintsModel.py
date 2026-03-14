from pydantic import BaseModel

class constraintModel(BaseModel):
    name: str
    description: str
    promptDescription: str