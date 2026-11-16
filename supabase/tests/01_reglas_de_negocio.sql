\set ON_ERROR_STOP 1
\pset format unaligned
\pset tuples_only on
-- Alta de cuentas (como lo haría Supabase Auth)
insert into auth.users (id, email, raw_user_meta_data) values
  ('00000000-0000-0000-0000-00000000000a', 'ana.lopez@anahuac.mx', '{"nombre":"Ana López"}'),
  ('00000000-0000-0000-0000-00000000000b', 'beto@anahuac.mx', '{}'),
  ('00000000-0000-0000-0000-0000000000c1', 'luka@anahuac.mx', '{}'),
  ('00000000-0000-0000-0000-0000000000c2', 'sinforosa@anahuac.mx', '{}'),
  ('00000000-0000-0000-0000-0000000000d1', 'carlos@anahuac.mx', '{"nombre":"Carlos"}');
update usuarios set rol = 'local', vendor_id = 'luka' where correo = 'luka@anahuac.mx';
update usuarios set rol = 'local', vendor_id = 'sinforosa' where correo = 'sinforosa@anahuac.mx';
update usuarios set rol = 'repartidor' where correo = 'carlos@anahuac.mx';
select 'PASS alta de usuarios: ' || count(*) from usuarios;

do $$ begin
  insert into auth.users (email) values ('alguien@gmail.com');
  raise exception 'FAIL: aceptó un correo externo';
exception when others then
  if sqlerrm like 'Usa tu correo institucional%' then raise notice 'PASS correo externo rechazado'; else raise; end if;
end $$;

update configuracion set modo_demo = true;
update vendors set capacidad_por_bloque = 2 where id = 'luka';

-- Helper de pruebas: ejecutar como un usuario.
create function pg_temp.como(uid text) returns void language sql as $$
  select set_config('request.jwt.claim.sub', uid, false); $$;

-- ── Alumno crea pedido agendado: el precio se calcula en el servidor ──
set role authenticated;
select pg_temp.como('00000000-0000-0000-0000-00000000000a');
create temp table if not exists t (k text primary key, v text);
do $$
declare p orders;
begin
  p := crear_pedido('luka', 'agendado', (now() at time zone 'America/Mexico_City')::date + 1, 's1300', 'ABI305', 'tarjeta', 'última fila',
    '[{"product_id":"luka-latte","cantidad":2,"precio":1,"opciones":[{"grupo":"tamano","opcion":"grande"},{"grupo":"leche","opcion":"almendra"}]}]');
  -- (45 + 10 + 8) × 2 = 126; + 10 de envío = 136. El "precio": 1 que manda el cliente se ignora.
  if p.total <> 136 or p.estado <> 'programado' then raise exception 'FAIL total %, estado %', p.total, p.estado; end if;
  insert into t values ('pedido1', p.id::text), ('codigo1', (select codigo from order_codes where order_id = p.id));
  raise notice 'PASS pedido agendado: total % calculado en servidor', p.total;
end $$;

do $$ begin
  perform crear_pedido('luka', 'agendado', (now() at time zone 'America/Mexico_City')::date + 1, 's1300', 'ABI305', 'tarjeta', null,
    '[{"product_id":"luka-latte","cantidad":1,"opciones":[{"grupo":"tamano","opcion":"chico"}]}]');
  raise exception 'FAIL: aceptó sin opción obligatoria';
exception when others then
  if sqlerrm like 'Falta elegir "Leche"%' then raise notice 'PASS opción obligatoria: %', sqlerrm; else raise; end if;
end $$;

do $$ begin
  perform crear_pedido('luka', 'agendado', (now() at time zone 'America/Mexico_City')::date + 1, 's1300', 'Z999', 'tarjeta', null,
    '[{"product_id":"luka-americano","cantidad":1,"opciones":[{"grupo":"tamano","opcion":"chico"}]}]');
  raise exception 'FAIL: aceptó salón inexistente';
exception when others then
  if sqlerrm = 'Ese salón no existe.' then raise notice 'PASS salón validado'; else raise; end if;
end $$;

do $$ begin
  perform crear_pedido('luka', 'agendado', (now() at time zone 'America/Mexico_City')::date + 1, 's1300', 'C204', 'efectivo', null,
    '[{"product_id":"sin-chilaquiles","cantidad":1}]');
  raise exception 'FAIL: aceptó producto de otro local';
exception when others then
  if sqlerrm like 'Un producto ya no está disponible%' then raise notice 'PASS producto de otro local rechazado'; else raise; end if;
end $$;

-- Cupo: Luka acepta 2 por hora. Beto ocupa el segundo lugar; el tercero se rechaza.
select pg_temp.como('00000000-0000-0000-0000-00000000000b');
select 'PASS segundo lugar ocupado: ' || (crear_pedido('luka', 'agendado', (now() at time zone 'America/Mexico_City')::date + 1, 's1300', 'C204', 'efectivo', null,
    '[{"product_id":"luka-americano","cantidad":1,"opciones":[{"grupo":"tamano","opcion":"chico"}]}]')).estado;
