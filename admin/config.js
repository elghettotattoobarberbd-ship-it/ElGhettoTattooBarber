// admin/config.js
// ============================================================
// SUPABASE — CONFIGURACIÓN
// ============================================================
// 1. Entrá a https://app.supabase.com
// 2. Creá un proyecto (o entrá al existente)
// 3. Settings → API → copiá:
//      - "Project URL"      → SUPABASE_URL
//      - "anon public key"  → SUPABASE_ANON_KEY
// 4. Pegalos abajo y guardá. NO subas claves de "service_role" a este archivo.
// ============================================================

window.SUPABASE_URL      = "https://lfovwufbjvgrumzmnqzf.supabase.co";
window.SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imxmb3Z3dWZianZncnVtem1ucXpmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODAyMzQ5NzQsImV4cCI6MjA5NTgxMDk3NH0.GWD6A3vFGBdRXi73HdffJwtBO17NbqNEnlK9uCWnY9M";

// Email del/los administradores autorizados (lista blanca).
window.ADMIN_EMAILS = [
  "elghettotattoobarberbd@gmail.com",
];

window.IS_SUPABASE_CONFIGURED = () =>
  !window.SUPABASE_URL.includes("TU-PROYECTO") &&
  !window.SUPABASE_ANON_KEY.includes("TU_ANON");
