# 11. Aspectos financieros

Todas las cifras de este capítulo salen del libro BITE_Modelo_Financiero.xlsx. Ninguna se escribió a mano: si se cambia un supuesto en el libro, cambian todas. Los precios al alumno incluyen IVA; los ingresos y costos de BITE van sin IVA, en pesos de 2026.

Cada dato de entrada del modelo lleva una etiqueta:

- **Dato:** sale de una fuente que se puede consultar.
- **Decisión:** lo fija el equipo, como un precio.
- **Supuesto:** estimación razonada.
- **Supuesto clave:** estimación de la que depende el resultado. La encuesta y el piloto deben confirmarla.

La lista completa, con su fuente, está en el Anexo D.

## 11.1 Origen de recursos: total de capital

!tabla Inversión inicial
!auto inversion
!fuente Fuente: hoja «Inversion» del modelo financiero.

El capital no se fijó sumando gastos, sino con una pregunta: ¿cuánto hace falta para que la caja no llegue a cero ni en el peor escenario? La respuesta es {{capital|$}}. Con esa cifra, la caja más baja del escenario pesimista en tres años es de {{P_caja_min|$}}.

De los {{capital|$}}, solo {{arranque|$}} se gastan. Los otros {{reserva|$}} son una reserva que en el escenario esperado nunca se toca.

!tabla Origen de los recursos
!auto origen

**Sin deuda.** BITE no pide crédito. No lo necesita: cobra al alumno antes de preparar el pedido y paga al local una semana después. Esa diferencia a favor no se cuenta en el modelo.

**Aportación en especie.** El producto ya construido vale {{mvp_valor|$}} a precio de mercado. No se suma al capital.

## 11.2 Escenarios: pesimista, esperado y optimista

Los tres escenarios describen el mismo negocio, con los mismos precios y los mismos gastos. Solo cambian cuatro cosas que BITE no controla: cuántos alumnos lo usan, cuántos contratan el Pass, qué tan seguido piden y qué comisión acepta el local.

!tabla Las variables que cambian entre escenarios
!auto escenarios_vars
!fuente Fuente: hoja «Supuestos» del modelo financiero. Todas son supuestos clave.

**De dónde sale la adopción esperada de {{sup_adop1_E|%}}.** No hay un dato propio todavía: es el supuesto que la encuesta debe confirmar. La referencia disponible es la app Skipeat de CETYS Tijuana, que con un servicio más limitado, pedir y pasar a recoger, llegó a cerca de 10% de su campus. El escenario esperado supone la mitad; el optimista, menos que ese caso en su primer año.

**El arranque no es instantáneo.** El primer año no empieza a ritmo pleno. En enero BITE alcanza 15% de su adopción objetivo y llega al 100% en septiembre.

!tabla Calendario escolar y arranque del primer año
!auto calendario
!fuente Fuente: calendarios escolares 2026B y 2027A de la Universidad Anáhuac Querétaro (días de clase) y supuesto del equipo (arranque). No se cuentan exámenes finales ni verano.

!tabla De dónde salen los pedidos
!auto demanda
!fuente Fuente: hojas de escenario del modelo financiero.

!fig fin_pedidos | 16.5 | Pedidos por día de clase en los tres escenarios, 36 meses.

### Escenario esperado

!tabla Resultados del escenario esperado
!auto resultados_E

El primer año cierra con una pérdida de {{= -S.E_neta_1 |$}}, que se explica por los {{arranque|$}} de gastos de arranque. Sin ellos, la operación del año deja {{= S.E_ebit_1 + S.arranque |$}}. En septiembre de 2027 el volumen pasa de {{sup_umbral_coord|n}} pedidos diarios y se contrata al coordinador. El capital aportado se recupera en el mes {{E_payback|n}}, septiembre de 2028.

!tabla El primer año mes por mes, escenario esperado (ingresos, margen, gastos, utilidad y caja en miles de pesos)
!auto mensual_E
!fuente Fuente: hoja «Esc_Esperado» del modelo financiero. La utilidad de enero incluye los gastos de arranque. Junio, julio y diciembre no tienen clases, pero sí gastos fijos.

