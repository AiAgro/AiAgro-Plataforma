# ARCHITECTURE — Aiagro.cl
Versión: 1.0
Fecha: 2026-06-02
Estado: Activo
Fuente: 04_AIAGRO_ARCHITECTURE_PRINCIPLES.md

---

## Principio Rector

Aiagro debe construirse como una plataforma agrícola inteligente
API-first, modular, segura, auditable y preparada para evolución continua.

Toda decisión técnica debe evaluarse considerando:
- Escalabilidad
- Seguridad
- Mantenibilidad
- Trazabilidad
- Costos operacionales
- Facilidad de integración

---

## Principios Arquitectónicos Fundamentales

### API First
Toda funcionalidad debe ser consumible mediante API.
La interfaz web no debe ser la única forma de acceder a los servicios.
Los módulos deben diseñarse primero como servicios y luego como interfaces.

### Modularidad
Cada dominio funcional debe evolucionar de forma independiente.
Dominios: Meteorología, IoT, Geoespacial, Reportes, Agentes, Usuarios, Seguridad.
No construir monolitos difíciles de mantener.

### Seguridad por Diseño
La seguridad debe incorporarse desde el inicio.
No se aceptan controles de seguridad agregados al final del desarrollo.
Toda funcionalidad debe considerar: Autenticación, Autorización,
Auditoría, Clasificación de datos, Protección de secretos.

### Auditoría Obligatoria
Toda acción crítica debe generar registros auditables.
Acciones auditadas: Login, Descargas, Cambios de permisos,
Generación de reportes, Uso de agentes, Exportaciones.

### Escalabilidad
La arquitectura debe soportar crecimiento gradual sin rediseños masivos.
Privilegiar: Servicios desacoplados, Contratos definidos,
Componentes reutilizables.

---

## Ambientes Oficiales

| Ambiente | Propósito | Datos | Característica principal |
|----------|-----------|-------|--------------------------|
| LOCAL    | Desarrollo individual | Ficticios | Experimentación controlada |
| DEV      | Pruebas funcionales | Simulados | Integraciones controladas |
| STAGING  | Preproducción | Similares a prod | QA y validaciones finales |
| PROD     | Producción | Reales | Auditoría completa + backups |

Regla absoluta: nunca usar datos reales en LOCAL o DEV.

---

## Stack Oficial

| Componente | Tecnología | Responsabilidades |
|------------|------------|-------------------|
| Control y Gobierno | GitHub | Repositorio, PRs, Issues, Releases, Evidencia |
| Backend | Supabase | PostgreSQL, Auth, RLS, Storage, Edge Functions |
| Frontend | Vercel | Hosting, Preview Deployments, Producción Web |
| Seguridad Perimetral | Cloudflare | DNS, WAF, Rate Limiting, Protección perimetral |
| IA | OpenAI / Claude / Claude Code / Codex / Kimi | Agentes, skills, automatización |

GitHub es la fuente oficial de verdad del proyecto.
Toda integración IA debe documentarse antes de implementarse.

---

## Arquitectura Lógica por Capas

### Capa de Presentación
WebApp Aiagro.
Responsabilidades: Landing, Dashboard, Reportes, Interacción usuario.
Tecnología: Next.js desplegado en Vercel.

### Capa de Servicios
APIs internas.
Responsabilidades: Usuarios, Predios, Alertas, Reportes, Agentes.
Principio: API-first. Todo servicio debe tener contrato documentado.

### Capa de Datos
Supabase (PostgreSQL).
Responsabilidades: Persistencia, Seguridad, Auditoría.
Reglas: RLS obligatorio en datos sensibles. RBAC obligatorio.

### Capa de IA
Agentes y Skills (Jarvis Agrícola).
Responsabilidades: Explicación, Interpretación, Priorización, Resúmenes.
Límites: No inventa datos. No emite diagnósticos absolutos.
No salta validación humana.

### Capa de Observación Agrícola
Responsabilidades: Imágenes multiespectrales/termales/satelitales,
Geodatos, Sensores IoT, Meteorología.
Requisito: Todo activo geoespacial debe tener fuente, fecha,
metadatos, permisos e historial.

---

## Integraciones

Toda integración debe realizarse mediante:
- API con contrato documentado
- Webhook con payload definido
- Evento con esquema registrado

No se permiten integraciones ad-hoc sin documentación.

---

## Versionamiento de APIs

Toda API debe versionarse desde el inicio.
Formato: /api/v1/, /api/v2/
Regla: No romper compatibilidad sin plan de migración documentado.

---

## Contratos de Servicios

Todo servicio debe documentar como mínimo:
- Endpoint y método HTTP
- Request (parámetros, body, headers)
- Response (estructura, códigos de éxito)
- Errores (códigos y mensajes)
- Autenticación requerida
- Autorización (roles permitidos)

---

## Clasificación de Datos

| Categoría | Descripción | Ejemplos |
|-----------|-------------|---------|
| Público | Sin restricciones | Información general de la plataforma |
| Interno | Uso interno de Aiagro | Configuraciones, logs operativos |
| Confidencial | Datos de clientes | Predios, métricas, imágenes |
| Restringido | Máxima protección | Credenciales, secretos, datos personales |

Regla: Datos Confidencial y Restringido nunca en ambientes LOCAL o DEV.

---

## Principios Geoespaciales

Todo análisis agrícola relevante debe poder asociarse a ubicación.
Cada activo geoespacial debe registrar:
- Fuente (proveedor o sensor)
- Fecha de captura
- Metadatos técnicos
- Permisos de acceso
- Historial de cambios

---

## Principios de Evolución

Diseñar para crecimiento, no solo para el MVP.
Cada decisión debe responder:
¿Permite evolucionar hacia la visión completa de Aiagro?

---

## Definición de Éxito Arquitectónico

La arquitectura será exitosa cuando:
1. Permita crecimiento modular sin reescrituras masivas.
2. Mantenga seguridad y trazabilidad en todo momento.
3. Permita integración externa mediante APIs documentadas.
4. Sea comprensible para nuevos desarrolladores.
5. Mantenga costos operacionales razonables.
6. Permita evolución de agentes, APIs y servicios agrícolas.

---

## Decisiones Documentadas

| ADR | Título | Estado |
|-----|--------|--------|
| ADR-001 | Stack tecnológico oficial | Aceptado |

Toda decisión arquitectónica importante debe quedar en ADR/.
Nada crítico debe depender exclusivamente de conversaciones.

---

## Referencias

- 04_AIAGRO_ARCHITECTURE_PRINCIPLES.md (documento fuente)
- ADR/ADR-001-stack-tecnologico.md
- DOCS/SECURITY.md
- DOCS/DATA_CLASSIFICATION.md
