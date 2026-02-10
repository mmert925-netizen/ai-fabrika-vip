// ==========================================
// ÖMER.AI FABRİKA KONTROL MERKEZİ - V125
// SADECE MOD VE MAİL DÜZELTMESİ YAPILDI
// ==========================================

// 1. TERCÜMAN SİSTEMİ (Türkçe -> AI Dili)
function translatePrompt(text) {
    const dict = {
        "karadelik": "black hole, event horizon, singularity, space nebula, cinematic lighting, 8k",
        "araba": "luxury supercar, futuristic racing car, hyper-realistic, 8k",
        "kedi": "cyberpunk neon cat, high detail fur, 4k resolution",
        "deniz": "dramatic ocean waves, sunset, hyper-realistic, 8k",
        "orman": "mystical ancient forest, volumetric lighting, photorealistic, cinematic",
        "robot": "advanced humanoid robot, glowing blue parts, intricate mechanical detail, masterpiece",
        "ev": "modern glass villa on a cliff, architecture masterpiece, cinematic lighting",
        "uzay": "deep space, galaxies, stars and planets, high resolution, 8k",
        "aslan": "majestic lion, golden lighting, sharp focus, 8k",
        "kurt": "white wolf in snow, cinematic lighting, sharp focus, masterpiece"
    };
    let processed = text.toLowerCase();
    for (let key in dict) {
        if (processed.includes(key)) return dict[key];
    }
    return processed;
}

// 2. MOD DEĞİŞTİRME (KESİN ÇÖZÜM)
function toggleTheme() {
    const html = document.documentElement;
    // Mevcut temayı kontrol et, yoksa 'dark' olarak kabul et
    const currentTheme = html.getAttribute("data-theme") || "dark";
    const newTheme = currentTheme === "light" ? "dark" : "light";
    
    // Temayı sayfaya uygula ve hafızaya kaydet
    html.setAttribute("data-theme", newTheme);
    localStorage.setItem("theme", newTheme);
}

// 3. CANLI VERİ AKIŞI
function updateStats() {
    const dataStat = document.getElementById('stat-data');
    const projectStat = document.getElementById('stat-projects');
    let dataVal = 1.20;
    let projVal = 142;

    if(dataStat && projectStat) {
        setInterval(() => {
            dataVal += Math.random() * 0.03;
            if(Math.random() > 0.85) projVal += 1;
            dataStat.innerText = dataVal.toFixed(2) + " TB";
            projectStat.innerText = projVal;
        }, 2500);
    }
