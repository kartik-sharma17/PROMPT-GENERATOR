from dotenv import load_dotenv
from langgraph.graph import StateGraph, END
from langchain_core.messages import SystemMessage
from langgraph.prebuilt import ToolNode, tools_condition
from langchain_google_genai import ChatGoogleGenerativeAI
from config import settings
from v1.prompt.systemPromptV2 import SYSTEM_PROMPT

from v1.agent.state import AgentState
from v1.agentTool.updateUserUsage import updateUserUsage

load_dotenv()

tools = [updateUserUsage()]

llm = ChatGoogleGenerativeAI(
    model="gemini-2.5-flash", google_api_key=settings.GEMINI_API_KEY, temperature=0
).bind_tools(tools)

tool_node = ToolNode(tools)


async def agent_node(state: AgentState):
    messages = state["messages"]
    userId = state["userId"]

    user_id_message = SystemMessage(
        content=f"The current user's ID is '{userId}'. Use this when calling tools."
    )

    filtered = [
        m for m in messages
        if not (
            m.type == "system" and (
                m.content == SYSTEM_PROMPT.content or
                "The current user's ID is" in m.content
            )
        )
    ]

    messages = [SYSTEM_PROMPT, user_id_message] + filtered

    response = await llm.ainvoke(messages)

    return {"messages": messages + [response]}


builder = StateGraph(AgentState)


builder.add_node("agent", agent_node)
builder.add_node("tools", tool_node)

builder.set_entry_point("agent")

builder.add_conditional_edges("agent", tools_condition)

builder.add_edge("tools", "agent")

graph = builder.compile()
