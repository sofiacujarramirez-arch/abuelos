-- Lookup family by invite code, bypassing RLS (the code itself is the permission).
-- Returns only {id, name} — never expose owner_id, internal state, etc.

create or replace function lookup_family_by_code(code_in text)
returns table (id uuid, name text) as $$
  select f.id, f.name
  from families f
  where f.code = upper(trim(code_in))
  limit 1;
$$ language sql stable security definer set search_path = public;

grant execute on function lookup_family_by_code(text) to authenticated;
