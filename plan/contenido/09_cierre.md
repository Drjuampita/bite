# 14. Conclusiones

1. **El problema es real y el producto lo resuelve de una forma que nadie más ofrece.** Cuando el receso es corto, la fila se lo lleva. BITE quita la fila del camino: la comida llega a la puerta del salón antes de la clase.
2. **La idea que hace viable el negocio es el horario.** Agendar por hora de clase permite juntar pedidos, asignar repartidores con un día de anticipación y que el local cocine antes del pico. Sin eso, un envío de {{sup_fee|$}} dentro del campus no dejaría margen.
3. **Cada pedido deja {{u_margen_E|$2}} y el punto de equilibrio es alcanzable.** Con {{e_be_oday_E|n}} pedidos por día de clase, {{e_be_adop_E|%1}} de los alumnos, se pagan los gastos fijos de todo el año mientras operamos nosotros. Con un coordinador pagado hacen falta {{e_be2_oday_E|n}} pedidos, {{e_be2_adop_E|%1}}.
4. **Un campus es un negocio pequeño.** En el escenario esperado deja {{E_neta_2|$}} en el año 2 y {{E_neta_3|$}} en el año 3, sin pagar nuestro trabajo. El valor está en repetirlo: con diez campus al año 5, la utilidad neta llega a {{x_neta_5|$}} después de pagar dos sueldos de tiempo completo.
5. **El riesgo está medido.** Fijamos el capital en {{capital|$}} para que la caja conserve un colchón aun en el escenario pesimista. En ese escenario no recuperamos nuestro dinero en tres años, y el plan dice en qué mes se sabrá y qué se hace entonces.
6. **Todo depende de un número que todavía no se ha medido: la adopción.** Necesitamos {{e_be2_adop_E|%1}} para sostenernos con un coordinador pagado y suponemos {{sup_adop1_E|%}} en el primer año. La encuesta y el piloto existen para medirlo antes de gastar.
7. **Hay dos condiciones que no dependen de nosotros:** el permiso de la universidad, con sus reglas, y que los locales acepten la comisión. Ambas dependen de una negociación y van antes que cualquier gasto.

# 15. Recomendaciones

Nos recomendamos este orden: cada paso es barato y decide si damos el siguiente.

!tabla Ruta de arranque
!cols 0.4,3.2,1.5,2
| # | Acción | Cuándo | Qué decide |
|---|---|---|---|
| 1 | Presentar el proyecto a la universidad y pedir por escrito su autorización para el piloto y sus reglas: accesos, alimentos en salones y uso del correo institucional | Noviembre de 2026 | Si hay negocio en este campus y con qué oferta |
| 2 | Levantar la encuesta de 300 respuestas y capturarla en el modelo | Noviembre de 2026 | Si la adopción respalda el plan, con la regla del apartado 6.2.1 |
| 3 | Medir filas y recorridos tres días con el protocolo del Anexo C | Noviembre de 2026 | El argumento de venta, con minutos reales, y cuántos pedidos puede entregar un repartidor por bloque |
| 4 | Firmar convenio con los cuatro locales; cargar menús y precios reales | Diciembre de 2026 | La comisión del escenario y el ticket promedio |
| 5 | Constituir la S.A.S., abrir cuenta y contratar la pasarela de pago | Diciembre de 2026 | Nada: es requisito para cobrar |
| 6 | Terminar el producto: cobro, Pass y avisos | Diciembre de 2026 | Solo se ejerce si los pasos 1 y 2 salieron bien |
| 7 | Reclutar y capacitar a ocho repartidores | Primera semana de enero | La cobertura de los bloques del piloto |
| 8 | Piloto de dos semanas con 50 alumnos y tres bloques | 11 al 22 de enero de 2027 | Pedidos por repartidor, puntualidad y recompra |
| 9 | Apertura a todo el campus | 25 de enero de 2027 | El ritmo de arranque frente al modelo |
| 10 | Punto de decisión con los usuarios activos de abril | Abril de 2027 | Seguir, ajustar o detener, con la regla del apartado 11.2 |

**Si el calendario no alcanza.** Faltan ocho semanas para el 11 de enero y el permiso, los convenios y el cobro con tarjeta están por resolverse. Si alguno no está listo, el piloto se hace en febrero con lo que haya y la apertura general se recorre al semestre de agosto de 2027. El modelo se desplaza completo siete meses y sus conclusiones no cambian; lo que cambia es que el primer año calendario tendría un solo semestre de ventas.

Recomendaciones de fondo:

