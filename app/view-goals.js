// view-goals.js — savings goals: progress bars, add a goal, contribute real money.

import { money, pct, monthLabel, dateInMonth, esc } from "./format.js";
import { addGoal, contributeToGoal } from "./data.js";

let goalFormMsg = "";
const contribNotices = {};

export function render(ctx) {
  const { state } = ctx;
  const totalSaved = state.goals.reduce((a, g) => a + g.saved, 0);
  const totalTarget = state.goals.reduce((a, g) => a + g.target, 0);
  const cards = state.goals.map((g) => {
    // F-08: a goal never shows more than 100% funded or a negative "to go".
    const funded = g.saved >= g.target;
    const ratio = Math.min(1, g.saved / g.target);
    const toGo = Math.max(0, g.target - g.saved);
    // A contribution note is shown exactly once: this render consumes it.
    const notice = contribNotices[g.id] || "";
    delete contribNotices[g.id];
    const form = funded
      ? `<p><span class="badge">Fully funded</span> <span class="hint">This goal is complete — the money is set aside.</span></p>`
      : `<form class="contribute-form" data-goal="${esc(g.id)}">
        <div class="form-row" style="grid-template-columns:1fr auto">
          <div class="field"><label for="c-${esc(g.id)}">Add money ($)</label><input id="c-${esc(g.id)}" type="number" min="1" step="1" placeholder="50" required></div>
          <div class="field"><label>&nbsp;</label><button class="btn" type="submit">Contribute</button></div>
        </div>
        <p class="form-msg" role="alert">${esc(notice)}</p>
        <p class="hint">Contributing records a real Savings transfer this month. It moves money to this goal — it is not counted as spending, so the Dashboard stays honest.</p>
      </form>`;
    return `<div class="card">
      <div class="goal-head"><h2>${esc(g.name)}</h2><span class="target">${money(g.saved)} <span class="hint">of ${money(g.target)}</span></span></div>
      <p class="lede">${esc(g.note || "")}</p>
      <span class="bar"><span style="width:${(ratio * 100).toFixed(0)}%"></span></span>
      <p style="margin-top:.5rem"><strong>${pct(Math.min(g.saved, g.target), g.target)}</strong> funded · <span class="hint">${funded ? "Fully funded" : money(toGo) + " to go"}</span></p>
      ${form}
    </div>`;
  }).join("");

  return `
  <h1>Savings goals</h1>
  <p class="lede">Three things the Alvarez family is saving for — every contribution is real money, taken out of this month's spending.</p>
  <div class="grid grid-2 mt">
    <div class="card stat"><div class="label">Saved across all goals</div><div class="value good">${money(totalSaved)}</div><div class="note">${pct(Math.min(totalSaved, totalTarget), totalTarget)} of all targets combined</div></div>
    <div class="card stat"><div class="label">Still to save</div><div class="value">${money(Math.max(0, totalTarget - totalSaved))}</div><div class="note">Across ${state.goals.length} goals</div></div>
  </div>
  <div class="grid grid-2 mt">${cards}</div>
  <div class="card mt">
    <h2>Start a new goal</h2>
    <form id="goal-form">
      <div class="form-row">
        <div class="field"><label for="g-name">Goal name</label><input id="g-name" type="text" placeholder="e.g. New bikes for the kids" required></div>
        <div class="field"><label for="g-target">Target amount ($)</label><input id="g-target" type="number" min="1" step="1" placeholder="800" required></div>
      </div>
      <p class="form-msg" id="goal-msg" role="alert">${esc(goalFormMsg)}</p>
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
    // Errors go straight to the DOM (no rerender on this path) so a stale
    // message can never resurface on a later render.
    if (!name) { el.querySelector("#goal-msg").textContent = "Please give the goal a name."; return; }
    if (!Number.isFinite(target) || target <= 0) { el.querySelector("#goal-msg").textContent = "Please enter a target above $0 — numbers only, e.g. 800."; return; }
    goalFormMsg = "";
    addGoal(state, { name, target });
    rerender();
  });
  el.querySelectorAll(".contribute-form").forEach((f) => {
    const input = f.querySelector("input[type=number]");
    // A fresh keystroke clears the old note for this goal.
    input.addEventListener("input", () => {
      delete contribNotices[f.dataset.goal];
      const msg = f.querySelector(".form-msg");
      if (msg) msg.textContent = "";
    });
    f.addEventListener("submit", (e) => {
      e.preventDefault();
      const cents = Math.round(parseFloat(input.value) * 100);
      const goal = state.goals.find((g) => g.id === f.dataset.goal);
      if (!goal) return;
      const remaining = goal.target - goal.saved;
      if (!Number.isFinite(cents) || cents <= 0) {
        f.querySelector(".form-msg").textContent = "Please enter an amount above $0 — numbers only, e.g. 50.";
        return;
      }
      // F-08: never contribute past the target — say the maximum out loud.
      if (cents > remaining) {
        f.querySelector(".form-msg").textContent = `Only ${money(remaining)} to go on this goal — please enter ${money(remaining)} or less.`;
        return;
      }
      // F-09: the transfer is dated inside the month being viewed.
      contributeToGoal(state, goal.id, cents, dateInMonth(month));
      contribNotices[goal.id] = `Contributed ${money(cents)} — recorded in ${monthLabel(month)}.`;
      rerender();
    });
  });
}
