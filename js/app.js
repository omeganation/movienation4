/* =====================================================
   MOVIENATION APP v6 — Public Site Logic
   ===================================================== */

document.addEventListener('DOMContentLoaded', () => {
  initPreloader();
  initTheme();
  initNav();
  initSearch();
  initBtt();

  // Track page view
  if (typeof MNAnalytics !== 'undefined') {
    MNAnalytics.trackPage(location.pathname.split('/').pop() || 'index.html');
  }

  DB.onReady(() => {
    routePage();
    setActiveLink();
  });

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
    setTimeout(() => { try { p.remove() } catch(e) {} }, 700);
  }
  window.addEventListener('load', () => setTimeout(hide, 120), { once: true });
  setTimeout(hide, 2800);
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
function applyTheme() { document.documentElement.setAttribute('data-theme', dark ? 'dark' : 'light'); }
function toggleTheme() {
  dark = !dark;
  localStorage.setItem('mn_theme', dark ? 'dark' : 'light');
  applyTheme();
  document.querySelectorAll('.theme-btn').forEach(b => {
    b.innerHTML = dark ? '<i class="ri-moon-line"></i>' : '<i class="ri-sun-line"></i>';
  });
}

/* ── NAV ── */
function initNav() {
  window.addEventListener('scroll', () => {
    document.getElementById('nav')?.classList.toggle('scrolled', window.scrollY > 40);
  }, { passive: true });
}
function toggleNav() {
  const mnav = document.getElementById('mnav');
  mnav?.classList.toggle('open');
}

/* ── SEARCH ── */
function initSearch() {
  const inputs = [document.getElementById('nav-q'), document.getElementById('filter-q')].filter(Boolean);
  inputs.forEach(inp => {
    if (inp.id === 'nav-q') {
      inp.addEventListener('input', () => renderDrop(inp.value.trim()));
      inp.addEventListener('keydown', e => {
        if (e.key === 'Enter' && inp.value.trim()) {
          location.href = 'movies.html?q=' + encodeURIComponent(inp.value.trim());
        }
        if (e.key === 'Escape') closeDrop();
      });
      document.addEventListener('click', e => {
        if (!inp.closest('.nav-search')?.contains(e.target)) closeDrop();
      });
    }
  });
}
function renderDrop(q) {
  const drop = document.getElementById('sdrop'); if (!drop) return;
  if (!q) { drop.classList.remove('on'); drop.innerHTML = ''; return; }
  const results = DB.all().filter(m => m.title.toLowerCase().includes(q.toLowerCase())).slice(0, 7);
  if (!results.length) {
    drop.innerHTML = '<div class="sdrop-empty"><i class="ri-search-line"></i> No results</div>';
  } else {
    drop.innerHTML = results.map(m =>
      `<div class="sdrop-item" onclick="goMovie(${m.id})">
        <img src="${m.poster}" onerror="this.src='https://placehold.co/34x50/0f1623/e8b84b?text=?'" alt="">
        <div><div class="sdrop-title">${esc(m.title)}</div><div class="sdrop-meta">${m.year}${m.rating ? ' · ⭐' + m.rating : ''} · ${(m.genres||[])[0]||''}</div></div>
      </div>`
    ).join('');
  }
  drop.classList.add('on');
}
function closeDrop() {
  const d = document.getElementById('sdrop'); if (d) { d.classList.remove('on'); d.innerHTML = ''; }
}

/* ── BACK TO TOP ── */
function initBtt() {
  const b = document.getElementById('btt'); if (!b) return;
  window.addEventListener('scroll', () => b.classList.toggle('on', window.scrollY > 500), { passive: true });
}

/* ── ROUTE ── */
function routePage() {
  const page = location.pathname.split('/').pop() || 'index.html';
  if (page === 'index.html' || page === '' || page === '/') renderHome();
  else if (page === 'movies.html')   renderMoviesPage();
  else if (page === 'movie.html')    renderDetailPage();
  else if (page === 'upcoming.html') renderUpcomingPage();
}

function setActiveLink() {
  const page = location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a').forEach(a => {
    a.classList.toggle('active', a.getAttribute('href')?.includes(page));
  });
}