- **Medir cada semana cuatro números:** usuarios activos, pedidos por día, entregas a tiempo y pedidos por repartidor en cada bloque. Son los que el modelo supone.
- **Probar el precio durante el piloto.** La mitad de los alumnos ve el sobreprecio dentro del menú y la otra mitad lo ve como tarifa de servicio aparte. Se conserva la presentación que retenga a más alumnos.
- **Contratar asesoría laboral antes de reclutar.** El capítulo de plataformas digitales es reciente y sus reglas ante el IMSS todavía están cambiando. Hace falta un dictamen escrito sobre el encuadre de los repartidores.
- **Medir en el piloto lo que el local quiere saber:** cuánta de la venta por BITE es nueva. Se comparan sus ventas totales antes y durante el piloto. Si el local lo pide, el primer mes va sin comisión.
- **No abrir un segundo campus antes de un año completo de cifras.** El plan de expansión supone que la curva del primer campus se repite; primero hay que conocerla.
- **Escribir el manual de operación desde el primer día.** Es el activo que después se vende como franquicia.
- **Acordar hoy qué pasa cuando nos graduemos.** El convenio entre accionistas debe decir quién sigue, quién vende y a qué precio.

# 16. Anexos

## Anexo A. Matriz de riesgos

!tabla Riesgos principales y cómo se atienden
!cols 2,0.9,0.9,3.6
!tam 16
| Riesgo | Probabilidad | Impacto | Respuesta |
|---|---|---|---|
| La universidad no autoriza la operación | Media | Total | Es el paso 1. Se propone un piloto acotado, con reglas de la universidad y un responsable de enlace. Sin permiso no se gasta |
| No se permite comer en los salones | Media | Medio | La entrega 15 minutos antes de la clase ya está pensada para comer fuera del salón. Quien no tiene receso queda fuera del mercado; el modelo no depende de ese grupo |
| La universidad pide una contraprestación | Media | Medio | Medida en la sensibilidad: una cuota de 3% de la venta reduce la utilidad anual en {{= -S.sens_d_17 |$}} |
| Los locales no aceptan 20% de comisión | Media | Alto | El escenario pesimista ya supone 15%. Se ofrece el primer mes sin comisión a cambio de un semestre de convenio |
| La adopción se queda por debajo de {{e_be_adop_E|%1}} | Media | Alto | Encuesta antes de gastar; piloto antes de abrir; punto de decisión en abril |
| Faltan repartidores en horas pico | Media | Medio | Padrón de ocho para cubrir cuatro a la vez; garantía de pago por bloque; reclutamiento cada semestre |
| Entregas tardías en las primeras semanas | Alta | Medio | Empezar con tres bloques; cupo por local; garantía de puntualidad que reembolsa el envío |
| Falla de la app en hora pico | Baja | Alto | Plan de contingencia del apartado 7.1.6; monitoreo; cobro de prueba cada mañana |
| Un alumno se enferma y culpa al pedido | Baja | Alto | La comida la prepara el local con sus permisos; bolsa sellada; seguro de responsabilidad civil; bitácora de cada entrega |
| El IMSS exige seguridad social completa para todos los repartidores | Media | Medio | Medido en la sensibilidad: reduce la utilidad anual en {{= -S.sens_d_13 |$}} |
| Un local organiza sus propios pedidos anticipados | Media | Medio | BITE ofrece lo que un local solo no puede: reparto a todos los edificios y un solo lugar para pedir a todos |
| Tres meses al año sin ingresos | Segura | Medio | Ya está en el modelo: la publicidad y el coordinador solo se pagan en meses con clases y la reserva cubre los fijos |
| Nos graduamos y el equipo se dispersa | Alta | Alto | Coordinador de operación desde el año 1; convenio entre accionistas; manual de operación |

## Anexo B. Guía de entrevista

Diez entrevistas de 15 minutos a alumnos con clases seguidas. Las respuestas se agrupan por tema.

1. Cuéntame cómo es un día tuyo con clases seguidas. ¿En qué momento comes?
2. Acuérdate de la última vez que compraste comida en el campus con prisa. ¿Qué pasó?
3. ¿Qué haces cuando no alcanzas a comer?
4. ¿Has pedido por una app de reparto estando en el campus? ¿Cómo te fue?
5. Si la comida llegara a tu salón antes de tu clase, ¿qué tendría que pasar para que confiaras en que llega a tiempo?
6. ¿Cuánto sería caro y cuánto sería barato por ese servicio? ¿Por qué?
7. ¿Qué te haría dejar de usarlo después de la primera vez?
8. ¿A quién le contarías y cómo se lo explicarías?

