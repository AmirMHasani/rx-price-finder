# RxPriceFinder Master Plan

## 🎯 Project Goals
Transform RxPriceFinder into a comprehensive, production-ready medication price comparison and management platform with:
- Accurate, real-world medication pricing
- User authentication and health profiles
- Medication management with refill reminders
- Two-tier insurance selection system
- Clean, maintainable codebase
- Fully debugged and tested

---

## 📋 Current Issues to Fix

### Critical Bugs
- [ ] **Alternative medications tab not working** - AI alternatives and safety information tabs broken
- [ ] **Update button out of frame** - ZIP code update button positioning issue
- [ ] **Cost Plus box not working** - Cost Plus Drugs card not displaying properly
- [ ] **Medication prices too inaccurate** - Need Cost Plus API integration for realistic pricing

### Data Quality Issues
- [ ] **Insurance carriers need research** - Replace fake/random carriers with real ones
- [ ] **Insurance plans too limited** - Need two-tier selection (carrier → plan)
- [ ] **Pricing variations needed** - Different insurance plans should show different prices

---

## 🚀 Development Phases

### **Phase 1: Audit & Fix Critical Bugs** (Current)
**Goal:** Fix all broken features before adding new ones

**Tasks:**
- [ ] Fix alternative medications tab (AI alternatives not loading)
- [ ] Fix safety information tab (OpenFDA API integration)
- [ ] Fix ZIP code update button positioning
- [ ] Fix Cost Plus Drugs card display
- [ ] Test all existing features end-to-end

**Deliverable:** All current features working correctly

---

### **Phase 2: Upgrade to web-db-user Template**
**Goal:** Add backend server, database, and authentication infrastructure

**Tasks:**
- [ ] Run `webdev_add_feature` with `web-db-user`
- [ ] Set up PostgreSQL database schema
- [ ] Configure authentication endpoints
- [ ] Test database connection
- [ ] Migrate existing localStorage data to database

**Deliverable:** Working backend with database and auth ready

---

### **Phase 3: Implement User Authentication & Profiles**
**Goal:** Enable users to create accounts and save health information

**Database Schema:**
```sql
users (
  id, username, email, password_hash,
  age, height, weight, gender,
  created_at, updated_at
)

user_conditions (
  id, user_id, condition_name, diagnosed_date
)

user_allergies (
  id, user_id, allergen, severity
)

user_medications (
  id, user_id, medication_name, dosage, frequency,
  start_date, refill_date, active
)

search_history (
  id, user_id, medication, dosage, insurance,
  zip_code, searched_at
)
```

**Tasks:**
- [ ] Create database migrations
- [ ] Build signup/login pages
- [ ] Create user profile page with health info forms
- [ ] Add medical conditions checklist (diabetes, hypertension, asthma, etc.)
- [ ] Add allergies tracking
- [ ] Implement session management
- [ ] Add password reset flow

**Deliverable:** Full user authentication and profile management

---

### **Phase 4: Fix Medication Pricing with Cost Plus API**
**Goal:** Use real Cost Plus API data to calibrate all medication pricing

**Approach:**
1. Query Cost Plus API for common medications
2. Use their pricing as baseline for "cash price"
3. Calculate insurance copays based on realistic tier structures
4. Add variance for different pharmacy chains (CVS +10%, Walmart -5%, etc.)

**Tasks:**
- [ ] Integrate Cost Plus API for all medications
- [ ] Create pricing calibration service
- [ ] Update mock pricing generator to use Cost Plus baseline
- [ ] Add pharmacy chain price modifiers
- [ ] Test pricing accuracy against real-world data

**Deliverable:** Realistic medication pricing across all pharmacies

---

### **Phase 5: Two-Tier Insurance Selection with Real Carriers**
**Goal:** Research real insurance carriers and implement carrier → plan selection

**Research Tasks:**
- [ ] Research top 20 US insurance carriers
- [ ] Document real plan names for each carrier
- [ ] Gather copay tier structures from public sources
- [ ] Verify 2025 formulary data

**Implementation:**
- [ ] Create insurance carriers database table
- [ ] Create insurance plans database table (linked to carriers)
- [ ] Build two-step selection UI (carrier first, then plan)
- [ ] Update pricing engine to use carrier-specific copays
- [ ] Add plan comparison feature

**Real Carriers to Include:**
1. UnitedHealthcare (Choice Plus, Options, Core, etc.)
2. Blue Cross Blue Shield (varies by state)
3. Aetna CVS Health
4. Cigna
5. Humana
6. Kaiser Permanente
7. Anthem (Elevance Health)
8. Centene (Ambetter, WellCare)
9. Molina Healthcare
10. Oscar Health
11. Medicare (Part D, Advantage)
12. Medicaid (by state)
13. TRICARE
14. VA

**Deliverable:** Accurate two-tier insurance selection with real carriers

---

### **Phase 6: Medication Management & Refill Reminders**
**Goal:** Help users track current medications and get refill alerts

