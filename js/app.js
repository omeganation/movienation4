/* =====================================================
   MOVIENATION APP v8
   Bottom Nav · Settings · Watched History · Watch This Week
   Clean URLs · Lazy Images · Infinite Scroll · Watchlist
   ===================================================== */

/* ── UTILS ── */
function slugify(s) {
  return String(s||'').toLowerCase()
    .replace(/[àáâãä]/g,'a').replace(/[èéêë]/g,'e')
    .replace(/[ìíîï]/g,'i').replace(/[òóôõö]/g,'o')
    .replace(/[ùúûü]/g,'u').replace(/ñ/g,'n').replace(/ç/g,'c')
    .replace(/[^a-z0-9]+/g,'-').replace(/^-+|-+$/g,'');
}
function movieUrl(m) { return '/movie/' + slugify(m.title); }
function esc(s) {
  return String(s||'').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}
function debounce(fn, ms) { let t; return (...a) => { clearTimeout(t); t = setTimeout(()=>fn(...a), ms); }; }

/* ── WATCHLIST ── */
let _wl = null;
function getWatchlist() {
  if (!_wl) { try { _wl = new Set(JSON.parse(localStorage.getItem('mn_wl')||'[]')); } catch(e) { _wl = new Set(); } }
  return _wl;
}
function saveWatchlist() { localStorage.setItem('mn_wl', JSON.stringify([...(getWatchlist())])); }
function inWatchlist(id) { return getWatchlist().has(String(id)); }
function toggleWatchlist(id) {
  const wl = getWatchlist();
  const sid = String(id);
  const added = !wl.has(sid);
  if (added) { wl.add(sid); showToast('Added to watchlist', 'success'); }
  else { wl.delete(sid); showToast('Removed from watchlist', 'info'); }
  saveWatchlist();
  document.querySelectorAll(`.wl-btn[data-id="${sid}"]`).forEach(b => {
    b.classList.toggle('active', added);
    b.title = added ? 'Remove from watchlist' : 'Save to watchlist';
    const i = b.querySelector('i');
    if (i) i.className = 'ri-bookmark-' + (added ? 'fill' : 'line');
  });
}

/* ── WATCHED HISTORY ── */
function getWatched() {
  try { return JSON.parse(localStorage.getItem('mn_watched')||'[]'); } catch(e) { return []; }
}
function addWatched(movie) {
  if (!movie) return;
  let history = getWatched();
  history = history.filter(x => x.id !== movie.id);
  history.unshift({ id:movie.id, title:movie.title, poster:movie.poster, year:movie.year, rating:movie.rating, ts:Date.now() });
  if (history.length > 50) history = history.slice(0, 50);
  localStorage.setItem('mn_watched', JSON.stringify(history));
}

/* ── LAZY IMAGES ── */
let _lazyObs = null;
function initLazyImages() {
  _lazyObs = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const img = entry.target;
      const src = img.dataset.src;
      if (!src) return;
      img.src = src;
      img.addEventListener('load',  () => img.classList.add('loaded'), { once:true });
      img.addEventListener('error', () => {
        img.src = img.dataset.fb || 'https://placehold.co/200x300/111827/555?text=?';
        img.classList.add('loaded');
      }, { once:true });
      _lazyObs.unobserve(img);
    });
  }, { rootMargin:'400px 0px' });
}
function observeLazy() {
  if (!_lazyObs) return;
  document.querySelectorAll('img.lazy:not(.loaded)').forEach(img => _lazyObs.observe(img));
}
function lz(src, alt, cls, fb) {
  return `<img class="lazy${cls?' '+cls:''}" data-src="${esc(src)}" data-fb="${esc(fb||'https://placehold.co/200x300/111827/555?text=?')}" src="" alt="${esc(alt)}" decoding="async">`;
}

/* ══════════════════════════════════════════════════
   INIT
══════════════════════════════════════════════════ */
document.addEventListener('DOMContentLoaded', () => {
  initPreloader();
  initTheme();
  initNav();
  initBottomNav();
  initSearch();
  initSearchOverlay();
  initSettings();
  initBtt();
  initLazyImages();

  if (typeof MNAnalytics !== 'undefined') {
    MNAnalytics.trackPage(location.pathname || '/');
  }

  DB.onReady(() => { routePage(); setActiveLink(); });

  window.addEventListener('mn:updated', () => {
    if (document.visibilityState === 'visible') routePage();
  });
});

/* ── PRELOADER ── */
function initPreloader() {
  function hide() {
    const p = document.getElementById('preloader');
    if (!p || p._done) return;
    p._done = true;
    p.classList.add('out');
    setTimeout(() => { try { p.remove(); } catch(e){} }, 600);
  }
  window.addEventListener('load', () => setTimeout(hide, 80), { once:true });
  setTimeout(hide, 2500);
}

