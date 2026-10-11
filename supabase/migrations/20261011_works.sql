-- Run after 20261011_download_counts.sql. Leaves existing static works untouched.
begin;
create table if not exists public.works (
  id text primary key,
  author_id uuid not null references public.profiles(id),
  category text not null check (category in ('hardware','software','resources','assignments')),
  title text not null check (char_length(btrim(title)) between 1 and 180),
  summary text not null check (char_length(btrim(summary)) between 1 and 500),
  content text not null check (char_length(btrim(content)) between 1 and 100000),
  cover_image text not null check (cover_image like 'https://%' and char_length(cover_image) <= 2048),
  images jsonb not null check (jsonb_typeof(images) = 'array' and jsonb_array_length(images) between 1 and 12),
  files jsonb not null default '[]' check (jsonb_typeof(files) = 'array' and jsonb_array_length(files) <= 20),
  tags text[] not null default '{}' check (cardinality(tags) <= 12),
  created_at timestamptz not null default now(),
  check (id ~ ('^' || case category when 'hardware' then 'hw' when 'software' then 'sw' when 'resources' then 'res' else 'as' end || '-[a-z0-9-]+$'))
);
create index if not exists works_created_at_idx on public.works(created_at desc, id);
alter table public.works enable row level security;
revoke all on public.works from anon, authenticated;
grant select on public.works to anon, authenticated;
grant insert on public.works to authenticated;
drop policy if exists "Read published works" on public.works;
create policy "Read published works" on public.works for select to anon, authenticated using (true);
drop policy if exists "Developer publishes own work" on public.works;
create policy "Developer publishes own work" on public.works for insert to authenticated
with check (public.current_profile_role() = 'Developer' and author_id = auth.uid());

insert into storage.buckets(id,name,public,file_size_limit,allowed_mime_types)
values ('work-assets','work-assets',true,52428800,array['image/svg+xml','image/png','image/jpeg','application/pdf','application/zip','application/vnd.rar','application/x-7z-compressed','application/vnd.openxmlformats-officedocument.wordprocessingml.document','text/plain'])
on conflict (id) do update set public=excluded.public,file_size_limit=excluded.file_size_limit,allowed_mime_types=excluded.allowed_mime_types;
drop policy if exists "Developer uploads work assets" on storage.objects;
create policy "Developer uploads work assets" on storage.objects for insert to authenticated
with check (bucket_id = 'work-assets' and public.current_profile_role() = 'Developer' and (storage.foldername(name))[1] = auth.uid()::text);

create or replace function public.register_work_downloads()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.download_counts(file_key)
  select distinct split_part(split_part(item->>'url','?',1),'#',1)
  from jsonb_array_elements(new.files) item where item->>'url' like 'https://%'
  on conflict do nothing;
  return new;
end;
$$;
drop trigger if exists work_register_downloads on public.works;
create trigger work_register_downloads after insert or update of files on public.works
for each row execute function public.register_work_downloads();
commit;
notify pgrst, 'reload schema';
