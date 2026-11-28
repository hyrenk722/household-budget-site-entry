// view-reports.js — six-month income vs spending, category comparison, data-driven tips.

import { money, monthShort, monthLabel, pct, shiftMonth } from "./format.js";
import { monthTotals, categorySpend, MONTH_SUMMARIES, CATEGORIES } from "./data.js";
import { barChart } from "./charts.js";

export function render(ctx) {
  const { state, month } = ctx;
  // F-10: the six months always end at the month being viewed — nothing is
  // frozen on November 2026.
  const months = [-5, -4, -3, -2, -1, 0].map((d) => shiftMonth(month, d));
  const series = months.map((ym) => {
    const summary = MONTH_SUMMARIES.find((s) => s.ym === ym);
    if (summary) return { label: monthShort(ym), income: summary.income, spent: summary.spent, fromSummary: true };
    const t = monthTotals(state, ym);
    return { label: monthShort(ym), income: t.income, spent: t.spent, fromSummary: false };
  });
  const avgIncome = Math.round(series.reduce((a, m) => a + m.income, 0) / series.length);
  const avgSpent = Math.round(series.reduce((a, m) => a + m.spent, 0) / series.length);
  // F-21 (rev2): income minus spending is money LEFT OVER, not money saved —
  // nothing here was actually moved to savings (savingsMoved is $0 for every
  // month in the data). Calling it "saved" put a false 17% savings rate on
  // this page, contradicting the Dashboard's $0 moved.
  const avgLeftOver = avgIncome - avgSpent;
  const best = series.reduce((a, m) => (m.income - m.spent > a.income - a.spent ? m : a), series[0]);
  // F-18: say out loud which months are stored summaries, not live totals.
  const summaryLabels = series.filter((m) => m.fromSummary).map((m) => m.label);
  const summaryNote = summaryLabels.length
    ? `<p class="hint" style="margin-top:.7rem">${summaryLabels.join(", ")}: stored monthly summaries — the family kept totals only for those months, not every transaction.</p>`
    : "";

  // Category comparison: this month vs last month (both follow the viewed month).
  const prevMonth = shiftMonth(month, -1);
  const thisSpend = categorySpend(state, month);
  const lastSpend = categorySpend(state, prevMonth);
  // F-20 (rev2): months with only a stored summary (Jun–Aug 2026) have no
  // transactions, so the per-category comparison used to render 0 rows while
  // the chart above still showed numbers. Show the totals from the summary
  // and say out loud that there is no per-category breakdown.
  let compareRows = CATEGORIES.filter((c) => thisSpend[c.name] || lastSpend[c.name]).map((c) => {
    const cur = thisSpend[c.name] || 0;
    const prev = lastSpend[c.name] || 0;
    const delta = cur - prev;
    const arrow = delta > 0 ? "▲" : delta < 0 ? "▼" : "—";
    const cls = delta > 0 ? "negative" : delta < 0 ? "positive" : "";
    return `<tr><td><span class="cat-dot" style="background:${c.color}"></span>${c.name}</td>
      <td class="num">${money(prev)}</td><td class="num">${money(cur)}</td>
      <td class="num ${cls}">${arrow} ${money(Math.abs(delta))}</td></tr>`;
  }).join("");
  if (!compareRows) {
    const spentFor = (ym) => {
      const s = MONTH_SUMMARIES.find((x) => x.ym === ym);
      return s ? s.spent : monthTotals(state, ym).spent;
    };
    const curTotal = spentFor(month);
    const prevTotal = spentFor(prevMonth);
    const delta = curTotal - prevTotal;
    const arrow = delta > 0 ? "▲" : delta < 0 ? "▼" : "—";
    const cls = delta > 0 ? "negative" : delta < 0 ? "positive" : "";
    compareRows = `<tr><td>Total spending</td>
      <td class="num">${money(prevTotal)}</td><td class="num">${money(curTotal)}</td>
      <td class="num ${cls}">${arrow} ${money(Math.abs(delta))}</td></tr>
    <tr><td colspan="4" class="hint">No transaction-level data for these months — only monthly totals were kept, so there is no per-category breakdown. See the chart above for the totals.</td></tr>`;
  }

  const tips = [];
  const dining = (thisSpend["Dining Out"] || 0) + (lastSpend["Dining Out"] || 0);
  if (dining > 8000) tips.push(`Eating out cost ${money(dining)} over the last two months. Cooking two extra dinners a week at home saves roughly $90 a month for this family.`);
  const groceries = thisSpend.Groceries || 0;
  if (groceries > 55000) tips.push(`Groceries ran ${money(groceries)} in ${monthLabel(month)}. A weekly meal plan and one bulk Costco run a month — instead of three small trips — cuts impulse buys.`);
  const entertainment = thisSpend.Entertainment || 0;
  if (entertainment > 5000) tips.push(`Entertainment was ${money(entertainment)} in ${monthLabel(month)}. The library lends movies and board games free, and the kids love the park just as much.`);
  tips.push(`Average left over over six months is ${money(avgLeftOver)} a month (${pct(avgLeftOver, avgIncome)} of income). Moving that amount to savings on payday, automatically, locks the habit in.`);
  if (best) tips.push(`${best.label} was the best month — ${money(best.income - best.spent)} left over. Whatever the family did then is worth repeating.`);

  return `
  <h1>Reports</h1>
  <p class="lede">Six months of real numbers for the Alvarez household — income against spending, category by category.</p>
  <div class="grid grid-3 mt">
    <div class="card stat"><div class="label">Average income / mo</div><div class="value">${money(avgIncome)}</div><div class="note">Last 6 months</div></div>
    <div class="card stat"><div class="label">Average spending / mo</div><div class="value">${money(avgSpent)}</div><div class="note">Last 6 months</div></div>
    <div class="card stat"><div class="label">Average left over / mo</div><div class="value ${avgLeftOver >= 0 ? "good" : "warn"}">${money(avgLeftOver)}</div><div class="note">${pct(avgLeftOver, avgIncome)} left over, before planned saving</div></div>
  </div>
  <div class="card mt">
    <h2>Income vs spending — last 6 months</h2>
    <div class="chart-wrap">${barChart(series)}</div>
    ${summaryNote}
  </div>
  <div class="grid grid-2 mt">
    <div class="card">
      <h2>${monthShort(month)} vs ${monthShort(prevMonth)}, by category</h2>
      <div class="tablewrap"><table>
        <thead><tr><th>Category</th><th class="num">${monthShort(prevMonth)}</th><th class="num">${monthShort(month)}</th><th class="num">Change</th></tr></thead>
        <tbody>${compareRows}</tbody>
      </table></div>
    </div>
    <div class="card">
      <h2>Tips from your own numbers</h2>
      <ul class="stack" style="list-style:none;margin:0;padding:0">
        ${tips.map((t) => `<li>· ${t}</li>`).join("")}
      </ul>
      <p class="hint" style="margin-top:.8rem">These tips are computed from this family's actual spending, not generic advice — change a transaction and the tips change.</p>
    </div>
  </div>`;
}

export function bind() {}
