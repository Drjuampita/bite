// Utilidades para dibujar las figuras del documento como SVG/HTML y capturarlas a PNG.
const C = {
  brand: "#e5386d", brand6: "#cf2a5c", brand7: "#a81d4a", b50: "#fff1f5", b100: "#ffdde7", b200: "#ffb9cd",
  ink: "#1c1511", muted: "#75695f", line: "#e6ddd5", canvas: "#fbf8f5", white: "#ffffff", grid: "#ece6e0",
  s1: "#2a78d6", s2: "#eb6834", s3: "#1baf7a", gris: "#9b9087",
};
const W = 800;
const esc = (s) => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
const num = (v, d = 0) => Number(v).toLocaleString("en-US", { minimumFractionDigits: d, maximumFractionDigits: d });
const money = (v, d = 0) => (v < 0 ? "−$" : "$") + num(Math.abs(v), d);
const kmoney = (v) => (Math.abs(v) >= 1e6 ? (v < 0 ? "−$" : "$") + num(Math.abs(v) / 1e6, 1) + " M" : (v < 0 ? "−$" : "$") + num(Math.abs(v) / 1e3, 0) + " mil");
const tw = (s, size) => String(s).length * size * 0.56; // ancho aproximado de un texto

function wrap(text, max) {
  const out = [];
  let cur = "";
  for (const w of String(text).split(" ")) {
    if ((cur + " " + w).trim().length > max && cur) { out.push(cur); cur = w; } else cur = (cur + " " + w).trim();
  }
  if (cur) out.push(cur);
  return out;
}

function niceTicks(max, n = 4) {
  const raw = max / n;
  const mag = Math.pow(10, Math.floor(Math.log10(raw)));
  const step = [1, 2, 2.5, 5, 10].map((m) => m * mag).find((s) => s >= raw);
  const ticks = [];
  for (let v = 0; v <= max + step * 0.01; v += step) ticks.push(v);
  if (ticks[ticks.length - 1] < max) ticks.push(ticks[ticks.length - 1] + step);
  return ticks;
}

function legend(items, x, y) {
  let out = "", cx = x;
  for (const it of items) {
    out += it.line
      ? `<line x1="${cx}" y1="${y}" x2="${cx + 18}" y2="${y}" stroke="${it.color}" stroke-width="2.5" stroke-linecap="round"${it.dash ? ' stroke-dasharray="1 5"' : ""}/>`
      : `<rect x="${cx}" y="${y - 6}" width="12" height="12" rx="3" fill="${it.color}"/>`;
    const off = it.line ? 24 : 18;
    out += `<text x="${cx + off}" y="${y + 4.5}" font-size="13" fill="${C.ink}">${esc(it.name)}</text>`;
    cx += off + tw(it.name, 13) + 22;
  }
  return out;
}

