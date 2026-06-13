-- ENC-FE-002 / ADR-003: registro de aceptación de aviso de contrato (BR-02)

create table if not exists public.contract_acceptances (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  accepted_at timestamptz not null default now(),
  contract_version text not null
);

create unique index if not exists contract_acceptances_user_version_uniq
  on public.contract_acceptances (user_id, contract_version);

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
