let chartInstance = null;

function groupExpensesByCategory(transactions) {
  const map = new Map();
  for (const t of transactions) {
    if (t.type !== "expense") continue;
    const key = t.category || "Inne";
    map.set(key, (map.get(key) || 0) + Number(t.amount));
  }
  return map;
}

function renderCategoryChart(transactions) {
  const canvas = document.getElementById("categoryChart");
  if (!canvas || typeof Chart === "undefined") return;

  const map = groupExpensesByCategory(transactions);

  const labels = Array.from(map.keys());
  const values = Array.from(map.values());

  // jeżeli brak wydatków, pokaż pusty wykres
  const finalLabels = labels.length ? labels : ["Brak wydatków"];
  const finalValues = values.length ? values : [1];

  if (chartInstance) chartInstance.destroy();

  chartInstance = new Chart(canvas, {
    type: "doughnut",
    data: {
      labels: finalLabels,
      datasets: [
        {
          data: finalValues
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { position: "bottom" }
      }
    }
  });
}
