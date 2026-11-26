// view-budget.js — monthly category budgets: limits, progress, warnings, cut-back tips.

import { money, monthLabel, esc } from "./format.js";
import { categorySpend, savingsMoved, setBudget, CATEGORIES } from "./data.js";

let budgetMsg = "";

function tipFor(cat, used, limit) {
  // N2: the Savings tip is about money still to move, not money overspent.
  if (cat === "Savings") {
    if (used >= limit) return "Savings target met for this month — nice work. The money is already set aside.";
    return `You are ${money(limit - used)} short of this month's saving target. Move money to savings on payday, before spending starts.`;
  }
  if (used <= limit) return "On track — keep it up.";
  const over = used - limit;
  const tips = {
    Groceries: `You are ${money(over)} over. Plan meals for the week and shop with a list — the Alvarez family saves about $60 a month that way.`,
    "Dining Out": `You are ${money(over)} over. Swap two takeout nights for home-cooked favourites and the gap closes.`,
    Entertainment: `You are ${money(over)} over. Use the library and free park days for one weekend a month.`,
    Transport: `You are ${money(over)} over. Carpool the school run twice a week and check tire pressure — it really does save gas.`,
    Utilities: `You are ${money(over)} over. Shorter showers and LED bulbs cut the next bill by a few dollars each.`,
    Healthcare: `You are ${money(over)} over. Ask the pharmacy about the generic version — same medicine, smaller copay.`,
    Education: `You are ${money(over)} over. The library's free workbooks cover most of what the book fair sells.`,
    Clothing: `You are ${money(over)} over. Buy next season's coats on clearance and hand clothes down between the kids.`,
    Housing: `You are ${money(over)} over. Rent is fixed — check the lease renewal date and start comparing options early.`,
  };
  return tips[cat] || `You are ${money(over)} over.`;
}

export function render(ctx) {
  const { state, month } = ctx;
  const spend = categorySpend(state, month);
  // N1: Savings is a target, not spending — it stays out of both totals.
  const counted = CATEGORIES.filter((c) => c.name !== "Savings");
  const totalLimit = counted.reduce((a, c) => a + (state.budgets[c.name] || 0), 0);
  const totalUsed = counted.reduce((a, c) => a + (spend[c.name] || 0), 0);
  // F-04: no budget set yet must never read "Infinity%" / "NaN%".
  const planNote = totalLimit ? `${Math.round((totalUsed / totalLimit) * 100)}% of the plan` : "No budget set yet";
  const rows = CATEGORIES.map((c) => {
    const used = c.name === "Savings" ? savingsMoved(state, month) : (spend[c.name] || 0);
    const limit = state.budgets[c.name] || 0;
    const ratio = limit ? used / limit : 0;
    const cls = ratio > 1 ? "over" : ratio >= 0.85 ? "near" : "";
    const over = ratio > 1;
    const atLimit = !over && Math.abs(ratio - 1) < 1e-9;
    const badge = over ? '<span class="badge over">Over budget</span>'
      : atLimit ? '<span class="badge limit">At limit</span>'
      : ratio >= 0.85 ? '<span class="badge near">Almost there</span>'
      : '<span class="badge">On track</span>';
    return `<tr class="${over ? "over" : ""}">
      <td><span class="cat-dot" style="background:${c.color}"></span>${c.name}</td>
      <td class="num">${money(used)}</td>
      <td class="num"><input type="number" min="0" step="0.01" value="${(limit / 100).toFixed(2)}" data-budget="${c.name}" aria-label="Monthly limit for ${c.name} in dollars" style="width:6.5rem;text-align:right"> $</td>
      <td class="num">${money(limit - used)}</td>
      <td style="min-width:9rem"><span class="bar"><span class="${cls}" style="width:${Math.min(100, ratio * 100).toFixed(0)}%"></span></span></td>
      <td>${badge}</td>
    </tr>
    <tr><td colspan="6" class="hint" style="border-bottom:1px solid var(--line)">${tipFor(c.name, used, limit)}</td></tr>`;
  }).join("");

  return `
  <h1>Budget — ${monthLabel(month)}</h1>
  <p class="lede">Set a monthly limit for each category, then watch the bars fill. Type a new limit and press Enter — it saves straight away.</p>
  <div class="grid grid-3 mt">
    <div class="card stat"><div class="label">Total budgeted</div><div class="value">${money(totalLimit)}</div><div class="note">All categories except Savings, this month</div></div>
    <div class="card stat"><div class="label">Total spent</div><div class="value ${totalUsed > totalLimit ? "warn" : ""}">${money(totalUsed)}</div><div class="note">${planNote}</div></div>
    <div class="card stat"><div class="label">Still to spend</div><div class="value ${totalLimit - totalUsed < 0 ? "warn" : "good"}">${money(totalLimit - totalUsed)}</div><div class="note">Across all categories except Savings</div></div>
  </div>
  <div class="card mt">
    <div class="tablewrap">
      <table>
        <thead><tr><th>Category</th><th class="num">Spent</th><th class="num">Monthly limit</th><th class="num">Left</th><th>Progress</th><th>Status</th></tr></thead>
        <tbody>${rows}</tbody>
      </table>
    </div>
    <p class="form-msg" id="budget-msg" role="alert">${esc(budgetMsg)}</p>
    <p class="hint" style="margin-top:.7rem">Limits are per month and apply to every month you view. Spending is counted from real transactions — add one on the Transactions page and the bars move. Savings is a monthly target, not spending, so it is not counted in the totals above.</p>
  </div>
  <div class="callout mt">
    <strong>How the Alvarez family built this budget:</strong> fixed costs first (rent, utilities, transport), then groceries at $620 a month, then fun money with a hard cap — $220 for eating out, $150 for entertainment. Whatever is left goes to savings before the month starts, not after.
  </div>`;
}

export function bind(el, ctx) {
  const { state, rerender } = ctx;
  el.querySelectorAll("[data-budget]").forEach((input) => {
    input.addEventListener("change", () => {
      // F-14: a non-number is reported and the old value restored, not swallowed.
      const raw = (input.value || "").trim();
      const v = Math.round(parseFloat(raw) * 100);
      if (raw === "" || !Number.isFinite(v) || v < 0) {
        budgetMsg = `“${raw || "blank"}” is not a valid limit for ${input.dataset.budget} — please enter a number of dollars, e.g. 620.50.`;
        el.querySelector("#budget-msg").textContent = budgetMsg;
        input.value = ((state.budgets[input.dataset.budget] || 0) / 100).toFixed(2);
        return;
      }
      budgetMsg = "";
      setBudget(state, input.dataset.budget, v);
      rerender();
    });
  });
}
