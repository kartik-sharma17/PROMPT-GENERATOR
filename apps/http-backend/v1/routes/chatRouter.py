from fastapi import APIRouter
from v1.services.aiAgent.core import chatWithAgent
from v1.model.userQuery import UserQuery

router = APIRouter(prefix="/chat", tags=["chat"])

# for agent
@router.post("/chat")
async def chat(userQuery: UserQuery):
    print("this is a query send by user = ")
    print(userQuery.query)
    return await chatWithAgent(userQuery.query)