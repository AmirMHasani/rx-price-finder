/**
 * CMS Regional Pricing API Service
 * Fetches state-level medication pricing data from CMS Medicare Part D Prescribers by Geography and Drug dataset
 * 
 * Dataset: Medicare Part D Prescribers - by Geography and Drug (2023)
 * API: https://data.cms.gov/data-api/v1/dataset/c8ea3f8e-3a09-4fea-86f2-8902fb4b0920/data
 * 
 * Provides regional pricing as fallback when Cost Plus and NADAC APIs don't have data
 */

const CMS_GEO_API_BASE = 'https://data.cms.gov/data-api/v1/dataset/c8ea3f8e-3a09-4fea-86f2-8902fb4b0920/data';

// Cache for CMS API responses (24-hour TTL)
interface CacheEntry {
  data: CMSRegionalPricingResult;
  timestamp: number;
}

const cmsCache = new Map<string, CacheEntry>();
const CACHE_TTL = 24 * 60 * 60 * 1000; // 24 hours in milliseconds

/**
 * Generate cache key from medication name and state
 */
function getCacheKey(medicationName: string, stateCode: string | null): string {
  return `${medicationName.toLowerCase()}:${stateCode || 'national'}`;
}

/**
 * Get cached result if available and not expired
 */
function getCachedResult(medicationName: string, stateCode: string | null): CMSRegionalPricingResult | null {
  const key = getCacheKey(medicationName, stateCode);
  const cached = cmsCache.get(key);
  
  if (!cached) {
    return null;
  }
  
  const age = Date.now() - cached.timestamp;
  if (age > CACHE_TTL) {
    // Cache expired, remove it
    cmsCache.delete(key);
    console.log(`🗑️ [CMS CACHE] Expired cache for "${medicationName}" (${stateCode || 'national'})`);
    return null;
  }
  
  console.log(`✅ [CMS CACHE] Hit for "${medicationName}" (${stateCode || 'national'}) - age: ${Math.round(age / 1000 / 60)}min`);
  return cached.data;
}

/**
 * Store result in cache
 */
function setCachedResult(medicationName: string, stateCode: string | null, result: CMSRegionalPricingResult): void {
  const key = getCacheKey(medicationName, stateCode);
  cmsCache.set(key, {
    data: result,
    timestamp: Date.now(),
  });
  console.log(`💾 [CMS CACHE] Stored "${medicationName}" (${stateCode || 'national'})`);
}

export interface CMSRegionalPricingResult {
  state: string;
  stateCode: string;
  brandName: string;
  genericName: string;
  totalDrugCost: number;
  total30DayFills: number;
  totalClaims: number;
  totalBeneficiaries: number;
  pricePerUnit: number;  // Calculated: totalDrugCost / total30DayFills / 30
  pricePerFill: number;  // Calculated: totalDrugCost / total30DayFills
}

/**
 * ZIP code to state mapping (first 3 digits)
 * Source: USPS ZIP code allocation
 */
