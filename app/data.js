// data.js — seed data for the Alvarez family + localStorage store + CRUD.
// Amounts are integer cents. Income is positive, spending is negative.

export const CATEGORIES = [
  { name: "Housing", color: "#1e5c3a" },
  { name: "Groceries", color: "#2f8f5b" },
  { name: "Utilities", color: "#4a7fa5" },
  { name: "Transport", color: "#8a6d3b" },
  { name: "Dining Out", color: "#e8722a" },
  { name: "Entertainment", color: "#b45fa8" },
  { name: "Healthcare", color: "#c0392b" },
  { name: "Education", color: "#3d6fb4" },
  { name: "Clothing", color: "#7a5c2e" },
  { name: "Savings", color: "#0f766e" },
];

export const CATEGORY_COLORS = Object.fromEntries(CATEGORIES.map((c) => [c.name, c.color]));

export const DEFAULT_BUDGETS = {
  Housing: 165000, Groceries: 62000, Utilities: 24000, Transport: 31000,
  "Dining Out": 22000, Entertainment: 15000, Healthcare: 18000,
  Education: 20000, Clothing: 12000, Savings: 80000,
};

// Bills due in the month AFTER the month being viewed; dueDay is the day
// of that month, the month name is computed from the viewed month (F-10).
export const BILLS = [
  { name: "Rent — Maple Court Apartments", amount: 165000, dueDay: 1, note: "Auto-pay on the 1st" },
  { name: "Electric — City Power", amount: 12800, dueDay: 5, note: "Usage was up in November" },
  { name: "Internet — FiberHome 500 Mbps", amount: 7900, dueDay: 8, note: "Auto-pay" },
  { name: "Car insurance — State Farm", amount: 14200, dueDay: 12, note: "6-month policy, 2nd installment" },
  { name: "Phones — T-Mobile family plan", amount: 9600, dueDay: 15, note: "4 lines" },
  { name: "Water — City Water Dept", amount: 5400, dueDay: 18, note: "Billed every 2 months" },
];

export const SEED_GOALS = [
  { id: "g-emergency", name: "Emergency fund", target: 1000000, saved: 640000, note: "6 months of essentials — the safety net first." },
  { id: "g-vacation", name: "Family vacation — Oregon coast", target: 300000, saved: 185000, note: "A week by the sea next summer, all four of us." },
  { id: "g-car", name: "Next family car", target: 1200000, saved: 230000, note: "Replace the 2012 sedan before it strands us." },
];

// Older months have summary totals only (used by the Reports chart).
export const MONTH_SUMMARIES = [
  { ym: "2026-06", income: 520000, spent: 418500 },
  { ym: "2026-07", income: 520000, spent: 441200 },
  { ym: "2026-08", income: 535000, spent: 429800 },
];

