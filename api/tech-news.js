// Fallback haberler (gerçek haber kaynakları simüle et)
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
    {
      title: "Türkiye'de AI Startup Fonlama Rekor Kırdı",
      source: "Teknofest",
      publishedAt: new Date().toLocaleDateString("tr-TR"),
      url: "https://teknofest.org",
    },
    {
      title: "Stability AI Stable Diffusion 3 Yayınladı",
      source: "Stability AI",
      publishedAt: new Date().toLocaleDateString("tr-TR"),
      url: "https://stability.ai",
    },
    {
      title: "Multimodal AI Modelleri Endüstriyi Değiştiriyor",
      source: "MIT News",
      publishedAt: new Date().toLocaleDateString("tr-TR"),
      url: "https://news.mit.edu",
    },
    {
      title: "Etik AI ve Düzenleme Tartışmaları Tırmanıyor",
      source: "Nature",
      publishedAt: new Date().toLocaleDateString("tr-TR"),
      url: "https://nature.com",
    },
  ];
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

    return res.status(200).json({
      success: true,
      news: news,
      count: news.length,
      refreshed_at: new Date().toISOString(),
      source: "AI News Archive"
    });
  } catch (error) {
    console.error("API hatası:", error);
    return res.status(200).json({
      success: true,
      news: getFallbackNews(),
      source: "Fallback"
    });
  }
}
