-- Bite · 0003 · Seguridad, permisos y tiempo real
-- Lectura: el catálogo es público; cada quien ve solo los pedidos que le tocan.
-- Escritura: ninguna tabla acepta insert/update/delete directo; todo pasa por las funciones de 0002.

alter table configuracion enable row level security;
alter table vendors enable row level security;
alter table products enable row level security;
alter table delivery_slots enable row level security;
alter table locations enable row level security;
alter table usuarios enable row level security;
alter table orders enable row level security;
alter table order_codes enable row level security;
alter table order_items enable row level security;
alter table order_events enable row level security;

create policy "catálogo público" on configuracion for select using (true);
create policy "catálogo público" on vendors for select using (true);
create policy "catálogo público" on products for select using (true);
create policy "catálogo público" on delivery_slots for select using (true);
create policy "catálogo público" on locations for select using (true);

create policy "mi perfil" on usuarios for select using (id = auth.uid());

create policy "pedidos que me tocan" on orders for select using (
  user_id = auth.uid()
  or (mi_rol() = 'local' and vendor_id = mi_vendor())
  or (mi_rol() = 'repartidor' and (estado = 'listo' or repartidor_id = auth.uid()))
);

create policy "solo el alumno ve su código" on order_codes for select
  using (exists (select 1 from orders o where o.id = order_id and o.user_id = auth.uid()));

-- Los productos y el historial de un pedido se ven si se ve el pedido (aplica la política de arriba).
create policy "productos de mis pedidos" on order_items for select
  using (exists (select 1 from orders o where o.id = order_id));
create policy "historial de mis pedidos" on order_events for select
  using (exists (select 1 from orders o where o.id = order_id));

-- Permisos de tablas.
revoke all on all tables in schema public from anon, authenticated;
grant select on configuracion, vendors, products, delivery_slots, locations to anon, authenticated;
grant select on usuarios, orders, order_codes, order_items, order_events to authenticated;

-- Permisos de funciones: solo las acciones públicas se pueden llamar desde la app.
revoke execute on all functions in schema public from public, anon, authenticated;
grant execute on function mi_rol(), mi_vendor() to anon, authenticated;
grant execute on function cupos_disponibles(text, date) to anon, authenticated;
grant execute on function
  crear_pedido(text, modo_pedido, date, text, text, metodo_pago, text, jsonb),
  avanzar_pedido(uuid),
  tomar_pedido(uuid),
  entregar_pedido(uuid, text),
  cancelar_pedido(uuid),
  calificar_pedido(uuid, int, text),
  cambiar_disponibilidad(text, boolean),
  guardar_salon_habitual(text)
to authenticated;

-- Tiempo real: el alumno ve el avance de su pedido y el local recibe pedidos nuevos al instante.
do $$
begin
  if exists (select 1 from pg_publication where pubname = 'supabase_realtime') then
    alter publication supabase_realtime add table orders, order_events;
  end if;
end $$;

-- Activación automática de agendados cada minuto (requiere la extensión pg_cron, disponible en Supabase:
-- Database → Extensions → pg_cron).
do $$
begin
  if exists (select 1 from pg_extension where extname = 'pg_cron') then
    perform cron.schedule('activar-pedidos-programados', '* * * * *', 'select public.activar_pedidos_programados()');
  end if;
end $$;
