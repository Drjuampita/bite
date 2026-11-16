# Leverance Walk · Contexto del proyecto

Documento de referencia con todo lo que se ha definido y desarrollado hasta ahora: concepto, diseño, pantallas, reglas, cómo está hecha la app, menús y pendientes.

> **Sobre el nombre:** "Leverance Walk" es el nombre de trabajo del proyecto (falta confirmar cómo se escribe). Dentro de la app y en los mockups todavía aparece **"Recreo"**, que es un nombre provisional. Se cambia en una línea: `APP.nombre` en `js/data.js`. Después hay que volver a generar los mockups (ver sección 9).

**Versión:** 0.2 (prototipo navegable) · **Última actualización:** noviembre 2026

---

## 1. Resumen

**Qué es:** una app para pedir comida a los locales del campus y recibirla en tu salón, sin salir de clase ni hacer fila en el receso.

**Para quién:** alumnos de la universidad (app en el celular) y locales del campus (panel en computadora).

**Qué resuelve:** entre clases el tiempo no alcanza para salir, hacer fila y regresar. La app permite pedir desde el salón y elegir si el pedido llega lo antes posible o a una hora programada.

**Estado actual:**

| Parte | Estado |
|---|---|
| Concepto y flujo | Listo |
| Diseño visual (v0.2) | Listo: naranja + azul marino, sin emojis |
| App del alumno | Prototipo navegable, 12 pantallas en mockups |
| Panel del local | Prototipo navegable (computadora) |
| Locales y menús | 4 locales con menús y precios aproximados |
| Mockups | 12 pantallas en marco de celular + tablero |
| Servidor, login real y pagos | No hay: los datos viven en el navegador |
| Publicación en internet | No se ha hecho (no tienen dominio todavía) |

---

## 2. Usuarios

| Usuario | Qué hace | Dónde |
|---|---|---|
| **Alumno** | Busca locales, arma su pedido, elige cuándo y a qué salón, paga y sigue su pedido | App en el celular |
| **Local** | Ve los pedidos que llegan y los avanza: a cocina, preparando, en camino, entregado | Panel en computadora (`#/panel`) |

En esta versión no hay una vista de repartidor: el local marca el pedido como entregado desde su panel.

---

## 3. Identidad visual

### Colores

| Uso | Nombre | Color |
|---|---|---|
| Acción principal (botones, activo, progreso) | Naranja | `#F26B1D` |
| Botón presionado, textos de acento | Naranja oscuro | `#D9580E` |
| Fondos de selección | Naranja suave | `#FFF3EA` |
| Texto principal, tarjetas oscuras, chips activos | Azul marino | `#0E1F3F` |
| Variante de marino | Marino 2 | `#1D3260` |
| Fondos suaves de marino | Marino suave | `#EEF1F7` |
| Fondo de la app | Fondo | `#F6F7FA` |
| Líneas y bordes | Borde | `#ECEEF3` |
| Texto secundario | Gris | `#687089` |
| "Abierto", "Entregado" | Verde | `#16A34A` |
| Estrellas | Amarillo | `#F5A524` |
| Cancelar, cerrar sesión | Rojo | `#DC2626` |

Todos están como variables al inicio de `css/styles.css`.

### Tipografía e íconos

- **Tipografía:** Inter (400 a 700), incluida en `fonts/`. Títulos en 700 con espaciado ligeramente cerrado.
- **Íconos:** de línea, de la librería Lucide (grosor 2), guardados en `js/iconos.js`.
- **Sin emojis** en ninguna parte de la interfaz.

### Logo e ícono

- **Logo:** el nombre en minúsculas, en negritas, con un punto naranja al final (`recreo.` mientras se confirma el nombre).
- **Ícono de la app:** tazón blanco con vapor azul marino sobre un cuadro naranja redondeado (`img/icono.svg`). Es provisional.

### Locales

Cada local tiene un color y un ícono propio (no se usan logotipos de las marcas):

| Local | Color | Ícono |
|---|---|---|
| Sinforosa | Terracota `#B85C38` | Croissant |
| Luka Poke | Verde agua `#1F8A80` | Tazón |
| Starbucks | Verde `#0B6B48` | Taza de café |
| Tim Hortons | Rojo `#B5121B` | Dona |