// Gráfica de líneas: series con null para cortar la línea (meses sin clases).
function lineChart({ h = 340, x, series, yfmt = (v) => num(v), ymax, xEvery = 3, right = 150, refLines = [], endLabel = true, ymin = 0, left = 58, extra, xTitle }) {
  const m = { l: left, r: right, t: 34, b: 34 };
  const pw = W - m.l - m.r, ph = h - m.t - m.b;
  const all = series.flatMap((s) => s.values.filter((v) => v != null)).concat(refLines.map((r) => r.v));
  const lo = Math.min(ymin, ...all);
  const ticks = lo < 0 ? (() => { const st = niceTicks(Math.max(ymax || 0, ...all) - lo, 5); const step = st[1]; const t = []; for (let v = Math.floor(lo / step) * step; v <= Math.max(ymax || 0, ...all) + step * 0.01; v += step) t.push(v); if (t[t.length - 1] < Math.max(...all)) t.push(t[t.length - 1] + step); return t; })() : niceTicks(ymax || Math.max(...all));
  const y0 = ticks[0], y1 = ticks[ticks.length - 1];
  const X = (i) => m.l + (x.length === 1 ? pw / 2 : (i * pw) / (x.length - 1));
  const Y = (v) => m.t + ph - ((v - y0) / (y1 - y0)) * ph;
  let g = "";
  for (const t of ticks) {
    g += `<line x1="${m.l}" y1="${Y(t)}" x2="${m.l + pw}" y2="${Y(t)}" stroke="${t === 0 && lo < 0 ? C.gris : C.grid}" stroke-width="1"/>`;
    g += `<text x="${m.l - 8}" y="${Y(t) + 4}" font-size="12" fill="${C.muted}" text-anchor="end">${yfmt(t)}</text>`;
  }
  x.forEach((lab, i) => { if (i % xEvery === 0) g += `<text x="${X(i)}" y="${h - 10}" font-size="12" fill="${C.muted}" text-anchor="middle">${esc(lab)}</text>`; });
  for (const r of refLines) {
    g += `<line x1="${m.l}" y1="${Y(r.v)}" x2="${m.l + pw}" y2="${Y(r.v)}" stroke="${C.gris}" stroke-width="1.5"/>`;
    g += `<text x="${m.l + pw + 8}" y="${Y(r.v) + 4}" font-size="12" fill="${C.muted}">${esc(r.name)}</text>`;
  }
  const ends = [];
  for (const s of series) {
    let d = "", pen = false, last = null;
    s.values.forEach((v, i) => {
      if (v == null) { pen = false; return; }
      d += `${pen ? "L" : "M"}${X(i).toFixed(1)},${Y(v).toFixed(1)}`;
      pen = true; last = [i, v];
    });
    g += `<path d="${d}" fill="none" stroke="${s.color}" stroke-width="2" stroke-linejoin="round" stroke-linecap="round"/>`;
    // puntos en tramos de un solo mes
    s.values.forEach((v, i) => { if (v != null && s.values[i - 1] == null && s.values[i + 1] == null) g += `<circle cx="${X(i)}" cy="${Y(v)}" r="2.5" fill="${s.color}"/>`; });
    if (last) ends.push({ s, i: last[0], v: last[1], y: Y(last[1]) });
  }
  // etiquetas de fin: separa las que chocan
  ends.sort((a, b) => a.y - b.y);
  for (let k = 1; k < ends.length; k++) if (ends[k].y - ends[k - 1].y < 15) ends[k].ly = (ends[k - 1].ly ?? ends[k - 1].y) + 15;
  for (const e of ends) {
    g += `<circle cx="${X(e.i)}" cy="${e.y}" r="5" fill="${e.s.color}" stroke="${C.white}" stroke-width="2"/>`;
    if (endLabel) g += `<text x="${X(e.i) + 10}" y="${(e.ly ?? e.y) + 4}" font-size="12.5" fill="${C.ink}">${esc(e.s.name)} · ${yfmt(e.v)}</text>`;
  }
  g += legend(series.map((s) => ({ name: s.name, color: s.color, line: true })), m.l, 12);
  if (xTitle) g += `<text x="${m.l + pw}" y="${h - 10}" font-size="12" fill="${C.muted}" text-anchor="end"></text>`;
  if (extra) g += extra(X, Y, m, pw, ph);
  return `<svg width="${W}" height="${h}" viewBox="0 0 ${W} ${h}" xmlns="http://www.w3.org/2000/svg">${g}</svg>`;
}

