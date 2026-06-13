# ENC-FE-002 — Login Email OTP + Contrato + Responsive Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Cerrar técnicamente Fase 1 implementando login Email OTP de 2 pasos (BR-01), modal de aceptación de contrato con registro en Supabase (BR-02), y corrigiendo el overflow horizontal de los videos de fondo en mobile (BR-03).

**Architecture:** Reemplazo completo del flujo de login (`webapp/app/login/page.tsx`) por un formulario de 2 pasos sobre Supabase Auth (`signInWithOtp` → `verifyOtp`), eliminando el callback de magic-link. Nueva ruta protegida `webapp/app/app/` con guard server-side (sin middleware) que envuelve su contenido en `ContractGate`, un componente cliente que bloquea el acceso hasta que el usuario acepta el contrato (registrado en la tabla `contract_acceptances` vía RLS). Fix de responsive aplicado a `globals.css` y `VideoBackground.tsx`.

**Tech Stack:** Next.js 16 (App Router, Server Components), React 19, TypeScript, `@supabase/ssr` + `@supabase/supabase-js`, Tailwind CSS 4. Sin framework de tests — verificación vía `npm run lint`, `npm run build` y revisión manual en navegador (`npm run dev`).

---

## File Structure

| Archivo | Acción | Responsabilidad |
|---|---|---|
| `webapp/app/login/page.tsx` | Reescribir | UI de login de 2 pasos (email → código OTP) |
| `webapp/app/auth/callback/route.ts` | Eliminar | Quedaba huérfano (flujo de magic-link retirado) |
| `webapp/supabase/email-templates/otp-email.html` | Crear | Plantilla de email con `{{ .Token }}` para pegar en Supabase Dashboard |
| `webapp/supabase/migrations/0001_contract_acceptances.sql` | Crear | Esquema + RLS de `contract_acceptances` |
| `webapp/components/auth/ContractGate.tsx` | Crear | Modal bloqueante de aceptación de contrato |
| `webapp/components/auth/LogoutButton.tsx` | Crear | Botón de cierre de sesión (necesario para probar el flujo repetidamente) |
| `webapp/app/app/layout.tsx` | Crear | Guard server-side de `/app` + chequeo de aceptación de contrato |
| `webapp/app/app/page.tsx` | Crear | Página mínima de prueba de la ruta protegida |
| `webapp/app/globals.css` | Modificar | `overflow-x: hidden` en `html, body` (BR-03) |
| `webapp/components/landing/VideoBackground.tsx` | Modificar | `100vw`/`100vh` explícitos en vez de `100%` (BR-03) |
| `DOCS/ESTADO_FASE_1.md` | Modificar | Marcar BR-01, BR-02, BR-03 como resueltos |

---

## Task 1: Login Email OTP de 2 pasos (BR-01)

**Files:**
- Modify: `webapp/app/login/page.tsx`
- Delete: `webapp/app/auth/callback/route.ts`
- Create: `webapp/supabase/email-templates/otp-email.html`

- [ ] **Step 1: Reescribir `webapp/app/login/page.tsx` con el flujo de 2 pasos**

Reemplazar el contenido completo del archivo por:

```tsx
'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

type Step = 'email' | 'code'
type Status = 'idle' | 'loading' | 'error'

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [code, setCode] = useState('')
  const [step, setStep] = useState<Step>('email')
  const [status, setStatus] = useState<Status>('idle')
  const [errorMessage, setErrorMessage] = useState('')

  async function sendCode(targetEmail: string) {
    const supabase = createClient()
    const { error } = await supabase.auth.signInWithOtp({
      email: targetEmail,
      options: {
        shouldCreateUser: false, // sin registro público
      },
    })
    return error
  }

  async function handleEmailSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    if (!email.trim()) return

    setStatus('loading')
    setErrorMessage('')

    const error = await sendCode(email.trim())

    if (error) {
      setStatus('error')
      setErrorMessage('No se pudo enviar el código. Verifica el correo e intenta nuevamente.')
      return
    }

    setStatus('idle')
    setStep('code')
  }

  async function handleCodeSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    if (!code.trim()) return

    setStatus('loading')
    setErrorMessage('')

    const supabase = createClient()
    const { error } = await supabase.auth.verifyOtp({
      email: email.trim(),
      token: code.trim(),
      type: 'email',
    })

    if (error) {
      setStatus('error')
      setErrorMessage('Código inválido o expirado. Solicita uno nuevo.')
      return
    }

    router.push('/app')
  }

  async function handleResend() {
    setStatus('loading')
    setErrorMessage('')

    const error = await sendCode(email.trim())

    if (error) {
      setStatus('error')
      setErrorMessage('No se pudo reenviar el código. Intenta nuevamente.')
      return
    }

    setStatus('idle')
  }

  function handleChangeEmail() {
    setStep('email')
    setCode('')
    setStatus('idle')
    setErrorMessage('')
  }

  return (
    <main style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'linear-gradient(135deg, #0a2e0a 0%, #0f1f0f 100%)',
      padding: '24px',
    }}>
      <div style={{ width: '100%', maxWidth: '400px' }}>

        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <p style={{ fontSize: '2rem', fontWeight: 700, color: 'white', margin: 0, letterSpacing: '-0.02em' }}>
            Aiagro<span style={{ color: '#4ade80' }}>.cl</span>
          </p>
          <p style={{ color: 'rgba(255,255,255,0.45)', fontSize: '0.875rem', marginTop: '8px' }}>
            Acceso restringido — solo usuarios autorizados
          </p>
        </div>

        {/* Card */}
        <div style={{
          backgroundColor: 'rgba(255,255,255,0.04)',
          border: '1px solid rgba(255,255,255,0.08)',
          borderRadius: '16px',
          padding: '32px',
        }}>

          {step === 'email' ? (
            <form onSubmit={handleEmailSubmit}>
              <h2 style={{ color: 'white', fontSize: '1.15rem', fontWeight: 600, margin: '0 0 6px' }}>
                Ingresa con tu correo
              </h2>
              <p style={{ color: 'rgba(255,255,255,0.45)', fontSize: '0.8rem', margin: '0 0 24px' }}>
                Te enviaremos un código de acceso de 6 dígitos
              </p>

              <label style={{
                display: 'block',
                color: 'rgba(255,255,255,0.6)',
                fontSize: '0.8rem',
                fontWeight: 500,
                marginBottom: '8px',
                letterSpacing: '0.04em',
              }}>
                CORREO ELECTRÓNICO
              </label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="tu@correo.cl"
                required
                disabled={status === 'loading'}
                style={{
                  width: '100%',
                  padding: '12px 14px',
                  backgroundColor: 'rgba(255,255,255,0.06)',
                  border: `1px solid ${status === 'error' ? 'rgba(248,113,113,0.5)' : 'rgba(255,255,255,0.12)'}`,
                  borderRadius: '10px',
                  color: 'white',
                  fontSize: '0.95rem',
                  outline: 'none',
                  boxSizing: 'border-box',
                  marginBottom: status === 'error' ? '8px' : '20px',
                  transition: 'border-color 0.2s',
                }}
              />

              {status === 'error' && (
                <p style={{ color: 'rgba(248,113,113,0.9)', fontSize: '0.8rem', margin: '0 0 20px' }}>
                  {errorMessage}
                </p>
              )}

              <button
                type="submit"
                disabled={status === 'loading' || !email.trim()}
                style={{
                  width: '100%',
                  padding: '12px',
                  backgroundColor: status === 'loading' ? 'rgba(22,163,74,0.5)' : '#16a34a',
                  border: 'none',
                  borderRadius: '10px',
                  color: 'white',
                  fontSize: '0.95rem',
                  fontWeight: 600,
                  cursor: status === 'loading' ? 'not-allowed' : 'pointer',
                  transition: 'background-color 0.2s',
                }}
              >
                {status === 'loading' ? 'Enviando...' : 'Enviar código'}
              </button>
            </form>
          ) : (
            <form onSubmit={handleCodeSubmit}>
              <h2 style={{ color: 'white', fontSize: '1.15rem', fontWeight: 600, margin: '0 0 6px' }}>
                Ingresa el código
              </h2>
              <p style={{ color: 'rgba(255,255,255,0.55)', fontSize: '0.8rem', lineHeight: 1.6, margin: '0 0 24px' }}>
                Enviamos un código de 6 dígitos a <strong style={{ color: 'rgba(255,255,255,0.85)' }}>{email}</strong>
              </p>

              <label style={{
                display: 'block',
                color: 'rgba(255,255,255,0.6)',
                fontSize: '0.8rem',
                fontWeight: 500,
                marginBottom: '8px',
                letterSpacing: '0.04em',
              }}>
                CÓDIGO DE 6 DÍGITOS
              </label>
              <input
                type="text"
                inputMode="numeric"
                pattern="[0-9]*"
                maxLength={6}
                value={code}
                onChange={e => setCode(e.target.value.replace(/\D/g, ''))}
                placeholder="000000"
                required
                disabled={status === 'loading'}
                style={{
                  width: '100%',
                  padding: '12px 14px',
                  backgroundColor: 'rgba(255,255,255,0.06)',
                  border: `1px solid ${status === 'error' ? 'rgba(248,113,113,0.5)' : 'rgba(255,255,255,0.12)'}`,
                  borderRadius: '10px',
                  color: 'white',
                  fontSize: '1.25rem',
                  letterSpacing: '0.3em',
                  textAlign: 'center',
                  outline: 'none',
                  boxSizing: 'border-box',
                  marginBottom: status === 'error' ? '8px' : '20px',
                  transition: 'border-color 0.2s',
                }}
              />

              {status === 'error' && (
                <p style={{ color: 'rgba(248,113,113,0.9)', fontSize: '0.8rem', margin: '0 0 20px' }}>
                  {errorMessage}
                </p>
              )}

              <button
                type="submit"
                disabled={status === 'loading' || code.trim().length !== 6}
                style={{
                  width: '100%',
                  padding: '12px',
                  backgroundColor: status === 'loading' ? 'rgba(22,163,74,0.5)' : '#16a34a',
                  border: 'none',
                  borderRadius: '10px',
                  color: 'white',
                  fontSize: '0.95rem',
                  fontWeight: 600,
                  cursor: status === 'loading' ? 'not-allowed' : 'pointer',
                  transition: 'background-color 0.2s',
                  marginBottom: '16px',
                }}
              >
                {status === 'loading' ? 'Verificando...' : 'Ingresar'}
              </button>

              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem' }}>
                <button
                  type="button"
                  onClick={handleChangeEmail}
                  style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.5)', cursor: 'pointer', textDecoration: 'underline', padding: 0 }}
                >
                  Usar otro correo
                </button>
                <button
                  type="button"
                  onClick={handleResend}
                  disabled={status === 'loading'}
                  style={{ background: 'none', border: 'none', color: '#4ade80', cursor: 'pointer', textDecoration: 'underline', padding: 0 }}
                >
                  Reenviar código
                </button>
              </div>
            </form>
          )}

        </div>

        {/* Footer */}
        <p style={{ textAlign: 'center', color: 'rgba(255,255,255,0.2)', fontSize: '0.75rem', marginTop: '24px' }}>
          Plataforma de uso interno · Aiagro.cl
        </p>
      </div>
    </main>
  )
}
```

