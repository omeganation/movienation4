import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";

/* ─────────────────────────── INJECT STYLES ─────────────────────────── */
if (!document.getElementById("mn-styles")) {
  const link = document.createElement("link");
  link.rel = "stylesheet";
  link.href = "https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Outfit:wght@300;400;500;600;700&display=swap";
  document.head.appendChild(link);

  const s = document.createElement("style");
  s.id = "mn-styles";
  s.textContent = `
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
    .mn-dark  { --bg:#07090F; --bg2:#0D1117; --bg3:#131920; --bg4:#1A2233; --text:#FFFFFF; --text2:#B0B0B0; --card:#0D1117; --border:rgba(255,255,255,0.07); --amber:#FFC107; --amber2:#FFD54F; }
    .mn-light { --bg:#F1F3F7; --bg2:#FFFFFF;  --bg3:#E4E7EF; --bg4:#D8DCE8; --text:#07090F; --text2:#555C6E; --card:#FFFFFF; --border:rgba(0,0,0,0.08); --amber:#F59E0B; --amber2:#FFC107; }
    html { scroll-behavior:smooth; }
    body { margin:0; overflow-x:hidden; }
    #root { font-family:'Outfit',sans-serif; background:var(--bg); color:var(--text); min-height:100vh; transition:background .3s,color .3s; }
    h1,h2,h3,.bebas { font-family:'Bebas Neue',sans-serif; letter-spacing:.06em; }
    img { display:block; max-width:100%; }
    button { cursor:pointer; border:none; background:none; font-family:'Outfit',sans-serif; }
    ::-webkit-scrollbar { width:3px; }
    ::-webkit-scrollbar-track { background:var(--bg); }
    ::-webkit-scrollbar-thumb { background:var(--amber); border-radius:2px; }

    @keyframes fadeUp   { from{opacity:0;transform:translateY(22px)} to{opacity:1;transform:translateY(0)} }
    @keyframes fadeIn   { from{opacity:0} to{opacity:1} }
    @keyframes slideUp  { from{opacity:0;transform:translateY(36px)} to{opacity:1;transform:translateY(0)} }
    @keyframes toastIn  { from{opacity:0;transform:translateX(-50%) translateY(12px)} to{opacity:1;transform:translateX(-50%) translateY(0)} }
    @keyframes spin     { to{transform:rotate(360deg)} }
    @keyframes heroZoom { from{opacity:0;transform:scale(1.04)} to{opacity:1;transform:scale(1)} }

    /* PAGE SHELL */
    .mn-page { padding-top:64px; padding-bottom:72px; min-height:100vh; }
    @media(min-width:768px){ .mn-page{padding-bottom:32px;} }

    /* TOP NAV */
    .mn-topnav { position:fixed;top:0;left:0;right:0;height:64px;z-index:200;
      background:rgba(7,9,15,.88);backdrop-filter:blur(18px);border-bottom:1px solid var(--border);
      display:flex;align-items:center;justify-content:space-between;padding:0 28px; }
    .mn-light .mn-topnav { background:rgba(241,243,247,.94); }
    .mn-logo { font-family:'Bebas Neue',sans-serif;font-size:26px;letter-spacing:.1em;color:var(--amber);cursor:pointer;user-select:none; }
    .mn-logo span { color:var(--text); }
    .mn-nav-links { display:flex;gap:4px; }
    .mn-nav-btn { padding:7px 15px;border-radius:8px;font-size:13px;font-weight:500;color:var(--text2);transition:all .18s;display:flex;align-items:center;gap:6px; }
    .mn-nav-btn:hover,.mn-nav-btn.active { color:var(--text);background:var(--bg3); }
    .mn-nav-btn.active { color:var(--amber); }
    @media(max-width:767px){ .mn-nav-links{display:none;} }

    /* BOTTOM NAV */
    .mn-bottomnav { position:fixed;bottom:0;left:0;right:0;height:60px;z-index:200;
      background:var(--bg2);border-top:1px solid var(--border);display:grid;grid-template-columns:repeat(4,1fr); }
    @media(min-width:768px){ .mn-bottomnav{display:none;} }
    .mn-bnav-btn { display:flex;flex-direction:column;align-items:center;justify-content:center;gap:3px;font-size:10px;font-weight:500;color:var(--text2);transition:color .18s; }
    .mn-bnav-btn.active { color:var(--amber); }

    /* HERO */
    .mn-hero { position:relative;width:100%;height:520px;overflow:hidden; }
    @media(min-width:768px){ .mn-hero{height:640px;} }
    .mn-hero-slide { position:absolute;inset:0;opacity:0;transition:opacity .8s ease;pointer-events:none; }
    .mn-hero-slide.active { opacity:1;pointer-events:all;animation:heroZoom .8s ease; }
    .mn-hero-slide img { width:100%;height:100%;object-fit:cover; }
    .mn-hero-overlay { position:absolute;inset:0;background:linear-gradient(to right,rgba(7,9,15,.96) 0%,rgba(7,9,15,.65) 55%,transparent 100%); }
    .mn-hero-content { position:absolute;bottom:0;left:0;right:0;padding:32px 22px;max-width:580px; }
    @media(min-width:768px){ .mn-hero-content{padding:52px 52px;} }
    .mn-hero-badge { display:inline-flex;align-items:center;gap:6px;background:var(--amber);color:#000;font-size:10px;font-weight:800;padding:4px 10px;border-radius:4px;letter-spacing:.1em;margin-bottom:12px;text-transform:uppercase; }
    .mn-hero-title { font-family:'Bebas Neue',sans-serif;font-size:44px;line-height:1;color:#fff;margin-bottom:10px;text-shadow:0 2px 24px rgba(0,0,0,.5); }
    @media(min-width:768px){ .mn-hero-title{font-size:64px;} }
    .mn-hero-desc { font-size:14px;color:rgba(255,255,255,.7);line-height:1.6;margin-bottom:22px;max-width:460px; }
    .mn-hero-actions { display:flex;gap:12px;flex-wrap:wrap; }
    .mn-hero-dots { position:absolute;bottom:22px;right:22px;display:flex;gap:6px; }
    .mn-hero-dot { width:6px;height:6px;border-radius:50%;background:rgba(255,255,255,.3);cursor:pointer;transition:all .22s; }
    .mn-hero-dot.active { background:var(--amber);width:20px;border-radius:3px; }
    .mn-hero-arrow { position:absolute;top:50%;transform:translateY(-50%);background:rgba(0,0,0,.45);color:#fff;width:38px;height:38px;border-radius:50%;display:flex;align-items:center;justify-content:center;border:1px solid rgba(255,255,255,.15);transition:background .18s; }
    .mn-hero-arrow:hover { background:rgba(0,0,0,.7); }

    /* BUTTONS */
    .mn-btn { display:inline-flex;align-items:center;gap:8px;padding:10px 22px;border-radius:8px;font-size:14px;font-weight:600;transition:all .18s;cursor:pointer; }
    .mn-btn-primary { background:var(--amber);color:#000; }
    .mn-btn-primary:hover { background:var(--amber2);transform:translateY(-1px); }
    .mn-btn-ghost { background:rgba(255,255,255,.12);color:#fff;border:1px solid rgba(255,255,255,.18); }
    .mn-btn-ghost:hover { background:rgba(255,255,255,.2); }
    .mn-btn-outline { background:transparent;color:var(--text);border:1px solid var(--border); }
    .mn-btn-outline:hover { border-color:var(--amber);color:var(--amber); }
    .mn-btn-danger { background:#EF4444;color:#fff; }
    .mn-btn-danger:hover { background:#DC2626; }
    .mn-btn-sm { padding:7px 14px;font-size:13px;border-radius:6px; }

    /* SECTIONS */
    .mn-section { padding:28px 16px; }
    @media(min-width:768px){ .mn-section{padding:36px 36px;} }
    @media(min-width:1200px){ .mn-section{padding:44px 72px;} }
    .mn-section-title { font-family:'Bebas Neue',sans-serif;font-size:26px;letter-spacing:.08em;margin-bottom:18px; }
    .mn-section-title span { color:var(--amber); }

    /* MOVIE GRID */
    .mn-grid { display:grid;gap:14px;grid-template-columns:repeat(2,1fr); }
    @media(min-width:480px){ .mn-grid{grid-template-columns:repeat(3,1fr);} }
    @media(min-width:768px){ .mn-grid{grid-template-columns:repeat(4,1fr);gap:18px;} }
    @media(min-width:1100px){ .mn-grid{grid-template-columns:repeat(5,1fr);} }
    @media(min-width:1400px){ .mn-grid{grid-template-columns:repeat(6,1fr);} }

    /* MOVIE CARD */
    .mn-card { border-radius:10px;overflow:hidden;cursor:pointer;position:relative;background:var(--card);animation:fadeUp .4s ease both; }
    .mn-card:hover .mn-card-overlay { opacity:1; }
    .mn-card:hover .mn-card-img { transform:scale(1.05); }
    .mn-card-img-wrap { width:100%;aspect-ratio:2/3;overflow:hidden;background:var(--bg3); }
    .mn-card-img { width:100%;height:100%;object-fit:cover;transition:transform .32s ease; }
    .mn-card-info { padding:9px 9px 10px; }
    .mn-card-title { font-size:13px;font-weight:600;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;color:var(--text); }
    .mn-card-sub { font-size:11px;color:var(--text2);margin-top:2px; }
    .mn-card-overlay { position:absolute;inset:0;background:rgba(7,9,15,.72);display:flex;align-items:center;justify-content:center;opacity:0;transition:opacity .2s; }
    .mn-play-btn { width:46px;height:46px;border-radius:50%;background:var(--amber);display:flex;align-items:center;justify-content:center; }

    /* HORIZONTAL SCROLL ROW */
    .mn-hrow { display:flex;gap:14px;overflow-x:auto;padding-bottom:6px;scrollbar-width:none; }
    .mn-hrow::-webkit-scrollbar { display:none; }
    .mn-hrow-card { flex-shrink:0;width:140px; }
    @media(min-width:480px){ .mn-hrow-card{width:162px;} }

    /* GENRE CHIPS */
    .mn-chips { display:flex;gap:8px;overflow-x:auto;padding-bottom:4px;scrollbar-width:none;margin-bottom:20px; }
    .mn-chips::-webkit-scrollbar { display:none; }
    .mn-chip { padding:6px 18px;border-radius:100px;font-size:13px;font-weight:500;cursor:pointer;border:1px solid var(--border);background:var(--bg3);color:var(--text2);transition:all .18s;white-space:nowrap;flex-shrink:0; }
    .mn-chip:hover,.mn-chip.active { background:var(--amber);color:#000;border-color:var(--amber); }

    /* MODAL */
    .mn-modal-overlay { position:fixed;inset:0;background:rgba(0,0,0,.9);z-index:500;display:flex;align-items:center;justify-content:center;padding:16px;backdrop-filter:blur(8px);animation:fadeIn .2s ease; }
    .mn-modal { background:var(--bg2);border-radius:16px;overflow:hidden;max-width:840px;width:100%;max-height:92vh;overflow-y:auto;animation:slideUp .3s ease;border:1px solid var(--border); }
    .mn-modal-close { position:absolute;top:12px;right:12px;width:36px;height:36px;border-radius:50%;background:rgba(0,0,0,.65);display:flex;align-items:center;justify-content:center;color:#fff;z-index:10;cursor:pointer;backdrop-filter:blur(4px);border:1px solid rgba(255,255,255,.15); }
    .mn-modal-body { padding:22px 24px 30px; }
    .mn-modal-layout { display:grid;gap:20px; }
    @media(min-width:540px){ .mn-modal-layout{grid-template-columns:160px 1fr;} }
    .mn-modal-title { font-family:'Bebas Neue',sans-serif;font-size:34px;line-height:1.05; }
    .mn-modal-meta { display:flex;gap:7px;flex-wrap:wrap;margin:8px 0 14px; }
    .mn-meta-tag { padding:3px 10px;border-radius:4px;font-size:12px;font-weight:600;background:var(--bg3);color:var(--text2); }
    .mn-modal-desc { font-size:14px;color:var(--text2);line-height:1.68;margin-bottom:22px; }
    .mn-modal-actions { display:flex;gap:10px;flex-wrap:wrap; }

    /* SEARCH */
    .mn-search-wrap { position:relative;margin-bottom:24px; }
    .mn-search-icon { position:absolute;left:16px;top:50%;transform:translateY(-50%);color:var(--text2);pointer-events:none; }
    .mn-search-input { width:100%;padding:14px 20px 14px 48px;border-radius:12px;background:var(--bg3);border:1px solid var(--border);color:var(--text);font-size:16px;font-family:'Outfit',sans-serif;outline:none;transition:border-color .2s; }
    .mn-search-input:focus { border-color:var(--amber); }
    .mn-search-input::placeholder { color:var(--text2); }

    /* TOGGLE */
    .mn-toggle { position:relative;width:48px;height:26px;cursor:pointer; }
    .mn-toggle input { opacity:0;width:0;height:0;position:absolute; }
    .mn-slider { position:absolute;inset:0;background:var(--bg3);border-radius:26px;transition:.3s;border:1px solid var(--border); }
    .mn-slider::before { content:'';position:absolute;height:18px;width:18px;left:3px;bottom:3px;background:var(--text2);border-radius:50%;transition:.3s; }
    input:checked + .mn-slider { background:var(--amber); }
    input:checked + .mn-slider::before { transform:translateX(22px);background:#000; }

    /* ADMIN */
    .mn-stat-card { background:var(--bg2);border-radius:12px;padding:22px;border:1px solid var(--border); }
    .mn-stat-num { font-family:'Bebas Neue',sans-serif;font-size:38px;color:var(--amber); }
    .mn-stat-label { font-size:11px;font-weight:700;letter-spacing:.08em;text-transform:uppercase;color:var(--text2);margin-top:2px; }
    .mn-input { width:100%;padding:10px 14px;border-radius:8px;background:var(--bg3);border:1px solid var(--border);color:var(--text);font-family:'Outfit',sans-serif;font-size:14px;outline:none;transition:border-color .2s; }
    .mn-input:focus { border-color:var(--amber); }
    textarea.mn-input { resize:vertical;min-height:80px; }
    .mn-label { font-size:12px;font-weight:700;color:var(--text2);letter-spacing:.06em;text-transform:uppercase;margin-bottom:6px;display:block; }
    .mn-form-group { margin-bottom:16px; }
    .mn-table-wrap { overflow-x:auto;border-radius:12px;border:1px solid var(--border); }
    .mn-table { width:100%;border-collapse:collapse; }
    .mn-table th { font-size:11px;font-weight:700;color:var(--text2);letter-spacing:.08em;text-transform:uppercase;padding:12px;text-align:left;border-bottom:1px solid var(--border); }
    .mn-table td { padding:12px;border-bottom:1px solid var(--border);font-size:13px;color:var(--text); }
    .mn-table tr:last-child td { border-bottom:none; }
    .mn-table tr:hover td { background:var(--bg3); }
    .mn-tabs { display:flex;gap:4px;background:var(--bg3);border-radius:10px;padding:4px;margin-bottom:24px; }
    .mn-tab { flex:1;padding:9px;border-radius:7px;font-size:13px;font-weight:600;color:var(--text2);transition:all .18s;text-align:center;cursor:pointer; }
    .mn-tab.active { background:var(--bg2);color:var(--text);box-shadow:0 1px 6px rgba(0,0,0,.22); }

    /* TOAST */
    .mn-toast { position:fixed;bottom:74px;left:50%;transform:translateX(-50%);background:var(--amber);color:#000;padding:10px 24px;border-radius:8px;font-weight:700;font-size:13px;z-index:9999;white-space:nowrap;box-shadow:0 4px 24px rgba(255,193,7,.4);animation:toastIn .3s ease;pointer-events:none; }
    @media(min-width:768px){ .mn-toast{bottom:28px;} }

    /* BACK TO TOP */
    .mn-backtop { position:fixed;bottom:74px;right:16px;z-index:300;background:var(--amber);color:#000;width:40px;height:40px;border-radius:50%;display:flex;align-items:center;justify-content:center;cursor:pointer;box-shadow:0 4px 18px rgba(255,193,7,.45);transition:opacity .3s,transform .3s; }
    @media(min-width:768px){ .mn-backtop{bottom:28px;right:28px;} }

    /* DIVIDER */
    .mn-divider { height:1px;background:var(--border); }

    /* EMPTY STATE */
    .mn-empty { text-align:center;padding:64px 20px;color:var(--text2); }
    .mn-empty-icon { font-size:52px;margin-bottom:14px;opacity:.28; }

    /* STAGGER CARDS */
    .mn-card:nth-child(1){animation-delay:0ms}
    .mn-card:nth-child(2){animation-delay:40ms}
    .mn-card:nth-child(3){animation-delay:80ms}
    .mn-card:nth-child(4){animation-delay:120ms}
    .mn-card:nth-child(5){animation-delay:160ms}
    .mn-card:nth-child(n+6){animation-delay:200ms}

    /* FOOTER */
    .mn-footer { background:var(--bg2);border-top:1px solid var(--border);padding:30px 24px 80px;text-align:center; }
    @media(min-width:768px){ .mn-footer{padding:30px 24px 36px;} }
  `;
  document.head.appendChild(s);
}

