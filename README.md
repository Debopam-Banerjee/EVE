# Eve: The Ultimate Personal Assistant (n8n + GPT + Python + ElevenLabs Conversational AI and STT)

<img width="1048" alt="image" src="https://github.com/user-attachments/assets/5d5d9ab5-752e-4481-8491-30dae1fadc30" />


Welcome to **Eve**, your emotion-aware, visually-intelligent, memory-capable personal assistant powered by **n8n**, **OpenAI GPT-4o**, and **Python**.

Eve can:
- Analyze your **facial expression** and mood
- Understand your **environment** using your webcam
- Store and recall **contextual memories**
- Interact across **email, calendar, contacts, and content tools**

---

## 💪 Features

- Visual recognition via webcam using OpenCV
- Emotion detection with GPT-4o based on facial expressions
- Scene, object, and appearance analysis
- Custom prompt routing and memory logging
- Modular workflows importable into n8n

---

## ⚙️ Quick Start

### 1. Clone the Repository

```bash
git clone https://github.com/Debopam-Banerjee/EVE.git
cd EVE
````

### 2. Run `n8n` Locally

```bash
npm install -g n8n
n8n
```

Visit [http://localhost:5678](http://localhost:5678)

### 3. Import Workflows

In the n8n UI, go to **Workflows > Import**, then upload:

* `image_agent.json`
* `__Email_Agent.json`, `__Contact_Agent.json`, etc.

---

## ⚙️ Local Development Setup

<details>
<summary>🔐 Step 0: Create a <code>.env</code> File</summary>

Create a `.env` file at the root or inside `/backend` and `/frontend`:

```env
# Backend .env
OPENAI_API_KEY=your-openai-api-key
ELEVENLABS_API_KEY=your-elevenlabs-api-key
ELEVEN_VOICE_ID=your-elevenlabs-voice-id
AGENT_ID=your-agent-id

# Frontend (Vite)
VITE_GOOGLE_MAPS_API_KEY=your-google-maps-api-key
```

🔗 Get your keys:

* [OpenAI API Key](https://platform.openai.com/account/api-keys)
* [ElevenLabs API](https://elevenlabs.io/)
* [Google Maps API](https://console.cloud.google.com/): Enable **Maps JavaScript API**

</details>

---

<details>
<summary>🐍 Step 1: Set Up Python Backend</summary>

```bash
cd backend
```

**Create and activate a virtual environment:**

* Windows:

  ```powershell
  python -m venv venv
  .\venv\Scripts\Activate.ps1
  ```

* macOS/Linux:

  ```bash
  python3 -m venv venv
  source venv/bin/activate
  ```

**Install dependencies:**

```bash
pip install fastapi uvicorn pydantic openai python-dotenv elevenlabs
pip freeze > requirements.txt
```

**Start the server:**

```bash
uvicorn app:app --reload
```

Backend will run at [http://localhost:8000](http://localhost:8000)

</details>

---

<details>
<summary>💻 Step 2: Run the Frontend (Vite + React)</summary>

```bash
cd frontend
npm install
npm run dev
```

Frontend will run at [http://localhost:5173](http://localhost:5173)

</details>

---

<details>
<summary>⚙️ Step 3: Start <code>n8n</code> Locally</summary>

If not installed:

```bash
npm install -g n8n
```

Start:

```bash
n8n
```

Access [http://localhost:5678](http://localhost:5678)

> Or use the [n8n desktop app](https://n8n.io/download)

</details>

---

<details>
<summary>🧠 Step 4: Import Workflows</summary>

1. Visit [http://localhost:5678](http://localhost:5678)
2. Go to **Workflows > Import**
3. Upload:

* `image_agent.json`
* `__Email_Agent.json`
* `__Contact_Agent.json`
* (And others…)

</details>

---

<details>
<summary>🔊 ElevenLabs Webhook Setup (via <code>ngrok</code>)</summary>

To receive **voice responses and webhook events from ElevenLabs** while running Eve locally, you must expose your backend using `ngrok`.

---

### 🧪 Why ngrok?

ElevenLabs requires a **public HTTPS URL** to deliver webhook events. `ngrok` tunnels your local server to the internet securely.

---

### ⚙️ Setup Steps

1. Install ngrok:

   ```bash
   npm install -g ngrok
   ```

2. Authenticate:

   ```bash
   ngrok config add-authtoken <your_auth_token>
   ```

3. Reserve a free subdomain (in the ngrok dashboard), e.g.:

   ```
   your-url.ngrok-free.app
   ```

4. Start your backend:

   ```bash
   uvicorn app:app --reload
   ```

5. Expose it via ngrok:

   ```bash
   ngrok http 8000 --domain=your-url.ngrok-free.app
   ```

6. Set your ElevenLabs webhook to:

   ```
   https://your-url.ngrok-free.app/webhook/eve-postcall
   ```

---

### 💡 Optional: Use in .env

```env
WEBHOOK_URL=https://your-url.ngrok-free.app/webhook/eve-postcall
```

In Python:

```python
import os
WEBHOOK_URL = os.getenv("WEBHOOK_URL")
```

</details>

---

## ✅ Project Summary

| Component  | Tech              | URL                                            |
| ---------- | ----------------- | ---------------------------------------------- |
| Backend    | FastAPI + Uvicorn | [http://localhost:8000](http://localhost:8000) |
| Frontend   | Vite + React      | [http://localhost:5173](http://localhost:5173) |
| Automation | n8n               | [http://localhost:5678](http://localhost:5678) |

---

## 🔄 How It Works

1. **Webcam Triggered** — Python captures your webcam image
2. **ImageAgent** — Sends image to GPT-4o for analysis
3. **Emotion Check** — Detects mood from the image
4. **Memory Module** — Logs emotion & context for future interaction

---

## 📁 Key Files

* `backend/` — FastAPI backend
* `frontend/` — Vite + React frontend
* `n8n agents/` — JSON-based automation flows
* `capture_and_encode.py` — Webcam capture script
* `.env.example` — Sample environment configuration

---

## 📢 Contributing

Got an idea for another assistant mode (e.g., "hydration reminder" or "ambient noise detector")?
Pull requests are welcome!

---

## 🌍 License

MIT License — built for fun, productivity, and peace of mind.

---

## ✨ Demo

[🎥 Full walkthrough video coming soon](https://www.linkedin.com/feed/update/urn:li:activity:7335722019876913152/)

---

## 💬 Questions?

Open an issue or contact me directly for help, collaboration, or custom features.

```
