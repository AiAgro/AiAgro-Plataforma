# AIAGRO GOVERNANCE

## Propósito

Este documento define la estructura de gobierno, coordinación, control, validación y trazabilidad del proyecto Aiagro.cl.

Su objetivo es garantizar que el crecimiento de la plataforma ocurra de manera ordenada, segura, auditable y escalable.

---

# Principio Rector

Ninguna funcionalidad, módulo, API, dashboard, agente o despliegue se considera terminado sin:

* Evidencia.
* Validación.
* Documentación.
* Seguridad.
* Trazabilidad.

---

# Estructura de Gobierno

Aiagro se organiza mediante dominios especializados.

Cada dominio posee responsabilidades exclusivas.

No se deben mezclar dominios.

---

# 00 Director Orquestador

## Responsabilidad

Gobierno central del proyecto.

## Funciones

* Priorización.
* Coordinación.
* Asignación de tareas.
* Control de dependencias.
* Seguimiento.
* Validación de evidencia.
* Gestión de bitácora.

## Autoridad

Puede bloquear avances que no cumplan criterios mínimos.

---

# 01 Producto

## Responsabilidad

Definir qué construir.

## Funciones

* MVP.
* Roadmap.
* Backlog.
* Priorización.
* Validación de valor.
* Casos de uso.

## Entregables

* MVP P0.
* MVP P1.
* Roadmap.
* Historias de usuario.

---

# 02 Arquitectura

## Responsabilidad

Definir cómo construir.

## Funciones

* Arquitectura.
* APIs.
* Modularidad.
* Ambientes.
* Integraciones.
* ADRs técnicos.

## Entregables

* ARCHITECTURE.md
* ADRs
* Contratos API

---

# 03 Frontend

## Responsabilidad

Experiencia visual.

## Funciones

* Landing.
* Dashboard.
* UX.
* Componentes.
* Mapas.
* Gráficos.

## Entregables

* Diseño.
* Componentes.
* Interfaces.

---

# 04 Backend

## Responsabilidad

Servicios y datos.

## Funciones

* Supabase.
* Auth.
* RLS.
* APIs.
* Storage.
* Auditoría.

## Entregables

* Migraciones.
* Contratos.
* Documentación.

---

# 05 Agentes y Skills

## Responsabilidad

Jarvis agrícola.

## Funciones

* Agentes.
* Skills.
* Prompts.
* Límites.
* Gobernanza IA.

## Entregables

* AGENTS_POLICY.md
* SKILLS_REGISTRY.md

---

# 06 CISO

## Responsabilidad

Seguridad.

## Funciones

* Seguridad de código.
* Revisión de arquitectura.
* Secretos.
* Dependencias.
* Producción segura.

## Autoridad

Puede bloquear despliegues.

---

# 07 QA

## Responsabilidad

Calidad.

## Funciones

* Testing.
* Evidencia.
* Validaciones.
* Regresión.
* Permisos.

## Autoridad

Puede bloquear entregas.

---

# 08 SRE

## Responsabilidad

Operación.

## Funciones

* CI/CD.
* Observabilidad.
* Backups.
* Rollback.
* Incidentes.

## Autoridad

Puede bloquear producción.

---

# 09 Documentación

## Responsabilidad

Gobierno documental.

## Funciones

* ADRs.
* Changelog.
* Checklist.
* Evidencias.
* Historial.

---

# Flujo Oficial de Trabajo

Toda iniciativa debe seguir:

1. Solicitud.
2. Diagnóstico.
3. Diseño.
4. Seguridad.
5. Documentación.
6. Desarrollo.
7. QA.
8. Evidencia.
9. Aprobación.
10. Cierre.

---

# Gestión de Encargos

Cada encargo debe tener:

## Identificador

Ejemplo:

* ENC-001
* ENC-002
* ENC-003

## Información mínima

* Fecha.
* Responsable.
* Objetivo.
* Estado.
* Evidencia esperada.
* Evidencia recibida.

---

# Estados Oficiales

## Pendiente

Aún no enviado.

## Enviado

Asignado al dominio.

## En revisión

Esperando validación.

## Aprobado

Cumple criterios.

## Bloqueado

Existe impedimento.

## Cerrado

Completado con evidencia.

---

# Gestión de Evidencia

Toda evidencia debe incluir:

* Fecha.
* Responsable.
* Resultado.
* Archivos afectados.
* Validación ejecutada.

Ejemplos:

* Pull Request.
* ADR.
* Documento.
* Captura.
* Reporte QA.
* Informe CISO.

---

# Gates Obligatorios

## Gate de Arquitectura

Antes de desarrollo relevante.

## Gate de Seguridad

Antes de producción.

## Gate de QA

Antes de cierre.

## Gate Documental

Antes de aprobar.

---

# Reglas de Desarrollo

1. Una tarea por vez.
2. Una rama por tarea.
3. Un PR por cambio.
4. Nunca trabajar directamente en main.
5. Nunca omitir revisión.
6. Nunca omitir documentación.
7. Nunca omitir evidencia.

---

# Gestión de Riesgos

Todo riesgo debe registrar:

* ID.
* Descripción.
* Impacto.
* Probabilidad.
* Mitigación.
* Responsable.
* Estado.

---

# Gestión de Decisiones

Toda decisión relevante debe quedar registrada mediante ADR.

Ninguna decisión arquitectónica importante debe depender exclusivamente de conversaciones.

---

# Definición de Listo

Una tarea está lista para comenzar cuando:

* Existe objetivo claro.
* Existe alcance.
* Existe responsable.
* Existen criterios de aceptación.

---

# Definición de Terminado

Una tarea está terminada cuando:

* Cumple criterios.
* Tiene evidencia.
* Tiene documentación.
* Tiene validación.
* Tiene aprobación.

---

# Regla Final

Aiagro debe operar como una organización tecnológica profesional.

La velocidad es importante.

La gobernanza es obligatoria.
