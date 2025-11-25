import { describe, it, expect } from 'vitest';
import { generatePharmaciesForZip, getPharmacyChain } from './pharmacyGenerator';

describe('Pharmacy Generator', () => {
  describe('generatePharmaciesForZip', () => {
    it('should generate 8 pharmacies by default', () => {
      const pharmacies = generatePharmaciesForZip('02108');
      expect(pharmacies).toHaveLength(8);
    });

    it('should generate correct number of pharmacies when specified', () => {
      const pharmacies = generatePharmaciesForZip('10001', 5);
      expect(pharmacies).toHaveLength(5);
    });

    it('should generate pharmacies with all required fields', () => {
      const pharmacies = generatePharmaciesForZip('90001');
      pharmacies.forEach(pharmacy => {
        expect(pharmacy).toHaveProperty('id');
        expect(pharmacy).toHaveProperty('name');
        expect(pharmacy).toHaveProperty('chain');
        expect(pharmacy).toHaveProperty('address');
        expect(pharmacy).toHaveProperty('city');
        expect(pharmacy).toHaveProperty('state');
        expect(pharmacy).toHaveProperty('zip');
        expect(pharmacy).toHaveProperty('phone');
        expect(pharmacy).toHaveProperty('lat');
        expect(pharmacy).toHaveProperty('lng');
        expect(pharmacy).toHaveProperty('hours');
        expect(pharmacy).toHaveProperty('hasDelivery');
        expect(pharmacy).toHaveProperty('hasDriveThru');
      });
    });

    it('should use correct ZIP code for all pharmacies', () => {
      const zipCode = '60601';
      const pharmacies = generatePharmaciesForZip(zipCode);
      pharmacies.forEach(pharmacy => {
        expect(pharmacy.zip).toBe(zipCode);
      });
    });

    it('should generate pharmacies with different chains', () => {
      const pharmacies = generatePharmaciesForZip('02108', 8);
      const chains = new Set(pharmacies.map(p => p.chain));
      expect(chains.size).toBeGreaterThan(1);
    });

    it('should generate pharmacies near the ZIP code location', () => {
      const pharmacies = generatePharmaciesForZip('02108'); // Boston
      // Boston is around 42.36, -71.06
      pharmacies.forEach(pharmacy => {
        expect(pharmacy.lat).toBeGreaterThan(42.0);
        expect(pharmacy.lat).toBeLessThan(43.0);
        expect(pharmacy.lng).toBeGreaterThan(-72.0);
        expect(pharmacy.lng).toBeLessThan(-70.0);
      });
    });

    it('should work with different US ZIP codes', () => {
      const zipCodes = ['10001', '90001', '60601', '33101', '77001'];
      zipCodes.forEach(zip => {
        const pharmacies = generatePharmaciesForZip(zip);
        expect(pharmacies).toHaveLength(8);
        expect(pharmacies[0].zip).toBe(zip);
      });
    });
  });

  describe('getPharmacyChain', () => {
    it('should return the chain name from pharmacy object', () => {
      const pharmacy = {
        id: 'test-1',
        name: 'CVS Pharmacy #1234',
        chain: 'CVS',
        address: '123 Main St',
        city: 'Boston',
        state: 'MA',
        zip: '02108',
        phone: '(617) 555-0100',
        lat: 42.36,
        lng: -71.06,
        hours: '9AM-9PM',
        hasDelivery: true,
        hasDriveThru: false,
      };
      expect(getPharmacyChain(pharmacy)).toBe('CVS');
    });
  });
});
