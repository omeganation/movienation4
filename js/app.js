/* =====================================================
   MOVIENATION — MAIN APPLICATION LOGIC
   ===================================================== */

document.addEventListener('DOMContentLoaded', () => {
  initPreloader();
  initTheme();
  initNav();
  initSearch();
  initModals();
  initBtt();
  initScrollFade();
  Auth.init();
  updateNav();
  routePage();
  setActiveLink();
});

/* ── PRELOADER ── */
function initPreloader(){
  function hideLoader(){
    const p=document.getElementById('preloader');
    if(!p||p._gone) return;
    p._gone=true;
    p.classList.add('out');
    setTimeout(()=>{ try{ p.remove() }catch(e){} },600);
  }
  // Hide as soon as page content is ready — no longer than 800ms
  setTimeout(hideLoader, 800);
  // Hard fallback: kill it at 2s no matter what
  setTimeout(hideLoader, 2000);
  // Also hide immediately once window fully loads
  window.addEventListener('load', ()=>setTimeout(hideLoader,100), {once:true});
}

/* ── THEME ── */
let dark = localStorage.getItem('mn_theme') !== 'light';
function initTheme(){
  applyTheme();
  document.querySelectorAll('.theme-btn').forEach(b=>{
    b.innerHTML=dark?'<i class="ri-moon-line"></i>':'<i class="ri-sun-line"></i>';
    b.addEventListener('click',toggleTheme);
  });
}
function applyTheme(){ document.documentElement.setAttribute('data-theme',dark?'dark':'light') }
function toggleTheme(){
  dark=!dark; localStorage.setItem('mn_theme',dark?'dark':'light'); applyTheme();
  document.querySelectorAll('.theme-btn').forEach(b=>b.innerHTML=dark?'<i class="ri-moon-line"></i>':'<i class="ri-sun-line"></i>');
}

/* ── NAV ── */
function initNav(){
  const nav=document.getElementById('nav');
  if(nav) window.addEventListener('scroll',()=>nav.classList.toggle('scrolled',scrollY>10),{passive:true});
  const burger=document.getElementById('burger-btn');
  const mnav=document.getElementById('mnav');
  burger?.addEventListener('click',()=>{
    const open=mnav?.classList.toggle('open');
    burger.classList.toggle('open',open);
    document.body.style.overflow=open?'hidden':'';
  });
  document.getElementById('mnav')?.addEventListener('click',e=>{
    if(e.target.tagName==='A'){
      document.getElementById('mnav').classList.remove('open');
      document.getElementById('burger-btn')?.classList.remove('open');
      document.body.style.overflow='';
    }
  });
  document.addEventListener('click',e=>{
    if(!e.target.closest('.uwrap')) document.querySelectorAll('.uwrap').forEach(u=>u.classList.remove('open'));
    if(!e.target.closest('.nav-search')){ document.getElementById('sdrop')?.classList.remove('on') }
  });
}

function updateNav(){
  const user=Auth.me();
  const authEl=document.getElementById('nav-auth');
  const userEl=document.getElementById('nav-user');
  if(!authEl||!userEl) return;
  if(user){
    authEl.style.display='none';
    userEl.style.display='flex';
    const av=userEl.querySelector('.uav');
    if(av) av.textContent=(user.displayName||user.email||'U')[0].toUpperCase();
    const nm=userEl.querySelector('.uname');
    if(nm) nm.textContent=user.displayName||user.email?.split('@')[0];
    const em=userEl.querySelector('.udrop-email');
    if(em) em.textContent=user.email;
    const dn=userEl.querySelector('.udn');
    if(dn) dn.textContent=user.displayName||user.email?.split('@')[0];
    const rl=userEl.querySelector('.urole');
    if(rl){ rl.textContent=user.role; rl.className='urole '+user.role }
    // Show admin link if admin
    userEl.querySelectorAll('.admin-only').forEach(el=>el.style.display=user.role==='admin'?'flex':'none');
    userEl.querySelector('.upill')?.addEventListener('click',e=>{ e.stopPropagation(); userEl.querySelector('.uwrap')?.classList.toggle('open') });
  } else {
    authEl.style.display='flex';
    userEl.style.display='none';
  }
}

function setActiveLink(){
  const p=location.pathname.split('/').pop()||'index.html';
  document.querySelectorAll('.nav-links a,#mnav a').forEach(a=>{ a.classList.remove('active'); if(a.getAttribute('href')===p) a.classList.add('active') });
}

