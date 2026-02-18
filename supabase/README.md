# ÖMER.AI Supabase Kurulumu

Veri kalıcılığı için [Supabase](https://supabase.com) entegrasyonu.

## 1. Supabase Projesi

1. [supabase.com](https://supabase.com) → Yeni proje oluştur
2. **Settings** → **API** → `Project URL` ve `anon public` key'i kopyala

## 2. SQL Şeması

**SQL Editor**'da `schema.sql` dosyasının içeriğini çalıştırın.

## 3. Vercel Environment Variables

Vercel → Proje → **Settings** → **Environment Variables**:

| Değişken | Değer |
|----------|-------|
| `SUPABASE_URL` | Proje URL (örn. https://xxx.supabase.co) |
| `SUPABASE_ANON_KEY` | anon public key |

## 4. Redeploy

Değişkenleri ekledikten sonra **Redeploy** yapın.

---

Senkronize edilen veriler:
- **Galeri** – Üretilen görseller
- **Token/Mühür** – Kullanıcı kredisi
- **Tema/Dil** – Tercihler
- **Portal** – Müşteri portalı aşaması
- **Seri no** – Mühür seri numarası
