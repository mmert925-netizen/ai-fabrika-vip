/**
 * Vercel Serverless – Güncel haber özeti (RSS + Gemini)
 */
export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'GET') return res.status(405).json({ error: 'Sadece GET desteklenir' });

  const apiKey = process.env.gemini_api_key || process.env.GEMINI_API_KEY;
  if (!apiKey) return res.status(500).json({ error: 'GEMINI_API_KEY tanımlı değil' });

  try {
    const rssUrl = 'https://www.cnnturk.com/feed/66/index.rss';
    const rssRes = await fetch(rssUrl, { headers: { 'User-Agent': 'Mozilla/5.0' } });
    const xml = await rssRes.text();
    const titleMatches = xml.match(/<title>([^<]+)<\/title>/gi) || [];
    const headlines = titleMatches.slice(1, 6).map(t => t.replace(/<\/?title>/gi, '').trim()).filter(Boolean);

    if (headlines.length === 0) return res.status(200).json({ summary: 'Haber çekilemedi.', headlines: [] });

    const prompt = `Bu güncel haber başlıklarını 2-3 cümleyle kısa özetle (Türkçe):\n${headlines.join('\n')}`;
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;
    const body = { contents: [{ role: 'user', parts: [{ text: prompt }] }], generationConfig: { temperature: 0.3, maxOutputTokens: 256 } };
    const aiRes = await fetch(url, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
    const data = await aiRes.json();
    const summary = data.candidates?.[0]?.content?.parts?.[0]?.text?.trim() || headlines.join('. ');
    return res.status(200).json({ summary, headlines });
  } catch (err) {
    console.error('news-summary error:', err);
    return res.status(500).json({ error: err.message || 'Sunucu hatası' });
  }
}
