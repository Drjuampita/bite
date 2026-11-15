"""Datos de entrada del modelo financiero de BITE.

Cada dato lleva su tipo:
  Dato            = sale de una fuente que se puede consultar.
  Decisión        = lo fija el equipo (precios, políticas).
  Supuesto        = estimación razonada.
  Supuesto clave  = estimación de la que depende el resultado; la encuesta y el piloto deben confirmarla.
"""

ANO_INICIO = 2027

# (clave, concepto, unidad, valor, formato, tipo, fuente o razonamiento)
GENERALES = [
    ("Mercado", [
        ("alumnos", "Alumnos de licenciatura en el campus", "alumnos", 7478, "n", "Dato",
         "Informe Anual 2024 de la Universidad Anáhuac Querétaro: 7,478 alumnos de licenciatura (8,222 con posgrado y educación continua). No se cuentan docentes ni personal."),
        ("dias_tipo", "Días de clase de un mes completo", "días", 20, "n", "Supuesto",
         "Convención de cálculo: los pedidos al mes se expresan para un mes de 20 días de clase y se ajustan a los días reales de cada mes."),
        ("meta_encuestas", "Encuestas que pide la guía", "respuestas", 300, "n", "Dato", "Guía del Proyecto Integrador, apartado 6.2.1."),
        ("conv_def", "De quienes dicen «definitivamente sí», cuántos lo usan de verdad", "%", 0.30, "%", "Supuesto",
         "Descuento conservador a la intención declarada: las pruebas de concepto sobrestiman la compra real."),
        ("conv_prob", "De quienes dicen «probablemente sí», cuántos lo usan de verdad", "%", 0.10, "%", "Supuesto", "Mismo criterio."),
    ]),
    ("Precios al alumno (IVA incluido)", [
        ("iva", "IVA", "%", 0.16, "%", "Dato", "Ley del IVA, artículo 1."),
        ("ticket", "Comida por pedido, a precio de mostrador", "$", 120, "$", "Supuesto clave",
         "Estimación del equipo: un platillo y una bebida. La pregunta 10 de la encuesta lo confirma."),
        ("markup", "Sobreprecio en el menú de la app", "$", 10, "$", "Decisión",
         "8.3% sobre el precio de mostrador. Las apps generales cobran una tarifa de servicio de 7% a 9% además del envío (Profeco, octubre de 2026)."),
        ("fee", "Envío al salón", "$", 19, "$", "Decisión",
         "Uber Eats cobró $28 de envío más $15.75 de servicio en el comparativo de Profeco (octubre de 2026). La pregunta 11 de la encuesta lo confirma."),
        ("passfee", "BITE Pass, cuota mensual", "$", 99, "$", "Decisión",
         "Se paga solo desde el sexto pedido del mes. Rappi Pro cuesta $109 al mes."),
    ]),
    ("Costo de cada pedido", [
        ("pago", "Pago al repartidor por pedido entregado", "$", 15, "$", "Decisión", "Pago por pedido, con garantía mínima por bloque asignado."),
        ("garantia", "Garantía mínima por bloque asignado", "$", 30, "$", "Decisión",
         "Si en un bloque el repartidor entrega menos de dos pedidos, BITE completa hasta este monto."),
        ("min_bloque", "Duración de un bloque de reparto", "minutos", 30, "n", "Decisión", "Recoger en el local 15 minutos antes y entregar en la ventana de 15 minutos previa a la clase."),
        ("bloques", "Bloques de entrega por día", "bloques", 10, "n", "Decisión", "Clases de 8:00 a 17:00, una ventana de entrega antes de cada hora."),
        ("pct_ss", "Seguridad social del repartidor, sobre su pago", "%", 0.05, "%", "Supuesto",
         "Prima de riesgo de trabajo Clase IV (4.65325%, Ley del Seguro Social art. 73), la que las Reglas del IMSS asignan a plataformas, redondeada a 5%. Aplica mientras el repartidor gane menos de un salario mínimo mensual neto (LFT art. 291-C)."),
        ("pas_pct", "Pasarela de pago, porcentaje", "%", 0.036, "%", "Dato",
         "Tarifa pública de Stripe México para tarjetas nacionales: 3.6% + $3.00 más IVA (stripe.com/mx/pricing, 15-nov-2026). El IVA es acreditable."),
        ("pas_fijo", "Pasarela de pago, cuota fija por cobro", "$", 3, "$2", "Dato", "Misma fuente. Conekta cobra 3.4% + $3.00 y Mercado Pago 3.49% + $4.00."),
        ("pct_tarde", "Pedidos que llegan tarde y reciben su envío de vuelta", "%", 0.03, "%", "Supuesto",
         "Garantía de puntualidad: si el pedido llega después de la hora de clase, BITE devuelve el envío. Meta de operación: 97% de entregas a tiempo."),
        ("sello", "Sello de seguridad y etiqueta de salón", "$", 2, "$2", "Supuesto",
         "Sello de seguridad impreso: $1.22 por pieza en millar (Pop México, 15-nov-2026), más la etiqueta con número de pedido y salón."),
    ]),
    ("Operación", [
        ("cap_viaje", "Pedidos que un repartidor entrega en un bloque", "pedidos", 8, "n", "Supuesto clave",
         "Mochila térmica de 40 a 50 litros y entregas agrupadas por edificio. El piloto lo confirma."),
        ("pico", "Parte de los pedidos del día que cae en el bloque más cargado", "%", 0.20, "%", "Supuesto", "El doble de un reparto parejo entre los 10 bloques."),
        ("cupo_locales", "Cupo total de los locales por bloque", "pedidos", 57, "n", "Dato",
         "Suma de los cupos por hora configurados en la app para los cuatro locales (15 + 20 + 12 + 10)."),
        ("padron", "Repartidores inscritos en el padrón", "personas", 8, "n", "Decisión", "Se reclutan 8 para tener siempre cubiertos los bloques pico."),
        ("umbral_coord", "Pedidos diarios a partir de los cuales se contrata coordinador", "pedidos/día", 60, "n", "Decisión",
         "Hasta ese volumen los socios se turnan la coordinación."),
        ("coord", "Coordinador de operación, costo mensual", "$", 8500, "$", "Supuesto",
         "Medio tiempo: 4 horas diarias a $80 la hora, 20 días, más 30% de cargas sociales. Contrato por temporada, solo en meses con clases."),
    ]),
    ("Laboral y fiscal", [
        ("sm_diario", "Salario mínimo general diario", "$", 315.04, "$2", "Dato", "CONASAMI, Tabla de Salarios Mínimos 2026 (zona general, que incluye Querétaro)."),
        ("sm_mensual", "Salario mínimo de un mes de 30 días", "$", "={sm_diario}*30", "$", "Dato",
         "Umbral del artículo 291-C de la Ley Federal del Trabajo: quien gana menos que esto, neto, es trabajador independiente de plataforma ese mes."),
        ("excl_pie", "Factor de exclusión del ingreso para quien reparte a pie", "%", 0.03, "%", "Dato",
         "Acuerdo de la STPS, DOF 26-dic-2025, disposición quinta: 3% para transporte no motorizado o sin medio de transporte."),
        ("isr", "ISR de personas morales", "%", 0.30, "%", "Dato", "Ley del ISR, artículo 9."),
        ("fx", "Tipo de cambio", "pesos por dólar", 18.5525, "$2", "Dato", "Tipo de cambio FIX del Banco de México del 13-nov-2026."),
    ]),
    ("Capital", [
        ("socios", "Socios", "personas", 5, "n", "Dato", "Los cinco integrantes del equipo, en partes iguales."),
        ("aporte", "Aportación en efectivo de cada socio", "$", 30000, "$", "Decisión",
         "Se fija para que la caja no quede en negativo ni en el escenario pesimista (ver hoja Pruebas)."),
        ("mvp_horas", "Horas invertidas en el MVP", "horas", 250, "n", "Supuesto", "Estimación del equipo: app del alumno, panel del local, vista del repartidor y base de datos probada."),
        ("mvp_tarifa", "Valor de mercado de una hora de desarrollo", "$", 350, "$", "Supuesto", "Tarifa de un desarrollador independiente de nivel medio en México."),
    ]),
    ("Franquicia de campus", [
        ("fq_cuota", "Cuota inicial de franquicia", "$", 60000, "$", "Decisión", "Se fija para que el franquiciatario recupere su inversión en menos de dos años."),
        ("fq_regalia", "Regalía sobre los ingresos de la unidad", "%", 0.10, "%", "Decisión", "Incluye el uso de la plataforma, la marca y el soporte."),
        ("fq_fondo", "Fondo de publicidad de la red", "%", 0.02, "%", "Decisión", "Sobre los ingresos de la unidad."),
        ("fq_tamano", "Tamaño del campus franquiciado frente a Anáhuac Querétaro", "veces", 1.0, "n2", "Supuesto", "Campus tipo de unos 7,500 alumnos de licenciatura."),
        ("fq_fijos", "Gastos fijos locales del franquiciatario, promedio al mes", "$", 6900, "$", "Supuesto",
         "Contador $3,500, seguro $500 y varios $1,000 los 12 meses, más publicidad local de $2,500 en los 9 meses con clases. La plataforma y el dominio los paga BITE."),
        ("fq_soporte", "Costo anual de dar soporte a una unidad", "$", 18000, "$", "Supuesto", "Infraestructura adicional, capacitación y visitas."),
        ("fq_equipo", "Equipo de reparto, tabletas e identidad", "$", 21000, "$", "Supuesto", "Mismas partidas y cotizaciones que el campus propio (hoja Inversion)."),
        ("fq_lanzamiento", "Publicidad de lanzamiento", "$", 15000, "$", "Supuesto", "Igual que el campus propio."),
        ("fq_capital_trabajo", "Capital de trabajo", "$", 20000, "$", "Supuesto", "Tres meses de gastos fijos locales."),
    ]),
    ("Expansión", [
        ("exp_tamano", "Tamaño de los campus propios nuevos frente a Anáhuac Querétaro", "veces", 0.9, "n2", "Supuesto",
         "Se castiga 10%: los campus nuevos no tienen al equipo fundador dentro."),
        ("exp_apertura", "Costo de abrir un campus propio", "$", 40000, "$", "Supuesto",
         "Equipo de reparto, tabletas, licencia municipal y publicidad de lanzamiento (hoja Inversion). La app, la marca y la sociedad ya existen."),
        ("exp_sueldo", "Sueldo mensual de un socio de tiempo completo, con carga social", "$", 22000, "$", "Supuesto", "Sueldo bruto de $17,000 más cargas."),
        ("exp_transformacion", "Transformación de la sociedad a S.A.P.I. de C.V., en el año 4", "$", 35000, "$", "Supuesto",
         "Rango de mercado de $25,000 a $50,000 para constituir una S.A.P.I. ante notario en Querétaro (Praxium Consultores, 2026)."),
    ]),
]

