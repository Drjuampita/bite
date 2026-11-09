-- Bite · esquema inicial
-- Refleja el modelo de app/src/lib/types.ts. El MVP actual guarda todo en el navegador;
-- este esquema es el siguiente paso para tener datos compartidos entre dispositivos.

create type rol as enum ('alumno', 'local', 'repartidor');
create type modo_pedido as enum ('ahora', 'agendado');
create type estado_pedido as enum (
  'programado', 'recibido', 'preparando', 'listo', 'en_camino', 'entregado', 'cancelado'
);
create type metodo_pago as enum ('tarjeta', 'efectivo');

create table usuarios (
  id uuid primary key references auth.users (id) on delete cascade,
  nombre text not null,
  correo text not null unique check (correo like '%@anahuac.mx'),
  rol rol not null default 'alumno',
  vendor_id text,                       -- solo para rol 'local'
  edificio_habitual text,
  salon_habitual text,
  creado_en timestamptz not null default now()
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
  activo boolean not null default true
);

alter table usuarios
  add constraint usuarios_vendor_fk foreign key (vendor_id) references vendors (id);

create table products (
  id text primary key,
  vendor_id text not null references vendors (id) on delete cascade,
  nombre text not null,
  descripcion text,
  precio numeric(8, 2) not null check (precio >= 0),
  emoji text,
  seccion text not null,
  popular boolean not null default false,
  disponible boolean not null default true,
  -- Grupos de opciones (salsa, tamaño, extras...). Ver OptionGroup en types.ts.
  opciones jsonb not null default '[]'
);

create table delivery_slots (
  id text primary key,                  -- 's0900'
  etiqueta text not null,               -- '9:00'
  hora_inicio time not null,            -- 08:45
  hora_fin time not null                -- 09:00
);

create table locations (
  id bigserial primary key,
  edificio text not null,
  piso smallint,
  salon text not null unique
);

create table orders (
  id uuid primary key default gen_random_uuid(),
  codigo char(4) not null,
  user_id uuid not null references usuarios (id),
  vendor_id text not null references vendors (id),
  location_id bigint not null references locations (id),
  modo modo_pedido not null,
  fecha_entrega date not null,
  slot_id text references delivery_slots (id),
  estado estado_pedido not null,
  metodo_pago metodo_pago not null,
  nota text,
  subtotal numeric(8, 2) not null,
  costo_envio numeric(8, 2) not null,
  total numeric(8, 2) not null,
  calificacion smallint check (calificacion between 1 and 5),
  comentario text,
  creado_en timestamptz not null default now(),
  -- Un pedido agendado siempre tiene bloque; uno inmediato no.
  check ((modo = 'agendado') = (slot_id is not null))
);

create table order_items (
  id bigserial primary key,
  order_id uuid not null references orders (id) on delete cascade,
  product_id text not null references products (id),
  nombre text not null,                 -- copia al momento de pedir
  cantidad smallint not null check (cantidad > 0),
  precio_unitario numeric(8, 2) not null,
  opciones jsonb not null default '[]',
  nota text
);

-- Historial de cambios de estado (alimenta la línea de tiempo del seguimiento).
create table order_events (
  id bigserial primary key,
  order_id uuid not null references orders (id) on delete cascade,
  estado estado_pedido not null,
  creado_en timestamptz not null default now()
);

create index orders_vendor_fecha_idx on orders (vendor_id, fecha_entrega, slot_id);
create index orders_user_idx on orders (user_id, creado_en desc);
create index orders_estado_idx on orders (estado);

-- Seguridad a nivel de fila: cada alumno ve solo sus pedidos; cada local, los suyos.
alter table usuarios enable row level security;
alter table orders enable row level security;
alter table order_items enable row level security;
alter table order_events enable row level security;

create policy "usuario ve su perfil" on usuarios
  for select using (id = auth.uid());

create policy "alumno ve sus pedidos" on orders
  for select using (user_id = auth.uid());

create policy "alumno crea sus pedidos" on orders
  for insert with check (user_id = auth.uid());

create policy "local ve sus pedidos" on orders
  for select using (
    vendor_id = (select vendor_id from usuarios where id = auth.uid())
  );

create policy "repartidor ve pedidos listos" on orders
  for select using (
    (select rol from usuarios where id = auth.uid()) = 'repartidor'
    and estado in ('listo', 'en_camino', 'entregado')
  );

-- Pendiente para la siguiente iteración: políticas de update por rol, de lectura para
-- order_items y order_events, y semillas (seed) con los locales y menús reales.
