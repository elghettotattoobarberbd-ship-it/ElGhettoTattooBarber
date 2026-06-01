// admin/AdminConfig.jsx — Site settings (home video, etc.)
function AdminConfig() {
  const [videoUrl, setVideoUrl] = React.useState('');
  const [posterUrl, setPosterUrl] = React.useState('');
  const [orientation, setOrientation] = React.useState('portrait');
  const [loading, setLoading] = React.useState(true);
  const [saving, setSaving] = React.useState(false);
  const [msg, setMsg] = React.useState('');
  const [err, setErr] = React.useState('');

  React.useEffect(() => {
    (async () => {
      if (!window.sb) { setLoading(false); return; }
      try {
        const { data } = await window.sb
          .from('site_settings')
          .select('key, value')
          .in('key', ['home_video_url', 'home_video_poster', 'home_video_orientation']);
        const map = Object.fromEntries((data || []).map((r) => [r.key, r.value]));
        const pick = (v) => typeof v === 'string' ? v : (v?.value || '');
        setVideoUrl(pick(map.home_video_url));
        setPosterUrl(pick(map.home_video_poster));
        setOrientation(pick(map.home_video_orientation) || 'portrait');
      } catch (e) {
        setErr(e.message || 'Error cargando.');
      } finally { setLoading(false); }
    })();
  }, []);

  const upsert = async (key, value) => {
    return window.sb.from('site_settings').upsert(
      { key, value, updated_at: new Date().toISOString() },
      { onConflict: 'key' }
    );
  };

  const configKeyForPrefix = (prefix) => {
    if (prefix === 'home-video') return 'home_video_url';
    if (prefix === 'home-poster') return 'home_video_poster';
    return null;
  };

  const save = async (e) => {
    e.preventDefault();
    setMsg(''); setErr('');
    if (!window.sb) { setErr('Supabase no configurado.'); return; }
    setSaving(true);
    try {
      const r1 = await upsert('home_video_url', videoUrl);
      if (r1.error) throw r1.error;
      const r2 = await upsert('home_video_poster', posterUrl);
      if (r2.error) throw r2.error;
      const r3 = await upsert('home_video_orientation', orientation);
      if (r3.error) throw r3.error;
      setMsg('Configuración guardada. Recargá el home para ver el cambio.');
    } catch (e) {
      setErr(e.message || 'Error guardando.');
    } finally { setSaving(false); }
  };

  const uploadFile = async (file, setter, prefix) => {
    if (!file || !window.sb) return;
    setSaving(true);
    setErr(''); setMsg('');
    try {
      const ext = (file.name.split('.').pop() || 'mp4').toLowerCase();
      const path = `${prefix}-${Date.now()}.${ext}`;
      const up = await window.sb.storage.from('site').upload(path, file, {
        cacheControl: '3600', upsert: true, contentType: file.type,
      });
      if (up.error) throw up.error;
      const { data: pub } = window.sb.storage.from('site').getPublicUrl(up.data.path);
      if (!pub?.publicUrl) throw new Error('No se obtuvo la URL pública del archivo.');
      setter(pub.publicUrl);

      const key = configKeyForPrefix(prefix);
      if (key) {
        const saved = await upsert(key, pub.publicUrl);
        if (saved.error) throw saved.error;
      }

      setMsg('Subido y guardado. Recargá el home para ver el cambio.');
    } catch (e) {
      setErr(e.message || 'Error subiendo el archivo.');
    } finally { setSaving(false); }
  };

  const renderVideoPreview = () => {
    if (/\.(mp4|webm|mov)/i.test(videoUrl)) {
      return (
        <video
          controls
          muted
          playsInline
          src={videoUrl}
          poster={posterUrl || undefined}
          style={{ width: '100%', maxWidth: 640, borderRadius: 14, background: '#000' }}
        />
      );
    }
    if (/youtube\.com|youtu\.be/.test(videoUrl)) {
      return (
        <div className="admin-video-preview">
          <iframe
            title="Vista previa YouTube"
            src={videoUrl.replace(/watch\?v=/, 'embed/').replace(/youtu\.be\//, 'www.youtube.com/embed/')}
            width="100%"
            height="360"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>
      );
    }
    if (/vimeo\.com/.test(videoUrl)) {
      return (
        <div className="admin-video-preview">
          <iframe
            title="Vista previa Vimeo"
            src={videoUrl.replace(/vimeo\.com\/(?:video\/)?/, 'player.vimeo.com/video/')}
            width="100%"
            height="360"
            frameBorder="0"
            allow="autoplay; fullscreen; picture-in-picture"
            allowFullScreen
          />
        </div>
      );
    }
    return (
      <div className="admin-banner admin-banner-warn" style={{ marginTop: 8 }}>
        No hay vista previa disponible para esta URL. Guardá y verificá en el home.
      </div>
    );
  };

  return (
    <div className="admin-page">
      <AdminPageHead
        eyebrow="Configuración"
        page="inicio"
        title="Sitio"
        accent="& datos"
        sub="Cambiá el video del home y otros ajustes generales del sitio."
      />

      {!window.sb && (
        <div className="admin-banner admin-banner-warn" style={{ marginBottom: 24 }}>
          Conectá Supabase para guardar la configuración.
        </div>
      )}
      {err && <div className="admin-banner admin-banner-err" style={{ marginBottom: 16 }}>{err}</div>}
      {msg && <div className="admin-banner" style={{ marginBottom: 16, borderColor: '#22c55e', color: '#dcfce7' }}>{msg}</div>}

      <form onSubmit={save} className="admin-form" style={{ maxWidth: 760 }}>
        <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 24, textTransform: 'uppercase', marginBottom: 16 }}>
          Video del home
        </h3>

        <div className="form-group">
          <label className="form-label">Orientación del video</label>
          <div className="admin-orientation-grid">
            <button
              type="button"
              className={`admin-orientation ${orientation === 'portrait' ? 'selected' : ''}`}
              onClick={() => setOrientation('portrait')}
            >
              <div className="admin-orientation-shape admin-orientation-portrait"></div>
              <div>
                <div className="admin-orientation-title">Vertical · 9:16</div>
                <div className="admin-orientation-sub">Estilo reel · ideal para celulares</div>
              </div>
            </button>
            <button
              type="button"
              className={`admin-orientation ${orientation === 'landscape' ? 'selected' : ''}`}
              onClick={() => setOrientation('landscape')}
            >
              <div className="admin-orientation-shape admin-orientation-landscape"></div>
              <div>
                <div className="admin-orientation-title">Horizontal · 16:9</div>
                <div className="admin-orientation-sub">Tour cinematográfico · más ancho</div>
              </div>
            </button>
          </div>
        </div>

        {/* Video — subir archivo */}
        <div className="form-group">
          <label className="form-label">Subir video (MP4)</label>
          {videoUrl && /\.(mp4|webm|mov)/i.test(videoUrl) ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 16px', background: 'var(--bg-3)', border: '1.5px solid #22c55e44' }}>
              <span style={{ color: '#22c55e', fontSize: 18 }}>✓</span>
              <div style={{ flex: 1 }}>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: '#22c55e', letterSpacing: '0.1em' }}>VIDEO CARGADO</div>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--bone-dim)', marginTop: 2 }}>
                  {videoUrl.split('/').pop().split('?')[0]}
                </div>
              </div>
              <button type="button" onClick={() => setVideoUrl('')}
                style={{ background: 'none', border: '1px solid var(--border-strong)', color: 'var(--bone-dim)', padding: '4px 10px', cursor: 'pointer', fontFamily: 'var(--font-mono)', fontSize: 10 }}>
                Quitar
              </button>
            </div>
          ) : (
            <div className="admin-dropzone" style={{ aspectRatio: 'auto', minHeight: 90 }}>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, letterSpacing: '0.1em' }}>SUBIR MP4 · WEBM · MOV</span>
              <input type="file" accept="video/mp4,video/webm,video/quicktime"
                onChange={(e) => uploadFile(e.target.files?.[0], setVideoUrl, 'home-video')}/>
            </div>
          )}
          <div style={{ marginTop: 6, fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--bone-dim)', letterSpacing: '0.05em' }}>
            Recomendado: 1080p · max 30 MB · max 60 seg
          </div>
        </div>

        {/* Video — YouTube / Vimeo */}
        <div className="form-group">
          <label className="form-label">O pegar link de YouTube / Vimeo</label>
          <input type="url" className="form-input"
            placeholder="https://youtu.be/... o https://vimeo.com/..."
            value={/supabase/.test(videoUrl) ? '' : videoUrl}
            disabled={loading}
            onChange={(e) => setVideoUrl(e.target.value)}/>
        </div>

        {videoUrl && (
          <div className="form-group" style={{ marginTop: 16 }}>
            <label className="form-label">Vista previa</label>
            {renderVideoPreview()}
          </div>
        )}

        <div className="form-group">
          <label className="form-label">Imagen de tapa (opcional)</label>
          <div className="admin-dropzone" style={{ aspectRatio: '16/9' }}>
            {posterUrl
              ? <img src={posterUrl} alt="preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }}/>
              : <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, letterSpacing: '0.1em' }}>SUBIR IMAGEN DE TAPA · 16:9</span>}
            <input type="file" accept="image/*"
              onChange={(e) => uploadFile(e.target.files?.[0], setPosterUrl, 'home-poster')}/>
          </div>
          {posterUrl && (
            <button type="button" onClick={() => setPosterUrl('')}
              style={{ marginTop: 8, background: 'none', border: '1px solid var(--border-strong)', color: 'var(--bone-dim)', padding: '4px 12px', cursor: 'pointer', fontFamily: 'var(--font-mono)', fontSize: 10 }}>
              Quitar imagen
            </button>
          )}
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 12, marginTop: 16 }}>
          <button type="submit" className="btn btn-primary" disabled={saving || loading}>
            {saving ? 'Guardando…' : 'Guardar cambios'}
          </button>
        </div>
      </form>
    </div>
  );
}

// Expose to global so App.jsx can reference it as <AdminConfig/>
window.AdminConfig = AdminConfig;
