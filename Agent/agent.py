# ========== Import Modules ==========
from langchain.chat_models import init_chat_model
from langchain_core.messages import HumanMessage, SystemMessage
from langchain_community.tools import DuckDuckGoSearchRun

from langgraph.prebuilt import create_react_agent
from tools import geocode_address_tool, get_traffic_status_tool, get_weather_tool, get_current_time_tool

# ========== Configuration ==========
LLM_NAME = "qwen-qwq-32b"
VECTOR_STORE_DIR = "./chroma_db"
COLLECTION_NAME = "agent_collection"

# ========== Initialize Components ==========

# Initialize LLM
llm = init_chat_model(LLM_NAME, model_provider="groq")

search_tool = DuckDuckGoSearchRun()
tools = [search_tool, geocode_address_tool, get_traffic_status_tool, get_weather_tool, get_current_time_tool]
agent_model = create_react_agent(llm, tools)

# ========== Querry ==========
def query_llm(prompt: str) -> str:
    """Helper for sending a user message to the model with a system prompt."""
    system_prompt = (
        "You are a smart and multilingual assistant for answering user questions in VietNamese traffic infomation. "
        "Depending on the question, you may:\n\n"
        "1. Answer immediately if you already know the answer.\n"
        "2. Depending on user's question, you need to use suitable tool or combine tools to answer\n\n"
        "You must:\n"
        "- Answer using Vietnamese language\n"
        "- Provide a detailed answer, using a maximum of 2000 sentences.\n"
        "- If none of the sources provide sufficient data, explain that and give the best possible answer based on general knowledge."
    )

    response = agent_model.invoke({
        "messages": [
            SystemMessage(content=system_prompt),
            HumanMessage(content=prompt)
        ]
    })

    return response['messages'][-1].content
