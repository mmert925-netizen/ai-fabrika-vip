// =========================================
// ÖMER.AI - ASIL MOTOR SİSTEMİ (V49-FİNAL)
// =========================================

// 1. Kaydırma Fonksiyonu
function scrollProjects() {
    const lab = document.getElementById('ai-lab');
    if(lab) lab.scrollIntoView({ behavior: 'smooth' });
}

// 2. ÖMER.AI Asistan Sistemi
function sendMessage() {
    const input = document.getElementById('user-input');
    const box = document.getElementById('chat-box');
    if(input && input.value.trim() !== "") {
        const userMsg = input.value;
        box.innerHTML += `<div style="color: var(--accent-color); align-self: flex-end; margin-bottom: 8px;"><b>Sen:</b> ${userMsg}</div>`;
        
        let response = "Şu an üretim hattındayım patron, projeleri mühürlüyorum. Ne lazımdı?";
        if(userMsg.toLowerCase().includes("selam")) response = "Selam patron, ÖMER.AI fabrikası emrinde!";
        if(userMsg.toLowerCase().includes("kod")) response = "Kodlar mühürlendi patron, her şey kontrol altında.";

        setTimeout(() => {
            box.innerHTML += `<div style="color: var(--text-color); align-self: flex-start; margin-bottom: 8px;"><b>🤖 AI:</b> ${response}</div>`;
            box.scrollTop = box.scrollHeight;
        }, 600);
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
setInterval(() => moveSlider(1), 5000);

// 4. Tema Yönetimi
function toggleTheme() {
    const html = document.documentElement;
    const currentTheme = html.getAttribute("data-theme") || "dark";
    const targetTheme = currentTheme === "light" ? "dark" : "light";
    html.setAttribute("data-theme", targetTheme);
    localStorage.setItem("theme", targetTheme);
}

// 5. ANA BAŞLATICI (DOM)
document.addEventListener("DOMContentLoaded", function() {
    // Kayıtlı Temayı Uygula
    const savedTheme = localStorage.getItem("theme") || "dark";
    document.documentElement.setAttribute("data-theme", savedTheme);

    // TELEGRAM HATTI (V49)
    const form = document.getElementById("contact-form");
    if (form) {
        form.addEventListener("submit", function(e) {
            e.preventDefault();
            const submitBtn = form.querySelector('button');
            submitBtn.disabled = true;
            submitBtn.innerText = "Mühürleniyor...";

            const name = document.getElementById("c-name").value;
            const email = document.getElementById("c-email").value;
            const msg = document.getElementById("c-message").value;
            const text = `🚀 *Yeni Web Mesajı!*\n\n👤 *Ad:* ${name}\n📧 *Mail:* ${email}\n📝 *Mesaj:* ${msg}`;

            fetch(`https://api.telegram.org/bot8385745600:AAFRf0-qUiy8ooJfvzGcn_MpL77YXONGHis/sendMessage`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    chat_id: '7076964315',
                    text: text,
                    parse_mode: 'Markdown'
                })
            }).then(response => {
                if(response.ok) {
                    alert("Mührün Telegram hattına fırlatıldı patron! 🚀");
                    form.reset();
                } else { alert("Hata: Mesaj iletilemedi."); }
            }).finally(() => {
                submitBtn.disabled = false;
                submitBtn.innerText = "Mührü Gönder";
            });
        });
    }

    // AI GÖRSEL ÜRETİM MOTORU (POLLINATIONS)
    const generateBtn = document.getElementById('generate-image-btn');
    if (generateBtn) {
        generateBtn.addEventListener('click', async () => {
            const prompt = document.getElementById('prompt-input').value.trim();
            const img = document.getElementById('generated-image');
            const placeholder = document.getElementById('image-placeholder');
            
            if (!prompt) return alert('Lütfen bir emrini yaz patron!');

            generateBtn.disabled = true;
            generateBtn.innerText = "ÜRETİLİYOR...";
            img.style.display = 'none';
            placeholder.style.display = 'block';
            placeholder.innerText = 'AI Üretim Hattı Çalışıyor...';

            const url = `https://image.pollinations.ai/prompt/${encodeURIComponent(prompt)}?width=1024&height=1024&nologo=true&seed=${Math.floor(Math.random()*999999)}`;
            
            img.src = url;
            img.onload = () => {
                img.style.display = 'block';
                placeholder.style.display = 'none';
                generateBtn.disabled = false;
                generateBtn.innerText = "MÜHÜRLE VE ÜRET";
            };
        });
    }

    // Chat Enter Tuşu
    const chatIn = document.getElementById('user-input');
    if(chatIn) {
        chatIn.addEventListener("keypress", (e) => {
            if (e.key === "Enter") sendMessage();
        });
    }
});
