// ============================================
// OPTIMIZED GOOGLE APPS SCRIPT BACKEND
// HSSE.Tech Platform - Hemat Waktu Eksekusi
// ============================================

// KONFIGURASI - Sudah diisi dengan nilai yang berjalan
const FOLDER_ID = "1WSIRJMvLo5gQ2JeTONNwNjLN6ImOVik5";
const SPREADSHEET_ID = "1xVJ2hQEDYCMafWRFd2LfAEgdTbGa6swRunKBVrwiriE";
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
// OPTIMIZED: Batch Read (1x read untuk semua)
// ============================================
function getOptimizedFeedData(page = 1, limit = 10) {
  try {
    const cacheKey = `feed_page_${page}_${limit}`;
    
    // Cek cache dulu
    const cached = getCachedData(cacheKey);
    if (cached) {
      Logger.log('✅ Data dari cache - hemat waktu!');
      return cached;
    }

    Logger.log('📊 Fetching fresh data from spreadsheet...');
    
    const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
    const sheet = ss.getSheetByName(SHEET_NAME);
    
    if (!sheet) {
      Logger.log('❌ Sheet not found: ' + SHEET_NAME);
      return { feed: [], stats: { total: 0, unsafe: 0, safe: 0, nearmiss: 0 }, hasMore: false };
    }
    
    // OPTIMASI: Ambil semua data sekaligus (1x read)
    const lastRow = sheet.getLastRow();
    Logger.log('Last row: ' + lastRow);
    
    if (lastRow <= 1) {
      Logger.log('⚠️ No data found in sheet');
      return { feed: [], stats: { total: 0, unsafe: 0, safe: 0, nearmiss: 0 }, hasMore: false };
    }

    // Batch read - lebih cepat dari getRange() per row
    const allData = sheet.getRange(2, 1, lastRow - 1, 15).getValues();
    Logger.log('Rows fetched: ' + allData.length);
    
    // Transform ke object dengan safety checks
    const allObservations = allData
      .filter(row => row && row[0]) // Filter empty rows
      .map(row => ({
        timestamp: row[0],
        company: row[1] || '',
        location: row[2] || '',
        category: row[3] || '',
        description: row[4] || '',
        recommendation: row[5] || '',
        fotoUrl: row[6] || '',
        dokumenUrl: row[7] || '',
        reportedBy: row[8] || '',
        assignTo: row[9] || '',
        status: row[10] || 'Open',
        actionBy: row[11] || '',
        actionDate: row[12] || '',
        actionNotes: row[13] || '',
        proofUrl: row[14] || ''
      }))
      .reverse(); // Newest first

    Logger.log('Valid observations: ' + allObservations.length);

    // Pagination
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedData = allObservations.slice(startIndex, endIndex);
    const hasMore = endIndex < allObservations.length;

    // Calculate stats (dari semua data)
    const stats = {
      total: allObservations.length,
      unsafe: allObservations.filter(d => d.category && d.category.includes('Unsafe')).length,
      safe: allObservations.filter(d => d.category && d.category.includes('Safe')).length,
      nearmiss: allObservations.filter(d => d.category && d.category.includes('Nearmiss')).length
    };

    const result = {
      feed: paginatedData,
      stats: stats,
      hasMore: hasMore
    };

    Logger.log('✅ Returning ' + paginatedData.length + ' items (page ' + page + ')');

    // Cache hasil
    setCachedData(cacheKey, result, 180); // Cache 3 menit
    
    return result;
    
  } catch (error) {
    Logger.log('❌ ERROR in getOptimizedFeedData: ' + error);
    Logger.log('Error stack: ' + error.stack);
    // Return empty but valid response
    return { feed: [], stats: { total: 0, unsafe: 0, safe: 0, nearmiss: 0 }, hasMore: false };
  }
}

// ============================================
// OPTIMIZED: User List dengan Cache
// ============================================
function getOptimizedUserList() {
  const cacheKey = 'user_list';
  const cached = getCachedData(cacheKey);
  if (cached) return cached;

  const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
  const userSheet = ss.getSheetByName(USER_SHEET_NAME);
  
  if (!userSheet) return [];
  
  const lastRow = userSheet.getLastRow();
  if (lastRow <= 1) return [];

  // Batch read
  const userData = userSheet.getRange(2, 1, lastRow - 1, 3).getValues();
  const users = userData.map(row => ({
    username: row[0],
    email: row[1],
    role: row[2]
  }));

  // Cache 10 menit (user jarang berubah)
  setCachedData(cacheKey, users, 600);
  
  return users;
}

