# new main.py
from fastapi import FastAPI, Request, BackgroundTasks
from fastapi.middleware.cors import CORSMiddleware
from quiet_agent import start_quiet_interaction
from text_agent import handle_text_agent_interaction
from voice_agent import start_voice_interaction, stop_voice_interaction
from pydantic import BaseModel
import os
from openai import OpenAI
import requests
from dotenv import load_dotenv
import uvicorn
import asyncio
from typing import Optional

load_dotenv()
OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")
WEBHOOK_URL = "http://localhost:5678/webhook/eve-postcall"
client = OpenAI(api_key=OPENAI_API_KEY)

app = FastAPI()
server_instance = None

# Store the latest map data
latest_map_data = None

# Store server state
server_running = False

# Store background tasks
background_tasks = set()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class QuietAgentPayload(BaseModel):
    query: str
    intent: str = "general"
    useVoice: bool = False
    apiKeys: dict = {}

class TextAgentPayload(BaseModel):
    query: str
    intent: str = "general"
    useVoice: bool = True
    apiKeys: dict = {}

class VoiceQueryPayload(BaseModel):
    query: str

class MapUpdatePayload(BaseModel):
    type: str
    mapEmbed: Optional[str] = None
    reply: str

@app.post("/quiet-agent")
async def quiet_agent(payload: QuietAgentPayload):
    print("quiet-agent called with:", payload.dict())

    try:
        response = requests.post(WEBHOOK_URL, json={"query": payload.query}, timeout=60)
        if response.ok:
            data = response.json()
            print("n8n response:", data)  # Debug log
            # Return all fields from n8n response
            return data
    except Exception as e:
        print("❌ Failed to send to n8n:", e)

    try:
        response = client.chat.completions.create(
            model="gpt-4o",
            messages=[{"role": "user", "content": payload.query}]
        )
        reply = response.choices[0].message.content.strip()  # type: ignore
        return {"reply": reply}
    except Exception as e:
        print("❌ OpenAI Error:", e)
        return {"error": "I am having trouble thinking right now"}

@app.post("/text-agent")
async def text_agent(payload: TextAgentPayload):
    print("text-agent called with:", payload.dict())
    query = payload.query

    if not query:
        return {"error": "Missing query"}

    result = handle_text_agent_interaction(query)
    print("text-agent response:", result)  # Debug log
    return result

@app.post("/start-voice")
async def start_voice(request: Request):
    try:
        start_voice_interaction()
        return {"reply": "Voice interaction started"}
    except Exception as e:
        print("❌ Failed to start voice interaction:", e)
        return {"error": "Could not start voice interaction"}

@app.post("/end-call")
async def end_call():
    try:
        global latest_map_data, server_running
        
        # First stop the voice interaction
        stop_voice_interaction()
        
        # Clear map data
        latest_map_data = None
        server_running = False
        
        # Cancel any running background tasks
        for task in background_tasks:
            try:
                task.cancel()
            except:
                pass
        background_tasks.clear()
        
        # Force cleanup of any remaining resources
        import gc
        gc.collect()
        
        return {"reply": "Call ended"}
    except Exception as e:
        print("❌ Failed to stop conversation:", e)
        return {"error": "Could not stop call"}

@app.post("/clear-map")
async def clear_map():
    """Clear the stored map data"""
    global latest_map_data
    latest_map_data = None
    return {"status": "ok"}

@app.post("/voice-query")
async def voice_query(payload: VoiceQueryPayload, background_tasks: BackgroundTasks):
    """Handle voice queries and return responses including maps"""
    global latest_map_data
    
    print("\n📥 Voice query received:", payload.query)
    try:
        print("\n🔗 Sending to webhook:", WEBHOOK_URL)
        # Send to n8n for processing
        response = requests.post(WEBHOOK_URL, json={"query": payload.query}, timeout=120)
        print("\n📤 Webhook response status:", response.status_code)
        
        if not response.ok:
            print("\n❌ Webhook error:", response.text)
            return {"type": "error", "reply": "Failed to process voice query"}
            
        # Get response data
        data = response.json()
        print("\n📥 Webhook response data:", data)
        
        # Handle array response
        result = data[0] if isinstance(data, list) and len(data) > 0 else data
        
        # Handle map response
        if isinstance(result, dict):
            if result.get("type") == "map" and result.get("mapEmbed"):
                latest_map_data = {
                    "type": "map",
                    "mapEmbed": result["mapEmbed"],
                    "reply": result.get("reply", "")
                }
                print("\n💾 Stored map data:", latest_map_data)
                return latest_map_data
            
        return result
    except Exception as e:
        print("\n❌ Error handling voice query:", str(e))
        return {"type": "error", "reply": "Failed to process voice query"}

@app.post("/map-update")
async def update_map(payload: MapUpdatePayload):
    """Store response data from n8n"""
    global latest_map_data
    print("\n📍 Received response update:", payload)
    
    latest_map_data = {
        "type": payload.type,
        "mapEmbed": payload.mapEmbed,
        "reply": payload.reply
    }
    print("\n💾 Stored response data:", latest_map_data)
    return {"status": "ok"}

@app.get("/map-status")
async def get_map_status():
    """Get latest map data"""
    global latest_map_data
    print("\n🔍 Map status request, current data:", latest_map_data)
    return latest_map_data if latest_map_data else {"type": "none"}

def start_server():
    global server_running
    server_running = True
    config = uvicorn.Config(
        app, 
        host="127.0.0.1", 
        port=8000,
        timeout_keep_alive=120,  # Increase keepalive timeout
        timeout_notify=30,       # Time to notify before timeout
        timeout_graceful_shutdown=30  # Time for graceful shutdown
    )
    server = uvicorn.Server(config)
    return server.serve()

if __name__ == "__main__":
    import asyncio
    asyncio.run(start_server())

