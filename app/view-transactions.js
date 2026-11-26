// view-transactions.js — full table, add/edit/delete, filter, search, running balance.

import { money, dateLabel, monthLabel, esc } from "./format.js";
import { transactionsForMonth, runningBalance, addTransaction, updateTransaction, deleteTransaction, monthOf, CATEGORIES } from "./data.js";

let filterCat = "All";
let searchText = "";
let addMsg = "";
let editMsg = "";
let addNotice = "";

function filteredTx(state, month) {
  let txs = transactionsForMonth(state, month);
  if (filterCat !== "All") txs = txs.filter((t) => t.cat === filterCat);
  if (searchText) {
    const q = searchText.toLowerCase();
    txs = txs.filter((t) => t.desc.toLowerCase().includes(q));
  }
  return txs;
}

function tableBody(state, month) {
  const txs = filteredTx(state, month);
  const rows = txs.map((t) => {
    const bal = runningBalance(state, month, t.id);
    return `<tr>
      <td>${dateLabel(t.date)}</td>
      <td>${esc(t.desc)}</td>
      <td>${esc(t.cat)}</td>
      <td class="num ${t.amt < 0 ? "negative" : "positive"}">${t.amt < 0 ? "−" : "+"}${money(Math.abs(t.amt))}</td>
      <td class="num">${money(bal)}</td>
      <td class="num"><button class="btn ghost small" data-edit="${esc(t.id)}">Edit</button> <button class="btn warn small" data-del="${esc(t.id)}">Delete</button></td>
    </tr>`;
  }).join("");
  return {
    rows: rows || '<tr><td colspan="6" class="empty">No transactions match this filter.</td></tr>',
    count: txs.length,
  };
}

function countText(count) {
  return `${count} transaction${count === 1 ? "" : "s"} shown · running balance counts this month only, oldest first.`;
}

export function render(ctx) {
  const { state, month } = ctx;
  const { rows, count } = tableBody(state, month);
  const catOptions = ["All", "Income", ...CATEGORIES.map((c) => c.name)]
    .map((c) => `<option ${c === filterCat ? "selected" : ""}>${esc(c)}</option>`).join("");

  return `
  <h1>Transactions</h1>
  <p class="lede">Every dollar in and out for ${monthLabel(month)}. Use the month arrows on the Dashboard to switch months.</p>
  <div class="card mt">
    <div class="toolbar">
      <div class="field"><label for="f-cat">Category</label><select id="f-cat">${catOptions}</select></div>
      <div class="field"><label for="f-search">Search</label><input id="f-search" type="search" placeholder="e.g. Costco" value="${esc(searchText)}"></div>
      <button class="btn" id="show-add">+ Add transaction</button>
    </div>
    <form id="add-form" class="inline-form" aria-label="Add transaction">
      <div class="form-row-3 form-row">
        <div class="field"><label for="a-date">Date</label><input id="a-date" type="date" value="${month}-15" required></div>
        <div class="field"><label for="a-cat">Category</label><select id="a-cat"><option>Income</option>${CATEGORIES.map((c) => `<option>${c.name}</option>`).join("")}</select></div>
        <div class="field"><label for="a-amt">Amount ($) — minus for spending; the sign is fixed for you if you forget</label><input id="a-amt" type="number" step="0.01" placeholder="-45.20" required></div>
      </div>
      <div class="field"><label for="a-desc">Description</label><input id="a-desc" type="text" placeholder="What was it for?" required></div>
      <p class="form-msg" id="add-msg" role="alert">${esc(addMsg)}</p>
      <p class="hint" id="add-notice" role="status">${esc(addNotice)}</p>
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
      <p class="form-msg" id="edit-msg" role="alert">${esc(editMsg)}</p>
      <div class="form-actions"><button class="btn" type="submit">Save changes</button><button class="btn ghost" type="button" id="cancel-edit">Cancel</button></div>
    </form>
  </div>
  <div class="card mt">
    <div class="tablewrap">
      <table>
        <thead><tr><th>Date</th><th>Description</th><th>Category</th><th class="num">Amount</th><th class="num">Running balance</th><th class="num">Actions</th></tr></thead>
        <tbody>${rows}</tbody>
      </table>
    </div>
    <p class="hint" id="tx-count" style="margin-top:.7rem">${countText(count)}</p>
  </div>`;
}