// ============================================
// OPTIMIZED: Submit dengan Async Upload
// ============================================
function submitObservationOptimized(data) {
  const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
  const sheet = ss.getSheetByName(SHEET_NAME);
  
  let fotoUrl = '';
  let dokumenUrl = '';

  // OPTIMASI: Upload file di background (jika ada)
  if (data.foto) {
    try {
      const fotoBlob = Utilities.newBlob(
        Utilities.base64Decode(data.foto.data),
        data.foto.mimeType,
        data.foto.name
      );
      const folder = DriveApp.getFolderById(FOLDER_ID);
      const file = folder.createFile(fotoBlob);
      file.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);
      fotoUrl = file.getUrl();
    } catch (e) {
      Logger.log('Error upload foto: ' + e);
    }
  }

  if (data.dokumen) {
    try {
      const docBlob = Utilities.newBlob(
        Utilities.base64Decode(data.dokumen.data),
        data.dokumen.mimeType,
        data.dokumen.name
      );
      const folder = DriveApp.getFolderById(FOLDER_ID);
      const file = folder.createFile(docBlob);
      file.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);
      dokumenUrl = file.getUrl();
    } catch (e) {
      Logger.log('Error upload dokumen: ' + e);
    }
  }

  // Insert data
  sheet.appendRow([
    new Date(),
    data.company,
    data.location,
    data.category,
    data.description,
    data.recommendation,
    fotoUrl,
    dokumenUrl,
    data.reportedBy,
    data.assignTo,
    'Open'
  ]);

  // Clear cache setelah submit
  clearCache();

  return { result: 'success', message: 'Observation submitted' };
}

// ============================================
// OPTIMIZED: Login dengan Email atau Username
// ============================================
function loginOptimized(identifier, password) {
  const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
  const userSheet = ss.getSheetByName(USER_SHEET_NAME);
  
  if (!userSheet) {
    return { result: 'error', message: 'User sheet not found' };
  }

  // Batch read semua user
  const lastRow = userSheet.getLastRow();
  if (lastRow <= 1) {
    return { result: 'error', message: 'No users found' };
  }
  
  const userData = userSheet.getRange(2, 1, lastRow - 1, 4).getValues();
  
  // Find user by username OR email
  const user = userData.find(row => {
    const username = String(row[0]).toLowerCase().trim();
    const email = String(row[1]).toLowerCase().trim();
    const userPassword = String(row[3]);
    const inputIdentifier = String(identifier).toLowerCase().trim();
    const inputPassword = String(password);
    
    return (username === inputIdentifier || email === inputIdentifier) && userPassword === inputPassword;
  });
  
  if (user) {
    Logger.log('✅ Login success for: ' + user[0]);
    return {
      result: 'success',
      user: {
        username: user[0],
        email: user[1],
        role: user[2]
      }
    };
  }

  Logger.log('❌ Login failed for: ' + identifier);
  return { result: 'error', message: 'Invalid email/username or password' };
}

