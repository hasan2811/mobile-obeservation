# 🚀 OPTIMASI APPS SCRIPT - HSSE.Tech Platform

## 📊 Perbandingan Performa

### **SEBELUM OPTIMASI:**
- ❌ Setiap page load = 1-2 detik (fetch dari server)
- ❌ 100 user x 10 refresh/hari = 1,000 API calls
- ❌ Baca spreadsheet berulang-ulang
- ❌ Risk timeout jika data besar (>1000 rows)

### **SETELAH OPTIMASI:**
- ✅ Page load dari cache = <100ms (10x lebih cepat!)
- ✅ 100 user x 10 refresh/hari = ~200 API calls (80% lebih hemat!)
- ✅ Batch read 1x untuk semua data
- ✅ Cache di Apps Script + Browser
- ✅ Timeout risk minimal

---

## 🎯 Strategi Optimasi

### **1. Frontend Caching (Browser)**
**File:** `src/utils/cache.js`

**Manfaat:**
- Data disimpan di browser (localStorage)
- Tidak perlu fetch ulang jika masih fresh
- Cache duration: 3-5 menit (bisa disesuaikan)

**Cara Kerja:**
```javascript
// Cek cache dulu
const cached = CacheManager.getLocal('feed_page_1');
if (cached) {
  // Gunakan data cache (CEPAT!)
  return cached;
}

// Jika tidak ada, baru fetch dari server
const data = await fetch(API_URL);
CacheManager.setLocal('feed_page_1', data, 3 * 60 * 1000); // Cache 3 menit
```

---

### **2. Backend Caching (Apps Script)**
**File:** `backend/code-optimized.gs`

**Manfaat:**
- CacheService.getScriptCache() - built-in Google
- Cache duration: 5-10 menit
- Mengurangi baca spreadsheet

**Cara Kerja:**
```javascript
function getOptimizedFeedData(page, limit) {
  // Cek cache Apps Script
  const cached = getCachedData(`feed_page_${page}`);
  if (cached) return cached; // SUPER CEPAT!

  // Jika tidak ada, baca spreadsheet
  const data = sheet.getRange(...).getValues();
  
  // Simpan ke cache
  setCachedData(`feed_page_${page}`, data, 300); // 5 menit
  return data;
}
```

---

### **3. Batch Reading**
**Sebelum:**
```javascript
// LAMBAT - Read per row
for (let i = 2; i <= lastRow; i++) {
  const row = sheet.getRange(i, 1, 1, 11).getValues()[0];
  // Process row...
}
// Waktu: ~5-10 detik untuk 1000 rows
```

**Sesudah:**
```javascript
// CEPAT - Read semua sekaligus
const allData = sheet.getRange(2, 1, lastRow - 1, 11).getValues();
// Process all data...
// Waktu: ~0.5-1 detik untuk 1000 rows (10x lebih cepat!)
```

---

### **4. Smart Cache Invalidation**
Cache otomatis di-clear saat:
- User submit observation baru
- User refresh manual (tombol refresh)
- Cache expired (setelah 3-5 menit)

```javascript
// Clear cache setelah submit
CacheManager.clearLocal();
fetchFeedWithCache(1, false); // Fetch fresh data
```

---

## 📝 Cara Implementasi

### **Step 1: Update Apps Script Backend**

1. Buka Google Apps Script editor
2. **Backup code lama** (copy ke file baru)
3. Replace dengan code dari `backend/code-optimized.gs`
4. **PENTING:** Ganti variabel ini:
   ```javascript
   const SHEET_ID = 'YOUR_SPREADSHEET_ID'; // ID spreadsheet Anda
   // Di line upload file:
   const folder = DriveApp.getFolderById('YOUR_FOLDER_ID'); // Folder untuk upload
   ```
5. Deploy ulang sebagai Web App
6. Test dengan Postman/browser

### **Step 2: Update Frontend React**

**Option A: Manual Integration (Recommended)**
Tambahkan di `App.js`:

```javascript
// Import cache manager
import CacheManager from './utils/cache';

// Ganti fetchFeed dengan fetchFeedWithCache
const fetchFeed = async (targetPage = 1, isAppending = false) => {
  // ... copy code dari src/utils/optimizedFetch.js
};

// Ganti fetchUsers dengan fetchUsersWithCache
const fetchUsers = async () => {
  // ... copy code dari src/utils/optimizedFetch.js
};

// Ganti handleSubmit dengan handleSubmitWithCacheClear
const handleSubmit = async (e) => {
  // ... copy code dari src/utils/optimizedFetch.js
};
```

