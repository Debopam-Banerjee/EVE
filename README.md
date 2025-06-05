# Eve: The Ultimate Personal Assistant (n8n + GPT + Python)

<img width="1120" alt="image" src="https://github.com/user-attachments/assets/a0d8b653-bc87-4f9f-92ca-445ad2a148fc" />



Welcome to **Eve**, your emotion-aware, visually-intelligent, memory-capable personal assistant powered by **n8n**, **OpenAI GPT-4o**, and **Python**. Eve can:

* Analyze your **facial expression** and mood
* Understand your **environment** using your webcam
* Store and recall **contextual memories**
* Interact across **email, calendar, contacts, and content tools**

---

## 💪 Features

* Visual recognition via webcam using OpenCV
* Emotion detection with GPT-4o based on facial expressions
* Scene, object, and appearance analysis
* Custom prompt routing and memory logging
* Modular workflows you can import into n8n

---

## ⚙️ Setup Instructions

### 1. Clone the Repository

```bash
git clone https://github.com/Debopam-Banerjee/EVE.git
cd EVE
```

### 2. Install n8n Locally

Install globally using npm:

```bash
npm install -g n8n
```

Run n8n:

```bash
n8n
```

Access the UI at `http://localhost:5678`

> You can also use [n8n desktop](https://n8n.io/download) if you prefer a GUI installer.

### 3. Import Workflows

In the n8n UI:

* Go to **Workflows > Import**
* Import the JSON files from this repo:

  * `image_agent.json`
  * Any additional emotion or memory-related workflows

### 4. Python Webcam Script Setup

Install dependencies:

```bash
pip install opencv-python
```

Run the webcam capture script manually or via n8n:

```bash
python3 capture_and_encode.py
```

This will capture a frame, optimize it, and output a base64 string for imageAgent.

> The script includes auto-exposure stabilization and JPEG compression for faster GPT-4o upload.

Here’s the enhanced version of your `README.md` with collapsible `details` sections to keep things clean and organized:

---

````md
## ⚙️ Local Development Setup

<details>
<summary>🔐 Step 0: Create a <code>.env</code> File</summary>

Create a `.env` file at the root (or inside `/backend` and `/frontend`) with the following values:

```env
# Backend .env
OPENAI_API_KEY=your-openai-api-key
ELEVENLABS_API_KEY=your-elevenlabs-api-key
ELEVEN_VOICE_ID=your-elevenlabs-voice-id
AGENT_ID=your-agent-id

# Frontend (Vite)
VITE_GOOGLE_MAPS_API_KEY=your-google-maps-api-key
````

> 🔑 [OpenAI API](https://platform.openai.com/account/api-keys)
> 🔊 [ElevenLabs API](https://elevenlabs.io/)
> 🗺️ [Google Maps API](https://console.cloud.google.com/): Enable **Maps JavaScript API**

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

Backend will be live at: [http://localhost:8000](http://localhost:8000)

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

3. Start the development server:

   ```bash
   npm run dev
   ```

Frontend will be available at: [http://localhost:5173](http://localhost:5173)

</details>

---

<details>
<summary>⚙️ Step 3: Start <code>n8n</code> Locally</summary>

Install n8n globally (if not already installed):

```bash
npm install -g n8n
```

Start the server:

```bash
n8n
```

Access the UI at: [http://localhost:5678](http://localhost:5678)

> Optional: Use the [n8n desktop app](https://n8n.io/download) for a GUI-based experience.

</details>

---

<details>
<summary>🧠 Step 4: Import n8n Workflows</summary>

1. Open [http://localhost:5678](http://localhost:5678)
2. Go to **Workflows > Import**
3. Import the JSON workflows from the `n8n agents/` folder:

   * `image_agent.json`
   * `__Email_Agent.json`
   * `__Contact_Agent.json`
   * (and others…)

</details>

---

## ✅ Summary

| Component  | Tech              | URL                                            |
| ---------- | ----------------- | ---------------------------------------------- |
| Backend    | FastAPI + Uvicorn | [http://localhost:8000](http://localhost:8000) |
| Frontend   | Vite + React      | [http://localhost:5173](http://localhost:5173) |
| Automation | n8n               | [http://localhost:5678](http://localhost:5678) |

---

```

Let me know if you'd like to include:
- Screenshots for each step
- GitHub badges (build, license, etc.)
- Or a copy-paste `.env.example` file for users to rename and fill in
```


---

## 🔄 How It Works

1. **Webcam Triggered:** A Python script captures your webcam image
2. **ImageAgent:** Sends image to GPT-4o for analysis
3. **Emotion Check:** Returns emotional state (e.g., "neutral", "sad", "happy")
4. **Memory:** Logs emotion + timestamp for contextual interaction later

---

## 📁 Files Included

* `image_agent.json` - n8n flow for webcam input + GPT-4o analysis
* `capture_and_encode.py` - Python script for webcam capture and base64 conversion

---

## 📢 Contributing

Got an idea for another assistant mode (e.g., "hydration reminder" or "ambient noise detector")? PRs welcome!

---

## 🌍 License

MIT License. Built for fun, productivity, and peace of mind.

---

## ✨ Demo

Stay tuned! A full walkthrough video is coming soon.

---

Need help or want a personalized version? Open an issue or email me directly.
