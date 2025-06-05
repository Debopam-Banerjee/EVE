# Eve: The Ultimate Personal Assistant (n8n + GPT + Python)

<img width="1120" alt="image" src="https://github.com/user-attachments/assets/a0d8b653-bc87-4f9f-92ca-445ad2a148fc" />

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
## ⚙️ Quick Start

### 1. Clone the Repository

```bash
git clone https://github.com/Debopam-Banerjee/EVE.git
cd EVE
````

### 2. Run `n8n` Locally

Install globally:

```bash
npm install -g n8n
```

Start:

```bash
n8n
```

Then visit: [http://localhost:5678](http://localhost:5678)

### 3. Import Workflows into `n8n`

Go to **Workflows > Import** in the UI, and upload the `.json` files from the `n8n agents/` folder:

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
* [Google Maps API Key](https://console.cloud.google.com/): Enable **Maps JavaScript API**

</details>

---

<details>
<summary>🐍 Step 1: Set Up Python Backend</summary>

1. Navigate to the backend folder:

   ```bash
   cd backend
   ```

2. Create and activate a virtual environment:

   * **Windows (PowerShell):**

     ```powershell
     python -m venv venv
     .\venv\Scripts\Activate.ps1
     ```

   * **macOS/Linux:**

     ```bash
     python3 -m venv venv
     source venv/bin/activate
     ```

3. Install dependencies:

   ```bash
   pip install fastapi uvicorn pydantic openai python-dotenv elevenlabs
   pip freeze > requirements.txt
   ```

4. Run the backend server:

   ```bash
   uvicorn app:app --reload
   ```

Backend will be available at: [http://localhost:8000](http://localhost:8000)

</details>

---

<details>
<summary>💻 Step 2: Run the Frontend (Vite + React)</summary>

1. Navigate to the frontend folder:

   ```bash
   cd frontend
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Start the frontend server:

   ```bash
   npm run dev
   ```

Frontend will run at: [http://localhost:5173](http://localhost:5173)

</details>

---

<details>
<summary>⚙️ Step 3: Start <code>n8n</code> Locally</summary>

Install globally (if not already done):

```bash
npm install -g n8n
```

Start n8n:

```bash
n8n
```

Then open: [http://localhost:5678](http://localhost:5678)

> Or use the [n8n desktop app](https://n8n.io/download) for a GUI-based experience.

</details>

---

<details>
<summary>🧠 Step 4: Import Workflows</summary>

1. Open [http://localhost:5678](http://localhost:5678)
2. Go to **Workflows > Import**
3. Import JSON workflows from the `n8n agents/` folder:

   * `image_agent.json`
   * `__Email_Agent.json`
   * `__Contact_Agent.json`
   * And others…

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

1. **Webcam Triggered:** A Python script captures your webcam image
2. **ImageAgent:** Sends image to GPT-4o for visual analysis
3. **Emotion Check:** Returns your emotional state (e.g., "neutral", "happy")
4. **Memory Module:** Logs emotion + timestamp for context-aware responses

---

## 📁 Key Files

* `backend/` — FastAPI app with assistants
* `frontend/` — Vite + React interface with TTS, webcam, map, and messaging UI
* `n8n agents/` — JSON workflows for automations and AI routing
* `capture_and_encode.py` — Webcam capture + base64 encoder for GPT
* `.env.example` — Sample environment file

---

## 📢 Contributing

Got an idea for another assistant mode (e.g., "hydration reminder" or "ambient noise detector")?
Pull requests are welcome!

---

## 🌍 License

MIT License. Built for fun, productivity, and peace of mind.

---

## ✨ Demo

🎥 A full walkthrough video is coming soon. Stay tuned!

---

## 💬 Questions?

Open an issue or contact me directly for collaboration or customization.

```

---

Let me know if you'd like a `README.md` badge header (license, build, tech stack), or if you want to auto-generate `.env.example` and include it in the repo.
```
