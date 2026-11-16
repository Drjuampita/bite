#!/usr/bin/env python3
"""Construye el modelo financiero de BITE como libro de Excel con fórmulas.

Uso:  python3 plan/herramientas/modelo.py
Sale: plan/BITE_Modelo_Financiero.xlsx  y  plan/herramientas/salidas.json

Todas las cifras del documento salen de este libro. Para cambiar un supuesto se edita
datos.py (o la celda azul en Excel) y se vuelve a generar.
"""
import datetime as dt
import json
import subprocess
import sys
from pathlib import Path

from openpyxl import Workbook, load_workbook
from openpyxl.styles import Alignment, Border, Font, PatternFill, Side
from openpyxl.utils import get_column_letter as CL

sys.path.insert(0, str(Path(__file__).resolve().parent))
import datos as D  # noqa: E402

RAIZ = Path(__file__).resolve().parents[1]
SALIDA = RAIZ / "BITE_Modelo_Financiero.xlsx"
SALIDAS_JSON = Path(__file__).resolve().parent / "salidas.json"

# ── Estilos ───────────────────────────────────────────────
F = "Arial"
AZUL = Font(name=F, size=10, color="0000FF")
NEGRO = Font(name=F, size=10, color="000000")
VERDE = Font(name=F, size=10, color="008000")
NEGRITA = Font(name=F, size=10, bold=True)
GRIS = Font(name=F, size=9, color="666666")
TITULO = Font(name=F, size=14, bold=True, color="A81D4A")
BLANCO = Font(name=F, size=10, bold=True, color="FFFFFF")
R_MARCA = PatternFill("solid", fgColor="E5386D")
R_SUAVE = PatternFill("solid", fgColor="FFDDE7")
R_GRIS = PatternFill("solid", fgColor="F3EEE9")
R_AMARILLO = PatternFill("solid", fgColor="FFFF00")
LINEA = Side(style="thin", color="D9D0C7")
BORDE_INF = Border(bottom=LINEA)
BORDE_SUP = Border(top=Side(style="thin", color="000000"))

FMT = {
    "$": '$#,##0;($#,##0);"-"',
    "$2": '$#,##0.00;($#,##0.00);"-"',
    "%": '0.0%;(0.0%);"-"',
    "n": '#,##0;(#,##0);"-"',
    "n1": '#,##0.0;(#,##0.0);"-"',
    "n2": '#,##0.00;(#,##0.00);"-"',
    "fecha": "mmm-yy",
    "txt": "@",
}

wb = Workbook()
REF = {}  # clave -> referencia absoluta con hoja, p. ej. "Supuestos!$D$8"
SAL = {}  # clave de salida -> (hoja, celda) para leer después de recalcular


def hoja(nombre, anchos):
    ws = wb.create_sheet(nombre)
    for i, a in enumerate(anchos, start=1):
        ws.column_dimensions[CL(i)].width = a
    ws.sheet_view.showGridLines = False
    return ws


def put(ws, celda, valor, fmt=None, font=NEGRO, fill=None, align=None, borde=None):
    c = ws[celda]
    c.value = valor
    c.font = font
    if fmt:
        c.number_format = FMT.get(fmt, fmt)
    if fill:
        c.fill = fill
    if align:
        c.alignment = align
    if borde:
        c.border = borde
    return c


def titulo(ws, texto, sub=None):
    put(ws, "A1", texto, font=TITULO)
    if sub:
        put(ws, "A2", sub, font=GRIS)
    ws.row_dimensions[1].height = 22


def encabezado(ws, fila, textos, col0=1):
    for i, t in enumerate(textos):
        put(ws, f"{CL(col0 + i)}{fila}", t, font=BLANCO, fill=R_MARCA,
            align=Alignment(horizontal="center" if i else "left", vertical="center", wrap_text=True))
    ws.row_dimensions[fila].height = 30


def seccion(ws, fila, texto, hasta_col):
    for c in range(1, hasta_col + 1):
        ws[f"{CL(c)}{fila}"].fill = R_SUAVE
    put(ws, f"A{fila}", texto, font=NEGRITA, fill=R_SUAVE)


def salida(clave, ws, celda):
    SAL[clave] = (ws.title, celda)


def abs_ref(ws, celda):
    col = "".join(ch for ch in celda if ch.isalpha())
    row = "".join(ch for ch in celda if ch.isdigit())
    nombre = ws.title if ws.title.isascii() else f"'{ws.title}'"
    return f"{nombre}!${col}${row}"


WRAP = Alignment(wrap_text=True, vertical="top")
ESC = [("P", "Pesimista"), ("E", "Esperado"), ("O", "Optimista")]

# ══════════════════════════════════════════════════════════
# Hoja Léeme (se llena al final, cuando existen las salidas)
# ══════════════════════════════════════════════════════════
ws_l = wb.active
ws_l.title = "Leeme"

# ══════════════════════════════════════════════════════════
# Supuestos
# ══════════════════════════════════════════════════════════
ws = hoja("Supuestos", [46, 16, 14, 14, 14, 13, 78])
titulo(ws, "Supuestos del modelo", "Texto azul = dato de entrada. Relleno amarillo = supuesto clave por validar con la encuesta y el piloto.")
f = 4
encabezado(ws, f, ["Concepto", "Unidad", "Valor", "", "", "Tipo", "Fuente o razonamiento"])
f += 1
for bloque, items in D.GENERALES:
    seccion(ws, f, bloque, 7)
    f += 1
    for clave, etiqueta, unidad, valor, fmt, tipo, nota in items:
        put(ws, f"A{f}", etiqueta)
        put(ws, f"B{f}", unidad, font=GRIS)
        es_formula = isinstance(valor, str) and valor.startswith("=")
        if es_formula:
            valor = valor.format(**REF)
        put(ws, f"C{f}", valor, fmt=fmt, font=NEGRO if es_formula else AZUL,
            fill=R_AMARILLO if tipo == "Supuesto clave" else None)
        put(ws, f"F{f}", tipo, font=GRIS)
        put(ws, f"G{f}", nota, font=GRIS, align=WRAP)
        REF[clave] = abs_ref(ws, f"C{f}")
        salida(f"sup_{clave}", ws, f"C{f}")
        f += 1

f += 1
encabezado(ws, f, ["Variables que cambian entre escenarios", "Unidad", "Pesimista", "Esperado", "Optimista", "Tipo", "Fuente o razonamiento"])
f += 1
for clave, etiqueta, unidad, (p, e, o), fmt, tipo, nota in D.ESCENARIOS:
    put(ws, f"A{f}", etiqueta)
    put(ws, f"B{f}", unidad, font=GRIS)
    for col, v, k in (("C", p, "P"), ("D", e, "E"), ("E", o, "O")):
        put(ws, f"{col}{f}", v, fmt=fmt, font=AZUL, fill=R_AMARILLO)
        REF[f"{clave}_{k}"] = abs_ref(ws, f"{col}{f}")
        salida(f"sup_{clave}_{k}", ws, f"{col}{f}")
    put(ws, f"F{f}", tipo, font=GRIS)
    put(ws, f"G{f}", nota, font=GRIS, align=WRAP)
    f += 1

f += 1
encabezado(ws, f, ["Calendario escolar (igual cada año)", "Mes", "Días de clase", "Arranque año 1", "", "Tipo", "Fuente o razonamiento"])
f += 1
cal0 = f
for i, (mes, dias, arranque) in enumerate(D.CALENDARIO, start=1):
    put(ws, f"A{f}", mes)
    put(ws, f"B{f}", i, fmt="n", font=GRIS)
    put(ws, f"C{f}", dias, fmt="n", font=AZUL)
    put(ws, f"D{f}", arranque, fmt="%", font=AZUL, fill=R_AMARILLO)
    if i == 1:
        put(ws, f"F{f}", "Dato / Supuesto", font=GRIS)
        put(ws, f"G{f}", D.NOTA_CALENDARIO, font=GRIS, align=WRAP)
    f += 1
REF["cal_dias"] = f"Supuestos!$C${cal0}:$C${f - 1}"
REF["cal_arr"] = f"Supuestos!$D${cal0}:$D${f - 1}"
put(ws, f"A{f}", "Días de clase al año", font=NEGRITA)
put(ws, f"C{f}", f"=SUM(C{cal0}:C{f - 1})", fmt="n", font=NEGRITA, borde=BORDE_SUP)
REF["dias_ano"] = abs_ref(ws, f"C{f}")
salida("dias_ano", ws, f"C{f}")
f += 1
put(ws, f"A{f}", "Meses equivalentes de clase al año")
put(ws, f"C{f}", f"={REF['dias_ano']}/{REF['dias_tipo']}", fmt="n2")
REF["meses_eq"] = abs_ref(ws, f"C{f}")
salida("meses_eq", ws, f"C{f}")
f += 1
put(ws, f"A{f}", "Meses del año con clases")
put(ws, f"C{f}", f'=COUNTIF({REF["cal_dias"]},">0")', fmt="n")
REF["meses_clase"] = abs_ref(ws, f"C{f}")
salida("meses_clase", ws, f"C{f}")
ws.freeze_panes = "A5"

# ══════════════════════════════════════════════════════════
# Gastos fijos
# ══════════════════════════════════════════════════════════
ws = hoja("Fijos", [52, 13, 11, 14, 12, 13, 78])
titulo(ws, "Gastos fijos", "Los de 12 meses se pagan haya o no clases. Los de 9 meses solo se pagan en los meses con clases.")
encabezado(ws, 4, ["Concepto", "Al mes", "Meses al año", "Al año", "Nivel", "Tipo", "Fuente o razonamiento"])
f = 5
f0 = f
SUSP_12, SUSP_CLASE = [], []
for etiqueta, valor, meses, nivel, tipo, nota, susp in D.FIJOS:
    if susp:
        (SUSP_12 if meses == 12 else SUSP_CLASE).append(f"B{f}")
    put(ws, f"A{f}", etiqueta)
    es_formula = isinstance(valor, str) and valor.startswith("=")
    put(ws, f"B{f}", valor.format(**REF) if es_formula else valor, fmt="$", font=NEGRO if es_formula else AZUL)
    put(ws, f"C{f}", 12 if meses == 12 else f"={REF['meses_clase']}", fmt="n", font=AZUL if meses == 12 else VERDE)
    put(ws, f"D{f}", f"=B{f}*C{f}", fmt="$")
    salida(f"fijo_{f - f0}_mes", ws, f"B{f}")
    salida(f"fijo_{f - f0}_ano", ws, f"D{f}")
    put(ws, f"E{f}", nivel, font=GRIS)
    put(ws, f"F{f}", tipo, font=GRIS)
    put(ws, f"G{f}", nota, font=GRIS, align=WRAP)
    f += 1
