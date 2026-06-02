// components/Graffiti.jsx — SVG decorative helpers + iconography
// All icons inherit currentColor and use 2px strokes.

function Icon({ name, size = 20, ...rest }) {
  const s = size;
  const stroke = { stroke: 'currentColor', strokeWidth: 2, strokeLinecap: 'round', strokeLinejoin: 'round', fill: 'none' };
  const map = {
    arrowRight: <svg width={s} height={s} viewBox="0 0 24 24" {...stroke}><path d="M5 12h14M13 5l7 7-7 7"/></svg>,
    arrowDown: <svg width={s} height={s} viewBox="0 0 24 24" {...stroke}><path d="M12 5v14M5 12l7 7 7-7"/></svg>,
    whatsapp: <svg width={s} height={s} viewBox="0 0 24 24" fill="currentColor"><path d="M17.5 14.4c-.3-.1-1.7-.8-2-.9-.3-.1-.5-.1-.7.2-.2.3-.7.9-.9 1.1-.2.2-.3.2-.6.1-.3-.1-1.2-.4-2.3-1.4-.8-.7-1.4-1.7-1.6-2-.2-.3 0-.5.1-.6.1-.1.3-.3.4-.5.1-.2.2-.3.3-.5.1-.2 0-.4 0-.5 0-.1-.7-1.7-1-2.3-.3-.6-.5-.5-.7-.5h-.6c-.2 0-.5.1-.8.4-.3.3-1 1-1 2.4 0 1.4 1 2.7 1.2 2.9.2.2 2 3 4.8 4.2.7.3 1.2.5 1.6.6.7.2 1.3.2 1.8.1.5-.1 1.7-.7 1.9-1.4.2-.7.2-1.2.2-1.4-.1-.1-.3-.2-.6-.3zM12 2C6.5 2 2 6.5 2 12c0 1.8.5 3.5 1.3 5L2 22l5.2-1.3c1.4.8 3.1 1.3 4.8 1.3 5.5 0 10-4.5 10-10S17.5 2 12 2zm0 18c-1.6 0-3.1-.4-4.4-1.2l-.3-.2-3.2.8.9-3.1-.2-.3C3.9 14.7 3.5 13.4 3.5 12 3.5 7.3 7.3 3.5 12 3.5S20.5 7.3 20.5 12 16.7 20.5 12 20.5z"/></svg>,
    instagram: <svg width={s} height={s} viewBox="0 0 24 24" {...stroke}><rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r="1" fill="currentColor"/></svg>,
    mapPin: <svg width={s} height={s} viewBox="0 0 24 24" {...stroke}><path d="M20 10c0 6-8 12-8 12S4 16 4 10a8 8 0 0 1 16 0z"/><circle cx="12" cy="10" r="3"/></svg>,
    phone: <svg width={s} height={s} viewBox="0 0 24 24" {...stroke}><path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6 19.8 19.8 0 0 1-3.1-8.7A2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1.9.3 1.8.6 2.6a2 2 0 0 1-.5 2.1L8 9.6a16 16 0 0 0 6 6l1.2-1.2a2 2 0 0 1 2.1-.5c.8.3 1.7.5 2.6.6A2 2 0 0 1 22 16.9z"/></svg>,
    clock: <svg width={s} height={s} viewBox="0 0 24 24" {...stroke}><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></svg>,
    mail: <svg width={s} height={s} viewBox="0 0 24 24" {...stroke}><rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3 7 9 6 9-6"/></svg>,
    close: <svg width={s} height={s} viewBox="0 0 24 24" {...stroke}><path d="M18 6 6 18M6 6l12 12"/></svg>,
    menu: <svg width={s} height={s} viewBox="0 0 24 24" {...stroke}><path d="M3 6h18M3 12h18M3 18h18"/></svg>,
    sun: <svg width={s} height={s} viewBox="0 0 24 24" {...stroke}><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/></svg>,
    moon: <svg width={s} height={s} viewBox="0 0 24 24" {...stroke}><path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z"/></svg>,
    star: <svg width={s} height={s} viewBox="0 0 24 24" fill="currentColor"><path d="m12 2 3 7h7l-5.5 4.5L18 21l-6-4-6 4 1.5-7.5L2 9h7z"/></svg>,
    grid: <svg width={s} height={s} viewBox="0 0 24 24" {...stroke}><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/></svg>,
    syringe: <svg width={s} height={s} viewBox="0 0 24 24" {...stroke}><path d="m18 2 4 4M17 3l4 4M13 7l4 4M19 11l-7 7-3 1-1-1-3 3M7 17l3 3"/></svg>,
    scissors: <svg width={s} height={s} viewBox="0 0 24 24" {...stroke}><circle cx="6" cy="6" r="3"/><circle cx="6" cy="18" r="3"/><path d="m20 4-9.5 9.5M14 14l6 6M8.1 8.1 12 12"/></svg>,
    link: <svg width={s} height={s} viewBox="0 0 24 24" {...stroke}><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg>,
    check: <svg width={s} height={s} viewBox="0 0 24 24" {...stroke}><path d="M20 6 9 17l-5-5"/></svg>,
  };
  return <span style={{ display: 'inline-flex' }} {...rest}>{map[name] || null}</span>;
}