# (clave, concepto, unidad, (pesimista, esperado, optimista), formato, tipo, razonamiento)
ESCENARIOS = [
    ("adop1", "Adopción objetivo, año 1 (alumnos activos / alumnos)", "%", (0.03, 0.05, 0.08), "%", "Supuesto clave",
     "Referencia: una app para pedir y recoger en CETYS Tijuana alcanzó cerca de 10% de los alumnos (2019). La encuesta lo confirma."),
    ("adop2", "Adopción objetivo, año 2", "%", (0.035, 0.06, 0.10), "%", "Supuesto clave", "Crece con la recomendación entre alumnos y cada generación nueva."),
    ("adop3", "Adopción objetivo, año 3", "%", (0.04, 0.07, 0.12), "%", "Supuesto clave", "Mismo criterio."),
    ("pct_pass", "Usuarios activos con BITE Pass", "%", (0.10, 0.15, 0.25), "%", "Supuesto clave", "La pregunta 12 de la encuesta lo confirma."),
    ("ped_occ", "Pedidos al mes de un usuario ocasional", "pedidos", (2.5, 3, 3), "n1", "Supuesto clave", "Menos de uno por semana. La pregunta 7 de la encuesta lo confirma."),
    ("ped_pass", "Pedidos al mes de un usuario con Pass", "pedidos", (5, 6, 7), "n1", "Supuesto clave", "El Pass se paga solo desde el sexto pedido."),
    ("com", "Comisión que acepta el comercio", "%", (0.15, 0.20, 0.22), "%", "Supuesto clave",
     "Uber Eats cobra de 25% a 29% a los restaurantes en México (tarifas publicadas, noviembre de 2026)."),
]

