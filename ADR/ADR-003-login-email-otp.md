# ADR-003 — Login Email OTP (Passwordless, 2 Pasos)
Fecha: 2026-06-13
Estado: Aceptado
Decisor: Mauricio (Director General)

> Este documento formaliza ADR-00Y (referenciado en ENC-FE-002).

## Contexto

ENC-FE-002 define el cierre técnico de Fase 1: login cerrado (BR-01),
aviso de contrato obligatorio (BR-02) y responsive de video (BR-03),
según DOCS/ESTADO_FASE_1.md.

Restricciones del Charter aplicables a la decisión de autenticación:
- Stack oficial: Supabase Auth (ADR-002).
- $0 costo adicional, sin nuevos proveedores externos.
- Sin registro público — los usuarios deben existir previamente en
  Supabase Auth, provisionados manualmente.

Estado previo del código: `webapp/app/login/page.tsx` implementaba un
flujo de "magic link" (`signInWithOtp` + `emailRedirectTo` →
`webapp/app/auth/callback/route.ts` → `exchangeCodeForSession` →
redirección a `/dashboard`). Este flujo es funcional pero no corresponde
al definido en ENC-FE-002, que especifica un código numérico de 6 dígitos
ingresado manualmente por el usuario.

## Decisión

Login mediante Supabase Auth Email OTP, flujo de 2 pasos (passwordless,
sin magic link):

1. Usuario ingresa su email.
2. `supabase.auth.signInWithOtp({ email, options: { shouldCreateUser: false } })`
   — sin `emailRedirectTo`. Supabase envía un código de 6 dígitos por
   email (plantilla "Magic Link" reconfigurada para usar `{{ .Token }}`
   en lugar de `{{ .ConfirmationURL }}`).
3. Usuario ingresa el código de 6 dígitos recibido.
4. `supabase.auth.verifyOtp({ email, token, type: 'email' })` → sesión
   iniciada y persistida vía cookies (`@supabase/ssr`).
5. Redirección a `/app` (ruta protegida mínima de prueba).

`shouldCreateUser: false` es obligatorio en el paso 2: el flujo no debe
crear usuarios nuevos automáticamente.

El flujo de magic-link existente se retira por completo:
- `webapp/app/login/page.tsx` se reescribe con el flujo de 2 pasos.
- `webapp/app/auth/callback/route.ts` se elimina del repositorio (queda
  huérfano sin el flujo de magic-link que lo invocaba).

Diferido (fase posterior, requiere ADR propio): 2FA real con SMS/password.

## Alternativas consideradas

- **Magic link (estado anterior)**: descartado — no corresponde al UX
  de 2 pasos definido en ENC-FE-002; además requiere abrir el enlace en
  el mismo navegador/dispositivo donde se inició el login, lo cual es
  poco confiable en contexto de campo (móvil vs. correo en otro
  dispositivo).
- **Password tradicional**: descartado — agrega superficie de gestión
  de credenciales (reseteo, políticas de complejidad) sin beneficio
  adicional; ENC-FE-002 exige explícitamente un flujo sin password.
- **SMS OTP / 2FA**: descartado para esta fase — requiere un proveedor
  externo adicional (costo, fuera del Stack Oficial del Charter);
  diferido a un ADR futuro.

## Consecuencias

- Positivo: $0 costo adicional, mecanismo oficial de Supabase, sin
  nuevos proveedores externos.
- Positivo: UX de 2 pasos válida en cualquier dispositivo — no requiere
  abrir el correo en el mismo navegador donde se inició sesión.
- Neutral: requiere reconfigurar la plantilla de email "Magic Link" en
  Supabase Dashboard para usar `{{ .Token }}` (paso manual documentado
  como pendiente en ENC-FE-002).
- A monitorear: expiración del código y disponibilidad de "reenviar
  código" en la UI.

## Referencias

- ADR-002: Stack Frontend y Estructura Monorepo (Autenticación:
  Supabase Auth con `@supabase/ssr`)
- DOCS/ESTADO_FASE_1.md: BR-01 (login cerrado), BR-02 (aviso de contrato)
- ENC-FE-002: Cierre Técnico de Fase 1 — Login (Email OTP) + Aviso de
  Contrato + Responsive de Video
