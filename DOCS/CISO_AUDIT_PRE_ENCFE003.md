# CISO_AUDIT_PRE_ENCFE003

Rol: CISO  
Tarea: CISO_AUDIT_PRE_ENCFE003 (Pista A)  
Fecha: 2026-06-14  
Rama: docs/ciso-audit-pre-encfe003  
Alcance: auditoria de seguridad pre-ENC-FE-003 aplicando GOV-SEC-001.  

## Restricciones aplicadas

- Solo lectura funcional: no se modifico codigo, Supabase, DNS, templates, SMTP ni produccion.
- Cambio realizado: solo documentacion en `DOCS/CISO_AUDIT_PRE_ENCFE003.md`.
- No se leyo ni mostro `webapp/.env.local`.
- No se imprimieron secretos.
- Se mantuvieron intactos cambios ajenos existentes: `.claude/settings.local.json` y `webapp/supabase/.temp/`.

## Resumen ejecutivo

La auditoria interna no encontro secretos reales versionados ni uso de `service_role` en frontend. La tabla `contract_acceptances` cuenta con RLS, politicas por usuario autenticado y restriccion unica por `user_id + contract_version`, lo que reduce el riesgo de escalacion horizontal.

Quedan condiciones abiertas por fuentes externas no verificadas en esta auditoria: Cloudflare/DNS real, ubicacion visible de la API key de Resend en Supabase Dashboard y configuracion real OTP en Supabase. Adicionalmente, el middleware esta deshabilitado y la evidencia interna indica riesgo de continuidad de sesion por refresh server-side no persistido.

Recomendacion CISO: **GO CON CONDICIONES**.

## Tabla resumen

| Punto | Area | Fuente interna | Fuente externa | Resultado | Severidad maxima |
|---|---|---:|---:|---|---|
| 1 | DNS / Cloudflare | Verificada | NO VERIFICABLE EN ESTA AUDITORÍA | Documentacion existe, DNS real pendiente/no accesible | Medio |
| 2 | Credenciales Resend | Verificada | NO VERIFICABLE EN ESTA AUDITORÍA | No se encontraron secretos reales en repo; ubicacion externa no visible | Medio |
| 3 | RLS contract_acceptances | Verificada | No requerida para este punto | RLS y politicas por `auth.uid() = user_id` presentes | Bajo |
| 4 | Secretos y `.env.local` | Verificada | No requerida | `.env` ignorados; `webapp/.env.local` sin historial Git; sin `service_role` real en frontend | Bajo |
| 5 | Middleware y sesion | Verificada | No requerida | Guard funcional, pero middleware deshabilitado y refresh server-side no persistente | Medio |
| 6 | OTP | Verificada | NO VERIFICABLE EN ESTA AUDITORÍA | UI espera 6 digitos; configuracion Supabase real no verificada | Bajo |

## 1. DNS / Cloudflare

### Fuente de evidencia

- Interna (repo/codigo/git/docs)
- Externa (Cloudflare, Supabase Dashboard, SaaS)

### Evidencia obtenida

Se reviso:

- `ADR/ADR-004-smtp-resend-dominio-aiagro.md`
- `INFRA/CLOUDFLARE.md`
- busqueda interna de `SPF`, `DKIM`, `DMARC`, `Cloudflare`, `ADR-004`

Donde se reviso:

- `ADR/ADR-004-smtp-resend-dominio-aiagro.md:17`
- `ADR/ADR-004-smtp-resend-dominio-aiagro.md:19`
- `ADR/ADR-004-smtp-resend-dominio-aiagro.md:63`
- `ADR/ADR-004-smtp-resend-dominio-aiagro.md:66`
- `INFRA/CLOUDFLARE.md:3`
- `INFRA/CLOUDFLARE.md:4`
- `INFRA/CLOUDFLARE.md:9`

Que se observo:

- ADR-004 documenta SMTP personalizado mediante Resend.
- ADR-004 documenta OTP manual basado en `{{ .Token }}` y no `{{ .ConfirmationURL }}`.
- ADR-004 deja como pendiente la revision CISO/SRE de registros DNS agregados a `aiagro.cl` en Cloudflare.
- ADR-004 deja como pendiente confirmar gestion y ubicacion de credenciales API de Resend.
- `INFRA/CLOUDFLARE.md` indica dominio `aiagro.cl` pendiente de configurar.
- `INFRA/CLOUDFLARE.md` declara responsabilidades DNS/WAF/Rate Limiting y advierte que el archivo no debe contener tokens ni credenciales Cloudflare.

