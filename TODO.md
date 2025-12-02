# RxPriceFinder TODO

## Current Session: Fix Tabs + Implement Hybrid Medical APIs

### Phase 1: Fix Radix UI Tabs ⏳ IN PROGRESS
- [ ] Reinstall @radix-ui/react-tabs package
- [ ] Clear node_modules cache
- [ ] Test tabs on simple test page
- [ ] Verify tabs work in Results page

### Phase 2: OpenFDA Safety Information Tab
- [ ] Create OpenFDA API service
- [ ] Fetch black box warnings
- [ ] Fetch contraindications
- [ ] Fetch drug interactions
- [ ] Fetch side effects
- [ ] Fetch dosing information
- [ ] Update SafetyInfoTab component with real data

### Phase 3: Hybrid Alternatives Tab
- [ ] Keep RxClass API integration
- [ ] Add OpenAI API service (use user's API key)
- [ ] Generate AI explanations for each alternative
- [ ] Update AIAlternativesTab with hybrid approach
- [ ] Show: Alternative name + RxClass data + AI explanation

### Phase 4: Clean Up Main Results
- [ ] Remove "Consider These Alternatives" box from main results page
- [ ] Ensure tabs are the only way to see alternatives

### Phase 5: Testing & Checkpoint
- [ ] Test Safety tab with multiple medications
- [ ] Test Alternatives tab with AI explanations
- [ ] Verify no console errors
- [ ] Create checkpoint and push to GitHub

---

## Future Sessions (Master Plan)

### Session 2: Pricing + Insurance + Medications
- Upgrade to web-db-user template
- Fix medication pricing with Cost Plus API
- Implement two-tier insurance selection
- Build medication management & refill reminders

### Session 3: Polish + Testing + Launch
- Code cleanup and documentation
- Comprehensive testing
- Production deployment
