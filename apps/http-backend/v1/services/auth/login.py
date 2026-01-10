from v1.db.ConnectDB import getDB
from v1.utils.response import response
from v1.utils.passwordHashing.passwordHashing import VerifyPassword
from v1.utils.jwt.jwt import GenerateToken


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

        if VerifyPassword(password, user["password"]):
            token = GenerateToken(
                data={"email": user["email"], "name": user["full_name"]}
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
