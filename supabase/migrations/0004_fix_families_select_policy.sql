-- Fix: INSERT ... RETURNING on families triggered SELECT policy which required
-- membership, but membership is created right after. Allow owner to SELECT
-- their own family regardless of membership state.

drop policy if exists "families: members read" on families;

create policy "families: members or owner read"
  on families for select
  using (is_family_member(id) or owner_id = auth.uid());