/* ─────────────────────────── CONSTANTS ─────────────────────────── */
const GENRES = ["All","Action","Adventure","Comedy","Drama","Horror","Romance","Sci-Fi","Thriller","Animation"];
const ADMIN_PASS = "movienation"; // ← CHANGE THIS before going live!

const SEED_MOVIES = [
  { id:"1",  title:"Interstellar",               year:2014, genres:["Sci-Fi","Drama"],
    desc:"A team of explorers travel through a wormhole in space in an attempt to ensure humanity's survival.",
    poster:"https://picsum.photos/seed/inter300/300/450",     backdrop:"https://picsum.photos/seed/inter1400/1400/640",
    watchUrl:"https://example.com/watch/interstellar",        downloadUrl:"https://example.com/dl/interstellar",
    featured:true, watchClicks:1240, dlClicks:893 },
  { id:"2",  title:"The Dark Knight",             year:2008, genres:["Action","Thriller"],
    desc:"Batman raises the stakes in his war on crime with the help of Lt. Gordon and DA Harvey Dent to dismantle organized crime in Gotham.",
    poster:"https://picsum.photos/seed/batman300/300/450",    backdrop:"https://picsum.photos/seed/batman1400/1400/640",
    watchUrl:"https://example.com/watch/dark-knight",         downloadUrl:"https://example.com/dl/dark-knight",
    featured:true, watchClicks:2100, dlClicks:1440 },
  { id:"3",  title:"Inception",                  year:2010, genres:["Sci-Fi","Thriller"],
    desc:"A thief who steals corporate secrets through dream-sharing technology is given the inverse task of planting an idea.",
    poster:"https://picsum.photos/seed/inception300/300/450", backdrop:"https://picsum.photos/seed/inception1400/1400/640",
    watchUrl:"https://example.com/watch/inception",           downloadUrl:"https://example.com/dl/inception",
    featured:true, watchClicks:1870, dlClicks:1100 },
  { id:"4",  title:"Dune: Part Two",             year:2024, genres:["Sci-Fi","Adventure"],
    desc:"Paul Atreides unites with the Fremen to wage war against House Harkonnen and prevent a terrible future.",
    poster:"https://picsum.photos/seed/dune300/300/450",      backdrop:"https://picsum.photos/seed/dune1400/1400/640",
    watchUrl:"https://example.com/watch/dune-part-two",       downloadUrl:"https://example.com/dl/dune-part-two",
    featured:false, watchClicks:980, dlClicks:710 },
  { id:"5",  title:"Oppenheimer",                year:2023, genres:["Drama","Thriller"],
    desc:"The story of J. Robert Oppenheimer's role in the development of the atomic bomb during World War II.",
    poster:"https://picsum.photos/seed/oppen300/300/450",     backdrop:"https://picsum.photos/seed/oppen1400/1400/640",
    watchUrl:"https://example.com/watch/oppenheimer",         downloadUrl:"https://example.com/dl/oppenheimer",
    featured:false, watchClicks:1530, dlClicks:890 },
  { id:"6",  title:"Top Gun: Maverick",          year:2022, genres:["Action","Drama"],
    desc:"After 30+ years of service, Pete Mitchell faces pilots he trained for a dangerous mission that demands the ultimate sacrifice.",
    poster:"https://picsum.photos/seed/topgun300/300/450",    backdrop:"https://picsum.photos/seed/topgun1400/1400/640",
    watchUrl:"https://example.com/watch/top-gun",             downloadUrl:"https://example.com/dl/top-gun",
    featured:false, watchClicks:770, dlClicks:540 },
  { id:"7",  title:"Parasite",                   year:2019, genres:["Thriller","Drama"],
    desc:"Greed and class discrimination threaten the newly formed symbiotic relationship between the wealthy Park family and the destitute Kim clan.",
    poster:"https://picsum.photos/seed/parasite300/300/450",  backdrop:"https://picsum.photos/seed/parasite1400/1400/640",
    watchUrl:"https://example.com/watch/parasite",            downloadUrl:"https://example.com/dl/parasite",
    featured:false, watchClicks:640, dlClicks:490 },
  { id:"8",  title:"Everything Everywhere",      year:2022, genres:["Comedy","Sci-Fi"],
    desc:"A middle-aged Chinese-American laundromat owner is swept up in an epic adventure to save the multiverse.",
    poster:"https://picsum.photos/seed/eeaao300/300/450",     backdrop:"https://picsum.photos/seed/eeaao1400/1400/640",
    watchUrl:"https://example.com/watch/eeaao",               downloadUrl:"https://example.com/dl/eeaao",
    featured:false, watchClicks:820, dlClicks:600 },
  { id:"9",  title:"The Batman",                 year:2022, genres:["Action","Thriller"],
    desc:"Batman ventures into Gotham City's underworld when a sadistic killer leaves behind a trail of cryptic clues.",
    poster:"https://picsum.photos/seed/thebatman300/300/450", backdrop:"https://picsum.photos/seed/thebatman1400/1400/640",
    watchUrl:"https://example.com/watch/the-batman",          downloadUrl:"https://example.com/dl/the-batman",
    featured:false, watchClicks:950, dlClicks:720 },
  { id:"10", title:"Avengers: Endgame",          year:2019, genres:["Action","Adventure"],
    desc:"After devastating events, the universe is in ruins. The Avengers assemble once more for one final mission.",
    poster:"https://picsum.photos/seed/avengers300/300/450",  backdrop:"https://picsum.photos/seed/avengers1400/1400/640",
    watchUrl:"https://example.com/watch/avengers-endgame",    downloadUrl:"https://example.com/dl/avengers-endgame",
    featured:false, watchClicks:3100, dlClicks:2200 },
  { id:"11", title:"The Grand Budapest Hotel",   year:2014, genres:["Comedy","Drama"],
    desc:"The adventures of Gustave H., legendary concierge at a famous European hotel, and Zero, his most trusted lobby boy.",
    poster:"https://picsum.photos/seed/budapest300/300/450",  backdrop:"https://picsum.photos/seed/budapest1400/1400/640",
    watchUrl:"https://example.com/watch/grand-budapest",      downloadUrl:"https://example.com/dl/grand-budapest",
    featured:false, watchClicks:410, dlClicks:290 },
  { id:"12", title:"Spider-Man: No Way Home",    year:2021, genres:["Action","Adventure"],
    desc:"Spider-Man's identity is revealed and he asks Doctor Strange for help. The spell goes wrong, pulling villains from alternate universes.",
    poster:"https://picsum.photos/seed/spidey300/300/450",    backdrop:"https://picsum.photos/seed/spidey1400/1400/640",
    watchUrl:"https://example.com/watch/spider-man-nwh",      downloadUrl:"https://example.com/dl/spider-man-nwh",
    featured:false, watchClicks:2600, dlClicks:1900 },
];