**Option B: Import Functions**
```javascript
import { fetchFeedWithCache, fetchUsersWithCache, handleSubmitWithCacheClear } from './utils/optimizedFetch';

// Gunakan di component
useEffect(() => {
  if (user) {
    fetchUsersWithCache();
    fetchFeedWithCache(1, false);
  }
}, [user]);
```

### **Step 3: Setup Auto Cache Clear (Optional)**

Di Apps Script, run sekali:
```javascript
setupCacheClearTrigger();
```

Ini akan setup trigger untuk clear cache setiap 1 jam otomatis.

---

## 🔧 Konfigurasi Cache Duration

Sesuaikan dengan kebutuhan:

```javascript
// Frontend (src/utils/cache.js)
const CACHE_DURATION = 5 * 60 * 1000; // 5 menit (default)

// Untuk data yang jarang berubah (user list):
CacheManager.setLocal('user_list', users, 10 * 60 * 1000); // 10 menit

// Untuk data yang sering berubah (feed):
CacheManager.setLocal('feed', data, 2 * 60 * 1000); // 2 menit

// Backend (code-optimized.gs)
const CACHE_DURATION = 300; // 5 menit (dalam detik)
```

---

## 📈 Monitoring & Testing

### **Test Cache Working:**

1. **Buka DevTools Console** (F12)
2. Load page pertama kali:
   ```
   ⏳ Fetching from server... (1-2 detik)
   ```
3. Refresh page (dalam 3 menit):
   ```
   ✅ Data dari cache - hemat API call! (<100ms)
   ```

### **Monitor Apps Script Quota:**

1. Buka Apps Script Editor
2. Klik **Executions** di sidebar
3. Lihat execution time:
   - **Sebelum:** 2-5 detik per request
   - **Sesudah:** 0.5-1 detik per request (dengan cache)

---

## ⚡ Tips Tambahan

### **1. Lazy Loading Images**
Tambahkan di ObservationCard:
```javascript
<img 
  src={imageUrl}
  loading="lazy" // Browser akan load image saat visible
  alt="Observation"
/>
```

### **2. Debounce Refresh Button**
Cegah spam refresh:
```javascript
const [canRefresh, setCanRefresh] = useState(true);

const handleRefresh = () => {
  if (!canRefresh) return;
  
  setCanRefresh(false);
  fetchFeed(1, false);
  
  setTimeout(() => setCanRefresh(true), 3000); // Cooldown 3 detik
};
```

### **3. Background Sync (PWA)**
Untuk advanced optimization, convert ke PWA dengan Service Worker.

---

## 🎯 Expected Results

### **Quota Usage (100 active users):**

| Metric | Before | After | Savings |
|--------|--------|-------|---------|
| Daily API Calls | 1,000 | 200 | **80%** ⬇️ |
| Avg Response Time | 1.5s | 0.2s | **87%** ⬇️ |
| Execution Time/Call | 3s | 0.8s | **73%** ⬇️ |
| Timeout Risk | Medium | Low | **✅** |

### **User Experience:**
- ⚡ Page load terasa instant
- 🚀 Smooth scrolling & navigation
- 💾 Works offline (jika ada cached data)
- 📱 Mobile-friendly (hemat data)

---

## 🆘 Troubleshooting

### **Cache tidak bekerja?**
```javascript
// Clear semua cache dan test ulang
CacheManager.clearLocal();
localStorage.clear();
location.reload();
```

### **Data tidak update setelah submit?**
Pastikan ada `CacheManager.clearLocal()` di handleSubmit.

### **Apps Script masih timeout?**
- Kurangi limit per page (dari 10 ke 5)
- Tambah cache duration (dari 5 menit ke 10 menit)
- Split data ke multiple sheets

---

## 📞 Support

Jika ada pertanyaan atau issue:
1. Check console log (F12)
2. Check Apps Script execution log
3. Test dengan data kecil dulu (<100 rows)

---

**Version:** 1.0.0  
**Last Updated:** 2026-02-06  
**Author:** HSSE.Tech Team
