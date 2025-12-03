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
