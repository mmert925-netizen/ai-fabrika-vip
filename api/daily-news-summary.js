import { GoogleGenerativeAI } from "@google/generative-ai";
import { getGeminiApiKey } from '../utils/gemini-key.js';

function getGenAI() {
  const key = getGeminiApiKey();
  return key ? new GoogleGenerativeAI(key) : null;
}

// Fallback haberler
function getFallbackNews() {
  return [
    {
      title: "OpenAI GPT-4 Turbo Yeni Yetenekler Kazandı",
      source: "TechCrunch",
      publishedAt: new Date().toLocaleDateString("tr-TR"),
      url: "https://techcrunch.com",
    },
    {
      title: "Google Gemini'de Yeni Projeler Modu Açıldı",
      source: "Google Blog",
      publishedAt: new Date().toLocaleDateString("tr-TR"),
      url: "https://blog.google",
    },
    {
      title: "Meta Llama 3 Modeli Açık Kaynak Yayınlandı",
      source: "Meta Research",
      publishedAt: new Date().toLocaleDateString("tr-TR"),
      url: "https://research.facebook.com",
    },
    {
      title: "Anthropic Claude 3 Opus Benchmarkları Kırdı",
      source: "Anthropic",
      publishedAt: new Date().toLocaleDateString("tr-TR"),
      url: "https://www.anthropic.com",
    },
  ];
}

async function generateSummary(newsItems) {
  try {
    const genAI = getGenAI();
    if (!genAI) return "🚀 Yapay Zeka alanında hızlı gelişmeler devam ediyor!";
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });
    
    const titles = newsItems.map(n => n.title).join("\n- ");
    
    const prompt = `
Aşağıdaki haberlerden Turkish'te kısa bir özet yap (3-4 cümle). Emoji ekle.

Haberler:
- ${titles}

Özet:
`;

    const result = await model.generateContent(prompt);
    return await result.response.text();
  } catch (error) {
    return "🚀 Yapay Zeka alanında hızlı gelişmeler devam ediyor!";
  }
}

export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Credentials", "true");
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET,OPTIONS,PATCH,DELETE,POST,PUT");
  res.setHeader("Access-Control-Allow-Headers", "X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version");
  
  if (req.method === "OPTIONS") {
    res.status(200).end();
    return;
  }

  if (req.method !== "GET") {
    return res.status(405).json({ error: "Yalnızca GET yöntemi destekleniyor" });
  }

  try {
    const news = getFallbackNews();
    const summary = await generateSummary(news);

    return res.status(200).json({
      success: true,
      summary: summary,
      headline_count: news.length,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    return res.status(200).json({
      success: true,
      summary: "🚀 Yapay Zeka alanında hızlı gelişmeler devam ediyor!",
      error: error.message,
    });
  }
}
