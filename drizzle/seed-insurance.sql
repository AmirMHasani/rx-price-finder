-- Seed Insurance Data for RxPriceFinder
-- Medicare Part D plans and common medication formulary data

-- Insert Insurers
INSERT INTO insurers (name, type, state, isActive, createdAt, updatedAt) VALUES
('UnitedHealthcare', 'Medicare Advantage', 'MA', TRUE, NOW(), NOW()),
('Humana', 'Medicare Part D', 'MA', TRUE, NOW(), NOW()),
('Aetna', 'Medicare Advantage', 'MA', TRUE, NOW(), NOW()),
('Blue Cross Blue Shield', 'Marketplace', 'MA', TRUE, NOW(), NOW()),
('Cigna', 'Medicare Part D', 'MA', TRUE, NOW(), NOW())
ON DUPLICATE KEY UPDATE updatedAt = NOW();

-- Insert Plans
INSERT INTO plans (insurerId, contractPbp, marketingName, lineOfBusiness, year, state, isActive, createdAt, updatedAt) VALUES
-- UnitedHealthcare plans
((SELECT id FROM insurers WHERE name = 'UnitedHealthcare' LIMIT 1), 'H1234-001', 'Medicare Advantage Basic (HMO)', 'MA', 2025, 'MA', TRUE, NOW(), NOW()),
-- Humana plans
((SELECT id FROM insurers WHERE name = 'Humana' LIMIT 1), 'S5678-002', 'Medicare Part D Standard', 'PDP', 2025, 'MA', TRUE, NOW(), NOW()),
-- Aetna plans
((SELECT id FROM insurers WHERE name = 'Aetna' LIMIT 1), 'H9999-003', 'Medicare Advantage Premium (PPO)', 'MA', 2025, 'MA', TRUE, NOW(), NOW()),
-- BCBS Marketplace plans
((SELECT id FROM insurers WHERE name = 'Blue Cross Blue Shield' LIMIT 1), '12345MA0010001', 'Blue Shield Silver PPO', 'INDIVIDUAL', 2025, 'MA', TRUE, NOW(), NOW()),
-- Cigna plans
((SELECT id FROM insurers WHERE name = 'Cigna' LIMIT 1), 'S1111-004', 'Cigna Medicare Rx Plan', 'PDP', 2025, 'MA', TRUE, NOW(), NOW())
ON DUPLICATE KEY UPDATE updatedAt = NOW();

-- Insert Drug Coverage for common medications
-- Atorvastatin (Lipitor) - Generic statin, RXCUI: 83367
INSERT INTO plan_drug_coverage (planId, rxcui, drugName, tier, tierName, copay, priorAuthRequired, isActive, createdAt, updatedAt) VALUES
((SELECT id FROM plans WHERE contractPbp = 'H1234-001' LIMIT 1), '83367', 'atorvastatin', 1, 'Preferred Generic', '5.00', FALSE, TRUE, NOW(), NOW()),
((SELECT id FROM plans WHERE contractPbp = 'S5678-002' LIMIT 1), '83367', 'atorvastatin', 1, 'Preferred Generic', '0.00', FALSE, TRUE, NOW(), NOW()),
((SELECT id FROM plans WHERE contractPbp = 'H9999-003' LIMIT 1), '83367', 'atorvastatin', 1, 'Preferred Generic', '10.00', FALSE, TRUE, NOW(), NOW()),
((SELECT id FROM plans WHERE contractPbp = '12345MA0010001' LIMIT 1), '83367', 'atorvastatin', 1, 'Generic', '15.00', FALSE, TRUE, NOW(), NOW()),
((SELECT id FROM plans WHERE contractPbp = 'S1111-004' LIMIT 1), '83367', 'atorvastatin', 1, 'Preferred Generic', '3.00', FALSE, TRUE, NOW(), NOW())
ON DUPLICATE KEY UPDATE updatedAt = NOW();

