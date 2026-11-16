# 3. Justificación

## 3.0 Preguntas de justificación

### ¿Qué elementos tomamos en cuenta para desarrollar el concepto?

**El tiempo del alumno.** El semestre de la Universidad Anáhuac Querétaro tiene 16 semanas y el año suma {{dias_ano|n}} días de clase. Vivimos el problema a diario: cuando el receso entre dos clases es corto, la fila del área de comida en hora pico se lleva la mayor parte. El resultado es conocido: se come tarde, se come de prisa o no se come.

**La evidencia de que no es un caso aislado.** En un estudio con 300 alumnos de la Universidad Autónoma del Estado de México (UAEMéx), la mitad omitió alguna de las tres comidas principales durante su estancia en la universidad y 52.7% comía en las cafeterías del campus (Martínez-Hernández et al., 2021).

**La geografía del campus.** La comida se concentra en un punto, el área de comida de la planta baja del Edificio Liderazgo, y los alumnos están repartidos en los edificios A, B, C, IDEA y Business & Innovation Hub. Es un entorno cerrado, con recorridos a pie y destinos que se repiten cada hora. Para una operación de reparto es el mejor escenario posible: sin tráfico, sin vehículos y con rutas cortas.

**El hábito ya existe.** En México, 97.6% de los jóvenes de 15 a 24 años usa internet (INEGI, 2026) y los compradores en línea pasaron de 37.0 millones en 2018 a 72.5 millones en 2024 (AMVO, 2026). El alumno ya sabe pedir comida desde una app; lo que no tiene es una que llegue a su salón.

**El horario como ventaja.** Las clases empiezan a horas fijas. Si las entregas se agrupan en la ventana anterior a cada hora, un repartidor lleva varios pedidos por viaje y el local sabe con anticipación cuánto cocinar. Ese es el elemento que hace viable un envío de $19 dentro del campus.

### ¿Qué conocimientos o experiencia tenemos en el proyecto que pretendemos realizar?

- **Conocemos al cliente porque somos el cliente.** Los cinco somos alumnos del campus: conocemos los horarios, los edificios, los locales y las horas pico.
- **Ya construimos el producto.** Desarrollamos un producto mínimo viable que funciona: la app del alumno, el panel del local y la vista del repartidor. La base de datos tiene reglas de negocio probadas con 29 pruebas automáticas, que están en el repositorio del proyecto: cupo por hora, precios calculados en el servidor, código de entrega y acceso por rol.
- **Estamos empezando la carrera.** Cursamos el primer semestre de Administración y Dirección de Empresas. Lo que no sabíamos lo investigamos, y lo decimos donde corresponde.
- **Sabemos lo que no sabemos.** No tenemos experiencia operando repartidores ni negociando con locales. Por eso arrancamos con un piloto de dos semanas y 50 alumnos antes de abrir a todo el campus, y contratamos asesoría legal y contabilidad externa desde el primer día.

### ¿Qué razones justifican nuestro plan de empresa?

1. **Cada pedido genera margen.** Por un pedido de $120, BITE ingresa {{u_ing_E|$2}} y gasta {{u_costo_E|$2}}. El margen es de {{u_margen_E|$2}}, {{u_margen_pct_E|%}} del ingreso.
2. **El punto de equilibrio es alcanzable.** Con {{e_be_oday_E|n}} pedidos por día de clase se cubren los gastos fijos de todo el año mientras operamos nosotros: {{e_be_adop_E|%1}} de los alumnos. Con un coordinador pagado son {{e_be2_oday_E|n}} pedidos, {{e_be2_adop_E|%1}}.
3. **Casi no hay activos.** BITE no tiene local, cocina ni vehículos. Los gastos de arranque son {{arranque|$}}, y la mayor parte es terminar la app y la publicidad de lanzamiento.
4. **Los locales no invierten.** Reciben pedidos anticipados, pagan solo cuando venden y la comisión de 20% es menor que la de 25% a 29% que Uber Eats publica para restaurantes en México. Cuánta de esa venta es nueva y cuánta habría llegado al mostrador se mide en el piloto.
5. **Se puede repetir.** Lo que funcione en un campus se copia en otro con {{sup_exp_apertura|$}} de inversión, porque la app, la marca y los manuales ya existen.
6. **El riesgo está acotado.** En el peor de los tres escenarios no recuperamos nuestro capital en tres años, pero la empresa no se queda sin caja. Y tenemos una regla escrita para decidir en abril si se sigue.

## 3.1 Objetivos

### ¿En qué consiste el negocio?

