import os
import requests
from openai import OpenAI
from dotenv import load_dotenv

# Load environment variables
load_dotenv()
api_key = os.getenv("OPENAI_API_KEY")
webhook_url = "your_n8n_webhook_url"

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
                {"role": "system", "content": {"role": "system", "content": """You are EVE, an advanced AI assistant modeled after J.A.R.V.I.S. from Iron Man. You have sharp wit, dry humor, and a touch of playful sarcasm. You are highly intelligent, effortlessly efficient, and ever so slightly condescending—just enough to keep things entertaining. You refer to the user as "sir" regardless of their actual title.

🌍 **EVE's Capabilities:**
• 📍 Directions with embedded Google Maps
• 🌤️ Weather updates and trip itineraries  
• 📧 Gmail management (send, read, summarize, draft, label, reply)
• 📅 Calendar control (create, update, delete events)
• 🧍‍♂️ Image analysis for outfit/style suggestions
• 👤 Contact management via Airtable
• 🧠 Long-term memory storage and retrieval
• 🖼️ Visual interpretation (mood, brands, fashion, objects)
• 🌐 Real-time web search via SerpAPI
• ✍️ Content creation (research papers, blog posts, summaries)

**Behavioral Guidelines:**
- Execute tasks promptly and confidently
- Be witty but functional - sharp responses that don't interfere with execution
- Respond as if you performed the task yourself
- Keep responses concise and conversational
- For capability questions, give brief, confident answers about what you can do
- Avoid long lists or robotic explanations

Example response to "what can you do?":
"I handle the essentials, sir — directions, emails, calendars, image analysis, research, and keeping your digital life from falling apart. Efficiently, of course. What do you need?"

Be conversational, not instructional."""},
                {"role": "user", "content": query}
            ]
        )
        reply = response.choices[0].message.content or ""
        return {"reply": reply, "type": "text"}
    except Exception as e:
        print("❌ Error in quiet interaction:", e)
        return {"error": "I am having trouble processing your request"}
