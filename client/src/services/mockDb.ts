/**
 * Mock Database Layer
 * This is a temporary in-memory database for development.
 * Replace with Supabase or your preferred backend when ready.
 * 
 * To integrate with Supabase:
 * 1. Install: npm install @supabase/supabase-js
 * 2. Replace all functions in this file with Supabase calls
 * 3. Update environment variables with SUPABASE_URL and SUPABASE_ANON_KEY
 */

import { v4 as uuidv4 } from 'uuid';

// Types
export interface User {
  id: string;
  email: string;
  password_hash: string;
  full_name: string;
  created_at: string;
}

export interface UserInsurance {
  id: string;
  user_id: string;
  plan_id: string;
  plan_name: string;
  carrier: string;
  deductible: number;
  oop_max: number;
  is_primary: boolean;
  created_at: string;
}

export interface UserSearch {
  id: string;
  user_id: string;
  medication_name: string;
  dosage: string;
  form: string;
  insurance_plan_id: string;
  results_count: number;
  created_at: string;
}

export interface Pharmacy {
  id: string;
  name: string;
  address: string;
  city: string;
  state: string;
  zip_code: string;
  latitude: number;
  longitude: number;
  phone: string;
  hours_monday: string;
  hours_tuesday: string;
  hours_wednesday: string;
  hours_thursday: string;
  hours_friday: string;
  hours_saturday: string;
  hours_sunday: string;
  website: string;
  google_place_id: string;
  has_delivery: boolean;
  has_drive_thru: boolean;
  has_mail_order: boolean;
  rating: number;
  review_count: number;
  created_at: string;
}

export interface PriceCache {
  id: string;
  medication_name: string;
  dosage: string;
  form: string;
  pharmacy_id: string;
  cash_price: number;
  source: string;
  created_at: string;
  expires_at: string;
}

export interface UserFavorite {
  id: string;
  user_id: string;
  pharmacy_id: string;
  created_at: string;
}

export interface InsurancePlan {
  id: string;
  name: string;
  carrier: string;
  plan_type: string;
  tier1_copay: number;
  tier2_copay: number;
  tier3_copay: number;
  tier4_copay: number;
  average_deductible: number;
  average_oop_max: number;
  created_at: string;
}

export interface DrugTier {
  id: string;
  medication_name: string;
  generic_name: string;
  brand_name: string;
  is_generic: boolean;
  has_generic_alternative: boolean;
  drug_type: string;
  estimated_tier: number;
  created_at: string;
}

// In-memory storage
const mockDatabase = {
  users: new Map<string, User>(),
  userInsurance: new Map<string, UserInsurance>(),
  userSearches: new Map<string, UserSearch>(),
  pharmacies: new Map<string, Pharmacy>(),
  priceCache: new Map<string, PriceCache>(),
  userFavorites: new Map<string, UserFavorite>(),
  insurancePlans: new Map<string, InsurancePlan>(),
  drugTiers: new Map<string, DrugTier>(),
};

// Current user session
let currentUser: User | null = null;

// Helper function to safely access localStorage
function getLocalStorage() {
  try {
    return typeof window !== 'undefined' ? window.localStorage : null;
  } catch {
    return null;
  }
}

// ============ Authentication ============

export async function signUp(email: string, password: string, fullName: string): Promise<User> {
  // Check if user already exists
  const existingUser = Array.from(mockDatabase.users.values()).find(u => u.email === email);
  if (existingUser) {
    throw new Error('User already exists');
  }

  // Create new user
  const user: User = {
    id: uuidv4(),
    email,
    password_hash: btoa(password), // Simple encoding (use bcrypt in production)
    full_name: fullName,
    created_at: new Date().toISOString(),
  };

  mockDatabase.users.set(user.id, user);
  currentUser = user;
  
  // Save to localStorage if available
  const localStorage = getLocalStorage();
  if (localStorage) {
    localStorage.setItem('mockDb_users', JSON.stringify(Array.from(mockDatabase.users.entries())));
    localStorage.setItem('currentUser', JSON.stringify(user));
  }

  return user;
}

export async function signIn(email: string, password: string): Promise<User> {
  const user = Array.from(mockDatabase.users.values()).find(u => u.email === email);
  
  if (!user || user.password_hash !== btoa(password)) {
    throw new Error('Invalid email or password');
  }

  currentUser = user;
  const localStorage = getLocalStorage();
  if (localStorage) {
    localStorage.setItem('currentUser', JSON.stringify(user));
  }

  return user;
}

export async function signOut(): Promise<void> {
  currentUser = null;
  const localStorage = getLocalStorage();
  if (localStorage) {
    localStorage.removeItem('currentUser');
  }
}

export function getCurrentUser(): User | null {
  if (currentUser) return currentUser;

  // Try to restore from localStorage
  const localStorage = getLocalStorage();
  if (localStorage) {
    const stored = localStorage.getItem('currentUser');
    if (stored) {
      currentUser = JSON.parse(stored);
      return currentUser;
    }
  }

  return null;
}

