-- Create posts table
create table if not exists posts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users not null,
  quote text not null,
  caption text,
  image_url text,
  platforms jsonb default '[]'::jsonb,
  status text default 'draft',
  scheduled_at timestamptz,
  posted_at timestamptz,
  metrics jsonb default '{}'::jsonb,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Create settings table
create table if not exists settings (
  user_id uuid primary key references auth.users on delete cascade,
  themes jsonb default '[]'::jsonb,
  schedule_times jsonb default '[]'::jsonb,
  platform_toggles jsonb default '{}'::jsonb,
  format_options jsonb default '{}'::jsonb,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- RLS for posts
alter table posts enable row level security;

do $$
begin
  if not exists (
    select 1 from pg_policies where tablename = 'posts' and policyname = 'Users can manage their own posts'
  ) then
    create policy "Users can manage their own posts" on posts
      for all using (auth.uid() = user_id);
  end if;
end $$;

-- RLS for settings
alter table settings enable row level security;

do $$
begin
  if not exists (
    select 1 from pg_policies where tablename = 'settings' and policyname = 'Users can manage their own settings'
  ) then
    create policy "Users can manage their own settings" on settings
      for all using (auth.uid() = user_id);
  end if;
end $$;

-- Trigger for updated_at
create or replace function handle_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

do $$
begin
  if not exists (select 1 from pg_trigger where tgname = 'set_updated_at_posts') then
    create trigger set_updated_at_posts
    before update on posts
    for each row execute procedure handle_updated_at();
  end if;
  
  if not exists (select 1 from pg_trigger where tgname = 'set_updated_at_settings') then
    create trigger set_updated_at_settings
    before update on settings
    for each row execute procedure handle_updated_at();
  end if;
end $$;
