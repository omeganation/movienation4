/* =====================================================
   MOVIENATION — DATA MANAGER  (Firestore + localStorage)
   ─────────────────────────────────────────────────────
   • If Firebase is configured → uses Firestore
     – Real-time listener keeps all tabs/visitors in sync
     – Admin changes appear for EVERYONE instantly
   • If Firebase is NOT configured → falls back to
     localStorage so the site still works during setup
   ===================================================== */
const DB = (() => {

  /* ── STATE ── */
  let _cache    = [];
  let _ready    = false;
  let _cbs      = [];
  let _unsub    = null;
  let _useFS    = false;
  const FS_COL  = 'movies';
  const LOG_KEY = 'mn_activity';
  const LS_KEY  = 'mn_movies_db';
  const META_KEY= 'mn_meta';

  /* ── UTILS ── */
  const ts    = () => new Date().toISOString();
  const lsGet = k => { try { return JSON.parse(localStorage.getItem(k)) } catch(e) { return null } };
  const lsSet = (k,v) => { try { localStorage.setItem(k, JSON.stringify(v)) } catch(e) {} };

  function _markReady() {
    _ready = true;
    _cbs.forEach(cb => { try { cb() } catch(e) {} });
    _cbs = [];
  }

  /* ── onReady ──────────────────────────────────────────
     All pages call DB.onReady(fn) before rendering.
     Fires immediately if data already loaded, else waits.
  ─────────────────────────────────────────────────────── */
  function onReady(cb) {
    if (_ready) { try { cb() } catch(e) {} }
    else _cbs.push(cb);
  }

  /* ── ACTIVITY LOG (localStorage — admin only) ── */
  function _log(action, title) {
    const logs = lsGet(LOG_KEY) || [];
    logs.unshift({ action, title, ts: ts() });
    if (logs.length > 100) logs.length = 100;
    lsSet(LOG_KEY, logs);
  }
  function getLogs() { return lsGet(LOG_KEY) || [] }

  /* ── NEXT NUMERIC ID ── */
  function _nextId() {
    const meta = lsGet(META_KEY) || {};
    const id   = meta.nextId || (Math.max(0, ..._cache.map(m => m.id)) + 1);
    lsSet(META_KEY, { ...meta, nextId: id + 1 });
    return id;
  }

  /* ── SANITISE before saving ── */
  function _san(m) {
    m.genres  = Array.isArray(m.genres)  ? m.genres  : String(m.genres ||'').split(',').map(s=>s.trim()).filter(Boolean);
    m.cast    = Array.isArray(m.cast)    ? m.cast    : String(m.cast   ||'').split(',').map(s=>s.trim()).filter(Boolean);
    m.castImg = m.castImg || [];
    m.rating  = m.rating  ? +m.rating  : null;
    m.votes   = +m.votes  || 0;
    m.year    = +m.year   || 0;
    m.featured   = !!m.featured;
    m.isNew      = !!m.isNew;
    m.upcoming   = !!m.upcoming;
    m.badge      = m.badge       || '';
    m.watchUrl   = m.watchUrl    || '';
    m.downloadUrl= m.downloadUrl || '';
    m.trailer    = m.trailer     || '';
    m.backdrop   = m.backdrop    || '';
    m.tagline    = m.tagline     || '';
    m.longDesc   = m.longDesc    || '';
    m.director   = m.director    || '';
    m.studio     = m.studio      || '';
    m.duration   = m.duration    || 'TBA';
    m.releaseDate= m.releaseDate || null;
    // Firestore rejects undefined values
    Object.keys(m).forEach(k => { if (m[k] === undefined) delete m[k] });
    return m;
  }

  /* ══════════════════════════════════════════════════
     FIRESTORE PATH
  ══════════════════════════════════════════════════ */
  function _startListener() {
    const fstore = window.MN_FIRESTORE;
    _unsub = fstore.collection(FS_COL)
      .orderBy('id', 'asc')
      .onSnapshot(
        snap => {
          _cache = snap.docs.map(d => d.data());
          if (!_ready) _markReady();
          window.dispatchEvent(new CustomEvent('mn:updated', { detail: _cache }));
        },
        err => {
          console.error('[MN] Firestore listen error — switching to localStorage:', err.message);
          _useFS = false;
          if (_unsub) { _unsub(); _unsub = null; }
          _initLS();
        }
      );
  }

  async function _seedFS() {
    const fstore = window.MN_FIRESTORE;
    const snap = await fstore.collection(FS_COL).limit(1).get();
    if (!snap.empty) return;                          // already seeded
    console.log('[MN] Seeding Firestore…');
    const batch = fstore.batch();
    MOVIES.forEach(m => {
      batch.set(fstore.collection(FS_COL).doc(String(m.id)), _san({ ...m }));
    });
    await batch.commit();
    lsSet(META_KEY, { nextId: MOVIES.length + 1 });
    console.log('[MN] Seeded', MOVIES.length, 'movies ✓');
  }

  /* ══════════════════════════════════════════════════
     LOCALSTORAGE FALLBACK PATH
  ══════════════════════════════════════════════════ */
  function _initLS() {
    if (!lsGet(LS_KEY)) {
      lsSet(LS_KEY, MOVIES);
      lsSet(META_KEY, { nextId: MOVIES.length + 1 });
    }
    _cache = lsGet(LS_KEY) || MOVIES;
    if (!_ready) _markReady();
  }

  /* ══════════════════════════════════════════════════
     PUBLIC INIT
  ══════════════════════════════════════════════════ */
  async function init() {
    if (window.MN_FIRESTORE) {
      _useFS = true;
      try {
        await _seedFS();
        _startListener();
      } catch(e) {
        console.warn('[MN] Firebase error, using localStorage:', e.message);
        _useFS = false;
        _initLS();
      }
    } else {
      _initLS();
    }
  }

  /* ══════════════════════════════════════════════════
     READ  (sync — safe after onReady)
  ══════════════════════════════════════════════════ */
  function all()    { return _cache }
  function byId(id) { return _cache.find(m => m.id === +id) || null }

  /* ══════════════════════════════════════════════════
     WRITE  (async for Firestore, sync for localStorage)
  ══════════════════════════════════════════════════ */
  async function add(movie) {
    movie.id = _nextId();
    _san(movie);
    if (_useFS) {
      await window.MN_FIRESTORE.collection(FS_COL).doc(String(movie.id)).set(movie);
    } else {
      const arr = lsGet(LS_KEY) || [];
      arr.push(movie);
      lsSet(LS_KEY, arr);
      _cache = arr;
    }
    _log('Added', movie.title);
    return movie;
  }

  async function update(id, changes) {
    _san(changes);
    const title = byId(id)?.title || String(id);
    if (_useFS) {
      await window.MN_FIRESTORE.collection(FS_COL).doc(String(id)).update(changes);
    } else {
      const arr = lsGet(LS_KEY) || [];
      const idx = arr.findIndex(m => m.id === +id);
      if (idx === -1) return null;
      arr[idx] = { ...arr[idx], ...changes };
      lsSet(LS_KEY, arr);
      _cache = arr;
    }
    _log('Updated', title);
    return byId(id);
  }

  async function remove(id) {
    const title = byId(id)?.title || String(id);
    if (_useFS) {
      await window.MN_FIRESTORE.collection(FS_COL).doc(String(id)).delete();
    } else {
      const arr = (lsGet(LS_KEY) || []).filter(m => m.id !== +id);
      lsSet(LS_KEY, arr);
      _cache = arr;
    }
    _log('Deleted', title);
    return true;
  }

  async function toggleFeatured(id) {
    const m = byId(id);
    if (!m) return null;
    return update(id, { featured: !m.featured });
  }

  /* ── Reset to defaults ── */
  async function reset() {
    if (_useFS) {
      const fstore = window.MN_FIRESTORE;
      const snap   = await fstore.collection(FS_COL).get();
      const b1     = fstore.batch();
      snap.docs.forEach(d => b1.delete(d.ref));
      await b1.commit();
      const b2 = fstore.batch();
      MOVIES.forEach(m => b2.set(fstore.collection(FS_COL).doc(String(m.id)), _san({ ...m })));
      await b2.commit();
    } else {
      lsSet(LS_KEY, MOVIES);
      _cache = [...MOVIES];
    }
    lsSet(META_KEY, { nextId: MOVIES.length + 1 });
    _log('Reset', 'Restored defaults');
  }

  /* ── Stats ── */
  function stats() {
    const m = _cache;
    return {
      total:    m.length,
      active:   m.filter(x => !x.upcoming).length,
      upcoming: m.filter(x =>  x.upcoming).length,
      featured: m.filter(x =>  x.featured).length,
      newRel:   m.filter(x =>  x.isNew).length,
      topRated: m.filter(x =>  x.rating >= 8).length,
      genres:   [...new Set(m.flatMap(x => x.genres))].length,
      mode:     _useFS ? 'firestore' : 'localstorage',
    };
  }

  /* ── Export JSON ── */
  function exportJSON() {
    const blob = new Blob([JSON.stringify(_cache, null, 2)], { type: 'application/json' });
    const url  = URL.createObjectURL(blob);
    const a    = document.createElement('a');
    a.href = url; a.download = 'movienation-movies.json';
    a.click();
    URL.revokeObjectURL(url);
  }

  return {
    init, onReady,
    all, byId,
    add, update, remove, toggleFeatured,
    stats, getLogs, reset, exportJSON,
    isFirestore: () => _useFS,
  };
})();

/* ── Auto-boot ── */
document.addEventListener('DOMContentLoaded', () => DB.init());
