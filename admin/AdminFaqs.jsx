// admin/AdminFaqs.jsx — CRUD for the booking-page FAQs
function AdminFaqs() {
  const [items, setItems] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState('');
  const [editing, setEditing] = React.useState(null);

  const isReady = !!window.sb;

  const load = React.useCallback(async () => {
    setLoading(true); setError('');
    if (!isReady) {
      setItems([]);
      setLoading(false);
      return;
    }
    try {
      const { data, error } = await window.sb
        .from('faqs')
        .select('*')
        .order('sort_order', { ascending: false });
      if (error) throw error;
      setItems(data || []);
    } catch (e) {
      setError((e && e.message) || 'No se pudieron cargar las preguntas.');
      setItems([]);
    } finally {
      setLoading(false);
    }
  }, [isReady]);

  React.useEffect(() => { load(); }, [load]);

  const remove = async (id) => {
    if (!window.confirm('¿Borrar esta pregunta?')) return;
    const { error } = await window.sb.from('faqs').delete().eq('id', id);
    if (error) { alert(error.message); return; }
    setItems((xs) => xs.filter((x) => x.id !== id));
  };

  const togglePublish = async (it) => {
    const next = !it.is_published;
    const { error } = await window.sb.from('faqs').update({ is_published: next }).eq('id', it.id);
    if (error) { alert(error.message); return; }
    setItems((xs) => xs.map((x) => x.id === it.id ? { ...x, is_published: next } : x));
  };

  const move = async (it, dir) => {
    const next = (it.sort_order || 0) + (dir === 'up' ? 1 : -1);
    const { error } = await window.sb.from('faqs').update({ sort_order: next }).eq('id', it.id);
    if (error) { alert(error.message); return; }
    load();
  };

  return (
    <div className="admin-page">
      <AdminPageHead
        eyebrow="Preguntas frecuentes"
        page="reservar"
        title="Preguntas"
        accent="frecuentes"
        sub="Editá las dudas que ve el cliente en la página de reservar."
        actions={
          <button className="btn btn-primary" onClick={() => setEditing('new')}>
            + Nueva pregunta
          </button>
        }
      />

      {!isReady && (
        <div className="admin-banner admin-banner-warn" style={{ marginBottom: 24 }}>
          Conectá Supabase para empezar a gestionar las preguntas reales.
        </div>
      )}

      <div className="admin-help" style={{ marginBottom: 20 }}>
        <div className="admin-help-title">¿Dónde aparecen las preguntas?</div>
        <ul>
          <li><span className="admin-help-tag">Publicada</span> se muestra en <strong>reservar.html</strong>, debajo del formulario.</li>
          <li>El orden lo manejas con las flechas <strong>↑/↓</strong> (más alto = aparece primero).</li>
          <li>Sin marcar como publicada, queda guardada pero <strong>nadie la ve</strong>.</li>
        </ul>
      </div>

      {error && <div className="admin-banner admin-banner-err" style={{ marginBottom: 16 }}>{error}</div>}

      {loading ? (
        <div className="admin-empty">Cargando…</div>
      ) : items.length === 0 ? (
        <div className="admin-empty">
          <div className="admin-empty-tag">sin preguntas</div>
          <p>Creá la primera tocando <strong>+ Nueva pregunta</strong>.</p>
          <button className="btn btn-primary" style={{ marginTop: 18 }} onClick={() => setEditing('new')}>
            + Crear la primera
          </button>
        </div>
      ) : (
        <div className="admin-faq-list">
          {items.map((it) => (
            <article key={it.id} className="admin-faq-row">
              <div className="admin-faq-info">
                <div className="admin-faq-q">
                          {it.question}
                </div>
                <div className="admin-faq-a">{it.answer}</div>
                {it.category && (
                  <div className="admin-faq-cat">
                    <span>{it.category}</span>
                    {!it.is_published && <span className="admin-badge" style={{ position: 'static', marginLeft: 8 }}>Oculta</span>}
                  </div>
                )}
                {!it.category && !it.is_published && (
                  <div className="admin-faq-cat">
                    <span className="admin-badge" style={{ position: 'static' }}>Oculta</span>
                  </div>
                )}
              </div>
              <div className="admin-style-order">
                <button onClick={() => move(it, 'up')} title="Subir orden">↑</button>
                <span>{it.sort_order ?? 0}</span>
                <button onClick={() => move(it, 'down')} title="Bajar orden">↓</button>
              </div>
              <div className="admin-style-actions">
                <button onClick={() => setEditing(it)} title="Editar"><Icon name="syringe" size={14}/></button>
                <button onClick={() => togglePublish(it)} title={it.is_published ? 'Despublicar' : 'Publicar'}>
                  <Icon name={it.is_published ? 'sun' : 'moon'} size={14}/>
                </button>
                <button onClick={() => remove(it.id)} title="Borrar" className="danger"><Icon name="close" size={14}/></button>
              </div>
            </article>
          ))}
        </div>
      )}

      {editing && (
        <FaqEditor
          item={editing === 'new' ? null : editing}
          onClose={() => setEditing(null)}
          onSaved={() => { setEditing(null); load(); }}
        />
      )}
    </div>
  );
}