# (mes, días de clase, factor de arranque del año 1)
CALENDARIO = [
    ("Enero", 15, 0.15), ("Febrero", 19, 0.35), ("Marzo", 17, 0.55), ("Abril", 22, 0.75), ("Mayo", 5, 0.90),
    ("Junio", 0, 0.90), ("Julio", 0, 0.90), ("Agosto", 16, 0.90), ("Septiembre", 21, 1.0), ("Octubre", 22, 1.0),
    ("Noviembre", 18, 1.0), ("Diciembre", 0, 1.0),
]
NOTA_CALENDARIO = ("Días de clase: calendarios escolares oficiales 2027A (11 de enero a 7 de mayo) y 2026B (10 de agosto a 27 de noviembre) "
                   "de la Universidad Anáhuac Querétaro, sin días inhábiles, Semana Santa, exámenes finales ni verano. "
                   "Arranque: parte de la adopción objetivo que se alcanza cada mes del primer año (supuesto).")

# (concepto, monto mensual o fórmula, meses al año, nivel, tipo, fuente)
FIJOS = [
    ("Contabilidad externa y declaraciones", 3500, 12, "Empresa", "Supuesto",
     "Rango de mercado para una persona moral pequeña: $3,000 a $7,000 al mes (Praxium Consultores, 2026). Se toma la parte baja por el poco volumen de facturas."),
    ("Infraestructura de la app: base de datos y hospedaje", "=45*{fx}", 12, "Empresa", "Dato",
     "Supabase Pro USD 25 y Vercel Pro USD 20 al mes (páginas oficiales de precios, 15-nov-2026), al tipo de cambio FIX."),
    ("Dominio .mx, dos cuentas de correo y timbrado de facturas", 475, 12, "Empresa", "Dato",
     "Dominio .mx $689 al año (Akky); Google Workspace $140 por usuario al mes, dos usuarios; timbrado ilimitado $1,650 al año (Facturama). Suma $5,699 al año."),
    ("Seguro de responsabilidad civil", 500, 12, "Empresa", "Supuesto",
     "Prima anual de $4,000 a $7,000 para una pyme con cobertura básica (IDC, enero de 2026). Se toman $6,000."),
    ("Atención al usuario, reposición de equipo y varios", 1000, 12, "Campus", "Supuesto",
     "Línea de atención, reposición de mochilas y gafetes, imprevistos."),
    ("Publicidad continua en el campus y redes", 2500, 9, "Campus", "Decisión",
     "Carteles (100 tabloides: $1,044, Sinergia Publicitaria), stickers (1,000: $775, Pop México) y anuncios en Instagram. Solo en meses con clases."),
]

