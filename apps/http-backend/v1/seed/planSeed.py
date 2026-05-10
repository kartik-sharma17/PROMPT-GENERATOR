from v1.db.ConnectDB import getDB, connectDB
from v1.model.planModel import planModel
import asyncio

PLANS = [
    # ── Monthly plans ─────────────────────────────────────────────────────────
    planModel(
        name="Free",
        price=0,
        duration=1,
        dailyLimit=2,
        features=[
            "2 AI-generated prompts per day",
            "Advanced prompt optimization",
            "Access to the Base AI model",
            "Basic usage analytics",
            "Core platform features included",
            "No expiration period",
        ],
    ),
    planModel(
        name="Pro",
        price=50,
        duration=1,
        dailyLimit=7,
        features=[
            "7 AI-generated prompts per day",
            "1 month full access",
            "Advanced AI prompt optimization",
            "Access to upcoming AI models",
            "Priority customer support",
            "Faster prompt generation",
            "Enhanced prompt quality & accuracy",
            "Access to all core features",
        ],
    ),
    planModel(
        name="Premium",
        price=150,
        duration=1,
        dailyLimit=25,
        features=[
            "25 AI-generated prompts per day",
            "1 month premium access",
            "Advanced AI prompt optimization",
            "Access to all AI models (including upcoming releases)",
            "Dedicated priority support",
            "Early access to new features",
            "Improved response performance",
            "Premium feature access"
        ],
    ),

    # ── Annual plans ──────────────────────────────────────────────────────────
    planModel(
        name="Pro Annual",
        price=540,
        duration=12,
        dailyLimit=7,
        features=[
            "7 AI-generated prompts per day",
            "12 months full access",
            "Advanced AI prompt optimization",
            "Access to upcoming AI models",
            "Priority customer support",
            "Faster prompt generation",
            "Enhanced prompt quality & accuracy",
            "Access to all core features",
        ],
    ),
    planModel(
        name="Premium Annual",
        price=1560,
        duration=12,
        dailyLimit=25,
        features=[
            "25 AI-generated prompts per day",
            "12 months premium access",
            "Advanced AI prompt optimization",
            "Access to all AI models (including upcoming releases)",
            "Dedicated priority support",
            "Early access to new features",
            "Improved response performance",
            "Premium feature access"
        ],
    ),
]


async def seedPlans():
    try:
        await connectDB()
        db = getDB()
        collection = db["planModel"]

        inserted, updated = 0, 0

        for plan in PLANS:
            # Match on name + duration so different durations of the same
            # plan name are treated as separate documents.
            filter_query = {"name": plan.name, "duration": plan.duration}

            update_data = {k: v for k, v in plan.dict(exclude={"id"}).items() if v is not None}

            result = await collection.update_one(
                filter_query,
                {"$set": update_data},
                upsert=True,
            )

            if result.upserted_id:
                print(f"  [INSERTED] {plan.name} ({plan.duration}m) → {result.upserted_id}")
                inserted += 1
            elif result.modified_count:
                print(f"  [UPDATED]  {plan.name} ({plan.duration}m)")
                updated += 1
            else:
                print(f"  [SKIPPED]  {plan.name} ({plan.duration}m) — no changes detected")

        print(f"\nDone: {inserted} inserted, {updated} updated.")

    except Exception as e:
        print(f"Unexpected error occurred: {str(e)}")
        raise


if __name__ == "__main__":
    asyncio.run(seedPlans())