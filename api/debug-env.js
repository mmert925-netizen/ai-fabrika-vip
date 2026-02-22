/**
 * API anahtarlarının sunucuya ulaşıp ulaşmadığını kontrol et.
 * Token değerlerini ASLA gösterme, sadece durum.
 */
export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Cache-Control', 'no-store, max-age=0');
  if (req.method === 'OPTIONS') return res.status(200).end();

  const rep = (process.env.REPLICATE_API_TOKEN || process.env.REPLICATE_API_KEY || '').trim();
  const repClean = rep.replace(/^["']|["']$/g, '');
  const runway = (process.env.RUNWAY_API_KEY || process.env.RUNWAYML_API_SECRET || '').trim();

  const result = {
    replicate: !repClean ? 'YOK' : repClean.startsWith('r8_') && repClean.length >= 35 ? 'OK' : 'FORMAT_HATALI',
    runway: !runway ? 'YOK' : /^key_[0-9a-f]{128}$/i.test(runway) ? 'OK' : 'FORMAT_HATALI',
    env: process.env.VERCEL_ENV || 'development'
  };

  return res.status(200).json(result);
}