BITE es una app de entrega de comida que opera dentro de la Universidad Anáhuac Querétaro. El alumno pide a los locales del campus desde su celular y recibe su comida en la puerta de su salón, en los 15 minutos antes de que empiece su clase. BITE cobra el envío al alumno y una comisión al local.

### Objetivos, estrategias y tácticas

!tabla Objetivos a corto, mediano y largo plazo
!cols 1.1,0.9,1.8,1.4,2.1,2.9
!tam 15
| Objetivo | Tiempo | Medible | $ | Estrategias | Tácticas |
|---|---|---|---|---|---|
| **OC** Corto plazo | Año 1 (2027) | 4 locales afiliados, {{E_users_1|n}} usuarios activos y {{E_pedidos_1|n}} pedidos | {{E_ing_1|$}} de ingresos | E1. Obtener el permiso de la universidad y afiliar a los cuatro locales | T1. Presentar el piloto a la dirección del campus y firmar convenio de comisión con cada local antes del 11 de enero de 2027 |
| | | | | E2. Lanzar con un piloto controlado y crecer por bloques | T2. Piloto de dos semanas con 50 alumnos en los bloques de 9:00, 11:00 y 13:00; abrir el resto al lograr 95% de entregas a tiempo |
| | | | | E3. Convertir la primera prueba en costumbre | T3. Primer envío gratis y BITE Pass de $99, con campaña en Instagram, grupos de WhatsApp y carteles con código QR |
| **OM** Mediano plazo | Años 2 y 3 (2028 y 2029) | 3 campus propios, {{x_ped_acum_3|n}} pedidos acumulados | {{x_ing_acum_3|$}} de ingresos acumulados; {{x_neta_3|$}} de utilidad neta en el año 3 | E1. Repetir el modelo en dos campus más de la zona de Querétaro | T1. Estudio de demanda y convenio con una segunda universidad durante 2027 para abrir en enero de 2028 |
| | | | | E2. Subir la adopción a 7% en el campus original | T2. Ampliar los bloques a la tarde, sumar a docentes y personal, y lanzar un programa de referidos |
| | | | | E3. Convertir la operación en un sistema que se pueda enseñar | T3. Coordinador de operación por campus, tablero semanal de indicadores y manual de operación documentado |
| **OL** Largo plazo | Año 5 en adelante (2031) | {{x_n_total_5|n}} campus: {{x_n_prop_5|n}} propios y {{x_n_fq_5|n}} franquiciados; {{x_ped_acum_5|n}} pedidos acumulados | {{x_ing_acum_5|$}} de ingresos acumulados; {{x_neta_5|$}} de utilidad neta en el año 5 | E1. Crecer con franquicias de campus | T1. Lanzar la franquicia en el año 4, con cuota de {{sup_fq_cuota|$}} y regalía de {{sup_fq_regalia|%}}; primeras tres unidades en universidades privadas |
| | | | | E2. Posicionar a BITE como el servicio de entrega universitario | T2. Embajadores por campus y presencia en ferias de franquicias |
| | | | | E3. Diversificar los ingresos | T3. Publicidad de los locales dentro de la app y pedidos para eventos del campus |
!fuente Las cifras salen del escenario esperado del modelo financiero (apartado 11.2) y del plan de expansión (apartado 13.9).

### ¿Cuáles son los productos o servicios que ofrecemos?

- **Pedido agendado.** El alumno elige la hora de su clase y lo recibe en los 15 minutos anteriores. Envío: {{sup_fee|$}}.
- **Pedido «Ahora».** Entra a la cocina de inmediato y se entrega en cuanto está listo. Mismo envío.
- **BITE Pass.** {{sup_passfee|$}} al mes con todos los envíos incluidos.
- **Garantía de puntualidad.** Si el pedido llega después de la hora de la clase, BITE reembolsa el costo del envío; si el alumno ya no puede recibirlo, reembolsa el pedido completo.
- **Panel para locales.** Pedidos agrupados por hora, control de productos agotados, resumen de ventas y pago semanal.



# 4. Descripción y naturaleza del negocio

## 4.1 Características del negocio

