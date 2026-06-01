// components/Contact.jsx
function Contact() {
  // Today: 0 = sunday
  const [hours, setHours] = React.useState(null);
  const today = new Date().getDay();

  const normalizeTime = (value) => {
    if (!value) return '';
    const parts = value.split(':');
    return parts.length >= 2 ? `${parts[0].padStart(2, '0')}:${parts[1].padStart(2, '0')}` : value;
  };

  const formatBlocks = (blocks, closed) => {
    if (closed || !blocks.length) return null;
    return blocks.map((block) => `${block.from} – ${block.to}`).join(' · ');
  };

  React.useEffect(() => {
    (async () => {
      if (!window.sb) {
        setHours(STUDIO.hours);
        return;
      }

      try {
        const { data } = await window.sb
          .from('hours')
          .select('*')
          .order('weekday', { ascending: true })
          .order('open_time', { ascending: true });

        if (!data || !data.length) {
          setHours(STUDIO.hours);
          return;
        }

        const WEEKDAYS = [
          { value: 0, label: 'Domingo' },
          { value: 1, label: 'Lunes' },
          { value: 2, label: 'Martes' },
          { value: 3, label: 'Miércoles' },
          { value: 4, label: 'Jueves' },
          { value: 5, label: 'Viernes' },
          { value: 6, label: 'Sábado' },
        ];

        const mapped = WEEKDAYS.map((day) => {
          const rows = data.filter((row) => row.weekday === day.value);
          if (!rows.length) {
            return { day: day.label, blocks: [], closed: true };
          }

          const openRows = rows.filter((row) => !row.is_closed);
          if (!openRows.length) {
            return { day: day.label, blocks: [], closed: true };
          }

          return {
            day: day.label,
            blocks: openRows.map((row) => [normalizeTime(row.open_time), normalizeTime(row.close_time)]),
            closed: false,
          };
        });

        setHours(mapped);
      } catch (_) {
        setHours(STUDIO.hours);
      }
    })();
  }, []);

  const displayHours = hours || STUDIO.hours;

  const waLink = `https://wa.me/${STUDIO.phoneIntl.replace(/\D/g, '')}`;
  const igLinks = STUDIO.ig.map((h) => ({ handle: '@' + h, url: `https://instagram.com/${h}` }));
  const mapsQuery = encodeURIComponent(STUDIO.address);
  const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${mapsQuery}`;
  // Embed: si hay URL custom (Google) la usamos, si no, OSM como fallback robusto.
  const lat = STUDIO.lat, lng = STUDIO.lng;
  const m = 0.0035;
  const mapEmbed = STUDIO.mapEmbedUrl
    || `https://www.openstreetmap.org/export/embed.html?bbox=${lng - m},${lat - m},${lng + m},${lat + m}&layer=mapnik&marker=${lat},${lng}`;

  return (
    <section className="section" id="contacto">
      <div className="container">
        {/* ==========  MAPA  ========== */}
        <MapBlock mapEmbed={mapEmbed} mapsUrl={mapsUrl}/>

        <div className="contact-grid">
          <div className="info-card">
            <h3>Contacto</h3>
            <a href={`https://www.google.com/maps/search/?api=1&query=${mapsQuery}`} target="_blank" rel="noopener" className="info-row" style={{ cursor: 'pointer' }}>
              <div className="info-icon"><Icon name="mapPin" size={18}/></div>
              <div className="info-content">
                <div className="lbl">Dirección</div>
                <div className="val">{STUDIO.address}</div>
              </div>
            </a>
            <a href={waLink} target="_blank" rel="noopener" className="info-row" style={{ cursor: 'pointer' }}>
              <div className="info-icon"><Icon name="whatsapp" size={18}/></div>
              <div className="info-content">
                <div className="lbl">WhatsApp</div>
                <div className="val">{STUDIO.phone}</div>
              </div>
            </a>
            {igLinks.map((ig) => (
              <a key={ig.handle} href={ig.url} target="_blank" rel="noopener" className="info-row" style={{ cursor: 'pointer' }}>
                <div className="info-icon"><Icon name="instagram" size={18}/></div>
                <div className="info-content">
                  <div className="lbl">Instagram</div>
                  <div className="val">{ig.handle}</div>
                </div>
              </a>
            ))}
            <div className="info-row">
              <div className="info-icon"><Icon name="mail" size={18}/></div>
              <div className="info-content">
                <div className="lbl">Email</div>
                <div className="val">{STUDIO.email}</div>
              </div>
            </div>

            <div style={{ marginTop: 32, display: 'flex', gap: 12, flexWrap: 'wrap' }}>
              <a href={waLink} target="_blank" rel="noopener" className="btn btn-primary" style={{ padding: '14px 22px', fontSize: 14 }}>
                <Icon name="whatsapp" size={16}/> Escribir ahora
              </a>
            </div>
          </div>

          <div className="info-card">
            <h3>Horarios</h3>
            <div className="hours-table">
              {displayHours.map((h, i) => {
                const isToday = i === today;
                return (
                  <div key={h.day} className={`hours-row ${isToday ? 'today' : ''}`}>
                    <div className="hours-day">
                      {h.day} {isToday && <span style={{ marginLeft: 6, fontSize: 10, fontFamily: 'var(--font-mono)' }}>· HOY</span>}
                    </div>
                    <div className="hours-time">
                      {h.closed ? <span className="hours-closed">Cerrado</span> : formatBlocks(h.blocks, h.closed)}
                    </div>
                  </div>
                );
              })}
            </div>

            <div style={{
              marginTop: 24,
              padding: 16,
              background: 'var(--bg-3)',
              border: '1.5px solid var(--border-strong)',
              fontFamily: 'var(--font-mono)',
              fontSize: 11,
              lineHeight: 1.6,
              color: 'var(--bone-dim)',
              letterSpacing: '0.05em',
            }}>
              <span style={{ color: 'var(--yellow)' }}>Importante:</span> Solo atendemos con turno previo.
              Confirmar disponibilidad por WhatsApp antes de venir.
            </div>
          </div>
        </div>

        {/* Instagram strip */}
        <IgStrip/>
      </div>
    </section>
  );
}