- [ ] **Step 2: Eliminar la ruta de magic-link callback**

```bash
git rm webapp/app/auth/callback/route.ts
```

- [ ] **Step 3: Crear la plantilla de email OTP**

Crear `webapp/supabase/email-templates/otp-email.html`:

```html
<!--
  Plantilla de email "Magic Link / OTP" — Supabase Dashboard
  Ruta: Authentication → Email Templates → Magic Link
  IMPORTANTE: usar {{ .Token }} (código de 6 dígitos), NO {{ .ConfirmationURL }}
-->
<div style="background-color:#0f1f0f; padding:40px 24px; font-family:Arial, Helvetica, sans-serif;">
  <div style="max-width:420px; margin:0 auto; background-color:rgba(255,255,255,0.04); border:1px solid rgba(255,255,255,0.08); border-radius:16px; padding:32px;">

    <!-- PLACEHOLDER LOGO -->
    <div style="text-align:center; margin-bottom:32px;">
      <span style="font-size:28px; font-weight:700; color:#ffffff; letter-spacing:-0.02em;">
        Aiagro<span style="color:#4ade80;">.cl</span>
      </span>
    </div>

    <h2 style="color:#ffffff; font-size:18px; font-weight:600; margin:0 0 12px; text-align:center;">
      Tu código de acceso
    </h2>
    <p style="color:rgba(255,255,255,0.55); font-size:14px; line-height:1.6; margin:0 0 24px; text-align:center;">
      Ingresa el siguiente código en la pantalla de inicio de sesión de Aiagro.cl.
      Es válido por 60 minutos.
    </p>

    <div style="background-color:rgba(74,222,128,0.1); border:1px solid rgba(74,222,128,0.3); border-radius:10px; padding:16px; text-align:center; margin-bottom:24px;">
      <span style="color:#4ade80; font-size:32px; font-weight:700; letter-spacing:0.3em;">
        {{ .Token }}
      </span>
    </div>

    <p style="color:rgba(255,255,255,0.35); font-size:12px; text-align:center; margin:0;">
      Si no solicitaste este código, puedes ignorar este correo.
    </p>
  </div>

  <p style="text-align:center; color:rgba(255,255,255,0.2); font-size:11px; margin-top:24px;">
    Plataforma de uso interno · Aiagro.cl
  </p>
</div>
```

