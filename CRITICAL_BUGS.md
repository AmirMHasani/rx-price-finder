# Critical Bugs & Issues - RxPriceFinder

**Testing Date**: December 3, 2024
**Status**: Pre-Production Audit

## 🔴 CRITICAL - Blocking Production

### 1. ZIP Code Not Being Used for Pharmacy Search
**Severity**: CRITICAL
**Impact**: Pharmacies shown are not near user's location

**Issue**: 
- User enters ZIP code "02108" (Boston)
- Results page shows pharmacies in Boston area (correct)
- BUT URL shows `zip=` (empty parameter)
- Pharmacy search may be using hardcoded default ZIP instead of user input

**Steps to Reproduce**:
1. Search for metformin
2. Enter ZIP code 02108
3. Select Medicare Part D
4. Click Compare Prices
5. Check URL: `zip=` is empty

**Expected**: URL should show `zip=02108` and pharmacies should be based on that ZIP
**Actual**: URL shows `zip=` (empty) but pharmacies appear correct (may be coincidence)

**Fix Priority**: IMMEDIATE - This breaks core functionality

---

### 2. Pricing Appears Too Low
**Severity**: HIGH
**Impact**: Pricing may not be realistic, could damage credibility

**Issue**:
- Metformin 500mg (30 tablets) showing $1.21-$1.25
- This is EXTREMELY low - even Cost Plus Drugs charges $3-5 for metformin
- Medicare Part D copay showing $2.02-$2.09 (also very low)
- RxPrice Member price showing $1.62-$1.67 (impossibly low)

**Expected**: Metformin should be $3-8 range based on real pharmacy pricing
**Actual**: Showing $1-2 range

**Possible Causes**:
- Pricing calculation using wrong multipliers
- Per-pill price instead of per-prescription
- API returning incorrect data
- Fallback estimation too aggressive

**Fix Priority**: HIGH - Needs immediate investigation

---

### 3. Insurance Auto-Population Not Working
**Severity**: MEDIUM
**Impact**: Logged-in users must re-enter insurance every time

**Issue**:
- Patient Information page allows saving insurance details
- Insurance should auto-populate on search page when user is logged in
- Currently NOT implemented (marked as TODO in code)

**Expected**: Logged-in users see their saved insurance pre-selected
**Actual**: Insurance dropdowns always empty, even for logged-in users

**Fix Priority**: MEDIUM - Important UX improvement

---

## 🟡 HIGH PRIORITY - Should Fix Before Launch

### 4. No Authentication Flow Visible
**Severity**: MEDIUM
**Impact**: Users cannot sign up/login easily

**Issue**:
- Menu button exists but authentication flow not tested
- OAuth buttons (Google/Apple) implemented but not verified working
- No clear "Sign Up" CTA on homepage

**Expected**: Clear sign-up flow with working OAuth
**Actual**: Authentication exists but not prominent

**Fix Priority**: MEDIUM - Need to verify OAuth works

---

### 5. Safety Info Tab Not Tested
**Severity**: MEDIUM
**Impact**: Unknown if LLM formatting works correctly

**Issue**:
- Safety Info tab implemented with LLM formatting
- Not tested during this audit
- Could have errors or formatting issues

**Expected**: Safety info displays formatted medication warnings
**Actual**: Unknown - needs testing

**Fix Priority**: MEDIUM - Test before launch

---

### 6. Pharmacogenomics Integration Not Tested
**Severity**: MEDIUM
**Impact**: Key differentiator feature may have bugs

**Issue**:
- Genomics page exists with 5 mock profiles
- Integration with medication search not tested
- "Medications to Avoid" warnings may not display on results page

**Expected**: Results page shows genomic warnings when applicable
**Actual**: Unknown - needs testing

**Fix Priority**: MEDIUM - This is a key selling point

---

## 🟢 MEDIUM PRIORITY - Nice to Have

### 7. Load More Button Not Tested
**Severity**: LOW
**Impact**: May not work correctly

**Issue**:
- Results show "Load More (7 more pharmacies)" button
- Button functionality not tested
- May have pagination issues

**Expected**: Clicking loads remaining pharmacies
**Actual**: Unknown

**Fix Priority**: LOW - Test when time permits

---

### 8. Mobile Responsiveness Not Fully Tested
**Severity**: LOW
**Impact**: Mobile users may have poor experience

**Issue**:
- Desktop view looks good
- Mobile view not tested during this audit
- Previous fixes applied but need verification

**Expected**: All features work on mobile
**Actual**: Unknown - needs mobile testing

**Fix Priority**: LOW - Test on mobile devices

---

## 📊 Testing Summary

**Total Issues Found**: 8
- Critical: 2
- High: 4
- Medium: 2

**Estimated Fix Time**:
- Critical fixes: 2-4 hours
- High priority: 4-6 hours
- Medium priority: 2-3 hours

**Total**: 8-13 hours to address all issues

---

## 🎯 Recommended Fix Order

1. **ZIP Code Parameter** (30 min) - Fix URL parameter passing
2. **Pricing Accuracy** (2-3 hours) - Investigate and fix pricing calculations
3. **Test Authentication** (1 hour) - Verify OAuth works
4. **Test Safety Info** (30 min) - Verify LLM formatting
5. **Test Genomics Integration** (1 hour) - Verify warnings display
6. **Insurance Auto-Population** (2-3 hours) - Implement backend integration
7. **Mobile Testing** (1 hour) - Test on mobile devices
8. **Load More Button** (30 min) - Test pagination

---

## ✅ What's Working Well

- Medication search with autocomplete (excellent)
- Pharmacy name filtering (no person names, clean results)
- Map integration (12 pharmacies showing correctly)
- Insurance carrier/plan selection (two-tier system working)
- Legal pages (Terms, Privacy Policy present)
- Value proposition messaging (clear differentiation)
- Overall UI/UX (professional, clean design)
