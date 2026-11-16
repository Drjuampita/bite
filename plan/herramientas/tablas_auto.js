// Tablas del documento que se llenan solas con las cifras del modelo (salidas.json y datos.json).
module.exports = (S, D) => {
  const num = (v, d = 0) => Number(v).toLocaleString("en-US", { minimumFractionDigits: d, maximumFractionDigits: d });
  const $ = (v) => (v < 0 ? "−$" : "$") + num(Math.abs(v));
  const $2 = (v) => (v < 0 ? "−$" : "$") + num(Math.abs(v), 2);
  const pct = (v) => (Math.abs(v * 100 - Math.round(v * 100)) < 0.05 ? num(v * 100) : num(v * 100, 1)) + "%";
  const E = ["P", "E", "O"];
  const fmtDe = { "$": $, "$2": $2, "%": pct, n: (v) => num(v), n1: (v) => num(v, 1), n2: (v) => num(v, 2) };
  const T = {};
  const u = (k, f) => E.map((e) => f(S[`u_${k}_${e}`]));

  T.unitario = { cols: [3.2, 1.2, 1.2, 1.2], filas: [
    ["Concepto", "Pesimista", "Esperado", "Optimista"],
    ["**Lo que paga el alumno (IVA incluido)**", "", "", ""],
    ["Comida, a precio de mostrador", ...u("ticket", $)], ["Sobreprecio en el menú de la app", ...u("markup", $)], ["Envío", ...u("fee", $)],
    ["**Total sin BITE Pass**", ...u("total", $)],
    ["**Lo que ingresa BITE (sin IVA)**", "", "", ""],
    ["Envío", ...u("i_fee", $2)], ["Sobreprecio", ...u("i_mark", $2)],
    ["Comisión del local", ...E.map((e) => `${pct(S[`u_com_${e}`])} · ${$2(S[`u_i_com_${e}`])}`)],
    ["**Ingreso por pedido**", ...u("ing", $2)],
    ["**Lo que cuesta entregarlo**", "", "", ""],
    ["Pago al repartidor", ...u("c_rep", $2)], ["Seguridad social del repartidor", ...u("c_ss", $2)], ["Pasarela de pago", ...u("c_pas", $2)], ["Sello y etiqueta", ...u("c_sello", $2)], ["Garantías: envíos y pedidos reembolsados", ...u("c_punt", $2)],
    ["**Costo por pedido**", ...u("costo", $2)],
    ["**Margen por pedido**", ...E.map((e) => `${$2(S[`u_margen_${e}`])} (${pct(S[`u_margen_pct_${e}`])})`)],
  ] };
  T.pass = { cols: [3.2, 1.2, 1.2, 1.2], filas: [
    ["Por suscriptor, al mes", "Pesimista", "Esperado", "Optimista"],
    ["Cuota de BITE Pass (IVA incluido)", ...u("pass_precio", $)], ["Cuota sin IVA y sin pasarela", ...u("pass_neto", $2)],
    ["Pedidos al mes", ...u("ped_pass", (v) => num(v, 1))], ["Margen de cada pedido con Pass", ...u("p_margen", $2)],
    ["**Deja a BITE un suscriptor**", ...u("pass_deja", $2)], ["Deja a BITE un alumno ocasional", ...u("occ_deja", $2)],
  ] };
  T.escenarios_vars = { cols: [3.4, 1.1, 1.1, 1.1], filas: [["Variable", "Pesimista", "Esperado", "Optimista"],
    ...D.escenarios.map((x) => [x.concepto, ...E.map((e) => fmtDe[x.fmt](S[`sup_${x.clave}_${e}`]))])] };
  T.demanda = { cols: [3.4, 1.1, 1.1, 1.1], filas: [
    ["Concepto", "Pesimista", "Esperado", "Optimista"],
    ["Alumnos de licenciatura en el campus", ...E.map(() => num(S.sup_alumnos))],
    ["Adopción objetivo del año 1", ...E.map((e) => pct(S[`sup_adop1_${e}`]))],
    ["Usuarios activos en noviembre del año 1", ...E.map((e) => num(S[`${e}_users_1`]))],
    ["De ellos, con BITE Pass", ...E.map((e) => pct(S[`sup_pct_pass_${e}`]))],
    ["Pedidos al mes por usuario activo", ...u("ped_user", (v) => num(v, 2))],
    ["Pedidos por día de clase en octubre del año 1", ...E.map((e) => num(S[`${e}_oday_oct_1`]))],
    ["**Pedidos del año 1**", ...E.map((e) => num(S[`${e}_pedidos_1`]))],
    ["Pedidos del año 2", ...E.map((e) => num(S[`${e}_pedidos_2`]))], ["Pedidos del año 3", ...E.map((e) => num(S[`${e}_pedidos_3`]))],
  ] };
  const anual = (e) => [
    ["Concepto", "Año 1 (2027)", "Año 2 (2028)", "Año 3 (2029)"],
    ...[["Pedidos", "pedidos", num], ["Pedidos por día de clase", "oday", num], ["Ingresos (sin IVA)", "ing", $], ["Costos variables", "cvar", $], ["**Margen de contribución**", "mc", $],
      ["Gastos fijos", "fijos", $], ["Gastos de arranque", "arranque", $], ["**Utilidad de operación**", "ebit", $], ["ISR (30%)", "isr", $], ["**Utilidad neta**", "neta", $], ["Caja al cierre del año", "caja", $]]
      .map(([t, k, f]) => [t, ...[1, 2, 3].map((y) => f(S[`${e}_${k}_${y}`]))]),
  ];
  T.resultados_P = { cols: [3, 1.3, 1.3, 1.3], filas: anual("P") };
  T.resultados_E = { cols: [3, 1.3, 1.3, 1.3], filas: anual("E") };
  T.resultados_O = { cols: [3, 1.3, 1.3, 1.3], filas: anual("O") };
  T.comparativo = { cols: [2.6, 1.15, 1.15, 1.15], filas: [
    ["Resultado en tres años", "Pesimista", "Esperado", "Optimista"],
    ["Pedidos acumulados", ...E.map((e) => num(S[`${e}_pedidos_1`] + S[`${e}_pedidos_2`] + S[`${e}_pedidos_3`]))],
    ["Ingresos acumulados", ...E.map((e) => $(S[`${e}_ing_1`] + S[`${e}_ing_2`] + S[`${e}_ing_3`]))],
    ["Utilidad neta del año 1", ...E.map((e) => $(S[`${e}_neta_1`]))], ["Utilidad neta del año 2", ...E.map((e) => $(S[`${e}_neta_2`]))], ["Utilidad neta del año 3", ...E.map((e) => $(S[`${e}_neta_3`]))],
    ["**Utilidad neta acumulada**", ...E.map((e) => $(S[`${e}_neta_acum`]))],
    ["Caja más baja en 36 meses", ...E.map((e) => $(S[`${e}_caja_min`]))],
    ["Caja al cierre del año 3", ...E.map((e) => $(S[`${e}_caja_3`]))],
    ["Mes en que se recupera el capital", ...E.map((e) => (typeof S[`${e}_payback`] === "number" ? `Mes ${S[`${e}_payback`]}` : "No en 36 meses"))],
  ] };
  const MES = ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"];
  const mm = (k, f) => MES.map((_, j) => f(S[`m_E_${k}_${j + 1}`]));
  const miles = (v) => (Math.abs(v) < 50 ? "0" : (v < 0 ? "−" : "") + num(Math.abs(v) / 1000, 1));
  T.mensual_E = { size: 14, cols: [2.3, ...Array(12).fill(1)], filas: [
    ["Año 1, esperado", ...MES],
    ["Usuarios activos", ...mm("users", num)], ["Pedidos", ...mm("ord", num)], ["Pedidos por día", ...mm("oday", num)],
    ["Ingresos", ...mm("ing", miles)], ["Margen", ...mm("mc", miles)], ["Gastos fijos", ...mm("fijos", miles)],
    ["**Utilidad de operación**", ...mm("ebit", miles)], ["Caja al cierre", ...mm("caja", miles)],
  ] };
  T.fijos = { size: 17, cols: [2.6, 0.9, 0.7, 1, 0.9, 3.4], filas: [
    ["Concepto", "Al mes", "Meses", "Al año", "Nivel", "Fuente o razonamiento"],
    ...D.fijos.map((x, i) => [x.concepto, $(S[`fijo_${i}_mes`]), String(x.meses), $(S[`fijo_${i}_ano`]), x.nivel, x.nota]),
    ["**Total**", $(S.fijos_mes), "", $(S.fijos_ano), "", `En un mes sin clases se pagan ${$(S.fijos_mes_sin)}.`],
  ] };
  T.inversion = { size: 17, cols: [3, 1, 4], filas: [
    ["Concepto", "Monto", "Fuente o razonamiento"],
    ...D.arranque.map((x) => [x.concepto, $(x.monto), x.nota]),
    ["**Gastos de arranque**", $(S.arranque), "Se pagan una sola vez, antes de abrir."],
    ["Reserva de capital de trabajo", $(S.reserva), `Queda en caja el día de la apertura. Cubre ${num(S.reserva_meses, 1)} meses de gastos fijos.`],
    ["**Inversión inicial total**", $(S.capital), "Igual al capital que aportan los socios."],
  ] };
  const socios = ["Silvana Rubio Reyes", "Natalia Orozco Estrada", "Diego Rodríguez Sáenz", "Emmanuel Alexander Quintana Tirado", "Juan Pablo Palma Redondo"];
  T.origen = { cols: [3, 1.3, 1.2], filas: [["Socio", "Aportación en efectivo", "Participación"],
    ...socios.map((n) => [n, $(S.aporte_socio), pct(1 / socios.length)]), ["**Total**", $(S.capital), "100%"]] };
  const e = (k, f) => E.map((x) => f(S[`e_${k}_${x}`]));
  T.equilibrio = { cols: [3.6, 1.1, 1.1, 1.1], filas: [
    ["Concepto", "Pesimista", "Esperado", "Optimista"],
    ["Margen al mes por usuario activo", ...e("contrib", $2)], ["Pedidos al mes por usuario activo", ...e("ped_user", (v) => num(v, 2))],
    ["Gastos fijos de un año", ...e("fijos", $)],
    ["Usuarios activos de equilibrio", ...e("be_users", num)], ["Adopción de equilibrio", ...e("be_adop", (v) => num(v * 100, 1) + "%")],
    ["**Pedidos por día de equilibrio**", ...e("be_oday", num)],
    ["Gastos fijos de un año, con coordinador", ...e("fijos2", $)],
    ["Adopción de equilibrio, con coordinador", ...e("be2_adop", (v) => num(v * 100, 1) + "%")],
    ["**Pedidos por día de equilibrio, con coordinador**", ...e("be2_oday", num)],
    ["Pedidos por día proyectados en el año 2", ...e("oday2", num)],
    ["Holgura frente al equilibrio con coordinador", ...E.map((x) => (S[`e_holgura_${x}`] < 0 ? "No lo alcanza" : pct(S[`e_holgura_${x}`])))],
  ] };
  T.sensibilidad = { cols: [3.6, 1.4, 1.4], filas: [["Caso", "Utilidad de operación", "Cambio contra la base"],
    ...S._sens_nombres.map((n, i) => [i === 0 ? `**${n}**` : n, $(S[`sens_${i}`]), i === 0 ? "" : (S[`sens_d_${i}`] > 0 ? "+" : "") + $(S[`sens_d_${i}`])])] };
  const x = (k, f) => [1, 2, 3, 4, 5].map((y) => f(S[`x_${k}_${y}`]));
  T.expansion = { size: 17, cols: [3, 1, 1, 1, 1, 1], filas: [
    ["Concepto", "Año 1", "Año 2", "Año 3", "Año 4", "Año 5"],
    ["Campus propios en operación", ...x("n_prop", num)], ["Campus franquiciados en operación", ...x("n_fq", num)], ["**Campus en la red**", ...x("n_total", num)],
    ["Pedidos de toda la red", ...x("ped_red", num)], ["Pedidos acumulados", ...x("ped_acum", num)],
    ["Venta de comida generada a los locales", ...x("gmv_red", $)],
    ["Ingresos de campus propios", ...x("ing_prop", $)], ["Cuotas iniciales de franquicia", ...x("ing_cuotas", $)], ["Regalías", ...x("ing_regalias", $)],
    ["**Ingresos de BITE**", ...x("ing_bite", $)], ["Ingresos acumulados", ...x("ing_acum", $)],
    ["Resultado de operación de campus propios", ...x("op_prop", $)], ["Gastos de apertura", ...x("apertura", $)], ["Soporte a franquiciatarios", ...x("soporte", $)],
    ["Sueldos de socios de tiempo completo", ...x("central", $)],
    ["**Utilidad de operación**", ...x("ebit", $)], ["ISR", ...x("isr", $)], ["**Utilidad neta**", ...x("neta", $)], ["Utilidad neta acumulada", ...x("neta_acum", $)],
    ["Caja al cierre del año", ...x("caja", $)],
  ] };
  const fq = (k, f = $) => [1, 2, 3].map((y) => f(S[`fq_${k}_${y}`]));
  T.franquicia_unidad = { cols: [3.4, 1.2, 1.2, 1.2], filas: [
    ["Una unidad franquiciada", "Año 1", "Año 2", "Año 3"],
    ["Ingresos de la unidad (sin IVA)", ...fq("ing")], ["Costos variables", ...fq("cvar")], ["Margen de contribución", ...fq("mc")],
    [`Regalía a BITE (${pct(S.sup_fq_regalia)})`, ...fq("regalia")], [`Fondo de publicidad (${pct(S.sup_fq_fondo)})`, ...fq("fondo")], ["Gastos fijos de la unidad", ...fq("fijos")],
    ["**Utilidad del franquiciatario antes de impuestos**", ...fq("util")], ["Utilidad acumulada", ...fq("acum")],
    ["BITE recibe: cuota inicial", $(S.sup_fq_cuota), "$0", "$0"], ["BITE recibe: regalía", ...fq("regalia")],
    ["BITE gasta: soporte a la unidad", ...[1, 2, 3].map(() => "−" + $(S.sup_fq_soporte))],
    ["**Lo que le queda a BITE de la unidad**", ...fq("bite")],
  ] };
  T.franquicia_inversion = { cols: [3.4, 1.4], filas: [
    ["Inversión del franquiciatario", "Monto"],
    ["Cuota inicial de franquicia", $(S.sup_fq_cuota)], ["Equipo de reparto, tabletas e identidad", $(S.sup_fq_equipo)],
    ["Publicidad de lanzamiento", $(S.sup_fq_lanzamiento)], ["Capital de trabajo", $(S.sup_fq_capital_trabajo)],
    ["**Inversión total**", $(S.fq_inv)], ["Meses para recuperarla", num(S.fq_payback)],
  ] };
  const fp = { "$": $, "$2": $2, "%": pct, n: (z) => num(z), n1: (z) => num(z, 1) };
  T.pruebas = { size: 17, cols: [4.2, 1.1, 1.1, 1.1], filas: [["Prueba", "Valor", "Límite", "Resultado"],
    ...S._pruebas.map(([n, fv, fl], i) => (i === S._pruebas.length - 1 ? [n, pct(S[`prueba_v_${i + 1}`]), "Encuesta", S[`prueba_${i + 1}`]]
      : [n, fp[fv](S[`prueba_v_${i + 1}`]), fp[fl](S[`prueba_l_${i + 1}`]), S[`prueba_${i + 1}`]]))] };
  const fv = (it) => { const v = S[`sup_${it.clave}`]; const t = it.fmt in fmtDe ? fmtDe[it.fmt](v) : String(v); return ["$", "%", "veces"].includes(it.unidad) || it.fmt.startsWith("$") ? t : `${t} ${it.unidad}`; };
  T.supuestos = { size: 16, cols: [2.7, 0.9, 1, 4.2], filas: [["Concepto", "Valor", "Tipo", "Fuente o razonamiento"],
    ...D.generales.flatMap((b) => [[`**${b.bloque}**`, "", "", ""], ...b.items.map((it) => [it.concepto, fv(it), it.tipo, it.nota])])] };
  T.supuestos_esc = { size: 16, cols: [2.7, 0.8, 0.8, 0.8, 3.7], filas: [["Variable de escenario", "Pesimista", "Esperado", "Optimista", "Razonamiento"],
    ...D.escenarios.map((it) => [it.concepto, ...E.map((k) => fmtDe[it.fmt](S[`sup_${it.clave}_${k}`])), it.nota])] };
  T.calendario = { size: 17, cols: [1.3, ...Array(12).fill(1)], filas: [["Mes", ...MES],
    ["Días de clase", ...D.calendario.map((c) => String(c.dias))], ["Arranque del año 1", ...D.calendario.map((c) => (c.dias ? pct(c.arranque) : "–"))]] };
  const todas = [...D.encuesta.slice(0, 4), { ...D.abierta, opciones: ["Respuesta abierta"] }, ...D.encuesta.slice(4)];
  T.encuesta = { size: 16, cols: [0.4, 3, 2.8, 2.6], filas: [["#", "Pregunta", "Respuestas", "Para qué sirve esta información"],
    ...todas.map((q) => [q.num, q.texto, q.opciones.join(" · "), q.uso])] };
  T.encuesta_resultados = { size: 17, cols: [3.4, 1.3, 1.3, 1.3], filas: [
    ["Indicador", "Resultado (simulación)", "Supuesto del modelo", "Punto de equilibrio"],
    ["Respuestas válidas", "300", num(S.sup_meta_encuestas), "–"],
    ["Adopción implícita (pregunta 6, con descuento)", "8.2%", pct(S.sup_adop1_E), num(S.e_be_adop_E * 100, 1) + "%"],
    ["Pedidos al mes de quien sí lo usaría (pregunta 7)", "4.1", num(S.u_ped_user_E, 2), "–"],
    ["Gasto habitual por comida (pregunta 10)", "$118", $(S.sup_ticket), "–"],
    ["Dispuestos a pagar $20 o más de envío (pregunta 11)", "38%", pct(S.sup_adop1_E), num(S.e_be_adop_E * 100, 1) + "%"],
    ["Suscriptores implícitos de BITE Pass (pregunta 12)", "1.4%", num(S.sup_adop1_E * S.sup_pct_pass_E * 100, 2) + "%", "–"],
  ] };
  return T;
};
