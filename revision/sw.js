// Service worker: permite abrir la app sin cobertura.
// - La app (HTML y JS): primero red (para recibir actualizaciones), si no hay, la copia guardada.
// - Librerías del CDN: copia guardada primero.
// - Llamadas a Supabase: nunca se guardan (siempre en vivo).
const CACHE = "acllar-rev-v9";
const SHELL = ["./", "./index.html", "./nube-rev.js?v=8", "./manifest.json",
  "https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/dist/umd/supabase.min.js"];
self.addEventListener("install", (e) => {
  e.waitUntil(caches.open(CACHE).then((c) => Promise.all(SHELL.map((u) => c.add(u).catch(() => {})))).then(() => self.skipWaiting()));
});
self.addEventListener("activate", (e) => {
  e.waitUntil(caches.keys().then((ks) => Promise.all(ks.filter((k) => k !== CACHE).map((k) => caches.delete(k)))).then(() => self.clients.claim()));
});
self.addEventListener("fetch", (e) => {
  const req = e.request;
  if (req.method !== "GET") return;
  const url = new URL(req.url);
  if (url.hostname.endsWith("supabase.co")) return; // datos: siempre en vivo
  if (url.hostname === "cdn.jsdelivr.net") {
    e.respondWith(caches.match(req).then((hit) => hit || fetch(req).then((res) => { const cp = res.clone(); caches.open(CACHE).then((c) => c.put(req, cp)); return res; })));
    return;
  }
  if (url.origin === self.location.origin) {
    e.respondWith(fetch(req).then((res) => { const cp = res.clone(); caches.open(CACHE).then((c) => c.put(req, cp)); return res; })
      .catch(() => caches.match(req).then((hit) => hit || caches.match("./index.html"))));
  }
});
