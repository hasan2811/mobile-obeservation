# 🔧 TROUBLESHOOTING GUIDE - Apps Script Optimized

## ❌ Error: "Cannot read properties of undefined (reading 'postData')"

### **Penyebab:**
Apps Script menerima request tanpa data POST yang valid.

### **Solusi:**
✅ **SUDAH DIPERBAIKI!** File `code-optimized.gs` sudah diupdate dengan safety check.

### **Cara Test:**

1. **Buka Apps Script Editor**
2. **Pilih function:** `runAllTests`
3. **Klik Run** (▶️)
4. **Lihat Execution Log:**
   - Klik "View" → "Execution log"
   - Atau klik icon "Executions" di sidebar

### **Expected Output:**
```
========================================
RUNNING ALL TESTS
========================================

1. Testing Spreadsheet Connection...
✅ Spreadsheet connected!
Observation sheet: Found
User sheet: Found
Total rows in observation: 25
Total users: 5

2. Testing Drive Folder...
✅ Drive folder connected!
Folder name: HSSE Uploads
Folder URL: https://drive.google.com/...

3. Testing Fetch Data...
✅ Fetch data success!
Total items: 5
Stats: {"total":25,"unsafe":10,"safe":12,"nearmiss":3}
Has more: true

4. Testing Cache...
✅ Cache set
✅ Cache retrieved: {"message":"Hello from cache!"}
✅ Cache cleared

========================================
ALL TESTS COMPLETED
========================================
```

---

## 🐛 Common Errors & Solutions

### **1. Error: "Exception: Spreadsheet not found"**

**Penyebab:** SPREADSHEET_ID salah atau tidak ada akses

**Solusi:**
```javascript
// Cek SPREADSHEET_ID di line 8
const SPREADSHEET_ID = "1xVJ2hQEDYCMafWRFd2LfAEgdTbGa6swRunKBVrwiriE";

// Cara dapat ID:
// 1. Buka spreadsheet di browser
// 2. Lihat URL: https://docs.google.com/spreadsheets/d/[INI_ID_NYA]/edit
// 3. Copy ID antara /d/ dan /edit
```

**Test:**
```javascript
// Run function: testSpreadsheetConnection
```

---

### **2. Error: "Exception: Folder not found"**

**Penyebab:** FOLDER_ID salah atau tidak ada akses

**Solusi:**
```javascript
// Cek FOLDER_ID di line 7
const FOLDER_ID = "1WSIRJMvLo5gQ2JeTONNwNjLN6ImOVik5";

// Cara dapat ID:
// 1. Buka folder di Google Drive
// 2. Lihat URL: https://drive.google.com/drive/folders/[INI_ID_NYA]
// 3. Copy ID setelah /folders/
```

**Test:**
```javascript
// Run function: testDriveFolder
```

---

### **3. Error: "Sheet not found: observation_data"**

**Penyebab:** Nama sheet tidak sesuai

**Solusi:**
```javascript
// Cek nama sheet di spreadsheet Anda
// Update di line 9-10:
const SHEET_NAME = "observation_data";  // Ganti sesuai nama sheet Anda
const USER_SHEET_NAME = "user";         // Ganti sesuai nama sheet Anda
```

**Cara Cek:**
1. Buka spreadsheet
2. Lihat tab di bawah (nama sheet)
3. Pastikan persis sama (case-sensitive!)

---

### **4. Error: "Service invoked too many times"**

**Penyebab:** Terlalu banyak request dalam waktu singkat

**Solusi:**
✅ **Cache sudah aktif!** Ini akan mengurangi request.

**Tambahan:**
- Tunggu 1-2 menit
- Clear cache: `clearCache()`
- Increase cache duration di line 11:
  ```javascript
  const CACHE_DURATION = 600; // 10 menit (dari 5 menit)
  ```

---

### **5. Error: "Execution time exceeded"**

**Penyebab:** Script terlalu lama (>6 menit)

**Solusi:**
✅ **Batch read sudah aktif!** Ini akan mempercepat.

**Jika masih timeout:**
- Kurangi limit per page:
  ```javascript
  const limit = parseInt(e.parameter.limit) || 5; // Dari 10 ke 5
  ```
- Split data ke multiple sheets (per bulan/tahun)

---

### **6. Data tidak muncul di frontend**

**Checklist:**

**A. Cek Backend:**
```javascript
// Run: testFetchData
// Harusnya return data
```

**B. Cek URL di Frontend:**
```javascript
// Di App.js line 12, pastikan URL benar:
const WEB_APP_URL = "https://script.google.com/macros/s/YOUR_DEPLOYMENT_ID/exec";
```

