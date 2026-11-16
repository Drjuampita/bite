# App de comida del campus (naranja + azul marino)

App web para pedir comida a los locales del campus y recibirla en tu salón.
HTML, CSS y JavaScript sin dependencias: no hay que instalar nada.

> "Recreo" es un nombre provisional. Se cambia en una línea (ver abajo).

## Cómo abrirla

Opción rápida: doble clic en `index.html`.

Opción recomendada (servidor local):

```bash
cd app-amigos
python3 -m http.server 8000
```

Luego abre http://localhost:8000. En la computadora se ve con tamaño de celular; en el teléfono ocupa toda la pantalla.

## Pantallas

| Ruta | Qué es |
|---|---|
| `#/login` | Inicio de sesión con correo institucional (o "Entrar con cuenta de prueba") |
| `#/inicio` | Buscador, categorías, pedido en curso y lista de locales |
| `#/local/:id` | Menú del local por secciones, con botón + y contador |
| `#/carrito` | Productos, instrucciones para el local y total |
| `#/checkout` | Cuándo (lo antes posible o programado), salón y forma de pago |
| `#/pedido/:id` | Seguimiento: Recibido, Preparando, En camino, Entregado; calificación y "pedir otra vez" |
| `#/pedidos` | Pedidos en curso e historial |
| `#/perfil` | Salón habitual, modo demo y reinicio de datos |
| `#/panel` | Panel del local (para computadora): tabla de pedidos y botones para avanzarlos |

Los mockups de la app (12 pantallas en marco de celular) están en `mockups/`. `00-todas-las-pantallas.png` las junta todas.

## Locales y menús

Sinforosa, Luka Poke, Starbucks y Tim Hortons. Los menús y precios son **aproximados** (armados con información pública y precios de referencia de 2025-2026) y se ajustan en `js/data.js`. No se usan logotipos de las marcas: cada local tiene un color y un ícono.

## Cómo presentar la demo

1. Entra con la cuenta de prueba y haz un pedido.
2. Abre `#/panel` en otra pestaña: se sincroniza sola con la app.
3. Con el **Modo demo** activado (Perfil), los pedidos avanzan solos cada 10 segundos. Si lo apagas, los avanzas desde el panel.
4. **Reiniciar demo** (Perfil) borra pedidos y carrito.

Los datos se guardan en el navegador (localStorage). No hay servidor ni pagos reales.

## Qué personalizar

| Qué | Dónde |
|---|---|
| Nombre de la app, lema, dominio del correo y costo de envío | `APP` en `js/data.js` |
| Locales, menús y precios | `LOCALES` y `PRODUCTOS` en `js/data.js` |
| Edificios y horas de entrega | `EDIFICIOS` y `HORAS_ENTREGA` en `js/data.js` |
| Colores de marca | Variables `--naranja` y `--marino` al inicio de `css/styles.css` |
| Ícono de la app | `img/icono.svg` |
| Íconos de la interfaz | `js/iconos.js` |

## Publicarla (cuando quieran)

Es un sitio estático: en Vercel se importa la carpeta tal cual, sin comando de build.

## Créditos

- Tipografía Inter (SIL Open Font License), incluida en `fonts/`.
- Íconos de [Lucide](https://lucide.dev) (licencia ISC), en `js/iconos.js`.
