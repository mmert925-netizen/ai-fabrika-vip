import os
import random
import subprocess

from PIL import Image, ImageDraw, ImageFont

# Gerekli kütüphanelerin yüklü olup olmadığını kontrol et ve gerekirse yükle
try:
    import telebot
except ImportError:
    print("telebot modülü bulunamadı, yükleniyor...")
    subprocess.check_call(["pip", "install", "pyTelegramBotAPI"])
    import telebot

# --- BOT AYARLARI ---
BOT_TOKEN = "BOT_TOKEN'INI_BURAYA_YAZ"  # Telegram Botunuzun Token'ını buraya girin!
bot = telebot.TeleBot(BOT_TOKEN)

# --- GÖRSEL AYARLARI ---
ARKA_PLAN_RENKLERI = ["#ADD8E6", "#90EE90", "#F08080", "#D3D3D3", "#FFA07A"]  # Rastgele seçilebilecek arka plan renkleri
YAZI_TIPI = "arial.ttf"  # Yazı tipi dosyasının adı (aynı dizinde olmalı veya tam yolu belirtin)
YAZI_BOYUTU = 40
YAZI_RENGI = "black"
GÖRSEL_GENISLIK = 800
GÖRSEL_YUKSEKLIK = 600
KENAR_BOSLUGU = 50

# --- FONKSIYONLAR ---

def metni_satirlara_ayir(text, font, max_width):
    """Metni, belirtilen yazı tipi ve maksimum genişliğe göre satırlara ayırır."""
    words = text.split()
    lines = []
    current_line = ""

    for word in words:
        test_line = current_line + word + " "
        width, height = font.getsize(test_line)
        if width <= max_width:
            current_line = test_line
        else:
            lines.append(current_line)
            current_line = word + " "
    lines.append(current_line)
    return lines

def görsel_oluştur(metin):
    """Belirtilen metni kullanarak bir görsel oluşturur."""

    # 1. Arka plan rengini rastgele seç
    arka_plan_rengi = random.choice(ARKA_PLAN_RENKLERI)

    # 2. Yeni bir görsel oluştur
    img = Image.new('RGB', (GÖRSEL_GENISLIK, GÖRSEL_YUKSEKLIK), color=arka_plan_rengi)
    d = ImageDraw.Draw(img)

    # 3. Yazı tipini yükle
    try:
        font = ImageFont.truetype(YAZI_TIPI, YAZI_BOYUTU)
    except IOError:
        return None, "Yazı tipi dosyası bulunamadı veya okunamadı. Lütfen 'arial.ttf' dosyasının mevcut olduğundan emin olun."

    # 4. Metni satırlara ayır
    metin_genisligi = GÖRSEL_GENISLIK - 2 * KENAR_BOSLUGU
    satirlar = metni_satirlara_ayir(metin, font, metin_genisligi)

    # 5. Metni görselin ortasına hizala
    y = (GÖRSEL_YUKSEKLIK - len(satirlar) * font.getsize(satirlar[0])[1]) / 2
    for satir in satirlar:
        width, height = font.getsize(satir)
        x = (GÖRSEL_GENISLIK - width) / 2
        d.text((x, y), satir, fill=YAZI_RENGI, font=font)
        y += height

    # 6. Görseli geçici bir dosyaya kaydet
    dosya_adi = "görsel.png"
    img.save(dosya_adi)

    return dosya_adi, None  # hata yoksa None döndür

# --- TELEGRAM BOT HANDLER'LARI ---

@bot.message_handler(commands=['start', 'help'])
def send_welcome(message):
    bot.reply_to(message, """
Merhaba! Ben bir görsel fabrikası botuyum. Bana bir metin gönderin, ben de size o metni içeren bir görsel oluşturayım.
/gorsel komutunu kullanarak da metin gönderebilirsiniz.
""")

@bot.message_handler(commands=['gorsel'])
def komut_gorsel_olustur(message):
    """/gorsel komutuyla görsel oluşturma."""
    try:
        metin = message.text.split("/gorsel", 1)[1].strip()  # komutu ayır ve metni al
        if not metin:
            bot.reply_to(message, "Lütfen bir metin girin. Örnek: /gorsel Merhaba Dünya!")
            return

        dosya_adi, hata_mesaji = görsel_oluştur(metin)

        if dosya_adi:
            with open(dosya_adi, 'rb') as photo:
                bot.send_photo(message.chat.id, photo)
            os.remove(dosya_adi)  # Geçici dosyayı sil
        else:
            bot.reply_to(message, f"Görsel oluşturulurken bir hata oluştu: {hata_mesaji}")
    except Exception as e:
        bot.reply_to(message, f"Beklenmedik bir hata oluştu: {e}")


@bot.message_handler(func=lambda message: True)
def metin_gorsel_olustur(message):
    """Normal metin mesajıyla görsel oluşturma."""
    metin = message.text
    dosya_adi, hata_mesaji = görsel_oluştur(metin)

    if dosya_adi:
        with open(dosya_adi, 'rb') as photo:
            bot.send_photo(message.chat.id, photo)
        os.remove(dosya_adi)  # Geçici dosyayı sil
    else:
        bot.reply_to(message, f"Görsel oluşturulurken bir hata oluştu: {hata_mesaji}")


# --- BOT'U BAŞLAT ---
if __name__ == '__main__':
    print("Bot çalışıyor...")
    bot.infinity_polling()