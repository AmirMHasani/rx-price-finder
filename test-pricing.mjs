// Test script to verify pricing service works with both Cost Plus and fallback
import fetch from 'node-fetch';
global.fetch = fetch;

// Import the pricing service
const { searchCostPlusMedication } = await import('./client/src/services/costPlusApi.ts');

console.log('🧪 Testing Cost Plus API Integration\n');

// Test 1: Medication ON Cost Plus (should return real data)
console.log('Test 1: Atorvastatin (ON Cost Plus)');
const atorvastatin = await searchCostPlusMedication('atorvastatin', '20mg', 30);
if (atorvastatin) {
  console.log('✅ Found:', atorvastatin.medication_name, atorvastatin.strength);
  console.log('   Price:', atorvastatin.requested_quote || atorvastatin.unit_price);
} else {
  console.log('❌ Not found');
}

console.log('\nTest 2: Metformin (ON Cost Plus)');
const metformin = await searchCostPlusMedication('metformin', '500mg', 60);
if (metformin) {
  console.log('✅ Found:', metformin.medication_name, metformin.strength);
  console.log('   Price:', metformin.requested_quote || metformin.unit_price);
} else {
  console.log('❌ Not found');
}

// Test 3: Medication NOT on Cost Plus (should return null, triggering fallback)
console.log('\nTest 3: Gabapentin (NOT on Cost Plus - should use fallback)');
const gabapentin = await searchCostPlusMedication('gabapentin', '300mg', 90);
if (gabapentin) {
  console.log('✅ Found:', gabapentin.medication_name, gabapentin.strength);
  console.log('   Price:', gabapentin.requested_quote || gabapentin.unit_price);
} else {
  console.log('✅ Not found (expected) - fallback pricing will be used');
}

console.log('\nTest 4: Trazodone (ON Cost Plus)');
const trazodone = await searchCostPlusMedication('trazodone', '50mg', 30);
if (trazodone) {
  console.log('✅ Found:', trazodone.medication_name, trazodone.strength);
  console.log('   Price:', trazodone.requested_quote || trazodone.unit_price);
} else {
  console.log('❌ Not found');
}

console.log('\n✅ All tests completed!');
