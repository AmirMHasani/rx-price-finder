import { describe, it, expect, beforeEach } from 'vitest';
import * as insuranceService from '../insuranceService';
import * as mockDb from '../mockDb';

describe('Insurance Service', () => {
  beforeEach(async () => {
    // Reset mock database before each test
    mockDb.resetMockDatabase();
  });

  describe('Insurance Plans', () => {
    it('should initialize insurance plans', async () => {
      await insuranceService.initializeInsurancePlans();
      const plans = await mockDb.getInsurancePlans();
      expect(plans.length).toBeGreaterThan(0);
    });

    it('should not duplicate plans on multiple initializations', async () => {
      await insuranceService.initializeInsurancePlans();
      const plans1 = await mockDb.getInsurancePlans();
      await insuranceService.initializeInsurancePlans();
      const plans2 = await mockDb.getInsurancePlans();
      expect(plans1.length).toBe(plans2.length);
    });

    it('should get insurance plans', async () => {
      const plans = await insuranceService.getInsurancePlans();
      expect(plans.length).toBeGreaterThan(0);
      expect(plans[0].name).toBeDefined();
      expect(plans[0].carrier).toBeDefined();
    });
  });

  describe('Drug Tiers', () => {
    it('should initialize drug tiers', async () => {
      await insuranceService.initializeDrugTiers();
      const tier = await mockDb.getDrugTier('Lipitor');
      expect(tier).toBeDefined();
    });

    it('should estimate drug tier for known medications', async () => {
      const tier = await insuranceService.estimateDrugTier('Lipitor');
      expect(tier).toBe(2); // Brand with generic
    });

    it('should estimate tier 1 for generics', async () => {
      const tier = await insuranceService.estimateDrugTier('Metformin');
      expect(tier).toBe(1);
    });

    it('should default to tier 2 for unknown medications', async () => {
      const tier = await insuranceService.estimateDrugTier('UnknownDrug');
      expect(tier).toBe(2);
    });
  });

  describe('Insurance Price Calculation', () => {
    let plan: mockDb.InsurancePlan;

    beforeEach(async () => {
      await insuranceService.initializeInsurancePlans();
      const plans = await mockDb.getInsurancePlans();
      plan = plans[0];
    });

    it('should calculate insurance price when deductible is met', () => {
      const result = insuranceService.calculateInsurancePrice(100, 1, plan, true);
      expect(result.copay).toBe(plan.tier1_copay);
      expect(result.beforeDeductible).toBe(plan.tier1_copay);
      expect(result.afterDeductible).toBe(plan.tier1_copay);
      expect(result.savings).toBeGreaterThanOrEqual(0);
    });

    it('should calculate insurance price when deductible is not met', () => {
      const result = insuranceService.calculateInsurancePrice(100, 1, plan, false);
      expect(result.copay).toBe(plan.tier1_copay);
      expect(result.beforeDeductible).toBe(100);
      expect(result.afterDeductible).toBe(plan.tier1_copay);
    });

    it('should use correct copay for each tier', () => {
      const tier1 = insuranceService.calculateInsurancePrice(100, 1, plan, true);
      const tier2 = insuranceService.calculateInsurancePrice(100, 2, plan, true);
      const tier3 = insuranceService.calculateInsurancePrice(100, 3, plan, true);
      const tier4 = insuranceService.calculateInsurancePrice(100, 4, plan, true);

      expect(tier1.copay).toBe(plan.tier1_copay);
      expect(tier2.copay).toBe(plan.tier2_copay);
      expect(tier3.copay).toBe(plan.tier3_copay);
      expect(tier4.copay).toBe(plan.tier4_copay);
    });

    it('should calculate savings correctly', () => {
      const cashPrice = 100;
      const result = insuranceService.calculateInsurancePrice(cashPrice, 1, plan, true);
      const expectedSavings = Math.max(0, cashPrice - result.copay);
      expect(result.savings).toBe(expectedSavings);
    });

    it('should handle zero savings', () => {
      const result = insuranceService.calculateInsurancePrice(10, 1, plan, true);
      expect(result.savings).toBeGreaterThanOrEqual(0);
    });
  });
});
