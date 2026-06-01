// admin/AdminGallery.jsx — CRUD for gallery_items
const getFileDimensions = (file) => new Promise((resolve, reject) => {
  if (!file) return resolve({ width: 0, height: 0 });
  const type = file.type || '';
  if (type.startsWith('image/')) {
    const img = new Image();
    img.onload = () => {
      resolve({ width: img.naturalWidth, height: img.naturalHeight });
      URL.revokeObjectURL(img.src);
    };
    img.onerror = reject;
    img.src = URL.createObjectURL(file);
    return;
  }
  if (type.startsWith('video/')) {
    const vid = document.createElement('video');
    vid.preload = 'metadata';
    vid.onloadedmetadata = () => {
      resolve({ width: vid.videoWidth, height: vid.videoHeight });
      URL.revokeObjectURL(vid.src);
    };
    vid.onerror = reject;
    vid.src = URL.createObjectURL(file);
    return;
  }
  resolve({ width: 0, height: 0 });
});

function AdminGallery() {
  const [tab, setTab] = React.useState('tatuaje');     // 'tatuaje' | 'barber'
  const [items, setItems] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState('');
  const [editing, setEditing] = React.useState(null); // item being edited or 'new'

  const isReady = !!window.sb;

  const load = React.useCallback(async () => {
    setLoading(true); setError('');
    if (!isReady) {
      setItems([]); setLoading(false); return;
    }
    try {
      const { data, error } = await window.sb
        .from('gallery_items')
        .select('*, style:tattoo_styles(id, slug, label)')
        .eq('kind', tab)
        .order('sort_order', { ascending: false })
        .order('created_at', { ascending: false });
      if (error) throw error;
      setItems(data || []);
    } catch (e) {
      setError(e.message || 'No se pudieron cargar las piezas.');
    } finally {
      setLoading(false);
    }
  }, [tab, isReady]);

  React.useEffect(() => { load(); }, [load]);

  const removeItem = async (id) => {
    if (!window.confirm('¿Borrar esta pieza? No se puede deshacer.')) return;
    const { error } = await window.sb.from('gallery_items').delete().eq('id', id);
    if (error) { alert(error.message); return; }
    setItems((xs) => xs.filter((x) => x.id !== id));
  };

  const togglePublish = async (item) => {
    const next = !item.is_published;
    const { error } = await window.sb
      .from('gallery_items')
      .update({ is_published: next })
      .eq('id', item.id);
    if (error) { alert(error.message); return; }
    setItems((xs) => xs.map((x) => x.id === item.id ? { ...x, is_published: next } : x));
  };

  return (
    <div className="admin-page">
      <AdminPageHead
        eyebrow="Portfolio"
        page="galeria"
        title="Galería"
        accent={tab === 'tatuaje' ? 'tatuajes' : 'cortes'}
        sub="Subí, editá o despublicá piezas del portfolio."
        actions={
          <button className="btn btn-primary" onClick={() => setEditing('new')}>
            + Nueva pieza
          </button>
        }
      />

      {!isReady && (
        <div className="admin-banner admin-banner-warn" style={{ marginBottom: 24 }}>
          Conectá Supabase para subir y gestionar piezas reales.
        </div>
      )}

      <div className="admin-tabs">
        <button className={`admin-tab ${tab === 'tatuaje' ? 'active' : ''}`} onClick={() => setTab('tatuaje')}>Tatuajes</button>
        <button className={`admin-tab ${tab === 'barber' ? 'active' : ''}`} onClick={() => setTab('barber')}>Cortes</button>
      </div>

      <div className="admin-help">
        <div className="admin-help-title">¿Dónde aparecen las piezas que subo?</div>
        <ul>
          <li><span className="admin-help-tag">Publicada</span> sale en <strong>Galería</strong> y en la <strong>sección Instagram del contacto</strong>.</li>
          <li><span className="admin-help-tag admin-help-tag-yellow">Destacada</span> aparece <strong>primera</strong> en la home (las 4 cards) y en la sección Instagram. Una pieza destacada también se guarda publicada.</li>
          <li>Sin marcar como publicada, queda guardada pero <strong>nadie la ve</strong>.</li>
        </ul>
      </div>

      {error && <div className="admin-banner admin-banner-err" style={{ marginBottom: 16 }}>{error}</div>}

      {loading ? (
        <div className="admin-empty">Cargando piezas…</div>
      ) : items.length === 0 ? (
        <div className="admin-empty">
          <div className="admin-empty-tag">sin piezas</div>
          <p>Subí la primera tocando <strong>+ Nueva pieza</strong>.</p>
        </div>
      ) : (
        <div className="admin-grid">
          {items.map((it) => (
            <article key={it.id} className="admin-card admin-pizza">
              <div className="admin-pizza-img">
                {it.image_url ? (
                  /\.(mp4|webm|mov)$/i.test(it.image_url)
                    ? <video src={it.image_url} muted loop playsInline style={{ width: '100%', height: '100%', objectFit: 'cover' }}/>
                    : <img src={it.thumb_url || it.image_url} alt={it.title || ''} />
                ) : (
                  <div className="admin-pizza-empty">Sin imagen</div>
                )}
                {!it.is_published && <span className="admin-badge">Oculta</span>}
                {it.is_featured && <span className="admin-badge admin-badge-yellow">Destacada</span>}
              </div>
              <div className="admin-pizza-body">
                <div className="admin-pizza-title">{it.title || 'Sin título'}</div>
                <div className="admin-pizza-meta">{it.style?.label || it.style_slug || it.style || '—'}</div>
              </div>
              <div className="admin-pizza-actions">
                <button onClick={() => setEditing(it)} title="Editar">
                  <Icon name="syringe" size={14}/>
                </button>
                <button onClick={() => togglePublish(it)} title={it.is_published ? 'Despublicar' : 'Publicar'}>
                  <Icon name={it.is_published ? 'sun' : 'moon'} size={14}/>
                </button>
                <button onClick={() => removeItem(it.id)} title="Borrar" className="danger">
                  <Icon name="close" size={14}/>
                </button>
              </div>
            </article>
          ))}
        </div>
      )}

      {editing && (
        <GalleryEditor
          item={editing === 'new' ? null : editing}
          kind={tab}
          onClose={() => setEditing(null)}
          onSaved={() => { setEditing(null); load(); }}
        />
      )}
    </div>
  );
}