/* ── SEARCH ── */
function initSearch(){
  document.querySelectorAll('.search-input').forEach(inp=>{
    inp.addEventListener('input', debounce(e=>doSearch(e.target),220));
    inp.addEventListener('focus', e=>{ if(e.target.value.length>1) doSearch(e.target) });
  });
}
function doSearch(inp){
  const q=inp.value.trim().toLowerCase();
  const drop=document.getElementById('sdrop');
  if(!drop) return;
  if(q.length<2){ drop.classList.remove('on'); return }
  const res=DB.all().filter(m=>m.title.toLowerCase().includes(q)||m.director.toLowerCase().includes(q)).slice(0,7);
  drop.innerHTML=res.length
    ? res.map(m=>`<div class="sdrop-item" onclick="goMovie(${m.id})">
        <img src="${m.poster}" alt="${esc(m.title)}" onerror="this.src='https://placehold.co/36x52/111827/f59e0b?text=?'">
        <div><div class="sdrop-title">${m.title}</div><div class="sdrop-meta">${m.year} · ${m.genres[0]}${m.rating?` · ⭐ ${m.rating}`:''}</div></div>
      </div>`).join('')
    : `<div class="sdrop-empty">No results for "${q}"</div>`;
  drop.classList.add('on');
}

/* ── PAGE ROUTER ── */
function routePage(){
  const p=location.pathname.split('/').pop()||'index.html';
  if(p===''||p==='index.html') renderHome();
  else if(p==='movies.html')   renderMovies();
  else if(p==='upcoming.html') renderUpcoming();
  else if(p==='watchlist.html')renderWatchlist();
  else if(p==='movie.html')    renderDetail();
}

/* ── HOME ── */
function renderHome(){
  renderHero();
  const _mv=DB.all();
  renderRow('tr-row', _mv.filter(m=>!m.upcoming).sort((a,b)=>b.votes-a.votes).slice(0,12));
  renderRow('top-row',_mv.filter(m=>!m.upcoming&&m.rating).sort((a,b)=>b.rating-a.rating).slice(0,12));
  renderRow('new-row',_mv.filter(m=>m.isNew&&!m.upcoming).slice(0,12));
  renderRecentRow();
}

/* ── HERO ── */
let featured=[];
let hIdx=0, hTimer;
function renderHero(){
  featured=DB.all().filter(m=>m.featured&&!m.upcoming);
  const wrap=document.getElementById('hslides');
  const dots=document.getElementById('hdots');
  if(!wrap||!featured.length) return;
  wrap.innerHTML=featured.map((m,i)=>`
  <div class="hero-slide${i===0?' on':''}" data-i="${i}">
    <div class="hbg"><img src="${m.backdrop||m.poster}" alt="${esc(m.title)}" loading="${i===0?'eager':'lazy'}" fetchpriority="${i===0?'high':'auto'}" onerror="this.style.display='none'"></div>
    <div class="hcontent">
      <div class="hbadge"><i class="ri-film-fill"></i>${m.badge==='top'?'Top Rated':'Featured'}</div>
      <h1 class="htitle">${m.title}</h1>
      <div class="hmeta">
        ${m.rating?`<span class="hmeta-rating"><i class="ri-star-fill"></i>${m.rating}/10</span>`:''}
        <span class="hmeta-pill">${m.year}</span>
        <span class="hmeta-pill">${m.genres.slice(0,2).join(' · ')}</span>
        <span class="hmeta-pill">${m.duration}</span>
      </div>
      <p class="hdesc">${m.desc}</p>
      <div class="hbtns">
        ${m.trailer?`<button class="btn-amber" onclick="openTrailer('${m.trailer}','${esc(m.title)}')"><i class="ri-play-fill"></i>Watch Trailer</button>`:''}
        <button class="btn-ghost" onclick="goMovie(${m.id})"><i class="ri-information-line"></i>More Info</button>
      </div>
    </div>
  </div>`).join('');
  if(dots) dots.innerHTML=featured.map((_,i)=>`<div class="hdot${i===0?' on':''}" onclick="gotoSlide(${i})"></div>`).join('');
  startHero();
  document.getElementById('harr-p')?.addEventListener('click',()=>changeHero(-1));
  document.getElementById('harr-n')?.addEventListener('click',()=>changeHero(1));
}
function changeHero(d){ clearInterval(hTimer); hIdx=(hIdx+d+featured.length)%featured.length; syncHero(); startHero() }
function gotoSlide(i){ clearInterval(hTimer); hIdx=i; syncHero(); startHero() }
function syncHero(){
  document.querySelectorAll('.hero-slide').forEach((s,i)=>s.classList.toggle('on',i===hIdx));
  document.querySelectorAll('.hdot').forEach((d,i)=>d.classList.toggle('on',i===hIdx));
}
function startHero(){ hTimer=setInterval(()=>{ hIdx=(hIdx+1)%featured.length; syncHero() },6000) }

