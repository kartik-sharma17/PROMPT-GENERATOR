from fastapi import APIRouter

router = APIRouter(prefix="/v1", tags=["v1"])


@router.get("/")
async def welcome():
    return {"jai mata di"}
