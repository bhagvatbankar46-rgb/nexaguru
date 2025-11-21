
import { GoogleGenAI } from "@google/genai";

export const generateImageFromPrompt = async (prompt: string): Promise<string> => {
  if (!process.env.API_KEY) {
    throw new Error("API Key is missing.");
  }

  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

  try {
    const response = await ai.models.generateImages({
      model: 'imagen-4.0-generate-001',
      prompt: prompt,
      config: {
        numberOfImages: 1,
        outputMimeType: 'image/jpeg',
        aspectRatio: '1:1',
      },
    });

    const base64ImageBytes = response.generatedImages?.[0]?.image?.imageBytes;
    
    if (!base64ImageBytes) {
      throw new Error("No image data received from API.");
    }

    return `data:image/jpeg;base64,${base64ImageBytes}`;
  } catch (error: any) {
    console.error("Gemini Image API Error:", error);
    throw new Error(error.message || "Failed to generate image.");
  }
};

export const generateVideoFromPrompt = async (prompt: string, aspectRatio: '16:9' | '9:16'): Promise<string> => {
  if (!process.env.API_KEY) {
    throw new Error("API Key is missing.");
  }

  // Handle specific key selection for Veo models if required by the platform
  if ((window as any).aistudio) {
    const aistudio = (window as any).aistudio;
    if (!(await aistudio.hasSelectedApiKey())) {
      await aistudio.openSelectKey();
    }
  }

  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

  try {
    let operation = await ai.models.generateVideos({
      model: 'veo-3.1-fast-generate-preview',
      prompt: prompt,
      config: {
        numberOfVideos: 1,
        resolution: '720p',
        aspectRatio: aspectRatio
      }
    });

    // Poll for completion
    while (!operation.done) {
      await new Promise(resolve => setTimeout(resolve, 5000)); // Wait 5 seconds
      operation = await ai.operations.getVideosOperation({ operation: operation });
    }

    const videoUri = operation.response?.generatedVideos?.[0]?.video?.uri;
    
    if (!videoUri) {
      throw new Error("No video URI received from API.");
    }

    // The response URI needs the API key appended to fetch the raw bytes
    const videoResponse = await fetch(`${videoUri}&key=${process.env.API_KEY}`);
    if (!videoResponse.ok) throw new Error("Failed to download video content.");
    
    const blob = await videoResponse.blob();
    return URL.createObjectURL(blob);

  } catch (error: any) {
    console.error("Gemini Video API Error:", error);
    // Check specifically for the key error to help user
    if (error.message?.includes('Requested entity was not found') && (window as any).aistudio) {
         await (window as any).aistudio.openSelectKey();
         throw new Error("Session expired. Please try again to select API key.");
    }
    throw new Error(error.message || "Failed to generate video.");
  }
};
