from dotenv import load_dotenv
from langgraph.graph import StateGraph, END
from langgraph.prebuilt import ToolNode, tools_condition
from langchain_google_genai import ChatGoogleGenerativeAI
from config import settings
from v1.prompt.systemPrompt import SYSTEM_PROMPT

from v1.agent.state import AgentState
from v1.agentTool.example import get_weather

load_dotenv()

tools = [get_weather]

llm = ChatGoogleGenerativeAI(
    model="gemini-2.5-flash",
    google_api_key=settings.GEMINI_API_KEY,
    temperature=0
).bind_tools(tools)

tool_node = ToolNode(tools)

def agent_node(state: AgentState):
    messages = state["messages"]

    if not any(msg.type == "system" for msg in messages):
        messages = [SYSTEM_PROMPT] + messages

    response = llm.invoke(messages)

    return {
        "messages": messages + [response]
    }

builder = StateGraph(AgentState)

builder.add_node("agent", agent_node)
builder.add_node("tools", tool_node)

builder.set_entry_point("agent")

builder.add_conditional_edges(
    "agent",
    tools_condition
)

builder.add_edge("tools", "agent")

graph = builder.compile()