Fuente externa:

NO VERIFICABLE EN ESTA AUDITORÍA

### Hallazgo

Clasificacion: **Medio**

Existe evidencia documental de decision y responsabilidades, pero no evidencia interna suficiente de SPF/DKIM/DMARC efectivos ni verificacion directa de Cloudflare. El estado real DNS queda condicionado a auditoria externa CISO/SRE.

## 2. Credenciales Resend

### Fuente de evidencia

- Interna (repo/codigo/git/docs)
- Externa (Cloudflare, Supabase Dashboard, SaaS)

### Evidencia obtenida

Se reviso:

- Busqueda `resend`, `RESEND_API_KEY`, `service_role`, `SERVICE_ROLE`
- `.env.example`
- ADR-004

Donde se reviso:

- `ADR/ADR-004-smtp-resend-dominio-aiagro.md:17`
- `ADR/ADR-004-smtp-resend-dominio-aiagro.md:36`
- `ADR/ADR-004-smtp-resend-dominio-aiagro.md:66`
- `.env.example:8`

Que se observo:

- El repo menciona Resend como proveedor SMTP en ADR-004.
- No se encontro `RESEND_API_KEY` con valor real en el repositorio revisado.
- No se encontro secreto real de Resend versionado.
- `.env.example` contiene placeholders y advertencias, no valores reales.
- La ubicacion real esperada de la API key es Supabase Dashboard/secret store, pero no fue visible ni verificada en esta auditoria.

Fuente externa:

NO VERIFICABLE EN ESTA AUDITORÍA

### Hallazgo

Clasificacion: **Medio**

No hay evidencia de secreto Resend expuesto en repo. La condicion abierta es de trazabilidad externa: no se verifico visualmente la ubicacion real de la API key en Supabase Dashboard ni su rotacion/alcance.

## 3. RLS `contract_acceptances`

### Fuente de evidencia

- Interna (repo/codigo/git/docs)

### Evidencia obtenida

Se reviso:

- `webapp/supabase/migrations/0001_contract_acceptances.sql`

Donde se reviso:

- `webapp/supabase/migrations/0001_contract_acceptances.sql:3`
- `webapp/supabase/migrations/0001_contract_acceptances.sql:10`
- `webapp/supabase/migrations/0001_contract_acceptances.sql:13`
- `webapp/supabase/migrations/0001_contract_acceptances.sql:15`
- `webapp/supabase/migrations/0001_contract_acceptances.sql:19`
- `webapp/supabase/migrations/0001_contract_acceptances.sql:21`
- `webapp/supabase/migrations/0001_contract_acceptances.sql:25`

Que se observo:

- Tabla `public.contract_acceptances` definida con `user_id`, `accepted_at` y `contract_version`.
- Indice unico `contract_acceptances_user_version_uniq` sobre `(user_id, contract_version)`.
- RLS habilitado con `alter table public.contract_acceptances enable row level security`.
- Politica SELECT para usuarios autenticados con `using (auth.uid() = user_id)`.
- Politica INSERT para usuarios autenticados con `with check (auth.uid() = user_id)`.
- No se observo politica UPDATE/DELETE, lo cual limita modificaciones posteriores por usuario desde la app.

### Evaluacion de riesgo de escalacion

Clasificacion: **Bajo**

La migracion reduce riesgo de escalacion horizontal porque SELECT e INSERT quedan atados a `auth.uid() = user_id`. El indice unico evita multiples aceptaciones para el mismo usuario y version. Riesgo residual: esta auditoria no verifico el estado desplegado en Supabase Dashboard; se verifico la fuente versionada.

## 4. Secretos y `.env.local`

### Fuente de evidencia

- Interna (repo/codigo/git/docs)

### Evidencia obtenida

Se reviso:

- `.gitignore`
- `webapp/.gitignore`
- `git log --all -- webapp/.env.local`
- busqueda interna de `service_role`, `SERVICE_ROLE`, `RESEND_API_KEY`

Donde se reviso:

- `.gitignore:6`
- `.gitignore:7`
- `.gitignore:8`
- `.gitignore:9`
- `.gitignore:10`
- `.gitignore:13`
- `.gitignore:57`
- `.gitignore:60`
- `.gitignore:61`
- `.gitignore:74`
- `.gitignore:75`
- `webapp/.gitignore:34`
- `.env.example:8`

Que se observo:

