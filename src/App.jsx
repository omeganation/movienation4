import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import {
  saveMovieToFirebase,
  deleteMovieFromFirebase,
  saveAllMoviesToFirebase,
  subscribeToMovies,
  isFirebaseConfigured,
} from "./firebase.js";

/* ═══════════════════════════════════════════════════
   STYLES
═══════════════════════════════════════════════════ */
if (!document.getElementById("mn5s")) {
  const lk = document.createElement("link"); lk.rel = "stylesheet";
  lk.href = "https://fonts.googleapis.com/css2?family=Sora:wght@300;400;600;700;800&family=DM+Sans:wght@300;400;500;600;700&family=DM+Mono:wght@400;500&display=swap";
  document.head.appendChild(lk);
  const st = document.createElement("style"); st.id = "mn5s";
  st.textContent = `
/* ═══════════════════════════════════════
   PRESTIGE CINEMA — v5 Design System
   Fonts: Sora (headings) · DM Sans (body)
   Accent: Amber #F59E0B · Base: Slate-Black
═══════════════════════════════════════ */
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
html{scroll-behavior:smooth}body{margin:0;overflow-x:hidden;-webkit-font-smoothing:antialiased;text-rendering:optimizeLegibility}
img{display:block}button{cursor:pointer;border:none;background:none;font-family:inherit}a{text-decoration:none;color:inherit}
::-webkit-scrollbar{width:4px;height:4px}::-webkit-scrollbar-track{background:transparent}::-webkit-scrollbar-thumb{background:var(--a);border-radius:4px}

/* ─── TOKENS ─── */
.dk{
  --bg:#0B0C12;--s1:#12131C;--s2:#1A1B27;--s3:#222333;--s4:#2C2D40;
  --gl:rgba(11,12,18,.86);
  --tx:#EEEDF5;--t2:#7E7D96;--t3:#3A3952;
  --a:#F59E0B;--ah:#FBBF24;--ag:rgba(245,158,11,.16);--ab:rgba(245,158,11,.32);
  --pu:#818CF8;--ph:#A5B4FC;--pg:rgba(129,140,248,.15);
  --br:rgba(255,255,255,.07);--br2:rgba(245,158,11,.28);
  --rd:#F87171;--gn:#34D399;
  --sh:0 24px 64px rgba(0,0,0,.75);--card:#13141E;
  --hero-tint:rgba(11,12,18,1);
  --accent-glow:rgba(245,158,11,.2);
}
.lt{
  --bg:#F2F1F8;--s1:#FFFFFF;--s2:#EAEAF4;--s3:#DDDDF0;--s4:#D0CFEA;
  --gl:rgba(242,241,248,.92);
  --tx:#0E0D1C;--t2:#5C5B78;--t3:#AEADCA;
  --a:#D97706;--ah:#F59E0B;--ag:rgba(217,119,6,.12);--ab:rgba(217,119,6,.28);
  --pu:#6366F1;--ph:#818CF8;--pg:rgba(99,102,241,.12);
  --br:rgba(0,0,0,.08);--br2:rgba(217,119,6,.3);
  --rd:#EF4444;--gn:#10B981;
  --sh:0 8px 32px rgba(0,0,0,.1);--card:#FFFFFF;
  --hero-tint:rgba(11,12,18,1);
  --accent-glow:rgba(217,119,6,.16);
}

#root{font-family:'DM Sans',sans-serif;background:var(--bg);color:var(--tx);min-height:100vh;transition:background .35s,color .35s}

/* ─── ANIMATIONS ─── */
@keyframes fu{from{opacity:0;transform:translateY(18px)}to{opacity:1;transform:none}}
@keyframes fi{from{opacity:0}to{opacity:1}}
@keyframes si{from{opacity:0;transform:scale(.96)}to{opacity:1;transform:none}}
@keyframes hi{from{opacity:0;transform:scale(1.05)}to{opacity:1;transform:none}}
@keyframes shimmer{0%{background-position:-600px 0}100%{background-position:600px 0}}
@keyframes toastin{from{opacity:0;transform:translateX(-50%) translateY(14px)}to{opacity:1;transform:translateX(-50%) translateY(0)}}
@keyframes slideR{from{opacity:0;transform:translateX(22px)}to{opacity:1;transform:none}}
@keyframes watchBg{from{opacity:0;transform:scale(1.06)}to{opacity:1;transform:none}}
@keyframes pulse2{0%,100%{opacity:1}50%{opacity:.5}}

.pg{padding-top:68px;padding-bottom:72px;min-height:100vh}
@media(min-width:768px){.pg{padding-bottom:0}}

/* ═══════════════════════
   NAVIGATION — Glass Blur
═══════════════════════ */
.nav{
  position:fixed;top:0;left:0;right:0;height:68px;z-index:500;
  display:flex;align-items:center;justify-content:space-between;
  padding:0 20px;
  background:var(--gl);
  backdrop-filter:blur(32px) saturate(180%);
  -webkit-backdrop-filter:blur(32px) saturate(180%);
  border-bottom:1px solid var(--br);
  transition:all .3s;
}
@media(min-width:768px){.nav{padding:0 44px}}
.nav-logo{display:flex;align-items:center;gap:11px;cursor:pointer;user-select:none}
.nav-logo img{width:36px;height:36px;border-radius:10px;object-fit:cover;flex-shrink:0}
.nav-logo-txt{font-family:'Sora',sans-serif;font-size:19px;font-weight:800;letter-spacing:-.02em;display:none;line-height:1}
@media(min-width:420px){.nav-logo-txt{display:block}}
.nav-logo-txt b{color:var(--a)}
.nav-links{display:none;gap:1px}@media(min-width:768px){.nav-links{display:flex}}
.nav-item{
  padding:8px 16px;border-radius:9px;font-size:13.5px;font-weight:600;
  color:var(--t2);display:flex;align-items:center;gap:7px;
  transition:all .2s;cursor:pointer;letter-spacing:.01em;
}
.nav-item:hover{color:var(--tx);background:var(--s2)}.nav-item.on{color:var(--a)}
.nav-r{display:flex;align-items:center;gap:8px}
.theme-btn{
  width:36px;height:36px;border-radius:50%;
  display:flex;align-items:center;justify-content:center;
  background:var(--s2);border:1px solid var(--br);color:var(--t2);
  transition:all .2s;cursor:pointer;
}
.theme-btn:hover{border-color:var(--a);color:var(--a)}

/* BOTTOM NAV */
.bnav{
  position:fixed;bottom:0;left:0;right:0;height:64px;z-index:500;
  display:grid;grid-template-columns:repeat(4,1fr);
  background:var(--gl);
  backdrop-filter:blur(32px);-webkit-backdrop-filter:blur(32px);
  border-top:1px solid var(--br);
}
@media(min-width:768px){.bnav{display:none}}
.bnav-item{display:flex;flex-direction:column;align-items:center;justify-content:center;gap:4px;font-size:9.5px;font-weight:700;letter-spacing:.07em;text-transform:uppercase;color:var(--t3);transition:color .2s;cursor:pointer}
.bnav-item.on{color:var(--a)}

/* ═══════════════
   HERO CAROUSEL
═══════════════ */
.hero{position:relative;width:100%;height:100vh;max-height:800px;min-height:540px;overflow:hidden}
.hero-slide{position:absolute;inset:0;opacity:0;transition:opacity .9s ease;pointer-events:none}
.hero-slide.on{opacity:1;pointer-events:all;animation:hi .9s ease}
.hero-slide img{width:100%;height:100%;object-fit:cover}
.hero-ov{
  position:absolute;inset:0;
  background:
    linear-gradient(90deg,var(--hero-tint) 0%,rgba(11,12,18,.82) 40%,rgba(11,12,18,.06) 100%),
    linear-gradient(0deg,var(--hero-tint) 0%,rgba(11,12,18,.55) 30%,transparent 60%);
}
.hero-c{position:absolute;bottom:0;left:0;padding:0 24px 56px;max-width:640px}
@media(min-width:768px){.hero-c{padding:0 68px 96px;max-width:760px}}

/* badge */
.hero-badge{
  display:inline-flex;align-items:center;gap:8px;
  background:rgba(245,158,11,.15);color:var(--a);
  font-size:10px;font-weight:700;letter-spacing:.16em;text-transform:uppercase;
  padding:5px 14px;border-radius:100px;margin-bottom:18px;
  border:1px solid var(--ab);font-family:'DM Mono',monospace;
  backdrop-filter:blur(8px);
}
/* title */
.hero-title{
  font-family:'Sora',sans-serif;font-weight:800;
  font-size:48px;line-height:.97;color:#EEEDF5;
  margin-bottom:14px;letter-spacing:-.04em;
}
@media(min-width:768px){.hero-title{font-size:78px}}
/* meta */
.hero-meta{display:flex;align-items:center;gap:12px;flex-wrap:wrap;margin-bottom:16px}
.hero-m{font-size:13px;color:rgba(238,237,245,.5);display:flex;align-items:center;gap:5px;font-weight:500}
.hero-sep{width:4px;height:4px;border-radius:50%;background:var(--a);opacity:.6}
/* desc */
.hero-desc{font-size:15px;color:rgba(238,237,245,.58);line-height:1.75;margin-bottom:28px;font-weight:300;max-width:480px}
/* actions */
.hero-acts{display:flex;gap:12px;flex-wrap:wrap;align-items:center}
/* progress */
.hero-prog{position:absolute;bottom:0;left:0;right:0;height:2px;background:rgba(255,255,255,.05)}
.hero-bar{height:100%;background:var(--a);transition:width 5.5s linear}
/* dots */
.hero-dots{position:absolute;right:18px;top:50%;transform:translateY(-50%);display:flex;flex-direction:column;gap:8px}
@media(min-width:768px){.hero-dots{right:40px}}
.hero-d{width:3px;height:22px;border-radius:3px;background:rgba(255,255,255,.16);cursor:pointer;transition:all .3s}
.hero-d.on{height:40px;background:var(--a)}
/* arrows */
.hero-arr{
  position:absolute;top:50%;transform:translateY(-50%);
  width:46px;height:46px;border-radius:50%;
  background:rgba(11,12,18,.7);color:rgba(238,237,245,.7);
  display:flex;align-items:center;justify-content:center;
  border:1px solid rgba(255,255,255,.1);backdrop-filter:blur(8px);
  cursor:pointer;transition:all .22s;
}
.hero-arr:hover{background:var(--a);color:#fff;border-color:var(--a);box-shadow:0 0 0 8px var(--ag)}

/* ═══════════
   BUTTONS
═══════════ */
.btn{
  display:inline-flex;align-items:center;gap:8px;
  padding:11px 24px;border-radius:10px;
  font-size:14px;font-weight:700;transition:all .22s;
  cursor:pointer;white-space:nowrap;letter-spacing:.01em;
  font-family:'DM Sans',sans-serif;
}
.bp{
  background:var(--a);color:#0B0C12;
}
.bp:hover{background:var(--ah);transform:translateY(-1px);box-shadow:0 10px 28px var(--ag)}
.bg{background:rgba(238,237,245,.12);color:#EEEDF5;border:1px solid rgba(238,237,245,.16)}
.bg:hover{background:rgba(238,237,245,.2)}
.bo{background:transparent;color:var(--tx);border:1px solid var(--br)}
.bo:hover{border-color:var(--a);color:var(--a)}
.bpu{background:var(--pu);color:#fff}.bpu:hover{background:var(--ph);transform:translateY(-1px)}
.brd{background:rgba(248,113,113,.1);color:var(--rd);border:1px solid rgba(248,113,113,.2)}.brd:hover{background:rgba(248,113,113,.2)}
.bgn{background:rgba(52,211,153,.1);color:var(--gn);border:1px solid rgba(52,211,153,.2)}.bgn:hover{background:rgba(52,211,153,.2)}
.sm{padding:7px 15px;font-size:12.5px;border-radius:8px}
.xs{padding:5px 11px;font-size:11.5px;border-radius:6px}
.btn:disabled{opacity:.5;cursor:not-allowed;transform:none!important}

/* ══════════
   SECTIONS
══════════ */
.sec{padding:36px 20px}
@media(min-width:768px){.sec{padding:44px 48px}}
@media(min-width:1200px){.sec{padding:52px 88px}}

.sh{display:flex;align-items:flex-end;justify-content:space-between;margin-bottom:24px}
.sh-left{}

/* eyebrow: small colored label above title */
.eye{
  font-size:11px;font-weight:700;letter-spacing:.18em;text-transform:uppercase;
  color:var(--a);margin-bottom:6px;font-family:'DM Mono',monospace;
  display:flex;align-items:center;gap:8px;
}
.eye::before{content:'';display:inline-block;width:18px;height:2px;background:var(--a);border-radius:2px;flex-shrink:0}

/* section title */
.ttl{font-family:'Sora',sans-serif;font-size:24px;font-weight:800;letter-spacing:-.03em;line-height:1.1}

/* ════════════
   MOVIE GRID
════════════ */
.mn-grid{display:grid;gap:14px;grid-template-columns:repeat(2,1fr)}
@media(min-width:480px){.mn-grid{grid-template-columns:repeat(3,1fr);gap:16px}}
@media(min-width:768px){.mn-grid{grid-template-columns:repeat(4,1fr);gap:18px}}
@media(min-width:1100px){.mn-grid{grid-template-columns:repeat(5,1fr)}}
@media(min-width:1440px){.mn-grid{grid-template-columns:repeat(6,1fr)}}

.mn-hrow{display:flex;gap:13px;overflow-x:auto;padding-bottom:10px;scrollbar-width:none}
.mn-hrow::-webkit-scrollbar{display:none}

/* ════════════
   MOVIE CARD
════════════ */
.card{
  position:relative;border-radius:14px;overflow:hidden;cursor:pointer;
  background:var(--card);animation:fu .45s ease both;
  transition:transform .32s cubic-bezier(.34,1.26,.64,1),box-shadow .32s ease;
  flex-shrink:0;width:150px;
}
@media(min-width:768px){.card{width:176px}}.card-full{width:100%}
.card:hover{transform:translateY(-6px) scale(1.01);box-shadow:0 28px 60px rgba(0,0,0,.6)}

.card-img{position:relative;width:100%;aspect-ratio:2/3;overflow:hidden;background:var(--s3)}
.card-img img{width:100%;height:100%;object-fit:cover;transition:transform .55s ease}
.card:hover .card-img img{transform:scale(1.08)}

/* gradient reveal */
.card-ov{
  position:absolute;inset:0;
  background:linear-gradient(to top,rgba(11,12,18,.97) 0%,rgba(11,12,18,.45) 40%,transparent 68%);
  opacity:0;transition:opacity .3s;
}
.card:hover .card-ov{opacity:1}

/* bottom info */
.card-inf{
  position:absolute;bottom:0;left:0;right:0;
  padding:14px 12px 11px;
  transform:translateY(10px);opacity:0;transition:all .3s ease;
}
.card:hover .card-inf{transform:none;opacity:1}
.card-name{font-size:12.5px;font-weight:700;color:#EEEDF5;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;margin-bottom:2px;font-family:'Sora',sans-serif}
.card-sub{font-size:11px;color:rgba(238,237,245,.45);font-family:'DM Mono',monospace}

/* center play icon */
.card-play{
  position:absolute;top:50%;left:50%;
  transform:translate(-50%,-50%) scale(.7);
  width:52px;height:52px;border-radius:50%;
  background:var(--a);color:#0B0C12;
  display:flex;align-items:center;justify-content:center;
  opacity:0;transition:all .28s ease;
  box-shadow:0 0 0 0 var(--ag);
}
.card:hover .card-play{opacity:1;transform:translate(-50%,-50%) scale(1);box-shadow:0 0 0 14px var(--ag)}

/* genre badge top left */
.card-badge{
  position:absolute;top:10px;left:10px;
  background:rgba(11,12,18,.78);backdrop-filter:blur(10px);
  color:var(--a);font-size:9.5px;font-weight:700;letter-spacing:.07em;
  padding:3px 9px;border-radius:100px;
  border:1px solid var(--ab);font-family:'DM Mono',monospace;text-transform:uppercase;
}
.card-draft{
  position:absolute;top:10px;right:10px;
  background:var(--pg);color:var(--ph);
  font-size:9.5px;font-weight:700;padding:3px 8px;border-radius:100px;
  border:1px solid rgba(129,140,248,.28);font-family:'DM Mono',monospace;text-transform:uppercase;
}

/* stagger */
.card:nth-child(1){animation-delay:0ms}.card:nth-child(2){animation-delay:50ms}
.card:nth-child(3){animation-delay:100ms}.card:nth-child(4){animation-delay:150ms}
.card:nth-child(5){animation-delay:200ms}.card:nth-child(n+6){animation-delay:240ms}

/* ════════
   CHIPS
════════ */
.chips{display:flex;gap:8px;overflow-x:auto;padding-bottom:6px;scrollbar-width:none;margin-bottom:24px}
.chips::-webkit-scrollbar{display:none}
.chip{
  padding:8px 20px;border-radius:100px;flex-shrink:0;
  font-size:12.5px;font-weight:600;cursor:pointer;
  border:1px solid var(--br);background:var(--s2);color:var(--t2);
  transition:all .2s;letter-spacing:.01em;
}
.chip:hover{border-color:var(--a);color:var(--a)}.chip.on{background:var(--a);color:#0B0C12;border-color:var(--a)}

/* ══════════════════
   TRENDING LIST (5)
══════════════════ */
.t-row{
  display:flex;align-items:stretch;margin-bottom:10px;
  background:var(--s1);border-radius:14px;overflow:hidden;
  border:1px solid var(--br);cursor:pointer;transition:all .22s;
}
.t-row:hover{border-color:var(--a);transform:translateX(5px);box-shadow:0 6px 24px rgba(0,0,0,.3)}
.t-rank{
  flex-shrink:0;width:58px;display:flex;align-items:center;justify-content:center;
  font-family:'Sora',sans-serif;font-size:26px;font-weight:800;
  color:var(--t3);background:var(--s2);letter-spacing:-.03em;
}
.t-rank.top{color:var(--a);text-shadow:0 0 20px var(--accent-glow)}
.t-thumb{flex-shrink:0;width:60px}.t-thumb img{width:100%;height:100%;object-fit:cover}
.t-info{flex:1;padding:14px 16px;display:flex;flex-direction:column;justify-content:center;min-width:0}
.t-title{
  font-size:14.5px;font-weight:700;margin-bottom:5px;
  font-family:'Sora',sans-serif;letter-spacing:-.02em;
  white-space:nowrap;overflow:hidden;text-overflow:ellipsis;
}
.t-meta{font-size:12px;color:var(--t2);display:flex;gap:10px;align-items:center;flex-wrap:wrap}
/* No t-views — removed per user request */

/* ════════════════════════════
   WATCH PAGE (dedicated page)
════════════════════════════ */
.watch-page{min-height:100vh;background:var(--bg)}

.watch-bg{position:relative;width:100%;height:58vh;min-height:360px;max-height:520px;overflow:hidden}
.watch-bg img{width:100%;height:100%;object-fit:cover;animation:watchBg .8s ease}
.watch-bg-ov{
  position:absolute;inset:0;
  background:
    linear-gradient(0deg,var(--bg) 0%,rgba(11,12,18,.65) 45%,rgba(11,12,18,.25) 100%),
    linear-gradient(90deg,rgba(11,12,18,.55) 0%,transparent 100%);
}

.watch-back{
  position:absolute;top:22px;left:22px;z-index:2;
  display:flex;align-items:center;gap:8px;
  background:rgba(11,12,18,.72);color:rgba(238,237,245,.85);
  padding:10px 18px;border-radius:10px;font-size:13px;font-weight:700;
  border:1px solid rgba(255,255,255,.1);backdrop-filter:blur(10px);
  cursor:pointer;transition:all .2s;
}
.watch-back:hover{background:var(--a);color:#0B0C12;border-color:var(--a)}

.watch-body{padding:0 20px 80px}
@media(min-width:768px){.watch-body{padding:0 48px 64px}}
@media(min-width:1200px){.watch-body{padding:0 88px 64px}}
.watch-inner{max-width:1100px;margin:0 auto}
.watch-grid{display:grid;gap:32px}
@media(min-width:900px){.watch-grid{grid-template-columns:1fr 340px}}

/* ── PLAYER ── */
.watch-player{
  border-radius:16px;overflow:hidden;background:#000;
  aspect-ratio:16/9;width:100%;margin-bottom:22px;
  border:1px solid var(--br);
  display:flex;align-items:center;justify-content:center;
}
.watch-player iframe{width:100%;height:100%;border:none}
.watch-player-placeholder{
  width:100%;height:100%;
  display:flex;flex-direction:column;align-items:center;justify-content:center;gap:18px;
  background:radial-gradient(ellipse at 50% 40%,var(--s3) 0%,var(--bg) 100%);
}
.watch-play-btn{
  width:76px;height:76px;border-radius:50%;
  background:var(--a);color:#0B0C12;
  display:flex;align-items:center;justify-content:center;
  cursor:pointer;transition:all .25s;
  box-shadow:0 0 0 0 var(--ag);
}
.watch-play-btn:hover{transform:scale(1.12);box-shadow:0 0 0 18px var(--ag)}
.watch-play-hint{font-size:14px;color:var(--t2);font-weight:500}

/* ── MOVIE INFO ── */
.watch-title{
  font-family:'Sora',sans-serif;font-size:32px;font-weight:800;
  letter-spacing:-.03em;margin-bottom:10px;line-height:1.05;
}
@media(min-width:768px){.watch-title{font-size:42px}}

.watch-meta-row{display:flex;gap:8px;flex-wrap:wrap;margin-bottom:18px;align-items:center}
.watch-tag{
  padding:5px 12px;border-radius:100px;
  font-size:11.5px;font-weight:600;
  background:var(--s2);color:var(--t2);
  font-family:'DM Mono',monospace;letter-spacing:.03em;
  display:flex;align-items:center;gap:4px;border:1px solid var(--br);
}
.watch-tag-a{background:var(--ag);color:var(--a);border-color:var(--ab)}

.watch-actions{display:flex;gap:10px;flex-wrap:wrap;margin-bottom:24px}

.watch-desc{
  font-size:15px;color:var(--t2);line-height:1.82;
  margin-bottom:24px;font-weight:400;
}

/* info grid */
.watch-ig{
  display:grid;grid-template-columns:repeat(2,1fr);gap:12px;
  padding:20px;border-radius:14px;
  background:var(--s1);border:1px solid var(--br);
  margin-bottom:24px;
}
@media(min-width:480px){.watch-ig{grid-template-columns:repeat(3,1fr)}}
.watch-ig-lbl{font-size:10px;font-weight:700;letter-spacing:.14em;text-transform:uppercase;color:var(--t3);margin-bottom:4px;font-family:'DM Mono',monospace}
.watch-ig-val{font-size:13.5px;font-weight:700;color:var(--tx)}

/* cast */
.watch-cast-wrap{margin-bottom:24px}
.watch-cast-lbl{font-size:10px;font-weight:700;letter-spacing:.14em;text-transform:uppercase;color:var(--t3);margin-bottom:10px;font-family:'DM Mono',monospace}
.watch-cast{display:flex;gap:8px;flex-wrap:wrap}
.watch-cast-chip{
  padding:6px 14px;border-radius:100px;font-size:12.5px;font-weight:600;
  background:var(--s2);color:var(--t2);border:1px solid var(--br);
  transition:all .2s;
}
.watch-cast-chip:hover{border-color:var(--a);color:var(--a)}

/* share section */
.watch-share{
  background:var(--s1);border-radius:16px;padding:22px;
  border:1px solid var(--br);margin-bottom:20px;
}
.watch-share-ttl{
  font-family:'Sora',sans-serif;font-size:16px;font-weight:700;
  margin-bottom:16px;display:flex;align-items:center;gap:9px;color:var(--tx);
}
.watch-share-grid{
  display:grid;grid-template-columns:repeat(2,1fr);gap:10px;margin-bottom:14px;
}
@media(min-width:380px){.watch-share-grid{grid-template-columns:repeat(4,1fr)}}
.share-btn{
  display:flex;flex-direction:column;align-items:center;gap:8px;
  padding:16px 8px;border-radius:13px;border:1px solid var(--br);
  cursor:pointer;transition:all .22s;
  font-size:11.5px;font-weight:700;color:var(--t2);background:var(--s2);
  font-family:'DM Sans',sans-serif;
}
.share-btn:hover{transform:translateY(-3px);box-shadow:0 10px 28px rgba(0,0,0,.35)}
.share-btn svg{flex-shrink:0}
.share-btn-fb:hover{background:#1877F2;color:#fff;border-color:#1877F2}
.share-btn-tw:hover{background:#18181B;color:#fff;border-color:#18181B}
.share-btn-wa:hover{background:#25D366;color:#fff;border-color:#25D366}
.share-btn-ig:hover{background:linear-gradient(135deg,#f09433,#dc2743,#bc1888);color:#fff;border-color:#dc2743}
.watch-link-box{
  background:var(--s2);border-radius:10px;padding:12px 16px;
  display:flex;align-items:center;gap:12px;border:1px solid var(--br);
}
.watch-link-url{
  flex:1;font-size:11.5px;color:var(--t2);
  font-family:'DM Mono',monospace;overflow:hidden;
  text-overflow:ellipsis;white-space:nowrap;min-width:0;
}

/* ── SIDEBAR ── */
.watch-card-side{
  background:var(--s1);border-radius:16px;overflow:hidden;
  border:1px solid var(--br);margin-bottom:18px;
}
.watch-poster-side{width:100%;aspect-ratio:2/3;overflow:hidden}
.watch-sidebar-info{padding:18px}
.watch-sidebar-title{font-family:'Sora',sans-serif;font-size:18px;font-weight:800;letter-spacing:-.02em;margin-bottom:6px}
.watch-sidebar-meta{font-size:13px;color:var(--t2);margin-bottom:16px}
.watch-rec{background:var(--s1);border-radius:16px;padding:20px;border:1px solid var(--br)}
.watch-rec-ttl{
  font-family:'Sora',sans-serif;font-size:15px;font-weight:700;
  margin-bottom:14px;color:var(--tx);
}
.watch-rec-row{
  display:flex;gap:12px;align-items:center;cursor:pointer;
  padding:10px;border-radius:12px;transition:all .2s;
  border:1px solid transparent;
}
.watch-rec-row:hover{background:var(--s2);border-color:var(--br)}
.watch-rec-img{width:52px;height:74px;border-radius:8px;overflow:hidden;flex-shrink:0}
.watch-rec-name{font-size:13px;font-weight:700;margin-bottom:3px;overflow:hidden;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;font-family:'Sora',sans-serif}
.watch-rec-meta{font-size:11px;color:var(--t2);font-family:'DM Mono',monospace}

/* ════════════════════
   QUICK INFO MODAL
════════════════════ */
.mbg{position:fixed;inset:0;z-index:600;background:rgba(4,4,10,.95);display:flex;align-items:center;justify-content:center;padding:14px;backdrop-filter:blur(20px);animation:fi .2s ease}
.modal{
  background:var(--s1);border-radius:18px;overflow:hidden;
  max-width:900px;width:100%;max-height:94vh;overflow-y:auto;
  border:1px solid var(--br);animation:si .3s ease;
  box-shadow:var(--sh);
}
.modal-hero{position:relative;width:100%;height:260px}@media(min-width:600px){.modal-hero{height:320px}}
.modal-hero img{width:100%;height:100%;object-fit:cover}
.modal-hero-gr{position:absolute;inset:0;background:linear-gradient(0deg,var(--s1) 0%,rgba(18,19,28,.5) 48%,transparent 100%)}
.modal-x{
  position:absolute;top:14px;right:14px;width:36px;height:36px;border-radius:50%;
  background:rgba(11,12,18,.8);color:rgba(238,237,245,.8);
  display:flex;align-items:center;justify-content:center;
  border:1px solid rgba(255,255,255,.1);backdrop-filter:blur(10px);
  cursor:pointer;z-index:2;transition:all .2s;
}
.modal-x:hover{background:rgba(248,113,113,.3);color:#fff}
.modal-body{padding:4px 24px 32px}@media(min-width:600px){.modal-body{padding:6px 34px 36px}}
.modal-grid{display:grid;gap:24px}@media(min-width:560px){.modal-grid{grid-template-columns:158px 1fr}}
.modal-poster{width:100%;border-radius:12px;overflow:hidden;aspect-ratio:2/3;box-shadow:0 24px 56px rgba(0,0,0,.65);border:1px solid var(--br);flex-shrink:0}
.modal-title{font-family:'Sora',sans-serif;font-size:28px;font-weight:800;letter-spacing:-.03em;line-height:1.05;margin-bottom:10px}
@media(min-width:560px){.modal-title{font-size:34px}}
.modal-tags{display:flex;gap:7px;flex-wrap:wrap;margin-bottom:15px}
.mtag{
  padding:5px 12px;border-radius:100px;font-size:11.5px;font-weight:600;
  background:var(--s2);color:var(--t2);font-family:'DM Mono',monospace;
  letter-spacing:.03em;display:flex;align-items:center;gap:4px;
  border:1px solid var(--br);
}
.mtag-a{background:var(--ag);color:var(--a);border-color:var(--ab)}
.modal-desc{font-size:14.5px;color:var(--t2);line-height:1.8;margin-bottom:20px}
.modal-ig{
  display:grid;grid-template-columns:repeat(2,1fr);gap:12px;
  padding:18px;border-radius:12px;background:var(--s2);margin-bottom:20px;
}
@media(min-width:480px){.modal-ig{grid-template-columns:repeat(3,1fr)}}
.m-igl{font-size:10px;font-weight:700;letter-spacing:.14em;text-transform:uppercase;color:var(--t3);margin-bottom:3px;font-family:'DM Mono',monospace}
.m-igv{font-size:13.5px;font-weight:700;color:var(--tx)}
.modal-cast{display:flex;gap:7px;flex-wrap:wrap;margin-bottom:20px}
.modal-cast-chip{
  padding:5px 13px;border-radius:100px;font-size:12px;font-weight:600;
  background:var(--s2);color:var(--t2);border:1px solid var(--br);
  transition:all .2s;
}
.modal-cast-chip:hover{border-color:var(--a);color:var(--a)}
.modal-actions{display:flex;gap:10px;flex-wrap:wrap;margin-top:4px}

/* ═══════
   SEARCH
═══════ */
.srch-wrap{position:relative;margin-bottom:30px}
.srch-ico{position:absolute;left:18px;top:50%;transform:translateY(-50%);color:var(--t2);pointer-events:none}
.srch-in{
  width:100%;padding:16px 20px 16px 52px;
  border-radius:14px;border:1px solid var(--br);
  background:var(--s2);color:var(--tx);
  font-size:15px;font-family:'DM Sans',sans-serif;
  outline:none;transition:border-color .2s;
}
.srch-in:focus{border-color:var(--a)}
.srch-in::placeholder{color:var(--t3)}

/* ═══════
   TOGGLE
═══════ */
.tog{position:relative;width:46px;height:24px;cursor:pointer;display:inline-block;flex-shrink:0}
.tog input{opacity:0;width:0;height:0;position:absolute}
.trk{position:absolute;inset:0;background:var(--s3);border-radius:24px;transition:.3s;border:1px solid var(--br)}
.trk::before{content:'';position:absolute;height:16px;width:16px;left:3px;bottom:3px;background:var(--t2);border-radius:50%;transition:.3s}
input:checked+.trk{background:var(--a);border-color:var(--a)}
input:checked+.trk::before{transform:translateX(22px);background:#0B0C12}

/* ═══════
   ADMIN
═══════ */
.astats{display:grid;gap:14px;grid-template-columns:repeat(2,1fr);margin-bottom:24px}
@media(min-width:768px){.astats{grid-template-columns:repeat(4,1fr)}}
.astat{
  background:var(--s1);border-radius:14px;padding:22px;
  border:1px solid var(--br);position:relative;overflow:hidden;
}
.astat::after{content:'';position:absolute;top:-32px;right:-32px;width:90px;height:90px;border-radius:50%;background:var(--ag);pointer-events:none}
.astat-v{font-family:'Sora',sans-serif;font-size:32px;font-weight:800;color:var(--a);line-height:1;margin-top:4px}
.astat-l{font-size:11px;font-weight:700;letter-spacing:.1em;text-transform:uppercase;color:var(--t3);margin-top:5px;font-family:'DM Mono',monospace}
.astat-i{color:var(--a);margin-bottom:10px;display:flex;align-items:center}
.atabs{display:flex;gap:3px;background:var(--s2);border-radius:12px;padding:4px;margin-bottom:24px;overflow-x:auto;scrollbar-width:none;flex-wrap:nowrap}
.atabs::-webkit-scrollbar{display:none}
.atab{flex-shrink:0;padding:9px 15px;border-radius:9px;font-size:12.5px;font-weight:700;color:var(--t2);transition:all .2s;cursor:pointer;white-space:nowrap;display:flex;align-items:center;gap:7px}
.atab.on{background:var(--s1);color:var(--tx);box-shadow:0 2px 10px rgba(0,0,0,.3)}
.inp{
  width:100%;padding:11px 15px;border-radius:9px;
  background:var(--s2);border:1px solid var(--br);color:var(--tx);
  font-family:'DM Sans',sans-serif;font-size:13.5px;outline:none;
  transition:border-color .2s;
}
.inp:focus{border-color:var(--a)}textarea.inp{resize:vertical;min-height:80px}
.lbl{display:block;font-size:10.5px;font-weight:700;letter-spacing:.1em;text-transform:uppercase;color:var(--t2);margin-bottom:5px;font-family:'DM Mono',monospace}
.fg{margin-bottom:15px}
.tblw{overflow-x:auto;border-radius:13px;border:1px solid var(--br)}
.mn-tbl{width:100%;border-collapse:collapse}
.mn-tbl th{font-size:10px;font-weight:700;color:var(--t3);letter-spacing:.1em;text-transform:uppercase;padding:13px 15px;text-align:left;border-bottom:1px solid var(--br);font-family:'DM Mono',monospace;white-space:nowrap;background:var(--s1)}
.mn-tbl td{padding:13px 15px;border-bottom:1px solid var(--br);font-size:13px;color:var(--tx)}
.mn-tbl tr:last-child td{border-bottom:none}.mn-tbl tr:hover td{background:var(--s2)}
.notif{background:var(--s2);border-radius:11px;padding:14px 16px;border-left:3px solid var(--a);margin-bottom:9px;display:flex;align-items:flex-start;gap:12px;animation:slideR .3s ease}
.notif.gn{border-color:var(--gn)}.notif.rd{border-color:var(--rd)}
.n-ttl{font-size:13.5px;font-weight:700;margin-bottom:2px;font-family:'Sora',sans-serif}
.n-sub{font-size:12px;color:var(--t2)}.n-time{font-size:10.5px;color:var(--t3);font-family:'DM Mono',monospace;margin-left:auto;flex-shrink:0}
.log-row{background:var(--s2);border-radius:10px;padding:12px 15px;margin-bottom:8px;display:flex;align-items:center;gap:12px}
.log-dot{width:8px;height:8px;border-radius:50%;background:var(--a);flex-shrink:0}
.log-txt{font-size:13px;color:var(--tx);flex:1}.log-time{font-size:11px;color:var(--t3);font-family:'DM Mono',monospace;flex-shrink:0}
.seo-box{background:var(--s2);border-radius:13px;padding:20px;border:1px solid var(--br);margin-top:8px}
.seo-ttl{font-size:11px;font-weight:700;letter-spacing:.12em;text-transform:uppercase;color:var(--ph);margin-bottom:15px;font-family:'DM Mono',monospace}
.notif-badge{background:var(--a);color:#0B0C12;font-size:9.5px;font-weight:800;width:18px;height:18px;border-radius:50%;display:inline-flex;align-items:center;justify-content:center;margin-left:3px}

/* ═══════
   LOGIN
═══════ */
.login-wrap{min-height:100vh;display:flex;align-items:center;justify-content:center;padding:24px}
.login-card{width:100%;max-width:400px;background:var(--s1);border-radius:20px;padding:38px;border:1px solid var(--br);box-shadow:var(--sh)}

/* ═══════
   TOAST
═══════ */
.toast{
  position:fixed;bottom:74px;left:50%;transform:translateX(-50%);
  background:var(--s1);color:var(--tx);
  padding:12px 24px;border-radius:12px;
  font-size:13.5px;font-weight:700;z-index:9999;white-space:nowrap;
  box-shadow:var(--sh);animation:toastin .3s ease;pointer-events:none;
  border:1px solid var(--br);display:flex;align-items:center;gap:10px;
}
.toast-dot{width:8px;height:8px;border-radius:50%;background:var(--a);flex-shrink:0}
@media(min-width:768px){.toast{bottom:28px}}

/* ═══════════
   BACK TO TOP
═══════════ */
.btt{
  position:fixed;bottom:80px;right:16px;z-index:300;
  width:42px;height:42px;border-radius:50%;
  background:var(--a);color:#0B0C12;
  display:flex;align-items:center;justify-content:center;
  cursor:pointer;box-shadow:0 8px 24px var(--ag);transition:transform .22s;
}
.btt:hover{transform:translateY(-3px)}
@media(min-width:768px){.btt{bottom:28px;right:28px}}

/* ════════
   SHIMMER
════════ */
.shim{
  background:linear-gradient(90deg,var(--s2) 25%,var(--s3) 50%,var(--s2) 75%);
  background-size:600px 100%;animation:shimmer 1.5s ease infinite;
}

/* ════════
   FOOTER
════════ */
.footer{background:var(--s1);border-top:1px solid var(--br);padding:52px 24px 92px}
@media(min-width:768px){.footer{padding:60px 88px 60px}}
.footer-in{max-width:1200px;margin:0 auto}
.footer-top{display:grid;gap:40px;grid-template-columns:1fr;margin-bottom:44px}
@media(min-width:640px){.footer-top{grid-template-columns:2fr 1fr 1fr}}
@media(min-width:900px){.footer-top{grid-template-columns:2.5fr 1fr 1fr 1fr}}
.footer-logo{
  font-family:'Sora',sans-serif;font-size:21px;font-weight:800;
  letter-spacing:-.02em;margin-bottom:12px;
  display:flex;align-items:center;gap:11px;
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
  color:var(--a);margin-bottom:18px;font-family:'DM Mono',monospace;
}
.footer-lnks{display:flex;flex-direction:column;gap:11px}
.footer-lnk{font-size:13.5px;color:var(--t2);cursor:pointer;transition:color .2s;font-weight:500}
.footer-lnk:hover{color:var(--tx)}
.footer-bot{
  display:flex;align-items:center;justify-content:space-between;
  flex-wrap:wrap;gap:12px;padding-top:30px;border-top:1px solid var(--br);
}
.footer-copy{font-size:12px;color:var(--t3)}.footer-legal{display:flex;gap:18px}
.footer-legal a{font-size:12px;color:var(--t3);cursor:pointer;transition:color .2s}.footer-legal a:hover{color:var(--t2)}
.footer-install{
  display:inline-flex;align-items:center;gap:8px;margin-top:16px;
  padding:10px 20px;border-radius:10px;background:var(--s2);color:var(--tx);
  font-size:13px;font-weight:700;border:1px solid var(--br);cursor:pointer;transition:all .2s;
}
.footer-install:hover{border-color:var(--a);color:var(--a)}

/* ════════
   LEGAL
════════ */
.legal{max-width:760px;margin:0 auto}
.legal h1{font-family:'Sora',sans-serif;font-size:36px;font-weight:800;letter-spacing:-.03em;margin-bottom:6px}
.legal-dt{font-size:12px;color:var(--t3);font-family:'DM Mono',monospace;margin-bottom:30px}
.legal h2{font-family:'Sora',sans-serif;font-size:19px;font-weight:700;margin:28px 0 10px}
.legal p{font-size:14px;color:var(--t2);line-height:1.82;margin-bottom:13px}
.legal ul{padding-left:20px;margin-bottom:13px}.legal li{font-size:14px;color:var(--t2);line-height:1.82;margin-bottom:6px}

/* UTILS */
.mn-hr{height:1px;background:var(--br)}
.empty{text-align:center;padding:68px 20px;color:var(--t2)}
.empty-i{font-size:52px;margin-bottom:14px;opacity:.22}.empty-t{font-size:15px;font-weight:600}
@media(max-width:360px){.hero-title{font-size:38px}.btn{padding:9px 18px;font-size:13px}}
  `;
  document.head.appendChild(st);
}

