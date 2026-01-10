from passlib.context import CryptContext
import hashlib

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


def HashPassword(password: str)-> str:
    hashed = hashlib.sha256(password.encode("utf-8")).hexdigest()
    return pwd_context.hash(hashed)


def VerifyPassword(plainPass: str, hashPass: str):
    return pwd_context.verify(plainPass, hashPass)
