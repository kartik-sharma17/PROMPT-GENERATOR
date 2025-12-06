from fastapi import FastAPI
from pydantic import BaseModel
from v1.db.ConnectDB import connectDB
from v1.routes.route import router

app = FastAPI()

@app.on_event("startup")
async def startup_event():
    await connectDB()

@app.get("/")
def welcome():
    return {"This is a api service for Ai prompt generator"}

app.include_router(router)