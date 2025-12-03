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
- [ ] Save checkpoint and deliver to user