export function isAuthenticated(): boolean {
  return getCurrentUser() !== null;
}

// ============ User Insurance ============

export async function addUserInsurance(
  userId: string,
  planId: string,
  planName: string,
  carrier: string,
  deductible: number,
  oopMax: number
): Promise<UserInsurance> {
  const insurance: UserInsurance = {
    id: uuidv4(),
    user_id: userId,
    plan_id: planId,
    plan_name: planName,
    carrier,
    deductible,
    oop_max: oopMax,
    is_primary: true,
    created_at: new Date().toISOString(),
  };

  mockDatabase.userInsurance.set(insurance.id, insurance);
  const localStorage = getLocalStorage();
  if (localStorage) {
    localStorage.setItem('mockDb_userInsurance', JSON.stringify(Array.from(mockDatabase.userInsurance.entries())));
  }

  return insurance;
}

export async function getUserInsurance(userId: string): Promise<UserInsurance[]> {
  return Array.from(mockDatabase.userInsurance.values()).filter(i => i.user_id === userId);
}

export async function deleteUserInsurance(insuranceId: string): Promise<void> {
  mockDatabase.userInsurance.delete(insuranceId);
  const localStorage = getLocalStorage();
  if (localStorage) {
    localStorage.setItem('mockDb_userInsurance', JSON.stringify(Array.from(mockDatabase.userInsurance.entries())));
  }
}

// ============ User Searches ============

export async function saveUserSearch(
  userId: string,
  medicationName: string,
  dosage: string,
  form: string,
  insurancePlanId: string,
  resultsCount: number
): Promise<UserSearch> {
  const search: UserSearch = {
    id: uuidv4(),
    user_id: userId,
    medication_name: medicationName,
    dosage,
    form,
    insurance_plan_id: insurancePlanId,
    results_count: resultsCount,
    created_at: new Date().toISOString(),
  };

  mockDatabase.userSearches.set(search.id, search);
  const localStorage = getLocalStorage();
  if (localStorage) {
    localStorage.setItem('mockDb_userSearches', JSON.stringify(Array.from(mockDatabase.userSearches.entries())));
  }

  return search;
}

export async function getUserSearchHistory(userId: string): Promise<UserSearch[]> {
  return Array.from(mockDatabase.userSearches.values())
    .filter(s => s.user_id === userId)
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
}

// ============ Pharmacies ============

export async function addPharmacy(pharmacy: Omit<Pharmacy, 'id' | 'created_at'>): Promise<Pharmacy> {
  const newPharmacy: Pharmacy = {
    ...pharmacy,
    id: uuidv4(),
    created_at: new Date().toISOString(),
  };

  mockDatabase.pharmacies.set(newPharmacy.id, newPharmacy);
  const localStorage = getLocalStorage();
  if (localStorage) {
    localStorage.setItem('mockDb_pharmacies', JSON.stringify(Array.from(mockDatabase.pharmacies.entries())));
  }

  return newPharmacy;
}

export async function getPharmacies(): Promise<Pharmacy[]> {
  return Array.from(mockDatabase.pharmacies.values());
}

export async function getPharmacyByGooglePlaceId(placeId: string): Promise<Pharmacy | null> {
  return Array.from(mockDatabase.pharmacies.values()).find(p => p.google_place_id === placeId) || null;
}

// ============ Price Cache ============

export async function cachePriceData(
  medicationName: string,
  dosage: string,
  form: string,
  pharmacyId: string,
  cashPrice: number,
  source: string
): Promise<PriceCache> {
  const cache: PriceCache = {
    id: uuidv4(),
    medication_name: medicationName,
    dosage,
    form,
    pharmacy_id: pharmacyId,
    cash_price: cashPrice,
    source,
    created_at: new Date().toISOString(),
    expires_at: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
  };

  mockDatabase.priceCache.set(cache.id, cache);
  const localStorage = getLocalStorage();
  if (localStorage) {
    localStorage.setItem('mockDb_priceCache', JSON.stringify(Array.from(mockDatabase.priceCache.entries())));
  }

  return cache;
}

export async function getCachedPrice(
  medicationName: string,
  dosage: string,
  form: string,
  pharmacyId: string
): Promise<number | null> {
  const cached = Array.from(mockDatabase.priceCache.values()).find(
    c =>
      c.medication_name === medicationName &&
      c.dosage === dosage &&
      c.form === form &&
      c.pharmacy_id === pharmacyId &&
      new Date(c.expires_at) > new Date()
  );

  return cached?.cash_price || null;
}

// ============ User Favorites ============

export async function addFavoritePharmacy(userId: string, pharmacyId: string): Promise<UserFavorite> {
  const favorite: UserFavorite = {
    id: uuidv4(),
    user_id: userId,
    pharmacy_id: pharmacyId,
    created_at: new Date().toISOString(),
  };

  mockDatabase.userFavorites.set(favorite.id, favorite);
  const localStorage = getLocalStorage();
  if (localStorage) {
    localStorage.setItem('mockDb_userFavorites', JSON.stringify(Array.from(mockDatabase.userFavorites.entries())));
  }

  return favorite;
}

