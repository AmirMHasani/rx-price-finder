# Enoxaparin Search Results Analysis

## Raw RxNorm API Data

### SBD (Semantic Branded Drug) - Brand Name Results
1. `0.3 ML enoxaparin sodium 100 MG/ML Prefilled Syringe [Lovenox]`
2. `0.4 ML enoxaparin sodium 100 MG/ML Prefilled Syringe [Lovenox]`
3. `0.6 ML enoxaparin sodium 100 MG/ML Prefilled Syringe [Lovenox]`
4. `0.8 ML enoxaparin sodium 100 MG/ML Prefilled Syringe [Lovenox]`
5. `0.8 ML enoxaparin sodium 150 MG/ML Prefilled Syringe [Lovenox]`
6. `1 ML enoxaparin sodium 100 MG/ML Prefilled Syringe [Lovenox]`
7. `1 ML enoxaparin sodium 150 MG/ML Prefilled Syringe [Lovenox]`
8. `enoxaparin sodium 100 MG/ML Injectable Solution [Lovenox]`

### SCD (Semantic Clinical Drug) - Generic Results
1. `0.3 ML enoxaparin sodium 100 MG/ML Prefilled Syringe`
2. `0.4 ML enoxaparin sodium 100 MG/ML Prefilled Syringe`
3. `0.6 ML enoxaparin sodium 100 MG/ML Prefilled Syringe`
4. `0.8 ML enoxaparin sodium 100 MG/ML Prefilled Syringe`
5. `0.8 ML enoxaparin sodium 150 MG/ML Prefilled Syringe`
6. `1 ML enoxaparin sodium 100 MG/ML Prefilled Syringe`
7. `1 ML enoxaparin sodium 150 MG/ML Prefilled Syringe`
8. `enoxaparin sodium 100 MG/ML Injectable Solution`

## Problems Identified

### 1. **Duplicates** (16 results → should be 8)
- Every SBD (brand) has a matching SCD (generic) with identical dosage
- Example: Both "Lovenox 0.3 ML 100 MG/ML" and "enoxaparin 0.3 ML 100 MG/ML" appear

### 2. **Confusing Naming**
- "0.3 ML enoxaparin sodium 100 MG/ML" is hard to understand
- Should be: "Enoxaparin 30 MG (0.3 mL prefilled syringe)"
- Calculation: 0.3 mL × 100 MG/ML = 30 MG total dose

### 3. **Too Much Technical Detail**
- "enoxaparin sodium" → should be just "enoxaparin"
- "100 MG/ML Injectable Solution" → should be "Injectable Solution"
- "/ML Prefilled Syringe" → should be "Prefilled Syringe"

### 4. **No Clear Dosage Display**
- Users care about total dose (30 MG, 40 MG, 60 MG, etc.)
- Not concentration (100 MG/ML) or volume (0.3 ML)

## Cleanup Strategy

### Filter Rules
1. **Remove duplicates**: If SBD exists, skip matching SCD
   - Keep: "Lovenox (enoxaparin 30 MG)"
   - Skip: "enoxaparin 30 MG"

2. **Calculate total dose** from volume × concentration
   - "0.3 ML × 100 MG/ML" → "30 MG"
   - "0.4 ML × 100 MG/ML" → "40 MG"
   - "0.6 ML × 100 MG/ML" → "60 MG"
   - "0.8 ML × 100 MG/ML" → "80 MG"
   - "1 ML × 100 MG/ML" → "100 MG"
   - "0.8 ML × 150 MG/ML" → "120 MG"
   - "1 ML × 150 MG/ML" → "150 MG"

3. **Simplify form labels**
   - "enoxaparin sodium 100 MG/ML Injectable Solution" → "Injectable Solution"
   - "/ML Prefilled Syringe" → "Prefilled Syringe"

4. **Clean display names**
   - "Lovenox (enoxaparin 30 MG)" instead of "0.3 ML enoxaparin sodium 100 MG/ML Prefilled Syringe [Lovenox]"

## Expected Clean Results (8 instead of 16)

1. **Lovenox (enoxaparin 30 MG)** - Prefilled Syringe
2. **Lovenox (enoxaparin 40 MG)** - Prefilled Syringe
3. **Lovenox (enoxaparin 60 MG)** - Prefilled Syringe
4. **Lovenox (enoxaparin 80 MG)** - Prefilled Syringe
5. **Lovenox (enoxaparin 100 MG)** - Prefilled Syringe
6. **Lovenox (enoxaparin 120 MG)** - Prefilled Syringe
7. **Lovenox (enoxaparin 150 MG)** - Prefilled Syringe
8. **Lovenox (enoxaparin 100 MG/ML)** - Injectable Solution

Much cleaner and easier to understand!