!tabla Datos generales de la empresa
!cols 2.4,5
| Concepto | Dato |
|---|---|
| Nombre de la empresa | BITE Servicios de Entrega, S.A.S. (Sociedad por Acciones Simplificada). La denominación se solicita en línea ante la Secretaría de Economía |
| Nombre comercial | BITE. Marca por registrar ante el IMPI en las clases 39 y 35 |
| Domicilio de operación | Circuito Universidades I, kilómetro 7, Fracción 2, El Marqués, Querétaro, C.P. 76246 (campus de la Universidad Anáhuac Querétaro) |
| Teléfono | +52 442 447 8664 |
| Correo electrónico | contacto@bitedelivery.mx |
| Sitio web | bitedelivery.mx |
| Tamaño | Microempresa |
| Sector | Servicios |
| Actividades económicas principales | Servicios de plataformas tecnológicas intermediarias; servicios de mensajería y paquetería local |
| Giro | Entrega de alimentos por medio de plataforma digital dentro de campus universitarios |
| RFC | BSE261207A1B (ficticio, para fines académicos) |
| Fecha de inicio de operaciones | 11 de enero de 2027, primer día del semestre enero–mayo |
| Propietarios | Silvana Rubio Reyes, Natalia Orozco Estrada, Diego Rodríguez Sáenz, Emmanuel Alexander Quintana Tirado y Juan Pablo Palma Redondo, con 20% cada uno |

Revisamos el buscador de marcas del IMPI y la marca BITE está disponible en nuestra clase; el dominio bitedelivery.mx también está libre.

## 4.2 Visión y misión

**Misión.** Que ningún alumno tenga que elegir entre comer y llegar a tiempo a clase. Llevamos la comida de los locales del campus a la puerta de su salón, antes de que empiece su clase.

**Visión.** En 2031, ser el servicio de entrega de comida de referencia en los campus universitarios de México, con presencia en diez campus.

**Valores.** Puntualidad: la hora de la clase manda. Claridad: el alumno ve el total antes de pagar. Cuidado: la bolsa sale sellada del local. Respeto por el salón: se entrega antes de la clase, nunca durante ella.

## 4.3 Propuesta de valor

!tabla Propuesta de valor para cada parte
!cols 1.2,2.8,1.8,2.8
| Para quién | Qué recibe | Qué paga | Por qué le conviene |
|---|---|---|---|
| El alumno | Su comida en la puerta de su salón antes de que empiece su clase, sin hacer fila; puede agendarla desde un día antes | {{sup_fee|$}} de envío por pedido, o {{sup_passfee|$}} al mes con BITE Pass; los precios del menú incluyen una tarifa de servicio de 8% | Usa su receso para comer y no para hacer fila. Si el pedido llega tarde, el envío no se cobra |
| El local | Pedidos anticipados, cobrados y entregados por BITE; panel con sus ventas por hora | {{sup_com_E|%}} de comisión sobre el precio al público de lo que vende por BITE, más IVA | Puede vender a quien hoy se va por la fila y reparte la carga de la hora pico. No contrata a nadie y paga solo si vende |
| La universidad | Un servicio para sus alumnos operado por alumnos, sin costo para ella | Nada. Si pide una contraprestación, se negocia | Menos aglomeración en el área de comida, menos retardos por ir a comer y un proyecto emprendedor nacido en su aula. Ella fija las reglas: accesos, horarios y alimentos en salones |

Las cuatro promesas que el alumno puede exigir:

1. **Llega antes de tu clase o el envío va por nuestra cuenta.**
2. **Ves el total antes de pagar.** Los precios del menú en la app ya incluyen la tarifa de servicio, y la app lo dice. No hay cargos al final.
3. **La bolsa sale sellada del local.** Si el sello está roto, no la recibas.
4. **Cancelas sin costo** mientras el local no haya empezado a preparar.

## 4.4 Historia

BITE nació en el Taller de Empresa del semestre agosto–noviembre de 2026. El proyecto se llamó primero MOCHI; cambiamos el nombre y el logotipo a BITE porque comunican mejor un servicio de comida. Durante el semestre pasamos de la idea a un producto que se puede usar: definimos los tres usuarios (alumno, local y repartidor), programamos la app con los edificios y salones reales del campus y construimos la base de datos con sus reglas de negocio. El siguiente paso es el piloto de enero de 2027.

## 4.5 ¿Cómo concebimos la idea?

La idea salió de tres situaciones que veíamos cada semana:

- Alumnos con clases seguidas que llegaban tarde, o sin comer, por ir al área de comida.
- Alumnos deportistas que deben comer a horas fijas por su dieta y su entrenamiento, y no siempre alcanzan.
- La fila de la hora pico, que hace que muchos se den la vuelta.

La primera versión de la idea era una copia de las apps de reparto de la ciudad dentro del campus. Al diseñar el producto apareció lo que la hace distinta: en una universidad todos tienen un horario y un salón. Si la app pregunta «¿a qué hora empieza tu clase?» en lugar de «¿cuál es tu dirección?», el reparto se vuelve predecible y barato. Esa pregunta es el origen de BITE.
