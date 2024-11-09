create table if not exists public.companies (
  id uuid references auth.users on delete cascade,
  company_name text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  primary key (id)
);

-- Set up row level security
alter table public.companies enable row level security;

-- Create policies
create policy "Users can view own company data"
  on companies for select
  using ( auth.uid() = id );

create policy "Users can insert own company data"
  on companies for insert
  with check ( auth.uid() = id );

create policy "Users can update own company data"
  on companies for update
  using ( auth.uid() = id );