/* Drip svg — used as a decorative bottom edge on yellow blocks */
function DripEdge({ color = "var(--yellow)", style }) {
  return (
    <svg viewBox="0 0 1200 60" preserveAspectRatio="none" style={{ width: '100%', height: 50, display: 'block', ...style }}>
      <path d="M0,0 L0,30 Q30,28 50,40 Q70,52 90,30 Q110,15 140,38 Q165,58 195,30 Q220,12 250,42 Q280,60 310,30 Q340,15 370,40 Q400,55 430,30 Q460,18 495,44 Q525,58 555,30 Q585,16 615,42 Q650,58 680,28 Q710,16 740,44 Q770,58 805,30 Q835,18 870,42 Q900,55 930,30 Q960,16 990,42 Q1020,56 1055,30 Q1085,18 1115,42 Q1145,56 1180,28 L1200,28 L1200,0 Z" fill={color}/>
    </svg>
  );
}

/* Spray paint splatter — abstract circular noise */
function SpraySplatter({ color = "var(--yellow)", size = 200, style }) {
  return (
    <svg width={size} height={size} viewBox="0 0 200 200" style={style}>
      <g fill={color}>
        <circle cx="100" cy="100" r="40" opacity="0.15"/>
        <circle cx="80" cy="90" r="25" opacity="0.2"/>
        <circle cx="120" cy="110" r="20" opacity="0.18"/>
        {Array.from({ length: 80 }).map((_, i) => {
          const a = Math.random() * Math.PI * 2;
          const r = 30 + Math.random() * 70;
          const cx = 100 + Math.cos(a) * r;
          const cy = 100 + Math.sin(a) * r;
          const cr = Math.random() * 3 + 0.5;
          return <circle key={i} cx={cx} cy={cy} r={cr} opacity={0.1 + Math.random() * 0.3}/>;
        })}
      </g>
    </svg>
  );
}

