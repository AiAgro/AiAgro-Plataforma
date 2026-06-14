# ESTADO DE FASE 1 — WEBAPP DE IMPACTO Y LOGIN CERRADO

**Documento:** Acta de Estado (Evidencia Consolidada)
**Fase Master Plan:** FASE 1
**Estado general:** EN CURSO — NO CERRADA
**Responsable de registro:** Director Senior Master (CTO)
**Fecha:** Pendiente de fecha real de Dirección

---

## 1. Propósito

Registrar el estado real y verificable de Fase 1, en cumplimiento de:

> "Ninguna decisión arquitectónica importante debe depender exclusivamente de conversaciones." (Architecture Principles)

> "Toda evidencia debe incluir: Fecha, Responsable, Resultado, Archivos afectados, Validación ejecutada." (Governance)

Este documento NO certifica cierre de Fase 1. Certifica el estado actual con base en evidencia visual aportada (capturas de pantalla de aiagro.cl en producción).

---

## 2. Evidencia Recibida

| Evidencia | Descripción | Fecha de aporte |
|---|---|---|
| Captura 1 | Landing aiagro.cl — hero "Inteligencia agrícola para decisiones que importan", menú lateral con 4 íconos (Satélite, Drone, IoT, Nodo), texto "La resiliencia se co..." | Conversación actual |
| Captura 2 | Modal "Imágenes Satelitales" — descripción + lista de capacidades técnicas (NDVI, NDRE, EVI) | Conversación actual |
| Captura 3 | Modal "Drones Agrícolas" — descripción + capacidades (ortomosaicos, modelos de elevación, mapas de prescripción) | Conversación actual |
| Captura 4 | Modal "Sensores IoT Agrícola" — descripción + capacidades (humedad/temperatura suelo, estación meteorológica, flujo de savia) | Conversación actual |
| Captura 5 | Modal "Nodo Territorial Inteligente" — descripción + capacidades extensas, incluye mención a "Dashboard unificado con alertas, reportes y recomendaciones" | Conversación actual |

---

## 3. Checklist de Entregables Fase 1 (según Master Development Plan)

| # | Entregable requerido | Estado | Evidencia / Observación |
|---|---|---|---|
| 1 | Landing premium | ✅ Cumplido | Captura 1 |
| 2 | Hero tecnológico | ✅ Cumplido | Captura 1 |
| 3 | Videos optimizados | ✅ Cumplido | Responsive de video resuelto (375px/414px) — BR-03 / ENC-FE-002 |
| 4 | Menú principal | ⚠️ Parcial | Existe (4 íconos), pero enfoque tecnológico, no de decisión (ver sección 5) |
| 5 | Login cerrado | ✅ Cumplido | Resuelto — Email OTP de 2 pasos (ENC-FE-002, ADR-003) |
| 6 | Aviso de contrato obligatorio | ✅ Cumplido | Resuelto — modal bloqueante + tabla `contract_acceptances` (ENC-FE-002) |
| 7 | Responsive (general) | ⚠️ Parcial | BR-03 (video, 375px/414px) resuelto — ENC-FE-002; resto de la landing no auditado |

---

## 4. Criterio de Aceptación de Fase 1 — Verificación

Según Master Plan, Fase 1 requiere:

| Criterio | Cumplido | Comentario |
|---|---|---|
| UX aprobada | ⚠️ Pendiente | No hay registro de aprobación formal de UX |
| Login operativo | ✅ Sí | Email OTP de 2 pasos operativo — ENC-FE-002, ADR-003 |
| Sin registro público | ✅ Sí | No se observa formulario de registro |
| Build exitoso | ✅ Asumido | Sitio está en producción y accesible |

**Conclusión: Fase 1 NO cumple aún sus propios criterios de aceptación — el único criterio pendiente es la aprobación formal de UX (ver Sección 5). Permanece ABIERTA.**

---

## 5. Hallazgo Estratégico — Enfoque Narrativo Actual

Los 4 modales existentes (Satélite, Drone, IoT, Nodo) comparten un patrón:

```
¿Qué es? (descripción técnica)
   ↓
CAPACIDADES (lista de bullets técnicos: NDVI, ortomosaicos,
sensores de flujo de savia, cobertura WiFi, etc.)
```

Esto posiciona a Aiagro como **catálogo de tecnología**, lo opuesto al posicionamiento estratégico deseado ("plataforma de inteligencia agrícola que ayuda a tomar decisiones").

**Riesgo asociado:** Un visitante que navega estos 4 modales sale con la pregunta "¿qué algoritmo utilizan?" — el escenario que el brief de Producto define explícitamente como **fracaso de experiencia**.

**Mitigación definida (ya en curso de definición):** ENC-FE-003 (Centro Aiagro) actúa como contrapeso narrativo — 5to ícono enfocado en decisiones/resultados, no en tecnología.

