-- Products table
create table public.products (
  id text primary key,
  title text not null,
  description text not null,
  long_description text,
  category text not null,
  status text not null check (status in ('live', 'beta', 'internal')),
  tags text[] not null default '{}',
  gradient text not null,
  preview_image text,
  live_url text,
  repo_url text,
  featured boolean not null default false,
  layout text not null check (layout in ('featured', 'standard', 'wide', 'tall')),
  highlights text[] not null default '{}',
  sort_order int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Contact submissions table
create table public.contact_submissions (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  company text,
  message text not null,
  is_read boolean not null default false,
  created_at timestamptz not null default now()
);

-- Updated_at trigger for products
create or replace function public.set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger products_updated_at
  before update on public.products
  for each row execute function public.set_updated_at();

-- Row Level Security
alter table public.products enable row level security;
alter table public.contact_submissions enable row level security;

-- Products: public read
create policy "products_select_public"
  on public.products for select
  to anon, authenticated
  using (true);

-- Products: admin write
create policy "products_insert_authenticated"
  on public.products for insert
  to authenticated
  with check (true);

create policy "products_update_authenticated"
  on public.products for update
  to authenticated
  using (true)
  with check (true);

create policy "products_delete_authenticated"
  on public.products for delete
  to authenticated
  using (true);

-- Contacts: public insert
create policy "contacts_insert_public"
  on public.contact_submissions for insert
  to anon, authenticated
  with check (true);

-- Contacts: admin read/update
create policy "contacts_select_authenticated"
  on public.contact_submissions for select
  to authenticated
  using (true);

create policy "contacts_update_authenticated"
  on public.contact_submissions for update
  to authenticated
  using (true)
  with check (true);

-- Indexes
create index products_featured_idx on public.products (featured);
create index products_sort_order_idx on public.products (sort_order);
create index contact_submissions_created_at_idx on public.contact_submissions (created_at desc);
create index contact_submissions_is_read_idx on public.contact_submissions (is_read);
