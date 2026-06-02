// admin/AdminMarketing.jsx — QR para banner del local y difusión

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
    w.document.write(`
      <!DOCTYPE html><html><head><title>QR El Ghetto</title>
      <style>
        * { margin:0; padding:0; box-sizing:border-box; }
        body { background:#0d0d0d; color:#f4f1e8; font-family:sans-serif;
               display:flex; flex-direction:column; align-items:center;
               justify-content:center; min-height:100vh; gap:24px; padding:40px; }
        .title { font-size:48px; font-weight:900; letter-spacing:-.02em; text-transform:uppercase; text-align:center; }
        .title span { color:#ffd60a; }
        img { width:320px; height:320px; }
        .sub { font-size:18px; color:#b9b4a4; text-align:center; letter-spacing:.05em; text-transform:uppercase; }
        .url { font-size:13px; color:#ffd60a; font-family:monospace; margin-top:-8px; }
        @media print { body { background:#fff; color:#000; } .title span { color:#e6a800; } .url { color:#000; } }
      </style></head><body>
      <div class="title">EL <span>GHETTO</span></div>
      <img src="${qrHD}" alt="QR El Ghetto"/>
      <div class="sub">Escaneá y reservá tu turno</div>
      <div class="url">${siteUrl}</div>
      </body></html>
    `);
    w.document.close();
    setTimeout(() => w.print(), 600);
  };

  return (
    <div className="admin-page">
      <AdminPageHead
        eyebrow="General"
        page="general"
        title="Marketing"
        accent="& difusión"
        sub="QR para imprimir en el local, redes o carteles. El cliente escanea y llega directo al sitio."
      />

      {/* ── QR principal ── */}
      <div className="admin-card" style={{ padding: 28, marginBottom: 28 }}>
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--yellow)', letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: 20 }}>
          QR del sitio
        </div>

        <div style={{ display: 'flex', gap: 32, alignItems: 'flex-start', flexWrap: 'wrap' }}>
          {/* QR preview con marco para imprimir */}
          <div style={{
            background: '#ffd60a',
            padding: 12,
            flexShrink: 0,
            boxShadow: '8px 8px 0 var(--bg-3)',
          }}>
            <img src={qrSmall} alt="QR sitio" style={{ display: 'block', width: 220, height: 220 }}/>
            <div style={{
              textAlign: 'center', marginTop: 10, marginBottom: 4,
              fontFamily: 'var(--font-stencil)', fontSize: 11,
              color: '#0d0d0d', letterSpacing: '0.15em', textTransform: 'uppercase',
            }}>
              EL GHETTO · Reservá tu turno
            </div>
          </div>

          {/* Info y acciones */}
          <div style={{ flex: 1, minWidth: 220, display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--bone-dim)', letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: 6 }}>
                URL del sitio
              </div>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--yellow)', wordBreak: 'break-all', background: 'var(--bg-3)', padding: '8px 12px', border: '1px solid var(--border)' }}>
                {siteUrl}
              </div>
            </div>

            <div style={{ fontSize: 13, color: 'var(--bone-dim)', lineHeight: 1.6 }}>
              Imprimí este QR y pegalo en el local, en la vidriera o en el mostrador.
              El cliente lo escanea con la cámara del celular y entra directo al sitio para reservar.
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

      {/* ── Instrucciones ── */}
      <div className="admin-card" style={{ padding: 24 }}>
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--yellow)', letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: 16 }}>
          Cómo usarlo
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16 }}>
          {[
            { num: '01', title: 'Descargá el QR', text: 'Bajá la imagen en alta resolución (1200px) para que quede nítido al imprimir.' },
            { num: '02', title: 'Imprimilo', text: 'Usá "Imprimir cartel" para una hoja lista para llevar a imprenta, o pegá la imagen en un diseño propio.' },
            { num: '03', title: 'Ponelo en el local', text: 'Vidriera, mostrador o espejo del baño. Cualquier lugar visible para el cliente.' },
            { num: '04', title: 'El cliente escanea', text: 'Abre el sitio, puede reservar y también instalar la app en su celular.' },
          ].map((s) => (
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
