import os
import requests
from openai import OpenAI
from dotenv import load_dotenv

# Load environment variables
load_dotenv()
api_key = os.getenv("OPENAI_API_KEY")
webhook_url = "http://localhost:5678/webhook/eve-postcall"

# Initialize the OpenAI client
client = OpenAI(api_key=api_key)

def detect_intent(text):
    # You can enhance this later with real intent detection
    return {"intent": "general", "query": text}

def send_to_n8n(payload):
    try:
        response = requests.post(webhook_url, json=payload, timeout=30)
        if response.status_code == 200:
            return response.json()
        else:
            print(f"⚠️ Webhook responded with status {response.status_code}")
            return {}
    except Exception as e:
        print("❌ Failed to send to n8n:", e)
        return {}

def start_quiet_interaction(query: str):
    """
    Handle text-only interactions. For map responses, include the map in the message.
    """
    try:
        # First try n8n for directions queries
        if any(keyword in query.lower() for keyword in ["directions", "route to", "how to get to", "navigate to", "from", "to"]):
            response_data = send_to_n8n({"query": query})
            if response_data and "mapEmbed" in response_data:
                return {
                    "reply": response_data.get("reply", "Here are your directions."),
                    "type": "text",  # Always text type for quiet agent
                    "mapEmbed": response_data["mapEmbed"]  # Map will show in message
                }

        # For non-directions or if n8n fails
        response = client.chat.completions.create(
            model="gpt-4",
            messages=[
                {"role": "system", "content": "You are Eve, a helpful AI assistant. Provide detailed, natural responses that directly address the user's query. Avoid generic phrases like 'Here's a quick answer'. Be conversational and engaging."},
                {"role": "user", "content": query}
            ]
        )
        reply = response.choices[0].message.content or ""
        return {"reply": reply, "type": "text"}
    except Exception as e:
        print("❌ Error in quiet interaction:", e)
        return {"error": "I am having trouble processing your request"}
