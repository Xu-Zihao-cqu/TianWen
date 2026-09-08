-- Apply after 20260907_blog.sql. Existing posts remain valid.
begin;
alter table public.blog_posts add column if not exists attachments jsonb not null default '[]'::jsonb;
alter table public.blog_posts add column if not exists cover_image text not null default '';
alter table public.blog_posts drop constraint if exists blog_attachments_array;
alter table public.blog_posts add constraint blog_attachments_array check (
  case when jsonb_typeof(attachments) = 'array' then jsonb_array_length(attachments) <= 20 else false end
);
alter table public.blog_posts drop constraint if exists blog_cover_url;
alter table public.blog_posts add constraint blog_cover_url check (cover_image = '' or (cover_image like 'https://%' and char_length(cover_image) <= 2048));

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('blog-assets', 'blog-assets', true, 20971520, array[
  'image/jpeg', 'image/png', 'image/webp', 'image/gif', 'application/pdf',
  'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'text/plain'
]) on conflict (id) do update set public = excluded.public,
  file_size_limit = excluded.file_size_limit, allowed_mime_types = excluded.allowed_mime_types;

-- Public article attachments. Only Developers can create objects in their own folder.
drop policy if exists "Developer uploads blog assets" on storage.objects;
create policy "Developer uploads blog assets" on storage.objects for insert to authenticated
with check (bucket_id = 'blog-assets' and public.current_profile_role() = 'Developer'
  and (storage.foldername(name))[1] = auth.uid()::text);
-- No overwrite/delete grants: removing an attachment from a post does not break other links.
commit;