function seedTransactions() {
  const raw = [
    // ---- November 2026 ----
    ["2026-11-01", "Salary — Marco Alvarez, City Schools", "Income", 430000],
    ["2026-11-01", "Rent — Maple Court Apartments", "Housing", -165000],
    ["2026-11-02", "Whole Foods Market", "Groceries", -18420],
    ["2026-11-03", "Electric bill — City Power", "Utilities", -11845],
    ["2026-11-04", "Gas — Shell station", "Transport", -4620],
    ["2026-11-05", "School lunches — Lincoln Elementary", "Education", -8500],
    ["2026-11-06", "Trader Joe's", "Groceries", -9630],
    ["2026-11-07", "Movie night — AMC, family of four", "Entertainment", -3800],
    ["2026-11-08", "Internet — FiberHome", "Utilities", -7900],
    ["2026-11-09", "Pharmacy — CVS", "Healthcare", -3240],
    ["2026-11-10", "Dinner — Olive Garden", "Dining Out", -6840],
    ["2026-11-11", "Costco — bulk groceries", "Groceries", -21275],
    ["2026-11-12", "Bus passes — Metro Transit", "Transport", -12000],
    ["2026-11-13", "Water bill — City Water Dept", "Utilities", -5420],
    ["2026-11-14", "Kids' shoes — Target", "Clothing", -7499],
    ["2026-11-15", "Freelance design — Sofia Alvarez", "Income", 90000],
    ["2026-11-15", "Gym — YMCA family plan", "Healthcare", -4500],
    ["2026-11-16", "Pizza night — Domino's", "Dining Out", -2890],
    ["2026-11-17", "Gas — Chevron", "Transport", -4100],
    ["2026-11-18", "Whole Foods Market", "Groceries", -15680],
    ["2026-11-19", "Dentist copay — Bright Smile Dental", "Healthcare", -7500],
    ["2026-11-20", "Streaming — Netflix + Spotify", "Entertainment", -2898],
    ["2026-11-21", "Books — Barnes & Noble", "Education", -4200],
    ["2026-11-22", "Lunch — Chipotle", "Dining Out", -2450],
    ["2026-11-23", "Trader Joe's", "Groceries", -8820],
    ["2026-11-24", "Car wash + oil top-up", "Transport", -3500],
    ["2026-11-25", "Thanksgiving groceries — Costco", "Groceries", -17840],
    // ---- October 2026 ----
    ["2026-10-01", "Salary — Marco Alvarez, City Schools", "Income", 430000],
    ["2026-10-01", "Rent — Maple Court Apartments", "Housing", -165000],
    ["2026-10-02", "Whole Foods Market", "Groceries", -17230],
    ["2026-10-03", "Gas — Shell station", "Transport", -4890],
    ["2026-10-04", "Fall jackets — Old Navy", "Clothing", -11200],
    ["2026-10-05", "Electric bill — City Power", "Utilities", -12460],
    ["2026-10-06", "Trader Joe's", "Groceries", -10410],
    ["2026-10-07", "School field trip — science museum", "Education", -6800],
    ["2026-10-08", "Internet — FiberHome", "Utilities", -7900],
    ["2026-10-09", "Dinner — Red Robin", "Dining Out", -5230],
    ["2026-10-10", "Costco — bulk groceries", "Groceries", -19840],
    ["2026-10-11", "Flu shots — CVS MinuteClinic", "Healthcare", -4000],
    ["2026-10-12", "Bus passes — Metro Transit", "Transport", -12000],
    ["2026-10-13", "Pumpkin patch — family outing", "Entertainment", -4600],
    ["2026-10-14", "Water bill — City Water Dept", "Utilities", -5380],
    ["2026-10-15", "Freelance design — Sofia Alvarez", "Income", 90000],
    ["2026-10-16", "Whole Foods Market", "Groceries", -14960],
    ["2026-10-17", "Gas — Chevron", "Transport", -4350],
    ["2026-10-18", "Halloween costumes — Spirit", "Clothing", -5800],
    ["2026-10-19", "Dentist checkup — Bright Smile Dental", "Healthcare", -6000],
    ["2026-10-20", "Streaming — Netflix + Spotify", "Entertainment", -2898],
    ["2026-10-21", "School supplies — Target", "Education", -5140],
    ["2026-10-22", "Takeout — Thai Orchid", "Dining Out", -4120],
    ["2026-10-23", "Trader Joe's", "Groceries", -9260],
    ["2026-10-24", "Car service — oil change", "Transport", -8950],
    ["2026-10-25", "Costco — bulk groceries", "Groceries", -18720],
    ["2026-10-26", "Gym — YMCA family plan", "Healthcare", -4500],
    ["2026-10-27", "Pizza night — Domino's", "Dining Out", -2760],
    ["2026-10-28", "Library fines + book fair", "Education", -2340],
    // ---- September 2026 ----
    ["2026-09-01", "Salary — Marco Alvarez, City Schools", "Income", 430000],
    ["2026-09-01", "Rent — Maple Court Apartments", "Housing", -165000],
    ["2026-09-02", "Whole Foods Market", "Groceries", -16890],
    ["2026-09-03", "Gas — Shell station", "Transport", -4710],
    ["2026-09-04", "Back-to-school clothes — Target", "Clothing", -13450],
    ["2026-09-05", "Electric bill — City Power", "Utilities", -13120],
    ["2026-09-06", "Trader Joe's", "Groceries", -9870],
    ["2026-09-07", "School registration fees", "Education", -15000],
    ["2026-09-08", "Internet — FiberHome", "Utilities", -7900],
    ["2026-09-09", "Dinner — Olive Garden", "Dining Out", -6120],
    ["2026-09-10", "Costco — bulk groceries", "Groceries", -20480],
    ["2026-09-11", "Eye exam — VisionWorks", "Healthcare", -8900],
    ["2026-09-12", "Bus passes — Metro Transit", "Transport", -12000],
    ["2026-09-13", "Soccer sign-up — kids' league", "Entertainment", -9500],
    ["2026-09-14", "Water bill — City Water Dept", "Utilities", -5410],
    ["2026-09-15", "Freelance design — Sofia Alvarez", "Income", 90000],
    ["2026-09-16", "Whole Foods Market", "Groceries", -15240],
    ["2026-09-17", "Gas — Chevron", "Transport", -4280],
    ["2026-09-18", "Pharmacy — CVS", "Healthcare", -2870],
    ["2026-09-19", "Takeout — Panda Express", "Dining Out", -3340],
    ["2026-09-20", "Streaming — Netflix + Spotify", "Entertainment", -2898],
    ["2026-09-21", "Workbooks — Barnes & Noble", "Education", -3960],
    ["2026-09-22", "Trader Joe's", "Groceries", -9010],
    ["2026-09-23", "Car wash + tire check", "Transport", -3200],
    ["2026-09-24", "Costco — bulk groceries", "Groceries", -17960],
    ["2026-09-25", "Gym — YMCA family plan", "Healthcare", -4500],
    ["2026-09-26", "Lunch — Chipotle", "Dining Out", -2380],
    ["2026-09-27", "Kids' haircuts — Supercuts", "Healthcare", -5600],
  ];
  return raw.map(([date, desc, cat, amt], i) => ({
    id: "seed-" + (i + 1),
    date, desc, cat, amt,
  }));
}

