// Comprehensive insurance carriers and plans
// Based on top US health insurance companies by market share

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
  // Medicare & Medicaid (Federal/State programs)
  {
    id: 'medicare',
    name: 'Medicare',
    plans: [
      { id: 'medicare_part_d', name: 'Medicare Part D', description: 'Prescription drug coverage' },
      { id: 'medicare_advantage', name: 'Medicare Advantage (Part C)', description: 'All-in-one coverage' },
      { id: 'medicare_supplement', name: 'Medicare Supplement (Medigap)', description: 'Supplemental coverage' },
    ],
  },
  {
    id: 'medicaid',
    name: 'Medicaid',
    plans: [
      { id: 'medicaid', name: 'Medicaid', description: 'State and federal health coverage' },
    ],
  },
  
  // Top 10 National Carriers
  {
    id: 'unitedhealthcare',
    name: 'UnitedHealthcare',
    plans: [
      { id: 'uhc_choice_plus', name: 'Choice Plus (PPO)', description: 'Flexible provider network' },
      { id: 'uhc_choice', name: 'Choice (HMO)', description: 'Lower cost, primary care focus' },
      { id: 'uhc_options', name: 'Options (EPO)', description: 'No referrals needed' },
      { id: 'uhc_core', name: 'Core (High Deductible)', description: 'HSA-compatible' },
    ],
  },
  {
    id: 'anthem',
    name: 'Anthem Blue Cross Blue Shield',
    plans: [
      { id: 'anthem_ppo', name: 'PPO Plan', description: 'Preferred Provider Organization' },
      { id: 'anthem_hmo', name: 'HMO Plan', description: 'Health Maintenance Organization' },
      { id: 'anthem_epo', name: 'EPO Plan', description: 'Exclusive Provider Organization' },
      { id: 'anthem_hdhp', name: 'High Deductible Health Plan', description: 'HSA-eligible' },
    ],
  },
  {
    id: 'aetna',
    name: 'Aetna (CVS Health)',
    plans: [
      { id: 'aetna_choice_pos', name: 'Choice POS II', description: 'Point of Service' },
      { id: 'aetna_hmo', name: 'HMO Plan', description: 'Coordinated care' },
      { id: 'aetna_open_access', name: 'Open Access (PPO)', description: 'Broad network' },
      { id: 'aetna_hsa', name: 'HSA Plan', description: 'Health Savings Account' },
    ],
  },
  {
    id: 'cigna',
    name: 'Cigna',
    plans: [
      { id: 'cigna_open_access_plus', name: 'Open Access Plus (OAP)', description: 'PPO with flexibility' },
      { id: 'cigna_hmo', name: 'HMO Plan', description: 'Network-based care' },
      { id: 'cigna_pos', name: 'POS Plan', description: 'Point of Service' },
      { id: 'cigna_hdhp', name: 'High Deductible Plan', description: 'HSA-compatible' },
    ],
  },
  {
    id: 'humana',
    name: 'Humana',
    plans: [
      { id: 'humana_gold_plus', name: 'Gold Plus (HMO)', description: 'Medicare Advantage' },
      { id: 'humana_ppo', name: 'PPO Plan', description: 'Flexible network' },
      { id: 'humana_hmo', name: 'HMO Plan', description: 'Coordinated care' },
      { id: 'humana_hdhp', name: 'High Deductible Plan', description: 'HSA-eligible' },
    ],
  },
  {
    id: 'kaiser',
    name: 'Kaiser Permanente',
    plans: [
      { id: 'kaiser_hmo', name: 'HMO Plan', description: 'Integrated care system' },
      { id: 'kaiser_hdhp', name: 'High Deductible Plan', description: 'HSA-compatible' },
      { id: 'kaiser_senior_advantage', name: 'Senior Advantage', description: 'Medicare Advantage' },
    ],
  },
  {
    id: 'bcbs',
    name: 'Blue Cross Blue Shield',
    plans: [
      { id: 'bcbs_blue_card_ppo', name: 'BlueCard PPO', description: 'National network' },
      { id: 'bcbs_hmo', name: 'HMO Plan', description: 'Local network' },
      { id: 'bcbs_pos', name: 'POS Plan', description: 'Point of Service' },
      { id: 'bcbs_hsa', name: 'HSA Plan', description: 'High deductible with savings' },
    ],
  },
  {
    id: 'centene',
    name: 'Centene (Ambetter)',
    plans: [
      { id: 'ambetter_balanced_care', name: 'Balanced Care', description: 'Marketplace plan' },
      { id: 'ambetter_essential_care', name: 'Essential Care', description: 'Basic coverage' },
      { id: 'ambetter_secure_care', name: 'Secure Care', description: 'Comprehensive coverage' },
    ],
  },
  {
    id: 'molina',
    name: 'Molina Healthcare',
    plans: [
      { id: 'molina_marketplace', name: 'Marketplace Plan', description: 'ACA coverage' },
      { id: 'molina_medicaid', name: 'Medicaid Plan', description: 'State partnership' },
    ],
  },
  {
    id: 'wellcare',
    name: 'WellCare (Centene)',
    plans: [
      { id: 'wellcare_medicare', name: 'Medicare Advantage', description: 'Senior coverage' },
      { id: 'wellcare_medicaid', name: 'Medicaid Plan', description: 'State program' },
    ],
  },
  
  // Regional Blues Plans
  {
    id: 'bcbs_california',
    name: 'Blue Shield of California',
    plans: [
      { id: 'blue_shield_ca_ppo', name: 'PPO Plan', description: 'California network' },
      { id: 'blue_shield_ca_hmo', name: 'HMO Plan', description: 'Coordinated care' },
      { id: 'blue_shield_ca_trio', name: 'Trio HMO', description: 'Narrow network' },
    ],
  },
  {
    id: 'bcbs_florida',
    name: 'Florida Blue',
    plans: [
      { id: 'florida_blue_hmo', name: 'BlueOptions (HMO)', description: 'Florida network' },
      { id: 'florida_blue_ppo', name: 'BlueCare (PPO)', description: 'Flexible coverage' },
    ],
  },
  {
    id: 'bcbs_texas',
    name: 'Blue Cross Blue Shield of Texas',
    plans: [
      { id: 'bcbs_texas_blue_advantage', name: 'Blue Advantage (HMO)', description: 'Texas network' },
      { id: 'bcbs_texas_blue_choice', name: 'Blue Choice (PPO)', description: 'Statewide coverage' },
    ],
  },
  {
    id: 'bcbs_illinois',
    name: 'Blue Cross Blue Shield of Illinois',
    plans: [
      { id: 'bcbs_il_blue_precision', name: 'Blue Precision (HMO)', description: 'Illinois network' },
      { id: 'bcbs_il_blue_choice', name: 'Blue Choice (PPO)', description: 'Flexible network' },
    ],
  },
  {
    id: 'bcbs_michigan',
    name: 'Blue Cross Blue Shield of Michigan',
    plans: [
      { id: 'bcbs_mi_community_blue', name: 'Community Blue (PPO)', description: 'Michigan coverage' },
      { id: 'bcbs_mi_simply_blue', name: 'Simply Blue (HMO)', description: 'Lower cost option' },
    ],
  },
  {
    id: 'bcbs_north_carolina',
    name: 'Blue Cross Blue Shield of North Carolina',
    plans: [
      { id: 'bcbs_nc_blue_options', name: 'Blue Options (HMO)', description: 'NC network' },
      { id: 'bcbs_nc_blue_value', name: 'Blue Value (PPO)', description: 'Flexible coverage' },
    ],
  },
  {
    id: 'independence_blue_cross',
    name: 'Independence Blue Cross (Pennsylvania)',
    plans: [
      { id: 'ibc_personal_choice', name: 'Personal Choice (PPO)', description: 'PA/NJ/DE network' },
      { id: 'ibc_keystone', name: 'Keystone HMO', description: 'Coordinated care' },
    ],
  },
  {
    id: 'highmark',
    name: 'Highmark Blue Cross Blue Shield',
    plans: [
      { id: 'highmark_community_blue', name: 'Community Blue (PPO)', description: 'Multi-state network' },
      { id: 'highmark_blue_hmo', name: 'Blue HMO', description: 'Network-based care' },
    ],
  },
  {
    id: 'carefirst',
    name: 'CareFirst BlueCross BlueShield',
    plans: [
      { id: 'carefirst_bluepreferred', name: 'BluePreferred (PPO)', description: 'MD/DC/VA network' },
      { id: 'carefirst_bluechoice', name: 'BlueChoice (HMO)', description: 'Lower cost option' },
    ],
  },
  {
    id: 'premera',
    name: 'Premera Blue Cross',
    plans: [
      { id: 'premera_heritage_plus', name: 'Heritage Plus (PPO)', description: 'WA/AK network' },
      { id: 'premera_lifewise', name: 'LifeWise (HMO)', description: 'Coordinated care' },
    ],
  },
  
  // Other Major Carriers
  {
    id: 'oscar',
    name: 'Oscar Health',
    plans: [
      { id: 'oscar_simple', name: 'Simple', description: 'Basic coverage' },
      { id: 'oscar_classic', name: 'Classic', description: 'Standard coverage' },
      { id: 'oscar_saver', name: 'Saver', description: 'High deductible' },
    ],
  },
  {
    id: 'bright_health',
    name: 'Bright Health',
    plans: [
      { id: 'bright_health_marketplace', name: 'Marketplace Plan', description: 'ACA coverage' },
    ],
  },
  {
    id: 'friday_health',
    name: 'Friday Health Plans',
    plans: [
      { id: 'friday_health_bronze', name: 'Bronze Plan', description: 'Basic coverage' },
      { id: 'friday_health_silver', name: 'Silver Plan', description: 'Standard coverage' },
      { id: 'friday_health_gold', name: 'Gold Plan', description: 'Comprehensive coverage' },
    ],
  },
  {
    id: 'health_net',
    name: 'Health Net',
    plans: [
      { id: 'health_net_smartcare', name: 'SmartCare (HMO)', description: 'California network' },
      { id: 'health_net_ppo', name: 'PPO Plan', description: 'Flexible network' },
    ],
  },
  {
    id: 'sharp_health',
    name: 'Sharp Health Plan',
    plans: [
      { id: 'sharp_platinum', name: 'Platinum Plan', description: 'Comprehensive coverage' },
      { id: 'sharp_gold', name: 'Gold Plan', description: 'Standard coverage' },
    ],
  },
  {
    id: 'geisinger',
    name: 'Geisinger Health Plan',
    plans: [
      { id: 'geisinger_gold', name: 'Gold Plan', description: 'PA network' },
      { id: 'geisinger_silver', name: 'Silver Plan', description: 'Standard coverage' },
    ],
  },
  {
    id: 'harvard_pilgrim',
    name: 'Harvard Pilgrim Health Care',
    plans: [
      { id: 'harvard_pilgrim_hmo', name: 'HMO Plan', description: 'New England network' },
      { id: 'harvard_pilgrim_ppo', name: 'PPO Plan', description: 'Flexible coverage' },
    ],
  },
  {
    id: 'tufts',
    name: 'Tufts Health Plan',
    plans: [
      { id: 'tufts_navigator', name: 'Navigator (HMO)', description: 'MA/RI network' },
      { id: 'tufts_spirit', name: 'Spirit (PPO)', description: 'Flexible network' },
    ],
  },
  {
    id: 'emblem_health',
    name: 'EmblemHealth',
    plans: [
      { id: 'emblem_hip_hmo', name: 'HIP HMO', description: 'NY network' },
      { id: 'emblem_ghi_ppo', name: 'GHI PPO', description: 'Flexible coverage' },
    ],
  },
  {
    id: 'healthfirst',
    name: 'Healthfirst',
    plans: [
      { id: 'healthfirst_pro', name: 'Pro (HMO)', description: 'NY network' },
      { id: 'healthfirst_leaf', name: 'Leaf (EPO)', description: 'Narrow network' },
    ],
  },
  {
    id: 'fidelis_care',
    name: 'Fidelis Care',
    plans: [
      { id: 'fidelis_metal_plus', name: 'Metal Plus', description: 'NY Marketplace' },
      { id: 'fidelis_essential', name: 'Essential Plan', description: 'Low-cost option' },
    ],
  },
  {
    id: 'medica',
    name: 'Medica',
    plans: [
      { id: 'medica_choice', name: 'Medica Choice', description: 'MN/ND/SD/WI network' },
      { id: 'medica_prime', name: 'Medica Prime', description: 'Medicare Advantage' },
    ],
  },
  {
    id: 'healthpartners',
    name: 'HealthPartners',
    plans: [
      { id: 'healthpartners_open_access', name: 'Open Access', description: 'MN/WI network' },
      { id: 'healthpartners_navigate', name: 'Navigate (HMO)', description: 'Lower cost' },
    ],
  },
  {
    id: 'regence',
    name: 'Regence',
    plans: [
      { id: 'regence_bridgespan', name: 'BridgeSpan (HMO)', description: 'OR/WA/ID/UT network' },
      { id: 'regence_classic', name: 'Classic (PPO)', description: 'Flexible coverage' },
    ],
  },
  {
    id: 'moda_health',
    name: 'Moda Health',
    plans: [
      { id: 'moda_summit', name: 'Summit', description: 'OR/AK network' },
      { id: 'moda_compass', name: 'Compass', description: 'Standard coverage' },
    ],
  },
  {
    id: 'providence',
    name: 'Providence Health Plan',
    plans: [
      { id: 'providence_bridge', name: 'Bridge (HMO)', description: 'OR/WA network' },
      { id: 'providence_summit', name: 'Summit (PPO)', description: 'Flexible network' },
    ],
  },
  {
    id: 'selecthealth',
    name: 'SelectHealth',
    plans: [
      { id: 'selecthealth_advantage', name: 'Advantage (HMO)', description: 'UT/ID network' },
      { id: 'selecthealth_select_care', name: 'SelectCare (PPO)', description: 'Flexible coverage' },
    ],
  },
  {
    id: 'bcbs_minnesota',
    name: 'Blue Cross Blue Shield of Minnesota',
    plans: [
      { id: 'bcbs_mn_aware', name: 'Blue Plus Aware', description: 'MN network' },
      { id: 'bcbs_mn_choice', name: 'Blue Cross Choice', description: 'PPO coverage' },
    ],
  },
  {
    id: 'bcbs_kansas_city',
    name: 'Blue Cross Blue Shield of Kansas City',
    plans: [
      { id: 'bcbs_kc_blue_select', name: 'Blue Select (HMO)', description: 'MO/KS network' },
      { id: 'bcbs_kc_blue_preferred', name: 'Blue Preferred (PPO)', description: 'Flexible network' },
    ],
  },
  {
    id: 'bcbs_arizona',
    name: 'Blue Cross Blue Shield of Arizona',
    plans: [
      { id: 'bcbs_az_blue_distinction', name: 'Blue Distinction (PPO)', description: 'AZ network' },
      { id: 'bcbs_az_blue_priority', name: 'Blue Priority (HMO)', description: 'Lower cost' },
    ],
  },
  {
    id: 'bcbs_nebraska',
    name: 'Blue Cross Blue Shield of Nebraska',
    plans: [
      { id: 'bcbs_ne_blue_focus', name: 'Blue Focus (HMO)', description: 'NE network' },
      { id: 'bcbs_ne_blue_access', name: 'Blue Access (PPO)', description: 'Flexible coverage' },
    ],
  },
  {
    id: 'bcbs_louisiana',
    name: 'Blue Cross Blue Shield of Louisiana',
    plans: [
      { id: 'bcbs_la_community_blue', name: 'Community Blue (HMO)', description: 'LA network' },
      { id: 'bcbs_la_blue_connect', name: 'Blue Connect (PPO)', description: 'Statewide coverage' },
    ],
  },
  {
    id: 'bcbs_tennessee',
    name: 'BlueCross BlueShield of Tennessee',
    plans: [
      { id: 'bcbs_tn_network_s', name: 'Network S (PPO)', description: 'TN network' },
      { id: 'bcbs_tn_network_e', name: 'Network E (EPO)', description: 'Lower cost' },
    ],
  },
  {
    id: 'bcbs_alabama',
    name: 'Blue Cross Blue Shield of Alabama',
    plans: [
      { id: 'bcbs_al_blue_saver', name: 'Blue Saver (HMO)', description: 'AL network' },
      { id: 'bcbs_al_blue_choice', name: 'Blue Choice (PPO)', description: 'Flexible coverage' },
    ],
  },
  {
    id: 'bcbs_oklahoma',
    name: 'Blue Cross Blue Shield of Oklahoma',
    plans: [
      { id: 'bcbs_ok_blue_edge', name: 'Blue Edge (HMO)', description: 'OK network' },
      { id: 'bcbs_ok_blue_preferred', name: 'Blue Preferred (PPO)', description: 'Statewide coverage' },
    ],
  },
  {
    id: 'bcbs_new_mexico',
    name: 'Blue Cross Blue Shield of New Mexico',
    plans: [
      { id: 'bcbs_nm_blue_access', name: 'Blue Access (HMO)', description: 'NM network' },
      { id: 'bcbs_nm_blue_select', name: 'Blue Select (PPO)', description: 'Flexible coverage' },
    ],
  },
  {
    id: 'bcbs_wyoming',
    name: 'Blue Cross Blue Shield of Wyoming',
    plans: [
      { id: 'bcbs_wy_blue_priority', name: 'Blue Priority (HMO)', description: 'WY network' },
      { id: 'bcbs_wy_blue_choice', name: 'Blue Choice (PPO)', description: 'Statewide coverage' },
    ],
  },
  {
    id: 'bcbs_montana',
    name: 'Blue Cross Blue Shield of Montana',
    plans: [
      { id: 'bcbs_mt_blue_current', name: 'Blue Current (HMO)', description: 'MT network' },
      { id: 'bcbs_mt_blue_select', name: 'Blue Select (PPO)', description: 'Flexible coverage' },
    ],
  },
  {
    id: 'bcbs_south_carolina',
    name: 'BlueCross BlueShield of South Carolina',
    plans: [
      { id: 'bcbs_sc_blue_essentials', name: 'Blue Essentials (HMO)', description: 'SC network' },
      { id: 'bcbs_sc_blue_choice', name: 'Blue Choice (PPO)', description: 'Statewide coverage' },
    ],
  },
  {
    id: 'bcbs_vermont',
    name: 'Blue Cross Blue Shield of Vermont',
    plans: [
      { id: 'bcbs_vt_platinum', name: 'Platinum Plan', description: 'Comprehensive coverage' },
      { id: 'bcbs_vt_gold', name: 'Gold Plan', description: 'Standard coverage' },
    ],
  },
  
  // No Insurance Option
  {
    id: 'cash',
    name: 'No Insurance (Cash Pay)',
    plans: [
      { id: 'no_insurance', name: 'Cash Payment', description: 'Pay out of pocket without insurance' },
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
