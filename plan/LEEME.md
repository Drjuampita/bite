# Proyecto Integrador BITE: versión nueva

Esta carpeta contiene el Proyecto Integrador rehecho desde cero. El documento original de Google Docs no se tocó.

## Qué hay aquí

| Archivo | Qué es |
|---|---|
| `BITE_Proyecto_Integrador.docx` | El documento para entregar. Sigue el índice de la guía, punto por punto. |
| `BITE_Modelo_Financiero.xlsx` | El modelo del que salen todas las cifras del documento. Tiene fórmulas: si cambias un supuesto, cambia todo. |
| `contenido/` | El texto del documento, un archivo por capítulo. Las cifras aparecen como `{{clave}}` y se llenan desde el modelo. |
| `figuras/` | Diagramas, gráficas, manual de identidad y capturas reales de la app. |
| `herramientas/` | Los programas que generan el modelo, las figuras y el Word. |

## Lo que solo el equipo puede completar

En el Word están marcados en amarillo. Los seis primeros son los que más pesan en la calificación:

1. **La encuesta de 300 respuestas.** El cuestionario está en el apartado 6.2.1. Las respuestas se capturan en la hoja `Encuesta` del Excel, que compara cada resultado con su supuesto. No se inventó ninguna respuesta.
2. **El permiso de la universidad.** Es la condición para operar y el primer paso de la ruta de arranque.
3. **Los datos reales de los locales:** nombre, menú, precios, horario y cupo. La app tiene datos de demostración. Los nombres Sinforosa, Luka, Diego's House y Carrusel vienen de la app; no pude confirmar en fuentes públicas cuáles operan dentro del campus.
4. **Quién encabeza cada área** y quién es el administrador único, y las horas reales invertidas en la app (el modelo usa 250 como estimación).
5. **Carrera y semestre de cada socio.**
6. **Disponibilidad** de la denominación, la marca BITE en el IMPI y el dominio bitedelivery.mx.

Además hay datos chicos que se consiguen en una tarde:

7. **La regla de la universidad sobre comer en los salones.** Cambia lo que se le ofrece a quien no tiene receso.
8. **Cuántos minutos dura el receso típico** y si las clases empiezan a la hora en punto. El documento supone recesos cortos y bloques por hora.
9. **Medir filas y recorridos** con el protocolo del Anexo C. Da los minutos reales y cuántos pedidos puede entregar un repartidor por bloque; el modelo supone cuatro.
10. **Cotizar el gafete y el seguro de responsabilidad civil.** El gafete está en $50 estimados; el seguro, en $6,000 al año por rango de mercado.
11. **Confirmar que no existe otra app de entrega dentro del campus**, hasta dónde entra hoy un repartidor de app general, y que el teléfono y el correo del documento son los reales.

## Decisiones que se tomaron

| Tema | Decisión | Por qué |
|---|---|---|
| Quién reparte | Repartidores de BITE: alumnos, a pie, por bloques | Así está construida la app y así lo plantea la proyección del equipo |
| Precios | Envío $19, sobreprecio de menú $10, comisión 20%, BITE Pass $99 | Es la «Propuesta» de la proyección financiera del equipo |
| Escenarios | Pesimista, esperado y optimista | El esperado es la «Propuesta»; el optimista, el «Ambicioso»; el pesimista es nuevo |
| Alumnos | 7,478 de licenciatura | Informe 2024 de la universidad. Los 8,222 incluyen posgrado y educación continua |
| Días de clase | 155 al año | Calendarios oficiales 2026B y 2027A |
| Capital | $165,000, $33,000 por socio | Es lo que hace falta para que la caja conserve un colchón de 10% aun en el escenario pesimista. Solo $87,043 se gastan antes de abrir |
| Repartidores por bloque | Dos como mínimo, uno por cada mitad del campus, y uno más por cada cuatro pedidos | Un repartidor no cubre cinco edificios en 15 minutos. Los bloques se abren conforme crece la demanda |
| Entrega | Dos pasadas por ventana: primero quien ya está en el salón, después quien viene de otra clase | Sin esto, el alumno con clases pegadas nunca recibiría su pedido |
| Regla de abril | Con menos de 224 usuarios activos en abril se suspenden publicidad y horas de desarrollo | El modelo la aplica: es lo que mantiene a flote el escenario pesimista |
| Figura legal | S.A.S. ahora; S.A.P.I. de C.V. en el año 4 | La S.A.S. es gratuita. El documento anterior decía S.A. en un apartado y S. de R.L. en otro |
| Pago | Solo tarjeta dentro de la app | El repartidor no maneja efectivo y el pago se confirma antes de cocinar |
| Horario | Clases de 8:00 a 17:00 | Diez bloques de entrega al día |
| Garantía | Si llega tarde, se reembolsa el envío; si ya no se puede recibir, todo el pedido | Es el argumento de venta; su costo está en el modelo |
| Comisión | 20% sobre el precio al público, más IVA | Equivale a 23.2% de la venta del local antes de IVA. El documento lo dice así y mide qué pasa si el local pide otra base |