- `.env`, `.env.local`, variantes por ambiente y `*.env` estan ignorados en raiz.
- `webapp/.env.local` y `webapp/.env*.local` estan ignorados explicitamente.
- `webapp/.gitignore` ignora `.env*`.
- `git log --all -- webapp/.env.local` no devolvio commits, por lo que no hay historial versionado visible para `webapp/.env.local`.
- La busqueda no encontro `service_role` real en frontend. Solo aparece placeholder/documentacion en `.env.example` con `SUPABASE_SERVICE_ROLE_KEY=NUNCA_EN_FRONTEND`.
- No se leyo ni mostro `webapp/.env.local`.

### Hallazgo

Clasificacion: **Bajo**

No se observo exposicion de secretos reales ni `service_role` en frontend. El placeholder `SUPABASE_SERVICE_ROLE_KEY=NUNCA_EN_FRONTEND` es aceptable como advertencia documental, siempre que no se use en runtime frontend.

## 5. Middleware y sesion

### Fuente de evidencia

- Interna (repo/codigo/git/docs)

### Evidencia obtenida

Se reviso:

- `webapp/middleware.ts`
- `webapp/app/app/layout.tsx`
- `webapp/lib/supabase/server.ts`
- `webapp/lib/supabase/client.ts`
- `DOCS/ENC-BE-001-findings.md`

Donde se reviso:

- `webapp/middleware.ts:9`
- `webapp/app/app/layout.tsx:7`
- `webapp/app/app/layout.tsx:10`
- `webapp/app/app/layout.tsx:14`
- `webapp/app/app/layout.tsx:17`
- `webapp/lib/supabase/server.ts:7`
- `webapp/lib/supabase/server.ts:15`
- `webapp/lib/supabase/server.ts:20`
- `webapp/lib/supabase/client.ts:4`
- `DOCS/ENC-BE-001-findings.md:12`
- `DOCS/ENC-BE-001-findings.md:20`
- `DOCS/ENC-BE-001-findings.md:30`
- `DOCS/ENC-BE-001-findings.md:301`

Que se observo:

- `middleware.ts` existe, pero `matcher: []` deja el middleware sin rutas activas.
- `/app` depende de `supabase.auth.getUser()` en `app/app/layout.tsx`.
- Si no hay usuario, se ejecuta `redirect('/login')`.
- `app/app/layout.tsx` consulta `contract_acceptances` por `user_id` y `contract_version = 'v1-placeholder'`.
- `webapp/lib/supabase/server.ts` usa `createServerClient` con `NEXT_PUBLIC_SUPABASE_URL` y `NEXT_PUBLIC_SUPABASE_ANON_KEY`.
- `setAll` existe, pero el `catch` vacio puede ocultar fallos de persistencia de cookies en Server Components.
- `webapp/lib/supabase/client.ts` usa `createBrowserClient` con anon public key.
- `DOCS/ENC-BE-001-findings.md` identifica riesgo de continuidad de sesion por refresh server-side no persistido.

### Clasificacion CISO propia

Clasificacion: **Medio**

No se observa bypass directo de autenticacion: si `getUser()` no devuelve usuario, `/app` redirige a `/login`. El riesgo CISO propio se clasifica como Medio por continuidad de sesion y degradacion operativa: middleware deshabilitado, `setAll` no persistente desde Server Components y errores de refresh potencialmente silenciosos. Esto puede provocar logout abrupto o estado de sesion inconsistente, sin evidencia de escalacion de privilegios.

## 6. OTP

### Fuente de evidencia

- Interna (repo/codigo/git/docs)
- Externa (Cloudflare, Supabase Dashboard, SaaS)

### Evidencia obtenida

Se reviso:

- `webapp/app/login/page.tsx`
- ADR-004 para intencion documental de OTP manual

Donde se reviso:

- `webapp/app/login/page.tsx:20`
- `webapp/app/login/page.tsx:23`
- `webapp/app/login/page.tsx:56`
- `webapp/app/login/page.tsx:58`
- `webapp/app/login/page.tsx:210`
- `webapp/app/login/page.tsx:211`
- `webapp/app/login/page.tsx:242`
- `ADR/ADR-004-smtp-resend-dominio-aiagro.md:19`
- `ADR/ADR-004-smtp-resend-dominio-aiagro.md:20`
- `ADR/ADR-004-smtp-resend-dominio-aiagro.md:39`

Que se observo:

