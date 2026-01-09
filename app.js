/************************************************************
 * PERSONAL FINANCE APP — ROLLING BALANCE VERSION
 ************************************************************/

const YEAR = "2026";

const MONTHS = [
  "January", "February", "March", "April",
  "May", "June", "July", "August",
  "September", "October", "November", "December"
];

const expenseList = document.getElementById("expenseList");

let currentMonth = MONTHS[0];

/************************************************************
 * STORAGE
 ************************************************************/

let expenses = JSON.parse(localStorage.getItem("expenses")) || {};
let fixed = JSON.parse(localStorage.getItem("fixed")) || {
  Income: { Salary: { amount: 3563, active: true } },
  Costs: {
    Rent: { amount: 842, active: true },
    Pension: { amount: 450, active: true },
    "Loan Payments": { amount: 1000, active: true },
    Electricity: { amount: 38, active: true },
    Transportation: { amount: 65, active: true },
    Subscriptions: { amount: 40, active: true },
    Internet: { amount: 39, active: true },
    Phone: { amount: 28, active: true },
    "Savings Goal": { amount: 500, active: true }
  }
};

let openingBalance =
  Number(localStorage.getItem("openingBalance")) || 0;

if (!expenses[YEAR]) {
  expenses[YEAR] = Object.fromEntries(
    MONTHS.map(m => [m, []])
  );
}

saveAll();

/************************************************************
 * TAB HANDLING
 ************************************************************/

function showTab(tabId) {
  document.querySelectorAll(".tab").forEach(t => t.classList.remove("active"));
  document.querySelectorAll(".tabs button").forEach(b => b.classList.remove("active"));

  document.getElementById(tabId).classList.add("active");

  const order = ["overviewTab", "fixedTab", "expensesTab", "summaryTab"];
  document.querySelectorAll(".tabs button")[order.indexOf(tabId)]
    .classList.add("active");
}

/************************************************************
 * MONTH SELECTOR
 ************************************************************/

const monthSelect = document.getElementById("monthSelect");
MONTHS.forEach(m => {
  const o = document.createElement("option");
  o.value = m;
  o.textContent = m;
  monthSelect.appendChild(o);
});
monthSelect.value = currentMonth;

monthSelect.onchange = () => {
  currentMonth = monthSelect.value;
  render();
};

/************************************************************
 * FIXED ITEMS
 ************************************************************/

function renderFixed() {
  fixedList.innerHTML = "";

  for (const type in fixed) {
    for (const name in fixed[type]) {
      const item = fixed[type][name];

      const row = document.createElement("div");
      row.className = "fixed-row";

      const nameInput = document.createElement("input");
      nameInput.value = name;

      const amountInput = document.createElement("input");
      amountInput.type = "number";
      amountInput.value = item.amount;

      const toggle = document.createElement("input");
      toggle.type = "checkbox";
      toggle.checked = item.active;

      nameInput.onblur = () => {
        if (nameInput.value !== name) {
          delete fixed[type][name];
          fixed[type][nameInput.value] = item;
          saveAll(); render();
        }
      };

      amountInput.onblur = () => {
        item.amount = Number(amountInput.value);
        saveAll(); render();
      };

      toggle.onchange = () => {
        item.active = toggle.checked;
        saveAll(); render();
      };

      row.append(nameInput, amountInput, toggle);
      fixedList.appendChild(row);
    }
  }
}

fixedForm.onsubmit = e => {
  e.preventDefault();
  fixed[fixedType.value][fixedName.value] = {
    amount: Number(fixedAmount.value),
    active: true
  };
  saveAll(); e.target.reset(); render();
};

/************************************************************
 * EXPENSES
 ************************************************************/

expenseForm.onsubmit = e => {
  e.preventDefault();
  expenses[YEAR][currentMonth].push({
    category: category.value,
    amount: Number(amount.value),
    date: new Date().toISOString() // ⏱ auto date & time
  });
  saveAll(); e.target.reset(); render();
};

