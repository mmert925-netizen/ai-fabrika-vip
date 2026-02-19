# Supabase Storage – Görsel Galerisi

Base64 görseller otomatik olarak Storage'a yüklenir. Bucket oluşturmanız gerekir.

## 1. Bucket Oluşturma

1. **Supabase Dashboard** → **Storage** → **New bucket**
2. Bucket adı: `omerai-gallery`
3. **Public bucket** işaretleyin (görseller herkese açık olsun)
4. **Create bucket**

## 2. Storage Politikaları (RLS)

Bucket oluşturduktan sonra **Policies** sekmesinde:

- **INSERT**: Anon key ile yükleme için policy ekleyin
- **SELECT**: Public okuma için (public bucket zaten açık)

Veya SQL Editor'da:

```sql
-- omerai-gallery bucket'ı için insert izni (anon)
CREATE POLICY "Allow public uploads" ON storage.objects
FOR INSERT TO anon
WITH CHECK (bucket_id = 'omerai-gallery');

-- Public okuma (public bucket'ta genelde varsayılan açık)
CREATE POLICY "Allow public read" ON storage.objects
FOR SELECT TO public
USING (bucket_id = 'omerai-gallery');
```

## 3. Alternatif: Service Role Key

Eğer `SUPABASE_SERVICE_ROLE_KEY` kullanıyorsanız, RLS bypass edilir ve ek policy gerekmez.
