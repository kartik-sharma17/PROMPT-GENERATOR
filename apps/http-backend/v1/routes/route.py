from fastapi import APIRouter
from v1.services.registerUser import RegisterUser
from v1.model.userModel import User

router = APIRouter(prefix="/v1", tags=["v1"])


@router.get("/")
async def welcome():
    return {"jai mata di"}


@router.post("/register")
async def register(user: User):
    return await RegisterUser(user)