### Estilo

- Encabezados blancos; el azul marino se usa para texto y elementos clave (pedido en curso, barra del carrito, chips activos).
- Tarjetas blancas con esquinas de 16 px y sombra suave; controles con esquinas de 12 px.
- Un solo botón naranja por pantalla para la acción principal; en carrito y confirmación se queda fijo abajo con el total.

---

## 4. Pantallas

| # | Pantalla | Qué muestra | Mockup |
|---|---|---|---|
| 1 | Inicio de sesión | Logo, lema, correo institucional, contraseña, "Entrar con cuenta de prueba" y acceso al panel del local | `mockups/01-login.png` |
| 2 | Inicio | Salón de entrega, saludo, buscador, pedido en curso con barra de progreso, promo de envío, categorías y lista de locales | `mockups/02-inicio.png` |
| 3 | Menú · Sinforosa | Banda de color del local, datos (calificación, tiempo, ubicación, horario), pestañas por sección y productos con botón + | `mockups/03-sinforosa.png` |
| 4 | Menú · Luka Poke | Igual, con un producto ya agregado (contador − 1 +) y la barra "Ver carrito" | `mockups/04-luka-poke.png` |
| 5 | Menú · Starbucks | Igual, con carrito de 3 productos | `mockups/05-starbucks.png` |
| 6 | Menú · Tim Hortons | Igual | `mockups/06-tim-hortons.png` |
| 7 | Carrito | Productos con contador, "Agregar más", instrucciones para el local, subtotal, envío y total; botón fijo "Continuar" | `mockups/07-carrito.png` |
| 8 | Confirmar pedido | ¿Cuándo? (Lo antes posible / Programar con horas), ¿A qué salón? (edificio + número), pago (efectivo, tarjeta, transferencia) y resumen | `mockups/08-confirmar-pedido.png` |
| 9 | Seguimiento | Estado actual con ícono, hora aproximada de llegada, barra de progreso, línea de tiempo y detalle del pedido | `mockups/09-seguimiento.png` |
| 10 | Pedido entregado | Estado final, calificación con estrellas y "Pedir lo mismo otra vez" | `mockups/10-entregado.png` |
| 11 | Mis pedidos | Pedidos en curso (incluye programados) e historial | `mockups/11-mis-pedidos.png` |
| 12 | Perfil | Datos del alumno, estadísticas, salón habitual, modo demo, panel del local, reiniciar demo y cerrar sesión | `mockups/12-perfil.png` |
| — | Panel del local | Tabla de pedidos con botones para avanzarlos, filtro por local y resumen del día (no tiene mockup; es para computadora) | — |

`mockups/00-todas-las-pantallas.png` junta las 12 pantallas en un solo tablero.

---

## 5. Flujo del alumno

```
Inicio de sesión (correo institucional o cuenta de prueba)
  └─ Inicio
      ├─ Buscar / filtrar por categoría
      └─ Menú del local
          └─ Agregar productos (+ / −)
              └─ Carrito (instrucciones para el local)
                  └─ Confirmar pedido
                       1. ¿Cuándo?   → Lo antes posible | Programar (hoy o mañana, por hora)
                       2. ¿Dónde?    → Edificio + número de salón
                       3. Pago       → Efectivo | Tarjeta | Transferencia (simulado)
                  └─ Seguimiento → Entregado → Calificar / Pedir otra vez
```

### Estados del pedido

```
Programado* → Recibido → Preparando → En camino → Entregado
                 └──────────→ Cancelado (solo mientras está Programado o Recibido)
```
\* Solo los pedidos programados. El local los pasa a cocina desde su panel.

---

## 6. Reglas de negocio

