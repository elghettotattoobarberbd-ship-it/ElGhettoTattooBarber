// admin/AdminArtists.jsx
function AdminArtists() {
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
        .from('artists')
        .select('*')
        .order('sort_order', { ascending: true })
        .order('created_at',  { ascending: true });
      if (error) throw error;
      setItems(data || []);
    } catch (e) {
      setError((e && e.message) || 'No se pudieron cargar los artistas.');
      setItems([]);
    } finally { setLoading(false); }
  }, [isReady]);

  React.useEffect(() => { load(); }, [load]);

  const toggleActive = async (it) => {
    const next = !it.is_active;
    const { error } = await window.sb.from('artists').update({ is_active: next }).eq('id', it.id);
    if (error) { alert(error.message); return; }
    setItems((xs) => xs.map((x) => x.id === it.id ? { ...x, is_active: next } : x));
  };

  const remove = async (id) => {
    if (!window.confirm('Borrar este artista?')) return;
    const { error } = await window.sb.from('artists').delete().eq('id', id);
    if (error) { alert(error.message); return; }
    setItems((xs) => xs.filter((x) => x.id !== id));
  };

  return (
    <div className="admin-page">
      <AdminPageHead
        eyebrow="El equipo"
        page="artistas"
        title="Artistas"
        accent="del estudio"
        sub="Gestioná los perfiles de tatuadores y barberos que se muestran en el sitio."
        actions={
          <button className="btn btn-primary" onClick={() => setEditing('new')}>
            + Nuevo artista
          </button>
        }
      />

      {!isReady && (
        <div className="admin-banner admin-banner-warn" style={{ marginBottom: 24 }}>
          Conectá Supabase para gestionar artistas reales.
        </div>
      )}

      {error && <div className="admin-banner admin-banner-err" style={{ marginBottom: 16 }}>{error}</div>}

      {loading ? (
        <div className="admin-empty">Cargando...</div>
      ) : items.length === 0 ? (
        <div className="admin-empty">
          <div className="admin-empty-tag">sin artistas</div>
          <p>Agregá el primero tocando <strong>+ Nuevo artista</strong>.</p>
        </div>
      ) : (
        <div className="admin-faq-list">
          {items.map((a) => (
            <article key={a.id} className="admin-faq-row">
              <div style={{ display: 'flex', alignItems: 'center', gap: 16, flex: 1, minWidth: 0 }}>
                <div style={{
                  width: 56, height: 56, borderRadius: '50%', flexShrink: 0,
                  background: 'var(--bg-3)', overflow: 'hidden',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontFamily: 'var(--font-stencil)', fontSize: 22, color: 'var(--yellow)',
                  border: '2px solid var(--border-strong)',
                }}>
                  {a.avatar_url
                    ? <img src={a.avatar_url} alt={a.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }}/>
                    : (a.name || '?')[0].toUpperCase()}
                </div>
                <div style={{ minWidth: 0 }}>
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--yellow)', letterSpacing: '0.2em', textTransform: 'uppercase' }}>
                    {a.role || ''}
                    {!a.is_active && <span style={{ marginLeft: 8, color: 'var(--bone-dim)' }}>· INACTIVO</span>}
                  </div>
                  <div style={{ fontFamily: 'var(--font-stencil)', fontSize: 16, textTransform: 'uppercase', marginTop: 2 }}>{a.name}</div>
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--bone-dim)', marginTop: 3, display: 'flex', gap: 12, flexWrap: 'wrap' }}>
                    {a.instagram && <span>@{a.instagram.replace('@', '')}</span>}
                    {a.experience_years && <span>{a.experience_years} años</span>}
                    {a.styles && a.styles.length > 0 && <span>{a.styles.slice(0, 3).join(' · ')}</span>}
                  </div>
                </div>
              </div>
              <div className="admin-style-actions">
                <button onClick={() => setEditing(a)} title="Editar"><Icon name="syringe" size={14}/></button>
                <button onClick={() => toggleActive(a)} title={a.is_active ? 'Desactivar' : 'Activar'}>
                  <Icon name={a.is_active ? 'sun' : 'moon'} size={14}/>
                </button>
                <button onClick={() => remove(a.id)} title="Borrar" className="danger"><Icon name="close" size={14}/></button>
              </div>
            </article>
          ))}
        </div>
      )}

      {editing && (
        <ArtistEditor
          item={editing === 'new' ? null : editing}
          onClose={() => setEditing(null)}
          onSaved={() => { setEditing(null); load(); }}
        />
      )}
    </div>
  );
}

