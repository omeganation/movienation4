import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import {
  saveMovieToFirebase,
  deleteMovieFromFirebase,
  bulkSaveToFirebase,
  subscribeToMovies,
  isFirebaseConfigured,
} from "./firebase.js";

/* ═══════════════════════════════════════════════════
   STYLES
═══════════════════════════════════════════════════ */
if (!document.getElementById("mn5s")) {
  const lk = document.createElement("link"); lk.rel = "stylesheet";
  lk.href = "https://api.fontshare.com/v2/css?f[]=clash-display@400,500,600,700&f[]=satoshi@300,400,500,700&display=swap";
  document.head.appendChild(lk);
  const lk2 = document.createElement("link"); lk2.rel = "stylesheet";
  lk2.href = "https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500&display=swap";
  document.head.appendChild(lk2);
  document.head.appendChild(lk);
  const st = document.createElement("style"); st.id = "mn5s";
  st.textContent = `
/* ████████████████████████████████████████████████████
   MOVIENATION  —  FINAL EDITION  v6
   Design: "Noir Cinema"
   Fonts : Clash Display (headings) · Satoshi (body) · JetBrains Mono (labels)
   Accent: Electric Amber #F59E0B · Deep Noir #07080F
   Special: film-grain hero overlay, 3-D card tilt, blur-up images,
            skeleton loaders, ambient glow, scroll-snap rows,
            staggered reveal, parallax backdrop
████████████████████████████████████████████████████ */

/* ── RESET ── */
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
html{scroll-behavior:smooth;-webkit-text-size-adjust:100%}
body{margin:0;overflow-x:hidden;-webkit-font-smoothing:antialiased;text-rendering:optimizeLegibility}
img{display:block;max-width:100%}
button{cursor:pointer;border:none;background:none;font-family:inherit}
a{text-decoration:none;color:inherit}
::-webkit-scrollbar{width:3px;height:3px}
::-webkit-scrollbar-track{background:#000}
::-webkit-scrollbar-thumb{background:var(--a);border-radius:3px}
*{scrollbar-color:var(--a) #000;scrollbar-width:thin}
/* Light mode scrollbar track */
.lt::-webkit-scrollbar-track{background:#E8E7F5}
.lt *{scrollbar-color:var(--a) #E8E7F5}

/* ── DESIGN TOKENS ── */
.dk{
  --bg:#07080F;--s1:#0E0F18;--s2:#161722;--s3:#1E1F2E;--s4:#272840;
  --gl:rgba(7,8,15,.88);
  --tx:#F0EDF9;--t2:#7E7C98;--t3:#33324A;
  --a:#F59E0B;--ah:#FBBF24;--ag:rgba(245,158,11,.15);--ab:rgba(245,158,11,.35);
  --pu:#818CF8;--ph:#A5B4FC;--pg:rgba(129,140,248,.14);
  --rd:#F87171;--gn:#34D399;--bl:#38BDF8;
  --br:rgba(255,255,255,.07);--br2:rgba(245,158,11,.28);
  --sh:0 24px 64px rgba(0,0,0,.8);
  --card:#0E0F18;--pill:rgba(7,8,15,.78);
  --grain:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='200' height='200' filter='url(%23n)' opacity='0.04'/%3E%3C/svg%3E");
}
.lt{
  --bg:#F1F0F8;--s1:#FFFFFF;--s2:#E8E7F5;--s3:#DDDCF0;--s4:#D0CFE8;
  --gl:rgba(241,240,248,.92);
  --tx:#0D0C1C;--t2:#5A5878;--t3:#A8A6C0;
  --a:#D97706;--ah:#F59E0B;--ag:rgba(217,119,6,.1);--ab:rgba(217,119,6,.28);
  --pu:#6366F1;--ph:#818CF8;--pg:rgba(99,102,241,.1);
  --rd:#EF4444;--gn:#10B981;--bl:#0EA5E9;
  --br:rgba(0,0,0,.07);--br2:rgba(217,119,6,.28);
  --sh:0 8px 32px rgba(0,0,0,.1);
  --card:#FFFFFF;--pill:rgba(255,255,255,.88);
  --grain:none;
}

/* ── BASE ── */
#root{
  font-family:'Satoshi',system-ui,-apple-system,sans-serif;
  background:var(--bg);color:var(--tx);
  min-height:100vh;transition:background .35s,color .35s;
}

/* ████ KEYFRAMES ████ */
@keyframes fu  {from{opacity:0;transform:translateY(18px)}to{opacity:1;transform:none}}
@keyframes fi  {from{opacity:0}to{opacity:1}}
@keyframes si  {from{opacity:0;transform:scale(.96)}to{opacity:1;transform:none}}
@keyframes sr  {from{opacity:0;transform:translateX(22px)}to{opacity:1;transform:none}}
@keyframes hi  {from{opacity:0;transform:scale(1.05)}to{opacity:1;transform:none}}
@keyframes spin{to{transform:rotate(360deg)}}
@keyframes toastin{from{opacity:0;transform:translateX(-50%) translateY(14px)}to{opacity:1;transform:translateX(-50%) translateY(0)}}
@keyframes shimmer{0%{background-position:-800px 0}100%{background-position:800px 0}}
@keyframes pulse2{0%,100%{opacity:1}50%{opacity:.4}}
@keyframes ripple{0%{transform:scale(0);opacity:.5}100%{transform:scale(4);opacity:0}}
@keyframes glow{0%,100%{box-shadow:0 0 20px var(--ag)}50%{box-shadow:0 0 40px var(--ag),0 0 80px rgba(245,158,11,.1)}}
@keyframes slideUp{from{opacity:0;transform:translateY(100%)}to{opacity:1;transform:none}}
@keyframes watchBg{from{opacity:0;transform:scale(1.04)}to{opacity:1;transform:none}}
@keyframes badgePop{0%{transform:scale(0) rotate(-10deg)}70%{transform:scale(1.1) rotate(2deg)}100%{transform:scale(1) rotate(0)}}
@keyframes heartBeat{0%,100%{transform:scale(1)}15%{transform:scale(1.25)}30%{transform:scale(0.95)}45%{transform:scale(1.1)}}
@keyframes blurUp{from{filter:blur(12px);opacity:.6}to{filter:blur(0);opacity:1}}

.pg{padding-top:68px;padding-bottom:72px;min-height:100vh}
@media(min-width:768px){.pg{padding-bottom:0}}

/* ████ GLASS NAVIGATION ████ */
.nav{
  position:fixed;top:0;left:0;right:0;height:68px;z-index:500;
  display:flex;align-items:center;justify-content:space-between;
  padding:0 18px;
  background:var(--gl);
  backdrop-filter:blur(32px) saturate(180%);
  -webkit-backdrop-filter:blur(32px) saturate(180%);
  border-bottom:1px solid var(--br);
  transition:all .3s;
}
@media(min-width:768px){.nav{padding:0 40px}}
.nav-logo{display:flex;align-items:center;gap:11px;cursor:pointer;user-select:none}
.nav-logo img{
  width:36px;height:36px;border-radius:10px;object-fit:cover;flex-shrink:0;
  box-shadow:0 0 0 2px var(--ab);
  transition:box-shadow .2s;
}
.nav-logo:hover img{box-shadow:0 0 0 3px var(--a),0 0 16px var(--ag)}
.nav-logo-txt{
  font-family:'Clash Display',system-ui,sans-serif;
  font-size:19px;font-weight:700;letter-spacing:-.02em;display:none;
}
@media(min-width:420px){.nav-logo-txt{display:block}}
.nav-logo-txt b{color:var(--a)}
.nav-links{display:none;gap:1px;margin-right:4px}
@media(min-width:768px){.nav-links{display:flex}}
.nav-item{
  padding:7px 14px;border-radius:9px;
  font-size:13.5px;font-weight:600;color:var(--t2);
  display:flex;align-items:center;gap:7px;
  transition:all .2s;cursor:pointer;letter-spacing:.01em;
  position:relative;
}
.nav-item::after{
  content:'';position:absolute;bottom:5px;left:50%;
  transform:translateX(-50%) scaleX(0);
  width:16px;height:2px;background:var(--a);border-radius:2px;
  transition:transform .2s ease;
}
.nav-item:hover{color:var(--tx)}
.nav-item:hover::after{transform:translateX(-50%) scaleX(1)}
.nav-item.on{color:var(--a)}.nav-item.on::after{transform:translateX(-50%) scaleX(1)}
.nav-r{display:flex;align-items:center;gap:8px}
.theme-btn{
  width:36px;height:36px;border-radius:50%;
  display:flex;align-items:center;justify-content:center;
  background:var(--s2);border:1px solid var(--br);color:var(--t2);
  transition:all .22s;cursor:pointer;
}
.theme-btn:hover{border-color:var(--a);color:var(--a);transform:rotate(15deg)}

/* Notification dot for new movies */
.nav-dot{
  width:7px;height:7px;border-radius:50%;background:var(--a);
  position:absolute;top:6px;right:8px;
  animation:glow 2s ease infinite;
}

/* ── BOTTOM NAV ── */
.bnav{
  position:fixed;bottom:0;left:0;right:0;height:64px;z-index:500;
  display:grid;grid-template-columns:repeat(4,1fr);
  background:var(--gl);
  backdrop-filter:blur(32px);-webkit-backdrop-filter:blur(32px);
  border-top:1px solid var(--br);
}
@media(min-width:768px){.bnav{display:none}}
.bnav-item{
  display:flex;flex-direction:column;align-items:center;justify-content:center;
  gap:3px;font-size:9.5px;font-weight:700;letter-spacing:.07em;
  text-transform:uppercase;color:var(--t3);transition:color .2s;cursor:pointer;
  position:relative;
}
.bnav-item.on{color:var(--a)}
.bnav-item::before{
  content:'';position:absolute;top:0;left:25%;right:25%;
  height:2px;background:var(--a);border-radius:0 0 3px 3px;
  transform:scaleX(0);transition:transform .2s ease;
}
.bnav-item.on::before{transform:scaleX(1)}

/* ████ HERO CAROUSEL ████ */
.hero{
  position:relative;width:100%;
  height:100svh;max-height:820px;min-height:560px;
  overflow:hidden;
}
.hero-slide{position:absolute;inset:0;opacity:0;transition:opacity 1s ease;pointer-events:none}
.hero-slide.on{opacity:1;pointer-events:all;animation:hi 1s ease}
.hero-slide img{width:100%;height:100%;object-fit:cover;animation:blurUp .8s ease}

/* Film grain overlay */
.hero-grain{
  position:absolute;inset:0;z-index:1;
  background-image:var(--grain);
  background-size:200px 200px;
  opacity:.4;pointer-events:none;
  mix-blend-mode:overlay;
}

.hero-ov{
  position:absolute;inset:0;z-index:2;
  background:
    linear-gradient(90deg,rgba(7,8,15,.97) 0%,rgba(7,8,15,.75) 44%,rgba(7,8,15,.08) 100%),
    linear-gradient(0deg,rgba(7,8,15,1) 0%,rgba(7,8,15,.5) 28%,transparent 60%);
}

.hero-c{
  position:absolute;bottom:0;left:0;z-index:3;
  padding:0 20px 56px;max-width:680px;
}
@media(min-width:768px){.hero-c{padding:0 64px 96px;max-width:780px}}

.hero-badge{
  display:inline-flex;align-items:center;gap:8px;
  background:rgba(245,158,11,.14);color:var(--a);
  font-size:10px;font-weight:700;letter-spacing:.18em;text-transform:uppercase;
  padding:5px 14px;border-radius:100px;margin-bottom:16px;
  border:1px solid var(--ab);font-family:'JetBrains Mono',monospace;
  backdrop-filter:blur(8px);
}
.hero-badge-dot{
  width:6px;height:6px;border-radius:50%;background:var(--a);
  animation:pulse2 1.4s ease infinite;flex-shrink:0;
}

.hero-title{
  font-family:'Clash Display',system-ui,sans-serif;
  font-weight:700;font-size:42px;line-height:.97;
  color:#F0EDF9;margin-bottom:14px;letter-spacing:-.04em;
}
@media(min-width:480px){.hero-title{font-size:56px}}
@media(min-width:768px){.hero-title{font-size:76px}}

.hero-meta{display:flex;align-items:center;gap:12px;flex-wrap:wrap;margin-bottom:14px}
.hero-m{
  font-size:13px;color:rgba(240,237,249,.52);
  display:flex;align-items:center;gap:5px;font-weight:500;
}
.hero-sep{width:3px;height:3px;border-radius:50%;background:var(--a);opacity:.7}

.hero-desc{
  font-size:15px;color:rgba(240,237,249,.58);
  line-height:1.76;margin-bottom:28px;font-weight:300;max-width:480px;
}
@media(max-width:480px){.hero-desc{font-size:14px;max-width:100%}}

.hero-acts{display:flex;gap:11px;flex-wrap:wrap;align-items:center}

/* Scroll progress bar */
.hero-prog{position:absolute;bottom:0;left:0;right:0;height:2px;background:rgba(255,255,255,.06);z-index:4}
.hero-bar{height:100%;background:linear-gradient(90deg,var(--a),var(--ah));transition:width 5.5s linear}

/* Slide dots */
.hero-dots{
  position:absolute;right:16px;top:50%;transform:translateY(-50%);
  display:flex;flex-direction:column;gap:8px;z-index:4;
}
@media(min-width:768px){.hero-dots{right:36px}}
.hero-d{
  width:3px;height:22px;border-radius:3px;
  background:rgba(255,255,255,.18);cursor:pointer;transition:all .3s;
}
.hero-d.on{height:40px;background:var(--a);box-shadow:0 0 8px var(--a)}

/* Arrow buttons */
.hero-arr{
  position:absolute;top:50%;transform:translateY(-50%);z-index:4;
  width:46px;height:46px;border-radius:50%;
  background:rgba(7,8,15,.68);color:rgba(240,237,249,.75);
  display:flex;align-items:center;justify-content:center;
  border:1px solid rgba(255,255,255,.1);
  backdrop-filter:blur(10px);cursor:pointer;transition:all .22s;
}
.hero-arr:hover{
  background:var(--a);color:#07080F;border-color:var(--a);
  box-shadow:0 0 20px var(--ag);
  transform:translateY(-50%) scale(1.08);
}

/* ████ BUTTONS ████ */
.btn{
  display:inline-flex;align-items:center;gap:8px;
  padding:11px 24px;border-radius:10px;
  font-size:13.5px;font-weight:700;
  transition:all .22s;cursor:pointer;
  white-space:nowrap;letter-spacing:.01em;
  position:relative;overflow:hidden;
}
/* Ripple effect on click */
.btn::after{
  content:'';position:absolute;inset:0;border-radius:inherit;
  background:rgba(255,255,255,.2);
  transform:scale(0);opacity:0;
  transition:transform .4s ease,opacity .4s ease;
}
.btn:active::after{transform:scale(2);opacity:0;transition:0s}

.bp{background:var(--a);color:#07080F;font-weight:800}
.bp:hover{background:var(--ah);transform:translateY(-2px);box-shadow:0 10px 30px var(--ag)}

.bg{
  background:rgba(240,237,249,.1);color:#F0EDF9;
  border:1px solid rgba(240,237,249,.15);
  backdrop-filter:blur(6px);
}
.bg:hover{background:rgba(240,237,249,.18)}

.bo{background:transparent;color:var(--tx);border:1px solid var(--br)}
.bo:hover{border-color:var(--a);color:var(--a)}

.bpu{background:var(--pu);color:#fff}
.bpu:hover{background:var(--ph);transform:translateY(-1px)}

.brd{background:rgba(248,113,113,.1);color:var(--rd);border:1px solid rgba(248,113,113,.22)}
.brd:hover{background:rgba(248,113,113,.2)}

.bgn{background:rgba(52,211,153,.1);color:var(--gn);border:1px solid rgba(52,211,153,.22)}
.bgn:hover{background:rgba(52,211,153,.2)}

.sm{padding:7px 15px;font-size:12.5px;border-radius:8px}
.xs{padding:5px 11px;font-size:11.5px;border-radius:7px}
.btn:disabled{opacity:.5;cursor:not-allowed;transform:none!important}

/* ████ SECTIONS ████ */
.sec{padding:32px 16px}
@media(min-width:600px){.sec{padding:36px 28px}}
@media(min-width:768px){.sec{padding:44px 48px}}
@media(min-width:1200px){.sec{padding:52px 88px}}

.sh{display:flex;align-items:flex-end;justify-content:space-between;margin-bottom:24px}

.eye{
  font-size:11px;font-weight:700;letter-spacing:.18em;
  text-transform:uppercase;color:var(--a);margin-bottom:6px;
  font-family:'JetBrains Mono',monospace;
  display:flex;align-items:center;gap:7px;
}
.eye::before{
  content:'';display:block;width:16px;height:2px;
  background:linear-gradient(90deg,var(--a),var(--ah));
  border-radius:2px;flex-shrink:0;
}

.ttl{
  font-family:'Clash Display',system-ui,sans-serif;
  font-size:22px;font-weight:700;letter-spacing:-.03em;
}
@media(min-width:768px){.ttl{font-size:26px}}

/* View all link */
.view-all{
  font-size:13px;font-weight:700;color:var(--a);
  display:flex;align-items:center;gap:5px;cursor:pointer;
  transition:gap .2s;white-space:nowrap;
}
.view-all:hover{gap:8px}

/* ████ MOVIE GRID ████ */
.mn-grid{display:grid;gap:12px;grid-template-columns:repeat(2,1fr)}
@media(min-width:400px){.mn-grid{gap:14px}}
@media(min-width:480px){.mn-grid{grid-template-columns:repeat(3,1fr)}}
@media(min-width:768px){.mn-grid{grid-template-columns:repeat(4,1fr);gap:16px}}
@media(min-width:1024px){.mn-grid{grid-template-columns:repeat(5,1fr)}}
@media(min-width:1400px){.mn-grid{grid-template-columns:repeat(6,1fr)}}

/* Horizontal snap scroll row */
.mn-hrow{
  display:flex;gap:12px;
  overflow-x:auto;padding-bottom:10px;
  scrollbar-width:none;
  scroll-snap-type:x mandatory;
  -webkit-overflow-scrolling:touch;
}
.mn-hrow::-webkit-scrollbar{display:none}
.mn-hrow .card{scroll-snap-align:start}

/* ████ MOVIE CARD ████ */
.card{
  position:relative;border-radius:13px;overflow:hidden;cursor:pointer;
  background:var(--card);
  animation:fu .45s ease both;
  flex-shrink:0;width:148px;
  /* 3D tilt variables */
  transform-style:preserve-3d;
  transition:transform .35s cubic-bezier(.34,1.26,.64,1),box-shadow .35s ease;
  will-change:transform;
}
@media(min-width:768px){.card{width:176px}}
.card-full{width:100%}
.card:hover{box-shadow:0 24px 60px rgba(0,0,0,.6),0 0 0 1px var(--ab)}

/* poster wrapper */
.card-img{position:relative;width:100%;aspect-ratio:2/3;overflow:hidden;background:var(--s3)}
.card-img img{
  width:100%;height:100%;object-fit:cover;
  transition:transform .55s ease;
  animation:blurUp .4s ease;
}
.card:hover .card-img img{transform:scale(1.08)}

/* gradient overlay */
.card-ov{
  position:absolute;inset:0;
  background:linear-gradient(to top,rgba(7,8,15,.97) 0%,rgba(7,8,15,.5) 38%,transparent 65%);
  opacity:0;transition:opacity .3s;
}
.card:hover .card-ov{opacity:1}

/* bottom info on hover */
.card-inf{
  position:absolute;bottom:0;left:0;right:0;
  padding:13px 11px 10px;
  transform:translateY(10px);opacity:0;transition:all .3s ease;
}
.card:hover .card-inf{transform:none;opacity:1}
.card-name{
  font-family:'Clash Display',system-ui,sans-serif;
  font-size:13px;font-weight:700;color:#F0EDF9;
  white-space:nowrap;overflow:hidden;text-overflow:ellipsis;margin-bottom:2px;
}
.card-sub{font-size:11px;color:rgba(240,237,249,.45);font-family:'JetBrains Mono',monospace}

/* play button */
.card-play{
  position:absolute;top:50%;left:50%;
  transform:translate(-50%,-50%) scale(.7);
  width:52px;height:52px;border-radius:50%;
  background:var(--a);color:#07080F;
  display:flex;align-items:center;justify-content:center;
  opacity:0;transition:all .28s ease;
  box-shadow:0 0 0 0 var(--ag);
}
.card:hover .card-play{
  opacity:1;transform:translate(-50%,-50%) scale(1);
  box-shadow:0 0 0 14px var(--ag);
}

/* ambient glow under card on hover */
.card::before{
  content:'';
  position:absolute;inset:-1px;
  border-radius:14px;z-index:-1;
  background:linear-gradient(135deg,var(--a),var(--pu),var(--a));
  opacity:0;transition:opacity .35s;
}
.card:hover::before{opacity:.25}

/* genre badge */
.card-badge{
  position:absolute;top:9px;left:9px;
  background:var(--pill);backdrop-filter:blur(10px);
  color:var(--a);font-size:9.5px;font-weight:700;letter-spacing:.07em;
  padding:3px 9px;border-radius:100px;
  border:1px solid var(--ab);font-family:'JetBrains Mono',monospace;
  text-transform:uppercase;
}

/* NEW badge */
.card-new{
  position:absolute;top:9px;right:9px;
  background:linear-gradient(135deg,var(--a),var(--ah));
  color:#07080F;font-size:9px;font-weight:800;letter-spacing:.1em;
  padding:3px 8px;border-radius:100px;
  font-family:'JetBrains Mono',monospace;text-transform:uppercase;
  animation:badgePop .4s ease both;
}

/* draft badge */
.card-draft{
  position:absolute;top:9px;right:9px;
  background:var(--pg);color:var(--ph);
  font-size:9px;font-weight:700;padding:3px 8px;border-radius:100px;
  font-family:'JetBrains Mono',monospace;text-transform:uppercase;
}

/* favourite heart button */
.card-heart{
  position:absolute;top:9px;right:9px;
  width:28px;height:28px;border-radius:50%;
  background:var(--pill);backdrop-filter:blur(8px);
  border:1px solid var(--br);
  display:flex;align-items:center;justify-content:center;
  cursor:pointer;transition:all .22s;opacity:0;
}
.card:hover .card-heart{opacity:1}
.card-heart.liked{opacity:1;background:rgba(248,113,113,.2);border-color:var(--rd)}
.card-heart.liked svg{fill:var(--rd);stroke:var(--rd)}
.card-heart:hover{transform:scale(1.1)}
.card-heart.liked{animation:heartBeat .4s ease}

/* stagger */
.card:nth-child(1){animation-delay:0ms}
.card:nth-child(2){animation-delay:50ms}
.card:nth-child(3){animation-delay:100ms}
.card:nth-child(4){animation-delay:150ms}
.card:nth-child(5){animation-delay:200ms}
.card:nth-child(n+6){animation-delay:240ms}

/* ████ SKELETON LOADER ████ */
.sk{
  background:linear-gradient(
    90deg,
    var(--s2) 0%,
    var(--s3) 30%,
    var(--s2) 60%
  );
  background-size:800px 100%;
  animation:shimmer 1.6s ease infinite;
  border-radius:inherit;
}
.sk-card{width:100%;aspect-ratio:2/3;border-radius:13px}
.sk-text{height:12px;border-radius:6px;margin-bottom:8px}
.sk-text.w80{width:80%}.sk-text.w60{width:60%}.sk-text.w40{width:40%}

/* ████ GENRE CHIPS ████ */
.chips{
  display:flex;gap:8px;overflow-x:auto;
  padding-bottom:8px;scrollbar-width:none;
  margin-bottom:24px;
  scroll-snap-type:x mandatory;
  -webkit-overflow-scrolling:touch;
}
.chips::-webkit-scrollbar{display:none}
.chip{
  padding:8px 20px;border-radius:100px;flex-shrink:0;
  font-size:12.5px;font-weight:700;cursor:pointer;
  border:1px solid var(--br);background:var(--s2);color:var(--t2);
  transition:all .22s;letter-spacing:.01em;
  scroll-snap-align:start;white-space:nowrap;
}
.chip:hover{border-color:var(--a);color:var(--a)}
.chip.on{
  background:var(--a);color:#07080F;border-color:var(--a);
  box-shadow:0 4px 16px var(--ag);
}

/* ████ TRENDING LIST ████ */
.t-row{
  display:flex;align-items:stretch;
  margin-bottom:10px;background:var(--s1);
  border-radius:14px;overflow:hidden;
  border:1px solid var(--br);cursor:pointer;
  transition:all .22s;
}
.t-row:hover{
  border-color:var(--a);
  transform:translateX(5px);
  box-shadow:0 6px 24px rgba(0,0,0,.3);
}
.t-rank{
  flex-shrink:0;width:58px;
  display:flex;align-items:center;justify-content:center;
  font-family:'Clash Display',system-ui,sans-serif;
  font-size:26px;font-weight:700;
  color:var(--t3);background:var(--s2);letter-spacing:-.03em;
}
.t-rank.top{
  color:var(--a);
  text-shadow:0 0 20px rgba(245,158,11,.4);
}
.t-thumb{flex-shrink:0;width:60px}
.t-thumb img{width:100%;height:100%;object-fit:cover}
.t-info{
  flex:1;padding:13px 16px;
  display:flex;flex-direction:column;justify-content:center;min-width:0;
}
.t-title{
  font-size:14.5px;font-weight:700;margin-bottom:5px;
  font-family:'Clash Display',system-ui,sans-serif;
  letter-spacing:-.02em;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;
}
.t-meta{font-size:12px;color:var(--t2);display:flex;gap:10px;align-items:center;flex-wrap:wrap}

/* ████ WATCH PAGE — Mobile-first ████ */
.watch-page{min-height:100vh;background:var(--bg)}

/* ── hero backdrop ── */
.watch-bg{
  position:relative;width:100%;
  height:48vw;min-height:200px;max-height:460px;overflow:hidden;
}
@media(min-width:600px){.watch-bg{height:44vh;min-height:240px;max-height:500px}}
.watch-bg img{width:100%;height:100%;object-fit:cover;animation:watchBg .8s ease}
.watch-bg-ov{
  position:absolute;inset:0;
  background:
    linear-gradient(0deg,var(--bg) 0%,rgba(7,8,15,.5) 50%,rgba(7,8,15,.15) 100%),
    linear-gradient(90deg,rgba(7,8,15,.4) 0%,transparent 60%);
}
.watch-back{
  position:absolute;top:12px;left:12px;z-index:2;
  display:inline-flex;align-items:center;gap:6px;
  background:rgba(7,8,15,.75);color:rgba(240,237,249,.9);
  padding:8px 14px;border-radius:10px;font-size:13px;font-weight:700;
  border:1px solid rgba(255,255,255,.12);backdrop-filter:blur(14px);
  cursor:pointer;transition:all .2s;-webkit-tap-highlight-color:transparent;
}
.watch-back:hover,.watch-back:active{background:var(--a);color:#07080F;border-color:var(--a)}

/* ── body ── */
.watch-body{
  padding:0 12px 100px;
}
@media(min-width:480px){.watch-body{padding:0 20px 88px}}
@media(min-width:600px){.watch-body{padding:0 28px 72px}}
@media(min-width:900px){.watch-body{padding:0 48px 64px}}
@media(min-width:1200px){.watch-body{padding:0 88px 64px}}
.watch-inner{max-width:1100px;margin:0 auto}

/* ── Two-col desktop, stacked mobile ── */
.watch-grid{
  display:flex;
  flex-direction:column;
  gap:16px;
}
@media(min-width:900px){
  .watch-grid{
    display:grid;
    grid-template-columns:1fr 300px;
    gap:26px;
    align-items:start;
  }
}
@media(min-width:1100px){.watch-grid{grid-template-columns:1fr 330px}}

/* ── Video player ── */
.watch-player{
  width:100%;border-radius:10px;overflow:hidden;background:#000;
  aspect-ratio:16/9;border:1px solid var(--br);
  display:flex;align-items:center;justify-content:center;
  margin-bottom:14px;
  box-shadow:0 8px 32px rgba(0,0,0,.6);
}
@media(min-width:480px){.watch-player{border-radius:13px;margin-bottom:18px}}
.watch-player iframe{width:100%;height:100%;border:none}
.watch-player-placeholder{
  width:100%;height:100%;
  display:flex;flex-direction:column;align-items:center;justify-content:center;gap:14px;
  background:radial-gradient(ellipse at 50% 40%,var(--s3) 0%,var(--bg) 100%);
}
.watch-play-btn{
  width:64px;height:64px;border-radius:50%;
  background:var(--a);color:#07080F;
  display:flex;align-items:center;justify-content:center;
  cursor:pointer;transition:all .25s;
  box-shadow:0 0 0 0 var(--ag);
  -webkit-tap-highlight-color:transparent;
}
.watch-play-btn:hover,.watch-play-btn:active{transform:scale(1.1);box-shadow:0 0 0 18px var(--ag)}
.watch-play-hint{font-size:13px;color:var(--t2);font-weight:500;text-align:center;padding:0 20px}

/* ── Title ── */
.watch-title{
  font-family:'Clash Display',system-ui,sans-serif;
  font-size:22px;font-weight:700;letter-spacing:-.03em;
  margin-bottom:9px;line-height:1.1;
}
@media(min-width:360px){.watch-title{font-size:24px}}
@media(min-width:480px){.watch-title{font-size:28px}}
@media(min-width:768px){.watch-title{font-size:36px}}

/* ── Meta tags ── */
.watch-meta-row{
  display:flex;gap:6px;flex-wrap:wrap;margin-bottom:14px;align-items:center;
}
.watch-tag{
  padding:4px 10px;border-radius:100px;
  font-size:11px;font-weight:600;
  background:var(--s2);color:var(--t2);
  font-family:'JetBrains Mono',monospace;letter-spacing:.02em;
  display:flex;align-items:center;gap:4px;
  border:1px solid var(--br);white-space:nowrap;
}
@media(min-width:360px){.watch-tag{font-size:11.5px;padding:4px 11px}}
.watch-tag-a{background:var(--ag);color:var(--a);border-color:var(--ab)}

/* ── Action buttons — stacked on tiny phones, flex on bigger ── */
.watch-actions{
  display:flex;
  flex-direction:column;
  gap:9px;
  margin-bottom:18px;
}
@media(min-width:340px){
  .watch-actions{
    display:grid;
    grid-template-columns:1fr 1fr;
    gap:9px;
  }
}
@media(min-width:500px){
  .watch-actions{display:flex;flex-direction:row;flex-wrap:wrap;gap:10px;}
}
.watch-actions .btn{
  justify-content:center;
  padding:13px 16px;
  font-size:14px;
  width:100%;
}
@media(min-width:340px){.watch-actions .btn{width:auto}}
@media(min-width:500px){.watch-actions .btn{padding:11px 20px;font-size:13.5px}}

/* ── Description ── */
.watch-desc{font-size:13.5px;color:var(--t2);line-height:1.8;margin-bottom:18px}
@media(min-width:480px){.watch-desc{font-size:14.5px}}

/* ── Info grid ── */
.watch-ig{
  display:grid;
  grid-template-columns:1fr 1fr;
  gap:10px;
  padding:14px;border-radius:12px;
  background:var(--s1);border:1px solid var(--br);margin-bottom:18px;
}
@media(min-width:360px){.watch-ig{gap:10px;padding:14px}}
@media(min-width:480px){.watch-ig{grid-template-columns:repeat(3,1fr);gap:12px;padding:18px}}
.watch-ig-lbl{
  font-size:9.5px;font-weight:700;letter-spacing:.1em;
  text-transform:uppercase;color:var(--t3);margin-bottom:4px;
  font-family:'JetBrains Mono',monospace;
}
@media(min-width:480px){.watch-ig-lbl{font-size:10px}}
.watch-ig-val{font-size:12.5px;font-weight:700;color:var(--tx)}
@media(min-width:480px){.watch-ig-val{font-size:13.5px}}

/* ── Cast ── */
.watch-cast-wrap{margin-bottom:18px}
.watch-cast-lbl{
  font-size:9.5px;font-weight:700;letter-spacing:.1em;
  text-transform:uppercase;color:var(--t3);margin-bottom:8px;
  font-family:'JetBrains Mono',monospace;
}
.watch-cast{display:flex;gap:6px;flex-wrap:wrap}
.watch-cast-chip{
  padding:5px 12px;border-radius:100px;font-size:12px;font-weight:600;
  background:var(--s2);color:var(--t2);border:1px solid var(--br);transition:all .2s;
}
.watch-cast-chip:hover{border-color:var(--a);color:var(--a)}

/* ── Share section ── */
.watch-share{
  background:var(--s1);border-radius:13px;
  padding:16px;border:1px solid var(--br);margin-bottom:16px;
}
@media(min-width:480px){.watch-share{padding:20px}}
.watch-share-ttl{
  font-family:'Clash Display',system-ui,sans-serif;
  font-size:15px;font-weight:700;
  margin-bottom:13px;display:flex;align-items:center;gap:8px;
}
/* Always 4 columns for share */
.watch-share-grid{
  display:grid;
  grid-template-columns:repeat(4,1fr);
  gap:7px;margin-bottom:12px;
}
.share-btn{
  display:flex;flex-direction:column;align-items:center;gap:5px;
  padding:11px 4px;border-radius:11px;border:1px solid var(--br);
  cursor:pointer;transition:all .22s;
  font-size:10px;font-weight:700;color:var(--t2);background:var(--s2);
  -webkit-tap-highlight-color:transparent;
}
@media(min-width:360px){.share-btn{padding:12px 6px;gap:7px;font-size:10.5px}}
@media(min-width:400px){.share-btn{padding:14px 8px;gap:8px;font-size:11.5px}}
.share-btn:hover,.share-btn:active{transform:translateY(-3px);box-shadow:0 8px 24px rgba(0,0,0,.35)}
.share-btn svg{flex-shrink:0}
.share-btn-fb:hover,.share-btn-fb:active{background:#1877F2;color:#fff;border-color:#1877F2}
.share-btn-tw:hover,.share-btn-tw:active{background:#18181B;color:#fff;border-color:#18181B}
.share-btn-wa:hover,.share-btn-wa:active{background:#25D366;color:#fff;border-color:#25D366}
.share-btn-ig:hover,.share-btn-ig:active{background:linear-gradient(135deg,#f09433,#dc2743,#bc1888);color:#fff;border-color:#dc2743}
.watch-link-box{
  background:var(--s2);border-radius:9px;padding:9px 12px;
  display:flex;align-items:center;gap:9px;border:1px solid var(--br);
}
.watch-link-url{
  flex:1;font-size:10.5px;color:var(--t2);
  font-family:'JetBrains Mono',monospace;
  overflow:hidden;text-overflow:ellipsis;white-space:nowrap;min-width:0;
}

/* ── Sidebar (hidden on mobile, shown desktop) ── */
.watch-card-side{
  background:var(--s1);border-radius:13px;overflow:hidden;
  border:1px solid var(--br);margin-bottom:14px;
  display:none;
}
@media(min-width:900px){.watch-card-side{display:block}}
.watch-poster-side{width:100%;aspect-ratio:2/3;overflow:hidden}
.watch-sidebar-info{padding:14px}
.watch-sidebar-title{
  font-family:'Clash Display',system-ui,sans-serif;
  font-size:16px;font-weight:700;letter-spacing:-.02em;margin-bottom:5px;
}
.watch-sidebar-meta{font-size:12px;color:var(--t2);margin-bottom:13px}
.watch-rec{background:var(--s1);border-radius:13px;padding:16px;border:1px solid var(--br)}
.watch-rec-ttl{
  font-family:'Clash Display',system-ui,sans-serif;
  font-size:14px;font-weight:700;margin-bottom:11px;
}
.watch-rec-row{
  display:flex;gap:10px;align-items:center;cursor:pointer;
  padding:8px;border-radius:9px;transition:all .2s;border:1px solid transparent;
}
.watch-rec-row:hover{background:var(--s2);border-color:var(--br)}
.watch-rec-img{width:46px;height:66px;border-radius:7px;overflow:hidden;flex-shrink:0}
.watch-rec-name{font-size:12.5px;font-weight:700;margin-bottom:3px;overflow:hidden;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;font-family:'Clash Display',system-ui,sans-serif}
.watch-rec-meta{font-size:11px;color:var(--t2);font-family:'JetBrains Mono',monospace}
/* Mobile recommended: horizontal scroll cards */
.watch-rec-scroll{display:flex;gap:9px;overflow-x:auto;padding-bottom:6px;scrollbar-width:none}
.watch-rec-scroll::-webkit-scrollbar{display:none}
.watch-rec-card-mob{
  flex-shrink:0;width:84px;cursor:pointer;border-radius:8px;
  overflow:hidden;border:1px solid var(--br);background:var(--s2);transition:all .22s;
}
.watch-rec-card-mob:hover,.watch-rec-card-mob:active{transform:translateY(-3px);border-color:var(--a)}
.watch-rec-card-mob-name{
  padding:5px 7px;font-size:10.5px;font-weight:700;
  overflow:hidden;white-space:nowrap;text-overflow:ellipsis;
}

/* ████ QUICK INFO MODAL ████ */
.mbg{
  position:fixed;inset:0;z-index:600;
  background:rgba(4,4,10,.95);
  display:flex;align-items:center;justify-content:center;
  padding:12px;backdrop-filter:blur(20px);
  animation:fi .2s ease;
}
.modal{
  background:var(--s1);border-radius:18px;overflow:hidden;
  max-width:900px;width:100%;max-height:94vh;overflow-y:auto;
  border:1px solid var(--br);animation:si .3s ease;
  box-shadow:var(--sh);
}
.modal-hero{position:relative;width:100%;height:250px}
@media(min-width:600px){.modal-hero{height:320px}}
.modal-hero img{width:100%;height:100%;object-fit:cover}
.modal-hero-gr{
  position:absolute;inset:0;
  background:linear-gradient(0deg,var(--s1) 0%,rgba(14,15,24,.5) 48%,transparent 100%);
}
.modal-x{
  position:absolute;top:13px;right:13px;width:36px;height:36px;border-radius:50%;
  background:rgba(7,8,15,.8);color:rgba(240,237,249,.8);
  display:flex;align-items:center;justify-content:center;
  border:1px solid rgba(255,255,255,.1);backdrop-filter:blur(10px);
  cursor:pointer;z-index:2;transition:all .2s;
}
.modal-x:hover{background:rgba(248,113,113,.3);color:#fff;transform:scale(1.1)}
.modal-body{padding:4px 20px 28px}
@media(min-width:600px){.modal-body{padding:6px 32px 34px}}
.modal-grid{display:grid;gap:20px}
@media(min-width:560px){.modal-grid{grid-template-columns:155px 1fr}}
.modal-poster{
  width:100%;border-radius:12px;overflow:hidden;aspect-ratio:2/3;
  box-shadow:0 20px 50px rgba(0,0,0,.65);border:1px solid var(--br);flex-shrink:0;
}
.modal-title{
  font-family:'Clash Display',system-ui,sans-serif;
  font-size:26px;font-weight:700;letter-spacing:-.03em;line-height:1.05;margin-bottom:10px;
}
@media(min-width:560px){.modal-title{font-size:32px}}
.modal-tags{display:flex;gap:6px;flex-wrap:wrap;margin-bottom:14px}
.mtag{
  padding:4px 11px;border-radius:100px;font-size:11.5px;font-weight:600;
  background:var(--s2);color:var(--t2);font-family:'JetBrains Mono',monospace;
  letter-spacing:.03em;display:flex;align-items:center;gap:4px;border:1px solid var(--br);
}
.mtag-a{background:var(--ag);color:var(--a);border-color:var(--ab)}
.modal-desc{font-size:14px;color:var(--t2);line-height:1.8;margin-bottom:18px}
.modal-ig{
  display:grid;grid-template-columns:repeat(2,1fr);gap:10px;
  padding:16px;border-radius:12px;background:var(--s2);margin-bottom:18px;
}
@media(min-width:480px){.modal-ig{grid-template-columns:repeat(3,1fr)}}
.m-igl{font-size:10px;font-weight:700;letter-spacing:.12em;text-transform:uppercase;color:var(--t3);margin-bottom:3px;font-family:'JetBrains Mono',monospace}
.m-igv{font-size:13px;font-weight:700;color:var(--tx)}
.modal-cast{display:flex;gap:7px;flex-wrap:wrap;margin-bottom:18px}
.modal-cast-chip{
  padding:5px 12px;border-radius:100px;font-size:12px;font-weight:600;
  background:var(--s2);color:var(--t2);border:1px solid var(--br);transition:all .2s;
}
.modal-cast-chip:hover{border-color:var(--a);color:var(--a)}
.modal-actions{display:flex;gap:10px;flex-wrap:wrap;margin-top:4px}

/* ████ SEARCH ████ */
.srch-wrap{position:relative;margin-bottom:28px}
.srch-ico{position:absolute;left:18px;top:50%;transform:translateY(-50%);color:var(--t2);pointer-events:none}
.srch-in{
  width:100%;padding:15px 20px 15px 52px;
  border-radius:14px;border:1px solid var(--br);
  background:var(--s2);color:var(--tx);
  font-size:15px;outline:none;transition:all .22s;
}
.srch-in:focus{border-color:var(--a);box-shadow:0 0 0 3px var(--ag),0 4px 16px rgba(0,0,0,.3)}
.srch-in::placeholder{color:var(--t3)}

/* ████ TOGGLE ████ */
.tog{position:relative;width:46px;height:24px;cursor:pointer;display:inline-block;flex-shrink:0}
.tog input{opacity:0;width:0;height:0;position:absolute}
.trk{position:absolute;inset:0;background:var(--s3);border-radius:24px;transition:.3s;border:1px solid var(--br)}
.trk::before{content:'';position:absolute;height:16px;width:16px;left:3px;bottom:3px;background:var(--t2);border-radius:50%;transition:.3s}
input:checked+.trk{background:var(--a);border-color:var(--a)}
input:checked+.trk::before{transform:translateX(22px);background:#07080F}

/* ████ ADMIN ████ */
.astats{display:grid;gap:12px;grid-template-columns:repeat(2,1fr);margin-bottom:22px}
@media(min-width:768px){.astats{grid-template-columns:repeat(4,1fr)}}
.astat{
  background:var(--s1);border-radius:14px;padding:20px;
  border:1px solid var(--br);position:relative;overflow:hidden;
}
.astat::after{content:'';position:absolute;top:-28px;right:-28px;width:80px;height:80px;border-radius:50%;background:var(--ag);pointer-events:none}
.astat-i{color:var(--a);margin-bottom:10px;display:flex;align-items:center}
.astat-v{font-family:'Clash Display',system-ui,sans-serif;font-size:30px;font-weight:700;color:var(--a);line-height:1;margin-top:4px}
.astat-l{font-size:11px;font-weight:700;letter-spacing:.1em;text-transform:uppercase;color:var(--t3);margin-top:5px;font-family:'JetBrains Mono',monospace}
.atabs{display:flex;gap:3px;background:var(--s2);border-radius:12px;padding:4px;margin-bottom:22px;overflow-x:auto;scrollbar-width:none;flex-wrap:nowrap}
.atabs::-webkit-scrollbar{display:none}
.atab{flex-shrink:0;padding:9px 15px;border-radius:9px;font-size:12.5px;font-weight:700;color:var(--t2);transition:all .2s;cursor:pointer;white-space:nowrap;display:flex;align-items:center;gap:7px}
.atab.on{background:var(--s1);color:var(--tx);box-shadow:0 2px 10px rgba(0,0,0,.3)}
.inp{width:100%;padding:11px 15px;border-radius:9px;background:var(--s2);border:1px solid var(--br);color:var(--tx);font-size:13.5px;outline:none;transition:border-color .2s}
.inp:focus{border-color:var(--a)}
textarea.inp{resize:vertical;min-height:80px}
.lbl{display:block;font-size:10.5px;font-weight:700;letter-spacing:.1em;text-transform:uppercase;color:var(--t2);margin-bottom:5px;font-family:'JetBrains Mono',monospace}
.fg{margin-bottom:15px}
.tblw{overflow-x:auto;border-radius:13px;border:1px solid var(--br)}
.mn-tbl{width:100%;border-collapse:collapse}
.mn-tbl th{font-size:10px;font-weight:700;color:var(--t3);letter-spacing:.1em;text-transform:uppercase;padding:12px 14px;text-align:left;border-bottom:1px solid var(--br);font-family:'JetBrains Mono',monospace;white-space:nowrap;background:var(--s1)}
.mn-tbl td{padding:12px 14px;border-bottom:1px solid var(--br);font-size:13px;color:var(--tx)}
.mn-tbl tr:last-child td{border-bottom:none}.mn-tbl tr:hover td{background:var(--s2)}
.notif{background:var(--s2);border-radius:11px;padding:14px 16px;border-left:3px solid var(--a);margin-bottom:9px;display:flex;align-items:flex-start;gap:12px;animation:sr .3s ease}
.notif.gn{border-color:var(--gn)}.notif.rd{border-color:var(--rd)}
.n-ttl{font-size:13.5px;font-weight:700;margin-bottom:2px}
.n-sub{font-size:12px;color:var(--t2)}.n-time{font-size:10.5px;color:var(--t3);font-family:'JetBrains Mono',monospace;margin-left:auto;flex-shrink:0}
.log-row{background:var(--s2);border-radius:10px;padding:12px 15px;margin-bottom:8px;display:flex;align-items:center;gap:12px}
.log-dot{width:8px;height:8px;border-radius:50%;background:var(--a);flex-shrink:0}
.log-txt{font-size:13px;color:var(--tx);flex:1}
.log-time{font-size:11px;color:var(--t3);font-family:'JetBrains Mono',monospace;flex-shrink:0}
.seo-box{background:var(--s2);border-radius:13px;padding:18px;border:1px solid var(--br);margin-top:8px}
.seo-ttl{font-size:11px;font-weight:700;letter-spacing:.12em;text-transform:uppercase;color:var(--ph);margin-bottom:15px;font-family:'JetBrains Mono',monospace}
.notif-badge{background:var(--a);color:#07080F;font-size:9.5px;font-weight:800;width:18px;height:18px;border-radius:50%;display:inline-flex;align-items:center;justify-content:center;margin-left:3px}

/* ████ LOGIN ████ */
.login-wrap{min-height:100vh;display:flex;align-items:center;justify-content:center;padding:24px}
.login-card{
  width:100%;max-width:400px;background:var(--s1);border-radius:20px;
  padding:38px;border:1px solid var(--br);box-shadow:var(--sh);
}

/* ████ TOAST ████ */
.toast{
  position:fixed;bottom:74px;left:50%;transform:translateX(-50%);
  background:var(--s1);color:var(--tx);
  padding:12px 22px;border-radius:12px;
  font-size:13.5px;font-weight:700;z-index:9999;white-space:nowrap;
  box-shadow:var(--sh);animation:toastin .3s ease;pointer-events:none;
  border:1px solid var(--br);display:flex;align-items:center;gap:9px;
}
.toast-dot{width:8px;height:8px;border-radius:50%;background:var(--a);flex-shrink:0}
@media(min-width:768px){.toast{bottom:28px}}

/* ████ BACK TO TOP ████ */
.btt{
  position:fixed;bottom:80px;right:14px;z-index:300;
  width:42px;height:42px;border-radius:50%;
  background:linear-gradient(135deg,var(--a),var(--ah));color:#07080F;
  display:flex;align-items:center;justify-content:center;
  cursor:pointer;box-shadow:0 6px 22px var(--ag);transition:all .22s;
  animation:slideUp .3s ease;
}
.btt:hover{transform:translateY(-3px) scale(1.05);box-shadow:0 12px 32px var(--ag)}
@media(min-width:768px){.btt{bottom:28px;right:28px}}

/* ████ SHIMMER LOADER ████ */
.shim{
  background:linear-gradient(90deg,var(--s2) 0%,var(--s3) 30%,var(--s2) 60%);
  background-size:800px 100%;animation:shimmer 1.6s ease infinite;
}

/* ████ FOOTER ████ */
.footer{background:var(--s1);border-top:1px solid var(--br);padding:52px 20px 90px}
@media(min-width:768px){.footer{padding:60px 88px 60px}}
.footer-in{max-width:1200px;margin:0 auto}
.footer-top{display:grid;gap:40px;grid-template-columns:1fr;margin-bottom:44px}
@media(min-width:640px){.footer-top{grid-template-columns:2fr 1fr 1fr}}
@media(min-width:900px){.footer-top{grid-template-columns:2.5fr 1fr 1fr 1fr}}
.footer-logo{
  font-family:'Clash Display',system-ui,sans-serif;
  font-size:21px;font-weight:700;letter-spacing:-.02em;
  margin-bottom:12px;display:flex;align-items:center;gap:11px;
}
.footer-logo b{color:var(--a)}
.footer-logo img{width:32px;height:32px;border-radius:8px}
.footer-desc{font-size:13.5px;color:var(--t2);line-height:1.78;max-width:290px;margin-bottom:20px}
.footer-socs{display:flex;gap:9px;flex-wrap:wrap}
.fsoc{
  width:40px;height:40px;border-radius:10px;background:var(--s2);
  display:flex;align-items:center;justify-content:center;
  border:1px solid var(--br);transition:all .22s;cursor:pointer;text-decoration:none;
}
.fsoc:hover{transform:translateY(-3px);box-shadow:0 8px 20px rgba(0,0,0,.35)}
.footer-col-t{
  font-size:11px;font-weight:700;letter-spacing:.14em;text-transform:uppercase;
  color:var(--a);margin-bottom:18px;font-family:'JetBrains Mono',monospace;
}
.footer-lnks{display:flex;flex-direction:column;gap:11px}
.footer-lnk{font-size:13.5px;color:var(--t2);cursor:pointer;transition:color .2s;font-weight:500}
.footer-lnk:hover{color:var(--tx)}
.footer-bot{
  display:flex;align-items:center;justify-content:space-between;
  flex-wrap:wrap;gap:10px;padding-top:28px;border-top:1px solid var(--br);
}
.footer-copy{font-size:12px;color:var(--t3)}
.footer-legal{display:flex;gap:18px}
.footer-legal a{font-size:12px;color:var(--t3);cursor:pointer;transition:color .2s}
.footer-legal a:hover{color:var(--t2)}
.footer-install{
  display:inline-flex;align-items:center;gap:8px;margin-top:16px;
  padding:10px 20px;border-radius:10px;background:var(--s2);color:var(--tx);
  font-size:13px;font-weight:700;border:1px solid var(--br);cursor:pointer;transition:all .2s;
}
.footer-install:hover{border-color:var(--a);color:var(--a)}
.footer-install:active{transform:scale(.97)}

/* ████ LEGAL ████ */
.legal{max-width:760px;margin:0 auto}
.legal h1{font-family:'Clash Display',system-ui,sans-serif;font-size:36px;font-weight:700;letter-spacing:-.03em;margin-bottom:6px}
.legal-dt{font-size:12px;color:var(--t3);font-family:'JetBrains Mono',monospace;margin-bottom:30px}
.legal h2{font-family:'Clash Display',system-ui,sans-serif;font-size:19px;font-weight:700;margin:26px 0 9px}
.legal p{font-size:14px;color:var(--t2);line-height:1.82;margin-bottom:12px}
.legal ul{padding-left:18px;margin-bottom:12px}
.legal li{font-size:14px;color:var(--t2);line-height:1.82;margin-bottom:5px}

/* ████ UTILS ████ */
.mn-hr{height:1px;background:var(--br)}
.empty{text-align:center;padding:64px 20px;color:var(--t2)}
.empty-i{margin-bottom:14px;display:flex;justify-content:center;opacity:.2}
.empty-t{font-size:15px;font-weight:600}

/* ████ SETTINGS ████ */
.settings-card{
  background:var(--s1);border-radius:16px;border:1px solid var(--br);
  overflow:hidden;margin-bottom:16px;
}
.settings-row{
  display:flex;align-items:center;justify-content:space-between;
  padding:16px 20px;border-bottom:1px solid var(--br);
}
.settings-row:last-child{border-bottom:none}
.settings-ico{
  width:40px;height:40px;border-radius:10px;background:var(--s2);
  display:flex;align-items:center;justify-content:center;color:var(--a);flex-shrink:0;
}

/* ── Profile/Avatar card ── */
.profile-card{
  background:var(--s1);border-radius:16px;border:1px solid var(--br);
  padding:22px;margin-bottom:22px;
  display:flex;align-items:center;gap:18px;
}
.profile-avatar{
  width:72px;height:72px;border-radius:50%;
  background:var(--s2);border:3px solid var(--a);
  display:flex;align-items:center;justify-content:center;
  font-family:'Clash Display',system-ui,sans-serif;
  font-size:28px;font-weight:700;color:var(--a);
  overflow:hidden;flex-shrink:0;cursor:pointer;
  position:relative;transition:all .22s;
}
.profile-avatar:hover{border-color:var(--ah);transform:scale(1.04)}
.profile-avatar img{width:100%;height:100%;object-fit:cover}
.profile-avatar-edit{
  position:absolute;inset:0;
  background:rgba(7,8,15,.55);
  display:flex;align-items:center;justify-content:center;
  opacity:0;transition:opacity .2s;border-radius:50%;
}
.profile-avatar:hover .profile-avatar-edit{opacity:1}
.profile-name{font-family:'Clash Display',system-ui,sans-serif;font-size:20px;font-weight:700;letter-spacing:-.02em;margin-bottom:4px}
.profile-handle{font-size:13px;color:var(--t2);font-family:'JetBrains Mono',monospace}
.profile-bio{font-size:13px;color:var(--t2);margin-top:6px;line-height:1.6}

/* ── Color swatches ── */
.color-swatches{display:flex;gap:10px;flex-wrap:wrap}
.color-swatch{
  width:36px;height:36px;border-radius:50%;cursor:pointer;
  border:3px solid transparent;transition:all .22s;
  position:relative;flex-shrink:0;
}
.color-swatch:hover{transform:scale(1.12)}
.color-swatch.active{transform:scale(1.12)}

/* ── Font size slider ── */
.size-slider{
  -webkit-appearance:none;appearance:none;
  width:100%;height:4px;border-radius:2px;
  background:var(--s3);outline:none;cursor:pointer;
}
.size-slider::-webkit-slider-thumb{
  -webkit-appearance:none;width:20px;height:20px;border-radius:50%;
  background:var(--a);cursor:pointer;
  box-shadow:0 2px 8px var(--ag);transition:transform .15s;
}
.size-slider::-webkit-slider-thumb:hover{transform:scale(1.2)}
.size-slider::-moz-range-thumb{
  width:20px;height:20px;border-radius:50%;border:none;
  background:var(--a);cursor:pointer;box-shadow:0 2px 8px var(--ag);
}

/* ── Font selector ── */
.font-options{display:flex;gap:8px;flex-wrap:wrap}
.font-opt{
  padding:8px 16px;border-radius:9px;cursor:pointer;
  border:1.5px solid var(--br);background:var(--s2);
  font-size:13.5px;font-weight:600;color:var(--t2);
  transition:all .2s;
}
.font-opt.active,.font-opt:hover{border-color:var(--a);color:var(--a);background:var(--ag)}

/* ── Section label ── */
.settings-section-label{
  font-size:11px;font-weight:700;letter-spacing:.1em;text-transform:uppercase;
  color:var(--t3);font-family:'JetBrains Mono',monospace;
  margin-bottom:8px;margin-left:2px;
}
.settings-card{
  background:var(--s1);border-radius:16px;border:1px solid var(--br);
  overflow:hidden;margin-bottom:16px;
}
.settings-row{
  display:flex;align-items:center;justify-content:space-between;
  padding:17px 20px;border-bottom:1px solid var(--br);
}
.settings-row:last-child{border-bottom:none}
.settings-ico{
  width:40px;height:40px;border-radius:10px;background:var(--s2);
  display:flex;align-items:center;justify-content:center;color:var(--a);flex-shrink:0;
}

/* ████ RESPONSIVE FIXES ████ */
@media(max-width:360px){
  .hero-title{font-size:32px}
  .btn{padding:9px 16px;font-size:13px}
  .card{width:130px}
  @media(min-width:768px){.card{width:130px}}
}

/* Safe area insets for notch phones */
@supports(padding:max(0px)){
  .nav{padding-top:max(0px,env(safe-area-inset-top));height:calc(68px + env(safe-area-inset-top))}
  .bnav{padding-bottom:max(0px,env(safe-area-inset-bottom));height:calc(64px + env(safe-area-inset-bottom))}
  .pg{padding-top:calc(68px + env(safe-area-inset-top))}
}

/* ████ COOKIE BANNER ████ */
.cookie-wrap{
  position:fixed;bottom:0;left:0;right:0;z-index:9000;
  padding:16px 16px 84px;
  pointer-events:none;
  display:flex;justify-content:center;
}
@media(min-width:768px){.cookie-wrap{bottom:24px;padding:0 24px}}
.cookie-banner{
  pointer-events:all;
  background:var(--s1);
  border:1px solid var(--br);
  border-radius:18px;
  padding:18px 20px;
  max-width:580px;
  width:100%;
  box-shadow:0 16px 48px rgba(0,0,0,.55),0 0 0 1px var(--br);
  display:flex;flex-direction:column;gap:14px;
  animation:cookieIn .5s cubic-bezier(.34,1.26,.64,1) both;
}
@media(min-width:540px){
  .cookie-banner{flex-direction:row;align-items:center;gap:18px;padding:16px 22px}
}
@keyframes cookieIn{
  from{opacity:0;transform:translateY(40px) scale(.95)}
  to{opacity:1;transform:none}
}
@keyframes cookieOut{
  from{opacity:1;transform:none}
  to{opacity:0;transform:translateY(24px) scale(.96)}
}
.cookie-banner.leaving{animation:cookieOut .32s ease forwards}
.cookie-icon{
  width:44px;height:44px;border-radius:12px;
  background:var(--ag);border:1px solid var(--ab);
  display:flex;align-items:center;justify-content:center;
  flex-shrink:0;
}
.cookie-text{flex:1;min-width:0}
.cookie-title{
  font-family:'Clash Display',system-ui,sans-serif;
  font-size:15px;font-weight:700;margin-bottom:4px;color:var(--tx);
  display:flex;align-items:center;gap:8px;
}
.cookie-desc{font-size:12.5px;color:var(--t2);line-height:1.6}
.cookie-desc a{
  color:var(--a);text-decoration:underline;text-underline-offset:2px;
  cursor:pointer;font-weight:600;
}
.cookie-desc a:hover{color:var(--ah)}
.cookie-btns{display:flex;gap:9px;flex-shrink:0}
@media(max-width:539px){.cookie-btns{width:100%}}
.cookie-accept{
  padding:10px 22px;border-radius:10px;
  background:var(--a);color:#07080F;
  font-size:13px;font-weight:800;cursor:pointer;
  border:none;transition:all .22s;white-space:nowrap;flex:1;
}
.cookie-accept:hover{background:var(--ah);transform:translateY(-2px);box-shadow:0 8px 22px var(--ag)}
.cookie-decline{
  padding:10px 16px;border-radius:10px;
  background:transparent;color:var(--t2);
  font-size:13px;font-weight:700;cursor:pointer;
  border:1px solid var(--br);transition:all .22s;white-space:nowrap;flex:1;
}
.cookie-decline:hover{border-color:var(--rd);color:var(--rd)}
/* ████ MOVIE OF THE DAY ████ */
.motd{
  position:relative;overflow:hidden;
  border-radius:20px;margin:0 16px 0;
  border:1px solid var(--ab);
  background:var(--s1);
  cursor:pointer;
  transition:transform .3s ease,box-shadow .3s ease;
}
@media(min-width:600px){.motd{margin:0 28px 0}}
@media(min-width:768px){.motd{margin:0 48px 0}}
@media(min-width:1200px){.motd{margin:0 88px 0}}
.motd:hover{transform:translateY(-3px);box-shadow:0 20px 60px rgba(0,0,0,.5)}
.motd-bg{
  position:absolute;inset:0;
  background-size:cover;background-position:center;
  filter:blur(2px) brightness(.35);
  transform:scale(1.08);
  transition:transform 8s ease;
}
.motd:hover .motd-bg{transform:scale(1.12)}
.motd-overlay{
  position:absolute;inset:0;
  background:linear-gradient(135deg,rgba(7,8,15,.96) 0%,rgba(7,8,15,.7) 55%,rgba(7,8,15,.3) 100%);
}
.motd-inner{
  position:relative;z-index:2;
  padding:22px 22px;
  display:flex;flex-direction:column;gap:12px;
}
@media(min-width:640px){
  .motd-inner{
    flex-direction:row;align-items:center;gap:24px;padding:28px 32px;
  }
}
.motd-poster{
  width:80px;height:118px;border-radius:10px;
  overflow:hidden;flex-shrink:0;
  box-shadow:0 12px 32px rgba(0,0,0,.6);
  border:2px solid var(--ab);
}
@media(min-width:640px){.motd-poster{width:100px;height:148px}}
.motd-badge{
  display:inline-flex;align-items:center;gap:7px;
  background:var(--a);color:#07080F;
  font-size:10px;font-weight:800;letter-spacing:.16em;text-transform:uppercase;
  padding:4px 12px;border-radius:100px;margin-bottom:6px;
  font-family:'JetBrains Mono',monospace;width:fit-content;
}
.motd-badge-dot{
  width:6px;height:6px;border-radius:50%;background:#07080F;
  animation:pulse2 1.4s ease infinite;flex-shrink:0;
}
.motd-title{
  font-family:'Clash Display',system-ui,sans-serif;
  font-size:22px;font-weight:700;color:#F0EDF9;
  letter-spacing:-.03em;line-height:1.1;margin-bottom:6px;
}
@media(min-width:480px){.motd-title{font-size:26px}}
.motd-meta{
  display:flex;gap:10px;flex-wrap:wrap;align-items:center;margin-bottom:10px;
}
.motd-tag{
  font-size:11.5px;color:rgba(240,237,249,.55);
  font-family:'JetBrains Mono',monospace;
  display:flex;align-items:center;gap:5px;
}
.motd-sep{width:3px;height:3px;border-radius:50%;background:var(--a);opacity:.6}
.motd-desc{
  font-size:13.5px;color:rgba(240,237,249,.6);line-height:1.7;
  display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden;
  margin-bottom:12px;
}
.motd-footer{display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:10px}
.motd-countdown{
  display:flex;align-items:center;gap:8px;
  font-size:12px;color:rgba(240,237,249,.45);font-family:'JetBrains Mono',monospace;
}
.motd-countdown-val{
  background:rgba(255,255,255,.1);
  padding:3px 8px;border-radius:6px;
  font-size:12px;font-weight:700;color:rgba(240,237,249,.7);
  border:1px solid rgba(255,255,255,.08);
}

/* ████ PUSH NOTIFICATION BELL ████ */
.notif-bell-wrap{
  position:fixed;bottom:80px;right:14px;z-index:300;
  display:flex;flex-direction:column;align-items:flex-end;gap:9px;
}
@media(min-width:768px){.notif-bell-wrap{bottom:80px;right:28px}}
.notif-bell-btn{
  width:46px;height:46px;border-radius:50%;
  background:linear-gradient(135deg,var(--s1),var(--s2));
  border:1px solid var(--br);
  color:var(--t2);cursor:pointer;
  display:flex;align-items:center;justify-content:center;
  box-shadow:0 4px 18px rgba(0,0,0,.4);
  transition:all .25s;
  position:relative;
}
.notif-bell-btn:hover{border-color:var(--a);color:var(--a);transform:scale(1.08)}
.notif-bell-btn.subscribed{
  background:linear-gradient(135deg,var(--a),var(--ah));
  color:#07080F;border-color:var(--a);
}
.notif-bell-btn.subscribed:hover{transform:scale(1.05)}
@keyframes bellRing{
  0%,100%{transform:rotate(0)}15%{transform:rotate(18deg)}30%{transform:rotate(-14deg)}45%{transform:rotate(10deg)}60%{transform:rotate(-6deg)}75%{transform:rotate(3deg)}
}
.notif-bell-btn:not(.subscribed):hover svg{animation:bellRing .6s ease}
.notif-bell-tooltip{
  background:var(--s1);border:1px solid var(--br);
  border-radius:10px;padding:10px 14px;
  font-size:12px;font-weight:600;color:var(--tx);
  box-shadow:var(--sh);white-space:nowrap;
  animation:fu .25s ease;
  max-width:220px;text-align:center;
}

/* ████ WHATSAPP CHANNEL ████ */
.wa-banner{
  margin:0 16px 0;border-radius:18px;
  background:linear-gradient(135deg,#0a3a1e 0%,#0f4d28 50%,#0a3a1e 100%);
  border:1px solid #1a6b3a;
  padding:22px 22px;
  display:flex;flex-direction:column;gap:14px;
  cursor:pointer;transition:all .3s ease;
  position:relative;overflow:hidden;
}
@media(min-width:600px){.wa-banner{margin:0 28px 0;flex-direction:row;align-items:center;gap:22px;padding:22px 28px}}
@media(min-width:768px){.wa-banner{margin:0 48px 0}}
@media(min-width:1200px){.wa-banner{margin:0 88px 0}}
.wa-banner::before{
  content:'';position:absolute;top:-40px;right:-40px;
  width:160px;height:160px;border-radius:50%;
  background:rgba(37,211,102,.07);
}
.wa-banner::after{
  content:'';position:absolute;bottom:-30px;left:20%;
  width:120px;height:120px;border-radius:50%;
  background:rgba(37,211,102,.05);
}
.wa-banner:hover{transform:translateY(-3px);box-shadow:0 16px 48px rgba(0,0,0,.4),0 0 0 1px #25D366}
.wa-icon-wrap{
  width:60px;height:60px;border-radius:16px;
  background:rgba(37,211,102,.18);border:1px solid rgba(37,211,102,.3);
  display:flex;align-items:center;justify-content:center;
  flex-shrink:0;position:relative;z-index:1;
}
.wa-content{flex:1;min-width:0;position:relative;z-index:1}
.wa-eyebrow{
  font-size:10px;font-weight:700;letter-spacing:.16em;text-transform:uppercase;
  color:#25D366;margin-bottom:5px;font-family:'JetBrains Mono',monospace;
  display:flex;align-items:center;gap:7px;
}
.wa-eyebrow::before{content:'';display:block;width:14px;height:2px;background:#25D366;border-radius:2px}
.wa-title{
  font-family:'Clash Display',system-ui,sans-serif;
  font-size:20px;font-weight:700;color:#fff;
  letter-spacing:-.02em;margin-bottom:5px;
}
@media(min-width:480px){.wa-title{font-size:22px}}
.wa-desc{font-size:13px;color:rgba(255,255,255,.6);line-height:1.65;margin-bottom:12px}
.wa-btn{
  display:inline-flex;align-items:center;gap:9px;
  padding:11px 22px;border-radius:10px;
  background:#25D366;color:#fff;
  font-size:13.5px;font-weight:800;border:none;cursor:pointer;
  transition:all .22s;width:fit-content;font-family:'Satoshi',system-ui,sans-serif;
}
.wa-btn:hover{background:#22c55e;transform:translateY(-1px);box-shadow:0 8px 24px rgba(37,211,102,.3)}
.wa-stats{
  display:flex;gap:16px;flex-wrap:wrap;position:relative;z-index:1;
}
@media(min-width:600px){.wa-stats{flex-direction:column;gap:8px;flex-shrink:0;align-items:flex-end;}}
.wa-stat{
  font-size:11.5px;color:rgba(255,255,255,.45);
  display:flex;align-items:center;gap:5px;font-family:'JetBrains Mono',monospace;
}
.wa-stat-dot{width:6px;height:6px;border-radius:50%;background:#25D366;animation:pulse2 1.6s ease infinite}

`
  document.head.appendChild(st);
}