/* ══════════════════════════════════════════════════
   HOME PAGE
══════════════════════════════════════════════════ */
function renderHome() {
  const movies = DB.all();
  const featured = movies.filter(m => m.featured);
  const topRated = movies.filter(m => m.rating >= 8).sort((a,b) => b.rating - a.rating);
  const newMovies = movies.filter(m => m.isNew);
  const trending = [...movies].sort((a,b) => (b.rating||0)-(a.rating||0)).slice(0, 12);

  // Update stats
  const el = document.getElementById('stat-movies');
  if (el) el.textContent = movies.filter(m => !m.upcoming).length + '+';

  renderHero(featured.length ? featured : movies.slice(0, 5));
  renderRow('trending-row', trending, 12);
  renderFeaturedStrip(movies);
  renderGenrePills(movies);
  renderRow('top-rated-grid', topRated, 8, true);
  renderRow('new-row', newMovies.length ? newMovies : movies.slice(0, 8));
}

/* ── HERO ── */
let _heroIdx = 0, _heroTimer = null, _heroSlides = [], _heroProgress = 0, _heroPTimer = null;
const HERO_DUR = 6000;

function renderHero(slides) {
  _heroSlides = slides.slice(0, 6);
  const container = document.getElementById('hero-slides');
  const dotsEl    = document.getElementById('hero-dots');
  if (!container || !_heroSlides.length) return;

  container.innerHTML = _heroSlides.map((m, i) => `
    <div class="hero-slide${i===0?' active':''}" data-idx="${i}">
      <div class="hero-bg"><img src="${m.backdrop||m.poster}" loading="${i===0?'eager':'lazy'}" alt="${esc(m.title)}"></div>
      <div class="hero-overlay"></div>
    </div>`).join('');

  if (dotsEl) dotsEl.innerHTML = _heroSlides.map((_,i) => `<div class="hero-dot${i===0?' active':''}" onclick="goHeroSlide(${i})"></div>`).join('');

  renderHeroInfo(0);
  startHeroTimer();
}

