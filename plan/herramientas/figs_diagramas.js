// Diagramas: procesos, organigrama, cuadro sinóptico, línea de tiempo, esquema del campus, canvas.
const { C, W, esc, flow, wrap } = require("./figuras_lib");

module.exports = (S) => {
  const figs = [];
  const chip = (t, o = {}) => `<div style="flex:1;border:1px solid ${o.border || C.line};background:${o.bg || C.white};color:${o.color || C.ink};border-radius:12px;padding:10px 10px;font-size:12.5px;line-height:1.3;${o.bold ? "font-weight:700;" : ""}text-align:center;display:flex;align-items:center;justify-content:center;min-height:62px">${t}</div>`;
  const arrow = `<div style="color:${C.gris};font-size:18px;display:flex;align-items:center">→</div>`;

  // ── Tipo de empresa (cuadro sinóptico) ──
  const filas = [
    ["Por su actividad", "De servicios", "Intermediación y entrega de alimentos por medio de una app"],
    ["Por su sector", "Terciario", "No produce ni transforma: conecta, cobra y entrega"],
    ["Por su tamaño", "Microempresa", "Hasta 10 trabajadores y ventas de hasta $4 millones al año (Secretaría de Economía, DOF 30-jun-2009)"],
    ["Por el origen del capital", "Privado", "Lo aportan los cinco socios en partes iguales"],
    ["Por su figura jurídica", "S.A.S.", "Sociedad por Acciones Simplificada; pasa a S.A.P.I. de C.V. al abrir franquicias"],
    ["Por su régimen fiscal", "RESICO personas morales", "Socios personas físicas e ingresos menores a $35 millones al año"],
    ["Por su alcance", "Local, con plan regional", "Un campus en el año 1; diez campus en el año 5"],
    ["Por su finalidad", "Lucrativa", "Reparte utilidades entre sus socios"],
  ];
  const rowH = 50, hh = filas.length * rowH;
  figs.push({
    name: "sinoptico",
    html: `<div style="display:flex;align-items:center">
      <div style="width:132px;height:120px;background:${C.brand};color:#fff;border-radius:16px;display:flex;flex-direction:column;align-items:center;justify-content:center">
        <div style="font-size:26px;font-weight:800;letter-spacing:-0.03em">bite</div><div style="font-size:10.5px;font-weight:600;text-align:center;line-height:1.25;margin-top:4px">Servicios de<br>Entrega, S.A.S.</div></div>
      <svg width="44" height="${hh}" viewBox="0 0 44 ${hh}"><path d="M40,6 C20,6 26,${hh / 2 - 10} 6,${hh / 2} C26,${hh / 2 + 10} 20,${hh - 6} 40,${hh - 6}" fill="none" stroke="${C.brand}" stroke-width="2.5" stroke-linecap="round"/></svg>
      <div style="flex:1">${filas.map(([a, b, c]) => `<div style="height:${rowH}px;display:flex;align-items:center;gap:10px;border-bottom:1px solid ${C.line}">
        <div style="width:150px;font-size:12px;color:${C.muted}">${a}</div>
        <div style="width:158px;font-size:13.5px;font-weight:700">${b}</div>
        <div style="flex:1;font-size:12px;color:${C.muted};line-height:1.3">${c}</div></div>`).join("")}</div></div>`,
  });

  // ── El receso, con y sin BITE ──
  figs.push({
    name: "dia_alumno",
    html: `<div style="display:grid;gap:14px">
      <div><div style="font-size:13px;font-weight:700;color:${C.muted};margin-bottom:6px">Sin BITE: el receso se va en conseguir la comida</div>
        <div style="display:flex;gap:6px">${["Sales del salón", "Caminas al área de comida", "Haces fila para pedir", "Esperas a que lo preparen", "Comes de prisa o llegas tarde"].map((t, i, a) => chip(t, { bg: C.canvas }) + (i < a.length - 1 ? arrow : "")).join("")}</div></div>
      <div><div style="font-size:13px;font-weight:700;color:${C.brand7};margin-bottom:6px">Con BITE: la comida te espera en la puerta de tu salón</div>
        <div style="display:flex;gap:6px">${[["Pides en un minuto, hoy o desde ayer", 0], ["Sigues en lo tuyo: clase, tarea o entrenamiento", 0], ["Llega a tu salón en los 15 minutos antes de tu clase", 1], ["Empieza la clase y ya comiste", 0]].map(([t, b], i, a) => chip(t, b ? { bg: C.brand, color: "#fff", border: C.brand, bold: true } : { bg: C.b50, border: C.b200 }) + (i < a.length - 1 ? arrow : "")).join("")}</div></div></div>`,
  });

  // ── Línea de tiempo de un pedido agendado ──
  const pts = [
    ["Hasta las 21:00 del día anterior", "Agendas tu pedido para tu clase de 9:00", 0],
    ["8:00", "El pedido entra a la cocina del local (60 minutos antes)", 0],
    ["8:30", "Listo, sellado y con la etiqueta de tu salón", 0],
    ["8:35", "El repartidor recoge los pedidos de tu edificio", 0],
    ["8:45 a 9:00", "Entrega en la puerta de tu salón, con tu código", 1],
    ["9:00", "Empieza tu clase", 0],
  ];
  const TY = 66, TM = 78;
  let tl = `<line x1="${TM}" y1="${TY}" x2="${W - TM}" y2="${TY}" stroke="${C.b200}" stroke-width="4" stroke-linecap="round"/>`;
  pts.forEach(([h, t, hot], i) => {
    const x = TM + (i * (W - 2 * TM)) / (pts.length - 1);
    tl += `<circle cx="${x}" cy="${TY}" r="${hot ? 11 : 8}" fill="${hot ? C.brand : C.white}" stroke="${C.brand}" stroke-width="3"/>`;
    wrap(h, 15).forEach((ln, k, arr) => { tl += `<text x="${x}" y="${TY - 22 - (arr.length - 1 - k) * 14}" font-size="12.5" font-weight="700" fill="${C.ink}" text-anchor="middle">${esc(ln)}</text>`; });
    wrap(t, 19).forEach((ln, k) => { tl += `<text x="${x}" y="${TY + 30 + k * 14}" font-size="11.5" fill="${hot ? C.brand7 : C.muted}" text-anchor="middle"${hot ? ' font-weight="700"' : ""}>${esc(ln)}</text>`; });
  });
  figs.push({ name: "linea_bloque", html: `<svg width="${W}" height="158" viewBox="0 0 ${W} 158">${tl}</svg>` });

  // ── Estados del pedido ──
  const est = ["Programado", "Recibido", "Preparando", "Listo", "En camino", "Entregado"];
  let es = `<defs><marker id="a2" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0,0L10,5L0,10z" fill="${C.ink}"/></marker></defs>`;
  const bw = 104, EX = 14, gap = (W - 2 * EX - est.length * bw) / (est.length - 1);
  est.forEach((e, i) => {
    const x = EX + i * (bw + gap), last = i === est.length - 1;
    es += `<rect x="${x}" y="10" width="${bw}" height="38" rx="19" fill="${last ? C.ink : i === 0 ? C.white : C.b50}" stroke="${last ? C.ink : i === 0 ? C.gris : C.brand}" stroke-width="1.4"${i === 0 ? ' stroke-dasharray="4 3"' : ""}/>`;
    es += `<text x="${x + bw / 2}" y="34" font-size="12.5" font-weight="700" fill="${last ? C.white : C.ink}" text-anchor="middle">${e}</text>`;
    if (!last) es += `<line x1="${x + bw + 3}" y1="29" x2="${x + bw + gap - 4}" y2="29" stroke="${C.ink}" stroke-width="1.4" marker-end="url(#a2)"/>`;
  });
  const who = ["solo agendados", "App", "Local", "Local", "Repartidor", "Con el código"];
  est.forEach((e, i) => { es += `<text x="${EX + i * (bw + gap) + bw / 2}" y="64" font-size="11" fill="${C.muted}" text-anchor="middle">${who[i]}</text>`; });
  const cx0 = EX + bw / 2, cx1 = EX + bw + gap + bw / 2, cxc = (cx0 + cx1) / 2;
  es += `<path d="M${cx0},74V92H${cxc - 52}" fill="none" stroke="${C.gris}" stroke-width="1.3"/><path d="M${cx1},74V92H${cxc + 52}" fill="none" stroke="${C.gris}" stroke-width="1.3"/>`;
  es += `<rect x="${cxc - 52}" y="76" width="104" height="32" rx="16" fill="${C.white}" stroke="${C.gris}" stroke-width="1.3"/><text x="${cxc}" y="96.5" font-size="12.5" font-weight="700" fill="${C.muted}" text-anchor="middle">Cancelado</text>`;
  es += `<text x="${cx1 + 18}" y="96.5" font-size="11.5" fill="${C.muted}">El alumno puede cancelar, con reembolso completo, mientras el local no empiece a preparar.</text>`;
  figs.push({ name: "estados", html: `<svg width="${W}" height="116" viewBox="0 0 ${W} 116">${es}</svg>` });

  // ── Flujos ──
  figs.push({
    name: "flujo_pedido",
    html: flow({
      lanes: ["Alumno", "App BITE", "Local", "Repartidor"],
      nodes: [
        { id: "a1", lane: 0, row: 0, kind: "start", text: "Elige local, productos, salón y la hora de su clase" },
        { id: "b1", lane: 1, row: 0, text: "Revisa horario del local, cupo de esa hora y precios del catálogo" },
        { id: "d1", lane: 1, row: 1, kind: "decision", text: "¿Hay cupo y el pago pasa?" },
        { id: "a2", lane: 0, row: 1, text: "Elige otra hora o reintenta el pago" },
        { id: "b2", lane: 1, row: 2, text: "Confirma, cobra y genera el código de entrega" },
        { id: "l1", lane: 2, row: 3, text: "Recibe el pedido en su panel 60 minutos antes de la clase" },
        { id: "l2", lane: 2, row: 4, text: "Prepara, sella la bolsa, pega la etiqueta y marca «Listo»" },
        { id: "r1", lane: 3, row: 5, text: "Recoge los pedidos de su edificio y marca «En camino»" },
        { id: "r2", lane: 3, row: 6, text: "Llega a la puerta del salón y pide el código" },
        { id: "a3", lane: 0, row: 6, text: "Dicta su código de 4 dígitos y recibe su comida" },
        { id: "b3", lane: 1, row: 7, kind: "end", text: "Marca «Entregado» y pide la calificación" },
      ],
      edges: [["a1", "b1"], ["b1", "d1"], ["d1", "a2", "No"], ["a2", "a1"], ["d1", "b2", "Sí"], ["b2", "l1"], ["l1", "l2"], ["l2", "r1"], ["r1", "r2"], ["r2", "a3"], ["a3", "b3", "", "vh"]],
    }),
  });
  figs.push({
    name: "flujo_admin",
    html: flow({
      lanes: ["App BITE", "Administración", "Contador externo", "Local afiliado"],
      nodes: [
        { id: "s", lane: 0, row: 0, kind: "start", text: "Registra cada pedido entregado con su cobro" },
        { id: "a1", lane: 1, row: 1, text: "Lunes: descarga el corte semanal de pedidos, cobros, cortesías y reembolsos" },
        { id: "a2", lane: 1, row: 2, text: "Concilia el corte contra los depósitos de la pasarela de pago" },
        { id: "d", lane: 1, row: 3, kind: "decision", text: "¿Cuadra al peso?" },
        { id: "a3", lane: 0, row: 3, text: "Se revisan los pedidos con diferencia y se corrigen" },
        { id: "a4", lane: 1, row: 4, text: "Calcula lo de cada local: ventas menos comisión, IVA y retenciones" },
        { id: "a5", lane: 1, row: 5, text: "Transfiere a cada local y envía su estado de cuenta" },
        { id: "l1", lane: 3, row: 5, text: "Recibe su pago semanal y su reporte de ventas" },
        { id: "c1", lane: 2, row: 6, text: "Timbra las facturas, registra gastos y calcula los impuestos del mes" },
        { id: "e", lane: 1, row: 7, kind: "end", text: "Archiva el concentrado semanal de ingresos y gastos" },
      ],
      edges: [["s", "a1", "", "vh"], ["a1", "a2"], ["a2", "d"], ["d", "a3", "No"], ["a3", "a2", "", "vh"], ["d", "a4", "Sí"], ["a4", "a5"], ["a5", "l1"], ["a5", "c1", "", "vh"], ["c1", "e", "", "vh"]],
    }),
  });
  figs.push({
    name: "flujo_compras",
    html: flow({
      lanes: ["Operaciones", "Administración", "Proveedor"],
      nodes: [
        { id: "s", lane: 0, row: 0, kind: "start", text: "Detecta la necesidad: existencias bajo el mínimo o equipo dañado" },
        { id: "o1", lane: 0, row: 1, text: "Llena la requisición con cantidad y especificación" },
        { id: "a1", lane: 1, row: 1, text: "Pide tres cotizaciones a proveedores del padrón" },
        { id: "a2", lane: 1, row: 2, text: "Compara precio, calidad, tiempo de entrega y factura" },
        { id: "d", lane: 1, row: 3, kind: "decision", text: "¿Cumple y cabe en el presupuesto?" },
        { id: "o2", lane: 0, row: 3, text: "Ajusta la requisición o propone otro proveedor" },
        { id: "a3", lane: 1, row: 4, text: "Emite la orden de compra con folio" },
        { id: "p1", lane: 2, row: 4, text: "Surte el pedido y entrega con factura" },
        { id: "o3", lane: 0, row: 5, text: "Recibe, revisa contra la orden y da entrada al inventario" },
        { id: "a4", lane: 1, row: 6, kind: "end", text: "Paga la factura y archiva orden, factura y entrada" },
      ],
      edges: [["s", "o1"], ["o1", "a1"], ["a1", "a2"], ["a2", "d"], ["d", "o2", "No"], ["o2", "o1"], ["d", "a3", "Sí"], ["a3", "p1"], ["p1", "o3", "", "vh"], ["o3", "a4", "", "vh"]],
    }),
  });
  figs.push({
    name: "flujo_reclutamiento",
    html: flow({
      lanes: ["Coordinación", "Candidato", "Administración"],
      nodes: [
        { id: "s", lane: 0, row: 0, kind: "start", text: "Abre la convocatoria de repartidores cada semestre" },
        { id: "c1", lane: 1, row: 0, text: "Se registra con su correo institucional y su horario de clases" },
        { id: "k1", lane: 0, row: 1, text: "Revisa mayoría de edad, inscripción vigente y bloques libres" },
        { id: "d", lane: 0, row: 2, kind: "decision", text: "¿Cumple el perfil?" },
        { id: "c2", lane: 1, row: 2, text: "Recibe respuesta y queda en lista de espera" },
        { id: "k2", lane: 0, row: 3, text: "Entrevista breve y recorrido de prueba con un repartidor" },
        { id: "k3", lane: 0, row: 4, text: "Capacitación de 3 horas: app, higiene, trato y emergencias" },
        { id: "c3", lane: 1, row: 4, text: "Presenta la evaluación práctica" },
        { id: "a1", lane: 2, row: 5, text: "Firma de contrato, alta en el IMSS y entrega de equipo" },
        { id: "e", lane: 0, row: 6, kind: "end", text: "Entra al padrón y elige sus bloques de la semana" },
      ],
      edges: [["s", "c1"], ["c1", "k1", "", "vh"], ["k1", "d"], ["d", "c2", "No"], ["d", "k2", "Sí"], ["k2", "k3"], ["k3", "c3"], ["c3", "a1"], ["a1", "e", "", "vh"]],
    }),
  });
  figs.push({
    name: "flujo_incidencias",
    html: flow({
      lanes: ["Alumno", "Coordinación BITE", "Local o repartidor"],
      nodes: [
        { id: "s", lane: 0, row: 0, kind: "start", text: "Reporta el problema desde la pantalla de su pedido" },
        { id: "k1", lane: 1, row: 0, text: "Clasifica: no llegó, llegó tarde, incompleto o en mal estado" },
        { id: "d1", lane: 1, row: 1, kind: "decision", text: "¿Se puede resolver antes de la clase?" },
        { id: "l1", lane: 2, row: 1, text: "Repone o completa el pedido en el mismo bloque" },
        { id: "k2", lane: 1, row: 2, text: "Reembolsa a la tarjeta: completo si no llegó; el envío si llegó tarde" },
        { id: "k3", lane: 1, row: 3, text: "Registra causa y responsable en la bitácora" },
        { id: "a1", lane: 0, row: 3, text: "Recibe el aviso de solución y califica la atención" },
        { id: "l2", lane: 2, row: 4, text: "Recibe la retroalimentación; tres faltas en un mes abren revisión" },
        { id: "e", lane: 1, row: 5, kind: "end", text: "Revisión semanal de incidencias por causa" },
      ],
      edges: [["s", "k1"], ["k1", "d1"], ["d1", "l1", "Sí"], ["d1", "k2", "No"], ["l1", "k3", "", "vh"], ["k2", "k3"], ["k3", "a1"], ["k3", "l2", "", "vh"], ["k3", "e"]],
    }),
  });

  // ── Esquema operativo del campus ──
  const zonas = [
    ["Zona 1", "Edificios A y B", "2 pisos cada uno"], ["Zona 2", "Edificio C", "4 pisos"], ["Zona 3", "Edificio IDEA", "pisos por confirmar"],
    ["Zona 4", "Business & Innovation Hub", "6 pisos"], ["Punto fijo", "Polideportivo", "para quien entrena"],
  ];
  let mp = `<defs><marker id="a3" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0,0L10,5L0,10z" fill="${C.brand}"/></marker></defs>`;
  mp += `<rect x="10" y="70" width="250" height="190" rx="16" fill="${C.b50}" stroke="${C.brand}" stroke-width="1.6"/>`;
  mp += `<text x="135" y="98" font-size="14" font-weight="800" fill="${C.brand7}" text-anchor="middle">Área de comida</text><text x="135" y="116" font-size="11.5" fill="${C.muted}" text-anchor="middle">Edificio Liderazgo, planta baja</text>`;
  ["Sinforosa", "Luka", "Diego's House", "Carrusel"].forEach((l, i) => {
    const x = 26 + (i % 2) * 112, y = 132 + Math.floor(i / 2) * 44;
    mp += `<rect x="${x}" y="${y}" width="106" height="34" rx="10" fill="${C.white}" stroke="${C.b200}"/><text x="${x + 53}" y="${y + 21.5}" font-size="12" font-weight="600" fill="${C.ink}" text-anchor="middle">${esc(l)}</text>`;
  });
  mp += `<text x="135" y="240" font-size="11" fill="${C.muted}" text-anchor="middle">Punto de recolección de repartidores</text>`;
  zonas.forEach(([z, n, d], i) => {
    const y = 8 + i * 64;
    mp += `<path d="M260,165 C${360},165 ${380},${y + 26} ${468},${y + 26}" fill="none" stroke="${C.brand}" stroke-width="1.6" marker-end="url(#a3)"/>`;
    mp += `<rect x="472" y="${y}" width="318" height="52" rx="12" fill="${C.white}" stroke="${C.line}" stroke-width="1.3"/>`;
    mp += `<rect x="472" y="${y}" width="82" height="52" rx="12" fill="${i === 4 ? C.ink : C.brand}"/><text x="513" y="${y + 31}" font-size="12" font-weight="700" fill="#fff" text-anchor="middle">${z}</text>`;
    mp += `<text x="566" y="${y + 23}" font-size="13" font-weight="700" fill="${C.ink}">${esc(n)}</text><text x="566" y="${y + 40}" font-size="11.5" fill="${C.muted}">${d} · ${i === 4 ? "entrega en recepción" : "entrega en el salón"}</text>`;
  });
  figs.push({ name: "mapa_operativo", html: `<svg width="${W}" height="330" viewBox="0 0 ${W} 330">${mp}</svg>` });

  // ── Organigrama ──
  const box = (x, y, w, t, sub, o = {}) => {
    const lines = wrap(t, Math.floor(w / 7.2));
    const h0 = 26 + lines.length * 15 + (sub ? 15 : 0);
    const h = h0 + (sub ? (wrap(sub, Math.floor(w / 5.9)).length - 1) * 13 : 0);
    let s = `<rect x="${x - w / 2}" y="${y}" width="${w}" height="${h}" rx="10" fill="${o.fill || C.white}" stroke="${o.stroke || C.gris}" stroke-width="1.3"${o.dash ? ' stroke-dasharray="5 4"' : ""}/>`;
    lines.forEach((ln, k) => { s += `<text x="${x}" y="${y + 23 + k * 15}" font-size="12.5" font-weight="700" fill="${o.color || C.ink}" text-anchor="middle">${esc(ln)}</text>`; });
    if (sub) wrap(sub, Math.floor(w / 5.9)).forEach((sl, k) => { s += `<text x="${x}" y="${y + 23 + lines.length * 15 + k * 13}" font-size="11" fill="${o.subcolor || C.muted}" text-anchor="middle">${esc(sl)}</text>`; });
    return [s, h];
  };
  let og = "";
  const ln = (x1, y1, x2, y2, dash) => `<path d="M${x1},${y1}V${(y1 + y2) / 2}H${x2}V${y2}" fill="none" stroke="${C.gris}" stroke-width="1.3"${dash ? ' stroke-dasharray="5 4"' : ""}/>`;
  const [b1, h1] = box(400, 6, 260, "Asamblea de socios", "5 socios, 20% cada uno", { fill: C.ink, stroke: C.ink, color: "#fff", subcolor: "#d9cfc6" });
  const [b2, h2] = box(400, 92, 260, "Administrador único", "Dirección general, representación legal", { fill: C.brand, stroke: C.brand, color: "#fff", subcolor: "#fff" });
  og += ln(400, 6 + h1, 400, 92) + b1 + b2;
  const areas = [[100, "Tecnología y producto", "App, datos y soporte"], [300, "Operaciones y atención", "Repartidores e incidencias"], [500, "Comercial y marketing", "Locales y campañas"], [700, "Administración y finanzas", "Cobros, pagos e impuestos"]];
  areas.forEach(([x, t, s]) => { const [b] = box(x, 186, 180, t, s); og += ln(400, 92 + h2, x, 186) + b; });
  const sub = [[100, "Desarrollador externo", "por proyecto", 1], [300, "Coordinador de operación", "medio tiempo, por temporada", 0], [500, "Locales afiliados", "aliados, con convenio", 1], [700, "Contador externo", "iguala mensual", 1]];
  sub.forEach(([x, t, s, dash]) => { const [b] = box(x, 286, 180, t, s, dash ? { dash: true } : { fill: C.b50, stroke: C.brand }); og += ln(x, 186 + 56, x, 286, dash) + b; });
  const [b5] = box(300, 386, 180, "Repartidores", "padrón de 8, por bloques", { fill: C.b50, stroke: C.brand });
  og += ln(300, 286 + 56, 300, 386) + b5;
  og += `<rect x="470" y="396" width="14" height="10" rx="2" fill="${C.b50}" stroke="${C.brand}"/><text x="490" y="405" font-size="11" fill="${C.muted}">Personal de BITE</text><rect x="600" y="396" width="14" height="10" rx="2" fill="#fff" stroke="${C.gris}" stroke-dasharray="3 2"/><text x="620" y="405" font-size="11" fill="${C.muted}">Externos y aliados</text>`;
  figs.push({ name: "organigrama", html: `<svg width="${W}" height="448" viewBox="0 0 ${W} 448">${og}</svg>` });

  // ── Franquicia: qué pone cada quién ──
  const col = (t, s, items, o) => `<div style="flex:1;border:1.5px solid ${o.border};border-radius:16px;overflow:hidden;background:#fff">
    <div style="background:${o.bg};color:${o.color};padding:10px 14px"><div style="font-weight:800;font-size:15px">${t}</div><div style="font-size:11.5px;opacity:.9">${s}</div></div>
    <ul style="list-style:none;padding:10px 14px;display:grid;gap:6px;font-size:12.5px">${items.map((i) => `<li style="display:flex;gap:8px"><span style="color:${C.brand};font-weight:800">•</span><span>${i}</span></li>`).join("")}</ul></div>`;
  const pct = (v) => `${Math.round(v * 100)}%`;
  figs.push({
    name: "franquicia_modelo",
    html: `<div style="display:flex;gap:10px;align-items:stretch">
      ${col("BITE (franquiciante)", "Pone el sistema", ["La app, el panel de locales y la vista de repartidor", "La marca, la identidad y los manuales", "Capacitación inicial de 10 días", "Soporte, mejoras de producto y cobranza centralizada"], { bg: C.brand, color: "#fff", border: C.brand })}
      <div style="width:150px;display:flex;flex-direction:column;justify-content:center;gap:10px;font-size:12px;text-align:center">
        <div style="border:1px solid ${C.line};border-radius:12px;padding:8px;background:${C.canvas}"><div style="font-weight:800;font-size:16px">$${Number(S.sup_fq_cuota).toLocaleString("en-US")}</div>cuota inicial<div style="color:${C.gris};font-size:16px">←</div></div>
        <div style="border:1px solid ${C.line};border-radius:12px;padding:8px;background:${C.canvas}"><div style="font-weight:800;font-size:16px">${pct(S.sup_fq_regalia)} + ${pct(S.sup_fq_fondo)}</div>regalía y fondo de publicidad<div style="color:${C.gris};font-size:16px">←</div></div>
        <div style="border:1px solid ${C.b200};border-radius:12px;padding:8px;background:${C.b50}"><div style="font-weight:800;font-size:14px">Un campus</div>territorio exclusivo<div style="color:${C.brand};font-size:16px">→</div></div></div>
      ${col("Franquiciatario", "Pone la operación local", ["Afilia y atiende a los locales de su campus", "Recluta, capacita y coordina a los repartidores", "Hace la publicidad dentro del campus", "Gestiona el permiso con su universidad"], { bg: C.ink, color: "#fff", border: C.ink })}</div>`,
  });

  // ── Canvas ──
  const blk = (t, items, style = "") => `<div style="border:1px solid ${C.line};border-radius:12px;padding:10px 11px;background:#fff;${style}"><div style="font-size:11px;font-weight:800;color:${C.brand7};text-transform:uppercase;letter-spacing:.04em;margin-bottom:6px">${t}</div><ul style="list-style:none;display:grid;gap:5px;font-size:11.5px;line-height:1.3">${items.map((i) => `<li>${i}</li>`).join("")}</ul></div>`;
  figs.push({
    name: "canvas",
    html: `<div style="display:grid;grid-template-columns:repeat(10,1fr);grid-template-rows:auto auto auto;gap:8px">
      ${blk("Socios clave", ["Locales de comida del campus", "Universidad Anáhuac Querétaro (permiso de operación)", "Pasarela de pago", "Repartidores, alumnos del campus"], "grid-column:1/3;grid-row:1/3")}
      ${blk("Actividades clave", ["Afiliar y atender locales", "Coordinar repartidores por bloque", "Mantener y mejorar la app", "Atender incidencias el mismo día"], "grid-column:3/5;grid-row:1/2")}
      ${blk("Recursos clave", ["La app y sus datos de demanda por hora", "La marca BITE", "El padrón de repartidores", "Los convenios con locales"], "grid-column:3/5;grid-row:2/3")}
      ${blk("Propuesta de valor", ["<b>Alumno:</b> tu comida en la puerta de tu salón antes de que empiece tu clase, sin filas", "Agenda desde un día antes", "<b>Local:</b> ventas nuevas y pedidos anticipados, sin contratar a nadie", "Comisión menor que la de las apps generales"], "grid-column:5/7;grid-row:1/3;background:" + C.b50 + ";border-color:" + C.b200)}
      ${blk("Relación con clientes", ["Autoservicio en la app", "Seguimiento del pedido en vivo", "Calificación de cada entrega", "BITE Pass para quien pide seguido"], "grid-column:7/9;grid-row:1/2")}
      ${blk("Canales", ["App web instalable (PWA)", "Instagram y grupos de WhatsApp", "Carteles y códigos QR en el campus", "Recomendación entre alumnos"], "grid-column:7/9;grid-row:2/3")}
      ${blk("Segmentos", ["Alumnos de licenciatura con clases seguidas", "Alumnos deportistas con horarios fijos de comida", "Docentes y personal (segundo momento)", "Locales de comida del campus"], "grid-column:9/11;grid-row:1/3")}
      ${blk("Estructura de costos", ["Variables: pago a repartidores, pasarela de pago, sellos", "Fijos: contabilidad, infraestructura, publicidad, seguro", "Coordinador de operación al pasar de 60 pedidos al día"], "grid-column:1/6;grid-row:3/4")}
      ${blk("Fuentes de ingreso", ["Envío: $" + S.sup_fee + " por pedido", "Sobreprecio de menú: $" + S.sup_markup + " por pedido", "Comisión del local: " + pct(S.sup_com_E) + " de la comida", "BITE Pass: $" + S.sup_passfee + " al mes", "Más adelante: cuotas y regalías de franquicia"], "grid-column:6/11;grid-row:3/4")}
    </div>`,
  });
  return figs;
};
