# 🔧 PANDUAN PERBAIKAN GET REQUEST - Feed Tidak Tampil

## 📋 Masalah
- ✅ POST request berfungsi (data berhasil di-insert)
- ❌ GET request tidak menampilkan feed
- Penyebab: Backend belum di-deploy atau ada error di doGet

## 🚀 LANGKAH PERBAIKAN

### 1. Deploy Backend yang Sudah Diperbaiki

#### A. Buka Google Apps Script
1. Buka: https://script.google.com
2. Buka project Apps Script Anda
3. Pastikan file `code-optimized.gs` sudah terupdate

#### B. Copy Kode yang Sudah Diperbaiki
1. Buka file: `backend/code-optimized.gs`
2. Copy SEMUA isi file
3. Paste ke Apps Script Editor (replace semua kode lama)

#### C. Deploy Ulang
1. Klik **Deploy** > **Manage deployments**
2. Klik ikon ⚙️ (gear) di deployment yang aktif
3. Pilih **New version** di dropdown "Version"
4. Klik **Deploy**
5. **PENTING**: Copy URL deployment yang baru (jika berubah)

### 2. Test Backend di Apps Script

#### A. Jalankan Test Function
1. Di Apps Script Editor, pilih function: `testGetRequest`
2. Klik **Run** (▶️)
3. Lihat hasil di **Execution log** (View > Logs)

#### B. Cek Output
Anda harus melihat:
```
✅ TEST PASSED - GET Request Working!
Feed items: X
Stats: {...}
```

Jika ada error, lihat detail error di log.

### 3. Update URL di Frontend (Jika Perlu)

Jika URL deployment berubah:

1. Buka: `src/App.js`
2. Update baris 12:
```javascript
const WEB_APP_URL = "URL_DEPLOYMENT_BARU_ANDA";
```

### 4. Test dari Browser

#### A. Test GET Request Langsung
Buka di browser:
```
https://script.google.com/macros/s/YOUR_DEPLOYMENT_ID/exec?page=1&limit=10
```

Anda harus melihat JSON response seperti:
```json
{
  "feed": [...],
  "stats": {
    "total": 10,
    "unsafe": 5,
    "safe": 3,
    "nearmiss": 2
  },
  "hasMore": true
}
```

#### B. Test di Aplikasi React
1. Jalankan aplikasi: `npm start`
2. Login
3. Cek apakah feed muncul
4. Buka Console (F12) untuk lihat error (jika ada)

## 🔍 DEBUGGING

### Jika Feed Masih Tidak Muncul

#### 1. Cek Console Browser
```javascript
// Buka Console (F12) dan lihat error
// Cari error seperti:
// - CORS error
// - Network error
// - JSON parse error
```

#### 2. Cek Network Tab
1. Buka DevTools (F12)
2. Tab **Network**
3. Refresh halaman
4. Cari request ke Apps Script URL
5. Klik request tersebut
6. Lihat **Response** tab

#### 3. Cek Apps Script Logs
1. Buka Apps Script Editor
2. Klik **Executions** (⏱️ icon)
3. Lihat log dari GET request terakhir
4. Cari error messages

### Error Umum dan Solusinya

#### Error: "Sheet not found"
**Solusi**: Cek nama sheet di `SHEET_NAME` (line 9)
```javascript
const SHEET_NAME = "observation_data"; // Harus sama dengan nama sheet
```

#### Error: "Permission denied"
**Solusi**: 
1. Re-deploy dengan "Execute as: Me"
2. "Who has access: Anyone"

#### Error: "Invalid JSON"
**Solusi**: Cek Apps Script logs untuk error detail

## 📊 PERUBAHAN YANG DIBUAT

### 1. Enhanced Error Handling di `doGet`
- ✅ Logging detail untuk debugging
- ✅ Return valid JSON bahkan saat error
- ✅ Error stack trace untuk troubleshooting

### 2. Robust Data Fetching di `getOptimizedFeedData`
- ✅ Try-catch wrapper
- ✅ Null checks untuk sheet
- ✅ Filter empty rows
- ✅ Default values untuk missing data
- ✅ Detailed logging

### 3. Test Functions
- ✅ `testGetRequest()` - Test doGet function
- ✅ `testGetOptimizedFeedData()` - Test data fetching
- ✅ `clearAllCache()` - Clear cache untuk testing

## ✅ CHECKLIST DEPLOYMENT

- [ ] Kode backend sudah di-copy ke Apps Script
- [ ] Deploy ulang dengan version baru
- [ ] Test function `testGetRequest()` berhasil
- [ ] Test GET request di browser mengembalikan JSON
- [ ] URL di frontend sudah benar
- [ ] Aplikasi React berjalan
- [ ] Feed muncul di aplikasi
- [ ] Console browser tidak ada error

## 🆘 JIKA MASIH BERMASALAH

1. **Screenshot error** dari:
   - Browser Console (F12)
   - Apps Script Execution log
   - Network tab response

2. **Cek konfigurasi**:
   ```javascript
   // Di code-optimized.gs
   SPREADSHEET_ID: "1xVJ2hQEDYCMafWRFd2LfAEgdTbGa6swRunKBVrwiriE"
   SHEET_NAME: "observation_data"
   ```

3. **Verifikasi data di spreadsheet**:
   - Buka spreadsheet
   - Pastikan ada data di sheet "observation_data"
   - Pastikan ada header di row 1
   - Pastikan ada data di row 2+

## 📝 CATATAN PENTING

1. **Cache**: Backend menggunakan cache 3 menit. Jika test, clear cache dulu dengan `clearAllCache()`

2. **Deployment**: Setiap kali ubah kode, HARUS deploy ulang dengan version baru

3. **URL**: Pastikan URL di frontend sama dengan URL deployment

4. **Permissions**: Pastikan deployment settings:
   - Execute as: **Me**
   - Who has access: **Anyone**

---

**Dibuat**: 2026-02-06
**Versi Backend**: Optimized v2.0
**Status**: Ready for deployment
