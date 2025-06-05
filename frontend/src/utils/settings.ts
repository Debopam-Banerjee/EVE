interface Settings {
  googleMapsApiKey: string;
  // Add other settings as needed
}

let settings: Settings = {
  googleMapsApiKey: '',
};

export function getSettings(): Settings {
  return settings;
}

export function updateSettings(newSettings: Partial<Settings>) {
  settings = { ...settings, ...newSettings };
}

// Initialize settings from localStorage if available
try {
  const savedSettings = localStorage.getItem('eve-settings');
  if (savedSettings) {
    settings = JSON.parse(savedSettings);
  }
} catch (error) {
  console.error('Error loading settings:', error);
} 