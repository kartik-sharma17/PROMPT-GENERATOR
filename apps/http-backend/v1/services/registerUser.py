from v1.model.userModel import User
from v1.db.ConnectDB import getDB
from v1.utils.response import response
from v1.utils.passwordHashing.passwordHashing import HashPassword
from v1.utils.jwt.jwt import GenerateToken


async def RegisterUser(user: User):
    try:
        db = getDB()
        print("print 0")
        existUser = await db["users"].find_one({"email": user.email})
        print(existUser)
        if existUser is not None:
            if existUser.get("is_verified", False):
                return response(message="User is Already Exist with this Email id")

        newUser = user.dict()
        newUser["password"] = HashPassword(user.password)

        print("print 1")
        print(HashPassword(user.password))

        await db["users"].insert_one(newUser)

        print("print 2")

        token = GenerateToken(data={"email": user.email, "name": user.full_name})

        print(token)
        print("print 3")

        return response(message="Account Created Successfully", data={"token": token})

    except Exception as e:
        print(f"this is a issue {str(e)}")
        return response(
            status=False,
            code=500,
            message="Something went wrong while creating a new account, please try again",
        )
