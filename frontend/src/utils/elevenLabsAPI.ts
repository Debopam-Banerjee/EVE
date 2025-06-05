
export async function playTextWithElevenLabs(
  text: string,
  apiKey: string,
  voiceId: string = "21m00Tcm4TlvDq8ikWAM", // Default to Rachel voice
  model: string = "eleven_multilingual_v2"
) {
  try {
    // Create API URL
    const apiUrl = `https://api.elevenlabs.io/v1/text-to-speech/${voiceId}/stream`;
    
    // Create request body
    const requestBody = {
      text,
      model_id: model,
      voice_settings: {
        stability: 0.5,
        similarity_boost: 0.5,
      },
    };
    
    // Make API request
    const response = await fetch(apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "xi-api-key": apiKey,
        accept: "audio/mpeg",
      },
      body: JSON.stringify(requestBody),
    });
    
    if (!response.ok) {
      throw new Error(`ElevenLabs API error: ${response.status} ${response.statusText}`);
    }
    
    // Get audio data and play
    const audioBlob = await response.blob();
    const audioUrl = URL.createObjectURL(audioBlob);
    const audio = new Audio(audioUrl);
    
    // Clean up URL object after playback finishes
    audio.addEventListener("ended", () => {
      URL.revokeObjectURL(audioUrl);
    });
    
    // Start playback
    await audio.play();
    
    return true;
  } catch (error) {
    console.error("Error playing audio with ElevenLabs:", error);
    return false;
  }
}
