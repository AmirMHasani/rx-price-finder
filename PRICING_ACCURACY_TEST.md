# Pricing Accuracy Test - 10 Medications

## Test Set (Diverse Mix)

### Generic Medications (Cheap)
1. **Metformin 500mg** - Diabetes, very common generic
2. **Lisinopril 10mg** - Blood pressure, common generic
3. **Atorvastatin 20mg** - Cholesterol (generic Lipitor)
4. **Amlodipine 5mg** - Blood pressure, common generic

### Generic Medications (Mid-Range)
5. **Gabapentin 300mg** - Nerve pain, common generic
6. **Sertraline 50mg** - Antidepressant (generic Zoloft)

### Brand Medications (Expensive)
7. **Eliquis 5mg** - Blood thinner, expensive brand
8. **Ozempic 0.5mg** - Diabetes/weight loss, very expensive
9. **Humira 40mg** - Autoimmune, extremely expensive
10. **Symbicort 160mcg** - Asthma inhaler, expensive brand

## Test Parameters
- Quantity: 30-day supply (standard)
- ZIP Code: 02115 (Boston, MA)
- Insurance: Medicare Part D (most common)
- Pharmacies: CVS, Walgreens, Walmart

## Data Collection
For each medication, record:
- App price range (lowest to highest)
- Real-world price range from Google/GoodRx
- Percentage difference
- Notes on accuracy

---

## Test Results

### 1. Metformin 500mg (30 tablets)
**App Prices:** 
- RxPrice Member: $3.20
- Coupon (RxSaver): $5.57
- Medicare Part D Insurance: $4.00
- Cash Price: $9.28

**Real Prices (from GoodRx/SingleCare/Drugs.com):**
- Cash: $7-$40 (pharmacy dependent, avg $10-$20)
- With Coupon: $2-$26 (GoodRx shows $2-$5 typical)
- Medicare Part D: $0-$10 (Tier 1 generic, $4-$5 typical)

**Accuracy Analysis:**
✅ **Medicare Copay: ACCURATE** - App shows $4.00, real-world is $4-$5 typical
✅ **Coupon Price: ACCURATE** - App shows $5.57, real-world is $2-$26 (app is mid-range)
✅ **Cash Price: ACCURATE** - App shows $9.28, real-world is $7-$40 (app is low-mid range)
✅ **Member Price: ACCURATE** - App shows $3.20, comparable to best GoodRx prices ($2-$5)

**Overall: EXCELLENT ACCURACY** - All prices within realistic ranges 

### 2. Lisinopril 10mg (30 tablets)
**App Prices:** 
**Real Prices:** 
**Accuracy:** 

### 3. Atorvastatin 20mg (30 tablets)
**App Prices:** 
**Real Prices:** 
**Accuracy:** 

### 4. Amlodipine 5mg (30 tablets)
**App Prices:** 
**Real Prices:** 
**Accuracy:** 

### 5. Gabapentin 300mg (30 capsules)
**App Prices:** 
**Real Prices:** 
**Accuracy:** 

### 6. Sertraline 50mg (30 tablets)
**App Prices:** 
**Real Prices:** 
**Accuracy:** 

### 7. Eliquis 5mg (60 tablets)
**App Prices:** 
**Real Prices:** 
**Accuracy:** 

### 8. Ozempic 0.5mg (1 pen)
**App Prices:** 
**Real Prices:** 
**Accuracy:** 

### 9. Humira 40mg (2 syringes)
**App Prices:** 
**Real Prices:** 
**Accuracy:** 

### 10. Symbicort 160mcg (1 inhaler)
**App Prices:** 
**Real Prices:** 
**Accuracy:** 

---

## Summary Statistics
- Average accuracy: TBD
- Medications within 20% of real price: TBD
- Medications with >50% error: TBD
- Overall assessment: TBD
