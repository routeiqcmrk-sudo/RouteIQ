-- RouteIQ student onboarding schema.
-- Review this file before running it in the Supabase SQL Editor.
-- This schema does not import student records or create any admin users.

create table if not exists public.student_registration_requests (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null unique references auth.users(id) on delete cascade,
  full_name text not null check (char_length(full_name) between 1 and 120),
  student_id text not null check (char_length(student_id) between 1 and 80),
  email text not null,
  phone text not null,
  academic_year text not null,
  branch text not null,
  preferred_bus_stop text not null,
  emergency_contact text not null,
  status text not null default 'pending' check (status in ('pending','approved','rejected','needs_correction','suspended')),
  assigned_bus text,
  assigned_route text,
  admin_note text,
  reviewed_by uuid references auth.users(id),
  reviewed_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Multiple pending submissions may exist so nobody can block a real student by
-- claiming their ID first. Admins must resolve duplicates before approval.
create index if not exists student_registration_requests_student_id_lower_idx
  on public.student_registration_requests (lower(student_id));

create or replace function public.routeiq_is_admin()
returns boolean
language sql
stable
as $
  select coalesce((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin', false);
$;

create or replace function public.routeiq_email_is_verified()
returns boolean
language sql
stable
security definer
set search_path = ''
as $
  select exists (
    select 1 from auth.users u
    where u.id = (select auth.uid())
      and u.email_confirmed_at is not null
  );
$;

alter table public.student_registration_requests enable row level security;

drop policy if exists "student can submit own request" on public.student_registration_requests;
create policy "student can submit own request"
  on public.student_registration_requests for insert to authenticated
  with check (
    auth.uid() = user_id
    and coalesce(auth.jwt() ->> 'email', '') = email
    and public.routeiq_email_is_verified()
    and status = 'pending'
    and assigned_bus is null
    and assigned_route is null
    and reviewed_by is null
    and reviewed_at is null
  );

drop policy if exists "student can read own request" on public.student_registration_requests;
create policy "student can read own request"
  on public.student_registration_requests for select to authenticated
  using (auth.uid() = user_id or public.routeiq_is_admin());

drop policy if exists "admins can update requests" on public.student_registration_requests;
create policy "admins can update requests"
  on public.student_registration_requests for update to authenticated
  using (public.routeiq_is_admin())
  with check (public.routeiq_is_admin());

-- Intentionally no student UPDATE or DELETE policy.
-- Grant admin role only through trusted Supabase Auth app_metadata administration.
-- Never expose the service_role key in browser code or NEXT_PUBLIC_* variables.