### Escenario pesimista

!tabla Resultados del escenario pesimista
!auto resultados_P

Si la adopción se queda en 3%, pocos contratan el Pass y los locales solo aceptan 15% de comisión, BITE queda en tablas: pierde {{= -S.P_neta_1 |$}} el primer año y después ronda el punto de equilibrio. Los socios no recuperan su capital en tres años. La empresa no quiebra, porque la reserva alcanza, pero tampoco es negocio. Por eso el plan fija un punto de decisión: **si en abril de 2027 hay menos de {{m_P_users_4|n}} usuarios activos, se suspende la publicidad pagada y se revisan precio y oferta antes del semestre de agosto.**

### Escenario optimista

!tabla Resultados del escenario optimista
!auto resultados_O

Con 8% de adopción en el primer año, BITE gana desde 2027 y recupera el capital en el mes {{O_payback|n}}. El bloque más cargado llega a {{O_pico_max|n}} pedidos, dentro del cupo de {{sup_cupo_locales|n}} que suman los cuatro locales. El límite de este escenario no es la demanda sino la cocina: para crecer más habría que afiliar más locales.

### Los tres escenarios juntos

!tabla Comparativo de escenarios a tres años
!auto comparativo

!fig fin_escenarios | 16 | Utilidad neta por año y escenario.

!fig fin_caja | 16.5 | Caja al cierre de cada mes en los tres escenarios. La caída de diciembre es el pago del ISR.

### Lo que el modelo no incluye

- **Sueldos de los socios** en los primeros tres años. La utilidad de esos años es antes de pagar su trabajo.
- **Reparto de utilidades a los trabajadores.** Las empresas nuevas están exentas el primer año; después puede llegar a 10% de la utilidad fiscal.
- **Inflación.** Precios y costos se mantienen en pesos de 2026.
- **Ingresos nuevos:** publicidad de locales, eventos, docentes y personal.
- **El dinero de los locales en tránsito,** que BITE tiene en caja durante una semana.

## 11.3 Gastos fijos

!tabla Gastos fijos
!auto fijos
!fuente Fuente: hoja «Fijos» del modelo financiero. «Empresa» son gastos que no se repiten al abrir otro campus; «Campus» son los que sí.

Los gastos fijos se pagan aunque no haya un solo pedido. En un mes con clases suman {{fijos_mes|$}}; en junio, julio y diciembre, sin publicidad, {{fijos_mes_sin|$}}. Al año son {{fijos_ano|$}}.

El **coordinador de operación** no está en la tabla porque no se paga desde el primer día. Entra cuando el volumen pasa de {{sup_umbral_coord|n}} pedidos diarios y cuesta {{sup_coord|$}} al mes durante los nueve meses con clases: {{coord_ano|$}} al año. Con él, los gastos fijos anuales suben a {{e_fijos2_E|$}}.

## 11.4 Gastos variables

Los gastos variables existen solo si hay pedidos. Son siete.

!tabla Gastos variables
!cols 2.4,2.2,2.4
| Concepto | Cuánto | De qué depende |
|---|---|---|
| Pago a repartidores | {{sup_pago|$}} por pedido | Pedidos entregados |
| Garantía mínima por bloque | Hasta {{sup_garantia|$}} por bloque asignado | Bloques con menos de dos pedidos; pesa solo en los primeros meses |
| Seguridad social de repartidores | {{sup_pct_ss|%}} del pago | Pago a repartidores |
| Pasarela de pago | {{sup_pas_pct|%1}} + {{sup_pas_fijo|$2}} por cobro | Monto cobrado al alumno |
| Sello y etiqueta | {{sup_sello|$2}} por pedido | Pedidos entregados |
| Primer envío gratis | {{u_i_fee_E|$2}} por usuario nuevo | Usuarios que hacen su primer pedido |
| Garantía de puntualidad | {{u_i_fee_E|$2}} por pedido tardío | {{sup_pct_tarde|%}} de los pedidos sin Pass |

