// components/Footer.jsx
function Footer() {
  const waLink = `https://wa.me/${STUDIO.phoneIntl.replace(/\D/g, '')}`;
  const mapsQuery = encodeURIComponent(STUDIO.address);
  const mapsUrl   = `https://www.google.com/maps/search/?api=1&query=${mapsQuery}`;
  const lat = STUDIO.lat, lng = STUDIO.lng;
  const m = 0.003;
  const mapEmbed  = STUDIO.mapEmbedUrl
    || `https://www.openstreetmap.org/export/embed.html?bbox=${lng - m},${lat - m},${lng + m},${lat + m}&layer=mapnik&marker=${lat},${lng}`;
  return (
    <React.Fragment>
      <div className="tape">
        <div className="tape-text">
          {Array.from({ length: 2 }).map((_, k) => (
            <React.Fragment key={k}>
              <span>EL GHETTO ★ TATTOO ★ BARBER</span>
              <span>SOLO CON TURNO</span>
              <span>BLACK & GREY ★ COLOR ★ FINELINE</span>
              <span>DESDE 2021</span>
              <span>TUPAC YUPANQUI</span>
              <span>ARG ★</span>
            </React.Fragment>
          ))}
        </div>
      </div>

      <footer className="footer">
        <div className="container">
          <div className="footer-grid">
            <div>
              <a href="index.html" className="footer-logo-img" aria-label="El Ghetto">
                <img src="assets/logo.png" alt="El Ghetto · Barber y Tattoo"/>
              </a>
              <p style={{ marginTop: 20, color: '#b9b4a4', maxWidth: '36ch', lineHeight: 1.6 }}>
                {STUDIO.address}
              </p>
            </div>

            <div className="footer-col">
              <h4>Navegar</h4>
              <a href="index.html">Inicio</a>
              <a href="galeria.html">Galería</a>
              <a href="artistas.html">Artistas</a>
              <a href="cursos.html">Cursos</a>
              <a href="reservar.html">Reservar</a>
              <a href="contacto.html">Contacto</a>
            </div>

            <div className="footer-col">
              <h4>Encontranos</h4>
              <a href={mapsUrl} target="_blank" rel="noopener">{STUDIO.address}</a>
              <a href={waLink} target="_blank" rel="noopener">{STUDIO.phone}</a>
              {STUDIO.ig.map((h) => (
                <a key={h} href={`https://instagram.com/${h}`} target="_blank" rel="noopener">@{h}</a>
              ))}
            </div>

            {/* ===== MINI MAP ===== */}
            <a
              className="footer-map"
              href={mapsUrl}
              target="_blank"
              rel="noopener"
              aria-label={`Ver ubicación en Google Maps: ${STUDIO.address}`}
            >
              <h4 className="footer-map-h">Estamos acá</h4>
              <div className="footer-map-frame">
                <span className="footer-map-tape footer-map-tape-l"></span>
                <span className="footer-map-tape footer-map-tape-r"></span>

                <iframe
                  className="footer-map-iframe"
                  src={mapEmbed}
                  title="Mapa El Ghetto"
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  tabIndex={-1}
                />
                <span className="footer-map-pin" aria-hidden="true">×</span>
                <span className="footer-map-cta">
                  Abrir en Maps <Icon name="arrowRight" size={12}/>
                </span>
              </div>
              <div className="footer-map-addr">{STUDIO.address}</div>
            </a>
          </div>

          <div className="footer-bottom">
            <span>© {new Date().getFullYear()} El Ghetto Tattoo &amp; Barber</span>
            <span>Hecho por Zero Uno</span>
          </div>
        </div>
      </footer>
    </React.Fragment>
  );
}

window.Footer = Footer;
