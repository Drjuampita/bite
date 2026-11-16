/* =========================================================
   APP (alumno + panel del local)
   Vanilla JS, sin dependencias. Los datos viven en localStorage.
   ========================================================= */
(function () {
  "use strict";

  const LS_KEY = "app_comida_campus_v2";
  const ESTADOS = ["Recibido", "Preparando", "En camino", "Entregado"];
  const ESTADO_TITULO = ["Pedido recibido", "Preparando tu pedido", "Tu pedido va en camino", "Pedido entregado"];
  const ESTADO_DETALLE = ["El local recibió tu pedido", "Están preparando tu comida", "Va rumbo a tu salón", "¡Buen provecho!"];
  const ESTADO_ICONO = ["receipt", "chef-hat", "bike", "circle-check"];
  const AVANCE_MS = 10000; // en modo demo, cada pedido avanza solo cada 10 s

  // Íconos extra que no vienen en js/iconos.js
  ICONOS_SVG.check = '<path d="M20 6 9 17l-5-5"/>';

  /* ---------- Estado ---------- */
  const inicial = () => ({
    usuario: null,
    salon: { edificio: "B", numero: "204" },
    carrito: { local: null, items: [], nota: "" },
    checkout: { cuando: "ahora", hora: "", pago: "efectivo" },
    pedidos: [],
    categoria: "todo",
    autoAvance: true,
  });

  let S = cargar();

  function cargar() {
    try {
      const guardado = JSON.parse(localStorage.getItem(LS_KEY));
      return Object.assign(inicial(), guardado || {});
    } catch (e) {
      return inicial();
    }
  }
  function guardar() {
    try {
      localStorage.setItem(LS_KEY, JSON.stringify(S));
    } catch (e) {
      /* sin almacenamiento: la app sigue funcionando en memoria */
    }
  }

  /* ---------- Utilidades ---------- */
  const $app = document.getElementById("app");
  const dinero = (n) => "$" + Math.round(n);
  const getLocal = (id) => LOCALES.find((l) => l.id === id);
  const getProducto = (lid, pid) => (PRODUCTOS[lid] || []).find((p) => p.id === pid);
  const esc = (s) =>
    String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);
  const salonTexto = () => S.salon.edificio + (S.salon.numero ? "-" + S.salon.numero : "");
  const horaCorta = (ts) => new Date(ts).toLocaleTimeString("es-MX", { hour: "numeric", minute: "2-digit" });
  const fechaCorta = (ts) => new Date(ts).toLocaleDateString("es-MX", { day: "numeric", month: "short" });
  const iniciales = (nombre) =>
    nombre
      .split(" ")
      .filter(Boolean)
      .map((x) => x[0])
      .join("")
      .slice(0, 2)
      .toUpperCase();

  function ico(nombre, tam = 20, clase = "") {
    const cuerpo = ICONOS_SVG[nombre] || "";
    return `<svg class="ico ${clase}" viewBox="0 0 24 24" width="${tam}" height="${tam}" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${cuerpo}</svg>`;
  }

  function tileLocal(l, tam = "") {
    return `<span class="local-tile ${tam}" style="background:${l.color}">${ico(l.icono, tam === "chico" ? 20 : 26)}</span>`;
  }

  function cantidadCarrito() {
    return S.carrito.items.reduce((a, i) => a + i.cant, 0);
  }
  function subtotalCarrito() {
    return S.carrito.items.reduce((a, i) => {
      const p = getProducto(S.carrito.local, i.id);
      return a + (p ? p.precio * i.cant : 0);
    }, 0);
  }
  function cantDe(pid) {
    const it = S.carrito.items.find((i) => i.id === pid);
    return it ? it.cant : 0;
  }

  let toastTimer;
  function toast(msg) {
    const t = document.getElementById("toast");
    t.textContent = msg;
    t.classList.add("visible");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => t.classList.remove("visible"), 1800);
  }

  function logo(clase = "") {
    return `<span class="logo ${clase}">${esc(APP.nombre.toLowerCase())}<span class="logo-punto">.</span></span>`;
  }

  /* ---------- Router ---------- */
  function ruta() {
    const h = location.hash.replace(/^#\/?/, "") || "inicio";
    return h.split("/");
  }

  function render() {
    const [pag, arg] = ruta();
    if (!S.usuario && pag !== "login" && pag !== "panel") {
      location.hash = "#/login";
      return;
    }
    if (S.usuario && pag === "login") {
      location.hash = "#/inicio";
      return;
    }
    const vistas = {
      login: vistaLogin,
      inicio: vistaInicio,
      local: vistaLocal,
      carrito: vistaCarrito,
      checkout: vistaCheckout,
      pedido: vistaPedido,
      pedidos: vistaPedidos,
      perfil: vistaPerfil,
      panel: vistaPanel,
    };
    const fn = vistas[pag] || vistaInicio;
    document.body.classList.toggle("modo-panel", pag === "panel");
    $app.innerHTML = fn(arg);
  }

  /* ---------- Piezas compartidas ---------- */
  function telefono(contenido, opciones = {}) {
    const { tabs = true, barraCarrito = true, pie = "" } = opciones;
    const [pag] = ruta();
    const mostrarBarra = barraCarrito && cantidadCarrito() > 0;
    const clases = ["telefono", tabs && "con-tabs", mostrarBarra && "con-barra", pie && "con-pie"].filter(Boolean).join(" ");
    return `
      <div class="${clases}">
        ${contenido}
        ${mostrarBarra ? barraCarritoHtml() : ""}
        ${pie ? `<div class="pie-fijo">${pie}</div>` : ""}
        ${tabs ? barraTabs(pag) : ""}
      </div>`;
  }

  function barraCarritoHtml() {
    return `
      <button class="barra-carrito" data-go="#/carrito">
        <span class="bc-cant">${cantidadCarrito()}</span>
        <span class="bc-texto">Ver carrito</span>
        <span class="bc-total">${dinero(subtotalCarrito())}</span>
      </button>`;
  }

  function barraTabs(pag) {
    const activos = S.pedidos.filter((p) => p.estado < 3 && !p.cancelado).length;
    const tab = (id, destino, icono, texto, badge) => `
      <a href="${destino}" class="tab ${pag === id ? "activo" : ""}">
        <span class="tab-ico">${ico(icono, 22)}${badge ? `<span class="tab-badge">${badge}</span>` : ""}</span>
        <span>${texto}</span>
      </a>`;
    return `
      <nav class="tabs">
        ${tab("inicio", "#/inicio", "house", "Inicio")}
        ${tab("pedidos", "#/pedidos", "receipt", "Pedidos", activos)}
        ${tab("perfil", "#/perfil", "user", "Perfil")}
      </nav>`;
  }

  function encabezado(titulo, volver = "#/inicio") {
    return `
      <header class="enc">
        <a href="${volver}" class="btn-circulo" aria-label="Volver">${ico("chevron-left", 20)}</a>
        <h1>${esc(titulo)}</h1>
        <span class="enc-hueco"></span>
      </header>`;
  }

  function pillEstado(p) {
    if (p.cancelado) return `<span class="pill pill-gris">Cancelado</span>`;
    if (p.estado === -1) return `<span class="pill pill-azul">Programado</span>`;
    if (p.estado === 3) return `<span class="pill pill-verde">Entregado</span>`;
    return `<span class="pill pill-naranja">${ESTADOS[p.estado]}</span>`;
  }

  function progreso(estado) {
    return `<span class="progreso">${[0, 1, 2, 3].map((i) => `<i class="${estado >= i ? "lleno" : ""}"></i>`).join("")}</span>`;
  }

  function stepper(localId, prodId, cant) {
    return `
      <div class="stepper">
        <button data-action="menos" data-local="${localId}" data-prod="${prodId}" aria-label="Quitar uno">${ico("minus", 16)}</button>
        <span>${cant}</span>
        <button data-action="mas" data-local="${localId}" data-prod="${prodId}" aria-label="Agregar uno">${ico("plus", 16)}</button>
      </div>`;
  }

  function chipsEdificio() {
    return `
      <div class="chips-edificio">
        ${EDIFICIOS.map(
          (e) => `<button class="chip-ed ${S.salon.edificio === e ? "activo" : ""}" data-action="edificio" data-v="${esc(e)}">${esc(e)}</button>`
        ).join("")}
      </div>`;
  }

  /* ---------- Vistas ---------- */
  function vistaLogin() {
    return `
      <div class="telefono login">
        <div class="login-hero">
          <img class="login-marca" src="img/icono.svg" alt="" width="64" height="64">
          ${logo("logo-grande")}
          <p>${esc(APP.lema)}</p>
          <div class="login-iconos">
            ${["coffee", "salad", "donut", "croissant", "cup-soda"].map((i) => `<span>${ico(i, 20)}</span>`).join("")}
          </div>
        </div>
        <form class="login-hoja" data-form="login">
          <h2>Inicia sesión</h2>
          <p class="sub">Entra con tu correo de la universidad.</p>
          <label class="campo"><span>Correo institucional</span>
            <input type="email" name="correo" placeholder="nombre@${esc(APP.dominioCorreo)}" required>
          </label>
          <label class="campo"><span>Contraseña</span>
            <input type="password" name="pass" placeholder="Tu contraseña" required>
          </label>
          <button class="btn btn-primario btn-bloque" type="submit">Entrar</button>
          <button class="btn btn-secundario btn-bloque" type="button" data-action="demo">Entrar con cuenta de prueba</button>
          <p class="login-pie">¿Tienes un local en el campus? <a href="#/panel">Entra al panel</a></p>
        </form>
      </div>`;
  }

  function vistaInicio() {
    const nombre = S.usuario.nombre.split(" ")[0];
    const activo = S.pedidos.find((p) => p.estado >= 0 && p.estado < 3 && !p.cancelado);
    const locales = LOCALES.filter((l) => S.categoria === "todo" || l.categorias.includes(S.categoria));
    const abiertos = locales.filter((l) => l.abierto).length;

    const tarjetaActivo = activo
      ? `
        <a class="pedido-activo" href="#/pedido/${activo.id}">
          <span class="pa-fila">
            <span class="pa-ico">${ico(ESTADO_ICONO[activo.estado], 20)}</span>
            <span class="pa-texto">
              <small>Pedido en curso · ${esc(getLocal(activo.local).nombre)}</small>
              <strong>${ESTADO_TITULO[activo.estado]}</strong>
            </span>
            ${ico("chevron-right", 20, "pa-flecha")}
          </span>
          ${progreso(activo.estado)}
        </a>`
      : "";

    return telefono(`
      <header class="inicio-top">
        <a class="entrega" href="#/perfil">
          <span class="entrega-ico">${ico("map-pin", 18)}</span>
          <span class="entrega-texto"><small>Entregar en</small><strong>Salón ${esc(salonTexto())}</strong></span>
        </a>
        <a class="avatar avatar-chico" href="#/perfil">${esc(iniciales(S.usuario.nombre))}</a>
      </header>

      <section class="saludo">
        <p>Hola, ${esc(nombre)}</p>
        <h1>¿Qué vas a pedir hoy?</h1>
        <label class="buscador">
          ${ico("search", 18)}
          <input type="search" placeholder="Busca un local o un producto" data-buscar>
        </label>
      </section>

      <main class="contenido">
        ${tarjetaActivo}

        ${activo ? "" : `<div class="promo">
          <div>
            <strong>Envío a tu salón por ${dinero(APP.envio)}</strong>
            <span>Pide en clase y recíbelo en el receso.</span>
          </div>
          <span class="promo-ico">${ico("bike", 30)}</span>
        </div>`}

        <div class="chips">
          ${CATEGORIAS.map(
            (c) => `<button class="chip ${S.categoria === c.id ? "activo" : ""}" data-action="categoria" data-id="${c.id}">${esc(c.nombre)}</button>`
          ).join("")}
        </div>

        <div class="seccion-cab">
          <h2>Locales en el campus</h2>
          <span>${abiertos} abiertos</span>
        </div>
        <div class="lista-locales">
          ${locales.map(filaLocal).join("")}
          <p class="vacio oculto" data-sin-resultados>No encontramos nada con esa búsqueda.</p>
        </div>
      </main>
    `);
  }

  function filaLocal(l) {
    const textoBusqueda = [l.nombre, l.tipo, ...(PRODUCTOS[l.id] || []).map((p) => p.nombre)].join(" ").toLowerCase();
    return `
      <a class="local-fila ${l.abierto ? "" : "cerrado"}" href="#/local/${l.id}" data-texto="${esc(textoBusqueda)}">
        ${tileLocal(l)}
        <span class="local-info">
          <strong>${esc(l.nombre)}</strong>
          <span class="sub">${esc(l.tipo)}</span>
          <span class="meta">
            <span class="meta-item">${ico("star", 13, "ico-estrella")} ${l.rating}</span>
            <span class="meta-item">${ico("clock", 13)} ${esc(l.tiempo)}</span>
            <span class="meta-item ${l.abierto ? "txt-verde" : "txt-rojo"}">${l.abierto ? "Abierto" : "Cerrado"}</span>
          </span>
        </span>
        ${ico("chevron-right", 18, "fila-flecha")}
      </a>`;
  }

  function vistaLocal(id) {
    const l = getLocal(id);
    if (!l) return telefono(`${encabezado("Local")}<p class="vacio">Este local no existe.</p>`);
    const productos = PRODUCTOS[l.id] || [];
    const secciones = [...new Set(productos.map((p) => p.seccion))];

    return telefono(
      `
      <header class="local-banda" style="background:${l.color}">
        <a href="#/inicio" class="btn-circulo blanco" aria-label="Volver">${ico("chevron-left", 20)}</a>
        <span class="banda-ico">${ico(l.icono, 40)}</span>
      </header>
      <section class="local-cabecera">
        <div class="fila-titulo">
          <h1>${esc(l.nombre)}</h1>
          <span class="estado ${l.abierto ? "abierto" : ""}">${l.abierto ? "Abierto" : "Cerrado"}</span>
        </div>
        <p class="sub">${esc(l.tipo)}</p>
        <div class="local-meta">
          <span>${ico("star", 15, "ico-estrella")} ${l.rating}</span>
          <span>${ico("clock", 15)} ${esc(l.tiempo)}</span>
          <span>${ico("map-pin", 15)} ${esc(l.ubicacion)}</span>
        </div>
        <p class="local-horario">Horario ${esc(l.horario)} · Envío a tu salón ${dinero(APP.envio)}</p>
        ${l.abierto ? "" : `<div class="alerta">Este local está cerrado. Puedes armar tu pedido y programarlo.</div>`}
      </section>
      <nav class="secciones-nav">
        ${secciones.map((s, i) => `<button class="${i === 0 ? "activo" : ""}" data-action="seccion" data-i="${i}">${esc(s)}</button>`).join("")}
      </nav>
      <main class="contenido menu">
        ${secciones
          .map(
            (s, i) => `
          <h2 class="titulo-seccion" id="sec-${i}">${esc(s)}</h2>
          <div class="lista-productos">
            ${productos.filter((p) => p.seccion === s).map((p) => filaProducto(l, p)).join("")}
          </div>`
          )
          .join("")}
      </main>
    `,
      { tabs: false }
    );
  }

  function filaProducto(l, p) {
    const cant = S.carrito.local === l.id ? cantDe(p.id) : 0;
    return `
      <div class="prod">
        <div class="prod-texto">
          <strong>${esc(p.nombre)}</strong>
          <p>${esc(p.desc)}</p>
          <div class="prod-precio">
            <span>${dinero(p.precio)}</span>
            ${p.popular ? `<span class="tag">Popular</span>` : ""}
          </div>
        </div>
        <div class="prod-media">
          <span class="prod-tile" style="background:${l.color}14;color:${l.color}">${ico(p.icono, 28)}</span>
          ${
            cant
              ? stepper(l.id, p.id, cant)
              : `<button class="btn-mas" data-action="agregar" data-local="${l.id}" data-prod="${p.id}" aria-label="Agregar ${esc(p.nombre)}">${ico("plus", 18)}</button>`
          }
        </div>
      </div>`;
  }

  function vistaCarrito() {
    const l = getLocal(S.carrito.local);
    if (!l || !S.carrito.items.length) {
      return telefono(`
        ${encabezado("Tu carrito")}
        <div class="vacio grande">
          <span class="vacio-ico">${ico("shopping-bag", 30)}</span>
          <strong>Tu carrito está vacío</strong>
          <p>Elige un local y agrega lo que se te antoje.</p>
          <a href="#/inicio" class="btn btn-primario">Ver locales</a>
        </div>`);
    }
    const sub = subtotalCarrito();
    return telefono(
      `
      ${encabezado("Tu carrito", "#/local/" + l.id)}
      <main class="contenido">
        <section class="tarjeta">
          <div class="tarjeta-cab">
            ${tileLocal(l, "chico")}
            <div><strong>${esc(l.nombre)}</strong><span class="sub">Llega en ${esc(l.tiempo)}</span></div>
            <button class="btn-texto rojo" data-action="vaciar">Vaciar</button>
          </div>
          ${S.carrito.items
            .map((i) => {
              const p = getProducto(l.id, i.id);
              if (!p) return "";
              return `
              <div class="item">
                <div class="item-texto">
                  <strong>${esc(p.nombre)}</strong>
                  <span class="sub">${dinero(p.precio * i.cant)}</span>
                </div>
                ${stepper(l.id, p.id, i.cant)}
              </div>`;
            })
            .join("")}
          <a href="#/local/${l.id}" class="btn-texto">${ico("plus", 16)} Agregar más productos</a>
        </section>

        <section class="tarjeta">
          <label class="campo"><span>Instrucciones para el local</span>
            <textarea rows="2" placeholder="Opcional. Ej. sin cebolla, leche de almendra…" data-campo="nota">${esc(S.carrito.nota || "")}</textarea>
          </label>
        </section>

        <section class="tarjeta resumen">
          <div><span>Subtotal</span><span>${dinero(sub)}</span></div>
          <div><span>Envío a tu salón</span><span>${dinero(APP.envio)}</span></div>
          <div class="total"><span>Total</span><span>${dinero(sub + APP.envio)}</span></div>
        </section>
      </main>
    `,
      {
        tabs: false,
        barraCarrito: false,
        pie: `<a href="#/checkout" class="btn btn-primario btn-bloque btn-grande btn-reparto"><span>Continuar</span><span>${dinero(sub + APP.envio)}</span></a>`,
      }
    );
  }

  function horasDisponibles() {
    const ahora = new Date();
    const minimo = ahora.getHours() + (ahora.getMinutes() > 15 ? 2 : 1);
    const hoy = HORAS_ENTREGA.filter((h) => parseInt(h, 10) >= minimo).map((h) => "Hoy " + h);
    const manana = HORAS_ENTREGA.map((h) => "Mañana " + h);
    return hoy.concat(manana);
  }

  function vistaCheckout() {
    const l = getLocal(S.carrito.local);
    if (!l || !S.carrito.items.length) {
      location.hash = "#/carrito";
      return "";
    }
    if (!l.abierto && S.checkout.cuando === "ahora") S.checkout.cuando = "programar";
    const horas = horasDisponibles();
    if (!horas.includes(S.checkout.hora)) S.checkout.hora = horas[0];
    const sub = subtotalCarrito();
    const programar = S.checkout.cuando === "programar";

    const metodo = (valor, icono, titulo, detalle) => `
      <label class="metodo ${S.checkout.pago === valor ? "activo" : ""}">
        <span class="metodo-ico">${ico(icono, 20)}</span>
        <span class="metodo-texto"><strong>${titulo}</strong><small>${detalle}</small></span>
        <input type="radio" name="pago" value="${valor}" data-checkout="pago" ${S.checkout.pago === valor ? "checked" : ""}>
        <span class="radio"></span>
      </label>`;

    return telefono(
      `
      ${encabezado("Confirmar pedido", "#/carrito")}
      <main class="contenido">
        <section class="tarjeta">
          <h3 class="tarjeta-titulo">¿Cuándo?</h3>
          <div class="segmentado">
            <button class="${!programar ? "activo" : ""}" data-action="cuando" data-v="ahora" ${l.abierto ? "" : "disabled"}>${ico("zap", 16)} Lo antes posible</button>
            <button class="${programar ? "activo" : ""}" data-action="cuando" data-v="programar">${ico("calendar-clock", 16)} Programar</button>
          </div>
          ${
            programar
              ? `<div class="horas">
                  ${horas
                    .map((h) => {
                      const [dia, hora] = h.split(" ");
                      return `<button class="hora ${h === S.checkout.hora ? "activo" : ""}" data-action="hora" data-v="${esc(h)}"><small>${dia}</small>${hora}</button>`;
                    })
                    .join("")}
                </div>`
              : `<p class="nota-info">${ico("clock", 15)} Llega en ${esc(l.tiempo)} a tu salón.</p>`
          }
        </section>

        <section class="tarjeta">
          <h3 class="tarjeta-titulo">¿A qué salón?</h3>
          <span class="etiqueta-campo">Edificio</span>
          ${chipsEdificio()}
          <label class="campo"><span>Número de salón</span>
            <input type="text" inputmode="numeric" maxlength="5" placeholder="Ej. 204" value="${esc(S.salon.numero)}" data-salon="numero">
          </label>
        </section>

        <section class="tarjeta">
          <h3 class="tarjeta-titulo">Pago</h3>
          <div class="metodos">
            ${metodo("efectivo", "banknote", "Efectivo", "Pagas al recibir")}
            ${metodo("tarjeta", "credit-card", "Tarjeta", "Terminal al entregar")}
            ${metodo("transferencia", "smartphone", "Transferencia", "Te mandamos los datos")}
          </div>
        </section>

        <section class="tarjeta resumen">
          <div><span>${cantidadCarrito()} productos de ${esc(l.nombre)}</span><span>${dinero(sub)}</span></div>
          <div><span>Envío</span><span>${dinero(APP.envio)}</span></div>
          <div class="total"><span>Total</span><span>${dinero(sub + APP.envio)}</span></div>
        </section>
      </main>
    `,
      {
        tabs: false,
        barraCarrito: false,
        pie: `<button class="btn btn-primario btn-bloque btn-grande btn-reparto" data-action="pedir"><span>${programar ? "Programar pedido" : "Hacer pedido"}</span><span>${dinero(sub + APP.envio)}</span></button>`,
      }
    );
  }

  function vistaPedido(id) {
    const p = S.pedidos.find((x) => String(x.id) === String(id));
    if (!p) return telefono(`${encabezado("Pedido", "#/pedidos")}<p class="vacio">No encontramos este pedido.</p>`);
    const l = getLocal(p.local);

    let titulo, subtitulo, icono, clase;
    if (p.cancelado) {
      [titulo, subtitulo, icono, clase] = ["Pedido cancelado", "No se te hizo ningún cargo.", "x", "gris"];
    } else if (p.estado === -1) {
      [titulo, subtitulo, icono, clase] = ["Pedido programado", `Lo recibirás ${p.hora.toLowerCase()} en el salón ${p.salon}.`, "calendar-clock", "azul"];
    } else if (p.estado === 3) {
      [titulo, subtitulo, icono, clase] = ["Pedido entregado", `Se entregó en el salón ${p.salon}. ¡Buen provecho!`, "circle-check", "verde"];
    } else {
      titulo = ESTADO_TITULO[p.estado];
      subtitulo = `Llega aprox. a las ${horaCorta(p.creado + 20 * 60000)} · Salón ${p.salon}`;
      icono = ESTADO_ICONO[p.estado];
      clase = "naranja";
    }

    const pasos = ESTADOS.map((e, i) => {
      const hecho = p.estado >= i;
      const actual = p.estado === i;
      return `
        <li class="${hecho ? "hecho" : ""} ${actual ? "actual" : ""}">
          <span class="lt-punto">${hecho ? ico("check", 14) : ""}</span>
          <span class="lt-texto"><strong>${e}</strong><small>${ESTADO_DETALLE[i]}</small></span>
        </li>`;
    }).join("");

    return telefono(`
      ${encabezado("Pedido #" + p.id, "#/pedidos")}
      <main class="contenido">
        <section class="tarjeta estado-hero">
          <span class="estado-ico ${clase}">${ico(icono, 28)}</span>
          <h2>${titulo}</h2>
          <p>${subtitulo}</p>
          ${!p.cancelado && p.estado >= 0 ? progreso(p.estado) : ""}
        </section>

        ${!p.cancelado && p.estado >= 0 ? `<section class="tarjeta"><ol class="linea-tiempo">${pasos}</ol></section>` : ""}

        ${
          p.estado === 3 && !p.cancelado
            ? `<section class="tarjeta centrado">
                <strong>¿Qué tal estuvo?</strong>
                <div class="estrellas">
                  ${[1, 2, 3, 4, 5]
                    .map(
                      (n) =>
                        `<button data-action="calificar" data-id="${p.id}" data-n="${n}" class="${n <= p.calificacion ? "llena" : ""}" aria-label="${n} estrellas">${ico("star", 30)}</button>`
                    )
                    .join("")}
                </div>
                ${p.calificacion ? `<small class="sub">Gracias por calificar.</small>` : ""}
              </section>`
            : ""
        }

        <section class="tarjeta">
          <div class="tarjeta-cab">
            ${tileLocal(l, "chico")}
            <div><strong>${esc(l.nombre)}</strong><span class="sub">${fechaCorta(p.creado)}, ${horaCorta(p.creado)} · ${esc(p.pagoTexto)}</span></div>
          </div>
          ${p.items
            .map((i) => `<div class="linea"><span><b>${i.cant}×</b> ${esc(i.nombre)}</span><span>${dinero(i.precio * i.cant)}</span></div>`)
            .join("")}
          ${p.nota ? `<p class="nota">${esc(p.nota)}</p>` : ""}
          <div class="linea gris"><span>Envío</span><span>${dinero(p.envio)}</span></div>
          <div class="linea total"><span>Total</span><span>${dinero(p.total)}</span></div>
        </section>

        ${!p.cancelado && p.estado <= 0 ? `<button class="btn btn-borde-rojo btn-bloque" data-action="cancelar" data-id="${p.id}">Cancelar pedido</button>` : ""}
        ${p.estado === 3 || p.cancelado ? `<button class="btn btn-oscuro btn-bloque" data-action="repetir" data-id="${p.id}">Pedir lo mismo otra vez</button>` : ""}
      </main>
    `);
  }

  function vistaPedidos() {
    const activos = S.pedidos.filter((p) => p.estado < 3 && !p.cancelado);
    const pasados = S.pedidos.filter((p) => p.estado === 3 || p.cancelado);
    const item = (p) => {
      const l = getLocal(p.local);
      const cuando = p.estado === -1 ? p.hora : `${fechaCorta(p.creado)}, ${horaCorta(p.creado)}`;
      const cant = p.items.reduce((a, i) => a + i.cant, 0);
      return `
        <a class="pedido-fila" href="#/pedido/${p.id}">
          ${tileLocal(l, "chico")}
          <span class="pf-texto">
            <strong>${esc(l.nombre)}</strong>
            <span class="sub">${cant} ${cant === 1 ? "producto" : "productos"} · ${dinero(p.total)}</span>
            <span class="sub">${esc(cuando)} · <span class="nowrap">Salón ${esc(p.salon)}</span></span>
          </span>
          ${pillEstado(p)}
        </a>`;
    };
    return telefono(`
      <header class="titulo-pagina"><h1>Mis pedidos</h1></header>
      <main class="contenido">
        <div class="seccion-cab"><h2>En curso</h2><span>${activos.length}</span></div>
        ${activos.length ? `<div class="lista-pedidos">${activos.map(item).join("")}</div>` : `<p class="vacio">No tienes pedidos en curso.</p>`}
        <div class="seccion-cab"><h2>Historial</h2></div>
        ${pasados.length ? `<div class="lista-pedidos">${pasados.map(item).join("")}</div>` : `<p class="vacio">Aquí aparecerán tus pedidos anteriores.</p>`}
      </main>
    `);
  }

  function vistaPerfil() {
    const u = S.usuario;
    const entregados = S.pedidos.filter((p) => p.estado === 3 && !p.cancelado);
    const gastado = entregados.reduce((a, p) => a + p.total, 0);
    return telefono(`
      <header class="perfil-top">
        <span class="avatar">${esc(iniciales(u.nombre))}</span>
        <div>
          <h1>${esc(u.nombre)}</h1>
          <p>${esc(u.correo)}</p>
        </div>
      </header>
      <main class="contenido">
        <div class="stats">
          <div><strong>${S.pedidos.length}</strong><span>Pedidos</span></div>
          <div><strong>${entregados.length}</strong><span>Entregados</span></div>
          <div><strong>${dinero(gastado)}</strong><span>Gastado</span></div>
        </div>

        <section class="tarjeta">
          <h3 class="tarjeta-titulo">Salón habitual</h3>
          <span class="etiqueta-campo">Edificio</span>
          ${chipsEdificio()}
          <label class="campo"><span>Número de salón</span>
            <input type="text" inputmode="numeric" maxlength="5" value="${esc(S.salon.numero)}" data-salon="numero">
          </label>
        </section>

        <section class="grupo">
          <label class="grupo-fila">
            <span class="gf-ico">${ico("zap", 18)}</span>
            <span class="gf-texto"><strong>Modo demo</strong><small>Los pedidos avanzan solos cada 10 s</small></span>
            <input type="checkbox" class="switch" data-action="auto" ${S.autoAvance ? "checked" : ""}>
          </label>
          <a class="grupo-fila" href="#/panel" target="_blank">
            <span class="gf-ico">${ico("store", 18)}</span>
            <span class="gf-texto"><strong>Panel del local</strong><small>Ábrelo en otra pestaña para mover pedidos</small></span>
            ${ico("chevron-right", 18, "fila-flecha")}
          </a>
          <button class="grupo-fila" data-action="reiniciar">
            <span class="gf-ico">${ico("trash-2", 18)}</span>
            <span class="gf-texto"><strong>Reiniciar demo</strong><small>Borra pedidos y carrito</small></span>
            ${ico("chevron-right", 18, "fila-flecha")}
          </button>
          <button class="grupo-fila rojo" data-action="salir">
            <span class="gf-ico">${ico("log-out", 18)}</span>
            <span class="gf-texto"><strong>Cerrar sesión</strong></span>
          </button>
        </section>
        <p class="version">${esc(APP.nombre)} · versión 0.2</p>
      </main>
    `);
  }

  function vistaPanel() {
    const filtro = sessionGet("panelLocal") || "todos";
    const lista = S.pedidos.filter((p) => filtro === "todos" || p.local === filtro);
    const hoy = new Date().toDateString();
    const deHoy = lista.filter((p) => new Date(p.creado).toDateString() === hoy && !p.cancelado);
    const ventas = deHoy.reduce((a, p) => a + p.total, 0);
    const enCocina = lista.filter((p) => (p.estado === 0 || p.estado === 1) && !p.cancelado).length;
    const programados = lista.filter((p) => p.estado === -1 && !p.cancelado).length;

    const accion = (p) => {
      if (p.cancelado || p.estado === 3) return `<span class="sub">—</span>`;
      const textos = { "-1": "Pasar a cocina", 0: "Empezar a preparar", 1: "Mandar al salón", 2: "Marcar entregado" };
      return `<button class="btn btn-chico ${p.estado === 2 ? "btn-oscuro" : "btn-primario"}" data-action="avanzar" data-id="${p.id}">${textos[p.estado]}</button>`;
    };

    return `
      <div class="panel">
        <header class="panel-top">
          <div class="panel-marca">${logo()} <span>Panel de locales</span></div>
          <div class="panel-acciones">
            <select data-panel-local>
              <option value="todos">Todos los locales</option>
              ${LOCALES.map((l) => `<option value="${l.id}" ${filtro === l.id ? "selected" : ""}>${esc(l.nombre)}</option>`).join("")}
            </select>
            ${S.usuario ? `<a class="btn btn-chico btn-borde-blanco" href="#/inicio">Ir a la app</a>` : ""}
          </div>
        </header>
        <main class="panel-contenido">
          <div class="panel-stats">
            <div><span>Pedidos de hoy</span><strong>${deHoy.length}</strong></div>
            <div><span>En cocina</span><strong>${enCocina}</strong></div>
            <div><span>Programados</span><strong>${programados}</strong></div>
            <div><span>Ventas de hoy</span><strong>${dinero(ventas)}</strong></div>
          </div>
          <div class="panel-tabla-caja">
            <h2>Pedidos</h2>
            ${
              lista.length
                ? `<table class="panel-tabla">
                <thead><tr><th>#</th><th>Alumno</th><th>Local</th><th>Productos</th><th>Salón</th><th>Entrega</th><th>Total</th><th>Estado</th><th></th></tr></thead>
                <tbody>
                  ${lista
                    .map((p) => {
                      const l = getLocal(p.local);
                      return `<tr>
                        <td><strong>${p.id}</strong></td>
                        <td>${esc(p.alumno)}</td>
                        <td class="nowrap"><span class="punto-color" style="background:${l.color}"></span>${esc(l.nombre)}</td>
                        <td class="celda-productos">${p.items.map((i) => `${i.cant}× ${esc(i.nombre)}`).join("<br>")}${p.nota ? `<br><em>“${esc(p.nota)}”</em>` : ""}</td>
                        <td class="nowrap"><strong>${esc(p.salon)}</strong></td>
                        <td>${p.cuando === "programar" ? esc(p.hora) : "Lo antes posible"}</td>
                        <td>${dinero(p.total)}<br><small class="sub">${esc(p.pagoTexto)}</small></td>
                        <td>${pillEstado(p)}</td>
                        <td>${accion(p)}</td>
                      </tr>`;
                    })
                    .join("")}
                </tbody>
              </table>`
                : `<p class="vacio">Todavía no hay pedidos. Haz uno desde la app del alumno.</p>`
            }
          </div>
          <p class="sub panel-nota">Deja esta pestaña abierta junto a la app; se actualiza sola.</p>
        </main>
      </div>`;
  }

  function sessionGet(k) {
    try {
      return sessionStorage.getItem(k);
    } catch (e) {
      return null;
    }
  }
  function sessionSet(k, v) {
    try {
      sessionStorage.setItem(k, v);
    } catch (e) {
      /* nada */
    }
  }

  /* ---------- Acciones ---------- */
  function agregar(localId, prodId) {
    if (S.carrito.local && S.carrito.local !== localId && S.carrito.items.length) {
      const otro = getLocal(S.carrito.local);
      if (!confirm(`Tu carrito tiene productos de ${otro.nombre}. ¿Quieres vaciarlo y empezar uno nuevo?`)) return;
      S.carrito = { local: null, items: [], nota: "" };
    }
    S.carrito.local = localId;
    const it = S.carrito.items.find((i) => i.id === prodId);
    if (it) it.cant++;
    else S.carrito.items.push({ id: prodId, cant: 1 });
    guardar();
    render();
    toast("Agregado al carrito");
  }

  function quitar(prodId) {
    const it = S.carrito.items.find((i) => i.id === prodId);
    if (!it) return;
    it.cant--;
    if (it.cant <= 0) S.carrito.items = S.carrito.items.filter((i) => i.id !== prodId);
    if (!S.carrito.items.length) S.carrito.local = null;
    guardar();
    render();
  }

  function hacerPedido() {
    const l = getLocal(S.carrito.local);
    if (!S.salon.numero.trim()) {
      alert("Escribe el número de tu salón.");
      return;
    }
    const programado = S.checkout.cuando === "programar";
    const pagos = { efectivo: "Efectivo", tarjeta: "Tarjeta", transferencia: "Transferencia" };
    const sub = subtotalCarrito();
    const siguienteId = S.pedidos.reduce((m, p) => Math.max(m, p.id), 1040) + 1;
    const pedido = {
      id: siguienteId,
      local: l.id,
      alumno: S.usuario.nombre,
      items: S.carrito.items.map((i) => {
        const p = getProducto(l.id, i.id);
        return { id: p.id, nombre: p.nombre, precio: p.precio, cant: i.cant };
      }),
      nota: (S.carrito.nota || "").trim(),
      envio: APP.envio,
      total: sub + APP.envio,
      salon: salonTexto(),
      cuando: S.checkout.cuando,
      hora: programado ? S.checkout.hora : "",
      pagoTexto: pagos[S.checkout.pago],
      estado: programado ? -1 : 0,
      cancelado: false,
      calificacion: 0,
      creado: Date.now(),
      ultimoCambio: Date.now(),
    };
    S.pedidos.unshift(pedido);
    S.carrito = { local: null, items: [], nota: "" };
    S.checkout.cuando = "ahora";
    guardar();
    location.hash = "#/pedido/" + pedido.id;
    toast(programado ? "Pedido programado" : "Pedido enviado");
  }

  const buscarPedido = (id) => S.pedidos.find((x) => String(x.id) === String(id));

  const acciones = {
    demo() {
      S.usuario = { nombre: "Alumno Demo", correo: "alumno.demo@" + APP.dominioCorreo };
      guardar();
      location.hash = "#/inicio";
    },
    categoria(d) {
      S.categoria = d.id;
      guardar();
      render();
    },
    seccion(d, el) {
      const destino = document.getElementById("sec-" + d.i);
      if (destino) destino.scrollIntoView({ behavior: "smooth", block: "start" });
      el.parentElement.querySelectorAll("button").forEach((b) => b.classList.toggle("activo", b === el));
    },
    agregar(d) {
      agregar(d.local, d.prod);
    },
    mas(d) {
      agregar(d.local, d.prod);
    },
    menos(d) {
      quitar(d.prod);
    },
    vaciar() {
      if (!confirm("¿Vaciar el carrito?")) return;
      S.carrito = { local: null, items: [], nota: "" };
      guardar();
      render();
    },
    cuando(d) {
      S.checkout.cuando = d.v;
      guardar();
      render();
    },
    hora(d) {
      S.checkout.hora = d.v;
      guardar();
      render();
    },
    edificio(d) {
      S.salon.edificio = d.v;
      guardar();
      render();
    },
    pedir: hacerPedido,
    cancelar(d) {
      const p = buscarPedido(d.id);
      if (!p || !confirm("¿Seguro que quieres cancelar el pedido?")) return;
      p.cancelado = true;
      guardar();
      render();
    },
    calificar(d) {
      buscarPedido(d.id).calificacion = Number(d.n);
      guardar();
      render();
    },
    repetir(d) {
      const p = buscarPedido(d.id);
      S.carrito = { local: p.local, items: p.items.map((i) => ({ id: i.id, cant: i.cant })), nota: p.nota || "" };
      guardar();
      location.hash = "#/carrito";
    },
    avanzar(d) {
      const p = buscarPedido(d.id);
      if (!p || p.estado >= 3) return;
      p.estado++;
      p.ultimoCambio = Date.now();
      guardar();
      render();
    },
    reiniciar() {
      if (!confirm("Se borrarán todos los pedidos y el carrito. ¿Continuar?")) return;
      const usuario = S.usuario;
      S = inicial();
      S.usuario = usuario;
      guardar();
      render();
      toast("Demo reiniciada");
    },
    salir() {
      S.usuario = null;
      guardar();
      location.hash = "#/login";
    },
  };

  /* ---------- Eventos ---------- */
  document.addEventListener("click", (e) => {
    const el = e.target.closest("[data-action],[data-go]");
    if (!el) return;
    if (el.dataset.go) {
      location.hash = el.dataset.go;
      return;
    }
    if (el.dataset.action === "auto") return; // lo maneja "change"
    const fn = acciones[el.dataset.action];
    if (fn) {
      e.preventDefault();
      fn(el.dataset, el);
    }
  });

  document.addEventListener("submit", (e) => {
    const f = e.target;
    if (f.dataset.form !== "login") return;
    e.preventDefault();
    const correo = f.correo.value.trim();
    const nombre = correo
      .split("@")[0]
      .split(/[._-]/)
      .filter(Boolean)
      .map((x) => x[0].toUpperCase() + x.slice(1))
      .join(" ");
    S.usuario = { nombre: nombre || "Alumno", correo };
    guardar();
    location.hash = "#/inicio";
  });

  document.addEventListener("change", (e) => {
    const t = e.target;
    if (t.dataset.checkout) {
      S.checkout[t.dataset.checkout] = t.value;
      guardar();
      render();
    } else if (t.dataset.action === "auto") {
      S.autoAvance = t.checked;
      guardar();
      toast(S.autoAvance ? "Modo demo activado" : "Modo demo apagado");
    } else if (t.hasAttribute("data-panel-local")) {
      sessionSet("panelLocal", t.value);
      render();
    }
  });

  document.addEventListener("input", (e) => {
    const t = e.target;
    if (t.hasAttribute("data-buscar")) {
      const q = t.value.trim().toLowerCase();
      let visibles = 0;
      document.querySelectorAll(".local-fila").forEach((c) => {
        const ok = !q || c.dataset.texto.includes(q);
        c.classList.toggle("oculto", !ok);
        if (ok) visibles++;
      });
      const vacio = document.querySelector("[data-sin-resultados]");
      if (vacio) vacio.classList.toggle("oculto", visibles > 0);
    } else if (t.dataset.salon === "numero") {
      S.salon.numero = t.value.replace(/[^0-9A-Za-z]/g, "");
      guardar();
    } else if (t.dataset.campo === "nota") {
      S.carrito.nota = t.value;
      guardar();
    }
  });

  window.addEventListener("hashchange", () => {
    render();
    window.scrollTo(0, 0);
  });

  // Sincroniza la app del alumno con el panel abierto en otra pestaña.
  window.addEventListener("storage", (e) => {
    if (e.key !== LS_KEY) return;
    S = cargar();
    if (!estaEscribiendo()) render();
  });

  function estaEscribiendo() {
    const a = document.activeElement;
    return a && (a.tagName === "INPUT" || a.tagName === "TEXTAREA" || a.tagName === "SELECT");
  }

  // Modo demo: los pedidos "Lo antes posible" avanzan solos.
  setInterval(() => {
    if (!S.autoAvance) return;
    const ahora = Date.now();
    let cambio = false;
    S.pedidos.forEach((p) => {
      if (!p.cancelado && p.estado >= 0 && p.estado < 3 && ahora - p.ultimoCambio > AVANCE_MS) {
        p.estado++;
        p.ultimoCambio = ahora;
        cambio = true;
      }
    });
    if (!cambio) return;
    guardar();
    const pag = ruta()[0];
    if (["pedido", "pedidos", "inicio", "panel"].includes(pag) && !estaEscribiendo()) render();
  }, 1500);

  /* ---------- Arranque ---------- */
  document.title = `${APP.nombre} · ${APP.lema}`;
  render();
})();
