export const en = {
  // Header
  appName: "RxPriceFinder",
  appTagline: "Compare prescription prices with your insurance",
  
  // Homepage
  heroTitle: "Find the Best Price for Your Prescription",
  heroSubtitle: "Compare real insurance-based prices at local pharmacies. Enter your medication and insurance information below to see which pharmacy offers the lowest price with your coverage.",
  
  // Search Form
  searchTitle: "Search for Your Medication",
  searchSubtitle: "Search from real medication database and insurance information to compare prices",
  medicationInfo: "Medication Information",
  medicationName: "Medication Name",
  medicationPlaceholder: "Search medications (e.g., lipitor, metformin)...",
  dosage: "Dosage",
  dosagePlaceholder: "e.g., 500mg, 10mg",
  form: "Form",
  formPlaceholder: "e.g., Tablet, Capsule",
  frequency: "How often do you take it?",
  quantity: "How many days supply?",
  totalPills: "Total pills:",
  zipCode: "Your ZIP Code (Optional)",
  
  // Insurance
  insuranceInfo: "Insurance Information",
  insurancePlan: "Insurance Plan",
  insurancePlaceholder: "Select your insurance plan",
  deductibleMet: "I have already met my deductible this year",
  compareButton: "Compare Prices",
  
  // Frequency options
  onceDaily: "Once daily",
  twiceDaily: "Twice daily",
  threeTimes: "Three times daily",
  fourTimes: "Four times daily",
  everyOtherDay: "Every other day",
  onceWeekly: "Once weekly",
  asNeeded: "As needed",
  
  // Recent Searches
  recentSearches: "Recent Searches",
  clearHistory: "Clear History",
  zip: "ZIP:",
  timeAgo: {
    justNow: "just now",
    minutesAgo: "{{count}}m ago",
    hoursAgo: "{{count}}h ago",
    daysAgo: "{{count}}d ago",
  },
  
  // Feature Cards
  realDataTitle: "Real Medication Data",
  realDataDesc: "Search from the official FDA and RxNorm medication databases with real drug names and information.",
  insurancePricingTitle: "Insurance-Based Pricing",
  insurancePricingDesc: "See actual prices based on your specific insurance plan, not just cash prices.",
  saveMoneyTitle: "Save Money",
  saveMoneyDesc: "Find the lowest price for your prescription and save hundreds of dollars per year.",
  
  // Results Page
  newSearch: "New Search",
  print: "Print",
  share: "Share",
  
  // Medication Info
  onceDailyText: "Once daily",
  daysSupply: "{{count}} days supply",
  pills: "{{count}} pills",
  
  // Alternatives
  alternativesTitle: "Consider These Alternatives",
  alternativesSubtitle: "You may save money by switching to a generic or therapeutic alternative",
  alternative: "Alternative",
  generic: "Generic",
  alternativeFor: "Alternative for {{condition}}",
  savePercent: "Save {{percent}}%",
  estimated: "estimated",
  
  // Price Summary
  priceSummaryTitle: "Price Comparison Summary",
  lowestPrice: "Lowest Price",
  highestPrice: "Highest Price",
  averagePrice: "Average Price",
  potentialSavings: "Potential Savings",
  recommendedPharmacy: "💡 Recommended Pharmacy",
  milesAway: "{{distance}} miles away",
  bestValue: "Best value",
  
  // Filters
  distance: "Distance",
  allDistances: "All distances",
  lessThan1Mile: "< 1 mile",
  lessThan5Miles: "< 5 miles",
  lessThan10Miles: "< 10 miles",
  features: "Features",
  feature24Hour: "24-Hour",
  featureDriveThru: "Drive-Thru",
  featureDelivery: "Delivery",
  sortBy: "Sort by",
  sortPriceLowHigh: "Price: Low to High",
  sortDistanceNearFar: "Distance: Near to Far",
  sortSavingsHighLow: "Savings: High to Low",
  
  // Pharmacy Results
  foundPharmacies: "Found {{count}} pharmacies",
  saveUpTo: "Save up to ${{amount}}",
  lowestPriceBadge: "Lowest Price",
  getDirections: "Get Directions",
  cashPrice: "Cash Price",
  withInsurance: "With {{insurance}}",
  save: "Save ${{amount}}",
  withCoupon: "With {{provider}} Coupon",
  bestPrice: "Best Price!",
  saveCoupon: "Save ${{amount}} vs cash price",
  
  // Map
  pharmacyLocations: "Pharmacy Locations",
  clickMarkers: "Click markers to view details",
  
  // Days of week
  monday: "Mon",
  tuesday: "Tue",
  wednesday: "Wed",
  thursday: "Thu",
  friday: "Fri",
  saturday: "Sat",
  sunday: "Sun",
  closed: "Closed",
  hours24: "24 Hours",
  
  // Common
  loading: "Loading...",
  error: "An error occurred",
  tryAgain: "Try again",
};

export type TranslationKeys = typeof en;