## Lo que la app necesita para coincidir con el plan

La app está en la rama `claude/happy-ride-upac5w` y no se modificó. Para lanzar con este plan hay que:

- Cambiar el envío de $10 a $19 (`DELIVERY_FEE`). Las capturas del documento se tomaron con $19 en una copia temporal.
- Quitar la opción de pago en efectivo y conectar el cobro con tarjeta.
- Agregar BITE Pass y el reembolso automático cuando el pedido llega tarde o no se entrega.
- Agregar la opción «vengo de otra clase» al pedir, para ordenar las dos pasadas del repartidor.
- Limitar los bloques a las clases de 8:00 a 17:00.
- Cargar menús, precios y horarios reales.

## Qué cambió frente al documento anterior

| Antes | Ahora |
|---|---|
| Tres negocios distintos según el apartado | Un solo negocio en todos |
| 2,000 pedidos al año, sin explicar de dónde salen | Pedidos calculados desde alumnos, adopción y frecuencia, mes por mes |
| Sin gastos fijos, escenarios ni punto de equilibrio | Capítulo 11 completo, con sensibilidad y doce pruebas de consistencia |
| 30 respuestas de encuesta ficticias | Cuestionario listo y hoja de captura; ninguna respuesta inventada |
| Legal y franquicia de una empresa con cocina y vehículos | Legal de una plataforma con repartidores a pie; franquicia por campus |
| Faltaban los capítulos 5, 7 y 11 | Están los 18 |

Frente a la proyección financiera del equipo, los resultados salen menores: el escenario esperado deja $46,140 en el año 2 y $71,798 en el año 3, contra los $117,355 de la «Propuesta». La diferencia viene de contar 7,478 alumnos en lugar de 8,200, 155 días de clase, el arranque gradual, gastos fijos cotizados ($118,150 al año, no $84,000), un coordinador pagado al pasar de 60 pedidos diarios y las garantías al alumno.

## Lo que dijeron los revisores

Cuatro lectores independientes revisaron la primera versión: un profesor contra la guía, un auditor de cifras, un lector escéptico (inversionista, alumno, dueño de local y abogado) y un corrector de estilo.

- El profesor le puso **78 de 100**. Lo que más resta es lo que está pendiente del equipo: la encuesta, los datos de los locales y de los socios, y alguna constancia de la gestión con la universidad.
- El auditor reconstruyó el modelo por su cuenta y le cuadró al centavo. Señaló supuestos mal tratados, que ya se corrigieron: el coordinador, los repartidores por zona, el salto de adopción entre años y gastos anuales que faltaban.
- El lector escéptico encontró el hueco más serio: el ejemplo original entregaba la comida mientras la alumna seguía en su clase anterior. Se rediseñó la entrega en dos pasadas y el mercado principal pasó a ser el alumno con receso corto.
- El corrector marcó unas 45 frases; se aplicaron casi todas.

Después de las correcciones no se volvió a calificar. Lo que sigue abierto es lo que solo se resuelve con datos reales.

## Cómo volver a generar todo

Requiere Python 3 con `openpyxl`, Node.js con los paquetes `docx` y `playwright`, y LibreOffice.

```bash
python3 plan/herramientas/modelo.py
```

```bash
NODE_PATH=$(npm root -g) node plan/herramientas/figuras.js
```

```bash
NODE_PATH=$(npm root -g) node plan/herramientas/documento.js
```

Los supuestos se cambian en `herramientas/datos.py`. El texto, en `contenido/`.

## Lo que no se hizo

- La presentación en PowerPoint del punto 18 de la guía. El lienzo está en el documento.
- Una segunda ronda de revisores sobre la versión corregida.
- Contratos completos. Están los puntos principales del convenio con locales y del contrato de repartidores; redactarlos le toca al abogado.

## Color de marca

El manual de identidad usa frambuesa `#E5386D` (profundo `#A81D4A`, rosa claro `#FFDDE7`) en lugar del naranja original, para no parecerse a las apps de reparto. Las capturas de `figuras/app/` se recolorearon; el código de la app (rama aparte) sigue en naranja y habría que cambiar sus tokens `--color-brand-*`.
