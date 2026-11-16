-- Bite · 0001 · Esquema
-- Refleja el modelo de app/src/lib/types.ts. Las reglas de negocio están en 0002 y la
-- seguridad (RLS, permisos y tiempo real) en 0003. Los datos iniciales se generan con
-- `npm run db:seed` (app/scripts/generar-seed.mts) a partir de app/src/lib/data.

create type rol as enum ('alumno', 'local', 'repartidor');
create type modo_pedido as enum ('ahora', 'agendado');
create type estado_pedido as enum (
  'programado', 'recibido', 'preparando', 'listo', 'en_camino', 'entregado', 'cancelado'
);
create type metodo_pago as enum ('tarjeta', 'efectivo');

-- Parámetros del servicio (una sola fila).
create table configuracion (
  id boolean primary key default true check (id),
  zona_horaria text not null default 'America/Mexico_City',
  costo_envio numeric(8, 2) not null default 10,
  hora_corte time not null default '21:00',           -- para agendar el día siguiente
  anticipacion_minutos int not null default 45,        -- para agendar el mismo día
  ventana_preparacion_minutos int not null default 60, -- un agendado pasa a cocina N min antes de la clase
  dominio_correo text not null default 'anahuac.mx',
  modo_demo boolean not null default false             -- ignora horarios y hora de corte
);

create table vendors (
  id text primary key,                  -- 'sinforosa', 'luka', ...
  nombre text not null,
  descripcion text,
  emoji text,
  categorias text[] not null default '{}',
  tiempo_preparacion text,
  hora_apertura time not null,
  hora_cierre time not null,
  ubicacion text,
  capacidad_por_bloque int not null default 15 check (capacidad_por_bloque > 0),
  activo boolean not null default true
);

create table usuarios (
  id uuid primary key references auth.users (id) on delete cascade,
  nombre text not null,
  correo text not null unique,
  rol rol not null default 'alumno',
  vendor_id text references vendors (id),  -- solo para rol 'local'
  salon_habitual text,
  creado_en timestamptz not null default now(),
  check ((rol = 'local') = (vendor_id is not null))
);

create table products (
  id text primary key,
  vendor_id text not null references vendors (id) on delete cascade,
  nombre text not null,
  descripcion text,
  precio numeric(8, 2) not null check (precio >= 0),
  emoji text,
  foto_url text,
  seccion text not null,
  orden int not null default 0,
  popular boolean not null default false,
  disponible boolean not null default true,
  -- Grupos de opciones: [{id, name, type: 'single'|'multi', required, choices: [{id, name, price}]}]
  opciones jsonb not null default '[]'
);

-- Horas de clase. La entrega llega entre hora_inicio y hora_fin (inicio de la clase).
create table delivery_slots (
  id text primary key,                  -- 's0900'
  etiqueta text not null,               -- '9:00 am'
  hora_inicio time not null,            -- 08:45
  hora_fin time not null                -- 09:00
);

-- Salones: edificio + piso + número, ej. C204 = edificio C, piso 2, salón 4.
create table locations (
  salon text primary key,               -- 'C204', 'ABI305'
  edificio text not null check (edificio in ('A', 'B', 'C', 'IDEA', 'ABI')),
  piso smallint not null check (piso between 1 and 6)
);

alter table usuarios
  add constraint usuarios_salon_fk foreign key (salon_habitual) references locations (salon);

create table orders (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references usuarios (id),
  vendor_id text not null references vendors (id),
  salon text not null references locations (salon),
  modo modo_pedido not null,
  fecha_entrega date not null,
  slot_id text references delivery_slots (id),
  estado estado_pedido not null,
  metodo_pago metodo_pago not null,
  nota text check (char_length(nota) <= 120),
  subtotal numeric(8, 2) not null,
  costo_envio numeric(8, 2) not null,
  total numeric(8, 2) not null,
  repartidor_id uuid references usuarios (id),
  calificacion smallint check (calificacion between 1 and 5),
  comentario text,
  creado_en timestamptz not null default now(),
  -- Un pedido agendado siempre tiene hora de clase; uno inmediato no.
  check ((modo = 'agendado') = (slot_id is not null))
);

-- Código de entrega: el alumno se lo dice al repartidor al recibir. Va en una tabla aparte para
-- que solo el alumno dueño del pedido lo pueda leer (ni el local ni el repartidor).
create table order_codes (
  order_id uuid primary key references orders (id) on delete cascade,
  codigo char(4) not null
);

create table order_items (
  id bigserial primary key,
  order_id uuid not null references orders (id) on delete cascade,
  product_id text not null references products (id),
  nombre text not null,                 -- copia al momento de pedir
  cantidad smallint not null check (cantidad between 1 and 20),
  precio_unitario numeric(8, 2) not null,  -- precio base + opciones
  opciones jsonb not null default '[]',
  nota text
);

-- Historial de estados (alimenta la línea de tiempo del seguimiento). Lo llena un trigger.
create table order_events (
  id bigserial primary key,
  order_id uuid not null references orders (id) on delete cascade,
  estado estado_pedido not null,
  creado_en timestamptz not null default now()
);

create index orders_cupo_idx on orders (vendor_id, fecha_entrega, slot_id) where estado <> 'cancelado';
create index orders_user_idx on orders (user_id, creado_en desc);
create index orders_estado_idx on orders (estado);
create index order_items_order_idx on order_items (order_id);
create index order_events_order_idx on order_events (order_id, creado_en);
