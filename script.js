// ÖMER.AI FABRİKA - ÜCRETSİZ AI MOTORU

document.addEventListener("DOMContentLoaded", function() {
    const generateBtn = document.getElementById('generate-image-btn');
    const promptInput = document.getElementById('prompt-input');
    const loadingIndicator = document.getElementById('loading-indicator');
    const generatedImage = document.getElementById('generated-image');

    if (generateBtn) {
        generateBtn.addEventListener('click', () => {
            const prompt = promptInput.value.trim();
            if (!prompt) {
                alert('Patron, boş üretim yapamayız! Bir şeyler yaz.');
                return;
            }

            // Üretim Hazırlığı
            loadingIndicator.style.display = 'block';
            generatedImage.style.display = 'none';
            generateBtn.disabled = true;
            generateBtn.innerText = "Fabrika Çiziyor...";

            // 🚀 ÜCRETSİZ VE SINIRSIZ MOTOR (Pollinations AI)
            // Bu motor anahtar istemez, yazdığın her şeyi çizer.
            const imageUrl = `https://image.pollinations.ai/prompt/${encodeURIComponent(prompt)}?width=1024&height=1024&nologo=true&seed=${Math.floor(Math.random() * 1000)}`;

            // Resim yükleme işlemi
            generatedImage.src = imageUrl;

            generatedImage.onload = () => {
                loadingIndicator.style.display = 'none';
                generatedImage.style.display = 'block';
                generateBtn.disabled = false;
                generateBtn.innerText = "Görseli Mühürle (Üret)";
                console.log("Üretim Tamamlandı Patron!");
            };

            generatedImage.onerror = () => {
                loadingIndicator.style.display = 'none';
                generateBtn.disabled = false;
                generateBtn.innerText = "Tekrar Dene";
                alert("Üretim hattında bir hata oluştu patron, tekrar dene!");
            };
        });
    }
});