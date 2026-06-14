# ENC-FE-002 — Evidencia DEV

**Documento:** Evidencia E2E consolidada (Supabase DEV)
**Estado:** QA-CERT-ENC-FE-002 — APROBADO
**Fecha:** 2026-06-13
**Responsables:** Usuario, QA, Frontend

---

## Referencias

- ENC-FE-002 — Cierre técnico Fase 1: Login (Email OTP) + Aviso de Contrato + Responsive de Video
- ADR-003 — Login Email OTP (Passwordless, 2 Pasos)
- Commit `78a11fe` — fix(frontend): resolve ContractGate acceptance lookup (QA-INCIDENT-CONTRACTGATE-001)

**Ambiente:** Supabase DEV (`jkuvsjvwmsrximcyarpt`)

---

## Origen de la certificación

- `QA-CERT-ENC-FE-002` fue emitido por el Dominio QA.
- Las pruebas E2E fueron ejecutadas manualmente por el usuario.
- Claude Code no ejecutó validación E2E directa (sin acceso a navegador/automatización UI en esta sesión).
- Este documento consolida evidencia reportada y certificada por QA.
- La única verificación realizada de forma independiente por Claude Code corresponde al fix de código: commit `78a11fe`, lint de alcance limpio y `npm run build` exitoso.

---

## Evidencia validada (E2E)

| # | Ítem | Estado |
|---|---|---|
| 1 | Login OTP — envío | ✅ |
| 2 | Login OTP — verificación | ✅ |
| 3 | OTP longitud 6 dígitos | ✅ |
| 4 | `verifyOtp()` | ✅ |
| 5 | Sesión creada | ✅ |
| 6 | Redirect a `/app` | ✅ |
| 7 | ContractGate visible | ✅ |
| 8 | ContractGate bloqueante | ✅ |
| 9 | Botón "Aceptar y continuar" operativo | ✅ |
| 10 | Insert en `contract_acceptances` | ✅ |
| 11 | `accepted_at` confirmado | ✅ |
| 12 | "Acceso autenticado ✓" visible | ✅ |
| 13 | Email visible | ✅ |
| 14 | Logout correcto | ✅ |
| 15 | Redirect a `/login` | ✅ |
| 16 | Regresión (segundo login) correcta | ✅ |
| 17 | Segundo login sin reaparición de ContractGate | ✅ |

---

## Notas / Pendientes

- **Branding de email pendiente.** La plantilla `webapp/supabase/email-templates/otp-email.html` (ENC-FE-002 / ADR-003) usa un placeholder de logo (`<!-- PLACEHOLDER LOGO -->`); el branding final aún no ha sido aplicado.
- **SMTP custom (Resend + dominio `aiagro.cl`) ya operativo.** Pendiente verificar que la plantilla actualmente activa en Supabase Dashboard (Authentication → Email Templates → Magic Link) siga correspondiendo a `otp-email.html` (uso de `{{ .Token }}`, no `{{ .ConfirmationURL }}`), dado que la configuración del proveedor SMTP pudo requerir re-aplicar la plantilla. Ver BR-09 en `DOCS/INCIDENTS_REGISTRY.md`.