/* ── CARD ── */
function makeCard(m){
  const inWL=Auth.inWL(m.id);
  const bc=m.badge==='top'?'b-top':m.badge==='new'?'b-new':m.badge==='soon'?'b-soon':'';
  const bl=m.badge==='top'?'★ Top':m.badge==='new'?'New':m.badge==='soon'?'Coming Soon':'';
  return `<div class="mcard" onclick="goMovie(${m.id})">
  <div class="mcard-poster">
    <img src="${m.poster}" alt="${esc(m.title)}" loading="lazy" onerror="this.src='https://placehold.co/300x435/111827/f59e0b?text=${encodeURIComponent(m.title)}'">
    <div class="mcard-overlay">
      ${m.trailer&&!m.upcoming?`<button class="mcard-play" onclick="event.stopPropagation();openTrailer('${m.trailer}','${esc(m.title)}')"><i class="ri-play-fill"></i></button>`:''}
    </div>
    ${bl?`<span class="mcard-badge ${bc}">${bl}</span>`:''}
    <button class="mcard-wl${inWL?' on':''}" onclick="event.stopPropagation();toggleWL(${m.id},this)" title="Save to watchlist">
      <i class="ri-bookmark-${inWL?'fill':'line'}"></i>
    </button>
    ${m.rating?`<div class="mcard-score"><i class="ri-star-fill"></i>${m.rating}</div>`:''}
  </div>
  <div class="mcard-body">
    <h3 class="mcard-title">${m.title}</h3>
    <div class="mcard-meta"><span>${m.year}</span><span class="mcard-genre">${m.genres[0]}</span></div>
    <div class="mcard-btns">
      ${m.watchUrl?`<a class="mcard-btn mcard-watch" href="${m.watchUrl}" target="_blank" rel="noopener" onclick="event.stopPropagation()"><i class="ri-play-circle-line"></i>Watch</a>`:''}
      ${m.downloadUrl?`<a class="mcard-btn mcard-dl" href="${m.downloadUrl}" target="_blank" rel="noopener" onclick="event.stopPropagation()"><i class="ri-download-2-line"></i>Download</a>`:''}
    </div>
  </div>
</div>`;
}

/* ── ROW ── */
function renderRow(id,movies){
  const el=document.getElementById(id);
  if(el) el.innerHTML=movies.map(m=>makeCard(m)).join('');
}

/* ── RECENT ── */
function renderRecentRow(){
  const ids=Auth.getRecent();
  const sec=document.getElementById('rv-sec');
  const row=document.getElementById('rv-row');
  if(!sec||!row||!ids.length){ sec&&(sec.style.display='none'); return }
  sec.style.display='';
  const movies=ids.map(id=>DB.byId(id)).filter(Boolean);
  row.innerHTML=movies.map(m=>makeCard(m)).join('');
}

/* ── MOVIES PAGE ── */
function renderMovies(){
  const params=new URLSearchParams(location.search);
  const q=params.get('q')||'';
  const g=params.get('genre')||'';
  const sort=params.get('sort')||'popular';
  const gf=document.getElementById('gfilters');
  if(gf) gf.innerHTML=['All',...GENRES].map((gn,i)=>
    `<button class="fpill${(g===gn||(i===0&&!g))?' on':''}" onclick="setGenre('${gn}',this)">${gn}</button>`
  ).join('');
  const qi=document.querySelector('.search-input');
  if(qi&&q) qi.value=q;
  applyFilters(q,g,sort);
}

function setGenre(g,btn){
  document.querySelectorAll('#gfilters .fpill').forEach(b=>b.classList.remove('on'));
  btn.classList.add('on');
  applyFilters(document.querySelector('.search-input')?.value||'',g==='All'?'':g,document.getElementById('sortsel')?.value||'popular');
}

function applyFilters(q='',g='',sort='popular'){
  let movies=DB.all().filter(m=>!m.upcoming);
  if(q) movies=movies.filter(m=>m.title.toLowerCase().includes(q.toLowerCase())||m.director.toLowerCase().includes(q.toLowerCase())||m.genres.some(x=>x.toLowerCase().includes(q.toLowerCase())));
  if(g) movies=movies.filter(m=>m.genres.includes(g));
  if(sort==='rating') movies.sort((a,b)=>(b.rating||0)-(a.rating||0));
  else if(sort==='year') movies.sort((a,b)=>b.year-a.year);
  else movies.sort((a,b)=>b.votes-a.votes);
  const cnt=document.getElementById('rcnt');
  if(cnt) cnt.textContent=`${movies.length} film${movies.length!==1?'s':''} found`;
  const grid=document.getElementById('mgrid');
  if(!grid) return;
  grid.className='mgrid';
  if(!movies.length){ grid.innerHTML=`<div class="empty" style="grid-column:1/-1"><div class="empty-icon"><i class="ri-film-line"></i></div><h3>No Results</h3><p>Try a different search or filter.</p></div>`; return }
  grid.innerHTML=movies.map(m=>makeCard(m)).join('');
}

