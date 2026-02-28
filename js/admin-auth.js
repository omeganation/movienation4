/* =====================================================
   MOVIENATION — ADMIN AUTH (admin access only)
   ===================================================== */
const AdminAuth = (() => {
  const KEY     = 'mn_admin_ses';
  const ADMIN   = 'admin@movienation.com';
  const TTL     = 8 * 60 * 60 * 1000; // 8-hour session

  const save = v => { try { localStorage.setItem(KEY, JSON.stringify(v)) } catch(e) {} };
  const load = () => { try { return JSON.parse(localStorage.getItem(KEY)) } catch(e) { return null } };
  const del  = () => localStorage.removeItem(KEY);

  function check() {
    const s = load();
    if (!s) return null;
    if (s.exp < Date.now()) { del(); return null; }
    return s;
  }

  function login(email, password) {
    if (!email || !password) return { ok: false, err: 'Email and password are required.' };
    if (email.toLowerCase().trim() !== ADMIN)
      return { ok: false, err: 'No admin account found with that email.' };
    // Any password works for demo — replace with real hash check for production
    const ses = { email: ADMIN, role: 'admin', exp: Date.now() + TTL };
    save(ses);
    return { ok: true, ses };
  }

  function logout() { del(); }
  function isLoggedIn() { return !!check(); }

  return { login, logout, isLoggedIn, check };
})();