function renderExpenses() {
  // 🔹 Always clear list first (prevents duplicates)
  expenseList.innerHTML = "";

  expenses[YEAR][currentMonth].forEach((e, index) => {
    const li = document.createElement("li");

    // Text
    const text = document.createElement("span");
    const dateText = e.date
      ? new Date(e.date).toLocaleString()
      : "No date";

    text.textContent = `${e.category}: €${e.amount} (${dateText})`;

    // ✏️ Edit button
    const editBtn = document.createElement("button");
    editBtn.textContent = "✏️";
    editBtn.style.marginLeft = "10px";

    editBtn.onclick = () => {
      const newCategory = prompt("Edit category:", e.category);
      const newAmount = prompt("Edit amount (€):", e.amount);

      if (newCategory !== null && newAmount !== null) {
        e.category = newCategory;
        e.amount = Number(newAmount);
        render();
      }
    };

    // ❌ Delete button
    const deleteBtn = document.createElement("button");
    deleteBtn.textContent = "❌";
    deleteBtn.style.marginLeft = "6px";

    deleteBtn.onclick = () => {
      expenses[YEAR][currentMonth].splice(index, 1);
      render();
    };

    li.appendChild(text);
    li.appendChild(editBtn);
    li.appendChild(deleteBtn);
    expenseList.appendChild(li);
  });
}


/************************************************************
 * FINANCIAL CALCULATIONS
 ************************************************************/

function sumActive(obj) {
  return Object.values(obj)
    .filter(i => i.active)
    .reduce((s, i) => s + i.amount, 0);
}

function getMonthlyNet(month) {
  let income = 0;
  let fixedCosts = 0;
  let savings = 0;

  // Income
  for (const name in fixed.Income) {
    if (fixed.Income[name].active) {
      income += fixed.Income[name].amount;
    }
  }

  // Fixed costs vs savings (STRICT separation)
  for (const name in fixed.Costs) {
    if (!fixed.Costs[name].active) continue;

    if (name.toLowerCase().includes("saving")) {
      savings += fixed.Costs[name].amount;
    } else {
      fixedCosts += fixed.Costs[name].amount;
    }
  }

  const variable =
    expenses[YEAR][month].reduce((sum, e) => sum + e.amount, 0);

  const rawNet = income - fixedCosts - variable;

  return {
    bankNet: rawNet - savings, // ⛔ force-remove savings
    savings
  };
}

/************************************************************
 * OVERVIEW — ROLLING BALANCE
 ************************************************************/

const openingBalanceInput = document.getElementById("openingBalance");
openingBalanceInput.value = openingBalance;

openingBalanceInput.onblur = () => {
  openingBalance = Number(openingBalanceInput.value);
  localStorage.setItem("openingBalance", openingBalance);
  render();
};

function renderOverview() {
  forecastTable.innerHTML = "";

  let runningBalance = openingBalance;

  MONTHS.forEach(month => {
    const start = runningBalance;
    const result = getMonthlyNet(month);
    const end = start + result.bankNet + result.savings;
    runningBalance = end;

    const row = document.createElement("div");
    row.className = "forecast-row";

    row.innerHTML = `
      <span>${month}</span>
      <span>€${start.toFixed(2)}</span>
      <span class="${end >= start ? "positive" : "negative"}">
        €${end.toFixed(2)}
      </span>
    `;

    forecastTable.appendChild(row);
    runningBalance = end;
  });
}

/************************************************************
 * SUMMARY
 ************************************************************/

let chart;

function renderSummary() {
  document.getElementById("summaryMonth").textContent = currentMonth;
  const income = sumActive(fixed.Income);
  const fixedCosts = sumActive(fixed.Costs);
  const variable = expenses[YEAR][currentMonth]
    .reduce((s, e) => s + e.amount, 0);

  sumIncome.textContent = `Income: €${income}`;
  sumFixed.textContent = `Fixed costs: €${fixedCosts}`;
  sumVariable.textContent = `Variable expenses: €${variable}`;
  sumNet.textContent = `Net result: €${income - fixedCosts - variable}`;

  if (chart) chart.destroy();

  chart = new Chart(financeChart, {
    type: "bar",
    data: {
      labels: ["Income", "Fixed Costs", "Variable"],
      datasets: [{
        label: "Monthly amounts (€)", // ✅ ADD THIS LINE
        data: [income, fixedCosts, variable],
        backgroundColor: ["#16a34a", "#dc2626", "#f59e0b"]
      }]
    }
  });
}

