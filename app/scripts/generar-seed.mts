// Genera supabase/seed.sql a partir de los datos de la app (app/src/lib/data), para que la base
// de datos y el prototipo usen exactamente los mismos locales, menús, horas y salones.
// Uso: npm run db:seed

import { writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import {
  BUILDINGS,
  DELIVERY_FEE,
  DELIVERY_SLOTS,
  MIN_LEAD_MINUTES,
  PREP_WINDOW_MINUTES,
  ROOMS_PER_FLOOR,
  SCHEDULE_CUTOFF,
  roomCode,
} from "../src/lib/data/campus.ts";
import { PRODUCTS } from "../src/lib/data/products.ts";
import { VENDORS } from "../src/lib/data/vendors.ts";

const q = (v: string | number | boolean | null | undefined): string => {
  if (v === null || v === undefined) return "null";
  if (typeof v === "number" || typeof v === "boolean") return String(v);
  return `'${v.replace(/'/g, "''")}'`;
};
const arr = (items: string[]) => `array[${items.map(q).join(", ")}]::text[]`;
const values = (rows: string[][]) => rows.map((r) => `  (${r.join(", ")})`).join(",\n");

const sections: string[] = [
  "-- Generado por app/scripts/generar-seed.mts. No editar a mano: cambia app/src/lib/data y vuelve a correr `npm run db:seed`.",
  "",
  `update configuracion set
  costo_envio = ${DELIVERY_FEE},
  hora_corte = ${q(SCHEDULE_CUTOFF)},
  anticipacion_minutos = ${MIN_LEAD_MINUTES},
  ventana_preparacion_minutos = ${PREP_WINDOW_MINUTES};`,
  "",
  `insert into vendors (id, nombre, descripcion, emoji, categorias, tiempo_preparacion, hora_apertura, hora_cierre, ubicacion, capacidad_por_bloque) values
${values(
  VENDORS.map((v) => [
    q(v.id),
    q(v.name),
    q(v.tagline),
    q(v.emoji),
    arr(v.categories),
    q(v.prepTime),
    q(v.hours.open),
    q(v.hours.close),
    q(v.place),
    q(v.capacityPerSlot),
  ]),
)}
on conflict (id) do update set
  nombre = excluded.nombre, descripcion = excluded.descripcion, emoji = excluded.emoji,
  categorias = excluded.categorias, tiempo_preparacion = excluded.tiempo_preparacion,
  hora_apertura = excluded.hora_apertura, hora_cierre = excluded.hora_cierre,
  ubicacion = excluded.ubicacion, capacidad_por_bloque = excluded.capacidad_por_bloque;`,
  "",
  `insert into products (id, vendor_id, nombre, descripcion, precio, emoji, seccion, orden, popular, opciones) values
${values(
  PRODUCTS.map((p, i) => [
    q(p.id),
    q(p.vendorId),
    q(p.name),
    q(p.description),
    q(p.price),
    q(p.emoji),
    q(p.section),
    q(i),
    q(!!p.popular),
    `${q(JSON.stringify(p.options ?? []))}::jsonb`,
  ]),
)}
on conflict (id) do update set
  vendor_id = excluded.vendor_id, nombre = excluded.nombre, descripcion = excluded.descripcion,
  precio = excluded.precio, emoji = excluded.emoji, seccion = excluded.seccion, orden = excluded.orden,
  popular = excluded.popular, opciones = excluded.opciones;`,
  "",
  `insert into delivery_slots (id, etiqueta, hora_inicio, hora_fin) values
${values(DELIVERY_SLOTS.map((s) => [q(s.id), q(s.label), q(s.start), q(s.end)]))}
on conflict (id) do update set
  etiqueta = excluded.etiqueta, hora_inicio = excluded.hora_inicio, hora_fin = excluded.hora_fin;`,
  "",
  `insert into locations (salon, edificio, piso) values
${values(
  BUILDINGS.flatMap((b) =>
    Array.from({ length: b.floors }, (_, f) =>
      Array.from({ length: ROOMS_PER_FLOOR }, (_, r) => [q(roomCode(b.id, f + 1, r + 1)), q(b.id), q(f + 1)]),
    ).flat(),
  ),
)}
on conflict (salon) do nothing;`,
  "",
];

const out = fileURLToPath(new URL("../../supabase/seed.sql", import.meta.url));
writeFileSync(out, sections.join("\n"));
console.log(`seed.sql generado: ${VENDORS.length} locales, ${PRODUCTS.length} productos, ${DELIVERY_SLOTS.length} horas.`);
