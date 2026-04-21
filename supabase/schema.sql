create extension if not exists "pgcrypto";

create table if not exists public.profiles (
  user_id uuid primary key references auth.users(id) on delete cascade,
  email text,
  display_name text,
  student_no text,
  consent_school_share boolean default false,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table if not exists public.conversations (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  title text default '新的记录',
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table if not exists public.messages (
  id uuid primary key default gen_random_uuid(),
  conversation_id uuid not null references public.conversations(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  role text not null default 'user',
  content text not null,
  insight text,
  journal_draft text,
  abc_analysis jsonb default '{}'::jsonb,
  follow_up jsonb default '[]'::jsonb,
  emotion_scores jsonb default '{}'::jsonb,
  risk_level text default 'low',
  risk_reason text,
  created_at timestamptz default now()
);

create table if not exists public.risk_events (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  conversation_id uuid references public.conversations(id) on delete cascade,
  message_id uuid references public.messages(id) on delete cascade,
  risk_level text not null,
  trigger_reason text,
  keywords text[] default '{}',
  score integer default 0,
  user_consented boolean default false,
  school_notified boolean default false,
  created_at timestamptz default now()
);

create table if not exists public.admin_export_logs (
  id uuid primary key default gen_random_uuid(),
  operator_user_id uuid references auth.users(id) on delete set null,
  operator_email text,
  exported_days integer not null,
  event_count integer default 0,
  user_count integer default 0,
  created_at timestamptz default now()
);

create index if not exists idx_conversations_user_updated_at on public.conversations(user_id, updated_at desc);
create index if not exists idx_messages_user_created_at on public.messages(user_id, created_at desc);
create index if not exists idx_messages_conversation_created_at on public.messages(conversation_id, created_at asc);
create index if not exists idx_risk_events_user_created_at on public.risk_events(user_id, created_at desc);
create index if not exists idx_risk_events_consented_created_at on public.risk_events(user_consented, created_at desc);
create index if not exists idx_admin_export_logs_created_at on public.admin_export_logs(created_at desc);

alter table public.profiles enable row level security;
alter table public.conversations enable row level security;
alter table public.messages enable row level security;
alter table public.risk_events enable row level security;
alter table public.admin_export_logs enable row level security;

drop policy if exists "profiles_select_own" on public.profiles;
create policy "profiles_select_own" on public.profiles
  for select using (auth.uid() = user_id);

drop policy if exists "profiles_insert_own" on public.profiles;
create policy "profiles_insert_own" on public.profiles
  for insert with check (auth.uid() = user_id);

drop policy if exists "profiles_update_own" on public.profiles;
create policy "profiles_update_own" on public.profiles
  for update using (auth.uid() = user_id);

drop policy if exists "conversations_select_own" on public.conversations;
create policy "conversations_select_own" on public.conversations
  for select using (auth.uid() = user_id);

drop policy if exists "conversations_insert_own" on public.conversations;
create policy "conversations_insert_own" on public.conversations
  for insert with check (auth.uid() = user_id);

drop policy if exists "conversations_update_own" on public.conversations;
create policy "conversations_update_own" on public.conversations
  for update using (auth.uid() = user_id);

drop policy if exists "messages_select_own" on public.messages;
create policy "messages_select_own" on public.messages
  for select using (auth.uid() = user_id);

drop policy if exists "messages_insert_own" on public.messages;
create policy "messages_insert_own" on public.messages
  for insert with check (auth.uid() = user_id);

drop policy if exists "risk_events_select_own" on public.risk_events;
create policy "risk_events_select_own" on public.risk_events
  for select using (auth.uid() = user_id);

drop policy if exists "admin_export_logs_no_direct_access" on public.admin_export_logs;
create policy "admin_export_logs_no_direct_access" on public.admin_export_logs
  for select using (false);

create or replace function public.touch_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists profiles_touch_updated_at on public.profiles;
create trigger profiles_touch_updated_at
before update on public.profiles
for each row execute procedure public.touch_updated_at();

drop trigger if exists conversations_touch_updated_at on public.conversations;
create trigger conversations_touch_updated_at
before update on public.conversations
for each row execute procedure public.touch_updated_at();

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (user_id, email)
  values (new.id, new.email)
  on conflict (user_id) do update
    set email = excluded.email,
        updated_at = now();
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
after insert on auth.users
for each row execute procedure public.handle_new_user();