/* ── UPCOMING ── */
function renderUpcoming(){
  const list=document.getElementById('ulist');
  if(!list) return;
  list.innerHTML=DB.all().filter(m=>m.upcoming).map(m=>`
  <div class="uc fade-up">
    <div class="uc-img"><img src="${m.poster}" alt="${esc(m.title)}" loading="lazy"></div>
    <div class="uc-body">
      <div class="uc-title">${m.title}</div>
      <div class="uc-meta">${m.year} · ${m.genres.join(', ')} · Dir: ${m.director}</div>
      <div class="countdown" id="cd-${m.id}">
        <div class="cd-box"><span class="cd-n" id="d-${m.id}">--</span><span class="cd-l">Days</span></div>
        <div class="cd-box"><span class="cd-n" id="h-${m.id}">--</span><span class="cd-l">Hours</span></div>
        <div class="cd-box"><span class="cd-n" id="m-${m.id}">--</span><span class="cd-l">Mins</span></div>
        <div class="cd-box"><span class="cd-n" id="s-${m.id}">--</span><span class="cd-l">Secs</span></div>
      </div>
      <p style="font-size:.85rem;color:var(--muted);line-height:1.65;margin-top:10px">${m.desc}</p>
      <button class="notify-btn" id="nb-${m.id}" onclick="toggleNotify(${m.id})"><i class="ri-notification-line"></i>Notify Me</button>
    </div>
  </div>`).join('');
  DB.all().filter(m=>m.upcoming&&m.releaseDate).forEach(m=>startCd(m));
  setTimeout(()=>document.querySelectorAll('.fade-up').forEach(el=>el.classList.add('in')),100);
}

function startCd(m){
  function tick(){
    const diff=new Date(m.releaseDate)-new Date();
    if(diff<=0) return;
    const pad=v=>String(v).padStart(2,'0');
    const set=(id,v)=>{ const el=document.getElementById(id); if(el) el.textContent=pad(v) };
    set(`d-${m.id}`,Math.floor(diff/864e5));
    set(`h-${m.id}`,Math.floor((diff%864e5)/36e5));
    set(`m-${m.id}`,Math.floor((diff%36e5)/6e4));
    set(`s-${m.id}`,Math.floor((diff%6e4)/1e3));
  }
  tick(); setInterval(tick,1000);
}

function toggleNotify(id){
  if(!Auth.loggedIn()){ openM('ml'); return }
  const btn=document.getElementById(`nb-${id}`);
  if(!btn) return;
  const on=btn.classList.toggle('on');
  btn.innerHTML=on?'<i class="ri-notification-fill"></i>You\'ll be notified!':'<i class="ri-notification-line"></i>Notify Me';
  showToast(on?'Notification set! We\'ll alert you on release.':'Notification removed.', on?'success':'info');
}

/* ── WATCHLIST ── */
function renderWatchlist(){
  const grid=document.getElementById('wlgrid');
  if(!grid) return;
  const ids=Auth.getWL();
  const movies=ids.map(id=>DB.byId(id)).filter(Boolean);
  if(!movies.length){
    grid.innerHTML=`<div class="empty"><div class="empty-icon"><i class="ri-bookmark-line"></i></div><h3>WATCHLIST EMPTY</h3><p>Browse movies and click the bookmark icon to save them here.</p><a href="movies.html" class="btn-amber" style="margin-top:4px"><i class="ri-compass-3-line"></i>Discover Movies</a></div>`;
  } else {
    grid.className='mgrid'; grid.innerHTML=movies.map(m=>makeCard(m)).join('');
  }
}

