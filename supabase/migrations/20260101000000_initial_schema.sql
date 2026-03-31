-- profiles table
create table public.profiles (
  id uuid references auth.users(id) on delete cascade primary key,
  name text,
  field text,
  stage text,
  country text,
  interests text[],
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Auto-create profile on new user signup
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, name)
  values (new.id, new.raw_user_meta_data->>'full_name');
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- saved_opportunities table
create table public.saved_opportunities (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) on delete cascade not null,
  name text not null,
  type text not null,
  organization text,
  deadline text,
  description text,
  url text,
  why_match text,
  funding_amount text,
  location text,
  status text default 'want_to_apply',
  notes text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- RLS policies
alter table public.profiles enable row level security;

create policy "Users can view own profile"
  on public.profiles for select
  using (auth.uid() = id);

create policy "Users can update own profile"
  on public.profiles for update
  using (auth.uid() = id);

create policy "Users can insert own profile"
  on public.profiles for insert
  with check (auth.uid() = id);

alter table public.saved_opportunities enable row level security;

create policy "Users can view own opportunities"
  on public.saved_opportunities for select
  using (auth.uid() = user_id);

create policy "Users can insert own opportunities"
  on public.saved_opportunities for insert
  with check (auth.uid() = user_id);

create policy "Users can update own opportunities"
  on public.saved_opportunities for update
  using (auth.uid() = user_id);

create policy "Users can delete own opportunities"
  on public.saved_opportunities for delete
  using (auth.uid() = user_id);
