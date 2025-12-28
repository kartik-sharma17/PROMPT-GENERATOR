from v1.agent.core import graph
from langchain_core.messages import HumanMessage
from v1.utils.response import response


async def chatWithAgent(userQuery):
    try:
        result = graph.invoke({"messages": [HumanMessage(content=userQuery)]})

        print(f"Reponse from the ai = {result}")

        ai_response = result["messages"][-1].text

        return response(data={"reply": ai_response}, message="Response from AI Model")

    except Exception as e:
        print(f"somethings went wrong = {e}")
        return response(
            status=False,
            code=500,
            message="somethings went wrong, please try again later",
        )
