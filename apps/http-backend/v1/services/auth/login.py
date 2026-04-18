from v1.db.ConnectDB import getDB
from v1.utils.response import response
from v1.utils.passwordHashing.passwordHashing import VerifyPassword
from v1.utils.jwt.jwt import GenerateToken
from v1.services import getUserSubscription
from v1.schema import getSubscriptionSchema


async def Login(cred):
    try:
        db = getDB()

        email = cred.email
        password = cred.password

        if not email:
            return response(message="please Enter Email ID", code=400, status=False)

        if not password:
            return response(message="please Enter Password ID", code=400, status=False)

        user = await db["users"].find_one({"email": cred.email})

        if user is None:
            return response(
                message="No account associate with this email ID, please check your email ID or sign up",
                code=404,
                status=False,
            )

        if user.get("is_verified") is False:
            return response(
                message="No account associate with this email ID, please check your email ID or sign up",
                code=404,
                status=False,
            )

        if VerifyPassword(password, user["password"]):
            token = GenerateToken(
                data={
                    "email": user["email"],
                    "userName": user["full_name"],
                    "userId": str(user["_id"]),
                }
            )

            subscription = await getUserSubscription(str(user["_id"]))

            if subscription["status"]:
                subscriptionDetails = getSubscriptionSchema(
                    planId=subscription["subscription"].get("planId"),
                    planName=subscription["subscription"].get("planName"),
                    planPrice=subscription["subscription"].get("planPrice"),
                    planDuration=subscription["subscription"].get("planDuration"),
                    planDailyLimit=subscription["subscription"].get("plandailyLimit"),
                    startDate=subscription["subscription"].get("startDate"),
                    endDate=subscription["subscription"].get("endDate"),
                    isActive=True,
                ).dict()
            else:
                subscriptionDetails = getSubscriptionSchema(isActive=False).dict()

            return response(
                message="Login Successfully",
                data={
                    "token": token,
                    "name": user["full_name"],
                    "email": user["email"],
                    "subscriptionDetails": subscriptionDetails,
                    "last_login": user["last_login"],
                },
            )
        else:
            return response(
                message="Wrong password, please check your password and try again",
                code=401,
                status=False,
            )

    except Exception as e:
        print(f"something went wrong {e}")
        return response(
            message="Somthing went wrong, please try again",
            code=500,
            status=False,
        )
