
import os
os.system('pip install feedparser')
import feedparser
import requests
from google import genai

client = genai.Client(api_key="AIzaSyDrXM0aFr60O6ktWDPgFjZW4cGG1rFX47o")

def haber_islem():
    kaynak = "https://www.cnnturk.com/feed/66/index.rss"
    headers = {'User-Agent': 'Mozilla/5.0'}
    res = requests.get(kaynak, headers=headers)
    feed = feedparser.parse(res.content)
    if feed.entries:
        baslik = feed.entries[0].title
        prompt = f"Bu haberi Ömer patrona kısa özetle: {baslik}"
        ai_res = client.models.generate_content(model='gemini-2.0-flash', contents=prompt)
        requests.post(f"https://api.telegram.org/bot8385745600:AAFRf0-qUiy8ooJfvzGcn_MpL77YXONGHis/sendMessage", 
                      json={"chat_id": "7076964315", "text": ai_res.text})
haber_islem()
