// components/HomeVideo.jsx — Studio presentation video block
// Reads window.HOME_VIDEO_URL (from site_settings) or shows a placeholder.

function HomeVideo() {
  const [url, setUrl] = React.useState(window.HOME_VIDEO_URL || '');
  const [poster, setPoster] = React.useState(window.HOME_VIDEO_POSTER || '');
  const [orientation, setOrientation] = React.useState(window.HOME_VIDEO_ORIENTATION || 'portrait'); // 'portrait' | 'landscape'
  const [loaded, setLoaded] = React.useState(false);
  const [playing, setPlaying] = React.useState(false);
  const videoRef = React.useRef(null);

  React.useEffect(() => {
    let active = true;
    let timer = null;
    let attempts = 0;

    const loadSettings = async () => {
      if (!window.sb) {
        attempts += 1;
        if (attempts <= 6) {
          timer = window.setTimeout(loadSettings, 400);
          return;
        }
        if (active) setLoaded(true);
        return;
      }

      try {
        const { data } = await window.sb
          .from('site_settings')
          .select('key, value')
          .in('key', ['home_video_url', 'home_video_poster', 'home_video_orientation']);
        const map = Object.fromEntries((data || []).map((r) => [r.key, r.value]));
        const pick = (v) => typeof v === 'string' ? v : (v?.value || '');
        if (map.home_video_url)         setUrl(pick(map.home_video_url));
        if (map.home_video_poster)      setPoster(pick(map.home_video_poster));
        if (map.home_video_orientation) setOrientation(pick(map.home_video_orientation) || 'portrait');
      } catch { /* show placeholder */ }
      finally {
        if (active) setLoaded(true);
      }
    };

    loadSettings();
    return () => {
      active = false;
      if (timer) window.clearTimeout(timer);
    };
  }, []);

  const yt = parseYouTube(url);
  const vimeo = parseVimeo(url);
  const isFile = url && !yt && !vimeo;

  const togglePlay = () => {
    const v = videoRef.current;
    if (!v) return;
    if (v.paused) { v.play(); setPlaying(true); }
    else { v.pause(); setPlaying(false); }
  };

  return (
    <section className={`home-video hv-${orientation === 'landscape' ? 'landscape' : 'portrait'}`}>
      <div className="container">
        <div className="hv-inner">
          <div className="hv-head">
            <div className="hv-eyebrow-row">
              <span className="hv-eyebrow-dot"></span>
              <span>Reel del estudio</span>
            </div>
            <h2 className="hv-title">
              <span>Mirá el </span>
              <span className="yellow">estudio</span>
              <span className="stroke"> por dentro.</span>
            </h2>
            <p className="hv-sub">
              Un tour rápido por el espacio, las máquinas, los trabajos y la gente del Ghetto.
            </p>
          </div>

          <div className="hv-frame-wrap">
            <span className="hv-side-tag">studio tour</span>
            <div className="hv-frame">
              <span className="hv-tape hv-tape-tl"></span>
              <span className="hv-tape hv-tape-tr"></span>

              {loaded && url ? (
                yt ? (
                  <iframe
                    className="hv-iframe"
                    src={`https://www.youtube.com/embed/${yt}?rel=0&modestbranding=1&playsinline=1`}
                    title="El Ghetto — Tour"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                ) : vimeo ? (
                  <iframe
                    className="hv-iframe"
                    src={`https://player.vimeo.com/video/${vimeo}?byline=0&title=0&portrait=0`}
                    title="El Ghetto — Tour"
                    allow="autoplay; fullscreen; picture-in-picture"
                    allowFullScreen
                  />
                ) : (
                  <div className="hv-video-wrap" onClick={togglePlay}>
                    <video
                      ref={videoRef}
                      className="hv-video"
                      src={url}
                      poster={poster || undefined}
                      preload="metadata"
                      playsInline
                      onPlay={() => setPlaying(true)}
                      onPause={() => setPlaying(false)}
                    />
                    {!playing && (
                      <button type="button" className="hv-play" aria-label="Reproducir">
                        <svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>
                        <span>Reproducir</span>
                      </button>
                    )}
                  </div>
                )
              ) : (
                <div className="hv-placeholder">
                  <div className="hv-placeholder-mark">
                    <svg viewBox="0 0 24 24" fill="currentColor">
                      <path d="M8 5v14l11-7z"/>
                    </svg>
                  </div>
                  <div className="hv-placeholder-title">Reel <span className="yellow">próximamente.</span></div>
                  <div className="hv-placeholder-sub">
                    {loaded ? '' : 'Cargando…'}
                  </div>
                </div>
              )}

              <div className="hv-strip">
                <span>● REC</span>
                <span className="hv-strip-mid">EL GHETTO</span>
                <span>00:00</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function parseYouTube(u) {
  if (!u) return null;
  const m = u.match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/|shorts\/))([\w-]{11})/);
  return m ? m[1] : null;
}
function parseVimeo(u) {
  if (!u) return null;
  const m = u.match(/vimeo\.com\/(?:video\/)?(\d+)/);
  return m ? m[1] : null;
}

window.HomeVideo = HomeVideo;