function FaqEditor({ item, onClose, onSaved }) {
  const isNew = !item;
  const [question, setQuestion] = React.useState(item?.question || '');
  const [answer, setAnswer]     = React.useState(item?.answer   || '');
  const [category, setCategory] = React.useState(item?.category || 'reserva');
  const [sortOrder, setSort]    = React.useState(item?.sort_order ?? 0);
  const [isPublished, setPub]   = React.useState(item?.is_published ?? true);
  const [busy, setBusy] = React.useState(false);
  const [err, setErr] = React.useState('');

  const save = async (e) => {
    e.preventDefault();
    setErr('');
    if (!window.sb) { setErr('Supabase no configurado.'); return; }
    if (!question.trim() || !answer.trim()) {
      setErr('La pregunta y la respuesta no pueden estar vacías.');
      return;
    }
    setBusy(true);
    try {
      const payload = {
        question: question.trim(),
        answer: answer.trim(),
        category: category || null,
        sort_order: Number(sortOrder) || 0,
        is_published: !!isPublished,
      };
      if (isNew) {
        const { error } = await window.sb.from('faqs').insert(payload);
        if (error) throw error;
      } else {
        const { error } = await window.sb.from('faqs').update(payload).eq('id', item.id);
        if (error) throw error;
      }
      onSaved();
    } catch (ex) {
      setErr(ex.message || 'Error guardando.');
    } finally { setBusy(false); }
  };

  return (
    <div className="admin-modal-backdrop" onClick={onClose}>
      <div className="admin-modal" style={{ maxWidth: 640 }} onClick={(e) => e.stopPropagation()}>
        <button className="admin-modal-close" onClick={onClose}><Icon name="close" size={16}/></button>
        <header className="admin-modal-head">
          <div className="eyebrow">{isNew ? 'Nueva' : 'Editar'} pregunta</div>
          <h2>{isNew ? 'Crear pregunta' : 'Editar pregunta'}</h2>
        </header>

        <form onSubmit={save} className="admin-form" style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
          <div className="form-group">
            <label className="form-label">Pregunta</label>
            <input
              className="form-input"
              autoFocus
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              placeholder="¿Cómo reservo un turno?"
            />
          </div>

          <div className="form-group">
            <label className="form-label">Respuesta</label>
            <textarea
              className="form-textarea"
              rows="6"
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              placeholder="Mandanos un WhatsApp con tu idea, referencias..."
            />
          </div>

          <div className="form-row-2">
            <div className="form-group">
              <label className="form-label">Categoría</label>
              <select className="form-input" value={category} onChange={(e) => setCategory(e.target.value)}>
                <option value="reserva">Reserva</option>
                <option value="tatuaje">Tatuaje</option>
                <option value="barber">Barbería</option>
                <option value="cuidados">Cuidados</option>
                <option value="precios">Precios</option>
                <option value="ubicacion">Ubicación</option>
                <option value="otros">Otros</option>
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Orden</label>
              <input
                className="form-input"
                type="number"
                value={sortOrder}
                onChange={(e) => setSort(e.target.value)}
              />
            </div>
          </div>

          <label className="admin-check" style={{ marginTop: 4, marginBottom: 12 }}>
            <input type="checkbox" checked={isPublished} onChange={(e) => setPub(e.target.checked)}/>
            <span>Publicada · se muestra en reservar.html</span>
          </label>

          {err && <div className="admin-banner admin-banner-err">{err}</div>}

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 12, marginTop: 12 }}>
            <button type="button" className="btn btn-ghost" onClick={onClose}>Cancelar</button>
            <button type="submit" className="btn btn-primary" disabled={busy}>
              {busy ? 'Guardando…' : (isNew ? 'Crear pregunta' : 'Guardar')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

Object.assign(window, { AdminFaqs, FaqEditor });
