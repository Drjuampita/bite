# 7. Operación y producción

BITE no tiene local, caja ni inventario propios. BITE no tiene ninguno de los tres. En cada apartado explicamos cómo funciona ese proceso en una plataforma de reparto.

## 7.1 Procesos

BITE tiene cuatro procesos que se repiten todos los días (pedido y entrega, atención de incidencias, reclutamiento y compras) y uno semanal (corte y pago a locales). Las metas: 97% de entregas dentro de la ventana e incidencias resueltas el mismo día.


### 7.1.1 Procesos administrativos

!fig flujo_admin | 12.5 | Proceso administrativo semanal: del corte al pago a los locales.

El dinero de la comida no es de BITE. La plataforma lo cobra por cuenta del local y se lo entrega cada semana, menos la comisión. Por eso el proceso administrativo central es la conciliación: lo que dice la app, lo que depositó la pasarela de pago y lo que se le debe a cada local tienen que coincidir al peso.

#### 7.1.1.1 Archivo de concentrado de ingresos y gastos semanales

El archivo es la hoja «Semanal» del libro BITE_Modelo_Financiero.xlsx. Cada lunes se captura una fila con el corte de la semana anterior. La hoja calcula sola el ingreso de BITE y el resultado de la semana.

En una semana tipo de octubre de 2027, el escenario esperado da {{sem_B|n}} pedidos, {{sem_I|$}} de ingreso para BITE y {{sem_P|$}} de resultado después de costos y gastos fijos.

#### 7.1.1.2 Orden de compra

Toda compra superior a $500 lleva orden de compra con folio. La orden nace de una requisición y de tres cotizaciones, y sin ella Administración no paga la factura.

La orden lleva folio y fecha, área que solicita, proveedor, artículo con su especificación, cantidad y precio, las tres cotizaciones comparadas, condiciones de pago, quién autoriza y quién recibe.

#### 7.1.1.3 Corte por turno

En BITE el turno es el bloque de entrega. La app cierra cada bloque sola: registra pedidos entregados, cancelados y fallidos. Al final del día Operaciones revisa el corte diario a las 17:30: venta por local y por bloque, pago a repartidores, cortesías (primer envío gratis), descuentos (envíos reembolsados), cancelaciones e incidencias.


#### 7.1.1.3.1 Control de la venta en terminales bancarias

BITE no usa terminales físicas: todo el cobro ocurre dentro de la app por medio de una pasarela de pago. El equivalente del cierre de lote es el reporte diario de cobros de la pasarela. Cada mañana Administración compara tres cifras del día anterior: lo cobrado según la app, lo cobrado según la pasarela y lo que la pasarela anuncia que depositará. Si no coinciden, se revisa pedido por pedido antes de calcular los pagos a los locales. Los contracargos se registran aparte, con el pedido al que corresponden.

#### 7.1.1.4 Ingreso y control de inventarios

BITE no almacena alimentos. Su inventario es de equipo y consumibles: mochilas, uniformes, gafetes, tabletas, sellos y etiquetas. Se controla con una hoja de entradas y salidas:

- **Entradas:** cada compra entra con su orden de compra y su factura.
- **Salidas:** el equipo se entrega al repartidor con un resguardo firmado; los sellos y etiquetas se entregan al local por paquete.
- **Mínimos:** se repone cuando quedan sellos para dos semanas de pedidos.
- **Conteo:** el primer lunes de cada mes se cuenta todo y se compara con la hoja.

#### 7.1.1.4.1 Inventario inicial

!tabla Inventario inicial
!cols 3,0.9,1.3,1.3
| Artículo | Cantidad | Costo unitario | Total |
|---|---|---|---|
| Mochila térmica de 51 litros | 6 | $1,129.00 | $6,774.00 |
| Playera polo bordada | 16 | $254.04 | $4,064.64 |
| Gafete con cordón | 8 | $50.00 | $400.00 |
| Tableta Android de 10 pulgadas | 4 | $1,799.00 | $7,196.00 |
| **Total** | | | **$20,783.64** |
!fuente Fuente: cotizaciones del apartado 7.1.2.1.2. Los sellos y las etiquetas se compran por millar y se cargan al costo de cada pedido.

#### 7.1.1.5 Cálculo y pago de nómina

