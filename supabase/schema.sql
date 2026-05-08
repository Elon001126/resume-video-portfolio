create table if not exists public.admin_users (
  email text primary key,
  created_at timestamptz not null default now()
);

create table if not exists public.videos (
  id uuid primary key default gen_random_uuid(),
  title_zh text not null,
  title_en text not null,
  description_zh text not null default '',
  description_en text not null default '',
  video_path text,
  poster_path text,
  metrics jsonb not null default '{}'::jsonb,
  published boolean not null default true,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists videos_set_updated_at on public.videos;
create trigger videos_set_updated_at
before update on public.videos
for each row
execute function public.set_updated_at();

alter table public.admin_users enable row level security;
alter table public.videos enable row level security;

drop policy if exists "Admins can read themselves" on public.admin_users;
create policy "Admins can read themselves"
on public.admin_users
for select
to authenticated
using (email = auth.email());

drop policy if exists "Public can read published videos" on public.videos;
create policy "Public can read published videos"
on public.videos
for select
to anon, authenticated
using (published = true);

drop policy if exists "Admins can manage videos" on public.videos;
create policy "Admins can manage videos"
on public.videos
for all
to authenticated
using (exists (select 1 from public.admin_users where email = auth.email()))
with check (exists (select 1 from public.admin_users where email = auth.email()));

insert into storage.buckets (id, name, public)
values ('portfolio-videos', 'portfolio-videos', true)
on conflict (id) do update set public = true;

drop policy if exists "Public can read portfolio videos" on storage.objects;
create policy "Public can read portfolio videos"
on storage.objects
for select
to anon, authenticated
using (bucket_id = 'portfolio-videos');

drop policy if exists "Admins can upload portfolio videos" on storage.objects;
create policy "Admins can upload portfolio videos"
on storage.objects
for insert
to authenticated
with check (
  bucket_id = 'portfolio-videos'
  and exists (select 1 from public.admin_users where email = auth.email())
);

drop policy if exists "Admins can update portfolio videos" on storage.objects;
create policy "Admins can update portfolio videos"
on storage.objects
for update
to authenticated
using (
  bucket_id = 'portfolio-videos'
  and exists (select 1 from public.admin_users where email = auth.email())
)
with check (
  bucket_id = 'portfolio-videos'
  and exists (select 1 from public.admin_users where email = auth.email())
);

drop policy if exists "Admins can delete portfolio videos" on storage.objects;
create policy "Admins can delete portfolio videos"
on storage.objects
for delete
to authenticated
using (
  bucket_id = 'portfolio-videos'
  and exists (select 1 from public.admin_users where email = auth.email())
);

-- After creating your Supabase Auth user, add that email here:
-- insert into public.admin_users (email) values ('you@example.com');
