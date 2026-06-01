# El Ghetto Tattoo & Barber — Modelo de datos Supabase

Schema diseñado para que un panel de admin pueda subir/editar fotos, artistas, testimonios, FAQs, horarios y reservas. Todas las tablas usan `uuid` como PK y tienen `created_at`, `updated_at`.

---

## 1. `artists` — Tatuadores / barberos
```sql
create table artists (
  id            uuid primary key default gen_random_uuid(),
  slug          text unique not null,            -- "celeste-ibarra"
  name          text not null,                   -- "Celeste Agostina Ibarra"
  role          text not null,                   -- "Tatuadora" / "Barbero"
  bio           text,
  experience_years numeric,                      -- 4.5
  styles        text[],                          -- ['black-and-grey','fineline',...]
  instagram     text,                            -- "celesteagostina.ttt"
  whatsapp      text,                            -- "+5493543316916"
  avatar_url    text,                            -- storage public url
  cover_url     text,
  is_active     boolean default true,
  sort_order    int default 0,
  created_at    timestamptz default now(),
  updated_at    timestamptz default now()
);
```

## 2. `tattoo_styles` — Catálogo de estilos (filtros de galería)
```sql
create table tattoo_styles (
  id          uuid primary key default gen_random_uuid(),
  slug        text unique not null,              -- "black-and-grey"
  label       text not null,                     -- "Black & Grey"
  description text,
  kind        text not null default 'tatuaje',   -- 'tatuaje' | 'barber'
  sort_order  int default 0
);
```
Seed sugerida tatuaje: `black-and-grey`, `realismo`, `puntillismo`, `fullcolor`, `watercolor`, `tradicional`, `neo-tradicional`, `fineline`.
Seed sugerida barber: `fade`, `clasico`, `barba`, `moderno`, `ninos`.

## 3. `gallery_items` — Portfolio (la pieza central del admin)
```sql
create table gallery_items (
  id           uuid primary key default gen_random_uuid(),
  kind         text not null default 'tatuaje', -- 'tatuaje' | 'barber'
  artist_id    uuid references artists(id) on delete set null,
  style_id     uuid references tattoo_styles(id) on delete set null,
  title        text,
  caption      text,
  image_url    text not null,                    -- storage public url (full)
  thumb_url    text,                             -- 600px webp
  width        int,
  height       int,
  tags         text[],
  is_featured  boolean default false,            -- destacar en hero
  is_published boolean default true,
  taken_at     date,
  sort_order   int default 0,
  created_at   timestamptz default now()
);

create index on gallery_items (kind, is_published, sort_order desc);
create index on gallery_items (style_id);
```

## 4. `testimonials`
```sql
create table testimonials (
  id           uuid primary key default gen_random_uuid(),
  client_name  text not null,
  client_handle text,                            -- "@nico_arg"
  rating       int check (rating between 1 and 5),
  body         text not null,
  service_type text,                             -- "tatuaje" / "barber"
  photo_url    text,
  is_published boolean default true,
  sort_order   int default 0,
  created_at   timestamptz default now()
);
```

## 5. `faqs`
```sql
create table faqs (
  id          uuid primary key default gen_random_uuid(),
  question    text not null,
  answer      text not null,
  category    text,                              -- "tatuaje","cuidados","reserva","precios"
  sort_order  int default 0,
  is_published boolean default true
);
```

## 6. `hours` — Horarios de atención
```sql
create table hours (
  id          uuid primary key default gen_random_uuid(),
  weekday     int check (weekday between 0 and 6), -- 0 = domingo
  open_time   time,
  close_time  time,
  capacity    int default 1,
  block_label text,                              -- "mañana" / "tarde" (para días con corte)
  is_closed   boolean default false
);
```
Permite múltiples filas por día (martes-jueves tienen 2 bloques) y define cuántos turnos/barberos hay por bloque.

## 7. `bookings` — Solicitudes de turno
Aun usando WhatsApp como canal principal, guardamos un registro local para tracking.
```sql
create table bookings (
  id            uuid primary key default gen_random_uuid(),
  artist_id     uuid references artists(id),
  service_type  text not null,                   -- "tatuaje" / "barber"
  style_id      uuid references tattoo_styles(id),
  client_name   text not null,
  client_phone  text not null,
  size_cm       text,                            -- "10x15"
  body_part     text,                            -- "antebrazo"
  description   text,
  reference_urls text[],                         -- links a refs subidas
  preferred_date date,
  preferred_time text,
  status        text default 'pending',          -- pending|contacted|booked|done|cancelled
  whatsapp_sent boolean default false,
  created_at    timestamptz default now()
);
```

## 8. `site_settings` — Configuración del sitio (key/value)
```sql
create table site_settings (
  key   text primary key,                        -- "hero_variant", "address", "phone"
  value jsonb not null,
  updated_at timestamptz default now()
);
```

---

---

## Cómo conectar el panel admin

1. Creá un proyecto en https://app.supabase.com.
2. Corré las migraciones (`create table …`) en el SQL Editor o usando el CLI.
3. **Settings → API** → copiá `Project URL` y `anon public` key.
4. Pegalos en `admin/config.js` (campos `SUPABASE_URL` y `SUPABASE_ANON_KEY`).
5. Agregá tu email a `ADMIN_EMAILS` en el mismo archivo (whitelist).
6. **Authentication → Providers** → activá *Email* (sign up off / magic link off, password on).
7. **Authentication → Users** → invitá a vos misma (te llega un mail para fijar contraseña).
8. Entrá a `admin.html` y logueate.

## Storage buckets
## 11. Storage buckets (actualizado)
- `gallery`, `artists`, `testimonials`, `references`, `courses` — como antes
- **`site`** — público — usado por Configuración del panel para subir el video del home y la imagen de tapa.

## 12. Seeds de `site_settings` (opcional)
```sql
insert into site_settings (key, value) values
  ('home_video_url',    '""'::jsonb),
  ('home_video_poster', '""'::jsonb)
on conflict (key) do nothing;
```
El admin guarda `value` como string JSON. El sitio lee la clave y la usa directamente como URL.

## RLS (Row Level Security)
- `select` público en: `artists`, `tattoo_styles`, `gallery_items` (donde `is_published`), `testimonials` (idem), `faqs` (idem), `hours`, `site_settings`.
- `insert/update/delete` en todas: solo rol `admin` (JWT claim).
- `bookings`: `insert` anónimo permitido; `select/update` solo admin.

## Realtime
Suscribirse a `gallery_items` y `testimonials` para que cuando el admin publique algo nuevo aparezca en el sitio sin recargar.
