from fastapi import APIRouter, Depends
from v1.services import constactService
from v1.schema import contactUsSchema

router = APIRouter(prefix="/contactus", tags=["contactus"])

@router.post("")
async def contactUsRouter(data:contactUsSchema):
    return await constactService.contactUsService(data)
