from fastapi import APIRouter, Depends
from v1.services import planService

router = APIRouter(prefix="/plans", tags=["subscribe"])

@router.get("")
async def planRouter():
    return await planService.getPlan()
