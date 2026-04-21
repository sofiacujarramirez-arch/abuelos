-- =============================================================================
-- 0007 — editions public slug + lazy edition creation
-- =============================================================================
-- Adds a unique public_slug column to editions so a family member can share a
-- link to the gazette with the recipient (no login needed). The slug is
-- generated server-side and is essentially unguessable.
--
-- Provides two SECURITY DEFINER RPCs:
--   get_or_create_edition(fid, y, m) — called by family members when visiting
--     /gaceta. Lazily creates the edition row for (family, month, year) and
--     returns its id + slug.
--   lookup_gazette_by_slug(slug) — granted to anon + authenticated. Returns
--     enough info (family_id, period_start, period_end) for the public page
--     to render the gazette without login.
-- =============================================================================

alter table editions add column if not exists public_slug text unique;

-- Unique (family_id, period_start) so upsert-by-period is safe. Covers the
-- "one edition per family per month" invariant.
create unique index if not exists editions_family_period_uidx
  on editions(family_id, period_start);

-- -----------------------------------------------------------------------------
-- get_or_create_edition: called when a family member opens /gaceta
-- -----------------------------------------------------------------------------
create or replace function get_or_create_edition(fid uuid, y int, m int)
returns table (
  edition_id uuid,
  public_slug text,
  period_start date,
  period_end date,
  status edition_status
)
language plpgsql
security definer
set search_path = public
as $$
declare
  v_start date;
  v_end date;
  v_recipient_id uuid;
  v_next_number int;
  v_slug text;
  v_edition_id uuid;
  v_public_slug text;
  v_status edition_status;
begin
  if auth.uid() is null then
    raise exception 'not authenticated';
  end if;
  if not is_family_member(fid) then
    raise exception 'not a member of this family';
  end if;

  v_start := make_date(y, m, 1);
  v_end := (v_start + interval '1 month')::date;

  -- Fast path: already exists
  select e.id, e.public_slug, e.status
    into v_edition_id, v_public_slug, v_status
  from editions e
  where e.family_id = fid and e.period_start = v_start;

  if v_edition_id is null then
    select r.id into v_recipient_id
    from recipients r
    where r.family_id = fid
    order by r.created_at asc
    limit 1;

    if v_recipient_id is null then
      raise exception 'family has no recipient';
    end if;

    select coalesce(max(number), 0) + 1 into v_next_number
    from editions
    where family_id = fid and recipient_id = v_recipient_id;

    v_slug := replace(replace(encode(gen_random_bytes(12), 'base64'), '/', '_'), '+', '-');
    v_slug := rtrim(v_slug, '=');

    insert into editions(
      family_id, recipient_id, number,
      period_start, period_end, closes_at,
      status, public_slug
    )
    values (
      fid, v_recipient_id, v_next_number,
      v_start, v_end, v_end::timestamptz,
      'collecting', v_slug
    )
    returning id, editions.public_slug, editions.status
      into v_edition_id, v_public_slug, v_status;
  end if;

  -- Backfill slug if the edition existed but had none
  if v_public_slug is null then
    v_slug := replace(replace(encode(gen_random_bytes(12), 'base64'), '/', '_'), '+', '-');
    v_slug := rtrim(v_slug, '=');
    update editions set public_slug = v_slug where id = v_edition_id
      returning editions.public_slug into v_public_slug;
  end if;

  return query select v_edition_id, v_public_slug, v_start, v_end, v_status;
end;
$$;

revoke all on function get_or_create_edition(uuid, int, int) from public;
grant execute on function get_or_create_edition(uuid, int, int) to authenticated;

-- -----------------------------------------------------------------------------
-- lookup_gazette_by_slug: public lookup for the share link
-- -----------------------------------------------------------------------------
create or replace function lookup_gazette_by_slug(slug_in text)
returns table (
  edition_id uuid,
  family_id uuid,
  recipient_id uuid,
  period_start date,
  period_end date
)
language sql
security definer
set search_path = public
as $$
  select e.id, e.family_id, e.recipient_id, e.period_start, e.period_end
  from editions e
  where e.public_slug = slug_in
  limit 1;
$$;

revoke all on function lookup_gazette_by_slug(text) from public;
grant execute on function lookup_gazette_by_slug(text) to anon, authenticated;
