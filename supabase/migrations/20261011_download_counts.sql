-- Execute after the existing auth and Blog migrations. No frontend service key needed.
begin;
create table if not exists public.download_counts (
  file_key text primary key check (char_length(file_key) between 1 and 2048),
  count bigint not null default 0 check (count >= 0)
);
create table if not exists public.download_events (
  event_id uuid primary key,
  file_key text not null references public.download_counts(file_key),
  created_at timestamptz not null default now()
);
alter table public.download_counts enable row level security;
alter table public.download_events enable row level security;
revoke all on public.download_counts, public.download_events from anon, authenticated;
grant select on public.download_counts to anon, authenticated;
drop policy if exists "Read download totals" on public.download_counts;
create policy "Read download totals" on public.download_counts for select to anon, authenticated using (true);

create or replace function public.record_download(p_file_key text, p_event_id uuid)
returns bigint language plpgsql security definer set search_path = public as $$
declare total bigint; inserted integer;
begin
  if auth.uid() is null then raise exception 'Sign in required'; end if;
  if not exists (select 1 from public.download_counts where file_key = p_file_key) then
    raise exception 'Unknown file';
  end if;
  insert into public.download_events(event_id, file_key) values (p_event_id, p_file_key)
    on conflict (event_id) do nothing;
  get diagnostics inserted = row_count;
  if inserted = 1 then
    update public.download_counts set count = count + 1 where file_key = p_file_key returning count into total;
  else
    select count into total from public.download_counts where file_key = p_file_key;
  end if;
  return total;
end;
$$;
revoke all on function public.record_download(text, uuid) from public, anon;
grant execute on function public.record_download(text, uuid) to authenticated;

-- Only trusted content writes register new files; visitors cannot invent counters.
create or replace function public.register_blog_downloads()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.download_counts(file_key)
    select distinct split_part(split_part(item->>'url', '?', 1), '#', 1)
    from jsonb_array_elements(new.attachments) item
    where item->>'url' like 'https://%'
    on conflict do nothing;
  return new;
end;
$$;
drop trigger if exists blog_register_downloads on public.blog_posts;
create trigger blog_register_downloads after insert or update of attachments on public.blog_posts
for each row execute function public.register_blog_downloads();
insert into public.download_counts(file_key)
select distinct split_part(split_part(item->>'url', '?', 1), '#', 1)
from public.blog_posts, lateral jsonb_array_elements(attachments) item
where item->>'url' like 'https://%' on conflict do nothing;

insert into public.download_counts(file_key) values
('/files/hardware/fpga-vision-gesture-controller/system-block-diagram.pdf'),
('/files/hardware/fpga-vision-gesture-controller/fpga-vision-gesture-controller.zip'),
('/files/hardware/wifi-servo/wiring-diagram.pdf'),
('/files/hardware/wifi-servo/source.zip'),
('/files/software/My-Quant-main.zip'),
('/files/software/space-shooter-main.zip'),
('/files/resources/notes.pdf'),
('/files/assignments/inte_car/inte-car.rar')
on conflict do nothing;
commit;
notify pgrst, 'reload schema';
