/* =====================================================
   MOVIENATION — ANALYTICS ENGINE
   Tracks: page views, movie views, sessions, devices
   Stores everything in localStorage (no backend needed)
   ===================================================== */

const MNAnalytics = (() => {

  const VISITS_KEY  = 'mn_visits';
  const VIEWS_KEY   = 'mn_movie_views';
  const SESSION_KEY = 'mn_session';
  const MAX_VISITS  = 2000;

  /* ── UTILS ── */
  const now  = () => Date.now();
  const get  = k => { try { return JSON.parse(localStorage.getItem(k)) } catch(e) { return null } };
  const set  = (k,v) => { try { localStorage.setItem(k, JSON.stringify(v)) } catch(e) {} };
  const today = () => new Date().toISOString().slice(0,10);

  /* ── DEVICE DETECTION ── */
  function getDevice() {
    const ua = navigator.userAgent;
    if (/Mobi|Android|iPhone|iPad/i.test(ua)) return 'Mobile';
    if (/Tablet|iPad/i.test(ua)) return 'Tablet';
    return 'Desktop';
  }

  function getBrowser() {
    const ua = navigator.userAgent;
    if (ua.includes('Chrome') && !ua.includes('Edg')) return 'Chrome';
    if (ua.includes('Firefox')) return 'Firefox';
    if (ua.includes('Safari') && !ua.includes('Chrome')) return 'Safari';
    if (ua.includes('Edg')) return 'Edge';
    return 'Other';
  }

  /* ── SESSION MANAGEMENT ── */
  function getOrCreateSession() {
    let sess = get(SESSION_KEY);
    const THIRTY_MIN = 30 * 60 * 1000;
    if (!sess || (now() - sess.last) > THIRTY_MIN) {
      sess = { id: Math.random().toString(36).slice(2), start: now(), last: now(), pages: 0, device: getDevice(), browser: getBrowser() };
    } else {
      sess.last = now();
      sess.pages = (sess.pages || 0) + 1;
    }
    set(SESSION_KEY, sess);
    return sess;
  }

  /* ── TRACK PAGE VIEW ── */
  function trackPage(page) {
    const sess = getOrCreateSession();
    const visits = get(VISITS_KEY) || [];
    visits.unshift({
      page:    page || location.pathname.split('/').pop() || 'index.html',
      ts:      now(),
      date:    today(),
      device:  sess.device,
      browser: sess.browser,
      sessId:  sess.id
    });
    if (visits.length > MAX_VISITS) visits.length = MAX_VISITS;
    set(VISITS_KEY, visits);
  }

  /* ── TRACK MOVIE VIEW ── */
  function trackMovie(id, title) {
    const views = get(VIEWS_KEY) || {};
    if (!views[id]) views[id] = { id, title, count: 0, last: null };
    views[id].count++;
    views[id].last = today();
    views[id].title = title;
    set(VIEWS_KEY, views);
  }

  /* ── STATS ── */
  function getStats() {
    const visits  = get(VISITS_KEY) || [];
    const views   = get(VIEWS_KEY)  || {};
    const todayStr = today();
    const weekAgo  = now() - 7 * 24 * 60 * 60 * 1000;

    /* totals */
    const totalViews   = visits.length;
    const todayViews   = visits.filter(v => v.date === todayStr).length;
    const weekViews    = visits.filter(v => v.ts >= weekAgo).length;

    /* unique sessions */
    const sessIds      = [...new Set(visits.map(v => v.sessId))];
    const todaySessIds = [...new Set(visits.filter(v => v.date === todayStr).map(v => v.sessId))];
    const weekSessIds  = [...new Set(visits.filter(v => v.ts >= weekAgo).map(v => v.sessId))];

    /* daily chart — last 14 days */
    const daily = {};
    for (let i = 13; i >= 0; i--) {
      const d = new Date(now() - i * 86400000).toISOString().slice(0,10);
      daily[d] = 0;
    }
    visits.filter(v => v.ts >= now() - 14 * 86400000).forEach(v => {
      if (daily[v.date] !== undefined) daily[v.date]++;
    });

    /* devices */
    const devices = {};
    visits.forEach(v => { devices[v.device] = (devices[v.device]||0)+1; });

    /* browsers */
    const browsers = {};
    visits.forEach(v => { browsers[v.browser] = (browsers[v.browser]||0)+1; });

    /* top pages */
    const pages = {};
    visits.forEach(v => { pages[v.page] = (pages[v.page]||0)+1; });
    const topPages = Object.entries(pages).sort((a,b)=>b[1]-a[1]).slice(0,5);

    /* top movies */
    const topMovies = Object.values(views).sort((a,b)=>b.count-a.count).slice(0,8);

    /* total movie plays */
    const totalPlays = Object.values(views).reduce((s,v)=>s+v.count,0);

    return {
      totalViews, todayViews, weekViews,
      totalSessions: sessIds.length,
      todaySessions: todaySessIds.length,
      weekSessions:  weekSessIds.length,
      daily, devices, browsers, topPages, topMovies, totalPlays,
      allVisits: visits.slice(0, 100)
    };
  }

  function clearAll() {
    localStorage.removeItem(VISITS_KEY);
    localStorage.removeItem(VIEWS_KEY);
    localStorage.removeItem(SESSION_KEY);
  }

  return { trackPage, trackMovie, getStats, clearAll, getDevice };
})();
