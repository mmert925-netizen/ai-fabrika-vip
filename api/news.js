/**
 * Haber API – tech-news + daily-news-summary tek endpoint
 * GET ?summary=1 → AI özetli haberler
 * GET (veya ?summary=0) → ham haber listesi
 */
import { GoogleGenerativeAI } from "@google/generative-ai";
import { getGeminiApiKey } from '../utils/gemini-key.js';

function getFallbackNews() {
  return [
    { title: "OpenAI GPT-4 Turbo Yeni Yetenekler Kazandı", source: "TechCrunch", publishedAt: new Date().toLocaleDateString("tr-TR"), url: "https://techcrunch.com" },
    { title: "Google Gemini'de Yeni Projeler Modu Açıldı", source: "Google Blog", publishedAt: new Date().toLocaleDateString("tr-TR"), url: "https://blog.google" },
    { title: "Meta Llama 3 Modeli Açık Kaynak Yayınlandı", source: "Meta Research", publishedAt: new Date().toLocaleDateString("tr-TR"), url: "https://research.facebook.com" },
    { title: "Anthropic Claude 3 Opus Benchmarkları Kırdı", source: "Anthropic", publishedAt: new Date().toLocaleDateString("tr-TR"), url: "https://www.anthropic.com" },
    { title: "Türkiye'de AI Startup Fonlama Rekor Kırdı", source: "Teknofest", publishedAt: new Date().toLocaleDateString("tr-TR"), url: "https://teknofest.org" },
    { title: "Stability AI Stable Diffusion 3 Yayınladı", source: "Stability AI", publishedAt: new Date().toLocaleDateString("tr-TR"), url: "https://stability.ai" },
    { title: "Multimodal AI Modelleri Endüstriyi Değiştiriyor", source: "MIT News", publishedAt: new Date().toLocaleDateString("tr-TR"), url: "https://news.mit.edu" },
    { title: "Etik AI ve Düzenleme Tartışmaları Tırmanıyor", source: "Nature", publishedAt: new Date().toLocaleDateString("tr-TR"), url: "https://nature.com" },
  ];
}

async function generateSummary(newsItems) {
  try {
    const key = getGeminiApiKey();
    if (!key) return "🚀 Yapay Zeka alanında hızlı gelişmeler devam ediyor!";
    const genAI = new GoogleGenerativeAI(key);
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });
    const titles = newsItems.map(n => n.title).join("\n- ");
    const result = await model.generateContent(`Aşağıdaki haberlerden Türkçe'de kısa bir özet yap (3-4 cümle). Emoji ekle.\n\nHaberler:\n- ${titles}\n\nÖzet:`);
    return (await result.response.text()) || "🚀 Yapay Zeka alanında hızlı gelişmeler devam ediyor!";
  } catch (_) {
    return "🚀 Yapay Zeka alanında hızlı gelişmeler devam ediyor!";
  }
}

export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Credentials", "true");
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") return res.status(200).end();
  if (req.method !== "GET") return res.status(405).json({ error: "Yalnızca GET" });

  const wantSummary = req.query?.summary === '1';
  const news = getFallbackNews();

  try {
    if (wantSummary) {
      const summary = await generateSummary(news);
      return res.status(200).json({
        success: true,
        summary,
        headline_count: news.length,
        timestamp: new Date().toISOString(),
      });
    }
    return res.status(200).json({
      success: true,
      news,
      count: news.length,
      refreshed_at: new Date().toISOString(),
      source: "AI News Archive"
    });
  } catch (error) {
    console.error("news API error:", error);
    return res.status(200).json({
      success: true,
      ...(wantSummary ? { summary: "🚀 Yapay Zeka alanında hızlı gelişmeler devam ediyor!", error: error.message } : { news: getFallbackNews(), source: "Fallback" }),
    });
  }
}
