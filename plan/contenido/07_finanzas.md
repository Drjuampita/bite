# 11. Aspectos financieros

Todas las cifras de este capítulo salen de nuestro modelo, el libro BITE_Modelo_Financiero.xlsx. Ninguna la escribimos suelta: si se cambia un supuesto en el libro, cambian todas. Los precios al alumno incluyen IVA; los ingresos y costos de BITE van sin IVA, en pesos de 2026.

Cada dato de entrada del modelo lleva una etiqueta:

- **Dato:** sale de una fuente que se puede consultar.
- **Decisión:** lo fijamos nosotros, como un precio.
- **Supuesto:** estimación razonada.
- **Supuesto clave:** estimación de la que depende el resultado. La validamos con la encuesta y el piloto.

La lista completa está en la hoja «Supuestos» del modelo financiero. El archivo de Excel se entrega junto con este documento.

## 11.1 Origen de recursos: total de capital

!tabla Inversión inicial
!auto inversion
!fuente Fuente: hoja «Inversión» del modelo financiero.

No fijamos el capital sumando gastos, sino con una pregunta: ¿cuánto hace falta para que, aun en el peor escenario, la caja conserve un colchón de {{sup_colchon|%}} del capital? La respuesta es {{capital|$}}. Con esa cifra, la caja más baja del escenario pesimista en tres años es de {{P_caja_min|$}}.

De los {{capital|$}}, {{arranque|$}} se gastan antes de abrir. Los otros {{reserva|$}} son la reserva que financia los primeros meses: en el escenario esperado la caja nunca baja de {{E_caja_min|$}}.

!tabla Origen de los recursos
!auto origen

**Sin deuda.** No pedimos crédito. No lo necesita: cobra al alumno antes de preparar el pedido y paga al local una semana después. Esa diferencia a favor no se cuenta en el modelo.

**Aportación en especie.** El producto ya construido vale {{mvp_valor|$}} a precio de mercado. No se suma al capital.

## 11.2 Escenarios: pesimista, esperado y optimista

Los tres escenarios describen el mismo negocio, con los mismos precios y los mismos gastos. Solo cambian cuatro cosas que BITE no controla: cuántos alumnos lo usan, cuántos contratan el Pass, qué tan seguido piden y qué comisión acepta el local.

!tabla Las variables que cambian entre escenarios
!auto escenarios_vars
!fuente Fuente: hoja «Supuestos» del modelo financiero. Todas son supuestos clave.

**De dónde sale la adopción esperada de {{sup_adop1_E|%}}.** Es nuestro supuesto central y lo contrastamos con la encuesta. La referencia disponible es la app Skipeat de CETYS Tijuana, para pedir y pasar a recoger, que llegó a cerca de 10% de su campus. No es comparable del todo: Skipeat no cobraba envío y BITE cuesta 24% más que el mostrador. Sirve como orden de magnitud. El escenario esperado supone la mitad; el optimista, menos que ese caso en su primer año.

**El arranque no es instantáneo.** El primer año no empieza a ritmo pleno. En enero BITE alcanza 15% de su adopción objetivo y llega al 100% en septiembre. En los años 2 y 3 la adopción tampoco salta el 1 de enero: sube la mitad en el primer semestre y el resto desde agosto, y cada agosto arranca al {{sup_regreso|%}} porque una parte de los usuarios tarda en volver del verano.

!tabla Calendario escolar y arranque del primer año
!auto calendario
!fuente Fuente: calendarios escolares 2026B y 2027A de la Universidad Anáhuac Querétaro (días de clase) y supuesto nuestro (arranque). No se cuentan exámenes finales ni verano.

!tabla De dónde salen los pedidos
!auto demanda
!fuente Fuente: hojas de escenario del modelo financiero.

!fig fin_pedidos | 16.5 | Pedidos por día de clase en los tres escenarios, 36 meses.

### Escenario esperado

!tabla Resultados del escenario esperado
!auto resultados_E

El primer año cierra con una pérdida de {{= -S.E_neta_1 |$}}, que se explica por los {{arranque|$}} de gastos de arranque. Sin ellos, la operación del año deja {{= S.E_ebit_1 + S.arranque |$}}. En septiembre de 2027 el volumen pasa de {{sup_umbral_coord|n}} pedidos diarios y se contrata al coordinador. El año 2 no paga ISR porque amortiza la pérdida del primero. La caja vuelve a superar el capital aportado en el mes {{E_payback|n}}.

!tabla El primer año mes por mes, escenario esperado (ingresos, margen, gastos, utilidad y caja en miles de pesos)
!auto mensual_E
!fuente Fuente: hoja «Esc_Esperado» del modelo financiero. La utilidad de enero incluye los gastos de arranque. Junio, julio y diciembre no tienen clases, pero sí gastos fijos.

