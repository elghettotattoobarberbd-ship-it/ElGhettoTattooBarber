// components/Artist.jsx
function ArtistSection() {
  const [artists, setArtists] = React.useState(null);

  React.useEffect(() => {
    if (!window.sb) { setArtists([]); return; }
    window.sb
      .from('artists')
      .select('*')
      .eq('is_active', true)
      .order('sort_order', { ascending: true })
      .then(({ data }) => setArtists(data || []));
  }, []);

  if (artists === null) {
    return (
      <section className="section team-section" id="artistas" style={{ background: 'var(--bg-2)' }}>
        <div className="container">
          <div style={{ textAlign: 'center', padding: '60px 0', fontFamily: 'var(--font-mono)', color: 'var(--bone-dim)', letterSpacing: '0.1em' }}>
            CARGANDO...
          </div>
        </div>
      </section>
    );
  }

  if (artists.length === 0) return null;

  return (
    <section className="section team-section" id="artistas" style={{ background: 'var(--bg-2)' }}>
      <div className="container">
        <div className="team-grid">
          {artists.map((a) => <ArtistCard key={a.id} artist={a} />)}
        </div>
      </div>
    </section>
  );
}

function ArtistCard({ artist }) {
  const isTattooer = /tatua/i.test(artist.role || '');
  const isBarber   = /barber|barbera/i.test(artist.role || '');

  const waBase = 'https://wa.me/' + STUDIO.phoneIntl.replace(/\D/g, '');
  const waMsg  = isTattooer
    ? encodeURIComponent('Hola ' + (artist.name || '').split(' ')[0] + '! Quiero charlar un tatuaje')
    : encodeURIComponent('Hola! Quiero sacar turno en la barberia');
  const waLink = artist.whatsapp
    ? 'https://wa.me/' + artist.whatsapp.replace(/\D/g, '') + '?text=' + waMsg
    : waBase + '?text=' + waMsg;

  const igHandle  = artist.instagram ? '@' + artist.instagram.replace('@', '') : null;
  const stampText = (artist.role || 'ARTISTA').toUpperCase();
  const stampStyle = isTattooer ? {} : { background: 'var(--bone)', color: 'var(--ink)' };

  return (
    <article className="team-card">
      <div className="team-card-head">
        <div className={`team-portrait${isBarber && !artist.avatar_url ? ' team-portrait-barber' : ''}`}>
          {artist.avatar_url
            ? <img src={artist.avatar_url} alt={artist.name} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}/>
            : isBarber
              ? <BarberCrew/>
              : <div className="ph">
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ fontFamily: 'var(--font-tag)', fontSize: 28, color: 'var(--yellow)', marginBottom: 8, transform: 'rotate(-3deg)' }}>
                      {(artist.name || '').split(' ')[0]}
                    </div>
                    <div>foto pendiente</div>
                  </div>
                </div>
          }
          <div className="team-stamp" style={{ top: 14, left: 14, ...stampStyle }}>{stampText}</div>
        </div>
      </div>

      <div className="team-body">
        {artist.role && <div className="role-line">{artist.role}</div>}
        <h3 className="team-name">{artist.name}</h3>
        {igHandle && <div className="team-handle">{igHandle}</div>}
        {artist.bio && <p className="team-bio">{artist.bio}</p>}

        {(artist.experience_years != null || artist.pieces_count) && (
          <div className="team-stats">
            {artist.experience_years != null && (
              <div>
                <div className="stat-num">{artist.experience_years}</div>
                <div className="stat-lbl">{isTattooer ? 'Años tatuando' : 'Años en barbería'}</div>
              </div>
            )}
            {artist.pieces_count && (
              <div>
                <div className="stat-num">{artist.pieces_count}</div>
                <div className="stat-lbl">Piezas hechas</div>
              </div>
            )}
          </div>
        )}

        {artist.styles && artist.styles.length > 0 && (
          <>
            <div className="team-list-label">{isTattooer ? 'Estilos en los que trabaja' : 'Servicios que hacemos'}</div>
            <div className="specialty-grid">
              {artist.styles.map((sp, i) => (
                <div key={i} className="specialty"><span className="dot"></span><span>{sp}</span></div>
              ))}
            </div>
          </>
        )}

        <div className="team-ctas">
          <a href={waLink} target="_blank" rel="noopener" className="btn btn-primary">
            <Icon name="whatsapp" size={16}/> {isTattooer ? 'Reservar tatoo' : 'Reservar corte'}
          </a>
          {igHandle && (
            <a href={'https://instagram.com/' + igHandle.replace('@', '')} target="_blank" rel="noopener" className="btn btn-ghost">
              <Icon name="instagram" size={16}/> Instagram
            </a>
          )}
          {isBarber && <a href="#galeria" className="btn btn-ghost">Ver los cortes</a>}
        </div>
      </div>
    </article>
  );
}

function BarberCrew() {
  return (
    <div className="barber-crew">
      <svg viewBox="0 0 220 220" style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -55%) rotate(-6deg)', width: '62%', height: 'auto' }}>
        <defs>
          <pattern id="halftone" x="0" y="0" width="6" height="6" patternUnits="userSpaceOnUse">
            <circle cx="3" cy="3" r="1.2" fill="var(--yellow)"/>
          </pattern>
        </defs>
        <rect x="10" y="40" width="200" height="140" fill="var(--yellow)" stroke="var(--ink)" strokeWidth="3"/>
        <rect x="10" y="40" width="200" height="140" fill="url(#halftone)" opacity="0.15"/>
        <text x="110" y="118" textAnchor="middle" fontFamily="'Rubik Mono One', sans-serif" fontSize="46" fill="var(--ink)" letterSpacing="-2">CREW</text>
        <text x="110" y="148" textAnchor="middle" fontFamily="'JetBrains Mono', monospace" fontSize="9" fill="var(--ink)" letterSpacing="4">BARBERS · EL GHETTO</text>
        <g stroke="var(--ink)" strokeWidth="3" fill="none" strokeLinecap="round" strokeLinejoin="round" transform="translate(28 50)">
          <circle cx="0" cy="0" r="6"/><circle cx="0" cy="14" r="6"/>
          <path d="M5 -4 L24 -22"/><path d="M5 18 L24 36"/><path d="M-3 0 L 14 7 L -3 14"/>
        </g>
        <g stroke="var(--ink)" strokeWidth="2.5" fill="none" transform="translate(165 35)">
          <rect x="0" y="0" width="34" height="8"/>
          {Array.from({ length: 7 }).map((_, i) => (
            <line key={i} x1={3 + i * 5} y1="8" x2={3 + i * 5} y2="22"/>
          ))}
        </g>
        <g fill="var(--yellow)">
          <circle cx="42" cy="194" r="4"/><circle cx="88" cy="200" r="5"/>
          <circle cx="135" cy="195" r="3"/><circle cx="178" cy="200" r="5"/>
        </g>
      </svg>
      <div className="crew-tag crew-tag-tl">FADES</div>
      <div className="crew-tag crew-tag-tr">BARBA</div>
      <div className="crew-tag crew-tag-bl">CLÁSICOS</div>
      <div className="crew-tag crew-tag-br">MODERNOS</div>
    </div>
  );
}

window.ArtistSection = ArtistSection;
window.ArtistCard    = ArtistCard;
window.BarberCrew    = BarberCrew;
