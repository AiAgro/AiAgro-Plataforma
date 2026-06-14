# AIAGRO PROJECT CHARTER

## 1. Propósito

Aiagro.cl es una plataforma tecnológica agrícola de nueva generación diseñada para transformar datos agrícolas complejos en información clara, accionable y útil para la toma de decisiones.

La plataforma combinará:

* Agricultura de precisión.
* Inteligencia artificial aplicada al agro.
* Imágenes multiespectrales.
* Imágenes termales.
* Imágenes satelitales.
* Imágenes hiperespectrales.
* Meteorología agrícola.
* IoT agrícola.
* Sensores y estaciones.
* Evapotranspiración y riego.
* Plagas y enfermedades.
* Dashboards agronómicos.
* Reportes ejecutivos y técnicos.
* APIs reutilizables.
* Agentes especializados.
* Jarvis Agrícola.

---

# 2. Visión

Convertir Aiagro.cl en una plataforma agrícola inteligente de clase mundial capaz de asistir a productores, gerentes agrícolas, asesores, técnicos y organizaciones mediante inteligencia artificial, observación agrícola avanzada y automatización de decisiones.

---

# 3. Misión

Transformar datos agrícolas dispersos en decisiones agronómicas claras, explicables, trazables y respaldadas por evidencia.

---

# 4. Principios Rectores

1. API First.
2. Arquitectura modular.
3. Seguridad por diseño.
4. Auditoría obligatoria.
5. Escalabilidad.
6. Evidencia antes que opiniones.
7. Validación agronómica.
8. Experiencia simple para usuarios no técnicos.
9. Datos como activo estratégico.
10. Gobernanza tecnológica formal.

---

# 5. Principios Técnicos Obligatorios

## Arquitectura

* API First desde el inicio.
* Servicios desacoplados.
* Contratos documentados.
* Versionamiento.
* Integraciones mediante APIs y eventos.

## Seguridad

* No almacenar secretos en repositorio.
* No exponer service role en frontend.
* RLS obligatorio para datos sensibles.
* RBAC obligatorio.
* Auditoría obligatoria.

## Ambientes

* LOCAL
* DEV
* STAGING
* PROD

Nunca mezclar ambientes.

Nunca usar datos reales en DEV.

---

# 6. Usuarios Objetivo

1. Dueños agrícolas.
2. Gerentes agrícolas.
3. Administradores de campo.
4. Asesores agronómicos.
5. Técnicos de terreno.
6. Operadores.
7. Usuarios administrativos.
8. Integradores autorizados.

---

# 7. Módulos Estratégicos

## Imágenes Agrícolas

* Multiespectral.
* Termal.
* Satelital.
* Hiperespectral.
* Ortomosaicos.

## Meteorología

* Histórica.
* Actual.
* Pronósticos.
* Alertas.

## IoT

* Sensores.
* Gateways.
* Eventos.
* Alertas.

## Riego y Evapotranspiración

* Balance hídrico.
* Déficit.
* Exceso.
* Recomendaciones.

## Plagas y Enfermedades

* Detección temprana.
* Riesgos.
* Priorización.

## Dashboard

* Vista gerencial.
* Vista técnica.
* Vista operativa.
* Vista administrativa.

## Inteligencia Artificial

* Jarvis Agrícola.
* Agentes especializados.
* Skills.
* Reportes.

---

# 8. Stack Oficial

## Control

* GitHub

## Backend

* Supabase

## Frontend

* Vercel

## Seguridad Perimetral

* Cloudflare

## IA

* OpenAI
* Claude
* Claude Code
* Codex
* Kimi

---

# 9. Qué No Es Aiagro

Aiagro NO debe convertirse en:

* ERP agrícola.
* Sistema contable.
* CRM genérico.
* Aplicación monolítica.
* Plataforma dependiente de un proveedor único.

---

# 10. Definición de Éxito

Aiagro será exitoso cuando:

1. Los usuarios entiendan rápidamente el estado de sus campos.
2. Los riesgos sean detectados oportunamente.
3. Las decisiones estén respaldadas por evidencia.
4. Los agentes expliquen información compleja de forma simple.
5. La plataforma pueda crecer sin rehacer arquitectura.
6. Los servicios puedan ser consumidos por APIs externas autorizadas.
7. Exista trazabilidad completa de decisiones y acciones.
