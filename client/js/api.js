const API_BASE_URL = "http://localhost:3000";

function getToken() {
  return localStorage.getItem("sb_token");
}

function setToken(token) {
  localStorage.setItem("sb_token", token);
}

function clearToken() {
  localStorage.removeItem("sb_token");
}

async function apiRequest(path, { method = "GET", body = null, auth = false } = {}) {
  const headers = { "Content-Type": "application/json" };

  if (auth) {
    const token = getToken();
    if (!token) throw new Error("Brak tokena — zaloguj się ponownie.");
    headers.Authorization = "Bearer " + token;
  }

  const res = await fetch(API_BASE_URL + path, {
    method,
    headers,
    body: body ? JSON.stringify(body) : null
  });

  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    const msg = data?.message || `Błąd API (${res.status})`;
    throw new Error(msg);
  }
  return data;
}
