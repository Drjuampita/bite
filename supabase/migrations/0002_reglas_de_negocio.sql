-- Bite · 0002 · Reglas de negocio
-- Todas las escrituras pasan por estas funciones: el cliente nunca inserta ni actualiza
-- pedidos directamente. Así el servidor recalcula precios, valida horarios y cupo, y
-- controla quién puede mover cada pedido. Mismas reglas que app/src/lib/store.ts.

insert into configuracion default values on conflict do nothing;

-- ── Utilidades ───────────────────────────────────────────

create or replace function mi_rol() returns rol
language sql stable security definer set search_path = public as $$
  select rol from usuarios where id = auth.uid()
$$;

create or replace function mi_vendor() returns text
language sql stable security definer set search_path = public as $$
  select vendor_id from usuarios where id = auth.uid()
$$;

-- ── Alta de usuarios ─────────────────────────────────────
-- Cada cuenta nueva de Supabase Auth crea su perfil como alumno. Solo se aceptan correos
-- institucionales. Las cuentas de locales y repartidores se promueven a mano:
--   update usuarios set rol = 'local', vendor_id = 'luka' where correo = '...';

create or replace function crear_usuario() returns trigger
language plpgsql security definer set search_path = public as $$
declare
  dominio text := (select dominio_correo from configuracion);
begin
  if new.email is null or lower(new.email) not like '%@' || dominio then
    raise exception 'Usa tu correo institucional @%', dominio;
  end if;
  insert into usuarios (id, nombre, correo)
  values (
    new.id,
    coalesce(nullif(trim(new.raw_user_meta_data ->> 'nombre'), ''), split_part(new.email, '@', 1)),
    lower(new.email)
  );
  return new;
end $$;

create trigger al_crear_usuario
  after insert on auth.users
  for each row execute function crear_usuario();

-- ── Historial de estados ─────────────────────────────────

create or replace function registrar_evento() returns trigger
language plpgsql security definer set search_path = public as $$
begin
  if tg_op = 'INSERT' or new.estado is distinct from old.estado then
    insert into order_events (order_id, estado) values (new.id, new.estado);
  end if;
  return new;
end $$;

create trigger pedido_evento
  after insert or update of estado on orders
  for each row execute function registrar_evento();

-- ── Disponibilidad de horas de clase ─────────────────────

-- Devuelve null si el bloque se puede agendar, o el motivo por el que no (sin contar cupo).
create or replace function motivo_bloque_no_disponible(
  v vendors, s delivery_slots, p_fecha date, cfg configuracion, ahora timestamp
) returns text
language plpgsql stable as $$
begin
  -- El local debe estar abierto durante la preparación (30 min antes) y la entrega.
  if s.hora_inicio - interval '30 minutes' < v.hora_apertura or s.hora_fin > v.hora_cierre then
    return 'Esa hora está fuera del horario del local.';
  end if;
  if p_fecha < ahora::date then
    return 'Esa fecha ya pasó.';
  end if;
  if p_fecha > ahora::date + 7 then
    return 'Solo se puede agendar con hasta una semana de anticipación.';
  end if;
  if not cfg.modo_demo and extract(isodow from p_fecha) > 5 then
    return 'Los locales no abren en fin de semana.';
  end if;
  if p_fecha = ahora::date
     and (p_fecha + s.hora_inicio) - ahora < make_interval(mins => cfg.anticipacion_minutos) then
    return 'Ya no da tiempo para esa hora.';
  end if;
  if not cfg.modo_demo and p_fecha = ahora::date + 1 and ahora::time >= cfg.hora_corte then
    return 'Ya pasó la hora de corte para agendar mañana.';
  end if;
  return null;
end $$;

-- Cupo por hora de clase de un local en una fecha. La app lo usa para mostrar "Quedan N" o "Lleno"
-- sin poder ver los pedidos de otros alumnos.
create or replace function cupos_disponibles(p_vendor text, p_fecha date)
returns table (slot_id text, ocupados int, capacidad int, motivo text)
language sql stable security definer set search_path = public as $$
  select
    s.id,
    (select count(*) from orders o
      where o.vendor_id = v.id and o.fecha_entrega = p_fecha and o.slot_id = s.id
        and o.estado <> 'cancelado')::int,
    v.capacidad_por_bloque,
    motivo_bloque_no_disponible(v, s, p_fecha, cfg, now() at time zone cfg.zona_horaria)
  from delivery_slots s, vendors v, configuracion cfg
  where v.id = p_vendor
  order by s.hora_fin
$$;

-- ── Crear pedido ─────────────────────────────────────────
-- p_items: [{ "product_id": "luka-latte", "cantidad": 1,
--             "opciones": [{ "grupo": "leche", "opcion": "almendra" }], "nota": "sin azúcar" }]