### Escenario pesimista

!tabla Resultados del escenario pesimista
!auto resultados_P

Si la adopción se queda en 3%, pocos contratan el Pass y los locales solo aceptan 15% de comisión, BITE apenas se sostiene: pierde {{= -S.P_neta_1 |$}} el primer año y después ronda el punto de equilibrio. No recuperamos nuestro capital en tres años. La empresa no quiebra, porque la reserva alcanza, pero tampoco es rentable.

Por eso tenemos una **regla de decisión**, y el modelo la aplica: si en abril de 2027 hay menos de {{umbral_abr|n}} usuarios activos, desde agosto se suspenden la publicidad pagada y la bolsa de horas de desarrollo, que suman {{= S.ahorro_12+S.ahorro_clase |$}} al mes, y se revisan precio y oferta. Ese umbral es la ruta de una adopción de {{sup_adop_decision|%}}. En el escenario pesimista hay {{m_P_users_4|n}} usuarios en abril, así que la regla se activa; en el esperado hay {{m_E_users_4|n}} y no se activa.

**Y si es peor que el pesimista.** Si en abril no se llega ni al nivel pesimista, lo razonable es cerrar al terminar el semestre. Nuestra pérdida quedaría cerca de {{= S.capital-S.m_P_caja_5 |$}}: los gastos de arranque más cinco meses de operación. Es el costo de averiguar si el negocio existe.

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

- **Nuestros sueldos** en los primeros tres años. La utilidad de esos años no descuenta el pago de nuestro trabajo, que incluye turnarnos la guardia de operación mientras no haya coordinador.
- **Una contraprestación a la universidad.** Si la pide, reduce la utilidad.
- **El ISR en pagos provisionales.** Para simplificar, el modelo carga el impuesto de cada año completo en diciembre.
- **Reparto de utilidades a los trabajadores.** Las empresas nuevas están exentas el primer año; después puede llegar a 10% de la utilidad fiscal.
- **Inflación.** Precios y costos se mantienen en pesos de 2026.
- **Ingresos nuevos:** publicidad de locales, eventos, docentes y personal.
- **El dinero de los locales en tránsito,** que BITE tiene en caja durante una semana.

## 11.3 Gastos fijos

!tabla Gastos fijos
!auto fijos
!fuente Fuente: hoja «Fijos» del modelo financiero. «Empresa» son gastos que no se repiten al abrir otro campus; «Campus» son los que sí.

Los gastos fijos se pagan aunque no haya un solo pedido. En un mes con clases suman {{fijos_mes|$}}; en junio, julio y diciembre, sin publicidad, {{fijos_mes_sin|$}}. Al año son {{fijos_ano|$}}.

El **coordinador de operación** no está en la tabla porque no se paga desde el primer día. Entra cuando el volumen pasa de {{sup_umbral_coord|n}} pedidos diarios y cuesta {{sup_coord|$}} al mes durante los nueve meses con clases: {{coord_ano|$}} al año. Con él, los gastos fijos anuales suben a {{e_fijos2_E|$}}. Mientras no esté, la coordinación diaria recae en nosotros, que nos turnamos la guardia de 7:15 a 17:30 sin cobrar. Ese trabajo es real aunque no aparezca como gasto.

## 11.4 Gastos variables

Los gastos variables existen solo si hay pedidos. Son ocho.

!tabla Gastos variables
!cols 2.4,2.2,2.4
| Concepto | Cuánto | De qué depende |
|---|---|---|
| Pago a repartidores | {{sup_pago|$}} por pedido | Pedidos entregados |
| Garantía mínima por bloque | Hasta {{sup_garantia|$}} por bloque asignado | Repartidores con menos de dos pedidos en un bloque; pesa solo en las primeras semanas |
| Seguridad social de repartidores | {{sup_pct_ss|%}} del pago | Pago a repartidores |
| Pasarela de pago | {{sup_pas_pct|%1}} + {{sup_pas_fijo|$2}} por cobro | Monto cobrado al alumno |
| Sello y etiqueta | {{sup_sello|$2}} por pedido | Pedidos entregados |
| Primer envío gratis | {{u_i_fee_E|$2}} por usuario nuevo | Usuarios que hacen su primer pedido |
| Garantía de puntualidad | {{u_i_fee_E|$2}} por pedido tardío | {{sup_pct_tarde|%}} de los pedidos sin Pass |
| Pedidos no entregados | {{sup_ticket|$}} por pedido reembolsado | Uno de cada 200 pedidos |

