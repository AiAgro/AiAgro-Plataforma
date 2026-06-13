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