/* ── THEME ── */
let dark = localStorage.getItem('mn_theme') !== 'light';
function initTheme() {
  applyTheme();
  document.querySelectorAll('.theme-btn').forEach(b => {
    b.innerHTML = dark ? '<i class="ri-moon-line"></i>' : '<i class="ri-sun-line"></i>';
    b.addEventListener('click', toggleTheme);
  });
}
function applyTheme() {
  document.documentElement.setAttribute('data-theme', dark ? 'dark' : 'light');
  // Sync settings panel theme options
  document.querySelectorAll('.theme-opt').forEach(b => {
    b.classList.toggle('active', b.dataset.t === (dark ? 'dark' : 'light'));
  });
}
function toggleTheme() {
  dark = !dark;
  localStorage.setItem('mn_theme', dark ? 'dark' : 'light');
  applyTheme();
  document.querySelectorAll('.theme-btn').forEach(b => {
    b.innerHTML = dark ? '<i class="ri-moon-line"></i>' : '<i class="ri-sun-line"></i>';
  });
}
function setTheme(t) {
  dark = t === 'dark';
  localStorage.setItem('mn_theme', dark ? 'dark' : 'light');
  applyTheme();
  document.querySelectorAll('.theme-btn').forEach(b => {
    b.innerHTML = dark ? '<i class="ri-moon-line"></i>' : '<i class="ri-sun-line"></i>';
  });
}

/* ── TOP NAV ── */
function initNav() {
  const nav = document.getElementById('nav');
  window.addEventListener('scroll', () => {
    nav?.classList.toggle('scrolled', window.scrollY > 40);
  }, { passive:true });
}

/* ── BOTTOM NAV ── */
function initBottomNav() {
  const path = location.pathname;
  document.querySelectorAll('.bnav-btn[data-path]').forEach(btn => {
    const bp = btn.dataset.path;
    let active = false;
    if (bp === '/' && (path === '/' || path === '' || path === '/index.html')) active = true;
    else if (bp !== '/' && bp && path.startsWith(bp)) active = true;
    btn.classList.toggle('active', active);
  });
}
function setActiveLink() {
  const path = location.pathname;
  document.querySelectorAll('.nav-links a').forEach(a => {
    const href = a.getAttribute('href') || '';
    let active = false;
    if (href === '/' && (path === '/' || path === '' || path === '/index.html')) active = true;
    else if (href !== '/' && href.split('?')[0] && path.startsWith(href.split('?')[0])) active = true;
    a.classList.toggle('active', active);
  });
}

/* ── DESKTOP SEARCH ── */
function initSearch() {
  const navQ = document.getElementById('nav-q');
  const wrap = document.getElementById('nav-search-wrap');

  if (navQ) {
    const dRender = debounce(q => renderDrop(q), 180);
    navQ.addEventListener('input', () => {
      dRender(navQ.value.trim());
      wrap?.classList.toggle('has-val', !!navQ.value);
    });
    navQ.addEventListener('keydown', e => {
      if (e.key === 'Enter' && navQ.value.trim())
        location.href = '/movies?q=' + encodeURIComponent(navQ.value.trim());
      if (e.key === 'Escape') { closeDrop(); navQ.blur(); }
    });
    navQ.addEventListener('focus', () => document.getElementById('nav')?.classList.add('scrolled'));
    document.addEventListener('click', e => {
      if (!wrap?.contains(e.target)) closeDrop();
    });
    const urlQ = new URLSearchParams(location.search).get('q');
    if (urlQ) { navQ.value = urlQ; wrap?.classList.add('has-val'); }
  }
}
function clearSearch() {
  const navQ = document.getElementById('nav-q');
  const wrap = document.getElementById('nav-search-wrap');
  if (navQ) { navQ.value = ''; navQ.focus(); }
  wrap?.classList.remove('has-val');
  closeDrop();
}
function renderDrop(q) {
  const drop = document.getElementById('sdrop'); if (!drop) return;
  if (!q) { drop.classList.remove('on'); drop.innerHTML = ''; return; }
  const results = DB.all().filter(m => !m.upcoming &&
    (m.title.toLowerCase().includes(q.toLowerCase()) || (m.director||'').toLowerCase().includes(q.toLowerCase()))
  ).slice(0, 8);
  if (!results.length) {
    drop.innerHTML = '<div class="sdrop-empty">No results</div>';
  } else {
    drop.innerHTML = results.map(m =>
      `<div class="sdrop-item" onclick="goMovie(${m.id})" role="button" tabindex="0">
        ${lz(m.poster, m.title, 'sdrop-img', 'https://placehold.co/32x46/111827/555?text=?')}
        <div><div class="sdrop-title">${esc(m.title)}</div><div class="sdrop-meta">${m.year||''}${m.rating?' · ⭐ '+m.rating:''}</div></div>
      </div>`
    ).join('') + '<div class="sdrop-hint"><i class="ri-corner-down-left-line"></i>Enter for all results</div>';
  }
  drop.classList.add('on');
  observeLazy();
}
function closeDrop() {
  const d = document.getElementById('sdrop');
  if (d) { d.classList.remove('on'); d.innerHTML = ''; }
}

