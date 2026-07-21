// components/Booking.jsx
function Booking() {
  const [step, setStep] = React.useState(1);

  const [data, setData] = React.useState({
    service:     '',
    style:       '',
    bodyPart:    '',
    size:        '',
    description: '',
    notes:       '',
    name:        '',
    phone:       '',
  });

  const update = (k, v) => setData((d) => ({ ...d, [k]: v }));

  const sequence = data.service === 'barber' ? [1, 4] : [1, 2, 3, 4];
  const TOTAL = sequence.length;
  const page = sequence[step - 1] || 1;

  const canAdvance = {
    1: !!data.service,
    2: data.service === 'barber' ? true : !!data.style,
    3: !!data.description && !!data.bodyPart,
    4: !!data.name && !!data.phone,
  }[page];

  const buildMessage = () => {
    const lines = [
      `Hola! Quiero reservar un turno en El Ghetto 🖤💛`,
      ``,
      `▸ Servicio: ${data.service === 'tatuaje' ? 'Tatuaje' : 'Barbería'}`,
    ];
    if (data.service === 'tatuaje') {
      const style = (STYLES.find((s) => s.slug === data.style) || {}).label;
      lines.push(`▸ Estilo: ${style || data.style}`);
      lines.push(`▸ Zona del cuerpo: ${data.bodyPart}`);
      if (data.size) lines.push(`▸ Tamaño aprox: ${data.size}`);
      lines.push(`▸ Idea: ${data.description}`);
    } else {
      if (data.bodyPart) lines.push(`▸ Detalle: ${data.bodyPart}`);
      if (data.description) lines.push(`▸ Idea / corte: ${data.description}`);
    }
    if (data.notes) lines.push(`▸ Comentario: ${data.notes}`);
    lines.push(``, `Nombre: ${data.name}`, `Teléfono: ${data.phone}`);
    return lines.join('\n');
  };

  const sendWA = async () => {
    if (window.sb) {
      try {
        const descParts = [];
        if (data.description) descParts.push(data.description);
        if (data.notes)       descParts.push(data.notes);

        const { error: insertError } = await window.sb.from('bookings').insert({
          service_type:  data.service              || null,
          client_name:   data.name                 || null,
          client_phone:  data.phone                || null,
          body_part:     data.bodyPart             || null,
          size_cm:       data.size                 || null,
          description:   descParts.join(' — ')     || null,
          status:        'pending',
          whatsapp_sent: true,
        });
        if (insertError) console.warn('Booking insert error:', insertError.message);
      } catch (ex) { console.warn('Booking insert failed:', ex); }
    }
    const msg = buildMessage();
    const url = `https://wa.me/${STUDIO.phoneIntl.replace(/\D/g, '')}?text=${encodeURIComponent(msg)}`;
    window.open(url, '_blank');
    setTimeout(function () { window.showPWABanner?.(); }, 1800);
  };

  const stepHead = (label) => (
    <div className="form-step-head">
      {Array.from({ length: TOTAL }).map((_, i) => {
        const n = i + 1;
        const cls = n < step ? 'done' : n === step ? 'current' : '';
        return <span key={n} className={`step-dot ${cls}`}></span>;
      })}
      <span>Paso {step} de {TOTAL} · {label}</span>
    </div>
  );

  const renderStep1 = () => (
    <React.Fragment>
      {stepHead('Servicio')}
      <h3 className="form-step-title">¿Qué venís a buscar?</h3>
      <div className="option-grid">
        <button type="button" className={`option-card ${data.service === 'tatuaje' ? 'selected' : ''}`} onClick={() => update('service', 'tatuaje')}>
          <Icon name="syringe" size={28}/>
          <div style={{ marginTop: 12, fontSize: 16 }}>Tatuaje</div>
          <div className="option-card-sub">Diseño personalizado con Celeste</div>
        </button>
        <button type="button" className={`option-card ${data.service === 'barber' ? 'selected' : ''}`} onClick={() => update('service', 'barber')}>
          <Icon name="scissors" size={28}/>
          <div style={{ marginTop: 12, fontSize: 16 }}>Barbería</div>
          <div className="option-card-sub">Corte, barba o combo</div>
        </button>
      </div>
    </React.Fragment>
  );

  const renderStep2 = () => (
    <React.Fragment>
      {stepHead(data.service === 'tatuaje' ? 'Estilo' : 'Servicio')}
      {data.service === 'tatuaje' ? (
        <React.Fragment>
          <h3 className="form-step-title">¿Qué estilo querés?</h3>
          <div className="option-grid cols-3">
            {STYLES.filter((s) => s.slug !== 'todos').map((s) => (
              <button type="button" key={s.slug}
                className={`option-card ${data.style === s.slug ? 'selected' : ''}`}
                onClick={() => update('style', s.slug)}>
                {s.label}
              </button>
            ))}
          </div>
        </React.Fragment>
      ) : (
        <React.Fragment>
          <h3 className="form-step-title">¿Qué te hacés?</h3>
          <p style={{ color: 'var(--bone-dim)', marginBottom: 16 }}>
            Contanos qué corte o servicio buscás y coordinamos turno.
          </p>
          <div className="form-group">
            <label className="form-label">Servicio buscado</label>
            <input className="form-input" type="text"
              placeholder="Corte fade, perfilado de barba..."
              value={data.style}
              onChange={(e) => update('style', e.target.value)}/>
          </div>
        </React.Fragment>
      )}
    </React.Fragment>
  );

  const renderStep3 = () => (
    <React.Fragment>
      {stepHead('Detalle')}
      <h3 className="form-step-title">Contanos la idea</h3>

      {data.service === 'tatuaje' && (
        <div className="form-row-2">
          <div className="form-group">
            <label className="form-label">Zona del cuerpo</label>
            <input className="form-input" type="text"
              placeholder="Antebrazo, costilla, pantorrilla..."
              value={data.bodyPart}
              onChange={(e) => update('bodyPart', e.target.value)}/>
          </div>
          <div className="form-group">
            <label className="form-label">Tamaño aproximado</label>
            <input className="form-input" type="text"
              placeholder="10×15 cm"
              value={data.size}
              onChange={(e) => update('size', e.target.value)}/>
          </div>
        </div>
      )}

      {data.service === 'barber' && (
        <div className="form-group">
          <label className="form-label">Detalles del corte/barba</label>
          <input className="form-input" type="text"
            placeholder="Ej: largo arriba, fade a los costados"
            value={data.bodyPart}
            onChange={(e) => update('bodyPart', e.target.value)}/>
        </div>
      )}

      <div className="form-group">
        <label className="form-label">Describí tu idea</label>
        <textarea className="form-textarea"
          placeholder="Lo más detallado posible. Si tenés referencias, mandalas después por WhatsApp."
          value={data.description}
          onChange={(e) => update('description', e.target.value)}/>
      </div>
    </React.Fragment>
  );

  const renderStep4 = () => (
    <React.Fragment>
      {stepHead('Tus datos')}
      <h3 className="form-step-title">¿Cómo te contactamos?</h3>

      <div className="form-group">
        <label className="form-label">Tu nombre</label>
        <input className="form-input" type="text"
          placeholder="Nombre y apellido"
          value={data.name}
          onChange={(e) => update('name', e.target.value)}/>
      </div>
      <div className="form-group">
        <label className="form-label">Teléfono / WhatsApp</label>
        <input className="form-input" type="tel"
          placeholder="3543 XX-XXXX"
          value={data.phone}
          onChange={(e) => update('phone', e.target.value)}/>
      </div>
      <div className="form-group">
        <label className="form-label">Comentario adicional (opcional)</label>
        <textarea className="form-textarea"
          placeholder="Ej: prefiero turno a la tarde, o mando una foto por WhatsApp"
          value={data.notes}
          onChange={(e) => update('notes', e.target.value)}/>
      </div>
      <div style={{ marginTop: 8, padding: 14, background: 'var(--bg-3)', border: '1px solid var(--border-strong)', fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--bone-dim)', letterSpacing: '0.05em', lineHeight: 1.6 }}>
        <span style={{ color: 'var(--yellow)' }}>Fecha y hora</span> se coordinan directamente por WhatsApp una vez que enviés la solicitud.
      </div>
    </React.Fragment>
  );

  return (
    <section className="section" id="reservar">
      <div className="container">
        <div className="booking-wrap" style={{ display: 'block' }}>
          <div className="booking-form">
            {page === 1 && renderStep1()}
            {page === 2 && renderStep2()}
            {page === 3 && renderStep3()}
            {page === 4 && renderStep4()}

            <div className="form-actions">
              {step > 1
                ? <button type="button" className="btn btn-ghost" style={{ padding: '12px 20px', fontSize: 13 }} onClick={() => setStep(step - 1)}>← Volver</button>
                : <span/>}

              {step < TOTAL && (
                <button type="button" className="btn btn-primary"
                  style={{ padding: '12px 20px', fontSize: 13, opacity: canAdvance ? 1 : 0.4, cursor: canAdvance ? 'pointer' : 'not-allowed' }}
                  disabled={!canAdvance}
                  onClick={() => canAdvance && setStep(step + 1)}>
                  Siguiente <Icon name="arrowRight" size={14}/>
                </button>
              )}

              {step === TOTAL && (
                <button type="button" className="btn btn-primary"
                  style={{ padding: '14px 22px', fontSize: 14, opacity: canAdvance ? 1 : 0.4 }}
                  disabled={!canAdvance}
                  onClick={sendWA}>
                  <Icon name="whatsapp" size={16}/> Enviar por WhatsApp
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function SummaryRow({ lbl, val }) {
  return (
    <div className="summary-row">
      <span className="lbl">{lbl}</span>
      <span className={`val ${val ? '' : 'empty'}`}>{val || 'pendiente'}</span>
    </div>
  );
}

window.Booking = Booking;
