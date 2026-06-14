# AIAGRO ARCHITECTURE PRINCIPLES

## Propósito

Este documento define los principios arquitectónicos obligatorios que deben gobernar todas las decisiones técnicas de Aiagro.cl.

Su objetivo es asegurar que la plataforma pueda crecer de manera segura, modular, mantenible y escalable sin necesidad de rehacer componentes críticos en el futuro.

---

# Principio Rector

Aiagro debe construirse como una plataforma agrícola inteligente API-first, modular, segura, auditable y preparada para evolución continua.

Toda decisión técnica debe evaluarse considerando:

* Escalabilidad.
* Seguridad.
* Mantenibilidad.
* Trazabilidad.
* Costos operacionales.
* Facilidad de integración.

---

# Principios Arquitectónicos Fundamentales

## API First

Toda funcionalidad debe ser consumible mediante API.

La interfaz web no debe ser la única forma de acceder a los servicios.

Los módulos deben diseñarse primero como servicios y luego como interfaces.

---

## Modularidad

Cada dominio funcional debe evolucionar de forma independiente.

Ejemplos:

* Meteorología.
* IoT.
* Geoespacial.
* Reportes.
* Agentes.
* Usuarios.
* Seguridad.

No construir monolitos difíciles de mantener.

---

## Seguridad por Diseño

La seguridad debe incorporarse desde el inicio.

No se aceptan controles de seguridad agregados al final del desarrollo.

Toda funcionalidad debe considerar:

* Autenticación.
* Autorización.
* Auditoría.
* Clasificación de datos.
* Protección de secretos.

---

## Auditoría Obligatoria

Toda acción crítica debe generar registros auditables.

Ejemplos:

* Login.
* Descargas.
* Cambios de permisos.
* Generación de reportes.
* Uso de agentes.
* Exportaciones.

---

## Escalabilidad

La arquitectura debe soportar crecimiento gradual sin rediseños masivos.

Se debe privilegiar:

* Servicios desacoplados.
* Contratos definidos.
* Componentes reutilizables.

---

# Ambientes Oficiales

## LOCAL

Desarrollo individual.

Características:

* Datos ficticios.
* Desarrollo local.
* Experimentación controlada.

---

## DEV

Pruebas funcionales.

Características:

* Datos simulados.
* Integraciones controladas.
* Testing técnico.

---

## STAGING

Preproducción.

Características:

* Configuración similar a producción.
* Validaciones finales.
* QA.
* Seguridad.

---

## PROD

Producción.

Características:

* Datos reales.
* Auditoría completa.
* Monitoreo activo.
* Backups.

---

# Stack Oficial

## Control y Gobierno

GitHub

Responsabilidades:

* Repositorio.
* Pull Requests.
* Issues.
* Releases.
* Evidencia.

GitHub es la fuente oficial de verdad.

---

## Backend

Supabase

Responsabilidades:

* PostgreSQL.
* Auth.
* RLS.
* Storage.
* Edge Functions.

---

## Frontend

Vercel

Responsabilidades:

* Hosting.
* Preview Deployments.
* Producción Web.

---

## Seguridad Perimetral

Cloudflare

Responsabilidades:

* DNS.
* WAF.
* Rate Limiting.
* Protección perimetral.

---

## Inteligencia Artificial

Plataformas autorizadas:

* OpenAI.
* Claude.
* Claude Code.
* Codex.
* Kimi.

Toda integración IA debe documentarse.

---

# Arquitectura Lógica Inicial

## Capa de Presentación

WebApp Aiagro.

Responsabilidades:

* Landing.
* Dashboard.
* Reportes.
* Interacción usuario.

---

## Capa de Servicios

APIs internas.

Responsabilidades:

* Usuarios.
* Predios.
* Alertas.
* Reportes.
* Agentes.

---

## Capa de Datos

Supabase.

Responsabilidades:

* Persistencia.
* Seguridad.
* Auditoría.

---

## Capa de IA

Agentes y Skills.

Responsabilidades:

* Explicación.
* Interpretación.
* Priorización.
* Resúmenes.

---

## Capa de Observación Agrícola

Responsabilidades:

* Imágenes.
* Geodatos.
* Sensores.
* Meteorología.

---

# Integraciones

Toda integración debe realizarse mediante:

* API.
* Webhook.
* Evento.
* Contrato documentado.

No se permiten integraciones ad-hoc sin documentación.

---

# Versionamiento

Toda API debe versionarse.

Ejemplo:

/api/v1/
/api/v2/

No romper compatibilidad sin plan de migración.

---

# Contratos

Todo servicio debe tener contrato documentado.

Mínimos:

* Endpoint.
* Método.
* Request.
* Response.
* Errores.
* Autenticación.
* Autorización.

---

# Datos

Todo dato debe clasificarse.

Categorías mínimas:

* Público.
* Interno.
* Confidencial.
* Restringido.

---

# Principios de IA

La IA debe:

* Asistir.
* Explicar.
* Priorizar.

La IA no debe:

* Inventar datos.
* Emitir diagnósticos absolutos.
* Saltar validación humana.

---

# Principios Geoespaciales

Todo análisis agrícola relevante debe poder asociarse a ubicación.

Cada activo geoespacial debe tener:

* Fuente.
* Fecha.
* Metadatos.
* Permisos.
* Historial.

---

# Principios de Evolución

Diseñar para crecimiento.

No diseñar únicamente para el MVP.

Cada decisión debe preguntarse:

¿Permite evolucionar hacia la visión completa de Aiagro?

---

# Definición de Éxito Arquitectónico

La arquitectura será exitosa cuando:

1. Permita crecimiento modular.
2. Soporte nuevas capacidades sin reescrituras masivas.
3. Mantenga seguridad y trazabilidad.
4. Permita integración externa.
5. Sea comprensible para nuevos desarrolladores.
6. Mantenga costos razonables.
7. Permita evolución de agentes, APIs y servicios agrícolas.

---

# Regla Final

Toda decisión arquitectónica importante debe quedar documentada mediante ADR.

Nada crítico debe depender exclusivamente de conversaciones.