- [ ] **Step 4: Verificar lint**

Run: `npm --prefix webapp run lint`
Expected: sin errores (puede haber warnings preexistentes no relacionados).

- [ ] **Step 5: Verificar build**

Run: `npm --prefix webapp run build`
Expected: `Compiled successfully`. La ruta `/auth/callback` ya no debe aparecer en el listado de rutas; `/login` debe compilar como ruta cliente.

- [ ] **Step 6: Commit**

```bash
git add webapp/app/login/page.tsx webapp/app/auth/callback/route.ts webapp/supabase/email-templates/otp-email.html
git commit -m "feat: implementar login con Email OTP (Supabase Auth)"
```

---

## Task 2: Ruta protegida `/app` + Aviso de contrato (BR-01 / BR-02)

**Files:**
- Create: `webapp/supabase/migrations/0001_contract_acceptances.sql`
- Create: `webapp/components/auth/ContractGate.tsx`
- Create: `webapp/components/auth/LogoutButton.tsx`
- Create: `webapp/app/app/layout.tsx`
- Create: `webapp/app/app/page.tsx`

- [ ] **Step 1: Crear la migración SQL de `contract_acceptances`**

Crear `webapp/supabase/migrations/0001_contract_acceptances.sql`:

```sql
-- ENC-FE-002 / ADR-003: registro de aceptación de aviso de contrato (BR-02)

create table if not exists public.contract_acceptances (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  accepted_at timestamptz not null default now(),
  contract_version text not null
);

alter table public.contract_acceptances enable row level security;

create policy "Users can view own contract acceptances"
  on public.contract_acceptances
  for select
  to authenticated
  using (auth.uid() = user_id);

create policy "Users can insert own contract acceptances"
  on public.contract_acceptances
  for insert
  to authenticated
  with check (auth.uid() = user_id);
```

