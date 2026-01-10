from v1.utils.emailVerifyToken.emailVerifyToken import VerifyEmailToken
from v1.utils.response import response
from v1.db.ConnectDB import getDB
from v1.utils.jwt.jwt import GenerateToken


async def VerifyEmailTokenService(token):
    db = getDB()
    result = await VerifyEmailToken(token)

    if result["status"]:

        email = result["data"]["sub"]

        user = await db["users"].find_one({"email": email})

        if not user:
            return response(message="User not found", status=False, code=404)

        await db["users"].update_one({"email": email}, {"$set": {"is_verified": True}})

        access_token = GenerateToken(
            {"email": email, "name": user.get("full_name", "")}
        )

        return response(
            message="Login Successfully",
            data={
                "token": token,
                "name": user["full_name"],
                "email": user["email"],
                "last_login": user["last_login"],
            },
        )

    else:
        print("somethings went wrong, please try again {e}")
        return response(message=result["message"], code=401, status=False)
