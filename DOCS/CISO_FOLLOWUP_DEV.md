# CISO_FOLLOWUP_DEV

Fecha: 2026-06-14  
Rol: Dominio 04 - Backend / Supabase / Auth / RLS  
Origen: CISO_AUDIT_PRE_ENCFE003  
Dictamen origen: GO CON CONDICIONES  
Proyecto verificado: Supabase DEV `jkuvsjvwmsrximcyarpt`  
Proyecto prohibido: Production `oclcvqlvgogxmcrcpklx`  

## Confirmacion de alcance

Se reviso exclusivamente Supabase DEV `jkuvsjvwmsrximcyarpt`.

No se abrio, reviso ni modifico Production `oclcvqlvgogxmcrcpklx`.

No se realizaron cambios en codigo, Supabase, Resend, DNS, SMTP, templates, OTP length ni policies RLS. No se expusieron secretos ni API keys completas.

## Preflight ejecutado

Comandos ejecutados:

- `pwd`
- `git rev-parse --show-toplevel`
- `git remote -v`
- `git status --branch --short`
- `git log --oneline --decorate -5`

Resultado observado:

- Ruta local: `C:\Users\Mauricio\AiAgro`
- Repo root: `C:/Users/Mauricio/AiAgro`
- Remote: `https://github.com/AiAgro/AiAgro-Plataforma.git`
- Rama autorizada para el documento: `docs/ciso-followup-002-004-006`
- Cambios ajenos existentes no tocados: `.claude/settings.local.json`, `webapp/supabase/.temp/`

## Tabla de resultados GOV-SEC-001

| CISO ID | Severidad | Elemento revisado | Ruta Supabase | Resultado GOV-SEC-001 | Evidencia observada | Riesgo residual |
|---|---|---|---|---|---|---|
| CISO-002 | Medio | Credenciales Resend / Custom SMTP | Authentication -> SMTP Settings | Verificado | Custom SMTP habilitado; sender email `no-reply@aiagro.cl`; sender name `AiAgro`; host `smtp.resend.com`; port `587`; username `resend`; password configurada en campo enmascarado/no visible. Busqueda local no encontro `RESEND_API_KEY`, `smtp.resend.com`, `SMTP_PASS` ni `SMTP_USER` en archivos versionados del repo; `webapp/.env.local` no contiene referencias Resend/SMTP buscadas. | Bajo: la API key no es visible por diseno; queda bajo control de Supabase SMTP config. |
| CISO-004 | Bajo | RLS y policies de `contract_acceptances` | Authentication -> Policies -> schema public -> contract_acceptances | Verificado | Tabla `contract_acceptances` muestra boton `Disable RLS`, confirmando RLS habilitado. Existen 2 policies: `Users can insert own contract acceptances` con comando `INSERT` y rol `authenticated`; `Users can view own contract acceptances` con comando `SELECT` y rol `authenticated`. Detalle INSERT muestra `with check ((auth.uid() = user_id))`. Detalle SELECT muestra `using ((auth.uid() = user_id))`. | Bajo: estado DEV coincide con la migracion versionada; no se modificaron policies. |
| CISO-006 | Bajo | Email OTP length | Authentication -> Sign In / Providers -> Email | Verificado | Provider Email habilitado. Campo `MAILER_OTP_LENGTH` visible con valor `6`; no revertido a `8`. | Bajo: valor verificado en DEV; no se modifico configuracion. |

## Detalle por hallazgo

### CISO-002 - Credenciales Resend

Resultado esperado:

`Verificado — credencial Resend vive en Supabase SMTP config`

Resultado obtenido:

`Verificado — credencial Resend vive en Supabase SMTP config`

Evidencia:

- Custom SMTP habilitado en Supabase DEV.
- Host: `smtp.resend.com`.
- Username: `resend`.
- Sender: `AiAgro <no-reply@aiagro.cl>`.
- Password/API key configurada en Supabase SMTP config como campo enmascarado.
- No se revelo ni copio la API key.
- Confirmacion local sin exponer valores: no se encontraron referencias Resend/SMTP buscadas en archivos versionados del repo ni en `webapp/.env.local`.

### CISO-004 - Despliegue RLS

Resultado esperado:

`Verificado — RLS habilitado y policies SELECT/INSERT presentes`

Resultado obtenido:

`Verificado — RLS habilitado y policies SELECT/INSERT presentes`

Evidencia:

- `contract_acceptances` visible en schema `public`.
- RLS habilitado: la UI muestra accion `Disable RLS`.
- Policy INSERT presente: `Users can insert own contract acceptances`, aplicada a `authenticated`.
- Policy SELECT presente: `Users can view own contract acceptances`, aplicada a `authenticated`.
- Condicion INSERT observada: `with check ((auth.uid() = user_id))`.
- Condicion SELECT observada: `using ((auth.uid() = user_id))`.
- No se modificaron policies.

### CISO-006 - OTP length drift

Resultado esperado:

`Verificado — Email OTP length = 6`

Resultado obtenido:

`Verificado — Email OTP length = 6`

Evidencia:

- Ruta revisada: `Authentication -> Sign In / Providers -> Email`.
- Campo observado: `MAILER_OTP_LENGTH`.
- Valor observado: `6`.
- No se modifico el valor.

## Conclusión

Los tres hallazgos post-auditoria dependientes de Supabase Dashboard quedan verificados en DEV:

- CISO-002: Verificado.
- CISO-004: Verificado.
- CISO-006: Verificado.

El seguimiento externo reduce los pendientes de CISO_AUDIT_PRE_ENCFE003 asociados a Supabase DEV. No se identificaron discrepancias durante esta verificacion.

## Confirmación de restricciones cumplidas

- Solo DEV `jkuvsjvwmsrximcyarpt`.
- Production `oclcvqlvgogxmcrcpklx` no tocado.
- Sin cambios de codigo.
- Sin cambios en Supabase.
- Sin cambios en Resend.
- Sin cambios en DNS.
- Sin cambios en SMTP.
- Sin cambios en templates.
- Sin cambios en OTP length.
- Sin cambios en policies RLS.
- Sin exposicion de secretos.
- Sin captura ni revelacion de API keys completas.
- Sin fixes.
- Sin bloqueo de ENC-FE-003.

## Pendientes

No quedan pendientes para CISO-002, CISO-004 ni CISO-006 en Supabase DEV.

La verificacion DNS/Cloudflare de CISO-001 permanece fuera de este work order.
