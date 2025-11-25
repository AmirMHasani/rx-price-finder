import { describe, it, expect, beforeEach, vi } from 'vitest';
import * as mockDb from '../mockDb';

describe('Mock Database', () => {
  beforeEach(() => {
    // Reset mock database before each test
    mockDb.resetMockDatabase();
  });

  describe('Authentication', () => {
    it('should sign up a new user', async () => {
      const user = await mockDb.signUp('test@example.com', 'password123', 'Test User');
      expect(user.email).toBe('test@example.com');
      expect(user.full_name).toBe('Test User');
      expect(user.id).toBeDefined();
    });

    it('should not allow duplicate emails', async () => {
      await mockDb.signUp('test@example.com', 'password123', 'Test User');
      await expect(mockDb.signUp('test@example.com', 'password456', 'Another User')).rejects.toThrow(
        'User already exists'
      );
    });

    it('should sign in with correct credentials', async () => {
      await mockDb.signUp('test@example.com', 'password123', 'Test User');
      const user = await mockDb.signIn('test@example.com', 'password123');
      expect(user.email).toBe('test@example.com');
    });

    it('should reject sign in with wrong password', async () => {
      await mockDb.signUp('test@example.com', 'password123', 'Test User');
      await expect(mockDb.signIn('test@example.com', 'wrongpassword')).rejects.toThrow(
        'Invalid email or password'
      );
    });

    it('should get current user', async () => {
      const signedUpUser = await mockDb.signUp('test@example.com', 'password123', 'Test User');
      const currentUser = mockDb.getCurrentUser();
      expect(currentUser?.id).toBe(signedUpUser.id);
    });

    it('should sign out', async () => {
      await mockDb.signUp('test@example.com', 'password123', 'Test User');
      await mockDb.signOut();
      expect(mockDb.getCurrentUser()).toBeNull();
    });

    it('should check if authenticated', async () => {
      expect(mockDb.isAuthenticated()).toBe(false);
      await mockDb.signUp('test@example.com', 'password123', 'Test User');
      expect(mockDb.isAuthenticated()).toBe(true);
    });
  });

  describe('User Insurance', () => {
    let userId: string;

    beforeEach(async () => {
      const user = await mockDb.signUp('test@example.com', 'password123', 'Test User');
      userId = user.id;
    });

    it('should add user insurance', async () => {
      const insurance = await mockDb.addUserInsurance(
        userId,
        'plan-1',
        'Blue Advantage HMO',
        'BCBS',
        1000,
        5000
      );
      expect(insurance.plan_name).toBe('Blue Advantage HMO');
      expect(insurance.deductible).toBe(1000);
    });

    it('should get user insurance', async () => {
      await mockDb.addUserInsurance(userId, 'plan-1', 'Blue Advantage HMO', 'BCBS', 1000, 5000);
      const insurance = await mockDb.getUserInsurance(userId);
      expect(insurance).toHaveLength(1);
      expect(insurance[0].plan_name).toBe('Blue Advantage HMO');
    });

    it('should delete user insurance', async () => {
      const insurance = await mockDb.addUserInsurance(
        userId,
        'plan-1',
        'Blue Advantage HMO',
        'BCBS',
        1000,
        5000
      );
      await mockDb.deleteUserInsurance(insurance.id);
      const remaining = await mockDb.getUserInsurance(userId);
      expect(remaining).toHaveLength(0);
    });
  });

  describe('User Searches', () => {
    let userId: string;

    beforeEach(async () => {
      const user = await mockDb.signUp('test@example.com', 'password123', 'Test User');
      userId = user.id;
    });

    it('should save user search', async () => {
      const search = await mockDb.saveUserSearch(
        userId,
        'Lipitor',
        '20mg',
        'Tablet',
        'plan-1',
        5
      );
      expect(search.medication_name).toBe('Lipitor');
      expect(search.results_count).toBe(5);
    });

    it('should get user search history', async () => {
      await mockDb.saveUserSearch(userId, 'Lipitor', '20mg', 'Tablet', 'plan-1', 5);
      await mockDb.saveUserSearch(userId, 'Metformin', '500mg', 'Tablet', 'plan-1', 8);
      const history = await mockDb.getUserSearchHistory(userId);
      expect(history).toHaveLength(2);
    });

    it('should sort search history by date descending', async () => {
      const search1 = await mockDb.saveUserSearch(
        userId,
        'Lipitor',
        '20mg',
        'Tablet',
        'plan-1',
        5
      );
      await new Promise(resolve => setTimeout(resolve, 10));
      const search2 = await mockDb.saveUserSearch(
        userId,
        'Metformin',
        '500mg',
        'Tablet',
        'plan-1',
        8
      );
      const history = await mockDb.getUserSearchHistory(userId);
      expect(history[0].id).toBe(search2.id);
      expect(history[1].id).toBe(search1.id);
    });
  });

  describe('Pharmacies', () => {
    it('should add pharmacy', async () => {
      const pharmacy = await mockDb.addPharmacy({
        name: 'CVS Pharmacy',
        address: '123 Main St',
        city: 'Boston',
        state: 'MA',
        zip_code: '02108',
        latitude: 42.3601,
        longitude: -71.0589,
        phone: '617-555-0101',
        hours_monday: '8AM-10PM',
        hours_tuesday: '8AM-10PM',
        hours_wednesday: '8AM-10PM',
        hours_thursday: '8AM-10PM',
        hours_friday: '8AM-10PM',
        hours_saturday: '9AM-9PM',
        hours_sunday: '9AM-9PM',
        website: 'https://cvs.com',
        google_place_id: 'place-1',
        has_delivery: true,
        has_drive_thru: true,
        has_mail_order: false,
        rating: 4.2,
        review_count: 145,
      });
      expect(pharmacy.name).toBe('CVS Pharmacy');
      expect(pharmacy.id).toBeDefined();
    });

    it('should get pharmacies', async () => {
      await mockDb.addPharmacy({
        name: 'CVS Pharmacy',
        address: '123 Main St',
        city: 'Boston',
        state: 'MA',
        zip_code: '02108',
        latitude: 42.3601,
        longitude: -71.0589,
        phone: '617-555-0101',
        hours_monday: '8AM-10PM',
        hours_tuesday: '8AM-10PM',
        hours_wednesday: '8AM-10PM',
        hours_thursday: '8AM-10PM',
        hours_friday: '8AM-10PM',
        hours_saturday: '9AM-9PM',
        hours_sunday: '9AM-9PM',
        website: 'https://cvs.com',
        google_place_id: 'place-1',
        has_delivery: true,
        has_drive_thru: true,
        has_mail_order: false,
        rating: 4.2,
        review_count: 145,
      });
      const pharmacies = await mockDb.getPharmacies();
      expect(pharmacies).toHaveLength(1);
    });

    it('should get pharmacy by google place id', async () => {
      const added = await mockDb.addPharmacy({
        name: 'CVS Pharmacy',
        address: '123 Main St',
        city: 'Boston',
        state: 'MA',
        zip_code: '02108',
        latitude: 42.3601,
        longitude: -71.0589,
        phone: '617-555-0101',
        hours_monday: '8AM-10PM',
        hours_tuesday: '8AM-10PM',
        hours_wednesday: '8AM-10PM',
        hours_thursday: '8AM-10PM',
        hours_friday: '8AM-10PM',
        hours_saturday: '9AM-9PM',
        hours_sunday: '9AM-9PM',
        website: 'https://cvs.com',
        google_place_id: 'place-1',
        has_delivery: true,
        has_drive_thru: true,
        has_mail_order: false,
        rating: 4.2,
        review_count: 145,
      });
      const pharmacy = await mockDb.getPharmacyByGooglePlaceId('place-1');
      expect(pharmacy?.id).toBe(added.id);
    });
  });

  describe('Price Cache', () => {
    it('should cache price data', async () => {
      await mockDb.cachePriceData('Lipitor', '20mg', 'Tablet', 'pharmacy-1', 25.99, 'goodrx');
      const price = await mockDb.getCachedPrice('Lipitor', '20mg', 'Tablet', 'pharmacy-1');
      expect(price).toBe(25.99);
    });

    it('should return null for non-existent cache', async () => {
      const price = await mockDb.getCachedPrice('NonExistent', '20mg', 'Tablet', 'pharmacy-1');
      expect(price).toBeNull();
    });
  });

  describe('User Favorites', () => {
    let userId: string;
    let pharmacyId: string;

    beforeEach(async () => {
      const user = await mockDb.signUp('test@example.com', 'password123', 'Test User');
      userId = user.id;
      const pharmacy = await mockDb.addPharmacy({
        name: 'CVS Pharmacy',
        address: '123 Main St',
        city: 'Boston',
        state: 'MA',
        zip_code: '02108',
        latitude: 42.3601,
        longitude: -71.0589,
        phone: '617-555-0101',
        hours_monday: '8AM-10PM',
        hours_tuesday: '8AM-10PM',
        hours_wednesday: '8AM-10PM',
        hours_thursday: '8AM-10PM',
        hours_friday: '8AM-10PM',
        hours_saturday: '9AM-9PM',
        hours_sunday: '9AM-9PM',
        website: 'https://cvs.com',
        google_place_id: 'place-1',
        has_delivery: true,
        has_drive_thru: true,
        has_mail_order: false,
        rating: 4.2,
        review_count: 145,
      });
      pharmacyId = pharmacy.id;
    });

    it('should add favorite pharmacy', async () => {
      const favorite = await mockDb.addFavoritePharmacy(userId, pharmacyId);
      expect(favorite.user_id).toBe(userId);
      expect(favorite.pharmacy_id).toBe(pharmacyId);
    });

    it('should remove favorite pharmacy', async () => {
      await mockDb.addFavoritePharmacy(userId, pharmacyId);
      await mockDb.removeFavoritePharmacy(userId, pharmacyId);
      const favorites = await mockDb.getUserFavoritePharmacies(userId);
      expect(favorites).toHaveLength(0);
    });

    it('should get user favorite pharmacies', async () => {
      await mockDb.addFavoritePharmacy(userId, pharmacyId);
      const favorites = await mockDb.getUserFavoritePharmacies(userId);
      expect(favorites).toHaveLength(1);
      expect(favorites[0].id).toBe(pharmacyId);
    });
  });

  describe('Insurance Plans', () => {
    it('should add insurance plan', async () => {
      const plan = await mockDb.addInsurancePlan({
        name: 'Blue Advantage HMO',
        carrier: 'BCBS',
        plan_type: 'HMO',
        tier1_copay: 15,
        tier2_copay: 35,
        tier3_copay: 70,
        tier4_copay: 150,
        average_deductible: 1000,
        average_oop_max: 5000,
      });
      expect(plan.name).toBe('Blue Advantage HMO');
    });

    it('should get insurance plans', async () => {
      await mockDb.addInsurancePlan({
        name: 'Blue Advantage HMO',
        carrier: 'BCBS',
        plan_type: 'HMO',
        tier1_copay: 15,
        tier2_copay: 35,
        tier3_copay: 70,
        tier4_copay: 150,
        average_deductible: 1000,
        average_oop_max: 5000,
      });
      const plans = await mockDb.getInsurancePlans();
      expect(plans.length).toBeGreaterThan(0);
    });
  });

  describe('Drug Tiers', () => {
    it('should add drug tier', async () => {
      const tier = await mockDb.addDrugTier({
        medication_name: 'Lipitor',
        generic_name: 'Atorvastatin',
        brand_name: 'Lipitor',
        is_generic: false,
        has_generic_alternative: true,
        drug_type: 'brand',
        estimated_tier: 2,
      });
      expect(tier.medication_name).toBe('Lipitor');
      expect(tier.estimated_tier).toBe(2);
    });

    it('should get drug tier', async () => {
      await mockDb.addDrugTier({
        medication_name: 'Lipitor',
        generic_name: 'Atorvastatin',
        brand_name: 'Lipitor',
        is_generic: false,
        has_generic_alternative: true,
        drug_type: 'brand',
        estimated_tier: 2,
      });
      const tier = await mockDb.getDrugTier('Lipitor');
      expect(tier?.estimated_tier).toBe(2);
    });
  });
});
