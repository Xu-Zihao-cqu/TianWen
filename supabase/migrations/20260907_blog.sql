-- Run after schema.sql. Role assignments remain server-managed.
begin;
create table if not exists public.blog_posts (
  id uuid primary key default gen_random_uuid(),
  author_id uuid not null references public.profiles(id),
  title text not null check (char_length(btrim(title)) between 1 and 180),
  excerpt text not null default '' check (char_length(excerpt) <= 500),
  content text not null check (char_length(btrim(content)) between 1 and 100000),
  published_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists blog_posts_published_at_idx on public.blog_posts (published_at desc);
alter table public.blog_posts enable row level security;
grant select on public.blog_posts to anon, authenticated;
grant insert, update on public.blog_posts to authenticated;
drop policy if exists "Published blog is readable" on public.blog_posts;
create policy "Published blog is readable" on public.blog_posts for select to anon, authenticated using (true);
drop policy if exists "Developer can publish" on public.blog_posts;
create policy "Developer can publish" on public.blog_posts for insert to authenticated
with check (public.current_profile_role() = 'Developer' and author_id = auth.uid());
drop policy if exists "Developer can edit own posts" on public.blog_posts;
create policy "Developer can edit own posts" on public.blog_posts for update to authenticated
using (public.current_profile_role() = 'Developer' and author_id = auth.uid())
with check (public.current_profile_role() = 'Developer' and author_id = auth.uid());
drop trigger if exists blog_posts_set_updated_at on public.blog_posts;
create trigger blog_posts_set_updated_at before update on public.blog_posts
for each row execute function public.set_updated_at();
commit;