/* ── MOVIE DETAIL ── */
function renderDetail(){
  const id=parseInt(new URLSearchParams(location.search).get('id'));
  const m=DB.byId(id);
  const root=document.getElementById('det-root');
  if(!m||!root){ if(root) root.innerHTML=`<div class="wrap" style="padding:80px 0;text-align:center;color:var(--muted)">Movie not found.</div>`; return }
  Auth.addRecent(id);
  document.title=`${m.title} (${m.year}) | MovieNation`;
  const inWL=Auth.inWL(id);
  const myR=Auth.myRating(id);
  const stars=m.rating?Math.round(m.rating/2):0;
  const sHtml=[1,2,3,4,5].map(i=>`<i class="${i<=stars?'ri-star-fill':'ri-star-line'}"></i>`).join('');

  root.innerHTML=`
<div class="det-hero">
  <div class="det-bg"><img src="${m.backdrop||m.poster}" alt="${esc(m.title)}"></div>
  <div class="det-inner">
    <div class="wrap">
      <div class="det-layout">
        <div class="det-poster"><img src="${m.poster}" alt="${esc(m.title)}"></div>
        <div class="det-info">
          <div class="det-genres">${m.genres.map(g=>`<span class="det-genre">${g}</span>`).join('')}</div>
          <h1 class="det-title">${m.title}</h1>
          ${m.tagline?`<p class="det-tagline">"${m.tagline}"</p>`:''}
          <div class="det-facts">
            <div><div class="df-lbl">Year</div><div class="df-val">${m.year}</div></div>
            <div><div class="df-lbl">Duration</div><div class="df-val">${m.duration}</div></div>
            <div><div class="df-lbl">Director</div><div class="df-val">${m.director}</div></div>
            <div><div class="df-lbl">Studio</div><div class="df-val">${m.studio}</div></div>
          </div>
          ${m.rating?`<div class="det-rating-box">
            <div class="det-score">${m.rating}</div>
            <div><div class="det-stars">${sHtml}</div><div class="det-votes">${(m.votes/1000).toFixed(0)}K ratings</div></div>
          </div>`:''}

          <!-- WATCH / DOWNLOAD BAR -->
          <div class="det-action-bar">
            <div class="det-action-label">Watch or Download This Film</div>
            ${m.watchUrl?`<a class="btn-amber" href="${m.watchUrl}" target="_blank" rel="noopener"><i class="ri-play-fill"></i>Watch Now</a>`:''}
            ${m.downloadUrl?`<a class="btn-green" href="${m.downloadUrl}" target="_blank" rel="noopener"><i class="ri-download-2-line"></i>Download Now</a>`:''}
            <button class="btn-ghost" id="wl-det-btn" onclick="toggleWLDet(${id})" style="padding:13px 22px">
              <i class="ri-bookmark-${inWL?'fill':'line'}"></i>${inWL?'Saved':'Save to Watchlist'}
            </button>
            ${m.trailer?`<button class="btn-ghost" onclick="openTrailer('${m.trailer}','${esc(m.title)}')" style="padding:13px 22px"><i class="ri-play-circle-line"></i>Trailer</button>`:''}
          </div>

          <div class="share-row">
            <span class="share-lbl">Share</span>
            <a class="share-btn fb" href="https://facebook.com/sharer/sharer.php?u=${encodeURIComponent(location.href)}" target="_blank" rel="noopener"><i class="ri-facebook-fill"></i></a>
            <a class="share-btn tw" href="https://twitter.com/intent/tweet?url=${encodeURIComponent(location.href)}&text=${encodeURIComponent(m.title)}" target="_blank" rel="noopener"><i class="ri-twitter-x-fill"></i></a>
            <a class="share-btn wa" href="https://wa.me/?text=${encodeURIComponent(m.title+' '+location.href)}" target="_blank" rel="noopener"><i class="ri-whatsapp-line"></i></a>
            <a class="share-btn tg" href="https://t.me/share/url?url=${encodeURIComponent(location.href)}&text=${encodeURIComponent(m.title)}" target="_blank" rel="noopener"><i class="ri-telegram-fill"></i></a>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>

<div class="wrap section">
  <div class="page-grid">
    <div>
      <section style="margin-bottom:48px">
        <div class="sec-label">Overview</div>
        <h2 class="sec-title" style="margin-bottom:16px">About the Film</h2>
        <p style="color:var(--muted);line-height:1.9">${m.longDesc||m.desc}</p>
      </section>

      <div class="ad-slot ad-inline" style="margin-bottom:48px;border-radius:var(--r-lg)"><i class="ri-advertisement-line"></i><span>Advertisement</span></div>

      ${m.trailer?`<section style="margin-bottom:48px">
        <div class="sec-label">Media</div>
        <h2 class="sec-title" style="margin-bottom:16px">Official Trailer</h2>
        <div class="vid-wrap"><iframe src="https://www.youtube.com/embed/${m.trailer}?rel=0&modestbranding=1" allowfullscreen loading="lazy" title="${esc(m.title)} Trailer"></iframe></div>
      </section>`:''}

      ${m.cast&&m.cast.length?`<section style="margin-bottom:48px">
        <div class="sec-label">People</div>
        <h2 class="sec-title" style="margin-bottom:16px">Cast</h2>
        <div class="cast-row">
          ${m.cast.map((name,i)=>`<div class="cast-card">
            <img src="${m.castImg&&m.castImg[i]?m.castImg[i]:`https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=111827&color=f59e0b&size=68`}" alt="${esc(name)}" onerror="this.src='https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=111827&color=f59e0b&size=68'">
            <div class="cast-name">${name}</div>
          </div>`).join('')}
        </div>
      </section>`:'' }

      <section style="margin-bottom:48px">
        <div class="sec-label">Community</div>
        <h2 class="sec-title" style="margin-bottom:16px">Rate This Film</h2>
        <div class="cbox">
          <p style="font-size:.84rem;color:var(--muted);margin-bottom:12px">${myR?`Your rating: <strong style="color:var(--amber2)">${myR}/10 ⭐</strong>`:'Tap a star to rate'}</p>
          <div class="srate" id="srate">${Array(10).fill(0).map((_,i)=>`<span class="s${myR&&i<myR?' lit':''}" onclick="doRate(${id},${i+1})">★</span>`).join('')}</div>
        </div>
      </section>

      <section>
        <div class="sec-label">Discussion</div>
        <h2 class="sec-title" style="margin-bottom:16px">Comments</h2>
        <div class="cbox" style="margin-bottom:16px">
          <textarea id="cta" rows="4" placeholder="${Auth.loggedIn()?'Share your thoughts about this film...':'Sign in to leave a comment...'}" ${!Auth.loggedIn()?'disabled':''}></textarea>
          <div class="cfoot">
            <span class="cchar" id="cchar">0/500</span>
            <button class="btn-amber" style="padding:10px 22px;font-size:.84rem" onclick="postComment(${id})" ${!Auth.loggedIn()?'disabled':''}><i class="ri-send-plane-fill"></i>Post</button>
          </div>
        </div>
        <div id="clist">${demoComs()}</div>
      </section>
    </div>

    <aside class="sidebar">
      <div class="ad-slot ad-box" style="margin-bottom:18px"><i class="ri-advertisement-line"></i><span>Ad 300×250</span></div>
      <div class="scard">
        <h4>Film Info</h4>
        ${[['Director',m.director],['Studio',m.studio],['Year',m.year],['Runtime',m.duration],['Language','English']].map(([k,v])=>`
        <div style="display:flex;justify-content:space-between;padding:9px 0;border-bottom:1px solid var(--border);font-size:.84rem">
          <span style="color:var(--muted2);font-size:.7rem;text-transform:uppercase;letter-spacing:1.5px">${k}</span>
          <span style="font-weight:600">${v}</span>
        </div>`).join('')}
      </div>
      <div class="scard">
        <h4>You May Like</h4>
        ${DB.all().filter(x=>x.id!==id&&x.genres.some(g=>m.genres.includes(g))&&!x.upcoming).slice(0,5).map(x=>`
        <div class="ri-item" onclick="goMovie(${x.id})">
          <img src="${x.poster}" alt="${esc(x.title)}" onerror="this.src='https://placehold.co/40x58/111827/f59e0b?text=?'">
          <div><div class="ri-title">${x.title}</div><div class="ri-meta">${x.year}${x.rating?` · ⭐${x.rating}`:''}</div></div>
        </div>`).join('')}
      </div>
    </aside>
  </div>
</div>

<script type="application/ld+json">${JSON.stringify({"@context":"https://schema.org","@type":"Movie","name":m.title,"datePublished":String(m.year),"description":m.desc,"director":{"@type":"Person","name":m.director},"genre":m.genres,"image":m.poster,...(m.rating?{"aggregateRating":{"@type":"AggregateRating","ratingValue":m.rating,"bestRating":"10","ratingCount":m.votes}}:{})})}<\/script>`;

  document.getElementById('cta')?.addEventListener('input',()=>{
    const ta=document.getElementById('cta'),cc=document.getElementById('cchar');
    if(ta.value.length>500) ta.value=ta.value.slice(0,500);
    if(cc) cc.textContent=`${ta.value.length}/500`;
  });
}

