-- One-shot, idempotent Blog database and Storage bootstrap.
-- Run in Supabase SQL Editor after supabase/schema.sql.

begin;

do $$
begin
  if to_regclass('public.profiles') is null then
    raise exception 'public.profiles is missing; run supabase/schema.sql first';
  end if;
end
$$;

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create or replace function public.current_profile_role()
returns text
language sql
security definer
set search_path = public
as $$
  select role from public.profiles where id = auth.uid();
$$;

grant execute on function public.current_profile_role() to authenticated, anon;

create table if not exists public.blog_posts (
  id uuid primary key default gen_random_uuid(),
  author_id uuid not null references public.profiles(id),
  title text not null check (char_length(btrim(title)) between 1 and 180),
  excerpt text not null default '' check (char_length(excerpt) <= 500),
  content text not null check (char_length(btrim(content)) between 1 and 100000),
  attachments jsonb not null default '[]'::jsonb,
  cover_image text not null default '',
  published_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.blog_posts add column if not exists attachments jsonb not null default '[]'::jsonb;
alter table public.blog_posts add column if not exists cover_image text not null default '';

alter table public.blog_posts drop constraint if exists blog_attachments_array;
alter table public.blog_posts add constraint blog_attachments_array check (
  jsonb_typeof(attachments) = 'array' and jsonb_array_length(attachments) <= 20
);

alter table public.blog_posts drop constraint if exists blog_cover_url;
alter table public.blog_posts add constraint blog_cover_url check (
  cover_image = '' or (cover_image like 'https://%' and char_length(cover_image) <= 2048)
);

create index if not exists blog_posts_published_at_idx
on public.blog_posts (published_at desc);

alter table public.blog_posts enable row level security;
grant select on public.blog_posts to anon, authenticated;
grant insert, update on public.blog_posts to authenticated;

drop policy if exists "Published blog is readable" on public.blog_posts;
create policy "Published blog is readable"
on public.blog_posts for select to anon, authenticated
using (true);

drop policy if exists "Developer can publish" on public.blog_posts;
create policy "Developer can publish"
on public.blog_posts for insert to authenticated
with check (public.current_profile_role() = 'Developer' and author_id = auth.uid());

drop policy if exists "Developer can edit own posts" on public.blog_posts;
create policy "Developer can edit own posts"
on public.blog_posts for update to authenticated
using (public.current_profile_role() = 'Developer' and author_id = auth.uid())
with check (public.current_profile_role() = 'Developer' and author_id = auth.uid());

drop trigger if exists blog_posts_set_updated_at on public.blog_posts;
create trigger blog_posts_set_updated_at
before update on public.blog_posts
for each row execute function public.set_updated_at();

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('blog-assets', 'blog-assets', true, 20971520, array[
  'image/jpeg', 'image/png', 'image/webp', 'image/gif', 'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'text/plain'
])
on conflict (id) do update set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists "Developer uploads blog assets" on storage.objects;
create policy "Developer uploads blog assets"
on storage.objects for insert to authenticated
with check (
  bucket_id = 'blog-assets'
  and public.current_profile_role() = 'Developer'
  and (storage.foldername(name))[1] = auth.uid()::text
);

commit;

-- Force PostgREST to pick up the table and columns immediately.
notify pgrst, 'reload schema';