**C. Cek Console Browser:**
```javascript
// Buka DevTools (F12)
// Lihat tab Console
// Cari error merah
```

**D. Cek Network Tab:**
```javascript
// DevTools → Network
// Refresh page
// Klik request ke Apps Script
// Lihat Response
```

---

### **7. Cache tidak bekerja**

**Symptoms:**
- Setiap refresh selalu fetch dari server
- Tidak ada log "✅ Data dari cache"

**Solusi:**

**Backend:**
```javascript
// Test cache:
testCache()

// Jika error, cek quota:
// https://script.google.com/home/my
// Lihat "Quotas" di sidebar
```

**Frontend:**
```javascript
// Buka DevTools Console
// Check localStorage:
localStorage.getItem('cache_feed_page_1')

// Jika null, cache belum tersimpan
// Clear dan test ulang:
localStorage.clear()
location.reload()
```

---

### **8. Upload file gagal**

**Error:** "Error upload foto/dokumen"

**Solusi:**

**A. Cek Folder Permission:**
```javascript
// Run: testDriveFolder
// Pastikan folder accessible
```

**B. Cek File Size:**
```javascript
// Max file size untuk Apps Script: 50 MB
// Compress image sebelum upload
```

**C. Cek MIME Type:**
```javascript
// Supported:
// Images: image/jpeg, image/png, image/gif
// PDF: application/pdf
```

---

## 🔍 Debugging Steps

### **Step 1: Run All Tests**
```javascript
// Di Apps Script Editor:
// 1. Select function: runAllTests
// 2. Click Run
// 3. Check Execution log
```

### **Step 2: Check Deployment**
```javascript
// 1. Deploy → Manage deployments
// 2. Check "Active" deployment
// 3. Copy Web app URL
// 4. Test di browser: URL?page=1&limit=5
```

### **Step 3: Check Permissions**
```javascript
// 1. Run any function first time
// 2. Click "Review permissions"
// 3. Choose your account
// 4. Click "Advanced" → "Go to [Project]"
// 5. Click "Allow"
```

### **Step 4: Check Logs**
```javascript
// Apps Script Editor:
// 1. Click "Executions" (sidebar)
// 2. See recent executions
// 3. Click any execution to see details
// 4. Check error messages
```

---

## 📊 Performance Monitoring

### **Check Execution Time:**
```javascript
// Apps Script Editor → Executions
// Look at "Duration" column
// Target: <1 second per request
```

### **Check Cache Hit Rate:**
```javascript
// Look at logs:
// "✅ Data dari cache" = Cache HIT (good!)
// No message = Cache MISS (fetch from sheets)
```

### **Check Quota Usage:**
```javascript
// https://script.google.com/home/my
// Dashboard → Quotas
// Monitor:
// - URL Fetch calls
// - Execution time
// - Triggers total runtime
```

---

## 🆘 Still Having Issues?

### **Quick Diagnostic:**

Run this in Apps Script:
```javascript
function quickDiagnostic() {
  Logger.log('=== DIAGNOSTIC REPORT ===');
  Logger.log('Spreadsheet ID: ' + SPREADSHEET_ID);
  Logger.log('Folder ID: ' + FOLDER_ID);
  Logger.log('Sheet Name: ' + SHEET_NAME);
  Logger.log('User Sheet: ' + USER_SHEET_NAME);
  
  try {
    const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
    Logger.log('✅ Spreadsheet OK');
    
    const sheet = ss.getSheetByName(SHEET_NAME);
    Logger.log(sheet ? '✅ Observation sheet OK' : '❌ Observation sheet NOT FOUND');
    
    const userSheet = ss.getSheetByName(USER_SHEET_NAME);
    Logger.log(userSheet ? '✅ User sheet OK' : '❌ User sheet NOT FOUND');
    
    const folder = DriveApp.getFolderById(FOLDER_ID);
    Logger.log('✅ Drive folder OK');
    
  } catch (e) {
    Logger.log('❌ ERROR: ' + e);
  }
}
```

### **Get Help:**
1. Copy error message dari Execution log
2. Copy diagnostic report
3. Check configuration values
4. Verify sheet names match exactly

---

## ✅ Success Checklist

Before going live, verify:

- [ ] `runAllTests()` passes all tests
- [ ] `testFetchData()` returns data
- [ ] `testCache()` works
- [ ] Frontend can fetch data
- [ ] Login/signup works
- [ ] Submit observation works
- [ ] File upload works
- [ ] Cache is working (check logs)
- [ ] No timeout errors
- [ ] Response time <1 second

---

**Last Updated:** 2026-02-06  
**Version:** 1.0.0
