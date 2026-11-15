#!/usr/bin/env node
// Genera todas las figuras del documento en plan/figuras/*.png.
// Uso: NODE_PATH=$(npm root -g) node plan/herramientas/figuras.js [filtro]
const { chromium } = require("playwright");
const fs = require("fs");
const os = require("os");
const path = require("path");
const { C } = require("./figuras_lib");

const AQUI = __dirname;
const OUT = path.join(AQUI, "..", "figuras");
const TMP = fs.mkdtempSync(path.join(os.tmpdir(), "bite-figs-"));
const S = JSON.parse(fs.readFileSync(path.join(AQUI, "salidas.json"), "utf8"));
const filtro = process.argv[2] ? new RegExp(process.argv[2]) : null;

const fuentes = [400, 500, 600, 700, 800].map((w) => `@font-face{font-family:'Plus Jakarta Sans';font-weight:${w};src:url('file://${path.join(AQUI, "fuentes", `plus-jakarta-sans-latin-${w}-normal.woff2`)}') format('woff2')}`).join("\n");
const pagina = (html, w) => `<!doctype html><html><head><meta charset="utf-8"><style>${fuentes}
*{box-sizing:border-box;margin:0;padding:0}
body{font-family:'Plus Jakarta Sans',sans-serif;color:${C.ink};background:#fff;font-size:14px;line-height:1.4;-webkit-font-smoothing:antialiased}
svg text{font-family:'Plus Jakarta Sans',sans-serif}
#fig{width:${w}px;background:#fff;padding:6px}
b{font-weight:700}
</style></head><body><div id="fig">${html}</div></body></html>`;

(async () => {
  const figs = [...require("./figs_diagramas")(S), ...require("./figs_graficas")(S), ...require("./figs_identidad")(S, OUT)];
  fs.mkdirSync(OUT, { recursive: true });
  const browser = await chromium.launch();
  const page = await (await browser.newContext({ deviceScaleFactor: 2.5, viewport: { width: 900, height: 900 } })).newPage();
  let n = 0;
  for (const f of figs) {
    if (filtro && !filtro.test(f.name)) continue;
    const file = path.join(TMP, f.name + ".html");
    fs.writeFileSync(file, pagina(f.html, f.w || 800));
    await page.goto("file://" + file);
    await page.evaluate(() => document.fonts.ready);
    await page.waitForTimeout(120);
    await page.locator("#fig").screenshot({ path: path.join(OUT, f.name + ".png") });
    n++;
  }
  await browser.close();
  fs.rmSync(TMP, { recursive: true, force: true });
  console.log(`${n} figuras en ${OUT}`);
})().catch((e) => { console.error(e); process.exit(1); });
