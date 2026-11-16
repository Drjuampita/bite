# 8. Productos y servicios

## 8.1 Ficha técnica

!tabla Ficha técnica del servicio
!cols 2,5
| Característica | Especificación |
|---|---|
| Servicio | Entrega de alimentos de los locales del campus en la puerta del salón |
| Usuarios | Alumnos de licenciatura; en el año 2, docentes y personal |
| Cobertura | Edificios A, B, C, IDEA y Business & Innovation Hub; punto fijo en el Polideportivo |
| Días y horario | Lunes a viernes, para clases que empiezan entre las 8:00 y las 17:00. Primera entrega a las 7:45 |
| Ventana de entrega | Los 15 minutos anteriores a la hora de inicio de la clase |
| Anticipación | Hasta las 21:00 del día anterior, o el mismo día con 45 minutos de anticipación |
| Cupo | Cada local fija cuántos pedidos acepta por hora, de 10 a 20; la app muestra «Quedan N» y bloquea la hora llena |
| Locales | Cuatro en el arranque. La app está configurada con Sinforosa, Luka, Diego's House y Carrusel como candidatos; ninguno ha firmado convenio todavía |
| Pago | Tarjeta de débito o crédito dentro de la app |
| Precio | Envío de {{sup_fee|$}} por pedido, o BITE Pass de {{sup_passfee|$}} al mes |
| Acceso | Registro con correo institucional @anahuac.mx |
| Plataforma | App web que se instala en el celular desde el navegador, sin tienda de aplicaciones |
| Confirmación de entrega | Código de cuatro dígitos que solo ve el alumno |
| Garantía | Si llega después de la hora de la clase, se reembolsa el envío; si el alumno ya no puede recibirlo, el pedido completo |
| Dónde se come | Cerca del salón, antes de la clase. Dentro del salón, solo si el reglamento de la universidad lo permite |

!pendiente Confirmar con cada local su nombre comercial, horario, menú, precios y cupo por hora. La app tiene hoy menús y horarios de demostración.

### 8.1.1 Costeo de producto

El producto de BITE es un pedido entregado. Esto es lo que entra y lo que sale por cada uno.

!tabla Economía de un pedido en los tres escenarios
!auto unitario
!fuente Fuente: hoja «Unitario» del modelo financiero. Entre escenarios solo cambia la comisión que acepta el local.

!fig fin_unitario | 16.5 | A dónde va lo que ingresa BITE por un pedido (escenario esperado).

Tres aclaraciones sobre el costeo:

- **El IVA no es ingreso.** El alumno paga {{sup_fee|$}} de envío, pero {{= S.sup_fee - S.u_i_fee_E |$2}} son IVA. Lo mismo ocurre con el sobreprecio.
- **El sobreprecio es la tarifa de servicio.** Los precios del menú en la app son en promedio 8.3% mayores que en mostrador. La app lo dice y muestra el total antes de pagar.
- **El repartidor es el costo mayor.** Se le paga por pedido; así BITE asume el riesgo de un día de pocos pedidos solo hasta la garantía de {{sup_garantia|$}} por bloque.
- **La comisión se calcula sobre el precio al público.** El {{sup_com_E|%}} se aplica a los {{sup_ticket|$}} que paga el alumno por la comida, IVA incluido, y se factura al local más IVA. Equivale a {{= S.sup_com_E*1.16 |%1}} de su venta antes de IVA.

El Pass puede ser ilimitado porque cada pedido de un suscriptor sigue dejando margen por la comisión y el sobreprecio. En el peor escenario ese margen es de {{u_p_margen_P|$2}} por pedido: pequeño, pero positivo. Para el alumno, BITE Pass conviene desde el sexto pedido del mes: seis envíos sueltos cuestan {{= 6*S.sup_fee |$}}, y con ocho pedidos ahorra {{= 8*S.sup_fee-S.sup_passfee |$}}.

### 8.1.2 Diseño de producto

**Diseñador.** El producto lo diseñamos y programamos nosotros. Las figuras siguientes son capturas del producto mínimo viable en funcionamiento, con datos de demostración y la tarifa de envío del plan.

!fig app_alumno_2 | 16.5 | App del alumno: del carrito al seguimiento.

!fig app_operacion | 16.5 | Las otras dos caras del producto: el local y el repartidor.

**Planos.** El plano de un producto digital es su arquitectura: una app web instalable (Next.js), una base de datos con las reglas del negocio (Supabase) y un hospedaje (Vercel). Falta conectar la pasarela de pago.