!tabla Gastos variables por año, escenario esperado
!cols 3,1.3,1.3,1.3
| Concepto | Año 1 | Año 2 | Año 3 |
|---|---|---|---|
| Ingresos | {{E_ing_1|$}} | {{E_ing_2|$}} | {{E_ing_3|$}} |
| Gastos variables | {{E_cvar_1|$}} | {{E_cvar_2|$}} | {{E_cvar_3|$}} |
| Gastos variables por pedido | {{= S.E_cvar_1/S.E_pedidos_1 |$2}} | {{= S.E_cvar_2/S.E_pedidos_2 |$2}} | {{= S.E_cvar_3/S.E_pedidos_3 |$2}} |
| **Margen de contribución** | {{E_mc_1|$}} | {{E_mc_2|$}} | {{E_mc_3|$}} |
| Margen sobre ingresos | {{E_mc_pct_1|%1}} | {{E_mc_pct_2|%1}} | {{E_mc_pct_3|%1}} |

El detalle por pedido está en el apartado 8.1.1.

## 11.5 Punto de equilibrio

La pregunta es cuántos pedidos al día necesita BITE para pagar sus gastos fijos de todo el año, contando los tres meses sin clases.

!tabla Punto de equilibrio
!auto equilibrio
!fuente Fuente: hoja «Equilibrio» del modelo financiero.

!fig fin_equilibrio | 16.5 | Punto de equilibrio en el escenario esperado.

En el escenario esperado BITE deja de perder con {{e_be_oday_E|n}} pedidos por día de clase: basta con que lo use {{e_be_adop_E|%1}} de los alumnos, uno de cada {{e_uno_de_E|n}}. Con el coordinador contratado, el equilibrio sube a {{e_be2_oday_E|n}} pedidos, y el coordinador solo se contrata al pasar de {{sup_umbral_coord|n}}. Para el año 2 se proyectan {{e_oday2_E|n}}: la demanda puede caer {{e_holgura_E|%}} antes de que BITE pierda dinero.

### Sensibilidad: qué pasa si un supuesto falla

!fig fin_sensibilidad | 16.5 | Efecto de cambiar un solo supuesto sobre la utilidad de operación de un año.

!tabla Sensibilidad de la utilidad de operación
!auto sensibilidad
!fuente Fuente: hoja «Sensibilidad» del modelo financiero. Año completo al ritmo del año 2 del escenario esperado, con coordinador.

Cuatro lecturas:

1. **La adopción manda.** Con 3% el año es de pérdida; con 4% queda apenas en equilibrio. Es el supuesto que más importa y el primero que la encuesta mide.
2. **El sobreprecio de menú sostiene el negocio.** Sin él, el año pasa de ganar {{sens_0|$}} a perder {{= -S.sens_8 |$}}. Si los alumnos lo rechazan, la alternativa es subir el envío.
3. **La comisión es negociable hacia abajo, pero cuesta.** Cada punto de comisión vale cerca de {{= (S.sens_d_5 - S.sens_d_4)/10 |$}} al año.
4. **El IMSS completo para los repartidores es absorbible.** Reduce la utilidad en {{= -S.sens_d_13 |$}}, sin llevarla a pérdida.

Hay también una palanca a favor que el plan no usa: con el volumen del año 2, un repartidor gana en promedio {{= S.E_ing_rb_2*2 |$}} por hora efectiva, casi seis veces el salario mínimo. El pago por pedido podría bajar a $12 y seguir siendo el mejor empleo de medio tiempo del campus; eso sumaría {{sens_d_11|$}} al año.

### Pruebas de realidad

El modelo se revisa a sí mismo con doce pruebas. Si una falla, la cifra no se usa.

!tabla Pruebas de realidad del modelo
!auto pruebas
!fuente Fuente: hoja «Pruebas» del modelo financiero. La última prueba queda pendiente hasta capturar la encuesta.