Nota: este archivo queda versionado en el repo. Aplicarlo al proyecto Supabase real (DEV) es un paso manual posterior — sin esa tabla, `ContractGate` mostrará el modal de forma permanente (fail-safe: bloquea acceso en vez de fallar abierto).

- [ ] **Step 2: Crear `ContractGate`**

Crear `webapp/components/auth/ContractGate.tsx`:

```tsx
'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'

export const CONTRACT_VERSION = 'v1-placeholder'

interface ContractGateProps {
  accepted: boolean
  userId: string
  children: React.ReactNode
}

export default function ContractGate({ accepted, userId, children }: ContractGateProps) {
  const [isAccepted, setIsAccepted] = useState(accepted)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  async function handleAccept() {
    setSubmitting(true)
    setError('')

    const supabase = createClient()
    const { error: insertError } = await supabase
      .from('contract_acceptances')
      .insert({ user_id: userId, contract_version: CONTRACT_VERSION })

    if (insertError) {
      setError('No se pudo registrar tu aceptación. Intenta nuevamente.')
      setSubmitting(false)
      return
    }

    setIsAccepted(true)
  }

  if (isAccepted) {
    return <>{children}</>
  }

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      zIndex: 100,
      backgroundColor: 'rgba(0,0,0,0.75)',
      backdropFilter: 'blur(4px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '24px',
    }}>
      <div style={{
        backgroundColor: 'rgba(5,20,5,0.97)',
        border: '1px solid rgba(74,222,128,0.2)',
        borderRadius: '20px',
        padding: '32px',
        maxWidth: '480px',
        width: '100%',
      }}>
        <h2 style={{ color: 'white', fontSize: '1.2rem', fontWeight: 700, margin: '0 0 16px' }}>
          Aviso de Contrato
        </h2>
        <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.9rem', lineHeight: 1.7, margin: '0 0 24px' }}>
          [PENDIENTE TEXTO LEGAL - Producto/Legal debe reemplazar]
        </p>

        {error && (
          <p style={{ color: 'rgba(248,113,113,0.9)', fontSize: '0.8rem', margin: '0 0 16px' }}>
            {error}
          </p>
        )}

        <button
          onClick={handleAccept}
          disabled={submitting}
          style={{
            width: '100%',
            padding: '12px',
            backgroundColor: submitting ? 'rgba(22,163,74,0.5)' : '#16a34a',
            border: 'none',
            borderRadius: '10px',
            color: 'white',
            fontSize: '0.95rem',
            fontWeight: 600,
            cursor: submitting ? 'not-allowed' : 'pointer',
          }}
        >
          {submitting ? 'Procesando...' : 'Aceptar y continuar'}
        </button>
      </div>
    </div>
  )
}
```

- [ ] **Step 3: Crear `LogoutButton`**

Crear `webapp/components/auth/LogoutButton.tsx`:

```tsx
'use client'

import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

export default function LogoutButton() {
  const router = useRouter()

  async function handleLogout() {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/login')
  }

  return (
    <button
      onClick={handleLogout}
      style={{
        padding: '10px 20px',
        backgroundColor: 'rgba(255,255,255,0.06)',
        border: '1px solid rgba(255,255,255,0.12)',
        borderRadius: '10px',
        color: 'white',
        fontSize: '0.875rem',
        fontWeight: 500,
        cursor: 'pointer',
      }}
    >
      Cerrar sesión
    </button>
  )
}
```

- [ ] **Step 4: Crear el guard server-side `/app/layout.tsx`**

Crear `webapp/app/app/layout.tsx`:

```tsx
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import ContractGate, { CONTRACT_VERSION } from '@/components/auth/ContractGate'

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
    .eq('contract_version', CONTRACT_VERSION)
    .maybeSingle()

  return (
    <ContractGate accepted={!!acceptance} userId={user.id}>
      {children}
    </ContractGate>
  )
}
```

- [ ] **Step 5: Crear la página de prueba `/app/page.tsx`**

Crear `webapp/app/app/page.tsx`:

