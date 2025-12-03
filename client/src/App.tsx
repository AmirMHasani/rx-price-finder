import { lazy, Suspense } from "react";
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import { AuthProvider } from "./contexts/AuthContext";
import { LanguageProvider } from "./contexts/LanguageContext";
import { Spinner } from "./components/ui/spinner";

// Lazy load route components for code splitting
const SearchWithAPI = lazy(() => import("./pages/SearchWithAPI"));
const Results = lazy(() => import("./pages/Results"));
const Auth = lazy(() => import("./pages/Auth"));
const Dashboard = lazy(() => import("./pages/Dashboard"));
const MyDashboard = lazy(() => import("./pages/MyDashboard"));
const History = lazy(() => import("./pages/History"));
const TestPlaces = lazy(() => import("./pages/TestPlaces"));
const TabsTest = lazy(() => import("./pages/TabsTest"));
const PatientInfo = lazy(() => import("./pages/PatientInfo"));
const MyGenomic = lazy(() => import("./pages/MyGenomic"));
const NotFound = lazy(() => import("./pages/NotFound"));

// Loading fallback component
function LoadingFallback() {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <Spinner className="w-8 h-8" />
    </div>
  );
}

function Router() {
  // make sure to consider if you need authentication for certain routes
  return (
    <Suspense fallback={<LoadingFallback />}>
      <Switch>
        <Route path={"/"} component={SearchWithAPI} />
        <Route path="/auth" component={Auth} />
        <Route path="/dashboard" component={Dashboard} />
        <Route path="/my-dashboard" component={MyDashboard} />
        <Route path="/history" component={History} />
        <Route path="/results" component={Results} />
        <Route path="/test-places" component={TestPlaces} />
        <Route path="/tabs-test" component={TabsTest} />
        <Route path="/patient-info" component={PatientInfo} />
        <Route path="/my-genomic" component={MyGenomic} />
        <Route path="/404" component={NotFound} />
        {/* Final fallback route */}
        <Route component={NotFound} />
      </Switch>
    </Suspense>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <LanguageProvider>
        <ThemeProvider defaultTheme="light">
          <AuthProvider>
            <TooltipProvider>
              <Toaster />
              <Router />
            </TooltipProvider>
          </AuthProvider>
        </ThemeProvider>
      </LanguageProvider>
    </ErrorBoundary>
  );
}

export default App;
