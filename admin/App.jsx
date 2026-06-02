// admin/App.jsx — Auth gate + section routing
function AdminApp() {
  const configured = window.IS_SUPABASE_CONFIGURED();
  const [session, setSession] = React.useState(null);
  const [ready, setReady]     = React.useState(false);
  const [section, setSection] = React.useState('dashboard');

  React.useEffect(() => {
    document.documentElement.setAttribute('data-theme', 'dark');
    let unsub = () => {};
    (async () => {
      const { data } = await AdminAuth.getSession();
      setSession(data.session || null);
      unsub = AdminAuth.onChange((s) => setSession(s || null));
      setReady(true);
    })();
    return () => unsub();
  }, []);

  if (!ready) {
    return <div className="admin-boot">Cargando panel…</div>;
  }

  if (!session) {
    return <AdminLogin configured={configured} />;
  }

  const user = session?.user || {};
  if (!AdminAuth.isAuthorized(user)) {
    return (
      <div className="admin-auth">
        <div className="admin-auth-card">
          <div className="eyebrow">Sin permisos</div>
          <h1 className="admin-auth-title">Acceso <span className="yellow">denegado.</span></h1>
          <p className="admin-auth-sub">El usuario <strong>{user.email}</strong> no está en la lista de administradores.</p>
          <button className="btn btn-ghost" onClick={() => AdminAuth.signOut()}>
            Cerrar sesión
          </button>
        </div>
      </div>
    );
  }

  const sectionMap = {
    dashboard:   () => <AdminDashboard user={session.user} onSection={setSection}/>,
    artistas:    () => <AdminArtists/>,
    galeria:     () => <AdminGallery/>,
    estilos:     () => <AdminStyles/>,
    cursos:      () => <AdminCourses/>,
    testimonios: () => <AdminTestimonios/>,
    faqs:        () => <AdminFaqs/>,
    horarios:    () => <AdminHorarios/>,
    reservas:    () => <AdminReservas/>,
    config:      () => <AdminConfig/>,
    marketing:   () => { const C = window.AdminMarketing; return C ? <C/> : <div className="admin-empty">Cargando…</div>; },
  };

  const renderSection = (sectionMap[section] || sectionMap.dashboard);

  return (
    <AdminShell user={session.user} section={section} onSection={setSection}>
      {renderSection()}
    </AdminShell>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<AdminApp />);
