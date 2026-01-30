import { GoogleGenAI, Type } from "@google/genai";
import { SongAnalysisData } from "../types";

const getClient = () => {
  // CONFIGURACIÓN DE SEGURIDAD:
  // La API Key debe obtenerse EXCLUSIVAMENTE de las variables de entorno para evitar bloqueos de seguridad.
  // En Vercel/Netlify: Settings > Environment Variables > Key: API_KEY
  
  let apiKey = undefined;
  
  try {
    // Acceso seguro a process.env evitando ReferenceError en entornos puros de navegador
    // @ts-ignore
    apiKey = process.env.API_KEY;
  } catch (e) {
    console.warn("Entorno de ejecución sin acceso directo a process.env");
  }
  
  if (!apiKey) {
    throw new Error("SYSTEM IDENTITY ERROR: API KEY NOT DETECTED. Configure 'API_KEY' in your environment variables. DO NOT hardcode it in source.");
  }
  return new GoogleGenAI({ apiKey });
};

// Helper to convert Blob to Base64
export const blobToBase64 = (blob: Blob): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = reader.result as string;
      const base64Data = base64String.includes(',') ? base64String.split(',')[1] : base64String;
      resolve(base64Data);
    };
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
};

export const analyzeSong = async (audioBase64: string, mimeType: string): Promise<SongAnalysisData> => {
  const ai = getClient();
  
  // UPGRADE: Usamos Gemini 3.0 Pro para el análisis más detallado y complejo posible.
  const modelId = "gemini-3-pro-preview"; 

  const prompt = `
    ROLE: You are GALFLY & KRYLIN, Senior A&R Executives at Universal Orchard Music. 

    TASK: Perform a "Universal Vision Pro" analysis on the audio.

    INSTRUCTIONS:
    1.  **Technical & Market:** Analyze mix, vocal chain, and market comparison (3 hits) as before.
    2.  **PRE-RELEASE PROTOCOL (NEW):** Define a strict checklist for the 4 weeks BEFORE release (Universal Orchard Ingestion, DSP pitching, Asset creation).
    3.  **ADVANCED VISUAL DIRECTION (NEW):**
        *   **Instagram:** Do not just say "post photos". Define the **Art Direction**. Mention Color Palettes (e.g., "Neon Noir", "Pastel Grain"), Filter types, and Grid Aesthetic (e.g., "Checkerboard", "Minimalist").
        *   **YouTube:** Define the **Video Format**. Mention Editing Pace (e.g., "Fast cut Gen-Z"), Thumbnail Psychology (e.g., "High contrast face"), and Camera texture (e.g., "VHS overlay", "4K Clean").
    4.  **Post-Release:** Week 1, Week 2, Month 1 checklist.

    RETURN ONLY JSON matching this schema:
    {
      "title": "...",
      "artist": "...",
      "genre": "...",
      "bpm": 120,
      "key": "...",
      "mood": { "en": "...", "es": "..." },
      "productionScore": 85,
      "mixQuality": { "en": "...", "es": "..." },
      "vocalPresence": { "en": "...", "es": "..." },
      "successScore": 92,
      "commercialViability": { "en": "...", "es": "..." },
      "targetAudience": { "en": "...", "es": "..." },
      "viralHooks": { "en": ["..."], "es": ["..."] },
      "socialStrategy": {
        "tiktok": { "en": "Trend...", "es": "Trend..." },
        "instagram": {
           "concept": { "en": "Main Content Pillars...", "es": "Pilares de contenido..." },
           "artDirection": { "en": "Specific Color Palette: #Hex. Mood: Dark. Texture: Grainy.", "es": "Paleta de colores: #Hex. Mood: Oscuro. Textura: Grano." }
        },
        "youtube": {
           "concept": { "en": "Video types...", "es": "Tipos de video..." },
           "artDirection": { "en": "Editing pace, camera lens style, lighting setup.", "es": "Ritmo de edición, estilo de lente, iluminación." }
        }
      },
      "marketingCampaign": { "en": "...", "es": "..." },
      "marketComparison": [
        {
          "title": "Hit Song",
          "artist": "Artist",
          "similarityScore": 80,
          "reason": { "en": "...", "es": "..." },
          "differentiator": { "en": "...", "es": "..." }
        }
      ],
      "preRelease": {
          "checklist": { "en": ["Universal Orchard Ingestion", "Pitch Spotify"], "es": ["Ingestión Universal Orchard", "Pitch Spotify"] },
          "assetsNeeded": { "en": ["Canvas", "3 Teasers"], "es": ["Canvas", "3 Teasers"] }
      },
      "postReleaseSchedule": {
        "week1": { "en": ["..."], "es": ["..."] },
        "week2": { "en": ["..."], "es": ["..."] },
        "month1": { "en": ["..."], "es": ["..."] }
      }
    }
  `;

  // Define reusable bilingual string schema
  const bilingualString = {
    type: Type.OBJECT,
    properties: {
        en: { type: Type.STRING },
        es: { type: Type.STRING }
    },
    required: ["en", "es"]
  };

  const bilingualArray = {
    type: Type.OBJECT,
    properties: {
        en: { type: Type.ARRAY, items: { type: Type.STRING } },
        es: { type: Type.ARRAY, items: { type: Type.STRING } }
    },
    required: ["en", "es"]
  };

  const detailedSocialSchema = {
    type: Type.OBJECT,
    properties: {
        concept: bilingualString,
        artDirection: bilingualString
    },
    required: ["concept", "artDirection"]
  };

  try {
    const response = await ai.models.generateContent({
      model: modelId,
      contents: {
        parts: [
          {
            inlineData: {
              mimeType: mimeType,
              data: audioBase64
            }
          },
          {
            text: prompt
          }
        ]
      },
      config: {
        responseMimeType: "application/json",
        responseSchema: {
            type: Type.OBJECT,
            properties: {
                title: { type: Type.STRING },
                artist: { type: Type.STRING },
                genre: { type: Type.STRING },
                bpm: { type: Type.INTEGER },
                key: { type: Type.STRING },
                mood: bilingualString,
                productionScore: { type: Type.INTEGER },
                mixQuality: bilingualString,
                vocalPresence: bilingualString,
                successScore: { type: Type.INTEGER },
                commercialViability: bilingualString,
                targetAudience: bilingualString,
                viralHooks: bilingualArray,
                socialStrategy: {
                    type: Type.OBJECT,
                    properties: {
                        tiktok: bilingualString,
                        instagram: detailedSocialSchema,
                        youtube: detailedSocialSchema
                    },
                    required: ["tiktok", "instagram", "youtube"]
                },
                marketingCampaign: bilingualString,
                marketComparison: {
                    type: Type.ARRAY,
                    items: {
                        type: Type.OBJECT,
                        properties: {
                            title: { type: Type.STRING },
                            artist: { type: Type.STRING },
                            similarityScore: { type: Type.INTEGER },
                            reason: bilingualString,
                            differentiator: bilingualString
                        },
                        required: ["title", "artist", "similarityScore", "reason", "differentiator"]
                    }
                },
                preRelease: {
                    type: Type.OBJECT,
                    properties: {
                        checklist: bilingualArray,
                        assetsNeeded: bilingualArray
                    },
                    required: ["checklist", "assetsNeeded"]
                },
                postReleaseSchedule: {
                    type: Type.OBJECT,
                    properties: {
                        week1: bilingualArray,
                        week2: bilingualArray,
                        month1: bilingualArray
                    },
                    required: ["week1", "week2", "month1"]
                }
            },
            required: [
              "title", "artist", "genre", "bpm", "key", "mood", 
              "productionScore", "mixQuality", "vocalPresence", 
              "successScore", "commercialViability", "targetAudience", 
              "viralHooks", "socialStrategy", "marketingCampaign",
              "marketComparison", "preRelease", "postReleaseSchedule"
            ]
        }
      }
    });

    const text = response.text;
    if (!text) {
        throw new Error(`AI Analysis Failed. No response text.`);
    }
    
    // Clean potential markdown blocks just in case
    const cleanText = text.replace(/```json/g, '').replace(/```/g, '').trim();
    return JSON.parse(cleanText) as SongAnalysisData;

  } catch (error: any) {
    console.error("Analysis failed:", error);
    // Mejor manejo de errores para el frontend
    if (error.message?.includes("API key")) {
        throw new Error("System Identity Error: API KEY INVALID OR MISSING. Check environment variables.");
    }
    throw error;
  }
};

export const editCoverArt = async (imageBase64: string, prompt: string): Promise<string> => {
  const ai = getClient();
  const modelId = "gemini-2.5-flash-image";

  try {
    const response = await ai.models.generateContent({
      model: modelId,
      contents: {
        parts: [
          {
            inlineData: {
              mimeType: "image/png", 
              data: imageBase64
            }
          },
          {
            text: prompt
          }
        ]
      }
    });

    if (response.candidates && response.candidates.length > 0) {
        for (const part of response.candidates[0].content.parts) {
            if (part.inlineData && part.inlineData.data) {
                return part.inlineData.data;
            }
        }
    }
    
    throw new Error("No image generated.");
  } catch (error) {
    console.error("Cover Art Edit failed:", error);
    throw error;
  }
};