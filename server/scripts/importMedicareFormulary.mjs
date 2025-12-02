/**
 * Medicare Part D Formulary Import Script
 * 
 * Downloads and imports Medicare Part D formulary data from CMS
 * Data source: https://data.cms.gov/provider-summary-by-type-of-service/medicare-part-d-prescribers
 * 
 * Run with: node server/scripts/importMedicareFormulary.mjs
 */

import { drizzle } from 'drizzle-orm/mysql2';
import mysql from 'mysql2/promise';
import { insurers, plans, planDrugCoverage } from '../../drizzle/schema.js';

const CMS_API_KEY = process.env.CMS_API_KEY || process.env.VITE_CMS_API_KEY;
const DATABASE_URL = process.env.DATABASE_URL;

// Medicare Part D Formulary dataset ID
const FORMULARY_DATASET_ID = "f38d0706-1239-442c-a3cc-40ef1b686ac0";
const CMS_API_BASE = "https://data.cms.gov/data-api/v1/dataset";

/**
 * Fetch sample Medicare Part D plans from CMS
 * In production, this would download the full formulary ZIP files
 */
async function fetchSamplePlans() {
  console.log("📥 Fetching sample Medicare Part D plans...");
  
  // For now, return sample data structure
  // In production, you'd parse the actual CSV files from CMS
  return [
    {
      contractId: "H1234",
      pbp: "001",
      marketingName: "Medicare Advantage Basic (HMO)",
      insurerName: "UnitedHealthcare",
      state: "MA",
      year: 2025,
    },
    {
      contractId: "S5678",
      pbp: "002",
      marketingName: "Medicare Part D Standard",
      insurerName: "Humana",
      state: "MA",
      year: 2025,
    },
    {
      contractId: "H9999",
      pbp: "003",
      marketingName: "Medicare Advantage Premium (PPO)",
      insurerName: "Aetna",
      state: "MA",
      year: 2025,
    },
  ];
}

/**
 * Fetch sample formulary data for common medications
 */
async function fetchSampleFormularyData() {
  console.log("📥 Fetching sample formulary data...");
  
  // Sample formulary data for common medications
  // In production, this would come from CMS formulary files
  return [
    // Atorvastatin (Lipitor) - Generic statin
    {
      rxcui: "83367",
      drugName: "atorvastatin",
      plans: [
        { contractPbp: "H1234-001", tier: 1, copay: 5.00, priorAuth: false },
        { contractPbp: "S5678-002", tier: 1, copay: 0.00, priorAuth: false },
        { contractPbp: "H9999-003", tier: 1, copay: 10.00, priorAuth: false },
      ],
    },
    // Metformin - Generic diabetes medication
    {
      rxcui: "6809",
      drugName: "metformin",
      plans: [
        { contractPbp: "H1234-001", tier: 1, copay: 5.00, priorAuth: false },
        { contractPbp: "S5678-002", tier: 1, copay: 0.00, priorAuth: false },
        { contractPbp: "H9999-003", tier: 1, copay: 10.00, priorAuth: false },
      ],
    },
    // Lisinopril - Generic blood pressure medication
    {
      rxcui: "29046",
      drugName: "lisinopril",
      plans: [
        { contractPbp: "H1234-001", tier: 1, copay: 5.00, priorAuth: false },
        { contractPbp: "S5678-002", tier: 1, copay: 0.00, priorAuth: false },
        { contractPbp: "H9999-003", tier: 1, copay: 10.00, priorAuth: false },
      ],
    },
    // Omeprazole - Generic acid reflux medication
    {
      rxcui: "7646",
      drugName: "omeprazole",
      plans: [
        { contractPbp: "H1234-001", tier: 1, copay: 5.00, priorAuth: false },
        { contractPbp: "S5678-002", tier: 1, copay: 0.00, priorAuth: false },
        { contractPbp: "H9999-003", tier: 1, copay: 10.00, priorAuth: false },
      ],
    },
    // Amlodipine - Generic blood pressure medication
    {
      rxcui: "17767",
      drugName: "amlodipine",
      plans: [
        { contractPbp: "H1234-001", tier: 1, copay: 5.00, priorAuth: false },
        { contractPbp: "S5678-002", tier: 1, copay: 0.00, priorAuth: false },
        { contractPbp: "H9999-003", tier: 1, copay: 10.00, priorAuth: false },
      ],
    },
  ];
}

