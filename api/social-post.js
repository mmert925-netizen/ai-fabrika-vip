/**
 * Vercel Serverless – Sosyal medya postu üretimi (Gemini)
 */
export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Sadece POST desteklenir' });

  const apiKey = process.env.gemini_api_key || process.env.GEMINI_API_KEY;
  if (!apiKey) return res.status(500).json({ error: 'GEMINI_API_KEY tanımlı değil' });

  const { topic } = req.body || {};
  const text = (topic || 'ÖMER.AI Fabrika').trim().slice(0, 500);

  try {
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;
    const body = {
      contents: [{ role: 'user', parts: [{ text: `Sosyal medya (Instagram/LinkedIn/Twitter) için 2-3 cümlelik çekici, profesyonel bir post metni yaz. Konu: ${text}. Emoji kullan, hashtag ekle.` }] }],
      generationConfig: { temperature: 0.8, maxOutputTokens: 300 }
    };
    const response = await fetch(url, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
    const data = await response.json();
    const reply = data.candidates?.[0]?.content?.parts?.[0]?.text?.trim() || 'Post üretilemedi.';
    return res.status(200).json({ post: reply });
  } catch (err) {
    console.error('social-post error:', err);
    return res.status(500).json({ error: err.message || 'Sunucu hatası' });
  }
}