-- Metformin - Generic diabetes medication, RXCUI: 6809
INSERT INTO plan_drug_coverage (planId, rxcui, drugName, tier, tierName, copay, priorAuthRequired, isActive, createdAt, updatedAt) VALUES
((SELECT id FROM plans WHERE contractPbp = 'H1234-001' LIMIT 1), '6809', 'metformin', 1, 'Preferred Generic', '5.00', FALSE, TRUE, NOW(), NOW()),
((SELECT id FROM plans WHERE contractPbp = 'S5678-002' LIMIT 1), '6809', 'metformin', 1, 'Preferred Generic', '0.00', FALSE, TRUE, NOW(), NOW()),
((SELECT id FROM plans WHERE contractPbp = 'H9999-003' LIMIT 1), '6809', 'metformin', 1, 'Preferred Generic', '10.00', FALSE, TRUE, NOW(), NOW()),
((SELECT id FROM plans WHERE contractPbp = '12345MA0010001' LIMIT 1), '6809', 'metformin', 1, 'Generic', '10.00', FALSE, TRUE, NOW(), NOW()),
((SELECT id FROM plans WHERE contractPbp = 'S1111-004' LIMIT 1), '6809', 'metformin', 1, 'Preferred Generic', '3.00', FALSE, TRUE, NOW(), NOW())
ON DUPLICATE KEY UPDATE updatedAt = NOW();

-- Lisinopril - Generic blood pressure medication, RXCUI: 29046
INSERT INTO plan_drug_coverage (planId, rxcui, drugName, tier, tierName, copay, priorAuthRequired, isActive, createdAt, updatedAt) VALUES
((SELECT id FROM plans WHERE contractPbp = 'H1234-001' LIMIT 1), '29046', 'lisinopril', 1, 'Preferred Generic', '5.00', FALSE, TRUE, NOW(), NOW()),
((SELECT id FROM plans WHERE contractPbp = 'S5678-002' LIMIT 1), '29046', 'lisinopril', 1, 'Preferred Generic', '0.00', FALSE, TRUE, NOW(), NOW()),
((SELECT id FROM plans WHERE contractPbp = 'H9999-003' LIMIT 1), '29046', 'lisinopril', 1, 'Preferred Generic', '10.00', FALSE, TRUE, NOW(), NOW()),
((SELECT id FROM plans WHERE contractPbp = '12345MA0010001' LIMIT 1), '29046', 'lisinopril', 1, 'Generic', '10.00', FALSE, TRUE, NOW(), NOW()),
((SELECT id FROM plans WHERE contractPbp = 'S1111-004' LIMIT 1), '29046', 'lisinopril', 1, 'Preferred Generic', '3.00', FALSE, TRUE, NOW(), NOW())
ON DUPLICATE KEY UPDATE updatedAt = NOW();

-- Omeprazole - Generic acid reflux medication, RXCUI: 7646
INSERT INTO plan_drug_coverage (planId, rxcui, drugName, tier, tierName, copay, priorAuthRequired, isActive, createdAt, updatedAt) VALUES
((SELECT id FROM plans WHERE contractPbp = 'H1234-001' LIMIT 1), '7646', 'omeprazole', 1, 'Preferred Generic', '5.00', FALSE, TRUE, NOW(), NOW()),
((SELECT id FROM plans WHERE contractPbp = 'S5678-002' LIMIT 1), '7646', 'omeprazole', 1, 'Preferred Generic', '0.00', FALSE, TRUE, NOW(), NOW()),
((SELECT id FROM plans WHERE contractPbp = 'H9999-003' LIMIT 1), '7646', 'omeprazole', 1, 'Preferred Generic', '10.00', FALSE, TRUE, NOW(), NOW()),
((SELECT id FROM plans WHERE contractPbp = '12345MA0010001' LIMIT 1), '7646', 'omeprazole', 1, 'Generic', '15.00', FALSE, TRUE, NOW(), NOW()),
((SELECT id FROM plans WHERE contractPbp = 'S1111-004' LIMIT 1), '7646', 'omeprazole', 1, 'Preferred Generic', '3.00', FALSE, TRUE, NOW(), NOW())
ON DUPLICATE KEY UPDATE updatedAt = NOW();

