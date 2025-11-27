export interface SearchHistoryItem {
  id: string;
  medication: string;
  dosage: string;
  form: string;
  insurance: string;
  zip: string;
  timestamp: number;
  url: string;
}

const STORAGE_KEY = 'rxpricefinder_search_history';
const MAX_HISTORY_ITEMS = 5;

export function saveSearch(item: Omit<SearchHistoryItem, 'id' | 'timestamp'>): void {
  const history = getSearchHistory();
  const newItem: SearchHistoryItem = {
    ...item,
    id: Date.now().toString(),
    timestamp: Date.now(),
  };
  
  // Add to beginning of array
  history.unshift(newItem);
  
  // Keep only last MAX_HISTORY_ITEMS
  const trimmedHistory = history.slice(0, MAX_HISTORY_ITEMS);
  
  localStorage.setItem(STORAGE_KEY, JSON.stringify(trimmedHistory));
}

export function getSearchHistory(): SearchHistoryItem[] {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return [];
    return JSON.parse(stored);
  } catch (error) {
    console.error('Failed to load search history:', error);
    return [];
  }
}

export function clearSearchHistory(): void {
  localStorage.removeItem(STORAGE_KEY);
}

export function formatTimeAgo(timestamp: number): string {
  const now = Date.now();
  const diff = now - timestamp;
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);
  
  if (minutes < 1) return 'Just now';
  if (minutes < 60) return `${minutes}m ago`;
  if (hours < 24) return `${hours}h ago`;
  return `${days}d ago`;
}
