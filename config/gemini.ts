
// Gemini AI configuration
// Used for chatbot functionality

const geminiConfig = {
  apiKey: import.meta.env.VITE_GEMINI_API_KEY || "",
  model: "gemini-pro", // Default model
  temperature: 0.7,
  topK: 40,
  topP: 0.95,
  maxOutputTokens: 1024,
};

export default geminiConfig;

// Helper function to check if Gemini API key is set
export const hasGeminiApiKey = () => {
  return !!geminiConfig.apiKey;
};
