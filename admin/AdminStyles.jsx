// admin/AdminStyles.jsx — CRUD for tattoo_styles (filters)
// Lets the admin add/edit/remove the categories used in:
//   - Gallery page filter chips
//   - Booking form (style picker)
//   - Gallery upload form (style dropdown)

function AdminStyles() {
  const [tab, setTab] = React.useState('tatuaje');   // tatuaje | barber
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
        .from('tattoo_styles')
        .select('*')
        .eq('kind', tab)
        .order('sort_order', { ascending: false })
        .order('label', { ascending: true });
      if (error) throw error;
      setItems(data || []);
    } catch (e) {
      setError(e.message || 'No se pudieron cargar los estilos.');
    } finally { setLoading(false); }
  }, [tab, isReady]);

  React.useEffect(() => { load(); }, [load]);

  const remove = async (it) => {
    if (!window.confirm(`¿Borrar "${it.label}"? Las piezas que usen este estilo quedarán sin filtro.`)) return;
    const { error } = await window.sb.from('tattoo_styles').delete().eq('id', it.id);
    if (error) { alert(error.message); return; }
    setItems((xs) => xs.filter((x) => x.id !== it.id));
  };

  const move = async (it, dir) => {
    const next = (it.sort_order || 0) + (dir === 'up' ? 1 : -1);
    const { error } = await window.sb.from('tattoo_styles').update({ sort_order: next }).eq('id', it.id);
    if (error) { alert(error.message); return; }
    load();
  };

  return (
    <div className="admin-page">
      <AdminPageHead
        eyebrow="Filtros"
        page="galeria"
        title="Estilos &"
        accent="categorías"
        sub="Los filtros que aparecen sobre la galería y en el formulario de reserva. Cambialos cuando quieras."
        actions={
          <button className="btn btn-primary" onClick={() => setEditing('new')}>
            + Nuevo estilo
          </button>
        }
      />

      {!isReady && (
        <div className="admin-banner admin-banner-warn" style={{ marginBottom: 24 }}>
          Conectá Supabase para administrar los estilos.
        </div>
      )}

      <div className="admin-tabs">
        <button className={`admin-tab ${tab === 'tatuaje' ? 'active' : ''}`} onClick={() => setTab('tatuaje')}>
          Estilos de tatuaje
        </button>
        <button className={`admin-tab ${tab === 'barber' ? 'active' : ''}`} onClick={() => setTab('barber')}>
          Estilos de corte
        </button>
      </div>

      <div className="admin-help" style={{ marginBottom: 20 }}>
        <div className="admin-help-title">¿Dónde aparecen estos filtros?</div>
        <ul>
          <li><span className="admin-help-tag">Galería</span> aparecen como chips arriba de las piezas — se usan para filtrar.</li>
          <li><span className="admin-help-tag admin-help-tag-yellow">Reservar</span> el cliente elige su estilo en el formulario.</li>
          <li><span className="admin-help-tag">Subir pieza</span> el dropdown del editor de galería usa esta lista.</li>
        </ul>
      </div>

      {error && <div className="admin-banner admin-banner-err" style={{ marginBottom: 16 }}>{error}</div>}

      {loading ? (
        <div className="admin-empty">Cargando…</div>
      ) : items.length === 0 ? (
        <div className="admin-empty">
          <div className="admin-empty-tag">sin estilos</div>
          <p>Creá el primero tocando <strong>+ Nuevo estilo</strong>.</p>
          <p style={{ marginTop: 12, color: 'var(--bone-dim)', fontSize: 13 }}>
            Sugerencias para tatuaje: <em>Black &amp; Grey, Realismo, Puntillismo, Full Color, Watercolor, Tradicional, Neo Tradicional, Fine Line</em>.
          </p>
          <p style={{ marginTop: 4, color: 'var(--bone-dim)', fontSize: 13 }}>
            Sugerencias para corte: <em>Fades, Clásicos, Barbas, Modernos, Niños</em>.
          </p>
          <button className="btn btn-primary" style={{ marginTop: 18 }} onClick={() => setEditing('new')}>
            + Crear el primero
          </button>
        </div>
      ) : (
        <div className="admin-style-list">
          {items.map((it) => (
            <article key={it.id} className="admin-style-row">
              <div className="admin-style-chip">{it.label}</div>
              <div className="admin-style-info">
                <div className="admin-style-slug"><code>{it.slug}</code></div>
                {it.description && <div className="admin-style-desc">{it.description}</div>}
              </div>
              <div className="admin-style-order">
                <button onClick={() => move(it, 'up')}   title="Subir orden">↑</button>
                <span>{it.sort_order ?? 0}</span>
                <button onClick={() => move(it, 'down')} title="Bajar orden">↓</button>
              </div>
              <div className="admin-style-actions">
                <button onClick={() => setEditing(it)} title="Editar"><Icon name="syringe" size={14}/></button>
                <button onClick={() => remove(it)} title="Borrar" className="danger"><Icon name="close" size={14}/></button>
              </div>
            </article>
          ))}
        </div>
      )}

      {editing && (
        <StyleEditor
          item={editing === 'new' ? null : editing}
          kind={tab}
          onClose={() => setEditing(null)}
          onSaved={() => { setEditing(null); load(); }}
        />
      )}
    </div>
  );
}