do $$ begin
  perform crear_pedido('luka', 'agendado', (now() at time zone 'America/Mexico_City')::date + 1, 's1300', 'C204', 'efectivo', null,
    '[{"product_id":"luka-americano","cantidad":1,"opciones":[{"grupo":"tamano","opcion":"chico"}]}]');
  raise exception 'FAIL: rebasó el cupo';
exception when others then
  if sqlerrm like 'Esa hora se acaba de llenar%' then raise notice 'PASS cupo por hora respetado'; else raise; end if;
end $$;
select 'PASS cupos_disponibles 1 pm: ' || ocupados || '/' || capacidad
  from cupos_disponibles('luka', (now() at time zone 'America/Mexico_City')::date + 1) where slot_id = 's1300';

-- RLS: Beto no ve el pedido de Ana.
select case when count(*) = 1 then 'PASS RLS: Beto solo ve su pedido' else 'FAIL RLS: ve ' || count(*) end from orders;

do $$ begin
  insert into orders (user_id, vendor_id, salon, modo, fecha_entrega, estado, metodo_pago, subtotal, costo_envio, total)
  values (auth.uid(), 'luka', 'C204', 'ahora', current_date, 'entregado', 'efectivo', 0, 0, 0);
  raise exception 'FAIL: insert directo permitido';
exception when insufficient_privilege then raise notice 'PASS insert directo bloqueado';
end $$;

-- ── Local ──
select pg_temp.como('00000000-0000-0000-0000-0000000000c2');  -- Sinforosa
do $$ begin
  perform avanzar_pedido((select v from t where k = 'pedido1')::uuid);
  raise exception 'FAIL: otro local movió el pedido';
exception when others then
  if sqlerrm = 'No tienes acceso a este pedido.' then raise notice 'PASS otro local no puede mover el pedido'; else raise; end if;
end $$;
select case when count(*) = 0 then 'PASS RLS: Sinforosa no ve pedidos de Luka' else 'FAIL' end from orders;

select pg_temp.como('00000000-0000-0000-0000-0000000000c1');  -- Luka
select 'PASS Luka ve sus pedidos: ' || count(*) from orders;
select case when count(*) = 0 then 'PASS el local no ve códigos de entrega' else 'FAIL local ve códigos' end from order_codes;
select 'PASS avanzar: ' || (avanzar_pedido((select v from t where k = 'pedido1')::uuid)).estado;
select 'PASS avanzar: ' || (avanzar_pedido((select v from t where k = 'pedido1')::uuid)).estado;
select 'PASS avanzar: ' || (avanzar_pedido((select v from t where k = 'pedido1')::uuid)).estado;
select 'PASS producto agotado: ' || (cambiar_disponibilidad('luka-latte', false)).disponible;
select pg_temp.como('00000000-0000-0000-0000-00000000000a');
do $$ begin
  perform crear_pedido('luka', 'ahora', null, null, 'ABI305', 'tarjeta', null,
    '[{"product_id":"luka-latte","cantidad":1,"opciones":[{"grupo":"tamano","opcion":"chico"},{"grupo":"leche","opcion":"entera"}]}]');
  raise exception 'FAIL: vendió un producto agotado';
exception when others then
  if sqlerrm like 'Un producto ya no está disponible%' then raise notice 'PASS producto agotado no se puede pedir'; else raise; end if;
end $$;

-- ── Repartidor ──
select pg_temp.como('00000000-0000-0000-0000-0000000000d1');
select 'PASS repartidor ve listos: ' || count(*) from orders where estado = 'listo';
select case when count(*) = 0 then 'PASS el repartidor no ve códigos de entrega' else 'FAIL repartidor ve códigos' end from order_codes;
select 'PASS tomar: ' || (tomar_pedido((select v from t where k = 'pedido1')::uuid)).estado;
do $$ begin
  perform entregar_pedido((select v from t where k = 'pedido1')::uuid, 'xxxx');
  raise exception 'FAIL: entregó con código incorrecto';
exception when others then
  if sqlerrm = 'Código incorrecto.' then raise notice 'PASS código incorrecto rechazado'; else raise; end if;
end $$;
select 'PASS entregar: ' || (entregar_pedido((select v from t where k = 'pedido1')::uuid, (select v from t where k = 'codigo1'))).estado;

-- ── Alumno: calificación e historial ──
select pg_temp.como('00000000-0000-0000-0000-00000000000a');
select 'PASS calificar: ' || (calificar_pedido((select v from t where k = 'pedido1')::uuid, 5, '¡Rápido!')).calificacion;
select 'PASS historial: ' || string_agg(estado::text, ' → ' order by id) from order_events
  where order_id = (select v from t where k = 'pedido1')::uuid;

-- ── Activación automática de agendados ──
reset role;
insert into orders (user_id, vendor_id, salon, modo, fecha_entrega, slot_id, estado, metodo_pago, subtotal, costo_envio, total)
values ('00000000-0000-0000-0000-00000000000b', 'luka', 'C204', 'agendado',
        (now() at time zone 'America/Mexico_City')::date, 's0700', 'programado', 'efectivo', 35, 10, 45);
select 'PASS activar_pedidos_programados: ' || activar_pedidos_programados() || ' activado(s)';
select 'PASS el de mañana sigue programado: ' || count(*) from orders where estado = 'programado';
