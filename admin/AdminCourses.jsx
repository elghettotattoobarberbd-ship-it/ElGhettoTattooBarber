// admin/AdminCourses.jsx — CRUD for courses
function AdminCourses() {
  const [items, setItems] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState('');
  const [editing, setEditing] = React.useState(null);

  const isReady = !!window.sb;

  const load = React.useCallback(async () => {
    setLoading(true); setError('');
    if (!isReady) { setItems([]); setLoading(false); return; }
    try {
      const { data, error } = await window.sb
        .from('courses')
        .select('*')
        .order('is_coming_soon', { ascending: false })
        .order('start_date',     { ascending: true, nullsFirst: false })
        .order('sort_order',     { ascending: false });
      if (error) throw error;
      setItems(data || []);
    } catch (e) {
      setError(e.message || 'No se pudieron cargar los cursos.');
    } finally { setLoading(false); }
  }, [isReady]);

  React.useEffect(() => { load(); }, [load]);

  const remove = async (id) => {
    if (!window.confirm('¿Borrar este curso?')) return;
    const { error } = await window.sb.from('courses').delete().eq('id', id);
    if (error) { alert(error.message); return; }
    setItems((xs) => xs.filter((x) => x.id !== id));
  };

  const togglePublish = async (it) => {
    const next = !it.is_published;
    const { error } = await window.sb.from('courses').update({ is_published: next }).eq('id', it.id);
    if (error) { alert(error.message); return; }
    setItems((xs) => xs.map((x) => x.id === it.id ? { ...x, is_published: next } : x));
  };

  const toggleSoon = async (it) => {
    const next = !it.is_coming_soon;
    const { error } = await window.sb.from('courses').update({ is_coming_soon: next }).eq('id', it.id);
    if (error) { alert(error.message); return; }
    setItems((xs) => xs.map((x) => x.id === it.id ? { ...x, is_coming_soon: next } : x));
  };

  return (
    <div className="admin-page">
      <AdminPageHead
        eyebrow="Capacitaciones"
        page="cursos"
        title="Cursos"
        accent="del estudio"
        sub="Cargá, editá y publicá los cursos que se muestran en el sitio."
        actions={
          <button className="btn btn-primary" onClick={() => setEditing('new')}>
            + Nuevo curso
          </button>
        }
      />

      {!isReady && (
        <div className="admin-banner admin-banner-warn" style={{ marginBottom: 24 }}>
          Conectá Supabase para empezar a publicar cursos reales.
        </div>
      )}
      {error && <div className="admin-banner admin-banner-err" style={{ marginBottom: 16 }}>{error}</div>}

      {loading ? (
        <div className="admin-empty">Cargando…</div>
      ) : items.length === 0 ? (
        <div className="admin-empty">
          <div className="admin-empty-tag">sin cursos</div>
          <p>Subí el primero tocando <strong>+ Nuevo curso</strong>.</p>
        </div>
      ) : (
        <div className="admin-course-grid">
          {items.map((c) => (
            <article key={c.id} className="admin-card admin-course-row">
              <div className="admin-course-thumb">
                {c.cover_url
                  ? <img src={c.cover_url} alt={c.title}/>
                  : <span>sin tapa</span>}
                {c.is_coming_soon && <span className="admin-badge admin-badge-yellow">Próximo</span>}
                {!c.is_published && <span className="admin-badge" style={{ top: 'auto', bottom: 8 }}>Oculto</span>}
              </div>
              <div className="admin-course-info">
                <div className="admin-course-cat">{c.category || '—'}</div>
                <div className="admin-course-name">{c.title}</div>
                {c.subtitle && <div className="admin-course-sub">{c.subtitle}</div>}
                <div className="admin-course-meta">
                  {c.duration && <span>{c.duration}</span>}
                  {c.schedule && <span>{c.schedule}</span>}
                  {c.price_ars && <span>${Number(c.price_ars).toLocaleString('es-AR')}</span>}
                  {c.vacancies && <span>{c.vacancies} cupos</span>}
                </div>
              </div>
              <div className="admin-course-actions">
                <button onClick={() => setEditing(c)} title="Editar"><Icon name="syringe" size={14}/></button>
                <button onClick={() => togglePublish(c)} title={c.is_published ? 'Despublicar' : 'Publicar'}>
                  <Icon name={c.is_published ? 'sun' : 'moon'} size={14}/>
                </button>
                <button onClick={() => toggleSoon(c)} title={c.is_coming_soon ? 'Marcar disponible' : 'Marcar próximo'}>
                  <Icon name="clock" size={14}/>
                </button>
                <button onClick={() => remove(c.id)} title="Borrar" className="danger"><Icon name="close" size={14}/></button>
              </div>
            </article>
          ))}
        </div>
      )}

      {editing && (
        <CourseEditor
          item={editing === 'new' ? null : editing}
          onClose={() => setEditing(null)}
          onSaved={() => { setEditing(null); load(); }}
        />
      )}
    </div>
  );
}

