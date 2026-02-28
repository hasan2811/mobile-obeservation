/**
 * PWA Manager - HSSE Tech
 * Mengelola: Service Worker, Push Notifications, Background Sync, Share Target, Install Prompt
 */

// ─── SERVICE WORKER REGISTRATION ────────────────────────────
export function registerServiceWorker(onMessage) {
    if (!('serviceWorker' in navigator)) {
        console.warn('[PWA] Service Worker not supported');
        return;
    }

    window.addEventListener('load', async () => {
        try {
            const reg = await navigator.serviceWorker.register('/service-worker.js');
            console.log('[PWA] Service Worker registered ✅', reg.scope);

            // Listen for SW updates
            reg.addEventListener('updatefound', () => {
                const newWorker = reg.installing;
                if (!newWorker) return;
                newWorker.addEventListener('statechange', () => {
                    if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                        // New version available - notify app
                        onMessage?.({ type: 'SW_UPDATE_AVAILABLE' });
                    }
                });
            });

            // Listen for messages from SW
            navigator.serviceWorker.addEventListener('message', (event) => {
                onMessage?.(event.data);
            });

        } catch (err) {
            console.error('[PWA] Service Worker registration failed:', err);
        }
    });
}

// ─── PUSH NOTIFICATIONS ─────────────────────────────────────
export async function requestNotificationPermission() {
    if (!('Notification' in window)) {
        console.warn('[PWA] Notifications not supported');
        return false;
    }

    if (Notification.permission === 'granted') return true;
    if (Notification.permission === 'denied') return false;

    const permission = await Notification.requestPermission();
    return permission === 'granted';
}

export function showLocalNotification(title, body, options = {}) {
    if (Notification.permission !== 'granted') return;

    // Try Service Worker notification first (more features)
    if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {
        navigator.serviceWorker.ready.then((reg) => {
            reg.showNotification(title, {
                body,
                icon: '/logo.svg',
                badge: '/logo.svg',
                tag: options.tag || 'hsse-notif',
                vibrate: [200, 100, 200],
                data: options.data || {},
                actions: options.actions || [],
                ...options,
            });
        });
    } else {
        // Fallback to basic notification
        new Notification(title, { body, icon: '/logo.svg', ...options });
    }
}

// ─── BACKGROUND SYNC ────────────────────────────────────────
export async function registerBackgroundSync() {
    if (!('serviceWorker' in navigator) || !('SyncManager' in window)) {
        console.warn('[PWA] Background Sync not supported');
        return false;
    }

    try {
        const reg = await navigator.serviceWorker.ready;
        await reg.sync.register('hsse-bg-sync');
        console.log('[PWA] Background Sync registered ✅');
        return true;
    } catch (err) {
        console.warn('[PWA] Background Sync failed:', err);
        return false;
    }
}

// ─── INSTALL PROMPT (A2HS) ──────────────────────────────────
let deferredPrompt = null;

window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferredPrompt = e;
    console.log('[PWA] Install prompt captured ✅');
    // Dispatch event so React can listen
    window.dispatchEvent(new CustomEvent('pwa-installable'));
});

window.addEventListener('appinstalled', () => {
    deferredPrompt = null;
    console.log('[PWA] App installed successfully! ✅');
    window.dispatchEvent(new CustomEvent('pwa-installed'));
});

export function promptInstall() {
    if (!deferredPrompt) return false;
    deferredPrompt.prompt();
    deferredPrompt.userChoice.then((choice) => {
        if (choice.outcome === 'accepted') {
            console.log('[PWA] User accepted install');
        }
        deferredPrompt = null;
    });
    return true;
}

export function isPWAInstallable() {
    return !!deferredPrompt;
}

export function isPWAInstalled() {
    return window.matchMedia('(display-mode: standalone)').matches ||
        window.navigator.standalone === true ||
        document.referrer.includes('android-app://');
}

// ─── SHARE TARGET ────────────────────────────────────────────
export function getSharedMedia() {
    // Check if launched via Share Target
    if (!window.__PWA_SHARE_INCOMING__) return null;
    window.__PWA_SHARE_INCOMING__ = false;
    return true; // Signal to app to open create modal
}

// ─── PWA SHORTCUTS HANDLER ───────────────────────────────────
export function getPWALaunchIntent() {
    if (window.__PWA_OPEN_CREATE__) {
        window.__PWA_OPEN_CREATE__ = false;
        return { action: 'create' };
    }
    if (window.__PWA_INITIAL_TAB__) {
        const tab = window.__PWA_INITIAL_TAB__;
        window.__PWA_INITIAL_TAB__ = null;
        return { action: 'tab', tab };
    }
    return null;
}

// ─── APP UPDATE PROMPT ───────────────────────────────────────
export function applyServiceWorkerUpdate() {
    if (!navigator.serviceWorker.controller) return;
    navigator.serviceWorker.controller.postMessage({ type: 'SKIP_WAITING' });
    window.location.reload();
}
