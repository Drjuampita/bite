#!/usr/bin/env node
// Arma el Proyecto Integrador en Word a partir de plan/contenido/*.md y del modelo financiero.
// Uso: NODE_PATH=$(npm root -g) node plan/herramientas/documento.js
const fs = require("fs");
const path = require("path");
const os = require("os");
const { execFileSync } = require("child_process");
const D = require("docx");
const {
  Document, Packer, Paragraph, TextRun, HeadingLevel, AlignmentType, Table, TableRow, TableCell, WidthType, ShadingType,
  BorderStyle, ImageRun, PageBreak, Header, Footer, PageNumber, LevelFormat, InternalHyperlink, ExternalHyperlink, Bookmark, VerticalAlign,
  TableLayoutType, TabStopType, LeaderType, Tab,
} = D;

const AQUI = __dirname;
const RAIZ = path.join(AQUI, "..");
const S = JSON.parse(fs.readFileSync(path.join(AQUI, "salidas.json"), "utf8"));
const DATOS = JSON.parse(fs.readFileSync(path.join(AQUI, "datos.json"), "utf8"));
const AUTO = require("./tablas_auto")(S, DATOS);
const SALIDA = path.join(RAIZ, "BITE_Proyecto_Integrador.docx");
const FUENTE = "Times New Roman";
const COL = { marca: "E5386D", marca7: "A81D4A", tinta: "000000", gris: "75695F", linea: "D9D0C7", suave: "FFF5F8", durazno: "FFDDE7", b50: "FFF1F5", amarillo: "FFF2A8" };
const ANCHO = 9640; // ancho útil en DXA (carta con márgenes de 2.54 cm)

// ── Formato de cifras ─────────────────────────────────────
const num = (v, d = 0) => Number(v).toLocaleString("en-US", { minimumFractionDigits: d, maximumFractionDigits: d });
const FMT = {
  "$": (v) => (v < 0 ? "−$" : "$") + num(Math.abs(v)),
  "$2": (v) => (v < 0 ? "−$" : "$") + num(Math.abs(v), 2),
  "$k": (v) => (Math.abs(v) >= 1e6 ? (v < 0 ? "−$" : "$") + num(Math.abs(v) / 1e6, 2) + " millones" : (v < 0 ? "−$" : "$") + num(Math.abs(v) / 1e3) + " mil"),
  n: (v) => num(v),
  n1: (v) => num(v, 1),
  n2: (v) => num(v, 2),
  "%": (v) => (Math.abs(v * 100 - Math.round(v * 100)) < 0.05 ? num(v * 100) : num(v * 100, 1)) + "%",
  "%1": (v) => num(v * 100, 1) + "%",
  txt: (v) => String(v),
};
function valor(expr) {
  const [k, f = "n"] = expr.split("|").map((x) => x.trim());
  let v;
  if (k.startsWith("=")) v = Function("S", "Math", `return (${k.slice(1)})`)(S, Math);
  else {
    if (!(k in S)) throw new Error(`Clave del modelo no encontrada: ${k}`);
    v = S[k];
  }
  if (!(f in FMT)) throw new Error(`Formato desconocido: ${f} en {{${expr}}}`);
  if (typeof v !== "number" && f !== "txt") return String(v);
  return FMT[f](v);
}
const sustituir = (t) => t.replace(/\{\{([^}]+)\}\}/g, (_, e) => valor(e));

// ── Texto con formato en línea ────────────────────────────
function runs(texto, base = {}) {
  const out = [];
  for (const parte of texto.split(/(\*\*[^*]+\*\*|\*[^*]+\*|==[^=]+==|https:\/\/[^\s)]*[^\s).,])/)) {
    if (!parte) continue;
    if (parte.startsWith("https://")) { out.push(new ExternalHyperlink({ link: parte, children: [new TextRun({ ...base, text: parte, color: "0563C1", underline: {} })] })); continue; }
    if (parte.startsWith("**")) out.push(new TextRun({ ...base, text: parte.slice(2, -2) })); // sin negritas dentro del texto
    else if (parte.startsWith("==")) out.push(new TextRun({ ...base, text: parte.slice(2, -2), shading: { type: ShadingType.CLEAR, fill: COL.amarillo, color: "auto" } }));
    else if (parte.startsWith("*")) out.push(new TextRun({ ...base, text: parte.slice(1, -1), italics: true }));
    else out.push(new TextRun({ ...base, text: parte }));
  }
  return out;
}
const P = (texto, o = {}) => new Paragraph({ children: runs(texto, o.run || {}), spacing: { after: 90, line: 259 }, alignment: o.align || AlignmentType.JUSTIFIED, ...o.par });

