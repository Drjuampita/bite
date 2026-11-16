// Genera los mockups de la app: toma capturas de cada pantalla con datos de ejemplo
// y las pone en un marco de celular. Se guardan en mockups/.
//
// Uso (desde la raíz del repo):
//   npm install --no-save playwright && npx playwright install chromium
//   node herramientas/mockups.js            -> capturas + mockups
//   node herramientas/mockups.js --solo-capturas
const { chromium } = require("playwright");
const http = require("http");
const path = require("path");
const fs = require("fs");

const APPDIR = path.resolve(__dirname, "..");
const OUT = path.join(APPDIR, "mockups");
const RAW = path.join(__dirname, ".capturas");
const SOLO_CAPTURAS = process.argv.includes("--solo-capturas");

// Lee el nombre de la app desde js/data.js para el título del tablero.
const DATOS = {};
require("vm").runInNewContext(fs.readFileSync(path.join(APPDIR, "js/data.js"), "utf8") + ";this.APP = APP;", DATOS);
const esc = (t) => String(t).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c]);
let BASE = "";
fs.mkdirSync(OUT, { recursive: true });
fs.mkdirSync(RAW, { recursive: true });

// Servidor estático mínimo para abrir la app.
const TIPOS = { ".html": "text/html", ".js": "text/javascript", ".css": "text/css", ".svg": "image/svg+xml", ".woff2": "font/woff2", ".png": "image/png" };
function servir() {
  return new Promise((ok) => {
    const srv = http.createServer((req, res) => {
      const ruta = decodeURIComponent(req.url.split("?")[0]);
      const archivo = path.join(APPDIR, ruta === "/" ? "index.html" : ruta);
      if (!archivo.startsWith(APPDIR) || !fs.existsSync(archivo)) {
        res.writeHead(404);
        return res.end();
      }
      res.writeHead(200, { "Content-Type": TIPOS[path.extname(archivo)] || "application/octet-stream" });
      fs.createReadStream(archivo).pipe(res);
    });
    srv.listen(0, () => ok(srv));
  });
}

const AHORA = new Date("2026-11-16T12:40:00-06:00").getTime();
const min = (m) => AHORA - m * 60000;

const usuario = { nombre: "Mariana López", correo: "mariana.lopez@universidad.edu.mx" };

const pLuka = {
  id: 1043, local: "luka", alumno: "Mariana López",
  items: [
    { id: "salmon", nombre: "Poke de salmón clásico", precio: 199, cant: 1 },
    { id: "edamames", nombre: "Edamames", precio: 55, cant: 1 },
    { id: "te", nombre: "Té helado de la casa", precio: 40, cant: 1 },
  ],
  nota: "Sin cebolla, salsa aparte", envio: 12, total: 306, salon: "B-204",
  cuando: "ahora", hora: "", pagoTexto: "Tarjeta", estado: 1, cancelado: false, calificacion: 0,
  creado: min(8), ultimoCambio: min(3),
};
const pTim = {
  id: 1044, local: "timhortons", alumno: "Mariana López",
  items: [{ id: "original", nombre: "Café Original Blend", precio: 35, cant: 1 }, { id: "boston", nombre: "Dona Boston Cream", precio: 28, cant: 1 }],
  nota: "", envio: 12, total: 75, salon: "C-310", cuando: "programar", hora: "Mañana 9:00",
  pagoTexto: "Efectivo", estado: -1, cancelado: false, calificacion: 0, creado: min(2), ultimoCambio: min(2),
};
const pSinf = {
  id: 1041, local: "sinforosa", alumno: "Mariana López",
  items: [{ id: "bag-pavo", nombre: "Baguette de pavo y panela", precio: 115, cant: 1 }, { id: "latte", nombre: "Latte", precio: 58, cant: 1 }],
  nota: "", envio: 12, total: 185, salon: "B-204", cuando: "ahora", hora: "", pagoTexto: "Efectivo",
  estado: 3, cancelado: false, calificacion: 5, creado: AHORA - 26 * 3600000, ultimoCambio: AHORA - 25 * 3600000,
};
const pStarEntregado = {
  id: 1042, local: "starbucks", alumno: "Mariana López",
  items: [{ id: "caramelfrap", nombre: "Caramel Frappuccino", precio: 84, cant: 1 }, { id: "panela", nombre: "Sándwich de pavo y panela", precio: 89, cant: 1 }],
  nota: "", envio: 12, total: 185, salon: "A-108", cuando: "ahora", hora: "", pagoTexto: "Tarjeta",
  estado: 3, cancelado: false, calificacion: 0, creado: min(40), ultimoCambio: min(5),
};

