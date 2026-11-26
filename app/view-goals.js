// view-goals.js — savings goals: progress bars, add a goal, contribute real money.

import { money, pct, todayIso } from "./format.js";
import { addGoal, contributeToGoal } from "./data.js";

export function render(ctx) {
  const { state } = ctx;
  const totalSaved = state.goals.reduce((a, g) => a + g.saved, 0);
  const totalTarget = state.goals.reduce((a, g) => a + g.target, 0);
  const cards = state.goals.map((g) => {
    const ratio = g.saved / g.target;
    return `<div class="card">
      <div class="goal-head"><h2>${g.name}</h2><span class="target">${money(g.saved)} <span class="hint">of ${money(g.target)}</span></span></div>
      <p class="lede">${g.note || ""}</p>
      <span class="bar"><span style="width:${Math.min(100, ratio * 100).toFixed(0)}%"></span></span>
      <p style="margin-top:.5rem"><strong>${pct(g.saved, g.target)}</strong> funded · <span class="hint">${money(g.target - g.saved)} to go</span></p>
      <form class="contribute-form" data-goal="${g.id}">
        <div class="form-row" style="grid-template-columns:1fr auto">
          <div class="field"><label for="c-${g.id}">Add money ($)</label><input id="c-${g.id}" type="number" min="1" step="1" placeholder="50" required></div>
          <div class="field"><label>&nbsp;</label><button class="btn" type="submit">Contribute</button></div>
        </div>
        <p class="hint">Contributing records a real Savings transaction this month, so the Dashboard and Budget move too.</p>
      </form>
    </div>`;
  }).join("");

  return `
  <h1>Savings goals</h1>
  <p class="lede">Three things the Alvarez family is saving for — every contribution is real money, taken out of this month's spending.</p>
  <div class="grid grid-2 mt">
    <div class="card stat"><div class="label">Saved across all goals</div><div class="value good">${money(totalSaved)}</div><div class="note">${pct(totalSaved, totalTarget)} of all targets combined</div></div>
    <div class="card stat"><div class="label">Still to save</div><div class="value">${money(totalTarget - totalSaved)}</div><div class="note">Across ${state.goals.length} goals</div></div>
  </div>
  <div class="grid grid-2 mt">${cards}</div>
  <div class="card mt">
    <h2>Start a new goal</h2>
    <form id="goal-form">
      <div class="form-row">
        <div class="field"><label for="g-name">Goal name</label><input id="g-name" type="text" placeholder="e.g. New bikes for the kids" required></div>
        <div class="field"><label for="g-target">Target amount ($)</label><input id="g-target" type="number" min="1" step="1" placeholder="800" required></div>
      </div>
      <div class="form-actions"><button class="btn" type="submit">Add goal</button></div>
    </form>
  </div>`;
}

export function bind(el, ctx) {
  const { state, rerender, month } = ctx;
  el.querySelector("#goal-form").addEventListener("submit", (e) => {
    e.preventDefault();
    const target = Math.round(parseFloat(el.querySelector("#g-target").value) * 100);
    const name = el.querySelector("#g-name").value.trim();
    if (!name || !Number.isFinite(target) || target <= 0) return;
    addGoal(state, { name, target });
    rerender();
  });
  el.querySelectorAll(".contribute-form").forEach((f) => {
    f.addEventListener("submit", (e) => {
      e.preventDefault();
      const input = f.querySelector("input[type=number]");
      const cents = Math.round(parseFloat(input.value) * 100);
      if (!Number.isFinite(cents) || cents <= 0) return;
      contributeToGoal(state, f.dataset.goal, cents, todayIso());
      rerender();
    });
  });
}
