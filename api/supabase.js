/**
 * Supabase API – config + sync tek endpoint
 * GET ?config=1 → public config (URL, anon key)
 * GET ?device_id=xxx → gallery + preferences
 * POST → sync (body: device_id, action, gallery|preferences)
 *
 * Base64 görseller otomatik olarak Supabase Storage'a yüklenir, tabloya URL yazılır.
 */
import { getSupabase, isSupabaseConfigured } from '../utils/supabase.js';

const STORAGE_BUCKET = 'omerai-gallery';

async function uploadBase64ToStorage(supabase, deviceId, dataUrl, serialNo, index) {
  const match = dataUrl.match(/^data:image\/(\w+);base64,(.+)$/);
  if (!match) return dataUrl;
  const [, ext, base64] = match;
  const contentType = `image/${ext === 'jpeg' ? 'jpeg' : ext}`;
  const buffer = Buffer.from(base64, 'base64');
  const path = `${deviceId}/${Date.now()}_${serialNo || index}.${ext === 'jpeg' ? 'jpg' : 'png'}`;
  const { data, error } = await supabase.storage.from(STORAGE_BUCKET).upload(path, buffer, {
    contentType,
    upsert: true
  });
  if (error) throw new Error(`Storage upload hatası: ${error.message}`);
  const { data: urlData } = supabase.storage.from(STORAGE_BUCKET).getPublicUrl(path);
  return urlData.publicUrl;
}

function cors(res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
}

export default async function handler(req, res) {
  cors(res);
  if (req.method === 'OPTIONS') return res.status(200).end();

  if (req.method === 'GET') {
    if (req.query?.config === '1') {
      const url = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL || '';
      const anonKey = process.env.SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
      return res.status(200).json(url && anonKey ? { configured: true, url, anonKey } : { configured: false });
    }
    const deviceId = (req.query?.device_id || '').trim();
    if (!deviceId || deviceId.length < 8) {
      return res.status(400).json({ error: 'device_id gerekli (min 8 karakter)' });
    }
    if (!isSupabaseConfigured()) {
      return res.status(503).json({ error: 'Supabase yapılandırılmamış', configured: false });
    }
    try {
      const supabase = getSupabase();
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
    } catch (err) {
      console.error('supabase sync error:', err);
      return res.status(500).json({ error: err.message || 'Sunucu hatası' });
    }
  }

  if (req.method === 'POST') {
    if (!isSupabaseConfigured()) {
      return res.status(503).json({ error: 'Supabase yapılandırılmamış', configured: false });
    }
    const { action, gallery, preferences, image, device_id, serial_no } = req.body || {};
    if (action === 'upload_image') {
      const dataUrl = typeof image === 'string' ? image : '';
      if (!dataUrl || !dataUrl.startsWith('data:image/')) {
        return res.status(400).json({ error: 'image (data URL) gerekli' });
      }
      const match = dataUrl.match(/^data:image\/(\w+);base64,(.+)$/);
      if (!match) return res.status(400).json({ error: 'Geçersiz base64 format' });
      const [, ext, base64] = match;
      const buffer = Buffer.from(base64, 'base64');
      const deviceId = (device_id || 'anon').toString().slice(0, 64);
      const path = `${deviceId}/${Date.now()}_${serial_no || 0}.${ext === 'jpeg' ? 'jpg' : 'png'}`;
      try {
        const supabase = getSupabase();
        const { error } = await supabase.storage.from(STORAGE_BUCKET).upload(path, buffer, {
          contentType: `image/${ext === 'jpeg' ? 'jpeg' : ext}`,
          upsert: true
        });
        if (error) throw new Error(error.message);
        const { data } = supabase.storage.from(STORAGE_BUCKET).getPublicUrl(path);
        return res.status(200).json({ url: data.publicUrl });
      } catch (err) {
        console.error('upload_image error:', err);
        return res.status(500).json({ error: err.message || 'Yükleme hatası' });
      }
    }
    const deviceId = (req.body?.device_id || '').trim();
    if (!deviceId || deviceId.length < 8) {
      return res.status(400).json({ error: 'device_id gerekli (min 8 karakter)' });
    }
    try {
      const supabase = getSupabase();
      if (action === 'gallery') {
        if (!Array.isArray(gallery)) return res.status(400).json({ error: 'gallery array gerekli' });
        console.log('Supabase kayıt işlemi başlıyor...');
        await supabase.from('omerai_gallery').delete().eq('device_id', deviceId);
        if (gallery.length > 0) {
          const rows = [];
          for (let i = 0; i < gallery.length; i++) {
            const g = gallery[i];
            let src = g.src || '';
            if (src.startsWith('data:image')) {
              src = await uploadBase64ToStorage(supabase, deviceId, src, g.serialNo ?? 0, i);
              console.log('Görsel Storage\'a yüklendi, URL:', src);
            }
            rows.push({ device_id: deviceId, src, serial_no: g.serialNo ?? 0 });
          }
          const { error } = await supabase.from('omerai_gallery').insert(rows);
          if (error) {
            console.log('KAYIT HATASI:', error.message);
            throw error;
          }
          console.log('TABLOYA YAZILDI!');
        }
        return res.status(200).json({ ok: true });
      }
      if (action === 'preferences') {
        if (!preferences || typeof preferences !== 'object') return res.status(400).json({ error: 'preferences object gerekli' });
        console.log('Supabase kayıt işlemi başlıyor...');
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
        if (error) {
          console.log('KAYIT HATASI:', error.message);
          throw error;
        }
        console.log('TABLOYA YAZILDI!');
        return res.status(200).json({ ok: true });
      }
      return res.status(400).json({ error: 'action: gallery veya preferences' });
    } catch (err) {
      console.log('KAYIT HATASI:', err.message || err);
      console.error('supabase sync error:', err);
      return res.status(500).json({ error: err.message || 'Sunucu hatası' });
    }
  }

  return res.status(405).json({ error: 'Sadece GET ve POST' });
}
