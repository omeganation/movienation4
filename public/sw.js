// MovieNation Service Worker v2 — PWA install + offline + push notifications
const CACHE = "movienation-v2";
const STATIC = ["/", "/index.html", "/manifest.json", "/favicon.png"];

self.addEventListener("install", e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(STATIC)));
  self.skipWaiting();
});

self.addEventListener("activate", e => {
  e.waitUntil(caches.keys().then(keys =>
    Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))
  ));
  self.clients.claim();
});

self.addEventListener("fetch", e => {
  e.respondWith(fetch(e.request).catch(() => caches.match(e.request)));
});

// ── Push Notification handler ──────────────────────────────────────────────
self.addEventListener("push", e => {
  let data = { title: "MovieNation", body: "A new movie was added!", icon: "/favicon.png", badge: "/favicon.png", url: "/" };
  if (e.data) {
    try { data = { ...data, ...e.data.json() }; } catch {}
  }
  const options = {
    body:    data.body,
    icon:    data.icon  || "/favicon.png",
    badge:   data.badge || "/favicon.png",
    image:   data.image || undefined,
    vibrate: [100, 50, 100],
    data:    { url: data.url || "/" },
    actions: [
      { action: "watch", title: "Watch Now" },
      { action: "dismiss", title: "Dismiss" }
    ],
    tag:    "movienation-new-movie",
    renotify: true,
  };
  e.waitUntil(self.registration.showNotification(data.title, options));
});

// ── Notification click ─────────────────────────────────────────────────────
self.addEventListener("notificationclick", e => {
  e.notification.close();
  if (e.action === "dismiss") return;
  const url = e.notification.data?.url || "/";
  e.waitUntil(
    clients.matchAll({ type: "window", includeUncontrolled: true }).then(cls => {
      const existing = cls.find(c => c.url.includes(location.origin));
      if (existing) { existing.focus(); existing.navigate(url); }
      else clients.openWindow(url);
    })
  );
});
