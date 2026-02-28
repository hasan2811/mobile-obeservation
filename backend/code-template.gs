// ============================================
// OPTIMIZED GOOGLE APPS SCRIPT BACKEND
// HSSE.Tech Platform - Hemat Waktu Eksekusi
// ============================================

// ⚠️ IMPORTANT: Replace these with your own Google Drive & Spreadsheet IDs
// FOLDER_ID: Your Google Drive folder for file uploads
// SPREADSHEET_ID: Your Google Sheets database ID
const FOLDER_ID = "YOUR_GOOGLE_DRIVE_FOLDER_ID";
const SPREADSHEET_ID = "YOUR_GOOGLE_SPREADSHEET_ID";
const SHEET_NAME = "observation_data"; 
const USER_SHEET_NAME = "user";
const CACHE_DURATION = 300; // 5 menit cache

// ============================================
// HELPER: Cache Service untuk mengurangi read
// ============================================
function getCachedData(key) {
  const cache = CacheService.getScriptCache();
  const cached = cache.get(key);
  return cached ? JSON.parse(cached) : null;
}

function setCachedData(key, data, duration = CACHE_DURATION) {
  const cache = CacheService.getScriptCache();
  cache.put(key, JSON.stringify(data), duration);
}

function clearCache(key) {
  const cache = CacheService.getScriptCache();
  if (key) {
    cache.remove(key);
  } else {
    cache.removeAll(['feed_data', 'user_list', 'stats_data']);
  }
}

// ============================================
// NOTE: This is a TEMPLATE file
// ============================================
// To use this backend:
// 1. Copy the COMPLETE contents from: backend/code-optimized.gs
// 2. Paste into Google Apps Script editor
// 3. Replace FOLDER_ID and SPREADSHEET_ID with your actual IDs
// 4. Deploy as Web App
// 5. Copy the deployment URL to .env file