**Repartidores.** Trabajan por bloques que eligen cada semana y cobran por pedido entregado. La Ley Federal del Trabajo, en su capítulo de plataformas digitales, exige contrato escrito, pago semanal y recibo. El cálculo es:

- Pedidos entregados × {{sup_pago|$}}.
- Más el complemento de garantía: si en un bloque asignado el repartidor ganó menos de {{sup_garantia|$}}, BITE completa la diferencia.
- Menos las retenciones de ISR e IVA que la ley fija para quien obtiene ingresos por medio de plataformas.

!tabla Ejemplo de pago semanal a un repartidor, año 2 del escenario esperado
!cols 4.2,1.6
| Concepto | Monto |
|---|---|
| Bloques trabajados en la semana (4 al día, 5 días) | 20 |
| Ingreso promedio por bloque | {{E_ing_rb_2|$2}} |
| Pago bruto de la semana | {{= S.E_ing_rb_2*20 |$}} |
| Pago bruto de un mes de 20 días de clase | {{= S.E_ing_rb_2*80 |$}} |
| Ingreso neto del mes para efectos de la ley (se excluye {{sup_excl_pie|%}}) | {{= S.E_ing_rb_2*80*(1-S.sup_excl_pie) |$}} |
| Umbral de relación laboral plena: un salario mínimo mensual | {{sup_sm_mensual|$}} |
| Ingreso por hora efectiva de trabajo | {{= S.E_ing_rb_2*2 |$}} |
| Salario mínimo por hora | {{= S.sup_sm_diario/8 |$2}} |

El tope de cuatro bloques diarios mantiene el trabajo compatible con las clases. Mientras el ingreso neto del mes quede por debajo de un salario mínimo mensual, la ley trata al repartidor como trabajador independiente de plataforma y BITE paga su aseguramiento contra riesgos de trabajo. Si un repartidor rebasa el umbral, BITE lo inscribe en el IMSS con seguridad social completa. Este encuadre laboral y fiscal lo revisamos con un abogado.

**Coordinador de operación.** Sueldo fijo quincenal con contrato por temporada. Su costo mensual de {{sup_coord|$}} incluye las cuotas patronales y solo se paga en los meses con clases.

**Socios.** No cobran sueldo en los primeros tres años. El plan de expansión prevé el primer sueldo de tiempo completo en el año 4.

#### 7.1.1.6 Sistema de administración

Usamos cinco herramientas: el panel de administración de la app, la pasarela de pago ({{sup_pas_pct|%1}} + {{sup_pas_fijo|$2}} por cobro), facturación electrónica ($1,650 al año), correo y hojas de cálculo ($140 al mes por usuario) y un contador externo ($3,500 al mes).


### 7.1.2 Procesos operativos

#### 7.1.2.1 Compras

#### 7.1.2.1.1 Proceso de selección de proveedores

Un proveedor entra al padrón si factura, entrega en Querétaro y publica sus precios. Cada cotización se califica con cuatro criterios: precio (40%), calidad del producto (30%), tiempo de entrega (15%) y factura con garantía (15%). El padrón se revisa cada semestre.

#### 7.1.2.1.1.1 Proceso de selección de insumos

Cada insumo tiene una especificación mínima escrita, y solo se cotiza lo que la cumple. Tres ejemplos: la mochila debe ser térmica, impermeable y de al menos 40 litros, para llevar ocho pedidos; el sello debe romperse al abrir la bolsa; la tableta debe tener pantalla de 10 pulgadas para leer los pedidos desde la cocina.

#### 7.1.2.1.1.2 Proceso de compra de insumos

Requisición, tres cotizaciones, comparación, orden de compra, recepción contra la orden, entrada al inventario y pago. Las compras se pagan con la tarjeta de la empresa para que cada gasto tenga comprobante.

#### 7.1.2.1.2 Descripción de los principales insumos