/* ── MOBILE SEARCH OVERLAY ── */
let _sovOpen = false;
function initSearchOverlay() {
  const ov = document.getElementById('search-overlay'); if (!ov) return;
  const q  = document.getElementById('sov-q');
  if (q) {
    const d = debounce(v => renderSovResults(v), 180);
    q.addEventListener('input', () => d(q.value.trim()));
    q.addEventListener('keydown', e => {
      if (e.key === 'Enter' && q.value.trim()) {
        closeSearchOverlay();
        location.href = '/movies?q=' + encodeURIComponent(q.value.trim());
      }
      if (e.key === 'Escape') closeSearchOverlay();
    });
  }
}
function openSearchOverlay() {
  const ov = document.getElementById('search-overlay'); if (!ov) return;
  ov.classList.add('open');
  _sovOpen = true;
  const q = document.getElementById('sov-q');
  setTimeout(() => q?.focus(), 100);
  renderSovResults('');
}
function closeSearchOverlay() {
  const ov = document.getElementById('search-overlay'); if (!ov) return;
  ov.classList.remove('open');
  _sovOpen = false;
  const q = document.getElementById('sov-q'); if (q) q.value = '';
}
function renderSovResults(q) {
  const el = document.getElementById('sov-results'); if (!el) return;
  let movies;
  if (!q) {
    // Show recently watched first, then trending
    const watched = getWatched().slice(0, 4).map(w => DB.byId(w.id)).filter(Boolean);
    movies = watched.length ? watched : DB.all().filter(m => !m.upcoming).sort((a,b) => (b.rating||0)-(a.rating||0)).slice(0, 8);
  } else {
    movies = DB.all().filter(m => !m.upcoming &&
      (m.title.toLowerCase().includes(q.toLowerCase()) || (m.director||'').toLowerCase().includes(q.toLowerCase()))
    ).slice(0, 12);
  }
  if (!movies.length) {
    el.innerHTML = '<div class="sov-empty"><i class="ri-search-line"></i>No results found</div>';
    return;
  }
  el.innerHTML = movies.map(m =>
    `<div class="sov-item" onclick="closeSearchOverlay();goMovie(${m.id})" role="button">
      ${lz(m.poster, m.title, '', 'https://placehold.co/40x58/111827/555?text=?')}
      <div>
        <div class="sov-item-title">${esc(m.title)}</div>
        <div class="sov-item-meta">${m.year||''}${m.rating?' · ⭐ '+m.rating:''} · ${(m.genres||[])[0]||''}</div>
      </div>
    </div>`
  ).join('');
  observeLazy();
}

/* ── SETTINGS PANEL ── */
function initSettings() {
  // Settings background click closes panel
  const bg = document.getElementById('settings-bg');
  bg?.addEventListener('click', closeSettings);
}

function openSettings() {
  const panel = document.getElementById('settings-panel');
  const bg    = document.getElementById('settings-bg');
  panel?.classList.add('open');
  bg?.classList.add('open');
  renderWatchedInSettings();
  applyTheme(); // sync theme opts
}
function closeSettings() {
  document.getElementById('settings-panel')?.classList.remove('open');
  document.getElementById('settings-bg')?.classList.remove('open');
}

function renderWatchedInSettings() {
  const el = document.getElementById('sp-watched-list'); if (!el) return;
  const history = getWatched();
  if (!history.length) {
    el.innerHTML = '<div class="sp-empty">No watched history yet.<br>Click "Watch Now" on any movie.</div>';
    return;
  }
  el.innerHTML = history.slice(0, 12).map(w =>
    `<div class="watched-item" onclick="closeSettings();goMovieById(${w.id})" role="button" tabindex="0">
      ${lz(w.poster||'', w.title||'', 'watched-img', 'https://placehold.co/36x52/111827/555?text=?')}
      <div class="watched-info">
        <div class="watched-title">${esc(w.title||'')}</div>
        <div class="watched-meta">${w.year||''}${w.rating ? ' · ⭐ '+w.rating : ''}</div>
      </div>
    </div>`
  ).join('');
  observeLazy();
}

function clearWatchedHistory() {
  localStorage.removeItem('mn_watched');
  renderWatchedInSettings();
  showToast('Watch history cleared', 'info');
}

/* ── BACK TO TOP ── */
function initBtt() {
  const b = document.getElementById('btt'); if (!b) return;
  window.addEventListener('scroll', () => b.classList.toggle('on', window.scrollY > 600), { passive:true });
}

/* ── ROUTING ── */
function routePage() {
  const path = location.pathname.replace(/\/$/, '') || '/';
  if (path === '/' || path === '/index' || path === '/index.html') renderHome();
  else if (path === '/movies' || path === '/movies.html') renderMoviesPage();
  else if (path.startsWith('/movie/')) renderDetailPage();
  else if (path === '/upcoming' || path === '/upcoming.html') renderUpcomingPage();
}

/* ══════════════════════════════════════════════════
   MOVIE CARDS
══════════════════════════════════════════════════ */
function movieCard(m) {
  const wl = inWatchlist(m.id);
  const badge = m.isNew ? '<span class="card-badge new">NEW</span>' :
                m.featured ? '<span class="card-badge feat">PICK</span>' : '';
  return `<div class="movie-card" onclick="goMovie(${m.id})" role="button" tabindex="0" aria-label="${esc(m.title)}">
    <div class="card-poster">
      ${lz(m.poster, m.title, 'card-img', 'https://placehold.co/200x300/111827/555?text=?')}
      <div class="card-overlay"><button class="card-play" onclick="goMovie(${m.id});event.stopPropagation()"><i class="ri-play-fill"></i></button></div>
      <button class="wl-btn${wl?' active':''}" data-id="${m.id}" onclick="toggleWatchlist(${m.id});event.stopPropagation()" title="${wl?'Remove':'Save'}"><i class="ri-bookmark-${wl?'fill':'line'}"></i></button>
      ${badge}
    </div>
    <div class="card-info">
      <div class="card-title">${esc(m.title)}</div>
      <div class="card-meta">${m.year?`<span>${m.year}</span>`:''}${m.rating?`<span class="card-rating">⭐ ${m.rating}</span>`:''}</div>
    </div>
  </div>`;
}
function movieCardH(m) {
  return `<div class="mch" onclick="goMovie(${m.id})" role="button" tabindex="0">
    ${lz(m.poster, m.title, 'mch-img', 'https://placehold.co/44x64/111827/555?text=?')}
    <div class="mch-info">
      <div class="mch-title">${esc(m.title)}</div>
      <div class="mch-meta">${m.year||''}${m.rating?' · ⭐ '+m.rating:''}</div>
    </div>
  </div>`;
}

