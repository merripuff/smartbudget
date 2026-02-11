// Dashboard API version (MongoDB + JWT)

const tbody = document.getElementById("txTbody");
const hint = document.getElementById("listHint");

const kpiIncome = document.getElementById("kpiIncome");
const kpiExpense = document.getElementById("kpiExpense");
const kpiBalance = document.getElementById("kpiBalance");

const txForm = document.getElementById("txForm");
const txError = document.getElementById("txError");

const logoutBtn = document.getElementById("logoutBtn");
const resetFiltersBtn = document.getElementById("resetFiltersBtn");

// Filtry
const filterType = document.getElementById("filterType");
const filterCategory = document.getElementById("filterCategory");
const filterFrom = document.getElementById("filterFrom");
const filterTo = document.getElementById("filterTo");

let transactions = [];

function showErr(msg) {
  txError.textContent = msg;
  txError.style.display = "block";
}
function hideErr() {
  txError.textContent = "";
  txError.style.display = "none";
}

function formatMoney(n) {
  return Number(n).toFixed(2);
}

function computeKpis(list) {
  let income = 0;
  let expense = 0;

  for (const t of list) {
    if (t.type === "income") income += Number(t.amount);
    else expense += Number(t.amount);
  }

  kpiIncome.textContent = formatMoney(income);
  kpiExpense.textContent = formatMoney(expense);
  kpiBalance.textContent = formatMoney(income - expense);
}

function renderList(list) {
  tbody.innerHTML = "";

  if (list.length === 0) {
    hint.textContent = "Brak transakcji. Dodaj pierwszą transakcję powyżej.";
    hint.style.display = "block";
    computeKpis([]);
    return;
  }

  hint.style.display = "none";

  for (const tx of list) {
    const tr = document.createElement("tr");

    const typeLabel = tx.type === "income" ? "Przychód" : "Wydatek";
    const badgeClass = tx.type === "income" ? "income" : "expense";

    tr.innerHTML = `
      <td>${tx.date}</td>
      <td><span class="badge ${badgeClass}">${typeLabel}</span></td>
      <td>${escapeHtml(tx.category)}</td>
      <td>${formatMoney(tx.amount)}</td>
      <td>${escapeHtml(tx.note || "")}</td>
      <td style="display:flex; gap:8px; flex-wrap:wrap;">
        <button class="btn" data-action="edit" data-id="${tx._id}">Edytuj</button>
        <button class="btn danger" data-action="delete" data-id="${tx._id}">Usuń</button>
      </td>
    `;

    tbody.appendChild(tr);
  }

  computeKpis(list);
}

function escapeHtml(str) {
  return String(str)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function buildQuery() {
  const params = new URLSearchParams();

  if (filterType.value) params.set("type", filterType.value);
  if (filterCategory.value.trim()) params.set("category", filterCategory.value.trim());
  if (filterFrom.value) params.set("from", filterFrom.value);
  if (filterTo.value) params.set("to", filterTo.value);

  const qs = params.toString();
  return qs ? `?${qs}` : "";
}

async function loadTransactions() {
  hideErr();

  try {
    const qs = buildQuery();
    const data = await apiRequest(`/api/transactions${qs}`, { auth: true });
    transactions = data;
    renderList(transactions);
  } catch (e) {
    // najczęściej brak tokena / wygasł
    showErr(e.message || "Nie udało się pobrać transakcji.");
    if ((e.message || "").toLowerCase().includes("token")) {
      clearToken();
      window.location.href = "./login.html";
    }
  }
}

async function addTransactionFromForm() {
  hideErr();

  const type = document.getElementById("type").value;
  const amount = Number(document.getElementById("amount").value);
  const category = document.getElementById("category").value.trim();
  const date = document.getElementById("date").value;
  const note = document.getElementById("note").value.trim();

  if (!category || !date || !Number.isFinite(amount) || amount <= 0) {
    showErr("Uzupełnij poprawnie: kwota > 0, kategoria i data.");
    return;
  }

  try {
    await apiRequest("/api/transactions", {
      method: "POST",
      auth: true,
      body: { type, amount, category, note, date }
    });

    txForm.reset();
    await loadTransactions();
  } catch (e) {
    showErr(e.message || "Nie udało się dodać transakcji.");
  }
}

async function deleteTransaction(id) {
  hideErr();
  try {
    await apiRequest(`/api/transactions/${id}`, { method: "DELETE", auth: true });
    await loadTransactions();
  } catch (e) {
    showErr(e.message || "Nie udało się usunąć transakcji.");
  }
}

// Prosta edycja: prompty (na zaliczenie OK)
// Potem możemy przerobić na modal/form w UI.
async function editTransaction(id) {
  const tx = transactions.find(t => t._id === id);
  if (!tx) return;

  const newType = prompt("Typ (income/expense):", tx.type);
  if (!newType) return;

  const newAmount = prompt("Kwota:", String(tx.amount));
  if (newAmount === null) return;

  const newCategory = prompt("Kategoria:", tx.category);
  if (newCategory === null) return;

  const newDate = prompt("Data (YYYY-MM-DD):", tx.date);
  if (newDate === null) return;

  const newNote = prompt("Notatka:", tx.note || "");
  if (newNote === null) return;

  const payload = {
    type: newType.trim(),
    amount: Number(newAmount),
    category: newCategory.trim(),
    date: newDate.trim(),
    note: newNote.trim()
  };

  if (!["income", "expense"].includes(payload.type)) return showErr("Typ musi być income albo expense.");
  if (!Number.isFinite(payload.amount) || payload.amount <= 0) return showErr("Kwota musi być > 0.");
  if (!payload.category) return showErr("Kategoria jest wymagana.");
  if (!payload.date) return showErr("Data jest wymagana.");

  try {
    await apiRequest(`/api/transactions/${id}`, { method: "PUT", auth: true, body: payload });
    await loadTransactions();
  } catch (e) {
    showErr(e.message || "Nie udało się edytować transakcji.");
  }
}

// EVENTS
txForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  await addTransactionFromForm();
});

tbody.addEventListener("click", async (e) => {
  const btn = e.target.closest("button");
  if (!btn) return;

  const action = btn.dataset.action;
  const id = btn.dataset.id;

  if (action === "delete") await deleteTransaction(id);
  if (action === "edit") await editTransaction(id);
});

logoutBtn.addEventListener("click", () => {
  clearToken();
  window.location.href = "./login.html";
});

resetFiltersBtn.addEventListener("click", async () => {
  filterType.value = "";
  filterCategory.value = "";
  filterFrom.value = "";
  filterTo.value = "";
  await loadTransactions();
});

// Automatyczne filtrowanie po zmianie (wymóg: interakcje)
filterType.addEventListener("change", loadTransactions);
filterCategory.addEventListener("input", debounce(loadTransactions, 350));
filterFrom.addEventListener("change", loadTransactions);
filterTo.addEventListener("change", loadTransactions);

function debounce(fn, ms) {
  let t = null;
  return (...args) => {
    clearTimeout(t);
    t = setTimeout(() => fn(...args), ms);
  };
}

// START: jeśli nie ma tokena → do logowania
(function init() {
  const token = localStorage.getItem("sb_token");
  if (!token) {
    window.location.href = "./login.html";
    return;
  }

  // domyślna data w formularzu na dziś
  const dateEl = document.getElementById("date");
  if (dateEl && !dateEl.value) dateEl.valueAsDate = new Date();

  loadTransactions();
})();
