from langchain.tools import BaseTool
from pydantic import BaseModel, Field
from v1.services import incrementUsage
import logging

log = logging.getLogger(__name__)

class UpdateUserUsageArgs(BaseModel):
    userId: str = Field(..., description="ID of the user whose usage should be updated")

class updateUserUsage(BaseTool):
    name: str = "update_usage"
    description: str = "Updates user usage count after every user message."
    args_schema: type[BaseModel] = UpdateUserUsageArgs

    model_config = {
        "arbitrary_types_allowed": True,
        "extra": "allow"
    }

    def _run(self, userId: str):
        # Sync mode not used
        log.warning("updateUserUsage: _run() called but only async is supported")
        return None

    async def _arun(self, userId: str):
        log.info("usage is updated from tool")
        await incrementUsage(userId)
        return True