export const generateSpeech = async (prompt: string): Promise<string> => {
  try {
    const response = await fetch('/api/gemini', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ prompt }),
    });

    if (!response.ok) {
        const errorText = await response.text();
        console.error("Backend error response:", errorText);
        throw new Error(`Request failed with status ${response.status}`);
    }

    const data = await response.json();

    if (data.error) {
        throw new Error(data.error);
    }
    
    if (!data.audioData) {
      throw new Error("No audio data received from the server.");
    }
    
    return data.audioData;

  } catch (error) {
    console.error("Error calling backend for TTS:", error);
    throw new Error("Failed to generate speech. Please try again later.");
  }
};