## Anexo C. Protocolo para medir filas

**Objetivo.** Saber cuántos minutos cuesta comprar comida en hora pico, del salón al salón.

- **Cuándo:** martes, miércoles y jueves de una misma semana, en los recesos de las 9:00, 11:00 y 13:00.
- **Dónde:** cada uno de los cuatro locales.
- **Cómo:** dos personas por local. Una cuenta cada cinco minutos cuántas personas hay en la fila y cuántas se salen sin comprar. La otra cronometra a diez clientes por receso: desde que se forman hasta que reciben su comida.
- **Además:** cronometrar tres veces el recorrido a pie del área de comida al salón más lejano de cada edificio.
- **Registro:** hoja con local, día, hora, personas en la fila, minutos de espera y minutos de recorrido.
- **Resultado:** minutos promedio y máximo por local y por hora, y personas que dejan la fila. El primer número va al mensaje de lanzamiento y al cálculo de las zonas; el segundo es el argumento para el local: ventas que hoy pierde.

## Anexo D. Supuestos del modelo financiero

!tabla Supuestos generales, con su tipo y su fuente
!auto supuestos

!tabla Supuestos que cambian entre escenarios
!auto supuestos_esc

## Anexo E. Puntos principales del convenio con los locales

1. **Objeto.** El local vende sus productos por medio de BITE; BITE cobra, entrega y le paga.
2. **Comisión.** {{sup_com_E|%}} sobre el precio al público de lo vendido, más IVA, descontada del pago semanal. El IVA de la comisión es acreditable para el local.
3. **Precios.** El local fija su precio de mostrador. El precio en la app incluye la tarifa de servicio de BITE.
4. **Cupo y horario.** El local define cuántos pedidos acepta por hora y puede cambiarlo con un día de aviso.
5. **Preparación.** El pedido sale completo, sellado y etiquetado 15 minutos antes de la ventana de entrega.
6. **Pago.** Cada lunes, por transferencia, con estado de cuenta de la semana anterior. El dinero de los locales se guarda en una cuenta separada de la de operación de BITE.
7. **Incidencias.** Un pedido incompleto o mal preparado se repone o se descuenta al local; uno entregado tarde por el repartidor lo absorbe BITE.
8. **Equipo y espacio.** La tableta se entrega en comodato y se devuelve al terminar el convenio. El local aparta un tramo de barra para las bolsas listas; uno de los locales presta además el espacio para el gabinete de las mochilas.
9. **Vigencia.** Un semestre, renovable. Sin exclusividad para ninguna de las partes.
10. **Datos.** El local recibe sus ventas y horarios pico; los datos personales de los alumnos los resguarda BITE.

# 17. Referencias bibliográficas

