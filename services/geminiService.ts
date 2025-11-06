import { GoogleGenAI, Modality } from '@google/genai';

// FIX: Per guidelines, assume API_KEY is set in the environment.
// The API key must be obtained exclusively from the environment variable `process.env.API_KEY`.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const generateSpeech = async (prompt: string): Promise<string> => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash-preview-tts",
      contents: [{ parts: [{ text: prompt }] }],
      config: {
        responseModalities: [Modality.AUDIO],
        speechConfig: {
          voiceConfig: {
            prebuiltVoiceConfig: { voiceName: 'Zephyr' }, // A higher quality voice that supports Arabic well.
          },
        },
      },
    });
    
    // The Gemini API docs indicate a potential structure like this.
    // We safely access the base64 data.
    const audioData = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;

    if (!audioData) {
      throw new Error("No audio data received from Gemini API.");
    }
    
    return audioData;

  } catch (error) {
    console.error("Error calling Gemini API for TTS:", error);
    throw new Error("Failed to generate speech. Please check your API key and network connection.");
  }
};