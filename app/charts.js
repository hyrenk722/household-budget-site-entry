// charts.js — hand-drawn SVG charts (donut + grouped bars). No libraries.

import { money, moneyShort } from "./format.js";

function esc(s) {
  return String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

export function donutChart(slices, size = 240) {
  const total = slices.reduce((a, s) => a + s.value, 0);
  if (!total) return '<p class="empty">No spending in this month yet.</p>';
  const cx = size / 2, cy = size / 2, r = size / 2 - 14, inner = r * 0.62;
  let a0 = -Math.PI / 2;
  const paths = [];
  for (const s of slices) {
    const frac = s.value / total;
    const a1 = a0 + frac * Math.PI * 2;
    const large = frac > 0.5 ? 1 : 0;
    const x0 = cx + r * Math.cos(a0), y0 = cy + r * Math.sin(a0);
    const x1 = cx + r * Math.cos(a1), y1 = cy + r * Math.sin(a1);
    const xi1 = cx + inner * Math.cos(a1), yi1 = cy + inner * Math.sin(a1);
    const xi0 = cx + inner * Math.cos(a0), yi0 = cy + inner * Math.sin(a0);
    paths.push(
      `<path d="M ${x0.toFixed(1)} ${y0.toFixed(1)} A ${r} ${r} 0 ${large} 1 ${x1.toFixed(1)} ${y1.toFixed(1)} L ${xi1.toFixed(1)} ${yi1.toFixed(1)} A ${inner} ${inner} 0 ${large} 0 ${xi0.toFixed(1)} ${yi0.toFixed(1)} Z" fill="${s.color}"><title>${esc(s.label)} — ${money(s.value)}</title></path>`
    );
    a0 = a1;
  }
  return `<svg viewBox="0 0 ${size} ${size}" width="${size}" height="${size}" role="img" aria-label="Spending by category donut chart">
    ${paths.join("")}
    <text x="${cx}" y="${cy - 4}" text-anchor="middle" font-size="15" fill="#6b7568">Spent</text>
    <text x="${cx}" y="${cy + 18}" text-anchor="middle" font-size="19" font-weight="800" fill="#143d27">${moneyShort(total)}</text>
  </svg>`;
}

export function barChart(months, width = 640, height = 260) {
  // months: [{label, income, spent}] in cents
  const max = Math.max(...months.map((m) => Math.max(m.income, m.spent)), 1);
  const padL = 52, padB = 28, padT = 14;
  const plotW = width - padL - 12, plotH = height - padT - padB;
  const groupW = plotW / months.length;
  const barW = Math.min(30, (groupW - 18) / 2);
  const y = (v) => padT + plotH - (v / max) * plotH;
  let bars = "";
  months.forEach((m, i) => {
    const gx = padL + i * groupW + groupW / 2;
    bars += `<rect x="${(gx - barW - 2).toFixed(1)}" y="${y(m.income).toFixed(1)}" width="${barW}" height="${(padT + plotH - y(m.income)).toFixed(1)}" rx="3" fill="#1e5c3a"><title>${esc(m.label)} income ${money(m.income)}</title></rect>`;
    bars += `<rect x="${(gx + 2).toFixed(1)}" y="${y(m.spent).toFixed(1)}" width="${barW}" height="${(padT + plotH - y(m.spent)).toFixed(1)}" rx="3" fill="#e8722a"><title>${esc(m.label)} spent ${money(m.spent)}</title></rect>`;
    bars += `<text x="${gx.toFixed(1)}" y="${height - 8}" text-anchor="middle" font-size="12" fill="#22301f">${esc(m.label)}</text>`;
  });
  const grid = [0.25, 0.5, 0.75, 1].map((f) => {
    const gy = padT + plotH * (1 - f);
    return `<line x1="${padL}" y1="${gy.toFixed(1)}" x2="${width - 12}" y2="${gy.toFixed(1)}" stroke="#e2dccb" stroke-width="1"/>
    <text x="${padL - 6}" y="${(gy + 4).toFixed(1)}" text-anchor="end" font-size="11" fill="#6b7568">${moneyShort(max * f)}</text>`;
  }).join("");
  return `<svg viewBox="0 0 ${width} ${height}" width="${width}" height="${height}" role="img" aria-label="Income versus spending bar chart, last six months">
    ${grid}${bars}
    <g font-size="12" fill="#22301f">
      <rect x="${padL}" y="0" width="12" height="12" fill="#1e5c3a"/><text x="${padL + 17}" y="11">Income</text>
      <rect x="${padL + 90}" y="0" width="12" height="12" fill="#e8722a"/><text x="${padL + 107}" y="11">Spent</text>
    </g>
  </svg>`;
}
