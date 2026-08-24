const FRESHNESS_KEY = '__preview_fresh'

self.addEventListener('install', () => {
  self.skipWaiting()
})

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) => Promise.all(keys.map((key) => caches.delete(key))))
      .then(() => self.clients.claim()),
  )
})

self.addEventListener('fetch', (event) => {
  const request = event.request

  if (request.method !== 'GET' || request.mode !== 'navigate') return

  const requestUrl = new URL(request.url)
  const scopeUrl = new URL(self.registration.scope)

  if (
    requestUrl.origin !== scopeUrl.origin ||
    !requestUrl.pathname.startsWith(scopeUrl.pathname)
  ) return

  requestUrl.searchParams.set(FRESHNESS_KEY, Date.now().toString())

  const freshRequest = new Request(requestUrl, {
    cache: 'no-store',
    credentials: request.credentials,
    headers: request.headers,
    method: request.method,
    mode: 'same-origin',
    redirect: 'follow',
  })

  event.respondWith(fetch(freshRequest).catch(() => fetch(request)))
})
