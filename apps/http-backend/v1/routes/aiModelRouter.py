from fastapi import APIRouter, Depends
from v1.services import getAiModel, createAiModel
from v1.dependency.getCurrentUser import getCurrentUser
from v1.model.aiModel import aiModel

router = APIRouter(prefix="/model")


@router.get("")
async def getAiModelRouter(current_user: dict = Depends(getCurrentUser)):
    return await getAiModel(current_user)


@router.post("")
async def createAiModelRouter(
    details: aiModel, current_user: dict = Depends(getCurrentUser)
):
    return await createAiModel(details, current_user)
