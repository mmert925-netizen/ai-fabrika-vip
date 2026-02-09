```javascript
document.addEventListener("DOMContentLoaded", function() {
    const form = document.getElementById("contactForm");
    const formMessage = document.getElementById("form-message");

    form.addEventListener("submit", function(event) {
        event.preventDefault(); // Sayfanın yenilenmesini engelle

        // Form verilerini al
        const name = document.getElementById("name").value;
        const email = document.getElementById("email").value;
        const message = document.getElementById("message").value;

        // Basit validasyon (sunucu tarafında da yapılmalı)
        if (!name || !email || !message) {
            formMessage.textContent = "Lütfen tüm alanları doldurun.";
            formMessage.style.color = "red";
            return;
        }

        // Form verilerini işleme (burada sunucuya gönderme simüle ediliyor)
        console.log("Form Gönderildi:");
        console.log("Ad:", name);
        console.log("E-posta:", email);
        console.log("Mesaj:", message);

        formMessage.textContent = "Mesajınız başarıyla gönderildi!";
        formMessage.style.color = "green";

        // Formu sıfırla
        form.reset();
    });
});
```