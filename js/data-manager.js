/* =====================================================
   MOVIENATION — LIVE DATA MANAGER
   • Admin edits are saved to localStorage
   • Every page reads from this store (not raw MOVIES)
   • When you add Firebase, swap localStorage for Firestore
   ===================================================== */
const DB = (() => {
  const KEY     = 'mn_movies_db';
  const LOG_KEY = 'mn_activity';
  const META_KEY= 'mn_meta';

  /* ── helpers ── */
  const load  = k => { try{ return JSON.parse(localStorage.getItem(k)) }catch(e){ return null } };
  const save  = (k,v) => { try{ localStorage.setItem(k,JSON.stringify(v)) }catch(e){} };
  const ts    = () => new Date().toISOString();
  const uid   = () => Date.now().toString(36) + Math.random().toString(36).slice(2,6);

  /* ── init: seed from bundled MOVIES if store is empty ── */
  function init() {
    if (!load(KEY)) {
      save(KEY, MOVIES);        // first run — use hardcoded list
      save(META_KEY, { nextId: MOVIES.length + 1, seeded: ts() });
    }
  }

  /* ── read ── */
  function all()         { return load(KEY) || MOVIES }
  function byId(id)      { return all().find(m => m.id === +id) }
  function featured()    { return all().filter(m => m.featured && !m.upcoming) }
  function upcoming()    { return all().filter(m => m.upcoming) }
  function notUpcoming() { return all().filter(m => !m.upcoming) }

  /* ── next ID ── */
  function nextId() {
    const meta = load(META_KEY) || {};
    const id   = meta.nextId || (Math.max(...all().map(m=>m.id)) + 1);
    meta.nextId = id + 1;
    save(META_KEY, meta);
    return id;
  }

  /* ── activity log ── */
  function log(action, title) {
    const logs = load(LOG_KEY) || [];
    logs.unshift({ action, title, ts: ts(), id: uid() });
    if (logs.length > 100) logs.length = 100;
    save(LOG_KEY, logs);
  }
  function getLogs() { return load(LOG_KEY) || [] }

  /* ── CRUD ── */
  function add(movie) {
    const movies = all();
    movie.id = nextId();
    movie.genres = Array.isArray(movie.genres) ? movie.genres : String(movie.genres).split(',').map(s=>s.trim()).filter(Boolean);
    movie.cast   = Array.isArray(movie.cast)   ? movie.cast   : String(movie.cast||'').split(',').map(s=>s.trim()).filter(Boolean);
    movie.castImg= movie.castImg||[];
    movie.rating = movie.rating ? +movie.rating : null;
    movie.votes  = movie.votes  ? +movie.votes  : 0;
    movie.year   = +movie.year;
    movie.featured   = !!movie.featured;
    movie.isNew      = !!movie.isNew;
    movie.upcoming   = !!movie.upcoming;
    movies.push(movie);
    save(KEY, movies);
    log('Added', movie.title);
    return movie;
  }

  function update(id, changes) {
    const movies = all();
    const idx = movies.findIndex(m => m.id === +id);
    if (idx === -1) return null;
    if (changes.genres && !Array.isArray(changes.genres))
      changes.genres = String(changes.genres).split(',').map(s=>s.trim()).filter(Boolean);
    if (changes.cast && !Array.isArray(changes.cast))
      changes.cast = String(changes.cast).split(',').map(s=>s.trim()).filter(Boolean);
    if (changes.rating !== undefined) changes.rating = changes.rating ? +changes.rating : null;
    if (changes.votes  !== undefined) changes.votes  = +changes.votes  || 0;
    if (changes.year   !== undefined) changes.year   = +changes.year;
    movies[idx] = { ...movies[idx], ...changes };
    save(KEY, movies);
    log('Updated', movies[idx].title);
    return movies[idx];
  }

  function remove(id) {
    const movies = all();
    const idx = movies.findIndex(m => m.id === +id);
    if (idx === -1) return false;
    const [removed] = movies.splice(idx, 1);
    save(KEY, movies);
    log('Deleted', removed.title);
    return true;
  }

  function toggleFeatured(id) {
    const m = byId(id);
    if (!m) return;
    return update(id, { featured: !m.featured });
  }

  /* ── stats ── */
  function stats() {
    const movies = all();
    return {
      total:    movies.length,
      active:   movies.filter(m=>!m.upcoming).length,
      upcoming: movies.filter(m=>m.upcoming).length,
      featured: movies.filter(m=>m.featured).length,
      newRel:   movies.filter(m=>m.isNew).length,
      topRated: movies.filter(m=>m.rating>=8).length,
      genres:   [...new Set(movies.flatMap(m=>m.genres))].length,
    };
  }

  /* ── reset to defaults ── */
  function reset() {
    save(KEY, MOVIES);
    save(META_KEY, { nextId: MOVIES.length + 1, resetAt: ts() });
    log('Reset', 'All movies reset to defaults');
  }

  /* ── export as JSON ── */
  function exportJSON() {
    const blob = new Blob([JSON.stringify(all(), null, 2)], {type:'application/json'});
    const url  = URL.createObjectURL(blob);
    const a    = document.createElement('a');
    a.href = url; a.download = 'movienation-movies.json';
    a.click(); URL.revokeObjectURL(url);
  }

  return { init, all, byId, featured, upcoming, notUpcoming, add, update, remove, toggleFeatured, stats, getLogs, reset, exportJSON };
})();

/* ── OVERRIDE: make all pages use DB instead of raw MOVIES ── */
document.addEventListener('DOMContentLoaded', () => DB.init());