# (concepto, monto, tipo, fuente)
ARRANQUE = [
    ("Terminar el producto: cobro con tarjeta, BITE Pass, avisos y pruebas", 35000, "Supuesto",
     "100 horas de un desarrollador independiente a $350 la hora. Es el presupuesto original del equipo para la app."),
    ("Asesoría legal: contratos con locales y repartidores, términos y aviso de privacidad", 7500, "Supuesto",
     "Por cotizar con un despacho. La constitución como S.A.S. es gratuita y en línea (Secretaría de Economía)."),
    ("Registro de marca en el IMPI, dos clases", 5628, "Dato",
     "$2,813.77 por clase con IVA, en línea (Tarifa del IMPI, art. 14a, con 10% de descuento). Clases 39 y 35."),
    ("Licencia de funcionamiento y visto bueno de Protección Civil", 3131, "Dato",
     "Referencia publicada por el municipio de El Marqués para giros de bajo riesgo: licencia $2,428 y visto bueno $703."),
    ("Publicidad de lanzamiento", 15000, "Decisión",
     "Activación en el campus, 300 carteles, 3,000 stickers y anuncios en Instagram durante el primer mes."),
    ("Equipo de reparto: mochilas térmicas, playeras, gorras y gafetes", 12436, "Dato",
     "6 mochilas térmicas de 51 L a $1,129 (Sears); 16 playeras polo bordadas a $254.04 y 8 gorras a $149.64, con IVA (Lazzar); 8 gafetes a $50."),
    ("Tabletas para los cuatro locales", 7196, "Dato", "4 tabletas Android de 10 pulgadas a $1,799 (Office Depot)."),
    ("Papelería: hojas membretadas y tarjetas de presentación", 1152, "Dato",
     "1,000 hojas membretadas $792 y 1,000 tarjetas $201 (360imprimir), más IVA."),
]

# Sensibilidad: columnas B=adopción C=%Pass D=ped. ocasional E=ped. Pass F=comida G=sobreprecio H=envío I=comisión J=pago repartidor K=seg. social
SENSIBILIDAD = [
    ("Base: escenario esperado, año 2", {}),
    ("Adopción de 3%", {"B": 0.03}),
    ("Adopción de 4%", {"B": 0.04}),
    ("Adopción de 8%", {"B": 0.08}),
    ("Comisión de 15%", {"I": 0.15}),
    ("Comisión de 25%", {"I": 0.25}),
    ("Envío de $15", {"H": 15}),
    ("Envío de $25", {"H": 25}),
    ("Sin sobreprecio en el menú", {"G": 0}),
    ("Comida promedio de $100", {"F": 100}),
    ("Comida promedio de $140", {"F": 140}),
    ("Pago al repartidor de $12", {"J": 12}),
    ("Pago al repartidor de $18", {"J": 18}),
    ("Repartidores con IMSS completo (30%)", {"K": 0.30}),
    ("Nadie contrata el Pass", {"C": 0}),
    ("Usuario ocasional pide 2 veces al mes", {"D": 2}),
]

