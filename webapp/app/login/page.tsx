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
