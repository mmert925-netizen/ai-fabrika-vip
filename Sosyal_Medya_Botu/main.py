
import requests
from google import genai
client = genai.Client(api_key="AIzaSyDrXM0aFr60O6ktWDPgFjZW4cGG1rFX47o")
def post_hazirla(metin):
    res = client.models.generate_content(model='gemini-2.0-flash', contents=f'Sosyal medya postu yap: {metin}')
    requests.post("https://api.telegram.org/bot8385745600:AAFRf0-qUiy8ooJfvzGcn_MpL77YXONGHis/sendMessage", 
                  json={"chat_id": "7076964315", "text": res.text})
