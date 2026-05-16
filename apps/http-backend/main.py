from fastapi import FastAPI
from pydantic import BaseModel
from v1.db.ConnectDB import connectDB
from v1.routes import (
    projectRouter,
    authRouter,
    chatRouter,
    constrainstRouter,
    subscriptionRouter,
    planRouter,
    contactUsRouter,
    aiModelRouter
)
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse


app = FastAPI()

app.include_router(projectRouter.router, prefix="/v1")
app.include_router(authRouter.router, prefix="/v1")
app.include_router(planRouter.router, prefix="/v1")
app.include_router(subscriptionRouter.router, prefix="/v1")
app.include_router(chatRouter.router, prefix="/v1")
app.include_router(constrainstRouter.router, prefix="/v1")
app.include_router(contactUsRouter.router, prefix="/v1")
app.include_router(aiModelRouter.router, prefix="/v1")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000","https://prompt-generator-web-sand.vercel.app","https://www.clarixai.in"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.api_route("/health", methods=["GET", "HEAD"])
async def health_check():
    return JSONResponse(content={"status": "ok"})

@app.get("/test-mail")
async def test_mail():
    import smtplib
    import os
    try:
        with smtplib.SMTP(os.getenv("MAIL_SERVER"), int(os.getenv("MAIL_PORT")), timeout=15) as smtp:
            smtp.ehlo()
            smtp.starttls()
            smtp.login(os.getenv("MAIL_USERNAME"), os.getenv("MAIL_PASSWORD"))
            return {"status": "success", }
    except Exception as e:
        return {"status": "failed", "error ": str(e),}

@app.on_event("startup")
async def startup_event():
    await connectDB()


@app.get("/")
async def welcome():
    return {"This is a api service for Ai prompt generator, jai mata di"}
