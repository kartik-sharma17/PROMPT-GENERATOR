from jose import jwt, JWTError, ExpiredSignatureError
from config import settings
from datetime import datetime, timedelta


async def GenerateToken(data, expires_delta=settings.ACCESS_EXPIRE_MINUTES):
    expire = datetime.utcnow() + timedelta(minutes=expires_delta)
    data["exp"] = expire
    return jwt.encode(data, settings.SECRET_KEY, algorithm=settings.ALGORITHM)


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
