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

export const BILLS = [
  { name: "Rent — Maple Court Apartments", amount: 165000, due: "Dec 1", note: "Auto-pay on the 1st" },
  { name: "Electric — City Power", amount: 12800, due: "Dec 5", note: "Usage was up in November" },
  { name: "Internet — FiberHome 500 Mbps", amount: 7900, due: "Dec 8", note: "Auto-pay" },
  { name: "Car insurance — State Farm", amount: 14200, due: "Dec 12", note: "6-month policy, 2nd installment" },
  { name: "Phones — T-Mobile family plan", amount: 9600, due: "Dec 15", note: "4 lines" },
  { name: "Water — City Water Dept", amount: 5400, due: "Dec 18", note: "Billed every 2 months" },
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

function seedState() {
  return {
    transactions: seedTransactions(),
    budgets: { ...DEFAULT_BUDGETS },
    goals: SEED_GOALS.map((g) => ({ ...g })),
  };
}

export function loadState() {
  try {
    const raw = localStorage.getItem(KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed.transactions) && parsed.budgets && Array.isArray(parsed.goals)) return parsed;
    }
  } catch (e) { /* corrupted storage: reseed below */ }
  const fresh = seedState();
  saveState(fresh);
  return fresh;
}

export function saveState(state) {
  localStorage.setItem(KEY, JSON.stringify(state));
}

export function resetState() {
  const fresh = seedState();
  saveState(fresh);
  return fresh;
}

export function monthOf(dateIso) { return dateIso.slice(0, 7); }

export function transactionsForMonth(state, ym) {
  return state.transactions
    .filter((t) => monthOf(t.date) === ym)
    .sort((a, b) => (a.date < b.date ? 1 : a.date > b.date ? -1 : b.id.localeCompare(a.id)));
}

export function monthTotals(state, ym) {
  let income = 0, spent = 0;
  for (const t of state.transactions) {
    if (monthOf(t.date) !== ym) continue;
    if (t.cat === "Income") income += t.amt;
    else if (t.amt < 0) spent += -t.amt;
  }
  return { income, spent, remaining: income - spent };
}

export function categorySpend(state, ym) {
  const out = {};
  for (const t of state.transactions) {
    if (monthOf(t.date) !== ym || t.amt >= 0 || t.cat === "Income") continue;
    out[t.cat] = (out[t.cat] || 0) + -t.amt;
  }
  return out;
}

export function runningBalance(state, ym, upToId) {
  let balance = 0;
  const sorted = [...state.transactions]
    .filter((t) => monthOf(t.date) === ym)
    .sort((a, b) => (a.date < b.date ? -1 : a.date > b.date ? 1 : a.id.localeCompare(b.id)));
  for (const t of sorted) {
    balance += t.amt;
    if (t.id === upToId) break;
  }
  return balance;
}

let nextId = 1;
export function addTransaction(state, { date, desc, cat, amt }) {
  const tx = { id: "u" + Date.now().toString(36) + (nextId++), date, desc, cat, amt };
  state.transactions.push(tx);
  saveState(state);
  return tx;
}

export function updateTransaction(state, id, patch) {
  const tx = state.transactions.find((t) => t.id === id);
  if (!tx) return null;
  Object.assign(tx, patch);
  saveState(state);
  return tx;
}

export function deleteTransaction(state, id) {
  state.transactions = state.transactions.filter((t) => t.id !== id);
  saveState(state);
}

export function setBudget(state, cat, cents) {
  state.budgets[cat] = cents;
  saveState(state);
}

export function addGoal(state, { name, target }) {
  const goal = { id: "g" + Date.now().toString(36), name, target, saved: 0, note: "" };
  state.goals.push(goal);
  saveState(state);
  return goal;
}

export function contributeToGoal(state, goalId, cents, dateIso) {
  const goal = state.goals.find((g) => g.id === goalId);
  if (!goal || cents <= 0) return null;
  goal.saved += cents;
  addTransaction(state, {
    date: dateIso, desc: "Contribution — " + goal.name, cat: "Savings", amt: -cents,
  });
  saveState(state);
  return goal;
}
