from dotenv import load_dotenv
from langgraph.graph import StateGraph, END
from langgraph.prebuilt import ToolNode
from langchain_google_genai import ChatGoogleGenerativeAI
from config import settings

from v1.agent.state import AgentState
from v1.agentTool.example import get_weather

load_dotenv()

llm = ChatGoogleGenerativeAI(
    model="gemini-1.5-flash",
    google_api_key=settings.GEMINI_API_KEY,
    temperature=0
    )

tools = [get_weather]

tool_node = ToolNode(tools)

def agent_node(state: AgentState):
    response = llm.invoke(state["messages"])
    return {
        "messages": state["messages"] + [response]
    }

builder = StateGraph(AgentState)

builder.add_node("agent", agent_node)
builder.add_node("tools", tool_node)

builder.set_entry_point("agent")

builder.add_edge("agent", "tools")
builder.add_edge("tools", "agent")

graph = builder.compile()
