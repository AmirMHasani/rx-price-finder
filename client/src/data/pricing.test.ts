import { describe, it, expect } from 'vitest';
import { calculateInsurancePrice, getAllPricesForMedication } from './pricing';

describe('Pricing Calculations', () => {
  describe('calculateInsurancePrice', () => {
    it('should calculate correct price with deductible met', () => {
      const result = calculateInsurancePrice(
        'med-1', // Atorvastatin - Tier 2
        '10mg',
        'Tablet',
        'pharm-1', // CVS
        'ins-1', // Blue Cross Blue Shield - Tier 2 copay is $30
        true // deductible met
      );

      expect(result).not.toBeNull();
      expect(result?.copay).toBe(30);
      expect(result?.totalCost).toBe(30);
      expect(result?.deductibleApplied).toBe(0);
    });

    it('should calculate correct price with deductible not met', () => {
      const result = calculateInsurancePrice(
        'med-1', // Atorvastatin - Tier 2
        '10mg',
        'Tablet',
        'pharm-1', // CVS
        'ins-1', // Blue Cross Blue Shield
        false // deductible not met
      );

      expect(result).not.toBeNull();
      expect(result?.totalCost).toBeGreaterThan(result!.copay);
      expect(result?.totalCost).toBeLessThanOrEqual(result!.cashPrice);
    });

    it('should calculate savings correctly', () => {
      const result = calculateInsurancePrice(
        'med-1',
        '10mg',
        'Tablet',
        'pharm-1',
        'ins-1',
        true
      );

      expect(result).not.toBeNull();
      expect(result?.savings).toBe(result!.cashPrice - result!.totalCost);
      expect(result?.savings).toBeGreaterThan(0);
    });

    it('should return null for invalid medication', () => {
      const result = calculateInsurancePrice(
        'invalid-med',
        '10mg',
        'Tablet',
        'pharm-1',
        'ins-1',
        true
      );

      expect(result).toBeNull();
    });

    it('should return null for invalid pharmacy', () => {
      const result = calculateInsurancePrice(
        'med-1',
        '10mg',
        'Tablet',
        'invalid-pharm',
        'ins-1',
        true
      );

      expect(result).toBeNull();
    });
  });

  describe('getAllPricesForMedication', () => {
    it('should return prices for all pharmacies', () => {
      const results = getAllPricesForMedication(
        'med-1',
        '10mg',
        'Tablet',
        'ins-1',
        true
      );

      expect(results.length).toBeGreaterThan(0);
      expect(results.every(r => r.medication.id === 'med-1')).toBe(true);
      expect(results.every(r => r.dosage === '10mg')).toBe(true);
      expect(results.every(r => r.form === 'Tablet')).toBe(true);
    });

    it('should sort results by total cost (cheapest first)', () => {
      const results = getAllPricesForMedication(
        'med-1',
        '10mg',
        'Tablet',
        'ins-1',
        true
      );

      for (let i = 0; i < results.length - 1; i++) {
        expect(results[i].totalCost).toBeLessThanOrEqual(results[i + 1].totalCost);
      }
    });

    it('should calculate distances when user location provided', () => {
      const results = getAllPricesForMedication(
        'med-1',
        '10mg',
        'Tablet',
        'ins-1',
        true,
        42.3601, // Boston coordinates
        -71.0589
      );

      expect(results.every(r => r.distance !== undefined)).toBe(true);
      expect(results.every(r => r.distance! >= 0)).toBe(true);
    });

    it('should not calculate distances when user location not provided', () => {
      const results = getAllPricesForMedication(
        'med-1',
        '10mg',
        'Tablet',
        'ins-1',
        true
      );

      expect(results.every(r => r.distance === undefined)).toBe(true);
    });

    it('should handle different insurance tiers correctly', () => {
      // Tier 1 medication (Metformin)
      const tier1Results = getAllPricesForMedication(
        'med-4',
        '500mg',
        'Tablet',
        'ins-1',
        true
      );

      // Tier 4 medication (Lyrica)
      const tier4Results = getAllPricesForMedication(
        'med-10',
        '25mg',
        'Capsule',
        'ins-1',
        true
      );

      // Tier 4 should have higher copay than Tier 1
      expect(tier4Results[0].copay).toBeGreaterThan(tier1Results[0].copay);
    });
  });
});
