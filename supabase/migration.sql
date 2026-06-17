-- WhereToShit Database Schema
-- Run this in the Supabase SQL Editor

create extension if not exists "pgcrypto";

-- Table: toilets
create table public.toilets (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  address text not null,
  lat float8 not null,
  lng float8 not null,
  has_bidet boolean not null default false,
  is_free boolean not null default true,
  created_at timestamptz not null default now()
);

-- Table: reviews
create table public.reviews (
  id uuid primary key default gen_random_uuid(),
  toilet_id uuid not null references public.toilets(id) on delete cascade,
  rating int2 not null check (rating >= 1 and rating <= 5),
  has_bidet boolean not null default false,
  comment text,
  created_at timestamptz not null default now()
);

-- Table: photos
create table public.photos (
  id uuid primary key default gen_random_uuid(),
  toilet_id uuid not null references public.toilets(id) on delete cascade,
  storage_url text not null,
  created_at timestamptz not null default now()
);

-- Indexes
create index idx_reviews_toilet_id on public.reviews(toilet_id);
create index idx_photos_toilet_id on public.photos(toilet_id);

-- View: toilets_with_stats
create or replace view public.toilets_with_stats as
select
  t.*,
  round(coalesce(r.avg_rating, 0)::numeric, 1)::float8 as avg_rating,
  coalesce(r.review_count, 0)::int as review_count,
  coalesce(r.bidet_yes, 0) > coalesce(r.bidet_total, 1) * 0.5 as bidet_confirmed
from public.toilets t
left join (
  select
    toilet_id,
    avg(rating)::float8 as avg_rating,
    count(*)::int as review_count,
    count(*) filter (where has_bidet = true)::int as bidet_yes,
    count(*)::int as bidet_total
  from public.reviews
  group by toilet_id
) r on r.toilet_id = t.id;

-- RLS Policies
alter table public.toilets enable row level security;
alter table public.reviews enable row level security;
alter table public.photos enable row level security;

create policy "Anyone can read toilets" on public.toilets for select using (true);
create policy "Anyone can add toilets" on public.toilets for insert with check (true);

create policy "Anyone can read reviews" on public.reviews for select using (true);
create policy "Anyone can add reviews" on public.reviews for insert with check (true);

create policy "Anyone can read photos" on public.photos for select using (true);
create policy "Anyone can add photos" on public.photos for insert with check (true);

-- Storage: create a public bucket called "photos"
-- Run this separately or via the Supabase Dashboard:
--   1. Go to Storage > Create bucket > name: "photos" > Public: ON
--   2. Or run:
-- insert into storage.buckets (id, name, public) values ('photos', 'photos', true);
-- create policy "Public read photos" on storage.objects for select using (bucket_id = 'photos');
-- create policy "Allow anonymous uploads" on storage.objects for insert with check (bucket_id = 'photos');