function renderHeroInfo(idx) {
  const m = _heroSlides[idx]; if (!m) return;
  const el = document.getElementById('hero-info'); if (!el) return;
  const stars = m.rating ? Math.round(m.rating / 2) : 0;
  el.innerHTML = `
    <div class="hero-badge"><i class="ri-fire-fill"></i> ${m.featured ? 'Featured' : m.isNew ? 'New Release' : 'Trending'}</div>
    <h1 class="hero-title">${esc(m.title)}</h1>
    <div class="hero-meta">
      ${m.rating ? `<span class="hero-rating"><i class="ri-star-fill"></i>${m.rating}</span>` : ''}
      ${m.year ? `<span class="hero-year">${m.year}</span>` : ''}
      ${m.duration ? `<span class="hero-dur"><i class="ri-time-line"></i>${m.duration}</span>` : ''}
      ${(m.genres||[]).slice(0,2).map(g => `<span class="hero-genre-tag">${g}</span>`).join('')}
    </div>
    <p class="hero-desc">${esc(m.desc||'')}</p>
    <div class="hero-btns">

      <button class="btn-hero-info" onclick="goMovie(${m.id})"><i class="ri-information-line"></i> More Info</button>
      ${m.trailer ? `<button class="btn-hero-info" onclick="openTrailer('${m.trailer}','${esc(m.title).replace(/'/g,"\\'")}')"><i class="ri-play-circle-line"></i> Trailer</button>` : ''}
    </div>`;
}

function goHeroSlide(idx) {
  clearTimeout(_heroTimer);
  clearInterval(_heroPTimer);
  document.querySelectorAll('.hero-slide').forEach((s,i) => s.classList.toggle('active', i === idx));
  document.querySelectorAll('.hero-dot').forEach((d,i) => d.classList.toggle('active', i === idx));
  _heroIdx = idx;
  renderHeroInfo(idx);
  _heroProgress = 0;
  updateProgress();
  startHeroTimer();
}

function startHeroTimer() {
  clearInterval(_heroPTimer);
  _heroProgress = 0;
  const bar = document.getElementById('hero-progress');
  const step = 100 / (HERO_DUR / 100);
  _heroPTimer = setInterval(() => {
    _heroProgress = Math.min(_heroProgress + step, 100);
    if (bar) bar.style.width = _heroProgress + '%';
    if (_heroProgress >= 100) {
      clearInterval(_heroPTimer);
      const next = (_heroIdx + 1) % _heroSlides.length;
      goHeroSlide(next);
    }
  }, 100);
}
function updateProgress() { const b = document.getElementById('hero-progress'); if(b) b.style.width = '0%'; }

/* ── FEATURED STRIP ── */
function renderFeaturedStrip(movies) {
  const el = document.getElementById('featured-strip'); if (!el) return;
  const top = movies.filter(m => m.featured || m.rating >= 8).sort((a,b) => b.rating - a.rating);
  const main = top[0] || movies[0];
  const sides = top.slice(1, 4);
  if (!main) return;

  el.innerHTML = `
    <div class="featured-main" onclick="goMovie(${main.id})">
      <img src="${main.backdrop||main.poster}" alt="${esc(main.title)}" loading="lazy">
      <div class="fm-overlay"></div>
      <div class="fm-info">
        <h3 class="fm-title">${esc(main.title)}</h3>
        <div class="fm-meta">
          ${main.rating ? `<span>⭐ ${main.rating}</span>` : ''}
          <span>${main.year||''}</span>
          ${(main.genres||[]).slice(0,2).map(g=>`<span>${g}</span>`).join('')}
        </div>
        <button class="fm-btn" onclick="event.stopPropagation();goMovie(${main.id})"><i class="ri-play-fill"></i> Watch Now</button>
      </div>
    </div>
    <div class="featured-side">
      ${sides.map(m => `
        <div class="fs-card" onclick="goMovie(${m.id})">
          <img class="fs-poster" src="${m.poster}" onerror="this.src='https://placehold.co/58x84/0f1623/e8b84b?text=?'" alt="${esc(m.title)}" loading="lazy">
          <div class="fs-info">
            <div class="fs-title">${esc(m.title)}</div>
            <div class="fs-meta">${m.year||''}${m.rating?' · ⭐'+m.rating:''}</div>
            <span class="fs-badge ${m.isNew?'bd-new':m.featured?'bd-feat':'bd-top'}" style="background:rgba(232,184,75,.12);color:var(--gold)">${(m.genres||[])[0]||'Film'}</span>
          </div>
        </div>`).join('')}
    </div>`;
}

/* ── GENRE PILLS + GRID ── */
let _activeGenre = 'All';
function renderGenrePills(movies) {
  const pillsEl = document.getElementById('genre-pills'); if (!pillsEl) return;
  const genres = ['All', ...new Set(movies.flatMap(m => m.genres))].slice(0, 12);
  pillsEl.innerHTML = genres.map(g =>
    `<button class="gpill${g===_activeGenre?' active':''}" onclick="setGenre('${g}')">${g}</button>`
  ).join('');
  renderGenreGrid(movies);
}
function setGenre(g) {
  _activeGenre = g;
  const movies = DB.all();
  document.querySelectorAll('.gpill').forEach(p => p.classList.toggle('active', p.textContent === g));
  renderGenreGrid(movies);
}
function renderGenreGrid(movies) {
  const el = document.getElementById('genre-grid'); if (!el) return;
  const filtered = _activeGenre === 'All' ? movies.filter(m => !m.upcoming) : movies.filter(m => (m.genres||[]).includes(_activeGenre));
  el.innerHTML = filtered.slice(0, 8).map(m => movieCard(m)).join('');
}

/* ── CARD ROWS ── */
function renderRow(id, movies, max = 10, grid = false) {
  const el = document.getElementById(id); if (!el) return;
  el.innerHTML = movies.slice(0, max).map(m => movieCard(m)).join('');
}

/* ── MOVIE CARD HTML ── */
function movieCard(m) {
  const badge = m.upcoming ? `<span class="mc-badge bd-soon">Soon</span>` :
                m.badge === 'top' ? `<span class="mc-badge bd-top">★ Top</span>` :
                m.isNew ? `<span class="mc-badge bd-new">New</span>` :
                m.featured ? `<span class="mc-badge bd-feat">Featured</span>` : '';
  return `<div class="movie-card" onclick="goMovie(${m.id})">
    <div class="mc-poster">
      <img src="${m.poster}" onerror="this.src='https://placehold.co/200x300/0f1623/e8b84b?text=?'" alt="${esc(m.title)}" loading="lazy">
      <div class="mc-overlay"></div>
      <div class="mc-play"><i class="ri-play-fill"></i></div>
      ${badge}
    </div>
    <div class="mc-info">
      <div class="mc-title" title="${esc(m.title)}">${esc(m.title)}</div>
      <div class="mc-meta">
        <span>${m.year||'—'}</span>
        ${m.rating ? `<span class="mc-rating"><i class="ri-star-fill"></i>${m.rating}</span>` : ''}
      </div>
    </div>
  </div>`;
}

/* ══════════════════════════════════════════════════
   MOVIES PAGE
══════════════════════════════════════════════════ */
function renderMoviesPage() {
  // Pre-fill from URL params
  const params = new URLSearchParams(location.search);
  const q      = params.get('q') || '';
  const genre  = params.get('genre') || '';
  const filter = params.get('filter') || '';
  const sort   = params.get('sort') || '';
  if (q) { const el = document.getElementById('filter-q'); if(el) el.value = q; }

  // Populate genre select
  const gs = document.getElementById('filter-genre');
  if (gs && gs.options.length <= 1) {
    [...new Set(DB.all().flatMap(m => m.genres))].sort().forEach(g => {
      const o = document.createElement('option'); o.value = o.textContent = g;
      if (g === genre) o.selected = true;
      gs.appendChild(o);
    });
  }
  if (filter) { const el = document.getElementById('filter-status'); if(el) el.value = filter; }
  if (sort)   { const el = document.getElementById('filter-sort');   if(el) el.value = sort; }

  filterMovies();
}

function filterMovies() {
  const q      = (document.getElementById('filter-q') || {value:''}).value.trim().toLowerCase();
  const genre  = (document.getElementById('filter-genre') || {value:''}).value;
  const sort   = (document.getElementById('filter-sort') || {value:''}).value;
  const status = (document.getElementById('filter-status') || {value:''}).value;

  let mv = DB.all().filter(m => !m.upcoming);
  if (q)               mv = mv.filter(m => m.title.toLowerCase().includes(q) || (m.director||'').toLowerCase().includes(q));
  if (genre)           mv = mv.filter(m => (m.genres||[]).includes(genre));
  if (status==='new')      mv = mv.filter(m => m.isNew);
  if (status==='featured') mv = mv.filter(m => m.featured);
  if (status==='top')      mv = mv.filter(m => m.rating >= 8);
  if (sort==='rating')     mv = mv.sort((a,b) => (b.rating||0)-(a.rating||0));
  if (sort==='year-desc')  mv = mv.sort((a,b) => (b.year||0)-(a.year||0));
  if (sort==='year-asc')   mv = mv.sort((a,b) => (a.year||0)-(b.year||0));
  if (sort==='title')      mv = mv.sort((a,b) => a.title.localeCompare(b.title));

  const grid  = document.getElementById('movies-grid');
  const empty = document.getElementById('movies-empty');
  const cnt   = document.getElementById('result-count');
  if (cnt) cnt.textContent = mv.length + ' film' + (mv.length !== 1 ? 's' : '');
  if (!mv.length) {
    if (grid)  grid.innerHTML = '';
    if (empty) empty.style.display = 'block';
  } else {
    if (empty) empty.style.display = 'none';
    if (grid)  grid.innerHTML = mv.map(m => movieCard(m)).join('');
  }
}

/* ══════════════════════════════════════════════════
   MOVIE DETAIL PAGE
══════════════════════════════════════════════════ */
function renderDetailPage() {
  const id = new URLSearchParams(location.search).get('id');
  const m  = DB.byId(id);
  const el = document.getElementById('movie-page');
  if (!el) return;

  if (!m) {
    el.innerHTML = `<div class="empty-state" style="padding-top:140px"><i class="ri-film-line"></i><p>Movie not found. <a href="movies.html" style="color:var(--gold)">Browse all movies</a></p></div>`;
    return;
  }

  // Track movie view
  if (typeof MNAnalytics !== 'undefined') MNAnalytics.trackMovie(m.id, m.title);

  document.title = `${m.title} — MovieNation`;

  const related = DB.all().filter(x => x.id !== m.id && x.genres.some(g => m.genres.includes(g))).slice(0, 5);
  const stars = Math.round((m.rating||0) / 2);

  el.innerHTML = `
    <div class="detail-hero" style="padding-top:var(--nav-h)">
      <div class="detail-backdrop"><img src="${m.backdrop||m.poster}" alt="${esc(m.title)}" loading="eager"></div>
      <div class="detail-hero-content">
        <div class="dh-inner">
          <div class="dh-poster"><img src="${m.poster}" alt="${esc(m.title)}"></div>
          <div class="dh-info">
            <div class="dh-genres">${(m.genres||[]).map(g=>`<span class="dh-genre">${g}</span>`).join('')}</div>
            <h1 class="dh-title">${esc(m.title)}</h1>
            ${m.tagline ? `<p class="dh-tagline">"${esc(m.tagline)}"</p>` : ''}
            <div class="dh-meta">
              ${m.year ? `<span class="dh-tag"><i class="ri-calendar-line"></i>${m.year}</span>` : ''}
              ${m.duration ? `<span class="dh-tag"><i class="ri-time-line"></i>${m.duration}</span>` : ''}
              ${m.director ? `<span class="dh-tag"><i class="ri-user-line"></i>${esc(m.director)}</span>` : ''}
              ${m.studio ? `<span class="dh-tag"><i class="ri-building-line"></i>${esc(m.studio)}</span>` : ''}
            </div>
            ${m.rating ? `<div class="dh-rating-big">
              <span class="dh-score">⭐ ${m.rating}</span>
              ${m.votes ? `<span class="dh-votes">${(m.votes/1000).toFixed(0)}k ratings</span>` : ''}
            </div>` : ''}
            <div class="dh-btns">
              ${m.watchUrl ? `<a href="${m.watchUrl}" target="_blank" class="btn-amber"><i class="ri-play-fill"></i> Watch Now</a>` : ''}
              ${m.downloadUrl ? `<a href="${m.downloadUrl}" target="_blank" class="btn-ghost"><i class="ri-download-line"></i> Download</a>` : ''}
              ${m.trailer ? `<button class="btn-outline-gold" onclick="openTrailer('${m.trailer}','${esc(m.title).replace(/'/g,"\\'")}')"><i class="ri-play-circle-line"></i> Trailer</button>` : ''}
              <button class="btn-ghost" onclick="shareMovie('${esc(m.title).replace(/'/g,"\\'")}')"><i class="ri-share-line"></i> Share</button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="detail-body">
      <div class="detail-layout">
        <div>
          <div class="sec-label">Overview</div>
          <p class="desc-text">${esc(m.longDesc || m.desc || '')}</p>

          ${m.cast && m.cast.length ? `
          <div style="margin-bottom:clamp(28px,5vw,40px)">
            <div class="sec-label">Cast</div>
            <div class="cast-row">
              ${m.cast.map((name,i) => `
              <div class="cast-card">
                <img src="${(m.castImg||[])[i]||'https://placehold.co/66x66/0f1623/8899bb?text=?'}" onerror="this.src='https://placehold.co/66x66/0f1623/8899bb?text=?'" alt="${esc(name)}" loading="lazy">
                <div class="cast-name">${esc(name)}</div>
              </div>`).join('')}
            </div>
          </div>` : ''}

          <div class="sec-label" style="margin-bottom:14px">Film Details</div>
          <div class="facts-grid">
            ${m.director ? `<div class="fact"><div class="fact-label">Director</div><div class="fact-val">${esc(m.director)}</div></div>` : ''}
            ${m.studio   ? `<div class="fact"><div class="fact-label">Studio</div><div class="fact-val">${esc(m.studio)}</div></div>` : ''}
            ${m.year     ? `<div class="fact"><div class="fact-label">Year</div><div class="fact-val">${m.year}</div></div>` : ''}
            ${m.duration ? `<div class="fact"><div class="fact-label">Duration</div><div class="fact-val">${esc(m.duration)}</div></div>` : ''}
            ${m.rating   ? `<div class="fact"><div class="fact-label">IMDb Rating</div><div class="fact-val">⭐ ${m.rating}/10</div></div>` : ''}
            ${m.votes    ? `<div class="fact"><div class="fact-label">Votes</div><div class="fact-val">${m.votes.toLocaleString()}</div></div>` : ''}
          </div>

          ${m.trailer ? `
          <div style="margin-bottom:clamp(28px,5vw,40px)">
            <div class="sec-label" style="margin-bottom:14px">Official Trailer</div>
            <div class="vid-wrap">
              <iframe src="https://www.youtube.com/embed/${m.trailer}?rel=0&modestbranding=1" title="${esc(m.title)} trailer" allowfullscreen loading="lazy"></iframe>
            </div>
          </div>` : ''}
        </div>

        <div>
          ${related.length ? `
          <div class="scard">
            <h4>You May Also Like</h4>
            ${related.map(x => `
            <div class="ri-item" onclick="goMovie(${x.id})">
              <img src="${x.poster}" onerror="this.src='https://placehold.co/40x58/0f1623/e8b84b?text=?'" alt="${esc(x.title)}" loading="lazy">
              <div><div class="ri-title">${esc(x.title)}</div><div class="ri-meta">${x.year}${x.rating?' · ⭐'+x.rating:''}</div></div>
            </div>`).join('')}
          </div>` : ''}

          <div class="scard" style="text-align:center">
            <i class="ri-film-2-line" style="font-size:2rem;color:var(--gold);margin-bottom:10px;display:block"></i>
            <h4>Discover More Films</h4>
            <p style="font-size:.82rem;color:var(--muted);margin-bottom:16px;line-height:1.65">Explore hundreds of films across all genres.</p>
            <a href="movies.html" class="btn-amber" style="font-size:.78rem;padding:9px 16px;width:100%;justify-content:center"><i class="ri-compass-3-line"></i>Browse All Movies</a>
          </div>
        </div>
      </div>
    </div>`;
}

/* ══════════════════════════════════════════════════
   UPCOMING PAGE
══════════════════════════════════════════════════ */
function renderUpcomingPage() {
  const el = document.getElementById('upcoming-grid') || document.getElementById('upcoming-page');
  if (!el) return;
  const movies = DB.all().filter(m => m.upcoming).sort((a,b) => {
    if (!a.releaseDate) return 1; if (!b.releaseDate) return -1;
    return new Date(a.releaseDate) - new Date(b.releaseDate);
  });
  if (!movies.length) { el.innerHTML = '<div class="empty-state"><i class="ri-time-line"></i><p>No upcoming movies yet.</p></div>'; return; }
  el.innerHTML = movies.map(m => {
    const countdown = getCountdown(m.releaseDate);
    return `<div class="uc-card">
      <div class="uc-poster">
        <img src="${m.backdrop||m.poster}" onerror="this.src='https://placehold.co/360x203/0f1623/e8b84b?text=?'" alt="${esc(m.title)}" loading="lazy">
        <div class="uc-countdown">
          ${countdown ? Object.entries(countdown).map(([k,v]) => `<div class="cd-box"><span class="cd-num">${v}</span><div class="cd-label">${k}</div></div>`).join('') : '<div class="cd-box" style="flex:4"><span class="cd-num" style="font-size:.9rem">Coming Soon</span></div>'}
        </div>
      </div>
      <div class="uc-body">
        <div class="uc-genre">${(m.genres||[])[0]||'Film'}</div>
        <h3 class="uc-title">${esc(m.title)}</h3>
        <p class="uc-desc">${esc(m.desc||'')}</p>
        <div class="uc-foot">
          ${m.releaseDate ? `<span class="uc-date"><i class="ri-calendar-line"></i>${new Date(m.releaseDate).toLocaleDateString('en-US',{year:'numeric',month:'long',day:'numeric'})}</span>` : '<span></span>'}
          ${m.trailer ? `<button class="btn-outline-gold" style="padding:7px 14px;font-size:.76rem" onclick="openTrailer('${m.trailer}','${esc(m.title).replace(/'/g,"\\'")}')"><i class="ri-play-fill"></i> Trailer</button>` : ''}
        </div>
      </div>
    </div>`;
  }).join('');
}

function getCountdown(dateStr) {
  if (!dateStr) return null;
  const diff = new Date(dateStr) - Date.now();
  if (diff <= 0) return null;
  const d = Math.floor(diff / 86400000);
  const h = Math.floor((diff % 86400000) / 3600000);
  const m = Math.floor((diff % 3600000) / 60000);
  const s = Math.floor((diff % 60000) / 1000);
  return { Days:String(d).padStart(2,'0'), Hrs:String(h).padStart(2,'0'), Min:String(m).padStart(2,'0'), Sec:String(s).padStart(2,'0') };
}

/* Live countdown tick */
setInterval(() => {
  if (location.pathname.includes('upcoming')) renderUpcomingPage();
}, 1000);

/* ── TRAILER MODAL ── */
function openTrailer(id, title) {
  const modal = document.getElementById('tm'); if (!modal) return;
  modal.querySelector('.trailer-title').textContent = title || '';
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
document.addEventListener('keydown', e => { if (e.key === 'Escape') { closeTrailer(); closeDrop(); const m=document.getElementById('mnav'); if(m) m.classList.remove('open'); } });

/* ── SHARE ── */
function shareMovie(title) {
  if (navigator.share) {
    navigator.share({ title, url: location.href }).catch(() => {});
  } else {
    navigator.clipboard?.writeText(location.href)
      .then(() => showToast('Link copied!', 'success'))
      .catch(() => showToast('Copy the URL from the address bar.', 'info'));
  }
}

/* ── TOAST ── */
function showToast(msg, type='info') {
  const c = document.getElementById('toasts'); if (!c) return;
  const icons = { success:'ri-checkbox-circle-fill', error:'ri-close-circle-fill', info:'ri-information-fill', warn:'ri-alert-fill' };
  const t = document.createElement('div');
  t.className = `toast ${type}`;
  t.innerHTML = `<i class="${icons[type]||icons.info}"></i><span>${msg}</span>`;
  c.appendChild(t);
  setTimeout(() => { t.style.transition='opacity .4s,transform .4s'; t.style.opacity='0'; t.style.transform='translateX(110%)'; setTimeout(()=>t.remove(),420); }, 3600);
}

/* ── UTILS ── */
function esc(s) { return String(s||'').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;'); }
function goMovie(id) {
  if (typeof MNAnalytics !== 'undefined') { const m = DB.byId(id); if(m) MNAnalytics.trackMovie(id, m.title); }
  location.href = 'movie.html?id=' + id;
}