function StyleEditor({ item, kind, onClose, onSaved }) {
  const isNew = !item;
  const [label, setLabel]       = React.useState(item?.label       || '');
  const [slug, setSlug]         = React.useState(item?.slug        || '');
  const [description, setDesc]  = React.useState(item?.description || '');
  const [sortOrder, setSort]    = React.useState(item?.sort_order  ?? 0);
  const [touchedSlug, setTouched] = React.useState(!isNew);
  const [busy, setBusy] = React.useState(false);
  const [err, setErr] = React.useState('');

  const slugify = (s) => (s || '').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 50);

  const onLabel = (v) => {
    setLabel(v);
    if (!touchedSlug) setSlug(slugify(v));
  };

  const save = async (e) => {
    e.preventDefault();
    setErr('');
    if (!window.sb) { setErr('Supabase no configurado.'); return; }
    if (!label.trim()) { setErr('Falta el nombre del estilo.'); return; }
    const finalSlug = slug.trim() || slugify(label);
    setBusy(true);
    try {
      const payload = {
        kind, label: label.trim(), slug: finalSlug,
        description: description.trim() || null,
        sort_order: Number(sortOrder) || 0,
      };
      if (isNew) {
        const { error } = await window.sb.from('tattoo_styles').insert(payload);
        if (error) throw error;
      } else {
        const { error } = await window.sb.from('tattoo_styles').update(payload).eq('id', item.id);
        if (error) throw error;
      }
      onSaved();
    } catch (ex) {
      setErr(ex.message || 'Error guardando.');
    } finally { setBusy(false); }
  };

  return (
    <div className="admin-modal-backdrop" onClick={onClose}>
      <div className="admin-modal" style={{ maxWidth: 560 }} onClick={(e) => e.stopPropagation()}>
        <button className="admin-modal-close" onClick={onClose}><Icon name="close" size={16}/></button>
        <header className="admin-modal-head">
          <div className="eyebrow">{isNew ? 'Nuevo' : 'Editar'} estilo · {kind === 'tatuaje' ? 'Tatuaje' : 'Corte'}</div>
          <h2>{isNew ? 'Crear estilo' : 'Editar estilo'}</h2>
        </header>

        <form onSubmit={save} className="admin-form" style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
          <div className="form-group">
            <label className="form-label">Nombre visible</label>
            <input
              className="form-input"
              value={label}
              autoFocus
              onChange={(e) => onLabel(e.target.value)}
              placeholder={kind === 'tatuaje' ? 'Ej: Black & Grey' : 'Ej: Fade clásico'}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Slug (URL técnica)</label>
            <input
              className="form-input"
              value={slug}
              onChange={(e) => { setTouched(true); setSlug(slugify(e.target.value)); }}
              placeholder="black-and-grey"
            />
            <div style={{ marginTop: 6, fontFamily: 'var(--font-mono)', fontSize: 10, letterSpacing: '0.1em', color: 'var(--bone-dim)' }}>
              Se genera solo. Usá solo letras, números y guiones.
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Descripción (opcional)</label>
            <textarea
              className="form-textarea"
              rows="3"
              value={description}
              onChange={(e) => setDesc(e.target.value)}
              placeholder="Explicación corta del estilo"
            />
          </div>

          <div className="form-group">
            <label className="form-label">Orden</label>
            <input
              className="form-input"
              style={{ maxWidth: 120 }}
              type="number"
              value={sortOrder}
              onChange={(e) => setSort(e.target.value)}
            />
            <div style={{ marginTop: 6, fontFamily: 'var(--font-mono)', fontSize: 10, letterSpacing: '0.1em', color: 'var(--bone-dim)' }}>
              Número más alto = aparece antes en la lista.
            </div>
          </div>

          {err && <div className="admin-banner admin-banner-err">{err}</div>}

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 12, marginTop: 16 }}>
            <button type="button" className="btn btn-ghost" onClick={onClose}>Cancelar</button>
            <button type="submit" className="btn btn-primary" disabled={busy}>
              {busy ? 'Guardando…' : (isNew ? 'Crear estilo' : 'Guardar')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

Object.assign(window, { AdminStyles, StyleEditor });