function CourseEditor({ item, onClose, onSaved }) {
  const isNew = !item;
  const [form, setForm] = React.useState(() => ({
    title:            item?.title           || '',
    subtitle:         item?.subtitle        || '',
    description:      item?.description     || '',
    category:         item?.category        || 'tatuaje',
    level:            item?.level           || '',
    duration:         item?.duration        || '',
    schedule:         item?.schedule        || '',
    start_date:       item?.start_date      || '',
    price_ars:        item?.price_ars       ?? '',
    vacancies:        item?.vacancies       ?? '',
    instructor_name:  item?.instructor_name || '',
    what_youll_learn: (item?.what_youll_learn || []).join('\n'),
    requirements:     (item?.requirements   || []).join('\n'),
    is_published:     item?.is_published    ?? true,
    is_coming_soon:   item?.is_coming_soon  ?? false,
    sort_order:       item?.sort_order      ?? 0,
  }));
  const [file, setFile] = React.useState(null);
  const [preview, setPreview] = React.useState(item?.cover_url || '');
  const [busy, setBusy] = React.useState(false);
  const [err, setErr] = React.useState('');

  const onFile = (f) => {
    setFile(f);
    if (f) setPreview(URL.createObjectURL(f));
  };

  const slugify = (s) => (s || '').toLowerCase()
    .replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 60);

  const save = async (e) => {
    e.preventDefault();
    setErr('');
    if (!window.sb) { setErr('Supabase no configurado.'); return; }
    setBusy(true);
    try {
      let cover_url = item?.cover_url || '';
      if (file) {
        const ext = (file.name.split('.').pop() || 'jpg').toLowerCase();
        const path = `courses/${Date.now()}-${Math.random().toString(36).slice(2,8)}.${ext}`;
        const up = await window.sb.storage.from('courses').upload(path, file, {
          cacheControl: '3600', upsert: false, contentType: file.type,
        });
        if (up.error) throw up.error;
        const { data: pub } = window.sb.storage.from('courses').getPublicUrl(up.data.path);
        cover_url = pub.publicUrl;
      }

      const payload = {
        slug: item?.slug || slugify(form.title) || `curso-${Date.now()}`,
        title: form.title,
        subtitle: form.subtitle || null,
        description: form.description || null,
        category: form.category || null,
        level: form.level || null,
        duration: form.duration || null,
        schedule: form.schedule || null,
        start_date: form.start_date || null,
        price_ars: form.price_ars ? Number(form.price_ars) : null,
        vacancies: form.vacancies ? Number(form.vacancies) : null,
        instructor_name: form.instructor_name || null,
        what_youll_learn: form.what_youll_learn ? form.what_youll_learn.split('\n').map(s => s.trim()).filter(Boolean) : null,
        requirements:     form.requirements     ? form.requirements.split('\n').map(s => s.trim()).filter(Boolean)     : null,
        is_published:   !!form.is_published,
        is_coming_soon: !!form.is_coming_soon,
        sort_order: Number(form.sort_order) || 0,
        cover_url,
      };

      if (isNew) {
        const { error } = await window.sb.from('courses').insert(payload);
        if (error) throw error;
      } else {
        const { error } = await window.sb.from('courses').update(payload).eq('id', item.id);
        if (error) throw error;
      }
      onSaved();
    } catch (ex) {
      setErr(ex.message || 'Error guardando.');
    } finally { setBusy(false); }
  };

  return (
    <div className="admin-modal-backdrop" onClick={onClose}>
      <div className="admin-modal" onClick={(e) => e.stopPropagation()}>
        <button className="admin-modal-close" onClick={onClose}><Icon name="close" size={16}/></button>
        <header className="admin-modal-head">
          <div className="eyebrow">{isNew ? 'Nuevo' : 'Editar'} curso</div>
          <h2>{isNew ? 'Agregar capacitación' : 'Editar curso'}</h2>
        </header>

        <form onSubmit={save} className="admin-form admin-form-grid">
          <div className="admin-form-col">
            <div className="form-group">
              <label className="form-label">Tapa</label>
              <div className="admin-dropzone" style={{ aspectRatio: '16/9' }}>
                {preview ? <img src={preview} alt="preview"/> : <span>Subí una imagen (16:9 recomendado)</span>}
                <input type="file" accept="image/*" onChange={(e) => onFile(e.target.files?.[0])}/>
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Categoría</label>
              <select className="form-input" value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value })}>
                <option value="tatuaje">Tatuaje</option>
                <option value="barber">Barbería</option>
                <option value="mixto">Mixto</option>
              </select>
            </div>

            <div className="form-row-2">
              <div className="form-group">
                <label className="form-label">Nivel</label>
                <select className="form-input" value={form.level}
                  onChange={(e) => setForm({ ...form, level: e.target.value })}>
                  <option value="">—</option>
                  <option value="Principiante">Principiante</option>
                  <option value="Intermedio">Intermedio</option>
                  <option value="Avanzado">Avanzado</option>
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Duración</label>
                <input className="form-input" placeholder="4 semanas" value={form.duration}
                  onChange={(e) => setForm({ ...form, duration: e.target.value })}/>
              </div>
            </div>

            <div className="form-row-2">
              <div className="form-group">
                <label className="form-label">Horario</label>
                <input className="form-input" placeholder="Sábados 14-18hs" value={form.schedule}
                  onChange={(e) => setForm({ ...form, schedule: e.target.value })}/>
              </div>
              <div className="form-group">
                <label className="form-label">Fecha de inicio</label>
                <input className="form-input" type="date" value={form.start_date || ''}
                  onChange={(e) => setForm({ ...form, start_date: e.target.value })}/>
              </div>
            </div>

            <div className="form-row-2">
              <div className="form-group">
                <label className="form-label">Precio (ARS)</label>
                <input className="form-input" type="number" placeholder="80000" value={form.price_ars}
                  onChange={(e) => setForm({ ...form, price_ars: e.target.value })}/>
              </div>
              <div className="form-group">
                <label className="form-label">Cupos</label>
                <input className="form-input" type="number" placeholder="6" value={form.vacancies}
                  onChange={(e) => setForm({ ...form, vacancies: e.target.value })}/>
              </div>
            </div>
          </div>

          <div className="admin-form-col">
            <div className="form-group">
              <label className="form-label">Título</label>
              <input className="form-input" required value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                placeholder="Realismo en black & grey"/>
            </div>

            <div className="form-group">
              <label className="form-label">Subtítulo</label>
              <input className="form-input" value={form.subtitle}
                onChange={(e) => setForm({ ...form, subtitle: e.target.value })}
                placeholder="Curso intensivo de 4 semanas"/>
            </div>

            <div className="form-group">
              <label className="form-label">Descripción</label>
              <textarea className="form-textarea" rows="4" value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                placeholder="Recorrido completo por la técnica..."/>
            </div>

            <div className="form-group">
              <label className="form-label">Qué vas a aprender (una línea por ítem)</label>
              <textarea className="form-textarea" rows="4" value={form.what_youll_learn}
                onChange={(e) => setForm({ ...form, what_youll_learn: e.target.value })}
                placeholder={'Manejo de máquina\nSombreado suave\nReferencias fotográficas\nHigiene'}/>
            </div>

            <div className="form-group">
              <label className="form-label">Requisitos (una línea por ítem)</label>
              <textarea className="form-textarea" rows="3" value={form.requirements}
                onChange={(e) => setForm({ ...form, requirements: e.target.value })}
                placeholder={'Mayor de 18\nKit propio'}/>
            </div>

            <div className="form-group">
              <label className="form-label">Instructor/a (opcional)</label>
              <input className="form-input" value={form.instructor_name}
                onChange={(e) => setForm({ ...form, instructor_name: e.target.value })}
                placeholder="Celeste Ibarra"/>
            </div>

            <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', marginTop: 8 }}>
              <label className="admin-check">
                <input type="checkbox" checked={form.is_published}
                  onChange={(e) => setForm({ ...form, is_published: e.target.checked })}/>
                <span>Publicado</span>
              </label>
              <label className="admin-check">
                <input type="checkbox" checked={form.is_coming_soon}
                  onChange={(e) => setForm({ ...form, is_coming_soon: e.target.checked })}/>
                <span>Próximamente</span>
              </label>
              <label className="admin-check">
                <span style={{ marginRight: 8 }}>Orden</span>
                <input type="number" className="form-input" style={{ width: 80, padding: '6px 10px' }}
                  value={form.sort_order}
                  onChange={(e) => setForm({ ...form, sort_order: e.target.value })}/>
              </label>
            </div>
          </div>

          {err && <div className="admin-banner admin-banner-err" style={{ gridColumn: '1 / -1' }}>{err}</div>}

          <div style={{ gridColumn: '1 / -1', display: 'flex', justifyContent: 'flex-end', gap: 12 }}>
            <button type="button" className="btn btn-ghost" onClick={onClose}>Cancelar</button>
            <button type="submit" className="btn btn-primary" disabled={busy}>
              {busy ? 'Guardando…' : (isNew ? 'Crear curso' : 'Guardar cambios')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

Object.assign(window, { AdminCourses, CourseEditor });
