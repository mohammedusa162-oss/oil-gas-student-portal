/* خدمة عملان — بوابة الطالب
 * هدفها وحيد: أن يفتح التطبيق فوراً ويعمل كاملاً دون إنترنت بعد أول زيارة.
 * - التصفّح (صفحة): الشبكة أولاً ثم النسخة المحفوظة (توصّل بالتحديثات).
 * - بقية الملفات (JS/CSS/صور/خطوط): المحفوظ أولاً لأن أسماء الملفات مُجزّأة لا تتغيّر بمعناها.
 */
const CACHE = "oilgas-portal-v1";
const SHELL = [
  "./",
  "./manifest.webmanifest",
  "./icon-192.png",
  "./icon-512.png",
  "./icon-maskable-512.png",
  "./university-of-zawia-logo.png",
  "./privacy-policy.html",
  // الخطوط والملفات ذات المسار الثابت — التغليف نفسه لا يحتاج شبكة.
  "./fonts/aref-ruqaa-400.ttf",
  "./fonts/aref-ruqaa-700.ttf",
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    (async () => {
      const cache = await caches.open(CACHE);
      const urls = [...SHELL];
      try {
        // أسماء ملفات JS/CSS مُجزّأة (hash) ولا نعرفها مسبقاً، فنقرأها من صفحة الإشارة
        // نفسها وقت التثبيت: بذلك تعمل الصفحة فوراً دون إنترنت بعد أول زيارة.
        const html = await (await fetch("./")).text();
        for (const match of html.matchAll(/(?:src|href)="([^"']+\.(?:js|css))"/g)) {
          urls.push(new URL(match[1], self.location.href).href);
        }
      } catch {
        /* تعذّر القراءة وقت التثبيت: التخزين أثناء التشغيل يكمل لاحقاً */
      }
      await cache.addAll([...new Set(urls)]);
      await self.skipWaiting();
    })(),
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) => Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k))))
      .then(() => self.clients.claim()),
  );
});

self.addEventListener("fetch", (event) => {
  const request = event.request;
  if (request.method !== "GET") return;

  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return; // روابط خارجية: المتصفح يعالجها

  if (request.mode === "navigate") {
    event.respondWith(
      fetch(request)
        .then((response) => {
          const copy = response.clone();
          caches.open(CACHE).then((cache) => cache.put("./", copy));
          return response;
        })
        .catch(() => caches.match("./")),
    );
    return;
  }

  event.respondWith(
    caches.match(request).then((cached) => {
      if (cached) {
        // حدّث نسخة خلفيّة دون أن تنتظر الزيارة
        fetch(request)
          .then((response) => {
            if (response && response.ok) {
              caches.open(CACHE).then((cache) => cache.put(request, response.clone()));
            }
          })
          .catch(() => {});
        return cached;
      }
      return fetch(request).then((response) => {
        if (response && response.ok && response.type === "basic") {
          const copy = response.clone();
          caches.open(CACHE).then((cache) => cache.put(request, copy));
        }
        return response;
      });
    }),
  );
});