f1 = f - 1
put(ws, f"A{f}", "Total en un mes con clases", font=NEGRITA)
put(ws, f"B{f}", f"=SUM(B{f0}:B{f1})", fmt="$", font=NEGRITA, borde=BORDE_SUP)
put(ws, f"D{f}", f"=SUM(D{f0}:D{f1})", fmt="$", font=NEGRITA, borde=BORDE_SUP)
REF["fijos_ano"] = abs_ref(ws, f"D{f}")
salida("fijos_mes", ws, f"B{f}")
salida("fijos_ano", ws, f"D{f}")
REF["fijos_mes_clase"] = abs_ref(ws, f"B{f}")
f += 1
put(ws, f"A{f}", "Total en un mes sin clases")
put(ws, f"B{f}", f"=SUMIF(C{f0}:C{f1},12,B{f0}:B{f1})", fmt="$")
REF["fijos_12"] = abs_ref(ws, f"B{f}")
salida("fijos_mes_sin", ws, f"B{f}")
f += 1
put(ws, f"A{f}", "Gastos que solo se pagan en meses con clases")
put(ws, f"B{f}", f"={REF['fijos_mes_clase']}-{REF['fijos_12']}", fmt="$")
REF["fijos_clase"] = abs_ref(ws, f"B{f}")
f += 1
put(ws, f"A{f}", "Gastos de la empresa al año (no se repiten al abrir otro campus)")
put(ws, f"D{f}", f'=SUMIF(E{f0}:E{f1},"Empresa",D{f0}:D{f1})', fmt="$")
REF["fijos_empresa_ano"] = abs_ref(ws, f"D{f}")
salida("fijos_empresa_ano", ws, f"D{f}")
f += 1
put(ws, f"A{f}", "Gastos de cada campus al año")
put(ws, f"D{f}", f'=SUMIF(E{f0}:E{f1},"Campus",D{f0}:D{f1})', fmt="$")
salida("fijos_campus_ano", ws, f"D{f}")
f += 1
put(ws, f"A{f}", "Gastos que se suspenden si se activa el plan de contingencia, todos los meses")
put(ws, f"B{f}", "=" + ("+".join(SUSP_12) or "0"), fmt="$")
REF["ahorro_12"] = abs_ref(ws, f"B{f}")
salida("ahorro_12", ws, f"B{f}")
f += 1
put(ws, f"A{f}", "Gastos que se suspenden si se activa el plan de contingencia, meses con clases")
put(ws, f"B{f}", "=" + ("+".join(SUSP_CLASE) or "0"), fmt="$")
REF["ahorro_clase"] = abs_ref(ws, f"B{f}")
salida("ahorro_clase", ws, f"B{f}")
FIJOS_FILAS = (f0, f1)
f += 2
put(ws, f"A{f}", "Coordinador de operación (entra al pasar el umbral de pedidos)")
put(ws, f"B{f}", f"={REF['coord']}", fmt="$", font=VERDE)
put(ws, f"C{f}", f"={REF['meses_clase']}", fmt="n", font=VERDE)
put(ws, f"D{f}", f"=B{f}*C{f}", fmt="$")
put(ws, f"E{f}", "Campus", font=GRIS)
put(ws, f"G{f}", "Contrato por temporada: se paga solo en meses con clases. No forma parte de los gastos fijos base.", font=GRIS, align=WRAP)
REF["coord_ano"] = abs_ref(ws, f"D{f}")
salida("coord_ano", ws, f"D{f}")

# ══════════════════════════════════════════════════════════
# Inversión inicial
# ══════════════════════════════════════════════════════════
ws = hoja("Inversión", [58, 16, 13, 78])
titulo(ws, "Inversión inicial y origen de los recursos")
encabezado(ws, 4, ["Concepto", "Monto", "Tipo", "Fuente o razonamiento"])
f = 5
seccion(ws, f, "Gastos de arranque (se pagan una sola vez)", 4)
f += 1
f0 = f
for etiqueta, valor, tipo, nota in D.ARRANQUE:
    put(ws, f"A{f}", etiqueta)
    put(ws, f"B{f}", valor, fmt="$", font=AZUL)
    put(ws, f"C{f}", tipo, font=GRIS)
    put(ws, f"D{f}", nota, font=GRIS, align=WRAP)
    f += 1
ARR_FILAS = (f0, f - 1)
put(ws, f"A{f}", "Subtotal de gastos de arranque", font=NEGRITA)
put(ws, f"B{f}", f"=SUM(B{f0}:B{f - 1})", fmt="$", font=NEGRITA, borde=BORDE_SUP)
REF["arranque"] = abs_ref(ws, f"B{f}")
salida("arranque", ws, f"B{f}")
f += 1
put(ws, f"A{f}", "Reserva de capital de trabajo")
put(ws, f"B{f}", f"={REF['socios']}*{REF['aporte']}-{REF['arranque']}", fmt="$")
put(ws, f"D{f}", "Lo que queda en caja el día que abre el servicio: capital aportado menos gastos de arranque.", font=GRIS, align=WRAP)
REF["reserva"] = abs_ref(ws, f"B{f}")
salida("reserva", ws, f"B{f}")
f += 1
put(ws, f"A{f}", "Inversión inicial total = capital aportado por los socios", font=NEGRITA)
put(ws, f"B{f}", f"={REF['arranque']}+{REF['reserva']}", fmt="$", font=NEGRITA, borde=BORDE_SUP)
REF["capital"] = abs_ref(ws, f"B{f}")
salida("capital", ws, f"B{f}")
f += 1
put(ws, f"A{f}", "Meses de gastos fijos que cubre la reserva")
put(ws, f"B{f}", f"={REF['reserva']}/{REF['fijos_mes_clase']}", fmt="n1")
salida("reserva_meses", ws, f"B{f}")
f += 2
seccion(ws, f, "Origen de los recursos", 4)
f += 1
put(ws, f"A{f}", "Número de socios")
put(ws, f"B{f}", f"={REF['socios']}", fmt="n", font=VERDE)
f += 1
put(ws, f"A{f}", "Aportación en efectivo por socio", font=NEGRITA)
put(ws, f"B{f}", f"={REF['aporte']}", fmt="$", font=VERDE)
salida("aporte_socio", ws, f"B{f}")
f += 1
put(ws, f"A{f}", "Participación de cada socio")
put(ws, f"B{f}", f"=1/{REF['socios']}", fmt="%")
f += 1
put(ws, f"A{f}", "Financiamiento externo")
put(ws, f"B{f}", 0, fmt="$", font=AZUL)
put(ws, f"D{f}", "No se contrata deuda: el negocio cobra al alumno antes de pagar al local.", font=GRIS, align=WRAP)
f += 2
seccion(ws, f, "Aportación en especie (no es efectivo; se informa aparte)", 4)
f += 1
put(ws, f"A{f}", "Horas de desarrollo del MVP ya construido")
put(ws, f"B{f}", f"={REF['mvp_horas']}", fmt="n", font=VERDE)
f += 1
put(ws, f"A{f}", "Valor de mercado por hora")
put(ws, f"B{f}", f"={REF['mvp_tarifa']}", fmt="$", font=VERDE)
f += 1
put(ws, f"A{f}", "Valor del MVP aportado por los socios", font=NEGRITA)
put(ws, f"B{f}", f"={REF['mvp_horas']}*{REF['mvp_tarifa']}", fmt="$", font=NEGRITA)
salida("mvp_valor", ws, f"B{f}")

# ══════════════════════════════════════════════════════════
# Unitario: un pedido, peso por peso
# ══════════════════════════════════════════════════════════
ws = hoja("Unitario", [50, 15, 15, 15, 60])
titulo(ws, "Economía de un pedido", "Precios al alumno con IVA incluido. Ingresos y costos de BITE sin IVA.")
encabezado(ws, 4, ["Concepto", "Pesimista", "Esperado", "Optimista", "Cómo se calcula"])
U = {}  # clave -> fila
filas_u = [
    ("s", "Lo que paga el alumno (IVA incluido)"),
    ("ticket", "Comida a precio de mostrador", "={ticket}", "$2", "Supuestos"),
    ("markup", "Sobreprecio en el menú de la app", "={markup}", "$2", "Supuestos"),
    ("fee", "Envío", "={fee}", "$2", "Supuestos"),
    ("total", "Total que paga un alumno sin Pass", "={c}{ticket_r}+{c}{markup_r}+{c}{fee_r}", "$2", "Suma"),
    ("extra", "Costo extra frente al mostrador", "=({c}{markup_r}+{c}{fee_r})/{c}{ticket_r}", "%", "(Sobreprecio + envío) / comida"),
    ("s", "Lo que ingresa BITE por pedido (sin IVA)"),
    ("i_fee", "Envío", "={c}{fee_r}/(1+{iva})", "$2", "Envío / 1.16"),
    ("i_mark", "Sobreprecio", "={c}{markup_r}/(1+{iva})", "$2", "Sobreprecio / 1.16"),
    ("com", "Comisión pactada con el comercio", "={com_X}", "%", "Supuestos (cambia por escenario)"),
    ("i_com", "Comisión del comercio", "={c}{com_r}*{c}{ticket_r}", "$2", "Comisión × comida; el IVA se le factura aparte al comercio"),
    ("ing", "Ingreso por pedido", "={c}{i_fee_r}+{c}{i_mark_r}+{c}{i_com_r}", "$2", "Suma"),
    ("s", "Lo que cuesta entregarlo"),
    ("c_rep", "Pago al repartidor", "={pago}", "$2", "Supuestos"),
    ("c_ss", "Seguridad social del repartidor", "={c}{c_rep_r}*{pct_ss}", "$2", "Pago × % de seguridad social"),
    ("c_pas", "Pasarela de pago", "={pas_pct}*{c}{total_r}+{pas_fijo}", "$2", "% × total cobrado + cuota fija"),
    ("c_sello", "Sello de seguridad y etiqueta", "={sello}", "$2", "Supuestos"),
    ("c_punt", "Garantías: envíos y pedidos reembolsados", "={pct_tarde}*{c}{i_fee_r}+{pct_perdido}*{c}{ticket_r}", "$2", "% de entregas tardías × envío sin IVA, más % de pedidos no entregados × comida"),
    ("costo", "Costo por pedido", "={c}{c_rep_r}+{c}{c_ss_r}+{c}{c_pas_r}+{c}{c_sello_r}+{c}{c_punt_r}", "$2", "Suma"),
    ("margen", "Margen por pedido", "={c}{ing_r}-{c}{costo_r}", "$2", "Ingreso − costo"),
    ("margen_pct", "Margen sobre el ingreso", "={c}{margen_r}/{c}{ing_r}", "%", ""),
    ("s", "Pedido de un alumno con BITE Pass (no paga envío)"),
    ("p_ing", "Ingreso por pedido", "={c}{i_mark_r}+{c}{i_com_r}", "$2", "Sobreprecio + comisión"),
    ("p_pas", "Pasarela de pago", "={pas_pct}*({c}{ticket_r}+{c}{markup_r})+{pas_fijo}", "$2", "% × (comida + sobreprecio) + cuota fija"),
    ("p_costo", "Costo por pedido", "={c}{c_rep_r}+{c}{c_ss_r}+{c}{p_pas_r}+{c}{c_sello_r}+{pct_perdido}*{c}{ticket_r}", "$2", "Suma, con los pedidos no entregados"),
    ("p_margen", "Margen por pedido con Pass", "={c}{p_ing_r}-{c}{p_costo_r}", "$2", "Debe ser positivo para que la suscripción pueda ser ilimitada"),
    ("s", "BITE Pass, por suscriptor al mes"),
    ("pass_precio", "Cuota mensual (IVA incluido)", "={passfee}", "$2", "Supuestos"),
    ("pass_neto", "Cuota sin IVA y sin pasarela", "={c}{pass_precio_r}/(1+{iva})-({pas_pct}*{c}{pass_precio_r}+{pas_fijo})", "$2", ""),
    ("ped_pass", "Pedidos al mes de un suscriptor", "={ped_pass_X}", "n1", "Supuestos (cambia por escenario)"),
    ("pass_deja", "Lo que deja un suscriptor al mes", "={c}{pass_neto_r}+{c}{ped_pass_r}*{c}{p_margen_r}", "$2", "Cuota neta + pedidos × margen con Pass"),
    ("ped_occ", "Pedidos al mes de un alumno ocasional", "={ped_occ_X}", "n1", "Supuestos (cambia por escenario)"),
    ("occ_deja", "Lo que deja un alumno ocasional al mes", "={c}{ped_occ_r}*{c}{margen_r}", "$2", "Pedidos × margen"),
    ("pass_equil", "Pedidos al mes con los que el Pass se paga solo", "={c}{pass_precio_r}/{c}{fee_r}", "n1", "Cuota / envío"),
    ("s", "Promedio ponderado (mezcla de alumnos con y sin Pass)"),
    ("pct_pass", "Alumnos con Pass", "={pct_pass_X}", "%", "Supuestos (cambia por escenario)"),
    ("ped_user", "Pedidos al mes por usuario activo", "=(1-{c}{pct_pass_r})*{c}{ped_occ_r}+{c}{pct_pass_r}*{c}{ped_pass_r}", "n2", ""),
    ("contrib_user", "Margen al mes por usuario activo", "=(1-{c}{pct_pass_r})*{c}{occ_deja_r}+{c}{pct_pass_r}*{c}{pass_deja_r}", "$2", ""),
    ("margen_prom", "Margen promedio por pedido (incluye cuotas)", "={c}{contrib_user_r}/{c}{ped_user_r}", "$2", "Margen por usuario / pedidos por usuario"),
]
f = 5
for item in filas_u:
    if item[0] != "s":
        U[item[0]] = f
    f += 1
