import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Clock, 
  Trash2, 
  Star, 
  Search, 
  Shield,
  MapPin,
  ArrowRight,
  ArrowLeft,
  X
} from "lucide-react";
import { getSearchHistory, clearSearchHistory, type SearchHistoryItem } from "@/services/searchHistory";
import { insurancePlans } from "@/data/insurance";
import { LanguageToggle } from "@/components/LanguageToggle";
import { useLanguage } from "@/contexts/LanguageContext";
import { APP_TITLE } from "@/const";

export default function History() {
  const { t } = useLanguage();
  const [, setLocation] = useLocation();
  const [searchHistory, setSearchHistory] = useState<SearchHistoryItem[]>([]);
  const [favorites, setFavorites] = useState<Set<number>>(new Set());
  const [filterType, setFilterType] = useState<'all' | 'recent' | 'favorites'>('all');
  const [searchFilter, setSearchFilter] = useState('');

  // Load search history and favorites from localStorage
  useEffect(() => {
    const history = getSearchHistory();
    setSearchHistory(history);
    
    // Load favorites from localStorage
    const savedFavorites = localStorage.getItem('rx-price-favorites');
    if (savedFavorites) {
      setFavorites(new Set(JSON.parse(savedFavorites)));
    }
  }, []);

  // Save favorites to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('rx-price-favorites', JSON.stringify(Array.from(favorites)));
  }, [favorites]);

  const toggleFavorite = (index: number) => {
    const newFavorites = new Set(favorites);
    if (newFavorites.has(index)) {
      newFavorites.delete(index);
    } else {
      newFavorites.add(index);
    }
    setFavorites(newFavorites);
  };

  const deleteSearch = (index: number) => {
    const history = getSearchHistory();
    history.splice(index, 1);
    localStorage.setItem('rx-price-search-history', JSON.stringify(history));
    setSearchHistory(history);
    
    // Remove from favorites if it was favorited
    const newFavorites = new Set(favorites);
    newFavorites.delete(index);
    setFavorites(newFavorites);
  };

  const handleClearAll = () => {
    if (confirm('Are you sure you want to clear all search history?')) {
      clearSearchHistory();
      setSearchHistory([]);
      setFavorites(new Set());
    }
  };

  // Filter searches based on active filter and search term
  const filteredSearches = searchHistory.filter((search, index) => {
    // Apply type filter
    if (filterType === 'favorites' && !favorites.has(index)) return false;
    if (filterType === 'recent') {
      const dayAgo = Date.now() - 24 * 60 * 60 * 1000;
      if (search.timestamp < dayAgo) return false;
    }
    
    // Apply search filter
    if (searchFilter) {
      const term = searchFilter.toLowerCase();
      return (
        search.medication.toLowerCase().includes(term) ||
        search.dosage.toLowerCase().includes(term) ||
        search.insurance.toLowerCase().includes(term) ||
        search.zip.includes(term)
      );
    }
    
    return true;
  });

  const formatTimestamp = (timestamp: number) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  const getInsuranceName = (insuranceId: string) => {
    const plan = insurancePlans.find(p => p.id === insuranceId);
    return plan ? plan.name : insuranceId;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 via-indigo-50 to-purple-50">
      {/* Header */}
      <header className="bg-white border-b border-border shadow-sm sticky top-0 z-10">
        <div className="container py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                onClick={() => setLocation("/")}
                className="gap-2"
              >
                <ArrowLeft className="w-4 h-4" />
                Back to Search
              </Button>
              <h1 className="text-2xl font-bold text-foreground">{APP_TITLE}</h1>
            </div>
            <LanguageToggle />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container py-8">
        <div className="max-w-5xl mx-auto space-y-6">
          {/* Page Header */}
          <div>
            <h2 className="text-3xl font-bold text-foreground mb-2">{t('history.title')}</h2>
            <p className="text-muted-foreground">
              {t('history.subtitle')}
            </p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Total Searches
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{searchHistory.length}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Favorites
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{favorites.size}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Recent (24h)
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">
                  {searchHistory.filter(s => Date.now() - s.timestamp < 24 * 60 * 60 * 1000).length}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Search History Section */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Your Searches</CardTitle>
                  <CardDescription>
                    Recent medication price comparisons
                  </CardDescription>
                </div>
                {searchHistory.length > 0 && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleClearAll}
                    className="gap-2"
                  >
                    <Trash2 className="w-4 h-4" />
                    {t('history.clearAll')}
                  </Button>
                )}
              </div>
            </CardHeader>
            <CardContent>
              {/* Filters */}
              <div className="flex flex-col sm:flex-row gap-4 mb-6">
                <div className="flex gap-2">
                  <Button
                    variant={filterType === 'all' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setFilterType('all')}
                  >
                    {t('history.filters.all')}
                  </Button>
                  <Button
                    variant={filterType === 'recent' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setFilterType('recent')}
                  >
                    {t('history.filters.recent')}
                  </Button>
                  <Button
                    variant={filterType === 'favorites' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setFilterType('favorites')}
                    className="gap-2"
                  >
                    <Star className="w-4 h-4" />
                    {t('history.filters.favorites')}
                  </Button>
                </div>
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <input
                    type="text"
                    placeholder={t('history.search')}
                    value={searchFilter}
                    onChange={(e) => setSearchFilter(e.target.value)}
                    className="w-full pl-10 pr-10 py-2 border border-input rounded-md bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                  />
                  {searchFilter && (
                    <button
                      onClick={() => setSearchFilter('')}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>

              {/* Search History List */}
              {filteredSearches.length === 0 ? (
                <div className="text-center py-12">
                  <Search className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground mb-2">
                    {searchHistory.length === 0
                      ? t('history.noHistory')
                      : t('history.noHistory')}
                  </p>
                  <p className="text-sm text-muted-foreground mb-4">
                    {searchHistory.length === 0
                      ? "Start comparing medication prices to build your history"
                      : "Try adjusting your filters or search term"}
                  </p>
                  {searchHistory.length === 0 && (
                    <Button
                      onClick={() => setLocation("/")}
                      className="mt-2"
                    >
                      Start Searching
                    </Button>
                  )}
                </div>
              ) : (
                <div className="space-y-3">
                  {filteredSearches.map((search, index) => {
                    const originalIndex = searchHistory.indexOf(search);
                    const isFavorite = favorites.has(originalIndex);
                    
                    return (
                      <Card
                        key={originalIndex}
                        className="hover:shadow-md transition-shadow"
                      >
                        <CardContent className="p-4">
                          <div className="flex items-start justify-between gap-4">
                            <div className="flex-1 space-y-2">
                              {/* Medication Info */}
                              <div className="flex items-center gap-2 flex-wrap">
                                <h3 className="font-semibold text-lg">
                                  {search.medication}
                                </h3>
                                <Badge variant="secondary">
                                  {search.dosage}
                                </Badge>
                                <Badge variant="outline">
                                  {search.form}
                                </Badge>
                              </div>

                              {/* Details */}
                              <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-muted-foreground">
                                <div className="flex items-center gap-1">
                                  <Shield className="w-4 h-4" />
                                  {getInsuranceName(search.insurance)}
                                </div>
                                <div className="flex items-center gap-1">
                                  <MapPin className="w-4 h-4" />
                                  {search.zip}
                                </div>
                                <div className="flex items-center gap-1">
                                  <Clock className="w-4 h-4" />
                                  {formatTimestamp(search.timestamp)}
                                </div>
                              </div>
                            </div>

                            {/* Actions */}
                            <div className="flex items-center gap-2">
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  toggleFavorite(originalIndex);
                                }}
                                className={isFavorite ? "text-yellow-500 hover:text-yellow-600" : ""}
                                title={isFavorite ? "Remove from favorites" : "Add to favorites"}
                              >
                                <Star className={`w-4 h-4 ${isFavorite ? "fill-current" : ""}`} />
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  deleteSearch(originalIndex);
                                }}
                                title="Delete search"
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                              <Button
                                variant="default"
                                size="sm"
                                onClick={() => setLocation(search.url.replace(window.location.origin, ''))}
                                className="gap-2"
                              >
                                View Results
                                <ArrowRight className="w-4 h-4" />
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
