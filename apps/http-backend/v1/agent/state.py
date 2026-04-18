from langgraph.graph import MessagesState
from typing import Optional

class AgentState(MessagesState):
    userId: Optional[str] = None