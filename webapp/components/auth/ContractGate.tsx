'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

export const CONTRACT_VERSION = 'v1-placeholder'

interface ContractGateProps {
  accepted: boolean
  userId: string
  children: React.ReactNode
}

export default function ContractGate({ accepted, userId, children }: ContractGateProps) {
  const router = useRouter()
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  async function handleAccept() {
    setSubmitting(true)
    setError('')

    const supabase = createClient()
    const { error: upsertError } = await supabase
      .from('contract_acceptances')
      .upsert(
        { user_id: userId, contract_version: CONTRACT_VERSION },
        { onConflict: 'user_id,contract_version', ignoreDuplicates: true }
      )

    if (upsertError) {
      setError('No se pudo registrar tu aceptación. Intenta nuevamente.')
      setSubmitting(false)
      return
    }

    router.refresh()
    setSubmitting(false)
  }

  if (accepted) {
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
