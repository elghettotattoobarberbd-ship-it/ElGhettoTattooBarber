// components/FloatingWA.jsx
function FloatingWA() {
  const [visible, setVisible] = React.useState(false);
  const [hovered, setHovered] = React.useState(false);

  // Aparece luego de hacer scroll
  React.useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 120);
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const phone = (STUDIO.phoneIntl || '').replace(/\D/g, '');
  const msg   = encodeURIComponent('Hola! Vi la página y quiero consultar.');
  const href  = 'https://wa.me/' + phone + '?text=' + msg;

  return (
    <>
      <style>{`
        @keyframes waPulse {
          0%, 100% { box-shadow: 0 0 0 0 rgba(37,211,102,0.5); }
          50%       { box-shadow: 0 0 0 10px rgba(37,211,102,0); }
        }
        @keyframes waIn {
          from { opacity: 0; transform: translateY(16px) scale(0.85); }
          to   { opacity: 1; transform: translateY(0)    scale(1);    }
        }
        @keyframes waOut {
          from { opacity: 1; transform: translateY(0)    scale(1);    }
          to   { opacity: 0; transform: translateY(16px) scale(0.85); }
        }
        .wa-fab-label {
          max-width: 0;
          overflow: hidden;
          white-space: nowrap;
          opacity: 0;
          transition: max-width 300ms ease, opacity 250ms ease, padding 250ms ease;
          padding: 0;
        }
        .wa-fab:hover .wa-fab-label {
          max-width: 160px;
          opacity: 1;
          padding: 0 0 0 10px;
        }
      `}</style>

      <a
        href={href}
        target="_blank"
        rel="noopener"
        className="wa-fab"
        title="Escribinos por WhatsApp"
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        style={{
          position: 'fixed',
          bottom: 28,
          right: 24,
          zIndex: 800,
          display: 'flex',
          alignItems: 'center',
          background: '#0d0d0d',
          border: '2px solid #25d366',
          color: '#25d366',
          padding: '13px 16px',
          textDecoration: 'none',
          cursor: 'pointer',
          animation: visible
            ? 'waIn 350ms cubic-bezier(0.34,1.56,0.64,1) forwards, waPulse 2.4s ease 800ms infinite'
            : 'waOut 250ms ease forwards',
          transition: 'background 200ms, border-color 200ms',
          ...(hovered ? { background: '#25d366', color: '#0d0d0d' } : {}),
        }}
      >
        {/* Icono WhatsApp */}
        <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor" style={{ flexShrink: 0 }}>
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
        </svg>

        {/* Label que se abre al hover */}
        <span className="wa-fab-label" style={{
          fontFamily: "'JetBrains Mono', monospace",
          fontSize: 11,
          fontWeight: 700,
          letterSpacing: '0.12em',
          textTransform: 'uppercase',
        }}>
          Escribinos
        </span>
      </a>
    </>
  );
}

window.FloatingWA = FloatingWA;
