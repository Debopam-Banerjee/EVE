from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional, Dict
import voice_agent
import text_agent
import quiet_agent

app = FastAPI()

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class MessageRequest(BaseModel):
    query: str
    intent: Optional[str] = None
    useVoice: Optional[bool] = False
    apiKeys: Optional[Dict[str, str]] = None

@app.post("/voice-agent")
async def handle_voice_query(request: MessageRequest):
    """Handle voice agent queries with map support"""
    try:
        # Only process if it's a map query
        response = voice_agent.handle_voice_query(request.query)
        if response and response.get("reply") is not None:
            return response
        # If no response or reply is None, let ElevenLabs handle it
        return {"type": "text", "reply": None}
    except Exception as e:
        print(f"Error in voice agent: {str(e)}")
        return {"error": "Failed to process voice query"}

@app.post("/text-agent")
async def handle_text_query(request: MessageRequest):
    """Handle text agent queries"""
    try:
        response = text_agent.handle_text_agent_interaction(request.query)
        return response
    except Exception as e:
        print(f"Error in text agent: {str(e)}")
        return {"error": "Failed to process text query"}

@app.post("/quiet-agent")
async def handle_quiet_query(request: MessageRequest):
    """Handle quiet agent queries"""
    try:
        response = quiet_agent.start_quiet_interaction(request.query)
        return response
    except Exception as e:
        print(f"Error in quiet agent: {str(e)}")
        return {"error": "Failed to process quiet query"}

@app.post("/start-voice")
async def start_voice():
    """Start voice conversation"""
    try:
        voice_agent.start_voice_interaction()
        return {"status": "started"}
    except Exception as e:
        print(f"Error starting voice: {str(e)}")
        return {"error": "Failed to start voice interaction"}

@app.post("/end-call")
async def end_call():
    """End voice conversation"""
    try:
        voice_agent.stop_voice_interaction()
        return {"status": "ended"}
    except Exception as e:
        print(f"Error ending call: {str(e)}")
        return {"error": "Failed to end call"} 