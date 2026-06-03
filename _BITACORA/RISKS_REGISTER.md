# RISKS_REGISTER — Registro de riesgos del proyecto

| ID    | Descripción                              | Impacto | Probabilidad | Mitigación                          | Estado  |
|-------|------------------------------------------|---------|--------------|-------------------------------------|---------|
| R-001 | Secreto escrito en archivo .md           | Alto    | Baja         | Validación V-06 obligatoria         | Abierto |
| R-002 | Pérdida de contexto entre sesiones       | Alto    | Media        | SESSION_HANDOFF.md actualizado      | Abierto |
| R-003 | Scope creep hacia Fase 1 sin encargo     | Medio   | Media        | Restricciones explícitas en ENC-001 | Abierto |
| R-004 | Video de fondo no renderiza en landing — fondo negro     | Alto    | Alta         | Prompt diagnóstico detallado enviado a Claude Code y Kimi. Solución: ver DOCS/SOLUTIONS/video-background-nextjs.md | CERRADO 2026-06-02 |
