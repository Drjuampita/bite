#!/usr/bin/env bash
# Prueba las migraciones y las reglas de negocio en un Postgres local (no toca Supabase).
# Uso: PGHOST=localhost PGPORT=5432 PGUSER=postgres ./supabase/tests/correr.sh
set -euo pipefail
cd "$(dirname "$0")/.."
DB=bite_pruebas
psql -q -c "set client_min_messages = warning" -c "drop database if exists $DB" -c "create database $DB"
for f in tests/00_entorno_supabase_simulado.sql migrations/*.sql seed.sql; do
  psql -q -d "$DB" -v ON_ERROR_STOP=1 -f "$f" 2>&1 | grep -v "wal_level\|HINT" || true
done
psql -d "$DB" -f tests/01_reglas_de_negocio.sql 2>&1 | grep -E "PASS|FAIL|ERROR" | sed -E 's/^.*NOTICE:  //'
