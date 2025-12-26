from langchain.tools import tool

@tool
def get_weather(city: str) -> str:
    """Get weather information for a city"""
    return f"The weather in {city} is sunny 🌤️"