function demoComs(){
  return [
    {u:'Alex M.',t:'One of the most visually stunning films I\'ve ever seen. Absolutely masterful direction.',l:47,d:'2 days ago'},
    {u:'Sarah K.',t:'The performances are incredible. A must-see for any serious film lover.',l:31,d:'5 days ago'}
  ].map(c=>`<div class="ci"><div class="ci-head"><div style="display:flex;align-items:center;gap:11px"><div class="ci-av">${c.u[0]}</div><div><div class="ci-name">${c.u}</div><div class="ci-date">${c.d}</div></div></div></div><p class="ci-text">${c.t}</p><div class="ci-acts"><button class="ci-btn" onclick="likeC(this)"><i class="ri-heart-line"></i>${c.l}</button></div></div>`).join('');
}

function likeC(btn){ if(!Auth.loggedIn()){ openM('ml'); return } const on=btn.classList.toggle('liked'); const i=btn.querySelector('i'); i.className=on?'ri-heart-fill':'ri-heart-line'; btn.innerHTML=`<i class="${i.className}"></i>${parseInt(btn.textContent.trim().match(/\d+/)?.[0]||0)+(on?1:-1)}`; }

function postComment(movieId){
  if(!Auth.loggedIn()){ openM('ml'); return }
  const ta=document.getElementById('cta'); const text=ta?.value.trim();
  if(!text||text.length<3){ showToast('Write at least 3 characters.','warn'); return }
  const user=Auth.me();
  const div=document.createElement('div'); div.className='ci';
  div.innerHTML=`<div class="ci-head"><div style="display:flex;align-items:center;gap:11px"><div class="ci-av">${(user.displayName||'U')[0].toUpperCase()}</div><div><div class="ci-name">${esc(user.displayName||user.email)}</div><div class="ci-date">Just now</div></div></div></div><p class="ci-text">${esc(text)}</p><div class="ci-acts"><button class="ci-btn" onclick="likeC(this)"><i class="ri-heart-line"></i>0</button><button class="ci-btn" onclick="this.closest('.ci').remove();showToast('Deleted','info')"><i class="ri-delete-bin-line"></i>Delete</button></div>`;
  document.getElementById('clist').prepend(div);
  ta.value=''; document.getElementById('cchar').textContent='0/500';
  showToast('Comment posted!','success');
}

function doRate(movieId,score){
  if(!Auth.loggedIn()){ openM('ml'); return }
  Auth.rate(movieId,score);
  document.querySelectorAll('#srate .s').forEach((s,i)=>s.classList.toggle('lit',i<score));
  showToast(`Rated ${score}/10 ⭐`,'success');
}

