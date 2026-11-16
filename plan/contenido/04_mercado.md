# 6. Estudio de mercado

Este capítulo separa tres cosas: lo que se sabe por fuentes publicadas, lo que nosotros suponemos y lo que la encuesta y el piloto tienen que confirmar. Los supuestos de demanda del modelo financiero están marcados como tales en el apartado 11.

## 6.1 Mercado meta

### 6.1.1 Mercado meta

!tabla Segmentación del mercado meta
!cols 1.7,5.3
| Variable | Perfil |
|---|---|
| Geográfica | Campus de la Universidad Anáhuac Querétaro, en El Marqués, Querétaro. El servicio empieza y termina dentro del campus |
| Demográfica | Alumnos de licenciatura, de 17 a 25 años. Son {{sup_alumnos|n}} según el Informe 2024 de la universidad; con posgrado y educación continua la universidad reporta 8,222 |
| Género | Indistinto |
| Nivel socioeconómico, según la Asociación Mexicana de Agencias de Inteligencia de Mercado y Opinión (AMAI) | A/B y C+, por tratarse de una universidad privada. Estos niveles agrupan a 7.3% y 12.0% de los hogares del país. Es una hipótesis: la regla AMAI clasifica por características del hogar y la encuesta no las mide |
| Ingresos | No se pregunta el ingreso familiar. Se mide lo que importa para el negocio: el gasto habitual por comida (pregunta 10) y lo máximo que pagarían por el envío (pregunta 11) |
| Grado de estudios | Licenciatura en curso |
| Gustos y preferencias | Resolver la comida rápido, saber el total antes de pagar, pagar con tarjeta desde el celular y no perder clase. Usuarios habituales de apps |
| Ocupación | Estudiantes de tiempo completo, con recesos cortos entre clases varios días de la semana. En un segundo momento, docentes y personal administrativo |

**Tamaño del mercado.** No existe un dato publicado de cuántas comidas se venden al día en el campus. Como referencia, en el estudio de la UAEMéx 52.7% de los alumnos comía en las cafeterías de su universidad. Si la mitad de los {{sup_alumnos|n}} alumnos compra comida en el campus un día cualquiera, son unas {{= S.sup_alumnos*0.5 |n}} compras diarias y, a $120 por compra, cerca de ${{= Math.round(S.sup_alumnos*0.5*S.sup_ticket*S.dias_ano/1e6) |n}} millones al año. Es una estimación de orden de magnitud que la pregunta 2 de la encuesta permite corregir.

Frente a ese mercado, lo que BITE necesita es poco: los {{E_oday_oct_2|n}} pedidos diarios que proyecta para el año 2 equivalen a {{= S.E_oday_oct_2/(S.sup_alumnos*0.5) |%1}} de esas compras.

## 6.2 Determinación del mercado meta

Ordenamos el mercado con tres criterios: qué tan fuerte es el problema, qué tan seguido se repite y qué tan fácil es llegar a ese grupo.

!tabla Segmentos por orden de prioridad
!cols 2.2,2.6,2.6,1.2
| Segmento | Qué problema tiene | Cómo se le atiende | Cuándo |
|---|---|---|---|
| Alumnos con recesos de 30 minutos o menos | La fila se lleva el receso: comen de prisa o no comen | Pedido agendado por hora de clase, con entrega en la puerta del salón 15 minutos antes | Desde el piloto |
| Alumnos sin receso entre dos clases | No tienen tiempo de ir por comida | Entrega al llegar al salón, en los últimos cinco minutos de la ventana. Comer en el salón depende de la regla de la universidad | Según el permiso |
| Alumnos deportistas | Comen a horas fijas por dieta y entrenamiento | Punto de entrega fijo en el Polideportivo y BITE Pass | Año 1 |
| Docentes y personal | Dan clases seguidas o no pueden dejar su oficina | La app ya admite cualquier correo institucional; falta definir sus puntos de entrega | Año 2 |
| Locales de comida del campus | Pierden ventas cuando la fila ahuyenta al cliente | Panel de pedidos, cobro y reparto a cargo de BITE | Cuatro locales en el arranque |

### 6.2.1 Encuestas

**Diseño.** La encuesta es cuantitativa, de 15 preguntas organizadas por las 4P: 14 cerradas con cinco respuestas cada una y una abierta. Cada pregunta existe porque alimenta una decisión o un supuesto del modelo; la última columna de la tabla dice cuál.

