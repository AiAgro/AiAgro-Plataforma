'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'

type Status = 'idle' | 'loading' | 'sent' | 'error'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<Status>('idle')

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    if (!email.trim()) return

    setStatus('loading')

    const supabase = createClient()
    const { error } = await supabase.auth.signInWithOtp({
      email: email.trim(),
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback`,
        shouldCreateUser: false, // sin registro público
      },
    })

    setStatus(error ? 'error' : 'sent')
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
      <div style={{
        width: '100%',
        maxWidth: '400px',
      }}>

        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <p style={{
            fontSize: '2rem',
            fontWeight: 700,
            color: 'white',
            margin: 0,
            letterSpacing: '-0.02em',
          }}>
            Aiagro<span style={{ color: '#4ade80' }}>.cl</span>
          </p>
          <p style={{
            color: 'rgba(255,255,255,0.45)',
            fontSize: '0.875rem',
            marginTop: '8px',
          }}>
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

          {status === 'sent' ? (
            // Estado: enviado
            <div style={{ textAlign: 'center' }}>
              <div style={{
                width: '48px',
                height: '48px',
                borderRadius: '12px',
                backgroundColor: 'rgba(74,222,128,0.15)',
                border: '1px solid rgba(74,222,128,0.3)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 20px',
                fontSize: '22px',
              }}>
                ✉️
              </div>
              <h2 style={{ color: 'white', fontSize: '1.15rem', fontWeight: 600, margin: '0 0 10px' }}>
                Revisa tu correo
              </h2>
              <p style={{ color: 'rgba(255,255,255,0.55)', fontSize: '0.875rem', lineHeight: 1.6, margin: '0 0 24px' }}>
                Enviamos un enlace de acceso a <strong style={{ color: 'rgba(255,255,255,0.85)' }}>{email}</strong>.
                Válido por 60 minutos.
              </p>
              <button
                onClick={() => { setStatus('idle'); setEmail('') }}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#4ade80',
                  fontSize: '0.875rem',
                  cursor: 'pointer',
                  textDecoration: 'underline',
                }}
              >
                Usar otro correo
              </button>
            </div>
          ) : (
            // Estado: formulario
            <form onSubmit={handleSubmit}>
              <h2 style={{
                color: 'white',
                fontSize: '1.15rem',
                fontWeight: 600,
                margin: '0 0 6px',
              }}>
                Ingresa con tu correo
              </h2>
              <p style={{
                color: 'rgba(255,255,255,0.45)',
                fontSize: '0.8rem',
                margin: '0 0 24px',
              }}>
                Te enviaremos un enlace de acceso directo
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
                <p style={{
                  color: 'rgba(248,113,113,0.9)',
                  fontSize: '0.8rem',
                  margin: '0 0 20px',
                }}>
                  No se pudo enviar el enlace. Verifica el correo e intenta nuevamente.
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
                {status === 'loading' ? 'Enviando...' : 'Enviar enlace de acceso'}
              </button>
            </form>
          )}

        </div>

        {/* Footer */}
        <p style={{
          textAlign: 'center',
          color: 'rgba(255,255,255,0.2)',
          fontSize: '0.75rem',
          marginTop: '24px',
        }}>
          Plataforma de uso interno · Aiagro.cl
        </p>
      </div>
    </main>
  )
}
