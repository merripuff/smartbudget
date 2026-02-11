// Obsługa formularzy login/register jeśli są na stronie

function showError(el, msg) {
  if (!el) return;
  el.textContent = msg;
  el.style.display = "block";
}

function hideError(el) {
  if (!el) return;
  el.textContent = "";
  el.style.display = "none";
}

async function handleRegister(e) {
  e.preventDefault();

  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value;
  const password2 = document.getElementById("password2").value;

  const err = document.getElementById("registerError");
  hideError(err);

  if (!email) return showError(err, "Podaj email.");
  if (password.length < 8) return showError(err, "Hasło musi mieć min. 8 znaków.");
  if (password !== password2) return showError(err, "Hasła nie są takie same.");

  try {
    await apiRequest("/api/auth/register", {
      method: "POST",
      body: { email, password }
    });

    // Po rejestracji od razu przenosimy do logowania
    window.location.href = "./login.html";
  } catch (e) {
    showError(err, e.message);
  }
}

async function handleLogin(e) {
  e.preventDefault();

  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value;

  const err = document.getElementById("loginError");
  hideError(err);

  if (!email) return showError(err, "Podaj email.");
  if (!password) return showError(err, "Podaj hasło.");

  try {
    const data = await apiRequest("/api/auth/login", {
      method: "POST",
      body: { email, password }
    });

    setToken(data.token);
    window.location.href = "./dashboard.html";
  } catch (e) {
    showError(err, e.message);
  }
}

function setupAuthForms() {
  const registerForm = document.getElementById("registerForm");
  if (registerForm) registerForm.addEventListener("submit", handleRegister);

  const loginForm = document.getElementById("loginForm");
  if (loginForm) loginForm.addEventListener("submit", handleLogin);
}

setupAuthForms();
