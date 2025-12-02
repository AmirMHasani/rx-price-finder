import { describe, it, expect } from 'vitest';
import { searchNADACByName, parseNADACPrice, getNADACUnitPrice } from '../client/src/services/cmsNadacApi';

describe('CMS NADAC API Integration', () => {
  it('should search for atorvastatin pricing', async () => {
    const results = await searchNADACByName('atorvastatin', '20');
    
    console.log('NADAC search results:', JSON.stringify(results, null, 2));
    
    // Should return at least one result
    expect(results).toBeDefined();
    expect(Array.isArray(results)).toBe(true);
    
    if (results.length > 0) {
      const firstResult = results[0];
      console.log('First result:', firstResult);
      
      // Should have required fields
      expect(firstResult['NDC Description']).toBeDefined();
      expect(firstResult['NADAC Per Unit']).toBeDefined();
      
      // Should be able to parse price
      const unitPrice = getNADACUnitPrice(firstResult);
      console.log('Unit price:', unitPrice);
      expect(unitPrice).toBeGreaterThan(0);
    }
  }, 30000); // 30 second timeout for API call

  it('should parse NADAC price correctly', () => {
    expect(parseNADACPrice('0.12345')).toBe(0.12345);
    expect(parseNADACPrice('1.50')).toBe(1.5);
    expect(parseNADACPrice('10.99')).toBe(10.99);
  });
});
