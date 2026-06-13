alter table public.footer_settings
  add column social_instagram_enabled boolean not null default true,
  add column social_youtube_enabled boolean not null default true,
  add column social_facebook_enabled boolean not null default true,
  add column social_email_enabled boolean not null default true;
