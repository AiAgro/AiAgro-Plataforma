# Registro de Incidentes — Aiagro.cl

**Documento:** Registro consolidado de incidentes, brechas y deuda técnica
**Mantenido por:** QA / Frontend (Dominio 03)
**Última actualización:** 2026-06-13

---

## Incidentes

### QA-CRIT-001

- **Estado:** Cerrado
- **Origen:** Directriz CTO posterior a QA-CERT-ENC-FE-002
- **Evidencia histórica:** Pendiente consolidación
- **Descripción:** `.env.local` contenía placeholders y no apuntaba al ambiente DEV.
- **Causa raíz:** Paso manual pendiente antes de delegar pruebas QA.
- **Resolución:** Usuario actualizó credenciales DEV reales.
- **Patrón preventivo:** Verificar `.env.local` antes de delegar pruebas E2E.
- **Commit asociado:** No identificado en esta revisión documental.

### QA-BLOCK-ENCFE002-001

- **Estado:** Cerrado
- **Origen:** Directriz CTO posterior a QA-CERT-ENC-FE-002
- **Evidencia histórica:** Pendiente consolidación
- **Descripción:** OTP rechazado (`422 otp_disabled`).
- **Causa raíz:** Template Magic Link activo + SMTP default + dominio no verificado.
- **Resolución:** SMTP Resend + dominio `aiagro.cl` + template usando `{{ .Token }}`.
- **Referencia:** BE-CLOSE-OTP-002
- **ADR:** ADR-004 pendiente de formalización.
- **Commit asociado:** No identificado en esta revisión documental.

### QA-BLOCK-ENCFE002-002

- **Estado:** Cerrado
- **Origen:** Directriz CTO posterior a QA-CERT-ENC-FE-002
- **Evidencia histórica:** Pendiente consolidación
- **Descripción:** Desalineación entre longitud de OTP de Supabase (8 dígitos) y frontend (6 dígitos).
- **Causa raíz:** Campo "Email OTP Length" configurado en 8.
- **Resolución:** Campo corregido a 6.
- **ADR:** ADR-003 sin cambios.
- **Commit asociado:** No identificado en esta revisión documental.

### QA-INCIDENT-CONTRACTGATE-001

- **Estado:** Resuelto — validado E2E en DEV (QA-CERT-ENC-FE-002, ver `DOCS/ENC-FE-002-evidencia-dev.md`)
- **Fecha:** 2026-06-13
- **Descripción:** ContractGate permanecía visible después de que el usuario aceptaba el aviso de contrato, incluso cuando la fila se insertaba correctamente en `contract_acceptances`.
- **Causa raíz:** `webapp/app/app/layout.tsx` (Server Component) importaba `CONTRACT_VERSION` desde `webapp/components/auth/ContractGate.tsx`, módulo marcado `'use client'`. La importación cross-boundary impedía que `CONTRACT_VERSION` resolviera de forma confiable al literal `'v1-placeholder'` en el SELECT server-side, por lo que `accepted` permanecía `false` indefinidamente.
- **Resolución:** Se eliminó la importación cross-boundary y se reemplazó por el literal `'v1-placeholder'` directamente en `layout.tsx`.
- **Referencia técnica:** ENC-FE-002, ADR-003, `webapp/app/app/layout.tsx:3,17`
- **Commit asociado:** `78a11fe`

---

## Brechas (BR)

### BR-08

- **Estado:** Abierto
- **Descripción:** Documentación de gobierno `01-05_AIAGRO_*.md` no versionada en repositorio.
- **Acción futura:** Versionar en `DOCS/governance/`.
- **Severidad:** Media-Alta

### BR-09

- **Estado:** Cerrado — Formalizado mediante `ADR/ADR-004-smtp-resend-dominio-aiagro.md`
- **Descripción:** SMTP Resend + dominio `aiagro.cl` implementado sin ADR formal previo.
- **Acción futura:** ADR-004 retroactivo (no ejecutar — solo registrar).
- **Severidad:** Media

---

## Deuda Técnica

### Lint preexistente (no bloqueante)

| Archivo | Hallazgo |
|---|---|
| `webapp/components/landing/ParticlesCSS.tsx` | Detectado durante revisión de lint |
| `webapp/middleware.ts` | Detectado durante revisión de lint |

**Estado:** No bloqueante.
