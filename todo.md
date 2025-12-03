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
