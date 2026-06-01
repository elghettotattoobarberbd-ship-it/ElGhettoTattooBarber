// components/Home.jsx — Home-only sections: HomeFeature + CTAStrip

function HomeFeature() {
  const [tat, setTat] = React.useState(null); // null = loading
  const [bar, setBar] = React.useState(null);

  React.useEffect(() => {
    (async () => {
      if (!window.sb) { setTat([]); setBar([]); return; }
      try {
        const [t, b] = await Promise.all([
          window.sb.from('gallery_items').select('*').eq('kind', 'tatuaje').eq('is_published', true).eq('is_featured', true)
            .order('sort_order', { ascending: false })
            .order('created_at', { ascending: false })
            .limit(4),
          window.sb.from('gallery_items').select('*').eq('kind', 'barber').eq('is_published', true).eq('is_featured', true)
            .order('sort_order', { ascending: false })
            .order('created_at', { ascending: false })
            .limit(4),
        ]);
        setTat(t.data || []);
        setBar(b.data || []);
      } catch {
        setTat([]); setBar([]);
      }
    })();
  }, []);

  // Fallback to placeholders if Supabase has nothing yet
  const tatPreview = (tat && tat.length > 0) ? tat : TATTOO_GALLERY.slice(0, 4);
  const barPreview = (bar && bar.length > 0) ? bar : BARBER_GALLERY.slice(0, 4);
  const tatFromDb = tat && tat.length > 0;
  const barFromDb = bar && bar.length > 0;

  const renderTile = (it, fromDb, Placeholder) => {
    if (fromDb && it.image_url) {
      return <img src={it.thumb_url || it.image_url} alt={it.title || ''} loading="lazy"/>;
    }
    return <Placeholder id={it.id} style={it.style} hue={it.hue} light={it.light}/>;
  };

  return (
    <section className="section home-feature">
      <div className="container">
        <div className="eyebrow">01 · Lo que hacemos</div>
        <h2 className="section-title">
          <span>Dos </span>
          <span className="yellow">oficios</span>
          <span>, un solo </span>
          <span className="stroke">techo.</span>
        </h2>
        <p className="section-sub">
          Diseñamos tatuajes únicos y creamos estilos que hablan por vos. Profesionalismo, detalle y pasión en cada trabajo.
        </p>

        <div className="home-feature-grid">
          {/* TATUAJES */}
          <a href="galeria.html" className="feature-card">
            <div className="feature-label">
              <span className="num">/01</span>
              <span>Tatuajes</span>
            </div>
            <h3 className="feature-title">
              <span>Marca tu </span>
              <span className="yellow">piel.</span>
            </h3>
            <p className="feature-bio">
              Black &amp; grey, color, fineline, tradicional. Cada pieza diseñada con vos y tatuada con respeto.
            </p>
            <div className="feature-preview">
              {tatPreview.map((it) => (
                <div className="feature-preview-tile" key={it.id}>
                  {renderTile(it, tatFromDb, TattooPlaceholder)}
                </div>
              ))}
            </div>
            <div className="feature-cta">
              <span>Ver portfolio</span>
              <Icon name="arrowRight" size={18}/>
            </div>
          </a>

          {/* BARBERÍA */}
          <a href="galeria.html" className="feature-card feature-card-alt">
            <div className="feature-label">
              <span className="num">/02</span>
              <span>Barbería</span>
            </div>
            <h3 className="feature-title">
              <span>Llevá tu corte al </span>
              <span className="yellow">próximo nivel.</span>
            </h3>
            <p className="feature-bio">
              Equipo de barberos profesionales. Fades, clásicos, barbas y diseños — una experiencia completa.
            </p>
            <div className="feature-preview">
              {barPreview.map((it) => (
                <div className="feature-preview-tile" key={it.id}>
                  {renderTile(it, barFromDb, BarberPlaceholder)}
                </div>
              ))}
            </div>
            <div className="feature-cta">
              <span>Ver los cortes</span>
              <Icon name="arrowRight" size={18}/>
            </div>
          </a>
        </div>
      </div>
    </section>
  );
}