!tabla Estado del producto al cierre de noviembre de 2026
!cols 3.5,3.5
| Ya funciona | Falta antes del 11 de enero de 2027 |
|---|---|
| App del alumno: catálogo, carrito, pedido agendado y «Ahora», seguimiento, historial | Cobro real con tarjeta y reembolsos |
| Panel del local: pedidos por hora, estados, productos agotados, resumen del día | BITE Pass y su cobro mensual con cancelación inmediata |
| Vista del repartidor: tomar pedidos y cerrar con código | Avisos al celular cuando el pedido cambia de estado |
| Edificios, pisos y salones del campus; horas de clase | Menús, precios y horarios reales de los cuatro locales |
| Reglas de negocio y seguridad por rol, con 29 pruebas automáticas | Publicar la app en internet con la base de datos en producción |
| Prototipo que se puede usar de principio a fin con datos de demostración | Opción «vengo de otra clase», tarifa de envío del plan y reembolso automático de las garantías |

Lo que falta se cubre con la partida «Terminar el producto» de los gastos de arranque. El cobro con tarjeta maneja dinero de terceros y datos de pago; por eso esa parte se encarga a un desarrollador con experiencia, que además revisa la seguridad de lo ya construido.

## 8.2 Servicios

### 8.2.1 Pedido agendado

Es el servicio principal. El alumno elige la hora de su clase y BITE entrega en los 15 minutos anteriores. Se puede pedir hasta las 21:00 del día anterior, o el mismo día con 45 minutos de anticipación. Para BITE es el pedido más barato de entregar, porque permite juntar varios en un viaje y asignar repartidores con un día de adelanto.

### 8.2.2 Pedido «Ahora»

Para quien decide en el momento. El pedido entra a la cocina de inmediato y sale en cuanto está listo, con el repartidor del bloque en curso. Está disponible mientras el local esté abierto y hasta 20 minutos antes de su cierre.

### 8.2.3 BITE Pass

Suscripción de {{sup_passfee|$}} al mes con todos los envíos incluidos. Se cobra cada mes a la tarjeta registrada, la app avisa antes de cada cobro y se cancela desde la propia app en cualquier momento, como exige la Ley Federal de Protección al Consumidor para los cobros recurrentes.

### 8.2.4 Garantía de puntualidad

Si el repartidor llega después de la hora de inicio de la clase, el alumno elige: recibe su pedido con el envío reembolsado, o lo cancela y BITE le reembolsa todo. Suponemos que {{sup_pct_tarde|%}} de los pedidos llega tarde y que uno de cada 200 no se entrega por causa de BITE. Las dos cosas se cargan como costo: {{u_c_punt_E|$2}} por pedido.

### 8.2.5 Panel para locales

Cada local recibe una tableta con su panel: pedidos nuevos, en preparación y agendados por hora; botón para apagar un producto agotado; resumen del día con ventas, ticket promedio y horas pico. Cada semana recibe su pago y su estado de cuenta; el dinero de los locales se guarda en una cuenta separada de la de operación.

### 8.2.6 Servicios en el plan de crecimiento

Publicidad de los locales dentro de la app, pedidos para eventos del campus y saldo recargable. No están en las proyecciones financieras.

# 9. Local

BITE no tiene local. Su mostrador es la app y su piso de operación es el campus. En este capítulo respondemos cada apartado de la guía con lo que sí existe en el negocio.

## 9.1 Proceso de selección de ubicación

Nuestra decisión equivalente a elegir un local fue elegir el campus donde empezar. Elegimos el nuestro por cinco razones: tiene {{sup_alumnos|n}} alumnos de licenciatura; la comida está concentrada en un punto; es un campus cerrado, que se recorre a pie; lo conocemos porque estudiamos ahí, y no hay que rentar nada. La condición es el permiso de la universidad.


## 9.2 Características de la localización

- **Edificios con salones:** A y B, de dos pisos; C, de cuatro; IDEA; y Business & Innovation Hub, de seis.
- **Otros espacios:** Edificio Liderazgo, Polideportivo, Capilla Universitaria y estacionamiento.
- **Área de comida:** planta baja del Edificio Liderazgo.
- **Calendario:** dos semestres de 16 semanas. En 2027, del 11 de enero al 7 de mayo y de agosto a noviembre. Son {{dias_ano|n}} días de clase al año.
- **Nombre de los salones:** edificio, piso y número. El C204 es el salón 4 del piso 2 del edificio C. La app usa esa misma lógica.

## 9.3 Dirección y localización

Universidad Anáhuac Querétaro. Calle Circuito Universidades I, kilómetro 7, Fracción 2, El Marqués, Querétaro, C.P. 76246. Es el domicilio donde se presta el servicio. El domicilio fiscal de la sociedad se define al constituirla.

## 9.4 Planos de ubicación

!fig mapa_operativo | 16 | Esquema de operación en el campus. No está a escala.

