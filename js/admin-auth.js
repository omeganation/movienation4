/* =====================================================
   MOVIENATION — ADMIN AUTH
   Single admin account. Session lasts 8 hours.
   ===================================================== */
const AdminAuth = (() => {
  const ADMIN_EMAIL = 'tuyizereomega@gmail.com';
  const ADMIN_PASS  = 'tuyizere123@';
  const KEY         = 'mn_admin_sess';
  const TTL         = 8 * 60 * 60 * 1000; // 8h

  function login(email, pw) {
    if (email.toLowerCase().trim() !== ADMIN_EMAIL.toLowerCase()) return { ok:false, err:'Email not found.' };
    if (pw !== ADMIN_PASS) return { ok:false, err:'Incorrect password.' };
    localStorage.setItem(KEY, JSON.stringify({ ts: Date.now() }));
    return { ok:true };
  }
  function logout()    { localStorage.removeItem(KEY) }
  function isLoggedIn() {
    try {
      const s = JSON.parse(localStorage.getItem(KEY));
      return s && (Date.now() - s.ts < TTL);
    } catch(e) { return false }
  }
  function check() { if (!isLoggedIn()) location.href='admin.html' }

  return { login, logout, isLoggedIn, check };
})();
