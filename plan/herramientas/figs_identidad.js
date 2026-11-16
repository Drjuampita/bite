// Manual de identidad, portada y composiciones con las capturas reales de la app.
const path = require("path");
const { C, W, esc, logo, logoMark } = require("./figuras_lib");

module.exports = (S, OUT) => {
  const figs = [];
  const img = (n) => "file://" + path.join(OUT, "app", n + ".png");
  const markColor = (size, bg, fg, id) => { const [cab, resto] = logoMark(size, id).split("</mask>"); return cab.replace(`fill="${C.brand}"`, `fill="${bg}"`) + "</mask>" + resto.split("#fff").join(fg); };
  const logoInv = (size, id) => `<span style="display:inline-flex;align-items:center;gap:${size * 0.22}px">${markColor(size, "#fff", C.brand, id)}<span style="font-size:${size * 0.82}px;font-weight:800;letter-spacing:-0.035em;color:#fff;line-height:1">bite</span></span>`;
  const lab = (t) => `<div style="font-size:11.5px;color:${C.muted};margin-top:6px;text-align:center;line-height:1.3">${t}</div>`;
  const tileS = `border-radius:14px;height:120px;display:flex;align-items:center;justify-content:center;border:1px solid ${C.line}`;

  figs.push({ name: "logo_portada", w: 520, html: `<div style="text-align:center;padding:10px 0">${logo(108, C.ink, "p0")}<div style="font-size:21px;font-weight:600;color:${C.muted};margin-top:14px">Tu comida, directo a tu salón.</div></div>` });
  figs.push({ name: "logo_encabezado", w: 150, html: `<div style="padding:2px">${logo(30, C.ink, "p1")}</div>` });

  // ── Logotipo y color ──
  const sw = (hex, n, rgb, cmyk, dark) => `<div style="flex:1"><div style="height:64px;border-radius:12px;background:${hex};border:1px solid ${C.line}"></div><div style="font-size:12.5px;font-weight:700;margin-top:6px">${n}</div><div style="font-size:11px;color:${C.muted};line-height:1.35">${hex.toUpperCase()}<br>RGB ${rgb}<br>CMYK ${cmyk}</div></div>`;
  figs.push({
    name: "id_logo",
    html: `<div style="display:grid;grid-template-columns:1.25fr 1fr 1fr;gap:12px">
        <div><div style="${tileS};background:#fff">${logo(58, C.ink, "a")}</div>${lab("Versión principal, sobre fondo claro")}</div>
        <div><div style="${tileS};background:${C.brand};border-color:${C.brand}">${logoInv(46, "b")}</div>${lab("Versión invertida, sobre frambuesa BITE")}</div>
        <div><div style="${tileS};background:${C.ink};border-color:${C.ink}">${logo(46, "#fff", "c")}</div>${lab("Sobre fondo oscuro")}</div>
      </div>
      <div style="display:grid;grid-template-columns:1fr 2.2fr;gap:12px;margin-top:14px">
        <div><div style="${tileS};background:${C.canvas};position:relative"><div style="border:1.5px dashed ${C.gris};padding:26px;border-radius:8px">${logoMark(52, "d")}</div></div>${lab("Isotipo y zona de protección: medio isotipo por lado. Tamaño mínimo: 24 px en pantalla, 10 mm impreso")}</div>
        <div><div style="display:flex;gap:10px">
          ${sw("#e5386d", "Frambuesa BITE", "229, 56, 109", "0, 76, 52, 10")}${sw("#a81d4a", "Frambuesa profundo", "168, 29, 74", "0, 83, 56, 34")}${sw("#1c1511", "Tinta", "28, 21, 17", "0, 25, 39, 89")}${sw("#ffdde7", "Rosa claro", "255, 221, 231", "0, 13, 9, 0")}${sw("#fbf8f5", "Lienzo", "251, 248, 245", "0, 1, 2, 2")}
        </div></div>
      </div>`,
  });

  // ── Usos correctos e incorrectos ──
  const ok = (inner, t, bg = "#fff") => `<div style="flex:1"><div style="${tileS};height:96px;background:${bg}">${inner}</div><div style="font-size:11.5px;margin-top:6px;display:flex;gap:6px;line-height:1.3"><span style="color:#008300;font-weight:800">✓</span><span>${t}</span></div></div>`;
  const no = (inner, t, bg = "#fff") => `<div style="flex:1"><div style="${tileS};height:96px;background:${bg};overflow:hidden">${inner}</div><div style="font-size:11.5px;margin-top:6px;display:flex;gap:6px;line-height:1.3"><span style="color:#d03b3b;font-weight:800">✕</span><span>${t}</span></div></div>`;
  figs.push({
    name: "id_usos",
    html: `<div style="font-size:13px;font-weight:700;margin-bottom:8px">Uso correcto</div>
      <div style="display:flex;gap:10px">${ok(logo(40, C.ink, "u1"), "Completo, sobre blanco o lienzo")}${ok(logoInv(34, "u2"), "Invertido sobre frambuesa BITE", C.brand)}${ok(logoMark(46, "u3"), "Isotipo solo en espacios chicos: ícono de la app, sello, gorra", C.canvas)}${ok(logo(34, "#fff", "u4"), "Sobre foto o fondo oscuro con contraste suficiente", C.ink)}</div>
      <div style="font-size:13px;font-weight:700;margin:16px 0 8px">Uso incorrecto</div>
      <div style="display:flex;gap:10px">
        ${no(`<div style="transform:scaleX(1.55)">${logo(32, C.ink, "n1")}</div>`, "Estirarlo o deformarlo")}
        ${no(`<span style="display:inline-flex;align-items:center;gap:8px">${markColor(36, "#2a78d6", "#fff", "n2")}<span style="font-size:30px;font-weight:800;color:#2a78d6;letter-spacing:-0.035em">bite</span></span>`, "Cambiarle el color")}
        ${no(`<div style="transform:rotate(-16deg)">${logo(34, C.ink, "n3")}</div>`, "Girarlo")}
        ${no(logo(34, "#ee7b9b", "n4"), "Ponerlo sobre un fondo sin contraste", "#f08aa6")}
        ${no(`<div style="filter:drop-shadow(4px 5px 3px rgba(0,0,0,.55))">${logo(34, C.ink, "n5")}</div>`, "Agregarle sombras, contornos o efectos")}
      </div>`,
  });

  // ── Tipografía ──
  figs.push({
    name: "id_tipografia",
    html: `<div style="display:grid;grid-template-columns:200px 1fr;gap:20px;align-items:center">
      <div style="background:${C.b50};border-radius:16px;height:190px;display:flex;flex-direction:column;align-items:center;justify-content:center"><div style="font-size:96px;font-weight:800;letter-spacing:-0.04em;line-height:1;color:${C.brand}">Aa</div><div style="font-size:12px;color:${C.muted};margin-top:8px">Plus Jakarta Sans</div></div>
      <div>
        <div style="font-size:30px;font-weight:800;letter-spacing:-0.03em;line-height:1.1">Tu comida, directo a tu salón.</div>
        <div style="font-size:12px;color:${C.muted};margin:2px 0 10px">Títulos: ExtraBold 800, interletrado −3%</div>
        <div style="font-size:17px;font-weight:700">Agenda desde un día antes</div>
        <div style="font-size:12px;color:${C.muted};margin:2px 0 10px">Subtítulos y botones: Bold 700</div>
        <div style="font-size:14px;font-weight:400;line-height:1.45">Pide a los locales del campus y recíbelo antes de que empiece tu clase. Sin filas, sin correr.</div>
        <div style="font-size:12px;color:${C.muted};margin:2px 0 10px">Texto: Regular 400 y Medium 500</div>
        <div style="font-size:14px;font-weight:500;letter-spacing:.02em;color:${C.muted}">ABCDEFGHIJKLMNÑOPQRSTUVWXYZ · abcdefghijklmnñopqrstuvwxyz · 0123456789 $%</div>
      </div></div>`,
  });

  // ── Hoja membretada ──
  figs.push({
    name: "id_membrete",
    html: `<div style="display:flex;gap:26px;align-items:center;justify-content:center;background:${C.canvas};border-radius:16px;padding:22px">
      <div style="width:330px;height:427px;background:#fff;box-shadow:0 8px 28px rgba(28,21,17,.14);position:relative;padding:26px 28px">
        <div style="display:flex;justify-content:space-between;align-items:flex-start">${logo(26, C.ink, "h1")}<div style="font-size:6.5px;color:${C.muted};text-align:right;line-height:1.5">BITE Servicios de Entrega, S.A.S.<br>RFC BSE261207A1B</div></div>
        <div style="height:2px;background:${C.brand};margin-top:12px;width:44px"></div>
        <div style="margin-top:26px;font-size:6.5px;color:${C.gris};line-height:2.1">El Marqués, Querétaro, a 11 de enero de 2027<br><br>${"━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━<br>".repeat(9)}</div>
        <div style="position:absolute;left:0;right:0;bottom:0;background:${C.ink};color:#fff;font-size:6.2px;line-height:1.6;padding:9px 28px;display:flex;justify-content:space-between">
          <span>Circuito Universidades I, km 7, Fracción 2<br>El Marqués, Querétaro, C.P. 76246</span><span style="text-align:right">contacto@bitedelivery.mx · 442 447 8664<br>bitedelivery.mx</span></div>
      </div>
      <div style="font-size:12.5px;line-height:1.5;max-width:270px">
        <div style="font-weight:800;font-size:14px;margin-bottom:6px">Hoja membretada</div>
        <b>Formato:</b> carta, 21.6 × 27.9 cm<br><b>Papel:</b> bond blanco de 90 g<br><b>Tintas:</b> 4 × 0<br><b>Márgenes:</b> 2.5 cm<br><b>Encabezado:</b> logotipo a 3.5 cm de ancho y datos fiscales (razón social y RFC)<br><b>Pie:</b> franja color tinta con domicilio, correo, teléfono y sitio<br><b>Diseño:</b> equipo BITE</div></div>`,
  });

  // ── Tarjeta de presentación ──
  figs.push({
    name: "id_tarjeta",
    html: `<div style="display:flex;gap:22px;align-items:center;justify-content:center;background:${C.canvas};border-radius:16px;padding:22px">
      <div style="width:270px;height:150px;border-radius:10px;background:${C.brand};box-shadow:0 8px 22px rgba(28,21,17,.16);display:flex;flex-direction:column;align-items:center;justify-content:center">${logoInv(40, "t1")}<div style="color:#fff;font-size:10.5px;font-weight:600;margin-top:10px">Tu comida, directo a tu salón.</div></div>
      <div style="width:270px;height:150px;border-radius:10px;background:#fff;box-shadow:0 8px 22px rgba(28,21,17,.16);padding:18px 20px;position:relative">
        <div style="font-size:14px;font-weight:800">Nombre Apellido</div><div style="font-size:10px;color:${C.brand7};font-weight:700">Socio · Área a su cargo</div>
        <div style="font-size:9.5px;color:${C.muted};line-height:1.7;margin-top:16px">442 447 8664<br>nombre@bitedelivery.mx<br>bitedelivery.mx</div>
        <div style="position:absolute;right:18px;bottom:16px">${logoMark(30, "t2")}</div></div>
      <div style="font-size:12px;line-height:1.5;max-width:170px"><b>Medidas:</b> 9 × 5 cm<br><b>Material:</b> cartulina couché de 300 g, laminado mate<br><b>Tintas:</b> 4 × 4<br><b>Frente:</b> frambuesa BITE con logotipo invertido y eslogan<br><b>Vuelta:</b> nombre, puesto y datos de contacto</div></div>`,
  });

  // ── Landing page ──
  figs.push({
    name: "id_landing",
    html: `<div style="border:1px solid ${C.line};border-radius:14px;overflow:hidden;box-shadow:0 6px 24px rgba(28,21,17,.10)">
      <div style="background:${C.canvas};padding:8px 12px;display:flex;align-items:center;gap:8px;border-bottom:1px solid ${C.line}"><span style="display:flex;gap:5px">${["#e8b4a6", "#ecd3a0", "#b9d9b0"].map((c) => `<i style="width:9px;height:9px;border-radius:50%;background:${c};display:block"></i>`).join("")}</span><div style="flex:1;background:#fff;border:1px solid ${C.line};border-radius:999px;font-size:10.5px;color:${C.muted};padding:3px 12px">https://bitedelivery.mx</div></div>
      <div style="background:${C.brand};color:#fff;padding:22px 30px 0;display:grid;grid-template-columns:1.25fr 1fr;gap:10px;position:relative;overflow:hidden">
        <div style="padding-bottom:26px"><div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:26px"><span style="background:#fff;border-radius:999px;padding:5px 12px;display:inline-flex">${logo(18, C.ink, "l1")}</span></div>
          <div style="font-size:35px;font-weight:800;letter-spacing:-0.03em;line-height:1.05">Tu comida,<br>directo a tu salón.</div>
          <div style="font-size:13px;margin-top:10px;opacity:.92;max-width:330px">Pide a los locales del campus desde tu celular y recíbelo antes de que empiece tu clase. Sin filas, sin correr.</div>
          <div style="display:flex;gap:10px;margin-top:18px"><span style="background:${C.ink};color:#fff;border-radius:999px;padding:9px 18px;font-size:12.5px;font-weight:700">Pedir ahora</span><span style="border:1.5px solid #fff;border-radius:999px;padding:8px 16px;font-size:12.5px;font-weight:700">Quiero afiliar mi local</span></div></div>
        <div style="display:flex;justify-content:center;align-items:flex-end"><img src="${img("02-inicio")}" style="width:176px;border-radius:20px 20px 0 0;border:5px solid ${C.ink};border-bottom:0;display:block;height:250px;object-fit:cover;object-position:top"></div></div>
      <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:14px;padding:18px 30px;background:#fff">
        ${[["Agenda desde un día antes", "Elige la hora de tu clase; la app te dice cuántos lugares quedan."], ["Entrega en tu salón", "Llega en los 15 minutos antes de tu clase, con tu código de entrega."], ["Envío de $" + S.sup_fee + " o BITE Pass", "Todos tus envíos por $" + S.sup_passfee + " al mes. Cancelas cuando quieras."]].map(([t, d]) => `<div><div style="font-size:13.5px;font-weight:800">${t}</div><div style="font-size:11.5px;color:${C.muted};line-height:1.4;margin-top:3px">${d}</div></div>`).join("")}</div>
      <div style="background:${C.canvas};padding:10px 30px;font-size:10.5px;color:${C.muted};display:flex;justify-content:space-between;border-top:1px solid ${C.line}"><span>Cómo funciona · Locales · Para repartidores · Ayuda</span><span>Aviso de privacidad · Términos y condiciones</span></div></div>`,
  });

  // ── Uniforme ──
  const polo = `<svg width="170" height="170" viewBox="0 0 200 200"><path d="M62,28 L30,44 L8,82 L36,98 L46,82 L46,184 L154,184 L154,82 L164,98 L192,82 L170,44 L138,28 L120,44 L100,50 L80,44 Z" fill="${C.brand}"/><path d="M80,28 L100,58 L120,28 L138,28 L120,46 L100,62 L80,46 L62,28Z" fill="${C.brand6}"/><rect x="97" y="56" width="6" height="30" rx="2" fill="${C.brand6}"/><rect x="118" y="74" width="20" height="20" rx="5" fill="#fff"/><circle cx="128" cy="85" r="5.4" fill="${C.brand}"/><circle cx="132.6" cy="80.4" r="2.6" fill="#fff"/></svg>`;
  const poloB = `<svg width="170" height="170" viewBox="0 0 200 200"><path d="M62,28 L30,44 L8,82 L36,98 L46,82 L46,184 L154,184 L154,82 L164,98 L192,82 L170,44 L138,28 Q100,40 62,28 Z" fill="${C.brand}"/><text x="100" y="92" font-size="14.5" font-weight="800" fill="#fff" text-anchor="middle" font-family="Plus Jakarta Sans">REPARTIDOR</text><text x="100" y="114" font-size="14" font-weight="800" fill="#fff" text-anchor="middle" font-family="Plus Jakarta Sans" letter-spacing="-0.5">bite</text></svg>`;
  const gorra = `<svg width="150" height="120" viewBox="0 0 200 150"><path d="M30,96 Q30,30 104,30 Q168,30 172,96 Z" fill="${C.ink}"/><path d="M30,96 Q4,100 2,114 Q60,104 110,104 L172,96 Z" fill="#3a302a"/><rect x="88" y="52" width="30" height="30" rx="7" fill="${C.brand}"/><circle cx="103" cy="68" r="8.4" fill="#fff"/><circle cx="110" cy="61" r="4" fill="${C.brand}"/><circle cx="104" cy="30" r="5" fill="#3a302a"/></svg>`;
  const mochila = `<svg width="150" height="180" viewBox="0 0 170 200"><path d="M60,22 Q85,0 110,22" fill="none" stroke="${C.ink}" stroke-width="8" stroke-linecap="round"/><rect x="18" y="20" width="134" height="170" rx="18" fill="${C.ink}"/><rect x="18" y="20" width="134" height="40" rx="18" fill="#3a302a"/><rect x="18" y="118" width="134" height="10" fill="#d9d2cb"/><rect x="60" y="68" width="50" height="40" rx="10" fill="${C.brand}"/><text x="85" y="95" font-size="20" font-weight="800" fill="#fff" text-anchor="middle" font-family="Plus Jakarta Sans" letter-spacing="-0.8">bite</text><rect x="34" y="140" width="102" height="34" rx="8" fill="#3a302a"/></svg>`;
  const gafete = `<svg width="110" height="170" viewBox="0 0 120 190"><path d="M40,0 L60,44 L80,0" fill="none" stroke="${C.brand}" stroke-width="7"/><rect x="14" y="42" width="92" height="140" rx="10" fill="#fff" stroke="${C.gris}" stroke-width="1.5"/><rect x="14" y="42" width="92" height="30" rx="10" fill="${C.brand}"/><text x="60" y="63" font-size="15" font-weight="800" fill="#fff" text-anchor="middle" font-family="Plus Jakarta Sans">bite</text><circle cx="60" cy="104" r="19" fill="${C.b100}"/><rect x="32" y="134" width="56" height="7" rx="3" fill="${C.ink}"/><rect x="38" y="148" width="44" height="5" rx="2" fill="${C.gris}"/><rect x="30" y="162" width="60" height="10" rx="3" fill="${C.b100}"/></svg>`;
  const pz = (svg, t, d) => `<div style="flex:1;text-align:center"><div style="height:186px;display:flex;align-items:center;justify-content:center">${svg}</div><div style="font-size:12.5px;font-weight:700">${t}</div><div style="font-size:11px;color:${C.muted};line-height:1.35;margin-top:2px">${d}</div></div>`;
  figs.push({
    name: "id_uniforme",
    html: `<div style="display:flex;gap:6px;background:${C.canvas};border-radius:16px;padding:16px 10px">
      ${pz(polo, "Playera polo", "Frambuesa BITE, isotipo bordado al pecho")}${pz(gorra, "Gorra", "Color tinta, isotipo bordado al frente")}${pz(mochila, "Mochila térmica", "51 litros, franja reflejante, logotipo")}${pz(gafete, "Gafete", "Foto, nombre y folio de repartidor")}</div>`,
  });

  // ── Aplicaciones ──
  figs.push({
    name: "id_aplicaciones",
    html: `<div style="display:grid;grid-template-columns:0.8fr 1.5fr 1.1fr 1fr;gap:12px;align-items:stretch">
      <div><div style="${tileS};height:150px;background:${C.canvas}">${logoMark(84, "ap1")}</div>${lab("Ícono de la app")}</div>
      <div><div style="${tileS};height:150px;background:${C.canvas}"><div style="width:270px;height:86px;border-radius:10px;background:${C.brand};color:#fff;display:flex;align-items:center;gap:12px;padding:0 16px;border:2px dashed #fff;outline:2px solid ${C.brand}">${markColor(44, "#fff", C.brand, "ap2")}<div><div style="font-weight:800;font-size:15px">Sellado en el local</div><div style="font-size:10.5px;line-height:1.3">Si el sello está roto, no lo recibas y repórtalo en la app.</div></div></div></div>${lab("Sello de seguridad para la bolsa, 3 × 8 cm")}</div>
      <div><div style="${tileS};height:150px;background:${C.canvas}"><div style="width:176px;border-radius:10px;background:#fff;border:1.5px solid ${C.ink};padding:10px 12px"><div style="display:flex;justify-content:space-between;align-items:center"><span style="font-size:26px;font-weight:800;letter-spacing:-0.02em">C204</span><span style="font-size:13px;font-weight:700;background:${C.ink};color:#fff;border-radius:6px;padding:2px 7px">9:00</span></div><div style="font-size:10.5px;color:${C.muted};margin-top:2px">Edificio C · Piso 2 · Pedido #4F7K</div><div style="font-size:10.5px;margin-top:4px">Ana L. · 2 productos</div></div></div>${lab("Etiqueta de pedido: salón, hora de clase y folio")}</div>
      <div><div style="${tileS};height:150px;background:${C.brand};border-color:${C.brand};flex-direction:column;color:#fff;padding:10px"><div style="font-size:15px;font-weight:800;line-height:1.1;text-align:center">¿Clase a las 9?<br>Tu desayuno llega 8:45.</div><div style="width:44px;height:44px;background:#fff;border-radius:6px;margin-top:8px;display:grid;grid-template-columns:repeat(5,1fr);gap:2px;padding:5px">${Array.from({ length: 25 }, (_, i) => `<i style="background:${[0, 1, 3, 4, 5, 9, 12, 14, 15, 19, 20, 21, 23, 24, 7, 17].includes(i) ? C.ink : "#fff"};display:block"></i>`).join("")}</div></div>${lab("Cartel con código QR para el campus")}</div>
    </div>`,
  });

  // ── Capturas de la app ──
  const phone = (n, t, w = 176) => `<div style="width:${w}px"><div style="border:5px solid ${C.ink};border-radius:24px;overflow:hidden;background:#fff;box-shadow:0 6px 18px rgba(28,21,17,.14)"><img src="${img(n)}" style="width:100%;display:block"></div><div style="font-size:11.5px;line-height:1.3;margin-top:8px;text-align:center">${t}</div></div>`;
  figs.push({ name: "app_alumno_1", html: `<div style="display:flex;justify-content:space-between">${phone("01-login", "<b>1.</b> Entra con su correo institucional")}${phone("02-inicio", "<b>2.</b> Ve los locales del campus y su pedido en curso")}${phone("03-menu", "<b>3.</b> Abre el menú de un local")}${phone("04-producto", "<b>4.</b> Arma su platillo a su gusto")}</div>` });
  figs.push({ name: "app_alumno_2", html: `<div style="display:flex;justify-content:space-between">${phone("05-carrito", "<b>5.</b> Revisa el total antes de pagar")}${phone("06-checkout-agendar", "<b>6.</b> Elige la hora de su clase; la app avisa si quedan pocos lugares")}${phone("08-seguimiento", "<b>7.</b> Sigue su pedido y ve su código de entrega")}${phone("10-pedidos", "<b>8.</b> Consulta sus pedidos y repite con un toque")}</div>` });
  figs.push({
    name: "app_operacion",
    html: `<div style="display:flex;gap:18px;align-items:flex-start">
      <div style="flex:1"><div style="border:1px solid ${C.line};border-radius:12px;overflow:hidden;box-shadow:0 6px 18px rgba(28,21,17,.12)"><div style="background:${C.canvas};padding:6px 10px;display:flex;gap:5px;border-bottom:1px solid ${C.line}">${["#e8b4a6", "#ecd3a0", "#b9d9b0"].map((c) => `<i style="width:8px;height:8px;border-radius:50%;background:${c};display:block"></i>`).join("")}</div><img src="${img("12-panel-local")}" style="width:100%;display:block"></div>
        <div style="font-size:11.5px;line-height:1.3;margin-top:8px;text-align:center"><b>Panel del local.</b> Los pedidos llegan agrupados por hora de clase; el local marca «Listo» y puede apagar productos agotados.</div></div>
      ${phone("13-repartidor", "<b>Vista del repartidor.</b> Toma los pedidos listos y cierra cada entrega con el código del alumno.", 188)}</div>`,
  });
  return figs;
};