const carrito = { local: "starbucks", items: [{ id: "caramelfrap", cant: 1 }, { id: "croissant", cant: 1 }, { id: "latte", cant: 1 }], nota: "Latte con leche de almendra" };

const base = {
  usuario, salon: { edificio: "B", numero: "204" },
  carrito: { local: null, items: [], nota: "" },
  checkout: { cuando: "ahora", hora: "", pago: "efectivo" },
  pedidos: [], categoria: "todo", autoAvance: false,
};

const BLANCO = { fondo: "#ffffff", tinta: "#0E1F3F" };
const pantallas = [
  { nombre: "01-login", titulo: "Inicio de sesión", ruta: "#/login", estado: { ...base, usuario: null }, barra: { fondo: "#0E1F3F", tinta: "#fff" } },
  { nombre: "02-inicio", titulo: "Inicio", ruta: "#/inicio", estado: { ...base, pedidos: [pLuka, pSinf] }, barra: BLANCO },
  { nombre: "03-sinforosa", titulo: "Menú · Sinforosa", ruta: "#/local/sinforosa", estado: { ...base }, barra: { fondo: "#B85C38", tinta: "#fff" } },
  { nombre: "04-luka-poke", titulo: "Menú · Luka Poke", ruta: "#/local/luka", estado: { ...base, carrito: { local: "luka", items: [{ id: "spicy", cant: 1 }], nota: "" } }, barra: { fondo: "#1F8A80", tinta: "#fff" } },
  { nombre: "05-starbucks", titulo: "Menú · Starbucks", ruta: "#/local/starbucks", estado: { ...base, carrito }, barra: { fondo: "#0B6B48", tinta: "#fff" } },
  { nombre: "06-tim-hortons", titulo: "Menú · Tim Hortons", ruta: "#/local/timhortons", estado: { ...base }, barra: { fondo: "#B5121B", tinta: "#fff" } },
  { nombre: "07-carrito", titulo: "Carrito", ruta: "#/carrito", estado: { ...base, carrito }, barra: BLANCO },
  { nombre: "08-confirmar-pedido", titulo: "Confirmar pedido", ruta: "#/checkout", estado: { ...base, carrito, checkout: { cuando: "programar", hora: "Hoy 14:00", pago: "tarjeta" } }, barra: BLANCO },
  { nombre: "09-seguimiento", titulo: "Seguimiento", ruta: "#/pedido/1043", estado: { ...base, pedidos: [pLuka] }, barra: BLANCO },
  { nombre: "10-entregado", titulo: "Pedido entregado", ruta: "#/pedido/1042", estado: { ...base, pedidos: [pStarEntregado] }, barra: BLANCO, accion: '[data-action=calificar][data-n="5"]' },
  { nombre: "11-mis-pedidos", titulo: "Mis pedidos", ruta: "#/pedidos", estado: { ...base, pedidos: [pTim, pLuka, pSinf] }, barra: BLANCO },
  { nombre: "12-perfil", titulo: "Perfil", ruta: "#/perfil", estado: { ...base, autoAvance: true, pedidos: [pLuka, pSinf, { ...pStarEntregado, calificacion: 5 }] }, barra: BLANCO },
];

