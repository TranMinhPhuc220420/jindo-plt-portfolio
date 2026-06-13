-- Add icon_url for app shortcuts
alter table public.products
  add column if not exists icon_url text;

-- Backfill icon from existing image data
update public.products
  set icon_url = coalesce(
    nullif(images[1], ''),
    nullif(preview_image, '')
  )
  where icon_url is null
    and (
      (images is not null and array_length(images, 1) > 0)
      or (preview_image is not null and preview_image <> '')
    );

-- Relax NOT NULL on legacy columns no longer required by the shortcut model
alter table public.products alter column description drop not null;
alter table public.products alter column category drop not null;
alter table public.products alter column gradient drop not null;
alter table public.products alter column layout drop not null;

-- Defaults for legacy columns when inserting shortcut-only rows
alter table public.products alter column description set default '';
alter table public.products alter column category set default '';
alter table public.products alter column gradient set default '';
alter table public.products alter column layout set default 'standard';
