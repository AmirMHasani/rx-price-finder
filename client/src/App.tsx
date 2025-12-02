import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import TestPlaces from "@/pages/TestPlaces";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import { AuthProvider } from "./contexts/AuthContext";
import { LanguageProvider } from "./contexts/LanguageContext";
import SearchWithAPI from "./pages/SearchWithAPI";
import Results from "./pages/Results";
import Auth from "./pages/Auth";
import Dashboard from "./pages/Dashboard";
import TabsTest from "./pages/TabsTest";

function Router() {
  return (
    <Switch>
      <Route path={"/"} component={SearchWithAPI} />
      <Route path="/auth" component={Auth} />
      <Route path="/dashboard" component={Dashboard} />
      <Route path="/results" component={Results} />
      <Route path="/test-places" component={TestPlaces} />
      <Route path="/tabs-test" component={TabsTest} />
      <Route path="/404" component={NotFound} />
      {/* Final fallback route */}
      <Route component={NotFound} />
    </Switch>
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