export async function removeFavoritePharmacy(userId: string, pharmacyId: string): Promise<void> {
  const favorite = Array.from(mockDatabase.userFavorites.values()).find(
    f => f.user_id === userId && f.pharmacy_id === pharmacyId
  );

  if (favorite) {
    mockDatabase.userFavorites.delete(favorite.id);
    const localStorage = getLocalStorage();
    if (localStorage) {
      localStorage.setItem('mockDb_userFavorites', JSON.stringify(Array.from(mockDatabase.userFavorites.entries())));
    }
  }
}

export async function getUserFavoritePharmacies(userId: string): Promise<Pharmacy[]> {
  const favorites = Array.from(mockDatabase.userFavorites.values()).filter(f => f.user_id === userId);
  return favorites
    .map(f => mockDatabase.pharmacies.get(f.pharmacy_id))
    .filter((p): p is Pharmacy => p !== undefined);
}

// ============ Insurance Plans ============

export async function addInsurancePlan(plan: Omit<InsurancePlan, 'id' | 'created_at'>): Promise<InsurancePlan> {
  const newPlan: InsurancePlan = {
    ...plan,
    id: uuidv4(),
    created_at: new Date().toISOString(),
  };

  mockDatabase.insurancePlans.set(newPlan.id, newPlan);
  const localStorage = getLocalStorage();
  if (localStorage) {
    localStorage.setItem('mockDb_insurancePlans', JSON.stringify(Array.from(mockDatabase.insurancePlans.entries())));
  }

  return newPlan;
}

export async function getInsurancePlans(): Promise<InsurancePlan[]> {
  return Array.from(mockDatabase.insurancePlans.values());
}

// ============ Drug Tiers ============

export async function addDrugTier(tier: Omit<DrugTier, 'id' | 'created_at'>): Promise<DrugTier> {
  const newTier: DrugTier = {
    ...tier,
    id: uuidv4(),
    created_at: new Date().toISOString(),
  };

  mockDatabase.drugTiers.set(newTier.id, newTier);
  const localStorage = getLocalStorage();
  if (localStorage) {
    localStorage.setItem('mockDb_drugTiers', JSON.stringify(Array.from(mockDatabase.drugTiers.entries())));
  }

  return newTier;
}

export async function getDrugTier(medicationName: string): Promise<DrugTier | null> {
  return Array.from(mockDatabase.drugTiers.values()).find(
    t => t.medication_name.toLowerCase() === medicationName.toLowerCase()
  ) || null;
}

// ============ Reset (for testing) ============

export function resetMockDatabase(): void {
  mockDatabase.users.clear();
  mockDatabase.userInsurance.clear();
  mockDatabase.userSearches.clear();
  mockDatabase.pharmacies.clear();
  mockDatabase.priceCache.clear();
  mockDatabase.userFavorites.clear();
  mockDatabase.insurancePlans.clear();
  mockDatabase.drugTiers.clear();
  currentUser = null;
}

// ============ Initialization ============

export function initializeMockDatabase(): void {
  // Load from localStorage if available
  const localStorage = getLocalStorage();
  if (!localStorage) {
    return; // No localStorage available, use in-memory only
  }

  const usersData = localStorage.getItem('mockDb_users');
  if (usersData) {
    const entries = JSON.parse(usersData);
    mockDatabase.users = new Map(entries);
  }

  const insuranceData = localStorage.getItem('mockDb_userInsurance');
  if (insuranceData) {
    const entries = JSON.parse(insuranceData);
    mockDatabase.userInsurance = new Map(entries);
  }

  const searchesData = localStorage.getItem('mockDb_userSearches');
  if (searchesData) {
    const entries = JSON.parse(searchesData);
    mockDatabase.userSearches = new Map(entries);
  }

  const pharmaciesData = localStorage.getItem('mockDb_pharmacies');
  if (pharmaciesData) {
    const entries = JSON.parse(pharmaciesData);
    mockDatabase.pharmacies = new Map(entries);
  }

  const priceCacheData = localStorage.getItem('mockDb_priceCache');
  if (priceCacheData) {
    const entries = JSON.parse(priceCacheData);
    mockDatabase.priceCache = new Map(entries);
  }

  const favoritesData = localStorage.getItem('mockDb_userFavorites');
  if (favoritesData) {
    const entries = JSON.parse(favoritesData);
    mockDatabase.userFavorites = new Map(entries);
  }

  const plansData = localStorage.getItem('mockDb_insurancePlans');
  if (plansData) {
    const entries = JSON.parse(plansData);
    mockDatabase.insurancePlans = new Map(entries);
  }

  const tiersData = localStorage.getItem('mockDb_drugTiers');
  if (tiersData) {
    const entries = JSON.parse(tiersData);
    mockDatabase.drugTiers = new Map(entries);
  }

  // Restore current user
  const currentUserData = localStorage.getItem('currentUser');
  if (currentUserData) {
    currentUser = JSON.parse(currentUserData);
  }
}
