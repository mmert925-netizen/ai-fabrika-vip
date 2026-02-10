// ==========================================
// ÖMER.AI FABRİKA KONTROL MERKEZİ - V75
// ULTRA KALİTE AI MOTORU VE TAM ENTEGRASYON
// ==========================================

// 1. Projelere Yumuşak Kaydırma
function scrollProjects() {
    const gallery = document.getElementById('ai-gallery');
    if(gallery) {
        gallery.scrollIntoView({ behavior: 'smooth' });
    }
}

// 2. Otonom Slider Mekanizması (5 Saniyede Bir)
let currentSlide = 0;
function moveSlider(direction) {
    const track = document.getElementById('slider-track');
    const slides = document.querySelectorAll('.slide');
    if(track && slides.length > 0) {
        currentSlide = (currentSlide + direction + slides.length) % slides.length;
        track.style.transform = `translateX(-${currentSlide * 100}%)`;
    }
}
setInterval(() => {
    moveSlider(1);
}, 5000);

// 3. Tema (Karanlık/Aydınlık) Yönetimi
function toggleTheme() {
    const currentTheme = document.documentElement.getAttribute("data-theme");
    const targetTheme = currentTheme === "light" ? "dark" : "light";
    document.documentElement.setAttribute("data-theme", targetTheme);
    localStorage.setItem("theme", targetTheme);
}

// 4. ÖMER.AI Asistan Chat Sistemi
function sendMessage() {
    const input = document.getElementById('user-input');
    const box = document.getElementById('chat-box');
    
    if(input && input.value.trim() !== "") {
        const userMsg = input.value.toLowerCase();
        box.innerHTML += `<p style="color: #38bdf8; margin-bottom: 8px;"><b>Sen:</b> ${input.value}</p>`;
        
        let botResponse = "Şu an üretim bandındayım patron, her şey yolunda!";
        
        if(userMsg.includes("selam") || userMsg.includes("merhaba")) {
            botResponse = "Merhaba! ÖMER.AI Fabrikası'na hoş geldin patron.";
        } else if(userMsg.includes("proje")) {
            botResponse = "Yazılım ve AI projelerimiz jilet gibi hazır. Yukarıdan bakabilirsin!";
        } else if(userMsg.includes("iletişim")) {
            botResponse = "Formu doldurursan mesajın anında Telegram'ıma düşer.";
        }

        setTimeout(() => {
            box.innerHTML += `<p style="color: #f8fafc; margin-bottom: 8px;"><b>🤖 Bot:</b> ${botResponse}</p>`;
            box.scrollTop = box.scrollHeight;
        }, 800);
        
        input.value = '';
    }
}

// ==========================================
// ANA ÇALIŞTIRICI (Sayfa Yüklendiğinde)
// ==========================================
document.addEventListener("DOMContentLoaded", function() {
    // Kayıtlı Temayı Yükle
    const savedTheme = localStorage.getItem("theme") || "dark";
    document.documentElement.setAttribute("data-theme", savedTheme);

    // 5. TELEGRAM MESAJ HATTI ENTEGRASYONU
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

            const text = `🚀 *Yeni Web Mesajı!*\n\n👤 *Ad:* ${name}\n📧 *E-posta:* ${email}\n📝 *Mesaj:* ${message}`;

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
            .catch(() => alert("Bağlantı hatası!"))
            .finally(() => {
                submitBtn.disabled = false;
                submitBtn.innerText = "Mührü Gönder";
            });
        });
    }

    // 6. AI GÖRSEL ÜRETİM LABORATUVARI (Ultra Kalite Flux Motoru)
    const generateBtn = document.getElementById('generate-image-btn');
    const promptInput = document.getElementById('prompt-input');
    const generatedImage = document.getElementById('generated-image');
    const imagePlaceholder = document.getElementById('image-placeholder');

    if (generateBtn) {
        generateBtn.addEventListener('click', function() {
            const userPrompt = promptInput.value.trim();
            if (!userPrompt) {
                alert('Lütfen bir görsel açıklaması girin patron!');
                return;
            }

            // Arayüz Hazırlığı
            generateBtn.disabled = true;
            generateBtn.innerText = "Mühürleniyor...";
            imagePlaceholder.innerText = "Yüksek Çözünürlüklü Eser İşleniyor...";
            imagePlaceholder.style.display = "block";
            generatedImage.style.display = "none";

            // Kaliteyi Arttıran Gizli Komutlar (Prompt Engineering)
            const qualityBoost = "photorealistic, ultra detailed, 8k resolution, cinematic lighting, masterpiece, sharp focus";
            const finalPrompt = encodeURIComponent(qualityBoost + ", " + userPrompt);
            
            // Rastgelelik için her seferinde yeni Seed
            const seed = Math.floor(Math.random() * 1000000);
            
            // Ultra Kaliteli Flux Motoru (Pollinations üzerinden)
            const imageUrl = `https://image.pollinations.ai/prompt/${finalPrompt}?width=1024&height=1024&model=flux&seed=${seed}&nologo=true`;

            const img = new Image();
            img.src = imageUrl;
            img.onload = function() {
                generatedImage.src = imageUrl;
                generatedImage.style.display = "block";
                imagePlaceholder.style.display = "none";
                generateBtn.disabled = false;
                generateBtn.innerText = "Görseli Mühürle (Üret)";
            };
            img.onerror = function() {
                alert("Üretim bandında kısa devre! Tekrar deneyin.");
                generateBtn.disabled = false;
                generateBtn.innerText = "Görseli Mühürle (Üret)";
                imagePlaceholder.innerText = "Hata oluştu.";
            };
        });
    }

    // Chat widget için Enter tuşu desteği
    const chatInput = document.getElementById('user-input');
    if(chatInput) {
        chatInput.addEventListener("keypress", function(e) {
            if (e.key === "Enter") sendMessage();
        });
    }
});