function renderEnhancedSummary() {
  // ---------- MONTHLY ----------
  const monthResult = getMonthlyNet(currentMonth);

  const monthlyVariable =
    expenses[YEAR][currentMonth].reduce((s, e) => s + e.amount, 0);

  const monthlyFixed =
    Object.values(fixed.Costs)
      .filter(c => c.active && !c.name?.toLowerCase?.().includes("saving"))
      .reduce((s, c) => s + c.amount, 0);

  document.getElementById("monthIncome").textContent =
    `Income: €${monthResult.bankNet + monthlyFixed + monthlyVariable}`;

  document.getElementById("monthFixed").textContent =
    `Fixed costs: €${monthlyFixed}`;

  document.getElementById("monthVariable").textContent =
    `Variable expenses: €${monthlyVariable}`;

  document.getElementById("monthSavings").textContent =
    `Savings: €${monthResult.savings}`;

  document.getElementById("monthNet").textContent =
    `Net cashflow: €${monthResult.bankNet}`;

  document.getElementById("monthGrowth").textContent =
    `Total monthly growth: €${monthResult.bankNet + monthResult.savings}`;

  // ---------- YEARLY ----------
  let yearIncome = 0;
  let yearFixed = 0;
  let yearVariable = 0;
  let yearSavings = 0;

  MONTHS.forEach(m => {
    const r = getMonthlyNet(m);
    yearSavings += r.savings;
    yearVariable += expenses[YEAR][m].reduce((s, e) => s + e.amount, 0);
  });

  Object.values(fixed.Income).forEach(i => {
    if (i.active) yearIncome += i.amount * 12;
  });

  Object.entries(fixed.Costs).forEach(([name, c]) => {
    if (!c.active) return;
    if (name.toLowerCase().includes("saving")) return;
    yearFixed += c.amount * 12;
  });

  const yearGrowth =
    (yearIncome - yearFixed - yearVariable) + yearSavings;

  document.getElementById("yearIncome").textContent =
    `Total income: €${yearIncome}`;

  document.getElementById("yearFixed").textContent =
    `Total fixed costs: €${yearFixed}`;

  document.getElementById("yearVariable").textContent =
    `Total variable expenses: €${yearVariable}`;

  document.getElementById("yearSavings").textContent =
    `Total savings: €${yearSavings}`;

  document.getElementById("yearGrowth").textContent =
    `Total yearly growth: €${yearGrowth}`;

  document.getElementById("yearEndBalance").textContent =
    `Projected end-of-year balance: €${openingBalance + yearGrowth}`;
}

let monthlyChart; // keep reference so we can update

function renderMonthlyChart() {
  const ctx = document.getElementById("monthlyChart");
  if (!ctx) return;

  const r = getMonthlyNet(currentMonth);

  const variable =
    expenses[YEAR][currentMonth].reduce((s, e) => s + e.amount, 0);

  const data = {
    labels: ["Income", "Fixed Costs", "Variable", "Savings"],
    datasets: [{
      data: [
        r.bankNet + variable + getSavings(currentMonth), // income proxy
        r.bankNet < 0 ? 0 : (r.bankNet + variable),
        variable,
        r.savings
      ],
      backgroundColor: [
        "#22c55e", // green
        "#ef4444", // red
        "#f59e0b", // orange
        "#3b82f6"  // blue
      ]
    }]
  };

  if (monthlyChart) monthlyChart.destroy();

  monthlyChart = new Chart(ctx, {
    type: "bar",
    data,
    options: {
      responsive: true,
      plugins: {
        legend: { display: false }
      }
    }
  });
}


function getSavings(month) {
  return getMonthlyNet(month).savings;
}





/************************************************************
 * SAVE & RENDER
 ************************************************************/

function saveAll() {
  localStorage.setItem("expenses", JSON.stringify(expenses));
  localStorage.setItem("fixed", JSON.stringify(fixed));
}

function render() {
  renderFixed();
  renderExpenses();
  renderOverview();
  renderSummary();
  renderEnhancedSummary();
  renderMonthlyChart();
}

render();
showTab("overviewTab");