/* ── WATCHLIST HELPERS ── */
function toggleWL(id,btn){
  if(!Auth.loggedIn()){ openM('ml'); return }
  const added=Auth.toggleWL(id);
  if(btn){ btn.classList.toggle('on',added); btn.innerHTML=`<i class="ri-bookmark-${added?'fill':'line'}"></i>` }
  showToast(added?'Added to watchlist!':'Removed from watchlist.',added?'success':'info');
}
function toggleWLDet(id){
  if(!Auth.loggedIn()){ openM('ml'); return }
  const added=Auth.toggleWL(id);
  const btn=document.getElementById('wl-det-btn');
  if(btn) btn.innerHTML=`<i class="ri-bookmark-${added?'fill':'line'}"></i>${added?'Saved':'Save to Watchlist'}`;
  showToast(added?'Saved!':'Removed.',added?'success':'info');
}

/* ── TRAILER ── */
function openTrailer(ytId,title){
  if(!ytId){ showToast('No trailer available.','info'); return }
  const w=document.querySelector('#tm .vid-wrap');
  const t=document.querySelector('#tm .trailer-title');
  if(t) t.textContent=title;
  if(w) w.innerHTML=`<iframe src="https://www.youtube.com/embed/${ytId}?autoplay=1&rel=0&modestbranding=1" allowfullscreen allow="autoplay" title="${esc(title)}"></iframe>`;
  openM('tm');
}
function closeTrailer(){ closeM('tm'); const w=document.querySelector('#tm .vid-wrap'); if(w) w.innerHTML=''; }

/* ── SCROLL ROW ── */
function scrollRow(id,d){ document.getElementById(id)?.scrollBy({left:d*800,behavior:'smooth'}) }

/* ── SCROLL FADE ── */
function initScrollFade(){
  const obs=new IntersectionObserver(es=>es.forEach(e=>{ if(e.isIntersecting) e.target.classList.add('in') }),{threshold:.1});
  document.querySelectorAll('.fade-up').forEach(el=>obs.observe(el));
}

/* ── BACK TO TOP ── */
function initBtt(){ const b=document.getElementById('btt'); if(!b) return; window.addEventListener('scroll',()=>b.classList.toggle('on',scrollY>500),{passive:true}); b.addEventListener('click',()=>window.scrollTo({top:0,behavior:'smooth'})) }

/* ── AUTH MODALS ── */
function initModals(){
  document.querySelectorAll('.mbg').forEach(bg=>bg.addEventListener('click',e=>{ if(e.target===bg) closeM(bg.id) }));
  document.addEventListener('keydown',e=>{ if(e.key==='Escape') document.querySelectorAll('.mbg.open').forEach(m=>m.classList.remove('open')) });
  initLoginForm(); initRegForm(); initForgotForm(); initPwToggles();
}
function openM(id){ document.getElementById(id)?.classList.add('open'); document.body.style.overflow='hidden' }
function closeM(id){ document.getElementById(id)?.classList.remove('open'); document.body.style.overflow='' }
function switchToReg(){ closeM('ml'); openM('mr') }
function switchToLogin(){ closeM('mr'); openM('ml') }
function switchToForgot(){ closeM('ml'); openM('mf') }

function initLoginForm(){
  const form=document.getElementById('fl');
  if(!form) return;
  const eIn=document.getElementById('le'),pIn=document.getElementById('lp'),lock=document.getElementById('llk');
  eIn?.addEventListener('blur',()=>{ const v=Auth.valEmail(eIn.value); setFS(eIn,v.ok?'ok':'err',v.ok?'':v.err); if(v.ok){ const rl=Auth.checkRl(eIn.value); if(rl.locked&&lock){ lock.style.display='flex'; lock.innerHTML=`<i class="ri-lock-line"></i>Locked for ${rl.min} more min${rl.min!==1?'s':''}.`; document.getElementById('lbtn')&&(document.getElementById('lbtn').disabled=true) } } });
  form.addEventListener('submit',async e=>{ e.preventDefault(); clearFE(form);
    const email=eIn?.value.trim(),pw=pIn?.value,rem=document.getElementById('lrem')?.checked||false;
    if(!email){ setFS(eIn,'err','Email required'); return }
    if(!pw){ setFS(pIn,'err','Password required'); return }
    const btn=document.getElementById('lbtn'); if(btn){ btn.disabled=true; btn.textContent='Signing in…' }
    const res=await Auth.login({email,password:pw,remember:rem});
    if(btn){ btn.disabled=false; btn.textContent='Sign In' }
    if(!res.ok){ if(res.locked&&lock){ lock.style.display='flex'; lock.innerHTML=`<i class="ri-lock-line"></i>${res.err}` } else setFE(form,res.err); return }
    closeM('ml'); updateNav(); showToast(`Welcome back, ${res.user.displayName||res.user.email}! 🎬`,'success'); form.reset(); lock&&(lock.style.display='none');
  });
}

