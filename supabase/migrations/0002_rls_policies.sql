-- =============================================================================
-- Row Level Security policies
-- =============================================================================
-- Rules:
--  - Users see only families they belong to
--  - Only owner/admin can mutate family settings, recipients, subscriptions
--  - Members (contributor+) can create posts in their family
--  - Photos follow post access
--  - Editions readable by all family members, mutable by owner/admin (or system)
-- =============================================================================

alter table families      enable row level security;
alter table recipients    enable row level security;
alter table memberships   enable row level security;
alter table editions      enable row level security;
alter table posts         enable row level security;
alter table photos        enable row level security;
alter table subscriptions enable row level security;
alter table invitations   enable row level security;

-- -----------------------------------------------------------------------------
-- Helper: is current auth user a member of a family, optionally with role check
-- -----------------------------------------------------------------------------
create or replace function is_family_member(fid uuid)
returns boolean as $$
  select exists (
    select 1 from memberships
    where family_id = fid and user_id = auth.uid()
  );
$$ language sql stable security definer;

create or replace function is_family_admin(fid uuid)
returns boolean as $$
  select exists (
    select 1 from memberships
    where family_id = fid and user_id = auth.uid()
      and role in ('owner', 'admin')
  );
$$ language sql stable security definer;

-- -----------------------------------------------------------------------------
-- families
-- -----------------------------------------------------------------------------
create policy "families: members read"
  on families for select
  using (is_family_member(id));

create policy "families: any authenticated user creates (becomes owner)"
  on families for insert
  with check (auth.uid() = owner_id);

create policy "families: admins update"
  on families for update
  using (is_family_admin(id));

create policy "families: owner deletes"
  on families for delete
  using (owner_id = auth.uid());

-- -----------------------------------------------------------------------------
-- recipients
-- -----------------------------------------------------------------------------
create policy "recipients: members read"
  on recipients for select
  using (is_family_member(family_id));

create policy "recipients: admins insert"
  on recipients for insert
  with check (is_family_admin(family_id));

create policy "recipients: admins update"
  on recipients for update
  using (is_family_admin(family_id));

create policy "recipients: admins delete"
  on recipients for delete
  using (is_family_admin(family_id));

-- -----------------------------------------------------------------------------
-- memberships
-- -----------------------------------------------------------------------------
create policy "memberships: members read"
  on memberships for select
  using (is_family_member(family_id));

-- Allow user to insert their own membership as owner (when creating family)
-- Admins can also add members
create policy "memberships: self-insert or admin"
  on memberships for insert
  with check (
    user_id = auth.uid() or is_family_admin(family_id)
  );

create policy "memberships: self or admin updates"
  on memberships for update
  using (
    user_id = auth.uid() or is_family_admin(family_id)
  );

create policy "memberships: self or admin deletes"
  on memberships for delete
  using (
    user_id = auth.uid() or is_family_admin(family_id)
  );

-- -----------------------------------------------------------------------------
-- editions
-- -----------------------------------------------------------------------------
create policy "editions: members read"
  on editions for select
  using (is_family_member(family_id));

create policy "editions: admins write"
  on editions for all
  using (is_family_admin(family_id))
  with check (is_family_admin(family_id));

-- -----------------------------------------------------------------------------
-- posts
-- -----------------------------------------------------------------------------
create policy "posts: members read"
  on posts for select
  using (is_family_member(family_id));

create policy "posts: contributors create"
  on posts for insert
  with check (
    is_family_member(family_id) and author_id = auth.uid()
  );

create policy "posts: authors update own"
  on posts for update
  using (author_id = auth.uid() or is_family_admin(family_id));

create policy "posts: authors delete own"
  on posts for delete
  using (author_id = auth.uid() or is_family_admin(family_id));

-- -----------------------------------------------------------------------------
-- photos (follow post access)
-- -----------------------------------------------------------------------------
create policy "photos: read via post"
  on photos for select
  using (
    exists (select 1 from posts p
            where p.id = photos.post_id and is_family_member(p.family_id))
  );

create policy "photos: write via own post"
  on photos for insert
  with check (
    exists (select 1 from posts p
            where p.id = photos.post_id and p.author_id = auth.uid())
  );

create policy "photos: delete via own post or admin"
  on photos for delete
  using (
    exists (select 1 from posts p
            where p.id = photos.post_id
              and (p.author_id = auth.uid() or is_family_admin(p.family_id)))
  );

-- -----------------------------------------------------------------------------
-- subscriptions (only admins see/manage; payment webhooks use service role)
-- -----------------------------------------------------------------------------
create policy "subscriptions: admins read"
  on subscriptions for select
  using (is_family_admin(family_id));

create policy "subscriptions: admins update"
  on subscriptions for update
  using (is_family_admin(family_id));

-- -----------------------------------------------------------------------------
-- invitations
-- -----------------------------------------------------------------------------
create policy "invitations: admins read"
  on invitations for select
  using (is_family_admin(family_id));

create policy "invitations: admins create"
  on invitations for insert
  with check (is_family_admin(family_id) and invited_by = auth.uid());

create policy "invitations: admins delete"
  on invitations for delete
  using (is_family_admin(family_id));

-- Accepting invitations: readable publicly by token (checked in app code)
-- Safer: the accept flow runs server-side with service role key
