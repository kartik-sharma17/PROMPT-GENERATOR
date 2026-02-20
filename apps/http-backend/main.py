from fastapi import FastAPI
from pydantic import BaseModel
from v1.db.ConnectDB import connectDB
from v1.routes.route import router
from v1.routes import projectRouter
from fastapi.middleware.cors import CORSMiddleware


app = FastAPI()

app.include_router(
    projectRouter.router,
    router,
    prefix="/v1"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.on_event("startup")
async def startup_event():
    await connectDB()


@app.get("/")
def welcome():
    return {"This is a api service for Ai prompt generator"}