| Regla | Detalle |
|---|---|
| Un carrito = un local | Si el alumno agrega algo de otro local, la app le pregunta si quiere vaciar el carrito y empezar uno nuevo |
| Costo de envío | $12 fijo por pedido (`APP.envio`) |
| Lo antes posible | Solo si el local está abierto. Muestra el tiempo del local y una hora aproximada de llegada (hora del pedido + 20 min) |
| Programar | Horas en punto de 8:00 a 19:00, hoy o mañana. Para hoy, la primera hora disponible es la siguiente hora en punto, o dos horas después si ya pasaron más de 15 minutos de la hora actual |
| Local cerrado | Se puede ver el menú y armar el pedido, pero solo se puede programar |
| Salón | Edificio (A, B, C, D, Biblioteca) + número de salón. Es obligatorio y se recuerda como salón habitual |
| Pago | Simulado: efectivo al recibir, tarjeta con terminal al entregar o transferencia |
| Cancelar | Solo mientras el pedido está Programado o Recibido |
| Calificar | 1 a 5 estrellas cuando el pedido se entrega |
| Pedir otra vez | Llena el carrito con los mismos productos del pedido |
| Número de pedido | Consecutivo a partir de #1041 |
| Inicio de sesión | Acepta cualquier correo; el nombre se toma del correo (`nombre.apellido@…` → "Nombre Apellido"). No valida contraseña |
| Modo demo | Activado: los pedidos "Lo antes posible" avanzan solos cada 10 segundos. Se apaga en Perfil para moverlos a mano desde el panel |

---

## 7. Cómo está hecha la app

### Tecnología

- **HTML, CSS y JavaScript sin frameworks ni dependencias.** No hay que instalar nada ni compilar.
- Funciona abriendo `index.html` o con cualquier servidor estático.
- Se ve con tamaño de celular en la computadora y a pantalla completa en el teléfono.

### Estructura

```
├── index.html            # Página única
├── css/styles.css        # Estilos y colores (variables en :root)
├── js/
│   ├── data.js           # Nombre de la app, locales, menús, edificios y horas  ← lo que más se edita
│   ├── iconos.js         # Íconos de línea (Lucide)
│   └── app.js            # Lógica: rutas, vistas, carrito, pedidos, panel
├── img/icono.svg         # Ícono de la app
├── fonts/                # Tipografía Inter
├── mockups/              # Imágenes de las 12 pantallas
├── herramientas/
│   └── mockups.js        # Script que genera los mockups
├── README.md             # Cómo correrla
└── CONTEXTO.md           # Este documento
```

### Funcionamiento

- **Rutas con `#`:** `#/login`, `#/inicio`, `#/local/:id`, `#/carrito`, `#/checkout`, `#/pedido/:id`, `#/pedidos`, `#/perfil`, `#/panel`.
- **Estado:** un solo objeto guardado en `localStorage` con la clave `app_comida_campus_v2` (usuario, salón, carrito, opciones del checkout, pedidos, categoría y modo demo).
- **Sincronización:** el panel del local y la app del alumno, abiertos en dos pestañas del mismo navegador, se actualizan solos (evento `storage`).
- **Vistas:** cada pantalla es una función que devuelve HTML; los botones usan `data-action` y un solo manejador de clics.

### Datos de un pedido

| Campo | Ejemplo | Nota |
|---|---|---|
| `id` | 1043 | Consecutivo |
| `local` | `"luka"` | Id del local |
| `alumno` | "Mariana López" | Del inicio de sesión |
| `items` | `[{ id, nombre, precio, cant }]` | Copia de los productos al momento de pedir |
| `nota` | "Sin cebolla, salsa aparte" | Instrucciones para el local |
| `envio`, `total` | 12, 306 | MXN |
| `salon` | "B-204" | Edificio + número |
| `cuando`, `hora` | `"programar"`, "Mañana 9:00" | `"ahora"` deja `hora` vacía |
| `pagoTexto` | "Tarjeta" | |
| `estado` | 1 | −1 programado, 0 recibido, 1 preparando, 2 en camino, 3 entregado |
| `cancelado`, `calificacion` | false, 0 | |
| `creado`, `ultimoCambio` | marcas de tiempo | `ultimoCambio` se usa en el modo demo |

### Datos de un local y un producto

- **Local:** `id`, `nombre`, `tipo`, `icono`, `color`, `tiempo`, `rating`, `ubicacion`, `horario`, `abierto`, `categorias`.
- **Producto:** `id`, `seccion`, `nombre`, `desc`, `precio`, `icono`, `popular` (opcional).
- **Categorías:** Todo, Café, Pokes, Saludable, Baguettes y sándwiches, Repostería.

