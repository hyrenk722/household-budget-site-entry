// main.js — hash router + app startup for NestEgg.

import { loadState, resetState, loadNotice, saveError } from "./data.js";
import { monthLabel, shiftMonth, currentMonth, esc } from "./format.js";
import * as Dashboard from "./view-dashboard.js";
import * as Transactions from "./view-transactions.js";
import * as Budget from "./view-budget.js";
import * as Goals from "./view-goals.js";
import * as Reports from "./view-reports.js";
import * as Tips from "./view-tips.js";

const ROUTES = {
  "": Dashboard,
  transactions: Transactions,
  budget: Budget,
  goals: Goals,
  reports: Reports,
  tips: Tips,
};

let state = loadState();
let month = currentMonth();
const viewEl = document.getElementById("view");
const headerMonth = document.getElementById("header-month");

function currentRoute() {
  const hash = window.location.hash.replace(/^#\/?/, "");
  return ROUTES[hash] ? hash : "";
}

function render() {
  const route = currentRoute();
  const view = ROUTES[route];
  const ctx = { state, month, rerender: render };
  // Load/save problems are shown, never swallowed: a repaired load or a
  // failed save must be visible to the person using the app (F-02/F-03/F-06).
  const notices = [];
  if (loadNotice) notices.push(loadNotice);
  if (saveError) notices.push(saveError);
  const banner = notices.length
    ? `<div class="notice" role="alert">${notices.map((n) => esc(n)).join("<br>")}</div>`
    : "";
  viewEl.innerHTML = banner + view.render(ctx);
  if (view.bind) view.bind(viewEl, ctx);
  headerMonth.textContent = monthLabel(month);
  document.querySelectorAll(".mainnav a").forEach((a) => {
    a.classList.toggle("active", a.dataset.route === route);
  });
  window.scrollTo(0, 0);
}

document.addEventListener("click", (e) => {
  const btn = e.target.closest("[data-month-shift]");
  if (!btn) return;
  month = shiftMonth(month, Number(btn.dataset.monthShift));
  render();
});

// N6: the demo reset that resetState() was waiting for.
document.getElementById("reset-demo").addEventListener("click", () => {
  if (window.confirm("Reset the demo data back to the Alvarez family's original sample? Your changes will be lost.")) {
    state = resetState();
    Transactions.resetFilters();
    month = currentMonth();
    render();
  }
});

window.addEventListener("hashchange", render);
render();