El esquema muestra lo que importa para operar: un punto de recolección y cinco destinos. El plano oficial del campus se cita en las referencias. Antes del piloto cronometraremos el recorrido del área de comida a cada edificio para confirmar que una zona se cubre dentro de la ventana de 15 minutos.

## 9.5 Render del lugar

No aplica como imagen de un local. El lugar que el cliente ve es la app: las figuras del apartado 8.1.2 son su aspecto real, y la figura de la página de entrada del apartado 5.2 es su fachada.

### 9.5.1 Plano de distribución de local

BITE no tiene un local que distribuir. Lo único físico es el punto de recolección dentro de cada local: un tramo de barra con cuatro charolas, una por zona, donde se dejan las bolsas selladas.

!fig punto_recoleccion | 15 | Croquis del punto de recolección en la barra de un local. No está a escala.

### 9.5.2 Plano de área operativa

El área operativa son las cuatro zonas del esquema anterior: edificios A y B; edificio C; IDEA, y Business & Innovation Hub, más un punto fijo en el Polideportivo.


En las horas de poca demanda un repartidor cubre dos zonas. En el bloque pico cada zona tiene el suyo.

## 9.6 Presupuesto de obra

Cero pesos. No hay obra ni adecuaciones: la operación usa instalaciones que ya existen.

## 9.7 Presupuesto de mobiliario

BITE no compra mobiliario. Lo más parecido son las cuatro tabletas que se entregan en comodato a los locales, por $7,196, incluidas en el presupuesto de equipo.

## 9.8 Presupuesto de seguro

Un seguro de responsabilidad civil de $6,000 al año, que cubre daños a terceros durante la operación, y el aseguramiento de riesgos de trabajo de los repartidores ante el IMSS, que cuesta {{sup_pct_ss|%}} de su pago. No hay inmueble que asegurar.


# 10. Recursos humanos

## 10.1 Organigrama

!fig organigrama | 16 | Organigrama de BITE.

La sociedad tiene un administrador único, como marca la ley para una S.A.S. Cada una de las cuatro áreas la encabeza un socio; el quinto es el administrador. Mientras el volumen sea inferior a {{sup_umbral_coord|n}} pedidos al día, nos turnamos la guardia de operación. Al pasar ese volumen contratamos a un coordinador de medio tiempo.

### 10.1.1 Aportación de los socios a la empresa

!tabla Aportación de los socios
!cols 3,1.3,1.1,1.6
| Socio | Aportación en efectivo | Participación | Área a su cargo |
|---|---|---|---|
| Silvana Rubio Reyes | {{aporte_socio|$}} | 20% | ==por asignar== |
| Natalia Orozco Estrada | {{aporte_socio|$}} | 20% | ==por asignar== |
| Diego Rodríguez Sáenz | {{aporte_socio|$}} | 20% | ==por asignar== |
| Emmanuel Alexander Quintana Tirado | {{aporte_socio|$}} | 20% | ==por asignar== |
| Juan Pablo Palma Redondo | {{aporte_socio|$}} | 20% | ==por asignar== |
| **Total** | {{capital|$}} | 100% | |

Además del efectivo, aportamos el producto que ya construimos. A precio de mercado, {{sup_mvp_horas|n}} horas de desarrollo a {{sup_mvp_tarifa|$}} la hora valen {{mvp_valor|$}}. No es dinero en caja y no se suma al capital, pero es la razón por la que terminar la app cuesta $35,000 y no varias veces esa cifra.

!pendiente Repartir entre los socios las cuatro áreas y el cargo de administrador único, y confirmar las horas reales invertidas en el producto.

## 10.2 Perfiles de empleados

!tabla Perfiles de puesto
!cols 1.5,2.6,2.2,1.5
!tam 16
| Puesto | Funciones | Perfil | Pago |
|---|---|---|---|
| Administrador único | Representa a la sociedad, firma convenios, coordina a las áreas | Socio | Sin sueldo los primeros tres años |
| Responsable de área (cuatro) | Tecnología, operaciones, comercial o administración | Socio | Sin sueldo los primeros tres años |
| Coordinador de operación | Asigna repartidores, vigila los bloques, atiende incidencias, hace el corte diario | Alumno de semestres avanzados o egresado reciente; ordenado, con buen trato; medio tiempo | {{sup_coord|$}} al mes de costo total, en meses con clases |
| Repartidor | Recoge, traslada y entrega pedidos en sus bloques; confirma con código | Alumno inscrito, mayor de edad, puntual, con bloques libres entre clases | {{sup_pago|$}} por pedido; mínimo de {{sup_garantia|$}} por bloque |
| Contador externo | Contabilidad, declaraciones, retenciones | Despacho con experiencia en plataformas | $3,500 al mes |

## 10.3 Proceso de reclutamiento

