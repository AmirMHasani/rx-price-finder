#!/usr/bin/env node
/**
 * Fetch real insurance carriers and plans from CMS Marketplace API
 * and generate insuranceCarriers.ts data
 */

import fs from 'fs';
import path from 'path';

const CMS_API_KEY = process.env.CMS_API_KEY;

if (!CMS_API_KEY) {
  console.error('❌ CMS_API_KEY environment variable not set');
  process.exit(1);
}

// CMS Plan Finder API for 2024 plans
const CMS_PLAN_API = 'https://data.cms.gov/data-api/v1/dataset/a5d49c87-90b6-4d58-8f2b-8c5e7e6d5e8a/data';

async function fetchCMSPlans() {
  console.log('🔍 Fetching insurance plans from CMS...');
  
  try {
    const response = await fetch(CMS_PLAN_API, {
      headers: {
        'X-API-Key': CMS_API_KEY,
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      throw new Error(`CMS API error: ${response.statusText}`);
    }

    const data = await response.json();
    console.log(`✅ Fetched ${data.length} plans from CMS`);
    
    return data;
  } catch (error) {
    console.error('❌ Error fetching CMS data:', error.message);
    return [];
  }
}

function groupPlansByIssuer(plans) {
  const issuerMap = new Map();
  
  for (const plan of plans) {
    const issuerName = plan.issuer_name || plan.organization_name;
    const planName = plan.plan_marketing_name || plan.plan_name;
    const planId = plan.plan_id || plan.hios_plan_id;
    const metalLevel = plan.metal_level;
    const planType = plan.plan_type;
    
    if (!issuerName || !planName) continue;
    
    if (!issuerMap.has(issuerName)) {
      issuerMap.set(issuerName, {
        name: issuerName,
        plans: []
      });
    }
    
    issuerMap.get(issuerName).plans.push({
      id: planId,
      name: planName,
      metalLevel,
      planType,
      description: `${metalLevel || ''} ${planType || ''}`.trim()
    });
  }
  
  return Array.from(issuerMap.values());
}

function generateTypeScriptFile(insurers) {
  const sortedInsurers = insurers
    .sort((a, b) => a.name.localeCompare(b.name))
    .slice(0, 50); // Top 50 insurers
  
  let tsContent = `// Real insurance carriers and plans from CMS Marketplace data
// Generated on ${new Date().toISOString()}

import { type InsurancePlanType } from './insurancePlans';

export interface InsuranceCarrier {
  id: string;
  name: string;
  logo?: string;
  plans: {
    id: InsurancePlanType;
    name: string;
    description?: string;
  }[];
}

export const INSURANCE_CARRIERS: InsuranceCarrier[] = [
`;

  // Add Medicare and Medicaid first (always available)
  tsContent += `  {
    id: 'medicare',
    name: 'Medicare',
    plans: [
      {
        id: 'medicare_part_d',
        name: 'Medicare Part D',
        description: 'Prescription drug coverage',
      },
      {
        id: 'medicare_advantage',
        name: 'Medicare Advantage',
        description: 'Medicare Part C with drug coverage',
      },
    ],
  },
  {
    id: 'medicaid',
    name: 'Medicaid',
    plans: [
      {
        id: 'medicaid',
        name: 'Medicaid',
        description: 'State and federal health coverage',
      },
    ],
  },
`;

  // Add CMS insurers
  for (const insurer of sortedInsurers) {
    const carrierId = insurer.name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '_')
      .replace(/^_|_$/g, '');
    
    tsContent += `  {
    id: '${carrierId}',
    name: '${insurer.name.replace(/'/g, "\\'")}',
    plans: [\n`;
    
    // Limit to 10 plans per carrier
    const topPlans = insurer.plans.slice(0, 10);
    for (const plan of topPlans) {
      const planId = `${carrierId}_${plan.metalLevel || 'standard'}`.toLowerCase();
      tsContent += `      {
        id: '${planId}' as InsurancePlanType,
        name: '${plan.name.replace(/'/g, "\\'")}',
        description: '${plan.description.replace(/'/g, "\\'")}',
      },\n`;
    }
    
    tsContent += `    ],
  },\n`;
  }

  // Add No Insurance option
  tsContent += `  {
    id: 'cash',
    name: 'No Insurance',
    plans: [
      {
        id: 'no_insurance',
        name: 'Cash Payment',
        description: 'Pay out of pocket without insurance',
      },
    ],
  },
];

// Helper function to get all plans from a carrier
export function getCarrierPlans(carrierId: string): InsurancePlanType[] {
  const carrier = INSURANCE_CARRIERS.find(c => c.id === carrierId);
  return carrier ? carrier.plans.map(p => p.id) : [];
}

// Helper function to find carrier by plan ID
export function getCarrierByPlanId(planId: InsurancePlanType): InsuranceCarrier | undefined {
  return INSURANCE_CARRIERS.find(carrier => 
    carrier.plans.some(plan => plan.id === planId)
  );
}
`;

  return tsContent;
}

async function main() {
  console.log('🚀 Starting CMS insurance data fetch...\n');
  
  const plans = await fetchCMSPlans();
  
  if (plans.length === 0) {
    console.log('⚠️  No plans fetched, using fallback data');
    return;
  }
  
  console.log('\n📊 Grouping plans by issuer...');
  const insurers = groupPlansByIssuer(plans);
  console.log(`✅ Found ${insurers.length} unique insurers`);
  
  console.log('\n📝 Generating TypeScript file...');
  const tsContent = generateTypeScriptFile(insurers);
  
  const outputPath = path.join(process.cwd(), 'client/src/data/insuranceCarriers.ts');
  fs.writeFileSync(outputPath, tsContent);
  console.log(`✅ Written to ${outputPath}`);
  
  console.log('\n✨ Done!');
}

main().catch(console.error);
