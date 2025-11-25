import { describe, it, expect } from 'vitest';
import { medications } from './medications';

describe('Medications Database', () => {
  it('should have 50 medications', () => {
    expect(medications).toHaveLength(50);
  });

  it('should have all required fields for each medication', () => {
    medications.forEach(med => {
      expect(med).toHaveProperty('id');
      expect(med).toHaveProperty('name');
      expect(med).toHaveProperty('genericName');
      expect(med).toHaveProperty('dosages');
      expect(med).toHaveProperty('forms');
      expect(med).toHaveProperty('commonUses');
      
      expect(med.id).toBeTruthy();
      expect(med.name).toBeTruthy();
      expect(med.genericName).toBeTruthy();
      expect(med.dosages.length).toBeGreaterThan(0);
      expect(med.forms.length).toBeGreaterThan(0);
      expect(med.commonUses).toBeTruthy();
    });
  });

  it('should have unique medication IDs', () => {
    const ids = medications.map(m => m.id);
    const uniqueIds = new Set(ids);
    expect(uniqueIds.size).toBe(medications.length);
  });

  it('should include common medications', () => {
    const names = medications.map(m => m.name.toLowerCase());
    const generics = medications.map(m => m.genericName.toLowerCase());
    
    // Check brand names
    expect(names).toContain('lipitor');
    expect(names).toContain('glucophage'); // Metformin brand name
    expect(names).toContain('prinivil'); // Lisinopril brand name
    
    // Check generic names
    expect(generics).toContain('atorvastatin');
    expect(generics).toContain('metformin');
    expect(generics).toContain('lisinopril');
    expect(generics).toContain('omeprazole');
    expect(generics).toContain('gabapentin');
  });

  it('should have medications from different therapeutic categories', () => {
    const uses = medications.map(m => m.commonUses.toLowerCase());
    const hasCardiovascular = uses.some(u => u.includes('blood pressure') || u.includes('cholesterol'));
    const hasDiabetes = uses.some(u => u.includes('diabetes'));
    const hasPain = uses.some(u => u.includes('pain'));
    const hasMentalHealth = uses.some(u => u.includes('depression') || u.includes('anxiety'));
    
    expect(hasCardiovascular).toBe(true);
    expect(hasDiabetes).toBe(true);
    expect(hasPain).toBe(true);
    expect(hasMentalHealth).toBe(true);
  });

  it('should support decimal dosages', () => {
    const eliquis = medications.find(m => m.name === 'Eliquis');
    expect(eliquis).toBeDefined();
    expect(eliquis?.dosages).toContain('2.5mg');
    
    const hctz = medications.find(m => m.name === 'Hydrochlorothiazide');
    expect(hctz).toBeDefined();
    expect(hctz?.dosages).toContain('12.5mg');
  });

  it('should have medications with various forms', () => {
    const forms = new Set(medications.flatMap(m => m.forms));
    expect(forms.has('Tablet')).toBe(true);
    expect(forms.has('Capsule')).toBe(true);
    expect(forms.has('Inhaler')).toBe(true);
  });
});