const ANCHO = 390, ALTO = 800, BARRA = 44, ABAJO = 24;

function barraEstado(b) {
  const t = b.tinta;
  return `
  <div class="sb" style="background:${b.fondo};color:${t}">
    <span class="sb-hora">12:40</span>
    <span class="isla"></span>
    <span class="sb-iconos">
      <svg width="18" height="12" viewBox="0 0 18 12"><rect x="0" y="8" width="3" height="4" rx="1" fill="${t}"/><rect x="5" y="5.5" width="3" height="6.5" rx="1" fill="${t}"/><rect x="10" y="3" width="3" height="9" rx="1" fill="${t}"/><rect x="15" y="0" width="3" height="12" rx="1" fill="${t}"/></svg>
      <svg width="16" height="12" viewBox="0 0 16 12"><path d="M8 11.5 5.6 9a3.4 3.4 0 0 1 4.8 0Z" fill="${t}"/><path d="M3.4 6.8a6.6 6.6 0 0 1 9.2 0" stroke="${t}" stroke-width="1.8" fill="none" stroke-linecap="round"/><path d="M1.2 4.4a9.8 9.8 0 0 1 13.6 0" stroke="${t}" stroke-width="1.8" fill="none" stroke-linecap="round"/></svg>
      <svg width="27" height="13" viewBox="0 0 27 13"><rect x=".5" y=".5" width="23" height="12" rx="3.5" stroke="${t}" stroke-opacity=".4" fill="none"/><rect x="2" y="2" width="17" height="9" rx="2" fill="${t}"/><path d="M25 4.5v4c.8-.3 1.3-1.1 1.3-2s-.5-1.7-1.3-2Z" fill="${t}" fill-opacity=".5"/></svg>
    </span>
  </div>`;
}

function telefonoHtml(p) {
  return `
  <div class="cel">
    <div class="marco">
      <div class="pantalla">
        ${barraEstado(p.barra)}
        <img src="file://${RAW}/${p.nombre}.png" width="${ANCHO}" height="${ALTO}">
        <div class="abajo" style="background:${p.nombre.match(/sinforosa|luka|starbucks|tim/) ? "#F6F7FA" : "#fff"}"><span class="home"></span></div>
      </div>
    </div>
    ${p.titulo ? `<div class="et">${p.titulo}</div>` : ""}
  </div>`;
}

const CSS = `
@font-face{font-family:Inter;font-weight:400 700;src:url(file://${APPDIR}/fonts/inter-latin.woff2)}
*{box-sizing:border-box}
body{margin:0;font-family:Inter,sans-serif;color:#0E1F3F;background:#EEF0F5}
.cel{display:flex;flex-direction:column;align-items:center;gap:22px}
.marco{padding:12px;border-radius:62px;background:#111318;box-shadow:0 0 0 1.5px #2a2e37 inset,0 40px 80px -30px rgba(14,31,63,.45),0 12px 24px -12px rgba(14,31,63,.25)}
.pantalla{position:relative;width:${ANCHO}px;height:${ALTO + BARRA + ABAJO}px;border-radius:50px;overflow:hidden;background:#fff}
.pantalla img{display:block}
.sb{height:${BARRA}px;display:flex;align-items:center;justify-content:space-between;padding:4px 30px 0 40px;position:relative}
.sb-hora{font-weight:600;font-size:15px;letter-spacing:-.01em}
.sb-iconos{display:flex;gap:6px;align-items:center}
.isla{position:absolute;left:50%;top:9px;transform:translateX(-50%);width:110px;height:31px;border-radius:20px;background:#000}
.abajo{height:${ABAJO}px;position:relative}.home{position:absolute;left:50%;bottom:8px;transform:translateX(-50%);width:134px;height:5px;border-radius:3px;background:rgba(14,31,63,.85)}
.et{font-size:17px;font-weight:600;letter-spacing:-.01em;color:#0E1F3F}
`;

