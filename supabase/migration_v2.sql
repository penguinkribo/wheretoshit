-- WhereToShit v2: User Identity, Spam Prevention, Gamification
-- Run this in the Supabase SQL Editor AFTER migration.sql

-- 1. Users table
create table public.users (
  id uuid primary key default gen_random_uuid(),
  nickname text not null,
  created_at timestamptz not null default now()
);

create index idx_users_nickname on public.users(nickname);

-- 2. Add user_id FK to existing tables
alter table public.toilets add column user_id uuid references public.users(id) on delete set null;
alter table public.reviews add column user_id uuid references public.users(id) on delete set null;
alter table public.photos add column user_id uuid references public.users(id) on delete set null;

create index idx_toilets_user_id on public.toilets(user_id);
create index idx_reviews_user_id on public.reviews(user_id);
create index idx_photos_user_id on public.photos(user_id);

-- 3. Reports table
create table public.reports (
  id uuid primary key default gen_random_uuid(),
  target_type text not null check (target_type in ('toilet', 'review')),
  target_id uuid not null,
  user_id uuid references public.users(id) on delete set null,
  reason text not null,
  created_at timestamptz not null default now(),
  constraint reports_unique_per_user unique (target_type, target_id, user_id)
);

create index idx_reports_target on public.reports(target_type, target_id);
create index idx_reports_user_id on public.reports(user_id);

-- 4. Verifications table
create table public.verifications (
  id uuid primary key default gen_random_uuid(),
  toilet_id uuid not null references public.toilets(id) on delete cascade,
  user_id uuid not null references public.users(id) on delete cascade,
  created_at timestamptz not null default now(),
  unique (toilet_id, user_id)
);

create index idx_verifications_toilet_id on public.verifications(toilet_id);
create index idx_verifications_user_id on public.verifications(user_id);

-- 5. Drop and recreate toilets_with_stats view (columns changed due to new user_id on toilets)
drop view if exists public.toilets_with_stats;
create view public.toilets_with_stats as
select
  t.*,
  round(coalesce(r.avg_rating, 0)::numeric, 1)::float8 as avg_rating,
  coalesce(r.review_count, 0)::int as review_count,
  coalesce(r.bidet_yes, 0) > coalesce(r.bidet_total, 1) * 0.5 as bidet_confirmed,
  coalesce(v.verification_count, 0)::int as verification_count,
  coalesce(v.verification_count, 0) >= 3 as is_verified,
  coalesce(rep.report_count, 0)::int as report_count,
  coalesce(rep.report_count, 0) >= 3 as is_flagged
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
) r on r.toilet_id = t.id
left join (
  select toilet_id, count(*)::int as verification_count
  from public.verifications
  group by toilet_id
) v on v.toilet_id = t.id
left join (
  select target_id, count(*)::int as report_count
  from public.reports
  where target_type = 'toilet'
  group by target_id
) rep on rep.target_id = t.id;

-- 6. Leaderboard view
create or replace view public.leaderboard as
select
  u.id,
  u.nickname,
  u.created_at,
  coalesce(t.cnt, 0)::int as toilet_count,
  coalesce(r.cnt, 0)::int as review_count,
  coalesce(p.cnt, 0)::int as photo_count,
  coalesce(v.cnt, 0)::int as verification_count,
  (coalesce(t.cnt, 0) * 50
   + coalesce(r.cnt, 0) * 20
   + coalesce(p.cnt, 0) * 10
   + coalesce(v.cnt, 0) * 5)::int as score
from public.users u
left join (select user_id, count(*) as cnt from public.toilets where user_id is not null group by user_id) t on t.user_id = u.id
left join (select user_id, count(*) as cnt from public.reviews where user_id is not null group by user_id) r on r.user_id = u.id
left join (select user_id, count(*) as cnt from public.photos where user_id is not null group by user_id) p on p.user_id = u.id
left join (select user_id, count(*) as cnt from public.verifications group by user_id) v on v.user_id = u.id;

-- 7. RLS Policies for new tables
alter table public.users enable row level security;
create policy "Anyone can read users" on public.users for select using (true);
create policy "Anyone can create users" on public.users for insert with check (true);
create policy "Anyone can update users" on public.users for update using (true);

alter table public.reports enable row level security;
create policy "Anyone can read reports" on public.reports for select using (true);
create policy "Anyone can create reports" on public.reports for insert with check (true);

alter table public.verifications enable row level security;
create policy "Anyone can read verifications" on public.verifications for select using (true);
create policy "Anyone can create verifications" on public.verifications for insert with check (true);