function renderRow(id, movies) {
  const el = document.getElementById(id); if (!el) return;
  el.innerHTML = '<div class="scroll-track">' +
    movies.map(m => `<div class="scroll-item">${movieCard(m)}</div>`).join('') +
    '</div>';
  observeLazy();
}
function renderGrid(id, movies) {
  const el = document.getElementById(id); if (!el) return;
  el.innerHTML = movies.map(m => movieCard(m)).join('');
  observeLazy();
}

/* ══════════════════════════════════════════════════
   HOME
══════════════════════════════════════════════════ */
function renderHome() {
  const all    = DB.all();
  const movies = all.filter(m => !m.upcoming);
  const featured = movies.filter(m => m.featured);
  const topRated = movies.filter(m => (m.rating||0) >= 8).sort((a,b) => b.rating - a.rating);
  const newMovies = movies.filter(m => m.isNew);
  const trending  = [...movies].sort((a,b) => (b.rating||0)-(a.rating||0));

  const statEl = document.getElementById('stat-movies');
  if (statEl) statEl.textContent = movies.length + '+';
  const genEl = document.getElementById('stat-genres');
  if (genEl) genEl.textContent = [...new Set(movies.flatMap(m=>m.genres||[]))].length;

  renderHero(featured.length ? featured : movies.slice(0,5));
  renderRow('trending-row', trending.slice(0,20));
  renderWatchThisWeek(movies);
  renderFeaturedStrip(movies);
  renderGenrePills(movies);
  renderGrid('top-rated-grid', topRated.slice(0,16));
  renderRow('new-row', (newMovies.length ? newMovies : movies.slice(0,12)).slice(0,16));
}

/* ── HERO ── */
let _heroIdx = 0, _heroTimer = null, _heroSlides = [];
const HERO_DUR = 7000;