-- Amlodipine - Generic blood pressure medication, RXCUI: 17767
INSERT INTO plan_drug_coverage (planId, rxcui, drugName, tier, tierName, copay, priorAuthRequired, isActive, createdAt, updatedAt) VALUES
((SELECT id FROM plans WHERE contractPbp = 'H1234-001' LIMIT 1), '17767', 'amlodipine', 1, 'Preferred Generic', '5.00', FALSE, TRUE, NOW(), NOW()),
((SELECT id FROM plans WHERE contractPbp = 'S5678-002' LIMIT 1), '17767', 'amlodipine', 1, 'Preferred Generic', '0.00', FALSE, TRUE, NOW(), NOW()),
((SELECT id FROM plans WHERE contractPbp = 'H9999-003' LIMIT 1), '17767', 'amlodipine', 1, 'Preferred Generic', '10.00', FALSE, TRUE, NOW(), NOW()),
((SELECT id FROM plans WHERE contractPbp = '12345MA0010001' LIMIT 1), '17767', 'amlodipine', 1, 'Generic', '10.00', FALSE, TRUE, NOW(), NOW()),
((SELECT id FROM plans WHERE contractPbp = 'S1111-004' LIMIT 1), '17767', 'amlodipine', 1, 'Preferred Generic', '3.00', FALSE, TRUE, NOW(), NOW())
ON DUPLICATE KEY UPDATE updatedAt = NOW();

-- Levothyroxine - Generic thyroid medication, RXCUI: 10582
INSERT INTO plan_drug_coverage (planId, rxcui, drugName, tier, tierName, copay, priorAuthRequired, isActive, createdAt, updatedAt) VALUES
((SELECT id FROM plans WHERE contractPbp = 'H1234-001' LIMIT 1), '10582', 'levothyroxine', 1, 'Preferred Generic', '5.00', FALSE, TRUE, NOW(), NOW()),
((SELECT id FROM plans WHERE contractPbp = 'S5678-002' LIMIT 1), '10582', 'levothyroxine', 1, 'Preferred Generic', '0.00', FALSE, TRUE, NOW(), NOW()),
((SELECT id FROM plans WHERE contractPbp = 'H9999-003' LIMIT 1), '10582', 'levothyroxine', 1, 'Preferred Generic', '10.00', FALSE, TRUE, NOW(), NOW()),
((SELECT id FROM plans WHERE contractPbp = '12345MA0010001' LIMIT 1), '10582', 'levothyroxine', 1, 'Generic', '10.00', FALSE, TRUE, NOW(), NOW()),
((SELECT id FROM plans WHERE contractPbp = 'S1111-004' LIMIT 1), '10582', 'levothyroxine', 1, 'Preferred Generic', '3.00', FALSE, TRUE, NOW(), NOW())
ON DUPLICATE KEY UPDATE updatedAt = NOW();

-- Simvastatin - Generic statin, RXCUI: 36567
INSERT INTO plan_drug_coverage (planId, rxcui, drugName, tier, tierName, copay, priorAuthRequired, isActive, createdAt, updatedAt) VALUES
((SELECT id FROM plans WHERE contractPbp = 'H1234-001' LIMIT 1), '36567', 'simvastatin', 1, 'Preferred Generic', '5.00', FALSE, TRUE, NOW(), NOW()),
((SELECT id FROM plans WHERE contractPbp = 'S5678-002' LIMIT 1), '36567', 'simvastatin', 1, 'Preferred Generic', '0.00', FALSE, TRUE, NOW(), NOW()),
((SELECT id FROM plans WHERE contractPbp = 'H9999-003' LIMIT 1), '36567', 'simvastatin', 1, 'Preferred Generic', '10.00', FALSE, TRUE, NOW(), NOW()),
((SELECT id FROM plans WHERE contractPbp = '12345MA0010001' LIMIT 1), '36567', 'simvastatin', 1, 'Generic', '15.00', FALSE, TRUE, NOW(), NOW()),
((SELECT id FROM plans WHERE contractPbp = 'S1111-004' LIMIT 1), '36567', 'simvastatin', 1, 'Preferred Generic', '3.00', FALSE, TRUE, NOW(), NOW())
ON DUPLICATE KEY UPDATE updatedAt = NOW();

