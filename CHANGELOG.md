# Changelog

## Version 2024-12-02 - Phase 1-3 Complete

### Phase 1: Map Marker Selection Fix
- Fixed bug where map markers didn't update when clicking pharmacy cards
- Changed markers to use `filteredAndSortedResults` instead of `results`
- Markers now correctly show green (selected), amber (lowest price), blue (others)
- Added comprehensive debug logging

### Phase 2: Real Pharmacy Locations
- Integrated Google Places API to fetch real pharmacy locations
- Automatically detects pharmacy chains (CVS, Walgreens, Walmart, etc.)
- Fetches pharmacies within 5-mile radius of user's ZIP code
- Graceful fallback to mock data if Places API fails
- Real addresses and coordinates for accurate mapping

### Phase 3: Data Transparency Labels
- Added transparency banner at top of results page
- "Estimated" badges on local pharmacy insurance prices
- "Real API Data" badge on Cost Plus Drugs card
- Clear messaging about real vs. estimated data sources

### Technical Improvements
- Created `realPharmacyService.ts` for Places API integration
- Created `DataTransparencyBanner.tsx` component
- Enhanced error handling and fallback mechanisms
- All changes pushed to GitHub
