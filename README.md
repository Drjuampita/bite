# 🍽️ Bite

**La primera app de delivery escolar. Tu comida, directo a tu salón.**

Bite resuelve un problema cotidiano en la Universidad Anáhuac Querétaro: salir a buscar comida entre clases y perder el receso en la fila. Con Bite pides a los establecimientos del campus (Sinforosa, Luka, Diego's House, Carrusel y más) y recibes tu pedido en tu salón, **ahora mismo o agendado desde el día anterior**.

> 🎓 Proyecto escolar (Taller de Empresas). MVP enfocado en concepto, experiencia y diseño. No es un producto comercial.

---

## 📌 Estado del proyecto

| Fase | Estado |
|---|---|
| 1. Arquitectura y user flow | ✅ Definido (este documento) |
| 2. Wireframes de las pantallas clave | ⏳ Siguiente |
| 3. Diseño visual (UI) | ⏳ Pendiente |
| 4. Desarrollo del MVP | ⏳ Pendiente |
| 5. Demo y presentación | ⏳ Pendiente |

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

| Capa | Tecnología propuesta |
|---|---|
| Frontend | Next.js, mobile-first, PWA (se instala desde el navegador) |
| Backend / BD | Supabase (Postgres, Auth, Realtime) |
| Pagos | Simulados (interfaz lista para integrar Stripe) |
| Hosting | Vercel |

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

## 🗂️ Estructura planeada del repo

```
bite/
├── README.md
├── docs/            # Flujos, wireframes y decisiones
├── app/             # Aplicación Next.js (alumno, local, repartidor)
├── supabase/        # Migraciones y datos de ejemplo
└── design/          # Sistema de diseño y assets
```

---

## 🛣️ Roadmap

- [x] Definir problema, usuarios y alcance
- [x] Arquitectura y user flow
- [ ] Wireframes de las 10 pantallas
- [ ] Sistema de diseño (colores, tipografía, componentes)
- [ ] Prototipo navegable con datos de ejemplo
- [ ] Panel de local y vista de repartidor
- [ ] Demo final y presentación

---

## ❓ Decisiones abiertas

- ¿Quién reparte? (alumnos, personal de cada local o equipo Bite)
- ¿Costo de envío fijo o gratuito en la demo?
- Horarios reales de recesos para los bloques de entrega
- Formato de la demo: prototipo navegable con datos de ejemplo o app con base de datos real
- Locales y productos de ejemplo (propuesta: 4 locales, 6-8 productos cada uno)

---

## 👤 Equipo

_Pendiente: nombres de los integrantes, materia y profesor._

## 📄 Licencia

Proyecto académico sin fines comerciales.