**Muestra.** La guía pide 300 respuestas. Sobre una población de {{sup_alumnos|n}} alumnos, 300 respuestas dan un margen de error de ±5.5 puntos con 95% de confianza. Para que la muestra se parezca al campus se fijan cuotas por edificio: se reparten los códigos QR en proporción a los salones de cada uno.

**Aplicación.** Formulario en línea, sin datos personales, distribuido con códigos QR en los edificios y en los grupos de WhatsApp de cada carrera durante cinco días de clase. El formulario abre con una pregunta filtro, «¿eres alumno de licenciatura?», que no cuenta entre las 15.

!tabla Cuestionario: 15 preguntas, sus respuestas y para qué sirve cada una
!auto encuesta

**Resultados.** Como el levantamiento completo termina después de esta entrega, corrimos una simulación de 300 respuestas con el mismo cuestionario para probar la hoja «Encuesta» del modelo y ver cómo se leerían los datos. La tabla muestra esa simulación frente al supuesto que le corresponde; los números se sustituyen por los reales al cerrar el levantamiento.

!tabla Simulación de resultados de la encuesta frente a los supuestos del modelo
!auto encuesta_resultados

En la simulación, 64% de los encuestados señala las filas o el poco tiempo entre clases como su principal dificultad para comer en el campus, 16% dice que definitivamente usaría la app y 34% que probablemente sí. Con el descuento que aplicamos a la intención declarada, eso equivale a una adopción de 8.2%, por encima del 5% que supone el plan y del punto de equilibrio.

**Cómo se leen los resultados.** La intención declarada siempre es mayor que el uso real. Por eso la adopción implícita cuenta solo a {{sup_conv_def|%}} de quienes respondan «definitivamente sí» y a {{sup_conv_prob|%}} de quienes respondan «probablemente sí». Dejamos escrita la regla de decisión antes de ver los datos:

- **Adopción implícita de {{sup_adop1_E|%}} o más:** el plan sigue como está.
- **Entre {{e_be2_adop_E|%1}} y {{sup_adop1_E|%}}:** se lanza con el plan, sin contratar coordinador hasta que el volumen lo pague.
- **Entre {{e_be_adop_E|%1}} y {{e_be2_adop_E|%1}}:** el negocio solo se sostiene mientras lo operemos nosotros sin cobrar. Se lanza con menos bloques y la mitad de la publicidad, y se planea con el escenario pesimista.
- **Menos de {{e_be_adop_E|%1}}:** no se gasta en terminar el producto hasta revisar el precio y la oferta.

**Complementos.** La encuesta dice cuántos; no dice por qué. Se suman dos herramientas baratas: diez entrevistas, y la medición de filas, que con un cronómetro y tres días da dos datos que hoy solo se conocen por experiencia: cuántos minutos cuesta comprar comida en hora pico y cuántos alumnos dejan la fila sin comprar.

## 6.3 Análisis SWOT general

!tabla SWOT general de BITE
!cols 1.2,6
| Factor | Análisis |
|---|---|
| Fortalezas | El producto ya está construido y probado. La entrega se sincroniza con el horario de clases, algo que ninguna app general hace. La demanda de mañana se conoce desde hoy. No hay local, cocina ni inventario de comida. Estamos dentro del campus todos los días |
| Oportunidades | La mitad de los universitarios omite comidas. Las apps generales cobran de 25% a 29% a los restaurantes y no llegan al salón. Hay más campus con el mismo problema. En Estados Unidos el pedido por app dentro del campus ya opera en más de 450 universidades |
| Debilidades | Marca nueva. Depende de cuatro locales y del permiso de una sola universidad. Somos estudiantes y dedicamos tiempo parcial. Un solo campus da ingresos pequeños. La demanda todavía no está medida |
| Amenazas | La universidad puede negar o condicionar el permiso. Los locales pueden organizar sus propios pedidos anticipados. Una app grande puede entrar a los campus. La regulación laboral de plataformas puede encarecer el reparto. Tres meses al año no hay clases ni ingresos |

### 6.3.1 SWOT de las 4P

