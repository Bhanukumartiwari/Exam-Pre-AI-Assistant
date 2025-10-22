
import { GoogleGenAI, Chat, GroundingChunk } from "@google/genai";

let chat: Chat | null = null;

const getChatInstance = (): Chat => {
    if (!chat) {
        const ai = new GoogleGenAI({ apiKey: process.env.API_KEY! });
        chat = ai.chats.create({
            model: 'gemini-2.5-flash',
            config: {
                systemInstruction: `You are an expert AI assistant for Indian government exam preparation. Your goal is to provide clear, concise, and simplified answers on topics like science, technology, history, Indian polity, geography, and current affairs. Use the provided search results from the googleSearch tool to answer questions about recent events accurately. Format your answers in a readable way, using lists and paragraphs.`,
                tools: [{googleSearch: {}}]
            }
        });
    }
    return chat;
}

export const sendMessageStream = (
    message: string,
    onChunk: (text: string, sources: GroundingChunk[]) => void
): Promise<void> => {
    return new Promise(async (resolve, reject) => {
        try {
            const chatInstance = getChatInstance();
            const result = await chatInstance.sendMessageStream({ message });

            let fullText = "";
            let finalSources: GroundingChunk[] = [];

            for await (const chunk of result) {
                // The API can sometimes send empty text chunks while processing.
                const chunkText = chunk.text ?? '';
                fullText += chunkText;
                
                const sources = chunk.candidates?.[0]?.groundingMetadata?.groundingChunks ?? [];
                if (sources.length > 0) {
                    finalSources = sources;
                }
                
                onChunk(fullText, finalSources);
            }
            resolve();
        } catch (error) {
            console.error("Error sending message to Gemini:", error);
            reject(error);
        }
    });
}
