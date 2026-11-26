// main.js — hash router + app startup for NestEgg.

import { loadState } from "./data.js";
import { monthLabel, shiftMonth } from "./format.js";
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

const state = loadState();
let month = "2026-11";
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
  viewEl.innerHTML = view.render(ctx);
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

window.addEventListener("hashchange", render);
render();
