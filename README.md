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
| 4. Datos reales (menús, horarios, salones) | 🔄 Campus listo; menús pendientes (plantilla en `docs/plantilla-menus.xlsx`) |
| 5. Backend en Supabase | 🔄 Base de datos, reglas y seguridad listas y probadas en `supabase/`; falta conectar un proyecto |
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
| `/panel` | Local (con PIN) | Pedidos nuevos, en preparación y programados por hora; resumen del día; productos agotados |
| `/repartidor` | Repartidor (con PIN) | Tomar pedidos listos y confirmar la entrega con el código del alumno |

### Cómo presentar la demo

1. Abre la app del alumno y el `/panel` en **dos pestañas del mismo navegador**: comparten datos y se actualizan en vivo. El panel y la vista del repartidor piden un PIN; en la demo es **1234**.
2. En **Perfil → Modo presentación**:
   - *Locales siempre abiertos* permite pedir "Ahora" a cualquier hora (activado por defecto).
   - *Simular avance de pedidos* hace que un pedido inmediato avance solo cada ~12 s. Apágalo si quieres mover el pedido a mano desde el panel del local y la vista del repartidor.
3. *Reiniciar datos de la demo* borra pedidos y carrito antes de presentar.
4. Para cerrar el ciclo: el local marca el pedido como listo, el repartidor lo toma y, al llegar al salón, escribe el **código de entrega** que el alumno ve en su app.

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
- **Ahora:** disponible solo si el local está abierto (deja de aceptar 20 min antes de cerrar); si no, se ofrece agendar.
- **Agendar:** para hoy con al menos 45 min de anticipación, o para el siguiente día hábil antes de las 21:00.
- **Cupo por hora de clase:** cada local acepta un máximo de pedidos agendados por hora. La app avisa "Quedan N" y bloquea las horas llenas.
- **Activación automática:** un pedido agendado pasa a la cocina del local 60 min antes de la clase.
- **Precios del servidor:** el total se recalcula desde el catálogo al confirmar; el precio que trae el carrito no cuenta.
- **Código de entrega:** el repartidor solo puede marcar "Entregado" con el código de 4 dígitos que ve el alumno. Ni el local ni el repartidor pueden verlo.
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
| Backend / BD | Supabase (Postgres, Auth, Realtime, pg_cron). Migraciones en `supabase/migrations/` |
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

### Base de datos (Supabase)

```
configuracion  (costo_envio, hora_corte, anticipacion, ventana_preparacion, dominio_correo, modo_demo)
usuarios       (id, nombre, correo, rol, vendor_id, salon_habitual)
vendors        (id, nombre, horario, ubicacion, capacidad_por_bloque, activo)
products       (id, vendor_id, nombre, precio, foto_url, seccion, opciones, disponible)
delivery_slots (id, etiqueta, hora_inicio, hora_fin)
locations      (salon, edificio, piso)
orders         (id, user_id, vendor_id, salon, modo, fecha_entrega, slot_id, estado, total, repartidor_id, calificacion)
order_codes    (order_id, codigo)        ← solo lo lee el alumno dueño del pedido
order_items    (order_id, product_id, nombre, cantidad, precio_unitario, opciones, nota)
order_events   (order_id, estado, creado_en)   ← historial para la línea de tiempo
```

| Archivo | Qué contiene |
|---|---|
| `supabase/migrations/0001_esquema_inicial.sql` | Tablas, tipos e índices |
| `supabase/migrations/0002_reglas_de_negocio.sql` | Funciones: `crear_pedido` (precios, horario, cupo), `avanzar_pedido`, `tomar_pedido`, `entregar_pedido`, `cancelar_pedido`, `calificar_pedido`, `cupos_disponibles`, `activar_pedidos_programados` |
| `supabase/migrations/0003_seguridad.sql` | Seguridad por filas (cada rol ve solo lo suyo), permisos, tiempo real y tarea cada minuto |
| `supabase/seed.sql` | Locales, menús, horas y salones. Se genera con `npm run db:seed` desde `app/src/lib/data` |
| `supabase/tests/` | 29 pruebas de las reglas. Se corren en un Postgres local con `supabase/tests/correr.sh` |