APERTURAS_PROPIAS = [1, 1, 1, 0, 0]
APERTURAS_FRANQUICIA = [0, 0, 0, 3, 4]
SOCIOS_TC = [0, 0, 0, 1, 2]

# Encuesta cuantitativa: (número, pregunta, cinco opciones, para qué sirve)
ENCUESTA = [
    ("1", "¿Cuántos días a la semana estás en el campus?", ["1", "2", "3", "4", "5 o más"],
     "Hábitos. Días en que el alumno puede pedir."),
    ("2", "De tus últimas cinco visitas al campus, ¿en cuántas compraste comida ahí?", ["Ninguna", "1", "2", "3", "4 o 5"],
     "Hábitos. Tamaño del mercado de comida dentro del campus."),
    ("3", "¿Cuál es tu principal dificultad para comer en el campus?",
     ["Las filas", "El poco tiempo entre clases", "La distancia a los locales", "El precio", "Ninguna"],
     "Producto. Confirma el problema que justifica el negocio."),
    ("4", "En hora pico, ¿cuánto tardas desde que sales del salón hasta que tienes tu comida?",
     ["Menos de 5 min", "5 a 10 min", "11 a 15 min", "16 a 20 min", "Más de 20 min"],
     "Producto. Tiempo que BITE le ahorra al alumno."),
    ("6", "Si pudieras pedir desde tu celular a los locales del campus y recibirlo en tu salón antes de que empiece tu clase, ¿lo usarías en el primer mes?",
     ["Definitivamente sí", "Probablemente sí", "No sé", "Probablemente no", "Definitivamente no"],
     "Producto. Adopción: el supuesto del que depende todo el modelo."),
    ("7", "¿Cuántas veces al mes lo usarías?", ["Ninguna", "1 o 2", "3 o 4", "5 a 8", "Más de 8"],
     "Producto. Frecuencia de pedido."),
    ("8", "¿Qué pedirías con más frecuencia?",
     ["Desayuno", "Comida completa", "Café o bebida", "Snack o postre", "Opción saludable"],
     "Producto. Qué locales afiliar primero."),
    ("9", "¿Qué es lo más importante para ti en este servicio?",
     ["Que llegue a tiempo", "Que sea barato", "Que haya variedad", "Que sea fácil de usar", "Poder agendar desde antes"],
     "Producto. Orden de prioridades de la propuesta de valor."),
    ("10", "¿Cuánto gastas normalmente en una comida en el campus?",
     ["Menos de $60", "$60 a $99", "$100 a $139", "$140 a $179", "$180 o más"],
     "Precio. Ticket promedio del modelo."),
    ("11", "¿Cuánto es lo máximo que pagarías por el envío a tu salón?",
     ["Solo si es gratis", "Hasta $10", "Hasta $15", "Hasta $20", "$25 o más"],
     "Precio. Tarifa de envío."),
    ("12", "Si por $99 al mes tuvieras todos los envíos incluidos, ¿lo contratarías?",
     ["Definitivamente sí", "Probablemente sí", "No sé", "Probablemente no", "Definitivamente no"],
     "Precio. Alumnos con BITE Pass."),
    ("13", "¿Dónde preferirías recibir tu pedido?",
     ["En la puerta de mi salón", "En un punto fijo de mi edificio", "En la biblioteca o áreas comunes", "En el área deportiva", "Me da igual"],
     "Plaza. Puntos de entrega."),
    ("14", "¿A qué hora pedirías más seguido?",
     ["Antes de las 9:00", "De 9:00 a 11:00", "De 11:00 a 13:00", "De 13:00 a 15:00", "Después de las 15:00"],
     "Plaza. Bloques de entrega y turnos de repartidores."),
    ("15", "¿Por dónde te gustaría enterarte de BITE?",
     ["Instagram", "Grupos de WhatsApp", "Carteles y códigos QR en el campus", "Correo institucional", "Recomendación de un amigo"],
     "Promoción. Canales de la campaña de lanzamiento."),
]
PREGUNTA_ABIERTA = ("5", "Cuéntanos la última vez que te quedaste sin comer o llegaste tarde a clase por ir a comprar comida. ¿Qué pasó?",
                    "Producto. Historias reales para el mensaje de lanzamiento; las respuestas se agrupan por motivo.")
Q_INTENCION, Q_FRECUENCIA, Q_TICKET, Q_ENVIO, Q_PASS = "6", "7", "10", "11", "12"
PUNTOS_FRECUENCIA = [0, 1.5, 3.5, 6.5, 10]   # punto medio de cada respuesta de la pregunta 7
PUNTOS_TICKET = [45, 80, 120, 160, 200]       # punto medio de cada respuesta de la pregunta 10
