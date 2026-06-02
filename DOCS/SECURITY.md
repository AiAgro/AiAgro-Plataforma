# SECURITY — Aiagro.cl
Versión: 1.0
Fecha: 2026-06-02
Estado: Activo
Autoridad: CISO Domain

---

## Propósito

Este documento define las políticas, controles y reglas de seguridad
obligatorias para todo el ciclo de vida de Aiagro.cl.

La seguridad en Aiagro no es opcional ni posterior al desarrollo.
Es un requisito desde el primer día.

---

## Principio Rector

Seguridad por diseño.
Todo componente, servicio, API y agente debe incorporar
controles de seguridad desde su concepción, no como capa adicional.

---

## Reglas Críticas Activas

Las siguientes reglas están vigentes desde hoy y son de cumplimiento
obligatorio en todos los ambientes y por todos los agentes.

### Secretos y Credenciales
- NUNCA almacenar secretos, tokens, API keys ni passwords en el repositorio
- NUNCA almacenar secretos en archivos .md, .json o .env commiteados
- Todo secreto se gestiona mediante variables de entorno del servicio
  (Vercel dashboard, Supabase dashboard, gestor de secretos)
- El archivo .env.example SÍ puede existir en el repositorio
  pero NUNCA con valores reales
- NUNCA exponer el Service Role Key de Supabase en el frontend

### Autenticación
- Autenticación obligatoria en todos los endpoints de la API
- Supabase Auth es el proveedor oficial de autenticación
- Tokens JWT deben validarse en el servidor, nunca solo en el cliente
- Sessions deben tener tiempo de expiración definido

### Autorización
- RBAC (Role-Based Access Control) obligatorio en toda la plataforma
- RLS (Row Level Security) obligatorio en todas las tablas
  que contengan datos de clientes o sensibles
- Ningún usuario puede acceder a datos de otra organización
- El principio de mínimo privilegio aplica a todos los roles

### Auditoría
- Toda acción crítica debe generar registro auditable con:
  fecha, usuario, acción, resultado, IP origen
- Acciones auditadas obligatoriamente:
  Login y logout, Cambios de permisos, Descarga de reportes,
  Generación de imágenes, Uso de agentes IA, Exportaciones de datos,
  Modificación de configuración
- Los logs de auditoría son inmutables — nunca se borran

### Ambientes
- NUNCA mezclar datos reales con ambientes LOCAL o DEV
- NUNCA usar credenciales de producción en desarrollo
- STAGING debe ser lo más cercano posible a PROD en configuración
- PROD requiere aprobación explícita antes de cualquier despliegue

### Frontend
- NUNCA llamar directamente a Supabase con Service Role desde el frontend
- Usar siempre la Anon Key del lado del cliente
- Variables de entorno sensibles solo en el servidor (prefix sin NEXT_PUBLIC_)
- Content Security Policy (CSP) obligatorio en producción

### APIs
- Rate limiting obligatorio en todos los endpoints públicos
- Validación de input obligatoria en todo endpoint
- Respuestas de error no deben exponer detalles internos del sistema
- CORS configurado explícitamente — no usar wildcard (*) en producción
- HTTPS obligatorio en todos los ambientes excepto LOCAL

### Dependencias
- Revisar vulnerabilidades en dependencias antes de cada release
- No instalar dependencias sin evaluar su mantenimiento y licencia
- Mantener dependencias actualizadas — especialmente las de seguridad

---

## Clasificación de Datos de Seguridad

| Tipo de dato | Clasificación | Dónde vive | Acceso |
|---|---|---|---|
| API Keys de servicios | Restringido | Variables de entorno | Solo backend |
| Service Role Key | Restringido | Variables de entorno servidor | Solo servidor |
| Anon Key Supabase | Interno | Variable de entorno cliente | Frontend |
| Datos de predios | Confidencial | Supabase con RLS | Por organización |
| Imágenes agrícolas | Confidencial | Supabase Storage | Por organización |
| Datos meteorológicos | Interno | Supabase | Por organización |
| Logs de auditoría | Restringido | Supabase | Solo admin |
| Configuración pública | Público | Vercel env | Todos |

---

## Roles de Seguridad

| Rol | Descripción | Nivel de acceso |
|---|---|---|
| superadmin | Administrador de plataforma | Total |
| org_admin | Administrador de organización | Su organización |
| agronomist | Asesor agronómico | Predios asignados |
| field_tech | Técnico de terreno | Predios asignados (lectura) |
| operator | Operador | Acciones operativas definidas |
| viewer | Solo lectura | Predios asignados (vista) |
| api_integration | Integrador externo | Scopes autorizados vía API key |

---

## Gates de Seguridad

### Security Gate 0 — Fase 0 (activo)
- [ ] Sin secretos en repositorio
- [ ] .gitignore con exclusiones correctas
- [ ] Documentación de seguridad creada
- [x] .gitignore configurado ✅ (ENC-002)
- [x] SECURITY.md creado ✅ (ENC-004)

### Security Gate 1 — Antes de primer despliegue DEV
- [ ] Supabase RLS habilitado en todas las tablas
- [ ] Variables de entorno configuradas en Vercel
- [ ] Auth configurado y probado
- [ ] Sin datos reales en DEV

### Security Gate 2 — Antes de STAGING
- [ ] RBAC implementado y probado
- [ ] Auditoría activa y verificada
- [ ] Rate limiting configurado
- [ ] CSP configurado

### Security Gate 3 — Antes de PRODUCCIÓN
- [ ] Penetration testing básico realizado
- [ ] Revisión de dependencias completada
- [ ] Backups configurados y probados
- [ ] Runbook de incidentes disponible
- [ ] Aprobación explícita de Mauricio

---

## Gestión de Incidentes de Seguridad

### Clasificación
- Crítico: exposición de datos de clientes o credenciales
- Alto: acceso no autorizado detectado
- Medio: vulnerabilidad identificada sin explotación
- Bajo: configuración incorrecta sin impacto inmediato

### Procedimiento mínimo
1. Detectar y contener
2. Evaluar alcance e impacto
3. Notificar a Mauricio (Director General)
4. Documentar en RISKS_REGISTER.md
5. Remediar y verificar
6. Post-mortem documentado

---

## Lo que NUNCA debe ocurrir

- Secretos en commits: tolerancia cero, requiere rotación inmediata
- Service Role en frontend: bloqueo inmediato de despliegue
- Datos reales en DEV: eliminación inmediata y auditoría
- Bypass de RLS: bloqueo de feature hasta corrección
- Deploy a PROD sin aprobación: reversión inmediata

---

## Referencias

- DOCS/DATA_CLASSIFICATION.md
- DOCS/ARCHITECTURE.md
- ADR/ADR-001-stack-tecnologico.md
- _BITACORA/RISKS_REGISTER.md