/* Placeholder tattoo art — abstract geometric shapes that look intentional */
function TattooPlaceholder({ id, style, hue = 0, light = 12, label }) {
  // Deterministic seed from id
  const seed = id || 1;
  const rand = (n) => {
    const x = Math.sin(seed * (n + 1) * 13.37) * 10000;
    return x - Math.floor(x);
  };

  const bg = `hsl(${hue}, 8%, ${light}%)`;
  const fg = `hsl(${hue}, 60%, ${Math.min(85, light + 50)}%)`;
  const accent = `var(--yellow)`;

  // Choose a shape variant based on style
  const variants = {
    "black-and-grey": "portrait",
    "realismo": "portrait",
    "puntillismo": "dots",
    "fullcolor": "splash",
    "watercolor": "splash",
    "tradicional": "banner",
    "neo-tradicional": "banner",
    "fineline": "line",
  };
  const variant = variants[style] || "abstract";

  return (
    <svg viewBox="0 0 300 300" style={{ width: '100%', height: '100%', display: 'block', background: bg }} preserveAspectRatio="xMidYMid slice">
      {/* paper grain */}
      <defs>
        <filter id={`grain-${seed}`}>
          <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2"/>
          <feColorMatrix values="0 0 0 0 1  0 0 0 0 1  0 0 0 0 1  0 0 0 0.05 0"/>
        </filter>
      </defs>

      {variant === "portrait" && (
        <g stroke={fg} strokeWidth="1.5" fill="none">
          <circle cx="150" cy="130" r="55"/>
          <path d="M115 175 Q150 200 185 175 L195 220 Q150 250 105 220 Z" fill={fg} opacity="0.15"/>
          <circle cx="135" cy="125" r="3" fill={fg}/>
          <circle cx="165" cy="125" r="3" fill={fg}/>
          <path d="M140 150 Q150 158 160 150"/>
          {/* hatching */}
          {Array.from({ length: 8 }).map((_, i) => (
            <line key={i} x1={120 + i * 4} y1={140} x2={130 + i * 4} y2={170} opacity="0.3"/>
          ))}
        </g>
      )}

      {variant === "dots" && (
        <g fill={fg}>
          {Array.from({ length: 400 }).map((_, i) => {
            const a = (i / 400) * Math.PI * 2 * 4;
            const r = 30 + (i / 400) * 80 + Math.sin(i * 0.3) * 8;
            const cx = 150 + Math.cos(a) * r;
            const cy = 150 + Math.sin(a) * r;
            return <circle key={i} cx={cx} cy={cy} r={1 + rand(i) * 1.5}/>;
          })}
          <circle cx="150" cy="150" r="20" fill={accent}/>
        </g>
      )}

      {variant === "splash" && (
        <g>
          <circle cx="120" cy="130" r="50" fill={`hsl(${hue}, 70%, 55%)`} opacity="0.4"/>
          <circle cx="180" cy="160" r="40" fill={`hsl(${(hue + 60) % 360}, 70%, 55%)`} opacity="0.4"/>
          <circle cx="150" cy="180" r="35" fill={accent} opacity="0.3"/>
          <path d="M100 100 Q150 80 200 110 Q220 150 200 200 Q150 220 100 200 Q80 150 100 100 Z" fill="none" stroke={fg} strokeWidth="2"/>
          {Array.from({ length: 30 }).map((_, i) => {
            const a = rand(i) * Math.PI * 2;
            const d = 90 + rand(i + 100) * 30;
            return <circle key={i} cx={150 + Math.cos(a) * d} cy={150 + Math.sin(a) * d} r={rand(i + 200) * 3 + 0.5} fill={fg} opacity={rand(i + 300)}/>;
          })}
        </g>
      )}

      {variant === "banner" && (
        <g stroke={fg} strokeWidth="2.5" fill="none">
          <path d="M80 100 L220 100 L210 140 L220 180 L80 180 L90 140 Z" fill={`hsl(${hue}, 60%, 40%)`} fillOpacity="0.3"/>
          <text x="150" y="148" textAnchor="middle" fill={fg} fontFamily="serif" fontSize="22" fontWeight="bold" stroke="none">GHETTO</text>
          <path d="M70 120 L80 100 L70 80" />
          <path d="M230 120 L220 100 L230 80" />
          {/* roses */}
          <circle cx="100" cy="220" r="14" fill={accent} opacity="0.5"/>
          <circle cx="200" cy="220" r="14" fill={accent} opacity="0.5"/>
          <circle cx="100" cy="220" r="6" fill={`hsl(${hue}, 70%, 30%)`}/>
          <circle cx="200" cy="220" r="6" fill={`hsl(${hue}, 70%, 30%)`}/>
        </g>
      )}

      {variant === "line" && (
        <g stroke={fg} strokeWidth="1.2" fill="none">
          <path d="M150 50 Q120 100 140 150 Q170 200 150 250" />
          <path d="M150 50 Q180 100 160 150 Q130 200 150 250" />
          <circle cx="150" cy="80" r="2" fill={fg}/>
          <circle cx="150" cy="120" r="3" fill={fg}/>
          <circle cx="150" cy="160" r="2" fill={fg}/>
          <circle cx="150" cy="200" r="4" fill={accent}/>
          {/* small stars */}
          {[[80, 90], [220, 110], [70, 200], [225, 220]].map(([x, y], i) => (
            <g key={i} transform={`translate(${x} ${y})`}>
              <path d="M0 -6 L1.5 -1.5 L6 0 L1.5 1.5 L0 6 L-1.5 1.5 L-6 0 L-1.5 -1.5 Z" fill={fg}/>
            </g>
          ))}
        </g>
      )}

      {variant === "abstract" && (
        <g stroke={fg} strokeWidth="2" fill="none">
          <circle cx="150" cy="150" r="80"/>
          <rect x="100" y="100" width="100" height="100" transform="rotate(45 150 150)"/>
        </g>
      )}

      <rect width="300" height="300" filter={`url(#grain-${seed})`}/>

      {/* corner mark */}
      <text x="14" y="290" fontFamily="monospace" fontSize="9" fill={fg} opacity="0.5" letterSpacing="2">#{String(id).padStart(3, '0')}</text>
    </svg>
  );
}

Object.assign(window, { Icon, DripEdge, SpraySplatter, TattooPlaceholder, BarberPlaceholder });

