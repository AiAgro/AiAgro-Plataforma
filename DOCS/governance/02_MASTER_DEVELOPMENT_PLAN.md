# AIAGRO MASTER DEVELOPMENT PLAN

## Objetivo General

Construir Aiagro.cl como una plataforma agrícola inteligente, API-first, modular, segura, auditable y escalable, capaz de evolucionar desde una webapp de alto impacto hacia un ecosistema completo de análisis agrícola, inteligencia artificial, observación geoespacial e integración mediante APIs.

---

# Estrategia General

La construcción de Aiagro debe seguir una secuencia controlada.

No se permite comenzar por funcionalidades avanzadas sin antes completar arquitectura, seguridad, documentación y gobierno.

Principio rector:

"Construir una base sólida antes de acelerar."

---

# FASE 0 — GOBIERNO, ARQUITECTURA Y SEGURIDAD

## Objetivo

Establecer la base técnica, documental y de seguridad del proyecto.

## Entregables

* Repositorio privado GitHub.
* Protección de ramas.
* Estrategia Git.
* Ambientes definidos.
* Arquitectura inicial.
* Seguridad inicial.
* Documentación base.
* ADR-001.
* Checklist maestro.

## Criterio de Aceptación

* Arquitectura aprobada.
* Security Gate 0 aprobado.
* Documentación creada.
* Sin bloqueos críticos.

---

# FASE 1 — WEBAPP DE IMPACTO Y LOGIN CERRADO

## Objetivo

Construir la primera presencia pública de Aiagro.

## Alcance

* Landing premium.
* Hero tecnológico.
* Videos optimizados.
* Menú principal.
* Login cerrado.
* Aviso de contrato obligatorio.
* Responsive.

## Fuera de Alcance

* Dashboard completo.
* Procesamiento agrícola real.
* Datos productivos.

## Criterio de Aceptación

* UX aprobada.
* Login operativo.
* Sin registro público.
* Build exitoso.

---

# FASE 2 — CLIENTES, ORGANIZACIONES Y PERMISOS

## Objetivo

Crear la estructura organizacional de la plataforma.

## Alcance

* Organizaciones.
* Usuarios.
* Roles.
* Predios.
* Cuarteles.
* Permisos.
* Auth.
* RLS.

## Criterio de Aceptación

* Usuarios aislados por organización.
* Roles funcionando.
* Auditoría básica activa.

---

# FASE 3 — DASHBOARD BASE

## Objetivo

Construir el primer dashboard funcional.

## Alcance

### Vista Gerencial

* Estado general.
* Alertas.
* Riesgos.

### Vista Técnica

* Mapas.
* Capas.
* Indicadores.

### Vista Operativa

* Tareas.
* Alertas.
* Acciones sugeridas.

## Criterio de Aceptación

* Navegación simple.
* Roles respetados.
* UX validada.

---

# FASE 4 — APIs INTERNAS

## Objetivo

Implementar arquitectura API-first.

## APIs Iniciales

* Organizaciones.
* Usuarios.
* Predios.
* Cuarteles.
* Alertas.
* Reportes.
* Configuración.

## Criterio de Aceptación

* Contratos documentados.
* Autenticación obligatoria.
* Auditoría activa.

---

# FASE 5 — JARVIS AGRÍCOLA INICIAL

## Objetivo

Incorporar los primeros agentes.

## Agentes Iniciales

### Agente Agronómico General

Explicación agrícola básica.

### Agente Gerencial

Resumen ejecutivo.

### Agente Técnico

Interpretación técnica.

## Skills Iniciales

* Executive Summary.
* Alert Explanation.
* Dashboard Explanation.

## Criterio de Aceptación

* No inventa datos.
* Explica evidencia.
* Indica nivel de confianza.

---

# FASE 6 — REPORTES

## Objetivo

Generar reportes descargables.

## Tipos

### Ejecutivo

Para gerencia.

### Técnico

Para asesores.

### Operativo

Para terreno.

## Criterio de Aceptación

* Versionados.
* Auditables.
* Con evidencia.

---

# FASE 7 — GEODATOS Y OBSERVACIÓN AGRÍCOLA

## Objetivo

Construir la capa geoespacial.

## Alcance

* Predios.
* Cuarteles.
* Sensores.
* Capas.
* Imágenes.
* Metadatos.

## Criterio de Aceptación

* Geometrías válidas.
* Permisos aplicados.
* Metadatos completos.

---

# FASE 8 — PILOTOS CON DATOS REALES CONTROLADOS

## Objetivo

Incorporar los primeros clientes piloto.

## Requisitos

* Contrato.
* Autorización.
* Clasificación de datos.
* Validación agronómica.

## Criterio de Aceptación

* Evidencia documentada.
* Uso autorizado.
* Seguridad aprobada.

---

# FASE 9 — MLOPS Y AGENTES AVANZADOS

## Objetivo

Madurar IA y gobernanza.

## Alcance

* Registro de modelos.
* Registro de prompts.
* Versionado.
* Evaluación.
* Rollback.

## Criterio de Aceptación

* Trazabilidad completa.
* Human Review Gates.

---

# FASE 10 — PRODUCCIÓN CONTROLADA

## Objetivo

Preparar operación real.

## Alcance

* CI/CD.
* Observabilidad.
* Logs.
* Métricas.
* Backups.
* Rollback.

## Criterio de Aceptación

* Producción monitoreada.
* Restauración probada.
* Runbooks disponibles.

---

# FASE 11 — API EXTERNA

## Objetivo

Exponer servicios a terceros autorizados.

## Alcance

* API Developer Portal.
* Sandbox.
* API Keys.
* Scopes.
* Rate Limits.
* Webhooks.

## Criterio de Aceptación

* Contratos documentados.
* Seguridad aprobada.

---

# FASE 12 — MOBILE, PWA E IOT

## Objetivo

Operar correctamente en terreno.

## Alcance

* Mobile-first.
* Offline parcial.
* Captura de evidencia.
* IoT.
* Edge AI futuro.

## Criterio de Aceptación

* Operación usable en campo.
* Sin exposición de datos sensibles.

---

# Dependencias Obligatorias

Antes de avanzar de fase deben cumplirse:

1. Evidencia.
2. QA.
3. Documentación.
4. Seguridad.
5. Aprobación técnica.

Ninguna fase se considera terminada sin estos cinco elementos.

---

# Regla Final

Aiagro debe crecer de forma ordenada.

La velocidad es importante.

La arquitectura, seguridad y gobernanza son obligatorias.
