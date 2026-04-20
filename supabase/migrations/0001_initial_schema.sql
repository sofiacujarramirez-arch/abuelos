-- =============================================================================
-- I Love my abuela — initial schema
-- =============================================================================
-- Core domain:
--   families — a family unit, centered around one or more abuelos (recipients)
--   recipients — the abuelos who receive the printed gazette
--   memberships — family members (users) with roles
--   posts — photos + messages contributed by family members
--   photos — uploaded images attached to posts
--   editions — a specific issue of the gazette for a period
--   subscriptions — payment state per family
-- =============================================================================

create extension if not exists "uuid-ossp";
create extension if not exists "pgcrypto";

-- =============================================================================
-- Enums
-- =============================================================================
create type family_role as enum ('owner', 'admin', 'contributor', 'viewer');
create type post_status as enum ('draft', 'published', 'in_gazette', 'archived');
create type edition_status as enum ('collecting', 'locked', 'generating', 'ready', 'shipped', 'delivered');
create type subscription_plan as enum ('mensual', 'mensual_plus', 'quincenal', 'semanal');
create type subscription_status as enum ('trialing', 'active', 'past_due', 'paused', 'cancelled');

-- =============================================================================
-- families
-- =============================================================================
create table families (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  code text not null unique,
  owner_id uuid not null references auth.users(id) on delete restrict,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index families_owner_idx on families(owner_id);

-- =============================================================================
-- recipients (the abuelos — destinatarios de la gaceta)
-- =============================================================================
create table recipients (
  id uuid primary key default uuid_generate_v4(),
  family_id uuid not null references families(id) on delete cascade,
  name text not null,
  nickname text,
  term_of_endearment text default 'abuela', -- abuela, abuelita, nona, tita
  birth_date date,
  photo_url text,
  address_line1 text not null,
  address_line2 text,
  city text not null,
  department text,
  postal_code text,
  country text not null default 'CO',
  phone text,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index recipients_family_idx on recipients(family_id);

-- =============================================================================
-- memberships (join table user <-> family)
-- =============================================================================
create table memberships (
  id uuid primary key default uuid_generate_v4(),
  family_id uuid not null references families(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  role family_role not null default 'contributor',
  display_name text not null,
  relationship text, -- "hija", "nieto", "yerno", "ahijada"
  avatar_url text,
  joined_at timestamptz not null default now(),
  unique (family_id, user_id)
);

create index memberships_family_idx on memberships(family_id);
create index memberships_user_idx on memberships(user_id);

-- =============================================================================
-- editions (each issue of the gazette)
-- =============================================================================
create table editions (
  id uuid primary key default uuid_generate_v4(),
  family_id uuid not null references families(id) on delete cascade,
  recipient_id uuid not null references recipients(id) on delete cascade,
  number int not null, -- sequential per family+recipient
  period_start date not null,
  period_end date not null,
  closes_at timestamptz not null, -- submission deadline
  status edition_status not null default 'collecting',
  pdf_url text,
  shipped_at timestamptz,
  delivered_at timestamptz,
  tracking_number text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (family_id, recipient_id, number)
);

create index editions_family_idx on editions(family_id);
create index editions_recipient_idx on editions(recipient_id);
create index editions_status_idx on editions(status);

-- =============================================================================
-- posts
-- =============================================================================
create table posts (
  id uuid primary key default uuid_generate_v4(),
  family_id uuid not null references families(id) on delete cascade,
  author_id uuid not null references auth.users(id) on delete set null,
  edition_id uuid references editions(id) on delete set null,
  message text not null,
  status post_status not null default 'published',
  event_date date,
  event_type text, -- "birthday", "trip", "graduation", "holiday"
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index posts_family_idx on posts(family_id);
create index posts_author_idx on posts(author_id);
create index posts_edition_idx on posts(edition_id);
create index posts_created_idx on posts(created_at desc);

-- =============================================================================
-- photos
-- =============================================================================
create table photos (
  id uuid primary key default uuid_generate_v4(),
  post_id uuid not null references posts(id) on delete cascade,
  storage_path text not null, -- path in supabase storage bucket
  caption text,
  display_order int not null default 0,
  width int,
  height int,
  created_at timestamptz not null default now()
);

create index photos_post_idx on photos(post_id);

-- =============================================================================
-- subscriptions
-- =============================================================================
create table subscriptions (
  id uuid primary key default uuid_generate_v4(),
  family_id uuid not null unique references families(id) on delete cascade,
  plan subscription_plan not null default 'mensual',
  status subscription_status not null default 'trialing',
  current_period_start timestamptz,
  current_period_end timestamptz,
  stripe_customer_id text,
  stripe_subscription_id text,
  cancel_at_period_end boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- =============================================================================
-- invitations (invitar familiares a unirse a la familia)
-- =============================================================================
create table invitations (
  id uuid primary key default uuid_generate_v4(),
  family_id uuid not null references families(id) on delete cascade,
  invited_by uuid not null references auth.users(id) on delete cascade,
  email text,
  phone text,
  token text not null unique default encode(gen_random_bytes(16), 'hex'),
  accepted_at timestamptz,
  accepted_by uuid references auth.users(id),
  expires_at timestamptz not null default (now() + interval '30 days'),
  created_at timestamptz not null default now()
);

create index invitations_family_idx on invitations(family_id);
create index invitations_token_idx on invitations(token);

-- =============================================================================
-- Updated-at trigger helper
-- =============================================================================
create or replace function set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger families_updated_at before update on families
  for each row execute function set_updated_at();
create trigger recipients_updated_at before update on recipients
  for each row execute function set_updated_at();
create trigger editions_updated_at before update on editions
  for each row execute function set_updated_at();
create trigger posts_updated_at before update on posts
  for each row execute function set_updated_at();
create trigger subscriptions_updated_at before update on subscriptions
  for each row execute function set_updated_at();

-- =============================================================================
-- Helper: generate a unique human-readable family code like "CUJAR-8472"
-- =============================================================================
create or replace function generate_family_code(base text default 'FAMILIA')
returns text as $$
declare
  candidate text;
  tries int := 0;
begin
  loop
    candidate := upper(substring(regexp_replace(base, '[^a-zA-Z]', '', 'g') from 1 for 8))
                 || '-' || lpad(floor(random() * 10000)::text, 4, '0');
    if not exists (select 1 from families where code = candidate) then
      return candidate;
    end if;
    tries := tries + 1;
    if tries > 20 then
      raise exception 'Could not generate unique family code';
    end if;
  end loop;
end;
$$ language plpgsql volatile;
