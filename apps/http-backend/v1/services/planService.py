from fastapi import HTTPException
from v1.db.ConnectDB import getDB
from v1.schema import getPlanSchema
from v1.utils.response import response


class planService:
    async def getPlan():
        try:
            db = getDB()

            plans = await db["planModel"].find({}).to_list(length=None)

            responsePlans = [
                getPlanSchema(
                    id=str(plan.get("_id")),
                    name=plan.get("name"),
                    price=plan.get("price"),
                    duration=plan.get("duration"),
                    dailyLimit=plan.get("dailyLimit"),
                ).dict()
                for plan in plans
            ]

            return response(
                message="plan retrived successfully",
                data=responsePlans,
                code=200,
            )

        except Exception as e:
            print(f"something went wrong while retriving plans: {e}")
            raise HTTPException(
                status_code=500,
                detail={
                    "status": False,
                    "message": "Something went wrong while get plans, please try again",
                    "data": None,
                },
            )
