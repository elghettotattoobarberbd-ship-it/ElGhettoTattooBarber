// components/Courses.jsx — Public courses page
// Loads from Supabase if window.sb exists, otherwise shows "Próximamente" state.

function Courses() {
  const [courses, setCourses] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState('');

  React.useEffect(() => {
    (async () => {
      if (!window.sb) { setLoading(false); return; }
      try {
        const { data, error } = await window.sb
          .from('courses')
          .select('*')
          .or('is_published.eq.true,is_published.is.null')
          .order('is_coming_soon', { ascending: false })
          .order('start_date',     { ascending: true, nullsFirst: false })
          .order('sort_order',     { ascending: false });
        if (error) throw error;
        setCourses(data || []);
      } catch (e) {
        setError(e.message || 'No pudimos cargar los cursos.');
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const empty = !loading && courses.length === 0;

  return (
    <section className="section" id="cursos">
      <div className="container">
        {loading && <CoursesLoading/>}

        {error && (
          <div className="course-error">
            <strong>Algo falló al cargar los cursos.</strong>
            <span>{error}</span>
          </div>
        )}

        {empty && !error && <CoursesEmpty/>}

        {!loading && courses.length > 0 && (
          <CourseGrid courses={courses}/>
        )}
      </div>
    </section>
  );
}

function CourseGrid({ courses }) {
  return (
    <div className="course-grid">
      {courses.map((c, i) => <CourseCard key={c.id} course={c} idx={i}/>)}
    </div>
  );
}

function CourseCard({ course, idx }) {
  const isSoon = !!course.is_coming_soon;
  const learn = Array.isArray(course.what_youll_learn) ? course.what_youll_learn : [];
  const cat = (course.category || '').toLowerCase();
  const catLabel = cat === 'tatuaje' ? 'Tatuajes' : cat === 'barber' ? 'Barbería' : cat === 'mixto' ? 'Mixto' : '—';
  const date = course.start_date ? new Date(course.start_date).toLocaleDateString('es-AR', { day: '2-digit', month: 'short' }) : null;

  const waMsg = `Hola! Quiero info del curso "${course.title}".`;
  const waLink = `https://wa.me/${STUDIO.phoneIntl.replace(/\D/g, '')}?text=${encodeURIComponent(waMsg)}`;

  return (
    <article id={`curso-${course.id}`} className={`course-card ${isSoon ? 'is-soon' : ''}`} style={{ '--i': idx }}>
      <div className="course-card-head">
        {course.cover_url
          ? <img src={course.cover_url} alt={course.title}/>
          : <CoursePlaceholder seed={course.id || idx} category={cat}/>}
        {isSoon && <span className="course-stamp">Próximamente</span>}
        <span className="course-cat">{catLabel}</span>
      </div>

      <div className="course-card-body">
        <h3 className="course-title">{course.title}</h3>
        {course.subtitle && <div className="course-sub">{course.subtitle}</div>}

        <div className="course-meta">
          {course.level    && <span><Icon name="grid"  size={12}/> {course.level}</span>}
          {course.duration && <span><Icon name="clock" size={12}/> {course.duration}</span>}
          {course.schedule && <span><Icon name="clock" size={12}/> {course.schedule}</span>}
          {date            && <span><Icon name="mapPin"size={12}/> arranca {date}</span>}
        </div>

        {course.description && <p className="course-desc">{course.description}</p>}

        {learn.length > 0 && (
          <div className="course-learn">
            <div className="course-learn-title">Vas a aprender</div>
            <ul>
              {learn.slice(0, 4).map((it, i) => <li key={i}>{it}</li>)}
            </ul>
          </div>
        )}

        <div className="course-foot">
          <div className="course-price">
            {course.price_ars
              ? <>
                  <span className="course-price-num">${Number(course.price_ars).toLocaleString('es-AR')}</span>
                  <span className="course-price-lbl">por inscripto</span>
                </>
              : <span className="course-price-lbl" style={{ color: 'var(--yellow)' }}>Consultar precio</span>}
          </div>
          <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
            <ShareCourseBtn courseId={course.id} title={course.title}/>
            <a href={waLink} target="_blank" rel="noopener" className="btn btn-primary" style={{ padding: '12px 18px', fontSize: 13 }}>
              <Icon name="whatsapp" size={14}/> {isSoon ? 'Avisame' : 'Anotarme'}
            </a>
          </div>
        </div>

        {course.vacancies && !isSoon && (
          <div className="course-vac">{course.vacancies} cupos disponibles</div>
        )}
      </div>
    </article>
  );
}

function CoursesLoading() {
  return (
    <div className="course-grid">
      {[0, 1, 2].map((i) => (
        <div key={i} className="course-card course-skel">
          <div className="course-skel-img"/>
          <div className="course-skel-body">
            <div className="course-skel-line w70"/>
            <div className="course-skel-line w40"/>
            <div className="course-skel-line w90"/>
            <div className="course-skel-line w60"/>
          </div>
        </div>
      ))}
    </div>
  );
}

function CoursesEmpty() {
  return (
    <div className="course-empty">
      <div className="course-empty-stamp">PRÓXIMAMENTE</div>
      <h3>Los cursos están <span className="yellow">por salir.</span></h3>
      <p>
        Estamos armando capacitaciones para tatuadores y barberos. Apenas haya fechas confirmadas, los publicamos acá.
      </p>
      <p style={{ marginTop: 8, color: 'var(--bone-dim)' }}>
        ¿Querés que te avisemos primero?
      </p>
      <a
        href={`https://wa.me/${STUDIO.phoneIntl.replace(/\D/g, '')}?text=${encodeURIComponent('Hola! Quiero info sobre los próximos cursos del estudio.')}`}
        target="_blank" rel="noopener"
        className="btn btn-primary"
        style={{ marginTop: 24 }}
      >
        <Icon name="whatsapp" size={16}/> Sumate a la lista
      </a>
    </div>
  );
}

function CoursePlaceholder({ seed = 1, category = '' }) {
  const hue = category === 'tatuaje' ? 50 : category === 'barber' ? 25 : 40;
  return (
    <svg viewBox="0 0 400 240" preserveAspectRatio="xMidYMid slice" style={{ width: '100%', height: '100%', background: `hsl(${hue}, 10%, 12%)` }}>
      <defs>
        <pattern id={`stripe-${seed}`} width="14" height="14" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
          <rect width="14" height="14" fill="transparent"/>
          <rect width="7" height="14" fill="var(--yellow)" opacity="0.12"/>
        </pattern>
      </defs>
      <rect width="400" height="240" fill={`url(#stripe-${seed})`}/>
      <text x="200" y="120" textAnchor="middle"
            fontFamily="'Rubik Mono One', sans-serif" fontSize="42"
            fill="var(--yellow)" opacity="0.85" letterSpacing="-1">CURSO</text>
      <text x="200" y="152" textAnchor="middle"
            fontFamily="'JetBrains Mono', monospace" fontSize="9"
            fill="var(--yellow)" opacity="0.6" letterSpacing="4">EL GHETTO STUDIO</text>
    </svg>
  );
}

function ShareCourseBtn({ courseId, title }) {
  const [state, setState] = React.useState('idle'); // idle | copied | error

  const handleShare = async () => {
    const url = `${window.location.origin}${window.location.pathname}#curso-${courseId}`;
    if (navigator.share) {
      try {
        await navigator.share({ title: `Curso: ${title}`, url });
        return;
      } catch (e) {
        if (e.name === 'AbortError') return;
      }
    }
    try {
      await navigator.clipboard.writeText(url);
      setState('copied');
      setTimeout(() => setState('idle'), 2200);
    } catch {
      setState('error');
      setTimeout(() => setState('idle'), 2200);
    }
  };

  return (
    <button
      onClick={handleShare}
      className={`btn-share-course${state === 'copied' ? ' copied' : ''}`}
      title="Copiar enlace del curso"
      type="button"
    >
      {state === 'copied'
        ? <><Icon name="check" size={13}/> Copiado</>
        : <><Icon name="link" size={13}/> Compartir</>}
    </button>
  );
}

Object.assign(window, { Courses, CourseCard, CoursePlaceholder });
