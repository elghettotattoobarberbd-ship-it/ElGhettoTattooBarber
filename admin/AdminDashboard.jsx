// admin/AdminDashboard.jsx — overview cards
function AdminDashboard({ user, onSection }) {
  const [stats, setStats] = React.useState({
    gallery: '—', testimonios: '—', faqs: '—', reservas: '—',
    loading: true, error: '',
  });

  React.useEffect(() => {
    if (!window.sb) {
      setStats((s) => ({ ...s, loading: false }));
      return;
    }
    (async () => {
      try {
        const counts = await Promise.all([
          window.sb.from('gallery_items').select('id', { count: 'exact', head: true }),
          window.sb.from('testimonials').select('id', { count: 'exact', head: true }),
          window.sb.from('faqs').select('id', { count: 'exact', head: true }),
          window.sb.from('bookings').select('id', { count: 'exact', head: true })
            .eq('status', 'pending'),
        ]);
        setStats({
          gallery: counts[0].count ?? 0,
          testimonios: counts[1].count ?? 0,
          faqs: counts[2].count ?? 0,
          reservas: counts[3].count ?? 0,
          loading: false,
          error: '',
        });
      } catch (e) {
        setStats((s) => ({ ...s, loading: false, error: e.message || 'Error cargando estadísticas' }));
      }
    })();
  }, []);

  const cards = [
    { id: 'galeria',     label: 'Piezas en galería', value: stats.gallery,     hint: 'Tatuajes + cortes' },
    { id: 'testimonios', label: 'Testimonios',       value: stats.testimonios, hint: 'Publicados' },
    { id: 'faqs',        label: 'FAQs',              value: stats.faqs,        hint: 'Preguntas' },
    { id: 'reservas',    label: 'Reservas pendientes', value: stats.reservas,  hint: 'Por contactar' },
  ];

  return (
    <div className="admin-page">
      <AdminPageHead
        eyebrow="Hola de nuevo"
        title="Panel"
        accent="general"
        sub={`Bienvenida ${user?.email ? user.email.split('@')[0] : ''}. Esto es lo que está pasando hoy.`}
      />

      {!window.sb && (
        <div className="admin-banner admin-banner-warn" style={{ marginBottom: 24 }}>
          <strong>Modo demo.</strong> Supabase aún no está configurado, los números son placeholders.
          Editá <code>admin/config.js</code> y recargá la página para activar la base de datos.
        </div>
      )}
      {stats.error && (
        <div className="admin-banner admin-banner-err" style={{ marginBottom: 24 }}>
          {stats.error}
        </div>
      )}

      <div className="admin-stat-grid">
        {cards.map((c) => (
          <button key={c.id} className="admin-stat" onClick={() => onSection(c.id)}>
            <div className="admin-stat-num">{stats.loading ? '…' : c.value}</div>
            <div className="admin-stat-lbl">{c.label}</div>
            <div className="admin-stat-hint">{c.hint}</div>
            <div className="admin-stat-go">
              Gestionar <Icon name="arrowRight" size={14}/>
            </div>
          </button>
        ))}
      </div>

      <div className="admin-quick-grid">
        <div className="admin-card">
          <div className="admin-card-head">
            <h3>Accesos rápidos</h3>
          </div>
          <div className="admin-quick-list">
            <button className="admin-quick-btn" onClick={() => onSection('galeria')}>
              <Icon name="syringe" size={18}/>
              <div>
                <div className="admin-quick-title">Subir trabajos</div>
                <div className="admin-quick-sub">Agregar fotos al portfolio</div>
              </div>
              <Icon name="arrowRight" size={16}/>
            </button>
            <button className="admin-quick-btn" onClick={() => onSection('testimonios')}>
              <Icon name="star" size={18}/>
              <div>
                <div className="admin-quick-title">Nuevo testimonio</div>
                <div className="admin-quick-sub">Sumar reseña de cliente</div>
              </div>
              <Icon name="arrowRight" size={16}/>
            </button>
            <button className="admin-quick-btn" onClick={() => onSection('reservas')}>
              <Icon name="whatsapp" size={18}/>
              <div>
                <div className="admin-quick-title">Ver reservas</div>
                <div className="admin-quick-sub">Pedidos por contactar</div>
              </div>
              <Icon name="arrowRight" size={16}/>
            </button>
          </div>
        </div>

        <div className="admin-card admin-card-yellow">
          <div className="admin-card-head">
            <h3 style={{ color: 'var(--ink)' }}>Recordatorio</h3>
          </div>
          <p style={{ color: 'var(--ink)', lineHeight: 1.6, fontSize: 15 }}>
            Las publicaciones nuevas aparecen en el sitio al instante. Si subís fotos pesadas, optimizá antes
            a <strong>~1600 px</strong> y formato <strong>WebP</strong> para que cargue rápido.
          </p>
        </div>
      </div>
    </div>
  );
}

function AdminPageHead({ eyebrow, title, accent, sub, actions, page }) {
  const pageMap = {
    inicio:   { href: 'index.html',    label: 'Inicio' },
    galeria:  { href: 'galeria.html',  label: 'Galería' },
    artistas: { href: 'artistas.html', label: 'Artistas' },
    cursos:   { href: 'cursos.html',   label: 'Cursos' },
    reservar: { href: 'reservar.html', label: 'Reservar' },
    contacto: { href: 'contacto.html', label: 'Contacto' },
  };
  const p = page && pageMap[page];

  return (
    <header className="admin-page-head">
      <div>
        <div className="admin-page-trail">
          <div className="eyebrow" style={{ marginRight: 12 }}>{eyebrow}</div>
          {p && (
            <a href={p.href} target="_blank" rel="noopener" className="admin-page-trail-link">
              afecta · {p.label} <Icon name="arrowRight" size={12}/>
            </a>
          )}
        </div>
        <h1 className="admin-page-title">
          {title && <span>{title} </span>}
          {accent && <span className="yellow">{accent}</span>}
        </h1>
        {sub && <p className="admin-page-sub">{sub}</p>}
      </div>
      {actions && <div className="admin-page-actions">{actions}</div>}
    </header>
  );
}

Object.assign(window, { AdminDashboard, AdminPageHead });
