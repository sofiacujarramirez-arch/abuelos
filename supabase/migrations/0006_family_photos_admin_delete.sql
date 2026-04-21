-- =============================================================================
-- Allow family admins to delete ANY photo in their family's folder
-- (not just their own uploads). Needed for admin moderation / post deletion.
-- Path convention: {family_id}/{user_id}/{timestamp}-{i}.{ext}
-- =============================================================================

drop policy if exists "family-photos: owner deletes own uploads" on storage.objects;

create policy "family-photos: owner or family admin deletes"
  on storage.objects for delete
  using (
    bucket_id = 'family-photos'
    and (
      owner = auth.uid()
      or is_family_admin((storage.foldername(name))[1]::uuid)
    )
  );