const KEY = "nestegg-data-v1";
const BACKUP_KEY = "nestegg-data-v1-backup";
const CORRUPT_PREFIX = "nestegg-data-v1-corrupt-";

// Live status flags for the UI banner (main.js reads these on every render).
// loadNotice: what went wrong while loading ("" when the load was clean).
// saveError: set when a save failed, cleared on the next successful save.
// skippedCount: transactions/goals dropped as invalid during load.
export let loadNotice = "";
export let saveError = "";
export let skippedCount = 0;
export let droppedWholeTxList = false;

function seedState() {
  return {
    transactions: seedTransactions(),
    budgets: { ...DEFAULT_BUDGETS },
    goals: SEED_GOALS.map((g) => ({ ...g })),
  };
}

function isValidTx(t) {
  return !!t && typeof t === "object"
    && typeof t.id === "string" && t.id.length > 0
    && typeof t.date === "string" && /^\d{4}-\d{2}-\d{2}$/.test(t.date)
    && typeof t.desc === "string"
    && typeof t.cat === "string" && t.cat.length > 0
    && typeof t.amt === "number" && Number.isFinite(t.amt);
}

function isValidGoal(g) {
  return !!g && typeof g === "object"
    && typeof g.id === "string" && g.id.length > 0
    && typeof g.name === "string" && g.name.length > 0
    && typeof g.target === "number" && Number.isFinite(g.target) && g.target > 0;
}

// Minimal repair of a parsed-but-damaged state (F-02/F-03): keep every valid
// transaction, budget and goal; drop only the broken rows. Never invents
// seed data to replace user data.
function repairState(parsed) {
  if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) return null;
  const kept = { transactions: [], budgets: { ...DEFAULT_BUDGETS }, goals: [] };
  if (Array.isArray(parsed.transactions)) {
    for (const t of parsed.transactions) {
      if (isValidTx(t)) kept.transactions.push(t);
      else skippedCount++;
    }
  } else if (parsed.transactions !== undefined) {
    // The whole list was unreadable (not an array) — nothing salvageable.
    droppedWholeTxList = true;
  }
  if (parsed.budgets && typeof parsed.budgets === "object" && !Array.isArray(parsed.budgets)) {
    for (const [k, v] of Object.entries(parsed.budgets)) {
      if (typeof v === "number" && Number.isFinite(v) && v >= 0) kept.budgets[k] = v;
    }
  }
  if (Array.isArray(parsed.goals)) {
    for (const g of parsed.goals) {
      if (isValidGoal(g)) {
        kept.goals.push({
          id: g.id,
          name: g.name,
          target: g.target,
          saved: typeof g.saved === "number" && Number.isFinite(g.saved) && g.saved >= 0 ? g.saved : 0,
          note: typeof g.note === "string" ? g.note : "",
        });
      } else skippedCount++;
    }
  }
  return kept;
}

