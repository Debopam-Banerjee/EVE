import os
import requests
import threading
from dotenv import load_dotenv
from elevenlabs.client import ElevenLabs
from elevenlabs import play
from openai import OpenAI
import base64

# Load environment variables
load_dotenv()
openai_client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))
elevenlabs_client = ElevenLabs(api_key=os.getenv("ELEVENLABS_API_KEY"))
voice_id = os.getenv("ELEVEN_VOICE_ID")
webhook_url = "your_n8n_webhook_url"

def play_in_background(audio_bytes):
    """Play audio in a background thread."""
    try:
        print("🔊 Playing audio response...")
        play(audio_bytes)
        print("✅ Audio playback completed")
    except Exception as e:
        print("❌ Audio playback error:", str(e))

def detect_intent(text):
    return {"intent": "general", "query": text}

def send_to_n8n(payload):
    """Send request to n8n and handle the response."""
    try:
        print("\n🌐 Sending to n8n webhook:", webhook_url)
        print("📤 Payload:", payload)
        
        response = requests.post(
            webhook_url,
            json=payload,
            timeout=30,
            headers={"Content-Type": "application/json"}
        )
        
        print(f"\n📥 n8n response status: {response.status_code}")
        print(f"📥 n8n response headers: {dict(response.headers)}")
        
        if response.status_code == 200:
            try:
                data = response.json()
                if isinstance(data, list) and len(data) > 0:
                    data = data[0]  # Take first item if array response
                print("\n✅ n8n response data:", data)
                return data
            except Exception as e:
                print(f"\n❌ Failed to parse n8n JSON response: {str(e)}")
                print(f"Raw response text: {response.text[:500]}")  # Print first 500 chars
                return {}
        else:
            print(f"\n⚠️ n8n error response (status {response.status_code}):")
            print(f"Error response: {response.text[:500]}")  # Print first 500 chars
            return {}
    except requests.exceptions.Timeout:
        print("\n⚠️ n8n request timed out after 30 seconds")
        return {}
    except requests.exceptions.ConnectionError:
        print("\n❌ Failed to connect to n8n webhook")
        return {}
    except Exception as e:
        print(f"\n❌ Unexpected error sending to n8n: {str(e)}")
        return {}

def handle_text_agent_interaction(query: str):
    """
    Handle text agent interactions with audio and maps.
    For text agent, maps appear in messages, not floating window.
    """
    try:
        # First try n8n for all queries to get better responses
        print("\n🌐 Attempting n8n request for query:", query)
        response_data = send_to_n8n({"query": query})
        
        # Check if we got a valid response from n8n
        if response_data and isinstance(response_data, dict):
            print("\n✅ Got n8n response:", response_data)
            
            # Handle map responses
            if isinstance(response_data, dict) and "mapEmbed" in response_data:
                print("\n🗺️ Map response detected")
                reply_text = str(response_data.get("reply") or "Here are your directions.")
                final_response = {
                    "reply": reply_text,
                    "type": "map",
                    "mapEmbed": response_data["mapEmbed"],
                    "audio": ""
                }
            else:
                # Handle regular text responses from n8n
                print("\n💬 Regular text response from n8n")
                reply_text = ""
                if isinstance(response_data, dict):
                    reply_text = str(response_data.get("reply") or response_data.get("text") or "")
                final_response = {
                    "reply": reply_text,
                    "type": "text",
                    "audio": ""
                }
            
            # Generate audio if we have a valid reply
            if reply_text:
                try:
                    if not voice_id:
                        raise ValueError("No voice_id configured")
                    
                    print("\n🎤 Generating audio for response...")
                    raw_audio = elevenlabs_client.text_to_speech.convert(
                        text=reply_text,
                        voice_id=voice_id,
                        model_id="eleven_multilingual_v2",
                        output_format="mp3_44100_128"
                    )
                    # Store audio in response
                    audio_bytes = b"".join(raw_audio)
                    final_response["audio"] = base64.b64encode(audio_bytes).decode("utf-8")
                    print("✅ Audio generated successfully")
                    
                    # Start audio playback in background
                    threading.Thread(
                        target=play_in_background,
                        args=(audio_bytes,),
                        daemon=True
                    ).start()
                except Exception as e:
                    print("❌ TTS error:", str(e))
                    final_response["audio"] = ""
            
            print("\n📤 Final response:", {
                "type": final_response["type"],
                "has_map": "mapEmbed" in final_response,
                "has_audio": bool(final_response["audio"]),
                "reply_length": len(final_response["reply"])
            })
            
            return final_response
            
        # Fallback to GPT-4 if n8n fails or returns empty
        print("\n⚠️ No valid n8n response, falling back to GPT-4")
        response = openai_client.chat.completions.create(
            model="gpt-4",
            messages=[
                {"role": "system", "content": "You are Eve, a helpful AI assistant. Provide detailed, natural responses. Avoid generic phrases like 'Here's a quick answer'."},
                {"role": "user", "content": query}
            ]
        )
        reply = response.choices[0].message.content or ""

        final_response = {
            "reply": reply,
            "type": "text",
            "audio": ""
        }

        try:
            if not voice_id:
                raise ValueError("No voice_id configured")
            
            print("\n🎤 Generating audio for GPT-4 response...")
            raw_audio = elevenlabs_client.text_to_speech.convert(
                text=reply,
                voice_id=voice_id,
                model_id="eleven_multilingual_v2",
                output_format="mp3_44100_128"
            )
            # Store audio in response
            audio_bytes = b"".join(raw_audio)
            final_response["audio"] = base64.b64encode(audio_bytes).decode("utf-8")
            print("✅ Audio generated successfully")
            
            # Start audio playback in background
            threading.Thread(
                target=play_in_background,
                args=(audio_bytes,),
                daemon=True
            ).start()
        except Exception as e:
            print("❌ TTS error:", str(e))
            final_response["audio"] = ""

        print("\n📤 Final response:", {
            "type": final_response["type"],
            "has_audio": bool(final_response["audio"]),
            "reply_length": len(final_response["reply"])
        })
        
        return final_response

    except Exception as e:
        print("❌ Error in text agent interaction:", str(e))
        return {"error": "I am having trouble processing your request"}

def start_text_interaction():
    print("\n💬 Text-to-Speech Interaction Mode (w/ n8n). Type 'exit' to quit\n")
    while True:
        user_input = input("You: ")
        if user_input.lower() in ['exit', 'quit']:
            print("👋 Exiting text interaction.")
            break

        reply = handle_text_agent_interaction(user_input)
        print("🤖 Assistant:", reply)
