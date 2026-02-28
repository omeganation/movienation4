/* =====================================================
   MOVIENATION — MAIN APP  (public, no user accounts)
   ===================================================== */

document.addEventListener('DOMContentLoaded', () => {
  initPreloader();
  initTheme();
  initNav();
  initSearch();
  initBtt();
  routePage();
  setActiveLink();
});

/* ── PRELOADER ── */
function initPreloader() {
  function hide() {
    const p = document.getElementById('preloader');
    if (!p || p._done) return;
    p._done = true;
    p.classList.add('out');
    setTimeout(() => { try { p.remove() } catch(e) {} }, 500);
  }
  setTimeout(hide, 700);
  setTimeout(hide, 2000); // hard kill
  window.addEventListener('load', () => setTimeout(hide, 80), { once: true });
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
  document.querySelectorAll('.theme-btn').forEach(b => b.innerHTML = dark ? '<i class="ri-moon-line"></i>' : '<i class="ri-sun-line"></i>');
}

/* ── NAV ── */
function initNav() {
  window.addEventListener('scroll', () => {
    document.getElementById('nav')?.classList.toggle('scrolled', window.scrollY > 40);
  }, { passive: true });

  const burger = document.getElementById('burger-btn');
  const mnav   = document.getElementById('mnav');
  burger?.addEventListener('click', () => {
    const open = mnav?.classList.toggle('open');
    burger.classList.toggle('open', open);
    document.body.style.overflow = open ? 'hidden' : '';
  });
  document.getElementById('mnav')?.addEventListener('click', e => {
    if (e.target.tagName === 'A') {
      mnav.classList.remove('open');
      burger?.classList.remove('open');
      document.body.style.overflow = '';
    }
  });
  document.addEventListener('click', e => {
    if (!e.target.closest('.nav-search')) document.getElementById('sdrop')?.classList.remove('on');
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
    inp.addEventListener('input', debounce(e => doSearch(e.target), 200));
    inp.addEventListener('focus', e => { if (e.target.value.length > 1) doSearch(e.target) });
  });
}
function doSearch(inp) {
  const q    = inp.value.trim().toLowerCase();
  const drop = document.getElementById('sdrop');
  if (!drop) return;
  if (q.length < 2) { drop.classList.remove('on'); return }
  const res = DB.all().filter(m => m.title.toLowerCase().includes(q) || (m.director||'').toLowerCase().includes(q)).slice(0, 7);
  drop.innerHTML = res.length
    ? res.map(m => `<div class="sdrop-item" onclick="goMovie(${m.id})">
        <img src="${m.poster}" onerror="this.src='https://placehold.co/34x50/111827/f59e0b?text=?'" alt="">
        <div><div class="sdrop-title">${esc(m.title)}</div><div class="sdrop-meta">${m.year} · ${m.genres[0]||''}</div></div>
      </div>`).join('')
    : '<div class="sdrop-empty">No results found</div>';
  drop.classList.add('on');
}
function debounce(fn, ms) { let t; return (...a) => { clearTimeout(t); t = setTimeout(() => fn(...a), ms) } }

/* ── BTT ── */
function initBtt() {
  const b = document.getElementById('btt');
  if (!b) return;
  window.addEventListener('scroll', () => b.classList.toggle('on', window.scrollY > 400), { passive: true });
  b.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
}

/* ── ROUTER ── */
function routePage() {
  const p = location.pathname.split('/').pop() || 'index.html';
  if (p === '' || p === 'index.html') renderHome();
  else if (p === 'movies.html')   renderMovies();
  else if (p === 'upcoming.html') renderUpcoming();
  else if (p === 'movie.html')    renderDetail();
}

/* ── HOME ── */
function renderHome() {
  renderHero();
  const mv = DB.all();
  renderRow('tr-row',  [...mv].filter(m=>!m.upcoming).sort((a,b)=>b.votes-a.votes).slice(0,16));
  renderRow('top-row', [...mv].filter(m=>!m.upcoming&&m.rating).sort((a,b)=>b.rating-a.rating).slice(0,16));
  renderRow('new-row', [...mv].filter(m=>m.isNew&&!m.upcoming).slice(0,16));
}

