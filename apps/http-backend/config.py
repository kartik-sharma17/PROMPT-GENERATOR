from dotenv import load_dotenv
import os

load_dotenv()  # load .env file

class Settings:
    MONGO_URL: str = os.getenv("MONGO_URL")
    DATABASE_NAME: str = os.getenv("DATABASE_NAME")

settings = Settings()