/* ─────────────────────────── LOCAL STORAGE HELPERS ─────────────────────────── */
const getMovies   = () => { try { const s = localStorage.getItem("mn_movies"); return s ? JSON.parse(s) : SEED_MOVIES; } catch { return SEED_MOVIES; } };
const saveMovies  = (m) => { try { localStorage.setItem("mn_movies", JSON.stringify(m)); } catch {} };
const getDark     = () => { try { return localStorage.getItem("mn_dark") !== "false"; } catch { return true; } };
const saveDark    = (v) => { try { localStorage.setItem("mn_dark", String(v)); } catch {} };
const getAnalytics = () => {
  try { const s = localStorage.getItem("mn_analytics"); if (s) return JSON.parse(s); } catch {}
  return {
    visits:18420, pageviews:47230,
    sources:[{name:"Direct",value:42},{name:"Google",value:33},{name:"Social",value:16},{name:"Other",value:9}],
    devices:[{name:"Mobile",value:61},{name:"Desktop",value:31},{name:"Tablet",value:8}]
  };
};

/* ─────────────────────────── ICONS ─────────────────────────── */
const I = {
  home:     <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>,
  search:   <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>,
  compass:  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><circle cx="12" cy="12" r="10"/><polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76"/></svg>,
  settings: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06-.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>,
  play:     <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor"><polygon points="5 3 19 12 5 21 5 3"/></svg>,
  download: <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>,
  x:        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>,
  edit:     <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>,
  trash:    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/><path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/></svg>,
  plus:     <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>,
  up:       <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><polyline points="18 15 12 9 6 15"/></svg>,
  left:     <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round"><polyline points="15 18 9 12 15 6"/></svg>,
  right:    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round"><polyline points="9 18 15 12 9 6"/></svg>,
  moon:     <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>,
  sun:      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>,
  logout:   <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>,
  lock:     <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>,
  film:     <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><rect x="2" y="2" width="20" height="20" rx="2.18"/><line x1="7" y1="2" x2="7" y2="22"/><line x1="17" y1="2" x2="17" y2="22"/><line x1="2" y1="12" x2="22" y2="12"/><line x1="2" y1="7" x2="7" y2="7"/><line x1="2" y1="17" x2="7" y2="17"/><line x1="17" y1="17" x2="22" y2="17"/><line x1="17" y1="7" x2="22" y2="7"/></svg>,
};

