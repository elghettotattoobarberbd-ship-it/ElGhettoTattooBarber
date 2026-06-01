// components/Hero.jsx
function Hero({ variant = "stencil" }) {
  return (
    <section className={`hero hero-${variant}`} id="top">
      <div className="container" style={{ position: 'relative', zIndex: 2 }}>
        <div className="hero-grid">
          <div className="hero-text">
            <div className="eyebrow" style={{ marginBottom: 24 }}>Tupac Yupanqui 9110, Córdoba · Argentina</div>
            <h1 className="hero-title">
              <span className="row1">El</span>
              <span className="row2">Ghetto</span>
              <span className="row3">tattoo & barber</span>
            </h1>
            <p className="hero-sub">
              Barbería y tatuajes con identidad propia. Cortes clásicos y modernos, degradés, perfilado de barba, black & grey, color, fineline y estilos personalizados. Cada trabajo se realiza con dedicación, técnica y atención al detalle para que salgas con la mejor versión de vos mismo.

            </p>
            <div className="hero-ctas">
              <a href="reservar.html" className="btn btn-primary">
                Sumate a la espera <Icon name="arrowRight" size={16}/>
              </a>
              <a href="galeria.html" className="btn btn-ghost">
                Ver los trabajos
              </a>
            </div>
          </div>

          <div className="hero-art">
            <div className="art-frame">
              <img src="assets/frentelocal.jpeg" alt="Frente local" className="hero-art-image" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

window.Hero = Hero;
