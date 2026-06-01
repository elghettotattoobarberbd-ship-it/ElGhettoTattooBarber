// admin/AdminShell.jsx — Sidebar grouped by site navbar pages
function AdminShell({ user, section, onSection, children }) {
  const groups = [
    {
      label: 'General',
      items: [
        { id: 'dashboard', label: 'Dashboard', icon: 'grid', hint: 'Resumen del sitio' },
      ],
    },
    {
      label: 'Inicio',
      pageHref: 'index.html',
      items: [
        { id: 'config',      label: 'Video del home',   icon: 'mapPin',  hint: 'Reel/tour del estudio' },
        { id: 'testimonios', label: 'Testimonios',      icon: 'star',    hint: 'Reseñas de clientes' },
      ],
    },
    {
      label: 'Artistas',
      pageHref: 'artistas.html',
      items: [
        { id: 'artistas', label: 'Equipo', icon: 'syringe', hint: 'Tatuadores y barberos' },
      ],
    },
    {
      label: 'Galería',
      pageHref: 'galeria.html',
      items: [
        { id: 'galeria', label: 'Tatuajes & cortes', icon: 'syringe', hint: 'Subir piezas al portfolio' },
        { id: 'estilos', label: 'Estilos & filtros', icon: 'grid',    hint: 'Categorías de tatuaje y corte' },
      ],
    },
    {
      label: 'Cursos',
      pageHref: 'cursos.html',
      items: [
        { id: 'cursos', label: 'Capacitaciones', icon: 'clock', hint: 'Cursos publicados' },
      ],
    },
    {
      label: 'Reservar',
      pageHref: 'reservar.html',
      items: [
        { id: 'reservas', label: 'Turnos recibidos', icon: 'whatsapp', hint: 'Pedidos del formulario' },
        { id: 'faqs',     label: 'Preguntas frecuentes', icon: 'mail', hint: 'FAQs del cliente' },
      ],
    },
    {
      label: 'Contacto',
      pageHref: 'contacto.html',
      items: [
        { id: 'horarios', label: 'Horarios', icon: 'clock', hint: 'Bloques de atención' },
      ],
    },
  ];

  const logout = async () => { await AdminAuth.signOut(); };

  return (
    <div className="admin-shell">
      <aside className="admin-aside">
        <a href="index.html" className="admin-aside-logo">
          <img src="/assets/logo.png" alt="El Ghetto" style={{ height: 36, width: 'auto', display: 'block' }}/>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: 9, letterSpacing: '0.25em', color: 'var(--yellow)', marginTop: 4 }}>
            ADMIN PANEL
          </div>
        </a>

        <nav className="admin-nav admin-nav-grouped">
          {groups.map((g) => (
            <div key={g.label} className="admin-nav-group">
              <div className="admin-nav-group-head">
                <span className="admin-nav-group-label">{g.label}</span>
                {g.pageHref && (
                  <a
                    href={g.pageHref}
                    target="_blank"
                    rel="noopener"
                    className="admin-nav-group-link"
                    title="Ver esta página en el sitio"
                  >
                    ver →
                  </a>
                )}
              </div>
              {g.items.map((it) => (
                <button
                  key={it.id}
                  className={`admin-nav-item ${section === it.id ? 'active' : ''}`}
                  onClick={() => onSection(it.id)}
                  title={it.hint}
                >
                  <Icon name={it.icon} size={14}/>
                  <span className="admin-nav-item-label">{it.label}</span>
                </button>
              ))}
            </div>
          ))}
        </nav>

        <div className="admin-aside-foot">
          <div className="admin-user">
            <div className="admin-user-avatar">{user?.email?.[0]?.toUpperCase() || 'A'}</div>
            <div className="admin-user-info">
              <div className="admin-user-name">{user?.email || 'admin'}</div>
              <div className="admin-user-role">Administrador</div>
            </div>
          </div>
          <button className="admin-logout" onClick={logout}>
            <Icon name="close" size={14}/> Cerrar sesión
          </button>
        </div>
      </aside>

      <main className="admin-main">
        <SectionContext.Provider value={{ section, onSection }}>
          {children}
        </SectionContext.Provider>
      </main>
    </div>
  );
}

// Context so child pages can know which section is active (optional)
const SectionContext = React.createContext({ section: 'dashboard', onSection: () => {} });

window.AdminShell = AdminShell;
window.SectionContext = SectionContext;
