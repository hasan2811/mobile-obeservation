# HSSE Tech — Meram Platform

> **Platform observasi keselamatan kerja (HSE) berbasis PWA — real-time, offline-ready, mobile-first.**

---

## 📁 Struktur Folder

```
hsse-tech/
├── public/
│   ├── index.html          # App Shell + PWA meta tags
│   ├── manifest.json       # PWA Manifest (shortcuts, share target, icons)
│   ├── service-worker.js   # Service Worker (cache, bg sync, push notif)
│   └── logo.svg            # App icon
│
├── src/
│   ├── App.js              # Root component + state management
│   ├── index.js            # Entry point + SW registration
│   ├── index.css           # Global styles + CSS variables
│   │
│   ├── components/         # Reusable UI components
│   │   ├── ActionModal.js      # Modal ambil tindakan
│   │   ├── ActionStory.js      # Timeline riwayat aksi
│   │   ├── AuthPage.js         # Halaman login
│   │   ├── BottomNav.js        # Navigasi bawah (badge, FAB)
│   │   ├── CreateModal.js      # Modal buat laporan baru
│   │   ├── DetailModal.js      # Modal detail observasi
│   │   ├── FeedCard.js         # Kartu feed observasi
│   │   ├── ObservationCard.js  # Kartu task/activity
│   │   ├── ReviewModal.js      # Modal review & close
│   │   ├── Skeleton.js         # Skeleton loading screens
│   │   ├── SuccessCelebration.js # Toast notifikasi sukses
│   │   └── Toast.js            # Toast notifikasi general
│   │
│   ├── views/              # Halaman utama (tab)
│   │   ├── Dashboard.js        # Dashboard + chart
│   │   ├── Feed.js             # Activity feed + filter
│   │   ├── Tasks.js            # Tugas yang di-assign
│   │   ├── Activity.js         # Laporan saya
│   │   └── Profile.js          # Profil user + settings
│   │
│   └── utils/              # Utilitas
│       ├── imageUtils.js       # Helper foto HD
│       ├── pwaManager.js       # PWA: install, notif, shortcuts
│       └── useOfflineQueue.js  # Offline queue + auto-sync
│
├── backend/                # Google Apps Script backend
│   ├── code-template.gs    # Template backend (isi konfigurasi)
│   ├── test-get.gs         # Script uji GET request
│   └── PERBAIKAN-GET-REQUEST.md
│
├── .env.example            # Template environment variables
├── .gitignore
├── package.json
├── tailwind.config.js
└── README.md
```

---

## ⚙️ Environment Variables

Buat file `.env` dari `.env.example`:

```env
REACT_APP_WEB_APP_URL=https://script.google.com/macros/s/YOUR_SCRIPT_ID/exec
REACT_APP_GEMINI_API_KEY=your_gemini_api_key_here
REACT_APP_GEMINI_MODEL=gemini-2.0-flash
```

> ⚠️ **Jangan commit `.env` ke Git!** File ini sudah di-ignore.

---

## 🚀 Development

```bash
# Install dependencies
npm install

# Jalankan development server
npm start
# → http://localhost:3000
```

---

## 📦 Build untuk Production (Deploy)

```bash
# Build production bundle
npm run build

# Folder /build siap di-deploy
```

---

## 🌐 Deploy ke Netlify (Rekomendasi)

### Cara 1 — Drag & Drop (Termudah)
1. Jalankan `npm run build`
2. Buka [app.netlify.com](https://app.netlify.com)
3. Drag folder `build/` ke area deploy
4. Selesai! URL langsung aktif

### Cara 2 — Netlify CLI
```bash
npm install -g netlify-cli
netlify login
netlify deploy --prod --dir=build
```

### Cara 3 — Connect GitHub (Auto-deploy)
1. Push ke GitHub
2. Connect repo di Netlify
3. Build command: `npm run build`
4. Publish directory: `build`
5. Set environment variables di Netlify dashboard

---

## 🌐 Deploy ke Vercel

```bash
npm install -g vercel
vercel --prod
```

Atau connect GitHub repo di [vercel.com](https://vercel.com) dengan pengaturan:
- Framework: Create React App
- Build Command: `npm run build`
- Output Directory: `build`

---

## 📱 PWA Features

| Fitur | Status |
|---|---|
| Service Worker + Caching | ✅ Aktif (production only) |
| Offline Mode | ✅ Cache First strategy |
| Background Sync | ✅ Auto-sync saat online |
| Push Notification | ✅ Request permission saat login |
| Install Prompt (A2HS) | ✅ Banner muncul otomatis |
| App Shortcuts | ✅ Long-press icon di homescreen |
| Share Target | ✅ Share foto dari galeri |
| Skeleton Loading | ✅ Saat pertama load |

> ⚠️ Service Worker **hanya aktif di production build**. Di `npm start` (development) SW tidak berjalan.

---

## 🗄️ Backend (Google Apps Script)

Backend menggunakan Google Apps Script yang terhubung ke Google Sheets.

1. Buka [script.google.com](https://script.google.com)
2. Buat project baru
3. Copy isi `backend/code-template.gs`
4. Isi konfigurasi `SPREADSHEET_ID` dan nama sheet
5. Deploy → **Web App** → Execute as: **Me** → Who has access: **Anyone**
6. Copy URL deployment ke `.env`

---

## 🔑 Tech Stack

- **Frontend**: React 18, Tailwind CSS, Recharts, Lucide Icons
- **Backend**: Google Apps Script + Google Sheets
- **AI**: Google Gemini API (analisis foto, AI insight, rekomendasi)
- **PWA**: Service Worker, Web Push, Background Sync, Share Target API
- **Deployment**: Netlify / Vercel (static hosting)

---

*HSSE Tech — Meram Platform © 2025*