!ref Asociación Mexicana de Agencias de Inteligencia de Mercado y Opinión. (2024). *Nota metodológica: nivel socioeconómico AMAI 2024*. https://amai.org/descargas/NOTA_METODOLOGICA_NSE_AMAI_2024_v6.pdf
!ref Asociación Mexicana de Venta Online. (2026). *Estudio de venta online 2026* [versión para prensa]. https://images.produ.com/wp-content/uploads/2026/03/12132700/AMVO_Estudio-de-Venta-Online-2026-Prensa-1_compressed.pdf
!ref Banco de México. (2026). *Tipo de cambio FIX* [consultado el 15 de noviembre de 2026]. https://www.banxico.org.mx/tipcamb/tipCamMIAction.do
!ref Canham-Clyne, A. (2026, 15 de septiembre). DoorDash buys Grubhub campus unit for $300M. *Restaurant Dive*. https://www.restaurantdive.com/news/doordash-wonder-grubhub-college-campus-division-acquisition/830396/
!ref CETYS Universidad. (2019, 3 de octubre). *Estudiante de CETYS crea App para pedir comida y reducir tiempo de espera*. https://www.cetys.mx/noticias/estudiante-de-cetys-crea-app-para-pedir-comida-y-reducir-tiempo-de-espera/
!ref Comisión Nacional de los Salarios Mínimos. (2025). *Tabla de salarios mínimos 2026*. https://www.gob.mx/cms/uploads/attachment/file/1041076/Tabla_de_Salarios_M_nimos_2026.pdf
!ref IDC Online. (2026, 6 de enero). *Seguro de responsabilidad civil: tres consejos para elegir el mejor para tu empresa*. https://idconline.mx/finanzas/2026/01/06/seguro-de-responsabilidad-civil-tres-consejos-para-elegir-el-mejor-para-tu-empresa
!ref Instituto Mexicano de la Propiedad Industrial. (2024). *Acuerdo por el que se da a conocer la tarifa por los servicios que presta el Instituto*. https://www.gob.mx/cms/uploads/attachment/file/959396/1._Acuerdo.Tarifa_15.03.24.pdf
!ref Instituto Mexicano del Seguro Social. (2025, 24 de junio). [Reglas de carácter general para la incorporación de las personas trabajadoras de plataformas digitales al régimen obligatorio]. *Diario Oficial de la Federación*. https://sidof.segob.gob.mx/notas/docFuente/5760936
!ref Instituto Nacional de Estadística y Geografía. (2026). *Encuesta Nacional sobre Disponibilidad y Uso de Tecnologías de la Información en los Hogares 2025* [comunicado de prensa]. https://www.inegi.org.mx/contenidos/saladeprensa/boletines/2026/endutih/ENDUTIH_25_RR.pdf
!ref Instituto Nacional de Estadística y Geografía y Comisión Nacional Bancaria y de Valores. (2025). *Encuesta Nacional de Inclusión Financiera 2024* [comunicado de prensa]. https://www.inegi.org.mx/contenidos/saladeprensa/boletines/2025/enif/ENIF2024_CP.pdf
!ref Ley del Impuesto al Valor Agregado. (2026). Cámara de Diputados. https://www.diputados.gob.mx/LeyesBiblio/pdf/LIVA.pdf
!ref Ley del Impuesto sobre la Renta. (2026). Cámara de Diputados. https://www.diputados.gob.mx/LeyesBiblio/pdf/LISR.pdf
!ref Ley del Seguro Social. (2026). Cámara de Diputados. https://www.diputados.gob.mx/LeyesBiblio/pdf/LSS.pdf
!ref Ley Federal de Protección a la Propiedad Industrial. (2026). Cámara de Diputados. https://www.diputados.gob.mx/LeyesBiblio/pdf/LFPPI.pdf
!ref Ley Federal de Protección al Consumidor. (2026). Cámara de Diputados. https://www.diputados.gob.mx/LeyesBiblio/pdf/LFPC.pdf
!ref Ley Federal de Protección de Datos Personales en Posesión de los Particulares. (2025). Cámara de Diputados. https://www.diputados.gob.mx/LeyesBiblio/pdf/LFPDPPP.pdf
!ref Ley Federal del Trabajo. (2026). Cámara de Diputados. https://www.diputados.gob.mx/LeyesBiblio/pdf/LFT.pdf
!ref Ley General de Sociedades Mercantiles. (2026). Cámara de Diputados. https://www.diputados.gob.mx/LeyesBiblio/pdf/LGSM.pdf
!ref Martínez-Hernández, V. R., Sandoval-Copado, J. R., y Aranzana Juarros, M. (2021). Acceso a los alimentos y hábitos alimentarios de jóvenes universitarios, Estado de México. *Revista Salud Pública y Nutrición, 20*(3). https://doi.org/10.29105/respyn20.3-5
!ref Municipio de El Marqués. (s. f.). *Licencia de funcionamiento de bajo impacto*. https://elmarques.gob.mx/LicFunBajoImpacto/
!ref Praxium Consultores. (2026a). *Constituir empresa en Querétaro: costo y notario*. https://praxiumconsultores.com/blog/constituir-empresa-en-queretaro-costo-notario
!ref Praxium Consultores. (2026b). *Cuánto cobra un contador a una persona moral*. https://praxiumconsultores.com/blog/cuanto-cobra-contador-persona-moral
!ref Ramírez, S. (2026, 5 de octubre). Pedir comida por app tiene un costo oculto: estas son las cuotas que pueden encarecer tu pedido según Profeco. *Expansión*. https://expansion.mx/tecnologia/2026/10/05/pedir-comida-app-cuotas-servicio-profeco
!ref Reglamento de la Ley Federal de Protección a la Propiedad Industrial. (2026). Cámara de Diputados. https://www.diputados.gob.mx/LeyesBiblio/regley/Reg_LFPPI.pdf
!ref Sámano, R., Gutiérrez-Nájera, J., Martínez-Rojano, H., Chico-Barba, G., García-Villegas, E. A., Merino-Zeferino, B., González-Medina, E., y Flores-Herrera, H. (2024). Calidad y práctica del desayuno antes y durante el período de exámenes en universitarios de nutrición. *Archivos Latinoamericanos de Nutrición, 74*(3), 176–187. https://doi.org/10.37527/2024.74.3.003
!ref Secretaría de Economía. (2009, 30 de junio). Acuerdo por el que se establece la estratificación de las micro, pequeñas y medianas empresas. *Diario Oficial de la Federación*.
!ref Secretaría de Economía. (s. f.). *Manual de usuario: Sociedad por Acciones Simplificada*. https://www.gob.mx/cms/uploads/attachment/file/849955/Manual_de_usuario_SAS_Ciudadanos.pdf
!ref Secretaría de Salud. (2010). Norma Oficial Mexicana NOM-251-SSA1-2009, Prácticas de higiene para el proceso de alimentos, bebidas o suplementos alimenticios. *Diario Oficial de la Federación*. https://sidof.segob.gob.mx/notas/docFuente/5133449
!ref Secretaría del Trabajo y Previsión Social. (2018). Norma Oficial Mexicana NOM-035-STPS-2018, Factores de riesgo psicosocial en el trabajo: identificación, análisis y prevención. *Diario Oficial de la Federación*.
!ref Secretaría del Trabajo y Previsión Social. (2025, 26 de diciembre). [Acuerdo con los factores de exclusión para calcular el ingreso neto de las personas trabajadoras de plataformas digitales en 2026]. *Diario Oficial de la Federación*. https://sidof.segob.gob.mx/notas/docFuente/5777156
!ref Stripe. (2026). *Precios y comisiones*. https://stripe.com/mx/pricing
!ref Supabase. (2026). *Pricing*. https://supabase.com/pricing
!ref Uber Eats. (2026). *Precios para restaurantes*. https://merchants.ubereats.com/mx/es/pricing/
!ref Universidad Anáhuac Querétaro. (2025). *Informe 2024*. https://www.anahuac.mx/queretaro/descargables/informe/2024.pdf
!ref Universidad Anáhuac Querétaro. (2026a). *Calendario escolar 2026B*. https://www.anahuac.mx/queretaro/descargables/calendario/2026B.pdf
!ref Universidad Anáhuac Querétaro. (2026b). *Calendario escolar 2027A*. https://www.anahuac.mx/queretaro/descargables/calendario/2027A.pdf
!ref Universidad Anáhuac Querétaro. (2026c). *Mapa del campus*. https://www.anahuac.mx/queretaro/descargables/mapa-campus.pdf
!ref Vercel. (2026). *Pricing*. https://vercel.com/pricing

