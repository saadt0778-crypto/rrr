// Fix: Use ES module 'import' syntax instead of CommonJS 'require'.
import { GoogleGenAI, Modality } from '@google/genai';

// Fix: Use ES module 'export' syntax and add type annotation for the event.
export const handler = async function(event: any) {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  try {
    if (!event.body) {
        return { statusCode: 400, body: JSON.stringify({ error: 'Request body is missing' }) };
    }
    const { prompt } = JSON.parse(event.body);

    if (!prompt) {
      return { statusCode: 400, body: JSON.stringify({ error: 'Prompt is required' }) };
    }

    if (!process.env.API_KEY) {
      console.error('API_KEY environment variable not set.');
      return { statusCode: 500, body: JSON.stringify({ error: 'API key is not configured on the server.' }) };
    }
    
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash-preview-tts",
      contents: [{ parts: [{ text: prompt }] }],
      config: {
        responseModalities: [Modality.AUDIO],
        speechConfig: {
          voiceConfig: {
            prebuiltVoiceConfig: { voiceName: 'Zephyr' },
          },
        },
      },
    });
    
    const audioData = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;

    if (!audioData) {
        return { statusCode: 500, body: JSON.stringify({ error: 'No audio data received from Gemini API.' }) };
    }
    
    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ audioData }),
    };

  } catch (error: any) {
    console.error("Error in Netlify function:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message || 'An internal server error occurred.' }),
    };
  }
};
