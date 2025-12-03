import { useEffect, useState } from "react";
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
  const [, setLocation] = useLocation();
  const [searchHistory, setSearchHistory] = useState<SearchHistoryItem[]>([]);
  const [totalSearches, setTotalSearches] = useState(0);
  const [totalSavings, setTotalSavings] = useState(0);
  const [activeMedications, setActiveMedications] = useState(0);

  useEffect(() => {
    // Load search history from localStorage
    const history = localStorage.getItem("searchHistory");
    if (history) {
      const parsedHistory: SearchHistoryItem[] = JSON.parse(history);
      setSearchHistory(parsedHistory.slice(0, 5)); // Show last 5
      setTotalSearches(parsedHistory.length);
      
      // Calculate total savings (assuming average retail markup of 300%)
      const savings = parsedHistory.reduce((acc, item) => {
        const retailPrice = item.lowestPrice * 3;
        const saved = retailPrice - item.lowestPrice;
        return acc + saved;
      }, 0);
      setTotalSavings(savings);

      // Count unique medications
      const uniqueMeds = new Set(parsedHistory.map(item => item.medicationName));
      setActiveMedications(uniqueMeds.size);
    }
  }, []);

  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return "Today";
    if (diffDays === 1) return "Yesterday";
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
    return `${Math.floor(diffDays / 30)} months ago`;
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="container py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
              <p className="text-gray-600 mt-1">Welcome back! Here's your medication overview</p>
            </div>
            <Button onClick={() => setLocation("/")} size="lg">
              <Search className="w-4 h-4 mr-2" />
              New Search
            </Button>
          </div>
        </div>
      </div>

      <div className="container py-8">
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* Total Searches */}
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Total Searches</CardTitle>
              <Activity className="w-4 h-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-gray-900">{totalSearches}</div>
              <p className="text-xs text-gray-600 mt-1">
                <TrendingUp className="w-3 h-3 inline mr-1" />
                All time searches
              </p>
            </CardContent>
          </Card>

          {/* Total Savings */}
          <Card className="hover:shadow-lg transition-shadow border-green-200 bg-green-50">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-green-700">Estimated Savings</CardTitle>
              <TrendingDown className="w-4 h-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-green-700">{formatCurrency(totalSavings)}</div>
              <p className="text-xs text-green-600 mt-1">
                vs. average retail prices
              </p>
            </CardContent>
          </Card>

          {/* Active Medications */}
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Medications Tracked</CardTitle>
              <Pill className="w-4 h-4 text-purple-600" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-gray-900">{activeMedications}</div>
              <p className="text-xs text-gray-600 mt-1">
                Unique medications searched
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Recent Searches - Takes 2 columns */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <Clock className="w-5 h-5 text-blue-600" />
                      Recent Searches
                    </CardTitle>
                    <CardDescription className="mt-1">Your latest medication price comparisons</CardDescription>
                  </div>
                  <Button variant="ghost" size="sm" onClick={() => setLocation("/history")}>
                    View All
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {searchHistory.length === 0 ? (
                  <div className="text-center py-12">
                    <Search className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                    <p className="text-gray-500 mb-4">No searches yet</p>
                    <Button onClick={() => setLocation("/")}>
                      Start Your First Search
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {searchHistory.map((item) => (
                      <div
                        key={item.id}
                        className="flex items-center justify-between p-4 rounded-lg border hover:border-blue-300 hover:bg-blue-50 transition-all cursor-pointer"
                        onClick={() => {
                          // Navigate to results with this search
                          const params = new URLSearchParams({
                            medication: item.medicationName,
                            dosage: item.dosage,
                            form: item.form,
                            quantity: item.quantity,
                            frequency: "1",
                            insuranceCarrier: item.insurance.carrier,
                            insurancePlan: item.insurance.planName,
                            zip: "02108"
                          });
                          setLocation(`/results?${params.toString()}`);
                        }}
                      >
                        <div className="flex items-center gap-4 flex-1 min-w-0">
                          <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                            <Pill className="w-5 h-5 text-blue-600" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                              <h4 className="font-semibold text-gray-900 truncate">{item.medicationName}</h4>
                              {item.favorite && <Star className="w-4 h-4 text-yellow-500 fill-yellow-500 flex-shrink-0" />}
                            </div>
                            <p className="text-sm text-gray-600 truncate">
                              {item.dosage} {item.form} • {item.quantity} days supply
                            </p>
                            <p className="text-xs text-gray-500 mt-0.5">{formatDate(item.timestamp)}</p>
                          </div>
                        </div>
                        <div className="text-right flex-shrink-0">
                          <div className="text-lg font-bold text-green-600">{formatCurrency(item.lowestPrice)}</div>
                          <p className="text-xs text-gray-500">Lowest price</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Quick Actions & Info - Takes 1 column */}
          <div className="space-y-6">
            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button 
                  className="w-full justify-start" 
                  variant="outline"
                  onClick={() => setLocation("/")}
                >
                  <Search className="w-4 h-4 mr-2" />
                  New Medication Search
                </Button>
                <Button 
                  className="w-full justify-start" 
                  variant="outline"
                  onClick={() => setLocation("/history")}
                >
                  <Clock className="w-4 h-4 mr-2" />
                  View Search History
                </Button>
                <Button 
                  className="w-full justify-start" 
                  variant="outline"
                  disabled
                >
                  <Calendar className="w-4 h-4 mr-2" />
                  Set Medication Reminders
                  <Badge variant="secondary" className="ml-auto">Soon</Badge>
                </Button>
              </CardContent>
            </Card>

            {/* Savings Insights */}
            <Card className="border-green-200 bg-gradient-to-br from-green-50 to-white">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <DollarSign className="w-5 h-5 text-green-600" />
                  Savings Insights
                </CardTitle>
              </CardHeader>
              <CardContent>
                {totalSavings > 0 ? (
                  <div className="space-y-3">
                    <div>
                      <p className="text-sm text-gray-600 mb-1">Total Estimated Savings</p>
                      <p className="text-2xl font-bold text-green-700">{formatCurrency(totalSavings)}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 mb-1">Average Savings per Search</p>
                      <p className="text-xl font-semibold text-green-600">
                        {formatCurrency(totalSavings / totalSearches)}
                      </p>
                    </div>
                    <div className="pt-3 border-t border-green-200">
                      <p className="text-xs text-gray-600">
                        💡 Keep comparing prices to maximize your savings!
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-6">
                    <TrendingDown className="w-10 h-10 text-gray-300 mx-auto mb-2" />
                    <p className="text-sm text-gray-500">Start searching to see your savings</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Membership Upgrade CTA */}
            <Card className="border-blue-200 bg-gradient-to-br from-blue-50 to-white">
              <CardHeader>
                <CardTitle className="text-lg">Upgrade to Premium</CardTitle>
                <CardDescription>Unlock advanced features</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-gray-600 mb-4">
                  <li className="flex items-start gap-2">
                    <span className="text-blue-600">✓</span>
                    <span>Unlimited searches</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-600">✓</span>
                    <span>Price drop alerts</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-600">✓</span>
                    <span>Medication reminders</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-600">✓</span>
                    <span>Family member management</span>
                  </li>
                </ul>
                <Button className="w-full" disabled>
                  Upgrade Now
                  <Badge variant="secondary" className="ml-2">Coming Soon</Badge>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
