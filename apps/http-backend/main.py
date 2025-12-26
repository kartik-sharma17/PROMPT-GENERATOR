from fastapi import FastAPI
from pydantic import BaseModel
from v1.db.ConnectDB import connectDB
from v1.routes.route import router
from langchain_core.messages import HumanMessage
from v1.agent.core import graph


app = FastAPI()

@app.on_event("startup")
async def startup_event():
    await connectDB()

@app.get("/")
def welcome():
    return {"This is a api service for Ai prompt generator"}


@app.get("/chat")
def chatWithAgent():
    result = graph.invoke({
        "messages": [
            HumanMessage(content="What is the weather in Mumbai?")
        ]
    })

    ai_response = result["messages"][-1].content

    return {
        "response": ai_response
    }

app.include_router(router)



