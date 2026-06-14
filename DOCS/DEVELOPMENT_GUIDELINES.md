# DEVELOPMENT_GUIDELINES.md — Guía de desarrollo de Aiagro.cl
> Reglas activas desde 2026-06-01

## Reglas activas

- Nunca trabajar directamente en main
- Una rama por tarea, un PR por cambio
- Nomenclatura de ramas: feature/ENC-NNN-descripcion
- Ambientes: LOCAL → DEV → STAGING → PROD (nunca saltar)
- No mezclar datos reales y ficticios
- Todo cambio requiere evidencia antes de cerrar

## Estándares de código
> Pendiente — desarrollar en encargo posterior

## Proceso de PR y revisión
> Pendiente — desarrollar en encargo posterior

## CI/CD
> Pendiente — desarrollar en encargo posterior

## Estrategia Git — ENC-002

### Repositorio oficial
https://github.com/AiAgro/AiAgro-Plataforma.git

### Ramas permanentes
- main     → estado aprobado. Nunca se trabaja directamente aquí.
- develop  → integración. Toda feature se fusiona aquí primero.

### Ramas de trabajo
- Nomenclatura: feature/ENC-NNN-descripcion-corta
- Ejemplo:      feature/ENC-003-architecture-md
- Se crean desde develop.
- Se fusionan a develop mediante PR.
- Se eliminan tras el merge.

### Flujo obligatorio por encargo
1. git checkout develop
2. git checkout -b feature/ENC-NNN-descripcion
3. Realizar el trabajo del encargo
4. git add [archivos modificados]
5. git commit -m "tipo: ENC-NNN — descripción breve"
6. git push -u origin feature/ENC-NNN-descripcion
7. Abrir PR en GitHub hacia develop
8. Mauricio o PMO aprueba y mergea el PR
9. Nunca mergear directamente a main sin aprobación de Mauricio

### Tipos de commit válidos
- feat:     nueva funcionalidad o archivo
- fix:      corrección de error
- docs:     solo cambios de documentación
- refactor: reorganización sin cambio funcional
- chore:    tareas de mantenimiento

### Regla absoluta de seguridad
Ningún secreto, credencial, token ni .env real
puede existir en ningún commit de ninguna rama.

## Auditorías de Seguridad

Toda auditoría de seguridad CISO debe seguir el Marco de Evidencia para Auditorías de Seguridad definido en `SECURITY.md` bajo GOV-SEC-001. Las conclusiones deben estar basadas en evidencia verificable, distinguir fuentes internas y externas, y registrar explícitamente los casos no verificables.
