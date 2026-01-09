# 💰 Personal Finance Tracker — 2026

A browser-based personal finance tracker built with HTML, CSS, and vanilla JavaScript.

## Core Features
- Monthly rolling balance forecast
- Fixed costs, variable expenses, and savings separation
- Add / edit / delete expenses with date & time
- Monthly and yearly summaries
- Beginner-friendly, no backend required

## Financial Model (IMPORTANT)
bankNet = income - fixedCosts - variableExpenses  
endBalance = startBalance + bankNet + savings  

Savings are NOT expenses — they increase net worth.

## Files
- index.html → structure & UI
- style.css → layout & design
- app.js → logic & calculations

## Hosting
Works on Netlify, GitHub Pages, Vercel, or any static host.

## Customization Levels
- Beginner: change values, colors
- Intermediate: add categories, warnings
- Advanced: persistence, charts, exports

Always change ONE thing at a time.


🏷️ Version History
✅ v1.0 — Stable Core Release

Status: Frozen
Focus: Correct financial modeling & predictable behavior

v1.0 establishes a stable foundation with:

Clear separation of:

Income

Fixed costs (excluding savings)

Variable expenses

Savings

Rolling yearly balance forecast

Monthly and yearly summaries

Expense tracking with automatic date & time

Visual charts for monthly insight

Mobile-friendly UI

No persistence (refresh resets data)

Core financial model (locked in v1.0):

bankNet = income − fixedCosts − variableExpenses
endBalance = startBalance + bankNet + savings


v1.0 is intentionally minimal and predictable.

🚀 v1.1 — Export Features (Current)

Status: Frozen
Focus: Data portability & auditability
Backward compatible with v1.0

Version v1.1 adds CSV export functionality without changing any core financial logic.

New Features in v1.1
📤 Yearly CSV Export

Exports a full-year financial overview with one row per month.

Columns:

Month

Income

Fixed Costs (excluding savings)

Variable Expenses

Savings

Net Cashflow

Total Growth (net + savings)

End Balance (rolling)

✔ Uses the same source of truth as the UI
✔ Matches Overview and Summary exactly

📤 Expense-Level CSV Export

Exports all expenses across all months, one row per expense.

Columns:

Month

Category

Amount

Date

Time

✔ Date and time are stored automatically at entry
✔ Suitable for auditing or accounting
✔ Excel / Google Sheets compatible

📤 Month-Level CSV Export

Exports a single selected month with:

Monthly summary (income, costs, savings, net)

Followed by all expenses for that month

✔ Useful for monthly reviews
✔ Shareable snapshot
✔ Human-readable format

Design Principles Followed in v1.1

✅ No recalculation of financial values

✅ All exports read from the same core logic (getMonthlyNet)

✅ Read-only features (no mutation of state)

✅ Easy to remove or extend

✅ No impact on existing UI or calculations

What v1.1 Does NOT Do (By Design)

No PDF export

No data import

No persistence yet

No charts in exported files

These are intentionally deferred to future versions.

🧭 Versioning Strategy Going Forward

v1.2 → LocalStorage persistence

v1.3+ → Advanced visuals, backups, imports

Each version:

adds features incrementally

preserves backward compatibility

freezes a stable baseline via Git tags