### Cotizaciones consultadas el 15 de noviembre de 2026

!cols 1.6,2.4,4
!tam 14
| Proveedor | Producto | Dirección |
|---|---|---|
| Sears | Mochila térmica de 51 litros | sears.com.mx/producto/3323344 |
| Elektra | Mochila térmica multifuncional | elektra.mx/mochila-termica-multifuncional-delivery-color-negro-1301854622/p |
| Zetterpak | Mochila térmica F-75 | zetterpak.com/mochila-termica-f75 |
| Lazzar | Playera polo, gorra y chaleco bordados | lazzarmexico.com/producto/polo-sport-viscosa |
| El 78 Centro Impresor | Playera, gorra y etiquetas | el78.mx/products |
| Empaquetron | Playera y gorra bordadas | empaquetron.com/p/polo-bordada-con-logo |
| Office Depot | Tableta TCL Tab 10L | officedepot.com.mx |
| Cyberpuerta | Tabletas Start Up y Lenovo | cyberpuerta.mx/Computadoras/Tablets |
| Pop México | Sellos, hojas membretadas y carteles | popmexico.com.mx/products |
| Pixz | Etiquetas, tarjetas y pósters | pixz.com.mx/product_prices.html |
| 360imprimir | Hojas membretadas y tarjetas | 360imprimir.com.mx |
| Sinergia Publicitaria | Tarjetas y tabloides | sinergiapublicitaria.com |
| Conekta | Tarifas de cobro con tarjeta | conekta.com/pricing |
| Mercado Pago | Tarifas de Checkout | mercadopago.com.mx/herramientas-para-vender/check-out |
| Akky | Dominio .mx | akky.mx/servicios/dominios |
| HostGator México | Dominio .mx | hostgator.mx/dominios |
| Hostinger | Dominio .mx | hostinger.com/mx/tld/dominio-mx |
| Google Workspace | Correo Business Starter | workspace.google.com/intl/es-419_mx/business |
| Facturama | Timbrado de facturas | facturama.mx/planes-facturacion |

# 18. Presentación Canvas

El lienzo resume el modelo de negocio en una página y es la base de la presentación en diapositivas.

!fig canvas | 16.5 | Lienzo del modelo de negocio de BITE.
