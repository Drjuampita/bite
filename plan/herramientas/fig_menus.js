// Figura de menús por local, con fotos ilustrativas de licencia abierta (créditos en app/public/menu/CREDITOS.md).
const { chromium } = require("playwright");
const fs = require("fs"), path = require("path");
const R = path.join(__dirname, "..", "figuras");
const L = [
  ["Starbucks", "Café, cake pops y baguettes", "starbucks", [["8 bebidas · Short", "$80"], ["Alto", "$95"], ["Grande", "$104"], ["Venti", "$120"], ["Leche deslactosada", "+$15"], ["Cake Pop", "$59"], ["3 baguettes", "$110–$129"]]],
  ["Luka Poke", "Bowls de poke", "luka", [["Spicy Tuna", "$185"], ["Spicy Salmon", "$189"], ["Kamoa Crunchy", "$185"], ["Popcorn Poke", "$179"], ["Chicken Miso · Orange Chicken", "$169"], ["Cilantro Steak", "$189"], ["Arma tu bowl", "$179"], ["Guarnición extra (5 incluidas)", "+$25"]]],
  ["Sinforosa", "Comida mexicana", "sinforosa", [["Chilaquiles", "$75"], ["Enchiladas suizas", "$85"], ["Molletes", "$55"], ["Tacos de guisado (3)", "$60"], ["Torta de milanesa", "$70"], ["Quesadillas (2)", "$50"], ["Agua fresca · Café de olla", "$25"]]],
  ["Tim Hortons", "Café y donas", "tim", [["Café Original", "$39"], ["French Vanilla", "$59"], ["Chocolate Mexicano", "$59"], ["Caramel Macchiato", "$69"], ["Iced Capp Original", "$69"], ["Timbits (10)", "$55"], ["Dona · Apple Fritter", "$25 · $39"], ["Croissant · Pizza Panini", "$69 · $79"]]],
  ["Vete a la Burger", "Hamburguesas", "burger", [["Cheeseburger sencilla", "$129"], ["Valiente", "$149"], ["Corregidora", "$189"], ["Mamalona (de la casa)", "$179"], ["Pastora", "$159"], ["Hot dog Gallardo · Padrino", "$99 · $119"], ["A la madre (alitas y papas)", "$149"], ["Papas · Pizza individual", "$59 · $119"]]],
];
const img = (n) => "data:image/jpeg;base64," + fs.readFileSync(path.join(R, "fotos", n + ".jpg")).toString("base64");
const fila = ([a, b]) => '<div style="display:flex;justify-content:space-between;gap:8px;font-size:13px;padding:5px 0;border-bottom:1px solid #f4e9ed;color:#1c1511"><span>' + a + '</span><b style="white-space:nowrap">' + b + "</b></div>";
const tarjeta = ([n, t, f, p]) =>
  '<div style="border:1px solid #eadfe3;border-radius:16px;overflow:hidden;background:#fff">' +
  '<img src="' + img(f) + '" style="width:100%;height:150px;object-fit:cover;display:block">' +
  '<div style="background:#e5386d;color:#fff;padding:9px 12px"><div style="font-weight:700;font-size:19px">' + n + '</div><div style="font-size:13px;opacity:.9">' + t + "</div></div>" +
  '<div style="padding:8px 12px 12px">' + p.map(fila).join("") + "</div></div>";
const html = '<html><body style="margin:0;background:#fff;font-family:Helvetica,Arial,sans-serif"><div id="f" style="display:grid;grid-template-columns:repeat(5,1fr);gap:14px;padding:16px;width:1560px;box-sizing:border-box;align-items:start">' + L.map(tarjeta).join("") + "</div></body></html>";
(async () => {
  const b = await chromium.launch();
  const pg = await b.newPage({ deviceScaleFactor: 2, viewport: { width: 1560, height: 700 } });
  await pg.setContent(html);
  await (await pg.$("#f")).screenshot({ path: path.join(R, "menus_locales.png") });
  await b.close();
})();
