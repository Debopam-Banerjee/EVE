import { useState, useEffect } from "react";

interface Settings {
  openaiApiKey: string;
  elevenLabsApiKey: string;
  voiceId: string;
  agentId: string;
  webhookUrl: string;
  backendUrl: string;
  googleMapsApiKey: string;
}

// Default settings
const defaultSettings: Settings = {
  openaiApiKey: "",
  elevenLabsApiKey: "",
  voiceId: "21m00Tcm4TlvDq8ikWAM", // Default voice ID (Rachel)
  agentId: "",
  webhookUrl: "http://localhost:5678/webhook/eve-postcall",
  backendUrl: "http://localhost:8000", // Default Python backend URL
  googleMapsApiKey: "", // Google Maps API key
};

export function useSettings() {
  const [settings, setSettings] = useState<Settings>(defaultSettings);
  const [initialized, setInitialized] = useState(false);

  // Load settings from localStorage on initial render
  useEffect(() => {
    const storedSettings = localStorage.getItem("eve-assistant-settings");
    if (storedSettings) {
      try {
        setSettings(JSON.parse(storedSettings));
      } catch (error) {
        console.error("Failed to parse stored settings:", error);
      }
    }
    setInitialized(true);
  }, []);

  // Save settings to localStorage whenever they change
  useEffect(() => {
    if (initialized) {
      localStorage.setItem("eve-assistant-settings", JSON.stringify(settings));
    }
  }, [settings, initialized]);

  return {
    settings,
    setSettings,
    openaiApiKey: settings.openaiApiKey,
    elevenLabsApiKey: settings.elevenLabsApiKey,
    voiceId: settings.voiceId,
    agentId: settings.agentId,
    webhookUrl: settings.webhookUrl,
    backendUrl: settings.backendUrl,
    googleMapsApiKey: settings.googleMapsApiKey,
    setOpenaiApiKey: (key: string) => setSettings(prev => ({ ...prev, openaiApiKey: key })),
    setElevenLabsApiKey: (key: string) => setSettings(prev => ({ ...prev, elevenLabsApiKey: key })),
    setVoiceId: (id: string) => setSettings(prev => ({ ...prev, voiceId: id })),
    setAgentId: (id: string) => setSettings(prev => ({ ...prev, agentId: id })),
    setWebhookUrl: (url: string) => setSettings(prev => ({ ...prev, webhookUrl: url })),
    setBackendUrl: (url: string) => setSettings(prev => ({ ...prev, backendUrl: url })),
    setGoogleMapsApiKey: (key: string) => setSettings(prev => ({ ...prev, googleMapsApiKey: key })),
  };
}
