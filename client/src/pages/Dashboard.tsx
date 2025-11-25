import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import * as mockDb from '@/services/mockDb';
import { LogOut, Plus, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { Input } from '@/components/ui/input';

export default function Dashboard() {
  const { user, signOut } = useAuth();
  const [, setLocation] = useLocation();
  const [insurance, setInsurance] = useState<mockDb.UserInsurance[]>([]);
  const [searches, setSearches] = useState<mockDb.UserSearch[]>([]);
  const [showAddInsurance, setShowAddInsurance] = useState(false);
  const [insurancePlans, setInsurancePlans] = useState<mockDb.InsurancePlan[]>([]);

  // Form state
  const [formData, setFormData] = useState({
    planId: '',
    deductible: '',
    oopMax: '',
  });

  useEffect(() => {
    if (!user) {
      setLocation('/auth');
      return;
    }

    loadData();
  }, [user, setLocation]);

  const loadData = async () => {
    if (!user) return;

    try {
      const [userInsurance, userSearches, plans] = await Promise.all([
        mockDb.getUserInsurance(user.id),
        mockDb.getUserSearchHistory(user.id),
        mockDb.getInsurancePlans(),
      ]);

      setInsurance(userInsurance);
      setSearches(userSearches);
      setInsurancePlans(plans);
    } catch (error) {
      toast.error('Failed to load data');
    }
  };

  const handleAddInsurance = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.planId || !formData.deductible || !formData.oopMax) {
      toast.error('Please fill in all fields');
      return;
    }

    if (!user) return;

    try {
      const plan = insurancePlans.find(p => p.id === formData.planId);
      if (!plan) {
        toast.error('Invalid plan selected');
        return;
      }

      await mockDb.addUserInsurance(
        user.id,
        formData.planId,
        plan.name,
        plan.carrier,
        parseInt(formData.deductible),
        parseInt(formData.oopMax)
      );

      toast.success('Insurance plan added');
      setFormData({ planId: '', deductible: '', oopMax: '' });
      setShowAddInsurance(false);
      await loadData();
    } catch (error) {
      toast.error('Failed to add insurance plan');
    }
  };

  const handleDeleteInsurance = async (insuranceId: string) => {
    try {
      await mockDb.deleteUserInsurance(insuranceId);
      toast.success('Insurance plan removed');
      await loadData();
    } catch (error) {
      toast.error('Failed to remove insurance plan');
    }
  };

  const handleSignOut = async () => {
    await signOut();
    setLocation('/');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-teal-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold">Dashboard</h1>
            <p className="text-gray-600">Welcome, {user?.full_name}</p>
          </div>
          <Button variant="outline" onClick={handleSignOut}>
            <LogOut className="mr-2 h-4 w-4" />
            Sign Out
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <Tabs defaultValue="insurance" className="space-y-4">
          <TabsList>
            <TabsTrigger value="insurance">Insurance Plans</TabsTrigger>
            <TabsTrigger value="searches">Search History</TabsTrigger>
          </TabsList>

          {/* Insurance Plans Tab */}
          <TabsContent value="insurance" className="space-y-4">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-xl font-semibold">Your Insurance Plans</h2>
                <p className="text-gray-600">Manage your insurance information</p>
              </div>
              <Button onClick={() => setShowAddInsurance(!showAddInsurance)}>
                <Plus className="mr-2 h-4 w-4" />
                Add Plan
              </Button>
            </div>

            {/* Add Insurance Form */}
            {showAddInsurance && (
              <Card>
                <CardHeader>
                  <CardTitle>Add Insurance Plan</CardTitle>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleAddInsurance} className="space-y-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Insurance Plan</label>
                      <select
                        value={formData.planId}
                        onChange={(e) => setFormData({ ...formData, planId: e.target.value })}
                        className="w-full px-3 py-2 border rounded-md"
                      >
                        <option value="">Select a plan</option>
                        {insurancePlans.map((plan) => (
                          <option key={plan.id} value={plan.id}>
                            {plan.name} ({plan.carrier})
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Annual Deductible ($)</label>
                        <Input
                          type="number"
                          placeholder="1000"
                          value={formData.deductible}
                          onChange={(e) => setFormData({ ...formData, deductible: e.target.value })}
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Out-of-Pocket Max ($)</label>
                        <Input
                          type="number"
                          placeholder="5000"
                          value={formData.oopMax}
                          onChange={(e) => setFormData({ ...formData, oopMax: e.target.value })}
                        />
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <Button type="submit" className="flex-1">
                        Save Plan
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        className="flex-1"
                        onClick={() => setShowAddInsurance(false)}
                      >
                        Cancel
                      </Button>
                    </div>
                  </form>
                </CardContent>
              </Card>
            )}

            {/* Insurance Plans List */}
            <div className="grid gap-4">
              {insurance.length === 0 ? (
                <Card>
                  <CardContent className="pt-6 text-center text-gray-600">
                    No insurance plans added yet. Add one to get started!
                  </CardContent>
                </Card>
              ) : (
                insurance.map((plan) => (
                  <Card key={plan.id}>
                    <CardHeader className="pb-3">
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle>{plan.plan_name}</CardTitle>
                          <CardDescription>{plan.carrier}</CardDescription>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteInsurance(plan.id)}
                        >
                          <Trash2 className="h-4 w-4 text-red-500" />
                        </Button>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm text-gray-600">Annual Deductible</p>
                          <p className="text-lg font-semibold">${plan.deductible}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Out-of-Pocket Max</p>
                          <p className="text-lg font-semibold">${plan.oop_max}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </TabsContent>

          {/* Search History Tab */}
          <TabsContent value="searches" className="space-y-4">
            <div>
              <h2 className="text-xl font-semibold">Search History</h2>
              <p className="text-gray-600">Your recent prescription searches</p>
            </div>

            <div className="grid gap-4">
              {searches.length === 0 ? (
                <Card>
                  <CardContent className="pt-6 text-center text-gray-600">
                    No searches yet. Start searching for medications!
                  </CardContent>
                </Card>
              ) : (
                searches.map((search) => (
                  <Card key={search.id}>
                    <CardContent className="pt-6">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="font-semibold">{search.medication_name}</p>
                          <p className="text-sm text-gray-600">
                            {search.dosage} • {search.form}
                          </p>
                          <p className="text-sm text-gray-500 mt-2">
                            {search.results_count} pharmacies found
                          </p>
                        </div>
                        <p className="text-xs text-gray-500">
                          {new Date(search.created_at).toLocaleDateString()}
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