/* ── HERO ── */
let hFeat=[], hIdx=0, hTimer;
function renderHero() {
  hFeat = DB.all().filter(m => m.featured && !m.upcoming);
  const wrap = document.getElementById('hslides');
  const dots = document.getElementById('hdots');
  if (!wrap || !hFeat.length) return;

  wrap.innerHTML = hFeat.map((m,i) => `
  <div class="hero-slide${i===0?' on':''}" data-i="${i}">
    <div class="hbg">
      <img src="${m.backdrop||m.poster}" alt="${esc(m.title)}"
           loading="${i===0?'eager':'lazy'}" fetchpriority="${i===0?'high':'auto'}"
           onerror="this.style.opacity=0">
    </div>
    <div class="hcontent">
      <div class="hbadge"><i class="ri-film-fill"></i>${m.badge==='top'?'Top Rated':'Featured'}</div>
      <h1 class="htitle">${esc(m.title)}</h1>
      <div class="hmeta">
        ${m.rating ? `<span class="hmeta-rating"><i class="ri-star-fill"></i>${m.rating}/10</span>` : ''}
        <span class="hmeta-pill">${m.year}</span>
        <span class="hmeta-pill">${m.genres.slice(0,2).join(' · ')}</span>
        <span class="hmeta-pill">${m.duration}</span>
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
function changeHero(d) { clearInterval(hTimer); hIdx=(hIdx+d+hFeat.length)%hFeat.length; syncHero(); startHero() }
function gotoSlide(i)  { clearInterval(hTimer); hIdx=i; syncHero(); startHero() }
function syncHero() {
  document.querySelectorAll('.hero-slide').forEach((s,i) => s.classList.toggle('on', i===hIdx));
  document.querySelectorAll('.hdot').forEach((d,i) => d.classList.toggle('on', i===hIdx));
}
function startHero() { hTimer = setInterval(() => { hIdx=(hIdx+1)%hFeat.length; syncHero() }, 6000) }

/* ── MOVIE CARD ── */
function makeCard(m) {
  const bc = m.badge==='top'?'b-top':m.badge==='new'?'b-new':m.badge==='soon'?'b-soon':'';
  const bl = m.badge==='top'?'★ Top':m.badge==='new'?'New':m.badge==='soon'?'Coming Soon':'';
  return `<div class="mcard" onclick="goMovie(${m.id})">
  <div class="mcard-poster">
    <img src="${m.poster}" alt="${esc(m.title)}" loading="lazy"
         onerror="this.src='https://placehold.co/300x450/111827/f59e0b?text=${encodeURIComponent(m.title)}'">
    <div class="mcard-overlay">
      ${m.trailer&&!m.upcoming ? `<button class="mcard-play" onclick="event.stopPropagation();openTrailer('${m.trailer}','${esc(m.title).replace(/'/g,"\\'")}')"><i class="ri-play-fill"></i></button>` : ''}
    </div>
    ${bl ? `<span class="mcard-badge ${bc}">${bl}</span>` : ''}
    ${m.rating ? `<div class="mcard-score"><i class="ri-star-fill"></i>${m.rating}</div>` : ''}
  </div>
  <div class="mcard-body">
    <h3 class="mcard-title">${esc(m.title)}</h3>
    <div class="mcard-meta"><span>${m.year}</span><span class="mcard-genre">${m.genres[0]||''}</span></div>
    <div class="mcard-btns">
      ${m.watchUrl    ? `<a class="mcard-btn mcard-watch" href="${m.watchUrl}"    target="_blank" rel="noopener" onclick="event.stopPropagation()"><i class="ri-play-circle-line"></i>Watch</a>` : ''}
      ${m.downloadUrl ? `<a class="mcard-btn mcard-dl"    href="${m.downloadUrl}" target="_blank" rel="noopener" onclick="event.stopPropagation()"><i class="ri-download-2-line"></i>Download</a>` : ''}
    </div>
  </div>
</div>`;
}

/* ── SCROLL ROW ── */
function renderRow(id, movies) {
  const el = document.getElementById(id);
  if (el) el.innerHTML = movies.map(m => makeCard(m)).join('');
}
function scrollRow(id, dir) {
  const el = document.getElementById(id);
  if (el) el.scrollBy({ left: dir * 640, behavior: 'smooth' });
}

/* ── MOVIES PAGE ── */
function renderMovies() {
  const params = new URLSearchParams(location.search);
  const g      = params.get('genre') || '';
  const sort   = params.get('sort')  || 'popular';
  const q      = params.get('q')     || '';

  const gf = document.getElementById('gfilters');
  if (gf) gf.innerHTML = ['All', ...GENRES].map((gn,i) =>
    `<button class="fpill${(g===gn||(i===0&&!g))?' on':''}" onclick="setGenre('${gn}',this)">${gn}</button>`
  ).join('');

  const si = document.getElementById('sortsel');
  if (si && sort) si.value = sort;
  if (q) { const inp = document.querySelector('.search-input'); if (inp) inp.value = q }

  applyFilters(q, g, sort);
}
function setGenre(g, btn) {
  document.querySelectorAll('#gfilters .fpill').forEach(b => b.classList.remove('on'));
  btn.classList.add('on');
  applyFilters(document.querySelector('.search-input')?.value||'', g==='All'?'':g, document.getElementById('sortsel')?.value||'popular');
}
function applyFilters(q='', g='', sort='popular') {
  let mv = DB.all().filter(m => !m.upcoming);
  if (q) mv = mv.filter(m => m.title.toLowerCase().includes(q.toLowerCase()) || (m.director||'').toLowerCase().includes(q.toLowerCase()) || m.genres.join(' ').toLowerCase().includes(q.toLowerCase()));
  if (g) mv = mv.filter(m => m.genres.includes(g));
  if (sort==='rating') mv.sort((a,b) => (b.rating||0)-(a.rating||0));
  else if (sort==='year') mv.sort((a,b) => b.year-a.year);
  else mv.sort((a,b) => b.votes-a.votes);

  const cnt  = document.getElementById('rcnt');
  if (cnt) cnt.textContent = `${mv.length} film${mv.length!==1?'s':''}`;

  const grid = document.getElementById('mgrid');
  if (!grid) return;
  grid.className = 'mgrid';
  if (!mv.length) {
    grid.innerHTML = `<div class="empty" style="grid-column:1/-1">
      <div class="empty-icon"><i class="ri-film-line"></i></div>
      <h3>No Results</h3><p>Try a different search or filter.</p>
    </div>`;
    return;
  }
  grid.innerHTML = mv.map(m => makeCard(m)).join('');
}

/* ── UPCOMING ── */
function renderUpcoming() {
  const list = document.getElementById('ulist');
  if (!list) return;
  const movies = DB.all().filter(m => m.upcoming);
  if (!movies.length) {
    list.innerHTML = `<div class="empty"><div class="empty-icon"><i class="ri-time-line"></i></div><h3>No Upcoming Films</h3><p>Check back soon.</p></div>`;
    return;
  }
  list.innerHTML = movies.map(m => `
  <div class="uc">
    <div class="uc-img"><img src="${m.poster}" alt="${esc(m.title)}" loading="lazy" onerror="this.src='https://placehold.co/140x200/111827/f59e0b?text=?'"></div>
    <div class="uc-body">
      <div class="uc-title">${esc(m.title)}</div>
      <div class="uc-meta">${m.year} · ${m.genres.join(', ')} · Dir. ${esc(m.director)}</div>
      ${m.releaseDate ? `<div class="countdown" id="cd-${m.id}"></div>` : '<div style="font-size:.8rem;color:var(--muted)">Release date TBA</div>'}
      ${m.desc ? `<p style="margin-top:12px;font-size:.84rem;color:var(--muted);line-height:1.7;max-width:580px">${esc(m.desc)}</p>` : ''}
    </div>
  </div>`).join('');
  movies.filter(m => m.releaseDate).forEach(m => startCd(m));
}
function startCd(m) {
  const el = document.getElementById('cd-' + m.id);
  if (!el) return;
  function tick() {
    const diff = new Date(m.releaseDate) - new Date();
    if (diff <= 0) { el.innerHTML = '<span class="cd-box"><span class="cd-n">OUT</span><span class="cd-l">Now</span></span>'; return }
    const d = Math.floor(diff/86400000), h = Math.floor((diff%86400000)/3600000),
          mn= Math.floor((diff%3600000)/60000),  s = Math.floor((diff%60000)/1000);
    el.innerHTML = [['cd-'+m.id+'-d',d,'Days'],['cd-'+m.id+'-h',h,'Hours'],['cd-'+m.id+'-m',mn,'Mins'],['cd-'+m.id+'-s',s,'Secs']]
      .map(([,n,l]) => `<div class="cd-box"><span class="cd-n">${String(n).padStart(2,'0')}</span><span class="cd-l">${l}</span></div>`).join('');
  }
  tick(); setInterval(tick, 1000);
}

/* ── MOVIE DETAIL ── */
function renderDetail() {
  const id   = parseInt(new URLSearchParams(location.search).get('id'));
  const m    = DB.byId(id);
  const root = document.getElementById('det-root');
  if (!root) return;

  if (!m) {
    root.innerHTML = `<div class="wrap" style="padding:80px 0;text-align:center">
      <div class="empty-icon" style="margin:0 auto 16px"><i class="ri-film-line"></i></div>
      <h2 style="font-family:var(--ft);font-size:2rem;margin-bottom:10px">Movie Not Found</h2>
      <p style="color:var(--muted);margin-bottom:22px">This movie doesn't exist or was removed.</p>
      <a href="movies.html" class="btn-amber"><i class="ri-arrow-left-line"></i>Browse Movies</a>
    </div>`;
    return;
  }

  document.title = `${m.title} — MovieNation`;

  // Add recent tracking
  try {
    const rec = JSON.parse(localStorage.getItem('mn_rec')||'[]').filter(i=>i!==id);
    rec.unshift(id);
    localStorage.setItem('mn_rec', JSON.stringify(rec.slice(0,12)));
  } catch(e) {}

  const stars = m.rating ? Math.round(m.rating/2) : 0;
  const related = DB.all().filter(x => x.id!==id && x.genres.some(g=>m.genres.includes(g)) && !x.upcoming).slice(0,5);

  root.innerHTML = `
  <!-- HERO BACKDROP -->
  <div class="det-hero">
    <div class="det-bg"><img src="${m.backdrop||m.poster}" alt="${esc(m.title)}" loading="eager"></div>
    <div class="wrap det-inner">
      <div class="det-layout">
        <div class="det-poster"><img src="${m.poster}" alt="${esc(m.title)}" onerror="this.src='https://placehold.co/260x390/111827/f59e0b?text=?'"></div>
        <div class="det-info">
          <div class="det-genres">${m.genres.map(g=>`<span class="det-genre">${g}</span>`).join('')}</div>
          <h1 class="det-title">${esc(m.title)}</h1>
          ${m.tagline ? `<p class="det-tagline">"${esc(m.tagline)}"</p>` : ''}
          <div class="det-facts">
            <div><div class="df-lbl">Year</div><div class="df-val">${m.year}</div></div>
            <div><div class="df-lbl">Duration</div><div class="df-val">${m.duration||'TBA'}</div></div>
            ${m.director ? `<div><div class="df-lbl">Director</div><div class="df-val">${esc(m.director)}</div></div>` : ''}
            ${m.studio   ? `<div><div class="df-lbl">Studio</div><div class="df-val">${esc(m.studio)}</div></div>` : ''}
            ${m.rating   ? `<div><div class="df-lbl">IMDb</div><div class="df-val" style="color:var(--amber2)">⭐ ${m.rating}/10</div></div>` : ''}
            ${m.votes    ? `<div><div class="df-lbl">Votes</div><div class="df-val">${m.votes.toLocaleString()}</div></div>` : ''}
          </div>
          <p class="det-desc">${esc(m.longDesc||m.desc)}</p>
          <!-- ACTION BAR -->
          <div class="det-action-bar">
            <div class="det-action-label">Where to Watch</div>
            ${m.trailer    ? `<button class="btn-amber" onclick="openTrailer('${m.trailer}','${esc(m.title).replace(/'/g,"\\'")}')"><i class="ri-play-fill"></i>Watch Trailer</button>` : ''}
            ${m.watchUrl   ? `<a class="btn-amber" href="${m.watchUrl}"    target="_blank" rel="noopener"><i class="ri-play-circle-fill"></i>Watch Now</a>` : ''}
            ${m.downloadUrl? `<a class="btn-green" href="${m.downloadUrl}" target="_blank" rel="noopener"><i class="ri-download-2-fill"></i>Download</a>` : ''}
            <button class="btn-ghost" onclick="shareMovie('${esc(m.title).replace(/'/g,"\\'")}')"><i class="ri-share-line"></i>Share</button>
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- CONTENT -->
  <div class="wrap" style="padding:40px 0 60px">
    <div class="page-grid">
      <div>
        <!-- CAST -->
        ${m.cast&&m.cast.length ? `
        <div style="margin-bottom:36px">
          <div class="sec-label" style="margin-bottom:14px">Cast</div>
          <div class="cast-row">
            ${m.cast.map((name,i) => `
            <div class="cast-card">
              <img src="${(m.castImg||[])[i]||'https://placehold.co/62x62/161f2e/94a3b8?text=?'}"
                   onerror="this.src='https://placehold.co/62x62/161f2e/94a3b8?text=?'" alt="${esc(name)}">
              <div class="cast-name">${esc(name)}</div>
            </div>`).join('')}
          </div>
        </div>` : ''}

        <!-- TRAILER EMBED -->
        ${m.trailer ? `
        <div style="margin-bottom:36px">
          <div class="sec-label" style="margin-bottom:14px">Official Trailer</div>
          <div class="vid-wrap">
            <iframe src="https://www.youtube.com/embed/${m.trailer}?rel=0&modestbranding=1"
                    title="${esc(m.title)} trailer" allowfullscreen loading="lazy"></iframe>
          </div>
        </div>` : ''}

        <!-- SHARE ROW -->
        <div class="share-row" style="margin-bottom:10px">
          <span class="share-lbl">Share</span>
          <a class="share-btn fb" href="https://facebook.com/sharer/sharer.php?u=${encodeURIComponent(location.href)}" target="_blank" rel="noopener" title="Facebook"><i class="ri-facebook-fill"></i></a>
          <a class="share-btn tw" href="https://twitter.com/intent/tweet?text=${encodeURIComponent(m.title+' — '+location.href)}" target="_blank" rel="noopener" title="Twitter/X"><i class="ri-twitter-x-fill"></i></a>
          <a class="share-btn wa" href="https://wa.me/?text=${encodeURIComponent(m.title+' — '+location.href)}" target="_blank" rel="noopener" title="WhatsApp"><i class="ri-whatsapp-line"></i></a>
          <a class="share-btn tg" href="https://t.me/share/url?url=${encodeURIComponent(location.href)}&text=${encodeURIComponent(m.title)}" target="_blank" rel="noopener" title="Telegram"><i class="ri-telegram-fill"></i></a>
        </div>
      </div>

      <!-- SIDEBAR -->
      <div class="sidebar">
        ${related.length ? `
        <div class="scard">
          <h4>You May Also Like</h4>
          ${related.map(x => `
          <div class="ri-item" onclick="goMovie(${x.id})">
            <img src="${x.poster}" onerror="this.src='https://placehold.co/40x58/111827/f59e0b?text=?'" alt="${esc(x.title)}">
            <div>
              <div class="ri-title">${esc(x.title)}</div>
              <div class="ri-meta">${x.year}${x.rating?' · ⭐'+x.rating:''}</div>
            </div>
          </div>`).join('')}
        </div>` : ''}
        <div class="scard" style="text-align:center;padding:24px">
          <i class="ri-movie-2-line" style="font-size:2rem;color:var(--amber);display:block;margin-bottom:12px"></i>
          <h4 style="font-family:var(--ft);font-size:1rem;letter-spacing:1px;margin-bottom:8px;color:var(--text)">Discover More</h4>
          <p style="font-size:.8rem;color:var(--muted);margin-bottom:16px;line-height:1.6">Explore thousands of films across all genres.</p>
          <a href="movies.html" class="btn-amber" style="font-size:.8rem;padding:9px 18px;width:100%;justify-content:center"><i class="ri-compass-3-line"></i>Browse All Movies</a>
        </div>
      </div>
    </div>
  </div>`;
}

/* ── TRAILER MODAL ── */
function openTrailer(id, title) {
  const modal = document.getElementById('tm');
  if (!modal) return;
  modal.querySelector('.trailer-title').textContent = title;
  modal.querySelector('.vid-wrap').innerHTML = `<iframe src="https://www.youtube.com/embed/${id}?autoplay=1&rel=0" allowfullscreen allow="autoplay"></iframe>`;
  modal.classList.add('open');
  document.body.style.overflow = 'hidden';
}
function closeTrailer() {
  const modal = document.getElementById('tm');
  if (!modal) return;
  modal.querySelector('.vid-wrap').innerHTML = '';
  modal.classList.remove('open');
  document.body.style.overflow = '';
}

/* ── SHARE ── */
function shareMovie(title) {
  if (navigator.share) {
    navigator.share({ title, url: location.href }).catch(() => {});
  } else {
    navigator.clipboard?.writeText(location.href).then(() => showToast('Link copied!', 'success'));
  }
}

/* ── TOAST ── */
function showToast(msg, type='info') {
  const c = document.getElementById('toasts');
  if (!c) return;
  const icons = { success:'ri-checkbox-circle-fill', error:'ri-close-circle-fill', info:'ri-information-fill', warn:'ri-alert-fill' };
  const t = document.createElement('div');
  t.className = `toast ${type}`;
  t.innerHTML = `<i class="${icons[type]||icons.info}"></i><span>${msg}</span>`;
  c.appendChild(t);
  setTimeout(() => { t.style.transition='opacity .4s,transform .4s'; t.style.opacity='0'; t.style.transform='translateX(110%)'; setTimeout(()=>t.remove(),400) }, 3500);
}

/* ── UTILS ── */
function esc(s) { return String(s||'').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;') }
function goMovie(id) { location.href = 'movie.html?id=' + id }