function initRegForm(){
  const form=document.getElementById('fr'); if(!form) return;
  const pwIn=document.getElementById('rp'),pw2In=document.getElementById('rp2'),eIn=document.getElementById('re');
  pwIn?.addEventListener('input',()=>{
    const s=Auth.strengthOf(pwIn.value);
    document.querySelectorAll('.pwbar').forEach((b,i)=>{ b.className='pwbar'; if(i<s.score) b.classList.add(s.score<=2?'w':s.score<=4?'m':'s') });
    const t=document.getElementById('pwtxt'); if(t) t.textContent=s.label?`Strength: ${s.label}`:'';
  });
  pw2In?.addEventListener('blur',()=>{ if(pw2In.value&&pwIn?.value!==pw2In.value) setFS(pw2In,'err','Passwords do not match'); else if(pw2In.value) setFS(pw2In,'ok','') });
  eIn?.addEventListener('blur',()=>{ const v=Auth.valEmail(eIn.value); setFS(eIn,v.ok?'ok':'err',v.ok?'':v.err) });
  form.addEventListener('submit',async e=>{ e.preventDefault(); clearFE(form);
    const name=document.getElementById('rn')?.value.trim(),email=eIn?.value.trim(),pw=pwIn?.value,pw2=pw2In?.value,terms=document.getElementById('rterms')?.checked;
    if(!terms){ setFE(form,'Please accept the Terms of Use.'); return }
    if(!name){ setFS(document.getElementById('rn'),'err','Name required'); return }
    if(!email){ setFS(eIn,'err','Email required'); return }
    if(!pw){ setFS(pwIn,'err','Password required'); return }
    if(pw!==pw2){ setFS(pw2In,'err','Passwords do not match'); return }
    const btn=document.getElementById('rbtn'); if(btn){ btn.disabled=true; btn.textContent='Creating…' }
    const res=await Auth.register({name,email,password:pw});
    if(btn){ btn.disabled=false; btn.textContent='Create Account' }
    if(!res.ok){ setFE(form,res.err); return }
    closeM('mr'); updateNav(); showToast(`Welcome to MovieNation, ${name}! 🎬`,'success'); form.reset(); document.querySelectorAll('.pwbar').forEach(b=>b.className='pwbar');
  });
}

function initForgotForm(){
  const form=document.getElementById('ff'); if(!form) return;
  form.addEventListener('submit',e=>{ e.preventDefault(); const suc=document.getElementById('fsuc'); if(suc) suc.style.display='flex'; showToast('Reset link sent if email exists.','info') });
}

function initPwToggles(){
  document.querySelectorAll('.feye').forEach(eye=>eye.addEventListener('click',()=>{
    const inp=eye.previousElementSibling; if(!inp) return;
    inp.type=inp.type==='password'?'text':'password';
    eye.className=`feye ri-${inp.type==='password'?'eye-line':'eye-off-line'}`;
  }));
}

function setFS(inp,st,msg){ if(!inp) return; inp.classList.remove('ok','err'); if(st) inp.classList.add(st); const e=inp.parentElement?.querySelector('.ferr')||inp.nextElementSibling; if(e?.classList.contains('ferr')){ e.innerHTML=msg?`<i class="ri-error-warning-fill"></i>${msg}`:''; e.style.display=msg?'flex':'none' } }
function setFE(form,msg){ let e=form.querySelector('.fe'); if(!e){ e=document.createElement('div'); e.className='ferr fe'; form.prepend(e) } e.innerHTML=`<i class="ri-error-warning-fill"></i>${msg}`; e.style.display='flex' }
function clearFE(form){ form.querySelectorAll('.ferr').forEach(e=>{ e.innerHTML=''; e.style.display='none' }); form.querySelectorAll('.fi').forEach(i=>i.classList.remove('ok','err')) }

/* ── LOGOUT ── */
function doLogout(){ Auth.logout(); updateNav(); showToast('Signed out.','info'); document.querySelectorAll('.uwrap').forEach(u=>u.classList.remove('open')); if(location.pathname.includes('watchlist')) location.href='index.html'; }

/* ── TOAST ── */
function showToast(msg,type='info'){
  const c=document.getElementById('toasts'); if(!c) return;
  const icons={success:'ri-checkbox-circle-fill',error:'ri-close-circle-fill',info:'ri-information-fill',warn:'ri-alert-fill'};
  const t=document.createElement('div'); t.className=`toast ${type}`;
  t.innerHTML=`<i class="${icons[type]||icons.info}"></i><span>${msg}</span>`;
  c.appendChild(t);
  setTimeout(()=>{ t.style.transition='opacity .4s,transform .4s'; t.style.opacity='0'; t.style.transform='translateX(100%)'; setTimeout(()=>t.remove(),400) },4000);
}

/* ── CONTACT ── */
function handleContact(e){ e.preventDefault(); showToast('Message sent! We\'ll reply within 24 hours.','success'); e.target.reset() }

/* ── UTILS ── */
function goMovie(id){ location.href=`movie.html?id=${id}` }
function esc(s){ return String(s).replace(/&/g,'&amp;').replace(/"/g,'&quot;').replace(/</g,'&lt;').replace(/>/g,'&gt;') }
function debounce(fn,ms){ let t; return (...a)=>{ clearTimeout(t); t=setTimeout(()=>fn(...a),ms) } }
