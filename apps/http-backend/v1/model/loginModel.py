from pydantic import BaseModel, EmailStr

class LoginInputs(BaseModel):
    email: EmailStr
    password: str