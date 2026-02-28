/* =====================================================
   MOVIENATION — LIVE DATA MANAGER
   Admin edits save to localStorage → all pages update live
   ===================================================== */
const DB = (() => {
  const KEY      = 'mn_movies_db';
  const LOG_KEY  = 'mn_activity';
  const META_KEY = 'mn_meta';

  const load = k => { try { return JSON.parse(localStorage.getItem(k)) } catch(e) { return null } };
  const save = (k,v) => { try { localStorage.setItem(k, JSON.stringify(v)) } catch(e) {} };
  const ts   = () => new Date().toISOString();

  function init() {
    if (!load(KEY)) {
      save(KEY, MOVIES);
      save(META_KEY, { nextId: MOVIES.length + 1 });
    }
  }

  function all()         { return load(KEY) || MOVIES }
  function byId(id)      { return all().find(m => m.id === +id) || null }

  function nextId() {
    const meta = load(META_KEY) || {};
    const id   = meta.nextId || (Math.max(0, ...all().map(m => m.id)) + 1);
    save(META_KEY, { ...meta, nextId: id + 1 });
    return id;
  }

  function log(action, title) {
    const logs = load(LOG_KEY) || [];
    logs.unshift({ action, title, ts: ts() });
    if (logs.length > 100) logs.length = 100;
    save(LOG_KEY, logs);
  }
  function getLogs() { return load(LOG_KEY) || [] }

  function add(movie) {
    const movies = all();
    movie.id     = nextId();
    movie.genres = Array.isArray(movie.genres) ? movie.genres : String(movie.genres).split(',').map(s=>s.trim()).filter(Boolean);
    movie.cast   = Array.isArray(movie.cast)   ? movie.cast   : String(movie.cast||'').split(',').map(s=>s.trim()).filter(Boolean);
    movie.castImg= movie.castImg || [];
    movie.rating = movie.rating ? +movie.rating : null;
    movie.votes  = +movie.votes  || 0;
    movie.year   = +movie.year;
    movie.featured = !!movie.featured;
    movie.isNew    = !!movie.isNew;
    movie.upcoming = !!movie.upcoming;
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
    if (!m) return null;
    return update(id, { featured: !m.featured });
  }

  function stats() {
    const m = all();
    return {
      total:    m.length,
      active:   m.filter(x=>!x.upcoming).length,
      upcoming: m.filter(x=>x.upcoming).length,
      featured: m.filter(x=>x.featured).length,
      newRel:   m.filter(x=>x.isNew).length,
      topRated: m.filter(x=>x.rating>=8).length,
      genres:   [...new Set(m.flatMap(x=>x.genres))].length,
    };
  }

  function reset() {
    save(KEY, MOVIES);
    save(META_KEY, { nextId: MOVIES.length + 1 });
    log('Reset', 'Restored defaults');
  }

  function exportJSON() {
    const blob = new Blob([JSON.stringify(all(), null, 2)], { type: 'application/json' });
    const url  = URL.createObjectURL(blob);
    const a    = document.createElement('a');
    a.href = url; a.download = 'movienation-movies.json';
    a.click();
    URL.revokeObjectURL(url);
  }

  return { init, all, byId, add, update, remove, toggleFeatured, stats, getLogs, reset, exportJSON };
})();

document.addEventListener('DOMContentLoaded', () => DB.init());
