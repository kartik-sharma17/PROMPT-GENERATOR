from v1.db.ConnectDB import getDB, connectDB
from v1.model.planModel import planModel
import asyncio

async def insertPlan():
    try:
        await connectDB()
        db = getDB()

        plans = [
            planModel(name="Free", price=0, dailyLimit= 2).dict(),
            planModel(name="Basic", price=50, dailyLimit= 10).dict(),
            planModel(name="Advance", price=150, dailyLimit= -1).dict(),
        ]

        result = await db["planModel"].insert_many(plans)

        print("Inserted IDs:", result.inserted_ids)

    except Exception as e:
        print(f"Unexpected error occurred {str(e)}")


if __name__ == "__main__":
    asyncio.run(insertPlan())