export function loadState() {
  loadNotice = "";
  skippedCount = 0;
  droppedWholeTxList = false;
  let raw = null;
  try {
    raw = localStorage.getItem(KEY);
  } catch (e) {
    loadNotice = "Your saved budget could not be read in this browser, so the sample data is shown. Nothing was deleted.";
    return seedState();
  }
  // First run ever: the key never existed — seeding is the only correct move.
  if (raw === null || raw === "") {
    const fresh = seedState();
    saveState(fresh);
    return fresh;
  }
  let parsed;
  try {
    parsed = JSON.parse(raw);
  } catch (e) {
    // F-03: unparseable storage must NEVER be overwritten with the seed.
    // Keep the raw bytes aside and fall back to the last good backup, if any.
    try { localStorage.setItem(CORRUPT_PREFIX + Date.now(), raw); } catch (_e) { /* best effort */ }
    try {
      const backupRaw = localStorage.getItem(BACKUP_KEY);
      if (backupRaw) {
        const backup = repairState(JSON.parse(backupRaw));
        if (backup) {
          loadNotice = "Your saved budget was unreadable, so the last saved copy was restored. The damaged copy was kept for recovery.";
          saveState(backup);
          return backup;
        }
      }
    } catch (_e) { /* backup unusable — fall through to an empty state */ }
    loadNotice = "Your saved budget was unreadable, so this month starts empty. Your previous data was kept in this browser for recovery — it was not replaced with sample data.";
    return { transactions: [], budgets: { ...DEFAULT_BUDGETS }, goals: [] };
  }
  const repaired = repairState(parsed);
  if (!repaired) {
    loadNotice = "Your saved budget had an unexpected shape, so this month starts empty. Nothing was replaced with sample data.";
    return { transactions: [], budgets: { ...DEFAULT_BUDGETS }, goals: [] };
  }
  if (droppedWholeTxList) {
    loadNotice = "Your saved transaction list was unreadable and had to be dropped. Your budgets and goals are intact.";
  } else if (skippedCount > 0) {
    loadNotice = `Your saved budget was repaired: ${skippedCount} entr${skippedCount === 1 ? "y was" : "ies were"} missing or invalid and had to be skipped. The rest of your data is intact.`;
  }
  // Persist the repaired shape (saveState first backs the raw value up).
  saveState(repaired);
  return repaired;
}

// F-06: saving never throws. The previous stored value is backed up first,
// so a failed or partial write never destroys the last good copy. Returns
// true on success, false when the browser refused the write.
export function saveState(state) {
  try {
    const prev = localStorage.getItem(KEY);
    if (prev) {
      // Only back up readable data: never let a corrupt value overwrite
      // the last good backup (matters when restoring from backup in loadState).
      try { JSON.parse(prev); localStorage.setItem(BACKUP_KEY, prev); } catch (_e) { /* unreadable — skip backup */ }
    }
    const clean = { transactions: state.transactions, budgets: state.budgets, goals: state.goals };
    localStorage.setItem(KEY, JSON.stringify(clean));
    saveError = "";
    return true;
  } catch (e) {
    saveError = "Could not save your changes in this browser (storage may be full or unavailable). Your changes are still shown, but they may be lost if you reload the page.";
    return false;
  }
}

export function resetState() {
  const fresh = seedState();
  saveState(fresh);
  return fresh;
}

// F-02: never throws on a missing or malformed date — returns "" so the row
// is simply not matched to any month instead of crashing the whole app.
export function monthOf(dateIso) {
  if (typeof dateIso !== "string" || !/^\d{4}-\d{2}/.test(dateIso)) return "";
  return dateIso.slice(0, 7);
}

export function transactionsForMonth(state, ym) {
  return state.transactions
    .filter((t) => monthOf(t.date) === ym)
    .sort((a, b) => (a.date < b.date ? 1 : a.date > b.date ? -1 : String(b.id || "").localeCompare(String(a.id || ""))));
}

// F-01/F-08: totals are classified by CATEGORY, never by the sign of amt
// alone. A positive-amount expense still counts as spending; a negative
// Income row reduces income. Savings transfers are NOT spending — moving
// money to a goal must not make the Dashboard look worse.
export function monthTotals(state, ym) {
  let income = 0, spent = 0;
  for (const t of state.transactions) {
    if (monthOf(t.date) !== ym) continue;
    if (t.cat === "Income") income += t.amt;
    else if (t.cat === "Savings") { /* a transfer, not spending */ }
    else if (typeof t.amt === "number" && Number.isFinite(t.amt)) spent += Math.abs(t.amt);
  }
  return { income, spent, remaining: income - spent };
}

