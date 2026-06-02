// app.jsx — Router based on <div id="root" data-page="...">
const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "theme": "dark",
  "heroVariant": "photo",
  "galleryDensity": "regular",
  "accentColor": "#ffd60a"
}/*EDITMODE-END*/;

function App({ page }) {
  const [t, setTweak] = useTweaks(TWEAK_DEFAULTS);
  const [modalItem, setModalItem] = React.useState(null);

  React.useEffect(() => {
    document.documentElement.setAttribute('data-theme', t.theme);
  }, [t.theme]);

  React.useEffect(() => {
    document.documentElement.style.setProperty('--yellow', t.accentColor);
  }, [t.accentColor]);

  return (
    <React.Fragment>
      <LoadingScreen/>
      <Header current={page} theme={t.theme} setTheme={(v) => setTweak('theme', v)}/>

      <main>
        {page === 'home' && (
          <React.Fragment>
            <Hero variant={t.heroVariant}/>
            <HomeVideo/>
            <HomeFeature/>
            <HomeCoursesTeaser/>
            <Testimonials/>
            <HomeContactPeek/>
            <CTAStrip/>
          </React.Fragment>
        )}

        {page === 'cursos' && (
          <React.Fragment>
            <PageHeader
              num="04"
              eyebrow="Capacitaciones"
              title="Cursos del "
              accent="estudio."
              subtitle="Formación intensiva en tatuaje y barbería con el equipo de El Ghetto. Cupos limitados — escribinos para reservar tu lugar."
              breadcrumb="Cursos"
            />
            <Courses/>
          </React.Fragment>
        )}

        {page === 'galeria' && (
          <React.Fragment>
            <PageHeader
              num="01"
              eyebrow="Portfolio"
              title="Descubrí nuestros"
              accent="tatuajes y cortes."
              subtitle=""
              breadcrumb="Galería"
            />
            <Gallery density={t.galleryDensity} onOpen={setModalItem}/>
          </React.Fragment>
        )}

        {page === 'artistas' && (
          <React.Fragment>
            <PageHeader
              num="02"
              eyebrow="El equipo"
              title="Las manos detrás de"
              accent="cada trabajo."
              subtitle="Una tatuadora y un equipo de barberos profesionales bajo el mismo techo."
              breadcrumb="Artistas"
            />
            <ArtistSection/>
          </React.Fragment>
        )}

        {page === 'reservar' && (
          <React.Fragment>
            <PageHeader
              num="03"
              eyebrow="Reservar"
              title="Sacate "
              accent="el turno."
              breadcrumb="Reservar"
            />
            <Booking/>
            <TestimonialsMarquee/>
            <FAQ/>
          </React.Fragment>
        )}

        {page === 'contacto' && (
          <React.Fragment>
            <PageHeader
              num="04"
              eyebrow="Encontranos"
              title="Vení al "
              accent="estudio."
              subtitle="Atendemos solo con turno. Para consultas rápidas escribinos por WhatsApp o DM en cualquiera de las cuentas."
              breadcrumb="Contacto"
            />
            <Contact/>
          </React.Fragment>
        )}
      </main>

      <Footer/>
      <FloatingWA/>

      {modalItem && <GalleryModal item={modalItem} onClose={() => setModalItem(null)}/>}

      <TweaksPanel>
        <TweakSection label="Tema"/>
        <TweakRadio
          label="Modo"
          value={t.theme}
          options={[
            { value: 'dark',  label: 'Oscuro' },
            { value: 'light', label: 'Claro'  },
          ]}
          onChange={(v) => setTweak('theme', v)}
        />
        <TweakColor
          label="Color de acento"
          value={t.accentColor}
          options={['#ffd60a', '#ff2d2d', '#22c55e', '#ff66cc', '#ff7a00']}
          onChange={(v) => setTweak('accentColor', v)}
        />

        {page === 'home' && (
          <React.Fragment>
            <TweakSection label="Hero"/>
            <TweakRadio
              label="Variante"
              value={t.heroVariant}
              options={[
                { value: 'stencil', label: 'Stencil' },
                { value: 'tag',     label: 'Tag'     },
                { value: 'split',   label: 'Split'   },
              ]}
              onChange={(v) => setTweak('heroVariant', v)}
            />
          </React.Fragment>
        )}

        {page === 'galeria' && (
          <React.Fragment>
            <TweakSection label="Galería"/>
            <TweakRadio
              label="Densidad"
              value={t.galleryDensity}
              options={[
                { value: 'compact', label: 'Densa' },
                { value: 'regular', label: 'Media' },
                { value: 'comfy',   label: 'Aire'  },
              ]}
              onChange={(v) => setTweak('galleryDensity', v)}
            />
          </React.Fragment>
        )}
      </TweaksPanel>
    </React.Fragment>
  );
}

const rootEl = document.getElementById('root');
const currentPage = rootEl.dataset.page || 'home';
ReactDOM.createRoot(rootEl).render(<App page={currentPage}/>);
