// components/LoadingScreen.jsx
function LoadingScreen() {
  const alreadySeen = sessionStorage.getItem('splash_shown');
  const [phase, setPhase] = React.useState('in');
  const [gone,  setGone]  = React.useState(!!alreadySeen);

  React.useEffect(() => {
    if (alreadySeen) return;
    const style = document.createElement('style');
    style.id = 'splash-css';
    style.textContent = `
      @keyframes splashReveal {
        0%   { clip-path: inset(0 100% 0 0); }
        100% { clip-path: inset(0 0%   0 0); }
      }
      @keyframes splashNeedle {
        0%   { left: -3px; opacity: 1; }
        90%  { left: 100%; opacity: 1; }
        100% { left: 100%; opacity: 0; }
      }
      @keyframes splashSub {
        0%   { opacity: 0; transform: translateY(8px); }
        100% { opacity: 1; transform: translateY(0);   }
      }
      @keyframes splashProgress {
        0%   { transform: scaleX(0); }
        100% { transform: scaleX(1); }
      }
      @keyframes splashExit {
        0%   { transform: translateY(0);     }
        100% { transform: translateY(-105%); }
      }
    `;
    document.head.appendChild(style);

    sessionStorage.setItem('splash_shown', '1');
    const t1 = setTimeout(() => setPhase('out'), 1300);
    const t2 = setTimeout(() => setGone(true),   1900);
    return () => {
      clearTimeout(t1); clearTimeout(t2);
      const el = document.getElementById('splash-css');
      if (el) el.remove();
    };
  }, []);

  if (gone) return null;

  const isOut = phase === 'out';

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 9999,
      background: '#0d0d0d',
      display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center',
      overflow: 'hidden',
      animation: isOut ? 'splashExit 600ms cubic-bezier(0.76,0,0.24,1) forwards' : 'none',
      pointerEvents: isOut ? 'none' : 'all',
    }}>

      {/* Logo */}
      <div style={{ position: 'relative', display: 'inline-block' }}>
        <div style={{
          fontFamily: "'Pirata One', serif",
          fontSize: 'clamp(56px, 16vw, 128px)',
          color: '#f5c518',
          lineHeight: 0.9,
          textTransform: 'uppercase',
          letterSpacing: '0.04em',
          userSelect: 'none',
          animation: 'splashReveal 0.55s cubic-bezier(0.76,0,0.24,1) 0.15s both',
        }}>
          El Ghetto
        </div>

        {/* Aguja */}
        <div style={{
          position: 'absolute', top: '-4px', bottom: '-4px', width: '3px',
          background: '#f5c518',
          boxShadow: '0 0 14px #f5c518, 0 0 5px #f5c518cc',
          animation: 'splashNeedle 0.55s cubic-bezier(0.76,0,0.24,1) 0.15s both',
        }}/>
      </div>

      {/* Subtítulo */}
      <div style={{
        fontFamily: "'JetBrains Mono', monospace",
        fontSize: 'clamp(9px, 1.6vw, 11px)',
        color: '#444',
        letterSpacing: '0.42em',
        textTransform: 'uppercase',
        marginTop: 18,
        animation: 'splashSub 0.35s ease 0.6s both',
      }}>
        TATTOO&nbsp;·&nbsp;BARBER&nbsp;·&nbsp;CÓRDOBA
      </div>

      {/* Barra de progreso */}
      <div style={{
        position: 'absolute', bottom: 0, left: 0, right: 0, height: 2,
        background: '#1a1a1a',
      }}>
        <div style={{
          height: '100%', background: '#f5c518',
          transformOrigin: 'left center',
          animation: 'splashProgress 1.2s cubic-bezier(0.4,0,0.2,1) 0.1s both',
        }}/>
      </div>

    </div>
  );
}

window.LoadingScreen = LoadingScreen;
