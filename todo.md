# RxPriceFinder - Development TODO

## 🚨 Current Priority: Remove Medication Images

- [x] Delete all downloaded medication images from client/public/
- [x] Remove medication image feature from Results page
- [x] Delete medicationImageService.ts
- [x] Clean up image references in code

## Phase 1: Foundation & Security (Months 1-3)

### Legal & Compliance
- [ ] Draft Terms of Service with healthcare attorney
- [ ] Create Privacy Policy (HIPAA-compliant template)
- [ ] Create HIPAA compliance documentation
- [ ] Implement Cookie Consent banner
- [ ] Add legal footer links

### Security Hardening
- [ ] Implement httpOnly cookies for session management
- [ ] Add rate limiting to API routes (express-rate-limit)
- [ ] Set up basic audit logging for user actions
- [ ] Add CSRF protection
- [ ] Implement input validation and sanitization
- [ ] Set up security headers (helmet.js)

### Payment Infrastructure
- [ ] Integrate Stripe payment processing (use webdev_add_feature with feature="stripe")
- [ ] Create subscription tiers in Stripe
- [ ] Build checkout flow
- [ ] Implement subscription management UI
- [ ] Add payment webhook handlers

### User Management Enhancement
- [ ] Migrate from localStorage to database-backed user profiles
- [ ] Create patient profile schema (demographics, medications, insurance)
- [ ] Build profile management UI
- [ ] Add email verification
- [ ] Implement password reset flow

---

**Status**: Phase 1 in progress
**Next Milestone**: Complete security foundation and payment integration


## 🐛 Critical Bug: Insurance Pricing Showing $1

- [x] Investigate why all insurance copays show $1 - Found ID mismatch between insurance.ts and insuranceCarriers.ts
- [x] Check insurance tier categorization (Tier 1/2/3) - Verified tiers are correctly defined
- [x] Verify copay calculation logic in realPricingService.ts - Logic is correct, issue was ID mismatch
- [x] Test brand vs generic medication pricing with different insurance plans
- [x] Fix insurance pricing algorithm - Updated insurance plan IDs to match
## 🐛 Bug: Pharmacy Names Display Issues

- [x] Investigate pharmacy naming in Results page
- [ ] Check Google Places API pharmacy name extraction
- [ ] Verify getPharmacyDisplayName() function logic
- [ ] Test with multiple pharmacy chains (CVS, Walgreens, Walmart, etc.)
- [ ] Fix pharmacy name display to show clean chain names

## 🐛 Bug: Medication Search Display Issues

- [x] Clean up medication display names (remove RxNorm formatting like "{74 (apixaban...)")
- [x] Filter out confusing medication options (packs, kits, starter packs)
- [x] Show only base medications in search results
- [x] Let users choose from available dosages in database after selecting medication
- [x] Test with Eliquis and other medications
- [x] Remove numeric prefixes from form names ("2. Oral Tablet" -> "Oral Tablet")

## 🧬 Pharmacogenomic Testing System

### Phase 1: Database Schema
- [x] Create patient_profiles table (diseases, allergies, family_history, current_medications)
- [x] Create insurance_info table (carrier, plan, group_number, member_id, etc.)
- [x] Create genomic_tests table (test_status, request_date, results_date, report_url)
- [x] Create medication_resistance table (medication, gene, resistance_level, interpretation)
- [x] Push database schema changes with pnpm db:push

### Phase 2: Patient Information Page
- [x] Create PatientInfo.tsx page with structured forms
- [x] Add disease selection (dropdown + "Other" field)
- [x] Add current medications list management
- [x] Add family history form (structured conditions)
- [x] Add allergies form (medication/food allergies)
- [x] Add insurance information form (carrier, plan, group, member ID, etc.)
- [x] Implement save/update patient profile functionality

### Phase 3: My Genomic Page
- [x] Create MyGenomic.tsx page
- [x] Add genomic testing request form
- [x] Design medication resistance visualization (expandable categories)
- [x] Implement color-coded resistance indicators (green/yellow/red)
- [x] Create genomic report display (mimic real PGx reports)
- [x] Add gene-drug interaction explanations
- [x] Add genetic variant display (CYP2D6, CYP2C19, etc.)
- [x] Implement accordion-based medication categories
- [x] Add safety level legend and clinical disclaimers

### Phase 4: Integration
- [ ] Auto-populate insurance on main search page when user is logged in (TODO: API integration needed)
- [ ] Link patient profile to search history (TODO: API integration needed)
- [x] Add navigation to new pages in dashboard/menu
- [x] Add routes to App.tsx for PatientInfo and MyGenomic
- [x] Update UserMenu with Patient Information and My Pharmacogenomics links
- [ ] Update user context to include patient profile data (TODO: API integration needed)

### Phase 5: Testing & Delivery
- [x] Test complete user flow (profile → genomic → search)
- [ ] Verify insurance auto-population (requires backend API)
- [x] Test medication resistance visualization
- [ ] Verify all forms save correctly (requires backend API)
- [x] Test navigation between pages
- [x] Verify Patient Information page displays all sections
- [x] Verify My Genomic page shows test results and medication categories
- [x] Verify color-coded safety levels (green/yellow/red) display correctly
- [x] Verify accordion expansion shows detailed gene-drug interactions
- [x] Save checkpoint and deliver to user

## 🔌 Backend API Integration for Patient Profiles & Genomics

