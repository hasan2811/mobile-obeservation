// ============================================================
//  HSSE Tech PWA - Service Worker
//  Strategi: Cache First (aset) + Network First (API)
//  + Background Sync untuk offline queue
// ============================================================

const CACHE_NAME = 'hsse-tech-v1';
const STATIC_CACHE = 'hsse-static-v1';
const API_CACHE = 'hsse-api-v1';
const SYNC_TAG = 'hsse-bg-sync';

// Aset yang di-cache saat install (App Shell)
const APP_SHELL = [
    '/',
    '/index.html',
    '/manifest.json',
    '/logo.svg',
];

// ─── INSTALL ────────────────────────────────────────────────
self.addEventListener('install', (event) => {
    console.log('[SW] Installing...');
    event.waitUntil(
        caches.open(STATIC_CACHE).then((cache) => {
            console.log('[SW] Caching App Shell');
            return cache.addAll(APP_SHELL);
        }).then(() => self.skipWaiting())
    );
});

// ─── ACTIVATE ───────────────────────────────────────────────
self.addEventListener('activate', (event) => {
    console.log('[SW] Activating...');
    event.waitUntil(
        caches.keys().then((keys) =>
            Promise.all(
                keys
                    .filter((k) => k !== STATIC_CACHE && k !== API_CACHE)
                    .map((k) => {
                        console.log('[SW] Deleting old cache:', k);
                        return caches.delete(k);
                    })
            )
        ).then(() => self.clients.claim())
    );
});

// ─── FETCH STRATEGY ─────────────────────────────────────────
self.addEventListener('fetch', (event) => {
    const { request } = event;
    const url = new URL(request.url);

    // Skip non-GET & browser extensions
    if (request.method !== 'GET') return;
    if (!url.protocol.startsWith('http')) return;

    // Google Apps Script / API → Network First with Cache Fallback
    if (url.hostname.includes('script.google.com') ||
        url.hostname.includes('googleapis.com')) {
        event.respondWith(networkFirstWithFallback(request));
        return;
    }

    // Google Drive images → Cache First (foto berat, jarang berubah)
    if (url.hostname.includes('lh3.googleusercontent.com') ||
        url.hostname.includes('drive.google.com')) {
        event.respondWith(cacheFirstWithNetwork(request));
        return;
    }

    // Static aset (JS, CSS, fonts) → Cache First
    if (request.destination === 'script' ||
        request.destination === 'style' ||
        request.destination === 'font' ||
        request.destination === 'image') {
        event.respondWith(cacheFirstWithNetwork(request));
        return;
    }

    // HTML navigation → Network First (selalu fresh)
    if (request.mode === 'navigate') {
        event.respondWith(networkFirstWithFallback(request));
        return;
    }
});

// Strategy: Network First → fallback to cache
async function networkFirstWithFallback(request) {
    try {
        const response = await fetch(request);
        if (response.ok) {
            const cache = await caches.open(API_CACHE);
            cache.put(request, response.clone());
        }
        return response;
    } catch {
        const cached = await caches.match(request);
        return cached || caches.match('/index.html');
    }
}

// Strategy: Cache First → fallback to network
async function cacheFirstWithNetwork(request) {
    const cached = await caches.match(request);
    if (cached) return cached;
    try {
        const response = await fetch(request);
        if (response.ok) {
            const cache = await caches.open(STATIC_CACHE);
            cache.put(request, response.clone());
        }
        return response;
    } catch {
        return new Response('Offline', { status: 503 });
    }
}

// ─── BACKGROUND SYNC ────────────────────────────────────────
self.addEventListener('sync', (event) => {
    if (event.tag === SYNC_TAG) {
        console.log('[SW] Background Sync triggered');
        event.waitUntil(processOfflineQueue());
    }
});

async function processOfflineQueue() {
    // Kirim message ke semua client untuk flush queue
    const clients = await self.clients.matchAll({ type: 'window' });
    clients.forEach((client) => {
        client.postMessage({ type: 'BACKGROUND_SYNC_TRIGGERED' });
    });
}

// ─── PUSH NOTIFICATIONS ─────────────────────────────────────
self.addEventListener('push', (event) => {
    if (!event.data) return;
    const data = event.data.json();
    const options = {
        body: data.body || 'Ada update baru di HSSE Tech',
        icon: '/logo.svg',
        badge: '/logo.svg',
        tag: data.tag || 'hsse-notification',
        data: { url: data.url || '/' },
        actions: [
            { action: 'open', title: '📋 Buka App' },
            { action: 'dismiss', title: 'Tutup' }
        ],
        vibrate: [200, 100, 200],
        renotify: true,
    };
    event.waitUntil(
        self.registration.showNotification(data.title || 'HSSE Tech', options)
    );
});

self.addEventListener('notificationclick', (event) => {
    event.notification.close();
    if (event.action === 'dismiss') return;
    const url = event.notification.data?.url || '/';
    event.waitUntil(
        self.clients.matchAll({ type: 'window' }).then((clients) => {
            const existing = clients.find((c) => c.url.includes(url) && 'focus' in c);
            if (existing) return existing.focus();
            return self.clients.openWindow(url);
        })
    );
});

// ─── SHARE TARGET (terima foto dari Galeri) ─────────────────
self.addEventListener('fetch', (event) => {
    if (event.request.method !== 'POST') return;
    const url = new URL(event.request.url);
    if (!url.pathname.startsWith('/share-target')) return;

    event.respondWith(
        (async () => {
            const formData = await event.request.formData();
            const file = formData.get('media');
            // Store shared file ke IndexedDB untuk diakses App
            if (file) {
                const clients = await self.clients.matchAll({ type: 'window' });
                clients.forEach(client => client.postMessage({ type: 'SHARE_TARGET', file }));
            }
            return Response.redirect('/?share=1', 303);
        })()
    );
});

// ─── MESSAGE HANDLER ────────────────────────────────────────
self.addEventListener('message', (event) => {
    if (event.data?.type === 'SKIP_WAITING') {
        self.skipWaiting();
    }
    if (event.data?.type === 'REGISTER_SYNC') {
        self.registration.sync.register(SYNC_TAG).catch(console.warn);
    }
});

console.log('[SW] HSSE Tech Service Worker loaded ✅');
