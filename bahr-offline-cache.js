/* BAHR PWA — طبقة التخزين المؤقت الآمن (للموارد العامة فقط).
   لا تُسجَّل كـ Service Worker مستقل (لا يجوز أكثر من واحد لنفس النطاق).
   تُحمَّل داخل /sw.js الحالي بسطر واحد في أعلاه:
       importScripts('/bahr-offline-cache.js');
   لا تلمس أحداث push / notificationclick ولا skipWaiting ولا clients.claim في sw.js. */
(function () {
  var C = 'bahr-public-v1';
  var OFFLINE = '/offline.html';
  var PRE = [OFFLINE, '/favicon.png', '/apple-touch-icon.png', '/icon-192.png', '/icon-512.png', '/logo-white.png'];
  var STATIC = /\.(?:png|jpe?g|webp|svg|ico|gif)$/i;
  var SKIP = /^\/(?:sw\.js|manifest\.webmanifest|\.netlify\/|api\/|auth\/|rest\/|storage\/)/;

  self.addEventListener('install', function (e) {
    e.waitUntil(caches.open(C).then(function (c) {
      return Promise.all(PRE.map(function (u) { return c.add(u).catch(function () {}); }));
    }));
  });

  self.addEventListener('activate', function (e) {
    e.waitUntil(caches.keys().then(function (ks) {
      return Promise.all(ks.filter(function (k) { return k.indexOf('bahr-public-') === 0 && k !== C; })
        .map(function (k) { return caches.delete(k); }));
    }));
  });

  self.addEventListener('fetch', function (e) {
    var r = e.request;
    try {
      if (r.method !== 'GET' || r.headers.has('authorization') || r.headers.has('range')) return;
      var u = new URL(r.url);
      if (u.origin !== self.location.origin || SKIP.test(u.pathname)) return; /* Supabase والخطوط الخارجية خارج النطاق دائماً */
      if (r.mode === 'navigate') {
        /* الشبكة أولاً دائماً (تحديثات الموقع تصل فوراً)؛ صفحة offline فقط عند الفشل. لا تُخزَّن صفحات الموقع. */
        e.respondWith(fetch(r).catch(function () { return caches.match(OFFLINE).then(function (m) { return m || Response.error(); }); }));
        return;
      }
      if (STATIC.test(u.pathname) && !u.search) {
        e.respondWith(caches.open(C).then(function (c) {
          return c.match(r).then(function (hit) {
            var net = fetch(r).then(function (res) {
              var cc = res.headers.get('Cache-Control') || '';
              if (res.ok && res.type === 'basic' && !/no-store|private/i.test(cc)) c.put(r, res.clone());
              return res;
            }).catch(function () { return hit; });
            return hit || net;
          });
        }));
      }
    } catch (x) { /* لا نكسر معالجات sw.js الأخرى */ }
  });
})();