f = 5
for item in filas_u:
    if item[0] == "s":
        seccion(ws, f, item[1], 5)
        f += 1
        continue
    clave, etiqueta, formula, fmt, nota = item
    negrita = clave in ("total", "ing", "costo", "margen", "p_margen", "pass_deja", "contrib_user", "margen_prom")
    put(ws, f"A{f}", etiqueta, font=NEGRITA if negrita else NEGRO)
    for col, (k, _) in zip("BCD", ESC):
        ctx = dict(REF)
        ctx.update({f"{kk}_r": v for kk, v in U.items()})
        ctx["c"] = col
        ctx["com_X"] = REF[f"com_{k}"]
        ctx["ped_pass_X"] = REF[f"ped_pass_{k}"]
        ctx["ped_occ_X"] = REF[f"ped_occ_{k}"]
        ctx["pct_pass_X"] = REF[f"pct_pass_{k}"]
        externo = "Supuestos" in formula.format(**ctx) and "+" not in formula and "*" not in formula and "/" not in formula
        put(ws, f"{col}{f}", formula.format(**ctx), fmt=fmt,
            font=VERDE if externo else (NEGRITA if negrita else NEGRO),
            borde=BORDE_SUP if negrita else None)
        REF[f"u_{clave}_{k}"] = abs_ref(ws, f"{col}{f}")
        salida(f"u_{clave}_{k}", ws, f"{col}{f}")
    put(ws, f"E{f}", nota, font=GRIS, align=WRAP)
    f += 1
ws.freeze_panes = "B5"

# ══════════════════════════════════════════════════════════
# Escenarios mensuales (36 meses)
# ══════════════════════════════════════════════════════════
N = 36
FILAS_ESC = {}
C0 = 3  # primera columna de meses (C)
CN = C0 + N - 1
c0, cN = CL(C0), CL(CN)
ANUAL = {}  # (escenario, clave) -> {1: ref, 2: ref, 3: ref}