/* ═══════ CONSTANTS ═══════ */
const GENRES = ["All","Action","Adventure","Comedy","Drama","Horror","Romance","Sci-Fi","Thriller","Animation"];
const ADMIN_PASS = "movienation";
// ▼▼▼ CHANGE THIS to your real WhatsApp Channel link ▼▼▼
const WHATSAPP_CHANNEL = "https://whatsapp.com/channel/0029Vb7oS8I3WHTP34HJhP3E";
// ▲▲▲ Get your link from WhatsApp → Channels → Create Channel → Share ▲▲▲

/* ═══════ UTILS ═══════ */
const slugify = s => s.toLowerCase().trim().replace(/[^a-z0-9]+/g,"-").replace(/(^-|-$)/g,"");
const ytId = u => { if(!u) return null; const m=u.match(/(?:v=|youtu\.be\/|embed\/)([^&?/\s]+)/); return m?m[1]:null; };
const fmtT = m => m ? `${Math.floor(m/60)}h ${m%60}m` : "—";
const fmtV = n => n>=1000000?`${(n/1e6).toFixed(1)}M`:n>=1000?`${(n/1000).toFixed(1)}K`:String(n||0);
const nowT = () => new Date().toLocaleTimeString([],{hour:"2-digit",minute:"2-digit"});
const todayS = () => new Date().toISOString().split("T")[0];

