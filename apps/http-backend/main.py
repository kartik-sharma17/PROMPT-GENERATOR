from fastapi import FastAPI
from pydantic import BaseModel
from v1.db.ConnectDB import connectDB

app = FastAPI()

@app.on_event("startup")
async def startup_event():
    await connectDB()

@app.get("/")
def initialFun():
    return {"jai mata di"}