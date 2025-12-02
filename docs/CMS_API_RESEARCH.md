# CMS API Research for Regional Pricing

## Medicare Part D Spending by Drug API

**API Endpoint:** `https://data.cms.gov/data-api/v1/dataset/7e0b4365-f9c3-4c5d-83f4-5f7e8f9d6e8e/data`

**Data Source:** Centers for Medicare & Medicaid Services  
**Update Frequency:** Annually  
**Latest Data:** 2023  
**Format:** JSON (REST API)

### Dataset Description:

The Medicare Part D by Drug dataset presents information on spending for drugs prescribed to Medicare beneficiaries enrolled in Part D by physicians and other healthcare providers.

**Key Features:**
- Average spending per dosage unit
- Change in average spending per dosage unit over time
- Spending information by manufacturer
- Consumer-friendly drug uses and clinical indications
- Based on gross drug cost (includes Medicare, plan, and beneficiary payments)

**Note:** Does NOT include manufacturers' rebates or price concessions (CMS prohibited from disclosing)

### API Documentation:

**API Docs:** https://data.cms.gov/api-docs (linked from dataset page)

**Query Capabilities:**
- Filter by drug name
- Filter by time period
- Query and aggregate data
- Returns most recent version

---

## Next Steps:

1. ✅ Found Medicare Part D Spending by Drug API
2. ⏭️ Check if API includes geographic/regional data
3. ⏭️ Test API with sample drug queries
4. ⏭️ Determine data structure and fields available
5. ⏭️ Implement service layer for API integration

---

## API Structure Analysis

**Dataset:** Medicare Part D Spending by Drug (2023)

**Statistics:**
- Rows: 14,309 medications
- Columns: 46 data fields
- Update frequency: Annually
- Latest data: 2023

### Key Data Fields:

**Medication Identification:**
- `Brnd_Name` - Brand name
- `Gnrc_Name` - Generic name
- `Mftr_Name` - Manufacturer name
- `Tot_Mftr` - Total manufacturers

**Spending Metrics (per year 2019-2023):**
- `Tot_Spndng_YYYY` - Total spending
- `Tot_Dsg_Unts_YYYY` - Total dosage units
- `Tot_Clms_YYYY` - Total claims
- `Tot_Benes_YYYY` - Total beneficiaries
- `Avg_Spnd_Per_Dsg_Unt_Wghtd_YYYY` - **Average spending per dosage unit (KEY METRIC)**
- `Avg_Spnd_Per_Clm_YYYY` - Average spending per claim
- `Avg_Spnd_Per_Bene_YYYY` - Average spending per beneficiary
- `Outlier_Flag_YYYY` - Outlier flag

**Trend Metrics:**
- `Chg_Avg_Spnd_Per_Dsg_Unt_22_23` - Change in avg spending 2022-2023
- `CAGR_Avg_Spnd_Per_Dsg_Unt_19_23` - Compound annual growth rate 2019-2023

### ❌ LIMITATION: NO REGIONAL/GEOGRAPHIC DATA

**Critical Finding:** This dataset does NOT include regional or geographic pricing data. It provides **national averages** only.

**Missing fields:**
- No state/ZIP code data
- No regional price variations
- No geographic breakdown

---

## Alternative: Medicare Part D Prescribers by Geography and Drug

**URL:** https://data.cms.gov/provider-summary-by-type-of-service/medicare-part-d-prescribers/medicare-part-d-prescribers-by-geography-and-drug

**Description:** Contains information on prescription drugs prescribed by individual physicians and other health care providers **by geography**.

**Next step:** Research this dataset to see if it includes regional pricing data.

---

## ✅ FOUND: Medicare Part D Prescribers by Geography and Drug API

**API Endpoint:** `https://data.cms.gov/data-api/v1/dataset/c8ea3f8e-3a09-4fea-86f2-8902fb4b0920/data`

**Dataset:** Medicare Part D Prescribers - by Geography and Drug (2023)

**Statistics:**
- Rows: 115,936 records
- Columns: 22 data fields
- Update frequency: Annually
- Latest data: 2023
- Historical data: 2013-2023 (11 years)

### ✅ GEOGRAPHIC DATA AVAILABLE!

**Geographic Fields:**
- `Prscrbr_Geo_Lvl` - Geographic level (National, State, etc.)
- `Prscrbr_Geo_Cd` - Geographic code (state abbreviation, etc.)
- `Prscrbr_Geo_Desc` - Geographic description (state name, etc.)

**Medication Fields:**
- `Brnd_Name` - Brand name
- `Gnrc_Name` - Generic name

**Cost/Spending Fields:**
- `Tot_Drug_Cst` - **Total drug cost (KEY METRIC for regional pricing)**
- `Tot_Clms` - Total claims
- `Tot_30day_Fills` - Total 30-day fills
- `Tot_Benes` - Total beneficiaries

**Age 65+ Breakdown:**
- `GE65_Tot_Drug_Cst` - Total drug cost for 65+ beneficiaries
- `GE65_Tot_Clms` - Total claims for 65+
- `GE65_Tot_30day_Fills` - Total 30-day fills for 65+
- `GE65_Tot_Benes` - Total beneficiaries 65+

**Cost Sharing:**
- `LIS_Bene_Cst_Shr` - Low Income Subsidy beneficiary cost share
- `NonLIS_Bene_Cst_Shr` - Non-LIS beneficiary cost share

**Drug Flags:**
- `Opioid_Drug_Flag` - Opioid drug indicator
- `Opioid_LA_Drug_Flag` - Long-acting opioid indicator
- `Antbtc_Drug_Flag` - Antibiotic indicator
- `Antpsyct_Drug_Flag` - Antipsychotic indicator

---

## Implementation Plan

### Calculation Method:

**Regional Price Per Unit = Total Drug Cost ÷ Total 30-day Fills ÷ 30**

Example:
```
State: Massachusetts
Drug: Eliquis (apixaban)
Tot_Drug_Cst: $15,000,000
Tot_30day_Fills: 50,000

Price per 30-day fill = $15,000,000 ÷ 50,000 = $300
Price per pill = $300 ÷ 30 = $10/pill
```

### API Query Strategy:

1. **Search by generic name** (e.g., "apixaban")
2. **Filter by geographic level** (State or National)
3. **Get most recent year** (2023)
4. **Calculate average price per unit** from Tot_Drug_Cst and Tot_30day_Fills

### Use Cases:

**Layer 3.5 Fallback:**
- When Cost Plus fails
- When NADAC doesn't have data
- When brand database doesn't have medication
- **Before** falling back to generic $0.25/pill estimation

**Regional Pricing:**
- Use user's ZIP code to determine state
- Query CMS API for state-specific pricing
- Provides more accurate regional cost estimates
- Accounts for geographic price variations

---

## Next Steps:

1. ✅ Found geographic pricing API
2. ⏭️ Test API with sample queries (Eliquis, Metformin, Gabapentin)
3. ⏭️ Implement `cmsGeographicPricingApi.ts` service
4. ⏭️ Integrate into pricing algorithm as Layer 3.5
5. ⏭️ Add ZIP-to-state mapping for regional queries

---