/* ═══════ STORAGE ═══════ */
const LS={g:(k,d)=>{try{const s=localStorage.getItem(k);return s?JSON.parse(s):d}catch{return d}},s:(k,v)=>{try{localStorage.setItem(k,JSON.stringify(v))}catch{}}};

const SEEDS=[
  {id:"1",title:"Dune: Part Two",year:2024,genres:["Sci-Fi","Adventure"],director:"Denis Villeneuve",cast:["Timothée Chalamet","Zendaya","Rebecca Ferguson","Josh Brolin"],runtime:166,language:"English",country:"USA",desc:"Paul Atreides unites with Chani and the Fremen while seeking revenge against conspirators who destroyed his family. Facing a choice between the love of his life and the fate of the universe, he must prevent a terrible future only he can foresee.",poster:"https://picsum.photos/seed/dune5/300/450",backdrop:"https://picsum.photos/seed/dune5X/1400/700",watchUrl:"https://example.com/watch/dune-two",downloadUrl:"https://example.com/dl/dune-two",trailerUrl:"https://www.youtube.com/watch?v=Way9Dexny3w",featured:true,trending:true,trendingRank:1,status:"published",slug:"dune-part-two",views:0,dlClicks:0,seo:{title:"Dune: Part Two (2024) | MovieNation",desc:"Watch Dune Part Two online.",keys:"dune part two, timothee chalamet, zendaya"},addedAt:"2026-03-07"},
  {id:"2",title:"The Dark Knight",year:2008,genres:["Action","Thriller"],director:"Christopher Nolan",cast:["Christian Bale","Heath Ledger","Aaron Eckhart","Gary Oldman"],runtime:152,language:"English",country:"USA/UK",desc:"Batman raises the stakes in his war on crime. With the help of Lt. Gordon and DA Harvey Dent, he sets out to dismantle organized crime in Gotham City, but a rising anarchist known as the Joker has other plans entirely.",poster:"https://picsum.photos/seed/batman5/300/450",backdrop:"https://picsum.photos/seed/batman5X/1400/700",watchUrl:"https://example.com/watch/dark-knight",downloadUrl:"https://example.com/dl/dark-knight",trailerUrl:"https://www.youtube.com/watch?v=EXeTwQWrcwY",featured:true,trending:true,trendingRank:2,status:"published",slug:"the-dark-knight",views:0,dlClicks:0,seo:{title:"The Dark Knight (2008) | MovieNation",desc:"Watch The Dark Knight online.",keys:"dark knight, batman, joker, christopher nolan"},addedAt:"2026-03-06"},
  {id:"3",title:"Inception",year:2010,genres:["Sci-Fi","Thriller"],director:"Christopher Nolan",cast:["Leonardo DiCaprio","Joseph Gordon-Levitt","Elliot Page","Tom Hardy"],runtime:148,language:"English",country:"USA/UK",desc:"A thief who steals corporate secrets through the use of dream-sharing technology is given the inverse task of planting an idea into the mind of a C.E.O. A warning is issued that this operation is nearly impossible.",poster:"https://picsum.photos/seed/incept5/300/450",backdrop:"https://picsum.photos/seed/incept5X/1400/700",watchUrl:"https://example.com/watch/inception",downloadUrl:"https://example.com/dl/inception",trailerUrl:"https://www.youtube.com/watch?v=YoHD9XEInc0",featured:true,trending:true,trendingRank:3,status:"published",slug:"inception",views:0,dlClicks:0,seo:{title:"Inception (2010) | MovieNation",desc:"Watch Inception online.",keys:"inception, leonardo dicaprio, dream, nolan"},addedAt:"2026-03-06"},
  {id:"4",title:"Interstellar",year:2014,genres:["Sci-Fi","Drama"],director:"Christopher Nolan",cast:["Matthew McConaughey","Anne Hathaway","Jessica Chastain","Michael Caine"],runtime:169,language:"English",country:"USA/UK",desc:"A team of explorers travel through a wormhole in space in an attempt to ensure humanity's survival. When Earth becomes uninhabitable, a former NASA pilot leads a desperate mission beyond our solar system.",poster:"https://picsum.photos/seed/inter5/300/450",backdrop:"https://picsum.photos/seed/inter5X/1400/700",watchUrl:"https://example.com/watch/interstellar",downloadUrl:"https://example.com/dl/interstellar",trailerUrl:"https://www.youtube.com/watch?v=zSWdZVtXT7E",featured:false,trending:true,trendingRank:4,status:"published",slug:"interstellar",views:0,dlClicks:0,seo:{title:"Interstellar (2014) | MovieNation",desc:"Watch Interstellar online.",keys:"interstellar, christopher nolan, space"},addedAt:"2026-03-05"},
  {id:"5",title:"Oppenheimer",year:2023,genres:["Drama","Thriller"],director:"Christopher Nolan",cast:["Cillian Murphy","Emily Blunt","Matt Damon","Robert Downey Jr."],runtime:180,language:"English",country:"USA/UK",desc:"The story of J. Robert Oppenheimer and his role in the development of the atomic bomb during World War II. Based on the Pulitzer Prize-winning book 'American Prometheus'.",poster:"https://picsum.photos/seed/oppen5/300/450",backdrop:"https://picsum.photos/seed/oppen5X/1400/700",watchUrl:"https://example.com/watch/oppenheimer",downloadUrl:"https://example.com/dl/oppenheimer",trailerUrl:"https://www.youtube.com/watch?v=uYPbbksJxIg",featured:false,trending:true,trendingRank:5,status:"published",slug:"oppenheimer",views:0,dlClicks:0,seo:{title:"Oppenheimer (2023) | MovieNation",desc:"Watch Oppenheimer online.",keys:"oppenheimer, cillian murphy, nolan"},addedAt:"2026-03-05"},
  {id:"6",title:"Top Gun: Maverick",year:2022,genres:["Action","Drama"],director:"Joseph Kosinski",cast:["Tom Cruise","Jennifer Connelly","Miles Teller","Val Kilmer"],runtime:130,language:"English",country:"USA",desc:"After more than thirty years of service, Pete Mitchell is still pushing the envelope as a top naval aviator. Facing ghosts of his past, he must train a new generation for an extremely dangerous mission.",poster:"https://picsum.photos/seed/topgun5/300/450",backdrop:"https://picsum.photos/seed/topgun5X/1400/700",watchUrl:"https://example.com/watch/top-gun",downloadUrl:"https://example.com/dl/top-gun",trailerUrl:"https://www.youtube.com/watch?v=qSqVVswa420",featured:false,trending:false,trendingRank:0,status:"published",slug:"top-gun-maverick",views:0,dlClicks:0,seo:{title:"Top Gun Maverick (2022) | MovieNation",desc:"Watch Top Gun Maverick.",keys:"top gun maverick, tom cruise"},addedAt:"2026-03-04"},
  {id:"7",title:"Parasite",year:2019,genres:["Thriller","Drama"],director:"Bong Joon-ho",cast:["Song Kang-ho","Lee Sun-kyun","Cho Yeo-jeong","Choi Woo-shik"],runtime:132,language:"Korean",country:"South Korea",desc:"Greed and class discrimination threaten the newly formed symbiotic relationship between the wealthy Park family and the destitute Kim clan. An Oscar-winning dark comedy thriller.",poster:"https://picsum.photos/seed/para5/300/450",backdrop:"https://picsum.photos/seed/para5X/1400/700",watchUrl:"https://example.com/watch/parasite",downloadUrl:"https://example.com/dl/parasite",trailerUrl:"https://www.youtube.com/watch?v=5xH0HfJHsaY",featured:false,trending:false,trendingRank:0,status:"published",slug:"parasite",views:0,dlClicks:0,seo:{title:"Parasite (2019) | MovieNation",desc:"Watch Parasite online.",keys:"parasite, bong joon-ho, korean"},addedAt:"2026-03-04"},
  {id:"8",title:"Everything Everywhere All at Once",year:2022,genres:["Comedy","Sci-Fi"],director:"Daniel Kwan & Daniel Scheinert",cast:["Michelle Yeoh","Stephanie Hsu","Jamie Lee Curtis","Ke Huy Quan"],runtime:139,language:"English",country:"USA",desc:"A middle-aged Chinese-American laundromat owner is swept up in an adventure to save the multiverse, exploring identity, family, and the nature of existence itself across infinite realities.",poster:"https://picsum.photos/seed/eeaao5/300/450",backdrop:"https://picsum.photos/seed/eeaao5X/1400/700",watchUrl:"https://example.com/watch/eeaao",downloadUrl:"https://example.com/dl/eeaao",trailerUrl:"https://www.youtube.com/watch?v=wxN1T1uxQ2g",featured:false,trending:false,trendingRank:0,status:"published",slug:"everything-everywhere-all-at-once",views:0,dlClicks:0,seo:{title:"Everything Everywhere All at Once | MovieNation",desc:"Watch EEAAO online.",keys:"everything everywhere, michelle yeoh, multiverse"},addedAt:"2026-03-03"},
  {id:"9",title:"Avengers: Endgame",year:2019,genres:["Action","Adventure"],director:"Anthony & Joe Russo",cast:["Robert Downey Jr.","Chris Evans","Mark Ruffalo","Scarlett Johansson"],runtime:181,language:"English",country:"USA",desc:"After devastating events wiped out half of all living beings, the remaining Avengers assemble for one final, desperate mission to undo the damage and restore balance to the universe.",poster:"https://picsum.photos/seed/aveng5/300/450",backdrop:"https://picsum.photos/seed/aveng5X/1400/700",watchUrl:"https://example.com/watch/avengers-endgame",downloadUrl:"https://example.com/dl/avengers-endgame",trailerUrl:"https://www.youtube.com/watch?v=TcMBFSGVi1c",featured:false,trending:false,trendingRank:0,status:"published",slug:"avengers-endgame",views:0,dlClicks:0,seo:{title:"Avengers: Endgame (2019) | MovieNation",desc:"Watch Avengers Endgame.",keys:"avengers endgame, iron man, thanos"},addedAt:"2026-03-03"},
  {id:"10",title:"Spider-Man: No Way Home",year:2021,genres:["Action","Adventure"],director:"Jon Watts",cast:["Tom Holland","Zendaya","Benedict Cumberbatch","Willem Dafoe"],runtime:148,language:"English",country:"USA",desc:"When Spider-Man's identity is revealed, he asks Doctor Strange for help. The spell goes wrong, pulling dangerous villains from alternate universes into his world and forcing him to face his greatest challenge.",poster:"https://picsum.photos/seed/spidey5/300/450",backdrop:"https://picsum.photos/seed/spidey5X/1400/700",watchUrl:"https://example.com/watch/spider-man-nwh",downloadUrl:"https://example.com/dl/spider-man-nwh",trailerUrl:"https://www.youtube.com/watch?v=JfVOs4VSpmA",featured:false,trending:false,trendingRank:0,status:"published",slug:"spider-man-no-way-home",views:0,dlClicks:0,seo:{title:"Spider-Man: No Way Home | MovieNation",desc:"Watch Spider-Man No Way Home.",keys:"spider-man no way home, tom holland"},addedAt:"2026-03-02"},
  {id:"11",title:"The Batman",year:2022,genres:["Action","Thriller"],director:"Matt Reeves",cast:["Robert Pattinson","Zoë Kravitz","Paul Dano","Colin Farrell"],runtime:176,language:"English",country:"USA",desc:"Batman ventures into Gotham City's underworld when a sadistic killer leaves cryptic clues targeting the city's elite. The Dark Knight must forge new alliances and confront deep systemic corruption.",poster:"https://picsum.photos/seed/batm5/300/450",backdrop:"https://picsum.photos/seed/batm5X/1400/700",watchUrl:"https://example.com/watch/the-batman",downloadUrl:"https://example.com/dl/the-batman",trailerUrl:"https://www.youtube.com/watch?v=mqqft2x_Aa4",featured:false,trending:false,trendingRank:0,status:"published",slug:"the-batman",views:0,dlClicks:0,seo:{title:"The Batman (2022) | MovieNation",desc:"Watch The Batman.",keys:"the batman, robert pattinson, matt reeves"},addedAt:"2026-03-02"},
  {id:"12",title:"The Grand Budapest Hotel",year:2014,genres:["Comedy","Drama"],director:"Wes Anderson",cast:["Ralph Fiennes","Tony Revolori","Saoirse Ronan","F. Murray Abraham"],runtime:99,language:"English",country:"Germany",desc:"The eccentric adventures of Gustave H., the legendary concierge at a famous European hotel between the wars, and Zero Moustafa, the lobby boy who becomes his most trusted friend.",poster:"https://picsum.photos/seed/buda5/300/450",backdrop:"https://picsum.photos/seed/buda5X/1400/700",watchUrl:"https://example.com/watch/grand-budapest",downloadUrl:"https://example.com/dl/grand-budapest",trailerUrl:"https://www.youtube.com/watch?v=1Fg5iWmQjwk",featured:false,trending:false,trendingRank:0,status:"published",slug:"the-grand-budapest-hotel",views:0,dlClicks:0,seo:{title:"The Grand Budapest Hotel | MovieNation",desc:"Watch The Grand Budapest Hotel.",keys:"grand budapest hotel, wes anderson"},addedAt:"2026-03-01"},
];