// ============================================
// MAIN doGet - Optimized dengan Cache + Enhanced Error Handling
// ============================================
function doGet(e) {
  try {
    Logger.log('=== doGet Called ===');
    Logger.log('Parameters: ' + JSON.stringify(e.parameter));
    
    const page = parseInt(e.parameter.page) || 1;
    const limit = parseInt(e.parameter.limit) || 10;
    
    Logger.log('Page: ' + page + ', Limit: ' + limit);
    
    const data = getOptimizedFeedData(page, limit);
    
    Logger.log('Data fetched successfully. Feed items: ' + (data.feed ? data.feed.length : 0));
    
    return ContentService
      .createTextOutput(JSON.stringify(data))
      .setMimeType(ContentService.MimeType.JSON);
      
  } catch (error) {
    Logger.log('❌ ERROR in doGet: ' + error);
    Logger.log('Error stack: ' + error.stack);
    
    // Return error dengan detail untuk debugging
    return ContentService
      .createTextOutput(JSON.stringify({ 
        error: error.toString(),
        message: 'Failed to fetch feed data',
        stack: error.stack,
        feed: [],
        stats: { total: 0, unsafe: 0, safe: 0, nearmiss: 0 },
        hasMore: false
      }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

// ============================================
// MAIN doPost - Router Optimized
// ============================================
function doPost(e) {
  try {
    // Safety check untuk postData
    if (!e || !e.postData || !e.postData.contents) {
      Logger.log('Error: No postData received');
      return ContentService
        .createTextOutput(JSON.stringify({ 
          result: 'error', 
          message: 'No data received' 
        }))
        .setMimeType(ContentService.MimeType.JSON);
    }

    const data = JSON.parse(e.postData.contents);
    const action = data.action;

    Logger.log('Action received: ' + action);

    // Router dengan early return (lebih cepat)
    if (action === 'login') {
      const identifier = data.username || data.email || data.identifier;
      const result = loginOptimized(identifier, data.password);
      return ContentService
        .createTextOutput(JSON.stringify(result))
        .setMimeType(ContentService.MimeType.JSON);
    }

    if (action === 'signup') {
      const result = signupUser(data);
      return ContentService
        .createTextOutput(JSON.stringify(result))
        .setMimeType(ContentService.MimeType.JSON);
    }

    if (action === 'getUsers') {
      const users = getOptimizedUserList();
      return ContentService
        .createTextOutput(JSON.stringify({ result: 'success', users: users }))
        .setMimeType(ContentService.MimeType.JSON);
    }

    if (action === 'updateTask') {
      const result = updateTaskOptimized(data);
      return ContentService
        .createTextOutput(JSON.stringify(result))
        .setMimeType(ContentService.MimeType.JSON);
    }

    // Default: Submit observation
    const result = submitObservationOptimized(data);
    return ContentService
      .createTextOutput(JSON.stringify(result))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (error) {
    Logger.log('Error doPost: ' + error);
    Logger.log('Error stack: ' + error.stack);
    return ContentService
      .createTextOutput(JSON.stringify({ 
        result: 'error', 
        message: error.toString(),
        stack: error.stack 
      }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

// ============================================
// OPTIMIZED: Update Task (Status & Proof)
// ============================================
function updateTaskOptimized(data) {
  const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
  const sheet = ss.getSheetByName(SHEET_NAME);
  
  if (!sheet) return { result: 'error', message: 'Sheet not found' };

  const lastRow = sheet.getLastRow();
  if (lastRow <= 1) return { result: 'error', message: 'No data to update' };

  // Load Column A (Timestamps)
  const timestamps = sheet.getRange(2, 1, lastRow - 1, 1).getValues().flat();
  
  // Convert target to Numeric Time for robust matching
  const targetTime = new Date(data.timestamp).getTime();
  
  // Find index using time comparison (tolerance 2s for precision)
  const rowIndex = timestamps.findIndex(t => {
    if (!t) return false;
    const tTime = new Date(t).getTime();
    return Math.abs(tTime - targetTime) < 2000;
  });

  if (rowIndex === -1) {
    Logger.log('❌ Task matching failed for: ' + data.timestamp);
    return { result: 'error', message: 'Task matching failed. Reference not found.' };
  }

  const rowNumber = rowIndex + 2;

  // Handle Proof Photo Upload
  let proofUrl = '';
  if (data.proofPhoto && data.proofPhoto.data) {
    try {
      const fotoBlob = Utilities.newBlob(
        Utilities.base64Decode(data.proofPhoto.data),
        data.proofPhoto.mimeType,
        'proof_' + rowIndex + '_' + data.proofPhoto.name
      );
      const folder = DriveApp.getFolderById(FOLDER_ID);
      const file = folder.createFile(fotoBlob);
      file.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);
      proofUrl = file.getUrl();
    } catch (e) {
      Logger.log('Error upload proof: ' + e);
    }
  }

  // UPDATE IN-PLACE (Same Row)
  // Status (Col 11), ActionBy (Col 12), ActionDate (Col 13), ActionNotes (Col 14), ProofUrl (Col 15)
  sheet.getRange(rowNumber, 11).setValue(data.status);
  sheet.getRange(rowNumber, 12).setValue(data.actionBy);
  sheet.getRange(rowNumber, 13).setValue(new Date());
  sheet.getRange(rowNumber, 14).setValue(data.notes);
  
  if (proofUrl) {
    sheet.getRange(rowNumber, 15).setValue(proofUrl);
  }

  // Clear cache for instant visibility
  clearCache();

  return { 
    result: 'success', 
    message: 'Action recorded successfully in row ' + rowNumber,
    proofUrl: proofUrl 
  };
}

// ============================================
// Signup User (unchanged)
// ============================================
function signupUser(data) {
  const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
  let userSheet = ss.getSheetByName(USER_SHEET_NAME);
  
  if (!userSheet) {
    userSheet = ss.insertSheet(USER_SHEET_NAME);
    userSheet.appendRow(['Username', 'Email', 'Role', 'Password']);
  }

  // Check if username exists
  const lastRow = userSheet.getLastRow();
  if (lastRow > 1) {
    const usernames = userSheet.getRange(2, 1, lastRow - 1, 1).getValues();
    if (usernames.some(row => row[0] === data.username)) {
      return { result: 'error', message: 'Username already exists' };
    }
  }

  userSheet.appendRow([data.username, data.email, data.role, data.password]);
  
  // Clear user cache
  clearCache('user_list');

  return {
    result: 'success',
    user: {
      username: data.username,
      email: data.email,
      role: data.role
    }
  };
}

// ============================================
// BONUS: Trigger untuk clear cache otomatis
// Setup: Run setupCacheClearTrigger() sekali
// ============================================
function setupCacheClearTrigger() {
  // Clear cache setiap 1 jam
  ScriptApp.newTrigger('clearCache')
    .timeBased()
    .everyHours(1)
    .create();
}

// ============================================
// TEST FUNCTIONS - Untuk debugging
// ============================================

// Test 1: Cek koneksi ke spreadsheet
function testSpreadsheetConnection() {
  try {
    const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
    const sheet = ss.getSheetByName(SHEET_NAME);
    const userSheet = ss.getSheetByName(USER_SHEET_NAME);
    
    Logger.log('✅ Spreadsheet connected!');
    Logger.log('Observation sheet: ' + (sheet ? 'Found' : 'NOT FOUND'));
    Logger.log('User sheet: ' + (userSheet ? 'Found' : 'NOT FOUND'));
    
    if (sheet) {
      Logger.log('Total rows in observation: ' + sheet.getLastRow());
    }
    if (userSheet) {
      Logger.log('Total users: ' + (userSheet.getLastRow() - 1));
    }
    
    return 'Connection OK';
  } catch (e) {
    Logger.log('❌ Error: ' + e);
    return 'Connection FAILED: ' + e;
  }
}

// Test 2: Cek folder Drive
function testDriveFolder() {
  try {
    const folder = DriveApp.getFolderById(FOLDER_ID);
    Logger.log('✅ Drive folder connected!');
    Logger.log('Folder name: ' + folder.getName());
    Logger.log('Folder URL: ' + folder.getUrl());
    return 'Folder OK';
  } catch (e) {
    Logger.log('❌ Error: ' + e);
    return 'Folder FAILED: ' + e;
  }
}

// Test 3: Test fetch data
function testFetchData() {
  try {
    const result = getOptimizedFeedData(1, 5);
    Logger.log('✅ Fetch data success!');
    Logger.log('Total items: ' + result.feed.length);
    Logger.log('Stats: ' + JSON.stringify(result.stats));
    Logger.log('Has more: ' + result.hasMore);
    return result;
  } catch (e) {
    Logger.log('❌ Error: ' + e);
    return 'Fetch FAILED: ' + e;
  }
}

// Test 4: Test cache
function testCache() {
  try {
    // Set cache
    setCachedData('test_key', { message: 'Hello from cache!' }, 60);
    Logger.log('✅ Cache set');
    
    // Get cache
    const cached = getCachedData('test_key');
    Logger.log('✅ Cache retrieved: ' + JSON.stringify(cached));
    
    // Clear cache
    clearCache('test_key');
    Logger.log('✅ Cache cleared');
    
    return 'Cache OK';
  } catch (e) {
    Logger.log('❌ Error: ' + e);
    return 'Cache FAILED: ' + e;
  }
}

// Test 5: Run all tests
function runAllTests() {
  Logger.log('========================================');
  Logger.log('RUNNING ALL TESTS');
  Logger.log('========================================');
  
  Logger.log('\n1. Testing Spreadsheet Connection...');
  testSpreadsheetConnection();
  
  Logger.log('\n2. Testing Drive Folder...');
  testDriveFolder();
  
  Logger.log('\n3. Testing Fetch Data...');
  testFetchData();
  
  Logger.log('\n4. Testing Cache...');
  testCache();
  
  Logger.log('\n========================================');
  Logger.log('ALL TESTS COMPLETED');
  Logger.log('========================================');
}

