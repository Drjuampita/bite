/* =========================================================
   APP (alumno + panel del local)
   Vanilla JS, sin dependencias. Los datos viven en localStorage.
   ========================================================= */
(function () {
  "use strict";

  const LS_KEY = "app_comida_campus_v1";
  const ESTADOS = ["Recibido", "Preparando", "En camino", "Entregado"];
  const ESTADO_EMOJI = ["📝", "👨‍🍳", "🛵", "✅"];
  const AVANCE_MS = 10000; // en modo demo, cada pedido avanza solo cada 10 s

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
  const horaCorta = (ts) =>
    new Date(ts).toLocaleTimeString("es-MX", { hour: "numeric", minute: "2-digit" });
  const fechaCorta = (ts) =>
    new Date(ts).toLocaleDateString("es-MX", { day: "numeric", month: "short" });

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
    const { tabs = true, barraCarrito = true } = opciones;
    const [pag] = ruta();
    const mostrarBarra = barraCarrito && cantidadCarrito() > 0;
    return `
      <div class="telefono ${tabs ? "con-tabs" : ""} ${mostrarBarra ? "con-barra" : ""}">
        ${contenido}
        ${mostrarBarra ? barraCarritoHtml() : ""}
        ${tabs ? barraTabs(pag) : ""}
      </div>`;
  }

  function barraCarritoHtml() {
    const l = getLocal(S.carrito.local);
    return `
      <button class="barra-carrito" data-go="#/carrito">
        <span class="barra-carrito-cant">${cantidadCarrito()}</span>
        <span class="barra-carrito-texto">Ver carrito<small>${esc(l ? l.nombre : "")}</small></span>
        <span class="barra-carrito-total">${dinero(subtotalCarrito())}</span>
      </button>`;
  }

  function barraTabs(pag) {
    const activos = S.pedidos.filter((p) => p.estado < 3 && !p.cancelado).length;
    const tab = (id, ruta, icono, texto, badge) => `
      <a href="${ruta}" class="tab ${pag === id ? "activo" : ""}">
        ${icono}
        ${badge ? `<span class="tab-badge">${badge}</span>` : ""}
        <span>${texto}</span>
      </a>`;
    return `
      <nav class="tabs">
        ${tab("inicio", "#/inicio", ICONOS.casa, "Inicio")}
        ${tab("pedidos", "#/pedidos", ICONOS.recibo, "Pedidos", activos)}
        ${tab("perfil", "#/perfil", ICONOS.usuario, "Perfil")}
      </nav>`;
  }

  function encabezadoSimple(titulo, volver = "#/inicio") {
    return `
      <header class="enc-simple">
        <a href="${volver}" class="btn-volver" aria-label="Volver">${ICONOS.atras}</a>
        <h1>${esc(titulo)}</h1>
      </header>`;
  }

  function pillEstado(p) {
    if (p.cancelado) return `<span class="pill pill-gris">Cancelado</span>`;
    if (p.estado === -1) return `<span class="pill pill-azul">Programado</span>`;
    if (p.estado === 3) return `<span class="pill pill-verde">Entregado</span>`;
    return `<span class="pill pill-naranja">${ESTADOS[p.estado]}</span>`;
  }

  /* ---------- Vistas ---------- */
  function vistaLogin() {
    return `
      <div class="telefono login">
        <div class="login-hero">
          ${logo("logo-grande")}
          <p>${esc(APP.lema)} 🛵</p>
          <div class="login-emojis">🌮 🍔 🍣 🥗 ☕</div>
        </div>
        <form class="login-card" data-form="login">
          <h2>Inicia sesión</h2>
          <p class="texto-gris">Usa tu correo de la universidad.</p>
          <label class="campo">Correo institucional
            <input type="email" name="correo" placeholder="nombre.apellido@${esc(APP.dominioCorreo)}" required>
          </label>
          <label class="campo">Contraseña
            <input type="password" name="pass" placeholder="••••••••" required>
          </label>
          <button class="btn btn-naranja btn-bloque" type="submit">Entrar</button>
          <button class="btn-link" type="button" data-action="demo">Entrar con cuenta de prueba</button>
        </form>
        <p class="login-pie">¿Tienes un local en el campus? <a href="#/panel">Entra al panel</a></p>
      </div>`;
  }

  function vistaInicio() {
    const nombre = S.usuario ? S.usuario.nombre.split(" ")[0] : "";
    const activo = S.pedidos.find((p) => p.estado >= 0 && p.estado < 3 && !p.cancelado);
    const locales = LOCALES.filter((l) => S.categoria === "todo" || l.categorias.includes(S.categoria));

    const banner = activo
      ? (() => {
          const l = getLocal(activo.local);
          return `
          <button class="aviso-pedido" data-go="#/pedido/${activo.id}">
            <span class="aviso-emoji">${ESTADO_EMOJI[activo.estado]}</span>
            <span class="aviso-texto">
              <small>Tu pedido de ${esc(l.nombre)}</small>
              <strong>${ESTADOS[activo.estado]}</strong>
            </span>
            <span class="aviso-ver">Ver ›</span>
          </button>`;
        })()
      : "";

    return telefono(`
      <header class="top">
        <div class="top-fila">
          ${logo()}
          <a class="chip-salon" href="#/perfil">📍 Salón ${esc(salonTexto())}</a>
        </div>
        <p class="saludo">Hola, ${esc(nombre)} 👋</p>
        <h1>¿Qué vas a comer hoy?</h1>
        <label class="buscador">
          ${ICONOS.lupa}
          <input type="search" placeholder="Buscar local o comida" data-buscar>
        </label>
      </header>

      <main class="contenido">
        ${banner}

        <div class="promo">
          <div>
            <strong>Envío a tu salón por ${dinero(APP.envio)}</strong>
            <span>Pide antes de que se acabe tu clase y llega en el receso.</span>
          </div>
          <span class="promo-emoji">🛵</span>
        </div>

        <div class="chips">
          ${CATEGORIAS.map(
            (c) => `
            <button class="chip ${S.categoria === c.id ? "activo" : ""}" data-action="categoria" data-id="${c.id}">
              ${c.emoji} ${esc(c.nombre)}
            </button>`
          ).join("")}
        </div>

        <h2 class="titulo-seccion">Locales del campus <span>${locales.length}</span></h2>
        <div class="lista-locales">
          ${locales.map(tarjetaLocal).join("")}
          <p class="vacio oculto" data-sin-resultados>No encontramos nada con esa búsqueda 😕</p>
        </div>
      </main>
    `);
  }

  function tarjetaLocal(l) {
    const textoBusqueda = [l.nombre, l.tipo, ...(PRODUCTOS[l.id] || []).map((p) => p.nombre)].join(" ").toLowerCase();
    return `
      <a class="tarjeta-local ${l.abierto ? "" : "cerrado"}" href="#/local/${l.id}" data-texto="${esc(textoBusqueda)}">
        <span class="local-emoji" style="background:${l.color}">${l.emoji}</span>
        <span class="local-info">
          <strong>${esc(l.nombre)}</strong>
          <span class="texto-gris">${esc(l.tipo)}</span>
          <span class="local-meta">⭐ ${l.rating} · ${esc(l.tiempo)} · Envío ${dinero(APP.envio)}</span>
        </span>
        <span class="estado-local ${l.abierto ? "abierto" : ""}">${l.abierto ? "Abierto" : "Cerrado"}</span>
      </a>`;
  }

  function vistaLocal(id) {
    const l = getLocal(id);
    if (!l) return telefono(`${encabezadoSimple("Local no encontrado")}<p class="vacio">Este local no existe.</p>`);
    const productos = PRODUCTOS[l.id] || [];
    const secciones = [...new Set(productos.map((p) => p.seccion))];

    return telefono(
      `
      <header class="local-portada" style="background:${l.color}">
        <a href="#/inicio" class="btn-volver flotante" aria-label="Volver">${ICONOS.atras}</a>
        <span class="portada-emoji">${l.emoji}</span>
      </header>
      <section class="local-cabecera">
        <h1>${esc(l.nombre)}</h1>
        <p class="texto-gris">${esc(l.tipo)}</p>
        <div class="local-datos">
          <span>⭐ ${l.rating}</span>
          <span>🕒 ${esc(l.tiempo)}</span>
          <span>📍 ${esc(l.ubicacion)}</span>
        </div>
        <p class="local-horario">Horario: ${esc(l.horario)} ·
          <strong class="${l.abierto ? "txt-verde" : "txt-rojo"}">${l.abierto ? "Abierto ahora" : "Cerrado"}</strong>
        </p>
        ${l.abierto ? "" : `<div class="alerta">Este local está cerrado. Puedes armar tu pedido y programarlo para más tarde.</div>`}
      </section>
      <main class="contenido">
        ${secciones
          .map(
            (s) => `
          <h2 class="titulo-seccion">${esc(s)}</h2>
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
    const control = cant
      ? `<div class="stepper">
           <button data-action="menos" data-local="${l.id}" data-prod="${p.id}" aria-label="Quitar uno">−</button>
           <span>${cant}</span>
           <button data-action="mas" data-local="${l.id}" data-prod="${p.id}" aria-label="Agregar uno">+</button>
         </div>`
      : `<button class="btn btn-chico btn-naranja" data-action="agregar" data-local="${l.id}" data-prod="${p.id}">Agregar</button>`;
    return `
      <div class="producto">
        <span class="producto-emoji">${p.emoji}</span>
        <div class="producto-info">
          <strong>${esc(p.nombre)} ${p.popular ? `<span class="etiqueta">Popular</span>` : ""}</strong>
          <p>${esc(p.desc)}</p>
          <div class="producto-pie">
            <span class="precio">${dinero(p.precio)}</span>
            ${control}
          </div>
        </div>
      </div>`;
  }

  function vistaCarrito() {
    const l = getLocal(S.carrito.local);
    if (!l || !S.carrito.items.length) {
      return telefono(`
        ${encabezadoSimple("Tu carrito")}
        <div class="vacio grande">
          <span>🛒</span>
          <p>Tu carrito está vacío.</p>
          <a href="#/inicio" class="btn btn-naranja">Ver locales</a>
        </div>`);
    }
    const sub = subtotalCarrito();
    return telefono(
      `
      ${encabezadoSimple("Tu carrito", "#/local/" + l.id)}
      <main class="contenido">
        <div class="tarjeta">
          <div class="carrito-local">
            <span class="local-emoji chico" style="background:${l.color}">${l.emoji}</span>
            <div><strong>${esc(l.nombre)}</strong><span class="texto-gris">${esc(l.tiempo)}</span></div>
            <button class="btn-link rojo" data-action="vaciar">Vaciar</button>
          </div>
          ${S.carrito.items
            .map((i) => {
              const p = getProducto(l.id, i.id);
              if (!p) return "";
              return `
              <div class="linea-carrito">
                <span class="producto-emoji chico">${p.emoji}</span>
                <div class="linea-info">
                  <strong>${esc(p.nombre)}</strong>
                  <span class="texto-gris">${dinero(p.precio)} c/u</span>
                </div>
                <div class="stepper">
                  <button data-action="menos" data-local="${l.id}" data-prod="${p.id}" aria-label="Quitar uno">−</button>
                  <span>${i.cant}</span>
                  <button data-action="mas" data-local="${l.id}" data-prod="${p.id}" aria-label="Agregar uno">+</button>
                </div>
              </div>`;
            })
            .join("")}
          <a href="#/local/${l.id}" class="btn-link">+ Agregar más productos</a>
        </div>

        <div class="tarjeta">
          <label class="campo">Instrucciones para el local (opcional)
            <textarea rows="2" placeholder="Ej. sin cebolla, salsa aparte…" data-campo="nota">${esc(S.carrito.nota || "")}</textarea>
          </label>
        </div>

        <div class="tarjeta resumen">
          <div><span>Subtotal</span><span>${dinero(sub)}</span></div>
          <div><span>Envío a tu salón</span><span>${dinero(APP.envio)}</span></div>
          <div class="total"><span>Total</span><span>${dinero(sub + APP.envio)}</span></div>
        </div>

        <a href="#/checkout" class="btn btn-naranja btn-bloque btn-grande">Continuar</a>
      </main>
    `,
      { tabs: false, barraCarrito: false }
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
    const opcion = (grupo, valor, titulo, detalle, deshabilitado = false) => `
      <label class="opcion ${S.checkout[grupo] === valor ? "activa" : ""} ${deshabilitado ? "deshabilitada" : ""}">
        <input type="radio" name="${grupo}" value="${valor}" data-checkout="${grupo}"
          ${S.checkout[grupo] === valor ? "checked" : ""} ${deshabilitado ? "disabled" : ""}>
        <span><strong>${titulo}</strong><small>${detalle}</small></span>
      </label>`;

    return telefono(
      `
      ${encabezadoSimple("Confirmar pedido", "#/carrito")}
      <main class="contenido">
        <div class="tarjeta">
          <h3 class="paso"><span>1</span> ¿Cuándo lo quieres?</h3>
          ${opcion("cuando", "ahora", "Lo antes posible", l.abierto ? `Llega en ${l.tiempo}` : "El local está cerrado", !l.abierto)}
          ${opcion("cuando", "programar", "Programar", "Elige la hora de entrega")}
          ${
            S.checkout.cuando === "programar"
              ? `<label class="campo">Hora de entrega
                  <select data-checkout="hora">
                    ${horas.map((h) => `<option ${h === S.checkout.hora ? "selected" : ""}>${h}</option>`).join("")}
                  </select>
                </label>`
              : ""
          }
        </div>

        <div class="tarjeta">
          <h3 class="paso"><span>2</span> ¿A dónde te lo llevamos?</h3>
          <div class="fila-campos">
            <label class="campo">Edificio
              <select data-salon="edificio">
                ${EDIFICIOS.map((e) => `<option ${e === S.salon.edificio ? "selected" : ""}>${e}</option>`).join("")}
              </select>
            </label>
            <label class="campo">Salón
              <input type="text" inputmode="numeric" maxlength="5" placeholder="Ej. 204" value="${esc(S.salon.numero)}" data-salon="numero">
            </label>
          </div>
        </div>

        <div class="tarjeta">
          <h3 class="paso"><span>3</span> ¿Cómo vas a pagar?</h3>
          ${opcion("pago", "efectivo", "💵 Efectivo", "Pagas al recibir")}
          ${opcion("pago", "tarjeta", "💳 Tarjeta", "Terminal al entregar")}
          ${opcion("pago", "transferencia", "📲 Transferencia", "Te mandamos los datos")}
        </div>

        <div class="tarjeta resumen">
          <div><span>${cantidadCarrito()} productos · ${esc(l.nombre)}</span><span>${dinero(sub)}</span></div>
          <div><span>Envío</span><span>${dinero(APP.envio)}</span></div>
          <div class="total"><span>Total</span><span>${dinero(sub + APP.envio)}</span></div>
        </div>

        <button class="btn btn-naranja btn-bloque btn-grande" data-action="pedir">Hacer pedido · ${dinero(sub + APP.envio)}</button>
      </main>
    `,
      { tabs: false, barraCarrito: false }
    );
  }

  function vistaPedido(id) {
    const p = S.pedidos.find((x) => String(x.id) === String(id));
    if (!p) return telefono(`${encabezadoSimple("Pedido")}<p class="vacio">No encontramos este pedido.</p>`);
    const l = getLocal(p.local);
    const programado = p.estado === -1;

    let titulo, subtitulo, emoji;
    if (p.cancelado) {
      titulo = "Pedido cancelado";
      subtitulo = "No se te hizo ningún cargo.";
      emoji = "❌";
    } else if (programado) {
      titulo = "Pedido programado";
      subtitulo = `Lo recibirás ${p.hora.toLowerCase()} en el salón ${p.salon}.`;
      emoji = "📅";
    } else if (p.estado === 3) {
      titulo = "¡Entregado!";
      subtitulo = `Se entregó en el salón ${p.salon}. ¡Buen provecho!`;
      emoji = "✅";
    } else {
      titulo = ESTADOS[p.estado];
      subtitulo = `Llega aprox. a las ${horaCorta(p.creado + 20 * 60000)} al salón ${p.salon}.`;
      emoji = ESTADO_EMOJI[p.estado];
    }

    const pasos = ESTADOS.map((e, i) => {
      const hecho = !p.cancelado && p.estado >= i;
      const actual = !p.cancelado && p.estado === i;
      return `<li class="${hecho ? "hecho" : ""} ${actual ? "actual" : ""}"><span class="punto">${hecho ? "✓" : i + 1}</span>${e}</li>`;
    }).join("");

    return telefono(`
      ${encabezadoSimple("Pedido #" + p.id, "#/pedidos")}
      <main class="contenido">
        <div class="estado-grande ${p.cancelado ? "cancelado" : ""}">
          <span class="estado-emoji">${emoji}</span>
          <h2>${titulo}</h2>
          <p>${subtitulo}</p>
        </div>

        ${p.cancelado ? "" : `<div class="tarjeta"><ol class="pasos">${pasos}</ol></div>`}

        ${
          p.estado === 3 && !p.cancelado
            ? `<div class="tarjeta centrado">
                <strong>¿Qué tal estuvo?</strong>
                <div class="estrellas">
                  ${[1, 2, 3, 4, 5]
                    .map(
                      (n) =>
                        `<button data-action="calificar" data-id="${p.id}" data-n="${n}" class="${n <= p.calificacion ? "llena" : ""}" aria-label="${n} estrellas">★</button>`
                    )
                    .join("")}
                </div>
                ${p.calificacion ? `<small class="texto-gris">¡Gracias por calificar!</small>` : ""}
              </div>`
            : ""
        }

        <div class="tarjeta">
          <div class="carrito-local">
            <span class="local-emoji chico" style="background:${l.color}">${l.emoji}</span>
            <div><strong>${esc(l.nombre)}</strong><span class="texto-gris">${fechaCorta(p.creado)} · ${horaCorta(p.creado)}</span></div>
          </div>
          ${p.items
            .map((i) => `<div class="linea-simple"><span>${i.cant} × ${esc(i.nombre)}</span><span>${dinero(i.precio * i.cant)}</span></div>`)
            .join("")}
          ${p.nota ? `<p class="nota">📝 ${esc(p.nota)}</p>` : ""}
          <div class="linea-simple"><span>Envío</span><span>${dinero(p.envio)}</span></div>
          <div class="linea-simple total"><span>Total (${esc(p.pagoTexto)})</span><span>${dinero(p.total)}</span></div>
        </div>

        ${
          !p.cancelado && p.estado <= 0
            ? `<button class="btn btn-borde-rojo btn-bloque" data-action="cancelar" data-id="${p.id}">Cancelar pedido</button>`
            : ""
        }
        ${
          p.estado === 3 || p.cancelado
            ? `<button class="btn btn-azul btn-bloque" data-action="repetir" data-id="${p.id}">Pedir lo mismo otra vez</button>`
            : ""
        }
      </main>
    `);
  }

  function vistaPedidos() {
    const activos = S.pedidos.filter((p) => p.estado < 3 && !p.cancelado);
    const pasados = S.pedidos.filter((p) => p.estado === 3 || p.cancelado);
    const item = (p) => {
      const l = getLocal(p.local);
      const cuando = p.estado === -1 ? p.hora : `${fechaCorta(p.creado)} · ${horaCorta(p.creado)}`;
      return `
        <a class="tarjeta-pedido" href="#/pedido/${p.id}">
          <span class="local-emoji chico" style="background:${l.color}">${l.emoji}</span>
          <span class="local-info">
            <strong>${esc(l.nombre)}</strong>
            <span class="texto-gris">${esc(cuando)} · <span class="nowrap">Salón ${esc(p.salon)}</span></span>
            <span class="local-meta">${p.items.reduce((a, i) => a + i.cant, 0)} productos · ${dinero(p.total)}</span>
          </span>
          ${pillEstado(p)}
        </a>`;
    };
    return telefono(`
      <header class="top top-chico"><h1>Mis pedidos</h1></header>
      <main class="contenido">
        <h2 class="titulo-seccion">En curso <span>${activos.length}</span></h2>
        ${activos.length ? activos.map(item).join("") : `<p class="vacio">No tienes pedidos en curso.</p>`}
        <h2 class="titulo-seccion">Historial</h2>
        ${pasados.length ? pasados.map(item).join("") : `<p class="vacio">Aquí aparecerán tus pedidos anteriores.</p>`}
      </main>
    `);
  }

  function vistaPerfil() {
    const u = S.usuario;
    const iniciales = u.nombre
      .split(" ")
      .map((x) => x[0])
      .join("")
      .slice(0, 2)
      .toUpperCase();
    const entregados = S.pedidos.filter((p) => p.estado === 3 && !p.cancelado);
    const gastado = entregados.reduce((a, p) => a + p.total, 0);
    return telefono(`
      <header class="top top-perfil">
        <span class="avatar">${esc(iniciales)}</span>
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

        <div class="tarjeta">
          <h3 class="paso">📍 Salón habitual</h3>
          <div class="fila-campos">
            <label class="campo">Edificio
              <select data-salon="edificio">
                ${EDIFICIOS.map((e) => `<option ${e === S.salon.edificio ? "selected" : ""}>${e}</option>`).join("")}
              </select>
            </label>
            <label class="campo">Salón
              <input type="text" inputmode="numeric" maxlength="5" value="${esc(S.salon.numero)}" data-salon="numero">
            </label>
          </div>
        </div>

        <div class="tarjeta lista-opciones">
          <label class="fila-opcion">
            <span><strong>Modo demo</strong><small>Los pedidos avanzan solos cada 10 segundos</small></span>
            <input type="checkbox" class="switch" data-action="auto" ${S.autoAvance ? "checked" : ""}>
          </label>
          <a class="fila-opcion" href="#/panel" target="_blank">
            <span><strong>Panel del local</strong><small>Ábrelo en otra pestaña para mover los pedidos</small></span>
            <span>›</span>
          </a>
          <button class="fila-opcion" data-action="reiniciar">
            <span><strong>Reiniciar demo</strong><small>Borra pedidos y carrito</small></span>
            <span>›</span>
          </button>
        </div>

        <button class="btn btn-borde-rojo btn-bloque" data-action="salir">Cerrar sesión</button>
        <p class="version">${esc(APP.nombre)} · versión 0.1 (demo)</p>
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
      if (p.cancelado || p.estado === 3) return `<span class="texto-gris">—</span>`;
      const textos = { "-1": "Pasar a cocina", 0: "Empezar a preparar", 1: "Mandar al salón", 2: "Marcar entregado" };
      return `<button class="btn btn-chico ${p.estado === 2 ? "btn-azul" : "btn-naranja"}" data-action="avanzar" data-id="${p.id}">${textos[p.estado]}</button>`;
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
                        <td>${l.emoji} ${esc(l.nombre)}</td>
                        <td class="celda-productos">${p.items.map((i) => `${i.cant}× ${esc(i.nombre)}`).join("<br>")}${p.nota ? `<br><em>“${esc(p.nota)}”</em>` : ""}</td>
                        <td class="nowrap"><strong>${esc(p.salon)}</strong></td>
                        <td>${p.cuando === "programar" ? esc(p.hora) : "Lo antes posible"}</td>
                        <td>${dinero(p.total)}<br><small class="texto-gris">${esc(p.pagoTexto)}</small></td>
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
          <p class="texto-gris panel-nota">Tip: deja esta pestaña abierta junto a la app; se actualiza sola.</p>
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
    toast("Agregado al carrito ✓");
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
    toast(programado ? "¡Pedido programado! 📅" : "¡Pedido enviado! 🎉");
  }

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
    pedir: hacerPedido,
    cancelar(d) {
      const p = S.pedidos.find((x) => String(x.id) === d.id);
      if (!p || !confirm("¿Seguro que quieres cancelar el pedido?")) return;
      p.cancelado = true;
      guardar();
      render();
    },
    calificar(d) {
      const p = S.pedidos.find((x) => String(x.id) === d.id);
      p.calificacion = Number(d.n);
      guardar();
      render();
    },
    repetir(d) {
      const p = S.pedidos.find((x) => String(x.id) === d.id);
      S.carrito = { local: p.local, items: p.items.map((i) => ({ id: i.id, cant: i.cant })), nota: p.nota || "" };
      guardar();
      location.hash = "#/carrito";
    },
    avanzar(d) {
      const p = S.pedidos.find((x) => String(x.id) === d.id);
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
    } else if (t.dataset.salon === "edificio") {
      S.salon.edificio = t.value;
      guardar();
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
      document.querySelectorAll(".tarjeta-local").forEach((c) => {
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

  /* ---------- Íconos ---------- */
  const svg = (d) =>
    `<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${d}</svg>`;
  const ICONOS = {
    casa: svg('<path d="M3 10.5 12 3l9 7.5V20a1 1 0 0 1-1 1h-5v-6h-6v6H4a1 1 0 0 1-1-1z"/>'),
    recibo: svg('<path d="M6 2h12v20l-3-2-3 2-3-2-3 2z"/><path d="M9 7h6M9 11h6M9 15h4"/>'),
    usuario: svg('<circle cx="12" cy="8" r="4"/><path d="M4 21c0-4 4-6 8-6s8 2 8 6"/>'),
    atras: svg('<path d="M15 18l-6-6 6-6"/>'),
    lupa: svg('<circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/>'),
  };

  /* ---------- Arranque ---------- */
  document.title = `${APP.nombre} · ${APP.lema}`;
  render();
})();
