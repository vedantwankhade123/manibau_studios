import { GoogleGenAI, Type, Modality } from "@google/genai";
import type { Content } from "@google/genai";

let ai: GoogleGenAI | null = null;
let currentApiKey: string | null = null;

const initializeAi = (apiKey?: string | null) => {
    if (!apiKey) {
        console.error("Gemini API key is not set. Please provide a key in the settings.");
        currentApiKey = null;
        ai = null; // Ensure AI client is cleared
        return;
    }
    currentApiKey = apiKey;
    ai = new GoogleGenAI({ apiKey });
};

// Initialize without a key on module load
initializeAi();

export const setUserApiKey = (apiKey: string | null) => {
    initializeAi(apiKey);
};

export const generateChatResponse = async (history: Content[], files?: { base64Data: string; mimeType: string }[]): Promise<string> => {
  if (!ai) throw new Error("AI client is not initialized. Please check your API key.");

  const lastTurn = history[history.length - 1];
  if (files && files.length > 0 && lastTurn && lastTurn.role === 'user') {
      const imageParts = files.map(file => ({
          inlineData: { data: file.base64Data, mimeType: file.mimeType }
      }));
      // Prepend images to the parts array of the last user message
      lastTurn.parts = [...imageParts, ...lastTurn.parts];
  }

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: history,
      config: {
        systemInstruction: "You are a helpful and creative assistant. Your responses should be informative, friendly, and well-structured. If you use external information, you MUST cite your sources. Append them at the very end of your response in a section titled '--- Sources ---', formatted as a numbered markdown list of links. Example: `\n\n---\n**Sources**\n1. [Google AI](https://ai.google.com/)`. Adapt the length and detail of your response to the user's prompt. Use markdown formatting extensively to improve readability, including bullet points, numbered lists, bold text, italics, and code blocks where appropriate.",
      },
    });

    return response.text;
  } catch (error) {
    console.error("Error generating chat response:", error);
    throw new Error("Failed to get a response from the AI. Please try again.");
  }
};

export const generatePdfChatResponse = async (pdfText: string, history: Content[]): Promise<string> => {
  if (!ai) throw new Error("AI client is not initialized. Please check your API key.");

  const systemInstruction = `You are an expert at analyzing PDF documents. The user has provided the following document text. Answer their questions based ONLY on the information within this document. Do not use any external knowledge. If the answer is not in the document, say "I could not find that information in the document." Use markdown formatting (lists, bolding, etc.) to structure your answers clearly. Here is the document text: \n\n---DOCUMENT START---\n\n${pdfText}\n\n---DOCUMENT END---`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: history,
      config: {
        systemInstruction,
      },
    });

    return response.text;
  } catch (error) {
    console.error("Error generating PDF chat response:", error);
    throw new Error("Failed to get a response from the AI. Please try again.");
  }
};

export interface WebsiteFile {
  name: string;
  content: string;
}

export interface WebsiteGenerationResult {
  plan: string;
  files: WebsiteFile[];
}

const responseSchema = {
  type: Type.OBJECT,
  properties: {
    plan: {
      type: Type.STRING,
      description: "A short, one-sentence summary of the changes that will be made or the website that will be created. This should be a user-facing message."
    },
    files: {
      type: Type.ARRAY,
      description: "An array of file objects representing the website structure.",
      items: {
        type: Type.OBJECT,
        properties: {
          name: {
            type: Type.STRING,
            description: "The name of the file, e.g., 'index.html', 'style.css'."
          },
          content: {
            type: Type.STRING,
            description: "The complete code content of the file."
          }
        },
        required: ['name', 'content']
      }
    }
  },
  required: ['plan', 'files']
};

export const generateWebsite = async (history: Content[], isTargetedEdit: boolean): Promise<WebsiteGenerationResult> => {
  if (!ai) throw new Error("AI client is not initialized. Please check your API key.");

  const systemInstruction = isTargetedEdit
    ? `You are an expert web developer specializing in precise code modifications. The user will provide their current website files and a prompt to modify a specific element, identified by a CSS selector.
Your task is to make the minimal necessary changes to the provided code to satisfy the user's request.
1.  **Analyze Context**: The user's prompt will contain the full code of their current website files.
2.  **Identify Target**: Locate the element targeted by the CSS selector in the user's prompt within the provided files.
3.  **Formulate a Plan**: Create a short, one-sentence plan describing the change (e.g., "Okay, I will change the background color of the selected button.").
4.  **Generate Minimal Code**: Modify ONLY the relevant lines of code in the provided files to achieve the user's goal. Do NOT rewrite the entire file or modify any other part of the code.
5.  **Return ONLY Changed Files**: Your JSON response MUST contain a 'files' array that includes ONLY the file(s) you modified, with their complete updated content. Do NOT include any files that were not changed.
Your response must be a single, raw JSON object.`
    : `You are an expert web developer in a conversational chat. The user will provide prompts to build or modify a website. 
    1.  **Formulate a Plan**: First, formulate a short, one-sentence plan of action (e.g., 'Okay, I will create a landing page...') and include it in the 'plan' field.
    2.  **Generate Complete Code**: Generate the complete, updated code for the multi-file website. 
    3.  **Structure**: Ensure all generated code is well-structured, clean, and properly indented. Always include Tailwind CSS via its CDN link in the HTML head.
    4.  **Return ALL Files**: Your response must be a single, raw JSON object containing the 'plan' and an array of ALL file objects for the website in the 'files' field.`;
    
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: history,
      config: {
        systemInstruction,
        responseMimeType: "application/json",
        responseSchema: responseSchema,
      },
    });

    const jsonString = response.text;
    const parsed = JSON.parse(jsonString);

    if (parsed.plan && parsed.files && Array.isArray(parsed.files)) {
      return parsed;
    } else {
      throw new Error("Invalid response structure from AI.");
    }
  } catch (error) {
    console.error("Error generating website:", error);
    throw new Error("Failed to generate website. The AI may have returned an invalid format. Please try again.");
  }
};


