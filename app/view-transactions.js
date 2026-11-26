// view-transactions.js — full table, add/edit/delete, filter, search, running balance.

import { money, dateLabel, monthLabel } from "./format.js";
import { transactionsForMonth, runningBalance, addTransaction, updateTransaction, deleteTransaction, CATEGORIES } from "./data.js";

let filterCat = "All";
let searchText = "";

export function render(ctx) {
  const { state, month } = ctx;
  let txs = transactionsForMonth(state, month);
  if (filterCat !== "All") txs = txs.filter((t) => t.cat === filterCat || (filterCat === "Income" && t.cat === "Income"));
  if (searchText) {
    const q = searchText.toLowerCase();
    txs = txs.filter((t) => t.desc.toLowerCase().includes(q));
  }
  const rows = txs.map((t) => {
    const bal = runningBalance(state, month, t.id);
    return `<tr>
      <td>${dateLabel(t.date)}</td>
      <td>${t.desc}</td>
      <td>${t.cat}</td>
      <td class="num ${t.amt < 0 ? "negative" : "positive"}">${t.amt < 0 ? "−" : "+"}${money(Math.abs(t.amt))}</td>
      <td class="num">${money(bal)}</td>
      <td class="num"><button class="btn ghost small" data-edit="${t.id}">Edit</button> <button class="btn warn small" data-del="${t.id}">Delete</button></td>
    </tr>`;
  }).join("");
  const catOptions = ["All", "Income", ...CATEGORIES.map((c) => c.name)]
    .map((c) => `<option ${c === filterCat ? "selected" : ""}>${c}</option>`).join("");

  return `
  <h1>Transactions</h1>
  <p class="lede">Every dollar in and out for ${monthLabel(month)}. Use the month arrows on the Dashboard to switch months.</p>
  <div class="card mt">
    <div class="toolbar">
      <div class="field"><label for="f-cat">Category</label><select id="f-cat">${catOptions}</select></div>
      <div class="field"><label for="f-search">Search</label><input id="f-search" type="search" placeholder="e.g. Costco" value="${searchText}"></div>
      <button class="btn" id="show-add">+ Add transaction</button>
    </div>
    <form id="add-form" class="inline-form" aria-label="Add transaction">
      <div class="form-row-3 form-row">
        <div class="field"><label for="a-date">Date</label><input id="a-date" type="date" value="${month}-15" required></div>
        <div class="field"><label for="a-cat">Category</label><select id="a-cat"><option>Income</option>${CATEGORIES.map((c) => `<option>${c.name}</option>`).join("")}</select></div>
        <div class="field"><label for="a-amt">Amount ($) — use a minus sign for spending</label><input id="a-amt" type="number" step="0.01" placeholder="-45.20" required></div>
      </div>
      <div class="field"><label for="a-desc">Description</label><input id="a-desc" type="text" placeholder="What was it for?" required></div>
      <div class="form-actions"><button class="btn" type="submit">Save transaction</button><button class="btn ghost" type="button" id="cancel-add">Cancel</button></div>
    </form>
    <form id="edit-form" class="inline-form" aria-label="Edit transaction">
      <input type="hidden" id="e-id">
      <div class="form-row-3 form-row">
        <div class="field"><label for="e-date">Date</label><input id="e-date" type="date" required></div>
        <div class="field"><label for="e-cat">Category</label><select id="e-cat"><option>Income</option>${CATEGORIES.map((c) => `<option>${c.name}</option>`).join("")}</select></div>
        <div class="field"><label for="e-amt">Amount ($)</label><input id="e-amt" type="number" step="0.01" required></div>
      </div>
      <div class="field"><label for="e-desc">Description</label><input id="e-desc" type="text" required></div>
      <div class="form-actions"><button class="btn" type="submit">Save changes</button><button class="btn ghost" type="button" id="cancel-edit">Cancel</button></div>
    </form>
  </div>
  <div class="card mt">
    <div class="tablewrap">
      <table>
        <thead><tr><th>Date</th><th>Description</th><th>Category</th><th class="num">Amount</th><th class="num">Running balance</th><th class="num">Actions</th></tr></thead>
        <tbody>${rows || '<tr><td colspan="6" class="empty">No transactions match this filter.</td></tr>'}</tbody>
      </table>
    </div>
    <p class="hint" style="margin-top:.7rem">${txs.length} transaction${txs.length === 1 ? "" : "s"} shown · running balance counts this month only, oldest first.</p>
  </div>`;
}

export function bind(el, ctx) {
  const { state, rerender } = ctx;
  el.querySelector("#f-cat").addEventListener("change", (e) => { filterCat = e.target.value; rerender(); });
  el.querySelector("#f-search").addEventListener("input", (e) => { searchText = e.target.value; rerender(); });
  el.querySelector("#show-add").addEventListener("click", () => {
    el.querySelector("#add-form").classList.add("open");
    el.querySelector("#edit-form").classList.remove("open");
  });
  el.querySelector("#cancel-add").addEventListener("click", () => el.querySelector("#add-form").classList.remove("open"));
  el.querySelector("#cancel-edit").addEventListener("click", () => el.querySelector("#edit-form").classList.remove("open"));
  el.querySelector("#add-form").addEventListener("submit", (e) => {
    e.preventDefault();
    const amt = Math.round(parseFloat(el.querySelector("#a-amt").value) * 100);
    if (!Number.isFinite(amt) || amt === 0) return;
    addTransaction(state, {
      date: el.querySelector("#a-date").value,
      desc: el.querySelector("#a-desc").value.trim(),
      cat: el.querySelector("#a-cat").value,
      amt,
    });
    rerender();
  });
  el.querySelector("#edit-form").addEventListener("submit", (e) => {
    e.preventDefault();
    const amt = Math.round(parseFloat(el.querySelector("#e-amt").value) * 100);
    if (!Number.isFinite(amt) || amt === 0) return;
    updateTransaction(state, el.querySelector("#e-id").value, {
      date: el.querySelector("#e-date").value,
      desc: el.querySelector("#e-desc").value.trim(),
      cat: el.querySelector("#e-cat").value,
      amt,
    });
    rerender();
  });
  el.querySelectorAll("[data-del]").forEach((b) => b.addEventListener("click", () => {
    if (window.confirm("Delete this transaction?")) { deleteTransaction(state, b.dataset.del); rerender(); }
  }));
  el.querySelectorAll("[data-edit]").forEach((b) => b.addEventListener("click", () => {
    const tx = state.transactions.find((t) => t.id === b.dataset.edit);
    if (!tx) return;
    const f = el.querySelector("#edit-form");
    f.querySelector("#e-id").value = tx.id;
    f.querySelector("#e-date").value = tx.date;
    f.querySelector("#e-desc").value = tx.desc;
    f.querySelector("#e-cat").value = tx.cat;
    f.querySelector("#e-amt").value = (tx.amt / 100).toFixed(2);
    f.classList.add("open");
    el.querySelector("#add-form").classList.remove("open");
    f.scrollIntoView({ block: "nearest" });
  }));
}