const ZIP_TO_STATE: Record<string, string> = {
  // Northeast
  '010': 'MA', '011': 'MA', '012': 'MA', '013': 'MA', '014': 'MA', '015': 'MA', '016': 'MA', '017': 'MA', '018': 'MA', '019': 'MA',
  '020': 'MA', '021': 'MA', '022': 'MA', '023': 'MA', '024': 'MA', '025': 'MA', '026': 'MA', '027': 'MA',
  '028': 'RI', '029': 'RI',
  '030': 'NH', '031': 'NH', '032': 'NH', '033': 'NH', '034': 'NH', '035': 'NH', '036': 'NH', '037': 'NH', '038': 'NH',
  '039': 'ME', '040': 'ME', '041': 'ME', '042': 'ME', '043': 'ME', '044': 'ME', '045': 'ME', '046': 'ME', '047': 'ME', '048': 'ME', '049': 'ME',
  '050': 'VT', '051': 'VT', '052': 'VT', '053': 'VT', '054': 'VT', '056': 'VT', '057': 'VT', '058': 'VT', '059': 'VT',
  '060': 'CT', '061': 'CT', '062': 'CT', '063': 'CT', '064': 'CT', '065': 'CT', '066': 'CT', '067': 'CT', '068': 'CT', '069': 'CT',
  '070': 'NJ', '071': 'NJ', '072': 'NJ', '073': 'NJ', '074': 'NJ', '075': 'NJ', '076': 'NJ', '077': 'NJ', '078': 'NJ', '079': 'NJ', '080': 'NJ', '081': 'NJ', '082': 'NJ', '083': 'NJ', '084': 'NJ', '085': 'NJ', '086': 'NJ', '087': 'NJ', '088': 'NJ', '089': 'NJ',
  '100': 'NY', '101': 'NY', '102': 'NY', '103': 'NY', '104': 'NY', '105': 'NY', '106': 'NY', '107': 'NY', '108': 'NY', '109': 'NY',
  '110': 'NY', '111': 'NY', '112': 'NY', '113': 'NY', '114': 'NY', '115': 'NY', '116': 'NY', '117': 'NY', '118': 'NY', '119': 'NY',
  '120': 'NY', '121': 'NY', '122': 'NY', '123': 'NY', '124': 'NY', '125': 'NY', '126': 'NY', '127': 'NY', '128': 'NY', '129': 'NY',
  '130': 'NY', '131': 'NY', '132': 'NY', '133': 'NY', '134': 'NY', '135': 'NY', '136': 'NY', '137': 'NY', '138': 'NY', '139': 'NY',
  '140': 'NY', '141': 'NY', '142': 'NY', '143': 'NY', '144': 'NY', '145': 'NY', '146': 'NY', '147': 'NY', '148': 'NY', '149': 'NY',
  '150': 'PA', '151': 'PA', '152': 'PA', '153': 'PA', '154': 'PA', '155': 'PA', '156': 'PA', '157': 'PA', '158': 'PA', '159': 'PA',
  '160': 'PA', '161': 'PA', '162': 'PA', '163': 'PA', '164': 'PA', '165': 'PA', '166': 'PA', '167': 'PA', '168': 'PA', '169': 'PA',
  '170': 'PA', '171': 'PA', '172': 'PA', '173': 'PA', '174': 'PA', '175': 'PA', '176': 'PA', '177': 'PA', '178': 'PA', '179': 'PA',
  '180': 'PA', '181': 'PA', '182': 'PA', '183': 'PA', '184': 'PA', '185': 'PA', '186': 'PA', '187': 'PA', '188': 'PA', '189': 'PA', '190': 'PA', '191': 'PA', '192': 'PA', '193': 'PA', '194': 'PA', '195': 'PA', '196': 'PA',
  // Add more states as needed (this is a simplified mapping)
  '200': 'DC', '201': 'DC', '202': 'DC', '203': 'DC', '204': 'DC', '205': 'DC',
  '206': 'MD', '207': 'MD', '208': 'MD', '209': 'MD', '210': 'MD', '211': 'MD', '212': 'MD', '213': 'MD', '214': 'MD', '215': 'MD', '216': 'MD', '217': 'MD', '218': 'MD', '219': 'MD',
  '220': 'VA', '221': 'VA', '222': 'VA', '223': 'VA', '224': 'VA', '225': 'VA', '226': 'VA', '227': 'VA', '228': 'VA', '229': 'VA', '230': 'VA', '231': 'VA', '232': 'VA', '233': 'VA', '234': 'VA', '235': 'VA', '236': 'VA', '237': 'VA', '238': 'VA', '239': 'VA', '240': 'VA', '241': 'VA', '242': 'VA', '243': 'VA', '244': 'VA', '245': 'VA', '246': 'VA',
  '247': 'WV', '248': 'WV', '249': 'WV', '250': 'WV', '251': 'WV', '252': 'WV', '253': 'WV', '254': 'WV', '255': 'WV', '256': 'WV', '257': 'WV', '258': 'WV', '259': 'WV', '260': 'WV', '261': 'WV', '262': 'WV', '263': 'WV', '264': 'WV', '265': 'WV', '266': 'WV', '267': 'WV', '268': 'WV',
  '270': 'NC', '271': 'NC', '272': 'NC', '273': 'NC', '274': 'NC', '275': 'NC', '276': 'NC', '277': 'NC', '278': 'NC', '279': 'NC', '280': 'NC', '281': 'NC', '282': 'NC', '283': 'NC', '284': 'NC', '285': 'NC', '286': 'NC', '287': 'NC', '288': 'NC', '289': 'NC',
  '290': 'SC', '291': 'SC', '292': 'SC', '293': 'SC', '294': 'SC', '295': 'SC', '296': 'SC', '297': 'SC', '298': 'SC', '299': 'SC',
  '300': 'GA', '301': 'GA', '302': 'GA', '303': 'GA', '304': 'GA', '305': 'GA', '306': 'GA', '307': 'GA', '308': 'GA', '309': 'GA', '310': 'GA', '311': 'GA', '312': 'GA', '313': 'GA', '314': 'GA', '315': 'GA', '316': 'GA', '317': 'GA', '318': 'GA', '319': 'GA',
  '320': 'FL', '321': 'FL', '322': 'FL', '323': 'FL', '324': 'FL', '325': 'FL', '326': 'FL', '327': 'FL', '328': 'FL', '329': 'FL', '330': 'FL', '331': 'FL', '332': 'FL', '333': 'FL', '334': 'FL', '335': 'FL', '336': 'FL', '337': 'FL', '338': 'FL', '339': 'FL',
  '340': 'FL', '341': 'FL', '342': 'FL', '343': 'FL', '344': 'FL', '345': 'FL', '346': 'FL', '347': 'FL', '348': 'FL', '349': 'FL',
  // Midwest
  '430': 'OH', '431': 'OH', '432': 'OH', '433': 'OH', '434': 'OH', '435': 'OH', '436': 'OH', '437': 'OH', '438': 'OH', '439': 'OH', '440': 'OH', '441': 'OH', '442': 'OH', '443': 'OH', '444': 'OH', '445': 'OH', '446': 'OH', '447': 'OH', '448': 'OH', '449': 'OH', '450': 'OH', '451': 'OH', '452': 'OH', '453': 'OH', '454': 'OH', '455': 'OH', '456': 'OH', '457': 'OH', '458': 'OH',
  '460': 'IN', '461': 'IN', '462': 'IN', '463': 'IN', '464': 'IN', '465': 'IN', '466': 'IN', '467': 'IN', '468': 'IN', '469': 'IN', '470': 'IN', '471': 'IN', '472': 'IN', '473': 'IN', '474': 'IN', '475': 'IN', '476': 'IN', '477': 'IN', '478': 'IN', '479': 'IN',
  '480': 'MI', '481': 'MI', '482': 'MI', '483': 'MI', '484': 'MI', '485': 'MI', '486': 'MI', '487': 'MI', '488': 'MI', '489': 'MI', '490': 'MI', '491': 'MI', '492': 'MI', '493': 'MI', '494': 'MI', '495': 'MI', '496': 'MI', '497': 'MI', '498': 'MI', '499': 'MI',
  '500': 'IA', '501': 'IA', '502': 'IA', '503': 'IA', '504': 'IA', '505': 'IA', '506': 'IA', '507': 'IA', '508': 'IA', '509': 'IA', '510': 'IA', '511': 'IA', '512': 'IA', '513': 'IA', '514': 'IA', '515': 'IA', '516': 'IA', '517': 'IA', '518': 'IA', '519': 'IA', '520': 'IA', '521': 'IA', '522': 'IA', '523': 'IA', '524': 'IA', '525': 'IA', '526': 'IA', '527': 'IA', '528': 'IA',
  '530': 'WI', '531': 'WI', '532': 'WI', '533': 'WI', '534': 'WI', '535': 'WI', '536': 'WI', '537': 'WI', '538': 'WI', '539': 'WI', '540': 'WI', '541': 'WI', '542': 'WI', '543': 'WI', '544': 'WI', '545': 'WI', '546': 'WI', '547': 'WI', '548': 'WI', '549': 'WI',
  '550': 'MN', '551': 'MN', '552': 'MN', '553': 'MN', '554': 'MN', '555': 'MN', '556': 'MN', '557': 'MN', '558': 'MN', '559': 'MN', '560': 'MN', '561': 'MN', '562': 'MN', '563': 'MN', '564': 'MN', '565': 'MN', '566': 'MN', '567': 'MN',
  '600': 'IL', '601': 'IL', '602': 'IL', '603': 'IL', '604': 'IL', '605': 'IL', '606': 'IL', '607': 'IL', '608': 'IL', '609': 'IL', '610': 'IL', '611': 'IL', '612': 'IL', '613': 'IL', '614': 'IL', '615': 'IL', '616': 'IL', '617': 'IL', '618': 'IL', '619': 'IL', '620': 'IL', '621': 'IL', '622': 'IL', '623': 'IL', '624': 'IL', '625': 'IL', '626': 'IL', '627': 'IL', '628': 'IL', '629': 'IL',
  // West
  '900': 'CA', '901': 'CA', '902': 'CA', '903': 'CA', '904': 'CA', '905': 'CA', '906': 'CA', '907': 'CA', '908': 'CA', '909': 'CA', '910': 'CA', '911': 'CA', '912': 'CA', '913': 'CA', '914': 'CA', '915': 'CA', '916': 'CA', '917': 'CA', '918': 'CA', '919': 'CA', '920': 'CA', '921': 'CA', '922': 'CA', '923': 'CA', '924': 'CA', '925': 'CA', '926': 'CA', '927': 'CA', '928': 'CA', '929': 'CA', '930': 'CA', '931': 'CA', '932': 'CA', '933': 'CA', '934': 'CA', '935': 'CA', '936': 'CA', '937': 'CA', '938': 'CA', '939': 'CA', '940': 'CA', '941': 'CA', '942': 'CA', '943': 'CA', '944': 'CA', '945': 'CA', '946': 'CA', '947': 'CA', '948': 'CA', '949': 'CA', '950': 'CA', '951': 'CA', '952': 'CA', '953': 'CA', '954': 'CA', '955': 'CA', '956': 'CA', '957': 'CA', '958': 'CA', '959': 'CA', '960': 'CA', '961': 'CA',
  '970': 'OR', '971': 'OR', '972': 'OR', '973': 'OR', '974': 'OR', '975': 'OR', '976': 'OR', '977': 'OR', '978': 'OR', '979': 'OR',
  '980': 'WA', '981': 'WA', '982': 'WA', '983': 'WA', '984': 'WA', '985': 'WA', '986': 'WA', '987': 'WA', '988': 'WA', '989': 'WA', '990': 'WA', '991': 'WA', '992': 'WA', '993': 'WA', '994': 'WA',
  // Texas
  '750': 'TX', '751': 'TX', '752': 'TX', '753': 'TX', '754': 'TX', '755': 'TX', '756': 'TX', '757': 'TX', '758': 'TX', '759': 'TX', '760': 'TX', '761': 'TX', '762': 'TX', '763': 'TX', '764': 'TX', '765': 'TX', '766': 'TX', '767': 'TX', '768': 'TX', '769': 'TX', '770': 'TX', '771': 'TX', '772': 'TX', '773': 'TX', '774': 'TX', '775': 'TX', '776': 'TX', '777': 'TX', '778': 'TX', '779': 'TX', '780': 'TX', '781': 'TX', '782': 'TX', '783': 'TX', '784': 'TX', '785': 'TX', '786': 'TX', '787': 'TX', '788': 'TX', '789': 'TX', '790': 'TX', '791': 'TX', '792': 'TX', '793': 'TX', '794': 'TX', '795': 'TX', '796': 'TX', '797': 'TX', '798': 'TX', '799': 'TX',
};

