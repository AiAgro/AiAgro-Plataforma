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
