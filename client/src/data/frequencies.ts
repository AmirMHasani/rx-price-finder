export interface Frequency {
  id: string;
  label: string;
  description: string;
  pillsPerDay: number;
}

export const frequencies: Frequency[] = [
  {
    id: "QD",
    label: "QD - Once Daily",
    description: "Take once per day",
    pillsPerDay: 1,
  },
  {
    id: "QHS",
    label: "QHS - Once Nightly",
    description: "Take once at bedtime",
    pillsPerDay: 1,
  },
  {
    id: "BID",
    label: "BID - Twice Daily",
    description: "Take twice per day",
    pillsPerDay: 2,
  },
  {
    id: "TID",
    label: "TID - Three Times Daily",
    description: "Take three times per day",
    pillsPerDay: 3,
  },
  {
    id: "QID",
    label: "QID - Four Times Daily",
    description: "Take four times per day",
    pillsPerDay: 4,
  },
  {
    id: "Q4H",
    label: "Q4H - Every 4 Hours",
    description: "Take every 4 hours (6 times per day)",
    pillsPerDay: 6,
  },
  {
    id: "Q6H",
    label: "Q6H - Every 6 Hours",
    description: "Take every 6 hours (4 times per day)",
    pillsPerDay: 4,
  },
  {
    id: "Q8H",
    label: "Q8H - Every 8 Hours",
    description: "Take every 8 hours (3 times per day)",
    pillsPerDay: 3,
  },
  {
    id: "Q12H",
    label: "Q12H - Every 12 Hours",
    description: "Take every 12 hours (2 times per day)",
    pillsPerDay: 2,
  },
  {
    id: "PRN",
    label: "PRN - As Needed",
    description: "Take as needed (specify pills per day)",
    pillsPerDay: 0, // User will specify
  },
];
