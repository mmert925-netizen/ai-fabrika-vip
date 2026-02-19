/**
 * Video API – status + content tek endpoint
 * GET ?jobId=xx&provider=sora|replicate|runway → durum (JSON)
 * GET ?jobId=xx&content=1 → Sora video stream (binary)
 */
export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'GET') return res.status(405).json({ error: 'Sadece GET' });

  const jobId = req.query?.jobId;
  const provider = (req.query?.provider || 'sora').toLowerCase();
  const wantContent = req.query?.content === '1';

  if (!jobId) return res.status(400).json({ error: 'jobId gerekli' });

  if (wantContent) {
    const apiKey = (process.env.SORA_API_KEY || process.env.OPENAI_API_KEY || '').trim();
    if (!apiKey) return res.status(503).json({ error: 'API key yok' });
    try {
      const contentRes = await fetch(`https://api.openai.com/v1/videos/${jobId}/content`, {
        headers: { 'Authorization': `Bearer ${apiKey}` }
      });
      if (!contentRes.ok) {
        const err = await contentRes.text();
        return res.status(contentRes.status).json({ error: err || 'Video alınamadı' });
      }
      const contentType = contentRes.headers.get('content-type') || 'video/mp4';
      res.setHeader('Content-Type', contentType);
      res.setHeader('Cache-Control', 'public, max-age=3600');
      const buffer = await contentRes.arrayBuffer();
      return res.send(Buffer.from(buffer));
    } catch (err) {
      console.error('video-content error:', err);
      return res.status(500).json({ error: err.message || 'Sunucu hatası' });
    }
  }

  try {
    if (provider === 'sora') {
      const apiKey = (process.env.SORA_API_KEY || process.env.OPENAI_API_KEY || '').trim();
      if (!apiKey) return res.status(503).json({ error: 'API key yok', code: 'API_KEY_MISSING' });
      const statusRes = await fetch(`https://api.openai.com/v1/videos/${jobId}`, {
        headers: { 'Authorization': `Bearer ${apiKey}` }
      });
      if (!statusRes.ok) {
        const err = await statusRes.json().catch(() => ({}));
        return res.status(statusRes.status).json({ error: err.error?.message || statusRes.statusText });
      }
      const job = await statusRes.json();
      const status = job.status || 'unknown';
      const progress = job.progress ?? 0;
      if (status === 'completed') {
        return res.status(200).json({ status: 'completed', progress: 100, videoUrl: `/api/video?jobId=${jobId}&content=1`, jobId });
      }
      if (status === 'failed') {
        return res.status(200).json({ status: 'failed', progress: 0, error: job.error?.message || 'Video üretimi başarısız' });
      }
      return res.status(200).json({ status, progress, jobId });
    }

    if (provider === 'replicate') {
      const token = (process.env.REPLICATE_API_TOKEN || '').trim();
      if (!token) return res.status(503).json({ error: 'REPLICATE_API_TOKEN yok', code: 'API_KEY_MISSING' });
      const statusRes = await fetch(`https://api.replicate.com/v1/predictions/${jobId}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (!statusRes.ok) {
        const err = await statusRes.json().catch(() => ({}));
        return res.status(statusRes.status).json({ error: err.detail || err.error || statusRes.statusText });
      }
      const pred = await statusRes.json();
      const status = pred.status || 'unknown';
      if (status === 'succeeded') {
        const output = pred.output;
        let videoUrl = null;
        if (typeof output === 'string' && output.startsWith('http')) videoUrl = output;
        else if (output?.url) videoUrl = output.url;
        else if (Array.isArray(output) && output[0]) videoUrl = typeof output[0] === 'string' ? output[0] : output[0].url;
        if (videoUrl) {
          console.log('Görsel URL alındı:', videoUrl);
          return res.status(200).json({ status: 'completed', progress: 100, videoUrl, jobId });
        }
      }
      if (status === 'failed' || status === 'canceled') {
        return res.status(200).json({ status: 'failed', progress: 0, error: pred.error || 'Video üretimi başarısız' });
      }
      const progress = status === 'processing' ? 50 : status === 'starting' ? 10 : 0;
      return res.status(200).json({ status, progress, jobId });
    }

    if (provider === 'runway') {
      const apiKey = (process.env.RUNWAY_API_KEY || process.env.RUNWAYML_API_SECRET || '').trim();
      if (!apiKey) return res.status(503).json({ error: 'RUNWAY_API_KEY yok', code: 'API_KEY_MISSING' });
      const statusRes = await fetch(`https://api.dev.runwayml.com/v1/tasks/${jobId}`, {
        headers: { 'Authorization': `Bearer ${apiKey}`, 'X-Runway-Version': '2024-11-06' }
      });
      if (!statusRes.ok) {
        const err = await statusRes.json().catch(() => ({}));
        return res.status(statusRes.status).json({ error: err.message || err.error || statusRes.statusText });
      }
      const task = await statusRes.json();
      const status = (task.status || '').toUpperCase();
      if (status === 'SUCCEEDED') {
        const output = task.output;
        let videoUrl = null;
        if (Array.isArray(output) && output[0]) videoUrl = typeof output[0] === 'string' ? output[0] : output[0]?.url;
        else if (typeof output === 'string' && output.startsWith('http')) videoUrl = output;
        if (videoUrl) return res.status(200).json({ status: 'completed', progress: 100, videoUrl, jobId });
      }
      if (status === 'FAILED' || status === 'CANCELLED') {
        return res.status(200).json({ status: 'failed', progress: 0, error: task.error?.message || task.message || 'Video üretimi başarısız' });
      }
      const progress = (status === 'RUNNING' || status === 'THROTTLED') ? 50 : status === 'PENDING' ? 10 : 0;
      return res.status(200).json({ status, progress, jobId });
    }

    return res.status(400).json({ error: 'Geçersiz provider: sora, replicate, runway' });
  } catch (err) {
    console.error('video-status error:', err);
    return res.status(500).json({ error: err.message || 'Sunucu hatası' });
  }
}
