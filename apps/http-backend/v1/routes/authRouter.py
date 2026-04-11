from fastapi import APIRouter
from v1.services.auth.registerUser import RegisterUser
from v1.services.auth.verifyEmailToken import VerifyEmailTokenService
from v1.services.auth.login import Login
from v1.model.loginModel import LoginInputs
from v1.schema.authSchema.registerUser import registerUser
from v1.services import forgetPassword, forgetPasswordSendLink
from v1.schema import changePasswordSchema

router = APIRouter(prefix="/auth", tags=["auth"])


@router.post("/register")
async def register(user: registerUser):
    return await RegisterUser(user)


@router.get("/verify-email/{token}")
async def verifyEmail(token):
    return await VerifyEmailTokenService(token)


@router.post("/login")
async def login(cred: LoginInputs):
    return await Login(cred)


@router.get("/reset-password-request")
async def resetPasswordRequest(email: str):
    return await forgetPasswordSendLink(email)


@router.post("/reset-password")
async def resetPassword(data: changePasswordSchema):
    return await forgetPassword(data)