/* ═══════ CONSTANTS ═══════ */
const GENRES = ["All","Action","Adventure","Comedy","Drama","Horror","Romance","Sci-Fi","Thriller","Animation"];
const ADMIN_PASS = "movienation";

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
async function saveBulkMovies(movies){LS.s("mn5m",movies);if(isFirebaseConfigured()){await saveAllMoviesToFirebase(movies);}}
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
      {er?<div style={{position:"absolute",inset:0,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",gap:8,color:"var(--t3)",fontSize:12}}>{I.film}<span>No image</span></div>
        :<img src={src} alt={alt||""} className={className} loading="lazy" style={{opacity:ok?1:0,transition:"opacity .4s",width:"100%",height:"100%",objectFit:"cover"}} onLoad={()=>setOk(true)} onError={()=>setEr(true)}/>}
    </div>
  );
}

/* ═══════ MOVIE CARD ═══════ */
function MCard({movie,onClick,fullWidth}){
  if(!movie) return null;
  return(
    <div className={`card${fullWidth?" card-full":""}`} onClick={()=>onClick(movie)} role="button" tabIndex={0} onKeyDown={e=>e.key==="Enter"&&onClick(movie)}>
      <div className="card-img">
        <Img src={movie.poster} alt={movie.title}/>
        <div className="card-ov"/>
        <div className="card-play">{I.playSm}</div>
        <div className="card-inf">
          <div className="card-name">{movie.title}</div>
          <div className="card-sub">{movie.year}{movie.runtime?` · ${fmtT(movie.runtime)}`:""}</div>
        </div>
        {movie.genres?.[0]&&<div className="card-badge">{movie.genres[0]}</div>}
        {movie.status==="draft"&&<div className="card-draft">Draft</div>}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════
   WATCH PAGE — full dedicated page
═══════════════════════════════════ */
function WatchPage({movie,allMovies,onBack,onDl,showToast}){
  const vid = ytId(movie.trailerUrl);
  const shareUrl = `${window.location.origin}?m=${movie.slug}`;
  const rec = useMemo(()=>allMovies.filter(m=>m.id!==movie.id&&m.status!=="draft"&&m.genres?.some(g=>movie.genres?.includes(g))).slice(0,6),[movie,allMovies]);

  const shares = [
    { label:"Facebook", cls:"share-btn-fb",
      Icon:()=><SocialIcons.Facebook size={28}/>,
      url:`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}` },
    { label:"X / Twitter", cls:"share-btn-tw",
      Icon:()=><SocialIcons.Twitter size={28}/>,
      url:`https://twitter.com/intent/tweet?text=${encodeURIComponent(movie.title)}&url=${encodeURIComponent(shareUrl)}` },
    { label:"WhatsApp", cls:"share-btn-wa",
      Icon:()=><SocialIcons.WhatsApp size={28}/>,
      url:`https://wa.me/?text=${encodeURIComponent(movie.title+" "+shareUrl)}` },
    { label:"Instagram", cls:"share-btn-ig",
      Icon:()=><SocialIcons.Instagram size={28}/>,
      url:null },
  ];

  useEffect(()=>{ document.title=`${movie.title} — Watch | MovieNation`; return()=>{ document.title="MovieNation"; }; },[movie.title]);
  useEffect(()=>{ window.scrollTo({top:0}); },[movie.id]);

  return(
    <div className="watch-page">
      {/* BACKDROP */}
      <div className="watch-bg">
        <Img src={movie.backdrop} alt={movie.title} style={{width:"100%",height:"100%"}}/>
        <div className="watch-bg-ov"/>
        <button className="watch-back" onClick={onBack}>{I.back} Back</button>
      </div>

      {/* BODY */}
      <div className="watch-body">
        <div className="watch-inner">
          <div className="watch-grid">
            {/* ── MAIN COLUMN ── */}
            <div>
              {/* Player */}
              <div className="watch-player">
                {vid
                  ? <iframe src={`https://www.youtube.com/embed/${vid}?rel=0&modestbranding=1`}
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen title={`${movie.title} trailer`}/>
                  : <div className="watch-player-placeholder">
                      <div className="watch-play-btn" onClick={()=>{ window.open(movie.watchUrl||"#","_blank","noopener,noreferrer"); showToast("Opening stream…"); }}>
                        {I.play}
                      </div>
                      <p className="watch-play-hint">Click to open the stream</p>
                    </div>
                }
              </div>
              {vid&&<p style={{fontSize:12,color:"var(--t3)",marginBottom:14,fontFamily:"'DM Mono',monospace"}}>Showing official trailer preview</p>}

              {/* Title + meta */}
              <div className="watch-title-row">
                <h1 className="watch-title">{movie.title}</h1>
              </div>
              <div className="watch-meta-row">
                <span className="watch-tag">{movie.year}</span>
                {movie.genres?.map(g=><span key={g} className="watch-tag">{g}</span>)}
                {movie.runtime&&<span className="watch-tag">{I.clock} {fmtT(movie.runtime)}</span>}
                {movie.language&&<span className="watch-tag">{I.globe} {movie.language}</span>}

              </div>

              {/* Action buttons */}
              <div className="watch-actions">
                <button className="btn bp" style={{padding:"13px 28px",fontSize:15}} onClick={()=>{ window.open(movie.watchUrl||"#","_blank","noopener,noreferrer"); showToast("Opening stream…"); }}>
                  {I.play} Stream Now
                </button>
                <button className="btn bo" onClick={()=>onDl(movie)}>
                  {I.dl} Download
                </button>
                {vid&&<button className="btn bpu sm" onClick={()=>window.open(`https://www.youtube.com/watch?v=${vid}`,"_blank","noopener")}>
                  {I.trailer} Full Trailer on YouTube
                </button>}
              </div>

              {/* Description */}
              {movie.desc&&<p className="watch-desc">{movie.desc}</p>}

              {/* Info grid */}
              <div className="watch-ig">
                {movie.director&&<div><div className="watch-ig-lbl">Director</div><div className="watch-ig-val">{movie.director}</div></div>}
                {movie.country&&<div><div className="watch-ig-lbl">Country</div><div className="watch-ig-val">{movie.country}</div></div>}
                {movie.runtime&&<div><div className="watch-ig-lbl">Runtime</div><div className="watch-ig-val">{fmtT(movie.runtime)}</div></div>}
                {movie.language&&<div><div className="watch-ig-lbl">Language</div><div className="watch-ig-val">{movie.language}</div></div>}
                <div><div className="watch-ig-lbl">Year</div><div className="watch-ig-val">{movie.year}</div></div>

              </div>

              {/* Cast */}
              {movie.cast?.length>0&&(
                <div className="watch-cast-wrap">
                  <div className="watch-cast-lbl">Cast</div>
                  <div className="watch-cast">{movie.cast.map((c,i)=><span key={i} className="watch-cast-chip">{c}</span>)}</div>
                </div>
              )}

              {/* SHARE */}
              <div className="watch-share">
                <div className="watch-share-ttl">{I.trend} Share This Movie</div>
                <div className="watch-share-grid">
                  {shares.map(s=>(
                    <button key={s.label} className={`share-btn ${s.cls}`}
                      onClick={()=>{ if(s.url) window.open(s.url,"_blank","noopener,width=600,height=500"); else showToast("Open Instagram and paste the link manually."); }}>
                      <s.Icon/>
                      <span>{s.label}</span>
                    </button>
                  ))}
                </div>
                {/* Copy link */}
                <div className="watch-link-box">
                  <span className="watch-link-url">{shareUrl}</span>
                  <button className="btn bo sm" style={{flexShrink:0}} onClick={()=>{ navigator.clipboard?.writeText(shareUrl); showToast("Link copied!"); }}>
                    {I.copy} Copy Link
                  </button>
                </div>
              </div>
            </div>

            {/* ── SIDEBAR ── */}
            <div className="watch-sidebar">
              {/* Poster card */}
              <div className="watch-card-side">
                <div className="watch-poster-side">
                  <Img src={movie.poster} alt={movie.title} style={{width:"100%",height:"100%"}}/>
                </div>
                <div className="watch-sidebar-info">
                  <div className="watch-sidebar-title">{movie.title}</div>
                  <div className="watch-sidebar-meta">{movie.year} · {movie.genres?.slice(0,2).join(", ")}</div>
                  <div style={{display:"flex",gap:9,flexDirection:"column"}}>
                    <button className="btn bp" style={{width:"100%",justifyContent:"center"}} onClick={()=>{ window.open(movie.watchUrl||"#","_blank","noopener,noreferrer"); showToast("Opening stream…"); }}>
                      {I.play} Stream Now
                    </button>
                    <button className="btn bo sm" style={{width:"100%",justifyContent:"center"}} onClick={()=>onDl(movie)}>
                      {I.dl} Download
                    </button>
                  </div>
                </div>
              </div>

              {/* Recommended */}
              {rec.length>0&&(
                <div className="watch-rec">
                  <div className="watch-rec-ttl">You May Also Like</div>
                  {rec.map(m=>(
                    <div key={m.id} className="watch-rec-row" onClick={()=>{ window.scrollTo({top:0}); setTimeout(()=>document.dispatchEvent(new CustomEvent("watchM",{detail:m})),50); }}>
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
                <><div style={{fontSize:11,fontWeight:700,letterSpacing:".1em",textTransform:"uppercase",color:"var(--t3)",marginBottom:8,fontFamily:"'DM Mono',monospace"}}>Cast</div>
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
      <div className="hero-ov"/>
      <div className="hero-c">
        <div className="hero-badge">{I.star} Featured</div>
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
function Trending({movies,onWatch}){
  const list=useMemo(()=>movies.filter(m=>m.trending&&m.status!=="draft").sort((a,b)=>(a.trendingRank||99)-(b.trendingRank||99)).slice(0,5),[movies]);
  if(!list.length) return null;
  return(
    <div className="sec">
      <div style={{marginBottom:22}}><div className="eye">This Week</div><div className="ttl">Top 5 Trending</div></div>
      {list.map((m,i)=>(
        <div key={m.id} className="t-row" onClick={()=>onWatch(m)} role="button" tabIndex={0}>
          <div className={`t-rank ${i<3?"top":""}`}>#{i+1}</div>
          <div className="t-thumb"><Img src={m.poster} alt={m.title} style={{width:"100%",height:"100%"}}/></div>
          <div className="t-info">
            <div className="t-title">{m.title}</div>
            <div className="t-meta"><span>{m.year}</span><span>·</span><span>{m.genres?.[0]}</span>{m.runtime&&<><span>·</span><span style={{display:"flex",alignItems:"center",gap:3}}>{I.clock}{fmtT(m.runtime)}</span></>}</div>
          </div>

        </div>
      ))}
    </div>
  );
}

/* ═══════ HOME ═══════ */
function HomePage({movies,onMovieClick,onWatch}){
  const pub=useMemo(()=>movies.filter(m=>m.status!=="draft"),[movies]);
  const recent=useMemo(()=>[...pub].sort((a,b)=>b.year-a.year).slice(0,12),[pub]);
  const byGenre=useMemo(()=>{const o={};["Action","Sci-Fi","Drama","Comedy","Thriller"].forEach(g=>{const l=pub.filter(m=>m.genres?.includes(g)).slice(0,10);if(l.length) o[g]=l;});return o;},[pub]);
  return(
    <>
      <Hero movies={movies} onMovieClick={onMovieClick} onWatch={onWatch}/>
      <Trending movies={movies} onWatch={onWatch}/>
      <div className="mn-hr"/>
      <div className="sec">
        <div className="sh"><div className="eye">Fresh Picks</div><div className="ttl">Latest Releases</div></div>
        <div className="mn-grid">{recent.map(m=><MCard key={m.id} movie={m} onClick={onMovieClick} fullWidth/>)}</div>
      </div>
      {Object.entries(byGenre).map(([g,list])=>(
        <div key={g}><div className="mn-hr"/>
          <div className="sec">
            <div className="sh"><div className="eye">Category</div><div className="ttl">{g}</div></div>
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
  const pub=movies.filter(m=>m.status!=="draft");
  const filtered=useMemo(()=>genre==="All"?pub:pub.filter(m=>m.genres?.includes(genre)),[pub,genre]);
  return(
    <div className="sec">
      <div className="sh"><div className="eye">Browse All</div><div className="ttl">Explore Movies</div></div>
      <div className="chips">{GENRES.map(g=><button key={g} className={`chip ${genre===g?"on":""}`} onClick={()=>setGenre(g)}>{g}</button>)}</div>
      {filtered.length===0?<div className="empty"><div className="empty-i" style={{opacity:.2}}><svg width="44" height="44" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><rect x="2" y="2" width="20" height="20" rx="2.18"/><line x1="7" y1="2" x2="7" y2="22"/><line x1="17" y1="2" x2="17" y2="22"/><line x1="2" y1="12" x2="22" y2="12"/></svg></div><p className="empty-t">No movies in this genre yet.</p></div>
        :<div className="mn-grid">{filtered.map(m=><MCard key={m.id} movie={m} onClick={onMovieClick} fullWidth/>)}</div>}
    </div>
  );
}

/* ═══════ SEARCH ═══════ */
function SearchPage({movies,onMovieClick}){
  const[q,setQ]=useState("");
  const res=useMemo(()=>{
    if(!q.trim()) return [];
    const lq=q.toLowerCase();
    return movies.filter(m=>m.status!=="draft"&&(m.title?.toLowerCase().includes(lq)||m.genres?.some(g=>g.toLowerCase().includes(lq))||String(m.year).includes(lq)||m.director?.toLowerCase().includes(lq)||m.cast?.some(c=>c.toLowerCase().includes(lq))));
  },[q,movies]);
  return(
    <div className="sec">
      <div className="sh"><div className="eye">Find Movies</div><div className="ttl">Search</div></div>
      <div className="srch-wrap"><span className="srch-ico">{I.search}</span><input className="srch-in" placeholder="Search title, director, cast, genre, year…" value={q} onChange={e=>setQ(e.target.value)} autoFocus/></div>
      {q.trim()===""?<div className="empty"><div className="empty-i" style={{opacity:.2}}><svg width="44" height="44" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg></div><p className="empty-t">Start typing to search movies.</p></div>
        :res.length===0?<div className="empty"><div className="empty-i" style={{opacity:.2}}><svg width="44" height="44" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/><line x1="8" y1="11" x2="14" y2="11"/></svg></div><p className="empty-t">No results for "{q}"</p></div>
        :<><p style={{color:"var(--t2)",fontSize:13,marginBottom:18,fontWeight:600}}>{res.length} result{res.length!==1?"s":""} for "{q}"</p><div className="mn-grid">{res.map(m=><MCard key={m.id} movie={m} onClick={onMovieClick} fullWidth/>)}</div></>}
    </div>
  );
}

/* ═══════ SETTINGS ═══════ */
function Settings({dark,setDark}){
  return(
    <div className="sec" style={{maxWidth:540}}>
      <div className="sh"><div className="eye">Preferences</div><div className="ttl" style={{fontFamily:"'Sora',sans-serif",fontSize:28,fontWeight:900}}>Settings</div></div>
      <div style={{background:"var(--s1)",borderRadius:14,border:"1px solid var(--br)",overflow:"hidden",marginBottom:18}}>
        {[
          {ico:dark?I.moon:I.sun,title:dark?"Dark Mode":"Light Mode",sub:"Toggle site appearance",ctrl:<label className="tog"><input type="checkbox" checked={dark} onChange={e=>setDark(e.target.checked)}/><span className="trk"/></label>},
          {ico:I.film,title:"MovieNation",sub:"Version 5.0 · Browse, Watch & Download",ctrl:<span style={{fontSize:11,fontWeight:700,letterSpacing:".08em",textTransform:"uppercase",color:"var(--t3)",fontFamily:"'DM Mono',monospace"}}>v5.0</span>},
        ].map((r,i,a)=>(
          <div key={i} style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"17px 20px",borderBottom:i<a.length-1?"1px solid var(--br)":"none"}}>
            <div style={{display:"flex",alignItems:"center",gap:13}}>
              <div style={{width:40,height:40,borderRadius:10,background:"var(--s2)",display:"flex",alignItems:"center",justifyContent:"center",color:"var(--a)",flexShrink:0}}>{r.ico}</div>
              <div><div style={{fontWeight:700,fontSize:15}}>{r.title}</div><div style={{fontSize:12.5,color:"var(--t2)",marginTop:2}}>{r.sub}</div></div>
            </div>
            {r.ctrl}
          </div>
        ))}
      </div>
      <p style={{fontSize:13,color:"var(--t2)",lineHeight:1.75}}>MovieNation is a movie discovery platform. We provide links to external sites for streaming and downloading — no content is hosted directly on this platform.</p>
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
      <h1 style={{fontFamily:"'Sora',sans-serif",fontSize:28,fontWeight:900,letterSpacing:"-.03em",marginBottom:6}}>Admin Access</h1>
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
    setMovies(u);saveM(u);addLog("Deleted",m?.title);setLog(getLog());
    showToast("Movie deleted");
  };
  const openF=(m=null)=>{setEdit(m);setForm(true);window.scrollTo({top:0,behavior:"smooth"});};
  const toggleT=id=>{
    const m=movies.find(x=>x.id===id);
    const max=movies.filter(x=>x.trending).length;
    const u=movies.map(x=>x.id===id?{...x,trending:!x.trending,trendingRank:x.trending?0:max+1}:x);
    setMovies(u);saveM(u);showToast(m.trending?"Removed from trending":"Marked as trending");
  };
  const toggleF=id=>{
    const u=movies.map(m=>m.id===id?{...m,featured:!m.featured}:m);
    setMovies(u);saveM(u);showToast("Featured updated");
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
        <div className="ttl" style={{fontFamily:"'Sora',sans-serif",fontSize:26,fontWeight:900}}>Admin Panel</div>
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
          <div style={{fontFamily:"'Sora',sans-serif",fontSize:15,fontWeight:800,marginBottom:3}}>Streams per Movie</div>
          <div style={{fontSize:11.5,color:"var(--t3)",fontFamily:"'DM Mono',monospace",marginBottom:14,letterSpacing:".03em"}}>
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
          <div style={{fontFamily:"'Sora',sans-serif",fontSize:15,fontWeight:800,marginBottom:14}}>Live Statistics</div>
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
              <span style={{fontSize:13.5,fontWeight:800,fontFamily:"'Sora',sans-serif",color:"var(--tx)"}}>{String(v)}</span>
            </div>
          ))}
        </div>
      </div>

      {/* All movies ranked by streams */}
      <div style={{background:"var(--s1)",borderRadius:13,padding:20,border:"1px solid var(--br)"}}>
        <div style={{fontFamily:"'Sora',sans-serif",fontSize:15,fontWeight:800,marginBottom:14,display:"flex",alignItems:"center",gap:8}}>
          {AI.eyeStat} All Movies — Stream & Download Counts
        </div>
        <div className="tblw">
          <table className="mn-tbl">
            <thead><tr><th>#</th><th>Movie</th><th>Year</th><th>Streams</th><th>Downloads</th><th>Status</th></tr></thead>
            <tbody>
              {[...movies].sort((a,b)=>(b.views||0)-(a.views||0)).map((m,i)=>(
                <tr key={m.id}>
                  <td style={{color:"var(--t3)",fontFamily:"'DM Mono',monospace",fontSize:12}}>{i+1}</td>
                  <td style={{fontWeight:700,maxWidth:180,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{m.title}</td>
                  <td style={{color:"var(--t2)"}}>{m.year}</td>
                  <td style={{fontWeight:800,fontFamily:"'Sora',sans-serif",color:m.views>0?"var(--a)":"var(--t3)"}}>{(m.views||0).toLocaleString()}</td>
                  <td style={{fontWeight:700,color:m.dlClicks>0?"var(--tx)":"var(--t3)"}}>{(m.dlClicks||0).toLocaleString()}</td>
                  <td><span style={{padding:"3px 9px",borderRadius:100,fontSize:11,fontWeight:700,background:m.status==="published"?"rgba(52,211,153,.12)":"rgba(129,140,248,.12)",color:m.status==="published"?"var(--gn)":"var(--ph)",fontFamily:"'DM Mono',monospace"}}>{m.status||"published"}</span></td>
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
          let u;
          if(edit){u=movies.map(x=>x.id===m.id?m:x);}
          else{u=[{...m,id:Date.now().toString(),addedAt:todayS(),views:0,dlClicks:0},...movies];}
          setMovies(u);saveM(u);setForm(false);setEdit(null);
          showToast(edit?"Movie updated!":"Movie added!");
          if(!edit){addNf("New movie published",m.title,"gn");setNotifs(getNf());}
          addLog(edit?"Edited":"Added",m.title);setLog(getLog());
        }}
        onCancel={()=>{setForm(false);setEdit(null);}}
      />}

      <p style={{fontSize:12,color:"var(--t3)",marginBottom:12,fontFamily:"'DM Mono',monospace"}}>
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
                <td><span style={{padding:"3px 9px",borderRadius:100,fontSize:11,fontWeight:700,background:m.status==="published"?"rgba(52,211,153,.12)":"rgba(129,140,248,.12)",color:m.status==="published"?"var(--gn)":"var(--ph)",fontFamily:"'DM Mono',monospace"}}>{m.status||"published"}</span></td>
                <td style={{fontWeight:800,fontFamily:"'Sora',sans-serif",color:m.views>0?"var(--a)":"var(--t3)"}}>{(m.views||0).toLocaleString()}</td>
                <td style={{fontWeight:700}}>{(m.dlClicks||0).toLocaleString()}</td>
                <td><label className="tog" style={{width:36,height:20}}><input type="checkbox" checked={!!m.trending} onChange={()=>toggleT(m.id)}/><span className="trk"/></label></td>
                <td><label className="tog" style={{width:36,height:20}}><input type="checkbox" checked={!!m.featured} onChange={()=>toggleF(m.id)}/><span className="trk"/></label></td>
                <td style={{fontSize:11,color:"var(--t3)",fontFamily:"'DM Mono',monospace",maxWidth:110,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{m.slug}</td>
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
            <div style={{fontSize:12,color:"var(--t2)",fontFamily:"'DM Mono',monospace",marginTop:2}}>{m.year} · {m.genres?.[0]||"—"}</div>
            {m.trending&&<div style={{fontSize:11.5,color:"var(--a)",fontWeight:700,marginTop:4,display:"flex",alignItems:"center",gap:5}}>{AI.starSolid} Trending #{m.trendingRank||"—"}</div>}
          </div>
          <div style={{display:"flex",gap:8,alignItems:"center",flexShrink:0}}>
            {m.trending&&(
              <input type="number" min="1" max="5" value={m.trendingRank||1}
                onChange={e=>{const u=movies.map(x=>x.id===m.id?{...x,trendingRank:Number(e.target.value)}:x);setMovies(u);saveM(u);}}
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
        <div className="ttl" style={{fontFamily:"'Sora',sans-serif",fontSize:22,fontWeight:900,marginBottom:6}}>Import Movies</div>
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
                  const u=[...imported,...movies];setMovies(u);saveM(u);
                  showToast(`${imported.length} movie${imported.length!==1?"s":""} imported!`);
                  addNf(`${imported.length} movies imported`,"Bulk import completed","gn");setNotifs(getNf());
                  addLog(`Imported ${imported.length} movies`,"Bulk");setLog(getLog());
                }catch{showToast("Import failed: check your file format");}
              };
              inp.click();
            }}>
            <div style={{color:"var(--a)",display:"flex",justifyContent:"center",marginBottom:12}}>{f.ico}</div>
            <div style={{fontFamily:"'Sora',sans-serif",fontSize:16,fontWeight:800,marginBottom:6}}>{f.l}</div>
            <div style={{fontSize:12.5,color:"var(--t2)"}}>{f.d}</div>
          </div>
        ))}
      </div>
      <div style={{background:"var(--s2)",borderRadius:12,padding:18,border:"1px solid var(--br)"}}>
        <div style={{fontSize:11,fontWeight:700,color:"var(--a)",marginBottom:10,fontFamily:"'DM Mono',monospace",letterSpacing:".1em"}}>JSON FORMAT EXAMPLE</div>
        <pre style={{fontSize:11,color:"var(--t2)",fontFamily:"'DM Mono',monospace",overflow:"auto",whiteSpace:"pre-wrap",lineHeight:1.6}}>{`[
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
        <div style={{fontFamily:"'Sora',sans-serif",fontSize:20,fontWeight:800}}>Notifications</div>
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
        <div style={{fontFamily:"'Sora',sans-serif",fontSize:20,fontWeight:800}}>Activity Log</div>
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
      <div style={{fontFamily:"'Sora',sans-serif",fontSize:20,fontWeight:900,marginBottom:20}}>{movie?"Edit Movie":"Add Movie"}</div>
      <div className="fg"><label className="lbl">Title *</label><input className="inp" value={f.title} onChange={e=>set("title",e.target.value)}/></div>
      <div className="fg"><label className="lbl">URL Slug (Auto)</label><div style={{display:"flex",gap:8}}><input className="inp" value={f.slug} onChange={e=>set("slug",e.target.value)} style={{fontFamily:"'DM Mono',monospace",fontSize:12.5}}/><button className="btn bo sm" onClick={()=>set("slug",slugify(f.title))} style={{flexShrink:0}}>↺</button></div>{f.slug&&<div style={{fontSize:11,color:"var(--t3)",marginTop:3,fontFamily:"'DM Mono',monospace"}}>/movies/{f.slug}</div>}</div>
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
  const items=[{k:"home",l:"Movies",i:I.home},{k:"search",l:"Search",i:I.search},{k:"explorer",l:"Explorer",i:I.compass},{k:"settings",l:"Settings",i:I.settings}];
  return(<>
    <nav className="nav">
      <div className="nav-logo" onClick={()=>setPage("home")}>
        <img src="/favicon.png" alt="MN" onError={e=>e.target.style.display="none"}/>
        <div className="nav-logo-txt">Movie<b>Nation</b></div>
      </div>
      <div className="nav-links">{items.map(n=><button key={n.k} className={`nav-item ${page===n.k?"on":""}`} onClick={()=>setPage(n.k)}>{n.i}{n.l}</button>)}</div>
      <div className="nav-r"><button className="theme-btn" onClick={()=>setDark(!dark)} title="Toggle theme">{dark?I.sun:I.moon}</button></div>
    </nav>
    <nav className="bnav">{items.map(n=><button key={n.k} className={`bnav-item ${page===n.k?"on":""}`} onClick={()=>setPage(n.k)}>{n.i}<span>{n.l}</span></button>)}</nav>
  </>);
}

/* ═══════ FOOTER ═══════ */
function Footer({setPage}){
  const socs=[
    {i:<SocialIcons.Instagram size={17}/>,u:"https://instagram.com",l:"Instagram",bg:"linear-gradient(135deg,#f09433,#dc2743,#bc1888)"},
    {i:<SocialIcons.YouTube size={17}/>,u:"https://youtube.com",l:"YouTube",bg:"#FF0000"},
    {i:<SocialIcons.Twitter size={17}/>,u:"https://x.com",l:"X",bg:"#000"},
    {i:<SocialIcons.Facebook size={17}/>,u:"https://facebook.com",l:"Facebook",bg:"#1877F2"},
    {i:<SocialIcons.WhatsApp size={17}/>,u:"https://whatsapp.com",l:"WhatsApp",bg:"#25D366"},
    {i:<SocialIcons.TikTok size={17}/>,u:"https://tiktok.com",l:"TikTok",bg:"#010101"},
  ];
  return(<footer className="footer"><div className="footer-in">
    <div className="footer-top">
      <div>
        <div className="footer-logo"><img src="/favicon.png" alt="MN" style={{width:30,height:30,borderRadius:7}} onError={e=>e.target.style.display="none"}/> Movie<b>Nation</b></div>
        <p className="footer-desc">Your ultimate destination for discovering, streaming, and downloading movies across all genres worldwide.</p>
        <div className="footer-socs">{socs.map(s=>(
          <a key={s.l} href={s.u} target="_blank" rel="noopener noreferrer" className="fsoc" title={s.l}
            style={{color:typeof s.bg==="string"&&!s.bg.includes("gradient")?s.bg:"var(--t2)"}}
            onMouseEnter={e=>{e.currentTarget.style.background=s.bg;e.currentTarget.style.color="#fff";e.currentTarget.style.borderColor="transparent";}}
            onMouseLeave={e=>{e.currentTarget.style.background="var(--s2)";e.currentTarget.style.color="var(--t2)";e.currentTarget.style.borderColor="var(--br)";}}>
            {s.i}
          </a>
        ))}</div>
        <button className="footer-install"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg> Install Web App</button>
      </div>
      <div><div className="footer-col-t">Navigate</div><div className="footer-lnks">{[["home","Movies"],["explorer","Explorer"],["search","Search"],["settings","Settings"]].map(([k,l])=><span key={k} className="footer-lnk" onClick={()=>setPage(k)}>{l}</span>)}</div></div>
      <div><div className="footer-col-t">Genres</div><div className="footer-lnks">{["Action","Drama","Comedy","Sci-Fi","Thriller","Romance","Horror"].map(g=><span key={g} className="footer-lnk" onClick={()=>setPage("explorer")}>{g}</span>)}</div></div>
      <div><div className="footer-col-t">Legal</div><div className="footer-lnks"><span className="footer-lnk" onClick={()=>setPage("privacy")}>Privacy Policy</span><span className="footer-lnk" onClick={()=>setPage("terms")}>Terms of Service</span><span className="footer-lnk" onClick={()=>setPage("settings")}>About Us</span></div></div>
    </div>
    <div className="footer-bot">
      <span className="footer-copy">© {new Date().getFullYear()} MovieNation. All rights reserved.</span>
      <div className="footer-legal"><a onClick={()=>setPage("privacy")}>Privacy Policy</a><a onClick={()=>setPage("terms")}>Terms of Service</a></div>
    </div>
  </div></footer>);
}

/* ═══════ BACK TO TOP ═══════ */
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
  const[page,setPageRaw]=useState(()=>typeof window!=="undefined"&&window.location.search.includes("admin")?"admin":"home");
  const[watching,setWatching]=useState(null);
  const[selected,setSelected]=useState(null);
  const[toast,setToast]=useState(null);
  const[adminOK,setAdminOK]=useState(false);
  const[fbStatus,setFbStatus]=useState("idle");
  const tr=useRef(null);

  const setDark=v=>{setDarkRaw(v);saveDk(v);};
  const setPage=p=>{setPageRaw(p);setWatching(null);setSelected(null);window.scrollTo({top:0});};

  /* Subscribe to Firebase for real-time live updates */
  useEffect(()=>{
    if(!isFirebaseConfigured()) return;
    const unsub=subscribeToMovies(live=>{
      if(live.length>0){setMovies(live);LS.s("mn5m",live);setFbStatus("synced");}
    });
    return()=>unsub();
  },[]);

  const showToast=useCallback(msg=>{setToast(msg);clearTimeout(tr.current);tr.current=setTimeout(()=>setToast(null),2800);},[]);

  const onWatch=useCallback(async movie=>{
    const updated={...movie,views:(movie.views||0)+1};
    const newList=await saveMovie(updated,movies);
    setMovies(newList);
    setWatching(updated);
    setSelected(null);
    window.scrollTo({top:0});
  },[movies]);

  const onDl=useCallback(async movie=>{
    const updated={...movie,dlClicks:(movie.dlClicks||0)+1};
    const newList=await saveMovie(updated,movies);
    setMovies(newList);
    window.open(movie.downloadUrl||"#","_blank","noopener,noreferrer");
    showToast("Download starting…");
  },[movies,showToast]);

  useEffect(()=>{
    const fn=e=>{ const m=movies.find(x=>x.id===e.detail.id)||e.detail; onWatch(m); };
    document.addEventListener("watchM",fn);
    return()=>document.removeEventListener("watchM",fn);
  },[movies,onWatch]);

  const adminSetMovies=useCallback(async(newMovies)=>{setMovies(newMovies);await saveBulkMovies(newMovies);},[]);

  const showWatch=!!watching;
  const showNav=page!=="admin";

  return(
    <div className={dark?"dk":"lt"} style={{fontFamily:"'DM Sans',sans-serif",background:"var(--bg)",color:"var(--tx)",minHeight:"100vh"}}>
      {showNav&&<Nav page={page} setPage={setPage} dark={dark} setDark={setDark}/>}

      {/* Firebase status bar — admin only */}
      {page==="admin"&&adminOK&&isFirebaseConfigured()&&(
        <div style={{position:"fixed",top:68,left:0,right:0,zIndex:490,
          background:fbStatus==="synced"?"rgba(52,211,153,.1)":"rgba(245,158,11,.1)",
          borderBottom:`1px solid ${fbStatus==="synced"?"rgba(52,211,153,.28)":"rgba(245,158,11,.28)"}`,
          padding:"8px 44px",fontSize:12,fontWeight:700,
          display:"flex",alignItems:"center",gap:8,fontFamily:"'DM Mono',monospace"}}>
          <div style={{width:7,height:7,borderRadius:"50%",background:fbStatus==="synced"?"var(--gn)":"var(--a)",flexShrink:0}}/>
          {fbStatus==="synced"?"Firebase live — changes publish instantly to all visitors":"Connecting to Firebase…"}
        </div>
      )}

      {showWatch
        ?<div className="pg" style={{paddingTop:68}}>
            <WatchPage movie={watching} allMovies={movies} onBack={()=>{setWatching(null);window.scrollTo({top:0});}} onDl={onDl} showToast={showToast}/>
          </div>
        :<div className="pg">
            {page==="home"    &&<HomePage movies={movies} onMovieClick={setSelected} onWatch={onWatch}/>}
            {page==="explorer"&&<Explorer movies={movies} onMovieClick={setSelected}/>}
            {page==="search"  &&<SearchPage movies={movies} onMovieClick={setSelected}/>}
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
      {page!=="admin"&&!showWatch&&<BackToTop/>}
    </div>
  );
}