```tsx
import { createClient } from '@/lib/supabase/server'
import LogoutButton from '@/components/auth/LogoutButton'

export default async function AppPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  return (
    <main style={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '16px',
      background: 'linear-gradient(135deg, #0a2e0a 0%, #0f1f0f 100%)',
      color: 'white',
      padding: '24px',
      textAlign: 'center',
    }}>
      <h1 style={{ fontSize: '1.5rem', fontWeight: 700 }}>
        Acceso autenticado ✓
      </h1>
      <p style={{ color: 'rgba(255,255,255,0.6)' }}>
        {user?.email}
      </p>
      <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.85rem', maxWidth: '420px' }}>
        Ruta protegida de prueba — valida el flujo de login Email OTP (ENC-FE-002).
        No es el dashboard final.
      </p>
      <LogoutButton />
    </main>
  )
}
```

- [ ] **Step 6: Verificar lint y build**

Run: `npm --prefix webapp run lint`
Expected: sin errores nuevos.

Run: `npm --prefix webapp run build`
Expected: `Compiled successfully`. Debe listar las rutas `/app` (con su layout) y `/login`.

- [ ] **Step 7: Verificar el guard sin sesión**

Run: `npm --prefix webapp run dev`, luego abrir `http://localhost:3000/app` en el navegador sin haber iniciado sesión (sin cookies de Supabase).
Expected: redirección automática a `/login`.

Nota: la verificación completa del modal de contrato y del flujo OTP de extremo a extremo requiere un usuario provisionado en Supabase Auth y acceso a su correo — esto forma parte de la "Evidencia Esperada al Cierre" (sección 7 de ENC-FE-002) y se ejecuta como paso manual posterior, junto con aplicar la migración `0001_contract_acceptances.sql`.

- [ ] **Step 8: Commit**

```bash
git add webapp/supabase/migrations/0001_contract_acceptances.sql webapp/components/auth/ContractGate.tsx webapp/components/auth/LogoutButton.tsx webapp/app/app/layout.tsx webapp/app/app/page.tsx
git commit -m "feat: modal de aceptación de contrato + tabla contract_acceptances"
```

---

## Task 3: Responsive de videos en landing (BR-03)

**Files:**
- Modify: `webapp/app/globals.css`
- Modify: `webapp/components/landing/VideoBackground.tsx`

- [ ] **Step 1: Evitar overflow horizontal a nivel de documento**

En `webapp/app/globals.css`, agregar al final del archivo (después de la regla `body { ... }`):

```css

html,
body {
  overflow-x: hidden;
  max-width: 100vw;
}
```

- [ ] **Step 2: Anclar el fondo de video al viewport con unidades explícitas**

En `webapp/components/landing/VideoBackground.tsx`, en el `<div>` contenedor (el que tiene `position: 'fixed', inset: 0, zIndex: -10, ...`), agregar `width` y `height` explícitos:

```tsx
      style={{
        position: 'fixed',
        inset: 0,
        width: '100vw',
        height: '100vh',
        zIndex: -10,
        backgroundColor: '#000',
        overflow: 'hidden',
      }}
```

Luego, en el estilo de cada `<video>`, cambiar `width: '100%'` y `height: '100%'` por `width: '100vw'` y `height: '100vh'`:

```tsx
          style={{
            position: 'absolute',
            inset: 0,
            width: '100vw',
            height: '100vh',
            objectFit: 'cover',
            opacity: i === activeIndex ? 1 : 0,
            transition: `opacity ${FADE_MS}ms ease-in-out`,
          }}
```

`100vw`/`100vh` se resuelven de forma más consistente que `100%` para elementos `position: fixed`/`absolute` en navegadores móviles (Safari/Chrome iOS), evitando que el video quede más angosto/alto que el viewport y exponga el fondo (`overflow`/recorte) al hacer scroll.

- [ ] **Step 3: Verificar build**

