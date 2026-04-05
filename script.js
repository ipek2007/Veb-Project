
// Formu seçirik
const form = document.getElementById("registerForm");

// Mesaj göstərəcəyimiz element
const message = document.getElementById("message");

// Form submit olunanda işləyəcək
form.addEventListener("submit", async (e) => {

  // Default davranışı (refresh) söndürürük
  e.preventDefault();

  // Inputlardan dəyərləri götürürük
  const fullname = document.getElementById("fullname").value;
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  // Backend-ə göndəriləcək obyekt
  const data = {
    fullname: fullname,
    email: email,
    password: password
  };

  try {
    // Backend-ə POST request göndəririk
    const response = await fetch("http://localhost:3000/register", {
      method: "POST",

      // JSON formatında göndəririk
      headers: {
        "Content-Type": "application/json"
      },

      // JS obyektini JSON stringə çeviririk
      body: JSON.stringify(data)
    });

    // Backend-dən cavabı oxuyuruq
    const result = await response.json();

    // Mesajı ekranda göstəririk
    message.textContent = result.message;

    // Əgər uğurludursa yaşıl rəng
    if (response.ok) {
      message.style.color = "green";

      // Formu təmizləyirik
      form.reset();
    } else {
      message.style.color = "red";
    }

  } catch (error) {
    // Server işləmirsə və ya problem varsa
    message.textContent = "Server xətası";
    message.style.color = "red";
  }
});