!tabla Tres cotizaciones por insumo
!cols 1.7,1.9,1.9,1.9,1.6
!tam 15
| Insumo | Cotización 1 | Cotización 2 | Cotización 3 | Elegida y por qué |
|---|---|---|---|---|
| Mochila térmica de reparto | Sears, 51 L: $1,129 | Elektra: $1,199 | Zetterpak, 70 L: $1,350 | Sears: cumple la capacidad al menor precio |
| Playera polo bordada | Lazzar: $254.04 | El 78: $320.00 | Empaquetron: $712.00 | Lazzar: precio de mayoreo desde 15 piezas |
| Tableta Android de 10 pulgadas | Cyberpuerta, Start Up: $1,747 con envío | Office Depot, TCL: $1,799 | Cyberpuerta, Lenovo: $3,869 | Office Depot: marca con garantía en tienda física |
| Sello de seguridad, millar | Pixz: $955 | Pop México: $1,220 | El 78: $1,150 | Pop México: es el único descrito como sello de seguridad |
| Pasarela de pago, por cobro | Stripe: 3.6% + $3.00 | Conekta: 3.4% + $3.00 | Mercado Pago: 3.49% + $4.00 | Stripe: es la tarifa que usa el modelo, por ser la más alta; Conekta se evalúa al lanzar |
!fuente Fuente: sitios de cada proveedor, consultados en noviembre de 2026. Las playeras y gorras de Lazzar y los impresos de 360imprimir, Pixz y Sinergia se publican sin IVA; aquí Lazzar ya lo incluye.

!nota En el modelo usamos la tarifa de Stripe, que es la más alta de las tres. Si se contrata Conekta, el costo por pedido baja y el margen mejora; la proyección no cuenta con ello.

#### 7.1.2.1.3 Presupuesto de equipo

El equipo cuesta $19,632: seis mochilas térmicas ($6,774), uniformes para ocho repartidores ($5,662) y cuatro tabletas para los locales ($7,196). Forma parte de los gastos de arranque.


#### 7.1.2.2 Plan de sistema de control

El control de BITE descansa en que cada paso deja registro en la app, con hora y responsable.

#### 7.1.2.2.1 Check in de entrada

- **Repartidor.** Confirma su asistencia en la app 20 minutos antes de su bloque. Si no confirma, la app avisa a Operaciones y ofrece el bloque al siguiente del padrón.
- **Local.** Al abrir marca «Abierto» en su panel. Si no lo hace, la app deja de ofrecer sus pedidos «Ahora» y avisa a Operaciones.
- **Operaciones.** El socio o coordinador de guardia inicia sesión a las 7:15 y revisa la lista de encendido.

#### 7.1.2.2.2 Seguridad

!tabla Medidas de seguridad
!cols 2,5
| Riesgo | Medida |
|---|---|
| Que el pedido llegue a otra persona | Código de entrega de cuatro dígitos que solo ve el alumno en su app; sin código no se puede marcar «Entregado» |
| Que alguien abra la bolsa | Sello de seguridad puesto en el local; el alumno no recibe una bolsa con el sello roto |
| Que entre al campus alguien ajeno | Los repartidores son alumnos inscritos, mayores de edad, con uniforme y gafete con folio |
| Manejo de efectivo | No hay: todo el cobro es con tarjeta dentro de la app |
| Datos de los alumnos | Acceso por rol: el local ve el pedido y el salón; el repartidor, el salón y el nombre. Nadie más que el alumno ve el código |
| Manipulación de precios | El total se calcula en el servidor con el catálogo del local; el precio que manda el celular no cuenta |
| Cuentas falsas | Registro solo con correo institucional |

### 7.1.3 Revisión de personal

Antes de su primer bloque del día, cada repartidor pasa una revisión de un minuto con Operaciones:

- Playera, gorra y gafete visibles.
- Mochila limpia por dentro y sin olores.
- Manos lavadas; cabello recogido.
- Celular con batería y la app abierta en su sesión.

Quien no cumple no sale a repartir ese bloque. La revisión queda marcada en la app.

### 7.1.4 Proceso de apertura y cierre

BITE no abre un local: abre un servicio.

A las 7:15 revisamos la lista de encendido; a las 7:30 entregamos mochilas y revisamos al personal; de 7:45 a 16:45 corren los bloques; a las 17:00 se limpian y guardan las mochilas; a las 17:30 se hace el corte, y a las 21:00 la app cierra los pedidos del día siguiente.

Las mochilas se guardan en un gabinete con llave dentro de uno de los locales afiliados. Ese espacio se pacta en su convenio.

### 7.1.5 Proceso de limpieza de áreas