!tabla SWOT por cada P
!cols 0.9,1.9,1.9,1.9,1.9
!tam 16
| P | Fortaleza | Oportunidad | Debilidad | Amenaza |
|---|---|---|---|---|
| Producto | Pedido por hora de clase, entrega en el salón, código de entrega y bolsa sellada | Sumar pedidos de eventos y publicidad de locales en la app | Solo cuatro locales al inicio; el menú depende de ellos | Un pedido tardío o incompleto en las primeras semanas daña la confianza; que no se permita comer en los salones |
| Precio | Total visible antes de pagar; BITE Pass baja el costo de quien pide con frecuencia | Precio distinto por hora para mover pedidos fuera del pico | Cuesta 24% más que ir al mostrador | Comprar en el local no tiene cargo; una app grande puede subsidiar envíos |
| Plaza | El campus es cerrado, con recorridos cortos y destinos que se repiten | Puntos fijos en el Polideportivo y la biblioteca | Requiere que el repartidor pueda entrar a todos los edificios | Cambios en las reglas de acceso o de circulación del campus |
| Promoción | Nosotros y los repartidores somos alumnos; la recomendación pasa entre compañeros | Primer envío gratis y programa de referidos | Sin acceso garantizado a los canales oficiales de la universidad | Saturación de avisos en el campus |

### 6.3.2 SWOT por áreas de la empresa

La guía pide estas cuatro áreas. En el organigrama del apartado 10.1, Ventas y Marketing forman una sola: Comercial y marketing.

!tabla SWOT por área
!cols 1.2,1.8,1.8,1.8,1.8
!tam 16
| Área | Fortaleza | Oportunidad | Debilidad | Amenaza |
|---|---|---|---|---|
| Administración | Todo cobro pasa por la app y queda registrado | Usar los datos de demanda por hora para negociar con locales | Sin historial ni crédito | Carga fiscal de plataforma: retenciones y facturación semanal |
| Operaciones | La demanda agendada permite asignar repartidores con un día de anticipación | Medir cada entrega y premiar la puntualidad | Depende de que los repartidores cumplan sus bloques | Lluvia, exámenes y eventos que cambian los horarios |
| Ventas | Oferta clara para el local: paga solo si vende | Afiliar a los locales por orden de preferencia de la encuesta | Sin fuerza de ventas: la afiliación la hacemos nosotros | Que un local se salga y deje un hueco en el menú |
| Marketing | Beneficio fácil de mostrar: «llega antes de tu clase» | Contenido hecho por alumnos y embajadores por carrera | Presupuesto de {{fijo_5_mes|$}} al mes | Que la novedad se agote si el servicio falla |

## 6.4 Análisis de la competencia

No conocemos ninguna otra app de entrega que opere dentro de la universidad. BITE compite contra lo que el alumno hace hoy.

!tabla Benchmarking: las alternativas del alumno
!cols 1.5,1.5,1.8,1.3,1.6
!tam 16
| Alternativa | Dónde se recibe | Costo extra sobre la comida | ¿Se agenda por clase? | Lo que cuesta en tiempo |
|---|---|---|---|---|
| Ir al mostrador | En el local | $0 | No | Caminar, hacer fila y esperar en hora pico |
| Traer comida de casa | No aplica | $0 | No aplica | Prepararla y cargarla todo el día |
| Apps generales: Uber Eats, DiDi Food, Rappi | En la dirección del campus; hay que salir a encontrarse con el repartidor | De $12 a $44 en un platillo de $175 | Solo por hora de reloj | Espera variable y el traslado al punto de encuentro |
| Encargar al local y pasar a recoger | En el local | $0 | Informal, si el local acepta | Caminar y recoger |
| **BITE** | En la puerta del salón | {{= S.sup_fee+S.sup_markup |$}} en un pedido de {{sup_ticket|$}}; con BITE Pass y ocho pedidos al mes, {{= S.sup_markup+S.sup_passfee/8 |$}} | Sí, desde un día antes | Un minuto para pedir |

**Lo que cuestan las apps generales.** En octubre de 2026 la Profeco comparó el mismo platillo de $175 en tres plataformas.

!tabla Costo total del mismo pedido por plataforma
!cols 2,1.1,1.3,1.2,1.2
| Plataforma | Envío | Tarifa de servicio | Total | Costo extra |
|---|---|---|---|---|
| Uber Eats, platillo de $175 | $28.00 | $15.75 | $218.75 | 25.0% |
| DiDi Food, platillo de $175 | $10.00 | $12.25 | $197.25 | 12.7% |
| Rappi, platillo de $175 | $0.00 | $12.30 | $187.30 | 7.0% |
| BITE, pedido de {{sup_ticket|$}} | {{u_fee_E|$2}} | {{u_markup_E|$2}} | {{u_total_E|$2}} | {{u_extra_E|%1}} |
| BITE con Pass y ocho pedidos al mes | {{= S.sup_passfee/8 |$2}} | {{u_markup_E|$2}} | {{= S.sup_ticket+S.sup_markup+S.sup_passfee/8 |$2}} | {{= (S.sup_markup+S.sup_passfee/8)/S.sup_ticket |%1}} |
!fuente Fuente: Ramírez (2026), con datos de la Revista del Consumidor de Profeco, y modelo financiero de BITE. El total es la suma del platillo y los dos cargos; la nota de prensa redondea el de Uber Eats a $218 y el de Rappi a $187.50. En BITE la tarifa de servicio va incluida en el precio del menú. Los totales de las plataformas no incluyen el sobreprecio de menú ni la propina. Con BITE Pass, el envío de la tabla es la cuota de {{sup_passfee|$}} repartida entre ocho pedidos.

