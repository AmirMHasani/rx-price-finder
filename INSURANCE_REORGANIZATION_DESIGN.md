# Insurance Carrier Reorganization Design

## Current Problem

The insurance carrier list is cluttered with regional variations listed as separate carriers:

**Current Structure (Messy):**
- Blue Cross Blue Shield (national)
- Anthem Blue Cross Blue Shield
- Blue Shield of California
- Florida Blue
- Blue Cross Blue Shield of Texas
- Blue Cross Blue Shield of Illinois
- Blue Cross Blue Shield of Michigan
- Blue Cross Blue Shield of North Carolina
- Independence Blue Cross (Pennsylvania)
- Highmark Blue Cross Blue Shield
- CareFirst BlueCross BlueShield
- Premera Blue Cross

This creates 12 separate carrier entries for what users think of as "Blue Cross Blue Shield".

## Proposed Solution

Group regional variations under parent carriers, with regional plans shown in the plan dropdown.

**New Structure (Clean):**

### Carrier Dropdown (Parent Carriers Only)
1. Medicare
2. Medicaid
3. Blue Cross Blue Shield
4. UnitedHealthcare
5. Aetna (CVS Health)
6. Cigna
7. Humana
8. Kaiser Permanente
9. Centene (Ambetter)
10. Molina Healthcare
11. WellCare (Centene)
12. Oscar Health
13. Bright Health
14. Friday Health Plans
15. Health Net
16. Sharp Health Plan

### Plan Dropdown (Dynamic Based on Carrier)

**When user selects "Blue Cross Blue Shield":**
- National Plans:
  - BlueCard PPO (National network)
  - HMO Plan (Local network)
  - POS Plan (Point of Service)
  - HSA Plan (High deductible with savings)
  
- Regional Plans:
  - **California** - Blue Shield of California
    - PPO Plan
    - HMO Plan
    - Trio HMO (Narrow network)
  
  - **Florida** - Florida Blue
    - BlueOptions (HMO)
    - BlueCare (PPO)
  
  - **Texas** - BCBS of Texas
    - Blue Advantage (HMO)
    - Blue Choice (PPO)
  
  - **Illinois** - BCBS of Illinois
    - Blue Precision (HMO)
    - Blue Choice (PPO)
  
  - **Michigan** - BCBS of Michigan
    - Community Blue (PPO)
    - Simply Blue (HMO)
  
  - **North Carolina** - BCBS of North Carolina
    - Blue Options (HMO)
    - Blue Value (PPO)
  
  - **Pennsylvania** - Independence Blue Cross
    - Personal Choice (PPO)
    - Keystone HMO
  
  - **Multi-State** - Highmark BCBS
    - Community Blue (PPO)
    - Blue HMO
  
  - **MD/DC/VA** - CareFirst BCBS
    - BluePreferred (PPO)
    - BlueChoice (HMO)
  
  - **WA/AK** - Premera Blue Cross
    - Heritage Plus (PPO)
    - LifeWise (HMO)
  
  - **Anthem** - Anthem BCBS (Multi-state)
    - PPO Plan
    - HMO Plan
    - EPO Plan
    - High Deductible Health Plan

## Implementation Plan

### 1. Data Structure Changes

Add `region` field to plans to group them:

```typescript
export interface InsurancePlan {
  id: InsurancePlanType;
  name: string;
  description?: string;
  region?: string; // NEW: "California", "Texas", "National", etc.
  regionalCarrier?: string; // NEW: "Blue Shield of California", "Florida Blue", etc.
}

export interface InsuranceCarrier {
  id: string;
  name: string;
  logo?: string;
  plans: InsurancePlan[];
  isParent?: boolean; // NEW: true for BCBS parent, false for regional variations
}
```

### 2. Consolidate BCBS Carriers

Merge all BCBS regional carriers into single parent carrier:

```typescript
{
  id: 'bcbs',
  name: 'Blue Cross Blue Shield',
  isParent: true,
  plans: [
    // National plans
    { id: 'bcbs_blue_card_ppo', name: 'BlueCard PPO', description: 'National network', region: 'National' },
    { id: 'bcbs_hmo', name: 'HMO Plan', description: 'Local network', region: 'National' },
    
    // California
    { id: 'blue_shield_ca_ppo', name: 'PPO Plan', description: 'California network', region: 'California', regionalCarrier: 'Blue Shield of California' },
    { id: 'blue_shield_ca_hmo', name: 'HMO Plan', description: 'Coordinated care', region: 'California', regionalCarrier: 'Blue Shield of California' },
    
    // Florida
    { id: 'florida_blue_hmo', name: 'BlueOptions (HMO)', description: 'Florida network', region: 'Florida', regionalCarrier: 'Florida Blue' },
    { id: 'florida_blue_ppo', name: 'BlueCare (PPO)', description: 'Flexible coverage', region: 'Florida', regionalCarrier: 'Florida Blue' },
    
    // ... etc for all regions
  ],
}
```

### 3. UI Component Updates

**SearchWithAPI.tsx / Home.tsx:**
- Carrier dropdown shows only parent carriers (filter out regional BCBS)
- Plan dropdown groups by region when BCBS is selected

**Display Logic:**
```typescript
// Group plans by region for BCBS
const groupedPlans = carrier.id === 'bcbs' 
  ? groupBy(carrier.plans, 'region')
  : { 'All Plans': carrier.plans };

// Render with region headers
{Object.entries(groupedPlans).map(([region, plans]) => (
  <SelectGroup key={region} label={region}>
    {plans.map(plan => (
      <SelectItem value={plan.id}>
        {plan.regionalCarrier ? `${plan.name} (${plan.regionalCarrier})` : plan.name}
      </SelectItem>
    ))}
  </SelectGroup>
))}
```

### 4. Pricing Logic Updates

No changes needed - pricing already uses plan IDs, which remain unique.

### 5. Migration Checklist

- [ ] Add `region` and `regionalCarrier` fields to InsurancePlan interface
- [ ] Consolidate all BCBS carriers into single parent carrier
- [ ] Add region labels to all BCBS plans
- [ ] Update carrier dropdown to filter out regional BCBS carriers
- [ ] Update plan dropdown to group by region for BCBS
- [ ] Test insurance selection flow
- [ ] Verify pricing calculations still work
- [ ] Update PatientInfo.tsx with same structure
- [ ] Save checkpoint

## Benefits

1. **Cleaner UI:** 16 carriers instead of 26
2. **Better UX:** Users select "Blue Cross Blue Shield" then pick their state
3. **Scalability:** Easy to add more regional variations without cluttering carrier list
4. **Consistency:** Matches how users think about their insurance ("I have BCBS in California")

## Edge Cases to Handle

1. **Anthem BCBS:** Should be under BCBS parent, not separate carrier
2. **National vs Regional Plans:** Clearly label which plans are available nationwide
3. **Multi-State Carriers:** Highmark, CareFirst span multiple states - label appropriately
4. **Backward Compatibility:** Ensure existing search history still works with old carrier IDs
