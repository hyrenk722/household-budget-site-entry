// format.js — money, date and percent formatting for NestEgg.

// Escape user-supplied text before it is inserted into innerHTML (F-07).
export function esc(s) {
  return String(s ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

export function money(cents) {
  if (!Number.isFinite(cents)) return "$0.00"; // F-17: never "$NaN"
  const sign = cents < 0 ? "-" : "";
  const abs = Math.abs(cents) / 100;
  return sign + "$" + abs.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

export function moneyShort(cents) {
  if (!Number.isFinite(cents)) return "$0.00"; // F-17
  const abs = Math.abs(cents) / 100;
  if (abs >= 1000) return (cents < 0 ? "-" : "") + "$" + (abs / 1000).toFixed(1) + "k";
  return money(cents);
}

export function pct(numerator, denominator) {
  if (!denominator || !Number.isFinite(numerator) || !Number.isFinite(denominator)) return "0%";
  return Math.round((numerator / denominator) * 100) + "%";
}

export function monthLabel(ym) {
  const [y, m] = ym.split("-").map(Number);
  return new Date(y, m - 1, 1).toLocaleDateString("en-US", { month: "long", year: "numeric" });
}

export function monthShort(ym) {
  const [y, m] = ym.split("-").map(Number);
  return new Date(y, m - 1, 1).toLocaleDateString("en-US", { month: "short" });
}

export function dateLabel(iso) {
  const [y, m, d] = iso.split("-").map(Number);
  return new Date(y, m - 1, d).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

export function shiftMonth(ym, delta) {
  const [y, m] = ym.split("-").map(Number);
  const d = new Date(y, m - 1 + delta, 1);
  return d.getFullYear() + "-" + String(d.getMonth() + 1).padStart(2, "0");
}

export function todayIso() {
  const d = new Date();
  return d.getFullYear() + "-" + String(d.getMonth() + 1).padStart(2, "0") + "-" + String(d.getDate()).padStart(2, "0");
}

// F-09/F-10 (rev2): the month being viewed starts at the real current
// month, never a hard-coded seed month — on 01/12 the app used to open
// still showing November 2026.
export function currentMonth() {
  return todayIso().slice(0, 7);
}

// F-09: a date inside the month being viewed — today if that month is the
// current month, otherwise the 1st of the viewed month.
export function dateInMonth(ym) {
  const today = todayIso();
  return today.slice(0, 7) === ym ? today : ym + "-01";
}
