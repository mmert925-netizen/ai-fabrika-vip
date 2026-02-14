# 🤖 ÖMER.AI | Yapay Zeka Fabrikası

Yazılım ve yapay zeka ile geleceği kodla, görselleri mühürle! 

**Geleceği kodla, görselleri mühürle.** 🚀

---

## 🎯 Hizmetler

- **Yapay Zeka Modelleme**: Gemini ve Imagen 4.0 tabanlı bot ve otomasyonlar
- **Siberpunk Web Tasarımı**: Modern, hızlı, responsive web arayüzleri
- **Yazılım Otomasyonu**: Telegram entegrasyonu ve iş akışı otomasyonu
- **Görsel Üretim**: AI destekli yaratıcı görsel tasarımı

---

## ⚙️ Kurulum

### Gereksinimler
- Python 3.8+
- Node.js 16+ (web API'ları için)

### 1. Repoyu klonla
```bash
git clone https://github.com/yourrepo/omerai-fabrika.git
cd omerai-fabrika
```

### 2. Ortam dosyasını hazırla
```bash
cp .env.example .env
```

### 3. .env dosyasınızı düzenleyin
```env
GEMINI_API_KEY=your_gemini_api_key_here
TELEGRAM_BOT_TOKEN=your_telegram_bot_token_here
TELEGRAM_CHAT_ID=your_telegram_chat_id_here
```

**Credential'ları nereden alacaksınız:**
- **Gemini API Key**: https://ai.google.dev/
- **Telegram Bot Token**: @BotFather üzerinden https://core.telegram.org/bots#botfather
- **Telegram Chat ID**: [@userinfobot](https://t.me/userinfobot) kullanarak

### 4. Python bağımlılıklarını yükle
```bash
pip install -r requirements.txt
python -m nltk.downloader stopwords punkt
python -m spacy download en_core_web_sm
```

### 5. Node.js bağımlılıklarını yükle (API için)
```bash
npm install
```

---

## 📁 Proje Yapısı

```
omerai-fabrika/
├── api/                          # Vercel Serverless Functions
│   ├── chat.js                   # Gemini sohbet API
│   ├── generate-image.js         # Görsel üretim API
│   ├── ai-news-bulletin.js       # Haber raporu
│   └── ...
├── Haber_Botu/                   # Haber özetleme bot
│   └── main.py
├── Sosyal_Medya_Botu/            # Sosyal medya post üretimi
│   └── main.py
├── Yazar_Botu/                   # Makale yazı üretimi (SEO)
│   └── main.py
├── Otonom_Gelistirmeler/         # Otonom AI geliştirmeler
│   └── *.py
├── index.html                    # Ana sayfa
├── style.css                     # Stil dosyaları
├── script.js                     # Frontend logikleri
└── package.json                  # Node.js bağımlılıkları
```

---

## 🚀 Kullanım

### Python Bot'larını Çalıştırma

**Haber Botu:**
```bash
python Haber_Botu/main.py
```

**Sosyal Medya Bot:**
```bash
python Sosyal_Medya_Botu/main.py
```

**Yazar Bot:**
```bash
python Yazar_Botu/main.py
```

### Web API'sini Çalıştırma (Lokal)
```bash
npm start
```

### Vercel'e Dağıtım
1. Vercel CLI'yı yükle: `npm i -g vercel`
2. Deploy et: `vercel`
3. Environment variables'ı Vercel dashboard'da ayarla

---

## ⚠️ Güvenlik Notları

- **API anahtarlarını asla commit etmeyin!** `.env` dosyası `.gitignore`'da yer alır.
- `.env.example` dosyasını özel değerleri olmadan template'i olarak kullanın.
- Credentials'ı yalnızca yerimi çevrelerde saklayın.

---

## 🔐 Environment Variables

| Variable | Açıklama | Zorunlu |
|----------|----------|---------|
| `GEMINI_API_KEY` | Google Gemini API anahtarı | ✅ |
| `TELEGRAM_BOT_TOKEN` | Telegram bot token (BotFather'dan) | ✅ |
| `TELEGRAM_CHAT_ID` | Hedef Telegram chat/grup ID | ✅ |
| `NODE_ENV` | Ortam (production/development) | ❌ |

---

## 📊 Özel Projeler (Portfolio)

1. **Neon Şehir Manzarası** - Siberpunk tema görsel
2. **Robot Portresi** - AI destekli karakter tasarımı
3. **Sanal Evren** - Dijital sanat ve soyut görseller
4. **Mekanik Bulutlar** - Steampunk futuristik konsept
5. **Holografik İkon** - 3D holografik efekt logo
6. **Dijital Orman** - Doğa-teknoloji sentezi

Ve daha fazlası VIP hattında...

---

## 🎨 Teknoloji Stack

- **Frontend**: HTML5, CSS3, JavaScript (ES6+)
- **Backend**: Node.js, Express.js
- **AI/ML**: Google Gemini 2.0 Flash, Imagen 4.0
- **Python**: feedparser, requests, nltk, spacy
- **Dağıtım**: Vercel, GitHub Actions (CI/CD planlananırıyor)

---

## 📞 İletişim & Destek

- **Web**: https://ai-fabrika-vip.vercel.app
- **Email**: [iletişim formu]
- **Telegram**: [@OmerAI_bot](https://t.me/OmerAI_bot)

---

## 📄 Lisans

ISC

---

**Geleceği kodla, görselleri mühürle.** ✨
