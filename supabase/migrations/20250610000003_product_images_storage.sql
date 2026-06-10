-- Product images array
alter table public.products
  add column if not exists images text[] not null default '{}';

update public.products
  set images = array[preview_image]
  where preview_image is not null
    and preview_image <> ''
    and (images is null or images = '{}');

-- Contacts: allow authenticated delete
create policy "contacts_delete_authenticated"
  on public.contact_submissions for delete
  to authenticated
  using (true);

-- Storage bucket for product images
insert into storage.buckets (id, name, public)
values ('product-images', 'product-images', true)
on conflict (id) do nothing;

create policy "product_images_select_public"
  on storage.objects for select
  to anon, authenticated
  using (bucket_id = 'product-images');

create policy "product_images_insert_authenticated"
  on storage.objects for insert
  to authenticated
  with check (bucket_id = 'product-images');

create policy "product_images_update_authenticated"
  on storage.objects for update
  to authenticated
  using (bucket_id = 'product-images')
  with check (bucket_id = 'product-images');

create policy "product_images_delete_authenticated"
  on storage.objects for delete
  to authenticated
  using (bucket_id = 'product-images');