/**
 * Convert ZIP code to state code
 */
export function zipToState(zipCode: string): string | null {
  if (!zipCode || zipCode.length < 3) {
    return null;
  }
  
  const prefix = zipCode.substring(0, 3);
  return ZIP_TO_STATE[prefix] || null;
}

/**
 * Search CMS regional pricing data by medication name and state
 * @param medicationName - Generic or brand name of medication
 * @param stateCode - 2-letter state code (e.g., "MA", "CA") or null for national average
 * @returns Regional pricing data or null if not found
 */
export async function searchCMSRegionalPricing(
  medicationName: string,
  stateCode: string | null = null
): Promise<CMSRegionalPricingResult | null> {
  try {
    // Check cache first
    const cached = getCachedResult(medicationName, stateCode);
    if (cached) {
      return cached;
    }
    
    console.log(`🗺️ [CMS REGIONAL] Searching for "${medicationName}" in state: ${stateCode || 'National'}`);
    
    // Search with pagination (dataset has 115,936 records, need to search in batches)
    // Try to find medication by searching through the dataset
    const pageSize = 1000;
    const maxPages = 20; // Search up to 20,000 records
    
    for (let page = 0; page < maxPages; page++) {
      const offset = page * pageSize;
      const url = `${CMS_GEO_API_BASE}?size=${pageSize}&offset=${offset}`;
      
      const response = await fetch(url);
      if (!response.ok) {
        console.error(`❌ [CMS REGIONAL] API error: ${response.status}`);
        return null;
      }
      
      const data = await response.json();
      
      if (!Array.isArray(data) || data.length === 0) {
        console.log(`🗺️ [CMS REGIONAL] No more data at offset ${offset}`);
        break;
      }
      
      // Search for medication in this batch
      const lowerMedName = medicationName.toLowerCase();
      const matches = data.filter((record: any) => {
        const gnrcName = (record.Gnrc_Name || '').toLowerCase();
        const brndName = (record.Brnd_Name || '').toLowerCase();
        const matchesMed = gnrcName.includes(lowerMedName) || brndName.includes(lowerMedName);
        
        // Filter by state if provided
        if (stateCode) {
          const matchesState = record.Prscrbr_Geo_Cd === stateCode || record.Prscrbr_Geo_Desc === stateCode;
          return matchesMed && matchesState;
        }
        
        // Otherwise, prefer state-level data over national
        return matchesMed && record.Prscrbr_Geo_Lvl === 'State';
      });
      
      if (matches.length > 0) {
        // Found medication! Use first match
        const match = matches[0];
        
        const totalDrugCost = parseFloat(match.Tot_Drug_Cst) || 0;
        const total30DayFills = parseFloat(match.Tot_30day_Fills) || 0;
        
        if (total30DayFills === 0) {
          console.warn(`⚠️ [CMS REGIONAL] Found medication but no fills data`);
          continue;
        }
        
        const pricePerFill = totalDrugCost / total30DayFills;
        const pricePerUnit = pricePerFill / 30; // Assuming 30 pills per fill
        
        const result: CMSRegionalPricingResult = {
          state: match.Prscrbr_Geo_Desc || 'Unknown',
          stateCode: match.Prscrbr_Geo_Cd || '',
          brandName: match.Brnd_Name || '',
          genericName: match.Gnrc_Name || '',
          totalDrugCost,
          total30DayFills,
          totalClaims: parseFloat(match.Tot_Clms) || 0,
          totalBeneficiaries: parseFloat(match.Tot_Benes) || 0,
          pricePerUnit,
          pricePerFill,
        };
        
        console.log(`✅ [CMS REGIONAL] Found pricing for "${medicationName}" in ${result.state}`);
        console.log(`   Price per unit: $${pricePerUnit.toFixed(4)}`);
        console.log(`   Price per 30-day fill: $${pricePerFill.toFixed(2)}`);
        console.log(`   Based on ${total30DayFills.toFixed(0)} fills, $${totalDrugCost.toFixed(2)} total cost`);
        
        // Store in cache for future requests
        setCachedResult(medicationName, stateCode, result);
        
        return result;
      }
    }
    
    console.log(`❌ [CMS REGIONAL] Medication "${medicationName}" not found in dataset`);
    return null;
    
  } catch (error) {
    console.error('❌ [CMS REGIONAL] API error:', error);
    return null;
  }
}

/**
 * Get regional pricing with ZIP code
 * Converts ZIP code to state and searches CMS data
 */
export async function searchCMSRegionalPricingByZip(
  medicationName: string,
  zipCode: string | null = null
): Promise<CMSRegionalPricingResult | null> {
  const stateCode = zipCode ? zipToState(zipCode) : null;
  return searchCMSRegionalPricing(medicationName, stateCode);
}
