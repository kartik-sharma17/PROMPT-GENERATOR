from fastapi import APIRouter, Depends
from v1.services.constraintsService import createConstraint, getContraints
from v1.dependency.getCurrentUser import getCurrentUser
from v1.model.constraintsModel import constraintModel

router = APIRouter(prefix="/constraint")


@router.get("")
async def getConstraintsRouter(current_user: dict = Depends(getCurrentUser)):
    return await getContraints(current_user)


@router.post("")
async def createConstraintsRouter(
    details: constraintModel, current_user: dict = Depends(getCurrentUser)
):
    return await createConstraint(details, current_user)
