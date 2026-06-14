# ADR-004 — SMTP Personalizado (Resend) + Dominio Corporativo aiagro.cl + OTP Manual con {{ .Token }}
Fecha: 2026-06-13
Estado: Aceptado (formalización retroactiva)
Decisor: Mauricio (Director General) / CTO

> Este documento formaliza retroactivamente una decisión ya implementada y
> validada durante la resolución de QA-BLOCK-ENCFE002-001 (ver
> DOCS/INCIDENTS_REGISTRY.md), cerrando BR-09 (DOCS/ESTADO_FASE_1.md).

## Contexto

Durante la resolución del incidente QA-BLOCK-ENCFE002-001 (OTP rechazado
con `422 otp_disabled`, causado por la plantilla Magic Link activa, el
proveedor SMTP por defecto de Supabase y un dominio remitente no
verificado), se implementó:

- SMTP personalizado mediante Resend.
- Dominio corporativo `aiagro.cl` como remitente verificado.
- Plantilla de email OTP basada en `{{ .Token }}` (no
  `{{ .ConfirmationURL }}`), conforme a ADR-003.
- Eliminación de Magic Link como flujo principal de autenticación.
- Cumplimiento operativo de ADR-003.

La implementación fue validada mediante BE-CLOSE-OTP-002,
CTO-BE-STATUS-OTP-001 y QA-CERT-ENC-FE-002 (ver
DOCS/ENC-FE-002-evidencia-dev.md).

La decisión se ejecutó antes de formalizar el ADR correspondiente, lo cual
quedó registrado como BR-09 (Brecha de Gobernanza) en
DOCS/ESTADO_FASE_1.md y DOCS/INCIDENTS_REGISTRY.md.

## Decisión

Se formaliza retroactivamente el uso de:

- **SMTP personalizado: Resend**, como proveedor de envío de email
  transaccional para Supabase Auth.
- **Dominio corporativo `aiagro.cl`** como dominio remitente verificado.
- **OTP manual mediante `{{ .Token }}`**, conforme al flujo de 2 pasos
  definido en ADR-003.

Esta decisión ya fue implementada y validada. El presente ADR únicamente
regulariza la documentación — no modifica comportamiento técnico ni
introduce cambios funcionales.

## Alternativas consideradas

- **SMTP por defecto de Supabase (estado anterior)**: descartado — provocó
  QA-BLOCK-ENCFE002-001 (`422 otp_disabled`) por limitaciones de envío con
  dominio remitente no verificado, y no permite branding con dominio
  corporativo.
- **Magic Link como flujo principal**: descartado — incompatible con el
  flujo de OTP de 2 pasos definido en ADR-003.

## Consecuencias

- Positivo: resuelve QA-BLOCK-ENCFE002-001; cumplimiento operativo de
  ADR-003.
- Positivo: remitente con dominio corporativo `aiagro.cl`, mejora
  deliverability y branding.
- Pendientes derivados (registrar como brechas separadas si corresponde):
  - Actualizar Stack Oficial (Charter) para incluir Resend.
  - Revisión CISO/SRE de registros DNS agregados a `aiagro.cl` en
    Cloudflare.
  - Confirmar branding completo del template OTP.
  - Confirmar gestión y ubicación de credenciales API de Resend.

## Referencias

- ADR-003: Login Email OTP (Passwordless, 2 Pasos)
- ENC-FE-002: Cierre Técnico de Fase 1 — Login (Email OTP) + Aviso de
  Contrato + Responsive de Video
- BE-CLOSE-OTP-002
- CTO-BE-STATUS-OTP-001
- QA-CERT-ENC-FE-002 (DOCS/ENC-FE-002-evidencia-dev.md)
- QA-BLOCK-ENCFE002-001 (DOCS/INCIDENTS_REGISTRY.md)
- BR-09 (DOCS/ESTADO_FASE_1.md, DOCS/INCIDENTS_REGISTRY.md)
