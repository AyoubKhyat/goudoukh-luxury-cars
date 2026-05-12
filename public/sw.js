// Goudoukh Luxury Cars — Service Worker
// Cache-first for static assets, network-first for pages/API

const CACHE_VERSION = "goudoukh-v1";
const STATIC_CACHE = `${CACHE_VERSION}-static`;
const DYNAMIC_CACHE = `${CACHE_VERSION}-dynamic`;

// Assets to pre-cache on install
const PRE_CACHE = [
  "/offline.html",
  "/icons/icon.svg",
];

// File extensions that should use cache-first strategy
const STATIC_EXTENSIONS = [
  ".js",
  ".css",
  ".woff",
  ".woff2",
  ".ttf",
  ".otf",
  ".png",
  ".jpg",
  ".jpeg",
  ".webp",
  ".avif",
  ".svg",
  ".ico",
  ".glb",
  ".gltf",
];

/* -------------------------------------------------------------------------- */
/*  Install — pre-cache essential assets                                       */
/* -------------------------------------------------------------------------- */

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches
      .open(STATIC_CACHE)
      .then((cache) => cache.addAll(PRE_CACHE))
      .then(() => self.skipWaiting())
  );
});

/* -------------------------------------------------------------------------- */
/*  Activate — clean up old caches                                             */
/* -------------------------------------------------------------------------- */

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(
          keys
            .filter(
              (key) => key !== STATIC_CACHE && key !== DYNAMIC_CACHE
            )
            .map((key) => caches.delete(key))
        )
      )
      .then(() => self.clients.claim())
  );
});

/* -------------------------------------------------------------------------- */
/*  Fetch — routing strategies                                                 */
/* -------------------------------------------------------------------------- */

/**
 * Returns true if the request URL looks like a static asset.
 */
function isStaticAsset(url) {
  const pathname = new URL(url).pathname;
  return STATIC_EXTENSIONS.some((ext) => pathname.endsWith(ext));
}

/**
 * Returns true if the request targets a Next.js data / API route.
 */
function isApiOrData(url) {
  const pathname = new URL(url).pathname;
  return (
    pathname.startsWith("/api/") ||
    pathname.startsWith("/_next/data/")
  );
}

self.addEventListener("fetch", (event) => {
  const { request } = event;

  // Only handle GET requests
  if (request.method !== "GET") return;

  // Skip cross-origin requests except fonts
  const url = new URL(request.url);
  if (
    url.origin !== self.location.origin &&
    !url.hostname.includes("fonts.googleapis.com") &&
    !url.hostname.includes("fonts.gstatic.com")
  ) {
    return;
  }

  // ---- Cache-first for static assets ----
  if (isStaticAsset(request.url)) {
    event.respondWith(
      caches.match(request).then((cached) => {
        if (cached) return cached;

        return fetch(request)
          .then((response) => {
            // Only cache valid responses
            if (!response || response.status !== 200) return response;

            const clone = response.clone();
            caches.open(STATIC_CACHE).then((cache) => {
              cache.put(request, clone);
            });
            return response;
          })
          .catch(() => {
            // If it's an image, we could return a placeholder
            // For now just let it fail gracefully
            return new Response("", { status: 408 });
          });
      })
    );
    return;
  }

  // ---- Network-first for HTML pages and API routes ----
  event.respondWith(
    fetch(request)
      .then((response) => {
        // Cache successful page responses for offline use
        if (response && response.status === 200 && !isApiOrData(request.url)) {
          const clone = response.clone();
          caches.open(DYNAMIC_CACHE).then((cache) => {
            cache.put(request, clone);
          });
        }
        return response;
      })
      .catch(() => {
        // Try the dynamic cache first
        return caches.match(request).then((cached) => {
          if (cached) return cached;

          // For navigation requests, show offline page
          if (request.mode === "navigate") {
            return caches.match("/offline.html");
          }

          return new Response("", { status: 408 });
        });
      })
  );
});
