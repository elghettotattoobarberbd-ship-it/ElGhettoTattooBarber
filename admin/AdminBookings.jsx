// admin/AdminBookings.jsx — Turnos recibidos

const BOOKING_STATUSES = [
  { value: 'pending',   label: 'Pendiente',  color: '#f5c518' },
  { value: 'contacted', label: 'Contactado', color: '#4da6ff' },
  { value: 'booked',    label: 'Confirmado', color: '#4caf50' },
  { value: 'done',      label: 'Realizado',  color: '#888'    },
  { value: 'cancelled', label: 'Cancelado',  color: '#e25c5c' },
];

function statusMeta(val) {
  return BOOKING_STATUSES.find((s) => s.value === val) || BOOKING_STATUSES[0];
}

function AdminReservas() {
  const [items,   setItems]   = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [error,   setError]   = React.useState('');
  const [filter,  setFilter]  = React.useState('all');
  const [detail,  setDetail]  = React.useState(null);
  const isReady = !!window.sb;

  const load = React.useCallback(async () => {
    setLoading(true); setError('');
    if (!isReady) { setItems([]); setLoading(false); return; }
    try {
      const { data, error } = await window.sb
        .from('bookings').select('*')
        .order('created_at', { ascending: false });
      if (error) throw error;
      setItems(data || []);
    } catch (e) {
      setError((e && e.message) || 'No se pudieron cargar los turnos.');
    } finally { setLoading(false); }
  }, [isReady]);

  React.useEffect(() => { load(); }, [load]);

  const changeStatus = async (id, status) => {
    const { error } = await window.sb.from('bookings').update({ status }).eq('id', id);
    if (error) { alert(error.message); return; }
    setItems((xs) => xs.map((x) => x.id === id ? { ...x, status } : x));
    if (detail && detail.id === id) setDetail((d) => ({ ...d, status }));
  };

  const remove = async (id) => {
    if (!window.confirm('Borrar este turno?')) return;
    const { error } = await window.sb.from('bookings').delete().eq('id', id);
    if (error) { alert(error.message); return; }
    setItems((xs) => xs.filter((x) => x.id !== id));
    if (detail && detail.id === id) setDetail(null);
  };

  const waLink = (b) => {
    const phone = (b.client_phone || '').replace(/\D/g, '');
    const msg   = 'Hola ' + (b.client_name || '') + '! Te contactamos desde El Ghetto por tu solicitud de turno.';
    return 'https://wa.me/' + phone + '?text=' + encodeURIComponent(msg);
  };

  const fmtDate = (iso) => {
    if (!iso) return '';
    return new Date(iso).toLocaleDateString('es-AR', { day: '2-digit', month: 'short', year: 'numeric' })
      + ' ' + new Date(iso).toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit' });
  };

  const counts = React.useMemo(() => {
    const c = { all: items.length };
    BOOKING_STATUSES.forEach((s) => { c[s.value] = items.filter((b) => b.status === s.value).length; });
    return c;
  }, [items]);

  const filtered = filter === 'all' ? items : items.filter((b) => b.status === filter);

  return (
    <div className="admin-page">
      <AdminPageHead
        eyebrow="Reservar"
        page="reservar"
        title="Turnos"
        accent="recibidos"
        sub="Pedidos enviados desde el formulario del sitio."
        actions={
          <button className="btn btn-ghost" style={{ fontSize: 13 }} onClick={load}>
            Actualizar
          </button>
        }
      />

      {!isReady && (
        <div className="admin-banner admin-banner-warn" style={{ marginBottom: 24 }}>
          Conecta Supabase para ver los turnos reales.
        </div>
      )}
      {error && <div className="admin-banner admin-banner-err" style={{ marginBottom: 16 }}>{error}</div>}

      {/* Filtros */}
      <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 24 }}>
        {[{ value: 'all', label: 'Todos', color: 'var(--bone)' }, ...BOOKING_STATUSES].map((s) => {
          const active = filter === s.value;
          const cnt    = counts[s.value] || 0;
          return (
            <button key={s.value} onClick={() => setFilter(s.value)} style={{
              padding: '6px 14px', border: '1.5px solid',
              borderColor: active ? s.color : 'var(--border-strong)',
              background:  active ? s.color + '18' : 'transparent',
              color:       active ? s.color : 'var(--bone-dim)',
              fontFamily:  'var(--font-mono)', fontSize: 11,
              letterSpacing: '0.12em', textTransform: 'uppercase',
              cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6,
              transition: 'all 120ms',
            }}>
              {s.label}
              {cnt > 0 && (
                <span style={{
                  background: active ? s.color : 'var(--bg-3)',
                  color: active ? 'var(--ink)' : 'var(--bone-dim)',
                  borderRadius: 99, padding: '1px 7px', fontSize: 10, fontWeight: 700,
                }}>
                  {cnt}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {loading ? (
        <div className="admin-empty">Cargando...</div>
      ) : filtered.length === 0 ? (
        <div className="admin-empty">
          <div className="admin-empty-tag">sin turnos</div>
          <p>{filter === 'all' ? 'Aun no hay solicitudes de turno.' : 'No hay turnos con este estado.'}</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {filtered.map((b) => {
            const st      = statusMeta(b.status);
            const isTatoo = b.service_type === 'tatuaje';
            return (
              <article key={b.id} onClick={() => setDetail(b)} style={{
                background: 'var(--bg-2)',
                border: '1.5px solid var(--border)',
                borderLeft: '4px solid ' + st.color,
                cursor: 'pointer',
                display: 'grid',
                gridTemplateColumns: '1fr auto',
                gap: 0,
                overflow: 'hidden',
                transition: 'border-color 120ms',
              }}>
                {/* Info principal */}
                <div style={{ padding: '16px 20px' }}>
                  {/* Fila 1: nombre + badges */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap', marginBottom: 8 }}>
                    <span style={{ fontFamily: 'var(--font-stencil)', fontSize: 16, textTransform: 'uppercase', letterSpacing: '0.02em' }}>
                      {b.client_name || 'Sin nombre'}
                    </span>
                    <span style={{
                      fontFamily: 'var(--font-mono)', fontSize: 10, letterSpacing: '0.15em',
                      padding: '2px 8px', textTransform: 'uppercase',
                      background: isTatoo ? 'rgba(245,197,24,.12)' : 'rgba(77,166,255,.1)',
                      color: isTatoo ? 'var(--yellow)' : '#4da6ff',
                      border: '1px solid ' + (isTatoo ? 'rgba(245,197,24,.3)' : 'rgba(77,166,255,.3)'),
                    }}>
                      {isTatoo ? 'Tatuaje' : 'Barberia'}
                    </span>
                    <span style={{
                      fontFamily: 'var(--font-mono)', fontSize: 10, letterSpacing: '0.12em',
                      padding: '2px 8px', textTransform: 'uppercase',
                      background: st.color + '18', color: st.color,
                      border: '1px solid ' + st.color + '44',
                    }}>
                      {st.label}
                    </span>
                  </div>

                  {/* Fila 2: datos clave */}
                  <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', marginBottom: b.description ? 8 : 0 }}>
                    {b.client_phone && (
                      <span style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--bone)', display: 'flex', alignItems: 'center', gap: 5 }}>
                        <Icon name="whatsapp" size={12}/> {b.client_phone}
                      </span>
                    )}
                    {b.body_part && (
                      <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--bone-dim)' }}>
                        {b.body_part}
                      </span>
                    )}
                    {b.size_cm && (
                      <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--bone-dim)' }}>
                        {b.size_cm}
                      </span>
                    )}
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--bone-dim)', marginLeft: 'auto' }}>
                      {fmtDate(b.created_at)}
                    </span>
                  </div>

                  {/* Descripcion */}
                  {b.description && (
                    <div style={{ fontSize: 13, color: 'var(--bone-dim)', lineHeight: 1.5, marginTop: 4,
                      display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                      {b.description}
                    </div>
                  )}
                </div>

                {/* Acciones */}
                <div onClick={(e) => e.stopPropagation()} style={{
                  borderLeft: '1px solid var(--border)',
                  display: 'flex', flexDirection: 'column', minWidth: 52,
                }}>
                  <a href={waLink(b)} target="_blank" rel="noopener"
                    title="Contactar por WhatsApp"
                    style={{
                      flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center',
                      background: 'rgba(37,211,102,.1)', color: '#25d366',
                      borderBottom: '1px solid var(--border)', textDecoration: 'none',
                      transition: 'background 120ms', padding: '0 16px',
                    }}>
                    <Icon name="whatsapp" size={18}/>
                  </a>
                  <button title="Borrar" onClick={() => remove(b.id)} style={{
                    flex: 1, background: 'transparent', border: 'none', cursor: 'pointer',
                    color: 'var(--bone-dim)', display: 'flex', alignItems: 'center', justifyContent: 'center',
                    padding: '0 16px', transition: 'color 120ms',
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.color = '#e25c5c'}
                  onMouseLeave={(e) => e.currentTarget.style.color = 'var(--bone-dim)'}>
                    <Icon name="close" size={15}/>
                  </button>
                </div>
              </article>
            );
          })}
        </div>
      )}

      {detail && (
        <BookingDetail
          booking={detail}
          onClose={() => setDetail(null)}
          onStatusChange={(s) => changeStatus(detail.id, s)}
          onDelete={() => { remove(detail.id); setDetail(null); }}
          waLink={waLink(detail)}
          fmtDate={fmtDate}
        />
      )}
    </div>
  );
}

function BookingDetail({ booking: b, onClose, onStatusChange, onDelete, waLink, fmtDate }) {
  const st = statusMeta(b.status);
  const isTatoo = b.service_type === 'tatuaje';

  return (
    <div className="admin-modal-backdrop" onClick={onClose}>
      <div className="admin-modal" style={{ maxWidth: 500 }} onClick={(e) => e.stopPropagation()}>
        <button className="admin-modal-close" onClick={onClose}><Icon name="close" size={16}/></button>

        <header className="admin-modal-head" style={{ borderBottom: '3px solid ' + st.color }}>
          <div className="eyebrow" style={{ color: st.color }}>{st.label}</div>
          <h2 style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            {b.client_name || 'Sin nombre'}
            <span style={{
              fontFamily: 'var(--font-mono)', fontSize: 11, letterSpacing: '0.15em',
              padding: '3px 10px', textTransform: 'uppercase', fontStyle: 'normal',
              background: isTatoo ? 'rgba(245,197,24,.12)' : 'rgba(77,166,255,.1)',
              color: isTatoo ? 'var(--yellow)' : '#4da6ff',
            }}>
              {isTatoo ? 'Tatuaje' : 'Barberia'}
            </span>
          </h2>
        </header>

        <div style={{ padding: '20px 24px 24px', display: 'flex', flexDirection: 'column', gap: 12 }}>

          {/* Cambiar estado */}
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
            {BOOKING_STATUSES.map((s) => (
              <button key={s.value} onClick={() => onStatusChange(s.value)} style={{
                padding: '5px 12px', border: '1.5px solid',
                borderColor: b.status === s.value ? s.color : 'var(--border-strong)',
                background: b.status === s.value ? s.color + '22' : 'transparent',
                color: b.status === s.value ? s.color : 'var(--bone-dim)',
                fontFamily: 'var(--font-mono)', fontSize: 10, letterSpacing: '0.12em',
                textTransform: 'uppercase', cursor: 'pointer', transition: 'all 120ms',
              }}>
                {s.label}
              </button>
            ))}
          </div>

          <hr style={{ border: 'none', borderTop: '1px solid var(--border)' }}/>

          {/* Datos */}
          <BookingRow icon="whatsapp" label="Telefono"    value={b.client_phone}/>
          <BookingRow icon="syringe"  label="Servicio"    value={isTatoo ? 'Tatuaje' : 'Barberia'}/>
          <BookingRow icon="mapPin"   label="Zona"        value={b.body_part}/>
          <BookingRow icon="grid"     label="Tamano"      value={b.size_cm}/>
          <BookingRow icon="mail"     label="Descripcion" value={b.description} multiline/>
          <BookingRow icon="clock"    label="Recibido"    value={fmtDate(b.created_at)}/>

          <hr style={{ border: 'none', borderTop: '1px solid var(--border)' }}/>

          {/* Acciones */}
          <div style={{ display: 'flex', gap: 10 }}>
            <a href={waLink} target="_blank" rel="noopener" className="btn btn-primary" style={{ flex: 1, justifyContent: 'center', gap: 8 }}>
              <Icon name="whatsapp" size={16}/> Contactar por WhatsApp
            </a>
            <button onClick={onDelete} style={{
              padding: '10px 16px', background: 'transparent',
              border: '1.5px solid var(--border-strong)', color: 'var(--bone-dim)',
              cursor: 'pointer', transition: 'all 120ms',
            }}
            onMouseEnter={(e) => { e.currentTarget.style.borderColor = '#e25c5c'; e.currentTarget.style.color = '#e25c5c'; }}
            onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'var(--border-strong)'; e.currentTarget.style.color = 'var(--bone-dim)'; }}>
              <Icon name="close" size={15}/>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function BookingRow({ icon, label, value, multiline }) {
  if (!value) return null;
  return (
    <div style={{ display: 'flex', gap: 12, alignItems: multiline ? 'flex-start' : 'center' }}>
      <div style={{ width: 28, display: 'flex', justifyContent: 'center', flexShrink: 0, paddingTop: multiline ? 2 : 0, color: 'var(--yellow)' }}>
        <Icon name={icon} size={14}/>
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: 9, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--bone-dim)', marginBottom: 2 }}>
          {label}
        </div>
        <div style={{ fontSize: 14, lineHeight: 1.5, whiteSpace: multiline ? 'pre-wrap' : 'normal', wordBreak: 'break-word' }}>
          {value}
        </div>
      </div>
    </div>
  );
}

Object.assign(window, { AdminReservas });