function tableroHtml() {
  return `<!doctype html><html><head><meta charset="utf-8"><style>${CSS}
  body{width:2040px;padding:80px 90px 100px}
  .cab{display:flex;align-items:center;gap:20px;margin-bottom:64px}
  .cab img{width:64px;height:64px;border-radius:18px}
  .cab h1{margin:0;font-size:46px;font-weight:700;letter-spacing:-.04em}
  .cab h1 span{color:#F26B1D}
  .cab p{margin:4px 0 0;font-size:19px;color:#687089}
  .rejilla{display:grid;grid-template-columns:repeat(4,1fr);gap:72px 40px}
  </style></head><body>
  <div class="cab"><img src="file://${APPDIR}/img/icono.svg"><div><h1>${esc(DATOS.APP.nombre.toLowerCase())}<span>.</span></h1><p>Pide en los locales del campus y recibe tu pedido en tu salón</p></div></div>
  <div class="rejilla">${pantallas.map(telefonoHtml).join("")}</div>
  </body></html>`;
}

function individualHtml(p) {
  return `<!doctype html><html><head><meta charset="utf-8"><style>${CSS}
  body{width:${ANCHO + 24 + 120}px;padding:60px 60px 56px;display:flex;justify-content:center}
  </style></head><body>${telefonoHtml({ ...p, titulo: "" })}</body></html>`;
}

(async () => {
  const srv = await servir();
  BASE = `http://localhost:${srv.address().port}/`;
  const browser = await chromium.launch();
  for (const p of pantallas) {
    const ctx = await browser.newContext({ viewport: { width: ANCHO, height: ALTO }, deviceScaleFactor: 2, timezoneId: "America/Mexico_City", locale: "es-MX" });
    const page = await ctx.newPage();
    const errores = [];
    page.on("pageerror", (e) => errores.push(e.message));
    page.on("console", (m) => m.type() === "error" && errores.push(m.text()));
    await page.clock.setFixedTime(AHORA);
    await page.addInitScript((s) => {
      if (!sessionStorage.getItem("sembrado")) {
        localStorage.setItem("app_comida_campus_v2", JSON.stringify(s));
        sessionStorage.setItem("sembrado", "1");
      }
    }, p.estado);
    await page.goto(BASE + p.ruta);
    await page.evaluate(() => document.fonts.ready);
    if (p.accion) await page.click(p.accion);
    await page.waitForTimeout(350);
    await page.screenshot({ path: path.join(RAW, p.nombre + ".png") });
    console.log(p.nombre, errores.length ? "ERRORES: " + errores.join(" | ") : "ok");
    await ctx.close();
  }
  if (SOLO_CAPTURAS) {
    await browser.close();
    return srv.close();
  }

  const pg = await browser.newPage({ deviceScaleFactor: 2 });
  for (const p of pantallas) {
    const f = path.join(RAW, "individual.html");
    fs.writeFileSync(f, individualHtml(p));
    await pg.setViewportSize({ width: ANCHO + 24 + 120, height: 900 });
    await pg.goto("file://" + f);
    await pg.evaluate(() => document.fonts.ready);
    await pg.screenshot({ path: path.join(OUT, p.nombre + ".png"), fullPage: true });
  }
  await pg.close();

  const tb = await browser.newPage({ deviceScaleFactor: 1.5 });
  const f = path.join(RAW, "tablero.html");
  fs.writeFileSync(f, tableroHtml());
  await tb.setViewportSize({ width: 2040, height: 1200 });
  await tb.goto("file://" + f);
  await tb.evaluate(() => document.fonts.ready);
  await tb.waitForTimeout(200);
  await tb.screenshot({ path: path.join(OUT, "00-todas-las-pantallas.png"), fullPage: true });
  await browser.close();
  srv.close();
  console.log("Mockups listos en", OUT);
})();