- `signInWithOtp()` se ejecuta con `options.shouldCreateUser: false`.
- `verifyOtp()` envia `email`, `token: code.trim()` y `type: 'email'`.
- Input de codigo usa `pattern="[0-9]*"`.
- Input de codigo usa `maxLength={6}`.
- Boton de ingreso queda deshabilitado si `code.trim().length !== 6`.
- ADR-004 documenta OTP manual mediante `{{ .Token }}` y no `{{ .ConfirmationURL }}`.

Fuente externa:

NO VERIFICABLE EN ESTA AUDITORÍA

### Hallazgo

Clasificacion: **Bajo**

La implementacion frontend espera OTP manual de 6 digitos y no evidencia magic link en la llamada de codigo. La configuracion real de Supabase Auth/template no fue verificada en esta auditoria.

## Hallazgos por severidad

### Crítico

- Ninguno.

### Alto

- Ninguno.

### Medio

- DNS / Cloudflare: no se pudo verificar SPF/DKIM/DMARC efectivo ni estado real de Cloudflare en esta auditoria.
- Credenciales Resend: no se encontro secreto en repo, pero la ubicacion real/rotacion/alcance de API key en Supabase Dashboard no fue verificable.
- Middleware y sesion: middleware deshabilitado y refresh server-side no persistente desde Server Components generan riesgo de continuidad de sesion.

### Bajo

- RLS `contract_acceptances`: controles versionados correctos; riesgo residual bajo por no verificar despliegue externo.
- Secretos y `.env.local`: sin secretos reales detectados; `.env.local` ignorado y sin historial Git visible.
- OTP: UI alineada a 6 digitos; configuracion Supabase real no verificada.

### Informativo

- ADR-004 formaliza retroactivamente Resend, dominio corporativo y OTP manual.
- `INFRA/CLOUDFLARE.md` declara que no debe contener tokens ni credenciales.

## Hallazgos formales

### CISO-001

ID: CISO-001  
Título: Cloudflare DNS no verificable  
Descripción: No se pudo verificar externamente el estado efectivo de SPF, DKIM, DMARC ni registros Cloudflare para `aiagro.cl` durante esta auditoria.  
Evidencia: `ADR/ADR-004-smtp-resend-dominio-aiagro.md` documenta la necesidad de revision CISO/SRE de registros DNS; `INFRA/CLOUDFLARE.md` indica dominio pendiente de configurar y responsabilidades DNS/WAF/Rate Limiting. Fuente externa marcada como `NO VERIFICABLE EN ESTA AUDITORÍA`.  
Severidad: Medio  
Responsable de remediación: CTO  
Estado: Abierto - requiere evidencia externa.

### CISO-002

ID: CISO-002  
Título: Credenciales Resend externas no verificables  
Descripción: No se encontro secreto Resend expuesto en repo, pero no se pudo verificar visualmente la ubicacion real, alcance o rotacion de la API key en Supabase Dashboard.  
Evidencia: Busqueda interna de `resend`, `RESEND_API_KEY`, `service_role` y `SERVICE_ROLE`; ADR-004 deja pendiente confirmar gestion y ubicacion de credenciales API de Resend. Fuente externa marcada como `NO VERIFICABLE EN ESTA AUDITORÍA`.  
Severidad: Medio  
Responsable de remediación: Backend  
Estado: Abierto - requiere evidencia externa.

### CISO-003

ID: CISO-003  
Título: Riesgo continuidad de sesión por middleware deshabilitado  
Descripción: El guard de `/app` no evidencia bypass de autenticacion, pero existe riesgo de continuidad de sesion por middleware deshabilitado y refresh server-side no persistente desde Server Components.  
Evidencia: `webapp/middleware.ts:9` contiene `matcher: []`; `webapp/app/app/layout.tsx` depende de `supabase.auth.getUser()`; `webapp/lib/supabase/server.ts` incluye `setAll` con `catch` vacio; `DOCS/ENC-BE-001-findings.md` documenta riesgo de refresh server-side no persistido.  
Severidad: Medio  
Responsable de remediación: Backend  
Estado: Abierto - requiere tarea tecnica separada.

### CISO-004

ID: CISO-004  
Título: Validación externa RLS pendiente  
Descripción: La migracion versionada de `contract_acceptances` contiene controles RLS adecuados, pero esta auditoria no verifico el estado desplegado directamente en Supabase Dashboard.  
Evidencia: `webapp/supabase/migrations/0001_contract_acceptances.sql` habilita RLS, define politicas SELECT/INSERT con `auth.uid() = user_id` e indice unico `(user_id, contract_version)`.  
Severidad: Bajo  
Responsable de remediación: Backend  
Estado: Abierto - validacion externa pendiente.