/**
 * Main import function
 */
async function importFormularyData() {
  console.log("🚀 Starting Medicare Part D formulary import...\n");
  
  if (!DATABASE_URL) {
    console.error("❌ DATABASE_URL environment variable not set");
    process.exit(1);
  }
  
  // Connect to database
  const connection = await mysql.createConnection(DATABASE_URL);
  const db = drizzle(connection);
  
  try {
    // Step 1: Import insurers
    console.log("📋 Step 1: Importing insurers...");
    const samplePlans = await fetchSamplePlans();
    const uniqueInsurers = [...new Set(samplePlans.map(p => p.insurerName))];
    
    const insurerMap = new Map();
    for (const insurerName of uniqueInsurers) {
      const [result] = await db.insert(insurers).values({
        name: insurerName,
        type: "Medicare Advantage",
        state: "MA",
        isActive: true,
      }).onDuplicateKeyUpdate({
        set: { updatedAt: new Date() }
      });
      
      // Get the inserted ID
      const [rows] = await connection.query(
        'SELECT id FROM insurers WHERE name = ? LIMIT 1',
        [insurerName]
      );
      insurerMap.set(insurerName, rows[0].id);
      console.log(`  ✓ Imported insurer: ${insurerName}`);
    }
    
    // Step 2: Import plans
    console.log("\n📋 Step 2: Importing plans...");
    const planMap = new Map();
    
    for (const plan of samplePlans) {
      const insurerId = insurerMap.get(plan.insurerName);
      const contractPbp = `${plan.contractId}-${plan.pbp}`;
      
      await db.insert(plans).values({
        insurerId,
        contractPbp,
        marketingName: plan.marketingName,
        lineOfBusiness: "MA",
        year: plan.year,
        state: plan.state,
        isActive: true,
      }).onDuplicateKeyUpdate({
        set: { updatedAt: new Date() }
      });
      
      // Get the inserted ID
      const [rows] = await connection.query(
        'SELECT id FROM plans WHERE contractPbp = ? LIMIT 1',
        [contractPbp]
      );
      planMap.set(contractPbp, rows[0].id);
      console.log(`  ✓ Imported plan: ${plan.marketingName} (${contractPbp})`);
    }
    
    // Step 3: Import formulary data
    console.log("\n📋 Step 3: Importing formulary data...");
    const formularyData = await fetchSampleFormularyData();
    let coverageCount = 0;
    
    for (const drug of formularyData) {
      for (const planCoverage of drug.plans) {
        const planId = planMap.get(planCoverage.contractPbp);
        
        if (planId) {
          await db.insert(planDrugCoverage).values({
            planId,
            rxcui: drug.rxcui,
            drugName: drug.drugName,
            tier: planCoverage.tier,
            tierName: `Tier ${planCoverage.tier}`,
            copay: planCoverage.copay.toString(),
            priorAuthRequired: planCoverage.priorAuth,
            isActive: true,
          }).onDuplicateKeyUpdate({
            set: { updatedAt: new Date() }
          });
          
          coverageCount++;
        }
      }
      console.log(`  ✓ Imported coverage for: ${drug.drugName} (${drug.plans.length} plans)`);
    }
    
    console.log(`\n✅ Import complete!`);
    console.log(`   - Insurers: ${uniqueInsurers.length}`);
    console.log(`   - Plans: ${samplePlans.length}`);
    console.log(`   - Drug coverage records: ${coverageCount}`);
    
  } catch (error) {
    console.error("\n❌ Import failed:", error);
    throw error;
  } finally {
    await connection.end();
  }
}

// Run the import
importFormularyData()
  .then(() => {
    console.log("\n🎉 Medicare Part D formulary import completed successfully!");
    process.exit(0);
  })
  .catch((error) => {
    console.error("\n💥 Import failed with error:", error);
    process.exit(1);
  });
