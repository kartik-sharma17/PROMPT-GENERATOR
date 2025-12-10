from fastapi import APIRouter
from v1.services.auth.registerUser import RegisterUser
from v1.model.userModel import User
from v1.services.auth.verifyEmailToken import VerifyEmailTokenService

router = APIRouter(prefix="/v1", tags=["v1"])


@router.get("/")
async def welcome():
    return {"jai mata di"}


@router.post("/register")
async def register(user: User):
    return await RegisterUser(user)


@router.get("/verify-email/{token}")
async def verifyEmail(token):
    return await VerifyEmailTokenService(token)
