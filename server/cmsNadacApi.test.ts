import { describe, it, expect } from 'vitest';

// Simple test to verify CMS API key is configured
describe('CMS NADAC API Integration', () => {
  it('should have CMS API key configured', () => {
    const apiKey = process.env.CMS_API_KEY;
    
    console.log('CMS_API_KEY present:', !!apiKey);
    console.log('CMS_API_KEY length:', apiKey?.length || 0);
    
    expect(apiKey).toBeDefined();
    expect(apiKey).not.toBe('');
    expect(apiKey!.length).toBeGreaterThan(10);
  });

  it('should make test API call to CMS NADAC', async () => {
    const apiKey = process.env.CMS_API_KEY;
    
    const query = {
      conditions: [
        {
          property: 'ndc_description',
          value: '%ATORVASTATIN%',
          operator: 'LIKE'
        }
      ],
      sorts: [
        {
          property: 'effective_date',
          order: 'desc'
        }
      ],
      limit: 5
    };

    const response = await fetch(
      'https://data.medicaid.gov/api/1/datastore/query/f38d0706-1239-442c-a3cc-40ef1b686ac0/0',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-API-Key': apiKey!
        },
        body: JSON.stringify(query)
      }
    );

    console.log('API Response status:', response.status);
    
    const responseText = await response.text();
    console.log('API Response:', responseText.substring(0, 500));

    expect(response.ok).toBe(true);
    
    const data = JSON.parse(responseText);
    expect(data).toBeDefined();
    expect(data.results).toBeDefined();
    
    if (data.results && data.results.length > 0) {
      console.log('First result:', JSON.stringify(data.results[0], null, 2));
      expect(data.results[0].ndc_description).toContain('ATORVASTATIN');
      expect(data.results[0].nadac_per_unit).toBeDefined();
    }
  }, 30000); // 30 second timeout
});
