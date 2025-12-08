from v1.utils.emailVerifyToken.emailVerifyToken import VerifyEmailToken
from v1.utils.response import response
from v1.db.ConnectDB import db
from v1.utils.jwt.jwt import GenerateToken


async def VerifyEmailToken(token):
        result = VerifyEmailToken(token)

        if result[status]:
                user = await db["users"].find_one({email:result[data[email]]})
                user[is_verified] = True
                await db["users"].save(user)
                token = GenerateToken("data":{"email": user.email, "name": full_name})
                response(message="somethings went wrong, please try again")

        print("somethings went wrong, please try again {e}")
        return response(message="somethings went wrong, please try again")