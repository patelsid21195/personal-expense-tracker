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


✅ PART 1 — v1.0 RELEASE SUMMARY (for README.md)

You can copy-paste this section directly into your README.md.

📌 Personal Finance Tracker — v1.0 (Stable)
Overview

Version v1.0 of the Personal Finance Tracker is a stable, fully functional browser-based budgeting and forecasting tool for personal use.
It is designed to provide clear financial visibility without over-engineering or hidden logic.

The app focuses on correct financial modeling, predictability, and long-term maintainability.

Core Capabilities

Rolling monthly bank balance forecast for the entire year (2026)

Clear separation of:

Income

Fixed costs

Variable expenses

Savings

Month-by-month expense tracking with automatic date/time capture

Monthly and yearly summaries

Visual charts for quick financial insight

Mobile-friendly UI

No backend required (100% static)

Financial Model (Guaranteed in v1.0)

The application uses a transparent and realistic cash-flow model:

bankNet = income − fixedCosts − variableExpenses
endBalance = startBalance + bankNet + savings


Important guarantees:

Savings are not treated as expenses

Savings increase net worth

No double-counting of money

All views (Overview, Summary, Charts) use the same source of truth

What v1.0 Does NOT Do (By Design)

No persistent storage (refresh resets data)

No multi-year tracking

No alerts or warnings

No authentication

No cloud sync

These features are intentionally deferred to future versions.

Stability Promise

In v1.0:

Core calculations are stable and tested

UI features are layered on top of a fixed logic core

Any future features can be added or removed without breaking existing behavior

Intended Usage

Personal budgeting

Financial planning

Understanding monthly vs yearly cash-flow

Learning financial modeling through code

Versioning Strategy

v1.0 → Stable finance engine (this release)

v1.1 → Export / persistence

v1.2 → Advanced charts

v2.0 → Multi-year support
