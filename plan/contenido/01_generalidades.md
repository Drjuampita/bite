# 1. Generalidades del proyecto

## 1.1 Resumen ejecutivo

**BITE lleva la comida de los locales del campus a la puerta del salón, en los 15 minutos antes de que empiece la clase.** El alumno pide desde su celular, ese mismo día o desde la noche anterior, y elige su salón y la hora de su clase. El local recibe el pedido entre 45 y 60 minutos antes, lo prepara y lo sella. Un repartidor, que también es alumno, recoge los pedidos de un edificio y entrega cada uno contra un código de cuatro dígitos.

**El problema.** En la Universidad Anáhuac Querétaro estudian {{sup_alumnos|n}} alumnos de licenciatura. El área de comida está en la planta baja del Edificio Liderazgo y las clases se reparten en cinco edificios. Cuando el receso entre dos clases es corto, ir, hacer fila, esperar y volver se lleva casi todo ese tiempo. El alumno come de prisa, llega tarde o no come. Un estudio con 300 universitarios del Estado de México encontró que la mitad omite alguna comida principal mientras está en la universidad (Martínez-Hernández et al., 2021).

**Por qué nadie lo resuelve hoy.** Las apps generales de reparto entregan en una dirección, no en un salón, y no saben a qué hora empieza una clase. En el comparativo de Profeco de octubre de 2026, un platillo de $175 terminó costando cerca de $219 en Uber Eats. BITE usa lo único que esas apps no tienen: el horario de clases. Como las entregas ocurren en ventanas fijas, un repartidor lleva varios pedidos por viaje, y como se puede agendar hasta las 21:00 del día anterior, el local y BITE conocen la demanda de mañana desde hoy.

**El modelo de negocio.** BITE cobra $19 de envío, un sobreprecio promedio de $10 sobre el menú y 20% de comisión al local. Por un pedido de $120 ingresa {{u_ing_E|$2}} sin IVA y, después de pagar al repartidor, la pasarela de pago, el sello y las garantías, le quedan {{u_margen_E|$2}}. La comisión se calcula sobre el precio al público. Quien pide con frecuencia puede contratar BITE Pass: $99 al mes con todos los envíos incluidos.

**El producto ya existe.** El equipo construyó un producto mínimo viable que funciona: la app del alumno, el panel del local y la vista del repartidor, con una base de datos cuyas reglas de negocio pasan 29 pruebas automáticas. Falta conectar el cobro con tarjeta y BITE Pass, presupuestados en el arranque.

**Los números.** Mientras los socios coordinan la operación sin cobrar, BITE cubre sus gastos fijos con {{e_be_oday_E|n}} pedidos por día de clase: basta con que lo use {{e_be_adop_E|%1}} de los alumnos. Con un coordinador pagado necesita {{e_be2_oday_E|n}} pedidos, {{e_be2_adop_E|%1}} de los alumnos. El escenario esperado supone 5% en el primer año y 6% en el segundo.

!tabla Resultados del escenario esperado en el campus Anáhuac Querétaro
!cols 3,1.3,1.3,1.3
| Concepto | Año 1 (2027) | Año 2 (2028) | Año 3 (2029) |
|---|---|---|---|
| Usuarios activos en noviembre | {{E_users_1|n}} | {{E_users_2|n}} | {{E_users_3|n}} |
| Pedidos | {{E_pedidos_1|n}} | {{E_pedidos_2|n}} | {{E_pedidos_3|n}} |
| Ingresos (sin IVA) | {{E_ing_1|$}} | {{E_ing_2|$}} | {{E_ing_3|$}} |
| Utilidad neta | {{E_neta_1|$}} | {{E_neta_2|$}} | {{E_neta_3|$}} |
| Caja al cierre del año | {{E_caja_1|$}} | {{E_caja_2|$}} | {{E_caja_3|$}} |
!fuente Fuente: modelo financiero del proyecto (archivo BITE_Modelo_Financiero.xlsx). El año 1 incluye {{arranque|$}} de gastos de arranque.

**La inversión.** Los cinco socios aportan {{aporte_socio|$}} cada uno, {{capital|$}} en total. De ese monto, {{arranque|$}} son gastos de arranque y {{reserva|$}} quedan como reserva. En el escenario esperado el capital se recupera en el mes {{E_payback|n}}. En el pesimista no se recupera en tres años, pero la caja nunca baja de {{P_caja_min|$}}: el capital se fijó en esa cifra para que así fuera.

**El crecimiento.** Un campus es un negocio pequeño: en el año 3 deja {{E_neta_3|$}}, que son {{= S.E_neta_3/5 |$}} por socio, sin pagar su trabajo. El plan es repetirlo: tres campus propios en la zona de Querétaro al año 3 y, desde el año 4, franquicias de campus. Al año 5 la red tendría {{x_n_total_5|n}} campus, ingresos por {{x_ing_bite_5|$k}} y una utilidad neta de {{x_neta_5|$k}}, después de pagar sueldo a dos socios de tiempo completo.

