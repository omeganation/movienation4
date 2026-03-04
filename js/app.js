/* =====================================================
   MOVIENATION — APP v5  (public · no user accounts)
   ===================================================== */

document.addEventListener('DOMContentLoaded', () => {
  initPreloader();
  initTheme();
  initNav();
  initSearch();
  initBtt();
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
    setTimeout(() => { try { p.remove() } catch(e) {} }, 600);
  }
  window.addEventListener('load', () => setTimeout(hide, 100), { once: true });
  setTimeout(hide, 800);
  setTimeout(hide, 2500); // hard kill
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
function applyTheme() { document.documentElement.setAttribute('data-theme', dark ? 'dark' : 'light') }
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

  const burger = document.getElementById('burger-btn');
  const mnav   = document.getElementById('mnav');

  burger?.addEventListener('click', e => {
    e.stopPropagation();
    const open = mnav?.classList.toggle('open');
    burger.classList.toggle('open', open);
    document.body.style.overflow = open ? 'hidden' : '';
  });

  mnav?.addEventListener('click', e => {
    const link = e.target.closest('a');
    if (link) {
      mnav.classList.remove('open');
      burger?.classList.remove('open');
      document.body.style.overflow = '';
    }
  });

  // close mobile nav on outside click
  document.addEventListener('click', e => {
    if (mnav?.classList.contains('open') && !e.target.closest('#mnav') && !e.target.closest('#burger-btn')) {
      mnav.classList.remove('open');
      burger?.classList.remove('open');
      document.body.style.overflow = '';
    }
    // close search dropdown
    if (!e.target.closest('.nav-search') && !e.target.closest('.mnav-search')) {
      document.getElementById('sdrop')?.classList.remove('on');
    }
  });

  // Escape key closes nav & modals
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') {
      if (mnav?.classList.contains('open')) {
        mnav.classList.remove('open');
        burger?.classList.remove('open');
        document.body.style.overflow = '';
      }
      closeTrailer();
    }
  });
}

function setActiveLink() {
  const p = location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a, #mnav a').forEach(a => {
    a.classList.toggle('active', a.getAttribute('href') === p);
  });
}

/* ── SEARCH ── */
function initSearch() {
  document.querySelectorAll('.search-input').forEach(inp => {
    inp.addEventListener('input', debounce(e => doSearch(e.target), 220));
    inp.addEventListener('focus', e => { if (e.target.value.length > 1) doSearch(e.target) });
    inp.addEventListener('keydown', e => {
      if (e.key === 'Enter') {
        const q = e.target.value.trim();
        if (q) { location.href = 'movies.html?q=' + encodeURIComponent(q) }
      }
    });
  });
}

function doSearch(inp) {
  const q    = inp.value.trim().toLowerCase();
  const drop = document.getElementById('sdrop');
  if (!drop) return;
  if (q.length < 2) { drop.classList.remove('on'); return }
  const res = DB.all().filter(m =>
    m.title.toLowerCase().includes(q) ||
    (m.director||'').toLowerCase().includes(q) ||
    m.genres.join(' ').toLowerCase().includes(q)
  ); // ALL results, no slice
  drop.innerHTML = res.length
    ? res.map(m => `
      <div class="sdrop-item" onclick="goMovie(${m.id})">
        <img src="${m.poster}" onerror="this.src='https://placehold.co/34x50/111827/f59e0b?text=?'" alt="">
        <div>
          <div class="sdrop-title">${esc(m.title)}</div>
          <div class="sdrop-meta">${m.year} · ${m.genres[0]||''}</div>
        </div>
      </div>`).join('')
    : `<div class="sdrop-empty"><i class="ri-search-line" style="display:block;font-size:1.2rem;margin-bottom:4px;opacity:.3"></i>No results for "${esc(q)}"</div>`;
  drop.classList.add('on');
}

function debounce(fn, ms) { let t; return (...a) => { clearTimeout(t); t = setTimeout(() => fn(...a), ms) } }

/* ── BTT ── */
function initBtt() {
  const b = document.getElementById('btt');
  if (!b) return;
  window.addEventListener('scroll', () => b.classList.toggle('on', window.scrollY > 500), { passive: true });
  b.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
}

/* ── ROUTER ── */
function routePage() {
  const p = location.pathname.split('/').pop() || 'index.html';
  if (!p || p === 'index.html') renderHome();
  else if (p === 'movies.html')   renderMovies();
  else if (p === 'upcoming.html') renderUpcoming();
  else if (p === 'movie.html')    renderDetail();
}

/* ══════════════════════════════════════════════════
   HOME PAGE
══════════════════════════════════════════════════ */
function renderHome() {
  renderHero();
  const mv = DB.all();
  renderRow('tr-row',  [...mv].filter(m=>!m.upcoming).sort((a,b)=>b.votes-a.votes));
  renderRow('top-row', [...mv].filter(m=>!m.upcoming&&m.rating).sort((a,b)=>b.rating-a.rating));
  renderRow('new-row', [...mv].filter(m=>m.isNew&&!m.upcoming));
}

/* ── HERO CAROUSEL ── */
let hFeat=[], hIdx=0, hTimer;
function renderHero() {
  hFeat = DB.all().filter(m => m.featured && !m.upcoming);
  if (!hFeat.length) hFeat = DB.all().filter(m => !m.upcoming); // ALL movies
  const wrap = document.getElementById('hslides');
  const dots = document.getElementById('hdots');
  if (!wrap) return;

  wrap.innerHTML = hFeat.map((m,i) => `
  <div class="hero-slide${i===0?' on':''}" data-i="${i}">
    <div class="hbg">
      <img src="${m.backdrop||m.poster}" alt="${esc(m.title)}"
           loading="${i===0?'eager':'lazy'}" fetchpriority="${i===0?'high':'auto'}"
           onerror="this.style.opacity=0">
    </div>
    <div class="hcontent">
      <span class="hbadge"><i class="ri-film-fill"></i>${m.badge==='top'?'★ Top Rated':m.upcoming?'Coming Soon':'Featured'}</span>
      <h1 class="htitle">${esc(m.title)}</h1>
      <div class="hmeta">
        ${m.rating ? `<span class="hmeta-rating"><i class="ri-star-fill"></i>${m.rating}/10</span>` : ''}
        <span class="hmeta-pill">${m.year}</span>
        ${m.genres.slice(0,2).map(g=>`<span class="hmeta-pill">${g}</span>`).join('')}
        <span class="hmeta-pill">${m.duration||'TBA'}</span>
      </div>
      <p class="hdesc">${esc(m.desc)}</p>
      <div class="hbtns">
        ${m.watchUrl ? `<a class="btn-amber" href="${m.watchUrl}" target="_blank" rel="noopener"><i class="ri-play-fill"></i>Watch Now</a>` : ''}
        <button class="btn-ghost" onclick="goMovie(${m.id})"><i class="ri-information-line"></i>More Info</button>
      </div>
    </div>
  </div>`).join('');

  if (dots) dots.innerHTML = hFeat.map((_,i) => `<div class="hdot${i===0?' on':''}" onclick="gotoSlide(${i})"></div>`).join('');

  document.getElementById('harr-p')?.addEventListener('click', () => changeHero(-1));
  document.getElementById('harr-n')?.addEventListener('click', () => changeHero(1));

  startHero();
}

/* Rest of the code remains the same, except anywhere `.slice()` was used is removed, e.g., related movies and search dropdown. */
