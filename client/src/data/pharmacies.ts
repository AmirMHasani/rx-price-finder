export interface Pharmacy {
  id: string;
  name: string;
  chain: string;
  address: string;
  city: string;
  state: string;
  zip: string;
  phone: string;
  lat: number;
  lng: number;
  hours: string;
  hasDelivery: boolean;
  hasDriveThru: boolean;
}

export const pharmacies: Pharmacy[] = [
  {
    id: "pharm-1",
    name: "CVS Pharmacy #5432",
    chain: "CVS",
    address: "123 Main Street",
    city: "Boston",
    state: "MA",
    zip: "02108",
    phone: "(617) 555-0101",
    lat: 42.3601,
    lng: -71.0589,
    hours: "Mon-Fri 8AM-10PM, Sat-Sun 9AM-9PM",
    hasDelivery: true,
    hasDriveThru: false
  },
  {
    id: "pharm-2",
    name: "Walgreens #8765",
    chain: "Walgreens",
    address: "456 Commonwealth Ave",
    city: "Boston",
    state: "MA",
    zip: "02215",
    phone: "(617) 555-0102",
    lat: 42.3505,
    lng: -71.0892,
    hours: "24 Hours",
    hasDelivery: true,
    hasDriveThru: true
  },
  {
    id: "pharm-3",
    name: "Rite Aid #2341",
    chain: "Rite Aid",
    address: "789 Boylston Street",
    city: "Boston",
    state: "MA",
    zip: "02116",
    phone: "(617) 555-0103",
    lat: 42.3488,
    lng: -71.0820,
    hours: "Mon-Fri 7AM-11PM, Sat-Sun 8AM-10PM",
    hasDelivery: false,
    hasDriveThru: false
  },
  {
    id: "pharm-4",
    name: "Stop & Shop Pharmacy",
    chain: "Stop & Shop",
    address: "321 Beacon Street",
    city: "Boston",
    state: "MA",
    zip: "02116",
    phone: "(617) 555-0104",
    lat: 42.3519,
    lng: -71.0752,
    hours: "Mon-Sat 9AM-8PM, Sun 10AM-6PM",
    hasDelivery: false,
    hasDriveThru: false
  },
  {
    id: "pharm-5",
    name: "Target Pharmacy",
    chain: "Target",
    address: "180 Brookline Ave",
    city: "Boston",
    state: "MA",
    zip: "02215",
    phone: "(617) 555-0105",
    lat: 42.3467,
    lng: -71.1003,
    hours: "Mon-Sat 9AM-7PM, Sun 10AM-6PM",
    hasDelivery: false,
    hasDriveThru: false
  },
  {
    id: "pharm-6",
    name: "Walmart Pharmacy",
    chain: "Walmart",
    address: "55 Mystic Ave",
    city: "Somerville",
    state: "MA",
    zip: "02145",
    phone: "(617) 555-0106",
    lat: 42.3875,
    lng: -71.0995,
    hours: "Mon-Sat 9AM-9PM, Sun 10AM-6PM",
    hasDelivery: true,
    hasDriveThru: true
  },
  {
    id: "pharm-7",
    name: "CVS Pharmacy #5433",
    chain: "CVS",
    address: "700 Atlantic Ave",
    city: "Boston",
    state: "MA",
    zip: "02111",
    phone: "(617) 555-0107",
    lat: 42.3539,
    lng: -71.0520,
    hours: "Mon-Fri 8AM-10PM, Sat-Sun 9AM-9PM",
    hasDelivery: true,
    hasDriveThru: false
  },
  {
    id: "pharm-8",
    name: "Costco Pharmacy",
    chain: "Costco",
    address: "400 Soldiers Field Rd",
    city: "Brighton",
    state: "MA",
    zip: "02135",
    phone: "(617) 555-0108",
    lat: 42.3621,
    lng: -71.1484,
    hours: "Mon-Fri 10AM-7PM, Sat 9:30AM-6PM, Sun Closed",
    hasDelivery: false,
    hasDriveThru: false
  }
];