/* ─────────────────────────── LAZY IMAGE ─────────────────────────── */
function LazyImg({ src, alt, className, style }) {
  const [loaded, setLoaded] = useState(false);
  const [err, setErr]       = useState(false);
  return (
    <div style={{ position:"relative", width:"100%", height:"100%", background:"var(--bg3)", overflow:"hidden", ...style }}>
      {!loaded && !err && (
        <div style={{ position:"absolute", inset:0, display:"flex", alignItems:"center", justifyContent:"center" }}>
          <div style={{ width:22, height:22, border:"2px solid var(--border)", borderTopColor:"var(--amber)", borderRadius:"50%", animation:"spin .8s linear infinite" }} />
        </div>
      )}
      {err
        ? <div style={{ position:"absolute", inset:0, display:"flex", alignItems:"center", justifyContent:"center", flexDirection:"column", gap:8, color:"var(--text2)", fontSize:12 }}>{I.film}<span>No image</span></div>
        : <img src={src} alt={alt} className={className}
            style={{ opacity: loaded ? 1 : 0, transition:"opacity .4s", width:"100%", height:"100%", objectFit:"cover" }}
            loading="lazy" onLoad={() => setLoaded(true)} onError={() => setErr(true)} />
      }
    </div>
  );
}

/* ─────────────────────────── TOAST ─────────────────────────── */
function Toast({ msg }) {
  return <div className="mn-toast">{msg}</div>;
}

/* ─────────────────────────── BACK TO TOP ─────────────────────────── */
function BackToTop() {
  const [show, setShow] = useState(false);
  useEffect(() => {
    const fn = () => setShow(window.scrollY > 300);
    window.addEventListener("scroll", fn);
    return () => window.removeEventListener("scroll", fn);
  }, []);
  if (!show) return null;
  return (
    <button className="mn-backtop" onClick={() => window.scrollTo({ top:0, behavior:"smooth" })}>
      {I.up}
    </button>
  );
}