/* ===== Barber placeholder — head silhouette + haircut variants ===== */
function BarberPlaceholder({ id, style, hue = 25, light = 14 }) {
  const seed = id || 1;
  const bg = `hsl(${hue}, 8%, ${light}%)`;
  const skin = `hsl(${hue}, 25%, ${Math.min(70, light + 35)}%)`;
  const hair = `hsl(${hue}, 12%, ${Math.max(8, light - 6)}%)`;
  const accent = `var(--yellow)`;

  return (
    <svg viewBox="0 0 300 360" style={{ width: '100%', height: '100%', display: 'block', background: bg }} preserveAspectRatio="xMidYMid slice">
      <defs>
        <filter id={`grain-b-${seed}`}>
          <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2"/>
          <feColorMatrix values="0 0 0 0 1  0 0 0 0 1  0 0 0 0 1  0 0 0 0.05 0"/>
        </filter>
        <clipPath id={`head-${seed}`}>
          <ellipse cx="150" cy="170" rx="78" ry="92"/>
        </clipPath>
      </defs>

      {/* Neck / shoulders */}
      <path d="M100 270 L100 320 Q100 360 150 360 Q200 360 200 320 L200 270 Z" fill={skin}/>
      <path d="M60 360 L60 340 Q60 300 100 280 L200 280 Q240 300 240 340 L240 360 Z" fill="#1a1a1a"/>
      {/* shirt collar V */}
      <path d="M130 280 L150 310 L170 280 Z" fill={bg}/>

      {/* Head shape */}
      <ellipse cx="150" cy="170" rx="78" ry="92" fill={skin}/>
      {/* Ears */}
      <ellipse cx="74" cy="180" rx="10" ry="16" fill={skin}/>
      <ellipse cx="226" cy="180" rx="10" ry="16" fill={skin}/>

      {/* Hair — varies by style */}
      <g clipPath={`url(#head-${seed})`}>
        {style === "fade" && (
          <React.Fragment>
            {/* heavy on top, fades to skin lower */}
            <path d="M70 130 Q150 70 230 130 L230 200 L70 200 Z" fill={hair}/>
            {/* fade gradient bottom */}
            <rect x="70" y="170" width="160" height="50" fill={hair} opacity="0.4"/>
          </React.Fragment>
        )}
        {style === "clasico" && (
          <React.Fragment>
            {/* side part — heavy left, swept */}
            <path d="M70 130 Q150 85 230 120 Q210 200 230 230 L230 180 L70 180 Z" fill={hair}/>
            {/* part line */}
            <path d="M130 90 Q145 130 155 180" stroke={skin} strokeWidth="3" fill="none"/>
          </React.Fragment>
        )}
        {style === "moderno" && (
          <React.Fragment>
            {/* textured top with disconnect */}
            <path d="M70 140 Q120 60 150 80 Q180 60 230 140 L230 175 L70 175 Z" fill={hair}/>
            {/* texture strokes */}
            {Array.from({ length: 18 }).map((_, i) => (
              <line key={i} x1={75 + i * 9} y1={85 + (i % 3) * 6}
                    x2={75 + i * 9 + 3} y2={140 + (i % 3) * 4}
                    stroke={skin} strokeOpacity="0.25" strokeWidth="1.5"/>
            ))}
          </React.Fragment>
        )}
        {style === "barba" && (
          <React.Fragment>
            <path d="M75 140 Q150 90 225 140 L225 195 L75 195 Z" fill={hair}/>
            {/* full beard */}
            <path d="M82 195 Q90 240 110 255 Q150 275 190 255 Q210 240 218 195 Z" fill={hair}/>
            <path d="M120 195 Q150 215 180 195" stroke={skin} strokeWidth="2" fill="none"/>
            {/* mustache */}
            <path d="M120 215 Q135 210 150 215 Q165 210 180 215 Q170 225 150 220 Q130 225 120 215 Z" fill={hair}/>
          </React.Fragment>
        )}
        {style === "ninos" && (
          <React.Fragment>
            <path d="M70 130 Q150 80 230 130 L230 180 L70 180 Z" fill={hair}/>
            {/* hair design line */}
            <path d="M85 175 Q100 170 115 178 Q130 175 145 178" stroke={accent} strokeWidth="2" fill="none"/>
          </React.Fragment>
        )}
      </g>

      {/* Face features (minimal) */}
      <circle cx="125" cy="185" r="3" fill={hair}/>
      <circle cx="175" cy="185" r="3" fill={hair}/>
      <path d="M135 225 Q150 232 165 225" stroke={hair} strokeWidth="2" fill="none" strokeLinecap="round"/>
      <path d="M147 200 Q150 215 153 215" stroke={hair} strokeWidth="1.5" fill="none" opacity="0.4"/>

      {/* grain */}
      <rect width="300" height="360" filter={`url(#grain-b-${seed})`}/>

      <text x="14" y="350" fontFamily="monospace" fontSize="9" fill={accent} opacity="0.6" letterSpacing="2">#{String(id).padStart(3, '0')}</text>
    </svg>
  );
}