// Columnas agrupadas (o simples). values puede traer negativos.
function colChart({ h = 320, x, series, yfmt = (v) => num(v), labelfmt, barW = 22, labels = true, right = 20, left = 62, gap = 2, nTicks = 4 }) {
  const m = { l: left, r: right, t: series.length > 1 ? 36 : 22, b: 34 };
  const pw = W - m.l - m.r, ph = h - m.t - m.b;
  const all = series.flatMap((s) => s.values);
  const hi = Math.max(0, ...all), lo = Math.min(0, ...all);
  let ticks = niceTicks(hi - lo, nTicks);
  const step = ticks[1];
  ticks = [];
  for (let v = Math.floor(lo / step) * step; v <= hi + step * 0.01; v += step) ticks.push(v);
  if (ticks[ticks.length - 1] < hi) ticks.push(ticks[ticks.length - 1] + step);
  const y0 = ticks[0], y1 = ticks[ticks.length - 1];
  const Y = (v) => m.t + ph - ((v - y0) / (y1 - y0)) * ph;
  const band = pw / x.length;
  const bw = Math.min(barW, (band - 16) / series.length - gap);
  let g = "";
  for (const t of ticks) {
    g += `<line x1="${m.l}" y1="${Y(t)}" x2="${m.l + pw}" y2="${Y(t)}" stroke="${t === 0 && lo < 0 ? C.gris : C.grid}" stroke-width="1"/>`;
    g += `<text x="${m.l - 8}" y="${Y(t) + 4}" font-size="12" fill="${C.muted}" text-anchor="end">${yfmt(t)}</text>`;
  }
  x.forEach((lab, i) => {
    const cx = m.l + band * (i + 0.5);
    wrap(lab, 16).forEach((ln, k) => { g += `<text x="${cx}" y="${h - 14 + k * 13 - (wrap(lab, 16).length - 1) * 6}" font-size="12" fill="${C.muted}" text-anchor="middle">${esc(ln)}</text>`; });
    series.forEach((s, k) => {
      const v = s.values[i];
      if (v == null) return;
      const bx = cx - (series.length * (bw + gap) - gap) / 2 + k * (bw + gap);
      const top = Y(Math.max(0, v)), bot = Y(Math.min(0, v));
      const hh = Math.max(1, bot - top), r = Math.min(4, hh);
      const d = v >= 0
        ? `M${bx},${bot}V${top + r}Q${bx},${top} ${bx + r},${top}H${bx + bw - r}Q${bx + bw},${top} ${bx + bw},${top + r}V${bot}Z`
        : `M${bx},${top}V${bot - r}Q${bx},${bot} ${bx + r},${bot}H${bx + bw - r}Q${bx + bw},${bot} ${bx + bw},${bot - r}V${top}Z`;
      g += `<path d="${d}" fill="${s.color}"/>`;
      if (labels) g += `<text x="${bx + bw / 2}" y="${v >= 0 ? top - 6 : bot + 14}" font-size="11.5" fill="${C.ink}" text-anchor="middle">${(labelfmt || yfmt)(v)}</text>`;
    });
  });
  if (series.length > 1) g += legend(series.map((s) => ({ name: s.name, color: s.color })), m.l, 12);
  return `<svg width="${W}" height="${h}" viewBox="0 0 ${W} ${h}" xmlns="http://www.w3.org/2000/svg">${g}</svg>`;
}

// Barras horizontales desde una línea base (sirve para sensibilidad: valores con signo).
function barH({ rows, fmt = (v) => num(v), color = C.s2, labelW = 300, rowH = 30, colorOf }) {
  const hi = Math.max(0, ...rows.map((r) => r.v)), lo = Math.min(0, ...rows.map((r) => r.v));
  const m = { l: labelW + (lo < 0 ? 74 : 0), r: 90, t: 8, b: 8 };
  const h = m.t + m.b + rows.length * rowH;
  const pw = W - m.l - m.r;
  const X = (v) => m.l + ((v - lo) / (hi - lo || 1)) * pw;
  let g = `<line x1="${X(0)}" y1="${m.t}" x2="${X(0)}" y2="${h - m.b}" stroke="${C.gris}" stroke-width="1"/>`;
  rows.forEach((r, i) => {
    const cy = m.t + rowH * (i + 0.5), bh = Math.min(18, rowH - 10);
    const x0 = X(Math.min(0, r.v)), x1 = X(Math.max(0, r.v)), ww = Math.max(1, x1 - x0), rr = Math.min(4, ww);
    const d = r.v >= 0
      ? `M${x0},${cy - bh / 2}H${x1 - rr}Q${x1},${cy - bh / 2} ${x1},${cy - bh / 2 + rr}V${cy + bh / 2 - rr}Q${x1},${cy + bh / 2} ${x1 - rr},${cy + bh / 2}H${x0}Z`
      : `M${x1},${cy - bh / 2}H${x0 + rr}Q${x0},${cy - bh / 2} ${x0},${cy - bh / 2 + rr}V${cy + bh / 2 - rr}Q${x0},${cy + bh / 2} ${x0 + rr},${cy + bh / 2}H${x1}Z`;
    g += `<path d="${d}" fill="${colorOf ? colorOf(r) : color}"/>`;
    g += `<text x="${labelW - 12}" y="${cy + 4.5}" font-size="13" fill="${C.ink}" text-anchor="end"${r.bold ? ' font-weight="700"' : ""}>${esc(r.name)}</text>`;
    g += `<text x="${r.v >= 0 ? x1 + 8 : x0 - 8}" y="${cy + 4.5}" font-size="12.5" fill="${C.ink}" text-anchor="${r.v >= 0 ? "start" : "end"}">${fmt(r.v)}</text>`;
  });
  return `<svg width="${W}" height="${h}" viewBox="0 0 ${W} ${h}" xmlns="http://www.w3.org/2000/svg">${g}</svg>`;
}