def hoja_escenario(k, nombre):
    ws = hoja(f"Esc_{nombre}", [48, 12] + [11.5] * N)
    titulo(ws, f"Escenario {nombre.lower()}: 36 meses de operación en el campus Anáhuac Querétaro",
           "Los parámetros vienen de Supuestos. Cada columna es un mes; los meses sin clases no generan pedidos pero sí gastos fijos.")
    put(ws, "A4", "Parámetros del escenario", font=NEGRITA, fill=R_SUAVE)
    put(ws, "B4", None, fill=R_SUAVE)
    par = [
        ("adop1", "Adopción objetivo, año 1", "%"), ("adop2", "Adopción objetivo, año 2", "%"),
        ("adop3", "Adopción objetivo, año 3", "%"), ("pct_pass", "Usuarios con BITE Pass", "%"),
        ("ped_occ", "Pedidos al mes, usuario ocasional", "n1"), ("ped_pass", "Pedidos al mes, usuario con Pass", "n1"),
        ("com", "Comisión al comercio", "%"),
    ]
    P = {}
    for i, (clave, etiqueta, fmt) in enumerate(par):
        r = 5 + i
        put(ws, f"A{r}", etiqueta)
        put(ws, f"B{r}", f"={REF[f'{clave}_{k}']}", fmt=fmt, font=VERDE)
        P[clave] = f"$B${r}"

    put(ws, "A12", "Usuarios activos mínimos en abril del año 1 (regla de decisión)")
    put(ws, "B12", f"=ROUND({REF['alumnos']}*{REF['adop_decision']}*INDEX({REF['cal_arr']},4),0)", fmt="n")
    salida("umbral_abr", ws, "B12")
    H = 13
    encabezado(ws, H, ["Concepto", "Unidad"] + [None] * N)
    for j in range(N):
        col = CL(C0 + j)
        fecha = dt.date(D.ANO_INICIO + j // 12, j % 12 + 1, 1)
        put(ws, f"{col}{H}", fecha, fmt="fecha", font=BLANCO, fill=R_MARCA, align=Alignment(horizontal="center", vertical="center"))

    R = {}
    filas = [
        ("ano", "Año de operación", "", "n"), ("dias", "Días de clase", "días", "n"),
        ("arr", "Factor de arranque", "%", "%"), ("adop", "Adopción (alumnos activos / alumnos)", "%", "%"),
        ("users", "Usuarios activos", "alumnos", "n"), ("pass", "Usuarios con BITE Pass", "alumnos", "n"),
        ("occ", "Usuarios ocasionales", "alumnos", "n"), ("new", "Usuarios nuevos", "alumnos", "n"),
        ("o_occ", "Pedidos de usuarios ocasionales", "pedidos", "n"), ("o_pass", "Pedidos de usuarios con Pass", "pedidos", "n"),
        ("ord", "Pedidos totales", "pedidos", "n"), ("oday", "Pedidos por día de clase", "pedidos", "n1"),
        ("S1", "INGRESOS (sin IVA)", None, None),
        ("i_fee", "Envíos", "$", "$"), ("i_mark", "Sobreprecio de menú", "$", "$"),
        ("i_com", "Comisión de los comercios", "$", "$"), ("i_pass", "Cuotas de BITE Pass", "$", "$"),
        ("ing", "Ingresos totales", "$", "$"),
        ("S2", "COSTOS VARIABLES", None, None),
        ("c_rep", "Pago a repartidores", "$", "$"), ("c_gar", "Garantía mínima por bloque", "$", "$"),
        ("c_ss", "Seguridad social de repartidores", "$", "$"), ("c_pas", "Pasarela de pago", "$", "$"),
        ("c_sello", "Sellos y etiquetas", "$", "$"), ("c_promo", "Promoción: primer envío gratis", "$", "$"),
        ("c_punt", "Garantías: envíos y pedidos reembolsados", "$", "$"),
        ("cvar", "Costos variables totales", "$", "$"), ("mc", "Margen de contribución", "$", "$"),
        ("mc_pct", "Margen de contribución sobre ingresos", "%", "%"),
        ("S3", "GASTOS FIJOS Y RESULTADO", None, None),
        ("f_base", "Gastos fijos base", "$", "$"), ("f_coord", "Coordinador de operación", "$", "$"),
        ("fijos", "Gastos fijos totales", "$", "$"), ("arranque", "Gastos de arranque (una sola vez)", "$", "$"),
        ("ebit", "Utilidad de operación", "$", "$"), ("isr", "ISR del ejercicio (se paga en diciembre)", "$", "$"),
        ("flujo", "Flujo del mes", "$", "$"), ("caja", "Caja al cierre del mes", "$", "$"),
        ("S4", "DATOS DE CONTROL", None, None),
        ("gmv", "Venta de comida generada a los locales (con IVA)", "$", "$"),
        ("cont", "Plan de contingencia activo (1 = sí)", "", "n"),
        ("blq", "Bloques de entrega abiertos", "bloques", "n"),
        ("rb", "Turnos de repartidor por día (un turno = un repartidor en un bloque)", "turnos", "n1"),
        ("ing_rb", "Ingreso promedio del repartidor por bloque", "$", "$2"),
        ("pico", "Pedidos en el bloque pico", "pedidos", "n1"),
        ("rec", "Caja ≥ capital aportado (1 = sí)", "", "n"),
    ]
    r = H + 1
    for clave, *_ in filas:
        R[clave] = r
        r += 1

    for clave, etiqueta, unidad, fmt in filas:
        r = R[clave]
        if clave.startswith("S"):
            seccion(ws, r, etiqueta, CN)
            continue
        negrita = clave in ("ord", "ing", "cvar", "mc", "fijos", "ebit", "caja")
        put(ws, f"A{r}", etiqueta, font=NEGRITA if negrita else NEGRO)
        put(ws, f"B{r}", unidad, font=GRIS)
        for j in range(N):
            c = CL(C0 + j)
            prev = CL(C0 + j - 1) if j else None
            g = lambda key: f"{c}{R[key]}"  # noqa: E731
            fecha = f"{c}${H}"
            fx = {
                "ano": f"={j // 12 + 1}",
                "dias": f"=INDEX({REF['cal_dias']},MONTH({fecha}))",
                "arr": f"=IF({g('ano')}=1,INDEX({REF['cal_arr']},MONTH({fecha})),IF(MONTH({fecha})=8,{REF['regreso']},1))",
                "adop": (f"=IF({g('ano')}=1,{P['adop1']},CHOOSE({g('ano')},0,{P['adop1']},{P['adop2']})"
                         f"+(CHOOSE({g('ano')},{P['adop1']},{P['adop2']},{P['adop3']})-CHOOSE({g('ano')},0,{P['adop1']},{P['adop2']}))"
                         f"*IF(MONTH({fecha})<=7,{REF['avance_sem1']},1))*{g('arr')}"),
                "cont": "=0" if j < 7 else f"=IF(${CL(C0 + 3)}{R['users']}<$B$12,1,0)",
                "users": f"=IF({g('dias')}>0,ROUND({REF['alumnos']}*{g('adop')},0),0)",
                "pass": f"=ROUND({g('users')}*{P['pct_pass']},0)",
                "occ": f"={g('users')}-{g('pass')}",
                "new": f"={g('users')}" if j == 0 else f"=MAX(0,{g('users')}-MAX(${c0}{R['users']}:{prev}{R['users']}))",
                "o_occ": f"={g('occ')}*{P['ped_occ']}*{g('dias')}/{REF['dias_tipo']}",
                "o_pass": f"={g('pass')}*{P['ped_pass']}*{g('dias')}/{REF['dias_tipo']}",
                "ord": f"={g('o_occ')}+{g('o_pass')}",
                "oday": f"=IF({g('dias')}>0,{g('ord')}/{g('dias')},0)",
                "i_fee": f"={g('o_occ')}*{REF['fee']}/(1+{REF['iva']})",
                "i_mark": f"={g('ord')}*{REF['markup']}/(1+{REF['iva']})",
                "i_com": f"={g('ord')}*{P['com']}*{REF['ticket']}",
                "i_pass": f"={g('pass')}*{REF['passfee']}/(1+{REF['iva']})*MIN(1,{g('dias')}/{REF['dias_tipo']})",
                "ing": f"=SUM({c}{R['i_fee']}:{c}{R['i_pass']})",
                "c_rep": f"={g('ord')}*{REF['pago']}",
                "c_gar": f"={g('dias')}*MAX(0,{REF['garantia']}*{g('rb')}-{REF['pago']}*{g('oday')})",
                "c_ss": f"=({g('c_rep')}+{g('c_gar')})*{REF['pct_ss']}",
                "c_pas": (f"={g('o_occ')}*({REF['pas_pct']}*({REF['ticket']}+{REF['markup']}+{REF['fee']})+{REF['pas_fijo']})"
                          f"+{g('o_pass')}*({REF['pas_pct']}*({REF['ticket']}+{REF['markup']})+{REF['pas_fijo']})"
                          f"+{g('pass')}*MIN(1,{g('dias')}/{REF['dias_tipo']})*({REF['pas_pct']}*{REF['passfee']}+{REF['pas_fijo']})"),
                "c_sello": f"={g('ord')}*{REF['sello']}",
                "c_promo": f"={g('new')}*{REF['fee']}/(1+{REF['iva']})",
                "c_punt": f"={g('o_occ')}*{REF['pct_tarde']}*{REF['fee']}/(1+{REF['iva']})+{g('ord')}*{REF['pct_perdido']}*{REF['ticket']}",
                "cvar": f"=SUM({c}{R['c_rep']}:{c}{R['c_punt']})",
                "mc": f"={g('ing')}-{g('cvar')}",
                "mc_pct": f"=IF({g('ing')}>0,{g('mc')}/{g('ing')},0)",
                "f_base": f"={REF['fijos_12']}+IF({g('dias')}>0,{REF['fijos_clase']},0)-{g('cont')}*({REF['ahorro_12']}+IF({g('dias')}>0,{REF['ahorro_clase']},0))",
                "f_coord": f"=IF(AND({g('dias')}>0,MAX(${c0}{R['oday']}:{c}{R['oday']})>={REF['umbral_coord']}),{REF['coord']},0)",
                "fijos": f"={g('f_base')}+{g('f_coord')}",
                "arranque": f"={REF['arranque']}" if j == 0 else "=0",
                "ebit": f"={g('mc')}-{g('fijos')}-{g('arranque')}",
                "isr": f"=IF(MONTH({fecha})=12,INDEX($C${{isr_r}}:$E${{isr_r}},1,{g('ano')}),0)",
                "flujo": f"={g('ebit')}-{g('isr')}",
                "caja": f"={REF['capital']}+{g('flujo')}" if j == 0 else f"={prev}{R['caja']}+{g('flujo')}",
                "gmv": f"={g('ord')}*{REF['ticket']}",
                "blq": f"=IF({g('dias')}>0,MIN({REF['bloques']},MAX({REF['bloques_piloto']},ROUNDUP({g('oday')}/{REF['ped_abrir']},0))),0)",
                "rb": f"=IF({g('dias')}>0,MAX({REF['rep_min']}*{g('blq')},ROUNDUP({g('oday')}/{REF['ped_rb']},0)),0)",
                "ing_rb": f"=IF({g('rb')}>0,({REF['pago']}*{g('oday')}+{g('c_gar')}/MAX(1,{g('dias')}))/{g('rb')},0)",
                "pico": f"={g('oday')}*{REF['pico']}",
                "rec": f"=IF({g('caja')}>={REF['capital']},1,0)",
            }[clave]
            put(ws, f"{c}{r}", fx, fmt=fmt, font=NEGRITA if negrita else NEGRO, borde=BORDE_SUP if negrita else None)

    # Resumen anual
    A0 = max(R.values()) + 3
    put(ws, f"A{A0}", "Resumen anual", font=TITULO)
    encabezado(ws, A0 + 1, ["Concepto", "Unidad"] + [f"Año {y} ({D.ANO_INICIO + y - 1})" for y in (1, 2, 3)])
    yr = f"${c0}${R['ano']}:${cN}${R['ano']}"

    def rango(key):
        return f"${c0}${R[key]}:${cN}${R[key]}"

    def suma(key, y):
        return f"=SUMIF({yr},{y},{rango(key)})"

    res = [
        ("pedidos", "Pedidos", "pedidos", "n", lambda y, c: suma("ord", y)),
        ("dias", "Días de clase", "días", "n", lambda y, c: suma("dias", y)),
        ("oday", "Pedidos por día de clase (promedio)", "pedidos", "n1", lambda y, c: f"={c}{{pedidos}}/{c}{{dias}}"),
        ("users", "Usuarios activos en noviembre", "alumnos", "n", lambda y, c: f"=INDEX({rango('users')},1,{12 * (y - 1) + 11})"),
        ("ing", "Ingresos totales (sin IVA)", "$", "$", lambda y, c: suma("ing", y)),
        ("cvar", "Costos variables", "$", "$", lambda y, c: suma("cvar", y)),
        ("mc", "Margen de contribución", "$", "$", lambda y, c: f"={c}{{ing}}-{c}{{cvar}}"),
        ("mc_pct", "Margen de contribución sobre ingresos", "%", "%", lambda y, c: f"=IF({c}{{ing}}>0,{c}{{mc}}/{c}{{ing}},0)"),
        ("fijos", "Gastos fijos", "$", "$", lambda y, c: suma("fijos", y)),
        ("arranque", "Gastos de arranque", "$", "$", lambda y, c: suma("arranque", y)),
        ("ebit", "Utilidad de operación", "$", "$", lambda y, c: f"={c}{{mc}}-{c}{{fijos}}-{c}{{arranque}}"),
        ("perdida", "Pérdida fiscal pendiente al inicio del año", "$", "$",
         lambda y, c: "=0" if y == 1 else f"=MAX(0,{CL(C0 + y - 2)}{{perdida}}-{CL(C0 + y - 2)}{{ebit}})"),
        ("base", "Base gravable", "$", "$", lambda y, c: f"=MAX(0,{c}{{ebit}}-{c}{{perdida}})"),
        ("isr", "ISR", "$", "$", lambda y, c: f"={c}{{base}}*{REF['isr']}"),
        ("neta", "Utilidad neta", "$", "$", lambda y, c: f"={c}{{ebit}}-{c}{{isr}}"),
        ("caja", "Caja al cierre del año", "$", "$", lambda y, c: f"=INDEX({rango('caja')},1,{12 * y})"),
        ("caja_min", "Caja mínima durante el año", "$", "$",
         lambda y, c: f"=MIN({CL(C0 + 12 * (y - 1))}{R['caja']}:{CL(C0 + 12 * y - 1)}{R['caja']})"),
        ("gmv", "Venta de comida generada a los locales (con IVA)", "$", "$", lambda y, c: suma("gmv", y)),
        ("ing_rb", "Ingreso promedio del repartidor por bloque (mes de octubre)", "$", "$2",
         lambda y, c: f"=INDEX({rango('ing_rb')},1,{12 * (y - 1) + 10})"),
        ("rb", "Turnos de repartidor por día (mes de octubre)", "turnos", "n1",
         lambda y, c: f"=INDEX({rango('rb')},1,{12 * (y - 1) + 10})"),
        ("oday_oct", "Pedidos por día en octubre (mes completo)", "pedidos", "n1",
         lambda y, c: f"=INDEX({rango('oday')},1,{12 * (y - 1) + 10})"),
    ]
    RA = {clave: A0 + 2 + i for i, (clave, *_) in enumerate(res)}
    for clave, etiqueta, unidad, fmt, fn in res:
        r = RA[clave]
        negrita = clave in ("ing", "mc", "ebit", "neta", "caja")
        put(ws, f"A{r}", etiqueta, font=NEGRITA if negrita else NEGRO)
        put(ws, f"B{r}", unidad, font=GRIS)
        for y in (1, 2, 3):
            c = CL(C0 + y - 1)
            put(ws, f"{c}{r}", fn(y, c).format(**RA), fmt=fmt, font=NEGRITA if negrita else NEGRO,
                borde=BORDE_SUP if negrita else None)
            ANUAL.setdefault((k, clave), {})[y] = f"Esc_{nombre}!${c}${r}"
            salida(f"{k}_{clave}_{y}", ws, f"{c}{r}")
    # La fila mensual de ISR apunta al resumen anual
    for j in range(N):
        c = CL(C0 + j)
        cell = ws[f"{c}{R['isr']}"]
        cell.value = cell.value.format(isr_r=RA["isr"])

    r = max(RA.values()) + 2
    put(ws, f"A{r}", "Mes en que la caja vuelve a superar el capital aportado", font=NEGRITA)
    put(ws, f"C{r}", f'=IFERROR(MATCH(1,{rango("rec")},0),"No en 36 meses")', fmt="n", font=NEGRITA)
    salida(f"{k}_payback", ws, f"C{r}")
    REF[f"payback_{k}"] = abs_ref(ws, f"C{r}")
    r += 1
    put(ws, f"A{r}", "Caja mínima en los 36 meses", font=NEGRITA)
    put(ws, f"C{r}", f"=MIN({rango('caja')})", fmt="$", font=NEGRITA)
    salida(f"{k}_caja_min", ws, f"C{r}")
    REF[f"caja_min_{k}"] = abs_ref(ws, f"C{r}")
    r += 1
    put(ws, f"A{r}", "Máximo de pedidos en el bloque pico", font=NEGRITA)
    put(ws, f"C{r}", f"=MAX({rango('pico')})", fmt="n1", font=NEGRITA)
    salida(f"{k}_pico_max", ws, f"C{r}")
    REF[f"pico_max_{k}"] = abs_ref(ws, f"C{r}")
    r += 1
    put(ws, f"A{r}", "Mes en que se contrata al coordinador de operación", font=NEGRITA)
    put(ws, f"C{r}", f'=IFERROR(MATCH({REF["coord"]},{rango("f_coord")},0),"No se contrata")', fmt="n", font=NEGRITA)
    salida(f"{k}_mes_coord", ws, f"C{r}")
    ws.freeze_panes = f"{c0}{H + 1}"
    FILAS_ESC[k] = dict(R)
    salida(f"{k}_contingencia", ws, f"{CL(C0 + 7)}{R['cont']}")
    # Guardar referencias mensuales útiles para gráficas
    for clave in ("ord", "oday", "ing", "mc", "ebit", "caja", "users", "fijos"):
        for j in range(N):
            salida(f"m_{k}_{clave}_{j + 1}", ws, f"{CL(C0 + j)}{R[clave]}")
    return ws


for k, nombre in ESC:
    hoja_escenario(k, nombre)

# ══════════════════════════════════════════════════════════
# Comparativo de escenarios
# ══════════════════════════════════════════════════════════
ws = hoja("Escenarios", [50] + [15] * 9)
titulo(ws, "Comparativo de escenarios", "Solo cambian cuatro grupos de variables: adopción, alumnos con Pass, frecuencia de pedido y comisión.")
encabezado(ws, 4, ["Concepto"] + [f"{n}\nAño {y}" for _, n in ESC for y in (1, 2, 3)])
lineas = [
    ("users", "Usuarios activos en noviembre", "n"), ("pedidos", "Pedidos del año", "n"),
    ("oday", "Pedidos por día de clase", "n1"), ("ing", "Ingresos (sin IVA)", "$"),
    ("cvar", "Costos variables", "$"), ("mc", "Margen de contribución", "$"),
    ("fijos", "Gastos fijos", "$"), ("arranque", "Gastos de arranque", "$"),
    ("ebit", "Utilidad de operación", "$"), ("isr", "ISR", "$"), ("neta", "Utilidad neta", "$"),
    ("caja", "Caja al cierre del año", "$"), ("gmv", "Venta generada a los locales", "$"),
]
f = 5
for clave, etiqueta, fmt in lineas:
    negrita = clave in ("ing", "ebit", "neta", "caja")
    put(ws, f"A{f}", etiqueta, font=NEGRITA if negrita else NEGRO)
    col = 2
    for k, _ in ESC:
        for y in (1, 2, 3):
            put(ws, f"{CL(col)}{f}", f"={ANUAL[(k, clave)][y]}", fmt=fmt, font=VERDE)
            col += 1
    f += 1
f += 1
put(ws, f"A{f}", "Mes de recuperación del capital", font=NEGRITA)
for i, (k, _) in enumerate(ESC):
    put(ws, f"{CL(2 + 3 * i)}{f}", f"={REF[f'payback_{k}']}", fmt="n", font=VERDE)
f += 1
put(ws, f"A{f}", "Caja mínima en 36 meses", font=NEGRITA)
for i, (k, _) in enumerate(ESC):
    put(ws, f"{CL(2 + 3 * i)}{f}", f"={REF[f'caja_min_{k}']}", fmt="$", font=VERDE)
f += 1
put(ws, f"A{f}", "Utilidad neta acumulada en 3 años", font=NEGRITA)
for i, (k, _) in enumerate(ESC):
    c = CL(2 + 3 * i)
    put(ws, f"{c}{f}", "=" + "+".join(ANUAL[(k, "neta")][y] for y in (1, 2, 3)), fmt="$", font=NEGRITA)
    salida(f"{k}_neta_acum", ws, f"{c}{f}")
ws.freeze_panes = "B5"

# ══════════════════════════════════════════════════════════
# Punto de equilibrio
# ══════════════════════════════════════════════════════════
ws = hoja("Equilibrio", [58, 16, 16, 16, 62])
titulo(ws, "Punto de equilibrio", "Cuántos alumnos y cuántos pedidos al día necesita BITE para cubrir sus gastos fijos de un año completo.")
encabezado(ws, 4, ["Concepto", "Pesimista", "Esperado", "Optimista", "Cómo se calcula"])
E = {}
filas_e = [
    ("contrib", "Margen al mes por usuario activo", "={u_contrib_user_X}", "$2", "Hoja Unitario"),
    ("ped_user", "Pedidos al mes por usuario activo", "={u_ped_user_X}", "n2", "Hoja Unitario"),
    ("meses", "Meses equivalentes de clase al año", "={meses_eq}", "n2", "Días de clase al año / 20"),
    ("s", "Con los gastos fijos base"),
    ("fijos", "Gastos fijos de un año", "={fijos_ano}", "$", "Hoja Fijos"),
    ("be_users", "Usuarios activos de equilibrio", "={c}{fijos_r}/({c}{contrib_r}*{c}{meses_r})", "n", "Gastos fijos / (margen por usuario × meses de clase)"),
    ("be_adop", "Adopción de equilibrio", "={c}{be_users_r}/{alumnos}", "%", "Usuarios de equilibrio / alumnos del campus"),
    ("be_oday", "Pedidos por día de equilibrio", "={c}{be_users_r}*{c}{ped_user_r}/{dias_tipo}", "n1", "Usuarios × pedidos al mes / 20 días"),
    ("s", "Con coordinador de operación contratado"),
    ("fijos2", "Gastos fijos de un año, con coordinador", "={fijos_ano}+{coord_ano}", "$", "Fijos base + coordinador en los meses con clases"),
    ("be2_users", "Usuarios activos de equilibrio", "={c}{fijos2_r}/({c}{contrib_r}*{c}{meses_r})", "n", ""),
    ("be2_adop", "Adopción de equilibrio", "={c}{be2_users_r}/{alumnos}", "%", ""),
    ("be2_oday", "Pedidos por día de equilibrio", "={c}{be2_users_r}*{c}{ped_user_r}/{dias_tipo}", "n1", ""),
    ("s", "Contra lo proyectado"),
    ("adop2", "Adopción proyectada, año 2", "={adop2_X}", "%", "Supuestos"),
    ("oday2", "Pedidos por día proyectados, año 2 (octubre)", "={oday2_X}", "n1", "Hoja del escenario"),
    ("holgura", "Holgura: cuánto puede caer la demanda sin perder", "=1-{c}{be2_oday_r}/{c}{oday2_r}", "%", "1 − equilibrio con coordinador / proyectado"),
    ("uno_de", "Uno de cada cuántos alumnos debe usar BITE", "=1/{c}{be_adop_r}", "n", "1 / adopción de equilibrio (fijos base)"),
]
f = 5
for it in filas_e:
    if it[0] != "s":
        E[it[0]] = f
    f += 1
f = 5
for it in filas_e:
    if it[0] == "s":
        seccion(ws, f, it[1], 5)
        f += 1
        continue
    clave, etiqueta, formula, fmt, nota = it
    negrita = clave in ("be_oday", "be2_oday", "holgura", "be_adop")
    put(ws, f"A{f}", etiqueta, font=NEGRITA if negrita else NEGRO)
    for col, (k, _) in zip("BCD", ESC):
        ctx = dict(REF)
        ctx.update({f"{kk}_r": v for kk, v in E.items()})
        ctx.update(c=col, u_contrib_user_X=REF[f"u_contrib_user_{k}"], u_ped_user_X=REF[f"u_ped_user_{k}"],
                   adop2_X=REF[f"adop2_{k}"], oday2_X=ANUAL[(k, "oday_oct")][2])
        put(ws, f"{col}{f}", formula.format(**ctx), fmt=fmt, font=NEGRITA if negrita else NEGRO)
        REF[f"e_{clave}_{k}"] = abs_ref(ws, f"{col}{f}")
        salida(f"e_{clave}_{k}", ws, f"{col}{f}")
    put(ws, f"E{f}", nota, font=GRIS, align=WRAP)
    f += 1
f += 1
put(ws, f"A{f}", "Curva para la gráfica (escenario esperado, año completo)", font=NEGRITA)
f += 1
encabezado(ws, f, ["Pedidos por día de clase", "Margen anual", "Fijos base", "Fijos con coordinador", "Utilidad con fijos base"])
f += 1
EQ_CURVA = []
for q in range(0, 151, 10):
    put(ws, f"A{f}", q, fmt="n", font=AZUL)
    put(ws, f"B{f}", f"=A{f}*{REF['dias_ano']}*{REF['u_margen_prom_E']}", fmt="$")
    put(ws, f"C{f}", f"={REF['fijos_ano']}", fmt="$")
    put(ws, f"D{f}", f"={REF['fijos_ano']}+{REF['coord_ano']}", fmt="$")
    put(ws, f"E{f}", f"=B{f}-C{f}", fmt="$")
    for col, nm in zip("BCD", ("margen", "fijos", "fijos2")):
        salida(f"curva_{nm}_{q}", ws, f"{col}{f}")
    EQ_CURVA.append(q)
    f += 1

# ══════════════════════════════════════════════════════════
# Sensibilidad (año tipo, escenario esperado, ritmo del año 2)
# ══════════════════════════════════════════════════════════
ws = hoja("Sensibilidad", [44, 11, 9, 9, 9, 10, 11, 9, 10, 11, 9, 13, 13, 13, 14, 15])
titulo(ws, "Sensibilidad: qué pasa si un supuesto cambia",
       "Año completo al ritmo de cierre del año 2 del escenario esperado. El coordinador se paga solo si el volumen pasa el umbral. Cada fila cambia un solo supuesto (en azul).")
cols = ["Caso", "Adopción", "% Pass", "Ped. ocas.", "Ped. Pass", "Comida", "Sobreprecio", "Envío", "Comisión",
        "Pago repartidor", "Seg. social", "Margen pedido", "Margen Pass", "Margen por usuario", "Utilidad de operación", "Cambio contra la base"]
encabezado(ws, 4, cols)
base_ref = {"B": REF["adop2_E"], "C": REF["pct_pass_E"], "D": REF["ped_occ_E"], "E": REF["ped_pass_E"], "F": REF["ticket"],
            "G": REF["markup"], "H": REF["fee"], "I": REF["com_E"], "J": REF["pago"], "K": REF["pct_ss"]}
fmt_col = {"B": "%", "C": "%", "D": "n1", "E": "n1", "F": "$", "G": "$", "H": "$", "I": "%", "J": "$", "K": "%"}
f = 5
BASE_F = f
for nombre_caso, cambios in D.SENSIBILIDAD:
    put(ws, f"A{f}", nombre_caso, font=NEGRITA if f == BASE_F else NEGRO)
    for col in "BCDEFGHIJK":
        if col in cambios:
            put(ws, f"{col}{f}", cambios[col], fmt=fmt_col[col], font=AZUL)
        elif f == BASE_F:
            put(ws, f"{col}{f}", f"={base_ref[col]}", fmt=fmt_col[col], font=VERDE)
        else:
            put(ws, f"{col}{f}", f"={col}${BASE_F}", fmt=fmt_col[col])
    iva, pp, pf, sello, pas = REF["iva"], REF["pas_pct"], REF["pas_fijo"], REF["sello"], REF["passfee"]
    put(ws, f"L{f}", f"=(H{f}+G{f})/(1+{iva})+I{f}*F{f}-(J{f}*(1+K{f})+{pp}*(F{f}+G{f}+H{f})+{pf}+{sello}+{REF['pct_tarde']}*H{f}/(1+{iva})+{REF['pct_perdido']}*F{f})", fmt="$2")
    put(ws, f"M{f}", f"=G{f}/(1+{iva})+I{f}*F{f}-(J{f}*(1+K{f})+{pp}*(F{f}+G{f})+{pf}+{sello}+{REF['pct_perdido']}*F{f})", fmt="$2")
    put(ws, f"N{f}", f"=(1-C{f})*D{f}*L{f}+C{f}*(E{f}*M{f}+{pas}/(1+{iva})-({pp}*{pas}+{pf}))", fmt="$2")
    put(ws, f"O{f}", (f"={REF['alumnos']}*B{f}*N{f}*{REF['meses_eq']}-({REF['fijos_ano']}"
                      f"+IF({REF['alumnos']}*B{f}*((1-C{f})*D{f}+C{f}*E{f})/{REF['dias_tipo']}>={REF['umbral_coord']},{REF['coord_ano']},0))"), fmt="$", font=NEGRITA)
    put(ws, f"P{f}", "=0" if f == BASE_F else f"=O{f}-O${BASE_F}", fmt="$")
    salida(f"sens_{f - BASE_F}", ws, f"O{f}")
    salida(f"sens_d_{f - BASE_F}", ws, f"P{f}")
    f += 1
ws.freeze_panes = "B5"

# ══════════════════════════════════════════════════════════
# Franquicia: una unidad franquiciada (campus tipo)
# ══════════════════════════════════════════════════════════
ws = hoja("Franquicia", [58, 16, 16, 16, 62])
titulo(ws, "Franquicia de campus: números de una unidad",
       "Un campus del tamaño de Anáhuac Querétaro operado por un franquiciatario, con la curva del escenario esperado.")
encabezado(ws, 4, ["Concepto", "Año 1", "Año 2", "Año 3", "Cómo se calcula"])
FQ = {}
filas_f = [
    ("ing", "Ingresos de la unidad (sin IVA)", lambda y: f"={ANUAL[('E', 'ing')][y]}*{REF['fq_tamano']}", "$", "Escenario esperado × tamaño relativo del campus"),
    ("cvar", "Costos variables", lambda y: f"={ANUAL[('E', 'cvar')][y]}*{REF['fq_tamano']}", "$", "Escenario esperado × tamaño relativo"),
    ("mc", "Margen de contribución", lambda y: "={c}{ing}-{c}{cvar}", "$", ""),
    ("regalia", "Regalía a BITE", lambda y: f"={{c}}{{ing}}*{REF['fq_regalia']}", "$", "% de los ingresos de la unidad"),
    ("fondo", "Fondo de publicidad de la red", lambda y: f"={{c}}{{ing}}*{REF['fq_fondo']}", "$", "% de los ingresos de la unidad"),
    ("fijos", "Gastos fijos de la unidad", lambda y: f"=12*{REF['fq_fijos']}", "$", "Contador, publicidad local, seguro y varios, promediados en 12 meses (la plataforma la pone BITE)"),
    ("util", "Utilidad del franquiciatario antes de impuestos", lambda y: "={c}{mc}-{c}{regalia}-{c}{fondo}-{c}{fijos}", "$", "Incluye el pago por su propio trabajo como operador"),
    ("acum", "Utilidad acumulada", lambda y: "={c}{util}" if y == 1 else "={p}{acum}+{c}{util}", "$", ""),
    ("util_coord", "Utilidad si además contrata un coordinador", lambda y: f"={{c}}{{util}}-{REF['coord_ano']}", "$", "Si el franquiciatario no opera en persona"),
    ("bite", "Lo que recibe BITE de la unidad", lambda y: (f"={REF['fq_cuota']}+" if y == 1 else "=") + f"{{c}}{{regalia}}-{REF['fq_soporte']}", "$", "Cuota inicial (año 1) + regalía − costo de soporte"),
]
f = 5
for clave, *_ in filas_f:
    FQ[clave] = f
    f += 1
for clave, etiqueta, fn, fmt, nota in filas_f:
    r = FQ[clave]
    negrita = clave in ("util", "bite")
    put(ws, f"A{r}", etiqueta, font=NEGRITA if negrita else NEGRO)
    for y in (1, 2, 3):
        c = "BCD"[y - 1]
        p = "BCD"[y - 2] if y > 1 else ""
        put(ws, f"{c}{r}", fn(y).format(c=c, p=p, **FQ), fmt=fmt, font=NEGRITA if negrita else NEGRO, borde=BORDE_SUP if negrita else None)
        REF[f"fq_{clave}_{y}"] = abs_ref(ws, f"{c}{r}")
        salida(f"fq_{clave}_{y}", ws, f"{c}{r}")
    put(ws, f"E{r}", nota, font=GRIS, align=WRAP)
f = max(FQ.values()) + 2
seccion(ws, f, "Inversión del franquiciatario", 5)
f += 1
inv0 = f
for etiqueta, formula in [
    ("Cuota inicial de franquicia", f"={REF['fq_cuota']}"),
    ("Equipo de reparto, tabletas e identidad", f"={REF['fq_equipo']}"),
    ("Publicidad de lanzamiento", f"={REF['fq_lanzamiento']}"),
    ("Capital de trabajo", f"={REF['fq_capital_trabajo']}"),
]:
    put(ws, f"A{f}", etiqueta)
    put(ws, f"B{f}", formula, fmt="$", font=VERDE)
    f += 1
put(ws, f"A{f}", "Inversión total del franquiciatario", font=NEGRITA)
put(ws, f"B{f}", f"=SUM(B{inv0}:B{f - 1})", fmt="$", font=NEGRITA, borde=BORDE_SUP)
REF["fq_inv"] = abs_ref(ws, f"B{f}")
salida("fq_inv", ws, f"B{f}")
f += 1
put(ws, f"A{f}", "Meses para recuperar la inversión", font=NEGRITA)
put(ws, f"B{f}", (f"=IF({REF['fq_acum_1']}>={REF['fq_inv']},12*{REF['fq_inv']}/{REF['fq_util_1']},"
                  f"IF({REF['fq_acum_2']}>={REF['fq_inv']},12+12*({REF['fq_inv']}-{REF['fq_acum_1']})/{REF['fq_util_2']},"
                  f"IF({REF['fq_acum_3']}>={REF['fq_inv']},24+12*({REF['fq_inv']}-{REF['fq_acum_2']})/{REF['fq_util_3']},\"Más de 36\")))"),
    fmt="n", font=NEGRITA)
salida("fq_payback", ws, f"B{f}")
REF["fq_payback"] = abs_ref(ws, f"B{f}")
f += 1
put(ws, f"A{f}", "Regalía como % de la venta de comida de la unidad (año 3)")
put(ws, f"B{f}", f"={REF['fq_regalia_3']}/({ANUAL[('E', 'gmv')][3]}*{REF['fq_tamano']})", fmt="%")
salida("fq_regalia_gmv", ws, f"B{f}")

# ══════════════════════════════════════════════════════════
# Expansión a 5 años (escenario esperado)
# ══════════════════════════════════════════════════════════
ws = hoja("Expansión", [58, 15, 15, 15, 15, 15, 62])
titulo(ws, "Plan de expansión a 5 años (escenario esperado)",
       "Cada campus nuevo repite la curva del campus Anáhuac Querétaro: año 1, año 2 y, del año 3 en adelante, el nivel del año 3.")
encabezado(ws, 4, ["Concepto", "Año 1", "Año 2", "Año 3", "Año 4", "Año 5", "Cómo se calcula"])
YC = "BCDEF"
X = {}
orden = ["ap_prop", "ap_fq", "n_prop", "n_fq", "n_total", "S1", "ped_prop", "ped_fq", "ped_red", "ped_acum", "gmv_red", "S2",
         "ing_prop", "ing_cuotas", "ing_regalias", "ing_bite", "ing_acum", "S3", "op_prop", "apertura", "soporte", "socios_tc",
         "central", "ebit", "perdida", "base", "isr", "neta", "neta_acum", "caja"]
f = 5
for clave in orden:
    X[clave] = f
    f += 1


def por_edad(y, clave, aperturas_fila, factor=True):
    """Suma por generación: campus abiertos en el año k aportan en el año y el valor de su edad."""
    terminos = []
    for kk in range(1, y + 1):
        edad = min(3, y - kk + 1)
        ref = ANUAL[("E", clave)][edad]
        if aperturas_fila == "ap_fq":
            tam = REF["fq_tamano"]
        else:
            tam = "1" if kk == 1 else REF["exp_tamano"]
        terminos.append(f"{YC[kk - 1]}${X[aperturas_fila]}*{ref}" + (f"*{tam}" if factor else ""))
    return "=" + "+".join(terminos)


def op_prop(y):
    """Utilidad de operación de campus propios: margen (escalado por tamaño) menos fijos de campus."""
    terminos = []
    for kk in range(1, y + 1):
        edad = min(3, y - kk + 1)
        tam = "1" if kk == 1 else REF["exp_tamano"]
        fijos_campus = ANUAL[('E', 'fijos')][edad] if kk == 1 else f"({REF['fijos_ano']}-{REF['fijos_empresa_ano']}+{REF['coord_ano']})"
        terminos.append(f"{YC[kk - 1]}${X['ap_prop']}*({ANUAL[('E', 'mc')][edad]}*{tam}-{fijos_campus})")
    return "=" + "+".join(terminos)


def regalias(y):
    terminos = [f"{YC[kk - 1]}${X['ap_fq']}*{ANUAL[('E', 'ing')][min(3, y - kk + 1)]}*{REF['fq_tamano']}*{REF['fq_regalia']}"
                for kk in range(1, y + 1)]
    return "=" + "+".join(terminos)


filas_x = {
    "ap_prop": ("Campus propios que abren en el año", "n", lambda y, c, p: D.APERTURAS_PROPIAS[y - 1], "Decisión: tres campus propios en la zona de Querétaro"),
    "ap_fq": ("Campus franquiciados que abren en el año", "n", lambda y, c, p: D.APERTURAS_FRANQUICIA[y - 1], "Decisión: la franquicia empieza con tres años de operación probada"),
    "n_prop": ("Campus propios en operación", "n", lambda y, c, p: f"=SUM($B{X['ap_prop']}:{c}{X['ap_prop']})", ""),
    "n_fq": ("Campus franquiciados en operación", "n", lambda y, c, p: f"=SUM($B{X['ap_fq']}:{c}{X['ap_fq']})", ""),
    "n_total": ("Campus en la red", "n", lambda y, c, p: f"={c}{X['n_prop']}+{c}{X['n_fq']}", ""),
    "ped_prop": ("Pedidos en campus propios", "n", lambda y, c, p: por_edad(y, "pedidos", "ap_prop"), "Pedidos por edad del campus × tamaño relativo"),
    "ped_fq": ("Pedidos en campus franquiciados", "n", lambda y, c, p: por_edad(y, "pedidos", "ap_fq"), ""),
    "ped_red": ("Pedidos de toda la red", "n", lambda y, c, p: f"={c}{X['ped_prop']}+{c}{X['ped_fq']}", ""),
    "ped_acum": ("Pedidos acumulados", "n", lambda y, c, p: f"={c}{X['ped_red']}" if y == 1 else f"={p}{X['ped_acum']}+{c}{X['ped_red']}", ""),
    "gmv_red": ("Venta de comida generada a los locales (con IVA)", "$", lambda y, c, p: f"={c}{X['ped_red']}*{REF['ticket']}", ""),
    "ing_prop": ("Ingresos de campus propios", "$", lambda y, c, p: por_edad(y, "ing", "ap_prop"), ""),
    "ing_cuotas": ("Cuotas iniciales de franquicia", "$", lambda y, c, p: f"={c}{X['ap_fq']}*{REF['fq_cuota']}", ""),
    "ing_regalias": ("Regalías", "$", lambda y, c, p: regalias(y), "% de los ingresos de cada unidad franquiciada"),
    "ing_bite": ("Ingresos totales de BITE (sin IVA)", "$", lambda y, c, p: f"=SUM({c}{X['ing_prop']}:{c}{X['ing_regalias']})", ""),
    "ing_acum": ("Ingresos acumulados", "$", lambda y, c, p: f"={c}{X['ing_bite']}" if y == 1 else f"={p}{X['ing_acum']}+{c}{X['ing_bite']}", ""),
    "op_prop": ("Resultado de operación de campus propios", "$", lambda y, c, p: op_prop(y), "Margen − gastos fijos de cada campus. Los gastos de la empresa se cuentan una sola vez; los campus nuevos pagan coordinador desde su primer mes"),
    "apertura": ("Gastos de apertura", "$", lambda y, c, p: (f"={REF['arranque']}" if y == 1 else f"={c}{X['ap_prop']}*{REF['exp_apertura']}" + (f"+{REF['exp_transformacion']}" if y == 4 else "")), "Año 1: arranque de la empresa. Después: costo de abrir cada campus propio. El año 4 incluye la transformación a S.A.P.I."),
    "soporte": ("Soporte a franquiciatarios", "$", lambda y, c, p: f"={c}{X['n_fq']}*{REF['fq_soporte']}", ""),
    "socios_tc": ("Socios con sueldo de tiempo completo", "n", lambda y, c, p: D.SOCIOS_TC[y - 1], "Decisión: los socios empiezan a cobrar cuando la red lo paga"),
    "central": ("Estructura central (sueldos de socios)", "$", lambda y, c, p: f"={c}{X['socios_tc']}*{REF['exp_sueldo']}*12", ""),
    "ebit": ("Utilidad de operación", "$", lambda y, c, p: f"={c}{X['op_prop']}+{c}{X['ing_cuotas']}+{c}{X['ing_regalias']}-{c}{X['apertura']}-{c}{X['soporte']}-{c}{X['central']}", ""),
    "perdida": ("Pérdida fiscal pendiente al inicio del año", "$", lambda y, c, p: "=0" if y == 1 else f"=MAX(0,{p}{X['perdida']}-{p}{X['ebit']})", ""),
    "base": ("Base gravable", "$", lambda y, c, p: f"=MAX(0,{c}{X['ebit']}-{c}{X['perdida']})", ""),
    "isr": ("ISR", "$", lambda y, c, p: f"={c}{X['base']}*{REF['isr']}", ""),
    "neta": ("Utilidad neta", "$", lambda y, c, p: f"={c}{X['ebit']}-{c}{X['isr']}", ""),
    "neta_acum": ("Utilidad neta acumulada", "$", lambda y, c, p: f"={c}{X['neta']}" if y == 1 else f"={p}{X['neta_acum']}+{c}{X['neta']}", ""),
    "caja": ("Caja al cierre del año", "$", lambda y, c, p: f"={REF['capital']}+{c}{X['neta_acum']}", "Capital aportado más utilidad neta acumulada"),
}
secciones_x = {"S1": "Volumen", "S2": "Ingresos de BITE", "S3": "Resultado"}
for clave in orden:
    r = X[clave]
    if clave in secciones_x:
        seccion(ws, r, secciones_x[clave], 7)
        continue
    etiqueta, fmt, fn, nota = filas_x[clave]
    negrita = clave in ("n_total", "ped_red", "ing_bite", "ebit", "neta")
    put(ws, f"A{r}", etiqueta, font=NEGRITA if negrita else NEGRO)
    for y in range(1, 6):
        c = YC[y - 1]
        p = YC[y - 2] if y > 1 else ""
        v = fn(y, c, p)
        entrada = clave in ("ap_prop", "ap_fq", "socios_tc")
        put(ws, f"{c}{r}", v, fmt=fmt, font=AZUL if entrada else (NEGRITA if negrita else NEGRO), borde=BORDE_SUP if negrita else None)
        salida(f"x_{clave}_{y}", ws, f"{c}{r}")
        REF[f"x_{clave}_{y}"] = abs_ref(ws, f"{c}{r}")
    put(ws, f"G{r}", nota, font=GRIS, align=WRAP)
ws.freeze_panes = "B5"

# ══════════════════════════════════════════════════════════
# Encuesta: captura de resultados reales
# ══════════════════════════════════════════════════════════
ws = hoja("Encuesta", [10, 64, 34, 12, 12, 50])
titulo(ws, "Encuesta: captura de resultados reales",
       "Escribe en las celdas amarillas cuántas personas eligieron cada respuesta. Los porcentajes y la comparación con el modelo se calculan solos.")
put(ws, "A3", "Leyenda: amarillo = lo que tú llenas; la fila de ejemplo (pregunta 0) muestra el formato y no entra en ningún cálculo.", font=GRIS)
encabezado(ws, 5, ["Pregunta", "Texto", "Respuesta", "Personas", "% del total", "Para qué sirve"])
f = 6
ENC = {}
ejemplo = ("0", "Ejemplo: ¿Estudias en el campus?", ["Sí", "No"], "Fila de ejemplo. No se usa en los cálculos.")
for num, texto, opciones, uso in [ejemplo] + D.ENCUESTA:
    ini = f
    for i, op in enumerate(opciones):
        if i == 0:
            put(ws, f"A{f}", f"P{num}", font=NEGRITA)
            put(ws, f"B{f}", texto, align=WRAP)
            put(ws, f"F{f}", uso, font=GRIS, align=WRAP)
        put(ws, f"C{f}", op)
        if num == "0":
            put(ws, f"D{f}", [280, 20][i], fmt="n", font=GRIS)
        else:
            put(ws, f"D{f}", None, fmt="n", font=AZUL, fill=R_AMARILLO)
        put(ws, f"E{f}", f"=IF(SUM($D${ini}:$D${ini + len(opciones) - 1})>0,D{f}/SUM($D${ini}:$D${ini + len(opciones) - 1}),0)", fmt="%")
        f += 1
    ENC[num] = (ini, f - 1)
    for c in "ABCDEF":
        ws[f"{c}{f - 1}"].border = BORDE_INF
f += 1
put(ws, f"A{f}", "Lo que dice la encuesta frente a lo que supone el modelo", font=TITULO)
f += 1
encabezado(ws, f, ["", "Indicador", "Según la encuesta", "Supuesto", "Equilibrio", "Lectura"])
f += 1


def pct(num, idx):
    ini, _ = ENC[num]
    return f"E{ini + idx}"


def n_resp(num):
    ini, fin = ENC[num]
    return f"SUM(D{ini}:D{fin})"


def media(num, puntos):
    ini, _ = ENC[num]
    return "+".join(f"E{ini + i}*{v}" for i, v in enumerate(puntos))


ind = [
    ("n", "Respuestas capturadas", f"={n_resp(D.Q_INTENCION)}", "n", f"={REF['meta_encuestas']}", "n", None, None,
     '=IF({v}>={s},"Meta de la guía cumplida",IF({v}=0,"Pendiente: capturar el levantamiento","Faltan respuestas para llegar a la meta"))'),
    ("adop", "Adopción implícita (descuenta la intención declarada)",
     f"={pct(D.Q_INTENCION, 0)}*{REF['conv_def']}+{pct(D.Q_INTENCION, 1)}*{REF['conv_prob']}", "%", f"={REF['adop1_E']}", "%",
     f"={REF['e_be_adop_E']}", "%",
     '=IF({n}=0,"Pendiente",IF({v}>={s},"Respalda el escenario esperado",IF({v}>={e},"Arriba del equilibrio, abajo del esperado","Abajo del equilibrio: replantear")))'),
    ("frec", "Pedidos al mes de quien sí lo usaría", f"=IF(1-{pct(D.Q_FRECUENCIA, 0)}>0,({media(D.Q_FRECUENCIA, D.PUNTOS_FRECUENCIA)})/(1-{pct(D.Q_FRECUENCIA, 0)}),0)", "n1",
     f"={REF['u_ped_user_E']}", "n1", None, None,
     '=IF({n}=0,"Pendiente",IF({v}>={s},"Respalda la frecuencia supuesta","Frecuencia menor a la supuesta"))'),
    ("ticket", "Gasto habitual por comida", f"={media(D.Q_TICKET, D.PUNTOS_TICKET)}", "$", f"={REF['ticket']}", "$", None, None,
     '=IF({n}=0,"Pendiente",IF({v}>={s}*0.9,"Respalda el ticket supuesto","Ticket menor al supuesto"))'),
    ("envio", "Dispuestos a pagar $20 o más por el envío", f"={pct(D.Q_ENVIO, 3)}+{pct(D.Q_ENVIO, 4)}", "%", f"={REF['adop1_E']}", "%",
     f"={REF['e_be_adop_E']}", "%",
     '=IF({n}=0,"Pendiente",IF({v}>={s},"Suficientes alumnos aceptan la tarifa","Revisar la tarifa de envío"))'),
    ("pass", "Suscriptores implícitos de BITE Pass (sobre el total de alumnos)",
     f"={pct(D.Q_PASS, 0)}*{REF['conv_def']}+{pct(D.Q_PASS, 1)}*{REF['conv_prob']}", "%", f"={REF['adop1_E']}*{REF['pct_pass_E']}", "%", None, None,
     '=IF({n}=0,"Pendiente",IF({v}>={s},"Respalda la mezcla de Pass","Menos suscriptores que los supuestos"))'),
]
n_cell = None
for clave, etiqueta, fv, fmtv, fs, fmts, fe, fmte, lectura in ind:
    put(ws, f"B{f}", etiqueta, font=NEGRITA)
    put(ws, f"C{f}", fv, fmt=fmtv, font=NEGRITA)
    put(ws, f"D{f}", fs, fmt=fmts, font=VERDE)
    if fe:
        put(ws, f"E{f}", fe, fmt=fmte, font=VERDE)
    if clave == "n":
        n_cell = f"$C${f}"
    put(ws, f"F{f}", lectura.format(v=f"C{f}", s=f"D{f}", e=f"E{f}", n=n_cell), font=NEGRO, align=WRAP)
    REF[f"enc_{clave}"] = abs_ref(ws, f"C{f}")
    salida(f"enc_{clave}", ws, f"C{f}")
    f += 1
ws.freeze_panes = "A6"

# ══════════════════════════════════════════════════════════
# Pruebas de realidad
# ══════════════════════════════════════════════════════════
ws = hoja("Pruebas", [62, 18, 18, 14, 70])
titulo(ws, "Pruebas de consistencia", "Si alguna dice FALLA, el modelo tiene un problema que hay que resolver antes de usar sus cifras.")
encabezado(ws, 4, ["Prueba", "Valor del modelo", "Límite", "Resultado", "Por qué importa"])
pruebas = [
    ("El repartidor gana, como mínimo, más que el salario mínimo por hora",
     f"={REF['garantia']}/({REF['min_bloque']}/60)", "$2", f"={REF['sm_diario']}/8", "$2", ">=",
     "La garantía por bloque, llevada a una hora, contra el salario mínimo por hora. Si no pasa, nadie reparte."),
    ("A ritmo normal, el repartidor gana al menos el doble del mínimo por hora (esperado, año 2)",
     f"={ANUAL[('E', 'ing_rb')][2]}/({REF['min_bloque']}/60)", "$2", f"=2*{REF['sm_diario']}/8", "$2", ">=",
     "Ingreso promedio por bloque en octubre del año 2, llevado a una hora."),
    ("Un repartidor de 4 bloques diarios queda por debajo del umbral de relación laboral plena, aun en el mes más largo",
     f"={ANUAL[('E', 'ing_rb')][2]}*4*MAX({REF['cal_dias']})*(1-{REF['excl_pie']})", "$", f"={REF['sm_mensual']}", "$", "<",
     "Ingreso neto del mes con más días de clase contra un salario mínimo mensual. Si lo rebasa, toca IMSS completo y hay que usar ese costo."),
    ("El bloque pico cabe en el cupo de los locales (optimista)",
     f"={REF['pico_max_O']}", "n1", f"={REF['cupo_locales']}", "n", "<=",
     "Pedidos en la hora más cargada contra la suma de cupos por hora de los cuatro locales en la app."),
    ("El bloque pico se cubre con el padrón de repartidores (esperado)",
     f"=ROUNDUP({REF['pico_max_E']}/{REF['ped_rb']},0)", "n", f"={REF['padron']}", "n", "<=",
     "Repartidores que hacen falta al mismo tiempo en la hora más cargada. En el optimista el padrón tiene que crecer."),
    ("El calendario respeta las vacaciones", f"={REF['dias_ano']}", "n", "=200", "n", "<",
     "Menos de 200 días de clase al año: junio, julio y parte de diciembre y enero no generan pedidos, pero sí gastos fijos."),
    ("El punto de equilibrio queda por debajo de lo proyectado (esperado, año 2)",
     f"={REF['e_be2_oday_E']}", "n1", f"={ANUAL[('E', 'oday_oct')][2]}", "n1", "<",
     "Pedidos diarios para no perder, con coordinador, contra los pedidos diarios proyectados."),
    ("La suscripción no pierde dinero por pedido (pesimista)", f"={REF['u_p_margen_P']}", "$2", "=0", "$2", ">",
     "Margen de cada pedido de un suscriptor en el peor escenario. Si es positivo, el Pass puede ser ilimitado."),
    ("La caja nunca queda en negativo (esperado)", f"={REF['caja_min_E']}", "$", "=0", "$", ">=",
     "Saldo mínimo de caja en 36 meses con el capital aportado."),
    ("La caja pesimista conserva el colchón fijado", f"={REF['caja_min_P']}", "$", f"={REF['colchon']}*{REF['capital']}", "$", ">=",
     "El capital alcanza, con margen, incluso si la adopción se queda en el escenario pesimista."),
    ("El margen del modelo mensual cuadra con la economía por pedido (esperado, año 2)",
     (f"=ABS({ANUAL[('E', 'mc')][2]}/(SUMPRODUCT(Esc_Esperado!{CL(C0 + 12)}{FILAS_ESC['E']['users']}:{CL(C0 + 23)}{FILAS_ESC['E']['users']},"
      f"Esc_Esperado!{CL(C0 + 12)}{FILAS_ESC['E']['dias']}:{CL(C0 + 23)}{FILAS_ESC['E']['dias']})/{REF['dias_tipo']}*{REF['u_contrib_user_E']})-1)"), "%", "=0.03", "%", "<=",
     "Margen anual del modelo mensual contra usuarios de cada mes × margen por usuario. Diferencia máxima de 3% por redondeos, promociones y cuotas prorrateadas."),
    ("La adopción esperada no supera lo que respalda la encuesta",
     f"={REF['adop1_E']}", "%", f"=IF({REF['enc_n']}=0,1,{REF['enc_adop']})", "%", "<=",
     "Mientras la encuesta no esté capturada esta prueba no dice nada: ver hoja Encuesta."),
]
f = 5
for nombre_p, fv, fmtv, fl, fmtl, op, nota in pruebas:
    put(ws, f"A{f}", nombre_p, align=WRAP)
    put(ws, f"B{f}", fv, fmt=fmtv)
    put(ws, f"C{f}", fl, fmt=fmtl)
    if "encuesta" in nombre_p:
        put(ws, f"D{f}", f'=IF({REF["enc_n"]}=0,"PENDIENTE",IF(B{f}{op}C{f},"PASA","FALLA"))', font=NEGRITA)
    else:
        put(ws, f"D{f}", f'=IF(B{f}{op}C{f},"PASA","FALLA")', font=NEGRITA)
    put(ws, f"E{f}", nota, font=GRIS, align=WRAP)
    salida(f"prueba_{f - 4}", ws, f"D{f}")
    salida(f"prueba_v_{f - 4}", ws, f"B{f}")
    salida(f"prueba_l_{f - 4}", ws, f"C{f}")
    ws.row_dimensions[f].height = 30
    f += 1
N_PRUEBAS = len(pruebas)
put(ws, f"A{f + 1}", "Pruebas que fallan", font=NEGRITA)
put(ws, f"B{f + 1}", f'=COUNTIF(D5:D{f - 1},"FALLA")', fmt='0', font=NEGRITA)
salida("pruebas_fallan", ws, f"B{f + 1}")

# ══════════════════════════════════════════════════════════
# Concentrado semanal de ingresos y gastos (plantilla de operación)
# ══════════════════════════════════════════════════════════
ws = hoja("Semanal", [14, 11, 15, 15, 12, 12, 12, 12, 13, 13, 12, 12, 11, 13, 13, 14])
titulo(ws, "Concentrado semanal de ingresos y gastos",
       "Se llena cada lunes con el corte de la app. Celdas amarillas: lo que se captura. La primera fila es un ejemplo con cifras del modelo y no se suma.")
enc = ["Semana (lunes)", "Pedidos entregados", "Cobrado a alumnos (con IVA)", "Por pagar a locales", "Envíos (sin IVA)", "Sobreprecio (sin IVA)",
       "Comisión (sin IVA)", "Cuotas Pass (sin IVA)", "Ingreso de BITE", "Pago a repartidores", "Seguridad social", "Pasarela de pago", "Sellos",
       "Cortesías y devoluciones", "Gastos fijos pagados", "Resultado de la semana"]
encabezado(ws, 4, enc)
ws.row_dimensions[4].height = 44
occ = f"((1-{REF['pct_pass_E']})*{REF['ped_occ_E']}/{REF['u_ped_user_E']})"
ej = {
    "A": ("Ejemplo", None), "B": (f"=ROUND(5*{ANUAL[('E', 'oday_oct')][1]},0)", "n"),
    "C": (f"=B5*({REF['ticket']}+{REF['markup']})+B5*{occ}*{REF['fee']}", "$"),
    "D": (f"=B5*{REF['ticket']}-G5*(1+{REF['iva']})", "$"),
    "E": (f"=B5*{occ}*{REF['fee']}/(1+{REF['iva']})", "$"), "F": (f"=B5*{REF['markup']}/(1+{REF['iva']})", "$"),
    "G": (f"=B5*{REF['com_E']}*{REF['ticket']}", "$"), "H": ("=0", "$"), "I": ("=SUM(E5:H5)", "$"),
    "J": (f"=B5*{REF['pago']}", "$"), "K": (f"=J5*{REF['pct_ss']}", "$"), "L": (f"={REF['pas_pct']}*C5+{REF['pas_fijo']}*B5", "$"),
    "M": (f"=B5*{REF['sello']}", "$"), "N": (f"=B5*{occ}*{REF['pct_tarde']}*{REF['fee']}/(1+{REF['iva']})", "$"),
    "O": (f"=({REF['fijos_mes_clase']}+{REF['coord']})*12/52", "$"), "P": ("=I5-SUM(J5:O5)", "$"),
}
for col, (v, fmt) in ej.items():
    put(ws, f"{col}5", v, fmt=fmt, font=GRIS, fill=R_GRIS)
    if col != "A":
        salida(f"sem_{col}", ws, f"{col}5")
for r in range(6, 26):
    for col in "ABCDEFGHJKLMNO":
        put(ws, f"{col}{r}", None, fmt="dd-mmm-yy" if col == "A" else ("n" if col == "B" else "$"), font=AZUL, fill=R_AMARILLO)
    put(ws, f"I{r}", f"=SUM(E{r}:H{r})", fmt="$")
    put(ws, f"P{r}", f"=I{r}-SUM(J{r}:O{r})", fmt="$", font=NEGRITA)
put(ws, "A26", "Total", font=NEGRITA)
for col in "BCDEFGHIJKLMNOP":
    put(ws, f"{col}26", f"=SUM({col}6:{col}25)", fmt="n" if col == "B" else "$", font=NEGRITA, borde=BORDE_SUP)
ws.freeze_panes = "B5"

# ══════════════════════════════════════════════════════════
# Léeme
# ══════════════════════════════════════════════════════════
ws = ws_l
ws.sheet_view.showGridLines = False
ws.column_dimensions["A"].width = 30
ws.column_dimensions["B"].width = 100
put(ws, "A1", "BITE · Modelo financiero", font=Font(name=F, size=16, bold=True, color="A81D4A"))
put(ws, "A2", f"Proyecto Integrador, Taller de Empresa, Universidad Anáhuac Querétaro. Generado el {dt.date.today().isoformat()}.", font=GRIS)
lineas = [
    ("Para qué sirve", "Todas las cifras del Proyecto Integrador salen de este libro. Si cambias un supuesto, cambian todas las hojas."),
    ("Moneda y unidades", "Pesos mexicanos. Los precios al alumno incluyen IVA; los ingresos y costos de BITE van sin IVA."),
    ("Colores", "Texto azul: dato que se puede cambiar. Texto negro: fórmula. Texto verde: viene de otra hoja. Relleno amarillo: supuesto clave que la encuesta y el piloto deben confirmar."),
    ("", ""),
    ("Supuestos", "Todos los datos de entrada, con su tipo (dato, decisión o supuesto) y su fuente."),
    ("Fijos", "Gastos fijos mensuales."),
    ("Inversión", "Gastos de arranque, reserva de caja y aportación de cada socio."),
    ("Unitario", "Lo que deja un pedido, con y sin BITE Pass, en los tres escenarios."),
    ("Esc_Pesimista / Esperado / Optimista", "36 meses de operación del campus Anáhuac Querétaro y su resumen anual."),
    ("Escenarios", "Los tres escenarios lado a lado."),
    ("Equilibrio", "Cuántos alumnos y pedidos diarios hacen falta para no perder."),
    ("Sensibilidad", "Qué pasa con la utilidad si un solo supuesto cambia."),
    ("Franquicia", "Números de un campus operado por un franquiciatario."),
    ("Expansión", "Plan a 5 años: campus propios y franquiciados."),
    ("Encuesta", "Aquí se capturan las 300 respuestas reales; compara los resultados con los supuestos."),
    ("Semanal", "Plantilla del concentrado semanal de ingresos y gastos para la operación."),
    ("Pruebas", "Pruebas de consistencia. Ninguna debe decir FALLA."),
]
for i, (a, b) in enumerate(lineas, start=4):
    put(ws, f"A{i}", a, font=NEGRITA)
    put(ws, f"B{i}", b, align=WRAP)
wb.move_sheet("Leeme", offset=-wb.index(wb["Leeme"]))

# Impresión: horizontal y ajustada al ancho de una página
for hoja_ws in wb.worksheets:
    hoja_ws.page_setup.orientation = "landscape"
    hoja_ws.sheet_properties.pageSetUpPr.fitToPage = True
    hoja_ws.page_setup.fitToWidth = 1
    hoja_ws.page_setup.fitToHeight = 0

wb.save(SALIDA)
print("Libro escrito:", SALIDA)

# ── Recalcular con LibreOffice y leer las salidas ─────────
RECALC = Path("/root/.claude/skills/synced/86ead852-bf27-4845-9d4a-d7a70d835a72_d043d138-0f44-4851-ab91-be9989c246b1/xlsx/scripts/recalc.py")
if RECALC.exists():
    r = subprocess.run([sys.executable, str(RECALC), str(SALIDA), "120"], capture_output=True, text=True)
    print(r.stdout.strip()[:1500] or r.stderr.strip()[:1500])
    vals = load_workbook(SALIDA, data_only=True)
    out = {}
    for clave, (hoja_n, celda) in SAL.items():
        v = vals[hoja_n][celda].value
        if isinstance(v, (dt.date, dt.datetime)):
            v = v.isoformat()
        out[clave] = v
    out["_n_pruebas"] = N_PRUEBAS
    out["_pruebas"] = [(n, fv, fl, nota) for n, _v, fv, _l, fl, _op, nota in pruebas]
    out["_sens_nombres"] = [n for n, _ in D.SENSIBILIDAD]
    datos = {
        "generales": [{"bloque": b, "items": [dict(clave=c, concepto=e, unidad=u, fmt=fm, tipo=t, nota=n) for c, e, u, _v, fm, t, n in items]} for b, items in D.GENERALES],
        "escenarios": [dict(clave=c, concepto=e, unidad=u, fmt=fm, tipo=t, nota=n) for c, e, u, _v, fm, t, n in D.ESCENARIOS],
        "calendario": [dict(mes=m, dias=d, arranque=a) for m, d, a in D.CALENDARIO],
        "nota_calendario": D.NOTA_CALENDARIO,
        "fijos": [dict(concepto=e, meses=m, nivel=nv, tipo=t, nota=n, suspendible=sp) for e, _v, m, nv, t, n, sp in D.FIJOS],
        "arranque": [dict(concepto=e, monto=v, tipo=t, nota=n) for e, v, t, n in D.ARRANQUE],
        "encuesta": [dict(num=n, texto=t, opciones=o, uso=u) for n, t, o, u in D.ENCUESTA],
        "abierta": dict(num=D.PREGUNTA_ABIERTA[0], texto=D.PREGUNTA_ABIERTA[1], uso=D.PREGUNTA_ABIERTA[2]),
        "aperturas_propias": D.APERTURAS_PROPIAS, "aperturas_franquicia": D.APERTURAS_FRANQUICIA, "socios_tc": D.SOCIOS_TC,
        "ano_inicio": D.ANO_INICIO,
    }
    (Path(__file__).resolve().parent / "datos.json").write_text(json.dumps(datos, ensure_ascii=False, indent=1), encoding="utf-8")
    out["_curva"] = EQ_CURVA
    SALIDAS_JSON.write_text(json.dumps(out, ensure_ascii=False, indent=1), encoding="utf-8")
    print("Salidas:", len(out), "→", SALIDAS_JSON)
else:
    print("No se encontró recalc.py: abre el libro en Excel para calcular las fórmulas.")