### CISO-005

ID: CISO-005  
Título: Validación de secretos completada sin exposición detectada  
Descripción: La revision interna no encontro secretos reales versionados ni uso real de `service_role` en frontend.  
Evidencia: `.gitignore` y `webapp/.gitignore` ignoran `.env` y variantes; `git log --all -- webapp/.env.local` no devolvio commits; la busqueda interna solo encontro placeholder documental `SUPABASE_SERVICE_ROLE_KEY=NUNCA_EN_FRONTEND` en `.env.example`.  
Severidad: Bajo  
Responsable de remediación: CISO  
Estado: Cerrado para fuente interna - mantener monitoreo preventivo.

### CISO-006

ID: CISO-006  
Título: Configuración OTP externa no verificable  
Descripción: El frontend espera OTP manual de 6 digitos, pero la configuracion real de Supabase Auth/template no fue verificada externamente en esta auditoria.  
Evidencia: `webapp/app/login/page.tsx` usa `maxLength={6}`, `pattern="[0-9]*"` y deshabilita envio si `code.trim().length !== 6`; ADR-004 documenta OTP manual mediante `{{ .Token }}`. Fuente externa marcada como `NO VERIFICABLE EN ESTA AUDITORÍA`.  
Severidad: Bajo  
Responsable de remediación: Backend  
Estado: Abierto - requiere evidencia externa.

# Hallazgos Abiertos y Validaciones Pendientes del Usuario

Estos puntos fueron clasificados como NO VERIFICABLE EN ESTA AUDITORÍA y requieren evidencia externa.

## A. Cloudflare

- Verificar SPF.
- Verificar DKIM.
- Verificar DMARC.

## B. Resend

- Confirmar ubicación real de API Key.
- Confirmar almacenamiento exclusivo en Supabase Dashboard.

## C. OTP

- Confirmar Email OTP Length = 6.
- Adjuntar evidencia visual si aplica.
## Conteo de NO VERIFICABLE

Total: **3**

- DNS / Cloudflare: NO VERIFICABLE EN ESTA AUDITORÍA.
- Credenciales Resend en Supabase Dashboard: NO VERIFICABLE EN ESTA AUDITORÍA.
- Configuracion OTP real en Supabase Auth/template: NO VERIFICABLE EN ESTA AUDITORÍA.

NO VERIFICABLE en areas secretos/credenciales/RLS:

- Secretos: 0, porque el repo y Git history de `webapp/.env.local` fueron verificables sin exponer secretos.
- Credenciales: 1, por API key Resend en Supabase Dashboard.
- RLS: 0, porque la migracion versionada fue verificable.

## Reglas de decision GOV-SEC-001

- NO-GO por hallazgo Crítico: no aplica.
- NO-GO por 2 NO VERIFICABLE en secretos, credenciales o RLS: no aplica; solo hay 1 NO VERIFICABLE en credenciales y 0 en secretos/RLS.
- GO CON CONDICIONES por hallazgos Medio: aplica.
- GO limpio: no aplica por hallazgos Medio y fuentes externas no verificadas.

## Recomendacion CISO

**GO CON CONDICIONES**

Condiciones recomendadas antes de cerrar seguridad pre-ENC-FE-003:

1. Auditoria externa CISO/SRE de Cloudflare para confirmar SPF, DKIM, DMARC y registros requeridos por Resend.
2. Verificacion controlada de Supabase Dashboard/secret store para confirmar ubicacion, alcance y rotacion de credenciales Resend, sin exponer API key.
3. Verificacion controlada de template/configuracion OTP real en Supabase DEV.
4. Registrar como brecha operativa el riesgo Medio de continuidad de sesion por middleware deshabilitado y refresh server-side no persistente.
## Tabla final de cierre

### Resumen por severidad

| Severidad | Conteo |
|---|---:|
| Crítico | 0 |
| Alto | 0 |
| Medio | 3 |
| Bajo | 3 |
| Informativo | 2 |

### Resumen NO VERIFICABLE

Total: **3**

| Categoría | Conteo | Casos |
|---|---:|---|
| DNS / Cloudflare | 1 | SPF, DKIM, DMARC y estado Cloudflare real |
| Credenciales | 1 | API key Resend en Supabase Dashboard |
| OTP / Supabase Auth | 1 | Email OTP Length y template/configuracion real |
| Secretos | 0 | Repo e historial verificables sin exposicion detectada |
| RLS | 0 | Migracion versionada verificable |