// Barra segmentada alta: un todo dividido en partes.
function segBar({ parts, fmt = (v) => money(v, 2), w = W - 40 }) {
  const total = parts.reduce((s, p) => s + p.v, 0);
  let x = 20, g = "";
  const y = 8, bh = 28;
  for (const p of parts) {
    const ww = (p.v / total) * w - 2;
    g += `<rect x="${x}" y="${y}" width="${Math.max(1, ww)}" height="${bh}" rx="4" fill="${p.color}"/>`;
    const lab = fmt(p.v);
    if (tw(lab, 12.5) + 14 < ww) g += `<text x="${x + 8}" y="${y + 18.5}" font-size="12.5" font-weight="600" fill="${p.dark ? C.ink : C.white}">${lab}</text>`;
    x += ww + 2;
  }
  let lx = 20, ly = 62;
  for (const p of parts) {
    const name = `${p.name} · ${fmt(p.v)}`;
    if (lx + tw(name, 13) + 40 > W) { lx = 20; ly += 22; }
    g += `<rect x="${lx}" y="${ly - 10}" width="12" height="12" rx="3" fill="${p.color}"/><text x="${lx + 18}" y="${ly + 0.5}" font-size="13" fill="${C.ink}">${esc(name)}</text>`;
    lx += tw(name, 13) + 44;
  }
  const h = ly + 16;
  return `<svg width="${W}" height="${h}" viewBox="0 0 ${W} ${h}" xmlns="http://www.w3.org/2000/svg">${g}</svg>`;
}

