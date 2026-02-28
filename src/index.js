import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import {
  registerServiceWorker,
  showLocalNotification,
  applyServiceWorkerUpdate
} from './utils/pwaManager';

// Register Service Worker
registerServiceWorker((message) => {
  if (message?.type === 'SW_UPDATE_AVAILABLE') {
    // Tampilkan prompt update ke user (via custom event)
    window.dispatchEvent(new CustomEvent('pwa-update-available'));
  }
  if (message?.type === 'BACKGROUND_SYNC_TRIGGERED') {
    // SW minta app untuk flush offline queue
    window.dispatchEvent(new CustomEvent('pwa-bg-sync'));
  }
});

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);