export function categorySpend(state, ym) {
  const out = {};
  for (const t of state.transactions) {
    if (monthOf(t.date) !== ym || t.cat === "Income" || t.cat === "Savings") continue;
    if (typeof t.amt !== "number" || !Number.isFinite(t.amt)) continue;
    out[t.cat] = (out[t.cat] || 0) + Math.abs(t.amt);
  }
  return out;
}

// Money moved into savings in a month (contributions). Shown against the
// Savings target in the Budget view; never counted as spending.
export function savingsMoved(state, ym) {
  let total = 0;
  for (const t of state.transactions) {
    if (monthOf(t.date) !== ym || t.cat !== "Savings") continue;
    if (typeof t.amt === "number" && Number.isFinite(t.amt)) total += Math.abs(t.amt);
  }
  return total;
}

export function runningBalance(state, ym, upToId) {
  let balance = 0;
  const sorted = [...state.transactions]
    .filter((t) => monthOf(t.date) === ym)
    .sort((a, b) => (a.date < b.date ? -1 : a.date > b.date ? 1 : String(a.id || "").localeCompare(String(b.id || ""))));
  for (const t of sorted) {
    balance += t.amt;
    if (t.id === upToId) break;
  }
  return balance;
}

let nextId = 1;
let nextGoalId = 1;

// F-01: the sign is normalised by category at the door — Income is always
// positive, every other category is always negative — so a user typing
// "50" for Groceries gets a $50 expense, not a vanishing transaction.
function normaliseAmount(cat, amt) {
  if (typeof amt !== "number" || !Number.isFinite(amt)) return null;
  if (amt === 0) return null;
  return cat === "Income" ? Math.abs(amt) : -Math.abs(amt);
}

export function addTransaction(state, { date, desc, cat, amt }) {
  const signed = normaliseAmount(cat, amt);
  if (signed === null) return null;
  const cleanDate = typeof date === "string" && /^\d{4}-\d{2}-\d{2}$/.test(date) ? date : null;
  const tx = {
    id: "u" + Date.now().toString(36) + (nextId++),
    date: cleanDate || new Date().toISOString().slice(0, 10),
    desc: typeof desc === "string" ? desc : String(desc ?? ""),
    cat: typeof cat === "string" && cat ? cat : "Groceries",
    amt: signed,
  };
  state.transactions.push(tx);
  saveState(state);
  return tx;
}

export function updateTransaction(state, id, patch) {
  const tx = state.transactions.find((t) => t.id === id);
  if (!tx) return null;
  const clean = {};
  if (typeof patch.date === "string" && /^\d{4}-\d{2}-\d{2}$/.test(patch.date)) clean.date = patch.date;
  if (typeof patch.desc === "string") clean.desc = patch.desc;
  // F-11: never write an empty category — an unknown category keeps the old one.
  if (typeof patch.cat === "string" && patch.cat) clean.cat = patch.cat;
  if (patch.amt !== undefined) {
    const signed = normaliseAmount(clean.cat || tx.cat, patch.amt);
    if (signed !== null) clean.amt = signed;
  }
  Object.assign(tx, clean);
  saveState(state);
  return tx;
}

export function deleteTransaction(state, id) {
  state.transactions = state.transactions.filter((t) => t.id !== id);
  saveState(state);
}

export function setBudget(state, cat, cents) {
  if (typeof cat !== "string" || !cat) return;
  if (typeof cents !== "number" || !Number.isFinite(cents) || cents < 0) return;
  state.budgets[cat] = Math.round(cents);
  saveState(state);
}

export function addGoal(state, { name, target }) {
  // F-12: a counter like addTransaction, so two goals added in the same
  // millisecond can never share an id.
  const goal = { id: "g" + Date.now().toString(36) + (nextGoalId++), name, target, saved: 0, note: "" };
  state.goals.push(goal);
  saveState(state);
  return goal;
}

// F-08: a contribution never takes a goal past its target — it is capped at
// the remaining amount. Returns null when there is nothing left to fund.
export function contributeToGoal(state, goalId, cents, dateIso) {
  const goal = state.goals.find((g) => g.id === goalId);
  if (!goal || cents <= 0) return null;
  const remaining = goal.target - goal.saved;
  if (remaining <= 0) return null;
  const actual = Math.min(cents, remaining);
  goal.saved += actual;
  addTransaction(state, {
    date: dateIso, desc: "Contribution — " + goal.name, cat: "Savings", amt: -actual,
  });
  saveState(state);
  return goal;
}
