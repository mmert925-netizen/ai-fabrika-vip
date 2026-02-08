import telegram
from telegram.ext import Updater, CommandHandler, MessageHandler, Filters
import logging
import os
from io import BytesIO
from PIL import Image, ImageDraw, ImageFont

# --- Telegram Bot Ayarları ---
TELEGRAM_TOKEN = os.environ.get("TELEGRAM_TOKEN")  # Ortam değişkeninden al (önerilen)
# TELEGRAM_TOKEN = "BOT_TOKENİNİZİ_BURAYA_YAZIN" # Alternatif: Direkt yazın (dikkatli olun!)
BOT_USERNAME = "GörselFabrikaBot"  # Botunuzun kullanıcı adı

# --- Görsel Fabrikası Ayarları ---
DEFAULT_IMAGE_SIZE = (500, 300)
DEFAULT_FONT_PATH = "arial.ttf"  # Arial veya sisteminizdeki bir fontu kullanın
DEFAULT_FONT_SIZE = 30
DEFAULT_FONT_COLOR = (0, 0, 0)  # Siyah
DEFAULT_BACKGROUND_COLOR = (255, 255, 255)  # Beyaz


# --- Loglama ---
logging.basicConfig(format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
                    level=logging.INFO)

logger = logging.getLogger(__name__)


# --- Yardımcı Fonksiyonlar ---

def create_image_with_text(text, image_size=DEFAULT_IMAGE_SIZE, font_path=DEFAULT_FONT_PATH, font_size=DEFAULT_FONT_SIZE, font_color=DEFAULT_FONT_COLOR, background_color=DEFAULT_BACKGROUND_COLOR):
    """Verilen metinle bir görsel oluşturur."""
    try:
        img = Image.new("RGB", image_size, background_color)
        d = ImageDraw.Draw(img)
        try:
            font = ImageFont.truetype(font_path, font_size)
        except IOError:
            # Eğer font bulunamazsa, default bir font kullanmayı deneyin.
            try:
                font = ImageFont.load_default()
            except Exception as e:
                logger.error(f"Default font yüklenirken hata: {e}")
                return None, "Font yüklenirken hata oluştu. Font dosyasını kontrol edin veya default font yüklenemedi."

        # Metni ortalamak için
        text_width, text_height = d.textsize(text, font=font)
        x = (image_size[0] - text_width) / 2
        y = (image_size[1] - text_height) / 2

        d.text((x, y), text, fill=font_color, font=font)

        return img, None # Hata yoksa None döndür
    except Exception as e:
        logger.error(f"Görsel oluşturulurken hata: {e}")
        return None, str(e) # Hatayı string olarak döndür

def image_to_byte_array(image: Image) -> bytes:
  """PIL Image'ı byte array'ine dönüştürür."""
  imgByteArr = BytesIO()
  image.save(imgByteArr, format='PNG')
  imgByteArr = imgByteArr.getvalue()
  return imgByteArr


# --- Telegram Bot Komutları ---

def start(update, context):
    """`/start` komutu"""
    update.message.reply_text('Merhaba! Görsel Fabrika Botuna hoş geldiniz.  '
                              'Bana bir metin gönderin, ben de size bir görsel oluşturayım.\n'
                              'Kullanım: sadece istediğiniz metni yazın.\n'
                              'Örnek: "Merhaba Dünya!"')

def help_command(update, context):
    """`/help` komutu"""
    update.message.reply_text('Bu bot, verilen metinle görsel oluşturur.\n'
                              'Kullanım: sadece istediğiniz metni yazın.\n'
                              'Örnek: "Harika bir gün!"')


def image_command(update, context):
    """Girilen metni görselleştirir ve geri gönderir."""
    text = update.message.text
    logger.info(f"Gelen mesaj: {text}")

    image, error_message = create_image_with_text(text)

    if image:
        image_bytes = image_to_byte_array(image)
        context.bot.send_photo(chat_id=update.effective_chat.id, photo=image_bytes)
    else:
        update.message.reply_text(f"Üzgünüm, bir hata oluştu: {error_message}")



def error(update, context):
    """Log Errors caused by Updates."""
    logger.warning('Update "%s" caused error "%s"', update, context.error)


# --- Ana Fonksiyon ---

def main():
    """Telegram Botunu Başlatır."""
    if not TELEGRAM_TOKEN:
        print("Hata: TELEGRAM_TOKEN ortam değişkeni ayarlanmamış veya direkt olarak belirtilmemiş.")
        return


    updater = Updater(TELEGRAM_TOKEN, use_context=True)

    # Get the dispatcher to register handlers
    dp = updater.dispatcher

    # Komut işleyicileri
    dp.add_handler(CommandHandler("start", start))
    dp.add_handler(CommandHandler("help", help_command))

    # Mesaj işleyicisi (resim oluşturma)
    dp.add_handler(MessageHandler(Filters.text & ~Filters.command, image_command))

    # Hata işleyicisi
    dp.add_error_handler(error)

    # Botu başlat
    updater.start_polling()

    # Botu durdurmak için sinyal bekleyin
    updater.idle()


if __name__ == '__main__':
    main()