/* ─────────────────────────── MOVIE CARD ─────────────────────────── */
function MovieCard({ movie, onClick }) {
  return (
    <div className="mn-card" onClick={() => onClick(movie)} role="button" tabIndex={0}
      onKeyDown={e => e.key === "Enter" && onClick(movie)}>
      <div className="mn-card-img-wrap">
        <LazyImg src={movie.poster} alt={movie.title} className="mn-card-img" />
      </div>
      <div className="mn-card-overlay">
        <div className="mn-play-btn">{I.play}</div>
      </div>
      <div className="mn-card-info">
        <div className="mn-card-title">{movie.title}</div>
        <div className="mn-card-sub">{movie.year} · {movie.genres?.[0]}</div>
      </div>
    </div>
  );
}

/* ─────────────────────────── MOVIE MODAL ─────────────────────────── */
function MovieModal({ movie, onClose, onWatch, onDownload }) {
  useEffect(() => {
    const fn = e => e.key === "Escape" && onClose();
    window.addEventListener("keydown", fn);
    document.body.style.overflow = "hidden";
    return () => { window.removeEventListener("keydown", fn); document.body.style.overflow = ""; };
  }, [onClose]);

  return (
    <div className="mn-modal-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="mn-modal">
        <div style={{ position:"relative" }}>
          <LazyImg src={movie.backdrop} alt={movie.title} style={{ height:240, width:"100%" }} />
          <div style={{ position:"absolute", bottom:0, left:0, right:0, height:140,
            background:"linear-gradient(transparent, var(--bg2))" }} />
          <button className="mn-modal-close" onClick={onClose}>{I.x}</button>
        </div>
        <div className="mn-modal-body">
          <div className="mn-modal-layout">
            <div>
              <LazyImg src={movie.poster} alt={movie.title}
                style={{ aspectRatio:"2/3", borderRadius:10 }} />
            </div>
            <div>
              <h2 className="mn-modal-title">{movie.title}</h2>
              <div className="mn-modal-meta">
                <span className="mn-meta-tag">{movie.year}</span>
                {movie.genres?.map(g => <span key={g} className="mn-meta-tag">{g}</span>)}
              </div>
              <p className="mn-modal-desc">{movie.desc}</p>
              <div className="mn-modal-actions">
                <button className="mn-btn mn-btn-primary" onClick={() => onWatch(movie)}>
                  {I.play} Watch Now
                </button>
                <button className="mn-btn mn-btn-outline" onClick={() => onDownload(movie)}>
                  {I.download} Download
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────── HERO CAROUSEL ─────────────────────────── */
function Hero({ movies, onMovieClick, onWatch }) {
  const [idx, setIdx] = useState(0);
  const items = useMemo(() => {
    const f = movies.filter(m => m.featured);
    return f.length > 0 ? f : movies.slice(0, 3);
  }, [movies]);

  useEffect(() => {
    if (items.length <= 1) return;
    const t = setInterval(() => setIdx(i => (i + 1) % items.length), 5500);
    return () => clearInterval(t);
  }, [items.length]);

  if (!items.length) return null;
  const cur = items[idx];
  const prev = () => setIdx(i => (i - 1 + items.length) % items.length);
  const next = () => setIdx(i => (i + 1) % items.length);

  return (
    <div className="mn-hero">
      {items.map((m, i) => (
        <div key={m.id} className={`mn-hero-slide ${i === idx ? "active" : ""}`}>
          <img src={m.backdrop} alt={m.title} style={{ width:"100%", height:"100%", objectFit:"cover" }} loading="lazy" />
        </div>
      ))}
      <div className="mn-hero-overlay" />
      <div className="mn-hero-content">
        <div className="mn-hero-badge">{I.play} Featured</div>
        <h1 className="mn-hero-title">{cur.title}</h1>
        <p className="mn-hero-desc">{cur.desc?.slice(0, 130)}…</p>
        <div className="mn-hero-actions">
          <button className="mn-btn mn-btn-primary" onClick={() => onWatch(cur)}>{I.play} Watch Now</button>
          <button className="mn-btn mn-btn-ghost" onClick={() => onMovieClick(cur)}>More Info</button>
        </div>
      </div>
      {items.length > 1 && (
        <>
          <div className="mn-hero-dots">
            {items.map((_, i) => (
              <div key={i} className={`mn-hero-dot ${i === idx ? "active" : ""}`} onClick={() => setIdx(i)} />
            ))}
          </div>
          <button className="mn-hero-arrow" style={{ left:12 }} onClick={prev}>{I.left}</button>
          <button className="mn-hero-arrow" style={{ right:12 }} onClick={next}>{I.right}</button>
        </>
      )}
    </div>
  );
}

/* ─────────────────────────── GENRE CHIPS ─────────────────────────── */
function GenreChips({ active, onChange }) {
  return (
    <div className="mn-chips">
      {GENRES.map(g => (
        <button key={g} className={`mn-chip ${active === g ? "active" : ""}`} onClick={() => onChange(g)}>{g}</button>
      ))}
    </div>
  );
}

/* ─────────────────────────── HOME PAGE ─────────────────────────── */
function HomePage({ movies, onMovieClick, onWatch, onDownload }) {
  const trending = useMemo(() => [...movies].sort((a,b) => (b.watchClicks||0)-(a.watchClicks||0)).slice(0,10), [movies]);
  const recent   = useMemo(() => [...movies].sort((a,b) => b.year - a.year).slice(0,10), [movies]);
  const byGenre  = useMemo(() => {
    const out = {};
    ["Action","Sci-Fi","Drama","Comedy","Thriller"].forEach(g => {
      const list = movies.filter(m => m.genres?.includes(g)).slice(0, 8);
      if (list.length) out[g] = list;
    });
    return out;
  }, [movies]);

  return (
    <>
      <Hero movies={movies} onMovieClick={onMovieClick} onWatch={onWatch} />

      <div className="mn-section">
        <h2 className="mn-section-title">Trending <span>Now</span></h2>
        <div className="mn-hrow">
          {trending.map(m => (
            <div key={m.id} className="mn-hrow-card"><MovieCard movie={m} onClick={onMovieClick} /></div>
          ))}
        </div>
      </div>

      <div className="mn-divider" />
      <div className="mn-section">
        <h2 className="mn-section-title">Latest <span>Releases</span></h2>
        <div className="mn-grid">
          {recent.map(m => <MovieCard key={m.id} movie={m} onClick={onMovieClick} />)}
        </div>
      </div>

      {Object.entries(byGenre).map(([genre, list]) => (
        <div key={genre}>
          <div className="mn-divider" />
          <div className="mn-section">
            <h2 className="mn-section-title">{genre}</h2>
            <div className="mn-hrow">
              {list.map(m => (
                <div key={m.id} className="mn-hrow-card"><MovieCard movie={m} onClick={onMovieClick} /></div>
              ))}
            </div>
          </div>
        </div>
      ))}
    </>
  );
}

/* ─────────────────────────── EXPLORER PAGE ─────────────────────────── */
function ExplorerPage({ movies, onMovieClick }) {
  const [genre, setGenre] = useState("All");
  const filtered = useMemo(() => genre === "All" ? movies : movies.filter(m => m.genres?.includes(genre)), [movies, genre]);

  return (
    <div className="mn-section">
      <h1 className="mn-section-title">Explore <span>Movies</span></h1>
      <GenreChips active={genre} onChange={setGenre} />
      {filtered.length === 0
        ? <div className="mn-empty"><div className="mn-empty-icon">🎬</div><p>No movies in this genre yet.</p></div>
        : <div className="mn-grid">{filtered.map(m => <MovieCard key={m.id} movie={m} onClick={onMovieClick} />)}</div>
      }
    </div>
  );
}

/* ─────────────────────────── SEARCH PAGE ─────────────────────────── */
function SearchPage({ movies, onMovieClick }) {
  const [q, setQ] = useState("");
  const results = useMemo(() => {
    if (!q.trim()) return [];
    const lq = q.toLowerCase();
    return movies.filter(m =>
      m.title?.toLowerCase().includes(lq) ||
      m.genres?.some(g => g.toLowerCase().includes(lq)) ||
      String(m.year).includes(lq)
    );
  }, [q, movies]);

  return (
    <div className="mn-section">
      <h1 className="mn-section-title">Search <span>Movies</span></h1>
      <div className="mn-search-wrap">
        <span className="mn-search-icon">{I.search}</span>
        <input className="mn-search-input" placeholder="Search title, genre, year…"
          value={q} onChange={e => setQ(e.target.value)} autoFocus />
      </div>
      {q.trim() === ""
        ? <div className="mn-empty"><div className="mn-empty-icon">🔍</div><p>Start typing to find movies.</p></div>
        : results.length === 0
          ? <div className="mn-empty"><div className="mn-empty-icon">😕</div><p>No results for "<strong>{q}</strong>"</p></div>
          : <>
              <p style={{ color:"var(--text2)", fontSize:13, marginBottom:16 }}>
                {results.length} result{results.length !== 1 ? "s" : ""} for "{q}"
              </p>
              <div className="mn-grid">{results.map(m => <MovieCard key={m.id} movie={m} onClick={onMovieClick} />)}</div>
            </>
      }
    </div>
  );
}

/* ─────────────────────────── SETTINGS PAGE ─────────────────────────── */
function SettingsPage({ darkMode, setDarkMode }) {
  return (
    <div className="mn-section" style={{ maxWidth:520 }}>
      <h1 className="mn-section-title" style={{ marginBottom:24 }}>Settings</h1>
      <div style={{ background:"var(--bg2)", borderRadius:16, padding:24, border:"1px solid var(--border)" }}>

        {/* Dark / Light Toggle */}
        <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between",
          padding:"16px 0", borderBottom:"1px solid var(--border)" }}>
          <div style={{ display:"flex", alignItems:"center", gap:12 }}>
            <span style={{ color:"var(--text2)" }}>{darkMode ? I.moon : I.sun}</span>
            <div>
              <div style={{ fontWeight:600, fontSize:15 }}>{darkMode ? "Dark Mode" : "Light Mode"}</div>
              <div style={{ fontSize:12, color:"var(--text2)" }}>Toggle site appearance</div>
            </div>
          </div>
          <label className="mn-toggle">
            <input type="checkbox" checked={darkMode} onChange={e => setDarkMode(e.target.checked)} />
            <span className="mn-slider" />
          </label>
        </div>

        {/* About */}
        <div style={{ padding:"16px 0" }}>
          <div style={{ fontWeight:600, fontSize:15, marginBottom:6 }}>About MovieNation</div>
          <div style={{ fontSize:13, color:"var(--text2)", lineHeight:1.65 }}>
            Browse and discover movies, stream online or download via external links.
            Built for speed, designed for film lovers.
          </div>
        </div>
      </div>

      <div style={{ marginTop:28, textAlign:"center", color:"var(--text2)", fontSize:12 }}>
        © {new Date().getFullYear()} MovieNation · All rights reserved.
      </div>
    </div>
  );
}