Las tablas no aceptan escrituras directas: todo cambio pasa por las funciones, que validan el rol de quien llama. Las cuentas nuevas solo se crean con correo `@anahuac.mx` y entran como alumno; los locales y repartidores se asignan a mano en la tabla `usuarios`.

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
├── supabase/        # Migraciones, datos iniciales y pruebas de la base de datos
└── docs/            # Plantilla de menús para los locales
```

---

## 🛣️ Roadmap

- [x] Definir problema, usuarios y alcance
- [x] Arquitectura y user flow
- [x] Prototipo navegable con datos de ejemplo (10 pantallas del alumno)
- [x] Panel de local y vista de repartidor
- [x] Campus real (edificios, pisos, salones y horas de clase)
- [x] Reglas de negocio: cupo por hora, activación automática, código de entrega, acceso por rol
- [x] Base de datos con seguridad por rol, probada
- [ ] Menús, fotos y horarios reales de cada local
- [ ] Conectar Supabase (login con correo y datos compartidos entre dispositivos)
- [ ] Publicar en internet (Vercel) para abrirla desde cualquier celular
- [ ] Sistema de diseño final
- [ ] Demo final y presentación

---

## 🏫 Campus

Edificios de Anáhuac Querétaro y pisos de cada uno: **A** (2), **B** (2), **C** (4), **IDEA** (por confirmar) y **ABI** (6).

Los salones se nombran edificio + piso + número de salón: **C204** es edificio C, piso 2, salón 4. ABI e IDEA siguen el mismo formato (ABI305, IDEA102). En la app el alumno elige su salón en tres toques: edificio, piso y salón.

---

## ❓ Decisiones abiertas

El MVP usa estos valores provisionales. Cambiarlos es editar un archivo:

| Decisión | Valor provisional | Dónde se cambia |
|---|---|---|
| ¿Quién reparte? | Rol genérico "Repartidor Bite" | `app/src/app/(operacion)/repartidor` |
| Costo de envío | $10 MXN fijo | `DELIVERY_FEE` en `app/src/lib/data/campus.ts` |
| Horas de clase | Cada hora en punto, de 7:00 am a 9:00 pm (la última termina a las 10 pm). El pedido llega 15 min antes | `DELIVERY_SLOTS` en `app/src/lib/data/campus.ts` |
| Hora de corte para agendar | 21:00 del día anterior | `SCHEDULE_CUTOFF` en `app/src/lib/data/campus.ts` |
| Salones por piso | 10 (01–10) | `ROOMS_PER_FLOOR` en `app/src/lib/data/campus.ts` |
| Pisos del edificio IDEA | 2 (pendiente de confirmar) | `BUILDINGS` en `app/src/lib/data/campus.ts` |
| Horarios de los locales | Inventados (6:30 am a 9 pm según el local) | `app/src/lib/data/vendors.ts` |
| Pedidos máximos por hora | 10 a 20 según el local (inventado) | `capacityPerSlot` en `app/src/lib/data/vendors.ts` |
| Activación de agendados | 60 min antes de la clase | `PREP_WINDOW_MINUTES` en `app/src/lib/data/campus.ts` |
| Acceso de local y repartidor | PIN de demostración 1234 (en Supabase: cuentas con rol) | `app/src/lib/data/staff.ts` |
| Locales y menús | 4 locales con 8 productos cada uno (inventados) | `app/src/lib/data/vendors.ts` y `products.ts` |
| Formato de la demo | Prototipo navegable con datos en el navegador | — |

---

## 👤 Equipo

_Pendiente: nombres de los integrantes, materia y profesor._

## 📄 Licencia

Proyecto académico sin fines comerciales.