// ===========================================================
// IgStrip — 6 thumbnails for the bottom IG block
// Source: Supabase gallery_items (mixed kinds) if available.
// Otherwise: local placeholder set.
// NOTE: this does NOT pull from instagram.com directly.
//       Instagram's API requires a business account + access
//       token + manual approval, which is heavy for a single
//       widget. We mirror it from the admin-managed gallery,
//       so every time you publish a piece it appears here too.
// ===========================================================
function IgStrip() {
  const [items, setItems] = React.useState(null);

  React.useEffect(() => {
    (async () => {
      if (!window.sb) { setItems([]); return; }
      try {
        const { data } = await window.sb
          .from('gallery_items')
          .select('id, image_url, thumb_url, title, kind, style:tattoo_styles(label)')
          .eq('is_published', true)
          .order('is_featured', { ascending: false })
          .order('created_at',  { ascending: false })
          .limit(16);
        setItems(data || []);
      } catch { setItems([]); }
    })();
  }, []);

  const isVideo = (url) => url && /\.(mp4|webm|mov)$/i.test(url);
  const fromDb = items && items.length > 0;
  const base   = fromDb
    ? items.filter((g) => !isVideo(g.image_url))
    : window.GALLERY.slice(0, 12);
  // duplicar para loop seamless (necesita al menos ~8 tiles visibles)
  const display = base.length < 6 ? [...base, ...base, ...base] : [...base, ...base];

  return (
    <div style={{ marginTop: 80 }}>
      <div className="ig-head">
        <div>
          <h3 className="ig-title">
            <span className="yellow">@elghetto.ttt</span>
            <span> en Instagram</span>
          </h3>
          <p className="ig-sub">
            Últimos trabajos publicados desde el panel del estudio — las mismas piezas que ves arriba en la galería.
          </p>
        </div>
        <a href="https://instagram.com/elghetto.ttt" target="_blank" rel="noopener" className="ig-follow">
          Seguir <Icon name="instagram" size={14}/>
        </a>
      </div>

      <div className="ig-marquee-wrap">
        <div className="ig-marquee-track">
          {display.map((g, i) => {
            const kindLabel = g.kind === 'barber' ? 'corte' : 'tatuaje';
            const styleLabel = g.style?.label || g.style || '';
            return (
              <a key={i} href="https://instagram.com/elghetto.ttt" target="_blank" rel="noopener"
                className="ig-tile" title={`${g.title || ''} · ${styleLabel}`}>
                {fromDb && g.image_url
                  ? <img src={g.thumb_url || g.image_url} alt={g.title || ''} loading="lazy"
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}/>
                  : <TattooPlaceholder id={g.id + 100} style={g.style} hue={g.hue} light={g.light}/>}
                <div className="ig-tile-overlay">
                  <Icon name="instagram" size={28}/>
                  <span className="ig-tile-meta">{kindLabel}</span>
                </div>
              </a>
            );
          })}
        </div>
      </div>
    </div>
  );
}

