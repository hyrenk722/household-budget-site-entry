// format.js — money, date and percent formatting for NestEgg.

export function money(cents) {
  const sign = cents < 0 ? "-" : "";
  const abs = Math.abs(cents) / 100;
  return sign + "$" + abs.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

export function moneyShort(cents) {
  const abs = Math.abs(cents) / 100;
  if (abs >= 1000) return (cents < 0 ? "-" : "") + "$" + (abs / 1000).toFixed(1) + "k";
  return money(cents);
}

export function pct(numerator, denominator) {
  if (!denominator) return "0%";
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
