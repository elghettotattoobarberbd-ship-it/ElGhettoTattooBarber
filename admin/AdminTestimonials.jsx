// admin/AdminTestimonials.jsx — CRUD para testimonios

function AdminTestimonios() {
  const [items,   setItems]   = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [error,   setError]   = React.useState('');
  const [editing, setEditing] = React.useState(null);

  const isReady = !!window.sb;

  const load = React.useCallback(async () => {
    setLoading(true); setError('');
    if (!isReady) { setItems([]); setLoading(false); return; }
    try {
      const { data, error } = await window.sb
        .from('testimonials')
        .select('*')
        .order('sort_order', { ascending: true })
        .order('created_at', { ascending: false });
      if (error) throw error;
      setItems(data || []);
    } catch (e) {
      setError(e.message || 'No se pudieron cargar los testimonios.');
    } finally { setLoading(false); }
  }, [isReady]);

  React.useEffect(() => { load(); }, [load]);

  const togglePublish = async (it) => {
    const next = !it.is_published;
    const { error } = await window.sb.from('testimonials').update({ is_published: next }).eq('id', it.id);
    if (error) { alert(error.message); return; }
    setItems((xs) => xs.map((x) => x.id === it.id ? { ...x, is_published: next } : x));
  };

  const remove = async (id) => {
    if (!window.confirm('¿Borrar este testimonio?')) return;
    const { error } = await window.sb.from('testimonials').delete().eq('id', id);
    if (error) { alert(error.message); return; }
    setItems((xs) => xs.filter((x) => x.id !== id));
  };

  const pending   = items.filter((t) => !t.is_published);
  const published = items.filter((t) =>  t.is_published);

  const reviewUrl = window.location.origin + window.location.pathname.replace('admin.html', '') + 'review.html';
  const qrSrc     = 'https://api.qrserver.com/v1/create-qr-code/?size=180x180&color=0d0d0d&bgcolor=f5c518&data=' + encodeURIComponent(reviewUrl);
  const qrSrcHD   = 'https://api.qrserver.com/v1/create-qr-code/?size=600x600&color=0d0d0d&bgcolor=f5c518&data=' + encodeURIComponent(reviewUrl);

  const downloadQr = async () => {
    try {
      const res  = await fetch(qrSrcHD);
      const blob = await res.blob();
      const url  = URL.createObjectURL(blob);
      const a    = document.createElement('a');
      a.href     = url;
      a.download = 'qr-resenas-elghetto.png';
      a.click();
      URL.revokeObjectURL(url);
    } catch (e) {
      alert('No se pudo descargar el QR. Intentalo de nuevo.');
    }
  };

  const approve = async (it) => {
    const { error } = await window.sb.from('testimonials').update({ is_published: true }).eq('id', it.id);
    if (error) { alert(error.message); return; }
    setItems((xs) => xs.map((x) => x.id === it.id ? { ...x, is_published: true } : x));
  };

  const Stars = ({ rating }) => (
    <div style={{ display: 'flex', gap: 3 }}>
      {Array.from({ length: 5 }).map((_, i) => (
        <span key={i} style={{ color: i < rating ? 'var(--yellow)' : 'var(--border-strong)', fontSize: 14, lineHeight: 1 }}>★</span>
      ))}
    </div>
  );

  const TesteRow = ({ t, showApprove }) => (
    <article style={{
      background: 'var(--bg-2)',
      border: '1.5px solid var(--border)',
      borderLeft: showApprove ? '4px solid var(--yellow)' : '4px solid var(--border-strong)',
      display: 'grid',
      gridTemplateColumns: '1fr auto',
      overflow: 'hidden',
      transition: 'border-color 120ms',
    }}>
      {/* Contenido */}
      <div style={{ padding: '16px 20px', display: 'flex', flexDirection: 'column', gap: 10, minWidth: 0 }}>

        {/* Fila superior: avatar + nombre + estrellas + badge servicio */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
          <div style={{
            width: 38, height: 38, borderRadius: '50%', flexShrink: 0,
            background: 'var(--bg-3)', border: '2px solid var(--border-strong)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontFamily: 'var(--font-stencil)', fontSize: 16, color: 'var(--yellow)',
            overflow: 'hidden',
          }}>
            {t.photo_url
              ? <img src={t.photo_url} alt={t.client_name} style={{ width: '100%', height: '100%', objectFit: 'cover' }}/>
              : (t.client_name || '?')[0].toUpperCase()}
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
              <span style={{ fontFamily: 'var(--font-stencil)', fontSize: 14, textTransform: 'uppercase', letterSpacing: '0.02em' }}>
                {t.client_name}
              </span>
              {t.client_handle && (
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--bone-dim)' }}>
                  {t.client_handle}
                </span>
              )}
              {t.service_type && (
                <span style={{
                  fontFamily: 'var(--font-mono)', fontSize: 9, letterSpacing: '0.15em',
                  padding: '2px 7px', textTransform: 'uppercase',
                  background: t.service_type === 'tatuaje' ? 'rgba(245,197,24,.1)' : 'rgba(77,166,255,.1)',
                  color: t.service_type === 'tatuaje' ? 'var(--yellow)' : '#4da6ff',
                  border: '1px solid ' + (t.service_type === 'tatuaje' ? 'rgba(245,197,24,.25)' : 'rgba(77,166,255,.25)'),
                }}>
                  {t.service_type === 'tatuaje' ? 'Tatuaje' : 'Barberia'}
                </span>
              )}
              {showApprove && (
                <span style={{
                  fontFamily: 'var(--font-mono)', fontSize: 9, letterSpacing: '0.15em',
                  padding: '2px 7px', textTransform: 'uppercase',
                  background: 'rgba(245,197,24,.15)', color: 'var(--yellow)',
                  border: '1px solid rgba(245,197,24,.4)',
                }}>
                  Pendiente
                </span>
              )}
            </div>
            <Stars rating={t.rating || 0}/>
          </div>
        </div>

        {/* Cuerpo de la reseña */}
        {t.body && (
          <div style={{
            fontSize: 13, color: 'var(--bone)', lineHeight: 1.6,
            fontStyle: 'italic', paddingLeft: 4,
            borderLeft: '2px solid var(--border-strong)',
          }}>
            "{t.body}"
          </div>
        )}
      </div>

      {/* Acciones */}
      <div style={{ borderLeft: '1px solid var(--border)', display: 'flex', flexDirection: 'column', minWidth: 48 }}>
        {showApprove && (
          <button onClick={() => approve(t)} title="Aprobar y publicar" style={{
            flex: 1, background: 'rgba(34,197,94,.1)', border: 'none', borderBottom: '1px solid var(--border)',
            color: '#22c55e', cursor: 'pointer', fontSize: 18, transition: 'background 120ms',
          }}>✓</button>
        )}
        <button onClick={() => setEditing(t)} title="Editar" style={{
          flex: 1, background: 'transparent', border: 'none', borderBottom: '1px solid var(--border)',
          color: 'var(--bone-dim)', cursor: 'pointer', transition: 'color 120ms', padding: '0 14px',
        }}>
          <Icon name="syringe" size={14}/>
        </button>
        <button onClick={() => togglePublish(t)} title={t.is_published ? 'Despublicar' : 'Publicar'} style={{
          flex: 1, background: 'transparent', border: 'none', borderBottom: '1px solid var(--border)',
          color: t.is_published ? 'var(--yellow)' : 'var(--bone-dim)', cursor: 'pointer', transition: 'color 120ms', padding: '0 14px',
        }}>
          <Icon name={t.is_published ? 'sun' : 'moon'} size={14}/>
        </button>
        <button onClick={() => remove(t.id)} title="Borrar" style={{
          flex: 1, background: 'transparent', border: 'none',
          color: 'var(--bone-dim)', cursor: 'pointer', transition: 'color 120ms', padding: '0 14px',
        }}
        onMouseEnter={(e) => e.currentTarget.style.color = '#e25c5c'}
        onMouseLeave={(e) => e.currentTarget.style.color = 'var(--bone-dim)'}>
          <Icon name="close" size={14}/>
        </button>
      </div>
    </article>
  );

  return (
    <div className="admin-page">
      <AdminPageHead
        eyebrow="Inicio"
        page="inicio"
        title="Testimonios"
        accent="reseñas"
        sub="Aprobá reseñas del QR o cargá las tuyas. Solo las publicadas se ven en el sitio."
        actions={
          <button className="btn btn-primary" onClick={() => setEditing('new')}>
            + Nueva reseña
          </button>
        }
      />

      {!isReady && (
        <div className="admin-banner admin-banner-warn" style={{ marginBottom: 24 }}>
          Conectá Supabase para gestionar testimonios reales.
        </div>
      )}
      {error && <div className="admin-banner admin-banner-err" style={{ marginBottom: 16 }}>{error}</div>}

      {/* ── QR ── */}
      <div className="admin-card" style={{ marginBottom: 28, padding: 20, display: 'flex', gap: 24, alignItems: 'center', flexWrap: 'wrap' }}>
        <img src={qrSrc} alt="QR reseñas" style={{ width: 90, height: 90, flexShrink: 0, background: 'var(--yellow)', padding: 4 }}/>
        <div style={{ flex: 1, minWidth: 200 }}>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--yellow)', letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: 6 }}>
            QR para clientes
          </div>
          <div style={{ fontSize: 14, marginBottom: 8, lineHeight: 1.5 }}>
            Imprimí o mostrá este QR en el estudio. El cliente lo escanea, deja su reseña y vos la aprobás desde acá antes de que aparezca en el sitio.
          </div>
          <a href={reviewUrl} target="_blank" rel="noopener"
            style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--yellow)', letterSpacing: '0.1em', wordBreak: 'break-all' }}>
            {reviewUrl}
          </a>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8, flexShrink: 0 }}>
          <button type="button" onClick={downloadQr} className="btn btn-primary" style={{ fontSize: 12, padding: '8px 16px' }}>
            Descargar QR
          </button>
          <a href={reviewUrl} target="_blank" rel="noopener" className="btn btn-ghost" style={{ fontSize: 12, padding: '8px 16px', textAlign: 'center' }}>
            Ver página →
          </a>
        </div>
      </div>

      {loading ? (
        <div className="admin-empty">Cargando…</div>
      ) : (
        <>
          {/* ── Pendientes ── */}
          {pending.length > 0 && (
            <div style={{ marginBottom: 32 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 14 }}>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--yellow)', letterSpacing: '0.2em', textTransform: 'uppercase' }}>
                  Por revisar
                </div>
                <span style={{ background: 'var(--yellow)', color: 'var(--ink)', fontFamily: 'var(--font-mono)', fontSize: 10, padding: '2px 8px', fontWeight: 700 }}>
                  {pending.length}
                </span>
              </div>
              <div className="admin-testi-list">
                {pending.map((t) => <TesteRow key={t.id} t={t} showApprove={true}/>)}
              </div>
            </div>
          )}

          {/* ── Publicadas ── */}
          {published.length > 0 && (
            <div>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--bone-dim)', letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: 14 }}>
                Publicadas ({published.length})
              </div>
              <div className="admin-testi-list">
                {published.map((t) => <TesteRow key={t.id} t={t} showApprove={false}/>)}
              </div>
            </div>
          )}

          {items.length === 0 && (
            <div className="admin-empty">
              <div className="admin-empty-tag">sin reseñas</div>
              <p>Compartí el QR con tus clientes o agregá una manualmente.</p>
            </div>
          )}
        </>
      )}

      {editing && (
        <TestimonialEditor
          item={editing === 'new' ? null : editing}
          onClose={() => setEditing(null)}
          onSaved={() => { setEditing(null); load(); }}
        />
      )}
    </div>
  );
}

