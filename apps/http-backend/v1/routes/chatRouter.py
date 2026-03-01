from fastapi import APIRouter, Depends
from v1.services.aiAgent.core import chatWithAgent
from v1.services.historyService import getHistory
from v1.dependency.historyDependency import manageHistory
from v1.dependency.getCurrentUser import getCurrentUser

router = APIRouter(prefix="/chat", tags=["chat"])


# for agent
@router.post("")
async def chat(history: dict = Depends(manageHistory)):
    return await chatWithAgent(history)


@router.get("/history")
async def historyRoute(current_user: dict = Depends(getCurrentUser)):
    return await getHistory(current_user)