-- Losartan - Generic blood pressure medication, RXCUI: 52175
INSERT INTO plan_drug_coverage (planId, rxcui, drugName, tier, tierName, copay, priorAuthRequired, isActive, createdAt, updatedAt) VALUES
((SELECT id FROM plans WHERE contractPbp = 'H1234-001' LIMIT 1), '52175', 'losartan', 1, 'Preferred Generic', '5.00', FALSE, TRUE, NOW(), NOW()),
((SELECT id FROM plans WHERE contractPbp = 'S5678-002' LIMIT 1), '52175', 'losartan', 1, 'Preferred Generic', '0.00', FALSE, TRUE, NOW(), NOW()),
((SELECT id FROM plans WHERE contractPbp = 'H9999-003' LIMIT 1), '52175', 'losartan', 1, 'Preferred Generic', '10.00', FALSE, TRUE, NOW(), NOW()),
((SELECT id FROM plans WHERE contractPbp = '12345MA0010001' LIMIT 1), '52175', 'losartan', 1, 'Generic', '10.00', FALSE, TRUE, NOW(), NOW()),
((SELECT id FROM plans WHERE contractPbp = 'S1111-004' LIMIT 1), '52175', 'losartan', 1, 'Preferred Generic', '3.00', FALSE, TRUE, NOW(), NOW())
ON DUPLICATE KEY UPDATE updatedAt = NOW();

-- Gabapentin - Generic nerve pain medication, RXCUI: 25480
INSERT INTO plan_drug_coverage (planId, rxcui, drugName, tier, tierName, copay, priorAuthRequired, isActive, createdAt, updatedAt) VALUES
((SELECT id FROM plans WHERE contractPbp = 'H1234-001' LIMIT 1), '25480', 'gabapentin', 2, 'Generic', '15.00', FALSE, TRUE, NOW(), NOW()),
((SELECT id FROM plans WHERE contractPbp = 'S5678-002' LIMIT 1), '25480', 'gabapentin', 2, 'Generic', '10.00', FALSE, TRUE, NOW(), NOW()),
((SELECT id FROM plans WHERE contractPbp = 'H9999-003' LIMIT 1), '25480', 'gabapentin', 2, 'Generic', '20.00', FALSE, TRUE, NOW(), NOW()),
((SELECT id FROM plans WHERE contractPbp = '12345MA0010001' LIMIT 1), '25480', 'gabapentin', 2, 'Generic', '25.00', FALSE, TRUE, NOW(), NOW()),
((SELECT id FROM plans WHERE contractPbp = 'S1111-004' LIMIT 1), '25480', 'gabapentin', 2, 'Generic', '12.00', FALSE, TRUE, NOW(), NOW())
ON DUPLICATE KEY UPDATE updatedAt = NOW();

-- Sertraline - Generic antidepressant, RXCUI: 36437
INSERT INTO plan_drug_coverage (planId, rxcui, drugName, tier, tierName, copay, priorAuthRequired, isActive, createdAt, updatedAt) VALUES
((SELECT id FROM plans WHERE contractPbp = 'H1234-001' LIMIT 1), '36437', 'sertraline', 1, 'Preferred Generic', '5.00', FALSE, TRUE, NOW(), NOW()),
((SELECT id FROM plans WHERE contractPbp = 'S5678-002' LIMIT 1), '36437', 'sertraline', 1, 'Preferred Generic', '0.00', FALSE, TRUE, NOW(), NOW()),
((SELECT id FROM plans WHERE contractPbp = 'H9999-003' LIMIT 1), '36437', 'sertraline', 1, 'Preferred Generic', '10.00', FALSE, TRUE, NOW(), NOW()),
((SELECT id FROM plans WHERE contractPbp = '12345MA0010001' LIMIT 1), '36437', 'sertraline', 1, 'Generic', '15.00', FALSE, TRUE, NOW(), NOW()),
((SELECT id FROM plans WHERE contractPbp = 'S1111-004' LIMIT 1), '36437', 'sertraline', 1, 'Preferred Generic', '3.00', FALSE, TRUE, NOW(), NOW())
ON DUPLICATE KEY UPDATE updatedAt = NOW();
