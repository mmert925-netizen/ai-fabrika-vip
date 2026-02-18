/**
 * Supabase veri senkronizasyonu – gallery ve preferences
 * SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY veya SUPABASE_ANON_KEY
 */
import { getSupabase, isSupabaseConfigured } from '../utils/supabase.js';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'GET' && req.method !== 'POST') {
    return res.status(405).json({ error: 'Sadece GET ve POST' });
  }

  if (!isSupabaseConfigured()) {
    return res.status(503).json({ error: 'Supabase yapılandırılmamış', configured: false });
  }

  const supabase = getSupabase();
  const deviceId = req.method === 'GET'
    ? (req.query?.device_id || '').trim()
    : (req.body?.device_id || '').trim();

  if (!deviceId || deviceId.length < 8) {
    return res.status(400).json({ error: 'device_id gerekli (min 8 karakter)' });
  }

  try {
    if (req.method === 'GET') {
      const [galleryRes, prefsRes] = await Promise.all([
        supabase.from('omerai_gallery').select('*').eq('device_id', deviceId).order('created_at', { ascending: false }),
        supabase.from('omerai_preferences').select('*').eq('device_id', deviceId).single()
      ]);

      const gallery = (galleryRes.data || []).map(r => ({ src: r.src, serialNo: r.serial_no, id: r.id }));
      const prefs = prefsRes.data || null;

      return res.status(200).json({
        gallery,
        preferences: prefs ? {
          tokens: prefs.tokens ?? 0,
          theme: prefs.theme ?? 'dark',
          lang: prefs.lang ?? 'tr',
          portal_stage: prefs.portal_stage,
          portal_ts: prefs.portal_ts,
          seal_serial: prefs.seal_serial ?? 4948
        } : null
      });
    }

    if (req.method === 'POST') {
      const { action, gallery, preferences } = req.body || {};

      if (action === 'gallery') {
        if (!Array.isArray(gallery)) {
          return res.status(400).json({ error: 'gallery array gerekli' });
        }
        await supabase.from('omerai_gallery').delete().eq('device_id', deviceId);
        if (gallery.length > 0) {
          const rows = gallery.map(g => ({
            device_id: deviceId,
            src: g.src || '',
            serial_no: g.serialNo ?? 0
          }));
          const { error } = await supabase.from('omerai_gallery').insert(rows);
          if (error) throw error;
        }
        return res.status(200).json({ ok: true });
      }

      if (action === 'preferences') {
        if (!preferences || typeof preferences !== 'object') {
          return res.status(400).json({ error: 'preferences object gerekli' });
        }
        const { error } = await supabase.from('omerai_preferences').upsert({
          device_id: deviceId,
          tokens: preferences.tokens ?? 0,
          theme: preferences.theme ?? 'dark',
          lang: preferences.lang ?? 'tr',
          portal_stage: preferences.portal_stage ?? null,
          portal_ts: preferences.portal_ts ?? null,
          seal_serial: preferences.seal_serial ?? 4948,
          updated_at: new Date().toISOString()
        }, { onConflict: 'device_id' });
        if (error) throw error;
        return res.status(200).json({ ok: true });
      }

      return res.status(400).json({ error: 'action: gallery veya preferences' });
    }
  } catch (err) {
    console.error('supabase-sync error:', err);
    return res.status(500).json({ error: err.message || 'Sunucu hatası' });
  }
}
