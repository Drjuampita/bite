# 🍽️ Bite

**La primera app de delivery escolar. Tu comida, directo a tu salón.**

Bite resuelve un problema cotidiano en la Universidad Anáhuac Querétaro: salir a buscar comida entre clases y perder el receso en la fila. Con Bite pides a los establecimientos del campus (Sinforosa, Luka, Diego's House, Carrusel y más) y recibes tu pedido en tu salón, **ahora mismo o agendado desde el día anterior**.

> 🎓 Proyecto escolar (Taller de Empresas). MVP enfocado en concepto, experiencia y diseño. No es un producto comercial.

---

## 📌 Estado del proyecto

| Fase | Estado |
|---|---|
| 1. Arquitectura y user flow | ✅ Definido (este documento) |
| 2. Desarrollo del MVP navegable | ✅ Primera versión en `app/` |
| 3. Diseño visual (UI) | 🔄 Base lista, se afina en la fase de diseño |
| 4. Datos reales (menús, horarios, salones) | ⏳ Pendiente |
| 5. Backend en Supabase | ⏳ Esquema listo en `supabase/` |
| 6. Demo y presentación | ⏳ Pendiente |

---

## 🚀 Cómo correr la app

Requisitos: Node.js 20 o superior.

```bash
cd app
npm install
npm run dev
```

Abre http://localhost:3000. En computadora la app se ve centrada con proporción de celular; en el teléfono se ve a pantalla completa y se puede instalar como app (PWA).

### Rutas principales

| Ruta | Quién | Qué es |
|---|---|---|
| `/login` | Alumno | Entrada con correo institucional (o cuenta de demostración) |
| `/inicio` | Alumno | Locales, categorías, pedido activo y "pedir de nuevo" |
| `/local/[id]` | Alumno | Menú del local con opciones por producto |
| `/carrito` → `/checkout` | Alumno | Ahora o agendar, salón y pago |
| `/pedido/[id]` | Alumno | Seguimiento, código de entrega y calificación |
| `/pedidos`, `/perfil` | Alumno | Historial, agendados, salón habitual y ajustes de demo |
| `/panel` | Local | Pedidos nuevos, en preparación, programados por bloque y productos agotados |
| `/repartidor` | Repartidor | Pedidos por recoger y entregas agrupadas por edificio |

### Cómo presentar la demo

1. Abre la app del alumno y el `/panel` en **dos pestañas del mismo navegador**: comparten datos y se actualizan en vivo.
2. En **Perfil → Modo presentación**:
   - *Locales siempre abiertos* permite pedir "Ahora" a cualquier hora (activado por defecto).
   - *Simular avance de pedidos* hace que un pedido inmediato avance solo cada ~12 s. Apágalo si quieres mover el pedido a mano desde el panel del local y la vista del repartidor.
3. *Reiniciar datos de la demo* borra pedidos y carrito antes de presentar.

> Los datos viven en el navegador (localStorage). No hay servidor todavía: es suficiente para la demo y el cambio a Supabase está preparado.

---

## 💡 ¿Qué hace diferente a Bite?

Apps como Rappi o Uber Eats responden *"¿qué quiero y a dónde lo llevan?"*. Bite también responde *"¿en qué clase estoy y cuándo salgo?"*.

1. **La dirección es tu salón**, no un mapa. Eliges edificio y salón (se recuerda el último).
2. **La entrega ocurre en bloques fijos** (recesos o inicio de clase), lo que permite agrupar pedidos.
3. **Agendar es parte central de la experiencia**: pide hoy para mañana a las 10:00 en tu salón.

---

## 👥 Usuarios

| Rol | Qué hace | Nivel de diseño en el MVP |
|---|---|---|
| **Alumno** | Descubre locales, pide, agenda y sigue su pedido | App completa y pulida |
| **Local** | Recibe pedidos agrupados por hora, los marca preparando/listo, activa o desactiva productos | Panel simple |
| **Repartidor** | Ve entregas por salón y marca "entregado" | Vista mínima |

---

## 🧭 User flow del alumno

```
Login (correo institucional)
  └─ Home
      └─ Local (menú)
          └─ Producto
              └─ Carrito
                  └─ Checkout
                       1. ¿Cuándo?  →  Ahora  |  Agendar (día + bloque horario)
                       2. ¿Dónde?   →  Edificio → Salón
                       3. Pago      →  Simulado
                  └─ Confirmación
                      └─ Seguimiento → Entregado → Calificar
```

### Reglas de negocio

- **Un carrito = un local.** Si el alumno agrega algo de otro local, se le avisa.
- **Ahora:** disponible solo si el local está abierto y dentro de su capacidad; si no, se ofrece agendar.
- **Agendar:** hasta el día anterior, antes de la hora de corte del local.
- **Pedir de nuevo:** un toque desde el historial.

### Pantallas del MVP (alumno)

1. Splash y login
2. Home (locales, categorías, próximo pedido agendado)
3. Menú del local
4. Detalle de producto
5. Carrito
6. Checkout (cuándo, dónde, pago)
7. Confirmación
8. Seguimiento del pedido
9. Mis pedidos (activos, agendados, historial)
10. Perfil (salón habitual, horario de clases)

---

## 🔄 Estados del pedido

```
Programado* → Recibido → Preparando → Listo → En camino → Entregado
                              └──────────────→ Cancelado
```
\* Solo para pedidos agendados; pasan a *Recibido* al llegar su ventana de preparación.

---

## 🏗️ Arquitectura

| Capa | Tecnología |
|---|---|
| Frontend | Next.js 16 + React 19 + Tailwind CSS 4, mobile-first, PWA |
| Estado (MVP) | Store propio sobre localStorage, sincronizado entre pestañas (`app/src/lib/store.ts`) |
| Backend / BD | Supabase (Postgres, Auth, Realtime). Esquema en `supabase/migrations/` |
| Pagos | Simulados (tarjeta de prueba o efectivo al recibir) |
| Hosting | Vercel |

### Cómo está organizado el código

```
app/src/
├── app/
│   ├── (alumno)/        # App del alumno con marco de celular
│   │   ├── (tabs)/      # Inicio, Pedidos y Perfil (con barra inferior)
│   │   ├── login/  local/[vendorId]/  carrito/  checkout/  pedido/[orderId]/
│   └── (operacion)/     # Vistas de escritorio: panel del local y repartidor
├── components/          # UI compartida (botones, hojas, tarjetas, línea de tiempo)
└── lib/
    ├── types.ts         # Modelo de dominio (igual al esquema SQL)
    ├── data/            # Locales, menús, bloques de entrega y salones (datos de ejemplo)
    ├── schedule.ts      # Reglas de "Ahora" y de agendado (horarios, hora de corte, anticipación)
    ├── orders.ts        # Máquina de estados del pedido
    └── store.ts         # Acciones: carrito, pedidos, local, demo
```

### Modelo de datos (núcleo)

```
users          (id, nombre, correo, rol, salon_habitual)
vendors        (id, nombre, logo, horario, hora_corte, activo)
products       (id, vendor_id, nombre, precio, foto, categoria, disponible)
delivery_slots (id, etiqueta, hora_inicio, hora_fin)
locations      (id, edificio, piso, salon)
orders         (id, user_id, vendor_id, location_id, tipo, fecha_entrega,
                slot_id, estado, total, creado_en)
order_items    (id, order_id, product_id, cantidad, nota, precio)
```

### Módulos

Auth · Catálogo · Carrito · Checkout y agenda · Pedidos y seguimiento · Panel de local · Vista de repartidor

---

## 🎯 Alcance del MVP

**Incluye:** catálogo de locales y productos, pedido inmediato y agendado, selección de salón, seguimiento por estados, historial, panel básico de local y vista de repartidor.

**No incluye (por ahora):** pagos reales, mapas y GPS, notificaciones push avanzadas, cupones, reseñas detalladas, optimización de rutas.

---

## 🗂️ Estructura del repo

```
bite/
├── README.md
├── app/             # Aplicación Next.js (alumno, local, repartidor)
├── supabase/        # Migraciones de base de datos
└── design/          # Sistema de diseño y assets (fase de diseño)
```

---

## 🛣️ Roadmap

- [x] Definir problema, usuarios y alcance
- [x] Arquitectura y user flow
- [x] Prototipo navegable con datos de ejemplo (10 pantallas del alumno)
- [x] Panel de local y vista de repartidor
- [ ] Sistema de diseño final (colores, tipografía, fotos de producto)
- [ ] Menús, horarios y salones reales
- [ ] Conectar Supabase (cuentas reales y datos compartidos entre dispositivos)
- [ ] Demo final y presentación

---

## ❓ Decisiones abiertas

El MVP usa estos valores provisionales. Cambiarlos es editar un archivo:

| Decisión | Valor provisional | Dónde se cambia |
|---|---|---|
| ¿Quién reparte? | Rol genérico "Repartidor Bite" | `app/src/app/(operacion)/repartidor` |
| Costo de envío | $10 MXN fijo | `DELIVERY_FEE` en `app/src/lib/data/campus.ts` |
| Bloques de entrega | 15 min antes de las 7, 9, 11, 13, 15 y 17 h | `DELIVERY_SLOTS` en `app/src/lib/data/campus.ts` |
| Hora de corte para agendar | 21:00 del día anterior | `SCHEDULE_CUTOFF` en `app/src/lib/data/campus.ts` |
| Edificios y salones | Edificios A–E, salones genéricos | `BUILDINGS` en `app/src/lib/data/campus.ts` |
| Locales y menús | 4 locales con 8 productos cada uno (inventados) | `app/src/lib/data/vendors.ts` y `products.ts` |
| Formato de la demo | Prototipo navegable con datos en el navegador | — |

---

## 👤 Equipo

_Pendiente: nombres de los integrantes, materia y profesor._

## 📄 Licencia

Proyecto académico sin fines comerciales.