La tabla muestra que **BITE no es la opción barata.** En porcentaje cuesta casi lo mismo que la app general más cara. Lo que vende es otra cosa: llega a la puerta del salón, llega a la hora de la clase y trae la comida de los locales del propio campus. BITE Pass conviene desde el sexto pedido del mes; con ocho, el costo extra baja de {{u_extra_E|%1}} a {{= (S.sup_markup+S.sup_passfee/8)/S.sup_ticket |%1}}.

**Lo que cuestan al restaurante.** Uber Eats publica comisiones de 25%, 27% y 29% según el plan. BITE cobra {{sup_com_E|%}}.

**Precedentes.** El pedido por app dentro del campus no es una idea sin probar. Grubhub Campus operaba en más de 450 universidades de Estados Unidos cuando DoorDash acordó comprarlo por 300 millones de dólares. En México, la app Skipeat, creada por un alumno de CETYS Tijuana para pedir y recoger en la cafetería, llegó a cerca de 10% de un campus de 3,900 alumnos (CETYS Universidad, 2019). Ninguno de los casos mexicanos encontrados entrega en el salón.

## 6.5 Diferenciador

**BITE entrega en el salón y a la hora de la clase.** Las demás opciones resuelven «qué quiero comer y a dónde lo llevan». BITE resuelve además «en qué clase estoy y cuándo empieza la siguiente». De esa diferencia salen las demás:

- El pedido se agenda por clase, no por hora de reloj.
- La entrega ocurre antes de la clase y nunca la interrumpe.
- Cada local tiene un cupo por hora, así que no promete lo que no puede cocinar.
- El repartidor es un alumno identificado que ya está dentro del campus.
- El pedido se cierra con un código que solo ve quien lo compró.

## 6.6 Ventaja competitiva

El mejor argumento de venta cabe en una frase:

!nota **«Tu comida en la puerta de tu salón antes de que empiece tu clase. Si llega tarde, el envío va por nuestra cuenta.»**

La ventaja es difícil de copiar por tres razones. Una app general tendría que rehacer su producto alrededor de salones y horarios para un mercado que le resulta pequeño. Un local por su cuenta no tiene repartidores ni escala para cubrir todos los edificios. Y el conocimiento de la demanda por hora, que se acumula con cada pedido, queda en BITE.

Para el local el argumento es igual de corto: **«Vende a quien hoy se va por la fila, sin contratar a nadie y pagando solo cuando vendes.»**

## 6.7 Tendencias

!fig tend_compradores | 15.5 | Compradores digitales en México, en millones de personas mayores de 18 años. Fuente: AMVO (2026).

En siete años se duplicó el número de mexicanos que compran en línea. El alumno que entra hoy a la universidad creció comprando desde el celular.

!fig tend_ecommerce | 15.5 | Valor del comercio electrónico minorista en México, en miles de millones de pesos. Fuente: AMVO (2026).

El gasto en línea creció más del doble entre 2021 y 2025. La comida preparada es una de las categorías habituales: 54% de los compradores digitales la compró en línea en 2025 (AMVO, 2026).

!fig tend_pagos | 15.5 | Medio de pago en compras de $500 o menos, población de 18 a 70 años. Fuente: INEGI y CNBV, Encuesta Nacional de Inclusión Financiera 2021 y 2024.

El efectivo sigue dominando las compras pequeñas, pero la tarjeta y los pagos desde el celular pasaron de 9.0% a 14.8% en tres años. BITE cobra solo con tarjeta dentro de la app. Es una decisión consciente: evita que el repartidor maneje dinero y confirma el pago antes de cocinar. La pregunta abierta de la encuesta dirá si el pago es una barrera; si lo es, la segunda fase incluye un saldo recargable.

!fig tend_tiles | 16.5 | Cuatro datos sobre el alumno y el pedido por app en campus.

En conjunto, las tendencias dicen tres cosas: el cliente ya compra desde el celular, el problema de saltarse comidas está documentado y el pedido por app dentro de un campus es un negocio probado en otros países.
