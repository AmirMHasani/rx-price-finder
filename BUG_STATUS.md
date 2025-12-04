# Bug Status Report - December 3, 2025

## CRITICAL BUGS - STATUS UPDATE

### Bug #1: All Pharmacies Showing as "CVS Pharmacy"
**Status**: NOT A BUG - This is expected behavior

**Explanation**: 
- Google Places API is correctly returning pharmacy locations near ZIP 02108 (Boston)
- The area genuinely has 12 CVS locations and CVS dominates that market
- Pharmacy names are correctly extracted from Google Places
- Different CVS locations have different addresses:
  - 626 Southern Artery #3A, Quincy
  - 590 Fellsway, Medford
  - 36 White St, Cambridge
  - 715 Morrissey Blvd, Dorchester
  - etc.

**Real Issue**: Boston area has limited pharmacy chain diversity. Need to test with other ZIP codes to verify multi-chain support.

---

### Bug #2: All Prices Identical
**Status**: PARTIALLY FIXED ✅

**What's Working**:
- ✅ Cash prices now vary by location ($10.70 vs $10.42)
- ✅ RxSaver coupon prices now vary ($6.42 vs $6.25)
- ✅ Pricing variation based on pharmacy.placeId is working

**What's Still Identical**:
- ❌ RxPrice Member prices: $3.20 (all locations)
- ❌ Insurance copays: $4.00 (all locations)

**Root Cause**:
1. **Insurance copays** use formulary API which returns same copay for all pharmacies
2. Pharmacy-specific variation (±10%) is too small: $4.00 ± 10% = $3.60-$4.40, all round to $4.00
3. **RxPrice Member** is calculated as 80% of insurance copay, so identical insurance → identical membership

**Impact on Summary**:
- "Lowest Price" = "Highest Price" = "Average Price" = $3.20
- "Potential Savings" = $0.00
- This is misleading because cash prices DO vary ($10.42-$10.70)

---

### Bug #3: Insurance API Error
**Status**: LOGGED BUT NOT BREAKING ⚠️

**Error Message**:
```
[Insurance API] Error fetching copay for RXCUI 262095: Unexpected token '<', "<!doctype "... is not valid JSON
```

**Explanation**:
- Insurance API endpoint `/api/insurance/copay/{rxcui}` is returning HTML instead of JSON
- This suggests the API route doesn't exist or is returning an error page
- Error is caught and returns `null`, so pricing falls back to generic calculation
- Does NOT break the app, just means no real formulary data

---

## RECOMMENDATIONS

### High Priority
1. **Increase insurance copay variation** from ±10% to ±20% so rounding creates visible differences
2. **Fix insurance API** endpoint or remove the call if not implemented
3. **Test with diverse ZIP codes** (10001 Manhattan, 90210 Beverly Hills) to verify multi-chain support

### Medium Priority  
4. **Update summary calculation** to use cash prices or best overall price instead of just membership price
5. **Add pharmacy chain diversity** to search results (prioritize showing different chains)

### Low Priority
6. Consider using different membership discount rates by pharmacy (Costco 35% off, CVS 15% off)