!tabla Gastos variables por año, escenario esperado
!cols 3,1.3,1.3,1.3
| Concepto | Año 1 | Año 2 | Año 3 |
|---|---|---|---|
| Ingresos | {{E_ing_1|$}} | {{E_ing_2|$}} | {{E_ing_3|$}} |
| Gastos variables | {{E_cvar_1|$}} | {{E_cvar_2|$}} | {{E_cvar_3|$}} |
| Gastos variables por pedido | {{= S.E_cvar_1/S.E_pedidos_1 |$2}} | {{= S.E_cvar_2/S.E_pedidos_2 |$2}} | {{= S.E_cvar_3/S.E_pedidos_3 |$2}} |
| **Margen de contribución** | {{E_mc_1|$}} | {{E_mc_2|$}} | {{E_mc_3|$}} |
| Margen sobre ingresos | {{E_mc_pct_1|%1}} | {{E_mc_pct_2|%1}} | {{E_mc_pct_3|%1}} |


## 11.5 Punto de equilibrio

La pregunta es cuántos pedidos al día necesita BITE para pagar sus gastos fijos de todo el año, contando los tres meses sin clases.

!tabla Punto de equilibrio
!auto equilibrio
!fuente Fuente: hoja «Equilibrio» del modelo financiero.

!fig fin_equilibrio | 16.5 | Punto de equilibrio en el escenario esperado.

Hay dos puntos de equilibrio, y los dos importan. Mientras operamos nosotros sin cobrar, BITE deja de perder con {{e_be_oday_E|n}} pedidos por día de clase: {{e_be_adop_E|%1}} de los alumnos, uno de cada {{e_uno_de_E|n}}. Con el coordinador pagado, el equilibrio sube a {{e_be2_oday_E|n}} pedidos, {{e_be2_adop_E|%1}} de los alumnos; por eso el coordinador solo se contrata al pasar de {{sup_umbral_coord|n}}. El segundo es el equilibrio de un negocio que no depende del trabajo gratuito de sus dueños. Para el cierre del año 2 se proyectan {{e_oday2_E|n}} pedidos: la demanda puede caer {{e_holgura_E|%}} antes de que BITE pierda dinero con coordinador.

### Sensibilidad: qué pasa si un supuesto falla

!fig fin_sensibilidad | 16.5 | Efecto de cambiar un solo supuesto sobre la utilidad de operación de un año.

!tabla Sensibilidad de la utilidad de operación
!auto sensibilidad
!fuente Fuente: hoja «Sensibilidad» del modelo financiero. Año completo al ritmo de cierre del año 2 del escenario esperado. El coordinador se paga solo en los casos en que el volumen pasa de {{sup_umbral_coord|n}} pedidos diarios. La base es mayor que la utilidad del año 2 de la tabla de resultados ({{E_ebit_2|$}}) porque supone la adopción de cierre durante todo el año.

Seis lecturas:

1. **La adopción manda.** Con 2% el año pierde {{= -S.sens_16 |$}}. Con 3% y 4% deja {{sens_1|$}} y {{sens_2|$}}, pero solo porque a ese volumen no se contrata coordinador y seguimos operando nosotros sin cobrar.
2. **Entre 4% y 6% la utilidad casi no cambia.** El coordinador absorbe el crecimiento. La utilidad vuelve a subir al pasar de 6%.
3. **El sobreprecio de menú sostiene el negocio.** Sin él, el año pasa de ganar {{sens_0|$}} a perder {{= -S.sens_8 |$}}. Si los alumnos lo rechazan, la alternativa es subir el envío.
4. **La comisión pesa.** Cada punto de comisión vale cerca de {{= (S.sens_d_5 - S.sens_d_4)/10 |$}} al año. Con 15% el año queda en {{sens_4|$}}. Si el local exige que el 20% se calcule sobre su precio sin IVA, la utilidad baja en {{= -S.sens_d_18 |$}}.
5. **Una cuota de 3% a la universidad** sobre la venta de comida reduce la utilidad en {{= -S.sens_d_17 |$}}.
6. **El IMSS completo para los repartidores es absorbible.** Reduce la utilidad en {{= -S.sens_d_13 |$}}, sin llevarla a pérdida.

Hay también un margen adicional que no usamos: con el volumen del año 2, un repartidor gana en promedio {{= S.E_ing_rb_2*2 |$}} por hora efectiva, cerca de tres veces el salario mínimo. El pago por pedido podría bajar a $12 y seguir por encima del doble del mínimo; eso sumaría {{sens_d_11|$}} al año.

### Pruebas de consistencia

El modelo se revisa a sí mismo con doce pruebas. Si una falla, la cifra no se usa.

!tabla Pruebas de consistencia del modelo
!auto pruebas
!fuente Fuente: hoja «Pruebas» del modelo financiero. La última prueba queda pendiente hasta capturar la encuesta.
