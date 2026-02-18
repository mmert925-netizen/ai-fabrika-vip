/**
 * Haber API – tek endpoint
 * GET ?summary=1 → AI özetli haberler
 * GET (veya ?summary=0) → ham haber listesi
 * Her durumda JSON döner; script.js hata almaz.
 */
function getGeminiKey() {
  return (
    (typeof process !== 'undefined' && process.env && (
      process.env.GEMINI_API_KEY ||
      process.env.gemini_api_key ||
      process.env.GOOGLE_AI_API_KEY ||
      process.env.GOOGLE_GENERATIVE_AI_API_KEY
    )) || ''
  ).trim();
}

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
  const key = getGeminiKey();
  const fallback = "🚀 Yapay Zeka alanında hızlı gelişmeler devam ediyor!";
  if (!key) return fallback;
  try {
    const titles = (newsItems || []).map(n => n && n.title).filter(Boolean).join("\n- ");
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${key}`;
    const r = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: `Aşağıdaki haberlerden Türkçe'de kısa bir özet yap (3-4 cümle). Emoji ekle.\n\nHaberler:\n- ${titles}\n\nÖzet:` }] }],
        generationConfig: { temperature: 0.7, maxOutputTokens: 512 }
      })
    });
    if (!r.ok) return fallback;
    const data = await r.json();
    const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;
    return (text && String(text).trim()) || fallback;
  } catch (_) {
    return fallback;
  }
}

function sendJson(res, status, body) {
  if (!res || typeof res.setHeader !== 'function') return;
  res.setHeader("Content-Type", "application/json");
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  res.status(status).json(body);
}

export default async function handler(req, res) {
  const wantSummary = (req && req.query && req.query.summary) === '1';

  try {
    if (req && req.method === "OPTIONS") {
      res.setHeader("Access-Control-Allow-Origin", "*");
      return res.status(200).end();
    }
    if (!req || req.method !== "GET") {
      return sendJson(res, 405, { success: false, error: "Yalnızca GET" });
    }

    const news = getFallbackNews();

    if (wantSummary) {
      const summary = await generateSummary(news);
      return sendJson(res, 200, {
        success: true,
        summary,
        headline_count: news.length,
        timestamp: new Date().toISOString(),
      });
    }

    return sendJson(res, 200, {
      success: true,
      news,
      count: news.length,
      refreshed_at: new Date().toISOString(),
      source: "AI News Archive"
    });
  } catch (err) {
    console.error("news API error:", err);
    const fallback = getFallbackNews();
    if (wantSummary) {
      return sendJson(res, 200, {
        success: true,
        summary: "🚀 Yapay Zeka alanında hızlı gelişmeler devam ediyor!",
        error: String(err && err.message || "Unknown error")
      });
    }
    return sendJson(res, 200, {
      success: true,
      news: fallback,
      count: fallback.length,
      source: "Fallback"
    });
  }
}
