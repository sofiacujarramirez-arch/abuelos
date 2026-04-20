-- =============================================================================
-- Storage buckets for photos and gazette PDFs
-- =============================================================================

insert into storage.buckets (id, name, public)
values
  ('family-photos', 'family-photos', false),
  ('avatars',       'avatars',       true),
  ('gazettes',      'gazettes',      false)
on conflict (id) do nothing;

-- =============================================================================
-- Policies for family-photos bucket
-- Path convention: {family_id}/{post_id}/{filename}
-- =============================================================================

create policy "family-photos: members read"
  on storage.objects for select
  using (
    bucket_id = 'family-photos'
    and is_family_member((storage.foldername(name))[1]::uuid)
  );

create policy "family-photos: members upload"
  on storage.objects for insert
  with check (
    bucket_id = 'family-photos'
    and is_family_member((storage.foldername(name))[1]::uuid)
    and auth.uid() is not null
  );

create policy "family-photos: owner deletes own uploads"
  on storage.objects for delete
  using (
    bucket_id = 'family-photos'
    and owner = auth.uid()
  );

-- =============================================================================
-- avatars: public read, authenticated write to own path
-- Path convention: {user_id}/{filename}
-- =============================================================================

create policy "avatars: public read"
  on storage.objects for select
  using (bucket_id = 'avatars');

create policy "avatars: user uploads own"
  on storage.objects for insert
  with check (
    bucket_id = 'avatars'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

create policy "avatars: user updates own"
  on storage.objects for update
  using (
    bucket_id = 'avatars'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

create policy "avatars: user deletes own"
  on storage.objects for delete
  using (
    bucket_id = 'avatars'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

-- =============================================================================
-- gazettes: members read only, writes only via service role
-- Path convention: {family_id}/{edition_id}.pdf
-- =============================================================================

create policy "gazettes: members read"
  on storage.objects for select
  using (
    bucket_id = 'gazettes'
    and is_family_member((storage.foldername(name))[1]::uuid)
  );
