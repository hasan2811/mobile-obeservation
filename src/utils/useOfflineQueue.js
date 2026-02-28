import { useState, useEffect, useCallback, useRef } from 'react';

const QUEUE_KEY = 'hse_offline_queue';

/**
 * Hook: useOfflineQueue
 * Menyimpan payload yang gagal dikirim ke localStorage,
 * lalu otomatis retry saat koneksi kembali.
 */
export function useOfflineQueue(webAppUrl, onSuccess, onToast) {
    const [queue, setQueue] = useState(() => {
        try {
            return JSON.parse(localStorage.getItem(QUEUE_KEY)) || [];
        } catch { return []; }
    });
    const [isOnline, setIsOnline] = useState(navigator.onLine);
    const retryingRef = useRef(false);

    // Sync queue state to localStorage
    const saveQueue = useCallback((q) => {
        localStorage.setItem(QUEUE_KEY, JSON.stringify(q));
        setQueue(q);
    }, []);

    // Add failed payload to queue
    const enqueue = useCallback((payload) => {
        const item = { ...payload, _queuedAt: new Date().toISOString(), _id: Date.now() };
        setQueue(prev => {
            const next = [...prev, item];
            localStorage.setItem(QUEUE_KEY, JSON.stringify(next));
            return next;
        });
        onToast?.({ message: `Tersimpan offline. Akan dikirim saat online.`, type: 'info' });
    }, [onToast]);

    // Try sending all queued items
    const flushQueue = useCallback(async () => {
        if (retryingRef.current) return;
        const currentQueue = JSON.parse(localStorage.getItem(QUEUE_KEY) || '[]');
        if (currentQueue.length === 0) return;

        retryingRef.current = true;
        const failed = [];

        for (const item of currentQueue) {
            try {
                const { _queuedAt, _id, ...payload } = item;
                await fetch(webAppUrl, {
                    method: 'POST',
                    body: JSON.stringify(payload),
                    redirect: 'follow'
                });
                onSuccess?.();
            } catch {
                failed.push(item);
            }
        }

        saveQueue(failed);
        retryingRef.current = false;

        if (failed.length === 0 && currentQueue.length > 0) {
            onToast?.({ message: `${currentQueue.length} laporan offline berhasil dikirim!`, type: 'success' });
        }
    }, [webAppUrl, onSuccess, saveQueue, onToast]);

    // Online/offline listener
    useEffect(() => {
        const handleOnline = () => {
            setIsOnline(true);
            flushQueue();
        };
        const handleOffline = () => setIsOnline(false);

        window.addEventListener('online', handleOnline);
        window.addEventListener('offline', handleOffline);
        return () => {
            window.removeEventListener('online', handleOnline);
            window.removeEventListener('offline', handleOffline);
        };
    }, [flushQueue]);

    // Auto-flush on mount if online and queue not empty
    useEffect(() => {
        if (isOnline && queue.length > 0) {
            flushQueue();
        }
    }, []); // eslint-disable-line

    return { queue, isOnline, enqueue, flushQueue };
}
