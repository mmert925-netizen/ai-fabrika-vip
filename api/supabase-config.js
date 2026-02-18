/**
 * Supabase public config – client tarafı için URL ve anon key
 * SUPABASE_URL, SUPABASE_ANON_KEY (public key, RLS ile güvenli)
 */
export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  if (req.method === 'OPTIONS') return res.status(200).end();

  const url = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL || '';
  const anonKey = process.env.SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

  if (!url || !anonKey) {
    return res.status(200).json({ configured: false });
  }

  return res.status(200).json({
    configured: true,
    url,
    anonKey
  });
}
