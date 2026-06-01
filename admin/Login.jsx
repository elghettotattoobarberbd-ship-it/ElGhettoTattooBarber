// admin/Login.jsx
function AdminLogin({ configured }) {
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState('');

  const submit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await AdminAuth.signIn({ email, password });
    } catch (err) {
      setError(err.message || 'Error al iniciar sesión.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-auth">
      <div className="admin-auth-card">
        <div className="admin-auth-mark">
          <span className="admin-auth-mark-g">G</span>
        </div>

        <div className="eyebrow" style={{ marginBottom: 12 }}>Panel · acceso</div>
        <h1 className="admin-auth-title">
          <span>El </span>
          <span className="yellow">ghetto.</span>
        </h1>
        <p className="admin-auth-sub">Ingresá con tu cuenta para gestionar la web.</p>

        {!configured && (
          <div className="admin-banner admin-banner-warn">
            <div style={{ marginBottom: 10 }}>
              <strong>Modo demo activo.</strong> Supabase todavía no está conectado — entrá con estas credenciales para explorar el panel:
            </div>
            <div className="admin-demo-creds">
              <div>
                <span className="admin-demo-lbl">Email</span>
                <code>{window.DEMO_CREDS.email}</code>
              </div>
              <div>
                <span className="admin-demo-lbl">Contraseña</span>
                <code>{window.DEMO_CREDS.password}</code>
              </div>
            </div>
            <button
              type="button"
              className="admin-demo-fill"
              onClick={() => {
                setEmail(window.DEMO_CREDS.email);
                setPassword(window.DEMO_CREDS.password);
              }}
            >
              Completar formulario →
            </button>
          </div>
        )}

        <form onSubmit={submit} className="admin-form">
          <div className="form-group">
            <label className="form-label">Email</label>
            <input
              type="email"
              className="form-input"
              placeholder="celeste@elghetto.tattoo"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
              required
            />
          </div>
          <div className="form-group">
            <label className="form-label">Contraseña</label>
            <input
              type="password"
              className="form-input"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
              required
            />
          </div>

          {error && <div className="admin-banner admin-banner-err">{error}</div>}

          <button
            type="submit"
            className="btn btn-primary"
            style={{ width: '100%', justifyContent: 'center', marginTop: 8 }}
            disabled={loading}
          >
            {loading ? 'Entrando…' : 'Entrar al panel'}
            <Icon name="arrowRight" size={16}/>
          </button>
        </form>

        <div className="admin-auth-foot">
          <a href="index.html">← Volver al sitio</a>
          <span>Solo administradores</span>
        </div>
      </div>

      <div className="admin-auth-marquee">
        <span>EL GHETTO ★ ADMIN ★ TATTOO ★ BARBER ★ </span>
        <span>EL GHETTO ★ ADMIN ★ TATTOO ★ BARBER ★ </span>
      </div>
    </div>
  );
}

window.AdminLogin = AdminLogin;