function TestimonialEditor({ item, onClose, onSaved }) {
  const isNew = !item;
  const [form, setForm] = React.useState(() => ({
    client_name:   item?.client_name   || '',
    client_handle: item?.client_handle || '',
    rating:        item?.rating        ?? 5,
    body:          item?.body          || '',
    service_type:  item?.service_type  || '',
    photo_url:     item?.photo_url     || '',
    is_published:  item?.is_published  ?? true,
    sort_order:    item?.sort_order    ?? 0,
  }));
  const [file,    setFile]    = React.useState(null);
  const [preview, setPreview] = React.useState(item?.photo_url || '');
  const [busy,    setBusy]    = React.useState(false);
  const [err,     setErr]     = React.useState('');

  const onFile = (f) => {
    setFile(f);
    if (f) setPreview(URL.createObjectURL(f));
  };

  const save = async (e) => {
    e.preventDefault();
    setErr('');
    if (!window.sb) { setErr('Supabase no configurado.'); return; }
    setBusy(true);
    try {
      let photo_url = item?.photo_url || '';
      if (file) {
        const ext  = (file.name.split('.').pop() || 'jpg').toLowerCase();
        const path = `testimonials/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
        const up   = await window.sb.storage.from('testimonials').upload(path, file, {
          cacheControl: '3600', upsert: false, contentType: file.type,
        });
        if (up.error) throw up.error;
        const { data: pub } = window.sb.storage.from('testimonials').getPublicUrl(up.data.path);
        photo_url = pub.publicUrl;
      }

      const payload = {
        client_name:   form.client_name,
        client_handle: form.client_handle || null,
        rating:        Number(form.rating),
        body:          form.body,
        service_type:  form.service_type || null,
        photo_url:     photo_url || null,
        is_published:  !!form.is_published,
        sort_order:    Number(form.sort_order) || 0,
      };

      if (isNew) {
        const { error } = await window.sb.from('testimonials').insert(payload);
        if (error) throw error;
      } else {
        const { error } = await window.sb.from('testimonials').update(payload).eq('id', item.id);
        if (error) throw error;
      }
      onSaved();
    } catch (ex) {
      setErr(ex.message || 'Error guardando.');
    } finally { setBusy(false); }
  };

  return (
    <div className="admin-modal-backdrop" onClick={onClose}>
      <div className="admin-modal" style={{ maxWidth: 520 }} onClick={(e) => e.stopPropagation()}>
        <button className="admin-modal-close" onClick={onClose}><Icon name="close" size={16}/></button>
        <header className="admin-modal-head">
          <div className="eyebrow">{isNew ? 'Nueva' : 'Editar'} reseña</div>
          <h2>{isNew ? 'Agregar testimonio' : 'Editar testimonio'}</h2>
        </header>

        <form onSubmit={save} className="admin-form" style={{ padding: '0 24px 24px', display: 'flex', flexDirection: 'column', gap: 16 }}>

          {/* Cuerpo */}
          <div className="form-group">
            <label className="form-label">Reseña <span style={{ color: 'var(--yellow)' }}>*</span></label>
            <textarea className="form-textarea" rows="4" required value={form.body}
              onChange={(e) => setForm({ ...form, body: e.target.value })}
              placeholder="Lo que dijo el cliente…"/>
          </div>

          {/* Nombre + handle */}
          <div className="form-row-2">
            <div className="form-group">
              <label className="form-label">Nombre <span style={{ color: 'var(--yellow)' }}>*</span></label>
              <input className="form-input" required value={form.client_name}
                onChange={(e) => setForm({ ...form, client_name: e.target.value })}
                placeholder="Nicolás M."/>
            </div>
            <div className="form-group">
              <label className="form-label">Handle (opcional)</label>
              <input className="form-input" value={form.client_handle}
                onChange={(e) => setForm({ ...form, client_handle: e.target.value })}
                placeholder="@nico_arg"/>
            </div>
          </div>

          {/* Rating + servicio */}
          <div className="form-row-2">
            <div className="form-group">
              <label className="form-label">Estrellas</label>
              <div style={{ display: 'flex', gap: 6, alignItems: 'center', marginTop: 6 }}>
                {[1, 2, 3, 4, 5].map((n) => (
                  <button key={n} type="button"
                    onClick={() => setForm({ ...form, rating: n })}
                    style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 2 }}>
                    <Icon name="star" size={22} style={{ color: n <= form.rating ? 'var(--yellow)' : 'var(--border-strong)' }}/>
                  </button>
                ))}
              </div>
            </div>
            <div className="form-group">
              <label className="form-label">Servicio</label>
              <select className="form-input" value={form.service_type}
                onChange={(e) => setForm({ ...form, service_type: e.target.value })}>
                <option value="">— Sin especificar —</option>
                <option value="tatuaje">Tatuaje</option>
                <option value="barber">Barbería</option>
              </select>
            </div>
          </div>

          {/* Foto (opcional) */}
          <div className="form-group">
            <label className="form-label">Foto del cliente (opcional)</label>
            <div className="admin-dropzone" style={{ aspectRatio: '1/1', maxWidth: 120 }}>
              {preview
                ? <img src={preview} alt="preview" style={{ borderRadius: '50%', objectFit: 'cover' }}/>
                : <span style={{ fontSize: 11 }}>Avatar</span>}
              <input type="file" accept="image/*" onChange={(e) => onFile(e.target.files?.[0])}/>
            </div>
          </div>

          {/* Publicado + orden */}
          <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', alignItems: 'center' }}>
            <label className="admin-check">
              <input type="checkbox" checked={form.is_published}
                onChange={(e) => setForm({ ...form, is_published: e.target.checked })}/>
              <span>Publicado</span>
            </label>
            <label className="admin-check">
              <span style={{ marginRight: 8 }}>Orden</span>
              <input type="number" className="form-input" style={{ width: 80, padding: '6px 10px' }}
                value={form.sort_order}
                onChange={(e) => setForm({ ...form, sort_order: e.target.value })}/>
            </label>
          </div>

          {err && <div className="admin-banner admin-banner-err">{err}</div>}

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 12, marginTop: 4 }}>
            <button type="button" className="btn btn-ghost" onClick={onClose}>Cancelar</button>
            <button type="submit" className="btn btn-primary" disabled={busy}>
              {busy ? 'Guardando…' : isNew ? 'Agregar reseña' : 'Guardar cambios'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

Object.assign(window, { AdminTestimonios });

