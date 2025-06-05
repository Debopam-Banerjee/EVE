import React from 'react';

interface ConfigPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

const ConfigPanel = ({ isOpen, onClose }: ConfigPanelProps) => {
  const [settings, setSettings] = React.useState({
    openaiApiKey: '',
    elevenLabsApiKey: '',
    voiceId: '21m00Tcm4TlvDq8ikWAM',
    agentId: '',
    webhookUrl: 'http://localhost:5678/webhook/eve-postcall',
    backendUrl: 'http://localhost:8000'
  });

  React.useEffect(() => {
    if (isOpen) {
      const stored = localStorage.getItem('eve-assistant-settings');
      if (stored) {
        try {
          setSettings(JSON.parse(stored));
        } catch (error) {
          console.error('Failed to parse settings:', error);
        }
      }
    }
  }, [isOpen]);

  const handleSave = () => {
    localStorage.setItem('eve-assistant-settings', JSON.stringify(settings));
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="glass border-[#00BFFF]/30 border w-full max-w-lg rounded-2xl shadow-lg max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-4 border-b border-white/10">
          <h2 className="text-xl font-medium text-[#00BFFF]">Eve Configuration</h2>
          <button 
            onClick={onClose} 
            className="text-gray-400 hover:text-white p-2 hover:bg-white/10 rounded-lg transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="m18 6-12 12"></path>
              <path d="m6 6 12 12"></path>
            </svg>
          </button>
        </div>
        
        <div className="p-6 space-y-4">
          <div className="space-y-2">
            <label htmlFor="backend-url" className="block text-sm text-gray-300">
              Python Backend URL
            </label>
            <input
              id="backend-url"
              type="text"
              placeholder="http://localhost:8000"
              value={settings.backendUrl}
              onChange={(e) => setSettings(prev => ({ ...prev, backendUrl: e.target.value }))}
              className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-400 focus:border-[#00BFFF] focus:outline-none"
            />
            <p className="text-xs text-gray-400">
              URL where your Python backend is running
            </p>
          </div>

          <div className="space-y-2">
            <label htmlFor="openai-key" className="block text-sm text-gray-300">
              OpenAI API Key
            </label>
            <input
              id="openai-key"
              type="password"
              placeholder="sk-..."
              value={settings.openaiApiKey}
              onChange={(e) => setSettings(prev => ({ ...prev, openaiApiKey: e.target.value }))}
              className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-400 focus:border-[#00BFFF] focus:outline-none"
            />
            <p className="text-xs text-gray-400">
              Required for GPT responses when n8n webhook fails
            </p>
          </div>
          
          <div className="space-y-2">
            <label htmlFor="elevenlabs-key" className="block text-sm text-gray-300">
              ElevenLabs API Key
            </label>
            <input
              id="elevenlabs-key"
              type="password"
              placeholder="Your ElevenLabs API Key"
              value={settings.elevenLabsApiKey}
              onChange={(e) => setSettings(prev => ({ ...prev, elevenLabsApiKey: e.target.value }))}
              className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-400 focus:border-[#00BFFF] focus:outline-none"
            />
            <p className="text-xs text-gray-400">
              Required for voice responses and voice agent
            </p>
          </div>
          
          <div className="space-y-2">
            <label htmlFor="voice-id" className="block text-sm text-gray-300">
              ElevenLabs Voice ID
            </label>
            <input
              id="voice-id"
              type="text"
              placeholder="21m00Tcm4TlvDq8ikWAM"
              value={settings.voiceId}
              onChange={(e) => setSettings(prev => ({ ...prev, voiceId: e.target.value }))}
              className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-400 focus:border-[#00BFFF] focus:outline-none"
            />
            <p className="text-xs text-gray-400">
              Default: "21m00Tcm4TlvDq8ikWAM" (Rachel)
            </p>
          </div>

          <div className="space-y-2">
            <label htmlFor="agent-id" className="block text-sm text-gray-300">
              ElevenLabs Agent ID (Optional)
            </label>
            <input
              id="agent-id"
              type="text"
              placeholder="agent_..."
              value={settings.agentId}
              onChange={(e) => setSettings(prev => ({ ...prev, agentId: e.target.value }))}
              className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-400 focus:border-[#00BFFF] focus:outline-none"
            />
            <p className="text-xs text-gray-400">
              Required for voice agent functionality
            </p>
          </div>
          
          <div className="space-y-2">
            <label htmlFor="webhook-url" className="block text-sm text-gray-300">
              n8n Webhook URL
            </label>
            <input
              id="webhook-url"
              type="text"
              placeholder="http://localhost:5678/webhook/eve-postcall"
              value={settings.webhookUrl}
              onChange={(e) => setSettings(prev => ({ ...prev, webhookUrl: e.target.value }))}
              className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-400 focus:border-[#00BFFF] focus:outline-none"
            />
            <p className="text-xs text-gray-400">
              URL for your n8n workflow integration
            </p>
          </div>
          
          <button 
            onClick={handleSave} 
            className="w-full bg-[#00BFFF] hover:bg-[#00BFFF]/80 text-white py-2 px-4 rounded-lg transition-colors mt-6"
          >
            Save Settings
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfigPanel;
