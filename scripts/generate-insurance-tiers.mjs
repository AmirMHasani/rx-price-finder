// Script to generate insurance carriers with realistic tier-based copays
// Run with: node scripts/generate-insurance-tiers.mjs

// Base tier copays for different plan types
const TIER_COPAYS_BY_PLAN_TYPE = {
  'HMO': { tier1: 8, tier2: 35, tier3: 70, tier4: 140 },      // Lowest cost
  'EPO': { tier1: 10, tier2: 40, tier3: 75, tier4: 160 },     // Mid-low cost
  'PPO': { tier1: 12, tier2: 45, tier3: 85, tier4: 180 },     // Baseline
  'POS': { tier1: 11, tier2: 42, tier3: 80, tier4: 170 },     // Mid cost
  'HDHP': { tier1: 18, tier2: 65, tier3: 120, tier4: 250 },   // Highest cost (before deductible)
  'Medicare': { tier1: 5, tier2: 35, tier3: 75, tier4: 150 }, // Federal program
  'Medicaid': { tier1: 1, tier2: 3, tier3: 5, tier4: 8 },     // State/federal low-income
};

// Helper to add slight variation to copays
const addVariation = (amount, variation = 0.15) => {
  const min = Math.round(amount * (1 - variation));
  const max = Math.round(amount * (1 + variation));
  return Math.round(min + Math.random() * (max - min));
};

// Extract plan type from plan name/description
const getPlanType = (planName, planDescription = '') => {
  const text = `${planName} ${planDescription}`.toLowerCase();
  
  if (text.includes('hmo') || text.includes('health maintenance')) return 'HMO';
  if (text.includes('ppo') || text.includes('preferred provider')) return 'PPO';
  if (text.includes('epo') || text.includes('exclusive provider')) return 'EPO';
  if (text.includes('pos') || text.includes('point of service')) return 'POS';
  if (text.includes('hdhp') || text.includes('high deductible') || text.includes('hsa')) return 'HDHP';
  if (text.includes('medicare') || text.includes('advantage') || text.includes('medigap')) return 'Medicare';
  if (text.includes('medicaid')) return 'Medicaid';
  
  // Default to PPO if can't determine
  return 'PPO';
};

// Generate tier copays for a plan
const generateTierCopays = (planType) => {
  const baseCopays = TIER_COPAYS_BY_PLAN_TYPE[planType] || TIER_COPAYS_BY_PLAN_TYPE['PPO'];
  
  return {
    tier1: addVariation(baseCopays.tier1, 0.2),
    tier2: addVariation(baseCopays.tier2, 0.15),
    tier3: addVariation(baseCopays.tier3, 0.15),
    tier4: addVariation(baseCopays.tier4, 0.1),
  };
};

// Read the current carriers file
import { readFileSync, writeFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const carriersPath = join(__dirname, '../client/src/data/insuranceCarriers.ts');

const content = readFileSync(carriersPath, 'utf-8');

// Extract the carriers array
const carriersMatch = content.match(/export const INSURANCE_CARRIERS[^=]*=\s*(\[[\s\S]*?\n\];)/);
if (!carriersMatch) {
  console.error('Could not find INSURANCE_CARRIERS array');
  process.exit(1);
}

// Parse carriers (simplified - assumes specific format)
const carriersText = carriersMatch[1];

// Generate updated carriers with tier copays
console.log('Generating tier copays for all insurance carriers...');
console.log('This will add realistic copay structures based on plan types.\n');

// For now, just output the structure - manual update needed due to complex parsing
console.log('Plan Type Copay Structures:');
console.log('============================');
Object.entries(TIER_COPAYS_BY_PLAN_TYPE).forEach(([type, copays]) => {
  console.log(`\n${type}:`);
  console.log(`  Tier 1 (Generic): $${copays.tier1}`);
  console.log(`  Tier 2 (Preferred Brand): $${copays.tier2}`);
  console.log(`  Tier 3 (Non-Preferred Brand): $${copays.tier3}`);
  console.log(`  Tier 4 (Specialty): $${copays.tier4}`);
});

console.log('\n\nTo apply these copays, update each plan in insuranceCarriers.ts with:');
console.log('  planType: "HMO" | "PPO" | "EPO" | "POS" | "HDHP" | "Medicare" | "Medicaid"');
console.log('  tierCopays: { tier1: X, tier2: Y, tier3: Z, tier4: W }');
