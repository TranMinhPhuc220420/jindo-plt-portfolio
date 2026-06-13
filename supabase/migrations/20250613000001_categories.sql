-- Categories table
create table public.categories (
  id text primary key,
  name text not null,
  sort_order int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create trigger categories_updated_at
  before update on public.categories
  for each row execute function public.set_updated_at();

-- Link products to categories
alter table public.products
  add column category_id text references public.categories(id) on delete set null;

-- Backfill categories from existing product.category text values
insert into public.categories (id, name, sort_order)
select
  slug,
  name,
  row_number() over (order by name) - 1 as sort_order
from (
  select distinct
    lower(regexp_replace(trim(category), '[^a-zA-Z0-9]+', '-', 'g')) as slug,
    trim(category) as name
  from public.products
  where category is not null and trim(category) <> ''
) distinct_categories
on conflict (id) do nothing;

-- Assign category_id on products
update public.products p
set category_id = c.id
from public.categories c
where trim(p.category) = c.name
  and p.category is not null
  and trim(p.category) <> '';

-- Drop legacy text column
alter table public.products drop column category;

-- Row Level Security
alter table public.categories enable row level security;

create policy "categories_select_public"
  on public.categories for select
  to anon, authenticated
  using (true);

create policy "categories_insert_authenticated"
  on public.categories for insert
  to authenticated
  with check (true);

create policy "categories_update_authenticated"
  on public.categories for update
  to authenticated
  using (true)
  with check (true);

create policy "categories_delete_authenticated"
  on public.categories for delete
  to authenticated
  using (true);

-- Indexes
create index categories_sort_order_idx on public.categories (sort_order);
create index products_category_id_idx on public.products (category_id);
