/**
 * Test Cost Plus API integration
 * Run with: node --loader tsx server/costplus-test.ts
 */

const COST_PLUS_API_BASE = 'https://us-central1-costplusdrugs-publicapi.cloudfunctions.net/main';

async function testCostPlusSearch(medicationName: string, strength?: string) {
  console.log(`\n🔍 Testing: ${medicationName} ${strength || ''}`);
  
  const params = new URLSearchParams({
    medication_name: medicationName,
  });
  
  if (strength) {
    params.append('strength', strength);
  }
  
  try {
    const url = `${COST_PLUS_API_BASE}?${params.toString()}`;
    console.log(`📡 URL: ${url}`);
    
    const response = await fetch(url);
    console.log(`📊 Status: ${response.status}`);
    
    if (!response.ok) {
      console.log(`❌ API returned error: ${response.status}`);
      return null;
    }
    
    const data = await response.json();
    console.log(`📦 Results count: ${data.results?.length || 0}`);
    
    if (data.results && data.results.length > 0) {
      const first = data.results[0];
      console.log(`✅ Found: ${first.medication_name} ${first.strength} - $${first.unit_price}`);
      return first;
    } else {
      console.log(`❌ No results found`);
      return null;
    }
  } catch (error) {
    console.error(`❌ Error:`, error);
    return null;
  }
}

async function runTests() {
  console.log('='.repeat(60));
  console.log('COST PLUS API TEST SUITE');
  console.log('='.repeat(60));
  
  // Test 1: Brand name (should fail, needs generic)
  await testCostPlusSearch('Lipitor', '10mg');
  
  // Test 2: Generic name (should succeed)
  await testCostPlusSearch('atorvastatin', '10mg');
  
  // Test 3: Generic without strength
  await testCostPlusSearch('atorvastatin');
  
  // Test 4: Another common medication
  await testCostPlusSearch('metformin', '500mg');
  
  // Test 5: Lowercase
  await testCostPlusSearch('levothyroxine');
  
  console.log('\n' + '='.repeat(60));
  console.log('TEST COMPLETE');
  console.log('='.repeat(60));
}

runTests();
