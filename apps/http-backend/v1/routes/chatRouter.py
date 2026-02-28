from fastapi import APIRouter, Depends
from v1.services.aiAgent.core import chatWithAgent
from v1.model.userQuery import UserQuery
from v1.dependency.historyDependency import manageHistory
from v1.schema.historySchema import historySchema

router = APIRouter(prefix="/chat", tags=["chat"])


# for agent
@router.post("")
async def chat(history: dict = Depends(manageHistory)):
    return await chatWithAgent(history)