from v1.model.userModel import User
from v1.db.ConnectDB import getDB
from v1.utils.response import response
from v1.utils.passwordHashing.passwordHashing import HashPassword
from v1.utils.emailVerifyToken.emailVerifyToken import GenerateEmailVerifyToken


async def RegisterUser(user: User):
    try:
        db = getDB()
        existUser = await db["users"].find_one({"email": user.email})
        if existUser is not None:
            if existUser.get("is_verified", False):
                return response(message="User is Already Exist with this Email id")
            else:
                verificationToken = GenerateEmailVerifyToken(user.email)
                # send vai mail to user.
                print("this is a verification token", verificationToken)

        newUser = user.dict()
        newUser["password"] = HashPassword(user.password)
        await db["users"].insert_one(newUser)

        verificationToken = GenerateEmailVerifyToken(user.email)
        return response(
            message="Verication link is successfully sended to your email ID"
        )

    except Exception as e:
        print(f"this is a issue {str(e)}")
        return response(
            status=False,
            code=500,
            message="Something went wrong while creating a new account, please try again",
        )
