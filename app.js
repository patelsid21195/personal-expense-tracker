/************************************************************
 * PERSONAL FINANCE APP — ROLLING BALANCE VERSION
 ************************************************************/

const YEAR = "2026";

const MONTHS = [
  "January","February","March","April",
  "May","June","July","August",
  "September","October","November","December"
];

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
  Number(localStorage.getItem("openingBalance")) || 1000;

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

  const order = ["overviewTab","fixedTab","expensesTab","summaryTab"];
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
    amount: Number(amount.value)
  });
  saveAll(); e.target.reset(); render();
};

function renderExpenses() {
  expenseList.innerHTML = "";
  expenses[YEAR][currentMonth].forEach(e => {
    const li = document.createElement("li");
    li.textContent = `${e.category}: €${e.amount}`;
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

  // Fixed costs vs savings
  for (const name in fixed.Costs) {
    if (!fixed.Costs[name].active) continue;

    if (name.toLowerCase().includes("saving")) {
      savings += fixed.Costs[name].amount;
    } else {
      fixedCosts += fixed.Costs[name].amount;
    }
  }

  const variable =
    expenses[YEAR][month].reduce((s, e) => s + e.amount, 0);

  return {
    bankNet: income - fixedCosts - variable,
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
        data: [income, fixedCosts, variable],
        backgroundColor: ["#16a34a","#dc2626","#f59e0b"]
      }]
    }
  });
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
}

render();
showTab("overviewTab");