window.Contact = Contact;

// ===========================================================
// MapBlock — graffiti-framed Google Maps embed
// ===========================================================
function MapBlock({ mapEmbed, mapsUrl }) {
  return (
    <div className="map-block">
      {/* eyebrow + heading */}
      <div className="map-head">
        <div className="eyebrow">El punto en el mapa</div>
        <h2 className="map-title">
          <span className="yellow">X marca</span>
          <span className="stroke"> el lugar.</span>
        </h2>
      </div>

      {/* map frame */}
      <div className="map-frame">
        {/* corner tape pieces */}
        <span className="map-tape map-tape-tl"></span>
        <span className="map-tape map-tape-tr"></span>
        <span className="map-tape map-tape-bl"></span>
        <span className="map-tape map-tape-br"></span>

        {/* hand-drawn "ESTAMOS ACÁ" tag with arrow */}
        <div className="map-callout">
          <div className="map-callout-tag">ESTAMOS ACÁ</div>
          <svg className="map-callout-arrow" viewBox="0 0 120 80" fill="none">
            <path d="M10 10 Q 60 10 80 50 L 76 38 M 80 50 L 92 42"
                  stroke="var(--yellow)" strokeWidth="3"
                  strokeLinecap="round" strokeLinejoin="round"
                  strokeDasharray="6 4"/>
          </svg>
        </div>

        {/* pulsing X pin */}
        <div className="map-pin" aria-hidden="true">
          <span className="map-pin-x">×</span>
          <span className="map-pin-pulse"></span>
        </div>

        {/* actual map */}
        <iframe
          className="map-iframe"
          src={mapEmbed}
          title="Ubicación El Ghetto"
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        />

        {/* bottom badge with address + cta */}
        <div className="map-badge">
          <div className="map-badge-info">
            <div className="map-badge-label">Dirección</div>
            <div className="map-badge-addr">{STUDIO.address}</div>
          </div>
          <a href={mapsUrl} target="_blank" rel="noopener" className="map-badge-btn">
            <span>Abrir en Maps</span>
            <Icon name="arrowRight" size={14}/>
          </a>
        </div>
      </div>

      {/* mini info chips below the map */}
      <div className="map-chips">
        <div className="map-chip">
          <Icon name="mapPin" size={14}/>
          <span>{STUDIO.address}</span>
        </div>
        <div className="map-chip">
          <Icon name="clock" size={14}/>
          <span>Solo con turno</span>
        </div>
        <div className="map-chip">
          <Icon name="whatsapp" size={14}/>
          <span>{STUDIO.phone}</span>
        </div>
      </div>
    </div>
  );
}

window.MapBlock = MapBlock;