---

## 8. Correr, presentar, personalizar y publicar

**Correr:** doble clic en `index.html`, o desde la carpeta:

```bash
python3 -m http.server 8000
```

y abrir http://localhost:8000.

**Presentar la demo:**

1. Entrar con la cuenta de prueba y hacer un pedido.
2. Abrir `#/panel` en otra pestaña; se actualiza sola.
3. Con el modo demo activado los pedidos avanzan solos cada 10 s; si se apaga (Perfil), se avanzan desde el panel.
4. "Reiniciar demo" (Perfil) borra pedidos y carrito.

**Personalizar:**

| Qué | Dónde |
|---|---|
| Nombre, lema, dominio del correo y envío | `APP` en `js/data.js` |
| Locales, menús y precios | `LOCALES` y `PRODUCTOS` en `js/data.js` |
| Edificios y horas de entrega | `EDIFICIOS` y `HORAS_ENTREGA` en `js/data.js` |
| Colores | Variables al inicio de `css/styles.css` |
| Ícono de la app | `img/icono.svg` |

**Publicar (cuando tengan dominio):** es un sitio estático. En Vercel, Netlify o GitHub Pages se sube la carpeta tal cual, sin comando de compilación.

---

## 9. Mockups

- 12 pantallas de la app (solo celular), en marco de iPhone con barra de estado, sobre fondo gris claro.
- Se generan con capturas reales de la app, así que siempre coinciden con el código.
- Datos de ejemplo: alumna "Mariana López", salón B-204, hora 12:40, pedidos #1041 a #1044.

**Volver a generarlos** (por ejemplo, después de cambiar el nombre). Necesita Node.js 18 o superior:

```bash
npm install --no-save playwright
```

```bash
npx playwright install chromium
```

```bash
node herramientas/mockups.js
```

Las imágenes quedan en `mockups/`. El título del tablero toma el nombre de `APP.nombre`.

---

## 10. Locales y menús

Los cuatro locales son Sinforosa, Luka Poke, Starbucks y Tim Hortons. **Los menús y precios son aproximados** (MXN): los de Starbucks y Tim Hortons se basan en notas de prensa y precios de referencia de 2025-2026; los de Sinforosa y Luka Poke se armaron con lo que venden (cafetería con baguettes, ensaladas, café y repostería; pokes) y con precios de otros lugares de pokes en Querétaro ($189 a $240). Las ubicaciones, horarios, tiempos y calificaciones son de ejemplo. Todo se ajusta en `js/data.js`.

### Sinforosa

Café, baguettes, ensaladas y repostería. Ubicación de ejemplo: Cafetería central. Horario: 7:00 - 18:00. Tiempo de entrega: 15-20 min. Calificación de ejemplo: 4.8. Color `#B85C38`, ícono `croissant`.

| Sección | Producto | Precio | Descripción |
|---|---|---|---|
| Baguettes | Baguette de pavo y panela (popular) | $115 | Pechuga de pavo, panela, aguacate, jitomate y aderezo de chipotle. |
| Baguettes | Baguette caprese | $110 | Mozzarella fresca, jitomate, albahaca y pesto. |
| Baguettes | Baguette de pollo al pesto | $125 | Pollo a la plancha, pesto, espinaca y queso manchego. |
| Ensaladas | Ensalada César con pollo (popular) | $125 | Lechuga romana, pollo, crutones, parmesano y aderezo César. |
| Ensaladas | Ensalada de frutos rojos | $135 | Mix de hojas, fresa, arándano, queso de cabra, nuez y vinagreta. |
| Café | Americano | $45 | 12 oz. Café de especialidad de la casa. |
| Café | Latte (popular) | $58 | 12 oz. Leche entera, deslactosada o de almendra. |
| Café | Capuchino | $58 | 12 oz con espuma de leche y canela. |
| Café | Chai latte | $65 | Caliente o frío. Especiado y cremoso. |
| Café | Cold brew | $62 | 16 oz, infusionado en frío por 18 horas. |
| Repostería | Croissant de mantequilla | $42 | Horneado cada mañana. |
| Repostería | Rol de canela | $52 | Con glaseado de queso crema. |
| Repostería | Galleta de chispas de chocolate | $35 | Grande, suave por dentro. |
| Repostería | Pay de queso | $68 | Rebanada con mermelada de frutos rojos. |