function renderHero(movies) {
  _heroSlides = movies.slice(0,6);
  const slidesEl = document.getElementById('hero-slides');
  const infoEl   = document.getElementById('hero-info');
  const dotsEl   = document.getElementById('hero-dots');
  if (!slidesEl || !infoEl) return;
  slidesEl.innerHTML = _heroSlides.map((m,i) =>
    `<div class="hero-slide${i===0?' active':''}" data-i="${i}">
      <div class="hero-bg"><img ${i===0?`src="${esc(m.backdrop||m.poster)}"`:''} data-src="${esc(m.backdrop||m.poster)}" class="lazy${i===0?' loaded':''}" alt="" decoding="async" fetchpriority="${i===0?'high':'low'}"></div>
      <div class="hero-grad"></div>
    </div>`
  ).join('');
  if (dotsEl) {
    dotsEl.innerHTML = _heroSlides.map((_,i) =>
      `<button class="hero-dot${i===0?' active':''}" onclick="heroGoTo(${i})" aria-label="Slide ${i+1}"></button>`
    ).join('');
  }
  setHeroInfo(_heroSlides[0]);
  clearInterval(_heroTimer);
  _heroTimer = setInterval(() => heroGoTo((_heroIdx+1) % _heroSlides.length), HERO_DUR);
  observeLazy();
}
function setHeroInfo(m) {
  const el = document.getElementById('hero-info'); if (!el || !m) return;
  el.innerHTML = `
    <div class="hero-genres">${(m.genres||[]).slice(0,3).map(g=>`<span>${g}</span>`).join('')}</div>
    <h1 class="hero-title">${esc(m.title)}</h1>
    ${m.tagline?`<p class="hero-tagline">"${esc(m.tagline)}"</p>`:''}
    <div class="hero-meta">
      ${m.year?`<span>${m.year}</span>`:''}
      ${m.duration?`<span>${m.duration}</span>`:''}
      ${m.rating?`<span>⭐ ${m.rating}/10</span>`:''}
    </div>
    <p class="hero-desc">${esc((m.desc||'').slice(0,180))}${(m.desc||'').length>180?'…':''}</p>
    <div class="hero-btns">
      ${m.watchUrl?`<a href="${m.watchUrl}" target="_blank" rel="noopener" class="btn-hero-watch" onclick="trackWatch(${m.id})"><i class="ri-play-fill"></i>Watch Now</a>`:''}
      <button class="btn-hero-info" onclick="goMovie(${m.id})"><i class="ri-information-line"></i>More Info</button>
      ${m.trailer?`<button class="btn-hero-trailer" onclick="openTrailer('${m.trailer}','${esc(m.title).replace(/'/g,"\\'")}')"><i class="ri-play-circle-line"></i>Trailer</button>`:''}
    </div>`;
}
function heroGoTo(i) {
  const slides = document.querySelectorAll('.hero-slide');
  const dots   = document.querySelectorAll('.hero-dot');
  slides[_heroIdx]?.classList.remove('active');
  dots[_heroIdx]?.classList.remove('active');
  _heroIdx = i;
  slides[i]?.classList.add('active');
  dots[i]?.classList.add('active');
  setHeroInfo(_heroSlides[i]);
  observeLazy();
  clearInterval(_heroTimer);
  _heroTimer = setInterval(() => heroGoTo((_heroIdx+1) % _heroSlides.length), HERO_DUR);
}

/* ── WATCH THIS WEEK ── */
function renderWatchThisWeek(movies) {
  const el = document.getElementById('wtw-grid'); if (!el) return;
  // Deterministic weekly picks using week number as seed
  const week = Math.floor(Date.now() / (7 * 24 * 3600000));
  const pool = movies.filter(m => (m.rating||0) >= 7 && !m.upcoming);
  // Pseudo-shuffle with week seed
  const shuffled = [...pool].sort((a,b) => {
    const ha = (a.id * 2654435761 ^ week) >>> 0;
    const hb = (b.id * 2654435761 ^ week) >>> 0;
    return ha - hb;
  }).slice(0, 6);
  if (!shuffled.length) { el.closest?.('.section')?.style && (el.closest('.section').style.display='none'); return; }
  el.innerHTML = shuffled.map((m,i) =>
    `<div class="wtw-card" onclick="goMovie(${m.id})" role="button" tabindex="0">
      <div class="wtw-poster">
        ${lz(m.backdrop||m.poster, m.title, '', 'https://placehold.co/280x158/111827/555?text=?')}
        <div class="wtw-grad"></div>
        <div class="wtw-num">${String(i+1).padStart(2,'0')}</div>
      </div>
      <div class="wtw-body">
        <div class="wtw-genre">${(m.genres||[])[0]||'Film'}</div>
        <div class="wtw-title">${esc(m.title)}</div>
        <div class="wtw-meta">${m.year||''}${m.rating?' · ⭐ '+m.rating:''} · ${m.duration||''}</div>
      </div>
    </div>`
  ).join('');
  observeLazy();
}

/* ── FEATURED STRIP ── */
function renderFeaturedStrip(movies) {
  const el = document.getElementById('featured-strip'); if (!el) return;
  const main = movies.find(m => m.featured) || movies[0];
  const side = movies.filter(m => m.id !== main?.id && m.featured).slice(0,4);
  if (!main) return;
  el.innerHTML = `
    <div class="fs-main" onclick="goMovie(${main.id})" role="button" tabindex="0">
      ${lz(main.backdrop||main.poster, main.title, 'fs-bg', 'https://placehold.co/800x450/111827/555?text=?')}
      <div class="fs-grad"></div>
      <div class="fs-info">
        <div class="fs-tags">${(main.genres||[]).slice(0,2).map(g=>`<span>${g}</span>`).join('')}</div>
        <h3 class="fs-title">${esc(main.title)}</h3>
        <div class="fs-meta">${main.year||''}${main.rating?' · ⭐ '+main.rating:''}</div>
      </div>
    </div>
    <div class="fs-side">${side.map(m => movieCardH(m)).join('')}</div>`;
  observeLazy();
}

/* ── GENRE PILLS ── */
const GENRE_ICONS = {
  Action:'ri-sword-line', Drama:'ri-drama-line', Comedy:'ri-emotion-laugh-line',
  'Sci-Fi':'ri-rocket-line', Thriller:'ri-spy-line', Horror:'ri-skull-line',
  Romance:'ri-heart-line', Animation:'ri-paint-brush-line', Documentary:'ri-camera-line',
  Crime:'ri-police-car-line', Fantasy:'ri-magic-line', Adventure:'ri-compass-3-line',
};
function renderGenrePills(movies) {
  const pillsEl = document.getElementById('genre-pills');
  const gridEl  = document.getElementById('genre-grid');
  if (!pillsEl) return;
  const genres = [...new Set(movies.flatMap(m => m.genres||[]))].sort();
  let active = genres[0]||'';
  function showGenre(g) {
    active = g;
    pillsEl.querySelectorAll('.gpill').forEach(p => p.classList.toggle('active', p.dataset.g===g));
    if (gridEl) {
      gridEl.innerHTML = movies.filter(m => (m.genres||[]).includes(g)).map(m => movieCard(m)).join('');
      observeLazy();
    }
  }
  pillsEl.innerHTML = genres.map(g =>
    `<button class="gpill${g===active?' active':''}" data-g="${esc(g)}">
      <i class="${GENRE_ICONS[g]||'ri-film-line'}"></i>${esc(g)}
    </button>`
  ).join('');
  pillsEl.querySelectorAll('.gpill').forEach(p => {
    p.addEventListener('click', () => showGenre(p.dataset.g));
  });
  showGenre(active);
}

/* ══════════════════════════════════════════════════
   MOVIES PAGE
══════════════════════════════════════════════════ */
let _movState = { list:[], page:0, perPage:24, done:false, loading:false };
let _infObs = null;

function renderMoviesPage() {
  const all = DB.all().filter(m => !m.upcoming);
  const genSel = document.getElementById('filter-genre');
  if (genSel && genSel.options.length <= 1) {
    const genres = [...new Set(all.flatMap(m => m.genres||[]))].sort();
    genres.forEach(g => { const o = new Option(g,g); genSel.add(o); });
  }
  const params = new URLSearchParams(location.search);
  const fqEl = document.getElementById('filter-q');
  const fgEl = document.getElementById('filter-genre');
  const fsEl = document.getElementById('filter-sort');
  const ffEl = document.getElementById('filter-status');
  if (params.get('q') && fqEl) fqEl.value = params.get('q');
  if (params.get('genre') && fgEl) fgEl.value = params.get('genre');
  if (params.get('sort') && fsEl) fsEl.value = params.get('sort');
  if (params.get('filter') && ffEl) ffEl.value = params.get('filter');
  filterMovies();
  initInfiniteScroll();
}

window.filterMovies = function() {
  const q = (document.getElementById('filter-q')?.value||'').toLowerCase().trim();
  const g = document.getElementById('filter-genre')?.value||'';
  const s = document.getElementById('filter-sort')?.value||'';
  const f = document.getElementById('filter-status')?.value||'';
  let movies = DB.all().filter(m => !m.upcoming);
  if (q) movies = movies.filter(m => m.title.toLowerCase().includes(q)||(m.director||'').toLowerCase().includes(q));
  if (g) movies = movies.filter(m => (m.genres||[]).includes(g));
  if (f==='new')       movies = movies.filter(m => m.isNew);
  if (f==='featured')  movies = movies.filter(m => m.featured);
  if (f==='top')       movies = movies.filter(m => (m.rating||0) >= 8);
  if (f==='watchlist') { const wl=getWatchlist(); movies=movies.filter(m=>wl.has(String(m.id))); }
  if (f==='watched')   { const h=getWatched().map(x=>x.id); movies=movies.filter(m=>h.includes(m.id)); }
  if (s==='rating')    movies.sort((a,b)=>(b.rating||0)-(a.rating||0));
  else if (s==='year-desc') movies.sort((a,b)=>(b.year||0)-(a.year||0));
  else if (s==='year-asc')  movies.sort((a,b)=>(a.year||0)-(b.year||0));
  else if (s==='title')     movies.sort((a,b)=>a.title.localeCompare(b.title));
  _movState = { list:movies, page:0, perPage:24, done:false, loading:false };
  const grid  = document.getElementById('movies-grid');
  const empty = document.getElementById('movies-empty');
  const count = document.getElementById('result-count');
  if (count) count.textContent = movies.length + ' film' + (movies.length!==1?'s':'');
  if (grid) grid.innerHTML = '';
  if (empty) empty.style.display = 'none';
  if (!movies.length) { if (empty) empty.style.display=''; }
  else loadMoreMovies();
};

function loadMoreMovies() {
  if (_movState.done || _movState.loading) return;
  _movState.loading = true;
  const grid = document.getElementById('movies-grid'); if (!grid) { _movState.loading=false; return; }
  const batch = _movState.list.slice(_movState.page * _movState.perPage, (_movState.page+1) * _movState.perPage);
  if (!batch.length) { _movState.done=true; _movState.loading=false; return; }
  const frag = document.createDocumentFragment();
  batch.forEach(m => {
    const div = document.createElement('div');
    div.innerHTML = movieCard(m);
    frag.appendChild(div.firstChild);
  });
  grid.appendChild(frag);
  _movState.page++;
  _movState.done = (_movState.page * _movState.perPage) >= _movState.list.length;
  _movState.loading = false;
  observeLazy();
}
function initInfiniteScroll() {
  const s = document.getElementById('scroll-sentinel'); if (!s) return;
  _infObs?.disconnect();
  _infObs = new IntersectionObserver(entries => {
    if (entries[0].isIntersecting) loadMoreMovies();
  }, { rootMargin:'600px' });
  _infObs.observe(s);
}

/* ══════════════════════════════════════════════════
   MOVIE DETAIL
══════════════════════════════════════════════════ */
function getMovieBySlug(slug) {
  return DB.all().find(m => slugify(m.title) === slug) || null;
}
function renderDetailPage() {
  const el = document.getElementById('movie-page'); if (!el) return;
  const pathSlug = location.pathname.split('/movie/')[1]?.replace(/\/$/, '');
  let m = pathSlug ? getMovieBySlug(pathSlug) : null;
  if (!m) {
    const lid = parseInt(new URLSearchParams(location.search).get('id'));
    if (lid) { m = DB.byId(lid); if (m) history.replaceState(null, '', movieUrl(m)); }
  }
  if (!m) {
    el.innerHTML = '<div class="empty-state" style="padding-top:140px"><i class="ri-film-line"></i><p>Movie not found.</p><a href="/movies" class="btn-amber" style="margin-top:20px;display:inline-flex;gap:8px;align-items:center;padding:10px 20px"><i class="ri-arrow-left-line"></i>Browse Movies</a></div>';
    return;
  }
  document.title = m.title + ' — MovieNation';
  const md = document.querySelector('meta[name="description"]');
  if (md) md.content = (m.desc||m.title).slice(0,160);
  if (typeof MNAnalytics !== 'undefined') MNAnalytics.trackMovie(m.id, m.title);

  const related = DB.all().filter(x =>
    x.id !== m.id && !x.upcoming && (x.genres||[]).some(g => (m.genres||[]).includes(g))
  ).sort((a,b) => (b.rating||0)-(a.rating||0)).slice(0,6);

  el.innerHTML = `
    <div class="detail-hero">
      <div class="dh-bg">
        ${lz(m.backdrop||m.poster, m.title, 'dh-bg-img', 'https://placehold.co/1400x600/111827/333?text=?')}
        <div class="dh-grad"></div>
      </div>
      <div class="dh-content">
        <div class="wrap">
          <nav class="breadcrumb" aria-label="Breadcrumb">
            <a href="/">Home</a><i class="ri-arrow-right-s-line"></i>
            <a href="/movies">Movies</a><i class="ri-arrow-right-s-line"></i>
            <span>${esc(m.title)}</span>
          </nav>
          <div class="dh-inner">
            <div class="dh-poster-wrap">${lz(m.poster, m.title, 'dh-poster', 'https://placehold.co/280x420/111827/555?text=?')}</div>
            <div class="dh-info">
              <div class="dh-genres">${(m.genres||[]).map(g=>`<span class="dh-genre">${g}</span>`).join('')}</div>
              <h1 class="dh-title">${esc(m.title)}</h1>
              ${m.tagline?`<p class="dh-tagline">"${esc(m.tagline)}"</p>`:''}
              <div class="dh-meta-row">
                ${m.year?`<span><i class="ri-calendar-line"></i>${m.year}</span>`:''}
                ${m.duration?`<span><i class="ri-time-line"></i>${m.duration}</span>`:''}
                ${m.director?`<span><i class="ri-user-line"></i>${esc(m.director)}</span>`:''}
              </div>
              ${m.rating?`<div class="dh-rating-row">
                <span class="dh-score">${m.rating}</span><span class="dh-score-sub">/10 IMDb</span>
                ${m.votes?`<span class="dh-votes">${(m.votes/1000).toFixed(0)}k votes</span>`:''}
              </div>`:''}
              <div class="dh-btns">
                ${m.watchUrl?`<a href="${m.watchUrl}" target="_blank" rel="noopener" class="btn-amber" onclick="trackWatch(${m.id})"><i class="ri-play-fill"></i>Watch Now</a>`:''}
                ${m.downloadUrl?`<a href="${m.downloadUrl}" target="_blank" rel="noopener" class="btn-ghost"><i class="ri-download-line"></i>Download</a>`:''}
                ${m.trailer?`<button class="btn-outline-amber" onclick="openTrailer('${m.trailer}','${esc(m.title).replace(/'/g,"\\'")}')"><i class="ri-play-circle-line"></i>Trailer</button>`:''}
                <button class="btn-ghost" onclick="shareMovie('${esc(m.title).replace(/'/g,"\\'")}')"><i class="ri-share-line"></i>Share</button>
                <button class="btn-ghost wl-btn${inWatchlist(m.id)?' active':''}" data-id="${m.id}" onclick="toggleWatchlist(${m.id})">
                  <i class="ri-bookmark-${inWatchlist(m.id)?'fill':'line'}"></i>${inWatchlist(m.id)?'Saved':'Save'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="detail-body">
      <div class="wrap">
        <div class="detail-layout">
          <div class="detail-main">
            <div class="detail-section">
              <h3 class="sec-label">Overview</h3>
              <p class="desc-text">${esc(m.longDesc||m.desc||'')}</p>
            </div>
            ${m.cast&&m.cast.length?`
            <div class="detail-section">
              <h3 class="sec-label">Cast</h3>
              <div class="cast-row">${m.cast.map((name,i)=>
                `<div class="cast-card">${lz((m.castImg||[])[i]||'https://placehold.co/64x64/111827/555?text=?',name,'cast-img')}<div class="cast-name">${esc(name)}</div></div>`
              ).join('')}</div>
            </div>`:''}
            <div class="detail-section">
              <h3 class="sec-label">Film Details</h3>
              <div class="facts-grid">
                ${m.director?`<div class="fact"><div class="fact-label">Director</div><div class="fact-val">${esc(m.director)}</div></div>`:''}
                ${m.studio?`<div class="fact"><div class="fact-label">Studio</div><div class="fact-val">${esc(m.studio)}</div></div>`:''}
                ${m.year?`<div class="fact"><div class="fact-label">Year</div><div class="fact-val">${m.year}</div></div>`:''}
                ${m.duration?`<div class="fact"><div class="fact-label">Runtime</div><div class="fact-val">${m.duration}</div></div>`:''}
                ${m.rating?`<div class="fact"><div class="fact-label">IMDb</div><div class="fact-val">⭐ ${m.rating}/10</div></div>`:''}
                ${m.votes?`<div class="fact"><div class="fact-label">Votes</div><div class="fact-val">${m.votes.toLocaleString()}</div></div>`:''}
                ${(m.genres||[]).length?`<div class="fact"><div class="fact-label">Genres</div><div class="fact-val">${(m.genres||[]).join(', ')}</div></div>`:''}
              </div>
            </div>
            ${m.trailer?`
            <div class="detail-section">
              <h3 class="sec-label">Official Trailer</h3>
              <div class="vid-wrap"><iframe src="https://www.youtube.com/embed/${m.trailer}?rel=0&modestbranding=1" title="${esc(m.title)} trailer" allowfullscreen loading="lazy"></iframe></div>
            </div>`:''}
          </div>
          <div class="detail-side">
            ${related.length?`
            <div class="scard">
              <h4 class="scard-title">You May Also Like</h4>
              <div class="related-list">${related.map(x => movieCardH(x)).join('')}</div>
            </div>`:''}
            <div class="scard scard-cta">
              <i class="ri-compass-3-line"></i>
              <h4>Explore More Films</h4>
              <p>Discover hundreds of movies across all genres.</p>
              <a href="/movies" class="btn-amber"><i class="ri-film-line"></i>Browse All Movies</a>
            </div>
          </div>
        </div>
      </div>
    </div>`;
  observeLazy();
}

/* ── TRACK WATCH ── */
function trackWatch(id) {
  const m = DB.byId(id); if (!m) return;
  addWatched(m);
}
function goMovieById(id) {
  const m = DB.byId(id); if (!m) return;
  location.href = movieUrl(m);
}

/* ══════════════════════════════════════════════════
   UPCOMING
══════════════════════════════════════════════════ */
function renderUpcomingPage() {
  const el = document.getElementById('upcoming-grid')||document.getElementById('upcoming-page');
  if (!el) return;
  const movies = DB.all().filter(m=>m.upcoming).sort((a,b)=>{
    if (!a.releaseDate) return 1; if (!b.releaseDate) return -1;
    return new Date(a.releaseDate)-new Date(b.releaseDate);
  });
  if (!movies.length) { el.innerHTML='<div class="empty-state"><i class="ri-time-line"></i><p>No upcoming movies yet.</p></div>'; return; }
  el.innerHTML = movies.map(m => {
    const cd = getCountdown(m.releaseDate);
    return `<div class="uc-card">
      <div class="uc-poster">
        ${lz(m.backdrop||m.poster,m.title,'uc-img','https://placehold.co/360x203/111827/555?text=?')}
        <div class="uc-gradient"></div>
        <div class="uc-countdown">
          ${cd ? Object.entries(cd).map(([k,v])=>`<div class="cd-box"><span class="cd-num">${v}</span><div class="cd-label">${k}</div></div>`).join('')
               : '<div class="cd-box" style="flex:4"><span class="cd-num" style="font-size:.9rem">Coming Soon</span></div>'}
        </div>
      </div>
      <div class="uc-body">
        <div class="uc-genre">${(m.genres||[])[0]||'Film'}</div>
        <h3 class="uc-title">${esc(m.title)}</h3>
        <p class="uc-desc">${esc(m.desc||'')}</p>
        <div class="uc-foot">
          ${m.releaseDate?`<span><i class="ri-calendar-line"></i>${new Date(m.releaseDate).toLocaleDateString('en-US',{year:'numeric',month:'long',day:'numeric'})}</span>`:'<span></span>'}
          ${m.trailer?`<button class="btn-outline-amber" onclick="openTrailer('${m.trailer}','${esc(m.title).replace(/'/g,"\\'")}')"><i class="ri-play-fill"></i>Trailer</button>`:''}
        </div>
      </div>
    </div>`;
  }).join('');
  observeLazy();
}
function getCountdown(dateStr) {
  if (!dateStr) return null;
  const diff = new Date(dateStr)-Date.now();
  if (diff <= 0) return null;
  const d=Math.floor(diff/86400000),h=Math.floor((diff%86400000)/3600000),mn=Math.floor((diff%3600000)/60000),s=Math.floor((diff%60000)/1000);
  return { Days:String(d).padStart(2,'0'),Hrs:String(h).padStart(2,'0'),Min:String(mn).padStart(2,'0'),Sec:String(s).padStart(2,'0') };
}
setInterval(() => {
  const path = location.pathname;
  if (path !== '/upcoming' && !path.includes('upcoming')) return;
  document.querySelectorAll('.uc-card').forEach(card => {
    const titleEl = card.querySelector('.uc-title'); if (!titleEl) return;
    const m = DB.all().find(x => x.title === titleEl.textContent);
    if (!m?.releaseDate) return;
    const cd = getCountdown(m.releaseDate); if (!cd) return;
    const nums = card.querySelectorAll('.cd-num');
    Object.values(cd).forEach((v,i) => { if (nums[i]) nums[i].textContent = v; });
  });
}, 1000);

/* ── TRAILER ── */
function openTrailer(id, title) {
  const modal = document.getElementById('tm'); if (!modal) return;
  modal.querySelector('.trailer-title').textContent = title||'';
  modal.querySelector('.vid-wrap').innerHTML = `<iframe src="https://www.youtube.com/embed/${id}?autoplay=1&rel=0" allowfullscreen allow="autoplay"></iframe>`;
  modal.classList.add('open');
  document.body.style.overflow = 'hidden';
}
function closeTrailer() {
  const modal = document.getElementById('tm'); if (!modal) return;
  modal.querySelector('.vid-wrap').innerHTML = '';
  modal.classList.remove('open');
  document.body.style.overflow = '';
}
document.addEventListener('keydown', e => {
  if (e.key === 'Escape') {
    closeTrailer(); closeDrop(); closeSearchOverlay(); closeSettings();
  }
});

/* ── SHARE ── */
function shareMovie(title) {
  const url = location.origin + location.pathname;
  if (navigator.share) navigator.share({ title, url }).catch(()=>{});
  else navigator.clipboard?.writeText(url)
    .then(() => showToast('Link copied to clipboard', 'success'))
    .catch(() => showToast('Copy the URL from the address bar', 'info'));
}

/* ── TOAST ── */
function showToast(msg, type='info') {
  const c = document.getElementById('toasts'); if (!c) return;
  const icons = { success:'ri-checkbox-circle-fill', error:'ri-close-circle-fill', info:'ri-information-fill', warn:'ri-alert-fill' };
  const t = document.createElement('div');
  t.className = `toast ${type}`;
  t.innerHTML = `<i class="${icons[type]||icons.info}"></i><span>${msg}</span>`;
  c.appendChild(t);
  setTimeout(() => {
    t.style.transition = 'opacity .3s, transform .3s';
    t.style.opacity = '0';
    t.style.transform = 'translateX(110%)';
    setTimeout(() => t.remove(), 320);
  }, 3000);
}

/* ── GO MOVIE ── */
function goMovie(id) {
  const m = DB.byId(id); if (!m) return;
  if (typeof MNAnalytics !== 'undefined') MNAnalytics.trackMovie(id, m.title);
  location.href = movieUrl(m);
}