Run: `npm --prefix webapp run build`
Expected: `Compiled successfully`, sin nuevos errores de tipos (los cambios son solo de estilos inline, ya tipados como `React.CSSProperties`).

- [ ] **Step 4: Verificar en navegador a 375px y 414px**

Run: `npm --prefix webapp run dev`, abrir `http://localhost:3000/` con devtools en modo responsive a 375px y luego 414px de ancho.
Expected: sin scroll horizontal (`document.documentElement.scrollWidth === window.innerWidth` en la consola del navegador), el video cubre todo el viewport sin franjas negras ni recortes laterales, y el `TechSidebar` (4 íconos en fila) permanece centrado sin desbordarse.

- [ ] **Step 5: Commit**

```bash
git add webapp/app/globals.css webapp/components/landing/VideoBackground.tsx
git commit -m "fix: responsive de videos en landing (375px, 414px)"
```

---

## Task 4: Actualizar `DOCS/ESTADO_FASE_1.md` (BR-01, BR-02, BR-03 → resueltos)

**Files:**
- Modify: `DOCS/ESTADO_FASE_1.md`

- [ ] **Step 1: Actualizar filas 5 y 6 del checklist de la Sección 3**

Old:
```
| 5 | Login cerrado | ❌ No cumplido | Reportado: no existe |
| 6 | Aviso de contrato obligatorio | ❌ No cumplido | Reportado: no existe |
```

New:
```
| 5 | Login cerrado | ✅ Cumplido | Resuelto — Email OTP de 2 pasos (ENC-FE-002, ADR-003) |
| 6 | Aviso de contrato obligatorio | ✅ Cumplido | Resuelto — modal bloqueante + tabla `contract_acceptances` (ENC-FE-002) |
```

- [ ] **Step 2: Actualizar fila 7 del checklist de la Sección 3**

Old:
```
| 7 | Responsive (general) | ⚠️ Parcial | Al menos videos fallan en móvil; resto no verificado |
```

New:
```
| 7 | Responsive (general) | ⚠️ Parcial | BR-03 (video, 375px/414px) resuelto — ENC-FE-002; resto de la landing no auditado |
```

- [ ] **Step 3: Actualizar "Login operativo" en la Sección 4**

Old:
```
| Login operativo | ❌ No | Confirmado ausente |
```

New:
```
| Login operativo | ✅ Sí | Email OTP de 2 pasos operativo — ENC-FE-002, ADR-003 |
```

- [ ] **Step 4: Agregar columna "Estado" a la tabla de la Sección 7**

Old:
```
## 7. Brechas Abiertas (Registro Consolidado)

| ID Brecha | Descripción | Bloquea a |
|---|---|---|
| BR-01 | No existe login cerrado | ENC-FE-003 (modal de acceso depende de sistema de login base) |
| BR-02 | No existe aviso de contrato obligatorio | Cierre de Fase 1 |
| BR-03 | Videos no responsivos en móvil | Cierre de Fase 1 / UX aprobada |
| BR-04 | Sin ADR-001 ni checklist maestro formal (Fase 0) | Cierre retroactivo de Fase 0 |
| BR-05 | Narrativa actual (4 íconos) orientada a tecnología, no a decisión | Posicionamiento estratégico — mitigado parcialmente por ENC-FE-003 |
```

New:
```
## 7. Brechas Abiertas (Registro Consolidado)

| ID Brecha | Descripción | Bloquea a | Estado |
|---|---|---|---|
| BR-01 | No existe login cerrado | ENC-FE-003 (modal de acceso depende de sistema de login base) | ✅ RESUELTO — ENC-FE-002 / ADR-003 |
| BR-02 | No existe aviso de contrato obligatorio | Cierre de Fase 1 | ✅ RESUELTO — ENC-FE-002 |
| BR-03 | Videos no responsivos en móvil | Cierre de Fase 1 / UX aprobada | ✅ RESUELTO — ENC-FE-002 |
| BR-04 | Sin ADR-001 ni checklist maestro formal (Fase 0) | Cierre retroactivo de Fase 0 | Abierto |
| BR-05 | Narrativa actual (4 íconos) orientada a tecnología, no a decisión | Posicionamiento estratégico — mitigado parcialmente por ENC-FE-003 | Abierto |
```

