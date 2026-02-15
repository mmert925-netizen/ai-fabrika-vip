import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// RSS beslemelerinden haber çekme fonksiyonu
async function fetchNewsFromRSS() {
  try {
    // Basit bir haberci API kullanıyor (free, Türkçe haber)
    const response = await fetch(
      "https://feeds.bloomberg.com/markets/news.rss"
    );
    const text = await response.text();

    // XML'den başlıkları çıkar
    const titleMatches = text.match(/<title>([^<]+)<\/title>/g) || [];
    const titles = titleMatches
      .slice(1, 11) // İlk 10 haber
      .map((t) => t.replace(/<\/?title>/g, ""));

    return titles;
  } catch (error) {
    console.log("RSS çekme hatası, fallback kullanılıyor");
    return [
      "Teknoloji sektöründe yeni gelişmeler",
      "Yapay zeka alanında atılımlar",
      "Dijital dönüşüm hızlanıyor",
      "Startup ekosistemi büyüyor",
      "Siber güvenlik tehditleri artıyor",
    ];
  }
}

// Gemini ile özet yapma
async function generateNewsSummary(headlines) {
  const model = genAI.getGenerativeModel({ model: "gemini-pro" });

  const prompt = `
Aşağıdaki günlük haber başlıklarından bir özet oluştur. 
Türkçe ve kısa olsun (3-4 paragraf).
Emoji kullan, dinamik ve ilgi çekici ol.

Haberler:
${headlines.map((h) => `- ${h}`).join("\n")}

Özet:
`;

  try {
    const result = await model.generateContent(prompt);
    const summary = await result.response.text();
    return summary;
  } catch (error) {
    console.error("Gemini özetleme hatası:", error);
    return "Haberler alınırken bir sorun oluştu. Lütfen tekrar dene.";
  }
}

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Yalnızca GET yöntemi destekleniyor" });
  }

  try {
    // Haberler çek
    const headlines = await fetchNewsFromRSS();

    // Gemini ile özet yap
    const summary = await generateNewsSummary(headlines);

    return res.status(200).json({
      success: true,
      summary: summary,
      headline_count: headlines.length,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("API hatası:", error);
    return res.status(500).json({
      error: "Haberler alınırken bir sorun oluştu",
      details: error.message,
    });
  }
}