// ── Tablas ────────────────────────────────────────────────
const borde = { style: BorderStyle.SINGLE, size: 4, color: COL.linea };
const esNumero = (t) => /^[−\-+]?\$?[\d,.]+( mil| millones|%| M)?$/.test(t.trim()) || /^(PASA|FALLA|PENDIENTE)$/.test(t.trim());
function tabla(filas, cols, o = {}) {
  const n = filas[0].length;
  const pesos = cols && cols.length === n ? cols : Array(n).fill(1);
  const total = pesos.reduce((a, b) => a + b, 0);
  const anchos = pesos.map((p) => Math.round((p / total) * ANCHO));
  anchos[n - 1] += ANCHO - anchos.reduce((a, b) => a + b, 0);
  const tam = Math.min(o.size || 16, 16);
  const rows = filas.map((fila, i) => new TableRow({
    tableHeader: i === 0, cantSplit: true,
    children: fila.map((celda, j) => {
      const esTotal = /^\*\*/.test(String(fila[0])) && i > 0;
      const partes = String(celda).split("<br>");
      return new TableCell({
        width: { size: anchos[j], type: WidthType.DXA },
        verticalAlign: VerticalAlign.CENTER,
        margins: { top: 60, bottom: 60, left: 100, right: 100 },
        shading: i === 0 ? { type: ShadingType.CLEAR, fill: COL.marca, color: "auto" } : esTotal ? { type: ShadingType.CLEAR, fill: COL.durazno, color: "auto" } : i % 2 === 0 ? { type: ShadingType.CLEAR, fill: COL.suave, color: "auto" } : undefined,
        borders: { top: borde, bottom: borde, left: borde, right: borde },
        children: partes.map((t) => new Paragraph({
          alignment: i === 0 ? (j === 0 ? AlignmentType.LEFT : AlignmentType.CENTER) : (j > 0 && esNumero(t.replace(/\*\*|==/g, "")) ? AlignmentType.RIGHT : AlignmentType.LEFT),
          spacing: { after: 0, line: 252 },
          children: runs(t, i === 0 ? { bold: true, color: "FFFFFF", size: tam } : { size: tam }),
        })),
      });
    }),
  }));
  return new Table({ width: { size: ANCHO, type: WidthType.DXA }, columnWidths: anchos, layout: TableLayoutType.FIXED, rows });
}

// ── Imágenes ──────────────────────────────────────────────
function pngSize(file) {
  const b = fs.readFileSync(file);
  return { w: b.readUInt32BE(16), h: b.readUInt32BE(20), data: b };
}
function figura(nombre, cm) {
  const file = path.join(RAIZ, "figuras", nombre + ".png");
  if (!fs.existsSync(file)) throw new Error("Falta la figura " + file);
  const { w, h, data } = pngSize(file);
  const px = ((cm * Number(process.env.ESCALA_FIG || 0.6)) / 2.54) * 96;
  return new Paragraph({ alignment: AlignmentType.CENTER, keepNext: true, spacing: { before: 120, after: 60 }, children: [new ImageRun({ type: "png", data, transformation: { width: px, height: (px * h) / w } })] });
}

// ── Lectura del contenido ─────────────────────────────────
function leerContenido() {
  const dir = path.join(RAIZ, "contenido");
  return fs.readdirSync(dir).filter((f) => f.endsWith(".md")).sort().map((f) => fs.readFileSync(path.join(dir, f), "utf8")).join("\n\n");
}

