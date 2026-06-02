# CHECKLIST MASTER — Aiagro.cl
Versión: 1.0
Fecha: 2026-06-02
Estado: Activo

---

## Propósito

Este documento define los gates obligatorios que deben cumplirse
antes de cerrar cada fase del proyecto Aiagro.cl.

Ninguna fase se considera terminada sin evidencia verificable
de todos los ítems de su gate correspondiente.

---

## Estado Actual del Proyecto

Fase activa: FASE 0 — Gobierno, Arquitectura y Seguridad
Encargo activo: ENC-005

---

## FASE 0 — Gobierno, Arquitectura y Seguridad

### Gate de Arquitectura
- [x] Repositorio GitHub inicializado ✅ ENC-002
- [x] Estrategia Git documentada ✅ ENC-002
- [x] Ramas main y develop operativas ✅ ENC-002
- [x] ADR-001 stack tecnológico aceptado ✅ ENC-001
- [x] ARCHITECTURE.md completo ✅ ENC-003
- [ ] ARCHITECTURE.md revisado por Mauricio en próxima sesión

### Gate de Seguridad
- [x] .gitignore con exclusiones críticas ✅ ENC-002
- [x] Sin secretos en repositorio ✅ ENC-002
- [x] SECURITY.md completo ✅ ENC-004
- [x] DATA_CLASSIFICATION.md con 4 categorías ✅ ENC-001
- [ ] Security Gate 0 aprobado formalmente por Mauricio

### Gate Documental
- [x] README.md creado ✅ ENC-001
- [x] ARCHITECTURE.md completo ✅ ENC-003
- [x] SECURITY.md completo ✅ ENC-004
- [x] DATA_CLASSIFICATION.md ✅ ENC-001
- [x] DEVELOPMENT_GUIDELINES.md ✅ ENC-002
- [x] AGENTS_POLICY.md (contenido mínimo) ✅ ENC-001
- [x] SKILLS_REGISTRY.md (contenido mínimo) ✅ ENC-001
- [ ] CHECKLIST_MASTER.md completo ← ENC-005 en curso
- [ ] CHANGELOG.md inicializado ← pendiente ENC-006

### Gate de Memoria y Continuidad
- [x] _MEMORY/PROJECT_CONTEXT.md activo ✅ ENC-001
- [x] _MEMORY/SESSION_HANDOFF.md actualizado ✅ cada sesión
- [x] _MEMORY/ACTIVE_TASK.md actualizado ✅ cada encargo
- [x] _BITACORA/BITACORA_GENERAL.md con historial ✅
- [x] _BITACORA/ENCARGOS_REGISTRO.md con ENC-001 a ENC-005 ✅
- [x] _BITACORA/RISKS_REGISTER.md inicializado ✅ ENC-001

### Criterio de Cierre de Fase 0
Fase 0 se considera CERRADA cuando:
- Todos los ítems anteriores están marcados [x]
- Mauricio aprueba formalmente el Security Gate 0
- El repositorio tiene estructura documental completa en develop
- No existen bloqueos críticos abiertos

---

## FASE 1 — WebApp de Impacto y Login Cerrado

### Requisito de entrada
Fase 0 debe estar CERRADA antes de iniciar Fase 1.

### Gate de Producto
- [ ] Diseño de landing aprobado por Mauricio
- [ ] Hero tecnológico definido
- [ ] Menú principal definido
- [ ] Flujo de login cerrado diseñado
- [ ] Responsive definido para mobile y desktop

### Gate de Arquitectura
- [ ] Proyecto Next.js inicializado
- [ ] Proyecto Vercel configurado
- [ ] Variables de entorno definidas (sin valores reales en repo)
- [ ] Dominio aiagro.cl configurado en Cloudflare

### Gate de Seguridad
- [ ] Supabase Auth configurado
- [ ] Login operativo sin registro público
- [ ] Aviso de contrato en login
- [ ] Sin datos reales en DEV

### Gate de QA
- [ ] Login probado en mobile y desktop
- [ ] Flujo de error probado
- [ ] Build exitoso en Vercel preview

### Criterio de Cierre de Fase 1
- Landing visible en URL de preview
- Login operativo
- Sin registro público
- Build exitoso sin errores

---

## FASE 2 — Clientes, Organizaciones y Permisos

### Requisito de entrada
Fase 1 debe estar CERRADA.

### Gate de Backend
- [ ] Esquema de organizaciones en Supabase
- [ ] Esquema de usuarios con roles
- [ ] RLS activo en todas las tablas sensibles
- [ ] RBAC implementado y probado

### Gate de Seguridad
- [ ] Usuarios aislados por organización verificado
- [ ] Sin acceso cruzado entre organizaciones
- [ ] Auditoría básica activa

### Gate de QA
- [ ] Tests de aislamiento por organización
- [ ] Tests de roles y permisos
- [ ] Evidencia documentada

---

## FASE 3 — Dashboard Base

### Requisito de entrada
Fase 2 debe estar CERRADA.

### Gates pendientes de definición
Se definirán al cerrar Fase 2.

---

## FASES 4 a 12

### Estado
Pendientes de definición.
Los gates de cada fase se completarán al acercarse a esa fase.
Ver MODULES/MODULES_REGISTRY.md para el roadmap de módulos.

---

## Registro de ADRs

| ADR | Título | Estado | Fecha |
|-----|--------|--------|-------|
| ADR-001 | Stack tecnológico oficial | Aceptado | 2026-06-01 |

Todo ADR nuevo debe registrarse aquí.

---

## Registro de Encargos Completados

| Encargo | Título | Estado | Fecha cierre |
|---------|--------|--------|--------------|
| ENC-001 | Estructura documental base | CERRADO | 2026-06-01 |
| ENC-002 | Git + GitHub + estrategia ramas | CERRADO | 2026-06-01 |
| ENC-003 | Completar ARCHITECTURE.md | CERRADO | 2026-06-02 |
| ENC-004 | Completar SECURITY.md | CERRADO | 2026-06-02 |
| ENC-005 | Completar CHECKLIST_MASTER.md | EN CURSO | 2026-06-02 |

---

## Regla Final

Ningún encargo se considera terminado sin:
- Evidencia verificable
- Documentación actualizada
- Aprobación de Mauricio (Director General)
