from fastapi import APIRouter
from v1.services.auth.registerUser import RegisterUser
from v1.model.userModel import User
from v1.services.auth.verifyEmailToken import VerifyEmailTokenService
from v1.services.auth.login import Login
from v1.model.loginModel import LoginInputs
from v1.services.aiAgent.core import chatWithAgent
from v1.model.userQuery import UserQuery
from v1.schema.authSchema.registerUser import registerUser

router = APIRouter(prefix="/auth", tags=["v1"])


@router.get("/")
async def welcome():
    return {"jai mata di"}


@router.post("/register")
async def register(user: registerUser):
    return await RegisterUser(user)


@router.get("/verify-email/{token}")
async def verifyEmail(token):
    return await VerifyEmailTokenService(token)


@router.post("/login")
async def login(cred: LoginInputs):
    return await Login(cred)


# for agent
@router.post("/chat")
async def chat(userQuery: UserQuery):
    print("this is a query send by user = ")
    print(userQuery.query)
    return await chatWithAgent(userQuery.query)