**Lo que falta por comprobar.** Cuatro cosas condicionan el arranque del 11 de enero de 2027: el permiso de la universidad, que incluye su regla sobre alimentos en los salones; los convenios con los cuatro locales; la encuesta a 300 alumnos, y el piloto de dos semanas. El documento dice en cada apartado qué es dato, qué es decisión y qué es supuesto.

# 2. Desarrollo

## 2.1 Descripción del concepto

Para quien nunca ha estado en el campus, BITE se entiende con un caso típico.

Ana estudia cuarto semestre. Los martes sale de una clase y tiene media hora libre antes de la siguiente, que empieza a las 9:00 en el salón C204. Media hora parece suficiente para desayunar, pero el área de comida está en otro edificio y a esa hora todos tienen el mismo receso. Entre caminar, hacer fila, esperar su pedido y volver, le quedan cinco minutos para comer. Muchas veces prefiere no ir.

Con BITE, el lunes en la noche Ana abre la app, elige unos chilaquiles y un café, marca «mañana, clase de 9:00» y su salón, C204. Paga con tarjeta. El martes a las 8:00 el pedido aparece en la pantalla del local. A las 8:35 un repartidor recoge todos los pedidos que van al edificio C. Ana sale de su clase y camina al C204: a las 8:45 su repartidor ya está en la puerta. Le dice su código, recibe su bolsa sellada y desayuna con calma cerca de su salón. A las 9:00 entra a clase.

!fig dia_alumno | 16.5 | El mismo receso, con y sin BITE.

La diferencia con cualquier otra app de comida está en tres decisiones de diseño:

- **La dirección es el salón.** El alumno elige edificio, piso y salón en tres toques. La app recuerda el último.
- **La entrega ocurre en ventanas fijas.** En este documento, un **bloque** es cada hora de clase para la que se puede pedir, y su **ventana** son los 15 minutos de entrega anteriores a esa hora. Eso permite que un repartidor lleve varios pedidos a un mismo edificio en un solo viaje.
- **Agendar es lo normal.** Se puede pedir hasta las 21:00 del día anterior, o el mismo día con 45 minutos de anticipación. Cada local tiene un cupo por hora y la app avisa cuando quedan pocos lugares.

!fig linea_bloque | 16.5 | Línea de tiempo de un pedido agendado para una clase de 9:00.

**Quien no tiene receso.** Hay alumnos con dos clases pegadas, sin tiempo libre entre una y otra. Ellos reciben su pedido al llegar al salón, en los últimos cinco minutos de la ventana. Si pueden comer dentro del salón depende del reglamento de la universidad, que es uno de los puntos a resolver con el permiso. BITE nunca entrega durante una clase.

También existe el pedido «Ahora», para quien decide en el momento: entra a la cocina de inmediato y se entrega en cuanto está listo, siempre que el local esté abierto y haya repartidor disponible.

BITE atiende a dos clientes. El **alumno** paga por recibir su comida a tiempo sin hacer fila. El **local** paga una comisión por ventas que hoy pierde: las del alumno que ve la fila y se va. Además recibe sus pedidos con anticipación, lo que le permite cocinar antes de la hora pico.

## 2.2 Giro del negocio

BITE es una empresa de **servicios**. Su actividad es la intermediación entre locales de comida y consumidores por medio de una plataforma digital, y la entrega de esos alimentos dentro de un campus universitario. No cocina, no almacena comida y no tiene local.

!tabla Giro y actividad económica
!cols 2,5
| Concepto | Descripción |
|---|---|
| Giro | Servicios de entrega de alimentos por medio de plataforma digital, enfocados en campus universitarios |
| Sector | Terciario (servicios) |
| Actividad principal ante el SAT | Servicios de plataformas tecnológicas intermediarias, en las cuales se enajenan bienes y prestan servicios a través de Internet, aplicaciones informáticas y similares |
| Actividad secundaria | Servicios de mensajería y paquetería local, clave 492210 del Sistema de Clasificación Industrial de América del Norte |
| Qué vende | El envío al salón, la suscripción BITE Pass y, al local, el canal de venta (comisión) |
| Qué no hace | No prepara alimentos ni es dueña de la comida: cobra por cuenta del local y le entrega su parte cada semana |

## 2.3 Tipo de empresa

!fig sinoptico | 16.5 | Clasificación de BITE (cuadro sinóptico).

BITE nace como microempresa. Si el plan de expansión se cumple, el número de repartidores la llevará a pequeña empresa a partir del segundo campus. La figura jurídica se explica en el apartado 12.1 y el régimen fiscal en el 12.6.