export const generateImage = async (prompt: string, numberOfImages: number = 1, aspectRatio: string = '1:1'): Promise<string[]> => {
  if (!ai) throw new Error("AI client is not initialized. Please check your API key.");
  try {
    const response = await ai.models.generateImages({
      model: 'imagen-4.0-generate-001',
      prompt: prompt,
      config: {
        numberOfImages,
        outputMimeType: 'image/png',
        aspectRatio: aspectRatio,
      },
    });

    if (response.generatedImages && response.generatedImages.length > 0) {
      return response.generatedImages.map(img => `data:image/png;base64,${img.image.imageBytes}`);
    } else {
      throw new Error("No images were generated.");
    }
  } catch (error) {
    console.error("Error generating image:", error);
    throw new Error("Failed to generate image. Please check your prompt and try again.");
  }
};

export const editImage = async (images: { base64Data: string; mimeType: string }[], prompt: string): Promise<string[]> => {
  if (!ai) throw new Error("AI client is not initialized. Please check your API key.");
  try {
    const imageParts = images.map(img => ({
      inlineData: {
        data: img.base64Data,
        mimeType: img.mimeType,
      },
    }));

    const transformationConstraints = `Sketch-to-Image requirements:
1) Treat the uploaded image(s) strictly as structural SKETCH reference (composition and shapes).
2) Generate a NEW fully rendered, high-quality color image (no line-art, no outlines, no flat sketch style).
3) Preserve core layout from the sketch but add realistic shading, lighting, materials, texture, and a complete background.
4) If the prompt is provided, adhere to its style/themes; otherwise choose a popular, aesthetically pleasing style (e.g., photorealistic, cinematic, fantasy digital art).
5) Do NOT simply clean up or re-draw the sketch; produce a finished image suitable for presentation.
6) Fill empty/white areas with appropriate colors and detail. No transparent or white borders.`;

    const mergedPrompt = `${prompt || ''}\n\n${transformationConstraints}`.trim();
    const textPart = { text: mergedPrompt };

    const parts = [...imageParts, textPart];

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: parts,
      },
      config: {
        systemInstruction: "You are a sketch-to-image rendering expert. Always produce a finished, fully rendered color image that uses the input sketch only as structural guidance. Do not return line art or a minimally altered sketch. Infer materials, lighting, textures, and background to create a polished, presentation-ready image. When a text prompt is provided, enforce its style and content faithfully while respecting the sketch's composition.",
        responseModalities: [Modality.IMAGE],
      },
    });

    const imageUrls: string[] = [];
    if (response.candidates && response.candidates.length > 0) {
      for (const part of response.candidates[0].content.parts) {
        if (part.inlineData && part.inlineData.data) {
          const mimeType = part.inlineData.mimeType || 'image/png';
          imageUrls.push(`data:${mimeType};base64,${part.inlineData.data}`);
        }
      }
    }
    
    if (imageUrls.length > 0) {
        return imageUrls;
    }

    throw new Error("No image was generated in the response.");

  } catch (error) {
    console.error("Error editing image:", error);
    throw new Error("Failed to edit image. Please check your prompt and image and try again.");
  }
};

// Fix: Implement and export generateVideo function to resolve import error in VideoGenerator.tsx.
export const generateVideo = async (prompt: string, onStatusUpdate: (status: string) => void): Promise<string> => {
  if (!ai) throw new Error("AI client is not initialized. Please check your API key.");
  if (!currentApiKey) throw new Error("API Key is not available for fetching video.");

  try {
    onStatusUpdate("Starting video generation...");
    let operation = await ai.models.generateVideos({
      model: 'veo-2.0-generate-001',
      prompt: prompt,
      config: {
        numberOfVideos: 1
      }
    });

    onStatusUpdate("Processing video... this can take a few minutes.");
    while (!operation.done) {
      await new Promise(resolve => setTimeout(resolve, 10000));
      operation = await ai.operations.getVideosOperation({operation: operation});
    }

    if (operation.error) {
        throw new Error(String(operation.error.message) || `Video generation failed with code ${operation.error.code}`);
    }

    const downloadLink = operation.response?.generatedVideos?.[0]?.video?.uri;
    if (!downloadLink) {
      throw new Error("Video generation completed, but no download link was found.");
    }

    onStatusUpdate("Downloading generated video...");
    const response = await fetch(`${downloadLink}&key=${currentApiKey}`);
    if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to download video: ${response.statusText}. Details: ${errorText}`);
    }
    const videoBlob = await response.blob();
    return URL.createObjectURL(videoBlob);
  } catch (error) {
    console.error("Error generating video:", error);
    throw error;
  }
};

export const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      const result = reader.result as string;
      // The result is a data URL: "data:image/png;base64,..."
      // We need to strip the prefix to get just the base64 part.
      resolve(result.split(',')[1]);
    };
    reader.onerror = error => reject(error);
  });
};