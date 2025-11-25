import { describe, it, expect } from 'vitest';
import { getZipCodeCoordinates, estimateZipCodeLocation, getZipCodeLocation } from './zipCodeService';

describe('ZIP Code Service', () => {
  describe('getZipCodeCoordinates', () => {
    it('should return coordinates for known ZIP codes', () => {
      const result = getZipCodeCoordinates('02108');
      expect(result).not.toBeNull();
      expect(result?.city).toBe('Boston');
      expect(result?.state).toBe('MA');
      expect(result?.lat).toBeCloseTo(42.36, 1);
      expect(result?.lng).toBeCloseTo(-71.06, 1);
    });

    it('should return coordinates for New York ZIP', () => {
      const result = getZipCodeCoordinates('10001');
      expect(result).not.toBeNull();
      expect(result?.city).toBe('New York');
      expect(result?.state).toBe('NY');
    });

    it('should return coordinates for Los Angeles ZIP', () => {
      const result = getZipCodeCoordinates('90001');
      expect(result).not.toBeNull();
      expect(result?.city).toBe('Los Angeles');
      expect(result?.state).toBe('CA');
    });

    it('should return coordinates for Chicago ZIP', () => {
      const result = getZipCodeCoordinates('60601');
      expect(result).not.toBeNull();
      expect(result?.city).toBe('Chicago');
      expect(result?.state).toBe('IL');
    });

    it('should return null for unknown ZIP codes', () => {
      const result = getZipCodeCoordinates('99999');
      expect(result).toBeNull();
    });

    it('should handle ZIP codes with spaces or dashes', () => {
      const result = getZipCodeCoordinates('021-08');
      expect(result).not.toBeNull();
    });
  });

  describe('estimateZipCodeLocation', () => {
    it('should estimate location for New York area ZIPs', () => {
      const result = estimateZipCodeLocation('10500');
      expect(result).not.toBeNull();
      expect(result?.state).toBe('NY');
    });

    it('should estimate location for Chicago area ZIPs', () => {
      const result = estimateZipCodeLocation('60700');
      expect(result).not.toBeNull();
      expect(result?.state).toBe('IL');
    });

    it('should estimate location for Los Angeles area ZIPs', () => {
      const result = estimateZipCodeLocation('90500');
      expect(result).not.toBeNull();
      expect(result?.state).toBe('CA');
    });

    it('should return default location for invalid ZIP', () => {
      const result = estimateZipCodeLocation('invalid');
      expect(result).toBeNull();
    });
  });

  describe('getZipCodeLocation', () => {
    it('should return exact match when available', () => {
      const result = getZipCodeLocation('02108');
      expect(result.city).toBe('Boston');
      expect(result.state).toBe('MA');
    });

    it('should fall back to estimation for unknown ZIPs', () => {
      const result = getZipCodeLocation('60700');
      expect(result).not.toBeNull();
      expect(result.lat).toBeDefined();
      expect(result.lng).toBeDefined();
    });

    it('should always return a location (never null)', () => {
      const result = getZipCodeLocation('99999');
      expect(result).not.toBeNull();
      expect(result.lat).toBeDefined();
      expect(result.lng).toBeDefined();
    });
  });
});
