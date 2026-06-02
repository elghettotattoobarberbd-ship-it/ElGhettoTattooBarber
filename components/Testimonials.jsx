// components/Testimonials.jsx
function Testimonials() {
  const [page, setPage] = React.useState(0);
  const [list, setList] = React.useState([]);

  React.useEffect(() => {
    if (!window.sb) return;
    window.sb
      .from('testimonials')
      .select('id,client_name,client_handle,rating,body,service_type,photo_url,sort_order')
      .eq('is_published', true)
      .order('sort_order', { ascending: true })
      .order('created_at', { ascending: false })
      .then(({ data }) => { if (data && data.length > 0) setList(data); });
  }, []);

  const perPage = 3;
  const pages = Math.ceil(list.length / perPage);
  const current = list.slice(page * perPage, page * perPage + perPage);

  // normalizar campos: Supabase usa client_name/client_handle, el static usa name/handle
  const norm = (t) => ({
    ...t,
    name:   t.name   || t.client_name,
    handle: t.handle || t.client_handle || '',
  });

  const initials = (name) => name.split(' ').map((p) => p[0]).join('').slice(0, 2).toUpperCase();

  // No mostrar la sección si no hay testimonios
  if (list.length === 0) return null;

  return (
    <section className="section" id="testimonios" style={{ background: 'var(--bg-2)' }}>
      <div className="container">
        <div className="eyebrow">04 · Testimonios</div>
        <h2 className="section-title">
          <span>Lo que </span>
          <span className="yellow">cuentan </span>
          <span>los </span>
          <span className="stroke">clientes.</span>
        </h2>
        <p className="section-sub">Reseñas reales que llegaron por DM y Google.</p>

        <div className="testi-row">
          {current.map((t, i) => {
            const n = norm(t);
            return (
            <div key={page + '-' + i} className="testi-card">
              <div className="testi-quote">"</div>
              <div className="stars">
                {Array.from({ length: n.rating }).map((_, k) => <Icon key={k} name="star" size={14}/>)}
              </div>
              <p className="testi-body">{n.body}</p>
              <div className="testi-author">
                {n.photo_url
                  ? <img src={n.photo_url} alt={n.name} className="testi-avatar" style={{ objectFit: 'cover' }}/>
                  : <div className="testi-avatar">{initials(n.name)}</div>}
                <div>
                  <div className="testi-name">{n.name}</div>
                  <div className="testi-handle">{n.handle}</div>
                </div>
              </div>
            </div>
            );
          })}
        </div>

        {pages > 1 && (
          <div style={{ display: 'flex', justifyContent: 'center', gap: 12, marginTop: 40, alignItems: 'center' }}>
            <button className="icon-btn" onClick={() => setPage((p) => (p - 1 + pages) % pages)} style={{ transform: 'rotate(180deg)' }}>
              <Icon name="arrowRight" size={16}/>
            </button>
            <div style={{ display: 'flex', gap: 6 }}>
              {Array.from({ length: pages }).map((_, i) => (
                <button key={i} onClick={() => setPage(i)} style={{
                  width: i === page ? 24 : 8, height: 8,
                  background: i === page ? 'var(--yellow)' : 'var(--border-strong)',
                  border: 'none', borderRadius: 4, transition: 'all 200ms',
                }}/>
              ))}
            </div>
            <button className="icon-btn" onClick={() => setPage((p) => (p + 1) % pages)}>
              <Icon name="arrowRight" size={16}/>
            </button>
          </div>
        )}
      </div>
    </section>
  );
}

window.Testimonials = Testimonials;

// ── Marquee de reseñas (para usar debajo del formulario de reserva) ──
function TestimonialsMarquee() {
  const [list, setList] = React.useState([]);

  React.useEffect(() => {
    if (!window.sb) return;
    window.sb
      .from('testimonials')
      .select('id,client_name,client_handle,rating,body,photo_url')
      .eq('is_published', true)
      .order('sort_order', { ascending: true })
      .order('created_at', { ascending: false })
      .then(({ data }) => { if (data && data.length > 0) setList(data); });
  }, []);

  const norm = (t) => ({
    ...t,
    name:   t.name   || t.client_name   || '',
    handle: t.handle || t.client_handle || '',
  });

  const initials = (name) => (name || '?').split(' ').map((p) => p[0]).join('').slice(0, 2).toUpperCase();

  const base    = list.map(norm);
  const display = base.length < 4 ? [...base, ...base, ...base] : [...base, ...base];

  // No mostrar si no hay testimonios
  if (list.length === 0) return null;

  return (
    <div style={{ padding: '60px 0', background: 'var(--bg)', borderTop: '1px solid var(--border)' }}>
      {/* Encabezado */}
      <div className="container" style={{ marginBottom: 32 }}>
        <div className="eyebrow">Testimonios</div>
        <h2 className="section-title" style={{ fontSize: 'clamp(28px,5vw,48px)' }}>
          <span>Lo que dicen </span>
          <span className="yellow">nuestros </span>
          <span className="stroke">clientes.</span>
        </h2>
      </div>

      {/* Marquee */}
      <div style={{
        overflow: 'hidden',
        WebkitMaskImage: 'linear-gradient(to right, transparent 0%, #000 8%, #000 92%, transparent 100%)',
        maskImage:        'linear-gradient(to right, transparent 0%, #000 8%, #000 92%, transparent 100%)',
      }}>
        <div style={{
          display: 'flex',
          gap: 16,
          width: 'max-content',
          animation: 'marquee 35s linear infinite',
        }}
        onMouseEnter={(e) => e.currentTarget.style.animationPlayState = 'paused'}
        onMouseLeave={(e) => e.currentTarget.style.animationPlayState = 'running'}>
          {display.map((t, i) => (
            <div key={i} style={{
              width: 300,
              flexShrink: 0,
              background: 'var(--bg-2)',
              border: '1.5px solid var(--border-strong)',
              padding: '22px 24px',
              display: 'flex',
              flexDirection: 'column',
              gap: 12,
            }}>
              {/* Estrellas */}
              <div style={{ display: 'flex', gap: 3 }}>
                {Array.from({ length: 5 }).map((_, k) => (
                  <span key={k} style={{ color: k < (t.rating || 5) ? 'var(--yellow)' : 'var(--border-strong)', fontSize: 14 }}>★</span>
                ))}
              </div>

              {/* Texto */}
              <p style={{
                fontSize: 13, lineHeight: 1.65, color: 'var(--bone)',
                fontStyle: 'italic', flex: 1,
                display: '-webkit-box', WebkitLineClamp: 4, WebkitBoxOrient: 'vertical', overflow: 'hidden',
              }}>
                "{t.body}"
              </p>

              {/* Autor */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <div style={{
                  width: 34, height: 34, borderRadius: '50%', flexShrink: 0,
                  background: 'var(--bg-3)', border: '1.5px solid var(--border-strong)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontFamily: 'var(--font-stencil)', fontSize: 12, color: 'var(--yellow)',
                  overflow: 'hidden',
                }}>
                  {t.photo_url
                    ? <img src={t.photo_url} alt={t.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }}/>
                    : initials(t.name)}
                </div>
                <div>
                  <div style={{ fontFamily: 'var(--font-stencil)', fontSize: 12, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                    {t.name}
                  </div>
                  {t.handle && (
                    <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--bone-dim)' }}>
                      {t.handle}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

window.TestimonialsMarquee = TestimonialsMarquee;
