import { describe, it, expect } from 'vitest';
import { INSURANCE_CARRIERS, getCarrierPlans, getCarrierByPlanId } from '../client/src/data/insuranceCarriers.js';
import { getPharmacyFeatures, getPharmacyHours } from '../client/src/data/pharmacyFeatures.js';
import type { InsurancePlanType } from '../client/src/data/insurancePlans.js';

describe('Phase 5 Enhancements', () => {
  describe('Two-Tier Insurance Selection', () => {
    it('should have all major insurance carriers', () => {
      expect(INSURANCE_CARRIERS.length).toBeGreaterThanOrEqual(8);
      
      const carrierNames = INSURANCE_CARRIERS.map(c => c.name);
      expect(carrierNames).toContain('Medicare');
      expect(carrierNames).toContain('Blue Cross Blue Shield');
      expect(carrierNames).toContain('UnitedHealthcare');
      expect(carrierNames).toContain('Aetna');
      expect(carrierNames).toContain('Cigna');
      expect(carrierNames).toContain('Humana');
      expect(carrierNames).toContain('Medicaid');
      expect(carrierNames).toContain('No Insurance');
    });

    it('should have plans for each carrier', () => {
      INSURANCE_CARRIERS.forEach(carrier => {
        expect(carrier.plans.length).toBeGreaterThan(0);
        carrier.plans.forEach(plan => {
          expect(plan.id).toBeTruthy();
          expect(plan.name).toBeTruthy();
        });
      });
    });

    it('should get carrier plans by carrier ID', () => {
      const bcbsPlans = getCarrierPlans('bcbs');
      expect(bcbsPlans).toContain('blue_cross_ppo');
      expect(bcbsPlans).toContain('blue_cross_hmo');
      expect(bcbsPlans.length).toBe(2);
    });

    it('should find carrier by plan ID', () => {
      const carrier = getCarrierByPlanId('blue_cross_ppo' as InsurancePlanType);
      expect(carrier).toBeTruthy();
      expect(carrier?.name).toBe('Blue Cross Blue Shield');
    });

    it('should return empty array for invalid carrier ID', () => {
      const plans = getCarrierPlans('invalid_carrier');
      expect(plans).toEqual([]);
    });
  });

  describe('Pharmacy Features Based on Chain', () => {
    it('should return features for CVS', () => {
      const features = getPharmacyFeatures('cvs');
      expect(features.hasDelivery).toBe(true);
      expect(features.deliveryNote).toContain('CVS');
      expect(typeof features.hasDriveThru).toBe('boolean');
      expect(typeof features.has24Hour).toBe('boolean');
    });

    it('should return features for Walgreens', () => {
      const features = getPharmacyFeatures('walgreens');
      expect(features.hasDelivery).toBe(true);
      expect(typeof features.hasDriveThru).toBe('boolean');
      expect(typeof features.has24Hour).toBe('boolean');
    });

    it('should return features for Walmart', () => {
      const features = getPharmacyFeatures('walmart');
      expect(features.hasDelivery).toBe(true);
      expect(features.deliveryNote).toContain('Walmart');
      expect(typeof features.hasDriveThru).toBe('boolean');
    });

    it('should return features for Costco', () => {
      const features = getPharmacyFeatures('costco');
      expect(features.has24Hour).toBe(false); // Costco not 24-hour
      expect(features.hasDriveThru).toBe(false); // Costco no drive-thru
      expect(features.hasDelivery).toBe(false); // Costco no delivery
    });

    it('should return features for independent pharmacies', () => {
      const features = getPharmacyFeatures('independent');
      expect(features.has24Hour).toBe(false);
      expect(typeof features.hasDriveThru).toBe('boolean');
      expect(typeof features.hasDelivery).toBe('boolean');
    });

    it('should be case-insensitive for chain names', () => {
      const cvs1 = getPharmacyFeatures('CVS');
      const cvs2 = getPharmacyFeatures('cvs');
      const cvs3 = getPharmacyFeatures('CVS Pharmacy');
      
      expect(cvs1.hasDelivery).toBe(cvs2.hasDelivery);
      expect(cvs2.hasDelivery).toBe(cvs3.hasDelivery);
    });
  });

  describe('Pharmacy Hours', () => {
    it('should return 24-hour text for 24-hour pharmacies', () => {
      const hours = getPharmacyHours(true);
      expect(hours).toContain('24');
      expect(hours.toLowerCase()).toContain('hour');
    });

    it('should return regular hours for non-24-hour pharmacies', () => {
      const hours = getPharmacyHours(false);
      expect(hours).not.toContain('24');
      expect(hours).toBeTruthy();
    });
  });

  describe('Integration Tests', () => {
    it('should map all insurance plans to carriers', () => {
      const allPlanIds: InsurancePlanType[] = [
        'medicare_part_d',
        'blue_cross_ppo',
        'blue_cross_hmo',
        'united_healthcare',
        'aetna',
        'cigna',
        'humana',
        'medicaid',
        'no_insurance',
      ];

      allPlanIds.forEach(planId => {
        const carrier = getCarrierByPlanId(planId);
        expect(carrier).toBeTruthy();
        expect(carrier?.plans.some(p => p.id === planId)).toBe(true);
      });
    });

    it('should have consistent pharmacy features across multiple calls', () => {
      // Features should be deterministic for the same chain
      // (even though some use randomness, the structure should be consistent)
      const features1 = getPharmacyFeatures('cvs');
      const features2 = getPharmacyFeatures('cvs');
      
      expect(features1.hasDelivery).toBe(features2.hasDelivery);
      expect(features1.deliveryNote).toBe(features2.deliveryNote);
    });
  });
});
