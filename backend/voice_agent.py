import os
import threading
import time
from dotenv import load_dotenv
from elevenlabs.client import ElevenLabs
from elevenlabs.conversational_ai.conversation import Conversation
from elevenlabs.conversational_ai.default_audio_interface import DefaultAudioInterface
import requests

conversation = None  # Global to allow end_call to access it
conversation_lock = threading.Lock()
audio_interface = None  # Global audio interface reference
is_processing_map_query = False  # Lock for map query processing

def needs_map_processing(transcript):
    """Check if the transcript is a real navigation/direction query."""
    transcript_lower = transcript.lower()

    # Stronger map-only phrases
    map_keywords = [
        "directions to", "directions from", "navigate to", "route to",
        "how to get to", "how far is", "how long to drive", "map of",
        "show me directions", "give me directions", "find directions"
    ]

    # Match exact phrases only
    for keyword in map_keywords:
        if keyword in transcript_lower:
            print(f"\n✅ Detected map keyword: {keyword}")
            return True

    # Optional: precise pattern like "from X to Y" ONLY when both are present
    if " from " in transcript_lower and " to " in transcript_lower:
        print("\n✅ Detected 'from X to Y' style phrase.")
        return True

    print("\n❌ Not a map query:", transcript)
    return False

def send_processing_message():
    """Send an early acknowledgment to prevent ElevenLabs timeout."""
    try:
        print("\n⏳ Sending processing acknowledgment...")
        print("Agent: Processing your request, sir. One moment please.")
        return True
    except Exception as e:
        print(f"\n⚠️ Failed to send processing message: {e}")
    return False

def process_map_query(transcript):
    """Process map-related queries through n8n."""
    try:
        print("\n🗣️ Processing map query:", transcript)
        
        # Send early acknowledgment
        send_processing_message()
        
        print("\n📤 Sending to n8n...")
        response = requests.post(
            "http://localhost:5678/webhook/eve-postcall",
            json={"query": transcript},
            timeout=120
        )
        print("\n📤 n8n response status:", response.status_code)
        
        if response.ok:
            result = response.json()
            print("\n📥 n8n response data:", result)
            
            # If we got a list response, take the first item
            if isinstance(result, list):
                result = result[0]
                
            # Always forward n8n response to FastAPI regardless of type
            print("\n📤 Sending response to FastAPI...")
            map_update = requests.post(
                "http://localhost:8000/map-update",
                json={
                    "type": result.get("type", "text"),
                    "mapEmbed": result.get("mapEmbed", None),
                    "reply": result.get("reply", "")
                },
                timeout=30
            )
            print("\n📍 FastAPI update status:", map_update.status_code)
            if map_update.ok:
                print("\n✅ Response successfully stored in FastAPI")
            else:
                print("\n❌ Failed to store response:", map_update.text)
            
            return result
        else:
            print("\n❌ Error response from n8n:", response.text)
            return None
    except Exception as e:
        print("\n❌ Error processing query:", str(e))
        return None
    finally:
        # Always reset the processing lock
        global is_processing_map_query
        is_processing_map_query = False

def handle_transcript(transcript):
    """Handle transcript processing without blocking the voice agent."""
    global is_processing_map_query
    
    print(f"\nYou: {transcript}")
    
    if needs_map_processing(transcript):
        # Check if already processing a map query
        if is_processing_map_query:
            print("\n⚠️ Already processing a map query. Skipping duplicate call.")
            send_processing_message()  # Send acknowledgment even for skipped requests
            return
        
        # Set processing lock
        is_processing_map_query = True
        
        # Process map query in a background thread
        thread = threading.Thread(target=process_map_query, args=(transcript,))
        thread.daemon = True  # Make thread exit when main program exits
        thread.start()
    else:
        print("\n🛑 Not a map query. Skipping n8n call.")

def handle_voice_query(query):
    """Process a voice query and return the response."""
    if needs_map_processing(query):
        print("\n📍 Processing map-related query...")
        return process_map_query(query)
    else:
        print("\n🛑 Not a map query. Letting ElevenLabs handle it...")
        return {"type": "text", "reply": None}

def stop_voice_interaction():
    """Stop voice interaction and cleanup resources."""
    global conversation, audio_interface
    
    with conversation_lock:
        if conversation:
            try:
                if audio_interface:
                    try:
                        audio_interface.stop()
                        audio_interface = None
                    except Exception as e:
                        print(f"Error stopping audio interface: {e}")

                conversation.end_session()
                print("✅ Voice conversation stopped.")
            except Exception as e:
                print(f"Error stopping conversation: {e}")
            finally:
                conversation = None

def start_voice_interaction():
    """Start the voice interaction with ElevenLabs."""
    global conversation, audio_interface
    load_dotenv()

    api_key = os.getenv("ELEVENLABS_API_KEY")
    agent_id = os.getenv("AGENT_ID")

    if not api_key or not agent_id:
        print("Error: Missing API key or agent ID")
        return

    # End any existing conversation
    with conversation_lock:
        if conversation:
            try:
                stop_voice_interaction()
                print("✅ Cleared existing conversation")
            except Exception as e:
                print("❌ Failed to clear existing conversation:", e)

    elevenlabs = ElevenLabs(api_key=api_key)
    audio_interface = DefaultAudioInterface()

    with conversation_lock:
        conversation = Conversation(
            elevenlabs,
            agent_id,
            requires_auth=True,
            audio_interface=audio_interface,
            callback_agent_response=lambda response: print(f"Agent: {response}"),
            callback_user_transcript=handle_transcript
        )

    try:
        print("Starting conversation...")
        conversation.start_session()
    except Exception as e:
        print(f"❌ Voice agent error: {e}")
        stop_voice_interaction()
