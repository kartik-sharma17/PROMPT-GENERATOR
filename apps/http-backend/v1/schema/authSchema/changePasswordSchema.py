from pydantic import BaseModel

class changePasswordSchema(BaseModel):
    newPassword: str
    token: str