/**
 * Gemini API anahtarı – birden fazla env değişkeni adı desteklenir
 * Vercel: GEMINI_API_KEY | GOOGLE_AI_API_KEY | GOOGLE_GENERATIVE_AI_API_KEY
 */
export function getGeminiApiKey() {
  return (
    process.env.GEMINI_API_KEY ||
    process.env.gemini_api_key ||
    process.env.GOOGLE_AI_API_KEY ||
    process.env.GOOGLE_GENERATIVE_AI_API_KEY ||
    ''
  );
}