---

## 6. Aclaración de Modelo de Acceso (registrada por Dirección)

Dirección confirmó:

> "Solo podrá verse [contenido tipo dashboard] si tiene una reunión comercial con vendedor. No habrá ingreso a ver más allá sin tener un contacto comercial."

Esto define el modelo de acceso para Fase 1 y para ENC-FE-003:

- **No existe acceso de autoservicio** a ningún dashboard o vista de datos.
- El flujo "Solicitar reunión comercial" es la **vía primaria** de conversión.
- El flujo "Ingresar con credenciales" es **consecuencia** de un proceso comercial ya cerrado (cliente habilitado), no una alternativa pública.

**Implicación para los 4 modales actuales:** La mención a "Dashboard unificado" (Captura 5, Nodo) es válida como gancho comercial, siempre que el único camino posible desde ahí sea "solicitar reunión" — no debe generarse expectativa de acceso directo.

---

## 7. Brechas Abiertas (Registro Consolidado)

| ID Brecha | Descripción | Bloquea a | Estado |
|---|---|---|---|
| BR-01 | No existe login cerrado | ENC-FE-003 (modal de acceso depende de sistema de login base) | ✅ VALIDADO E2E EN DEV — QA-CERT-ENC-FE-002 (ver DOCS/ENC-FE-002-evidencia-dev.md) |
| BR-02 | No existe aviso de contrato obligatorio | Cierre de Fase 1 | ✅ VALIDADO E2E EN DEV — QA-CERT-ENC-FE-002 (ver DOCS/ENC-FE-002-evidencia-dev.md) |
| BR-03 | Videos no responsivos en móvil | Cierre de Fase 1 / UX aprobada | ✅ VALIDADO E2E EN DEV — QA-CERT-ENC-FE-002 (ver DOCS/ENC-FE-002-evidencia-dev.md) |
| BR-04 | Sin ADR-001 ni checklist maestro formal (Fase 0) | Cierre retroactivo de Fase 0 | Abierto |
| BR-05 | Narrativa actual (4 íconos) orientada a tecnología, no a decisión | Posicionamiento estratégico — mitigado parcialmente por ENC-FE-003 | Abierto |
| BR-08 | Documentación de gobierno 01-05_AIAGRO_*.md no versionada en repositorio | Trazabilidad / gobierno (cierre retroactivo) | ✅ Cerrado — documentos versionados en DOCS/governance/ ([01](governance/01_AIAGRO_PROJECT_CHARTER.md), [02](governance/02_MASTER_DEVELOPMENT_PLAN.md), [03](governance/03_AIAGRO_GOVERNANCE.md), [04](governance/04_AIAGRO_ARCHITECTURE_PRINCIPLES.md), [05](governance/05_AIAGRO_AGENTS_AND_SKILLS.md)) |
| BR-09 | SMTP Resend + dominio aiagro.cl implementado sin ADR formal previo | Trazabilidad arquitectónica (ADR-004 retroactivo) | ✅ Cerrado — Formalizado mediante ADR/ADR-004-smtp-resend-dominio-aiagro.md |

---

## 8. Encargos Relacionados

| ID | Nombre | Estado | Relación |
|---|---|---|---|
| ENC-FE-003 | Centro Aiagro Comercial Interactivo | Definido, NO ejecutado | Prerrequisito BR-01 (login) ya resuelto por ENC-FE-002 |
| ENC-FE-002 | Cierre técnico Fase 1: Login + Contrato + Responsive | Ejecutado — ver PR de ENC-FE-002 | Resuelve BR-01, BR-02, BR-03 |

---

## 9. Próximo Paso Recomendado

1. **ENC-FE-002** fue ejecutado (login Email OTP, aviso de contrato y responsive de video — ver PR de ENC-FE-002); su prerrequisito técnico para ENC-FE-003 (BR-01/login) queda resuelto.
2. Avanzar con **ENC-FE-003** (Centro Aiagro Comercial Interactivo), ya habilitado por la resolución de BR-01.
3. Obtener la aprobación formal de UX (Sección 4/5) — único criterio de aceptación de Fase 1 aún pendiente.
4. Evaluar cierre retroactivo de Fase 0 (BR-04) en paralelo, sin bloquear lo anterior.

---

## 10. Registro de Aprobación

| Rol | Nombre | Estado | Fecha |
|---|---|---|---|
| Dirección / Gerencia de Producto | — | Pendiente | — |
| CTO / Arquitectura | — | Autor del documento | — |

**Este documento no representa una decisión arquitectónica formal (ADR) — es un registro de estado. Las decisiones derivadas (ENC-FE-002, secuenciación) requieren aprobación de Dirección.**