function construir(paginas) {
  const lineas = sustituir(leerContenido()).split("\n");
  const cuerpo = [];
  const indice = []; // {nivel, texto, id}
  let nTabla = 0, nFig = 0, nLista = 0, h1 = 0;
  let cols = null, pendTabla = null, tam = null;
  const pie = (t) => new Paragraph({ alignment: AlignmentType.LEFT, spacing: { after: 160 }, children: runs(t, { size: 17, color: COL.gris }) });
  const tituloTabla = (t) => new Paragraph({ keepNext: true, spacing: { before: 160, after: 80 }, children: [new TextRun({ text: `Tabla ${++nTabla}. `, bold: true, size: 22 }), ...runs(t, { size: 22 })] });
  const ponerTabla = (filas) => {
    if (pendTabla) cuerpo.push(tituloTabla(pendTabla));
    cuerpo.push(tabla(filas, cols, { size: tam }));
    cuerpo.push(new Paragraph({ spacing: { after: 100 }, children: [] }));
    cols = null; pendTabla = null; tam = null;
  };
  for (let i = 0; i < lineas.length; i++) {
    const l = lineas[i];
    if (!l.trim()) continue;
    let m;
    if ((m = /^(#{1,4}) (.+)$/.exec(l))) {
      const nivel = m[1].length, texto = m[2].trim();
      if (nivel === 4) { cuerpo.push(new Paragraph({ keepNext: true, spacing: { before: 160, after: 60 }, children: [new TextRun({ text: texto, bold: true, size: 22, color: COL.tinta })] })); continue; }
      const id = `h${indice.length}`;
      indice.push({ nivel, texto, id });
      cuerpo.push(new Paragraph({
        heading: [HeadingLevel.HEADING_1, HeadingLevel.HEADING_2, HeadingLevel.HEADING_3][nivel - 1],
        pageBreakBefore: nivel === 1 && h1++ > 0 && !/^(6|7|8|9|10|12|13|14|15|16|17|18)\. /.test(texto),
        children: [new Bookmark({ id, children: [new TextRun({ text: texto })] })],
      }));
    } else if (l.startsWith("!cols ")) cols = l.slice(6).split(",").map(Number);
    else if (l.startsWith("!tam ")) tam = Number(l.slice(5));
    else if (l.startsWith("!tabla ")) pendTabla = l.slice(7).trim();
    else if (l.startsWith("!auto ")) {
      const nombre = l.slice(6).trim();
      if (!AUTO[nombre]) throw new Error("Tabla automática desconocida: " + nombre);
      const t = AUTO[nombre];
      if (!cols && t.cols) cols = t.cols;
      if (!tam && t.size) tam = t.size;
      ponerTabla(t.filas);
    } else if (l.startsWith("!fuente ")) { /* las notas de fuente bajo tablas ya no se imprimen */ }
    else if (l.startsWith("!fig ")) {
      const [nombre, cm, texto] = l.slice(5).split("|").map((x) => x.trim());
      cuerpo.push(figura(nombre, Number(cm)));
      cuerpo.push(new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 200 }, children: [new TextRun({ text: `Figura ${++nFig}. `, bold: true, size: 22 }), ...runs(texto, { size: 22 })] }));
    } else if (l.startsWith("!nota ")) {
      cuerpo.push(new Paragraph({
        spacing: { before: 120, after: 200, line: 259 }, indent: { left: 200, right: 100 },
        border: { left: { style: BorderStyle.SINGLE, size: 18, color: "8A8A8A", space: 10 } },
        shading: { type: ShadingType.CLEAR, fill: "F2F2F2", color: "auto" },
        children: runs(l.slice(6)),
      }));
    } else if (l.startsWith("!pendiente ")) {
      cuerpo.push(new Paragraph({
        spacing: { before: 120, after: 200, line: 259 }, indent: { left: 200, right: 100 },
        border: { left: { style: BorderStyle.SINGLE, size: 24, color: "C9A400", space: 10 } },
        shading: { type: ShadingType.CLEAR, fill: COL.amarillo, color: "auto" },
        children: [new TextRun({ text: "Pendiente. ", bold: true }), ...runs(l.slice(11))],
      }));
    } else if (l.startsWith("!ref ")) {
      cuerpo.push(new Paragraph({ alignment: AlignmentType.LEFT, spacing: { after: 110, line: 264 }, indent: { left: 500, hanging: 500 }, children: runs(l.slice(5), { size: 22 }) }));
    } else if (l.trim() === "!salto") cuerpo.push(new Paragraph({ children: [new PageBreak()] }));
    else if (l.startsWith("|")) {
      const filas = [];
      while (i < lineas.length && lineas[i].startsWith("|")) {
        const celdas = lineas[i].trim().replace(/^\||\|$/g, "").split("|").map((c) => c.trim());
        if (!celdas.every((c) => /^:?-+:?$/.test(c))) filas.push(celdas);
        i++;
      }
      i--;
      ponerTabla(filas);
    } else if (/^- /.test(l)) {
      while (i < lineas.length && /^- /.test(lineas[i])) {
        cuerpo.push(new Paragraph({ numbering: { reference: "vinetas", level: 0 }, spacing: { after: 70, line: 259 }, children: runs(lineas[i].slice(2)) }));
        i++;
      }
      i--;
    } else if (/^\d+\. /.test(l)) {
      nLista++;
      while (i < lineas.length && /^\d+\. /.test(lineas[i])) {
        cuerpo.push(new Paragraph({ numbering: { reference: "numeros", level: 0, instance: nLista }, spacing: { after: 70, line: 259 }, children: runs(lineas[i].replace(/^\d+\. /, "")) }));
        i++;
      }
      i--;
    } else cuerpo.push(P(l));
  }

  // ── Portada ──
  const centro = (t, o = {}) => new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: o.after ?? 80 }, children: [new TextRun({ text: t, size: o.size || 24, bold: o.bold, color: o.color })] });
  const logoP = pngSize(path.join(RAIZ, "figuras", "logo_portada.png"));
  const portada = [
    centro("Universidad Anáhuac Querétaro", { size: 30, bold: true, after: 60 }),
    centro("Taller de Empresa", { size: 24, after: 40 }),
    centro("Docente: Néstor Daniel Sánchez García", { size: 22, color: COL.gris, after: 900 }),
    new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 700 }, children: [new ImageRun({ type: "png", data: logoP.data, transformation: { width: 360, height: (360 * logoP.h) / logoP.w } })] }),
    centro("Proyecto Integrador Final", { size: 40, bold: true, after: 120 }),
    centro("Plan de negocios de una app de entrega de comida dentro del campus", { size: 24, color: COL.gris, after: 900 }),
    ...["Silvana Rubio Reyes · 00640949", "Natalia Orozco Estrada · 00633241", "Diego Rodríguez Sáenz · 00634144", "Emmanuel Alexander Quintana Tirado · 00640255", "Juan Pablo Palma Redondo · 00645488"].map((t) => centro(t, { size: 23, after: 50 })),
    centro("Agosto – noviembre de 2026", { size: 22, color: COL.gris, after: 0 }),
    new Paragraph({ children: [new PageBreak()] }),
  ];

  // ── Índice ──
  const toc = [new Paragraph({ spacing: { after: 200 }, children: [new TextRun({ text: "Índice", bold: true, size: 34 })] })];
  for (const h of indice) {
    if (h.nivel > 2) continue;
    toc.push(new Paragraph({
      spacing: { after: h.nivel === 1 ? 70 : 30, before: h.nivel === 1 ? 110 : 0 }, indent: { left: h.nivel === 1 ? 0 : 300 },
      tabStops: [{ type: TabStopType.RIGHT, position: ANCHO, leader: LeaderType.DOT }],
      children: [new InternalHyperlink({ anchor: h.id, children: [
        new TextRun({ text: h.texto, bold: h.nivel === 1, size: 22 }),
        new TextRun({ size: 22, children: [new Tab(), String(paginas[h.id] || "")] }),
      ] })],
    }));
  }
  toc.push(new Paragraph({ children: [new PageBreak()] }));

  const cab = { run: { font: FUENTE, color: COL.tinta }, paragraph: { keepNext: true } };
  const doc = new Document({
    creator: "Equipo BITE", title: "BITE · Proyecto Integrador Final", description: "Taller de Empresa, Universidad Anáhuac Querétaro",
    styles: {
      default: {
        document: { run: { font: FUENTE, size: 22, color: COL.tinta } },
        heading1: { run: { font: FUENTE, size: 28, bold: true, color: COL.tinta }, paragraph: { spacing: { before: 0, after: 240 }, keepNext: true } },
        heading2: { run: { font: FUENTE, size: 22, bold: true, color: COL.tinta }, paragraph: { spacing: { before: 320, after: 140 }, keepNext: true } },
        heading3: { run: { font: FUENTE, size: 22, bold: true, color: COL.tinta }, paragraph: { spacing: { before: 240, after: 100 }, keepNext: true } },
      },
    },
    numbering: { config: [
      { reference: "vinetas", levels: [{ level: 0, format: LevelFormat.BULLET, text: "•", alignment: AlignmentType.LEFT, style: { paragraph: { indent: { left: 500, hanging: 260 } } } }] },
      { reference: "numeros", levels: [{ level: 0, format: LevelFormat.DECIMAL, text: "%1.", alignment: AlignmentType.LEFT, style: { paragraph: { indent: { left: 500, hanging: 320 } } } }] },
    ] },
    sections: [{
      properties: { page: { size: { width: 12240, height: 15840 }, margin: { top: 1250, bottom: 1150, left: 1300, right: 1300 } }, titlePage: true },
      headers: {
        default: new Header({ children: [new Paragraph({ alignment: AlignmentType.RIGHT, children: [new TextRun({ size: 22, children: [PageNumber.CURRENT] })] })] }),
        first: new Header({ children: [new Paragraph({ children: [] })] }),
      },
      children: [...portada, ...toc, ...cuerpo],
    }],
  });
  return { doc, indice, nTabla, nFig };
}

