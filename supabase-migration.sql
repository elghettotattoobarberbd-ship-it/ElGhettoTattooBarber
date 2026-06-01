-- ============================================================
-- GhettoBarberTattoo — Migración completa
-- Pegar en: Supabase → SQL Editor → New query → Run
-- Orden: tablas sin FK primero, luego las que referencian otras.
-- ============================================================


-- ── 1. ARTISTS ──────────────────────────────────────────────
create table if not exists artists (
  id               uuid primary key default gen_random_uuid(),
  slug             text unique not null,
  name             text not null,
  role             text not null,          -- 'Tatuadora' | 'Barbero'
  bio              text,
  experience_years numeric,
  styles           text[],
  instagram        text,
  whatsapp         text,
  avatar_url       text,
  cover_url        text,
  is_active        boolean default true,
  sort_order       int default 0,
  created_at       timestamptz default now(),
  updated_at       timestamptz default now()
);


-- ── 2. TATTOO_STYLES ────────────────────────────────────────
create table if not exists tattoo_styles (
  id          uuid primary key default gen_random_uuid(),
  slug        text unique not null,
  label       text not null,
  description text,
  kind        text not null default 'tatuaje',  -- 'tatuaje' | 'barber'
  sort_order  int default 0
);

-- Seeds de estilos tatuaje
insert into tattoo_styles (slug, label, kind, sort_order) values
  ('black-and-grey',  'Black & Grey',    'tatuaje', 1),
  ('realismo',        'Realismo',         'tatuaje', 2),
  ('puntillismo',     'Puntillismo',      'tatuaje', 3),
  ('fullcolor',       'Full Color',       'tatuaje', 4),
  ('watercolor',      'Watercolor',       'tatuaje', 5),
  ('tradicional',     'Tradicional',      'tatuaje', 6),
  ('neo-tradicional', 'Neo-Tradicional',  'tatuaje', 7),
  ('fineline',        'Fine Line',        'tatuaje', 8)
on conflict (slug) do nothing;

-- Seeds de estilos barber
insert into tattoo_styles (slug, label, kind, sort_order) values
  ('fade',    'Fade',    'barber', 1),
  ('clasico', 'Clásico', 'barber', 2),
  ('barba',   'Barba',   'barber', 3),
  ('moderno', 'Moderno', 'barber', 4),
  ('ninos',   'Niños',   'barber', 5)
on conflict (slug) do nothing;


-- ── 3. GALLERY_ITEMS ────────────────────────────────────────
create table if not exists gallery_items (
  id           uuid primary key default gen_random_uuid(),
  kind         text not null default 'tatuaje',   -- 'tatuaje' | 'barber'
  artist_id    uuid references artists(id) on delete set null,
  style_id     uuid references tattoo_styles(id) on delete set null,
  title        text,
  caption      text,
  image_url    text not null,
  thumb_url    text,
  width        int,
  height       int,
  tags         text[],
  is_featured  boolean default false,
  is_published boolean default true,
  taken_at     date,
  sort_order   int default 0,
  created_at   timestamptz default now()
);

create index if not exists gallery_items_kind_published_idx
  on gallery_items (kind, is_published, sort_order desc);

create index if not exists gallery_items_style_idx
  on gallery_items (style_id);


-- ── 4. TESTIMONIALS ─────────────────────────────────────────
create table if not exists testimonials (
  id             uuid primary key default gen_random_uuid(),
  client_name    text not null,
  client_handle  text,
  rating         int check (rating between 1 and 5),
  body           text not null,
  service_type   text,   -- 'tatuaje' | 'barber'
  photo_url      text,
  is_published   boolean default true,
  sort_order     int default 0,
  created_at     timestamptz default now()
);


-- ── 5. FAQS ─────────────────────────────────────────────────
create table if not exists faqs (
  id           uuid primary key default gen_random_uuid(),
  question     text not null,
  answer       text not null,
  category     text,   -- 'tatuaje' | 'cuidados' | 'reserva' | 'precios'
  sort_order   int default 0,
  is_published boolean default true
);


