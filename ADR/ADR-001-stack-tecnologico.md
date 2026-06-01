# ADR-001 — Stack Tecnológico Oficial de Aiagro.cl
Fecha: 2026-06-01
Estado: Aceptado
Decisor: Mauricio (Director General)

## Contexto
Aiagro.cl requiere un stack tecnológico que soporte
arquitectura API-first, seguridad por diseño, escalabilidad
modular y capacidades de IA agrícola especializada.

## Decisión
Stack oficial aprobado:
- Control: GitHub
- Backend: Supabase (PostgreSQL, Auth, RLS, Storage, Edge Functions)
- Frontend: Vercel
- Seguridad perimetral: Cloudflare (DNS, WAF, Rate Limiting)
- IA: OpenAI, Claude AI, Claude Code, Codex, Kimi

## Alternativas consideradas
- Firebase: descartado por vendor lock-in y limitaciones de SQL
- AWS full-stack: descartado por complejidad operacional en Fase 0
- Monolito propio: descartado por contradicción con principio API-first

## Consecuencias
- Positivo: stack probado, bien documentado, escalable
- Positivo: Supabase provee Auth + RLS + PostgreSQL integrados
- Neutral: requiere gestión activa de secretos entre servicios
- A monitorear: costos operacionales en crecimiento

## Referencias
- 01_AIAGRO_PROJECT_CHARTER.md — Sección 8: Stack Oficial
- 04_AIAGRO_ARCHITECTURE_PRINCIPLES.md — Stack Oficial
