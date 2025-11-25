/**
 * Medical prescription frequency codes and their pills-per-day calculations
 */

export interface Frequency {
  code: string;
  label: string;
  description: string;
  pillsPerDay: number | 'custom'; // 'custom' for PRN
}

export const FREQUENCIES: Frequency[] = [
  {
    code: 'QD',
    label: 'QD - Once Daily',
    description: 'Take once per day',
    pillsPerDay: 1,
  },
  {
    code: 'QHS',
    label: 'QHS - Once Nightly',
    description: 'Take once at bedtime',
    pillsPerDay: 1,
  },
  {
    code: 'BID',
    label: 'BID - Twice Daily',
    description: 'Take twice per day',
    pillsPerDay: 2,
  },
  {
    code: 'TID',
    label: 'TID - Three Times Daily',
    description: 'Take three times per day',
    pillsPerDay: 3,
  },
  {
    code: 'QID',
    label: 'QID - Four Times Daily',
    description: 'Take four times per day',
    pillsPerDay: 4,
  },
  {
    code: 'Q4H',
    label: 'Q4H - Every 4 Hours',
    description: 'Take every 4 hours (6 times per day)',
    pillsPerDay: 6,
  },
  {
    code: 'Q6H',
    label: 'Q6H - Every 6 Hours',
    description: 'Take every 6 hours (4 times per day)',
    pillsPerDay: 4,
  },
  {
    code: 'Q8H',
    label: 'Q8H - Every 8 Hours',
    description: 'Take every 8 hours (3 times per day)',
    pillsPerDay: 3,
  },
  {
    code: 'Q12H',
    label: 'Q12H - Every 12 Hours',
    description: 'Take every 12 hours (2 times per day)',
    pillsPerDay: 2,
  },
  {
    code: 'PRN',
    label: 'PRN - As Needed',
    description: 'Take as needed (specify pills per day)',
    pillsPerDay: 'custom',
  },
];

/**
 * Get pills per day for a given frequency code
 */
export function getPillsPerDay(frequencyCode: string, customPillsPerDay?: number): number {
  const frequency = FREQUENCIES.find(f => f.code === frequencyCode);
  
  if (!frequency) {
    return 1; // Default to once daily
  }
  
  if (frequency.pillsPerDay === 'custom') {
    return customPillsPerDay || 1;
  }
  
  return frequency.pillsPerDay;
}

/**
 * Calculate total pills needed for a prescription
 */
export function calculateTotalPills(
  frequencyCode: string,
  daysSupply: number,
  customPillsPerDay?: number
): number {
  const pillsPerDay = getPillsPerDay(frequencyCode, customPillsPerDay);
  return pillsPerDay * daysSupply;
}
