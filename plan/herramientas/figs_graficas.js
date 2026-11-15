// Gráficas del modelo financiero y de tendencias. Los datos del modelo salen de salidas.json.
const { C, W, esc, num, money, kmoney, lineChart, colChart, barH, segBar } = require("./figuras_lib");

module.exports = (S) => {
  const figs = [];
  const ESC = [["P", "Pesimista", C.s1], ["E", "Esperado", C.s2], ["O", "Optimista", C.s3]];
  const MES = ["ene", "feb", "mar", "abr", "may", "jun", "jul", "ago", "sep", "oct", "nov", "dic"];
  const meses = Array.from({ length: 36 }, (_, j) => `${MES[j % 12]} ${27 + Math.floor(j / 12)}`);
  const serie = (k, clave) => Array.from({ length: 36 }, (_, j) => S[`m_${k}_${clave}_${j + 1}`]);
  const signo = (v) => (v > 0 ? "+" : "") + kmoney(v);
  const caption = (t) => `<div style="font-size:12px;color:${C.muted};margin-top:4px">${t}</div>`;

  figs.push({
    name: "fin_pedidos",
    html: lineChart({ h: 330, x: meses, xEvery: 4, right: 140, yfmt: (v) => num(v),
      series: ESC.map(([k, n, c]) => ({ name: n, color: c, values: serie(k, "oday").map((v) => (v > 0 ? v : null)) })) })
      + caption("Pedidos por día de clase. La línea se corta en los meses sin clases: mayo cierra el 7, junio y julio son vacaciones y verano, diciembre son exámenes."),
  });
  figs.push({
    name: "fin_caja",
    html: lineChart({ h: 330, x: meses, xEvery: 4, right: 150, left: 70, yfmt: (v) => kmoney(v),
      refLines: [{ v: S.capital, name: "Capital aportado" }],
      series: ESC.map(([k, n, c]) => ({ name: n, color: c, values: serie(k, "caja") })) }),
  });
  // Punto de equilibrio
  const qs = S._curva;
  const margen = qs.map((q) => S[`curva_margen_${q}`]);
  const fij1 = S.fijos_ano, fij2 = S.fijos_ano + S.coord_ano;
  const be1 = S.e_be_oday_E, be2 = S.e_be2_oday_E, proy = S.e_oday2_E;
  const mProy = (proy / 10) * (margen[1] - margen[0]);
  figs.push({
    name: "fin_equilibrio",
    html: lineChart({ h: 350, x: qs.map(String), xEvery: 1, right: 222, left: 70, yfmt: (v) => kmoney(v),
      series: [
        { name: "Margen del año", color: C.s2, values: margen },
        { name: "Fijos base", color: C.s1, values: qs.map(() => fij1) },
        { name: "Fijos con coordinador", color: C.s3, values: qs.map(() => fij2) },
      ],
      extra: (X, Y) => {
        const dot = (q, v, t1, t2, dx, dy, anchor = "start") => `<circle cx="${X(q / 10)}" cy="${Y(v)}" r="6" fill="${C.ink}" stroke="#fff" stroke-width="2"/>
          <text x="${X(q / 10) + dx}" y="${Y(v) + dy}" font-size="12.5" font-weight="700" fill="${C.ink}" text-anchor="${anchor}">${t1}</text>
          <text x="${X(q / 10) + dx}" y="${Y(v) + dy + 15}" font-size="11.5" fill="${C.muted}" text-anchor="${anchor}">${t2}</text>`;
        return dot(be1, fij1, `${num(be1)} pedidos al día`, "equilibrio", 10, 22)
          + dot(be2, fij2, `${num(be2)} pedidos al día`, "equilibrio con coordinador", -12, -24, "end")
          + dot(proy, mProy, `${num(proy)} pedidos al día`, "proyectado, año 2", -12, -22, "end");
      } })
      + caption("Eje horizontal: pedidos por día de clase. Escenario esperado, año completo de 155 días de clase."),
  });
  figs.push({
    name: "fin_escenarios",
    html: colChart({ h: 330, x: ["Año 1 (2027)", "Año 2 (2028)", "Año 3 (2029)"], left: 70, barW: 24, gap: 34, yfmt: (v) => kmoney(v),
      series: ESC.map(([k, n, c]) => ({ name: n, color: c, values: [1, 2, 3].map((y) => S[`${k}_neta_${y}`]) })) }),
  });
  const sens = S._sens_nombres.map((n, i) => ({ name: n, v: S[`sens_d_${i}`] })).slice(1).sort((a, b) => b.v - a.v);
  figs.push({ name: "fin_sensibilidad", html: barH({ rows: sens, fmt: signo, labelW: 300, rowH: 27 }) + caption(`Cambio en la utilidad de operación de un año completo frente a la base de ${money(S.sens_0)} (escenario esperado, ritmo del año 2).`) });
  figs.push({
    name: "fin_unitario",
    html: `<div style="font-size:13px;color:${C.muted};margin:0 0 4px 20px">De los ${money(S.u_ing_E, 2)} que ingresa BITE por un pedido sin Pass</div>` + segBar({ parts: [
      { name: "Repartidor y su seguridad social", v: S.u_c_rep_E + S.u_c_ss_E, color: C.s1 },
      { name: "Pasarela de pago", v: S.u_c_pas_E, color: C.s2 },
      { name: "Sello, etiqueta y garantía de puntualidad", v: S.u_c_sello_E + S.u_c_punt_E, color: C.s3 },
      { name: "Margen de BITE", v: S.u_margen_E, color: "#eda100", dark: true },
    ] }),
  });
  const anos = [1, 2, 3, 4, 5].map((y) => `Año ${y} (${2026 + y})`);
  figs.push({
    name: "fin_exp_campus",
    html: colChart({ h: 280, x: anos, left: 40, barW: 24, yfmt: (v) => num(v),
      series: [{ name: "Campus propios", color: C.s1, values: [1, 2, 3, 4, 5].map((y) => S[`x_n_prop_${y}`]) }, { name: "Campus franquiciados", color: C.s2, values: [1, 2, 3, 4, 5].map((y) => S[`x_n_fq_${y}`]) }] }),
  });
  figs.push({
    name: "fin_exp_resultado",
    html: colChart({ h: 330, x: anos, left: 70, barW: 24, gap: 32, nTicks: 6, yfmt: (v) => kmoney(v),
      series: [{ name: "Ingresos de BITE", color: C.s1, values: [1, 2, 3, 4, 5].map((y) => S[`x_ing_bite_${y}`]) }, { name: "Utilidad neta", color: C.s2, values: [1, 2, 3, 4, 5].map((y) => S[`x_neta_${y}`]) }] }),
  });

  // ── Tendencias (datos de terceros, con fuente en el documento) ──
  figs.push({
    name: "tend_compradores",
    html: colChart({ h: 290, x: ["2018", "2019", "2020", "2021", "2022", "2023", "2024", "2025 (est.)"], left: 44, barW: 24, yfmt: (v) => num(v), labelfmt: (v) => num(v, 1),
      series: [{ name: "Compradores digitales", color: C.s1, values: [37.0, 51.3, 55.6, 57.8, 63.3, 65.9, 72.5, 77.2] }] }),
  });
  figs.push({
    name: "tend_ecommerce",
    html: colChart({ h: 290, x: ["2021", "2022", "2023", "2024", "2025"], left: 50, barW: 24, yfmt: (v) => "$" + num(v),
      series: [{ name: "Valor", color: C.s1, values: [429, 528, 658, 790, 941] }] }),
  });
  figs.push({
    name: "tend_pagos",
    html: colChart({ h: 290, x: ["Efectivo", "Tarjeta", "Transferencia o app"], left: 50, barW: 24, gap: 26, yfmt: (v) => num(v) + "%", labelfmt: (v) => num(v, 1) + "%",
      series: [{ name: "2021", color: C.s1, values: [90.1, 7.4, 1.6] }, { name: "2024", color: C.s2, values: [85.2, 10.4, 4.4] }] }),
  });
  const tile = (v, t, f) => `<div style="flex:1;border:1px solid ${C.line};border-radius:14px;padding:14px;background:#fff"><div style="font-size:30px;font-weight:800;letter-spacing:-0.02em;color:${C.ink}">${v}</div><div style="font-size:12.5px;line-height:1.3;margin-top:4px">${t}</div><div style="font-size:11px;color:${C.muted};margin-top:6px">${f}</div></div>`;
  figs.push({
    name: "tend_tiles",
    html: `<div style="display:flex;gap:10px">
      ${tile("97.6%", "de los jóvenes de 15 a 24 años usa internet en México", "INEGI, ENDUTIH 2025")}
      ${tile("50%", "de los universitarios omite alguna comida principal mientras está en la universidad", "Martínez-Hernández et al., 2021, n = 300")}
      ${tile("450+", "campus de Estados Unidos con pedidos por app de un solo proveedor en 2026; eran 300 en 2023", "Grubhub Campus, vía Restaurant Dive")}
      ${tile("≈10%", "de los alumnos de CETYS Tijuana se suscribió a una app para pedir y recoger en su cafetería", "CETYS Universidad, 2019")}</div>`,
  });
  return figs;
};