create or replace function crear_pedido(
  p_vendor_id text,
  p_modo modo_pedido,
  p_fecha date,
  p_slot_id text,
  p_salon text,
  p_metodo_pago metodo_pago,
  p_nota text,
  p_items jsonb
) returns orders
language plpgsql security definer set search_path = public as $$
declare
  cfg configuracion;
  v vendors;
  s delivery_slots;
  prod products;
  ahora timestamp;
  motivo text;
  item jsonb;
  grupo jsonb;
  elegidas jsonb;
  opcion jsonb;
  cantidad int;
  precio numeric;
  opciones_linea jsonb;
  lineas jsonb := '[]';
  subtotal numeric := 0;
  pedido orders;
begin
  if mi_rol() is distinct from 'alumno' then
    raise exception 'Solo los alumnos pueden hacer pedidos.';
  end if;

  select * into cfg from configuracion;
  ahora := now() at time zone cfg.zona_horaria;

  select * into v from vendors where id = p_vendor_id and activo;
  if not found then
    raise exception 'Este local no está disponible.';
  end if;
  if not exists (select 1 from locations where salon = p_salon) then
    raise exception 'Ese salón no existe.';
  end if;
  if p_items is null or jsonb_typeof(p_items) <> 'array' or jsonb_array_length(p_items) = 0 then
    raise exception 'Tu carrito está vacío.';
  end if;

  if p_modo = 'ahora' then
    p_fecha := ahora::date;
    p_slot_id := null;
    if not cfg.modo_demo and (
      extract(isodow from ahora) > 5
      or ahora::time < v.hora_apertura
      or ahora::time > v.hora_cierre - interval '20 minutes'
    ) then
      raise exception '% no recibe pedidos inmediatos ahora.', v.nombre;
    end if;
  else
    select * into s from delivery_slots where id = p_slot_id;
    if not found then
      raise exception 'Elige la hora de tu clase.';
    end if;
    motivo := motivo_bloque_no_disponible(v, s, p_fecha, cfg, ahora);
    if motivo is not null then
      raise exception '%', motivo;
    end if;
    -- Candado por local + fecha + hora para que dos pedidos simultáneos no rebasen el cupo.
    perform pg_advisory_xact_lock(hashtext(v.id || '|' || p_fecha || '|' || s.id));
    if (select count(*) from orders o
        where o.vendor_id = v.id and o.fecha_entrega = p_fecha and o.slot_id = s.id
          and o.estado <> 'cancelado') >= v.capacidad_por_bloque then
      raise exception 'Esa hora se acaba de llenar. Elige otra.';
    end if;
  end if;

  -- Precios: siempre desde el catálogo, nunca desde el cliente.
  for item in select * from jsonb_array_elements(p_items) loop
    select * into prod from products where id = item ->> 'product_id' and vendor_id = v.id;
    if not found or not prod.disponible then
      raise exception 'Un producto ya no está disponible. Revisa tu carrito.';
    end if;
    cantidad := coalesce((item ->> 'cantidad')::int, 0);
    if cantidad not between 1 and 20 then
      raise exception 'Cantidad inválida para %.', prod.nombre;
    end if;

    precio := prod.precio;
    opciones_linea := '[]';
    for grupo in select * from jsonb_array_elements(prod.opciones) loop
      select coalesce(jsonb_agg(c), '[]') into elegidas
      from jsonb_array_elements(grupo -> 'choices') c
      where exists (
        select 1 from jsonb_array_elements(coalesce(item -> 'opciones', '[]')) e
        where e ->> 'grupo' = grupo ->> 'id' and e ->> 'opcion' = c ->> 'id'
      );
      if (grupo ->> 'required')::boolean and jsonb_array_length(elegidas) = 0 then
        raise exception 'Falta elegir "%" en %.', grupo ->> 'name', prod.nombre;
      end if;
      if grupo ->> 'type' = 'single' and jsonb_array_length(elegidas) > 1 then
        raise exception 'Solo puedes elegir una opción de "%" en %.', grupo ->> 'name', prod.nombre;
      end if;
      for opcion in select * from jsonb_array_elements(elegidas) loop
        precio := precio + (opcion ->> 'price')::numeric;
        opciones_linea := opciones_linea || jsonb_build_object(
          'grupo', grupo ->> 'name', 'opcion', opcion ->> 'name', 'precio', (opcion ->> 'price')::numeric
        );
      end loop;
    end loop;

    lineas := lineas || jsonb_build_object(
      'product_id', prod.id, 'nombre', prod.nombre, 'cantidad', cantidad,
      'precio_unitario', precio, 'opciones', opciones_linea, 'nota', left(item ->> 'nota', 120)
    );
    subtotal := subtotal + precio * cantidad;
  end loop;

  insert into orders (
    user_id, vendor_id, salon, modo, fecha_entrega, slot_id, estado,
    metodo_pago, nota, subtotal, costo_envio, total
  ) values (
    auth.uid(), v.id, p_salon, p_modo, p_fecha, p_slot_id,
    (case when p_modo = 'agendado' then 'programado' else 'recibido' end)::estado_pedido,
    p_metodo_pago, nullif(trim(p_nota), ''), subtotal, cfg.costo_envio, subtotal + cfg.costo_envio
  ) returning * into pedido;

  insert into order_codes (order_id, codigo)
  values (pedido.id, lpad(floor(random() * 10000)::int::text, 4, '0'));

  insert into order_items (order_id, product_id, nombre, cantidad, precio_unitario, opciones, nota)
  select pedido.id, l ->> 'product_id', l ->> 'nombre', (l ->> 'cantidad')::int,
         (l ->> 'precio_unitario')::numeric, l -> 'opciones', l ->> 'nota'
  from jsonb_array_elements(lineas) l;

  return pedido;