### Luka Poke

Pokes y bowls. Ubicación de ejemplo: Zona de comida. Horario: 11:00 - 20:00. Tiempo de entrega: 15-25 min. Calificación de ejemplo: 4.7. Color `#1F8A80`, ícono `salad`.

| Sección | Producto | Precio | Descripción |
|---|---|---|---|
| Pokes de la casa | Poke de salmón clásico (popular) | $199 | Arroz de sushi, salmón, aguacate, pepino, edamame, mango y ponzu. |
| Pokes de la casa | Spicy tuna (popular) | $209 | Atún en salsa spicy, arroz, pepino, wakame, cebollín y ajonjolí. |
| Pokes de la casa | Poke de pollo teriyaki | $175 | Pollo teriyaki, arroz, elote, zanahoria, aguacate y cebolla crujiente. |
| Pokes de la casa | Poke de camarón | $195 | Camarón, arroz, mango, pepino, col morada y mayo sriracha. |
| Pokes de la casa | Poke veggie | $165 | Tofu, quinoa, aguacate, edamame, zanahoria y aderezo de ajonjolí. |
| Arma tu poke | Arma tu poke | $179 | Elige base, 1 proteína, 4 toppings, salsa y crunch. Dinos tu combinación en las instrucciones. |
| Extras | Edamames | $55 | Con sal de mar y limón. |
| Extras | Proteína extra | $45 | Salmón, atún, pollo, camarón o tofu. |
| Bebidas | Té helado de la casa | $40 | 500 ml, jazmín con maracuyá. |
| Bebidas | Agua mineral | $30 | 355 ml. |

### Starbucks

Café, Frappuccino y alimentos. Ubicación de ejemplo: Junto a biblioteca. Horario: 7:00 - 21:00. Tiempo de entrega: 10-15 min. Calificación de ejemplo: 4.6. Color `#0B6B48`, ícono `coffee`.

| Sección | Producto | Precio | Descripción |
|---|---|---|---|
| Calientes | Café del día | $42 | Tamaño alto (12 oz). |
| Calientes | Americano | $52 | Tamaño alto. Espresso con agua caliente. |
| Calientes | Latte (popular) | $62 | Tamaño alto. Espresso con leche vaporizada. |
| Calientes | Cappuccino | $62 | Tamaño alto, con espuma abundante. |
| Calientes | Caramel Macchiato | $76 | Vainilla, leche, espresso y caramelo. |
| Calientes | Chai Tea Latte | $70 | Té negro con especias y leche. |
| Calientes | Matcha Latte | $74 | Té verde matcha con leche. |
| Frías | Caramel Frappuccino (popular) | $84 | Tamaño alto, con crema batida y caramelo. |
| Frías | Mocha Frappuccino | $84 | Tamaño alto, café con chocolate y crema batida. |
| Frías | Java Chip Frappuccino | $89 | Tamaño alto, con chispas de chocolate. |
| Frías | Iced Shaken Espresso | $72 | Espresso agitado con hielo y leche de avena. |
| Frías | Cold Brew | $66 | Tamaño alto, infusionado en frío. |
| Alimentos | Croissant de pavo y queso | $79 | Caliente, con pechuga de pavo y queso manchego. |
| Alimentos | Sándwich de pavo y panela | $89 | Pan multigrano, pavo, panela y espinaca. |
| Alimentos | Baguette clásica | $92 | Jamón, queso y aderezo de mostaza. |
| Alimentos | Muffin de moras | $55 | Con moras azules. |
| Alimentos | Brownie | $52 | De chocolate con nuez. |

### Tim Hortons

Café, donas y Timbits. Ubicación de ejemplo: Explanada. Horario: 7:00 - 20:00. Tiempo de entrega: 10-15 min. Calificación de ejemplo: 4.5. Color `#B5121B`, ícono `donut`.