-- ── 6. HOURS ────────────────────────────────────────────────
create table if not exists hours (
  id          uuid primary key default gen_random_uuid(),
  weekday     int check (weekday between 0 and 6),  -- 0 = domingo
  open_time   time,
  close_time  time,
  capacity    int default 1,
  block_label text,    -- 'mañana' | 'tarde'
  is_closed   boolean default false
);

alter table hours add column if not exists capacity int default 1;


-- ── 7. BOOKINGS ─────────────────────────────────────────────
create table if not exists bookings (
  id              uuid primary key default gen_random_uuid(),
  artist_id       uuid references artists(id),
  service_type    text not null,   -- 'tatuaje' | 'barber'
  style_id        uuid references tattoo_styles(id),
  client_name     text not null,
  client_phone    text not null,
  size_cm         text,
  body_part       text,
  description     text,
  reference_urls  text[],
  preferred_date  date,
  preferred_time  text,
  status          text default 'pending',   -- pending|contacted|booked|done|cancelled
  whatsapp_sent   boolean default false,
  created_at      timestamptz default now()
);


-- ── 8. SITE_SETTINGS ────────────────────────────────────────
create table if not exists site_settings (
  key        text primary key,
  value      jsonb not null,
  updated_at timestamptz default now()
);

insert into site_settings (key, value) values
  ('home_video_url',    '""'::jsonb),
  ('home_video_poster', '""'::jsonb)
on conflict (key) do nothing;


-- ── 9. UPDATED_AT automático (artists) ──────────────────────
create or replace function set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create or replace trigger artists_updated_at
  before update on artists
  for each row execute procedure set_updated_at();


-- ── 10. RLS — Row Level Security ────────────────────────────

-- Habilitar RLS en todas las tablas
alter table artists        enable row level security;
alter table tattoo_styles  enable row level security;
alter table gallery_items  enable row level security;
alter table testimonials   enable row level security;
alter table faqs           enable row level security;
alter table hours          enable row level security;
alter table bookings       enable row level security;
alter table site_settings  enable row level security;

-- Lectura pública (SELECT anónimo)
create policy "public read artists"
  on artists for select using (is_active = true);

create policy "public read tattoo_styles"
  on tattoo_styles for select using (true);

create policy "public read gallery_items"
  on gallery_items for select using (is_published = true);

create policy "public read testimonials"
  on testimonials for select using (is_published = true);

create policy "public read faqs"
  on faqs for select using (is_published = true);

create policy "public read hours"
  on hours for select using (true);

create policy "public read site_settings"
  on site_settings for select using (true);

-- Bookings: insertar sin autenticar (formulario público)
create policy "public insert bookings"
  on bookings for insert with check (true);

-- Escritura completa para usuarios autenticados (admin)
create policy "auth full access artists"
  on artists for all using (auth.role() = 'authenticated');

create policy "auth full access tattoo_styles"
  on tattoo_styles for all using (auth.role() = 'authenticated');

create policy "auth full access gallery_items"
  on gallery_items for all using (auth.role() = 'authenticated');

create policy "auth full access testimonials"
  on testimonials for all using (auth.role() = 'authenticated');

create policy "auth full access faqs"
  on faqs for all using (auth.role() = 'authenticated');

create policy "auth full access hours"
  on hours for all using (auth.role() = 'authenticated');

create policy "auth full access bookings"
  on bookings for all using (auth.role() = 'authenticated');

create policy "auth full access site_settings"
  on site_settings for all using (auth.role() = 'authenticated');


-- ── 11. STORAGE BUCKETS ─────────────────────────────────────
-- Correr esto por separado si los buckets no existen todavía:
--
-- insert into storage.buckets (id, name, public) values
--   ('gallery',      'gallery',      true),
--   ('artists',      'artists',      true),
--   ('testimonials', 'testimonials', true),
--   ('references',   'references',   false),
--   ('courses',      'courses',      true),
--   ('site',         'site',         true)
-- on conflict (id) do nothing;
