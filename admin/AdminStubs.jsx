// admin/AdminStubs.jsx — Placeholder sections to be fleshed out
const WEEKDAYS = [
  { value: 0, label: 'Domingo' },
  { value: 1, label: 'Lunes' },
  { value: 2, label: 'Martes' },
  { value: 3, label: 'Miércoles' },
  { value: 4, label: 'Jueves' },
  { value: 5, label: 'Viernes' },
  { value: 6, label: 'Sábado' },
];

function AdminHorarios() {
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
        .from('hours')
        .select('*')
        .order('weekday', { ascending: true })
        .order('open_time', { ascending: true });
      if (error) throw error;
      setItems(data || []);
    } catch (e) {
      setError(e.message || 'No se pudieron cargar los horarios.');
      setItems([]);
    } finally {
      setLoading(false);
    }
  }, [isReady]);

  React.useEffect(() => { load(); }, [load]);

  const gridMap = React.useMemo(() => {
    const map = {};
    items.forEach((item) => {
      if (item.is_closed) return;
      const from = item.open_time?.slice(0, 5);
      const to = item.close_time?.slice(0, 5);
      if (!from || !to) return;
      const start = Number(from.split(':')[0]);
      const end = Number(to.split(':')[0]);
      if (end - start !== 1) return;
      map[`${item.weekday}-${start}`] = item;
    });
    return map;
  }, [items]);

  const daySummary = React.useMemo(() => {
    return WEEKDAYS.map((day) => {
      const dayItems = items.filter((item) => Number(item.weekday) === day.value);
      const isClosed = dayItems.some((item) => item.is_closed);
      const openItems = dayItems.filter((item) => !item.is_closed && item.open_time && item.close_time);
      if (isClosed && !openItems.length) {
        return { ...day, title: 'Cerrado', details: [] };
      }
      if (!openItems.length) {
        return { ...day, title: 'Sin horario', details: [] };
      }
      return {
        ...day,
        title: openItems.map((item) => `${item.open_time.slice(0, 5)} - ${item.close_time.slice(0, 5)}`).join(', '),
        details: openItems,
      };
    });
  }, [items]);

  const remove = async (id) => {
    if (!window.confirm('¿Borrar este bloque de horario?')) return;
    const { error } = await window.sb.from('hours').delete().eq('id', id);
    if (error) { alert(error.message); return; }
    setItems((xs) => xs.filter((x) => x.id !== id));
  };

  return (
    <div className="admin-page">
      <AdminPageHead
        eyebrow="Horarios"
        page="contacto"
        title="Horarios"
        accent="de atención"
        sub="Gestioná disponibilidad por hora para que el cliente elija turno exacto en reservar."
        actions={
          <button className="btn btn-primary" onClick={() => setEditing('new')}>
            + Nuevo bloque
          </button>
        }
      />

      {!isReady && (
        <div className="admin-banner admin-banner-warn" style={{ marginBottom: 24 }}>
          Conectá Supabase para empezar a gestionar los horarios.
        </div>
      )}

      {error && <div className="admin-banner admin-banner-err" style={{ marginBottom: 16 }}>{error}</div>}

      <div className="admin-card" style={{ marginBottom: 24, padding: 20 }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 12, marginBottom: 12 }}>
          <div style={{ fontWeight: 600 }}>Días disponibles y franjas</div>
          <span style={{ color: 'var(--bone-dim)' }}>
            En el modal cargá la franja del día: por ejemplo 8:00-14:00 y luego 18:00-22:00 para marcar el descanso entre medio.
          </span>
        </div>
      </div>

      {loading ? (
        <div className="admin-empty">Cargando…</div>
      ) : (
        <div>
          <div className="admin-card" style={{ marginBottom: 24, padding: 20 }}>
            {daySummary.map((day) => (
              <div key={day.value} style={{ display: 'flex', flexDirection: 'column', gap: 4, padding: '10px 0', borderBottom: '1px solid rgba(255,255,255,.08)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12 }}>
                  <strong>{day.label}</strong>
                  <span style={{ color: 'var(--bone-dim)' }}>{day.title}</span>
                </div>
                {day.details.length > 0 && (
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, color: 'var(--bone-dim)', fontSize: 13 }}>
                    {day.details.map((block, index) => (
                      <span key={index}>{block.open_time.slice(0, 5)} - {block.close_time.slice(0, 5)}</span>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>

          {items.length === 0 ? (
            <div className="admin-empty">
              <div className="admin-empty-tag">sin bloques</div>
              <p>Agregá bloques para que el sitio sepa qué días están disponibles.</p>
            </div>
          ) : (
            <div className="admin-faq-list">
              {items.map((item) => (
                <article key={item.id} className="admin-faq-row">
                  <div className="admin-faq-info">
                    <div className="admin-faq-q">
                      {WEEKDAYS.find((d) => d.value === item.weekday)?.label || item.weekday}
                      {item.block_label ? ` · ${item.block_label}` : ''}
                    </div>
                    <div className="admin-faq-a">
                      {item.is_closed
                        ? 'Cerrado'
                        : `${item.open_time || '—'} – ${item.close_time || '—'}`}
                    </div>
                  </div>
                  <div className="admin-style-order" style={{ gap: 8 }}>
                    <span style={{ display: 'block' }}>{item.is_closed ? 'cerrado' : 'abierto'}</span>
                    {!item.is_closed && (
                      <span style={{ display: 'block' }}>{item.capacity || 1} turno{(item.capacity || 1) === 1 ? '' : 's'}</span>
                    )}
                  </div>
                  <div className="admin-style-actions">
                    <button onClick={() => setEditing(item)} title="Editar"><Icon name="syringe" size={14}/></button>
                    <button onClick={() => remove(item.id)} title="Borrar" className="danger"><Icon name="close" size={14}/></button>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      )}

      {editing && (
        <HourEditor
          item={editing === 'new' ? null : editing}
          onClose={() => setEditing(null)}
          onSaved={() => { setEditing(null); load(); }}
        />
      )}
    </div>
  );
}

function HourEditor({ item, onClose, onSaved }) {
  const isNew = !item;
  const [weekday, setWeekday] = React.useState(item?.weekday ?? 1);
  const [openTime, setOpenTime] = React.useState(item?.open_time || '');
  const [closeTime, setCloseTime] = React.useState(item?.close_time || '');
  const [capacity, setCapacity] = React.useState(item?.capacity ?? 1);
  const [blockLabel, setBlockLabel] = React.useState(item?.block_label || '');
  const [isClosed, setClosed] = React.useState(item?.is_closed ?? false);
  const [busy, setBusy] = React.useState(false);
  const [err, setErr] = React.useState('');

  const save = async (e) => {
    e.preventDefault();
    setErr('');
    if (!window.sb) { setErr('Supabase no configurado.'); return; }
    if (!isClosed && (!openTime || !closeTime)) {
      setErr('Completá la hora de apertura y cierre, o marcá como cerrado.');
      return;
    }
    if (!isClosed && Number(capacity) < 1) {
      setErr('La cantidad de barberos debe ser al menos 1.');
      return;
    }
    setBusy(true);
    try {
      const payload = {
        weekday: Number(weekday),
        open_time: isClosed ? null : openTime || null,
        close_time: isClosed ? null : closeTime || null,
        capacity: isClosed ? null : Number(capacity) || 1,
        block_label: blockLabel || null,
        is_closed: !!isClosed,
      };
      if (isNew) {
        const { error } = await window.sb.from('hours').insert(payload);
        if (error) throw error;
      } else {
        const { error } = await window.sb.from('hours').update(payload).eq('id', item.id);
        if (error) throw error;
      }
      onSaved();
    } catch (e) {
      setErr(e.message || 'Error guardando.');
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="admin-modal-backdrop" onClick={onClose}>
      <div className="admin-modal" style={{ maxWidth: 560 }} onClick={(e) => e.stopPropagation()}>
        <button className="admin-modal-close" onClick={onClose}><Icon name="close" size={16}/></button>
        <header className="admin-modal-head">
          <div className="eyebrow">{isNew ? 'Nuevo' : 'Editar'} bloque</div>
          <h2>{isNew ? 'Agregar horario' : 'Editar horario'}</h2>
        </header>

        <form onSubmit={save} className="admin-form" style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
          <div className="form-row-2">
            <div className="form-group">
              <label className="form-label">Día</label>
              <select className="form-input" value={weekday} onChange={(e) => setWeekday(e.target.value)}>
                {WEEKDAYS.map((d) => (
                  <option key={d.value} value={d.value}>{d.label}</option>
                ))}
              </select>
            </div>
            <div className="form-group" style={{ alignSelf: 'flex-end' }}>
              <label className="admin-check">
                <input type="checkbox" checked={isClosed} onChange={(e) => setClosed(e.target.checked)} />
                <span>Cerrado</span>
              </label>
            </div>
          </div>

          {!isClosed && (
            <>
              <div style={{ marginBottom: 12, color: 'var(--bone-dim)', fontSize: 13 }}>
                Si el mismo día tiene pausa entre turnos, cargá una franja primero y después otra para ese mismo día.
              </div>
              <div className="form-row-2">
                <div className="form-group">
                  <label className="form-label">Apertura</label>
                  <input className="form-input" type="time" value={openTime} onChange={(e) => setOpenTime(e.target.value)} />
                </div>
                <div className="form-group">
                  <label className="form-label">Cierre</label>
                  <input className="form-input" type="time" value={closeTime} onChange={(e) => setCloseTime(e.target.value)} />
                </div>
              </div>

              <div className="form-row-2">
                <div className="form-group">
                  <label className="form-label">Barberos disponibles</label>
                  <input
                    className="form-input"
                    type="number"
                    min="1"
                    value={capacity}
                    onChange={(e) => setCapacity(Number(e.target.value) || 1)}
                  />
                </div>
              </div>
            </>
          )}

          <div className="form-group">
            <label className="form-label">Etiqueta</label>
            <input
              className="form-input"
              value={blockLabel}
              onChange={(e) => setBlockLabel(e.target.value)}
              placeholder="mañana / tarde / turno 1"
            />
          </div>

          {err && <div className="admin-banner admin-banner-err">{err}</div>}

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 12, marginTop: 12 }}>
            <button type="button" className="btn btn-ghost" onClick={onClose}>Cancelar</button>
            <button type="submit" className="btn btn-primary" disabled={busy}>
              {busy ? 'Guardando…' : (isNew ? 'Guardar bloque' : 'Guardar cambios')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

Object.assign(window, { AdminHorarios });

// ── Marketing / QR ──────────────────────────────────────────────
function AdminMarketing() {
  const siteUrl = window.location.origin + '/';
  const qrSmall = 'https://api.qrserver.com/v1/create-qr-code/?size=220x220&color=0d0d0d&bgcolor=ffd60a&data=' + encodeURIComponent(siteUrl);
  const qrHD    = 'https://api.qrserver.com/v1/create-qr-code/?size=1200x1200&color=0d0d0d&bgcolor=ffd60a&data=' + encodeURIComponent(siteUrl);

  const download = async (src, filename) => {
    try {
      const res  = await fetch(src);
      const blob = await res.blob();
      const url  = URL.createObjectURL(blob);
      const a    = document.createElement('a');
      a.href = url; a.download = filename; a.click();
      URL.revokeObjectURL(url);
    } catch (e) {
      alert('No se pudo descargar. Intentá de nuevo.');
    }
  };

  const print = () => {
    const w = window.open('', '_blank');
    const css = '* {margin:0;padding:0;box-sizing:border-box}'
      + 'body{background:#0d0d0d;color:#f4f1e8;font-family:sans-serif;display:flex;flex-direction:column;align-items:center;justify-content:center;min-height:100vh;gap:24px;padding:40px}'
      + '.t{font-size:48px;font-weight:900;text-transform:uppercase;text-align:center}'
      + '.t span{color:#ffd60a}'
      + 'img{width:320px;height:320px}'
      + '.s{font-size:18px;color:#b9b4a4;text-align:center;letter-spacing:.05em;text-transform:uppercase}'
      + '.u{font-size:13px;color:#ffd60a;font-family:monospace}';
    const html = '<!DOCTYPE html><html><head><title>QR El Ghetto</title><style>' + css + '</style></head><body>'
      + '<div class="t">EL <span>GHETTO</span></div>'
      + '<img src="' + qrHD + '" alt="QR"/>'
      + '<div class="s">Escaneá y reservá tu turno</div>'
      + '<div class="u">' + siteUrl + '</div>'
      + '</body></html>';
    w.document.write(html);
    w.document.close();
    setTimeout(function() { w.print(); }, 600);
  };

  const steps = [
    { num: '01', title: 'Descargá el QR',    text: 'Bajá la imagen en alta resolución (1200px) para que quede nítido al imprimir.' },
    { num: '02', title: 'Imprimilo',          text: 'Usá "Imprimir cartel" para una hoja lista para imprenta, o pegá la imagen en un diseño propio.' },
    { num: '03', title: 'Ponelo en el local', text: 'Vidriera, mostrador o espejo. Cualquier lugar visible para el cliente.' },
    { num: '04', title: 'El cliente escanea', text: 'Abre el sitio, puede reservar e instalar la app en su celular.' },
  ];

  return (
    <div className="admin-page">
      <AdminPageHead
        eyebrow="General"
        page="general"
        title="Marketing"
        accent="& difusión"
        sub="QR para imprimir en el local, redes o carteles. El cliente escanea y llega directo al sitio."
      />

      <div className="admin-card" style={{ padding: 28, marginBottom: 28 }}>
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--yellow)', letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: 20 }}>
          QR del sitio
        </div>
        <div style={{ display: 'flex', gap: 32, alignItems: 'flex-start', flexWrap: 'wrap' }}>
          <div style={{ background: '#ffd60a', padding: 12, flexShrink: 0, boxShadow: '8px 8px 0 var(--bg-3)' }}>
            <img src={qrSmall} alt="QR sitio" style={{ display: 'block', width: 220, height: 220 }}/>
            <div style={{ textAlign: 'center', marginTop: 10, marginBottom: 4, fontFamily: 'var(--font-stencil)', fontSize: 11, color: '#0d0d0d', letterSpacing: '0.15em', textTransform: 'uppercase' }}>
              EL GHETTO · Reservá tu turno
            </div>
          </div>
          <div style={{ flex: 1, minWidth: 220, display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--bone-dim)', letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: 6 }}>URL del sitio</div>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--yellow)', wordBreak: 'break-all', background: 'var(--bg-3)', padding: '8px 12px', border: '1px solid var(--border)' }}>
                {siteUrl}
              </div>
            </div>
            <div style={{ fontSize: 13, color: 'var(--bone-dim)', lineHeight: 1.6 }}>
              Imprimí este QR y pegalo en el local, en la vidriera o en el mostrador. El cliente lo escanea y entra directo al sitio para reservar.
            </div>
            <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
              <button className="btn btn-primary" style={{ fontSize: 12, padding: '10px 18px' }}
                onClick={() => download(qrHD, 'qr-elghetto-1200px.png')}>
                Descargar QR (alta resolución)
              </button>
              <button className="btn btn-ghost" style={{ fontSize: 12, padding: '10px 18px' }}
                onClick={print}>
                Imprimir cartel →
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="admin-card" style={{ padding: 24 }}>
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--yellow)', letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: 16 }}>
          Cómo usarlo
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16 }}>
          {steps.map((s) => (
            <div key={s.num} style={{ background: 'var(--bg-3)', padding: '16px 18px', borderLeft: '3px solid var(--yellow)' }}>
              <div style={{ fontFamily: 'var(--font-stencil)', fontSize: 20, color: 'var(--yellow)', marginBottom: 6 }}>{s.num}</div>
              <div style={{ fontFamily: 'var(--font-stencil)', fontSize: 12, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 6 }}>{s.title}</div>
              <div style={{ fontSize: 12, color: 'var(--bone-dim)', lineHeight: 1.55 }}>{s.text}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

Object.assign(window, { AdminMarketing });
