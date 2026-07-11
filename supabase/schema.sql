-- TianWen authentication profile table.
-- Run this in the Supabase SQL editor after creating a Supabase project.

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text,
  display_name text,
  role text not null default 'User' check (role in ('Developer', 'User', 'Guest')),
  login_provider text not null default 'unknown' check (
    login_provider in ('qq_email', 'gmail_email', 'github', 'guest', 'unknown')
  ),
  is_online boolean not null default false,
  last_seen_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.profiles enable row level security;

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists profiles_set_updated_at on public.profiles;
create trigger profiles_set_updated_at
before update on public.profiles
for each row execute function public.set_updated_at();

create or replace function public.resolve_login_provider(
  user_email text,
  raw_meta jsonb,
  app_meta jsonb,
  is_guest boolean
)
returns text
language plpgsql
stable
as $$
declare
  explicit_provider text := raw_meta ->> 'login_provider';
  auth_provider text := app_meta ->> 'provider';
  normalized_email text := lower(coalesce(user_email, ''));
begin
  if is_guest then
    return 'guest';
  end if;

  if explicit_provider in ('qq_email', 'gmail_email', 'github', 'guest') then
    return explicit_provider;
  end if;

  if auth_provider = 'github' then
    return 'github';
  end if;

  if normalized_email like '%@qq.com' then
    return 'qq_email';
  end if;

  if normalized_email like '%@gmail.com' or normalized_email like '%@googlemail.com' then
    return 'gmail_email';
  end if;

  return 'unknown';
end;
$$;

create or replace function public.handle_new_auth_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  guest_user boolean := coalesce(new.is_anonymous, false);
begin
  insert into public.profiles (
    id,
    email,
    display_name,
    role,
    login_provider,
    is_online,
    last_seen_at
  )
  values (
    new.id,
    new.email,
    coalesce(
      new.raw_user_meta_data ->> 'full_name',
      new.raw_user_meta_data ->> 'user_name',
      new.email,
      'Guest'
    ),
    case when guest_user then 'Guest' else 'User' end,
    public.resolve_login_provider(
      new.email,
      coalesce(new.raw_user_meta_data, '{}'::jsonb),
      coalesce(new.raw_app_meta_data, '{}'::jsonb),
      guest_user
    ),
    true,
    now()
  )
  on conflict (id) do nothing;

  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
after insert on auth.users
for each row execute function public.handle_new_auth_user();

create or replace function public.current_profile_role()
returns text
language sql
security definer
set search_path = public
as $$
  select role from public.profiles where id = auth.uid();
$$;

grant execute on function public.current_profile_role() to authenticated, anon;

drop policy if exists "Users can read own profile" on public.profiles;
create policy "Users can read own profile"
on public.profiles
for select
to authenticated
using (auth.uid() = id);

drop policy if exists "Users can insert own non-developer profile" on public.profiles;
create policy "Users can insert own non-developer profile"
on public.profiles
for insert
to authenticated
with check (auth.uid() = id and role in ('User', 'Guest'));

drop policy if exists "Users can update own session flags without changing role" on public.profiles;
create policy "Users can update own session flags without changing role"
on public.profiles
for update
to authenticated
using (auth.uid() = id)
with check (auth.uid() = id and role = public.current_profile_role());

-- Developer authorization must be granted manually by the site owner.
-- Example:
-- update public.profiles set role = 'Developer' where email = 'your-email@gmail.com';