- [ ] **Step 5: Actualizar la fila de ENC-FE-002 en la Sección 8**

Old:
```
| ENC-FE-002 | (Propuesto) Cierre técnico Fase 1: Login + Contrato + Responsive | Pendiente de definición formal | Resuelve BR-01, BR-02, BR-03 |
```

New:
```
| ENC-FE-002 | Cierre técnico Fase 1: Login + Contrato + Responsive | Ejecutado — ver PR de ENC-FE-002 | Resuelve BR-01, BR-02, BR-03 |
```

- [ ] **Step 6: Commit**

```bash
git add DOCS/ESTADO_FASE_1.md
git commit -m "docs: actualizar ESTADO_FASE_1.md marcando BR-01, BR-02, BR-03 como resueltos"
```

---

## Task 5: Push + Pull Request

**Files:** ninguno (operación de git/GitHub)

- [ ] **Step 1: Push de la rama**

```bash
git push -u origin feature/enc-fe-002-login-contrato-responsive
```

- [ ] **Step 2: Abrir PR hacia `main`**

Título: `feat: cierre técnico Fase 1 - login Email OTP + contrato + responsive (ENC-FE-002)`

Body (referenciando ENC-FE-002 y ADR-003, y listando la evidencia pendiente de captura manual):

```markdown
## Resumen
- Login cerrado vía Email OTP de 2 pasos (BR-01) — ver ADR-003
- Modal de aceptación de contrato + tabla `contract_acceptances` con RLS (BR-02)
- Fix de overflow horizontal de video en mobile, 375px/414px (BR-03)
- DOCS/ESTADO_FASE_1.md actualizado: BR-01, BR-02, BR-03 marcados como resueltos

## Referencias
- ENC-FE-002
- ADR-003 (formaliza ADR-00Y)

## Pendiente (no bloquea este PR, debe registrarse)
- [ ] Aplicar `webapp/supabase/migrations/0001_contract_acceptances.sql` al proyecto Supabase (DEV)
- [ ] Pegar `webapp/supabase/email-templates/otp-email.html` en Supabase Dashboard → Authentication → Email Templates → Magic Link (usar {{ .Token }})
- [ ] Producto/Legal: reemplazar texto placeholder del aviso de contrato en `ContractGate.tsx`
- [ ] Producto/Diseño: reemplazar `<!-- PLACEHOLDER LOGO -->` en la plantilla de email
- [ ] Evidencia visual (capturas) de los 5 puntos de la sección 7 de ENC-FE-002, una vez aplicada la migración
```

---

## Self-Review

- **Cobertura del spec:** BR-01 (login OTP + `/app`) → Tasks 1–2; BR-02 (contrato + tabla) → Task 2; BR-03 (responsive) → Task 3; ADR-00Y → ya formalizado en ADR-003 (commit previo); actualización de ESTADO_FASE_1.md → Task 4; estructura de commits y PR → Task 5; restricciones de seguridad (`shouldCreateUser: false`, sin `service_role` en frontend, RLS por `user_id`, sin tocar los 4 modales, sin roles/RLS granular) → respetadas en todas las tasks.
- **Placeholders:** `[PENDIENTE TEXTO LEGAL...]` y `<!-- PLACEHOLDER LOGO -->` son contenido literal requerido por ENC-FE-002 (secciones 3.1/3.2), no placeholders del plan.
- **Consistencia de tipos:** `CONTRACT_VERSION` se exporta desde `ContractGate.tsx` y se importa en `app/app/layout.tsx`; `createClient` de `lib/supabase/server.ts` es `async` y se usa con `await` en `layout.tsx` y `page.tsx`, igual que en el resto del proyecto.
