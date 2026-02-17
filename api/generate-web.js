/**
 * Vercel Serverless – Gemini ile web şablonu (HTML/CSS) üretimi
 * Ortam değişkeni: GEMINI_API_KEY | GOOGLE_AI_API_KEY | GOOGLE_GENERATIVE_AI_API_KEY
 */
import { getGeminiApiKey } from '../utils/gemini-key.js';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Sadece POST desteklenir' });

  const apiKey = getGeminiApiKey();
  if (!apiKey) {
    return res.status(500).json({ error: 'Gemini API anahtarı tanımlı değil.' });
  }

  const { prompt } = req.body || {};
  if (!prompt || typeof prompt !== 'string') {
    return res.status(400).json({ error: 'Prompt gerekli' });
  }

  const cleanPrompt = prompt.trim().slice(0, 800);
  if (!cleanPrompt) {
    return res.status(400).json({ error: 'Prompt boş olamaz' });
  }

  const systemPrompt = `Sen bir web tasarım uzmanısın. Kullanıcının istediği tek sayfalık HTML+CSS şablonu üret.

KURALLAR:
1. Sadece geçerli HTML döndür. Markdown, \`\`\`, açıklama veya ek metin YAZMA.
2. Tüm CSS <style> etiketi içinde inline olacak.
3. Tek sayfa, responsive, modern tasarım.
4. Tam çalışır HTML: <!DOCTYPE html> ile başla, tüm tag'ler kapalı olsun.
5. İçerik placeholder (örnek metin) kullanılabilir.
6. Kullanıcı ne isterse ona göre: landing page, portfolio, kartvizit, form sayfası vb.

Kullanıcı isteği: "${cleanPrompt}"

Sadece HTML kodu döndür, başka hiçbir şey yazma.`;

  try {
    const model = 'gemini-2.0-flash';
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;

    const body = {
      contents: [{ role: 'user', parts: [{ text: systemPrompt }] }],
      generationConfig: {
        temperature: 0.7,
        maxOutputTokens: 8192,
      }
    };

    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    });

    if (!response.ok) {
      const err = await response.json().catch(() => ({}));
      const msg = err.error?.message || response.statusText;
      return res.status(response.status).json({ error: msg });
    }

    const data = await response.json();
    let html = data.candidates?.[0]?.content?.parts?.[0]?.text?.trim() || '';

    // Markdown kod bloğu varsa temizle
    html = html.replace(/^```html?\s*/i, '').replace(/```\s*$/i, '').trim();
    if (!html || html.length < 50) {
      return res.status(500).json({ error: 'Geçerli HTML üretilemedi.' });
    }

    return res.status(200).json({ html });
  } catch (err) {
    console.error('generate-web error:', err);
    return res.status(500).json({ error: err.message || 'Sunucu hatası' });
  }
}
