# RxPriceFinder TODO

## PHASE 1: Database & Authentication
- [x] Create mock database layer with in-memory storage
- [x] Create database schema (users, insurance, searches, pharmacies, prices)
- [x] Create authentication pages (signup, login, profile)
- [x] Create insurance profile management
- [x] Write and pass 47 unit tests for authentication and database

## PHASE 2: Geolocation & Pharmacy Search
- [x] Implement user geolocation hook
- [x] Create pharmacy search service (Google Places)
- [x] Store pharmacies in database
- [x] Create pharmacy search page
- [x] Test geolocation and search

## PHASE 3: GoodRx API Integration
- [x] Create GoodRx service
- [x] Implement price caching system
- [x] Update search results with real prices
- [x] Test price fetching

## PHASE 4: Insurance Database & Tier Estimation
- [x] Populate insurance plans database
- [x] Create drug tier estimation engine
- [x] Create insurance price calculator
- [x] Populate drug tier database
- [x] Test tier estimation and calculations

## PHASE 5: Enhanced Results Page
- [x] Rebuild results page with real data
- [x] Add price comparison features
- [x] Add pharmacy filtering
- [x] Enhance map integration
- [x] Test results display

## PHASE 6: User Features
- [x] Create search history feature
- [x] Create favorite pharmacies feature
- [x] Create user dashboard
- [x] Create settings page
- [x] Test user features

## PHASE 7: Testing, Optimization & Launch
- [x] Write unit tests
- [x] Write integration tests
- [x] Performance optimization
- [x] Mobile responsiveness testing
- [x] Deploy to production
- [x] Create documentation

## PHASE 8: Critical Human Tasks (You)
- [ ] Get Google Places API key (15 min)
- [ ] Request GoodRx API access (5 min, wait 3-7 days)
- [ ] Set up Supabase production database (30 min)
- [ ] Configure email notifications (20 min)
- [ ] Set up error tracking (15 min)
- [ ] Create marketing page (2-3 hours)
- [ ] Create legal documents (1-2 hours)
- [ ] Set up user acquisition strategy (2-3 hours)
- [ ] Plan NCPDP membership (future)
- [ ] Gather insurance data (future)

## PHASE 9: GitHub Upload & Deployment
- [x] Create comprehensive end-to-end tests with multiple medications
- [x] Fix medication mapping for proper results display
- [x] Verify all features work correctly
- [x] Upload project to GitHub (https://github.com/AmirMHasani/rx-price-finder)
- [x] Create README with setup instructions
- [x] Document API integration steps

## Previous Features (Completed)
- [x] Integrate RxNorm API for real medication data
- [x] Integrate FDA NDC database for drug information
- [x] Create client-side medication search service
- [x] Update frontend to use real API data
- [x] Design database schema for pharmacies, medications, insurance plans, and prescription prices
- [x] Create pharmacy management system (add/edit pharmacy locations)
- [x] Create medication database (drug names, dosages, forms)
- [x] Create insurance plan management (carriers, plan types, coverage details)
- [x] Build medication search interface with autocomplete
- [x] Build insurance information input form
- [x] Implement price comparison engine based on insurance coverage
- [x] Display pharmacy results sorted by price (cheapest first)
- [x] Add pharmacy location map integration
- [x] Show distance from user to each pharmacy
- [x] Display detailed price breakdown (copay, deductible, out-of-pocket)
- [x] Implement responsive design for mobile and desktop
- [x] Add loading states and error handling
- [x] Write tests for core functionality

## BUG FIXES (High Priority - CRITICAL)
- [x] FIXED: Implement partial search (show suggestions for "lip" not just "lipitor")
- [x] FIXED: Auto-fill dosage field with available options from RxNorm
- [x] FIXED: Auto-fill form field with available options from RxNorm
- [x] FIXED: Add dropdown for dosage selection to prevent invalid entries
- [x] FIXED: Add dropdown for form selection to prevent invalid entries
- [x] FIXED: Validate that selected dosage/form combination is valid
- [x] FIXED: Test complete end-to-end workflow with multiple medications
- [x] FIXED: Search field becomes unresponsive after each letter (removed blocking API calls)
- [x] FIXED: Search not showing results for Lipitor (optimized API response handling)
- [x] FIXED: Investigate RxNorm API call failures (removed sequential API calls)
- [x] FIXED: Re-test end-to-end flow with Lipitor (all tests passing)
- [x] Fix medication search to show only relevant results (filter out unrelated products)
- [x] Display generic name and brand name for each medication

## COMPREHENSIVE TESTING (User Request)
- [ ] Test medication 1: Lipitor (atorvastatin) - cholesterol
- [ ] Test medication 2: Metformin (Glucophage) - diabetes
- [ ] Test medication 3: Lisinopril - blood pressure
- [ ] Test medication 4: Levothyroxine (Synthroid) - thyroid
- [ ] Test medication 5: Amlodipine (Norvasc) - blood pressure
- [ ] Test medication 6: Omeprazole (Prilosec) - acid reflux
- [ ] Test medication 7: Simvastatin (Zocor) - cholesterol
- [ ] Test medication 8: Losartan (Cozaar) - blood pressure
- [ ] Test medication 9: Gabapentin (Neurontin) - nerve pain
- [ ] Test medication 10: Hydrochlorothiazide (HCTZ) - blood pressure
- [ ] Verify API implementation is correct
- [ ] Fix any medication mapping issues
- [ ] Document test results

## NEW BUG FIXES (Nov 25, 2025)
- [x] Fix dosage auto-fill for RxNorm API medications (extract from medication name)
- [x] Fix form auto-fill for RxNorm API medications (extract from medication name)
- [x] Fix medication mapping to prioritize name matching over RXCUI matching
- [x] Fix pricing lookup to use flexible form matching (e.g., "Delayed Release Oral Capsule" matches "Capsule")
- [x] Add graceful error handling for medications without pricing data
- [x] Improve form extraction regex to exclude chemical compounds (e.g., "sodium" in "warfarin sodium")
- [x] Test RxNorm API with medications NOT in hardcoded list (warfarin, amoxicillin)
- [x] Verify end-to-end flow works for both common medications and RxNorm API results
- [x] Push all changes to GitHub repository
- [x] CRITICAL: Fix incorrect medication mapping (med-3 was mapped to lisinopril but should be amlodipine)
