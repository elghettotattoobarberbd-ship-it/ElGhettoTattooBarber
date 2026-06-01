// components/Artist.jsx
function ArtistSection() {
  const [dbArtists, setDbArtists] = React.useState(null);

  React.useEffect(() => {
    if (!window.sb) return;
    window.sb
      .from('artists')
      .select('*')
      .eq('is_active', true)
      .order('sort_order', { ascending: true })
      .then(({ data }) => { if (data && data.length > 0) setDbArtists(data); });
  }, []);

  // Buscar tatuador/a y barbero/a en la BD, con fallback a datos estáticos
  const dbTattooer = dbArtists && dbArtists.find((a) => a.role && a.role.toLowerCase().includes('tatua'));
  const dbBarber   = dbArtists && dbArtists.find((a) => a.role && (a.role.toLowerCase().includes('barber') || a.role.toLowerCase().includes('barbera')));

  const waBase = 'https://wa.me/' + STUDIO.phoneIntl.replace(/\D/g, '');

  // ── Datos tatuadora ──
  const static0    = ARTISTS[0];
  const tattooName = dbTattooer ? dbTattooer.name         : static0.name;
  const tattooHnd  = dbTattooer && dbTattooer.instagram   ? '@' + dbTattooer.instagram.replace('@','') : static0.handle;
  const tattooBio  = dbTattooer && dbTattooer.bio         ? dbTattooer.bio  : static0.bio;
  const tattooExp  = dbTattooer && dbTattooer.experience_years != null ? String(dbTattooer.experience_years) : static0.stats[0].num;
  const tattooSp   = dbTattooer && dbTattooer.styles && dbTattooer.styles.length > 0 ? dbTattooer.styles : static0.specialties;
  const tattooAvt  = dbTattooer ? dbTattooer.avatar_url   : null;
  const tattooWa   = dbTattooer && dbTattooer.whatsapp    ? 'https://wa.me/' + dbTattooer.whatsapp.replace(/\D/g,'') + '?text=' + encodeURIComponent('Hola Celeste! Quiero charlar un tatuaje') : waBase + '?text=' + encodeURIComponent('Hola Celeste! Quiero charlar un tatuaje');

  // ── Datos barbería ──
  const staticB   = BARBER_TEAM;
  const barberName = dbBarber ? dbBarber.name        : staticB.name;
  const barberHnd  = dbBarber && dbBarber.instagram   ? '@' + dbBarber.instagram.replace('@','') : staticB.handle;
  const barberBio  = dbBarber && dbBarber.bio         ? dbBarber.bio : staticB.bio;
  const barberSv   = dbBarber && dbBarber.styles && dbBarber.styles.length > 0 ? dbBarber.styles : staticB.services;
  const barberAvt  = dbBarber ? dbBarber.avatar_url   : null;
  const barberWa   = dbBarber && dbBarber.whatsapp    ? 'https://wa.me/' + dbBarber.whatsapp.replace(/\D/g,'') + '?text=' + encodeURIComponent('Hola! Quiero sacar turno en la barberia') : waBase + '?text=' + encodeURIComponent('Hola! Quiero sacar turno con la barberia');
  const barberStats = dbBarber && dbBarber.experience_years != null
    ? [{ num: String(dbBarber.experience_years), lbl: 'Años en barbería' }, ...staticB.stats.slice(1)]
    : staticB.stats;

  return (
    <section className="section team-section" id="artistas" style={{ background: 'var(--bg-2)' }}>
      <div className="container">
        <div className="team-grid">

          {/* ===== TATUADORA ===== */}
          <article className="team-card">
            <div className="team-card-head">
              <div className="team-portrait">
                {tattooAvt
                  ? <img src={tattooAvt} alt={tattooName} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}/>
                  : <div className="ph">
                      <div style={{ textAlign: 'center' }}>
                        <div style={{ fontFamily: 'var(--font-tag)', fontSize: 28, color: 'var(--yellow)', marginBottom: 8, transform: 'rotate(-3deg)' }}>
                          {tattooName.split(' ')[0]}
                        </div>
                        <div>foto pendiente</div>
                      </div>
                    </div>}
                <div className="team-stamp" style={{ top: 14, left: 14 }}>TATUADORA</div>
              </div>
            </div>

            <div className="team-body">
              <div className="role-line">Tatuadora · Resident artist</div>
              <h3 className="team-name">{tattooName}</h3>
              <div className="team-handle">{tattooHnd}</div>
              <p className="team-bio">{tattooBio}</p>

              <div className="team-stats">
                <div><div className="stat-num">{tattooExp}</div><div className="stat-lbl">Años tatuando</div></div>
                <div>
                  <div className="stat-num">{dbTattooer && dbTattooer.pieces_count ? dbTattooer.pieces_count : static0.stats[1].num}</div>
                  <div className="stat-lbl">Piezas hechas</div>
                </div>
                {static0.stats.slice(2).map((s, i) => (
                  <div key={i}><div className="stat-num">{s.num}</div><div className="stat-lbl">{s.lbl}</div></div>
                ))}
              </div>

              <div className="team-list-label">Estilos en los que trabaja</div>
              <div className="specialty-grid">
                {tattooSp.map((sp, i) => (
                  <div key={i} className="specialty"><span className="dot"></span><span>{sp}</span></div>
                ))}
              </div>

              <div className="team-ctas">
                <a href={tattooWa} target="_blank" rel="noopener" className="btn btn-primary">
                  <Icon name="whatsapp" size={16}/> Reservar tatoo
                </a>
                <a href={'https://instagram.com/' + tattooHnd.replace('@', '')} target="_blank" rel="noopener" className="btn btn-ghost">
                  <Icon name="instagram" size={16}/> Instagram
                </a>
              </div>
            </div>
          </article>

          {/* ===== BARBERÍA ===== */}
          <article className="team-card">
            <div className="team-card-head">
              <div className="team-portrait team-portrait-barber">
                {barberAvt
                  ? <img src={barberAvt} alt={barberName} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}/>
                  : <BarberCrew/>}
                <div className="team-stamp" style={{ top: 14, left: 14, background: 'var(--bone)', color: 'var(--ink)' }}>BARBERÍA</div>
              </div>
            </div>

            <div className="team-body">
              <div className="role-line">Barbería · Equipo del estudio</div>
              <h3 className="team-name">{barberName}</h3>
              <div className="team-handle">{barberHnd}</div>
              <p className="team-bio">{barberBio}</p>

              <div className="team-stats">
                {barberStats.map((s, i) => (
                  <div key={i}><div className="stat-num">{s.num}</div><div className="stat-lbl">{s.lbl}</div></div>
                ))}
              </div>

              <div className="team-list-label">Servicios que hacemos</div>
              <div className="specialty-grid">
                {barberSv.map((sp, i) => (
                  <div key={i} className="specialty"><span className="dot"></span><span>{sp}</span></div>
                ))}
              </div>

              <div className="team-ctas">
                <a href={barberWa} target="_blank" rel="noopener" className="btn btn-primary">
                  <Icon name="whatsapp" size={16}/> Reservar corte
                </a>
                <a href="#galeria" className="btn btn-ghost">Ver los cortes</a>
              </div>
            </div>
          </article>

        </div>
      </div>
    </section>
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
window.BarberCrew = BarberCrew;
