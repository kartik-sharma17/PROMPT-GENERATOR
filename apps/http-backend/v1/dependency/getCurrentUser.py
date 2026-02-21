from fastapi import Header, HTTPException
from v1.utils.jwt.jwt import VerifyToken


async def getCurrentUser(authorization: str = Header(...)):
    if not authorization.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Invalid token or token format")

    token = authorization.split(" ")[1]
    return await VerifyToken(token)
