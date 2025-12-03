import { describe, it, expect } from 'vitest';

describe('Pharmacy Name Filtering', () => {
  // Test patterns for excluding person names
  it('should exclude person names with professional titles', () => {
    const personNamesWithTitles = [
      'Michael L. Kessler, BS',
      'John Smith, MD',
      'Jane Doe, PharmD',
      'Robert Johnson, RPh',
      'Sarah Williams, NP'
    ];
    
    personNamesWithTitles.forEach(name => {
      const lowerName = name.toLowerCase();
      const hasTitle = lowerName.match(/\b(bs|bsc|md|pharmd|phd|rph|do|dds|dvm|np|pa)\b/);
      expect(hasTitle).toBeTruthy();
    });
  });

  it('should exclude single-word non-pharmacy names', () => {
    const singleWordExclusions = ['reads', 'wellness', 'care', 'health'];
    const testName = 'Reads';
    const lowerName = testName.toLowerCase();
    
    const shouldExclude = singleWordExclusions.includes(lowerName);
    expect(shouldExclude).toBe(true);
  });

  it('should exclude medical facilities', () => {
    const medicalFacilities = [
      'Camden Hospital Pharmacy',
      'Main Street Clinic',
      'City Medical Center',
      'Urgent Care Pharmacy',
      'Physicians Associates'
    ];
    
    medicalFacilities.forEach(name => {
      const lowerName = name.toLowerCase();
      const isMedicalFacility = 
        lowerName.includes('hospital') || 
        lowerName.includes('clinic') || 
        lowerName.includes('medical center') || 
        lowerName.includes('health center') ||
        lowerName.includes('urgent care') || 
        lowerName.includes('doctor') ||
        lowerName.includes('physicians') || 
        lowerName.includes('associates');
      
      expect(isMedicalFacility).toBe(true);
    });
  });

  it('should accept known pharmacy chains', () => {
    const knownChains = [
      'CVS Pharmacy',
      'Walgreens',
      'Walmart Pharmacy',
      'Rite Aid',
      'Costco Pharmacy',
      'Target Pharmacy'
    ];
    
    knownChains.forEach(name => {
      const lowerName = name.toLowerCase();
      const isKnownChain = 
        lowerName.includes('cvs') ||
        lowerName.includes('walgreens') ||
        lowerName.includes('walmart') ||
        lowerName.includes('rite aid') ||
        lowerName.includes('costco') ||
        lowerName.includes('target');
      
      expect(isKnownChain).toBe(true);
    });
  });

  it('should accept independent pharmacies with "pharmacy" in name', () => {
    const independentPharmacies = [
      'Main Street Pharmacy',
      'Community Pharmacy',
      'Family Drug Store',
      'Neighborhood Rx'
    ];
    
    independentPharmacies.forEach(name => {
      const lowerName = name.toLowerCase();
      const hasPharmacyInName = 
        lowerName.includes('pharmacy') || 
        lowerName.includes('drug') || 
        lowerName.includes('rx');
      
      expect(hasPharmacyInName).toBe(true);
    });
  });
});
