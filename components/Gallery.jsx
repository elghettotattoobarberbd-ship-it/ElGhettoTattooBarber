// components/Gallery.jsx
// Tabbed gallery: Tatuajes / Cortes — each with its own filters.
// Layout: polaroid-style cards pinned on a wall (masonry-ish, rotated, with tape).

function Gallery({ density = "regular", onOpen }) {
  const [tab, setTab] = React.useState("tatuajes");
  const [filter, setFilter] = React.useState("todos");
  const [dbStyles, setDbStyles] = React.useState(null); // null = loading
  const [galleryItems, setGalleryItems] = React.useState(null); // null = loading/no db fallback

  // Load styles from Supabase if available
  React.useEffect(() => {
    (async () => {
      if (!window.sb) { setDbStyles({}); return; }
      try {
        const { data } = await window.sb.from('tattoo_styles').select('*').order('sort_order', { ascending: false });
        const grouped = { tatuaje: [], barber: [] };
        (data || []).forEach((s) => {
          if (s.kind === 'barber') grouped.barber.push(s);
          else grouped.tatuaje.push(s);
        });
        setDbStyles(grouped);
      } catch {
        setDbStyles({});
      }
    })();
  }, []);

  React.useEffect(() => {
    (async () => {
      if (!window.sb) {
        setGalleryItems(null);
        return;
      }
      try {
        const { data, error } = await window.sb
          .from('gallery_items')
          .select('*, style:tattoo_styles(slug, label)')
          .eq('is_published', true)
          .eq('is_featured', false)
          .order('sort_order', { ascending: false })
          .order('created_at', { ascending: false });
        if (error) throw error;
        setGalleryItems((data || []).map((item) => ({
          ...item,
          style: item.style?.slug || item.style || '',
          styleLabel: item.style?.label || item.style || '',
        })));
      } catch {
        setGalleryItems([]);
      }
    })();
  }, []);

  // Reset filter when switching tabs
  React.useEffect(() => { setFilter("todos"); }, [tab]);

  const isTat = tab === "tatuajes";
  const tatStyles = (dbStyles && dbStyles.tatuaje && dbStyles.tatuaje.length > 0)
    ? [{ slug: 'todos', label: 'Todos' }, ...dbStyles.tatuaje]
    : TATTOO_STYLES;
  const barStyles = (dbStyles && dbStyles.barber && dbStyles.barber.length > 0)
    ? [{ slug: 'todos', label: 'Todos' }, ...dbStyles.barber]
    : BARBER_STYLES;

  const stylesList = isTat ? tatStyles : barStyles;
  const tattooItems = galleryItems === null ? TATTOO_GALLERY : (galleryItems || []).filter((it) => it.kind === 'tatuaje');
  const barberItems = galleryItems === null ? BARBER_GALLERY : (galleryItems || []).filter((it) => it.kind === 'barber');
  const source = isTat ? tattooItems : barberItems;

  const items = React.useMemo(() => {
    if (filter === "todos") return source;
    return source.filter((g) => g.style === filter);
  }, [filter, source]);

  const styleLabel = (slug, item) => {
    if (item?.styleLabel) return item.styleLabel;
    return (stylesList.find((s) => s.slug === slug) || {}).label || slug || '—';
  };

  const isVideoUrl = (url) => url && /\.(mp4|webm|mov)$/i.test(url);
  const videoAspect = (it) => {
    if (!it || !it.width || !it.height) return '16/9';
    return it.height > it.width ? '9/16' : '16/9';
  };
  const renderTile = (it) => {
    if (it.image_url) {
      if (isVideoUrl(it.image_url)) {
        return (
          <video
            src={it.image_url}
            autoPlay
            muted
            loop
            playsInline
            preload="auto"
            style={{ width: '100%', height: '100%', objectFit: 'cover', background: '#000' }}
          />
        );
      }
      return <img src={it.thumb_url || it.image_url} alt={it.title || ''} loading="lazy" />;
    }
    return isTat
      ? <TattooPlaceholder id={it.id} style={it.style} hue={it.hue} light={it.light}/>
      : <BarberPlaceholder id={it.id} style={it.style} hue={it.hue} light={it.light}/>;
  };

  return (
    <section className="section gallery-section" id="galeria">
      <div className="container">
        {/* TABS */}
        <div className="gallery-tabs">
          <button
            className={`gallery-tab ${tab === "tatuajes" ? "active" : ""}`}
            onClick={() => setTab("tatuajes")}
          >
            <span>Tatuajes</span>
            <span className="count">{tattooItems.length}</span>
          </button>
          <button
            className={`gallery-tab ${tab === "cortes" ? "active" : ""}`}
            onClick={() => setTab("cortes")}
          >
            <span>Cortes</span>
            <span className="count">{barberItems.length}</span>
          </button>
        </div>

        {/* FILTER CHIPS */}
        <div className="gallery-filters">
          {stylesList.map((s) => (
            <button
              key={s.slug}
              className={`filter-chip ${filter === s.slug ? 'active' : ''}`}
              onClick={() => setFilter(s.slug)}
            >
              {s.label}
            </button>
          ))}
        </div>

        {filter !== "todos" && (
          <div style={{
            marginBottom: 24,
            fontFamily: 'var(--font-mono)',
            fontSize: 12,
            letterSpacing: '0.15em',
            color: 'var(--yellow)',
            textTransform: 'uppercase',
          }}>
            {items.length} {items.length === 1 ? 'pieza' : 'piezas'} · {styleLabel(filter)}
          </div>
        )}

        {/* POLAROID WALL */}
        <div className={`polaroid-wall density-${density}`} key={tab + filter}>
          {items.map((it, i) => (
            <article
              key={it.id}
              className="polaroid"
              style={{ '--i': i }}
              onClick={() => onOpen && onOpen({ ...it, _kind: tab })}
            >
              <div className="polaroid-tape"></div>
              <div className="polaroid-image" style={isVideoUrl(it.image_url) ? { aspectRatio: videoAspect(it) } : undefined}>
                {renderTile(it)}
              </div>
              <div className="polaroid-caption">
                <div className="polaroid-title">{it.title}</div>
                <div className="polaroid-meta">
                  <span>{styleLabel(it.style, it)}</span>
                </div>
              </div>
            </article>
          ))}
        </div>

        {items.length === 0 && (
          <div className="empty-state">
            <div className="empty-tag">nada por acá todavía</div>
            <div>Probá con otro estilo o vení a la próxima sesión.</div>
          </div>
        )}
      </div>
    </section>
  );
}

window.Gallery = Gallery;
