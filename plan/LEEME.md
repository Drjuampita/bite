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

En el Word están marcados en amarillo. Son seis:

1. **La encuesta de 300 respuestas.** El cuestionario está en el apartado 6.2.1. Las respuestas se capturan en la hoja `Encuesta` del Excel, que compara cada resultado con su supuesto. No se inventó ninguna respuesta.
2. **El permiso de la universidad.** Es la condición para operar y el primer paso de la ruta de arranque.
3. **Los datos reales de los locales:** nombre, menú, precios, horario y cupo. La app tiene datos de demostración. Los nombres Sinforosa, Luka, Diego's House y Carrusel vienen de la app; no pude confirmar en fuentes públicas cuáles operan dentro del campus.
4. **Quién encabeza cada área** y quién es el administrador único, y las horas reales invertidas en la app (el modelo usa 250 como estimación).
5. **Carrera y semestre de cada socio.**
6. **Disponibilidad** de la denominación, la marca BITE en el IMPI y el dominio bitedelivery.mx.

También conviene confirmar tres cosas que el documento da por buenas: que las clases empiezan a la hora en punto, que no existe otra app de entrega dentro del campus y hasta dónde entra hoy un repartidor de app general.

## Decisiones que se tomaron

| Tema | Decisión | Por qué |
|---|---|---|
| Quién reparte | Repartidores de BITE: alumnos, a pie, por bloques | Así está construida la app y así lo plantea la proyección del equipo |
| Precios | Envío $19, sobreprecio de menú $10, comisión 20%, BITE Pass $99 | Es la «Propuesta» de la proyección financiera del equipo |
| Escenarios | Pesimista, esperado y optimista | El esperado es la «Propuesta»; el optimista, el «Ambicioso»; el pesimista es nuevo |
| Alumnos | 7,478 de licenciatura | Informe 2024 de la universidad. Los 8,222 incluyen posgrado y educación continua |
| Días de clase | 155 al año | Calendarios oficiales 2026B y 2027A |
| Capital | $150,000, $30,000 por socio | Es lo que hace falta para que la caja no llegue a cero en el escenario pesimista. Solo $87,043 se gastan |
| Figura legal | S.A.S. ahora; S.A.P.I. de C.V. en el año 4 | La S.A.S. es gratuita. El documento anterior decía S.A. en un apartado y S. de R.L. en otro |
| Pago | Solo tarjeta dentro de la app | El repartidor no maneja efectivo y el pago se confirma antes de cocinar |
| Horario | Clases de 8:00 a 17:00 | Diez bloques de entrega al día |
| Garantía | Si llega tarde, se devuelve el envío | Es el argumento de venta; su costo está en el modelo |

## Lo que la app necesita para coincidir con el plan

La app está en la rama `claude/happy-ride-upac5w` y no se modificó. Para lanzar con este plan hay que:

- Cambiar el envío de $10 a $19 (`DELIVERY_FEE`). Las capturas del documento se tomaron con $19 en una copia temporal.
- Quitar la opción de pago en efectivo y conectar el cobro con tarjeta.
- Agregar BITE Pass y la devolución automática del envío cuando el pedido llega tarde.
- Limitar los bloques a las clases de 8:00 a 17:00.
- Cargar menús, precios y horarios reales.

## Qué cambió frente al documento anterior

| Antes | Ahora |
|---|---|
| Tres negocios distintos según el apartado | Un solo negocio en todos |
| 2,000 pedidos al año, sin explicar de dónde salen | Pedidos calculados desde alumnos, adopción y frecuencia, mes por mes |
| Sin gastos fijos, escenarios ni punto de equilibrio | Capítulo 11 completo, con sensibilidad y doce pruebas de realidad |
| 30 respuestas de encuesta ficticias | Cuestionario listo y hoja de captura; ninguna respuesta inventada |
| Legal y franquicia de una empresa con cocina y vehículos | Legal de una plataforma con repartidores a pie; franquicia por campus |
| Faltaban los capítulos 5, 7 y 11 | Están los 18 |

Frente a la proyección financiera del equipo, el primer año sale menor porque ahora el modelo cuenta el arranque gradual, los meses sin clases, gastos fijos cotizados y las dos garantías.

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
- Contratos completos. Están los puntos principales del convenio con locales y del contrato de repartidores; redactarlos le toca al abogado.
