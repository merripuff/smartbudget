const tbody = document.getElementById("txTbody");
const hint = document.getElementById("listHint");

const kpiIncome = document.getElementById("kpiIncome");
const kpiExpense = document.getElementById("kpiExpense");
const kpiBalance = document.getElementById("kpiBalance");

const txForm = document.getElementById("txForm");
const txError = document.getElementById("txError");

const logoutBtn = document.getElementById("logoutBtn");
const resetFiltersBtn = document.getElementById("resetFiltersBtn");

let transactions = []; // na razie lokalnie

function formatMoney(n) {
  return Number(n).toFixed(2);
}

function computeKpis(list) {
  let income = 0;
  let expense = 0;

  for (const t of list) {
    if (t.type === "income") income += t.amount;
    else expense += t.amount;
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

    tr.innerHTML = `
      <td>${tx.date}</td>
      <td><span class="badge ${tx.type}">${tx.type === "income" ? "Przychód" : "Wydatek"}</span></td>
      <td>${tx.category}</td>
      <td>${formatMoney(tx.amount)}</td>
      <td>${tx.note || ""}</td>
      <td>
        <button class="btn danger" data-action="delete" data-id="${tx.id}">Usuń</button>
      </td>
    `;

    tbody.appendChild(tr);
  }

  computeKpis(list);
}

function addTransaction(tx) {
  transactions.unshift(tx);
  renderList(transactions);
}

function deleteTransaction(id) {
  transactions = transactions.filter(t => t.id !== id);
  renderList(transactions);
}

txForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const type = document.getElementById("type").value;
  const amount = Number(document.getElementById("amount").value);
  const category = document.getElementById("category").value.trim();
  const date = document.getElementById("date").value;
  const note = document.getElementById("note").value.trim();

  txError.style.display = "none";
  txError.textContent = "";

  if (!category || !date || !Number.isFinite(amount) || amount <= 0) {
    txError.textContent = "Uzupełnij poprawnie: kwota > 0, kategoria i data.";
    txError.style.display = "block";
    return;
  }

  addTransaction({
    id: crypto.randomUUID(),
    type,
    amount,
    category,
    date,
    note
  });

  txForm.reset();
});

tbody.addEventListener("click", (e) => {
  const btn = e.target.closest("button");
  if (!btn) return;

  const action = btn.dataset.action;
  const id = btn.dataset.id;

  if (action === "delete") deleteTransaction(id);
});

resetFiltersBtn.addEventListener("click", () => {
  // na razie brak filtrów lokalnych — zostawiamy hook na przyszłość
  renderList(transactions);
});

logoutBtn.addEventListener("click", () => {
  alert("Na razie demo lokalne. Po wdrożeniu logowania będzie tu czyszczenie tokena.");
});

// start
renderList(transactions);