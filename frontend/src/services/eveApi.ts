interface ApiResponse {
  reply?: string;
  text?: string;
  audio?: string;
  error?: string;
  mapEmbed?: string;
  type?: 'map' | 'text';
}

interface MessagePayload {
  query: string;
  intent?: string;
  useVoice?: boolean;
  apiKeys?: {
    openai: string;
    elevenlabs: string;
    voiceId: string;
    agentId: string;
    webhookUrl: string;
  };
}

export class EveApiService {
  private baseUrl: string;

  constructor(baseUrl: string) {
    console.log('🔌 EveAPI initialized with base URL:', baseUrl);
    this.baseUrl = baseUrl;
  }

  async sendMessage(payload: any) {
    try {
      console.log(`\n📤 Sending request to ${this.baseUrl}:`, payload);
      // Use text-agent for voice (TTS) and quiet-agent for text-only
      const response = await fetch(`${this.baseUrl}/${payload.useVoice ? 'text-agent' : 'quiet-agent'}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        console.error(`❌ API error (${response.status}):`, await response.text());
        throw new Error(`API responded with status ${response.status}`);
      }

      const data = await response.json();
      console.log('📥 API response:', data);
      return data;
    } catch (error) {
      console.error('❌ API request failed:', error);
      throw error;
    }
  }

  async startVoiceAgent(apiKeys: MessagePayload['apiKeys']): Promise<ApiResponse> {
    try {
      const response = await fetch(`${this.baseUrl}/voice-agent`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ apiKeys }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Voice Agent Error:', error);
      return { error: 'Failed to start voice agent' };
    }
  }

  async endCall(): Promise<ApiResponse> {
    try {
      const response = await fetch(`${this.baseUrl}/end-call`, {
        method: 'POST'
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('End Call Error:', error);
      return { error: 'Failed to end call' };
    }
  }
}