El área que BITE limpia es la mochila térmica, que es donde viaja la comida. La Norma Oficial Mexicana NOM-251-SSA1-2009 pide que el transporte de alimentos evite la contaminación y conserve la temperatura.

- **Al cerrar el día:** vaciar la mochila, limpiar el interior con paño y solución desinfectante de grado alimenticio, y dejarla abierta para que seque.
- **Cada viernes:** lavado completo del forro y revisión de cierres y correas.
- **En cada recolección:** los alimentos calientes y los fríos viajan en bolsas separadas; nada va suelto.
- **Registro:** la limpieza diaria se marca en la app junto con el cierre.

La preparación de los alimentos y su higiene son responsabilidad de cada local, que opera con sus propios permisos sanitarios.

### 7.1.6 Proceso de encendido de sistema

Cada mañana, a las 7:15, Operaciones recorre esta lista:

1. La app carga y permite iniciar sesión.
2. Los pedidos agendados para hoy aparecen en el panel de cada local.
3. Las tabletas de los locales están cargadas y con sesión abierta.
4. Los cupos por hora son los correctos; se ajustan si un local avisó de menor capacidad.
5. Los productos agotados están apagados.
6. La pasarela de pago responde: se hace un cobro de prueba de $1 y se reembolsa.
7. Cada bloque del día tiene repartidor confirmado.

Si la app falla, el plan de contingencia es simple: Operaciones avisa a los alumnos con pedido, los locales reciben la lista del día por WhatsApp y las entregas se confirman a mano. Los pedidos nuevos se detienen hasta restablecer el servicio.

### 7.1.7 Proceso de recepción de cliente

El cliente de BITE llega por la app.

!fig flujo_pedido | 12.5 | Proceso de pedido, de la app a la puerta del salón.

### 7.1.8 Proceso de producción

La cocina es del local. Lo que BITE produce es la entrega, por bloques.

**Las dos pasadas.** En cada ventana el repartidor recorre su zona dos veces. En la primera pasada, desde el minuto 45, entrega a quien ya está en su salón. En la segunda, en los últimos cinco minutos, entrega a quien viene llegando de otra clase. Al pedir, el alumno marca si estará en el salón o si viene de otra clase, y la app ordena la ruta. A la hora en punto el repartidor se retira: no se entrega con la clase empezada.

**Capacidad.** En una mochila caben {{sup_cap_viaje|n}} pedidos, pero con dos pasadas y varios pisos suponemos que un repartidor entrega {{sup_ped_rb|n}} por bloque en promedio. Es un supuesto clave que el piloto debe medir.

**Cuántos repartidores.** Cada bloque abierto lleva al menos {{sup_rep_min|n}} repartidores, uno por cada mitad del campus, y se suma otro por cada {{sup_ped_rb|n}} pedidos. El bloque más cargado concentra {{sup_pico|%}} de los pedidos del día: en el año 2 del escenario esperado son {{= S.E_oday_oct_2*S.sup_pico |n}} pedidos, que piden {{= Math.ceil(S.E_oday_oct_2*S.sup_pico/S.sup_ped_rb) |n}} repartidores al mismo tiempo, uno por zona. En el optimista el pico llega a {{O_pico_max|n}} pedidos: caben en el cupo de {{sup_cupo_locales|n}} pedidos por hora con que está configurada la app, pero piden {{= Math.ceil(S.O_pico_max/S.sup_ped_rb) |n}} repartidores, más que el padrón inicial de {{sup_padron|n}}. En ese escenario el padrón y el equipo crecen con cargo a la caja.

**Los bloques se abren con la demanda.** BITE arranca con {{sup_bloques_piloto|n}} bloques y abre uno más por cada {{sup_ped_abrir|n}} pedidos diarios, hasta llegar a los {{sup_bloques|n}}. Así ningún repartidor queda asignado a un bloque casi vacío.

**Asignación.** A las 21:00 se cierran los pedidos agendados del día siguiente. La app agrupa los pedidos de cada bloque por edificio y Operaciones asigna a los repartidores. Los pedidos «Ahora» se suman al repartidor del bloque en curso.

**Cuando algo sale mal.**

La regla es resolver antes de explicar: si el problema se puede corregir antes de la clase, se corrige; si no, se reembolsa de inmediato. Después se registra la causa. Tres faltas de un repartidor o de un local en un mes abren una revisión con Operaciones.
