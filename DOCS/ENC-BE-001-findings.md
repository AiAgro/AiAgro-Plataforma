# ENC-BE-001 — Investigación: Refresco de Sesión Server-Side sin Middleware

**Documento:** Hallazgos técnicos (investigación, sin implementación)
**Dominio:** 04 Backend — Supabase API, Auth, RLS
**Fecha:** 2026-06-13
**Ambiente:** DEV (`jkuvsjvwmsrximcyarpt`), servidor local `npm run dev` (Next.js 16 / Turbopack)

---

## 1. Resumen ejecutivo

Con `middleware.ts` deshabilitado (`matcher: []`), el guard de acceso a
`/app` depende exclusivamente de `supabase.auth.getUser()` dentro de
`app/app/layout.tsx` (Server Component). El guard funciona correctamente
para los casos **sin sesión** y **cookie de sesión inválida** (verificado
con `curl`, ambos casos redirigen 307 a `/login`).

El riesgo identificado no es de **acceso no autorizado** — el guard
redirige correctamente cuando `getUser()` no devuelve un usuario válido.
El riesgo es de **continuidad de sesión**: `lib/supabase/server.ts` define
un callback `setAll` que falla silenciosamente (`catch {}`) porque los
Server Components no pueden escribir cookies. Según la documentación
oficial de `@supabase/ssr`, sin un punto de refresco (normalmente
middleware) que persista el `setAll`, un refresh de token exitoso en el
servidor puede no propagarse al navegador, y el siguiente request puede
fallar al reintentar refrescar con un refresh token ya consumido
("single-use"), resultando en **logout abrupto sin aviso** ("repeated
refresh failures and user logouts", según docs de `@supabase/ssr`).

**Nivel de riesgo: Medio.**

---

## 2. Contexto

- ENC-FE-002 está cerrado y certificado (QA-CERT-ENC-FE-002).
- BR-09 cerrado vía ADR-004.
- Login OTP funciona end-to-end en DEV (según QA-CERT-ENC-FE-002).
- `middleware.ts` permanece deshabilitado (`matcher: []`) por el hotfix
  `835ef5e` (`MIDDLEWARE_INVOCATION_FAILED`, incidente de producción). Esta
  investigación **no propone reactivarlo**.

---

## 3. Archivos revisados

### `webapp/app/app/layout.tsx`

```tsx
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import ContractGate from '@/components/auth/ContractGate'

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  const { data: acceptance } = await supabase
    .from('contract_acceptances')
    .select('id')
    .eq('user_id', user.id)
    .eq('contract_version', 'v1-placeholder')
    .maybeSingle()

  return (
    <ContractGate accepted={!!acceptance} userId={user.id}>
      {children}
    </ContractGate>
  )
}
```

- El guard depende **únicamente** de `getUser()`. Si `user` es `null`
  (sin sesión, cookie inválida, o refresh fallido), redirige a `/login`.
- No hay chequeo explícito de expiración (`expires_at`) ni manejo
  diferenciado de "sesión ausente" vs. "sesión expirada/zombie".

### `webapp/lib/supabase/server.ts`

```ts
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

export async function createClient() {
  const cookieStore = await cookies()

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            )
          } catch {
            // Server Component — cookies son de solo lectura desde aquí
          }
        },
      },
    }
  )
}
```

- `getAll` lee las cookies del request — correcto.
- `setAll` **existe**, pero está envuelto en `try/catch` porque
  `cookies().set()` lanza error cuando se invoca desde un Server Component
  (restricción de Next.js: solo Route Handlers, Server Actions y
  middleware pueden escribir cookies). El `catch` está vacío — cualquier
  intento de refresco de token que `@supabase/ssr` quiera persistir vía
  `setAll` se descarta silenciosamente cuando `createClient()` se usa
  desde `app/app/layout.tsx`.
- No existe ningún Route Handler ni Server Action en el repo que
  reutilice `createClient()` de `server.ts` para persistir un refresh
  (búsqueda limitada a los archivos en alcance de esta investigación).

### `webapp/lib/supabase/client.ts`

```ts
import { createBrowserClient } from '@supabase/ssr'

export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}
```

- Cliente de navegador estándar, sin opciones adicionales. Por defecto,
  `createBrowserClient` mantiene `autoRefreshToken: true` y
  `persistSession: true`, por lo que **mientras una pestaña con un
  Client Component que instancie este cliente permanezca abierta**, el
  refresh de token ocurre en background y se persiste en cookies desde
  el navegador — sin depender de middleware.
- Esto es una mitigación **parcial**: cubre sesiones largas con la pestaña
  abierta, pero no cubre una navegación/recarga a `/app` que llegue al
  servidor con un access token ya expirado y un refresh token cuyo
  refresco en el servidor no pueda persistirse (ver punto anterior).

### `webapp/middleware.ts` (solo lectura)

```ts
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  return NextResponse.next()
}

export const config = {
  matcher: []
}
```

- `matcher: []` — el middleware no se invoca para ninguna ruta. No
  modificado, no reactivado, conforme a restricciones.

---

## 4. Documentación Supabase revisada

Fuente: `@supabase/ssr` (Context7 `/supabase/ssr`).

- **`createServerClient` — Behavior Notes**: "Middleware required: For
  most SSR frameworks, you must set up middleware that calls this
  function early in the request lifecycle... This ensures token refreshes
  are persisted to the response." Y: "Token refresh handling: When a
  token refresh occurs, the updated session is automatically written back
  to cookies through the `setAll` callback if provided."
  (https://github.com/supabase/ssr/blob/main/_autodocs/api-reference/createServerClient.md)

- **`CookieMethodsServer`**: "The `setAll` property is optional but
  strongly recommended, especially for middleware, to persist token
  refreshes to the response. Without `setAll`, a warning is logged when
  the client needs to write cookies."
  (https://github.com/supabase/ssr/blob/main/_autodocs/types.md)

- **Concurrent Request Handling**: "When two requests arrive
  simultaneously with an expired session, the first request triggers a
  token refresh. The second request's refresh attempt fails because the
  refresh token is single-use and already consumed. This results in the
  second request receiving `session: null` until the browser syncs the
  updated cookie from the first response. The middleware pattern
  mitigates this by refreshing sessions once per navigation before page
  rendering."
  (https://github.com/supabase/ssr/blob/main/_autodocs/api-reference/internal-utilities.md)

- **Middleware Pattern**: "The middleware must also provide `setAll` to
  persist token refreshes to the response, as failure to do so can lead
  to repeated refresh failures and user logouts."
  (https://github.com/supabase/ssr/blob/main/_autodocs/README.md)

- **Fresh Page Load Flow**: "If the access token has expired, the server
  calls the Supabase Auth refresh token endpoint to obtain a new token,
  then calls `setAll` with updated cookies to sync the browser and server
  session state."
  (https://github.com/supabase/ssr/blob/main/docs/design.md)

---

## 5. Comportamiento actual

### Cómo se crea el cliente server-side
`createClient()` (`server.ts`) crea un `createServerClient` por request,
con `getAll` funcional y `setAll` que falla silenciosamente fuera de
contextos que permiten escritura de cookies (Route Handler / Server
Action / middleware). `app/app/layout.tsx` es un Server Component →
`setAll` nunca persiste.

### Cómo se leen las cookies
Vía `cookies()` de `next/headers`, lectura estándar del request actual —
correcto y funcional.

### ¿Existe capacidad real de escribir/refrescar cookies server-side?
Técnicamente sí (`setAll` está implementado), pero **no se ejecuta con
éxito** desde `app/app/layout.tsx` por la restricción de Next.js sobre
escritura de cookies en Server Components. No hay middleware ni Route
Handler/Server Action en el alcance revisado que cumpla este rol.

### Cómo decide `/app/layout.tsx` redirigir a `/login`
Únicamente por `if (!user) redirect('/login')`, donde `user` proviene de
`getUser()`. No hay lógica adicional de expiración.

### ¿El guard depende solo de `getUser()`?
Sí.

### ¿Riesgo de sesión expirada o "zombie session"?
- **Acceso indebido tras expiración total:** No observado — `getUser()`
  con cookie inválida/ausente devuelve `user: null` y redirige
  correctamente (ver evidencia §6).
- **Riesgo real:** degradación de continuidad de sesión. Si el access
  token expira y el refresh token aún es válido, `getUser()` puede
  refrescar exitosamente en memoria para el request actual (la página
  renderiza), pero el `setAll` no persiste el nuevo refresh token
  (single-use) en la cookie del navegador. El siguiente request server-side
  reintenta refrescar con un refresh token ya consumido → falla →
  `getUser()` devuelve `null` → redirect abrupto a `/login`, sin mensaje
  de "tu sesión expiró". Esto coincide textualmente con el riesgo
  documentado por Supabase: "repeated refresh failures and user logouts".
- El cliente de navegador (`client.ts`, `autoRefreshToken: true`) mitiga
  parcialmente este riesgo mientras la pestaña permanece abierta y con un
  Client Component montado, pero no cubre una navegación/recarga a `/app`
  que llegue al servidor justo después de la expiración del access token.

---

## 6. Evidencia de prueba

**Método usado:** `curl` contra el servidor de desarrollo local
(`http://localhost:3000`, `npm run dev`, Turbopack), sin browser
automation disponible en este entorno.

**Estado inicial:** sin sesión autenticada (sin cookies enviadas) y, en
un segundo caso, con una cookie de sesión deliberadamente inválida
(`sb-jkuvsjvwmsrximcyarpt-auth-token=invalid-garbage-value`).

**Navegación a `/app` — resultados:**

```
GET /app (sin cookies)              -> HTTP 307, redirect: http://localhost:3000/login
GET /app (cookie sb-...=invalid-garbage-value) -> HTTP 307, redirect: http://localhost:3000/login
GET /login                          -> HTTP 200
```

**Respuestas explícitas:**

- **¿Redirige correctamente a `/login`?** Sí, en ambos casos probados
  (sin sesión, cookie inválida) — `HTTP 307` → `/login`.
- **¿Muestra error visible?** No — la respuesta es un redirect HTTP
  estándar, sin página de error.
- **¿Queda sesión zombie?** No se observó en los casos probados (sin
  sesión / cookie inválida). El escenario de "zombie" descrito en §5
  (refresh exitoso no persistido → fallo en el siguiente request) **no
  pudo reproducirse de forma controlada** en esta sesión: requiere una
  sesión real previamente autenticada cuyo access token expire entre dos
  requests server-side, lo cual exige login OTP real (email) y espera de
  expiración o manipulación de tiempo del token — fuera del alcance sin
  browser automation ni acceso a una sesión autenticada activa.
- **¿Falla alguna acción posterior?** No verificado directamente (depende
  del escenario de refresh fallido descrito arriba, no reproducido).
- **¿Se refresca sesión automáticamente o no?** Server-side: `getUser()`
  puede intentar refrescar, pero `setAll` no persiste el resultado desde
  un Server Component (confirmado por lectura de código, no por
  ejecución). Client-side: sí, vía `autoRefreshToken: true` en
  `createBrowserClient`, mientras la pestaña esté abierta.

---

## 7. Nivel de riesgo

**Medio.**

- No hay evidencia de acceso no autorizado (el guard redirige
  correctamente ante ausencia/invalidez de sesión).
- Existe un riesgo documentado por la propia librería (`@supabase/ssr`)
  de logout abrupto / fallos repetidos de refresh por la ausencia de un
  punto que persista `setAll` (normalmente middleware), agravado por el
  uso de refresh tokens de un solo uso.
- El impacto es de continuidad/UX (sesión más corta de lo esperado,
  posible pérdida de estado en `/app`), no de confidencialidad ni
  integridad de datos.

---

## 8. Conclusión

El guard de `/app` es funcionalmente correcto para los casos verificados
(sin sesión, sesión inválida → redirect a `/login`). Sin embargo, la
arquitectura actual (sin middleware, `setAll` no persistente desde Server
Components) no cumple el patrón recomendado por `@supabase/ssr` para
refresco de sesión, lo que puede causar cierres de sesión inesperados en
escenarios de expiración de access token con refresh token de un solo
uso. No se identificó riesgo de seguridad (acceso indebido); el riesgo es
de continuidad de sesión / UX.

---

## 9. Mitigaciones propuestas (sin reactivar `middleware.ts`)

Solo como propuesta — **no implementadas**.

1. **Server Action / Route Handler de refresco de sesión**, invocado desde
   un listener `onAuthStateChange` (`TOKEN_REFRESHED`) en un Client
   Component ya presente en `/app`. A diferencia de un Server Component,
   un Route Handler o Server Action SÍ puede ejecutar `cookies().set()`,
   por lo que `setAll` de `server.ts` persistiría correctamente el
   refresh token rotado, cerrando la brecha descrita en §5 sin tocar
   `middleware.ts`.

2. **Logout explícito ante sesión inválida** en `app/app/layout.tsx`: si
   `getUser()` devuelve `user: null`, invocar
   `await supabase.auth.signOut()` antes de `redirect('/login')`. Esto
   limpia cookies de sesión potencialmente inconsistentes (p. ej. refresh
   token ya consumido) en lugar de dejarlas en un estado indeterminado que
   podría provocar reintentos de refresco fallidos en requests
   posteriores.

---

## 10. Confirmación

`middleware.ts` sin modificaciones — ver §11 (validación `git diff`).

---

## 11. Validación

```
git status --branch --short
## docs/enc-be-001-session-refresh-investigation
?? DOCS/ENC-BE-001-findings.md

git diff -- middleware.ts
(sin salida — sin cambios)
```

`middleware.ts` sin modificaciones — confirmado.

---

## 12. Pendientes recomendados

- Registrar como brecha de gobernanza (nueva BR) el riesgo "Medio"
  descrito en §7, vinculada a la futura reactivación/diseño de
  `middleware.ts` (actualmente deshabilitado por hotfix `835ef5e`).
- Si se decide implementar alguna de las mitigaciones de §9, requiere su
  propio ADR/encargo (cambio funcional, fuera del alcance de ENC-BE-001).
- Validar en un entorno con sesión real (browser automation o prueba
  manual) el escenario de expiración de access token con refresh token de
  un solo uso, para confirmar o descartar el riesgo "Medio" con evidencia
  E2E.
