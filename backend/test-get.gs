// ============================================
// TEST SCRIPT - Untuk debugging GET request
// ============================================

// Jalankan fungsi ini di Apps Script Editor untuk test
function testGetRequest() {
  Logger.log('========================================');
  Logger.log('TESTING GET REQUEST');
  Logger.log('========================================');
  
  // Simulate GET request
  const mockEvent = {
    parameter: {
      page: '1',
      limit: '10'
    }
  };
  
  Logger.log('\n1. Testing doGet with page=1, limit=10...');
  const result = doGet(mockEvent);
  
  Logger.log('\n2. Result type: ' + typeof result);
  Logger.log('3. Content: ' + result.getContent());
  
  // Parse and display
  try {
    const parsed = JSON.parse(result.getContent());
    Logger.log('\n4. ✅ Valid JSON Response');
    Logger.log('5. Feed items: ' + (parsed.feed ? parsed.feed.length : 0));
    Logger.log('6. Stats: ' + JSON.stringify(parsed.stats));
    Logger.log('7. Has more: ' + parsed.hasMore);
    
    if (parsed.feed && parsed.feed.length > 0) {
      Logger.log('\n8. Sample item:');
      Logger.log(JSON.stringify(parsed.feed[0], null, 2));
    }
    
    Logger.log('\n========================================');
    Logger.log('✅ TEST PASSED - GET Request Working!');
    Logger.log('========================================');
    
    return parsed;
    
  } catch (e) {
    Logger.log('\n❌ ERROR: Invalid JSON response');
    Logger.log('Error: ' + e);
    Logger.log('\n========================================');
    Logger.log('❌ TEST FAILED');
    Logger.log('========================================');
  }
}

// Test direct function call
function testGetOptimizedFeedData() {
  Logger.log('========================================');
  Logger.log('TESTING getOptimizedFeedData DIRECTLY');
  Logger.log('========================================');
  
  try {
    const result = getOptimizedFeedData(1, 10);
    Logger.log('\n✅ Function executed successfully');
    Logger.log('Feed items: ' + (result.feed ? result.feed.length : 0));
    Logger.log('Stats: ' + JSON.stringify(result.stats));
    Logger.log('Has more: ' + result.hasMore);
    
    if (result.feed && result.feed.length > 0) {
      Logger.log('\nFirst item:');
      Logger.log(JSON.stringify(result.feed[0], null, 2));
    }
    
    return result;
    
  } catch (e) {
    Logger.log('❌ ERROR: ' + e);
    Logger.log('Stack: ' + e.stack);
  }
}

// Clear cache untuk testing
function clearAllCache() {
  Logger.log('Clearing all cache...');
  clearCache();
  Logger.log('✅ Cache cleared');
}