const getM=()=>LS.g("mn5m",SEEDS);
const saveM=m=>LS.s("mn5m",m);
const getDk=()=>LS.g("mn5dk",true);
const saveDk=v=>LS.s("mn5dk",v);
const getNf=()=>LS.g("mn5nf",[]);
const saveNf=n=>LS.s("mn5nf",n);
const getLog=()=>LS.g("mn5log",[]);
const addLog=(a,m)=>{const l=getLog();l.unshift({id:Date.now(),a,m:m||"",t:nowT(),d:new Date().toLocaleDateString()});LS.s("mn5log",l.slice(0,50));};
const addNf=(ti,su,tp="def")=>{const n=getNf();n.unshift({id:Date.now(),ti,su,tp,t:nowT()});saveNf(n.slice(0,30));};

/* ── Firebase-aware save helpers ── */
async function saveMovie(movie,all){const u=all.map(m=>m.id===movie.id?movie:m);LS.s("mn5m",u);if(isFirebaseConfigured()){await saveMovieToFirebase(movie);}return u;}
async function addNewMovie(movie,all){const full={...movie,id:movie.id||Date.now().toString(),views:0,dlClicks:0};const u=[full,...all];LS.s("mn5m",u);if(isFirebaseConfigured()){await saveMovieToFirebase(full);}return u;}
async function removeMovie(id,all){const u=all.filter(m=>m.id!==id);LS.s("mn5m",u);if(isFirebaseConfigured()){await deleteMovieFromFirebase(id);}return u;}
async function saveBulkMovies(movies){LS.s("mn5m",movies);if(isFirebaseConfigured()){await bulkSaveToFirebase(movies);}}
const I = {
  home:<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>,
  search:<svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>,
  compass:<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><circle cx="12" cy="12" r="10"/><polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76"/></svg>,
  settings:<svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06-.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>,
  play:<svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><polygon points="5 3 19 12 5 21 5 3"/></svg>,
  playSm:<svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><polygon points="5 3 19 12 5 21 5 3"/></svg>,
  dl:<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>,
  x:<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>,
  left:<svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round"><polyline points="15 18 9 12 15 6"/></svg>,
  right:<svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round"><polyline points="9 18 15 12 9 6"/></svg>,
  up:<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><polyline points="18 15 12 9 6 15"/></svg>,
  back:<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round"><polyline points="15 18 9 12 15 6"/></svg>,
  moon:<svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>,
  sun:<svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>,
  lock:<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>,
  logout:<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>,
  edit:<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>,
  trash:<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6M10 11v6M14 11v6M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/></svg>,
  plus:<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>,
  film:<svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><rect x="2" y="2" width="20" height="20" rx="2.18"/><line x1="7" y1="2" x2="7" y2="22"/><line x1="17" y1="2" x2="17" y2="22"/><line x1="2" y1="12" x2="22" y2="12"/><line x1="2" y1="7" x2="7" y2="7"/><line x1="2" y1="17" x2="7" y2="17"/><line x1="17" y1="17" x2="22" y2="17"/><line x1="17" y1="7" x2="22" y2="7"/></svg>,
  trailer:<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round"><polygon points="23 7 16 12 23 17 23 7"/><rect x="1" y="5" width="15" height="14" rx="2"/></svg>,
  copy:<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>,
  clock:<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>,
  globe:<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>,
  star:<svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>,
  log:<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>,
  bell:<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>,
  eye:<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>,
  trend:<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/></svg>,
  externalLink:<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>,
};

