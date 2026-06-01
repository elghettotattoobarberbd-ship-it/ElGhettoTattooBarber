// components/Modal.jsx
function GalleryModal({ item, onClose }) {
  React.useEffect(() => {
    const onKey = (e) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [onClose]);

  if (!item) return null;
  const isBarber = item._kind === 'cortes';
  const stylesList = isBarber ? BARBER_STYLES : TATTOO_STYLES;
  const styleLabel = (stylesList.find((s) => s.slug === item.style) || {}).label || item.style || '—';
  const isVideo = item.image_url && /\.(mp4|webm|mov)$/i.test(item.image_url);
  const videoAspect = () => {
    if (!item || !item.width || !item.height) return '16/9';
    return item.height > item.width ? '9/16' : '16/9';
  };
  const tags = Array.isArray(item.tags) ? item.tags.join(', ') : item.tags || '';
  const msg = isBarber
    ? `Hola! Vi este corte "${item.title}" (${styleLabel}). Quiero algo parecido. ¿Hay turno?`
    : `Hola! Me gusta esta pieza "${item.title}" (${styleLabel}). Quiero algo parecido. ¿Hay turno?`;
  const waLink = `https://wa.me/${STUDIO.phoneIntl.replace(/\D/g, '')}?text=${encodeURIComponent(msg)}`;

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-body" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>
          <Icon name="close" size={18}/>
        </button>
        <div className="modal-image" style={isVideo ? { background: '#000', maxHeight: '70vh' } : undefined}>
          {item.image_url ? (
            /\.(mp4|webm|mov)$/i.test(item.image_url) ? (
              <video
                src={item.image_url}
                controls
                muted
                playsInline
                preload="metadata"
                style={{ width: '100%', height: 'auto', maxHeight: '70vh', objectFit: 'contain', background: '#000' }}
              />
            ) : (
              <img src={item.thumb_url || item.image_url} alt={item.title || ''} loading="lazy" />
            )
          ) : (isBarber
              ? <BarberPlaceholder id={item.id} style={item.style} hue={item.hue} light={item.light}/>
              : <TattooPlaceholder id={item.id} style={item.style} hue={item.hue} light={item.light}/>)
          }
        </div>
        <div className="modal-meta">
          <span className="style-tag">{isBarber ? 'Corte' : 'Tattoo'} · {styleLabel}</span>
          <h3>{item.title || (isBarber ? 'Corte del estudio' : 'Pieza del estudio')}</h3>
          {item.caption && (
            <p style={{ color: 'var(--bone-dim)', marginBottom: 24, lineHeight: 1.6 }}>
              {item.caption}
            </p>
          )}

          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
            <a href={waLink} target="_blank" rel="noopener" className="btn btn-primary">
              <Icon name="whatsapp" size={16}/> Quiero algo así
            </a>
            <a href="reservar.html" className="btn btn-ghost">
              Reservar turno
            </a>
          </div>

          <div style={{
            marginTop: 32,
            padding: '16px 20px',
            border: '1.5px solid var(--border-strong)',
            display: 'grid',
            gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
            gap: 12,
            fontFamily: 'var(--font-mono)',
            fontSize: 12,
            letterSpacing: '0.05em',
            textTransform: 'uppercase',
            color: 'var(--bone-dim)',
          }}>
            <div>
              <strong style={{ color: 'var(--bone)' }}>Estilo</strong>
              <div>{styleLabel}</div>
            </div>
            {tags && (
              <div>
                <strong style={{ color: 'var(--bone)' }}>Tags</strong>
                <div>{tags}</div>
              </div>
            )}
            <div>
              <strong style={{ color: 'var(--bone)' }}>Estado</strong>
              <div>{item.is_published ? 'Publicada' : 'Oculta'}</div>
            </div>
            <div>
              <strong style={{ color: 'var(--bone)' }}>Destacada</strong>
              <div>{item.is_featured ? 'Sí' : 'No'}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

window.GalleryModal = GalleryModal;
