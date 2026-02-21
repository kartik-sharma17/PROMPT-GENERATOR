from jose import jwt, JWTError, ExpiredSignatureError
from config import settings
from datetime import datetime, timedelta
from v1.schema.authSchema.tokenData import tokenSchema

def GenerateToken(data:tokenSchema, expires_delta=settings.ACCESS_EXPIRE_MINUTES):
    copyData = data.copy()
    expire = datetime.utcnow() + timedelta(minutes=expires_delta)
    copyData["exp"] = expire
    return jwt.encode(copyData, settings.SECRET_KEY, algorithm=settings.ALGORITHM)

async def VerifyToken(token):
    try:
        payload = jwt.decode(
            token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM]
        )
        return {"status": True, "data": payload}

    except ExpiredSignatureError:
        return {
            "status": False,
            "data": "",
            "message": "Token Expired Please Try Again",
        }

    except JWTError:
        return {
            "status": False,
            "data": "",
            "message": "Invalid Token Please Try Again",
        }
