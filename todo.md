# RxPriceFinder - Development TODO

This file tracks active development tasks and future enhancements. Completed tasks are archived in git history.

---

## 🚨 High Priority

### CRITICAL: Pharmacy Search Results Accuracy
- [x] Fix pharmacy search to return accurate results matching Google Maps
- [x] Debug why our app returns incorrect pharmacies for Boston 02108
- [x] Verify Google Places API query parameters (location, radius, search terms)
- [x] Check if we're using correct coordinates for ZIP code lookup
- [x] Compare our results to actual Google Maps search results
- [x] Reduced search radius from 25km to 5km (3 miles)
- [x] Implemented distance-based sorting instead of Google's prominence ranking
- [x] Results now show pharmacies actually in Boston, not suburbs 10-20 miles away

### Insurance Formulary API
- [ ] Implement `/api/insurance/copay/{rxcui}` endpoint
- [ ] Integrate real insurance formulary data
- [ ] Add fallback to tier-based copays when formulary unavailable
- [ ] Test with multiple insurance plans

### Price Variation Enhancement
- [ ] Increase insurance copay variation from ±10% to ±20%
- [ ] Ensure visible price differences between pharmacy locations
- [ ] Update summary calculation to show meaningful savings

### Auto-Population Features
- [ ] Auto-populate insurance from patient profile when logged in
- [ ] Implement geolocation for automatic ZIP code detection
- [ ] Pre-fill medication search from recent history

---

## 🎯 Medium Priority

### User Experience
- [ ] Add loading skeleton for results page
- [ ] Implement price drop alerts and notifications
- [ ] Add prescription savings cards
- [ ] Create pharmacy price history charts
- [ ] Add drug interaction checker

### Patient Dashboard Enhancement
- [ ] Complete Current Medications API integration with RxNorm autocomplete
- [ ] Add manual override for dosage and frequency fields
- [ ] Implement save handlers for Family History section
- [ ] Implement save handlers for Allergies section
- [ ] Verify all data persists correctly in database

### Mobile Optimization
- [ ] Improve mobile responsiveness on Results page
- [ ] Test on different screen sizes (iPhone, Android, tablet)
- [ ] Optimize touch interactions for map
- [ ] Add swipe gestures for pharmacy cards

---

## 🔧 Technical Debt

### Code Quality
- [ ] Reduce remaining TypeScript errors (insuranceCarriers.ts, History.tsx)
- [ ] Add more unit tests (target 90% coverage)
- [ ] Refactor large components (>300 lines)
- [ ] Extract common hooks and utilities

### Performance
- [ ] Implement service worker for offline support
- [ ] Add image lazy loading
- [ ] Optimize bundle size (code splitting)
- [ ] Add performance monitoring

### Security
- [ ] Implement CSRF protection
- [ ] Add rate limiting to API routes
- [ ] Set up security headers (helmet.js)
- [ ] Implement input validation and sanitization
- [ ] Add audit logging for user actions

---

## 📱 Future Features

### Phase 1: Mobile App
- [ ] Design React Native architecture
- [ ] Port core features to mobile
- [ ] Add barcode scanning for medications
- [ ] Implement push notifications for price alerts

### Phase 2: Advanced Analytics
- [ ] Build admin dashboard for analytics
- [ ] Track medication price trends over time
- [ ] Generate savings reports for users
- [ ] Add data visualization charts

### Phase 3: Social Features
- [ ] User reviews and ratings for pharmacies
- [ ] Share medication deals with friends
- [ ] Community forum for health discussions
- [ ] Pharmacy wait time estimates

### Phase 4: Healthcare Integration
- [ ] Electronic prescription (eRx) integration
- [ ] Connect with pharmacy systems for real-time inventory
- [ ] Integrate with health insurance portals
- [ ] Add medication adherence tracking

---

## 🐛 Known Issues

### Non-Critical
- [ ] Console warning: ZodError in formatSafetyInfo (schema validation)
- [ ] Some insurance copays show identical prices due to small variation (±10%)
- [ ] Placeholder features in navigation show "Coming soon" toast

---

## 📝 Documentation

### To Be Written
- [ ] API documentation (OpenAPI/Swagger)
- [ ] Database schema documentation
- [ ] Deployment guide (production setup)
- [ ] Troubleshooting guide
- [ ] Architecture decision records (ADRs)

---

## ✅ Recently Completed

See git commit history for completed tasks:

```bash
git log --oneline --grep="feat:" --grep="fix:" --all-match -20
```

Major milestones:
- ✅ Insurance API error fixed (disabled non-existent endpoint)
- ✅ Pricing variation fixed (using pharmacy.placeId)
- ✅ Homepage redesign (clean, focused layout)
- ✅ ZIP code parameter bug fixed
- ✅ Realistic pricing markups (4-10x)
- ✅ Medication search optimization (2-char minimum, caching)
- ✅ Insurance carrier reorganization (29 carriers, alphabetical)
- ✅ Bilingual support (EN/ES)
- ✅ Pharmacogenomics dashboard
- ✅ Patient information management


## 🐛 Pharmacy Search Diversity - PARTIALLY FIXED ✅

- [x] Investigated - Google Places API returns only CVS for Boston 02108
- [x] Confirmed all 12 results are CVS at different addresses
- [x] Manhattan 10001 works correctly (shows Duane Reade, Walgreens, independents)
- [x] Expanded search radius from 16km to 25km (15.5 miles)
- [x] Added chain diversity logic to prioritize one pharmacy from each major chain
- [x] Tested with Boston 02108 - now shows Eastern Pharmacy and Boston Medical Center (independents)
- [ ] **Issue**: Walgreens, Walmart, Costco, Target don't exist within 25km of Boston 02108
- [ ] **Solution**: Consider adding "virtual" pricing for major chains even if not nearby
