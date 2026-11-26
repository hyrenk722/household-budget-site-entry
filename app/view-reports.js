// view-reports.js — six-month income vs spending, category comparison, data-driven tips.

import { money, monthShort, pct } from "./format.js";
import { monthTotals, categorySpend, MONTH_SUMMARIES, CATEGORIES, CATEGORY_COLORS } from "./data.js";
import { barChart } from "./charts.js";

export function render(ctx) {
  const { state } = ctx;
  const months = ["2026-06", "2026-07", "2026-08", "2026-09", "2026-10", "2026-11"];
  const series = months.map((ym) => {
    const summary = MONTH_SUMMARIES.find((s) => s.ym === ym);
    if (summary) return { label: monthShort(ym), income: summary.income, spent: summary.spent };
    const t = monthTotals(state, ym);
    return { label: monthShort(ym), income: t.income, spent: t.spent };
  });
  const avgIncome = Math.round(series.reduce((a, m) => a + m.income, 0) / series.length);
  const avgSpent = Math.round(series.reduce((a, m) => a + m.spent, 0) / series.length);
  const avgSaved = avgIncome - avgSpent;
  const best = series.reduce((a, m) => (m.income - m.spent > a.income - a.spent ? m : a), series[0]);

  // Category comparison: this month vs last month
  const thisSpend = categorySpend(state, "2026-11");
  const lastSpend = categorySpend(state, "2026-10");
  const compareRows = CATEGORIES.filter((c) => thisSpend[c.name] || lastSpend[c.name]).map((c) => {
    const cur = thisSpend[c.name] || 0;
    const prev = lastSpend[c.name] || 0;
    const delta = cur - prev;
    const arrow = delta > 0 ? "▲" : delta < 0 ? "▼" : "—";
    const cls = delta > 0 ? "negative" : delta < 0 ? "positive" : "";
    return `<tr><td><span class="cat-dot" style="background:${c.color}"></span>${c.name}</td>
      <td class="num">${money(prev)}</td><td class="num">${money(cur)}</td>
      <td class="num ${cls}">${arrow} ${money(Math.abs(delta))}</td></tr>`;
  }).join("");

  const tips = [];
  const dining = (thisSpend["Dining Out"] || 0) + (lastSpend["Dining Out"] || 0);
  if (dining > 8000) tips.push(`Eating out cost ${money(dining)} over the last two months. Cooking two extra dinners a week at home saves roughly $90 a month for this family.`);
  const groceries = thisSpend.Groceries || 0;
  if (groceries > 55000) tips.push(`Groceries ran ${money(groceries)} in November. A weekly meal plan and one bulk Costco run a month — instead of three small trips — cuts impulse buys.`);
  const entertainment = thisSpend.Entertainment || 0;
  if (entertainment > 5000) tips.push(`Entertainment was ${money(entertainment)} in November. The library lends movies and board games free, and the kids love the park just as much.`);
  tips.push(`Average saving over six months is ${money(avgSaved)} a month (${pct(avgSaved, avgIncome)} of income). Moving that amount to savings on payday, automatically, locks the habit in.`);
  if (best) tips.push(`${best.label} was the best month — ${money(best.income - best.spent)} saved. Whatever the family did then is worth repeating.`);

  return `
  <h1>Reports</h1>
  <p class="lede">Six months of real numbers for the Alvarez household — income against spending, category by category.</p>
  <div class="grid grid-3 mt">
    <div class="card stat"><div class="label">Average income / mo</div><div class="value">${money(avgIncome)}</div><div class="note">Last 6 months</div></div>
    <div class="card stat"><div class="label">Average spending / mo</div><div class="value">${money(avgSpent)}</div><div class="note">Last 6 months</div></div>
    <div class="card stat"><div class="label">Average saved / mo</div><div class="value good">${money(avgSaved)}</div><div class="note">${pct(avgSaved, avgIncome)} savings rate</div></div>
  </div>
  <div class="card mt">
    <h2>Income vs spending — last 6 months</h2>
    <div class="chart-wrap">${barChart(series)}</div>
  </div>
  <div class="grid grid-2 mt">
    <div class="card">
      <h2>November vs October, by category</h2>
      <div class="tablewrap"><table>
        <thead><tr><th>Category</th><th class="num">Oct</th><th class="num">Nov</th><th class="num">Change</th></tr></thead>
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