function ArtistEditor({ item, onClose, onSaved }) {
  const isNew = !item;
  const [name,       setName]    = React.useState(item?.name             || '');
  const [role,       setRole]    = React.useState(item?.role             || 'Tatuadora');
  const [bio,        setBio]     = React.useState(item?.bio              || '');
  const [expYears,   setExp]     = React.useState(item?.experience_years != null ? String(item.experience_years) : '');
  const [pieces,     setPieces]  = React.useState(item?.pieces_count || '');
  const [styles,     setStyles]  = React.useState((item?.styles || []).join('\n'));
  const [instagram,  setIg]      = React.useState(item?.instagram        || '');
  const [whatsapp,   setWa]      = React.useState(item?.whatsapp         || '');
  const [isActive,   setActive]  = React.useState(item?.is_active        ?? true);
  const [sortOrder,  setSort]    = React.useState(item?.sort_order       ?? 0);
  const [avatarFile, setAvFile]  = React.useState(null);
  const [avatarPrev, setAvPrev]  = React.useState(item?.avatar_url       || '');
  const [busy, setBusy] = React.useState(false);
  const [err,  setErr]  = React.useState('');

  const save = async (e) => {
    e.preventDefault();
    setErr('');
    if (!window.sb) { setErr('Supabase no configurado.'); return; }
    if (!name.trim()) { setErr('El nombre es obligatorio.'); return; }
    setBusy(true);
    try {
      let avatar_url = item?.avatar_url || null;
      if (avatarFile) {
        const ext  = (avatarFile.name.split('.').pop() || 'jpg').toLowerCase();
        const path = 'avatars/' + Date.now() + '.' + ext;
        const up   = await window.sb.storage.from('artists').upload(path, avatarFile, {
          cacheControl: '3600', upsert: false, contentType: avatarFile.type,
        });
        if (up.error) throw up.error;
        const { data: pub } = window.sb.storage.from('artists').getPublicUrl(up.data.path);
        avatar_url = pub.publicUrl;
      }

      const slug = name.trim().toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '').slice(0, 60);

      const payload = {
        slug:             item?.slug || slug,
        name:             name.trim(),
        role,
        bio:              bio              || null,
        experience_years: expYears !== '' ? Number(expYears) : null,
        pieces_count:     pieces || null,
        styles:           styles ? styles.split('\n').map((s) => s.trim()).filter(Boolean) : null,
        instagram:        instagram        || null,
        whatsapp:         whatsapp         || null,
        is_active:        !!isActive,
        sort_order:       Number(sortOrder) || 0,
        avatar_url,
      };

      if (isNew) {
        const { error } = await window.sb.from('artists').insert(payload);
        if (error) throw error;
      } else {
        const { error } = await window.sb.from('artists').update(payload).eq('id', item.id);
        if (error) throw error;
      }
      onSaved();
    } catch (ex) {
      setErr((ex && ex.message) || 'Error guardando.');
    } finally { setBusy(false); }
  };

  return (
    <div className="admin-modal-backdrop" onClick={onClose}>
      <div className="admin-modal" style={{ maxWidth: 600 }} onClick={(e) => e.stopPropagation()}>
        <button className="admin-modal-close" onClick={onClose}><Icon name="close" size={16}/></button>
        <header className="admin-modal-head">
          <div className="eyebrow">{isNew ? 'Nuevo' : 'Editar'} artista</div>
          <h2>{isNew ? 'Agregar perfil' : name || 'Editar perfil'}</h2>
        </header>

        <form onSubmit={save} className="admin-form" style={{ display: 'flex', flexDirection: 'column', gap: 0, padding: '0 24px 24px' }}>

          {/* Foto */}
          <div className="form-group">
            <label className="form-label">Foto de perfil</label>
            <div className="admin-dropzone" style={{ aspectRatio: '16/9', marginBottom: 8, position: 'relative' }}>
              {avatarPrev
                ? <img src={avatarPrev} alt="preview" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}/>
                : (
                  <div style={{ textAlign: 'center', pointerEvents: 'none' }}>
                    <div style={{ fontSize: 13, marginBottom: 6 }}>Arrastra o toca para subir</div>
                    <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--yellow)', letterSpacing: '0.15em' }}>
                      RECOMENDADO: 16:9
                    </div>
                  </div>
                )}
              <input type="file" accept="image/*" onChange={(e) => {
                const f = e.target.files && e.target.files[0];
                if (f) { setAvFile(f); setAvPrev(URL.createObjectURL(f)); }
              }}/>
            </div>
            {avatarPrev && (
              <button type="button" className="btn btn-ghost" style={{ fontSize: 11, padding: '4px 10px' }}
                onClick={() => { setAvFile(null); setAvPrev(''); }}>
                Quitar foto
              </button>
            )}
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--bone-dim)', letterSpacing: '0.1em', marginTop: 6 }}>
              Para mejor resultado usá una foto en proporcion 16:9 (ej: 1280x720px)
            </div>
          </div>

          {/* Nombre + Rol */}
          <div className="form-row-2">
            <div className="form-group">
              <label className="form-label">Nombre completo *</label>
              <input className="form-input" required value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Celeste Agostina Ibarra"/>
            </div>
            <div className="form-group">
              <label className="form-label">Rol</label>
              <select className="form-input" value={role} onChange={(e) => setRole(e.target.value)}>
                <option value="Tatuadora">Tatuadora</option>
                <option value="Tatuador">Tatuador</option>
                <option value="Barbero">Barbero</option>
                <option value="Barbera">Barbera</option>
                <option value="Tatuador / Barbero">Tatuador / Barbero</option>
              </select>
            </div>
          </div>

          {/* Bio */}
          <div className="form-group">
            <label className="form-label">Biografia</label>
            <textarea className="form-textarea" rows="4" value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="Tatuadora hace X anos, especialista en..."/>
          </div>

          {/* Estilos */}
          <div className="form-group">
            <label className="form-label">Estilos (uno por linea)</label>
            <textarea className="form-textarea" rows="3" value={styles}
              onChange={(e) => setStyles(e.target.value)}
              placeholder={'Black & Grey\nRealismo\nFine Line'}/>
          </div>

          {/* Instagram + WhatsApp */}
          <div className="form-row-2">
            <div className="form-group">
              <label className="form-label">Instagram</label>
              <input className="form-input" value={instagram}
                onChange={(e) => setIg(e.target.value)}
                placeholder="celesteagostina.ttt"/>
            </div>
            <div className="form-group">
              <label className="form-label">WhatsApp</label>
              <input className="form-input" value={whatsapp}
                onChange={(e) => setWa(e.target.value)}
                placeholder="+5493543316916"/>
            </div>
          </div>

          {/* Años + piezas + orden + activo */}
          <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', alignItems: 'center', marginTop: 4 }}>
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">Anos exp.</label>
              <input className="form-input" type="number" step="0.5" min="0" style={{ width: 90 }}
                value={expYears} onChange={(e) => setExp(e.target.value)} placeholder="4.5"/>
            </div>
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">Piezas hechas</label>
              <input className="form-input" style={{ width: 110 }}
                value={pieces} onChange={(e) => setPieces(e.target.value)} placeholder="500+"/>
            </div>
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">Orden</label>
              <input className="form-input" type="number" style={{ width: 80 }}
                value={sortOrder} onChange={(e) => setSort(e.target.value)}/>
            </div>
            <label className="admin-check" style={{ marginTop: 20 }}>
              <input type="checkbox" checked={isActive} onChange={(e) => setActive(e.target.checked)}/>
              <span>Activo (visible en el sitio)</span>
            </label>
          </div>

          {err && <div className="admin-banner admin-banner-err" style={{ marginTop: 12 }}>{err}</div>}

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 12, marginTop: 16 }}>
            <button type="button" className="btn btn-ghost" onClick={onClose}>Cancelar</button>
            <button type="submit" className="btn btn-primary" disabled={busy}>
              {busy ? 'Guardando...' : (isNew ? 'Crear artista' : 'Guardar cambios')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

Object.assign(window, { AdminArtists, ArtistEditor });
