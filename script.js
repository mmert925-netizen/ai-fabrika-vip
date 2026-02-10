// 1. TERCÜMAN SİSTEMİ
function translatePrompt(text) {
    const dict = {
        "karadelik": "black hole, event horizon, volumetric lighting, 8k",
        "araba": "futuristic supercar, hyper-realistic, neon details, 8k",
        "robot": "cyberpunk humanoid robot, sharp focus, masterpiece",
        "orman": "mystical glowing forest, cinematic lighting, photorealistic"
    };
    let p = text.toLowerCase();
    for (let key in dict) { if (p.includes(key)) return dict[key]; }
    return p;
}

// 2. MOD VE STATLAR
function toggleTheme() {
    const html = document.documentElement;
    const target = html.getAttribute("data-theme") === "light" ? "dark" : "light";
    html.setAttribute("data-theme", target);
    localStorage.setItem("theme", target);
}

function updateStats() {
    let d = 1.40;
    setInterval(() => {
        d += Math.random() * 0.05;
        document.getElementById('stat-data').innerText = d.toFixed(2) + " TB";
    }, 3000);
}

// 3. AI ÜRETİM
async function generateImage() {
    const input = document.getElementById('prompt-input');
    const img = document.getElementById('generated-image');
    const txt = document.getElementById('image-placeholder');
    if(!input.value) return alert("Yaz patron!");
    
    txt.innerText = "Üretiliyor...";
    img.style.display = "none";
    const finalPrompt = translatePrompt(input.value);
    const url = `https://image.pollinations.ai/prompt/${encodeURIComponent(finalPrompt + ", 8k, realistic")}?width=1024&height=1024&nologo=true&seed=${Math.floor(Math.random()*9999)}`;
    
    img.src = url;
    img.onload = () => { img.style.display = "block"; txt.style.display = "none"; };
}

// 4. TERMİNAL VE TELEGRAM
document.addEventListener("DOMContentLoaded", () => {
    updateStats();
    document.documentElement.setAttribute("data-theme", localStorage.getItem("theme") || "dark");

    const tInput = document.getElementById('terminal-input');
    const tOut = document.getElementById('terminal-output');
    tInput.addEventListener('keypress', (e) => {
        if(e.key === 'Enter') {
            const cmd = tInput.value.toLowerCase().trim();
            let res = `\n> ${cmd}\n`;
            if(cmd === 'help') res += "KOMUTLAR: status, factory, clear";
            else if(cmd === 'status') res += "SİSTEM: ONLINE [V49]";
            else if(cmd === 'clear') { tOut.innerText = "Sistem Hazır."; tInput.value = ''; return; }
            else res += "Hata: Komut sistemde yok.";
            tOut.innerText += res; tOut.scrollTop = tOut.scrollHeight; tInput.value = '';
        }
    });

    document.getElementById('contact-form').addEventListener('submit', function(e) {
        e.preventDefault();
        const n = document.getElementById('contact-name').value;
        const em = document.getElementById('contact-email').value;
        const m = document.getElementById('contact-message').value;
        const text = `🚀 *Webden V49 Mesaj!*\n👤 *Ad:* ${n}\n📧 *Mail:* ${em}\n📝 *Mesaj:* ${m}`;
        fetch(`https://api.telegram.org/bot8385745600:AAFRf0-qUiy8ooJfvzGcn_MpL77YXONGHis/sendMessage`, {
            method: 'POST', headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ chat_id: '7076964315', text: text, parse_mode: 'Markdown' })
        }).then(() => { alert("V49 Mührü Telegram'a fırlatıldı!"); this.reset(); });
    });
});
