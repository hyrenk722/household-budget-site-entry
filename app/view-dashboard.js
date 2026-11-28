// view-dashboard.js — monthly overview: totals, donut, budget bars, recent, bills.

import { money, pct, monthLabel, monthShort, shiftMonth, esc } from "./format.js";
import { monthTotals, categorySpend, savingsMoved, transactionsForMonth, BILLS, CATEGORIES, CATEGORY_COLORS } from "./data.js";
import { donutChart } from "./charts.js";

export function render(ctx) {
  const { state, month } = ctx;
  const t = monthTotals(state, month);
  const spend = categorySpend(state, month);
  // A-01 (rev2): the savings rate is money actually moved to savings, not
  // leftover relabelled. (income-spent)/income read 31% while $0 had moved
  // to savings — the cover screenshot contradicted itself.
  const moved = savingsMoved(state, month);
  const saveRate = t.income ? Math.round((moved / t.income) * 100) : 0;
  const slices = CATEGORIES
    .filter((c) => spend[c.name])
    .map((c) => ({ label: c.name, value: spend[c.name], color: c.color }))
    .sort((a, b) => b.value - a.value);
  const recent = transactionsForMonth(state, month).slice(0, 5);
  const budgetRows = CATEGORIES.filter((c) => state.budgets[c.name]).map((c) => {
    // N1: the Savings row shows money actually moved to savings, not spending.
    const used = c.name === "Savings" ? savingsMoved(state, month) : (spend[c.name] || 0);
    const limit = state.budgets[c.name];
    const ratio = used / limit;
    const cls = ratio > 1 ? "over" : ratio >= 0.85 ? "near" : "";
    // N2: exactly at the limit is "At limit", not "Almost there".
    const badge = ratio > 1 ? '<span class="badge over">Over</span>'
      : Math.abs(ratio - 1) < 1e-9 ? '<span class="badge limit">At limit</span>'
      : ratio >= 0.85 ? '<span class="badge near">Almost there</span>' : "";
    return `<div class="budget-row">
      <span class="cat"><span class="cat-dot" style="background:${c.color}"></span>${c.name} ${badge}</span>
      <span class="nums">${money(used)} of ${money(limit)}</span>
      <span class="bar"><span class="${cls}" style="width:${Math.min(100, ratio * 100).toFixed(0)}%"></span></span>
    </div>`;
  }).join("");
  // F-10: bills fall due in the month after the month being viewed.
  const nextMonth = shiftMonth(month, 1);
  const billRows = BILLS.map((b) => `<div class="bill-row"><div>${b.name}<small>${b.note} · due ${monthShort(nextMonth)} ${b.dueDay}</small></div><span class="amt">${money(b.amount)}</span></div>`).join("");

  return `
  <div class="monthbar">
    <button class="btn ghost small" data-month-shift="-1" aria-label="Previous month">‹ Prev</button>
    <h1>${monthLabel(month)}</h1>
    <button class="btn ghost small" data-month-shift="1" aria-label="Next month">Next ›</button>
    <span class="spacer"></span>
    <a class="btn" href="#/transactions">+ Add transaction</a>
  </div>
  <p class="lede">How the Alvarez household is doing this month — every dollar is tracked, and the plan updates itself as life happens.</p>
  <div class="grid grid-4 mt">
    <div class="card stat"><div class="label">Income</div><div class="value good">${money(t.income)}</div><div class="note">Salary + freelance</div></div>
    <div class="card stat"><div class="label">Spent</div><div class="value">${money(t.spent)}</div><div class="note">${pct(t.spent, t.income)} of income</div></div>
    <div class="card stat"><div class="label">Left over</div><div class="value ${t.remaining < 0 ? "warn" : "good"}">${money(t.remaining)}</div><div class="note">Before planned saving · ${money(moved)} moved to savings</div></div>
    <div class="card stat"><div class="label">Savings rate</div><div class="value ${saveRate >= 15 ? "good" : ""}">${saveRate}%</div><div class="note">Moved to savings · Goal: 15% of income</div></div>
  </div>
  <div class="grid grid-2-1 mt">
    <div class="card">
      <h2>Where the money went</h2>
      <div class="donut-grid">
        <div class="chart-wrap">${donutChart(slices)}</div>
        <ul class="legend">${slices.map((s) => `<li><span class="cat-dot" style="background:${s.color}"></span>${s.label}<span class="amt">${money(s.value)}</span></li>`).join("")}</ul>
      </div>
    </div>
    <div class="card">
      <h2>Bills coming up</h2>
      ${billRows}
      <p class="hint" style="margin-top:.7rem">Total due in ${monthLabel(nextMonth)}: <strong>${money(BILLS.reduce((a, b) => a + b.amount, 0))}</strong></p>
    </div>
  </div>
  <div class="grid grid-2 mt">
    <div class="card">
      <h2>Budget progress</h2>
      ${budgetRows}
      <p class="hint" style="margin-top:.7rem"><a href="#/budget">Open the full budget →</a></p>
    </div>
    <div class="card">
      <h2>Recent transactions</h2>
      <ul class="tx-list">
        ${recent.map((tx) => `<li><span class="cat-dot" style="background:${CATEGORY_COLORS[tx.cat] || "#999"}"></span><span class="desc">${esc(tx.desc)}<small>${tx.date} · ${esc(tx.cat)}</small></span><span class="amt ${tx.amt < 0 ? "negative" : "positive"}">${tx.amt < 0 ? "−" : "+"}${money(Math.abs(tx.amt))}</span></li>`).join("")}
      </ul>
      <p class="hint" style="margin-top:.7rem"><a href="#/transactions">See all transactions →</a></p>
    </div>
  </div>`;
}

export function bind() {}