export function bind(el, ctx) {
  const { state, month, rerender } = ctx;
  // F-05: filtering only rewrites the table body — the search box is never
  // rebuilt, so it keeps focus (and the cursor) while you type.
  const refreshTable = () => {
    const { rows, count } = tableBody(state, month);
    el.querySelector("tbody").innerHTML = rows;
    el.querySelector("#tx-count").textContent = countText(count);
  };
  el.querySelector("#f-cat").addEventListener("change", (e) => { filterCat = e.target.value; refreshTable(); });
  el.querySelector("#f-search").addEventListener("input", (e) => { searchText = e.target.value; refreshTable(); });
  el.querySelector("#show-add").addEventListener("click", () => {
    addMsg = ""; addNotice = "";
    el.querySelector("#add-form").classList.add("open");
    el.querySelector("#edit-form").classList.remove("open");
  });
  el.querySelector("#cancel-add").addEventListener("click", () => {
    addMsg = ""; addNotice = "";
    el.querySelector("#add-form").classList.remove("open");
    el.querySelector("#add-msg").textContent = "";
    el.querySelector("#add-notice").textContent = "";
  });
  el.querySelector("#cancel-edit").addEventListener("click", () => {
    editMsg = "";
    el.querySelector("#edit-form").classList.remove("open");
    el.querySelector("#edit-msg").textContent = "";
  });
  const showFormError = (id, msg) => { el.querySelector(id).textContent = msg; };
  el.querySelector("#add-form").addEventListener("submit", (e) => {
    e.preventDefault();
    // F-14: invalid input is reported, not swallowed silently.
    const amt = Math.round(parseFloat(el.querySelector("#a-amt").value) * 100);
    const date = el.querySelector("#a-date").value;
    const desc = el.querySelector("#a-desc").value.trim();
    if (!desc) { addMsg = "Please add a short description."; showFormError("#add-msg", addMsg); return; }
    if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) { addMsg = "Please pick a valid date."; showFormError("#add-msg", addMsg); return; }
    if (!Number.isFinite(amt) || amt === 0) { addMsg = "Please enter an amount that is not zero — numbers only, e.g. -45.20 for spending."; showFormError("#add-msg", addMsg); return; }
    const tx = addTransaction(state, {
      date,
      desc,
      cat: el.querySelector("#a-cat").value,
      amt,
    });
    if (!tx) { addMsg = "That transaction could not be saved — please check the amount and try again."; showFormError("#add-msg", addMsg); return; }
    addMsg = "";
    // F-09 (same family): a date in another month is saved there, not here.
    addNotice = monthOf(date) !== month
      ? `Saved to ${monthLabel(monthOf(date))} — use the month arrows on the Dashboard to see it.`
      : "";
    rerender();
  });
  el.querySelector("#edit-form").addEventListener("submit", (e) => {
    e.preventDefault();
    const amt = Math.round(parseFloat(el.querySelector("#e-amt").value) * 100);
    const date = el.querySelector("#e-date").value;
    const desc = el.querySelector("#e-desc").value.trim();
    if (!desc) { editMsg = "Please add a short description."; showFormError("#edit-msg", editMsg); return; }
    if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) { editMsg = "Please pick a valid date."; showFormError("#edit-msg", editMsg); return; }
    if (!Number.isFinite(amt) || amt === 0) { editMsg = "Please enter an amount that is not zero — numbers only."; showFormError("#edit-msg", editMsg); return; }
    const saved = updateTransaction(state, el.querySelector("#e-id").value, {
      date,
      desc,
      cat: el.querySelector("#e-cat").value,
      amt,
    });
    if (!saved) { editMsg = "That transaction could not be found — please reload the page and try again."; showFormError("#edit-msg", editMsg); return; }
    editMsg = "";
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
    // F-11: a category outside the standard list gets a temporary option,
    // so saving the edit can never blank the category.
    const sel = f.querySelector("#e-cat");
    if (![...sel.options].some((o) => o.value === tx.cat)) {
      const opt = document.createElement("option");
      opt.value = tx.cat;
      opt.textContent = tx.cat;
      sel.appendChild(opt);
    }
    sel.value = tx.cat;
    f.querySelector("#e-amt").value = (tx.amt / 100).toFixed(2);
    editMsg = "";
    f.querySelector("#edit-msg").textContent = "";
    f.classList.add("open");
    el.querySelector("#add-form").classList.remove("open");
    f.scrollIntoView({ block: "nearest" });
  }));
}