// ===========================================================
// Editor modal — create / edit a gallery item with file upload
// ===========================================================
function GalleryEditor({ item, kind, onClose, onSaved }) {
  const isNew = !item;
  const [form, setForm] = React.useState(() => ({
    title:        item?.title       || '',
    caption:      item?.caption     || '',
    style_slug:   item?.style?.slug || item?.style_slug || '',
    tags:         (item?.tags || []).join(', '),
    is_featured:  item?.is_featured || false,
    is_published: item?.is_published ?? true,
    sort_order:   item?.sort_order  ?? 0,
  }));
  const [file, setFile] = React.useState(null);
  const [preview, setPreview] = React.useState(item?.image_url || '');
  const [previewType, setPreviewType] = React.useState(item?.image_url && /\.(mp4|webm|mov)$/i.test(item.image_url) ? 'video' : 'image');
  const [busy, setBusy] = React.useState(false);
  const [err, setErr] = React.useState('');
  const [styles, setStyles] = React.useState(null); // loaded from DB

  React.useEffect(() => {
    (async () => {
      if (!window.sb) {
        const fallback = (kind === 'tatuaje' ? window.TATTOO_STYLES : window.BARBER_STYLES) || [];
        setStyles(fallback.filter((s) => s.slug !== 'todos'));
        return;
      }
      try {
        const { data } = await window.sb
          .from('tattoo_styles')
          .select('*')
          .eq('kind', kind)
          .order('sort_order', { ascending: false });
        const list = data && data.length > 0
          ? data
          : ((kind === 'tatuaje' ? window.TATTOO_STYLES : window.BARBER_STYLES) || []).filter((s) => s.slug !== 'todos');
        setStyles(list);
      } catch {
        const fallback = (kind === 'tatuaje' ? window.TATTOO_STYLES : window.BARBER_STYLES) || [];
        setStyles(fallback.filter((s) => s.slug !== 'todos'));
      }
    })();
  }, [kind]);

  const handleFile = (f) => {
    setFile(f);
    if (f) {
      setPreview(URL.createObjectURL(f));
      setPreviewType(/^(video|audio)\//.test(f.type) || /\.(mp4|webm|mov)$/i.test(f.name) ? 'video' : 'image');
    }
  };

  const save = async (e) => {
    e.preventDefault();
    setErr('');
    if (!window.sb) { setErr('Supabase no configurado.'); return; }
    setBusy(true);
    try {
      let image_url = item?.image_url || '';
      if (file) {
        const ext = (file.name.split('.').pop() || 'jpg').toLowerCase();
        const path = `${kind}/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
        const up = await window.sb.storage.from('gallery').upload(path, file, {
          cacheControl: '3600', upsert: false, contentType: file.type,
        });
        if (up.error) throw up.error;
        const { data: pub } = window.sb.storage.from('gallery').getPublicUrl(up.data.path);
        image_url = pub.publicUrl;
      }

      const { width, height } = file
        ? await getFileDimensions(file)
        : { width: item?.width || null, height: item?.height || null };
      const style = (styles || []).find((s) => s.slug === form.style_slug);
      const payload = {
        kind,
        title: form.title || null,
        caption: form.caption || null,
        style_id: style?.id || null,
        tags: form.tags ? form.tags.split(',').map((s) => s.trim()).filter(Boolean) : null,
        is_featured: !!form.is_featured,
        is_published: !!form.is_published || !!form.is_featured,
        sort_order: Number(form.sort_order) || 0,
        image_url,
        width: width || null,
        height: height || null,
      };

      if (isNew) {
        const { error } = await window.sb.from('gallery_items').insert(payload);
        if (error) throw error;
      } else {
        const { error } = await window.sb.from('gallery_items').update(payload).eq('id', item.id);
        if (error) throw error;
      }
      onSaved();
    } catch (ex) {
      setErr(ex.message || 'Error guardando.');
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="admin-modal-backdrop" onClick={onClose}>
      <div className="admin-modal" onClick={(e) => e.stopPropagation()}>
        <button className="admin-modal-close" onClick={onClose}>
          <Icon name="close" size={16}/>
        </button>

        <header className="admin-modal-head">
          <div className="eyebrow">{isNew ? 'Nueva' : 'Editar'} · {kind === 'tatuaje' ? 'Tatuaje' : 'Corte'}</div>
          <h2>{isNew ? 'Subir pieza al portfolio' : 'Editar pieza'}</h2>
        </header>

        <form onSubmit={save} className="admin-form admin-form-grid">
          <div className="admin-form-col">
            <div className="form-group">
              <label className="form-label">Foto o video</label>
              <div className="admin-dropzone">
                {preview ? (
                  previewType === 'video' ? (
                    <video src={preview} controls muted playsInline style={{ width: '100%', height: '100%', objectFit: 'contain', background: '#000' }}/>
                  ) : (
                    <img src={preview} alt="preview"/>
                  )
                ) : (
                  <span>Arrastrá o tocá para subir una foto o un video</span>
                )}
                <input
                  type="file"
                  accept="image/*,video/mp4,video/webm,video/quicktime"
                  onChange={(e) => handleFile(e.target.files?.[0])}
                />
              </div>
              <div style={{ marginTop: 8, fontSize: 12, color: 'var(--ink-dim)' }}>
                Videos: preferí 16:9 u 9:16 para que se vean bien en la galería.
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Etiquetas (separadas por coma)</label>
              <input className="form-input" value={form.tags}
                onChange={(e) => setForm({ ...form, tags: e.target.value })}
                placeholder="rosa, brazo, b&g"/>
            </div>
          </div>

          <div className="admin-form-col">
            <div className="form-group">
              <label className="form-label">Título</label>
              <input className="form-input" value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                placeholder="Lobo en el bosque"/>
            </div>

            <div className="form-group">
              <label className="form-label">{kind === 'tatuaje' ? 'Estilo' : 'Servicio'}</label>
              <select className="form-input" value={form.style_slug}
                onChange={(e) => setForm({ ...form, style_slug: e.target.value })}>
                <option value="">— elegí uno —</option>
                {(styles || []).map((s) => (
                  <option key={s.slug} value={s.slug}>{s.label}</option>
                ))}
              </select>
              {styles && styles.length === 0 && (
                <div style={{ marginTop: 8, fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--yellow)', letterSpacing: '0.1em' }}>
                  Todavía no creaste estilos. Andá a "Estilos & filtros" en el menú lateral.
                </div>
              )}
            </div>

            <div className="form-group">
              <label className="form-label">Descripción (opcional)</label>
              <textarea className="form-textarea" value={form.caption}
                onChange={(e) => setForm({ ...form, caption: e.target.value })}
                placeholder="Pieza hecha en 3 sesiones..."/>
            </div>

            <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
              <label className="admin-check">
                <input type="checkbox" checked={form.is_published}
                  onChange={(e) => setForm({ ...form, is_published: e.target.checked })}/>
                <span>Publicada · sale en galería + sección IG</span>
              </label>
              <label className="admin-check">
                <input type="checkbox" checked={form.is_featured}
                  onChange={(e) => setForm({ ...form, is_featured: e.target.checked })}/>
                <span>Destacada · aparece primero en la home</span>
              </label>
              <label className="admin-check">
                <span style={{ marginRight: 8 }}>Orden</span>
                <input
                  type="number" className="form-input" style={{ width: 80, padding: '6px 10px' }}
                  value={form.sort_order}
                  onChange={(e) => setForm({ ...form, sort_order: e.target.value })}/>
              </label>
            </div>
          </div>

          {err && <div className="admin-banner admin-banner-err" style={{ gridColumn: '1 / -1' }}>{err}</div>}

          <div style={{ gridColumn: '1 / -1', display: 'flex', justifyContent: 'flex-end', gap: 12 }}>
            <button type="button" className="btn btn-ghost" onClick={onClose}>Cancelar</button>
            <button type="submit" className="btn btn-primary" disabled={busy}>
              {busy ? 'Guardando…' : (isNew ? 'Subir pieza' : 'Guardar cambios')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

Object.assign(window, { AdminGallery, GalleryEditor });