/* ── REAL SOCIAL ICONS ── */
const SocialIcons = {
  Facebook: ({ size=24 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="#1877F2"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
  ),
  Twitter: ({ size=24 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
  ),
  WhatsApp: ({ size=24 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="#25D366"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
  ),
  Instagram: ({ size=24 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="url(#ig-grad)"><defs><linearGradient id="ig-grad" x1="0%" y1="100%" x2="100%" y2="0%"><stop offset="0%" stopColor="#f09433"/><stop offset="25%" stopColor="#e6683c"/><stop offset="50%" stopColor="#dc2743"/><stop offset="75%" stopColor="#cc2366"/><stop offset="100%" stopColor="#bc1888"/></linearGradient></defs><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
  ),
  YouTube: ({ size=24 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="#FF0000"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>
  ),
  TikTok: ({ size=24 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor"><path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.34 6.34 0 00-.79-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.33-6.34V8.69a8.22 8.22 0 004.82 1.55V6.79a4.86 4.86 0 01-1.05-.1z"/></svg>
  ),
};

/* ═══════ LAZY IMAGE ═══════ */
function Img({src,alt,style,className}){
  const[ok,setOk]=useState(false);const[er,setEr]=useState(false);
  return(
    <div className={!ok&&!er?"shim":""} style={{position:"relative",width:"100%",height:"100%",overflow:"hidden",background:"var(--s3)",...style}}>
      {er
        ?<div style={{position:"absolute",inset:0,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",gap:8,color:"var(--t3)",fontSize:12}}>{I.film}<span style={{fontSize:11}}>No image</span></div>
        :<img src={src} alt={alt||""} className={className} loading="lazy" decoding="async"
          style={{opacity:ok?1:0,transition:"opacity .35s ease,filter .35s ease",filter:ok?"none":"blur(8px)",width:"100%",height:"100%",objectFit:"cover",transform:"translateZ(0)"}}
          onLoad={()=>setOk(true)} onError={()=>setEr(true)}/>
      }
    </div>
  );
}

/* ═══════ MOVIE CARD ═══════ */
/* Favorites helper (localStorage) */
/* ── Profile & Theme storage ── */
const ACCENT_COLORS = [
  {name:"Amber",   val:"#F59E0B", dark:"#07080F"},
  {name:"Coral",   val:"#FF6B6B", dark:"#0F0708"},
  {name:"Emerald", val:"#10B981", dark:"#07100E"},
  {name:"Violet",  val:"#8B5CF6", dark:"#090710"},
  {name:"Sky",     val:"#38BDF8", dark:"#070B10"},
  {name:"Rose",    val:"#FB7185", dark:"#100708"},
  {name:"Lime",    val:"#84CC16", dark:"#080F06"},
  {name:"Orange",  val:"#F97316", dark:"#0F0800"},
];
const FONTS = [
  {name:"Default",   val:"'Clash Display',system-ui,sans-serif"},
  {name:"Serif",     val:"Georgia,'Times New Roman',serif"},
  {name:"Mono",      val:"'JetBrains Mono',monospace"},
  {name:"Rounded",   val:"system-ui,-apple-system,sans-serif"},
];
const getProfile = () => LS.g("mn_profile", {name:"Movie Fan",handle:"@moviefan",bio:"",avatarText:"🎬",avatarImg:null});
const saveProfile = v => LS.s("mn_profile", v);
const getThemePrefs = () => LS.g("mn_theme", {accentIdx:0,fontIdx:0,textScale:100});
const saveThemePrefs = v => LS.s("mn_theme", v);

/* Apply accent color to CSS variables */
/* Convert hex color to r,g,b values */
function hexToRgb(hex){
  const h = hex.replace("#","");
  const r = parseInt(h.slice(0,2),16);
  const g = parseInt(h.slice(2,4),16);
  const b = parseInt(h.slice(4,6),16);
  return {r,g,b};
}

function applyAccent(accentIdx){
  const a = ACCENT_COLORS[accentIdx] || ACCENT_COLORS[0];
  let s = document.getElementById("mn-accent-override");
  if(!s){ s=document.createElement("style");s.id="mn-accent-override";document.head.appendChild(s); }
  const {r,g,b} = hexToRgb(a.val);
  const rh=Math.min(255,r+20), gh=Math.min(255,g+20), bh=Math.min(255,b+20);
  s.textContent = `
    .dk, .lt {
      --a: ${a.val} !important;
      --ah: rgb(${rh},${gh},${bh}) !important;
      --ag: rgba(${r},${g},${b},0.16) !important;
      --ab: rgba(${r},${g},${b},0.32) !important;
    }
    .dk::-webkit-scrollbar-track, .dk *::-webkit-scrollbar-track { background: #000 !important; }
    .dk, .dk * { scrollbar-color: ${a.val} #000 !important; }
    .lt::-webkit-scrollbar-track, .lt *::-webkit-scrollbar-track { background: #E8E7F5 !important; }
    .lt, .lt * { scrollbar-color: ${a.val} #E8E7F5 !important; }
    ::-webkit-scrollbar-thumb { background: ${a.val} !important; border-radius: 3px !important; }
  `;
}

function applyFont(fontIdx){
  const f = FONTS[fontIdx] || FONTS[0];
  let s = document.getElementById("mn-font-override");
  if(!s){ s=document.createElement("style");s.id="mn-font-override";document.head.appendChild(s); }
  s.textContent = `
    .ttl, .hero-title, .watch-title, .modal-title, .t-title,
    .nav-logo-txt, .footer-logo, .card-name, .astat-v,
    .watch-sidebar-title, .profile-name, h1, h2 {
      font-family: ${f.val} !important;
    }
  `;
}

function applyTextScale(scale){
  /* Use CSS transform scale on the whole app — works regardless of px/rem units */
  let s = document.getElementById("mn-scale-override");
  if(!s){ s=document.createElement("style");s.id="mn-scale-override";document.head.appendChild(s); }
  if(scale===100){
    s.textContent = "";
    return;
  }
  const factor = scale / 100;
  s.textContent = `
    .sec, .hero-c, .watch-body, .watch-title,
    .watch-desc, .watch-ig, .watch-cast, .modal-body,
    .footer-in {
      font-size: calc(1em * ${factor}) !important;
    }
    .ttl { font-size: calc(22px * ${factor}) !important; }
    .hero-title { font-size: clamp(calc(32px * ${factor}), calc(8vw * ${factor}), calc(76px * ${factor})) !important; }
    .watch-title { font-size: clamp(calc(20px * ${factor}), calc(5vw * ${factor}), calc(40px * ${factor})) !important; }
    .card-name { font-size: calc(12.5px * ${factor}) !important; }
    .card-sub, .watch-tag, .mtag, .watch-ig-lbl, .watch-cast-chip, .t-meta { font-size: calc(11px * ${factor}) !important; }
    .watch-desc, .modal-desc { font-size: calc(14px * ${factor}) !important; }
    .watch-ig-val, .m-igv { font-size: calc(13px * ${factor}) !important; }
    .btn { font-size: calc(13.5px * ${factor}) !important; }
    .watch-actions .btn { font-size: calc(14px * ${factor}) !important; }
  `;
}

const getFavs = () => { try { return JSON.parse(localStorage.getItem("mn_favs")||"[]"); } catch { return []; } };
const toggleFav = (id) => {
  const favs = getFavs();
  const next = favs.includes(id) ? favs.filter(f=>f!==id) : [...favs, id];
  localStorage.setItem("mn_favs", JSON.stringify(next));
  return next;
};

/* isNew — added within last 14 days */
const isNew = (movie) => {
  if (!movie.addedAt) return false;
  const added = new Date(movie.addedAt);
  const diff = (Date.now() - added.getTime()) / (1000*60*60*24);
  return diff <= 14;
};

function MCard({movie,onClick,fullWidth,onFavToggle}){
  const [favs, setFavs] = useState(getFavs);
  const isFav = favs.includes(movie?.id);
  const cardRef = useRef(null);

  if(!movie) return null;

  /* 3D tilt on mouse move */
  const handleMouseMove = (e) => {
    const el = cardRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width  - 0.5;
    const y = (e.clientY - rect.top)  / rect.height - 0.5;
    el.style.transform = `perspective(600px) rotateY(${x*14}deg) rotateX(${-y*10}deg) translateY(-5px)`;
  };
  const handleMouseLeave = (e) => {
    const el = cardRef.current;
    if (!el) return;
    el.style.transform = "";
    el.style.transition = "transform .4s cubic-bezier(.34,1.26,.64,1), box-shadow .35s ease";
  };
  const handleMouseEnter = (e) => {
    const el = cardRef.current;
    if (!el) return;
    el.style.transition = "transform .1s ease, box-shadow .1s ease";
  };

  const clickHeart = (e) => {
    e.stopPropagation();
    const next = toggleFav(movie.id);
    setFavs(next);
    if (onFavToggle) onFavToggle(next);
  };

  const showNew = isNew(movie);

  return(
    <div
      ref={cardRef}
      className={`card${fullWidth?" card-full":""}`}
      onClick={()=>onClick(movie)}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onMouseEnter={handleMouseEnter}
      role="button" tabIndex={0}
      onKeyDown={e=>e.key==="Enter"&&onClick(movie)}
    >
      <div className="card-img">
        <Img src={movie.poster} alt={movie.title}/>
        <div className="card-ov"/>
        <div className="card-play">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><polygon points="5 3 19 12 5 21 5 3"/></svg>
        </div>
        <div className="card-inf">
          <div className="card-name">{movie.title}</div>
          <div className="card-sub">{movie.year}{movie.runtime?` · ${fmtT(movie.runtime)}`:""}</div>
        </div>
        {movie.genres?.[0]&&<div className="card-badge">{movie.genres[0]}</div>}
        {showNew&&!movie.status?.includes("draft")&&<div className="card-new">New</div>}
        {movie.status==="draft"&&<div className="card-draft">Draft</div>}
        {/* Heart button */}
        <button className={`card-heart ${isFav?"liked":""}`} onClick={clickHeart} title={isFav?"Remove from favorites":"Add to favorites"}>
          <svg width="13" height="13" viewBox="0 0 24 24" fill={isFav?"currentColor":"none"} stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
          </svg>
        </button>
      </div>
    </div>
  );
}

function WatchPage({movie,allMovies,onBack,onDl,showToast}){
  const vid = ytId(movie.trailerUrl);
  const shareUrl = window.location.origin + "?m=" + movie.slug;
  const rec = useMemo(()=>
    allMovies.filter(m=>m.id!==movie.id&&m.status!=="draft"&&m.genres?.some(g=>movie.genres?.includes(g))).slice(0,8),
    [movie,allMovies]
  );

  const shares = [
    { label:"Facebook", cls:"share-btn-fb",
      Icon:()=><SocialIcons.Facebook size={26}/>,
      url:`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}` },
    { label:"Twitter",  cls:"share-btn-tw",
      Icon:()=><SocialIcons.Twitter size={26}/>,
      url:`https://twitter.com/intent/tweet?text=${encodeURIComponent(movie.title)}&url=${encodeURIComponent(shareUrl)}` },
    { label:"WhatsApp", cls:"share-btn-wa",
      Icon:()=><SocialIcons.WhatsApp size={26}/>,
      url:`https://wa.me/?text=${encodeURIComponent(movie.title+" — "+shareUrl)}` },
    { label:"Instagram",cls:"share-btn-ig",
      Icon:()=><SocialIcons.Instagram size={26}/>,
      url:null },
  ];

  useEffect(()=>{
    document.title=movie.title+" — Watch | MovieNation";
    return()=>{ document.title="MovieNation"; };
  },[movie.title]);

  useEffect(()=>{ window.scrollTo({top:0}); },[movie.id]);

  return(
    <div className="watch-page">
      {/* ── Backdrop hero ── */}
      <div className="watch-bg">
        <Img src={movie.backdrop||movie.poster} alt={movie.title} style={{width:"100%",height:"100%"}}/>
        <div className="watch-bg-ov"/>
        <button className="watch-back" onClick={onBack}>{I.back} Back</button>
      </div>

      <div className="watch-body">
        <div className="watch-inner">
          <div className="watch-grid">

            {/* ══════ MAIN COLUMN ══════ */}
            <div>
              {/* Player */}
              <div className="watch-player">
                {vid
                  ? <iframe
                      src={`https://www.youtube.com/embed/${vid}?rel=0&modestbranding=1&playsinline=1`}
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen title={movie.title+" trailer"}
                    />
                  : <div className="watch-player-placeholder">
                      <div className="watch-play-btn"
                        onClick={()=>{ window.open(movie.watchUrl||"#","_blank","noopener,noreferrer"); showToast("Opening stream…"); }}>
                        <svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor"><polygon points="5 3 19 12 5 21 5 3"/></svg>
                      </div>
                      <p className="watch-play-hint">Tap to open the stream in a new tab</p>
                    </div>
                }
              </div>
              {vid&&(
                <p style={{fontSize:11.5,color:"var(--t3)",marginBottom:18,fontFamily:"'JetBrains Mono',monospace",letterSpacing:".03em"}}>
                  Official trailer preview
                </p>
              )}

              {/* Title */}
              <h1 className="watch-title">{movie.title}</h1>

              {/* Meta tags */}
              <div className="watch-meta-row">
                <span className="watch-tag">{movie.year}</span>
                {movie.genres?.map(g=><span key={g} className="watch-tag">{g}</span>)}
                {movie.runtime&&<span className="watch-tag">{I.clock} {fmtT(movie.runtime)}</span>}
                {movie.language&&<span className="watch-tag">{I.globe} {movie.language}</span>}
              </div>

              {/* Stream + Download buttons */}
              <div className="watch-actions">
                <button className="btn bp"
                  onClick={()=>{ window.open(movie.watchUrl||"#","_blank","noopener,noreferrer"); showToast("Opening stream…"); }}>
                  {I.play} Stream Now
                </button>
                <button className="btn bo" onClick={()=>onDl(movie)}>
                  {I.dl} Download
                </button>
                {vid&&(
                  <button className="btn bpu sm"
                    onClick={()=>window.open(`https://www.youtube.com/watch?v=${vid}`,"_blank","noopener")}>
                    {I.trailer} Trailer on YouTube
                  </button>
                )}
              </div>

              {/* Description */}
              {movie.desc&&<p className="watch-desc">{movie.desc}</p>}

              {/* Info grid */}
              <div className="watch-ig">
                {movie.director&&<div><div className="watch-ig-lbl">Director</div><div className="watch-ig-val">{movie.director}</div></div>}
                {movie.country &&<div><div className="watch-ig-lbl">Country</div><div className="watch-ig-val">{movie.country}</div></div>}
                {movie.runtime &&<div><div className="watch-ig-lbl">Runtime</div><div className="watch-ig-val">{fmtT(movie.runtime)}</div></div>}
                {movie.language&&<div><div className="watch-ig-lbl">Language</div><div className="watch-ig-val">{movie.language}</div></div>}
                {movie.year    &&<div><div className="watch-ig-lbl">Year</div><div className="watch-ig-val">{movie.year}</div></div>}
                {movie.genres?.[0]&&<div><div className="watch-ig-lbl">Genre</div><div className="watch-ig-val">{movie.genres.slice(0,2).join(", ")}</div></div>}
              </div>

              {/* Cast */}
              {movie.cast?.length>0&&(
                <div className="watch-cast-wrap">
                  <div className="watch-cast-lbl">Cast</div>
                  <div className="watch-cast">
                    {movie.cast.map((c,i)=><span key={i} className="watch-cast-chip">{c}</span>)}
                  </div>
                </div>
              )}

              {/* ── You May Also Like (MOBILE — horizontal scroll) ── */}
              {rec.length>0&&(
                <div className="watch-share" style={{background:"var(--s1)"}}>
                  <div className="watch-share-ttl">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/></svg>
                    You May Also Like
                  </div>
                  {/* Mobile: horizontal cards */}
                  <div className="watch-rec-scroll" style={{display:"flex"}}>
                    {rec.map(m=>(
                      <div key={m.id} className="watch-rec-card-mob"
                        onClick={()=>{ window.scrollTo({top:0}); setTimeout(()=>document.dispatchEvent(new CustomEvent("watchM",{detail:m})),50); }}>
                        <Img src={m.poster} alt={m.title} style={{width:"100%",aspectRatio:"2/3"}}/>
                        <div className="watch-rec-card-mob-name">{m.title}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Share buttons */}
              <div className="watch-share">
                <div className="watch-share-ttl">
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/></svg>
                  Share This Movie
                </div>
                <div className="watch-share-grid">
                  {shares.map(s=>(
                    <button key={s.label} className={`share-btn ${s.cls}`}
                      onClick={()=>{ if(s.url) window.open(s.url,"_blank","noopener,width=600,height=500"); else showToast("Open Instagram and paste the link."); }}>
                      <s.Icon/><span>{s.label}</span>
                    </button>
                  ))}
                </div>
                <div className="watch-link-box">
                  <span className="watch-link-url">{shareUrl}</span>
                  <button className="btn bo sm" style={{flexShrink:0,fontSize:12}}
                    onClick={()=>{ navigator.clipboard?.writeText(shareUrl); showToast("Link copied!"); }}>
                    {I.copy} Copy
                  </button>
                </div>
              </div>
            </div>

            {/* ══════ SIDEBAR (desktop only) ══════ */}
            <div className="watch-sidebar">
              {/* Poster card */}
              <div className="watch-card-side">
                <div className="watch-poster-side">
                  <Img src={movie.poster} alt={movie.title} style={{width:"100%",height:"100%"}}/>
                </div>
                <div className="watch-sidebar-info">
                  <div className="watch-sidebar-title">{movie.title}</div>
                  <div className="watch-sidebar-meta">{movie.year} · {movie.genres?.slice(0,2).join(", ")}</div>
                  <div style={{display:"flex",flexDirection:"column",gap:9}}>
                    <button className="btn bp" style={{width:"100%",justifyContent:"center"}}
                      onClick={()=>{ window.open(movie.watchUrl||"#","_blank","noopener,noreferrer"); showToast("Opening stream…"); }}>
                      {I.play} Stream Now
                    </button>
                    <button className="btn bo sm" style={{width:"100%",justifyContent:"center"}} onClick={()=>onDl(movie)}>
                      {I.dl} Download
                    </button>
                  </div>
                </div>
              </div>

              {/* Recommended desktop list */}
              {rec.length>0&&(
                <div className="watch-rec">
                  <div className="watch-rec-ttl">You May Also Like</div>
                  {rec.map(m=>(
                    <div key={m.id} className="watch-rec-row"
                      onClick={()=>{ window.scrollTo({top:0}); setTimeout(()=>document.dispatchEvent(new CustomEvent("watchM",{detail:m})),50); }}>
                      <div className="watch-rec-img"><Img src={m.poster} alt={m.title} style={{width:"100%",height:"100%"}}/></div>
                      <div>
                        <div className="watch-rec-name">{m.title}</div>
                        <div className="watch-rec-meta">{m.year} · {m.genres?.[0]}</div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}

/* ═══════ QUICK INFO MODAL ═══════ */
function InfoModal({movie,onClose,onWatch,onDl}){
  useEffect(()=>{
    const fn=e=>e.key==="Escape"&&onClose();
    window.addEventListener("keydown",fn);document.body.style.overflow="hidden";
    return()=>{window.removeEventListener("keydown",fn);document.body.style.overflow="";};
  },[onClose]);
  return(
    <div className="mbg" onClick={e=>e.target===e.currentTarget&&onClose()}>
      <div className="modal">
        <div className="modal-hero">
          <Img src={movie.backdrop} alt={movie.title} style={{width:"100%",height:"100%"}}/>
          <div className="modal-hero-gr"/>
          <button className="modal-x" onClick={onClose}>{I.x}</button>
        </div>
        <div className="modal-body">
          <div className="modal-grid">
            <div><div className="modal-poster"><Img src={movie.poster} alt={movie.title} style={{width:"100%",height:"100%"}}/></div></div>
            <div>
              <h2 className="modal-title">{movie.title}</h2>
              <div className="modal-tags">
                <span className="mtag">{movie.year}</span>
                {movie.genres?.map(g=><span key={g} className="mtag">{g}</span>)}
                {movie.runtime&&<span className="mtag" style={{display:"flex",alignItems:"center",gap:4}}>{I.clock} {fmtT(movie.runtime)}</span>}
                {movie.language&&<span className="mtag" style={{display:"flex",alignItems:"center",gap:4}}>{I.globe} {movie.language}</span>}
              </div>
              <p className="modal-desc">{movie.desc}</p>
              <div className="modal-ig">
                {movie.director&&<div><div className="m-igl">Director</div><div className="m-igv">{movie.director}</div></div>}
                {movie.country&&<div><div className="m-igl">Country</div><div className="m-igv">{movie.country}</div></div>}
                {movie.runtime&&<div><div className="m-igl">Runtime</div><div className="m-igv">{fmtT(movie.runtime)}</div></div>}
                {movie.language&&<div><div className="m-igl">Language</div><div className="m-igv">{movie.language}</div></div>}
                <div><div className="m-igl">Year</div><div className="m-igv">{movie.year}</div></div>

              </div>
              {movie.cast?.length>0&&(
                <><div style={{fontSize:11,fontWeight:700,letterSpacing:".1em",textTransform:"uppercase",color:"var(--t3)",marginBottom:8,fontFamily:"'JetBrains Mono',monospace"}}>Cast</div>
                <div className="modal-cast" style={{marginBottom:18}}>{movie.cast.map((c,i)=><span key={i} className="modal-cast-chip">{c}</span>)}</div></>
              )}
              <div className="modal-actions">
                <button className="btn bp" onClick={()=>{ onWatch(movie); onClose(); }}>{I.play} Watch Now</button>
                <button className="btn bo" onClick={()=>onDl(movie)}>{I.dl} Download</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ═══════ HERO ═══════ */
function Hero({movies,onMovieClick,onWatch}){
  const[idx,setIdx]=useState(0);const[prog,setProg]=useState(0);
  const items=useMemo(()=>{const f=movies.filter(m=>m.featured&&m.status!=="draft");return f.length?f:movies.filter(m=>m.status!=="draft").slice(0,4);},[movies]);
  useEffect(()=>{
    if(items.length<=1) return;
    setProg(0);const t1=setTimeout(()=>setProg(100),60);const t2=setTimeout(()=>{setIdx(i=>(i+1)%items.length);setProg(0);},5500);
    return()=>{clearTimeout(t1);clearTimeout(t2);};
  },[idx,items.length]);
  if(!items.length) return null;
  const cur=items[idx];
  return(
    <div className="hero">
      {items.map((m,i)=><div key={m.id} className={`hero-slide ${i===idx?"on":""}`}><img src={m.backdrop} alt={m.title} loading={i===0?"eager":"lazy"}/></div>)}
      <div className="hero-grain"/>
      <div className="hero-ov"/>
      <div className="hero-c">
        <div className="hero-badge"><span className="hero-badge-dot"/>Featured</div>
        <h1 className="hero-title">{cur.title}</h1>
        <div className="hero-meta">
          <span className="hero-m">{cur.year}</span>
          {cur.genres?.[0]&&<><span className="hero-sep"/><span className="hero-m">{cur.genres[0]}</span></>}
          {cur.runtime&&<><span className="hero-sep"/><span className="hero-m">{I.clock}&nbsp;{fmtT(cur.runtime)}</span></>}
          {cur.director&&<><span className="hero-sep"/><span className="hero-m">Dir. {cur.director}</span></>}
        </div>
        <p className="hero-desc">{cur.desc?.slice(0,145)}…</p>
        <div className="hero-acts">
          <button className="btn bp" onClick={()=>onWatch(cur)}>{I.play} Watch Now</button>
          <button className="btn bg" onClick={()=>onMovieClick(cur)}>More Info</button>
        </div>
      </div>
      {items.length>1&&(
        <>
          <div className="hero-dots">{items.map((_,i)=><div key={i} className={`hero-d ${i===idx?"on":""}`} onClick={()=>{setIdx(i);setProg(0);}}/>)}</div>
          <button className="hero-arr" style={{left:12}} onClick={()=>{setIdx(i=>(i-1+items.length)%items.length);setProg(0);}}>{I.left}</button>
          <button className="hero-arr" style={{right:12}} onClick={()=>{setIdx(i=>(i+1)%items.length);setProg(0);}}>{I.right}</button>
        </>
      )}
      <div className="hero-prog"><div className="hero-bar" style={{width:`${prog}%`}}/></div>
    </div>
  );
}

/* ═══════ TRENDING (TOP 5) ═══════ */
function Trending({movies,onWatch,onInfo}){
  const list=useMemo(()=>movies.filter(m=>m.trending&&m.status!=="draft").sort((a,b)=>(a.trendingRank||99)-(b.trendingRank||99)).slice(0,5),[movies]);
  if(!list.length) return null;
  return(
    <div className="sec">
      <div style={{marginBottom:22}}>
        <div className="eye">This Week</div>
        <div className="ttl">Top 5 Trending</div>
      </div>
      {list.map((m,i)=>(
        <div key={m.id} className="t-row" onClick={()=>onWatch(m)} role="button" tabIndex={0}
          onKeyDown={e=>e.key==="Enter"&&onWatch(m)}>
          <div className={`t-rank ${i<3?"top":""}`}>#{i+1}</div>
          <div className="t-thumb">
            <Img src={m.poster} alt={m.title} style={{width:"100%",height:"100%"}}/>
          </div>
          <div className="t-info">
            <div className="t-title">{m.title}</div>
            <div className="t-meta">
              <span>{m.year}</span>
              <span>·</span>
              <span>{m.genres?.[0]}</span>
              {m.runtime&&<><span>·</span><span style={{display:"flex",alignItems:"center",gap:3}}>{I.clock}{fmtT(m.runtime)}</span></>}
            </div>
          </div>
          {/* Quick actions — visible on hover via CSS */}
          <div style={{flexShrink:0,paddingRight:14,display:"flex",alignItems:"center",gap:7}}>
            <div style={{
              width:36,height:36,borderRadius:"50%",
              background:"var(--a)",color:"#07080F",
              display:"flex",alignItems:"center",justifyContent:"center",
              flexShrink:0,
            }}>
              <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor"><polygon points="5 3 19 12 5 21 5 3"/></svg>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

/* ═══════ HOME ═══════ */
function HomePage({movies,onMovieClick,onWatch,setPage}){
  const pub=useMemo(()=>movies.filter(m=>m.status!=="draft"),[movies]);
  const recent=useMemo(()=>[...pub].sort((a,b)=>b.year-a.year).slice(0,12),[pub]);
  const newMovies=useMemo(()=>pub.filter(m=>isNew(m)).slice(0,10),[pub]);
  const byGenre=useMemo(()=>{const o={};["Action","Sci-Fi","Drama","Comedy","Thriller","Romance","Horror"].forEach(g=>{const l=pub.filter(m=>m.genres?.includes(g)).slice(0,12);if(l.length) o[g]=l;});return o;},[pub]);
  return(
    <>
      <Hero movies={movies} onMovieClick={onMovieClick} onWatch={onWatch}/>
      <Trending movies={movies} onWatch={onWatch} onInfo={onMovieClick}/>
      <div className="mn-hr"/>

      {/* Movie of the Day */}
      <div className="sec" style={{paddingBottom:0}}>
        <div className="sh" style={{marginBottom:16}}>
          <div><div className="eye">Daily Pick</div><div className="ttl">Movie of the Day</div></div>
        </div>
        <MovieOfTheDay movies={movies} onWatch={onWatch}/>
      </div>
      <div className="mn-hr" style={{marginTop:32}}/>

      {/* New This Week */}
      {newMovies.length>0&&(
        <>
          <div className="sec">
            <div className="sh">
              <div><div className="eye">Just Added</div><div className="ttl">New This Week</div></div>
              <button className="view-all" onClick={()=>setPage("explorer")}>
                View All
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><polyline points="9 18 15 12 9 6"/></svg>
              </button>
            </div>
            <div className="mn-hrow">{newMovies.map(m=><MCard key={m.id} movie={m} onClick={onMovieClick}/>)}</div>
          </div>
          <div className="mn-hr"/>
        </>
      )}

      {/* Latest Releases */}
      <div className="sec">
        <div className="sh">
          <div><div className="eye">Fresh Picks</div><div className="ttl">Latest Releases</div></div>
          <button className="view-all" onClick={()=>setPage("explorer")}>
            View All
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><polyline points="9 18 15 12 9 6"/></svg>
          </button>
        </div>
        <div className="mn-grid">{recent.map(m=><MCard key={m.id} movie={m} onClick={onMovieClick} fullWidth/>)}</div>
      </div>

      {/* WhatsApp Channel Banner */}
      <div style={{paddingBottom:0}}>
        <WhatsAppChannelBanner/>
      </div>

      {/* Genre rows */}
      {Object.entries(byGenre).map(([g,list])=>(
        <div key={g}><div className="mn-hr"/>
          <div className="sec">
            <div className="sh">
              <div><div className="eye">Category</div><div className="ttl">{g}</div></div>
              <button className="view-all" onClick={()=>setPage("explorer")} style={{flexShrink:0}}>
                See more
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><polyline points="9 18 15 12 9 6"/></svg>
              </button>
            </div>
            <div className="mn-hrow">{list.map(m=><MCard key={m.id} movie={m} onClick={onMovieClick}/>)}</div>
          </div>
        </div>
      ))}
    </>
  );
}

/* ═══════ EXPLORER ═══════ */
function Explorer({movies,onMovieClick}){
  const[genre,setGenre]=useState("All");
  const pub=useMemo(()=>movies.filter(m=>m.status!=="draft"),[movies]);
  const filtered=useMemo(()=>genre==="All"?pub:pub.filter(m=>m.genres?.includes(genre)),[pub,genre]);
  return(
    <div className="sec">
      <div className="sh">
        <div>
          <div className="eye">Browse All</div>
          <div className="ttl">
            Explore Movies
            <span style={{
              marginLeft:10,fontSize:14,fontWeight:600,
              color:"var(--t3)",fontFamily:"'JetBrains Mono',monospace",
              verticalAlign:"middle",
            }}>({filtered.length})</span>
          </div>
        </div>
      </div>
      <div className="chips">
        {GENRES.map(g=>{
          const count=g==="All"?pub.length:pub.filter(m=>m.genres?.includes(g)).length;
          return(
            <button key={g} className={`chip ${genre===g?"on":""}`} onClick={()=>setGenre(g)}>
              {g}
              {count>0&&<span style={{
                marginLeft:5,fontSize:10,fontFamily:"'JetBrains Mono',monospace",
                opacity:.65,
              }}>{count}</span>}
            </button>
          );
        })}
      </div>
      {filtered.length===0
        ? <div className="empty">
            <div className="empty-i">
              <svg width="44" height="44" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><rect x="2" y="2" width="20" height="20" rx="2.18"/><line x1="7" y1="2" x2="7" y2="22"/><line x1="17" y1="2" x2="17" y2="22"/><line x1="2" y1="12" x2="22" y2="12"/></svg>
            </div>
            <p className="empty-t">No {genre} movies yet.</p>
            <p style={{fontSize:13,color:"var(--t3)",marginTop:6}}>
              <button className="btn bo sm" style={{marginTop:8}} onClick={()=>setGenre("All")}>Show all movies</button>
            </p>
          </div>
        : <div className="mn-grid">
            {filtered.map(m=><MCard key={m.id} movie={m} onClick={onMovieClick} fullWidth/>)}
          </div>
      }
    </div>
  );
}

/* ═══════ SEARCH ═══════ */
function SearchPage({movies,onMovieClick}){
  const[q,setQ]=useState("");
  const inputRef=useRef(null);
  const pub=useMemo(()=>movies.filter(m=>m.status!=="draft"),[movies]);
  const trending=useMemo(()=>pub.filter(m=>m.trending).sort((a,b)=>(a.trendingRank||99)-(b.trendingRank||99)).slice(0,4),[pub]);
  const res=useMemo(()=>{
    if(!q.trim()) return [];
    const lq=q.toLowerCase();
    return pub.filter(m=>
      m.title?.toLowerCase().includes(lq)||
      m.genres?.some(g=>g.toLowerCase().includes(lq))||
      String(m.year).includes(lq)||
      m.director?.toLowerCase().includes(lq)||
      m.cast?.some(c=>c.toLowerCase().includes(lq))
    );
  },[q,pub]);

  useEffect(()=>{ if(inputRef.current) inputRef.current.focus(); },[]);

  return(
    <div className="sec">
      <div className="sh"><div><div className="eye">Find Movies</div><div className="ttl">Search</div></div></div>
      <div className="srch-wrap">
        <span className="srch-ico">{I.search}</span>
        <input
          ref={inputRef}
          className="srch-in"
          placeholder="Search by title, director, cast, genre or year…"
          value={q}
          onChange={e=>setQ(e.target.value)}
        />
        {q&&(
          <button onClick={()=>setQ("")} style={{
            position:"absolute",right:14,top:"50%",transform:"translateY(-50%)",
            width:24,height:24,borderRadius:"50%",background:"var(--s3)",
            border:"none",cursor:"pointer",display:"flex",alignItems:"center",
            justifyContent:"center",color:"var(--t2)",transition:"all .2s",
          }}>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
          </button>
        )}
      </div>

      {q.trim()===""?(
        <>
          {/* Popular searches */}
          <div style={{marginBottom:20}}>
            <div style={{fontSize:12,fontWeight:700,letterSpacing:".1em",textTransform:"uppercase",color:"var(--t3)",marginBottom:12,fontFamily:"'JetBrains Mono',monospace"}}>Popular Searches</div>
            <div style={{display:"flex",gap:8,flexWrap:"wrap"}}>
              {["Action","Drama","Sci-Fi","2024","Christopher Nolan","Horror","Comedy","Thriller"].map(s=>(
                <button key={s} onClick={()=>setQ(s)} style={{
                  padding:"7px 16px",borderRadius:"100px",fontSize:13,fontWeight:600,
                  background:"var(--s2)",color:"var(--t2)",border:"1px solid var(--br)",
                  cursor:"pointer",transition:"all .2s",
                }}
                onMouseEnter={e=>{e.target.style.borderColor="var(--a)";e.target.style.color="var(--a)"}}
                onMouseLeave={e=>{e.target.style.borderColor="var(--br)";e.target.style.color="var(--t2)"}}
                >{s}</button>
              ))}
            </div>
          </div>
          {/* Trending now */}
          {trending.length>0&&(
            <div>
              <div style={{fontSize:12,fontWeight:700,letterSpacing:".1em",textTransform:"uppercase",color:"var(--t3)",marginBottom:14,fontFamily:"'JetBrains Mono',monospace"}}>Trending Now</div>
              <div className="mn-grid">
                {trending.map(m=><MCard key={m.id} movie={m} onClick={onMovieClick} fullWidth/>)}
              </div>
            </div>
          )}
        </>
      ):res.length===0?(
        <div className="empty">
          <div className="empty-i">
            <svg width="44" height="44" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/><line x1="8" y1="11" x2="14" y2="11"/></svg>
          </div>
          <p className="empty-t" style={{marginBottom:8}}>No results for "{q}"</p>
          <p style={{fontSize:13,color:"var(--t3)",marginBottom:16}}>Try a different keyword or browse all movies.</p>
          <button className="btn bo sm" onClick={()=>setQ("")}>Clear Search</button>
        </div>
      ):(
        <>
          <p style={{color:"var(--t2)",fontSize:13,marginBottom:18,fontWeight:600,display:"flex",alignItems:"center",gap:8}}>
            <span style={{color:"var(--a)",fontFamily:"'JetBrains Mono',monospace",fontWeight:700}}>{res.length}</span>
            result{res.length!==1?"s":""} for "<strong style={{color:"var(--tx)"}}>{q}</strong>"
          </p>
          <div className="mn-grid">
            {res.map(m=><MCard key={m.id} movie={m} onClick={onMovieClick} fullWidth/>)}
          </div>
        </>
      )}
    </div>
  );
}

/* ═══════ SETTINGS ═══════ */
function FavoritesPage({movies,onMovieClick}){
  const[favIds,setFavIds]=useState(getFavs);
  const favMovies=useMemo(()=>movies.filter(m=>favIds.includes(m.id)),[movies,favIds]);
  return(
    <div className="sec">
      <div className="sh">
        <div><div className="eye">My Collection</div><div className="ttl">Favorites</div></div>
      </div>
      {favMovies.length===0
        ? <div className="empty">
            <div className="empty-i">
              <svg width="44" height="44" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
              </svg>
            </div>
            <p className="empty-t" style={{marginBottom:8}}>No favorites yet.</p>
            <p style={{fontSize:13,color:"var(--t3)"}}>Tap the heart icon on any movie to save it here.</p>
          </div>
        : <div className="mn-grid">
            {favMovies.map(m=>(
              <MCard key={m.id} movie={m} onClick={onMovieClick} fullWidth
                onFavToggle={()=>setFavIds(getFavs())}
              />
            ))}
          </div>
      }
    </div>
  );
}

function Settings({dark,setDark}){
  /* ── profile state ── */
  const[profile,setProfileRaw]=useState(getProfile);
  const[editingProfile,setEditingProfile]=useState(false);
  const[profileForm,setProfileForm]=useState({...getProfile()});
  const avatarInputRef=useRef(null);

  /* ── theme state ── */
  const[themePrefs,setThemePrefsRaw]=useState(getThemePrefs);
  const favCount=getFavs().length;

  const saveP=p=>{setProfileRaw(p);saveProfile(p);};
  const saveT=t=>{setThemePrefsRaw(t);saveThemePrefs(t);};

  const changeAccent=idx=>{
    const t={...themePrefs,accentIdx:idx};
    saveT(t); applyAccent(idx);
  };
  const changeFont=idx=>{
    const t={...themePrefs,fontIdx:idx};
    saveT(t); applyFont(idx);
  };
  const changeScale=val=>{
    const t={...themePrefs,textScale:val};
    saveT(t); applyTextScale(val);
  };

  const handleAvatarFile=e=>{
    const file=e.target.files?.[0];
    if(!file) return;
    const reader=new FileReader();
    reader.onload=ev=>{
      const img=ev.target.result;
      setProfileForm(p=>({...p,avatarImg:img}));
    };
    reader.readAsDataURL(file);
  };

  const SectionLabel=({children})=>(
    <div className="settings-section-label">{children}</div>
  );

  return(
    <div className="sec" style={{maxWidth:600}}>
      <div className="sh">
        <div>
          <div className="eye">Preferences</div>
          <div className="ttl" style={{fontFamily:"var(--heading-font,'Clash Display',system-ui,sans-serif)",fontSize:28,fontWeight:700}}>Settings</div>
        </div>
      </div>

      {/* ════ PROFILE CARD ════ */}
      <SectionLabel>Profile</SectionLabel>
      {!editingProfile?(
        <div className="profile-card" style={{marginBottom:22}}>
          <div className="profile-avatar" onClick={()=>setEditingProfile(true)}>
            {profile.avatarImg
              ?<img src={profile.avatarImg} alt="avatar"/>
              :<span style={{fontSize:30}}>{profile.avatarText||"🎬"}</span>
            }
            <div className="profile-avatar-edit">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.2" strokeLinecap="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
            </div>
          </div>
          <div style={{flex:1,minWidth:0}}>
            <div className="profile-name">{profile.name||"Movie Fan"}</div>
            <div className="profile-handle">{profile.handle||"@moviefan"}</div>
            {profile.bio&&<div className="profile-bio">{profile.bio}</div>}
            <button className="btn bo sm" style={{marginTop:10}} onClick={()=>{setProfileForm({...profile});setEditingProfile(true);}}>
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
              Edit Profile
            </button>
          </div>
        </div>
      ):(
        /* Profile edit form */
        <div style={{background:"var(--s1)",borderRadius:16,border:"1px solid var(--br)",padding:22,marginBottom:22}}>
          <div style={{fontFamily:"'Clash Display',system-ui,sans-serif",fontSize:17,fontWeight:700,marginBottom:18}}>Edit Profile</div>

          {/* Avatar */}
          <div style={{display:"flex",alignItems:"center",gap:18,marginBottom:20}}>
            <div className="profile-avatar" style={{cursor:"default"}}>
              {profileForm.avatarImg
                ?<img src={profileForm.avatarImg} alt="avatar"/>
                :<span style={{fontSize:30}}>{profileForm.avatarText||"🎬"}</span>
              }
            </div>
            <div style={{display:"flex",flexDirection:"column",gap:9}}>
              <button className="btn bo sm" onClick={()=>avatarInputRef.current?.click()}>
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
                Upload Photo
              </button>
              <input ref={avatarInputRef} type="file" accept="image/*" style={{display:"none"}} onChange={handleAvatarFile}/>
              {profileForm.avatarImg&&(
                <button className="btn brd sm" onClick={()=>setProfileForm(p=>({...p,avatarImg:null}))}>Remove Photo</button>
              )}
              {!profileForm.avatarImg&&(
                <div style={{display:"flex",gap:6,flexWrap:"wrap"}}>
                  {["🎬","🍿","⭐","🎥","🎭","🦁","🚀","🔥"].map(em=>(
                    <button key={em} onClick={()=>setProfileForm(p=>({...p,avatarText:em}))}
                      style={{width:34,height:34,borderRadius:"50%",background:profileForm.avatarText===em?"var(--a)":"var(--s2)",border:`1px solid ${profileForm.avatarText===em?"var(--a)":"var(--br)"}`,cursor:"pointer",fontSize:18,display:"flex",alignItems:"center",justifyContent:"center"}}>
                      {em}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="fg">
            <label className="lbl">Display Name</label>
            <input className="inp" value={profileForm.name||""} onChange={e=>setProfileForm(p=>({...p,name:e.target.value}))} placeholder="Your name"/>
          </div>
          <div className="fg">
            <label className="lbl">Username / Handle</label>
            <input className="inp" value={profileForm.handle||""} onChange={e=>setProfileForm(p=>({...p,handle:e.target.value}))} placeholder="@yourhandle"/>
          </div>
          <div className="fg">
            <label className="lbl">Bio (optional)</label>
            <textarea className="inp" value={profileForm.bio||""} onChange={e=>setProfileForm(p=>({...p,bio:e.target.value}))} placeholder="Tell us about yourself…" style={{minHeight:70,resize:"vertical"}}/>
          </div>
          <div style={{display:"flex",gap:10,marginTop:4}}>
            <button className="btn bp sm" onClick={()=>{saveP(profileForm);setEditingProfile(false);}}>Save Profile</button>
            <button className="btn bo sm" onClick={()=>setEditingProfile(false)}>Cancel</button>
          </div>
        </div>
      )}

      {/* ════ APPEARANCE ════ */}
      <SectionLabel>Appearance</SectionLabel>
      <div style={{background:"var(--s1)",borderRadius:16,border:"1px solid var(--br)",padding:"18px 20px",marginBottom:22}}>

        {/* Dark / Light mode */}
        <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:18}}>
          <div style={{display:"flex",alignItems:"center",gap:13}}>
            <div className="settings-ico">{dark?I.moon:I.sun}</div>
            <div>
              <div style={{fontWeight:700,fontSize:15}}>{dark?"Dark Mode":"Light Mode"}</div>
              <div style={{fontSize:12.5,color:"var(--t2)",marginTop:2}}>Toggle appearance</div>
            </div>
          </div>
          <label className="tog"><input type="checkbox" checked={dark} onChange={e=>setDark(e.target.checked)}/><span className="trk"/></label>
        </div>

        {/* Accent color */}
        <div style={{marginBottom:18}}>
          <div style={{fontSize:13,fontWeight:700,marginBottom:10,display:"flex",alignItems:"center",justifyContent:"space-between"}}>
            <span>Accent Color</span>
            <span style={{
              fontSize:12,fontFamily:"'JetBrains Mono',monospace",fontWeight:700,
              padding:"3px 10px",borderRadius:"100px",
              background:ACCENT_COLORS[themePrefs.accentIdx||0]?.val+"22",
              color:ACCENT_COLORS[themePrefs.accentIdx||0]?.val,
              border:`1px solid ${ACCENT_COLORS[themePrefs.accentIdx||0]?.val}44`,
            }}>
              {ACCENT_COLORS[themePrefs.accentIdx||0]?.name}
            </span>
          </div>
          <div className="color-swatches">
            {ACCENT_COLORS.map((col,i)=>(
              <div key={col.name}
                className={`color-swatch${themePrefs.accentIdx===i?" active":""}`}
                style={{
                  background:col.val,
                  boxShadow:themePrefs.accentIdx===i?`0 0 0 3px var(--bg), 0 0 0 5px ${col.val}`:"none",
                }}
                title={col.name}
                onClick={()=>changeAccent(i)}
              >
                {themePrefs.accentIdx===i&&(
                  <svg style={{position:"absolute",inset:0,margin:"auto",display:"block",width:16,height:16}} viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3" strokeLinecap="round"><polyline points="20 6 9 17 4 12"/></svg>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Font style */}
        <div style={{marginBottom:18}}>
          <div style={{fontSize:13,fontWeight:700,marginBottom:10}}>Heading Font Style</div>
          <div className="font-options">
            {FONTS.map((f,i)=>(
              <button key={f.name}
                className={`font-opt${themePrefs.fontIdx===i?" active":""}`}
                style={{fontFamily:f.val}}
                onClick={()=>changeFont(i)}
              >
                {f.name}
              </button>
            ))}
          </div>
        </div>

        {/* Text scale */}
        <div>
          <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:10}}>
            <div style={{fontSize:13,fontWeight:700}}>Text Size</div>
            <span style={{
              fontSize:13,fontFamily:"'JetBrains Mono',monospace",fontWeight:700,
              padding:"3px 10px",borderRadius:"100px",
              background:"var(--ag)",color:"var(--a)",border:"1px solid var(--ab)",
            }}>{themePrefs.textScale||100}%</span>
          </div>
          {/* Live preview box */}
          <div style={{
            background:"var(--s2)",borderRadius:10,padding:"12px 16px",
            marginBottom:12,border:"1px solid var(--br)",
          }}>
            <div style={{
              fontFamily:"'Clash Display',system-ui,sans-serif",
              fontWeight:700,
              fontSize:(themePrefs.textScale||100)/100 * 18 + "px",
              color:"var(--tx)",marginBottom:3,transition:"font-size .2s ease",
            }}>Sample Heading</div>
            <div style={{
              fontSize:(themePrefs.textScale||100)/100 * 13 + "px",
              color:"var(--t2)",lineHeight:1.6,transition:"font-size .2s ease",
            }}>This is how body text looks at this size.</div>
          </div>
          <input type="range" className="size-slider" min="80" max="130" step="5"
            value={themePrefs.textScale||100}
            onChange={e=>changeScale(Number(e.target.value))}
          />
          <div style={{display:"flex",justifyContent:"space-between",marginTop:7,fontSize:11,color:"var(--t3)",fontFamily:"'JetBrains Mono',monospace"}}>
            <span>Small</span><span>Default</span><span>Large</span>
          </div>
        </div>
      </div>

      {/* ════ ACTIVITY ════ */}
      <SectionLabel>Your Activity</SectionLabel>
      <div style={{background:"var(--s1)",borderRadius:16,border:"1px solid var(--br)",overflow:"hidden",marginBottom:22}}>
        <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"15px 20px",borderBottom:"1px solid var(--br)"}}>
          <div style={{display:"flex",alignItems:"center",gap:13}}>
            <div className="settings-ico">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>
            </div>
            <div><div style={{fontWeight:700,fontSize:15}}>Saved Favorites</div><div style={{fontSize:12.5,color:"var(--t2)",marginTop:2}}>Movies you've hearted</div></div>
          </div>
          <span style={{fontFamily:"'Clash Display',system-ui,sans-serif",fontSize:22,fontWeight:700,color:"var(--a)"}}>{favCount}</span>
        </div>
        <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"15px 20px"}}>
          <div style={{display:"flex",alignItems:"center",gap:13}}>
            <div className="settings-ico">{I.film}</div>
            <div><div style={{fontWeight:700,fontSize:15}}>MovieNation</div><div style={{fontSize:12.5,color:"var(--t2)",marginTop:2}}>v6.0 — Final Edition</div></div>
          </div>
          <span style={{fontSize:11,fontWeight:700,letterSpacing:".08em",textTransform:"uppercase",color:"var(--t3)",fontFamily:"'JetBrains Mono',monospace"}}>v6.0</span>
        </div>
      </div>

      {/* ════ ABOUT ════ */}
      <SectionLabel>About</SectionLabel>
      <div style={{background:"var(--s1)",borderRadius:16,border:"1px solid var(--br)",padding:"18px 20px",marginBottom:22}}>
        <div style={{fontFamily:"'Clash Display',system-ui,sans-serif",fontSize:17,fontWeight:700,marginBottom:10}}>About MovieNation</div>
        <p style={{fontSize:13.5,color:"var(--t2)",lineHeight:1.78,marginBottom:14}}>
          Your ultimate destination for discovering, streaming, and downloading movies. External links only — no content is hosted directly on this site.
        </p>
        <div style={{display:"flex",gap:10,flexWrap:"wrap"}}>
          <button className="btn bo sm" onClick={()=>window.dispatchEvent(new CustomEvent("setPage",{detail:"privacy"}))}>Privacy Policy</button>
          <button className="btn bo sm" onClick={()=>window.dispatchEvent(new CustomEvent("setPage",{detail:"terms"}))}>Terms of Service</button>
        </div>
      </div>

      {/* ════ RESET / DANGER ════ */}
      <SectionLabel>Data</SectionLabel>
      <div style={{background:"rgba(248,113,113,.05)",borderRadius:16,border:"1px solid rgba(248,113,113,.15)",padding:"18px 20px",display:"flex",flexDirection:"column",gap:14}}>
        {favCount>0&&(
          <div>
            <div style={{fontWeight:700,fontSize:14,marginBottom:3,color:"var(--rd)"}}>Clear Favorites</div>
            <p style={{fontSize:12.5,color:"var(--t2)",marginBottom:10}}>Remove all {favCount} saved favorites.</p>
            <button className="btn brd sm" onClick={()=>{localStorage.removeItem("mn_favs");window.location.reload();}}>Clear Favorites</button>
          </div>
        )}
        <div>
          <div style={{fontWeight:700,fontSize:14,marginBottom:3,color:"var(--rd)"}}>Reset All Settings</div>
          <p style={{fontSize:12.5,color:"var(--t2)",marginBottom:10}}>Restore colors, fonts, and text size to defaults.</p>
          <button className="btn brd sm" onClick={()=>{
            localStorage.removeItem("mn_theme");localStorage.removeItem("mn_profile");
            ["mn-accent-override","mn-font-override","mn-scale-override"].forEach(id=>{
              const el=document.getElementById(id);
              if(el) el.textContent="";
            });
            applyAccent(0);applyFont(0);applyTextScale(100);
            setThemePrefsRaw({accentIdx:0,fontIdx:0,textScale:100});
            setProfileRaw(getProfile());
          }}>Reset Settings</button>
        </div>
      </div>
    </div>
  );
}

/* ═══════ LEGAL PAGES ═══════ */
function Privacy(){return(<div className="sec"><div className="legal"><h1>Privacy Policy</h1><div className="legal-dt">Last updated: March 2026</div><p>MovieNation is committed to protecting your privacy. This policy explains how we handle data.</p><h2>1. Information We Collect</h2><p>We do not require registration. No personal data is collected. Only local preferences (dark mode) are stored in your browser's localStorage and never leave your device.</p><h2>2. Usage Analytics</h2><p>We may collect anonymous, aggregated data to improve the platform. This data cannot identify you personally.</p><h2>3. Cookies</h2><p>We only use browser localStorage for your preferences. No tracking, advertising, or third-party cookies are used.</p><h2>4. External Links</h2><p>We provide links to third-party sites. We are not responsible for their privacy practices.</p><h2>5. Children's Privacy</h2><p>MovieNation is not directed at children under 13.</p><h2>6. Contact</h2><p>Questions? Reach us through our social media channels in the footer.</p></div></div>);}
function Terms(){return(<div className="sec"><div className="legal"><h1>Terms of Service</h1><div className="legal-dt">Last updated: March 2026</div><p>By using MovieNation, you agree to these Terms of Service.</p><h2>1. Acceptance</h2><p>By visiting MovieNation, you confirm you are at least 13 years old and agree to comply with these terms.</p><h2>2. Service Description</h2><p>MovieNation is a movie discovery platform providing information and external links for streaming and downloading. We do not host movie content directly.</p><h2>3. External Links</h2><p>Links to third-party services are provided as a convenience. We do not endorse or control their content.</p><h2>4. Permitted Use</h2><p>Personal, non-commercial use only. You agree not to use the platform for any unlawful purpose, attempt unauthorized access, or use bots to scrape content.</p><h2>5. Disclaimers</h2><p>MovieNation is provided "as is" without warranties. We do not guarantee uninterrupted or error-free service.</p><h2>6. Contact</h2><p>Reach us through our official social media channels.</p></div></div>);}

/* ═══════ ADMIN LOGIN ═══════ */
function AdminLogin({onLogin}){
  const[pw,setPw]=useState("");const[er,setEr]=useState(false);const[ld,setLd]=useState(false);
  const go=()=>{setLd(true);setTimeout(()=>{if(pw===ADMIN_PASS) onLogin();else{setEr(true);setLd(false);}},700);};
  return(<div className="login-wrap"><div className="login-card">
    <div style={{textAlign:"center",marginBottom:30}}>
      <div style={{width:64,height:64,borderRadius:16,background:"var(--a)",display:"flex",alignItems:"center",justifyContent:"center",margin:"0 auto 16px",color:"#fff"}}>{I.lock}</div>
      <h1 style={{fontFamily:"'Clash Display',system-ui,sans-serif",fontSize:28,fontWeight:900,letterSpacing:"-.03em",marginBottom:6}}>Admin Access</h1>
      <p style={{fontSize:13.5,color:"var(--t2)"}}>Enter your password to continue</p>
    </div>
    <div className="fg"><label className="lbl">Password</label><input className="inp" type="password" placeholder="Enter password…" value={pw} onChange={e=>{setPw(e.target.value);setEr(false);}} onKeyDown={e=>e.key==="Enter"&&go()} autoFocus/>
      {er&&<p style={{color:"var(--rd)",fontSize:12.5,marginTop:5,fontWeight:600}}>Incorrect password.</p>}
    </div>
    <button className="btn bp" style={{width:"100%",justifyContent:"center",padding:"13px"}} onClick={go} disabled={ld}>{ld?"Verifying…":"Sign In →"}</button>
  </div></div>);
}

/* ═══════ ADMIN PANEL ═══════ */

/* Admin icon set — all SVG, no emoji */
const AI = {
  dashboard:<svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>,
  movies:   <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><rect x="2" y="2" width="20" height="20" rx="2.18"/><line x1="7" y1="2" x2="7" y2="22"/><line x1="17" y1="2" x2="17" y2="22"/><line x1="2" y1="12" x2="22" y2="12"/><line x1="2" y1="7" x2="7" y2="7"/><line x1="2" y1="17" x2="7" y2="17"/><line x1="17" y1="17" x2="22" y2="17"/><line x1="17" y1="7" x2="22" y2="7"/></svg>,
  trending: <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/></svg>,
  importIc: <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>,
  notifIc:  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>,
  logIc:    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>,
  filmStat: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><rect x="2" y="2" width="20" height="20" rx="2.18"/><line x1="7" y1="2" x2="7" y2="22"/><line x1="17" y1="2" x2="17" y2="22"/><line x1="2" y1="12" x2="22" y2="12"/></svg>,
  eyeStat:  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>,
  dlStat:   <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>,
  checkStat:<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><circle cx="12" cy="12" r="10"/><polyline points="16.5 8 10.5 15 7.5 12"/></svg>,
  notifOk:  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><circle cx="12" cy="12" r="10"/><polyline points="16 8 10.5 15 8 12"/></svg>,
  notifDef: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>,
  trashSm:  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/><path d="M10 11v6M14 11v6"/></svg>,
  jsonDoc:  <svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="9" y1="13" x2="15" y2="13"/><line x1="9" y1="17" x2="12" y2="17"/></svg>,
  csvDoc:   <svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="8" y1="13" x2="16" y2="13"/><line x1="8" y1="17" x2="16" y2="17"/><line x1="8" y1="9" x2="10" y2="9"/></svg>,
  emptyBell:<svg width="42" height="42" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>,
  emptyLog: <svg width="42" height="42" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>,
  starSolid:<svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>,
  checkMark:<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><polyline points="20 6 9 17 4 12"/></svg>,
};

function AdminPanel({movies,setMovies,onLogout,showToast}){
  const[tab,setTab]=useState("dash");
  const[edit,setEdit]=useState(null);const[form,setForm]=useState(false);
  const[srch,setSrch]=useState("");
  const[notifs,setNotifs]=useState(getNf);
  const[log,setLog]=useState(getLog);

  /* ── 100% REAL data — computed live from localStorage ── */
  const pub     =useMemo(()=>movies.filter(m=>m.status==="published"),[movies]);
  const drafts  =useMemo(()=>movies.filter(m=>m.status==="draft"),[movies]);
  const totalV  =useMemo(()=>movies.reduce((s,m)=>s+(m.views||0),0),[movies]);
  const totalDl =useMemo(()=>movies.reduce((s,m)=>s+(m.dlClicks||0),0),[movies]);
  const topTrend=useMemo(()=>movies.filter(m=>m.trending).sort((a,b)=>(a.trendingRank||99)-(b.trendingRank||99))[0],[movies]);
  const topWatch=useMemo(()=>[...movies].sort((a,b)=>(b.views||0)-(a.views||0))[0],[movies]);
  const chartData=useMemo(()=>[...movies].sort((a,b)=>(b.views||0)-(a.views||0)).slice(0,8).map(m=>({n:m.title.length>12?m.title.slice(0,12)+"…":m.title,v:m.views||0,d:m.dlClicks||0})),[movies]);

  const filtered=useMemo(()=>{
    if(!srch.trim()) return movies;
    const q=srch.toLowerCase();
    return movies.filter(m=>
      m.title?.toLowerCase().includes(q)||
      m.director?.toLowerCase().includes(q)||
      String(m.year).includes(q)||
      m.slug?.includes(q)||
      m.genres?.some(g=>g.toLowerCase().includes(q))
    );
  },[movies,srch]);

  const del=id=>{
    if(!window.confirm("Delete this movie?")) return;
    const m=movies.find(x=>x.id===id);
    const u=movies.filter(x=>x.id!==id);
    setMovies(u,{type:"delete",id});LS.s("mn5m",u);addLog("Deleted",m?.title);setLog(getLog());
    showToast("Movie deleted");
  };
  const openF=(m=null)=>{setEdit(m);setForm(true);window.scrollTo({top:0,behavior:"smooth"});};
  const toggleT=id=>{
    const m=movies.find(x=>x.id===id);
    const max=movies.filter(x=>x.trending).length;
    const upd={...m,trending:!m.trending,trendingRank:m.trending?0:max+1};
    const u=movies.map(x=>x.id===id?upd:x);
    setMovies(u,{type:"edit",movie:upd});LS.s("mn5m",u);showToast(m.trending?"Removed from trending":"Marked as trending");
  };
  const toggleF=id=>{
    const updf=movies.find(x=>x.id===id);
    const updF={...updf,featured:!updf.featured};
    const u=movies.map(m=>m.id===id?updF:m);
    setMovies(u,{type:"edit",movie:updF});LS.s("mn5m",u);showToast("Featured updated");
  };

  const tabList=[
    {k:"dash",    l:"Dashboard",    i:AI.dashboard},
    {k:"movies",  l:"Movies",       i:AI.movies},
    {k:"trending",l:"Trending",     i:AI.trending},
    {k:"import",  l:"Import",       i:AI.importIc},
    {k:"notifs",  l:"Notifications",i:notifs.length>0
      ?<span style={{display:"flex",alignItems:"center",gap:3}}>{AI.notifIc}<span className="notif-badge">{notifs.length}</span></span>
      :AI.notifIc
    },
    {k:"actlog",  l:"Activity",     i:AI.logIc},
  ];

  return(<div className="sec">
    <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:26}}>
      <div>
        <div className="eye">Control Center</div>
        <div className="ttl" style={{fontFamily:"'Clash Display',system-ui,sans-serif",fontSize:26,fontWeight:900}}>Admin Panel</div>
      </div>
      <button className="btn bo sm" onClick={onLogout}>{I.logout} Logout</button>
    </div>

    <div className="atabs">
      {tabList.map(tb=>(
        <div key={tb.k} className={`atab ${tab===tb.k?"on":""}`} onClick={()=>setTab(tb.k)}>
          {tb.i}{tb.l}
        </div>
      ))}
    </div>

    {/* ══════ DASHBOARD — real live data ══════ */}
    {tab==="dash"&&(<>
      <div className="astats">
        {[
          {i:AI.filmStat,  v:movies.length,              l:"Total Movies"},
          {i:AI.eyeStat,   v:totalV.toLocaleString(),    l:"Total Streams"},
          {i:AI.dlStat,    v:totalDl.toLocaleString(),   l:"Downloads"},
          {i:AI.checkStat, v:pub.length,                 l:"Published"},
        ].map(s=>(
          <div key={s.l} className="astat">
            <div className="astat-i">{s.i}</div>
            <div className="astat-v">{s.v}</div>
            <div className="astat-l">{s.l}</div>
          </div>
        ))}
      </div>

      <div style={{display:"grid",gap:16,gridTemplateColumns:"1fr 1fr",marginBottom:20}}>
        {/* Streams chart */}
        <div style={{background:"var(--s1)",borderRadius:13,padding:18,border:"1px solid var(--br)"}}>
          <div style={{fontFamily:"'Clash Display',system-ui,sans-serif",fontSize:15,fontWeight:800,marginBottom:3}}>Streams per Movie</div>
          <div style={{fontSize:11.5,color:"var(--t3)",fontFamily:"'JetBrains Mono',monospace",marginBottom:14,letterSpacing:".03em"}}>
            Real-time · counts every Watch click
          </div>
          {chartData.every(d=>d.v===0)
            ? <div style={{textAlign:"center",padding:"36px 0",color:"var(--t3)",display:"flex",flexDirection:"column",alignItems:"center",gap:10}}>
                <div style={{opacity:.25}}>{AI.eyeStat}</div>
                <div style={{fontSize:13,fontWeight:600}}>No streams recorded yet</div>
                <div style={{fontSize:12}}>Streams appear here once users start watching</div>
              </div>
            : <ResponsiveContainer width="100%" height={200}>
                <BarChart data={chartData} margin={{top:0,right:0,bottom:0,left:-22}}>
                  <XAxis dataKey="n" tick={{fill:"var(--t2)",fontSize:9}} axisLine={false} tickLine={false}/>
                  <YAxis tick={{fill:"var(--t2)",fontSize:9}} axisLine={false} tickLine={false}/>
                  <Tooltip contentStyle={{background:"var(--s2)",border:"1px solid var(--br)",borderRadius:9,color:"var(--tx)",fontSize:11}}/>
                  <Bar dataKey="v" fill="#F59E0B" radius={[5,5,0,0]} name="Streams"/>
                </BarChart>
              </ResponsiveContainer>
          }
        </div>

        {/* Live stats table */}
        <div style={{background:"var(--s1)",borderRadius:13,padding:18,border:"1px solid var(--br)"}}>
          <div style={{fontFamily:"'Clash Display',system-ui,sans-serif",fontSize:15,fontWeight:800,marginBottom:14}}>Live Statistics</div>
          {[
            ["Total Movies",      movies.length],
            ["Published",         pub.length],
            ["Drafts",            drafts.length],
            ["Trending",          movies.filter(m=>m.trending).length],
            ["Featured",          movies.filter(m=>m.featured).length],
            ["Total Streams",     totalV.toLocaleString()],
            ["Total Downloads",   totalDl.toLocaleString()],
            ["Most Streamed",     topWatch?.title?.split(" ").slice(0,3).join(" ")||"—"],
            ["Trending #1",       topTrend?.title?.split(" ").slice(0,3).join(" ")||"—"],
          ].map(([l,v],i,a)=>(
            <div key={l} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"7px 0",borderBottom:i<a.length-1?"1px solid var(--br)":"none"}}>
              <span style={{fontSize:13,color:"var(--t2)",fontWeight:500}}>{l}</span>
              <span style={{fontSize:13.5,fontWeight:800,fontFamily:"'Clash Display',system-ui,sans-serif",color:"var(--tx)"}}>{String(v)}</span>
            </div>
          ))}
        </div>
      </div>

      {/* All movies ranked by streams */}
      <div style={{background:"var(--s1)",borderRadius:13,padding:20,border:"1px solid var(--br)"}}>
        <div style={{fontFamily:"'Clash Display',system-ui,sans-serif",fontSize:15,fontWeight:800,marginBottom:14,display:"flex",alignItems:"center",gap:8}}>
          {AI.eyeStat} All Movies — Stream & Download Counts
        </div>
        <div className="tblw">
          <table className="mn-tbl">
            <thead><tr><th>#</th><th>Movie</th><th>Year</th><th>Streams</th><th>Downloads</th><th>Status</th></tr></thead>
            <tbody>
              {[...movies].sort((a,b)=>(b.views||0)-(a.views||0)).map((m,i)=>(
                <tr key={m.id}>
                  <td style={{color:"var(--t3)",fontFamily:"'JetBrains Mono',monospace",fontSize:12}}>{i+1}</td>
                  <td style={{fontWeight:700,maxWidth:180,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{m.title}</td>
                  <td style={{color:"var(--t2)"}}>{m.year}</td>
                  <td style={{fontWeight:800,fontFamily:"'Clash Display',system-ui,sans-serif",color:m.views>0?"var(--a)":"var(--t3)"}}>{(m.views||0).toLocaleString()}</td>
                  <td style={{fontWeight:700,color:m.dlClicks>0?"var(--tx)":"var(--t3)"}}>{(m.dlClicks||0).toLocaleString()}</td>
                  <td><span style={{padding:"3px 9px",borderRadius:100,fontSize:11,fontWeight:700,background:m.status==="published"?"rgba(52,211,153,.12)":"rgba(129,140,248,.12)",color:m.status==="published"?"var(--gn)":"var(--ph)",fontFamily:"'JetBrains Mono',monospace"}}>{m.status||"published"}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>)}

    {/* ══════ MOVIES TAB ══════ */}
    {tab==="movies"&&(<>
      <div style={{display:"flex",gap:12,marginBottom:18,flexWrap:"wrap"}}>
        <div style={{flex:1,position:"relative",minWidth:200}}>
          <span style={{position:"absolute",left:14,top:"50%",transform:"translateY(-50%)",color:"var(--t2)"}}>{I.search}</span>
          <input className="inp" style={{paddingLeft:42}} placeholder="Search by title, director, genre, year, slug…" value={srch} onChange={e=>setSrch(e.target.value)}/>
        </div>
        <button className="btn bp sm" onClick={()=>openF()}>{I.plus} Add Movie</button>
      </div>

      {form&&<MForm movie={edit}
        onSave={m=>{
          let u; let hint;
          if(edit){u=movies.map(x=>x.id===m.id?m:x);hint={type:"edit",movie:m};}
          else{const nm={...m,id:Date.now().toString(),addedAt:todayS(),views:0,dlClicks:0};u=[nm,...movies];hint={type:"add",movie:nm};}
          setMovies(u,hint);LS.s("mn5m",u);setForm(false);setEdit(null);
          showToast(edit?"Movie updated!":"Movie added!");
          if(!edit){addNf("New movie published",m.title,"gn");setNotifs(getNf());}
          addLog(edit?"Edited":"Added",m.title);setLog(getLog());
        }}
        onCancel={()=>{setForm(false);setEdit(null);}}
      />}

      <p style={{fontSize:12,color:"var(--t3)",marginBottom:12,fontFamily:"'JetBrains Mono',monospace"}}>
        {filtered.length} movie{filtered.length!==1?"s":""}{srch?` matching "${srch}"`:" total"}
      </p>
      <div className="tblw">
        <table className="mn-tbl">
          <thead>
            <tr><th>Title</th><th>Year</th><th>Status</th><th>Streams</th><th>Downloads</th><th>Trending</th><th>Featured</th><th>Slug</th><th>Actions</th></tr>
          </thead>
          <tbody>
            {filtered.map(m=>(
              <tr key={m.id}>
                <td style={{fontWeight:700,maxWidth:150,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{m.title}</td>
                <td>{m.year}</td>
                <td><span style={{padding:"3px 9px",borderRadius:100,fontSize:11,fontWeight:700,background:m.status==="published"?"rgba(52,211,153,.12)":"rgba(129,140,248,.12)",color:m.status==="published"?"var(--gn)":"var(--ph)",fontFamily:"'JetBrains Mono',monospace"}}>{m.status||"published"}</span></td>
                <td style={{fontWeight:800,fontFamily:"'Clash Display',system-ui,sans-serif",color:m.views>0?"var(--a)":"var(--t3)"}}>{(m.views||0).toLocaleString()}</td>
                <td style={{fontWeight:700}}>{(m.dlClicks||0).toLocaleString()}</td>
                <td><label className="tog" style={{width:36,height:20}}><input type="checkbox" checked={!!m.trending} onChange={()=>toggleT(m.id)}/><span className="trk"/></label></td>
                <td><label className="tog" style={{width:36,height:20}}><input type="checkbox" checked={!!m.featured} onChange={()=>toggleF(m.id)}/><span className="trk"/></label></td>
                <td style={{fontSize:11,color:"var(--t3)",fontFamily:"'JetBrains Mono',monospace",maxWidth:110,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{m.slug}</td>
                <td><div style={{display:"flex",gap:7}}>
                  <button className="btn bo xs" onClick={()=>openF(m)}>{I.edit}</button>
                  <button className="btn brd xs" onClick={()=>del(m.id)}>{I.trash}</button>
                </div></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>)}

    {/* ══════ TRENDING CONTROL ══════ */}
    {tab==="trending"&&(<>
      <div style={{marginBottom:18}}>
        <div className="eye">Trending Control</div>
        <p style={{fontSize:13,color:"var(--t2)",marginTop:4}}>Manually set which movies appear in the Top 5 section. Use the rank number to order them (1 = first).</p>
      </div>
      {movies.map(m=>(
        <div key={m.id} style={{background:"var(--s1)",borderRadius:12,padding:"14px 16px",border:`1px solid ${m.trending?"var(--ab)":"var(--br)"}`,marginBottom:10,display:"flex",alignItems:"center",gap:12,transition:"border-color .2s"}}>
          <div style={{width:44,height:62,borderRadius:7,overflow:"hidden",flexShrink:0}}><Img src={m.poster} alt={m.title} style={{width:"100%",height:"100%"}}/></div>
          <div style={{flex:1,minWidth:0}}>
            <div style={{fontWeight:700,fontSize:14,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{m.title}</div>
            <div style={{fontSize:12,color:"var(--t2)",fontFamily:"'JetBrains Mono',monospace",marginTop:2}}>{m.year} · {m.genres?.[0]||"—"}</div>
            {m.trending&&<div style={{fontSize:11.5,color:"var(--a)",fontWeight:700,marginTop:4,display:"flex",alignItems:"center",gap:5}}>{AI.starSolid} Trending #{m.trendingRank||"—"}</div>}
          </div>
          <div style={{display:"flex",gap:8,alignItems:"center",flexShrink:0}}>
            {m.trending&&(
              <input type="number" min="1" max="5" value={m.trendingRank||1}
                onChange={e=>{const updr={...m,trendingRank:Number(e.target.value)};const u=movies.map(x=>x.id===m.id?updr:x);setMovies(u,{type:"edit",movie:updr});LS.s("mn5m",u);}}
                style={{width:46,padding:"6px 8px",borderRadius:7,background:"var(--s2)",border:"1px solid var(--br)",color:"var(--tx)",fontSize:13,fontWeight:700,outline:"none",textAlign:"center"}}
              />
            )}
            <button className={`btn sm ${m.trending?"bgn":"bo"}`} onClick={()=>toggleT(m.id)}>
              {m.trending
                ?<>{AI.checkMark} Trending</>
                :<>{AI.trending} Set Trending</>
              }
            </button>
            <button className={`btn sm ${m.featured?"bp":"bo"}`} onClick={()=>toggleF(m.id)}>
              {m.featured?<>{AI.starSolid} Featured</> : <>Feature</>}
            </button>
          </div>
        </div>
      ))}
    </>)}

    {/* ══════ IMPORT ══════ */}
    {tab==="import"&&(<>
      <div style={{marginBottom:20}}>
        <div className="eye">Bulk Import</div>
        <div className="ttl" style={{fontFamily:"'Clash Display',system-ui,sans-serif",fontSize:22,fontWeight:900,marginBottom:6}}>Import Movies</div>
        <p style={{fontSize:13,color:"var(--t2)"}}>Upload a JSON or CSV file to add multiple movies at once. Streams and downloads always start at 0 for imported movies.</p>
      </div>
      <div style={{display:"grid",gap:14,gridTemplateColumns:"1fr 1fr",marginBottom:24}}>
        {[
          {l:"Import JSON",ext:".json",ico:AI.jsonDoc,d:"Array of movie objects"},
          {l:"Import CSV", ext:".csv", ico:AI.csvDoc, d:"Spreadsheet with columns"},
        ].map(f=>(
          <div key={f.l} style={{background:"var(--s1)",borderRadius:13,border:"1px solid var(--br)",padding:28,textAlign:"center",cursor:"pointer",transition:"all .22s"}}
            onMouseEnter={e=>{e.currentTarget.style.borderColor="var(--a)";e.currentTarget.style.background="var(--s2)";}}
            onMouseLeave={e=>{e.currentTarget.style.borderColor="var(--br)";e.currentTarget.style.background="var(--s1)";}}
            onClick={()=>{
              const inp=document.createElement("input");inp.type="file";inp.accept=f.ext;
              inp.onchange=async e=>{
                const file=e.target.files[0];if(!file) return;
                const text=await file.text();
                try{
                  let parsed=[];
                  if(f.ext===".json"){parsed=JSON.parse(text);if(!Array.isArray(parsed)) parsed=[parsed];}
                  else{const lines=text.split("\n").filter(l=>l.trim());const hdrs=lines[0].split(",").map(h=>h.trim().replace(/"/g,""));parsed=lines.slice(1).map(l=>{const vals=l.split(",").map(v=>v.trim().replace(/"/g,""));const o={};hdrs.forEach((h,i)=>o[h]=vals[i]||"");if(o.genres) o.genres=o.genres.split("|");if(o.cast) o.cast=o.cast.split("|");return o;});}
                  const imported=parsed.map(m=>({...m,id:m.id||Date.now()+Math.random().toString(36).slice(2),status:m.status||"published",slug:m.slug||slugify(m.title||""),views:0,dlClicks:0,year:Number(m.year)||new Date().getFullYear(),runtime:Number(m.runtime)||0,genres:Array.isArray(m.genres)?m.genres:(m.genres?[m.genres]:[]),cast:Array.isArray(m.cast)?m.cast:(m.cast?[m.cast]:[]),addedAt:todayS()}));
                  const u=[...imported,...movies];setMovies(u,{type:"bulk"});LS.s("mn5m",u);
                  showToast(`${imported.length} movie${imported.length!==1?"s":""} imported!`);
                  addNf(`${imported.length} movies imported`,"Bulk import completed","gn");setNotifs(getNf());
                  addLog(`Imported ${imported.length} movies`,"Bulk");setLog(getLog());
                }catch{showToast("Import failed: check your file format");}
              };
              inp.click();
            }}>
            <div style={{color:"var(--a)",display:"flex",justifyContent:"center",marginBottom:12}}>{f.ico}</div>
            <div style={{fontFamily:"'Clash Display',system-ui,sans-serif",fontSize:16,fontWeight:800,marginBottom:6}}>{f.l}</div>
            <div style={{fontSize:12.5,color:"var(--t2)"}}>{f.d}</div>
          </div>
        ))}
      </div>
      <div style={{background:"var(--s2)",borderRadius:12,padding:18,border:"1px solid var(--br)"}}>
        <div style={{fontSize:11,fontWeight:700,color:"var(--a)",marginBottom:10,fontFamily:"'JetBrains Mono',monospace",letterSpacing:".1em"}}>JSON FORMAT EXAMPLE</div>
        <pre style={{fontSize:11,color:"var(--t2)",fontFamily:"'JetBrains Mono',monospace",overflow:"auto",whiteSpace:"pre-wrap",lineHeight:1.6}}>{`[
  {
    "title": "Movie Title",
    "year": 2024,
    "genres": ["Action", "Drama"],
    "director": "Director Name",
    "cast": ["Actor 1", "Actor 2"],
    "runtime": 120,
    "language": "English",
    "country": "USA",
    "desc": "Movie description...",
    "poster": "https://your-cdn.com/poster.jpg",
    "backdrop": "https://your-cdn.com/backdrop.jpg",
    "watchUrl": "https://your-streaming-link.com",
    "downloadUrl": "https://your-download-link.com",
    "trailerUrl": "https://youtube.com/watch?v=..."
  }
]`}</pre>
      </div>
    </>)}

    {/* ══════ NOTIFICATIONS ══════ */}
    {tab==="notifs"&&(<>
      <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:20}}>
        <div style={{fontFamily:"'Clash Display',system-ui,sans-serif",fontSize:20,fontWeight:800}}>Notifications</div>
        {notifs.length>0&&(
          <button className="btn bo sm" onClick={()=>{setNotifs([]);saveNf([]);}}>{AI.trashSm} Clear All</button>
        )}
      </div>
      {notifs.length===0
        ?<div className="empty"><div style={{opacity:.2,marginBottom:14,display:"flex",justifyContent:"center"}}>{AI.emptyBell}</div><p className="empty-t">No notifications yet.</p><p style={{fontSize:13,color:"var(--t3)",marginTop:6}}>Notifications appear when movies are added or imported.</p></div>
        :notifs.map(n=>(
          <div key={n.id} className={`notif ${n.tp==="gn"?"gn":n.tp==="rd"?"rd":""}`}>
            <div style={{color:n.tp==="gn"?"var(--gn)":"var(--a)",flexShrink:0}}>{n.tp==="gn"?AI.notifOk:AI.notifDef}</div>
            <div style={{flex:1}}><div className="n-ttl">{n.ti}</div><div className="n-sub">{n.su}</div></div>
            <div className="n-time">{n.t}</div>
          </div>
        ))
      }
    </>)}

    {/* ══════ ACTIVITY LOG ══════ */}
    {tab==="actlog"&&(<>
      <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:20}}>
        <div style={{fontFamily:"'Clash Display',system-ui,sans-serif",fontSize:20,fontWeight:800}}>Activity Log</div>
        <button className="btn bo sm" onClick={()=>{LS.s("mn5log",[]);setLog([]);}}>{AI.trashSm} Clear Log</button>
      </div>
      {log.length===0
        ?<div className="empty"><div style={{opacity:.2,marginBottom:14,display:"flex",justifyContent:"center"}}>{AI.emptyLog}</div><p className="empty-t">No activity yet.</p><p style={{fontSize:13,color:"var(--t3)",marginTop:6}}>Every add, edit, delete and import is logged here.</p></div>
        :log.map(l=>(
          <div key={l.id} className="log-row">
            <div className="log-dot"/>
            <div className="log-txt"><strong>{l.a}</strong>{l.m?` — ${l.m}`:""}</div>
            <div className="log-time">{l.d} · {l.t}</div>
          </div>
        ))
      }
    </>)}
  </div>);
}
/* ═══════ MOVIE FORM ═══════ */
function MForm({movie,onSave,onCancel}){
  const[f,setF]=useState({id:movie?.id||"",title:movie?.title||"",year:movie?.year||new Date().getFullYear(),genres:movie?.genres?.join(", ")||"",desc:movie?.desc||"",director:movie?.director||"",cast:movie?.cast?.join(", ")||"",runtime:movie?.runtime||"",language:movie?.language||"English",country:movie?.country||"",poster:movie?.poster||"",backdrop:movie?.backdrop||"",watchUrl:movie?.watchUrl||"",downloadUrl:movie?.downloadUrl||"",trailerUrl:movie?.trailerUrl||"",featured:movie?.featured||false,trending:movie?.trending||false,trendingRank:movie?.trendingRank||0,status:movie?.status||"published",slug:movie?.slug||"",views:movie?.views||0,dlClicks:movie?.dlClicks||0,seo:{title:movie?.seo?.title||"",desc:movie?.seo?.desc||"",keys:movie?.seo?.keys||""}});
  const set=(k,v)=>setF(p=>({...p,[k]:v}));
  const setSeo=(k,v)=>setF(p=>({...p,seo:{...p.seo,[k]:v}}));
  useEffect(()=>{if(!movie) setF(p=>({...p,slug:slugify(p.title)}));},[f.title]);
  const save=st=>{if(!f.title.trim()){alert("Title required");return;}onSave({...f,status:st||f.status,year:Number(f.year),runtime:Number(f.runtime)||0,trendingRank:Number(f.trendingRank)||0,views:Number(f.views)||0,dlClicks:Number(f.dlClicks)||0,genres:f.genres.split(",").map(g=>g.trim()).filter(Boolean),cast:f.cast.split(",").map(c=>c.trim()).filter(Boolean),slug:f.slug||slugify(f.title)});};
  const row2=(a,b)=><div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:14}}>{a}{b}</div>;
  return(
    <div style={{background:"var(--s1)",borderRadius:14,padding:24,border:"1px solid var(--br)",marginBottom:22}}>
      <div style={{fontFamily:"'Clash Display',system-ui,sans-serif",fontSize:20,fontWeight:900,marginBottom:20}}>{movie?"Edit Movie":"Add Movie"}</div>
      <div className="fg"><label className="lbl">Title *</label><input className="inp" value={f.title} onChange={e=>set("title",e.target.value)}/></div>
      <div className="fg"><label className="lbl">URL Slug (Auto)</label><div style={{display:"flex",gap:8}}><input className="inp" value={f.slug} onChange={e=>set("slug",e.target.value)} style={{fontFamily:"'JetBrains Mono',monospace",fontSize:12.5}}/><button className="btn bo sm" onClick={()=>set("slug",slugify(f.title))} style={{flexShrink:0}}>↺</button></div>{f.slug&&<div style={{fontSize:11,color:"var(--t3)",marginTop:3,fontFamily:"'JetBrains Mono',monospace"}}>/movies/{f.slug}</div>}</div>
      {row2(<div className="fg"><label className="lbl">Year</label><input className="inp" type="number" value={f.year} onChange={e=>set("year",e.target.value)}/></div>,<div className="fg"><label className="lbl">Runtime (mins)</label><input className="inp" type="number" value={f.runtime} onChange={e=>set("runtime",e.target.value)}/></div>)}
      {row2(<div className="fg"><label className="lbl">Director</label><input className="inp" value={f.director} onChange={e=>set("director",e.target.value)}/></div>,<div className="fg"><label className="lbl">Language</label><input className="inp" value={f.language} onChange={e=>set("language",e.target.value)}/></div>)}
      {row2(<div className="fg"><label className="lbl">Country</label><input className="inp" value={f.country} onChange={e=>set("country",e.target.value)}/></div>,<div className="fg"><label className="lbl">Genres (comma sep)</label><input className="inp" placeholder="Action, Drama" value={f.genres} onChange={e=>set("genres",e.target.value)}/></div>)}
      <div className="fg"><label className="lbl">Cast (comma sep)</label><input className="inp" placeholder="Actor 1, Actor 2" value={f.cast} onChange={e=>set("cast",e.target.value)}/></div>
      <div className="fg"><label className="lbl">Description</label><textarea className="inp" value={f.desc} onChange={e=>set("desc",e.target.value)}/></div>
      {row2(<div className="fg"><label className="lbl">Poster URL</label><input className="inp" type="url" value={f.poster} onChange={e=>set("poster",e.target.value)}/></div>,<div className="fg"><label className="lbl">Backdrop URL</label><input className="inp" type="url" value={f.backdrop} onChange={e=>set("backdrop",e.target.value)}/></div>)}
      {row2(<div className="fg"><label className="lbl">Watch URL</label><input className="inp" type="url" value={f.watchUrl} onChange={e=>set("watchUrl",e.target.value)}/></div>,<div className="fg"><label className="lbl">Download URL</label><input className="inp" type="url" value={f.downloadUrl} onChange={e=>set("downloadUrl",e.target.value)}/></div>)}
      <div className="fg"><label className="lbl">Trailer URL (YouTube)</label><input className="inp" type="url" placeholder="https://youtube.com/watch?v=..." value={f.trailerUrl} onChange={e=>set("trailerUrl",e.target.value)}/></div>
      {[{k:"featured",l:"Featured (Hero Banner)"},{k:"trending",l:"Mark as Trending"}].map(r=>(<div key={r.k} className="fg" style={{display:"flex",alignItems:"center",gap:12}}><label className="tog"><input type="checkbox" checked={!!f[r.k]} onChange={e=>set(r.k,e.target.checked)}/><span className="trk"/></label><span style={{fontSize:14,fontWeight:600}}>{r.l}</span></div>))}
      {f.trending&&<div className="fg"><label className="lbl">Trending Rank (1–5)</label><input className="inp" type="number" min="1" max="5" value={f.trendingRank} onChange={e=>set("trendingRank",e.target.value)} style={{width:90}}/></div>}
      <div className="seo-box"><div className="seo-ttl">SEO Settings</div>
        <div className="fg"><label className="lbl">SEO Title</label><input className="inp" placeholder="Movie Title (2024) | MovieNation" value={f.seo.title} onChange={e=>setSeo("title",e.target.value)}/></div>
        <div className="fg"><label className="lbl">SEO Description</label><textarea className="inp" style={{minHeight:56}} value={f.seo.desc} onChange={e=>setSeo("desc",e.target.value)}/></div>
        <div className="fg" style={{marginBottom:0}}><label className="lbl">Keywords</label><input className="inp" placeholder="movie, action, 2024" value={f.seo.keys} onChange={e=>setSeo("keys",e.target.value)}/></div>
      </div>
      {movie&&row2(<div className="fg" style={{marginTop:14}}><label className="lbl">Views (override)</label><input className="inp" type="number" value={f.views} onChange={e=>set("views",e.target.value)}/></div>,<div className="fg" style={{marginTop:14}}><label className="lbl">Downloads (override)</label><input className="inp" type="number" value={f.dlClicks} onChange={e=>set("dlClicks",e.target.value)}/></div>)}
      <div style={{display:"flex",gap:10,marginTop:18,flexWrap:"wrap"}}>
        <button className="btn bp sm" onClick={()=>save("published")}>{I.play} Publish Now</button>
        <button className="btn bo sm" onClick={()=>save("draft")}><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/><polyline points="17 21 17 13 7 13 7 21"/><polyline points="7 3 7 8 15 8"/></svg> Save Draft</button>
        <button className="btn bo sm" onClick={onCancel}>Cancel</button>
      </div>
    </div>
  );
}

/* ═══════ NAV ═══════ */
function Nav({page,setPage,dark,setDark}){
  const favCount = getFavs().length;
  const profile = getProfile();
  const navItems=[
    {k:"home",    l:"Movies",    i:I.home},
    {k:"search",  l:"Search",    i:I.search},
    {k:"explorer",l:"Explorer",  i:I.compass},
    {k:"favs",    l:"Favorites", i:<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>},
    {k:"settings",l:"Settings",  i:I.settings},
  ];
  const bnavItems = navItems.filter(n=>n.k!=="settings"); // 4 items for bottom nav
  return(<>
    <nav className="nav">
      <div className="nav-logo" onClick={()=>setPage("home")}>
        <img src="/favicon.png" alt="MN" onError={e=>e.target.style.display="none"}/>
        <div className="nav-logo-txt">Movie<b>Nation</b></div>
      </div>
      <div className="nav-links">
        {navItems.map(n=>(
          <button key={n.k} className={`nav-item ${page===n.k?"on":""}`} onClick={()=>setPage(n.k)}>
            <span style={{position:"relative"}}>
              {n.i}
              {n.k==="favs"&&favCount>0&&(
                <span style={{position:"absolute",top:-4,right:-6,background:"var(--a)",color:"#07080F",fontSize:9,fontWeight:800,width:14,height:14,borderRadius:"50%",display:"flex",alignItems:"center",justifyContent:"center",fontFamily:"'JetBrains Mono',monospace"}}>{favCount}</span>
              )}
            </span>
            {n.l}
          </button>
        ))}
      </div>
      <div className="nav-r">
        <button className="theme-btn" onClick={()=>setDark(!dark)} title="Toggle theme">{dark?I.sun:I.moon}</button>
        {/* Profile avatar */}
        <div onClick={()=>setPage("settings")} title="Settings & Profile" style={{
          width:34,height:34,borderRadius:"50%",
          background:"var(--s2)",border:"2px solid var(--ab)",
          display:"flex",alignItems:"center",justifyContent:"center",
          cursor:"pointer",overflow:"hidden",flexShrink:0,transition:"all .22s",
          fontSize:16,
        }}
        onMouseEnter={e=>{e.currentTarget.style.borderColor="var(--a)";e.currentTarget.style.transform="scale(1.08)"}}
        onMouseLeave={e=>{e.currentTarget.style.borderColor="var(--ab)";e.currentTarget.style.transform="scale(1)"}}>
          {profile.avatarImg
            ?<img src={profile.avatarImg} alt="profile" style={{width:"100%",height:"100%",objectFit:"cover"}}/>
            :<span>{profile.avatarText||"🎬"}</span>
          }
        </div>
      </div>
    </nav>
    <nav className="bnav">
      {bnavItems.map(n=>(
        <button key={n.k} className={`bnav-item ${page===n.k?"on":""}`} onClick={()=>setPage(n.k)}>
          <span style={{position:"relative"}}>
            {n.i}
            {n.k==="favs"&&favCount>0&&(
              <span style={{position:"absolute",top:-5,right:-7,background:"var(--a)",color:"#07080F",fontSize:8,fontWeight:800,width:13,height:13,borderRadius:"50%",display:"flex",alignItems:"center",justifyContent:"center"}}>{favCount}</span>
            )}
          </span>
          <span>{n.l}</span>
        </button>
      ))}
    </nav>
  </>);
}

/* ═══════ FOOTER ═══════ */
/* PWA Install hook */
function useInstallPrompt(){
  const[prompt,setPrompt]=useState(null);
  const[installed,setInstalled]=useState(false);
  useEffect(()=>{
    // Register service worker
    if("serviceWorker" in navigator){
      navigator.serviceWorker.register("/sw.js").catch(()=>{});
    }
    const handler=e=>{e.preventDefault();setPrompt(e);};
    window.addEventListener("beforeinstallprompt",handler);
    window.addEventListener("appinstalled",()=>{setInstalled(true);setPrompt(null);});
    return()=>window.removeEventListener("beforeinstallprompt",handler);
  },[]);
  const install=async()=>{
    if(!prompt){
      // Fallback: guide user manually
      const ua=navigator.userAgent.toLowerCase();
      if(/iphone|ipad/.test(ua)){
        alert("To install:\n1. Tap the Share button (box with arrow)\n2. Scroll down and tap \"Add to Home Screen\"\n3. Tap Add");
      } else if(/android/.test(ua)){
        alert("To install:\n1. Tap the three-dot menu in your browser\n2. Tap \"Add to Home screen\" or \"Install app\"");
      } else {
        alert("To install on desktop:\n1. Look for the install icon (⊕) in your browser address bar\n2. Click it and follow the prompt");
      }
      return;
    }
    prompt.prompt();
    const{outcome}=await prompt.userChoice;
    if(outcome==="accepted") setInstalled(true);
    setPrompt(null);
  };
  return{install,installed,canInstall:!!prompt};
}

function Footer({setPage}){
  const{install,installed,canInstall}=useInstallPrompt();
  const year=new Date().getFullYear();
  const socs=[
    {i:<SocialIcons.Instagram size={17}/>,u:"https://instagram.com",l:"Instagram",bg:"linear-gradient(135deg,#f09433,#dc2743,#bc1888)",fg:"#fff"},
    {i:<SocialIcons.YouTube size={17}/>,u:"https://youtube.com",l:"YouTube",bg:"#FF0000",fg:"#fff"},
    {i:<SocialIcons.Twitter size={17}/>,u:"https://x.com",l:"X",bg:"#000000",fg:"#fff"},
    {i:<SocialIcons.Facebook size={17}/>,u:"https://facebook.com",l:"Facebook",bg:"#1877F2",fg:"#fff"},
    {i:<SocialIcons.WhatsApp size={17}/>,u:"https://whatsapp.com",l:"WhatsApp",bg:"#25D366",fg:"#fff"},
    {i:<SocialIcons.TikTok size={17}/>,u:"https://tiktok.com",l:"TikTok",bg:"#010101",fg:"#fff"},
  ];
  return(
    <footer className="footer">
      <div className="footer-in">
        <div className="footer-top">
          {/* Brand col */}
          <div>
            <div className="footer-logo">
              <img src="/favicon.png" alt="MN" style={{width:30,height:30,borderRadius:8}} onError={e=>e.target.style.display="none"}/>
              Movie<b>Nation</b>
            </div>
            <p className="footer-desc">
              Your ultimate destination for discovering, streaming, and downloading movies across all genres worldwide. Free, fast, and beautifully designed.
            </p>
            {/* Social icons */}
            <div className="footer-socs">
              {socs.map(s=>(
                <a key={s.l} href={s.u} target="_blank" rel="noopener noreferrer"
                  className="fsoc" title={s.l}
                  onMouseEnter={e=>{
                    e.currentTarget.style.background=s.bg;
                    e.currentTarget.style.color=s.fg;
                    e.currentTarget.style.borderColor="transparent";
                  }}
                  onMouseLeave={e=>{
                    e.currentTarget.style.background="var(--s2)";
                    e.currentTarget.style.color="var(--t2)";
                    e.currentTarget.style.borderColor="var(--br)";
                  }}>
                  {s.i}
                </a>
              ))}
            </div>
            {/* Install button */}
            <button className="footer-install" onClick={install} style={{
              background:installed?"rgba(52,211,153,.1)":"var(--s2)",
              borderColor:installed?"rgba(52,211,153,.3)":"var(--br)",
              color:installed?"var(--gn)":"var(--tx)",
            }}>
              {installed
                ? <><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><polyline points="20 6 9 17 4 12"/></svg> Installed</>
                : <><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg> {canInstall?"Install App":"Add to Home Screen"}</>
              }
            </button>
          </div>

          {/* Navigate */}
          <div>
            <div className="footer-col-t">Navigate</div>
            <div className="footer-lnks">
              {[["home","Movies"],["explorer","Explore"],["search","Search"],["favs","Favorites"],["settings","Settings"]].map(([k,l])=>(
                <span key={k} className="footer-lnk" onClick={()=>setPage(k)}>{l}</span>
              ))}
            </div>
          </div>

          {/* Genres */}
          <div>
            <div className="footer-col-t">Genres</div>
            <div className="footer-lnks">
              {["Action","Drama","Comedy","Sci-Fi","Thriller","Romance","Horror","Animation"].map(g=>(
                <span key={g} className="footer-lnk" onClick={()=>setPage("explorer")}>{g}</span>
              ))}
            </div>
          </div>

          {/* Legal */}
          <div>
            <div className="footer-col-t">Company</div>
            <div className="footer-lnks">
              <span className="footer-lnk" onClick={()=>setPage("settings")}>About Us</span>
              <span className="footer-lnk" onClick={()=>setPage("privacy")}>Privacy Policy</span>
              <span className="footer-lnk" onClick={()=>setPage("terms")}>Terms of Service</span>
              <span className="footer-lnk">Contact Us</span>
              <span className="footer-lnk">Advertise</span>
            </div>
          </div>
        </div>

        <div className="footer-bot">
          <span className="footer-copy">© {year} MovieNation. All rights reserved. Made with ♥</span>
          <div className="footer-legal">
            <a onClick={()=>setPage("privacy")}>Privacy</a>
            <a onClick={()=>setPage("terms")}>Terms</a>
            <a onClick={()=>setPage("settings")}>About</a>
          </div>
        </div>
      </div>
    </footer>
  );
}

/* ═══════ BACK TO TOP ═══════ */
/* ═══════ COOKIE CONSENT ═══════ */
function CookieBanner({setPage}){
  const[visible,setVisible]=useState(()=>!localStorage.getItem("mn_cookie"));
  const[leaving,setLeaving]=useState(false);

  if(!visible) return null;

  const dismiss=(choice)=>{
    localStorage.setItem("mn_cookie", choice);
    setLeaving(true);
    setTimeout(()=>setVisible(false), 320);
  };

  return(
    <div className="cookie-wrap">
      <div className={`cookie-banner${leaving?" leaving":""}`}>
        <div className="cookie-icon">🍪</div>
        <div className="cookie-text">
          <div className="cookie-title">We use cookies</div>
          <div className="cookie-desc">
            We use cookies to improve your experience, remember your preferences, and analyse site traffic.{" "}
            <a onClick={()=>{setPage("privacy");dismiss("accepted");}}>Learn more</a>
          </div>
        </div>
        <div className="cookie-btns">
          <button className="cookie-accept" onClick={()=>dismiss("accepted")}>Accept</button>
          <button className="cookie-decline" onClick={()=>dismiss("declined")}>Decline</button>
        </div>
      </div>
    </div>
  );
}


/* ═══════════════════════════════════════
   MOVIE OF THE DAY
═══════════════════════════════════════ */
function getMotd(movies){
  const pub = movies.filter(m=>m.status!=="draft");
  if(!pub.length) return null;
  // Deterministic: pick based on day-of-year so everyone sees same movie
  const now   = new Date();
  const start = new Date(now.getFullYear(),0,0);
  const day   = Math.floor((now - start) / 86400000);
  return pub[day % pub.length];
}

function MovieOfTheDay({movies, onWatch}){
  const movie = useMemo(()=>getMotd(movies),[movies]);
  const[timeLeft,setTimeLeft] = useState("");

  // Countdown to midnight (next movie)
  useEffect(()=>{
    const tick=()=>{
      const now = new Date();
      const midnight = new Date(now); midnight.setHours(24,0,0,0);
      const diff = midnight - now;
      const h = Math.floor(diff/3600000);
      const m = Math.floor((diff%3600000)/60000);
      const s = Math.floor((diff%60000)/1000);
      setTimeLeft(`${String(h).padStart(2,"0")}:${String(m).padStart(2,"0")}:${String(s).padStart(2,"0")}`);
    };
    tick();
    const t=setInterval(tick,1000);
    return()=>clearInterval(t);
  },[]);

  if(!movie) return null;

  return(
    <div onClick={()=>onWatch(movie)}>
      <div className="motd">
        {/* Blurred backdrop */}
        {(movie.backdrop||movie.poster)&&(
          <div className="motd-bg" style={{backgroundImage:`url(${movie.backdrop||movie.poster})`}}/>
        )}
        <div className="motd-overlay"/>
        <div className="motd-inner">
          {/* Poster */}
          <div className="motd-poster">
            <Img src={movie.poster} alt={movie.title} style={{width:"100%",height:"100%"}}/>
          </div>
          {/* Info */}
          <div style={{flex:1,minWidth:0}}>
            <div className="motd-badge">
              <div className="motd-badge-dot"/>
              Movie of the Day
            </div>
            <div className="motd-title">{movie.title}</div>
            <div className="motd-meta">
              <span className="motd-tag">{movie.year}</span>
              {movie.genres?.[0]&&<><div className="motd-sep"/><span className="motd-tag">{movie.genres[0]}</span></>}
              {movie.runtime&&<><div className="motd-sep"/><span className="motd-tag">{fmtT(movie.runtime)}</span></>}
              {movie.director&&<><div className="motd-sep"/><span className="motd-tag">{movie.director}</span></>}
            </div>
            {movie.desc&&<div className="motd-desc">{movie.desc}</div>}
            <div className="motd-footer">
              <div style={{display:"flex",gap:9}}>
                <button className="btn bp sm" onClick={e=>{e.stopPropagation();onWatch(movie);}}>
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><polygon points="5 3 19 12 5 21 5 3"/></svg>
                  Watch Now
                </button>
              </div>
              <div className="motd-countdown">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                Next in <span className="motd-countdown-val">{timeLeft}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════
   PUSH NOTIFICATIONS
═══════════════════════════════════════ */
function usePushNotifications(){
  const[status,setStatus]=useState(()=>localStorage.getItem("mn_push")||"idle");
  // "idle" | "subscribed" | "denied" | "unsupported"
  const[showTip,setShowTip]=useState(false);

  useEffect(()=>{
    if(!("Notification" in window)||!("serviceWorker" in navigator)){
      setStatus("unsupported"); return;
    }
    if(Notification.permission==="denied") setStatus("denied");
    else if(Notification.permission==="granted"&&localStorage.getItem("mn_push")==="subscribed") setStatus("subscribed");
  },[]);

  const subscribe=async()=>{
    if(!("Notification" in window)) return;
    if(status==="subscribed"){
      setShowTip(t=>!t); return;
    }
    const perm = await Notification.requestPermission();
    if(perm==="granted"){
      setStatus("subscribed");
      localStorage.setItem("mn_push","subscribed");
      // Show a test notification
      const reg = await navigator.serviceWorker.ready;
      reg.showNotification("MovieNation",{
        body:"You'll now get notified when new movies are added!",
        icon:"/favicon.png",
        badge:"/favicon.png",
        tag:"mn-welcome",
      });
      setShowTip(true);
      setTimeout(()=>setShowTip(false),4000);
    } else {
      setStatus("denied");
      localStorage.setItem("mn_push","denied");
    }
  };

  const unsubscribe=()=>{
    setStatus("idle");
    localStorage.removeItem("mn_push");
    setShowTip(false);
  };

  return{status,subscribe,unsubscribe,showTip,setShowTip};
}

/* Bell button — floats above BackToTop */
function NotificationBell(){
  const{status,subscribe,unsubscribe,showTip,setShowTip}=usePushNotifications();
  if(status==="unsupported") return null;

  const subscribed = status==="subscribed";
  const denied     = status==="denied";

  return(
    <div className="notif-bell-wrap">
      {showTip&&(
        <div className="notif-bell-tooltip">
          {subscribed
            ? <>🔔 Notifications ON!<br/><span style={{fontSize:11,opacity:.7}}>Tap again to turn off</span></>
            : denied
              ? <>Notifications blocked.<br/><span style={{fontSize:11,opacity:.7}}>Enable in browser settings</span></>
              : null
          }
        </div>
      )}
      <button
        className={`notif-bell-btn${subscribed?" subscribed":""}`}
        onClick={subscribed?unsubscribe:subscribe}
        title={subscribed?"Turn off notifications":"Get notified of new movies"}
      >
        {subscribed
          ? <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="0"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9M13.73 21a2 2 0 0 1-3.46 0"/></svg>
          : denied
            ? <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
            : <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>
        }
      </button>
    </div>
  );
}

/* Helper: Admin can trigger a push notification to all subscribed users.
   Since we have no backend, we use a local notification for demo + show a
   guide for using OneSignal/Firebase to broadcast to real users. */
function sendAdminPush(movie){
  if(!("Notification" in window)||Notification.permission!=="granted") return;
  navigator.serviceWorker.ready.then(reg=>{
    reg.showNotification(`New Movie: ${movie.title}`,{
      body:`${movie.year} · ${movie.genres?.[0]||"Movie"} — Watch it now on MovieNation!`,
      icon: movie.poster||"/favicon.png",
      badge:"/favicon.png",
      image:movie.backdrop||movie.poster||undefined,
      data:{ url: "/" },
      tag:"mn-new-movie",
      renotify:true,
      actions:[{action:"watch",title:"Watch Now"},{action:"dismiss",title:"Later"}],
    });
  });
}

/* ═══════════════════════════════════════
   WHATSAPP CHANNEL BANNER
═══════════════════════════════════════ */
function WhatsAppChannelBanner(){
  const[dismissed,setDismissed]=useState(()=>!!localStorage.getItem("mn_wa_dismissed"));
  if(dismissed) return null;

  const isConfigured = WHATSAPP_CHANNEL !== "https://whatsapp.com/channel/YOUR_CHANNEL_LINK_HERE";

  return(
    <div style={{padding:"0 0 0"}}>
      <div className="wa-banner" onClick={()=>window.open(WHATSAPP_CHANNEL,"_blank","noopener,noreferrer")}>
        {/* Dismiss button */}
        <button
          onClick={e=>{e.stopPropagation();setDismissed(true);localStorage.setItem("mn_wa_dismissed","1");}}
          style={{
            position:"absolute",top:12,right:12,z:10,
            width:28,height:28,borderRadius:"50%",background:"rgba(255,255,255,.1)",
            border:"1px solid rgba(255,255,255,.15)",cursor:"pointer",
            display:"flex",alignItems:"center",justifyContent:"center",
            color:"rgba(255,255,255,.5)",transition:"all .2s",zIndex:3,
          }}
          onMouseEnter={e=>{e.currentTarget.style.background="rgba(255,255,255,.2)";e.currentTarget.style.color="#fff"}}
          onMouseLeave={e=>{e.currentTarget.style.background="rgba(255,255,255,.1)";e.currentTarget.style.color="rgba(255,255,255,.5)"}}
        >
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
        </button>

        {/* WA Icon */}
        <div className="wa-icon-wrap">
          <svg width="32" height="32" viewBox="0 0 24 24" fill="#25D366"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
        </div>

        {/* Content */}
        <div className="wa-content">
          <div className="wa-eyebrow">Official Channel</div>
          <div className="wa-title">Join MovieNation on WhatsApp</div>
          <div className="wa-desc">
            Get instant updates when new movies are added — posters, descriptions and direct watch links delivered straight to your WhatsApp.
          </div>
          <button className="wa-btn" onClick={e=>{e.stopPropagation();window.open(WHATSAPP_CHANNEL,"_blank","noopener,noreferrer");}}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
            {isConfigured?"Join Channel":"Configure Channel Link"}
          </button>
        </div>

        {/* Stats */}
        <div className="wa-stats">
          <div className="wa-stat"><div className="wa-stat-dot"/><span>New movies daily</span></div>
          <div className="wa-stat"><div className="wa-stat-dot"/><span>Free to join</span></div>
          <div className="wa-stat"><div className="wa-stat-dot"/><span>No spam, ever</span></div>
        </div>
      </div>
    </div>
  );
}


function BackToTop(){
  const[show,setShow]=useState(false);
  useEffect(()=>{const fn=()=>setShow(window.scrollY>400);window.addEventListener("scroll",fn);return()=>window.removeEventListener("scroll",fn);},[]);
  if(!show) return null;
  return <button className="btt" onClick={()=>window.scrollTo({top:0,behavior:"smooth"})}>{I.up}</button>;
}

/* ═══════ ROOT APP ═══════ */
export default function App(){
  const[dark,setDarkRaw]=useState(getDk);
  const[movies,setMovies]=useState(getM);
  const[page,setPageRaw]=useState(()=>
    typeof window!=="undefined"&&window.location.search.includes("admin")?"admin":"home"
  );
  const[watching,setWatching]=useState(null);
  const[selected,setSelected]=useState(null);
  const[toast,setToast]=useState(null);
  const[adminOK,setAdminOK]=useState(false);
  const[fbStatus,setFbStatus]=useState(()=>isFirebaseConfigured()?"connecting":"not-configured");
  const[fbError,setFbError]=useState(null);
  const tr=useRef(null);
  const fbUnsub=useRef(null);

  /* Apply saved theme on first render */
  useEffect(()=>{
    const tp = getThemePrefs();
    applyAccent(tp.accentIdx||0);
    applyFont(tp.fontIdx||0);
    applyTextScale(tp.textScale||100);
  },[]);

  const setDark=v=>{setDarkRaw(v);saveDk(v);};
  const setPage=p=>{setPageRaw(p);setWatching(null);setSelected(null);window.scrollTo({top:0});};

  /* ── Firebase real-time subscription ── */
  useEffect(()=>{
    if(!isFirebaseConfigured()){
      setFbStatus("not-configured");
      return;
    }
    setFbStatus("connecting");

    const unsub = subscribeToMovies(
      /* onData */ (liveMovies)=>{
        // Sort by addedAt desc so newest first
        const sorted=[...liveMovies].sort((a,b)=>{
          if(a.addedAt&&b.addedAt) return b.addedAt.localeCompare(a.addedAt);
          return 0;
        });
        setMovies(sorted);
        LS.s("mn5m",sorted);
        setFbStatus("connected");
      },
      /* onStatus */ (status,errMsg)=>{
        setFbStatus(status);
        if(errMsg) setFbError(errMsg);
      }
    );

    fbUnsub.current = unsub;
    return()=>{ if(fbUnsub.current) fbUnsub.current(); };
  },[]);

  const showToast=useCallback(msg=>{
    setToast(msg);clearTimeout(tr.current);
    tr.current=setTimeout(()=>setToast(null),2800);
  },[]);

  /* Watch a movie — updates view count live */
  const onWatch=useCallback(async movie=>{
    const updated={...movie,views:(movie.views||0)+1};
    // Update UI immediately, then sync to Firebase
    setMovies(prev=>prev.map(m=>m.id===updated.id?updated:m));
    LS.s("mn5m",movies.map(m=>m.id===updated.id?updated:m));
    if(isFirebaseConfigured()) saveMovieToFirebase(updated);
    setWatching(updated);
    setSelected(null);
    window.scrollTo({top:0});
  },[movies]);

  /* Download a movie — updates download count live */
  const onDl=useCallback(async movie=>{
    const updated={...movie,dlClicks:(movie.dlClicks||0)+1};
    setMovies(prev=>prev.map(m=>m.id===updated.id?updated:m));
    LS.s("mn5m",movies.map(m=>m.id===updated.id?updated:m));
    if(isFirebaseConfigured()) saveMovieToFirebase(updated);
    window.open(movie.downloadUrl||"#","_blank","noopener,noreferrer");
    showToast("Download starting…");
  },[movies,showToast]);

  /* Recommended movie click inside WatchPage */
  useEffect(()=>{
    const fn=e=>{ const m=movies.find(x=>x.id===e.detail.id)||e.detail; onWatch(m); };
    document.addEventListener("watchM",fn);
    return()=>document.removeEventListener("watchM",fn);
  },[movies,onWatch]);

  /* Settings page navigation buttons */
  useEffect(()=>{
    const fn=e=>setPage(e.detail);
    window.addEventListener("setPage",fn);
    return()=>window.removeEventListener("setPage",fn);
  },[]);

  /*
   * adminSetMovies — called by admin panel for all changes.
   * We update local state + localStorage first (instant UI),
   * then determine what changed and sync only that to Firebase.
   */
  const adminSetMovies=useCallback(async(newMovies,changeHint)=>{
    setMovies(newMovies);
    LS.s("mn5m",newMovies);
    if(!isFirebaseConfigured()) return;

    if(changeHint?.type==="add"||changeHint?.type==="edit"){
      const result=await saveMovieToFirebase(changeHint.movie);
      if(!result.ok) showToast("Firebase error: "+result.error);
      // Send push notification when a NEW movie is published
      if(changeHint.type==="add"&&changeHint.movie?.status!=="draft"){
        sendAdminPush(changeHint.movie);
      }
    } else if(changeHint?.type==="delete"){
      const result=await deleteMovieFromFirebase(changeHint.id);
      if(!result.ok) showToast("Firebase error: "+result.error);
    } else {
      // Bulk / unknown — sync everything
      await bulkSaveToFirebase(newMovies);
    }
  },[showToast]);

  /* Push all current movies to Firebase (first-time sync button) */
  const pushAllToFirebase=useCallback(async()=>{
    showToast("Pushing all movies to Firebase…");
    const result=await bulkSaveToFirebase(movies);
    if(result.ok) showToast("All movies pushed to Firebase!");
    else showToast("Push failed: "+result.error);
  },[movies,showToast]);

  const showWatch=!!watching;
  const showNav=page!=="admin";

  /* Status bar color/text helpers */
  const statusColor={"connected":"rgba(52,211,153,.1)","error":"rgba(248,113,113,.1)","not-configured":"rgba(245,158,11,.08)","connecting":"rgba(245,158,11,.1)"};
  const statusBorder={"connected":"rgba(52,211,153,.28)","error":"rgba(248,113,113,.28)","not-configured":"rgba(245,158,11,.2)","connecting":"rgba(245,158,11,.28)"};
  const statusDot={"connected":"var(--gn)","error":"var(--rd)","not-configured":"var(--t3)","connecting":"var(--a)"};
  const statusText={
    "connected":"Firebase connected — movies go live instantly for all visitors",
    "connecting":"Connecting to Firebase…",
    "error":`Firebase error: ${fbError||"check your config and Firestore rules"}`,
    "not-configured":"Firebase not configured — movies saved locally only (open src/firebase.js to set up)",
  };

  return(
    <div className={dark?"dk":"lt"} style={{fontFamily:"'Satoshi',system-ui,sans-serif",background:"var(--bg)",color:"var(--tx)",minHeight:"100vh"}}>
      {showNav&&<Nav page={page} setPage={setPage} dark={dark} setDark={setDark}/>}

      {/* ── Firebase status bar (admin panel only) ── */}
      {page==="admin"&&adminOK&&(
        <div style={{
          position:"fixed",top:68,left:0,right:0,zIndex:490,
          background:statusColor[fbStatus]||statusColor.connecting,
          borderBottom:`1px solid ${statusBorder[fbStatus]||statusBorder.connecting}`,
          padding:"8px 44px",display:"flex",alignItems:"center",gap:10,flexWrap:"wrap",
        }}>
          <div style={{width:8,height:8,borderRadius:"50%",background:statusDot[fbStatus]||"var(--a)",flexShrink:0,
            animation:fbStatus==="connecting"?"pulse2 1.2s ease infinite":"none"}}/>
          <span style={{fontSize:12,fontWeight:700,fontFamily:"'JetBrains Mono',monospace",color:"var(--tx)",flex:1}}>
            {statusText[fbStatus]||statusText.connecting}
          </span>
          {/* Show "Push all movies" button when first connected */}
          {fbStatus==="connected"&&(
            <button className="btn bo sm" style={{fontSize:11,padding:"4px 12px"}} onClick={pushAllToFirebase}>
              Push all movies to Firebase
            </button>
          )}
        </div>
      )}

      {showWatch
        ?<div className="pg" style={{paddingTop:68}}>
            <WatchPage movie={watching} allMovies={movies} onBack={()=>{setWatching(null);window.scrollTo({top:0});}} onDl={onDl} showToast={showToast}/>
          </div>
        :<div className="pg">
            {page==="home"    &&<HomePage movies={movies} onMovieClick={setSelected} onWatch={onWatch} setPage={setPage}/>}
            {page==="explorer"&&<Explorer movies={movies} onMovieClick={setSelected}/>}
            {page==="search"  &&<SearchPage movies={movies} onMovieClick={setSelected}/>}
            {page==="favs"    &&<FavoritesPage movies={movies} onMovieClick={setSelected}/>}
            {page==="settings"&&<Settings dark={dark} setDark={setDark}/>}
            {page==="privacy" &&<Privacy/>}
            {page==="terms"   &&<Terms/>}
            {page==="admin"   &&(adminOK
              ?<AdminPanel movies={movies} setMovies={adminSetMovies} onLogout={()=>{setAdminOK(false);setPage("home");}} showToast={showToast}/>
              :<AdminLogin onLogin={()=>setAdminOK(true)}/>
            )}
          </div>
      }

      {!showWatch&&page!=="admin"&&<Footer setPage={setPage}/>}
      {selected&&!showWatch&&<InfoModal movie={selected} onClose={()=>setSelected(null)} onWatch={onWatch} onDl={onDl}/>}
      {toast&&<div className="toast"><div className="toast-dot"/>{toast}</div>}
      {page!=="admin"&&<CookieBanner setPage={setPage}/>}
      {page!=="admin"&&!showWatch&&<NotificationBell/>}
      {page!=="admin"&&!showWatch&&<BackToTop/>}
    </div>
  );
}