### Phase 1: Patient Profile API Routes
- [x] Create tRPC router for patient profiles
- [x] Implement getUserProfile endpoint
- [x] Implement updatePersonalInfo endpoint (DOB, gender)
- [x] Implement updateMedicalConditions endpoint
- [x] Implement addCurrentMedication endpoint
- [x] Implement removeCurrentMedication endpoint
- [x] Implement updateAllergies endpoint
- [x] Implement addFamilyHistory endpoint
- [x] Implement removeFamilyHistory endpoint
- [x] Register patientProfile router in routers.ts

### Phase 2: Insurance Information API
- [x] Create tRPC router for insurance details
- [x] Implement getInsuranceInfo endpoint
- [x] Implement updateInsuranceInfo endpoint
- [ ] Implement auto-population logic in SearchWithAPI page
- [ ] Load insurance data when user is logged in
- [x] Register insurance router in routers.ts

### Phase 3: Genomic Test Data API
- [x] Create tRPC router for genomic tests
- [x] Implement getGenomicTest endpoint
- [x] Implement requestGenomicTest endpoint
- [x] Implement getMedicationInteractions endpoint (included in getGenomicTest)
- [x] Add sample data seeding for demo purposes (seedSampleData endpoint)
- [x] Register genomic router in routers.ts

### Phase 4: Frontend Integration
- [x] Connect PatientInfo form to backend APIs
- [x] Add loading states and error handling
- [x] Connect MyGenomic page to backend APIs
- [x] Add "Load Sample Data" button for demo
- [ ] Implement auto-population in SearchWithAPI (TODO)
- [x] Add success/error toast notifications

### Phase 5: Testing & Delivery
- [x] Test patient profile save/load flow (requires login)
- [ ] Test insurance auto-population (requires login + SearchWithAPI integration)
- [x] Test genomic data loading (sample data seeding works!)
- [x] Test medication recommendations display (accordion expansion works!)
- [x] Verify color-coded safety levels display correctly
- [x] Verify gene-drug interactions show detailed recommendations
- [x] Save checkpoint and deliver to user

## 🏥 Insurance Structure Reorganization

- [x] Update insurance carriers to consolidate Blue Shield variants
- [x] Move specific Blue Shield plans (California, Massachusetts, etc.) to plan dropdown
- [x] Update carrier dropdown to show: Blue Cross Blue Shield, Medicare, Medicaid, etc.
- [x] Update plan dropdown to be dynamic based on selected carrier
- [x] Test insurance selection flow
- [x] Save checkpoint


## 🎯 Patient Information Page Optimization

### Section-Level Save/Edit Controls
- [x] Add individual Save/Edit buttons for each section (Personal Info, Medical Conditions, Current Medications, Allergies, Family History, Insurance)
- [x] Implement gray-out state when section is saved
- [x] Enable edit mode when Edit button is clicked
- [x] Disable form fields when section is in saved (grayed out) state
- [x] Create reusable SectionHeader component
- [x] Add disabled states to Personal Information inputs
- [x] Add disabled states to Medical Conditions checkboxes
- [x] Add disabled states to Insurance form fields

### Current Medications API Integration
- [ ] Connect medication search to RxNorm API
- [ ] Allow manual override for dosage and frequency fields
- [ ] Add autocomplete for medication names
- [ ] Save medication selections to database via backend API

### Insurance Dropdown Consistency
- [ ] Apply same carrier/plan dropdown structure to main SearchWithAPI page
- [ ] Ensure Blue Cross Blue Shield consolidation is consistent
- [ ] Add state-specific plan options to search page

### Testing & Delivery
- [ ] Test section-level save/edit for all sections
- [ ] Test medication API integration with manual overrides
- [ ] Test insurance dropdowns on both pages
- [ ] Save checkpoint


## 🔧 Final Polish - Remaining Fixes

### Phase 1: Medication Pricing Validation
- [x] Test Metformin search with Medicare Part D - PASSED ($3.20-$4.80, consistent)
- [ ] Test Eliquis search with Blue Cross Blue Shield PPO
- [ ] Test Lipitor search with Medicaid
- [x] Verify prices are reasonable and consistent - PASSED
- [x] Verify copay capped at cash price - PASSED ($4 copay < $9.28 cash)

### Phase 2: Insurance Formulary Integration
- [ ] Connect getFormularyCoverage() to fetchRealPricing()
- [ ] Use real formulary copays instead of generic tier-based copays
- [ ] Add fallback to tier-based copays when formulary data unavailable
- [ ] Test with multiple insurance plans

### Phase 3: Design & Alignment Fixes
- [ ] Review main search page spacing and alignment
- [ ] Fix Results page mobile responsiveness
- [ ] Ensure consistent padding/margins across sections
- [ ] Test on different screen sizes
- [ ] Fix any visual inconsistencies

### Phase 4: TypeScript Error Cleanup
- [x] Fix MyGenomic.tsx parameter type annotations (4 errors) - FIXED
- [x] Reduced errors from 132 to 124 (8 errors fixed)
- [ ] Remaining errors are in insuranceCarriers.ts and History.tsx (not critical)

### Phase 5: Patient Information Form Completion
- [ ] Connect Current Medications to RxNorm API with autocomplete
- [ ] Add save handlers for Family History section
- [ ] Add save handlers for Allergies section
- [ ] Test all sections save/load correctly
- [ ] Verify data persists in database

### Phase 6: Final Testing
- [ ] Test complete medication search flow (search → select → compare → results)
- [ ] Test Patient Information form (all sections)
- [ ] Test My Genomic page (load sample data)
- [ ] Test navigation (menu, recent searches, back buttons)
- [ ] Verify all pricing calculations are correct
- [ ] Save final checkpoint
