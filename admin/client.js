// admin/client.js — Supabase client + auth helpers (with demo fallback)
// Requires admin/config.js + the @supabase/supabase-js UMD bundle loaded first.

(function () {
  const ok = window.IS_SUPABASE_CONFIGURED();
  let sb = null;
  if (ok && window.supabase && window.supabase.createClient) {
    sb = window.supabase.createClient(window.SUPABASE_URL, window.SUPABASE_ANON_KEY, {
      auth: { persistSession: true, autoRefreshToken: true, detectSessionInUrl: true },
    });
  }
  window.sb = sb;
})();

// ============================================================
// DEMO MODE — fake auth when Supabase isn't configured yet.
// Use these credentials to preview the panel without backend:
//   email:    demo@elghetto.local
//   password: ghetto2024
// ============================================================
window.DEMO_CREDS = {
  email:    'demo@elghetto.local',
  password: 'ghetto2024',
};

const DEMO_KEY = 'elghetto_admin_demo_session';
const demoBus = new EventTarget();

function readDemoSession() {
  try {
    const raw = localStorage.getItem(DEMO_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch { return null; }
}
function writeDemoSession(s) {
  if (s) localStorage.setItem(DEMO_KEY, JSON.stringify(s));
  else   localStorage.removeItem(DEMO_KEY);
  demoBus.dispatchEvent(new CustomEvent('change', { detail: s }));
}

window.AdminAuth = {
  async getSession() {
    if (window.sb) return window.sb.auth.getSession();
    const s = readDemoSession();
    return { data: { session: s }, error: null };
  },

  async signIn({ email, password }) {
    // Real Supabase
    if (window.sb) {
      const { data, error } = await window.sb.auth.signInWithPassword({ email, password });
      if (error) throw error;
      return data;
    }
    // Demo fallback
    if (
      email.trim().toLowerCase() === window.DEMO_CREDS.email &&
      password === window.DEMO_CREDS.password
    ) {
      const session = {
        access_token: 'demo-token',
        user: { id: 'demo-user', email: window.DEMO_CREDS.email, demo: true },
      };
      writeDemoSession(session);
      return { session };
    }
    throw new Error('Credenciales inválidas. Usá la cuenta demo (ver banner).');
  },

  async signOut() {
    if (window.sb) { await window.sb.auth.signOut(); return; }
    writeDemoSession(null);
  },

  onChange(cb) {
    if (window.sb) {
      const { data } = window.sb.auth.onAuthStateChange((_e, session) => cb(session));
      return () => data.subscription.unsubscribe();
    }
    const handler = (e) => cb(e.detail);
    demoBus.addEventListener('change', handler);
    return () => demoBus.removeEventListener('change', handler);
  },

  isAuthorized(user) {
    if (!user) return false;
    // In demo mode, always allow the demo user
    if (user.demo) return true;
    const email = user.email || '';
    const list = (window.ADMIN_EMAILS || []).map((e) => e.toLowerCase());
    if (list.length === 0) return true;
    return list.includes(email.toLowerCase());
  },
};
