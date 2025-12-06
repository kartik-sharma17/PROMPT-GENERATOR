from dotenv import load_dotenv
import os

load_dotenv()  # load .env file

class Settings:
    MONGO_URL: str = os.getenv("MONGO_URL")
    DATABASE_NAME: str = os.getenv("DATABASE_NAME")
    ACCESS_EXPIRE_MINUTES: str = os.getenv("DATABASE_NAME")
    SECRET_KEY: str = os.getenv("SECRET_KEY")
    ALGORITHM: str = os.getenv("ALGORITHM")
    EMAIL_TOKEN_EXPIRE_MINUTES: str = os.getenv("EMAIL_TOKEN_EXPIRE_MINUTES")

settings = Settings()