/* ─────────────────────────── ADMIN LOGIN ─────────────────────────── */
function AdminLogin({ onLogin }) {
  const [pass, setPass]     = useState("");
  const [err, setErr]       = useState(false);
  const [loading, setLoading] = useState(false);

  const submit = () => {
    setLoading(true);
    setTimeout(() => {
      if (pass === ADMIN_PASS) { onLogin(); }
      else { setErr(true); setLoading(false); }
    }, 600);
  };

  return (
    <div style={{ minHeight:"100vh", display:"flex", alignItems:"center", justifyContent:"center", padding:20 }}>
      <div style={{ width:"100%", maxWidth:400 }}>
        <div style={{ textAlign:"center", marginBottom:32 }}>
          <div style={{ width:68, height:68, background:"var(--amber)", borderRadius:18,
            display:"flex", alignItems:"center", justifyContent:"center", margin:"0 auto 18px", color:"#000" }}>
            {I.lock}
          </div>
          <h1 style={{ fontFamily:"'Bebas Neue',sans-serif", fontSize:34, letterSpacing:".08em", marginBottom:6 }}>
            Admin Access
          </h1>
          <p style={{ color:"var(--text2)", fontSize:14 }}>Enter your password to continue</p>
        </div>
        <div style={{ background:"var(--bg2)", borderRadius:16, padding:28, border:"1px solid var(--border)" }}>
          <div className="mn-form-group">
            <label className="mn-label">Password</label>
            <input className="mn-input" type="password" placeholder="Enter admin password…"
              value={pass} onChange={e => { setPass(e.target.value); setErr(false); }}
              onKeyDown={e => e.key === "Enter" && submit()} autoFocus />
            {err && <p style={{ color:"#EF4444", fontSize:12, marginTop:6 }}>
              Incorrect password.
            </p>}
          </div>
          <button className="mn-btn mn-btn-primary" style={{ width:"100%", justifyContent:"center" }}
            onClick={submit} disabled={loading}>
            {loading ? "Verifying…" : "Sign In"}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────── ADMIN PANEL ─────────────────────────── */
const CHART_COLORS = ["#FFC107","#FF5722","#2196F3","#4CAF50","#9C27B0","#00BCD4","#FF9800","#E91E63"];

function AdminPanel({ movies, setMovies, onLogout, showToast }) {
  const [tab, setTab]           = useState("analytics");
  const [editMovie, setEditMovie] = useState(null);
  const [showForm, setShowForm]   = useState(false);
  const analytics = useMemo(() => getAnalytics(), []);

  const totalWatches = movies.reduce((s, m) => s + (m.watchClicks || 0), 0);
  const totalDl      = movies.reduce((s, m) => s + (m.dlClicks    || 0), 0);
  const topMovies    = useMemo(() =>
    [...movies].sort((a,b) =>
      ((b.watchClicks||0)+(b.dlClicks||0)) - ((a.watchClicks||0)+(a.dlClicks||0))
    ).slice(0, 8), [movies]);

  const chartData = topMovies.map(m => ({
    name:      m.title.length > 12 ? m.title.slice(0,12)+"…" : m.title,
    watches:   m.watchClicks || 0,
    downloads: m.dlClicks    || 0,
  }));

  const deleteMovie = id => {
    if (!window.confirm("Delete this movie?")) return;
    const updated = movies.filter(m => m.id !== id);
    setMovies(updated); saveMovies(updated);
    showToast("Movie deleted");
  };

  const openForm = (movie = null) => {
    setEditMovie(movie);
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="mn-section">
      {/* Header */}
      <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:24 }}>
        <h1 className="mn-section-title">Admin <span>Panel</span></h1>
        <button className="mn-btn mn-btn-outline mn-btn-sm" onClick={onLogout}>
          {I.logout} Logout
        </button>
      </div>

      {/* Tabs */}
      <div className="mn-tabs">
        {[["analytics","📊 Analytics"],["movies","🎬 Movies"]].map(([k,l]) => (
          <div key={k} className={`mn-tab ${tab===k?"active":""}`} onClick={() => setTab(k)}>{l}</div>
        ))}
      </div>

      {/* ── ANALYTICS ── */}
      {tab === "analytics" && (
        <div>
          {/* Stat Cards */}
          <div style={{ display:"grid", gap:14, gridTemplateColumns:"repeat(2,1fr)", marginBottom:22 }}>
            {[
              { label:"Total Visits",    val:analytics.visits.toLocaleString(),   icon:"👥" },
              { label:"Page Views",      val:analytics.pageviews.toLocaleString(), icon:"📄" },
              { label:"Total Watches",   val:totalWatches.toLocaleString(),        icon:"▶️" },
              { label:"Total Downloads", val:totalDl.toLocaleString(),             icon:"⬇️" },
            ].map(s => (
              <div key={s.label} className="mn-stat-card">
                <div style={{ fontSize:22, marginBottom:6 }}>{s.icon}</div>
                <div className="mn-stat-num">{s.val}</div>
                <div className="mn-stat-label">{s.label}</div>
              </div>
            ))}
          </div>

          {/* Bar Chart */}
          <div className="mn-stat-card" style={{ marginBottom:22 }}>
            <h3 style={{ fontFamily:"'Bebas Neue',sans-serif", fontSize:18, letterSpacing:".06em", marginBottom:16 }}>
              Top Movies by Clicks
            </h3>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={chartData} margin={{ top:0, right:0, bottom:0, left:-20 }}>
                <XAxis dataKey="name" tick={{ fill:"var(--text2)", fontSize:10 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill:"var(--text2)", fontSize:10 }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ background:"var(--bg3)", border:"1px solid var(--border)", borderRadius:8, color:"var(--text)", fontSize:12 }} />
                <Bar dataKey="watches"   fill="#FFC107" radius={[4,4,0,0]} name="Watches" />
                <Bar dataKey="downloads" fill="#FF5722" radius={[4,4,0,0]} name="Downloads" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Sources + Devices */}
          <div style={{ display:"grid", gap:14, gridTemplateColumns:"1fr 1fr" }}>
            {/* Sources */}
            <div className="mn-stat-card">
              <h3 style={{ fontFamily:"'Bebas Neue',sans-serif", fontSize:18, letterSpacing:".06em", marginBottom:14 }}>
                Traffic Sources
              </h3>
              {analytics.sources.map((s,i) => (
                <div key={s.name} style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:10 }}>
                  <div style={{ display:"flex", alignItems:"center", gap:8 }}>
                    <div style={{ width:10, height:10, borderRadius:2, background:CHART_COLORS[i] }} />
                    <span style={{ fontSize:13, color:"var(--text2)" }}>{s.name}</span>
                  </div>
                  <span style={{ fontSize:13, fontWeight:700 }}>{s.value}%</span>
                </div>
              ))}
            </div>
            {/* Devices */}
            <div className="mn-stat-card">
              <h3 style={{ fontFamily:"'Bebas Neue',sans-serif", fontSize:18, letterSpacing:".06em", marginBottom:14 }}>
                Devices
              </h3>
              <div style={{ display:"flex", justifyContent:"center" }}>
                <PieChart width={120} height={120}>
                  <Pie data={analytics.devices} cx={58} cy={58} innerRadius={32} outerRadius={54} dataKey="value" paddingAngle={3}>
                    {analytics.devices.map((_, i) => <Cell key={i} fill={CHART_COLORS[i]} />)}
                  </Pie>
                  <Tooltip contentStyle={{ background:"var(--bg3)", border:"1px solid var(--border)", borderRadius:8, color:"var(--text)", fontSize:11 }} />
                </PieChart>
              </div>
              {analytics.devices.map((d,i) => (
                <div key={d.name} style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:6, fontSize:12 }}>
                  <div style={{ display:"flex", alignItems:"center", gap:6 }}>
                    <div style={{ width:8, height:8, borderRadius:"50%", background:CHART_COLORS[i] }} />
                    <span style={{ color:"var(--text2)" }}>{d.name}</span>
                  </div>
                  <span style={{ fontWeight:700 }}>{d.value}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ── MOVIES ── */}
      {tab === "movies" && (
        <div>
          <div style={{ display:"flex", justifyContent:"flex-end", marginBottom:14 }}>
            <button className="mn-btn mn-btn-primary mn-btn-sm" onClick={() => openForm(null)}>
              {I.plus} Add Movie
            </button>
          </div>

          {showForm && (
            <MovieForm
              movie={editMovie}
              onSave={m => {
                let updated;
                if (editMovie) { updated = movies.map(x => x.id === m.id ? m : x); }
                else           { updated = [{ ...m, id: Date.now().toString() }, ...movies]; }
                setMovies(updated); saveMovies(updated);
                setShowForm(false); setEditMovie(null);
                showToast(editMovie ? "Movie updated!" : "Movie added!");
              }}
              onCancel={() => { setShowForm(false); setEditMovie(null); }}
            />
          )}

          <div className="mn-table-wrap">
            <table className="mn-table">
              <thead>
                <tr>
                  <th>Title</th><th>Year</th><th>Genres</th>
                  <th>Watches</th><th>Downloads</th><th>Featured</th><th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {movies.map(m => (
                  <tr key={m.id}>
                    <td style={{ fontWeight:600 }}>{m.title}</td>
                    <td>{m.year}</td>
                    <td style={{ color:"var(--text2)", fontSize:12 }}>{m.genres?.join(", ")}</td>
                    <td>{(m.watchClicks||0).toLocaleString()}</td>
                    <td>{(m.dlClicks||0).toLocaleString()}</td>
                    <td>{m.featured ? <span style={{ color:"var(--amber)", fontSize:16 }}>★</span> : "—"}</td>
                    <td>
                      <div style={{ display:"flex", gap:8 }}>
                        <button className="mn-btn mn-btn-outline mn-btn-sm" onClick={() => openForm(m)}>
                          {I.edit} Edit
                        </button>
                        <button className="mn-btn mn-btn-danger mn-btn-sm" onClick={() => deleteMovie(m.id)}>
                          {I.trash}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

/* ─────────────────────────── MOVIE FORM ─────────────────────────── */
function MovieForm({ movie, onSave, onCancel }) {
  const [f, setF] = useState({
    id:          movie?.id          || "",
    title:       movie?.title       || "",
    year:        movie?.year        || new Date().getFullYear(),
    genres:      movie?.genres?.join(", ") || "",
    desc:        movie?.desc        || "",
    poster:      movie?.poster      || "",
    backdrop:    movie?.backdrop    || "",
    watchUrl:    movie?.watchUrl    || "",
    downloadUrl: movie?.downloadUrl || "",
    featured:    movie?.featured    || false,
    watchClicks: movie?.watchClicks || 0,
    dlClicks:    movie?.dlClicks    || 0,
  });
  const set = (k, v) => setF(p => ({ ...p, [k]: v }));

  const save = () => {
    if (!f.title.trim()) { alert("Title is required"); return; }
    onSave({ ...f, year: Number(f.year), genres: f.genres.split(",").map(g => g.trim()).filter(Boolean) });
  };

  return (
    <div style={{ background:"var(--bg2)", borderRadius:14, padding:24, border:"1px solid var(--border)", marginBottom:20 }}>
      <h3 style={{ fontFamily:"'Bebas Neue',sans-serif", fontSize:22, letterSpacing:".06em", marginBottom:18 }}>
        {movie ? "Edit Movie" : "Add New Movie"}
      </h3>
      <div style={{ display:"grid", gap:0 }}>
        <div className="mn-form-group">
          <label className="mn-label">Title</label>
          <input className="mn-input" value={f.title} onChange={e => set("title", e.target.value)} />
        </div>
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:14 }}>
          <div className="mn-form-group">
            <label className="mn-label">Year</label>
            <input className="mn-input" type="number" value={f.year} onChange={e => set("year", e.target.value)} />
          </div>
          <div className="mn-form-group">
            <label className="mn-label">Genres (comma separated)</label>
            <input className="mn-input" placeholder="Action, Drama, Sci-Fi" value={f.genres} onChange={e => set("genres", e.target.value)} />
          </div>
        </div>
        <div className="mn-form-group">
          <label className="mn-label">Description</label>
          <textarea className="mn-input" value={f.desc} onChange={e => set("desc", e.target.value)} />
        </div>
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:14 }}>
          {[["Poster URL","poster"],["Backdrop URL","backdrop"],["Watch URL","watchUrl"],["Download URL","downloadUrl"]].map(([l,k]) => (
            <div key={k} className="mn-form-group">
              <label className="mn-label">{l}</label>
              <input className="mn-input" type="text" value={f[k]} onChange={e => set(k, e.target.value)} />
            </div>
          ))}
        </div>
        <div className="mn-form-group" style={{ display:"flex", alignItems:"center", gap:12 }}>
          <label className="mn-toggle">
            <input type="checkbox" checked={f.featured} onChange={e => set("featured", e.target.checked)} />
            <span className="mn-slider" />
          </label>
          <span style={{ fontSize:14, fontWeight:500 }}>Show in hero carousel (Featured)</span>
        </div>
      </div>
      <div style={{ display:"flex", gap:10 }}>
        <button className="mn-btn mn-btn-primary mn-btn-sm" onClick={save}>Save Movie</button>
        <button className="mn-btn mn-btn-outline mn-btn-sm" onClick={onCancel}>Cancel</button>
      </div>
    </div>
  );
}

/* ─────────────────────────── NAV ─────────────────────────── */
function Nav({ page, setPage }) {
  const items = [
    { key:"home",     label:"Movies",   icon:I.home },
    { key:"search",   label:"Search",   icon:I.search },
    { key:"explorer", label:"Explorer", icon:I.compass },
    { key:"settings", label:"Settings", icon:I.settings },
  ];
  return (
    <>
      <nav className="mn-topnav">
        <div className="mn-logo" onClick={() => setPage("home")}>Movie<span>Nation</span></div>
        <div className="mn-nav-links">
          {items.map(n => (
            <button key={n.key} className={`mn-nav-btn ${page===n.key?"active":""}`} onClick={() => setPage(n.key)}>
              {n.icon}{n.label}
            </button>
          ))}
        </div>
      </nav>
      <nav className="mn-bottomnav">
        {items.map(n => (
          <button key={n.key} className={`mn-bnav-btn ${page===n.key?"active":""}`} onClick={() => setPage(n.key)}>
            {n.icon}<span>{n.label}</span>
          </button>
        ))}
      </nav>
    </>
  );
}

/* ─────────────────────────── ROOT APP ─────────────────────────── */
export default function App() {
  const [darkMode, setDarkModeState] = useState(getDark);
  const [movies,   setMovies]        = useState(getMovies);
  const [page,     setPage]          = useState(() =>
    typeof window !== "undefined" && window.location.search.includes("admin") ? "admin" : "home"
  );
  const [selected, setSelected] = useState(null);
  const [toast,    setToast]    = useState(null);
  const [adminOK,  setAdminOK]  = useState(false);
  const toastRef = useRef(null);

  const setDarkMode = v => { setDarkModeState(v); saveDark(v); };

  const showToast = useCallback(msg => {
    setToast(msg);
    clearTimeout(toastRef.current);
    toastRef.current = setTimeout(() => setToast(null), 2800);
  }, []);

  const handleWatch = useCallback(movie => {
    const updated = movies.map(m => m.id === movie.id ? { ...m, watchClicks:(m.watchClicks||0)+1 } : m);
    setMovies(updated); saveMovies(updated);
    window.open(movie.watchUrl || "#", "_blank", "noopener,noreferrer");
    showToast("Opening stream…");
  }, [movies, showToast]);

  const handleDownload = useCallback(movie => {
    const updated = movies.map(m => m.id === movie.id ? { ...m, dlClicks:(m.dlClicks||0)+1 } : m);
    setMovies(updated); saveMovies(updated);
    window.open(movie.downloadUrl || "#", "_blank", "noopener,noreferrer");
    showToast("Download starting…");
  }, [movies, showToast]);

  const go = p => { setPage(p); setSelected(null); };

  return (
    <div className={darkMode ? "mn-dark" : "mn-light"}
      style={{ fontFamily:"'Outfit',sans-serif", background:"var(--bg)", color:"var(--text)", minHeight:"100vh" }}>

      {page !== "admin" && <Nav page={page} setPage={go} />}

      <div className="mn-page">
        {page === "home"     && <HomePage movies={movies} onMovieClick={setSelected} onWatch={handleWatch} onDownload={handleDownload} />}
        {page === "explorer" && <ExplorerPage movies={movies} onMovieClick={setSelected} />}
        {page === "search"   && <SearchPage movies={movies} onMovieClick={setSelected} />}
        {page === "settings" && <SettingsPage darkMode={darkMode} setDarkMode={setDarkMode} />}
        {page === "admin"    && (
          adminOK
            ? <AdminPanel movies={movies}
                setMovies={m => { setMovies(m); saveMovies(m); }}
                onLogout={() => { setAdminOK(false); go("settings"); }}
                showToast={showToast} />
            : <AdminLogin onLogin={() => setAdminOK(true)} />
        )}
      </div>

      {/* Movie Detail Modal */}
      {selected && (
        <MovieModal movie={selected} onClose={() => setSelected(null)}
          onWatch={handleWatch} onDownload={handleDownload} />
      )}

      {/* Toast */}
      {toast && <Toast msg={toast} />}

      {/* Back to Top */}
      {page !== "admin" && <BackToTop />}

      {/* Footer */}
      {page !== "admin" && (
        <footer className="mn-footer">
          <button className="mn-btn mn-btn-primary" style={{ marginBottom:14 }}
            onClick={() => showToast("Use your browser's 'Add to Home Screen' to install!")}>
            ⬇ Install Web App
          </button>
          <div style={{ color:"var(--text2)", fontSize:12 }}>
            © {new Date().getFullYear()} MovieNation · All rights reserved
          </div>
        </footer>
      )}
    </div>
  );
}