| Sección | Producto | Precio | Descripción |
|---|---|---|---|
| Café | Café Original Blend (popular) | $35 | Mediano (14 oz). El café clásico de la casa. |
| Café | Latte | $52 | Mediano. Espresso con leche vaporizada. |
| Café | French Vanilla | $50 | Mediano. Bebida cremosa sabor vainilla. |
| Café | Matcha Latte | $62 | Mediano, caliente o frío. |
| Fríos | Iced Capp (popular) | $62 | Mediano. Café frappé cremoso. |
| Fríos | Iced Latte | $56 | Mediano, con hielo. |
| Donas y Timbits | Dona glaseada | $24 | La clásica, con glaseado de azúcar. |
| Donas y Timbits | Dona Boston Cream | $28 | Rellena de crema pastelera con cobertura de chocolate. |
| Donas y Timbits | Dona Maple Dip | $28 | Con cobertura de maple. |
| Donas y Timbits | Timbits (10 piezas) (popular) | $55 | Mini donas surtidas. |
| Donas y Timbits | Combo café + dona | $65 | Café Original Blend mediano y dona a elegir. |
| Para comer | Croissant de jamón, huevo y queso | $59 | Recién hecho, servido caliente. |
| Para comer | Grilled cheese | $72 | Pan tostado con queso derretido. |
| Para comer | Muffin de mora azul | $42 | Esponjoso, con moras azules. |


---

## 11. Historial de decisiones

| Versión | Qué cambió |
|---|---|
| 0.1 | Primera versión: app del alumno + panel del local en naranja y azul marino, locales y menús inventados, tipografía Poppins y emojis como imágenes. Mockups incluían el panel. |
| 0.2 | Se pidió una versión más limpia. Locales reales (Sinforosa, Luka Poke, Starbucks, Tim Hortons) con menús aproximados; se quitaron todos los emojis (íconos de línea y un color por local); tipografía Inter; encabezados blancos; selector "Lo antes posible / Programar"; horas y edificios como botones; botón de pagar fijo abajo; seguimiento con barra de progreso y línea de tiempo. Mockups solo de la app del celular. |

Otras decisiones:

- No se publicó en internet todavía (no hay dominio).
- No se usan logotipos de las marcas de los locales.
- Los datos se quedan en el navegador hasta que haya un servidor.

---

## 12. Pendientes

- [ ] Confirmar el nombre ("Leverance Walk") y su ortografía; cambiarlo en `APP.nombre` y regenerar los mockups.
- [ ] Logo e ícono definitivos.
- [ ] Confirmar si el local es "Luka Poke" o "Luca Poke".
- [ ] Menús, precios, horarios y ubicaciones reales de cada local.
- [ ] Dominio de correo de la universidad (`APP.dominioCorreo`), edificios y salones reales.
- [ ] Servidor y base de datos para compartir pedidos entre dispositivos e inicio de sesión real.
- [ ] Pagos reales (si se necesitan para la entrega del proyecto).
- [ ] Publicar en internet cuando haya dominio.

---

## 13. Fuentes de los precios aproximados

- [Merca2.0: alza de precios de Starbucks México](https://www.merca20.com/?p=12467393)
- [Promodescuentos: promoción de bebidas Starbucks 2026](https://www.promodescuentos.com/ofertas/starbucks-rwards-2-bebidas-tamano-alto-por-99-1175582)
- [Merca2.0: combos de café y alimentos de Starbucks](https://www.merca20.com/?p=12585864)
- [Merca2.0: menú de Tim Hortons México](https://www.merca20.com/?p=782614)
- [Fastfoodsmenu: precios de Tim Hortons México](https://fastfoodsmenu.com/precios-menu-tim-hortons-mexico/)
- [Spinach.guide: Luka Pokes (Jurica, Querétaro)](https://spinach.guide/venues/luka-pokes-238915/)
- [Rappi: Hakapoke Querétaro](https://www.rappi.com.mx/restaurantes/1306704475-hakapoke)
- [Rappi: Maca Poke](https://www.rappi.com.mx/restaurantes/1930299415-maca-poke)

---

## 14. Créditos

- Tipografía [Inter](https://rsms.me/inter/) (SIL Open Font License).
- Íconos de [Lucide](https://lucide.dev) (licencia ISC).
- Starbucks y Tim Hortons son marcas de sus respectivos dueños; aquí solo se usan como nombres de locales del campus en un proyecto escolar.
