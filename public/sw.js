// MovieNation Service Worker v3
// Strategy:
//   HTML/JS/CSS → Network-first (always fresh from server)
//   Images      → Cache-first (stable, rarely change)
//   API/Firebase → Network-only (never cache dynamic data)

const SHELL_CACHE  = "mn-shell-v3";
const IMAGE_CACHE  = "mn-images-v1";
const SHELL_FILES  = ["/", "/index.html", "/manifest.json", "/favicon.png"];

// ── Install: pre-cache only the app shell ─────────────────────────────────
self.addEventListener("install", e => {
  e.waitUntil(
    caches.open(SHELL_CACHE)
      .then(c => c.addAll(SHELL_FILES))
      .then(() => self.skipWaiting())
  );
});

// ── Activate: delete ALL old caches immediately ──────────────────────────
self.addEventListener("activate", e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys
          .filter(k => k !== SHELL_CACHE && k !== IMAGE_CACHE)
          .map(k => { console.log("[SW] Deleting old cache:", k); return caches.delete(k); })
      )
    ).then(() => self.clients.claim())
  );
});

// ── Fetch: smart strategy per resource type ───────────────────────────────
self.addEventListener("fetch", e => {
  const url = new URL(e.request.url);

  // Skip non-GET and cross-origin API calls (Firebase, fonts, etc.)
  if (e.request.method !== "GET") return;
  if (url.origin !== location.origin &&
      !url.hostname.includes("firebaseio") &&
      !url.hostname.includes("googleapis") &&
      !url.hostname.includes("fontshare") &&
      !url.hostname.includes("fonts.gstatic")) return;

  // Firebase & API → network only, never cache
  if (url.hostname.includes("firebaseio") ||
      url.hostname.includes("firestore.googleapis") ||
      url.hostname.includes("googleapis.com")) {
    return;
  }

  // Images → cache-first (they're stable)
  if (e.request.destination === "image") {
    e.respondWith(
      caches.open(IMAGE_CACHE).then(cache =>
        cache.match(e.request).then(cached => {
          if (cached) return cached;
          return fetch(e.request).then(res => {
            if (res.ok) cache.put(e.request, res.clone());
            return res;
          }).catch(() => cached);
        })
      )
    );
    return;
  }

  // HTML, JS, CSS → NETWORK FIRST — always get latest code
  // Falls back to cache only if truly offline
  e.respondWith(
    fetch(e.request)
      .then(res => {
        // Cache successful responses for offline fallback
        if (res.ok && url.origin === location.origin) {
          caches.open(SHELL_CACHE).then(c => c.put(e.request, res.clone()));
        }
        return res;
      })
      .catch(() => caches.match(e.request))
  );
});

// ── Push notifications ────────────────────────────────────────────────────
self.addEventListener("push", e => {
  let data = {
    title: "MovieNation",
    body:  "A new movie was just added!",
    icon:  "/favicon.png",
    badge: "/favicon.png",
    url:   "/",
  };
  if (e.data) { try { data = { ...data, ...e.data.json() }; } catch {} }

  e.waitUntil(
    self.registration.showNotification(data.title, {
      body:     data.body,
      icon:     data.icon,
      badge:    data.badge,
      image:    data.image || undefined,
      vibrate:  [100, 50, 100],
      data:     { url: data.url },
      actions:  [{ action:"watch", title:"Watch Now" }, { action:"dismiss", title:"Later" }],
      tag:      "mn-new-movie",
      renotify: true,
    })
  );
});

self.addEventListener("notificationclick", e => {
  e.notification.close();
  if (e.action === "dismiss") return;
  const url = e.notification.data?.url || "/";
  e.waitUntil(
    clients.matchAll({ type:"window", includeUncontrolled:true }).then(cls => {
      const w = cls.find(c => c.url.includes(location.origin));
      if (w) { w.focus(); w.navigate(url); }
      else clients.openWindow(url);
    })
  );
});
