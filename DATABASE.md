# SheSignal — Database Schema (Supabase)

## Tables

### `profiles`
Extends Supabase auth.users. Created automatically on sign-up via trigger.

```sql
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
```

---

### `saved_opportunities`
Stores opportunities a user has saved to their tracker.

```sql
create table public.saved_opportunities (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) on delete cascade not null,
  name text not null,
  type text not null,           -- Hackathon | Scholarship | Conference | Grant | Fellowship
  organization text,
  deadline text,                -- YYYY-MM-DD | Rolling | TBD
  description text,
  url text,
  why_match text,
  funding_amount text,
  location text,
  status text default 'want_to_apply',  -- want_to_apply | applied | heard_back
  notes text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);
```

---

## Row Level Security (RLS)

Enable RLS on both tables and add these policies:

```sql
-- profiles: users can only read/update their own profile
alter table public.profiles enable row level security;

create policy "Users can view own profile"
  on public.profiles for select
  using (auth.uid() = id);

create policy "Users can update own profile"
  on public.profiles for update
  using (auth.uid() = id);

-- saved_opportunities: users can only CRUD their own saved opportunities
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
```

---

## Useful Queries

### Get all saved opportunities for current user, ordered by deadline
```typescript
const { data } = await supabase
  .from('saved_opportunities')
  .select('*')
  .order('deadline', { ascending: true })
```

### Update tracker status
```typescript
await supabase
  .from('saved_opportunities')
  .update({ status: 'applied', updated_at: new Date().toISOString() })
  .eq('id', opportunityId)
```

### Save a new opportunity
```typescript
await supabase
  .from('saved_opportunities')
  .insert({
    user_id: user.id,
    name: opp.name,
    type: opp.type,
    organization: opp.organization,
    deadline: opp.deadline,
    description: opp.description,
    url: opp.url,
    why_match: opp.whyMatch,
    funding_amount: opp.fundingAmount,
    location: opp.location,
    status: 'want_to_apply'
  })
```
