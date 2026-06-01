// components/Header.jsx — Multi-page navigation
function Header({ current, theme, setTheme }) {
  const [open, setOpen] = React.useState(false);

  const links = [
    { href: 'index.html',     label: 'Inicio',   match: 'home' },
    { href: 'galeria.html',   label: 'Galería',  match: 'galeria' },
    { href: 'artistas.html',  label: 'Artistas', match: 'artistas' },
    { href: 'cursos.html',    label: 'Cursos',   match: 'cursos' },
    { href: 'reservar.html',  label: 'Reservar', match: 'reservar' },
    { href: 'contacto.html',  label: 'Contacto', match: 'contacto' },
  ];

  return (
    <header className="header">
      <div className="header-inner">
        <a href="index.html" className="logo logo-img" onClick={() => setOpen(false)} aria-label="El Ghetto — Inicio">
          <img src="assets/logo.png" alt="El Ghetto · Barber y Tattoo"/>
        </a>

        <nav className="nav desktop-only">
          {links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className={current === l.match ? 'is-current' : ''}
            >
              {l.label}
            </a>
          ))}
        </nav>

        <div className="header-cta">
          <button className="icon-btn" onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')} title="Cambiar tema">
            <Icon name={theme === 'dark' ? 'sun' : 'moon'} size={16}/>
          </button>
          <a className="btn btn-primary desktop-only" style={{ padding: '12px 20px', fontSize: 13 }} href="reservar.html">
            Reservar <Icon name="arrowRight" size={14}/>
          </a>
          <button className="icon-btn mobile-only" onClick={() => setOpen(!open)}>
            <Icon name={open ? 'close' : 'menu'} size={16}/>
          </button>
        </div>
      </div>

      {open && (
        <nav style={{
          display: 'flex',
          flexDirection: 'column',
          gap: 0,
          padding: '8px 24px 16px',
          borderTop: '1.5px solid var(--border)',
          fontFamily: 'var(--font-stencil)',
          fontSize: 14,
          textTransform: 'uppercase',
          letterSpacing: '0.06em',
        }}>
          {links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              onClick={() => setOpen(false)}
              className={current === l.match ? 'is-current' : ''}
              style={{ padding: '14px 0', borderBottom: '1px dashed var(--border)' }}
            >
              {l.label}
            </a>
          ))}
        </nav>
      )}
    </header>
  );
}

window.Header = Header;
