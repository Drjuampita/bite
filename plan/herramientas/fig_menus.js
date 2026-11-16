// Figura de menús por local, con fotos ilustrativas de licencia libre (Unsplash).
const { chromium } = require("playwright");
const fs = require("fs"), path = require("path");
const R = path.join(__dirname, "..", "figuras");
const L = [
  ["Starbucks", "Café y bebidas", "starbucks", [["Latte", 79], ["Caramel Macchiato", 95], ["Frappuccino caramelo", 105], ["Panini de pavo y queso", 99], ["Croissant de mantequilla", 55]]],
  ["Luka Poke", "Bowls de poke", "luka", [["Poke de salmón", 175], ["Poke de atún spicy", 175], ["Poke de pollo teriyaki", 155], ["Poke vegetariano", 145], ["Té helado", 45]]],
  ["Sinforosa", "Comida mexicana", "sinforosa", [["Enchiladas suizas", 85], ["Chilaquiles verdes con pollo", 89], ["Molletes", 69], ["Sándwich de pollo", 79], ["Agua fresca", 25]]],
  ["Tim Hortons", "Café y donas", "tim", [["Café latte", 62], ["Iced Capp", 75], ["Dona glaseada", 25], ["Caja de 10 Timbits", 55], ["Croissant de jamón, huevo y queso", 59]]],
  ["Vete a la Burger", "Hamburguesas", "burger", [["Hamburguesa clásica", 139], ["Hamburguesa con tocino", 159], ["Boneless", 129], ["Papas a la francesa", 59], ["Refresco", 35]]],
];
(async () => {
  const img = (n) => "data:image/jpeg;base64," + fs.readFileSync(path.join(R, "fotos", n + ".jpg")).toString("base64");
  const html = `<html><body style="margin:0;background:#fff;font-family:Helvetica,Arial,sans-serif"><div id="f" style="display:grid;grid-template-columns:repeat(5,1fr);gap:14px;padding:16px;width:1500px;box-sizing:border-box">${L.map(([n, t, f, p]) => `
  <div style="border:1px solid #eadfe3;border-radius:16px;overflow:hidden;background:#fff">
    <img src="${img(f)}" style="width:100%;height:150px;object-fit:cover;display:block">
    <div style="background:#e5386d;color:#fff;padding:9px 12px"><div style="font-weight:700;font-size:19px">${n}</div><div style="font-size:13px;opacity:.9">${t}</div></div>
    <div style="padding:8px 12px 12px">${p.map(([a, b]) => `<div style="display:flex;justify-content:space-between;gap:8px;font-size:14px;padding:6px 0;border-bottom:1px solid #f4e9ed;color:#1c1511"><span>${a}</span><b>$${b}</b></div>`).join("")}</div>
  </div>`).join("")}</div></body></html>`;
  const b = await chromium.launch();
  const pg = await b.newPage({ deviceScaleFactor: 2, viewport: { width: 1500, height: 600 } });
  await pg.setContent(html);
  await (await pg.$("#f")).screenshot({ path: path.join(R, "menus_locales.png") });
  await b.close();
})();
