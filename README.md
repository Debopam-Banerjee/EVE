# Eve: The Ultimate Personal Assistant (n8n + GPT + Python)

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