!fig flujo_reclutamiento | 12.5 | Reclutamiento de repartidores.

Se recluta al inicio de cada semestre, cuando los alumnos ya conocen su horario. El padrón es de {{sup_padron|n}} repartidores para tener siempre cubierto el bloque pico. La ley prohíbe contratar a menores de edad en plataformas, así que el primer filtro es la edad.

## 10.4 Capacitación de empleados

El repartidor recibe tres horas antes de su primer bloque (uso de la app, higiene y traslado de alimentos, trato y emergencias) y hace dos bloques acompañado. El personal de cada local recibe 45 minutos sobre su panel, y el coordinador, cuatro horas sobre corte, conciliación e incidencias.

La capacitación se registra con fecha y firma. Es evidencia para la norma de riesgos psicosociales (NOM-035, apartado 12.3) y para la universidad.

## 10.5 Contrato laboral

**Repartidores.** Se rigen por el capítulo de trabajo en plataformas digitales de la Ley Federal del Trabajo (artículos 291-A y siguientes), vigente desde junio de 2025. La ley exige un contrato escrito cuyo modelo se registra ante el Centro Federal de Conciliación y Registro Laboral. El contrato de BITE incluye:

- Datos de las partes y descripción del servicio: reparto a pie dentro del campus, por bloques que el repartidor elige.
- Forma de pago: {{sup_pago|$}} por pedido entregado, con mínimo de {{sup_garantia|$}} por bloque asignado; pago y recibo semanales.
- Reglas con las que la app asigna los pedidos y cómo se evalúa el servicio.
- Equipo que BITE entrega en resguardo.
- Seguridad social: aseguramiento de riesgos de trabajo en todos los casos, e inscripción completa al Instituto Mexicano del Seguro Social (IMSS) en el mes en que el ingreso neto alcance un salario mínimo mensual.
- Canal de quejas y causas de terminación.

**Coordinador de operación.** Contrato individual por temporada, que cubre los meses con clases, con inscripción al IMSS desde el primer día.

**Socios.** Su relación con la empresa es societaria, no laboral, mientras no cobren sueldo.

Los tres modelos de contrato los redacta un abogado laboral; su costo está en la partida de asesoría legal de los gastos de arranque. El mismo abogado confirma por escrito el encuadre de los repartidores antes de reclutar.

## 10.6 Documentación necesaria

Para repartidores y coordinador:

- Identificación oficial vigente, que acredite mayoría de edad.
- Credencial de alumno o constancia de inscripción del semestre.
- CURP, constancia de situación fiscal con RFC y número de seguridad social.
- Comprobante de domicilio.
- Cuenta bancaria a su nombre para el pago semanal.
- Horario de clases del semestre.
- Contrato, resguardo de equipo, aviso de privacidad y constancia de capacitación firmados.

## 10.7 Reglamento interno de trabajo

1. La hora de la clase manda: un pedido se entrega dentro de su ventana o se reporta de inmediato.
2. Todo movimiento se registra en la app. Lo que no está en la app no ocurrió.
3. Nadie de BITE recibe efectivo de un alumno ni de un local.
4. Los datos de alumnos y locales se usan solo para entregar el pedido.
5. Trato respetuoso con alumnos, docentes, personal de los locales y de la universidad. Cero tolerancia al acoso y a la violencia.
6. Las incidencias se reportan el mismo día y se resuelven antes de buscar responsables.
7. El equipo en resguardo se devuelve limpio y completo.
8. Las faltas a un bloque confirmado se avisan con al menos dos horas de anticipación. Tres faltas sin aviso en un mes causan baja del padrón.
9. Se cumplen las reglas del campus: accesos, circulación y horarios.
10. Las quejas del personal se presentan por el canal del contrato y se responden en cinco días hábiles.

## 10.8 Reglamento de áreas específicas

**Reglamento de reparto.**

1. Uniforme y gafete visibles durante todo el bloque.
2. Lavarse las manos antes de recoger.
3. Recibir del local solo bolsas selladas y con etiqueta. Una bolsa abierta no sale.
4. Separar alimentos calientes y fríos dentro de la mochila.
5. Caminar; no correr ni usar patineta o bicicleta dentro de los edificios.
6. Entregar en la puerta del salón. Nunca entrar a un salón ni interrumpir una clase que ya empezó.
7. Pedir el código antes de soltar la bolsa. Sin código no hay entrega.
8. Si el alumno no está en la primera pasada, volver en los últimos cinco minutos de la ventana. Si tampoco está a la hora de inicio de la clase, avisar por la app; el pedido regresa al local, donde el alumno puede recogerlo.
9. No abrir, probar ni cambiar ningún pedido.
10. Ante un accidente, primero la persona: avisar al servicio médico del campus y a Operaciones.