**Features:**
- [ ] Current medications dashboard
- [ ] Add/edit/remove medications
- [ ] Refill date calculator (based on quantity and frequency)
- [ ] Email/SMS refill reminders (7 days, 3 days, 1 day before)
- [ ] Medication adherence tracking
- [ ] Price tracking for saved medications

**Tasks:**
- [ ] Create medications management UI
- [ ] Build refill reminder service
- [ ] Implement notification system
- [ ] Add medication price alerts
- [ ] Create medication history timeline

**Deliverable:** Complete medication management system

---

### **Phase 7: Fix AI Alternatives and Safety Information**
**Goal:** Make AI alternatives and safety tabs fully functional

**AI Alternatives Tab:**
- [ ] Fix LLM API integration (use Forge API)
- [ ] Improve prompt engineering for better recommendations
- [ ] Add loading states and error handling
- [ ] Cache AI responses to reduce API calls
- [ ] Add disclaimer about consulting healthcare provider

**Safety Information Tab:**
- [ ] Fix OpenFDA API integration
- [ ] Add proper error handling for missing data
- [ ] Improve data display formatting
- [ ] Add drug interaction checker
- [ ] Link to official FDA resources

**Deliverable:** Working AI alternatives and comprehensive safety information

---

### **Phase 8: Code Cleanup & Organization**
**Goal:** Ensure codebase is maintainable, well-documented, and follows best practices

**Tasks:**
- [ ] Organize services into logical folders
- [ ] Add JSDoc comments to all functions
- [ ] Extract magic numbers to constants
- [ ] Remove dead code and unused imports
- [ ] Standardize error handling patterns
- [ ] Add TypeScript strict mode
- [ ] Create README for each major component
- [ ] Add inline code comments for complex logic

**File Structure:**
```
client/src/
  ├── components/
  │   ├── auth/          # Login, signup, profile
  │   ├── medications/   # Medication management
  │   ├── pricing/       # Price comparison cards
  │   ├── ui/            # shadcn components
  │   └── shared/        # Reusable components
  ├── services/
  │   ├── api/           # External API integrations
  │   ├── auth/          # Authentication logic
  │   ├── pricing/       # Pricing calculations
  │   └── database/      # Database queries
  ├── hooks/             # Custom React hooks
  ├── contexts/          # React contexts
  ├── lib/               # Utilities
  └── pages/             # Route components
```

**Deliverable:** Clean, well-organized, documented codebase

---

### **Phase 9: Comprehensive Testing**
**Goal:** Test every feature thoroughly and fix all bugs

**Testing Checklist:**
- [ ] User authentication flow (signup, login, logout, password reset)
- [ ] Profile management (add/edit health info, conditions, allergies)
- [ ] Medication search (autocomplete, selection, form validation)
- [ ] Price comparison (all insurance types, all pharmacy chains)
- [ ] Two-tier insurance selection
- [ ] Medication management (add, edit, delete, refill reminders)
- [ ] AI alternatives tab
- [ ] Safety information tab
- [ ] Cost Plus integration
- [ ] Map functionality (markers, zoom, directions)
- [ ] Filters (distance, chain, features)
- [ ] Search history
- [ ] Mobile responsiveness
- [ ] Browser compatibility (Chrome, Firefox, Safari, Edge)

**Bug Tracking:**
- [ ] Create bug tracking document
- [ ] Test on multiple devices
- [ ] Test with different screen sizes
- [ ] Test with slow network
- [ ] Test error states

**Deliverable:** Fully tested, bug-free application

---

### **Phase 10: Publish to Production**
**Goal:** Deploy to rxprice.me and monitor performance

**Pre-launch Checklist:**
- [ ] Final checkpoint created
- [ ] All tests passing
- [ ] Performance optimization (lazy loading, code splitting)
- [ ] SEO optimization (meta tags, sitemap)
- [ ] Analytics setup
- [ ] Error monitoring (Sentry or similar)
- [ ] Database backups configured
- [ ] SSL certificate verified
- [ ] Privacy policy and terms of service

**Launch Tasks:**
- [ ] Click "Publish" in Manus UI
- [ ] Verify production deployment
- [ ] Test all features in production
- [ ] Monitor error logs
- [ ] Monitor performance metrics

**Deliverable:** Live production application at rxprice.me

---

## 📊 Success Metrics

- ✅ All features working without errors
- ✅ Medication pricing within 10% of real-world prices
- ✅ User authentication with secure password storage
- ✅ Two-tier insurance selection with 15+ real carriers
- ✅ Clean codebase with 80%+ code documentation
- ✅ Mobile-responsive design
- ✅ Page load time < 3 seconds
- ✅ Zero critical bugs in production

---

## 🔄 Current Status

**Phase:** 1 - Audit & Fix Critical Bugs
**Progress:** 0%
**Next Action:** Fix alternative medications and safety tabs
