async function loadRatesNBP() {
  const eurEl = document.getElementById("rateEur");
  const usdEl = document.getElementById("rateUsd");
  const gbpEl = document.getElementById("rateGbp");
  const infoEl = document.getElementById("rateInfo");

  if (!eurEl || !usdEl || !gbpEl || !infoEl) return;

  try {
    infoEl.textContent = "Ładowanie kursów...";

    // Tabela A: kursy średnie
    const res = await fetch("https://api.nbp.pl/api/exchangerates/tables/A/?format=json");
    const data = await res.json();

    const table = data?.[0];
    const rates = table?.rates || [];
    const effectiveDate = table?.effectiveDate;

    function find(code) {
      const r = rates.find(x => x.code === code);
      return r ? String(r.mid).replace(".", ",") : "—";
    }

    eurEl.textContent = find("EUR");
    usdEl.textContent = find("USD");
    gbpEl.textContent = find("GBP");

    infoEl.textContent = `Źródło: NBP (tabela A), data: ${effectiveDate || "—"}`;
  } catch (e) {
    infoEl.textContent = "Nie udało się pobrać kursów (sprawdź internet).";
  }
}