const norm = (s) => s.normalize("NFC").replace(/\s+/g, " ").trim().toLowerCase();
async function escribir(paginas, destino) {
  const { doc, indice, nTabla, nFig } = construir(paginas);
  fs.writeFileSync(destino, await Packer.toBuffer(doc));
  return { indice, nTabla, nFig };
}

(async () => {
  const tmp = fs.mkdtempSync(path.join(os.tmpdir(), "bite-doc-"));
  const borrador = path.join(tmp, "borrador.docx");
  const { indice } = await escribir({}, borrador);
  // Pasada 1: convertir a PDF y localizar en qué página cae cada título
  const SOFFICE = "/root/.claude/skills/synced/86ead852-bf27-4845-9d4a-d7a70d835a72_d043d138-0f44-4851-ab91-be9989c246b1/docx/scripts/office/soffice.py";
  let paginas = {};
  try {
    execFileSync("python3", [SOFFICE, "--headless", "--convert-to", "pdf", "--outdir", tmp, borrador], { stdio: "ignore" });
    const pdf = path.join(tmp, "borrador.pdf");
    const total = Number(/Pages:\s+(\d+)/.exec(execFileSync("pdfinfo", [pdf]).toString())[1]);
    const texto = [];
    for (let p = 1; p <= total; p++) texto.push(norm(execFileSync("pdftotext", ["-f", String(p), "-l", String(p), "-layout", pdf, "-"]).toString()));
    // La primera aparición de cada título está en el índice; se busca después de él.
    const clave = (h) => norm(h.texto).slice(0, 38);
    let desde = texto.findIndex((t, i) => i > 0 && t.includes(clave(indice[0])) && !t.includes("índice") && texto.slice(0, i).some((x) => x.includes(clave(indice[0]))));
    if (desde < 0) desde = 0;
    for (const h of indice) {
      let p = desde;
      while (p < total && !texto[p].includes(clave(h))) p++;
      if (p < total) { paginas[h.id] = p + 1; desde = p; }
    }
    console.log(`Borrador: ${total} páginas; títulos localizados: ${Object.keys(paginas).length} de ${indice.length}`);
  } catch (e) {
    console.log("No se pudo paginar el índice (se deja sin números):", e.message.split("\n")[0]);
  }
  const r = await escribir(paginas, SALIDA);
  execFileSync("python3", [path.join(AQUI, "corregir_docx.py"), SALIDA]);
  fs.rmSync(tmp, { recursive: true, force: true });
  console.log(`Documento: ${SALIDA}\nTablas: ${r.nTabla} · Figuras: ${r.nFig} · Títulos: ${r.indice.length}`);
})().catch((e) => { console.error(e.message); process.exit(1); });