function CTAStrip() {
  return (
    <section className="cta-strip">
      <div className="container">
        <div className="cta-strip-inner">
          <div>
            <div className="eyebrow" style={{ color: 'var(--ink)' }}>
              <span style={{ color: 'var(--ink)' }}>04 · Tu turno</span>
            </div>
            <h2 className="cta-strip-title">
              <span>Sacate el </span>
              <span className="stroke-ink">turno.</span>
            </h2>
            <p className="cta-strip-sub">
              Armá tu pedido en 4 pasos y te abrimos WhatsApp con el mensaje listo.
            </p>
          </div>

          <div className="cta-strip-actions">
            <a href="reservar.html" className="btn btn-primary btn-cta-dark">
              Empezar la reserva <Icon name="arrowRight" size={16}/>
            </a>
            <a
              href={`https://wa.me/${STUDIO.phoneIntl.replace(/\D/g, '')}`}
              target="_blank" rel="noopener"
              className="btn btn-ghost-ink"
            >
              <Icon name="whatsapp" size={16}/> O escribinos
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

function HomeContactPeek() {
  const [hours, setHours] = React.useState(null);
  const today = new Date().getDay();

  const normalizeTime = (value) => {
    if (!value) return '';
    const parts = value.split(':');
    return parts.length >= 2 ? `${parts[0].padStart(2, '0')}:${parts[1].padStart(2, '0')}` : value;
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

  const todayBlocks = (hours || STUDIO.hours)[today];
  const fmt = (blocks, closed) => closed ? 'Cerrado' : blocks.map((block) => `${block.from} – ${block.to}`).join(' · ');

  return (
    <section className="section home-peek">
      <div className="container">
        <div className="eyebrow">05 · Encontranos</div>
        <h2 className="section-title">
          <span>Pasá por el </span>
          <span className="yellow">estudio.</span>
        </h2>

        <div className="peek-grid">
          <div className="peek-card">
            <Icon name="mapPin" size={20}/>
            <div className="peek-label">Dirección</div>
            <div className="peek-val">{STUDIO.address}</div>
          </div>
          <div className="peek-card peek-card-today">
            <Icon name="clock" size={20}/>
            <div className="peek-label">Hoy · {todayBlocks.day}</div>
            <div className="peek-val">{fmt(todayBlocks.blocks, todayBlocks.closed)}</div>
          </div>
          <div className="peek-card">
            <Icon name="whatsapp" size={20}/>
            <div className="peek-label">WhatsApp</div>
            <div className="peek-val">{STUDIO.phone}</div>
          </div>
        </div>

        <div style={{ marginTop: 32, display: 'flex', justifyContent: 'center' }}>
          <a href="contacto.html" className="btn btn-ghost">
            Ver toda la info <Icon name="arrowRight" size={14}/>
          </a>
        </div>
      </div>
    </section>
  );
}

Object.assign(window, { HomeFeature, CTAStrip, HomeContactPeek, HomeCoursesTeaser });

// ===========================================================
// HomeCoursesTeaser — "Próximamente cursos" banner
// Loads next courses from Supabase if available, otherwise
// shows a generic coming-soon strip.
// ===========================================================
function HomeCoursesTeaser() {
  const [items, setItems] = React.useState([]);
  const [tried, setTried] = React.useState(false);

  React.useEffect(() => {
    (async () => {
      if (!window.sb) { setTried(true); return; }
      try {
        const { data } = await window.sb
          .from('courses')
          .select('id, title, subtitle, category, start_date, is_coming_soon')
          .or('is_published.eq.true,is_published.is.null')
          .order('is_coming_soon', { ascending: false })
          .order('start_date',     { ascending: true, nullsFirst: false })
          .limit(3);
        setItems(data || []);
      } catch { /* ignore — show fallback */ }
      finally { setTried(true); }
    })();
  }, []);

  return (
    <section className="home-courses-teaser">
      <div className="container">
        <div className="hct-grid">
          <div className="hct-text">
            <div className="hct-eyebrow">
              <span className="hct-dot"></span>
              <span>Capacitaciones · El Ghetto Studio</span>
            </div>
            <h2 className="hct-title">
              <span className="stroke">Próximamente</span>
              <br/>
              <span className="yellow">cursos.</span>
            </h2>
            <p className="hct-sub">
              Capacitaciones intensivas de tatuaje y barbería dictadas en el estudio. Cupos limitados.
            </p>
            <div className="hct-actions">
              <a href="cursos.html" className="btn btn-primary">
                Ver agenda <Icon name="arrowRight" size={14}/>
              </a>
              <a
                href={`https://wa.me/${STUDIO.phoneIntl.replace(/\D/g, '')}?text=${encodeURIComponent('Hola! Quiero info de los próximos cursos.')}`}
                target="_blank" rel="noopener"
                className="btn btn-ghost"
              >
                <Icon name="whatsapp" size={14}/> Quiero info
              </a>
            </div>
          </div>

          <div className="hct-list" aria-hidden={!tried || items.length === 0}>
            {tried && items.length > 0 ? items.map((c) => (
              <a href="cursos.html" className="hct-item" key={c.id}>
                <span className="hct-item-cat">{c.category || 'curso'}</span>
                <div className="hct-item-title">{c.title}</div>
                {c.subtitle && <div className="hct-item-sub">{c.subtitle}</div>}
                <Icon name="arrowRight" size={14}/>
              </a>
            )) : (
              <React.Fragment />
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
