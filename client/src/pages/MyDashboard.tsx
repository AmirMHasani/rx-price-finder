import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  TrendingDown, 
  Search, 
  Pill, 
  DollarSign, 
  Calendar,
  Star,
  Clock,
  ArrowRight,
  TrendingUp,
  Activity
} from "lucide-react";
import { useLocation } from "wouter";
import { useLanguage } from "@/contexts/LanguageContext";

interface SearchHistoryItem {
  id: string;
  medicationName: string;
  dosage: string;
  form: string;
  quantity: string;
  insurance: {
    carrier: string;
    planName: string;
  };
  lowestPrice: number;
  timestamp: number;
  favorite?: boolean;
}

export default function UserDashboard() {
  const { t } = useLanguage();
  const [, setLocation] = useLocation();
  const [searchHistory, setSearchHistory] = useState<SearchHistoryItem[]>([]);
  const [totalSearches, setTotalSearches] = useState(0);
  const [totalSavings, setTotalSavings] = useState(0);
  const [activeMedications, setActiveMedications] = useState(0);

  useEffect(() => {
    // Load search history from localStorage
    const history = localStorage.getItem("searchHistory");
    if (history) {
      try {
        const parsed = JSON.parse(history);
        setSearchHistory(parsed.slice(0, 5)); // Show only 5 most recent
        setTotalSearches(parsed.length);
        
        // Calculate unique medications
        const uniqueMeds = new Set(parsed.map((item: SearchHistoryItem) => item.medicationName));
        setActiveMedications(uniqueMeds.size);
        
        // Calculate total savings (estimated average retail price - lowest price)
        const savings = parsed.reduce((acc: number, item: SearchHistoryItem) => {
          const estimatedRetail = item.lowestPrice * 3; // Assume retail is 3x lowest price
          return acc + (estimatedRetail - item.lowestPrice);
        }, 0);
        setTotalSavings(savings);
      } catch (e) {
        console.error("Failed to parse search history:", e);
      }
    }
  }, []);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatTimeAgo = (timestamp: number) => {
    const seconds = Math.floor((Date.now() - timestamp) / 1000);
    
    if (seconds < 60) return `${seconds}s ago`;
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    return `${days}d ago`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="container py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">{t('dashboard.title')}</h1>
              <p className="text-gray-600 mt-1">{t('dashboard.subtitle')}</p>
            </div>
            <Button onClick={() => setLocation("/")} size="lg">
              <Search className="w-4 h-4 mr-2" />
              {t('dashboard.newSearch')}
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* Total Searches */}
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">{t('dashboard.stats.totalSearches')}</CardTitle>
              <Activity className="w-4 h-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-gray-900">{totalSearches}</div>
              <p className="text-xs text-gray-500 mt-1">{t('dashboard.stats.allTimeSearches')}</p>
            </CardContent>
          </Card>

          {/* Estimated Savings */}
          <Card className="hover:shadow-lg transition-shadow border-green-200 bg-green-50">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-green-700">{t('dashboard.stats.estimatedSavings')}</CardTitle>
              <TrendingDown className="w-4 h-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-green-700">{formatCurrency(totalSavings)}</div>
              <p className="text-xs text-green-600 mt-1">{t('dashboard.stats.vsRetailPrices')}</p>
            </CardContent>
          </Card>

          {/* Active Medications */}
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">{t('dashboard.stats.medicationsTracked')}</CardTitle>
              <Pill className="w-4 h-4 text-purple-600" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-gray-900">{activeMedications}</div>
              <p className="text-xs text-gray-500 mt-1">{t('dashboard.stats.uniqueMedications')}</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Recent Searches - Takes up 2 columns */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-xl">{t('dashboard.recentSearches.title')}</CardTitle>
                    <CardDescription>{t('dashboard.recentSearches.subtitle')}</CardDescription>
                  </div>
                  <Button variant="outline" size="sm" onClick={() => setLocation("/history")}>
                    {t('dashboard.recentSearches.viewAll')}
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {searchHistory.length === 0 ? (
                  <div className="text-center py-12">
                    <Search className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500 mb-4">{t('dashboard.recentSearches.noSearches')}</p>
                    <Button onClick={() => setLocation("/")}>
                      <Search className="w-4 h-4 mr-2" />
                      {t('dashboard.recentSearches.startFirst')}
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {searchHistory.map((item) => (
                      <div
                        key={item.id}
                        className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
                        onClick={() => {
                          // Navigate to results page with search params
                          const params = new URLSearchParams({
                            medication: item.medicationName,
                            dosage: item.dosage,
                            form: item.form,
                            quantity: item.quantity,
                            carrier: item.insurance.carrier,
                            plan: item.insurance.planName,
                          });
                          setLocation(`/results?${params.toString()}`);
                        }}
                      >
                        <div className="flex items-center gap-4 flex-1">
                          <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                            <Pill className="w-5 h-5 text-blue-600" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                              <h3 className="font-semibold text-gray-900 truncate">{item.medicationName}</h3>
                              {item.favorite && <Star className="w-4 h-4 text-yellow-500 fill-yellow-500 flex-shrink-0" />}
                            </div>
                            <p className="text-sm text-gray-600">
                              {item.dosage} • {item.form} • {item.quantity} pills
                            </p>
                            <div className="flex items-center gap-2 mt-1">
                              <Badge variant="secondary" className="text-xs">
                                {item.insurance.carrier}
                              </Badge>
                              <span className="text-xs text-gray-500 flex items-center gap-1">
                                <Clock className="w-3 h-3" />
                                {formatTimeAgo(item.timestamp)}
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="text-right flex-shrink-0 ml-4">
                          <p className="text-xs text-gray-500">{t('dashboard.recentSearches.lowestPrice')}</p>
                          <p className="text-lg font-bold text-green-600">{formatCurrency(item.lowestPrice)}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>{t('dashboard.quickActions.title')}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button className="w-full justify-start" variant="outline" onClick={() => setLocation("/")}>
                  <Search className="w-4 h-4 mr-2" />
                  {t('dashboard.quickActions.newSearch')}
                </Button>
                <Button className="w-full justify-start" variant="outline" onClick={() => setLocation("/history")}>
                  <Clock className="w-4 h-4 mr-2" />
                  {t('dashboard.quickActions.viewHistory')}
                </Button>
                <Button className="w-full justify-start" variant="outline" disabled>
                  <Calendar className="w-4 h-4 mr-2" />
                  {t('dashboard.quickActions.setReminders')}
                  <Badge variant="secondary" className="ml-auto">{t('dashboard.quickActions.soon')}</Badge>
                </Button>
              </CardContent>
            </Card>

            {/* Savings Insights */}
            <Card className="border-green-200 bg-gradient-to-br from-green-50 to-emerald-50">
              <CardHeader>
                <CardTitle className="text-green-800">{t('dashboard.savingsInsights.title')}</CardTitle>
              </CardHeader>
              <CardContent>
                {totalSearches > 0 ? (
                  <div className="space-y-4">
                    <div>
                      <p className="text-sm text-gray-600 mb-1">{t('dashboard.savingsInsights.totalSavings')}</p>
                      <p className="text-2xl font-bold text-green-700">{formatCurrency(totalSavings)}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 mb-1">{t('dashboard.savingsInsights.avgPerSearch')}</p>
                      <p className="text-xl font-semibold text-green-600">
                        {formatCurrency(totalSavings / totalSearches)}
                      </p>
                    </div>
                    <div className="pt-4 border-t border-green-200">
                      <p className="text-sm text-green-700">
                        {t('dashboard.savingsInsights.keepComparing')}
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-6">
                    <TrendingUp className="w-12 h-12 text-green-300 mx-auto mb-3" />
                    <p className="text-sm text-gray-600">{t('dashboard.savingsInsights.startSearching')}</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Upgrade to Premium */}
            <Card className="border-purple-200 bg-gradient-to-br from-purple-50 to-indigo-50">
              <CardHeader>
                <CardTitle className="text-purple-800">{t('dashboard.premium.title')}</CardTitle>
                <CardDescription>{t('dashboard.premium.subtitle')}</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 mb-4">
                  <li className="flex items-center text-sm">
                    <DollarSign className="w-4 h-4 text-purple-600 mr-2 flex-shrink-0" />
                    {t('dashboard.premium.unlimitedSearches')}
                  </li>
                  <li className="flex items-center text-sm">
                    <TrendingDown className="w-4 h-4 text-purple-600 mr-2 flex-shrink-0" />
                    {t('dashboard.premium.priceAlerts')}
                  </li>
                  <li className="flex items-center text-sm">
                    <Calendar className="w-4 h-4 text-purple-600 mr-2 flex-shrink-0" />
                    {t('dashboard.premium.medicationReminders')}
                  </li>
                  <li className="flex items-center text-sm">
                    <Pill className="w-4 h-4 text-purple-600 mr-2 flex-shrink-0" />
                    {t('dashboard.premium.familyManagement')}
                  </li>
                </ul>
                <Button className="w-full bg-purple-600 hover:bg-purple-700" disabled>
                  {t('dashboard.premium.upgradeNow')}
                  <Badge variant="secondary" className="ml-2">{t('dashboard.premium.comingSoon')}</Badge>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