end $$;

-- ── Acciones por rol ─────────────────────────────────────

-- Local: programado → recibido → preparando → listo (solo sus pedidos).
create or replace function avanzar_pedido(p_order uuid) returns orders
language plpgsql security definer set search_path = public as $$
declare
  p orders;
  siguiente estado_pedido;
begin
  select * into p from orders where id = p_order for update;
  if not found or mi_rol() is distinct from 'local' or p.vendor_id is distinct from mi_vendor() then
    raise exception 'No tienes acceso a este pedido.';
  end if;
  siguiente := case p.estado
    when 'programado' then 'recibido'
    when 'recibido' then 'preparando'
    when 'preparando' then 'listo'
  end;
  if siguiente is null then
    raise exception 'El local ya no puede mover este pedido.';
  end if;
  update orders set estado = siguiente where id = p_order returning * into p;
  return p;
end $$;

-- Repartidor: toma un pedido listo y sale a entregarlo.
create or replace function tomar_pedido(p_order uuid) returns orders
language plpgsql security definer set search_path = public as $$
declare
  p orders;
begin
  if mi_rol() is distinct from 'repartidor' then
    raise exception 'Solo los repartidores pueden tomar pedidos.';
  end if;
  update orders set estado = 'en_camino', repartidor_id = auth.uid()
  where id = p_order and estado = 'listo'
  returning * into p;
  if not found then
    raise exception 'Este pedido ya no está disponible para recoger.';
  end if;
  return p;
end $$;

-- Repartidor: se marca entregado solo con el código que ve el alumno en su app.
create or replace function entregar_pedido(p_order uuid, p_codigo text) returns orders
language plpgsql security definer set search_path = public as $$
declare
  p orders;
begin
  select * into p from orders where id = p_order for update;
  if not found or p.repartidor_id is distinct from auth.uid() or p.estado <> 'en_camino' then
    raise exception 'No tienes este pedido en camino.';
  end if;
  if (select codigo from order_codes where order_id = p_order) <> trim(p_codigo) then
    raise exception 'Código incorrecto.';
  end if;
  update orders set estado = 'entregado' where id = p_order returning * into p;
  return p;
end $$;

-- Alumno: cancela mientras el local no haya empezado a preparar.
create or replace function cancelar_pedido(p_order uuid) returns orders
language plpgsql security definer set search_path = public as $$
declare
  p orders;
begin
  update orders set estado = 'cancelado'
  where id = p_order and user_id = auth.uid() and estado in ('programado', 'recibido')
  returning * into p;
  if not found then
    raise exception 'Este pedido ya no se puede cancelar.';
  end if;
  return p;
end $$;

create or replace function calificar_pedido(p_order uuid, p_estrellas int, p_comentario text)
returns orders
language plpgsql security definer set search_path = public as $$
declare
  p orders;
begin
  update orders set calificacion = p_estrellas, comentario = nullif(trim(p_comentario), '')
  where id = p_order and user_id = auth.uid() and estado = 'entregado' and calificacion is null
  returning * into p;
  if not found then
    raise exception 'No se puede calificar este pedido.';
  end if;
  return p;
end $$;

-- Local: marca un producto como agotado o disponible.
create or replace function cambiar_disponibilidad(p_product text, p_disponible boolean) returns products
language plpgsql security definer set search_path = public as $$
declare
  pr products;
begin
  update products set disponible = p_disponible
  where id = p_product and vendor_id = mi_vendor() and mi_rol() = 'local'
  returning * into pr;
  if not found then
    raise exception 'No tienes acceso a este producto.';
  end if;
  return pr;
end $$;

create or replace function guardar_salon_habitual(p_salon text) returns void
language plpgsql security definer set search_path = public as $$
begin
  if not exists (select 1 from locations where salon = p_salon) then
    raise exception 'Ese salón no existe.';
  end if;
  update usuarios set salon_habitual = p_salon where id = auth.uid();
end $$;

-- ── Tareas programadas ───────────────────────────────────
-- Pasa a la cocina los pedidos agendados cuando faltan ventana_preparacion_minutos para la clase.
-- Se ejecuta cada minuto con pg_cron (ver 0003).

create or replace function activar_pedidos_programados() returns int
language plpgsql security definer set search_path = public as $$
declare
  n int;
begin
  update orders o set estado = 'recibido'
  from delivery_slots s, configuracion cfg
  where o.slot_id = s.id
    and o.estado = 'programado'
    and (o.fecha_entrega + s.hora_fin) - make_interval(mins => cfg.ventana_preparacion_minutos)
        <= now() at time zone cfg.zona_horaria;
  get diagnostics n = row_count;
  return n;
end $$;
