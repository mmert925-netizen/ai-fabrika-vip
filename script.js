// 1. Projelere Kaydırma Fonksiyonu
function scrollProjects() {
    const gallery = document.getElementById('ai-gallery');
    if(gallery) {
        gallery.scrollIntoView({ behavior: 'smooth' });
    }
}

// 2. ÖMER.AI Asistan Mesajlaşma Sistemi
function sendMessage() {
    const input = document.getElementById('user-input');
    const box = document.getElementById('chat-box');
    
    if(input && input.value.trim() !== "") {
        const userMsg = input.value.toLowerCase();
        box.innerHTML += `<p style="color: #38bdf8; margin-bottom: 8px;"><b>Sen:</b> ${input.value}</p>`;
        
        let botResponse = "Şu an projeler üzerinde mühürleme yapıyorum patron, sana nasıl yardımcı olabilirim?";
        
        if(userMsg.includes("selam") || userMsg.includes("merhaba")) {
            botResponse = "Merhaba! ÖMER.AI Yazılım Fabrikası'na hoş geldin.";
        } else if(userMsg.includes("proje")) {
            botResponse = "Yapay zeka modelleri ve otonom yazılımlar üretiyoruz. Sergimize göz atabilirsin!";
        } else if(userMsg.includes("iletişim")) {
            botResponse = "Formu doldurup 'Mührü Gönder' dersen mesajın doğrudan telefonuma düşer.";
        }

        setTimeout(() => {
            box.innerHTML += `<p style="color: #f8fafc; margin-bottom: 8px;"><b>🤖 Bot:</b> ${botResponse}</p>`;
            box.scrollTop = box.scrollHeight;
        }, 800);
        
        input.value = '';
    }
}

// 3. Slider Mekanizması
let currentSlide = 0;
function moveSlider(direction) {
    const track = document.getElementById('slider-track');
    const slides = document.querySelectorAll('.slide');
    if(track && slides.length > 0) {
        currentSlide = (currentSlide + direction + slides.length) % slides.length;
        track.style.transform = `translateX(-${currentSlide * 100}%)`;
    }
}

// Otonom Slider Başlatıcı
setInterval(() => {
    moveSlider(1);
}, 5000);

// 4. Tema (Karanlık/Aydınlık) Yönetimi - FİXED
function toggleTheme() {
    const html = document.documentElement;
    const currentTheme = html.getAttribute("data-theme") || "dark";
    const targetTheme = currentTheme === "light" ? "dark" : "light";
    
    html.setAttribute("data-theme", targetTheme);
    localStorage.setItem("theme", targetTheme);
}

// 5. ANA MOTOR (TÜM OLAYLAR TEK ÇATIDA)
document.addEventListener("DOMContentLoaded", function() {
    // Kayıtlı Temayı Uygula
    const savedTheme = localStorage.getItem("theme") || "dark";
    document.documentElement.setAttribute("data-theme", savedTheme);

    // Telegram Hattı
    const TELEGRAM_BOT_TOKEN = '8385745600:AAFRf0-qUiy8ooJfvzGcn_MpL77YXONGHis'; 
    const TELEGRAM_CHAT_ID = '7076964315'; 

    const form = document.getElementById("contact-form");
    if (form) {
        form.addEventListener("submit", function(event) {
            event.preventDefault();
            const submitBtn = form.querySelector('button');
            submitBtn.disabled = true;
            submitBtn.innerText = "Mühürleniyor...";

            const name = form.querySelector('input[type="text"]').value;
            const email = form.querySelector('input[type="email"]').value;
            const message = form.querySelector('textarea').value;

            const text = `🚀 *Yeni Web Mesajı!*\n\n👤 *Ad:* ${name}\n📧 *E-posta:* ${email}\n📝 *Messaj:* ${message}`;

            fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    chat_id: TELEGRAM_CHAT_ID,
                    text: text,
                    parse_mode: 'Markdown'
                })
            })
            .then(response => {
                if(response.ok) {
                    alert("Mührün Telegram hattına fırlatıldı patron! 🚀");
                    form.reset();
                } else {
                    alert("Hata: Mesaj iletilemedi.");
                }
            })
            .catch(error => alert("Bağlantı hatası!"))
            .finally(() => {
                submitBtn.disabled = false;
                submitBtn.innerText = "Mührü Gönder";
            });
        });
    }

    // Chat Giriş Kontrolü
    const chatInput = document.getElementById('user-input');
    if(chatInput) {
        chatInput.addEventListener("keypress", function(event) {
            if (event.key === "Enter") sendMessage();
        });
    }

    // AI Görsel Üretim Laboratuvarı
    const generateBtn = document.getElementById('generate-image-btn');
    if (generateBtn) {
        generateBtn.addEventListener('click', async () => {
            const promptInput = document.getElementById('prompt-input');
            const generatedImage = document.getElementById('generated-image');
            const imagePlaceholder = document.getElementById('image-placeholder');
            
            const prompt = promptInput.value.trim();
            if (!prompt) return alert('Lütfen bir görsel açıklaması girin patron!');

            generateBtn.disabled = true;
            generateBtn.innerText = "Mühürleniyor...";
            generatedImage.style.display = 'none';
            imagePlaceholder.style.display = 'block';
            imagePlaceholder.innerText = 'AI hattı çalışıyor...';

            try {
                // Pollinations AI Motoru (Daha hızlı ve ücretsiz)
                const url = `https://image.pollinations.ai/prompt/${encodeURIComponent(prompt)}?width=1024&height=1024&nologo=true&seed=${Math.floor(Math.random()*9999)}`;
                
                generatedImage.src = url;
                generatedImage.onload = () => {
                    generatedImage.style.display = 'block';
                    imagePlaceholder.style.display = 'none';
                    generateBtn.disabled = false;
                    generateBtn.innerText = "Görseli Mühürle (Üret)";
                };
            } catch (error) {
                alert('Üretim hattında hata!');
                generateBtn.disabled = false;
            }
        });
    }
});
