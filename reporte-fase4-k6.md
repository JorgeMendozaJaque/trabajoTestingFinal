# Fase 4: Pruebas de Carga y Estrés con k6

**Sitio testeado:** https://cabanapinohuacho.mlarac.cl
**Fecha de ejecución:** [05-07-2026]
**Herramienta:** k6

## 1. Configuración del escenario

| Etapa | Duración | VUs objetivo |
|---|---|---|
| Ramping up | 1m | 0 → 50 |
| Meseta de estabilización | 2m | 50 |
| Ramping down | 1m | 50 → 0 |

**Duración total:** ~4 minutos (más 30s de graceful stop)

## 2. Resultado general

| Métrica | Valor |
|---|---|
| Requests HTTP totales | 5,790 |
| Checks totales | 11,580 |
| Checks exitosos | 100.00% |
| Requests fallidos (`http_req_failed`) | 0.00% |
| Iteraciones completas | 1,930 |
| VUs máximos alcanzados | 50 |

No se registraron errores durante la prueba. Todos los thresholds definidos se cumplieron.

## 3. Latencia global (`http_req_duration`)

| Métrica | Valor | Umbral | Estado |
|---|---|---|---|
| Promedio | 243.94 ms | — | — |
| Mediana | 198.89 ms | — | — |
| p90 | 391.57 ms | < 800 ms |  Cumple |
| p95 | 572.49 ms | < 1200 ms |  Cumple |
| Máximo | 1.5 s | — | — |

## 4. Desglose por endpoint

| Endpoint | Método | avg | p90 | p95 | Umbral p95 | Estado |
|---|---|---|---|---|---|---|
| `/api/precio` | GET | 202.57 ms | 209.69 ms | 216.89 ms | < 800 ms |  Cumple |
| `/api/availability/2026/07` | GET | 211.67 ms | 222.35 ms | 235.32 ms | < 800 ms |  Cumple |
| `/reservar` | POST | 317.58 ms | 581.79 ms | 716.45 ms | < 1500 ms |  Cumple |

## 5. Datos de red

| Métrica | Valor |
|---|---|
| Datos recibidos | 28 MB (114 kB/s) |
| Datos enviados | 799 kB (3.3 kB/s) |

## 6. Síntesis interpretativa

La prueba de carga con 50 usuarios virtuales concurrentes durante 4 minutos no evidenció degradación ni errores en el backend, con una tasa de fallos de 0.00% sobre 5,790 requests HTTP. El tiempo de respuesta global se mantuvo muy por debajo de los umbrales definidos: el percentil 95 de `http_req_duration` fue de 572.49 ms frente a un límite de 1200 ms, y el percentil 90 de 391.57 ms frente a un límite de 800 ms.

El análisis desagregado por endpoint mostró diferencias relevantes en el comportamiento del sistema. Los endpoints de lectura, `/api/precio` y `/api/availability/2026/07`, presentaron tiempos de respuesta bajos y estables, con p95 de 216.89 ms y 235.32 ms respectivamente. En contraste, el endpoint `/reservar`, que realiza una operación de escritura (POST), registró un p95 de 716.45 ms, más de tres veces superior al de los endpoints de lectura. Esta diferencia es esperable dado que las operaciones de escritura suelen implicar validaciones adicionales y persistencia en base de datos, procesos ausentes en las consultas de solo lectura.

A pesar de esta diferencia, `/reservar` se mantuvo dentro de su umbral específico (< 1500 ms), lo que indica que el sistema tiene margen operativo para soportar esta carga sin degradación perceptible por el usuario final. El endpoint de reserva es, no obstante, el candidato principal a optimizar o monitorear en caso de aumentar la carga en pruebas futuras (por ejemplo, incrementando a 100 o 200 VUs para identificar el punto de quiebre real del sistema).

## 7. Conclusiones

- El backend soportó satisfactoriamente 50 VUs concurrentes sin errores.
- Todos los thresholds definidos (globales y por endpoint) se cumplieron con margen.
- `/reservar` es el endpoint más costoso computacionalmente, consistente con su naturaleza de escritura en base de datos.
- Se recomienda, como trabajo futuro, escalar la prueba a un número mayor de VUs para determinar el límite de capacidad real del sistema.