// Diagrama de flujo vertical con carriles en columnas.
// nodes: {id, lane, row, text, kind}. edges: [desde, hasta, etiqueta?, ruta?] con ruta "hv" o "vh".
function flow({ lanes, nodes, edges, rowH = 76, nodeH = 52, head = 34 }) {
  const laneW = W / lanes.length;
  const nodeW = Math.min(176, laneW - 26);
  const rows = Math.max(...nodes.map((n) => n.row)) + 1;
  const h = head + rows * rowH + 4;
  const pos = {};
  let g = `<defs><marker id="ar" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0,0L10,5L0,10z" fill="${C.ink}"/></marker></defs>`;
  lanes.forEach((ln, i) => {
    g += `<rect x="${i * laneW}" y="0" width="${laneW}" height="${h}" fill="${i % 2 ? C.white : C.canvas}"/>`;
    g += `<rect x="${i * laneW}" y="0" width="${laneW}" height="${head}" fill="${C.b100}"/>`;
    g += `<text x="${i * laneW + laneW / 2}" y="${head / 2 + 4.5}" font-size="13" font-weight="700" fill="${C.brand7}" text-anchor="middle">${esc(ln)}</text>`;
    if (i) g += `<line x1="${i * laneW}" y1="0" x2="${i * laneW}" y2="${h}" stroke="${C.line}" stroke-width="1"/>`;
  });
  g += `<rect x="0.5" y="0.5" width="${W - 1}" height="${h - 1}" fill="none" stroke="${C.line}" stroke-width="1"/>`;
  for (const n of nodes) {
    const cx = laneW * (n.lane + 0.5), cy = head + rowH * (n.row + 0.5);
    const dec = n.kind === "decision";
    pos[n.id] = { cx, cy, l: cx - nodeW / 2 - (dec ? 6 : 0), r: cx + nodeW / 2 + (dec ? 6 : 0), t: cy - nodeH / 2 - (dec ? 6 : 0), b: cy + nodeH / 2 + (dec ? 6 : 0), kind: n.kind || "step" };
  }
  for (const [a, b, lab, ruta] of edges) {
    const A = pos[a], B = pos[b];
    const sameLane = Math.abs(A.cx - B.cx) < 1, sameRow = Math.abs(A.cy - B.cy) < 1;
    const right = B.cx > A.cx, down = B.cy > A.cy;
    let d, lx, ly, anchor = "middle";
    if (sameLane) {
      d = `M${A.cx},${down ? A.b : A.t}V${down ? B.t - 2 : B.b + 2}`; lx = A.cx + 8; ly = (down ? A.b : A.t) + (down ? 14 : -6); anchor = "start";
    } else if (sameRow) {
      d = `M${right ? A.r : A.l},${A.cy}H${right ? B.l - 2 : B.r + 2}`; lx = right ? (A.r + B.l) / 2 : (A.l + B.r) / 2; ly = A.cy - 7;
    } else if (ruta === "vh") {
      d = `M${A.cx},${down ? A.b : A.t}V${B.cy}H${right ? B.l - 2 : B.r + 2}`; lx = A.cx + 8; ly = (down ? A.b + 14 : A.t - 6); anchor = "start";
    } else {
      d = `M${right ? A.r : A.l},${A.cy}H${B.cx}V${down ? B.t - 2 : B.b + 2}`; lx = (right ? A.r + 14 : A.l - 14); ly = A.cy - 6;
    }
    g += `<path d="${d}" fill="none" stroke="${C.ink}" stroke-width="1.4" marker-end="url(#ar)"/>`;
    if (lab) g += `<text x="${lx}" y="${ly}" font-size="12" font-weight="700" fill="${C.brand7}" text-anchor="${anchor}" paint-order="stroke" stroke="${C.white}" stroke-width="4">${esc(lab)}</text>`;
  }
  for (const n of nodes) {
    const p = pos[n.id];
    const lines = wrap(n.text, Math.floor((nodeW - (p.kind === "decision" ? 44 : 14)) / 6.3));
    let fill = C.white, stroke = C.gris, color = C.ink;
    if (p.kind === "start") { fill = C.brand; stroke = C.brand; color = C.white; }
    if (p.kind === "end") { fill = C.ink; stroke = C.ink; color = C.white; }
    if (p.kind === "decision") {
      g += `<path d="M${p.cx},${p.t}L${p.r},${p.cy}L${p.cx},${p.b}L${p.l},${p.cy}Z" fill="${C.b50}" stroke="${C.brand}" stroke-width="1.4"/>`;
    } else {
      g += `<rect x="${p.cx - nodeW / 2}" y="${p.cy - nodeH / 2}" width="${nodeW}" height="${nodeH}" rx="${p.kind === "step" ? 10 : nodeH / 2}" fill="${fill}" stroke="${stroke}" stroke-width="1.2"/>`;
    }
    lines.forEach((t, k) => { g += `<text x="${p.cx}" y="${p.cy + 4 + (k - (lines.length - 1) / 2) * 13.5}" font-size="11.5" fill="${color}" text-anchor="middle"${p.kind !== "step" ? ' font-weight="600"' : ""}>${esc(t)}</text>`; });
  }
  return `<svg width="${W}" height="${h}" viewBox="0 0 ${W} ${h}" xmlns="http://www.w3.org/2000/svg">${g}</svg>`;
}

const logoMark = (size = 64, id = "m") => `<svg width="${size}" height="${size}" viewBox="0 0 512 512"><rect width="512" height="512" rx="112" fill="${C.brand}"/><mask id="${id}"><rect width="512" height="512" fill="#fff"/><circle cx="372" cy="150" r="64" fill="#000"/><circle cx="410" cy="226" r="48" fill="#000"/></mask><circle cx="256" cy="268" r="150" fill="#fff" mask="url(#${id})"/></svg>`;
const logo = (size = 64, color = C.ink, id = "m") => `<span style="display:inline-flex;align-items:center;gap:${size * 0.22}px">${logoMark(size, id)}<span style="font-size:${size * 0.82}px;font-weight:800;letter-spacing:-0.035em;color:${color};line-height:1">bite</span></span>`;

module.exports = { C, W, esc, num, money, kmoney, wrap, lineChart, colChart, barH, segBar, flow, logo, logoMark, legend };
