-- Footer settings singleton
create table public.footer_settings (
  id text primary key default 'default' check (id = 'default'),
  address text not null,
  phone text not null,
  email text not null,
  business_hours text not null default '',
  social_instagram_url text,
  social_youtube_url text,
  social_facebook_url text,
  social_instagram_enabled boolean not null default true,
  social_youtube_enabled boolean not null default true,
  social_facebook_enabled boolean not null default true,
  social_email_enabled boolean not null default true,
  updated_at timestamptz not null default now()
);

create trigger footer_settings_updated_at
  before update on public.footer_settings
  for each row execute function public.set_updated_at();

alter table public.footer_settings enable row level security;

create policy "footer_settings_select_public"
  on public.footer_settings for select
  to anon, authenticated
  using (true);

create policy "footer_settings_insert_authenticated"
  on public.footer_settings for insert
  to authenticated
  with check (true);

create policy "footer_settings_update_authenticated"
  on public.footer_settings for update
  to authenticated
  using (true)
  with check (true);

insert into public.footer_settings (
  id,
  address,
  phone,
  email,
  business_hours
) values (
  'default',
  '72 Nguyen Hue Boulevard, District 1, Ho Chi Minh City 700000, Vietnam',
  '+84 28 3822 4567',
  'hello@pltsolutions.com',
  'Mon – Fri, 9:00 AM – 6:00 PM (ICT)'
);
