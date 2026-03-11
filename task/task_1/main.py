import os
from dotenv import load_dotenv
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from langchain_groq import ChatGroq
from langchain_core.tools import tool
from langgraph.prebuilt import create_react_agent

# 1. Load the API key from .env
load_dotenv()

app = FastAPI()

# 2. Enable CORS so React (port 3000) can talk to FastAPI (port 8000)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 3. Define the 5 REQUIRED tools
@tool
def log_interaction(hcp_name: str, notes: str):
    """Log a new interaction with a Healthcare Professional."""
    return f"Successfully logged interaction for {hcp_name}: {notes}"

@tool
def edit_interaction(interaction_id: str, new_notes: str):
    """Edit an existing interaction record using its ID."""
    return f"Updated interaction {interaction_id} with new notes: {new_notes}"

@tool
def get_hcp_details(hcp_name: str):
    """Retrieve details about a specific doctor's specialty and location."""
    return f"Dr. {hcp_name} is a Lead Specialist located at the Central Medical Hub."

@tool
def check_product_inventory(product_name: str):
    """Check if a specific medicine sample (e.g., Aspirin) is in stock."""
    return f"Inventory Check: {product_name} is currently in stock (45 units available)."

@tool
def schedule_followup(hcp_name: str, date: str):
    """Schedule a follow-up meeting with a specific HCP."""
    return f"Calendar Updated: Meeting scheduled with {hcp_name} for {date}."

# 4. Setup the AI Agent (Llama 3.1 is the replacement for Gemma 2)
tools = [log_interaction, edit_interaction, get_hcp_details, check_product_inventory, schedule_followup]
model = ChatGroq(model="llama-3.1-8b-instant") # i m using this model from groq ai

# This creates the agent executor that handles the "Thought -> Action -> Observation" loop
agent_executor = create_react_agent(model, tools)

# 5. Define Request Schema
class ChatRequest(BaseModel):
    message: str

# 6. Optimized Chat Endpoint
@app.post("/chat")
async def chat_with_agent(request: ChatRequest):
    try:
        # We invoke the agent. It will automatically run the tools if needed.
        response = agent_executor.invoke({
            "messages": [("user", request.message)]
        })
        
        # The agent returns a list of messages. 
        # The last message is the final human-readable answer after tool execution.
        final_answer = response["messages"][-1].content
        
        return {"reply": final_answer}
    
    except Exception as e:
        print(f"Error: {e}")
        return {"reply": "I encountered an error while processing your request. Please check if the API key is valid."}

if __name__ == "__main__":
    import uvicorn
    # Run the server
    uvicorn.run(app, host="0.0.0.0", port=8000)