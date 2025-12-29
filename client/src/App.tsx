import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import NotFound from "@/pages/not-found";
import Home from "@/pages/home";
import Leaderboard from "@/pages/leaderboard";
import SearchPage from "@/pages/search";
import CameraPage from "@/pages/camera";
import LoginPage from "@/pages/login";
import SignupPage from "@/pages/signup";
import WelcomePage from "@/pages/welcome";
import OnboardingGender from "@/pages/onboarding/gender";
import OnboardingWorkouts from "@/pages/onboarding/workouts";
import OnboardingGoals from "@/pages/onboarding/goals";
import OnboardingHeightWeight from "@/pages/onboarding/height-weight";
import OnboardingCalculate from "@/pages/onboarding/calculate";
import OnboardingComplete from "@/pages/onboarding/complete";
import { ProtectedRoute } from "@/components/ProtectedRoute";

function Router() {
  return (
    <Switch>
      {/* Public Routes */}
      <Route path="/welcome" component={WelcomePage} />
      <Route path="/login" component={LoginPage} />
      <Route path="/signup" component={SignupPage} />
      
      {/* Onboarding Routes (after authentication) */}
      <Route path="/onboarding/gender" component={OnboardingGender} />
      <Route path="/onboarding/workouts" component={OnboardingWorkouts} />
      <Route path="/onboarding/goals" component={OnboardingGoals} />
      <Route path="/onboarding/height-weight" component={OnboardingHeightWeight} />
      <Route path="/onboarding/calculate" component={OnboardingCalculate} />
      <Route path="/onboarding/complete" component={OnboardingComplete} />

      {/* Protected Routes */}
      <Route path="/">
        {() => (
          <ProtectedRoute>
            <Home />
          </ProtectedRoute>
        )}
      </Route>
      <Route path="/leaderboard">
        {() => (
          <ProtectedRoute>
            <Leaderboard />
          </ProtectedRoute>
        )}
      </Route>
      <Route path="/camera">
        {() => (
          <ProtectedRoute>
            <CameraPage />
          </ProtectedRoute>
        )}
      </Route>
      <Route path="/search">
        {() => (
          <ProtectedRoute>
            <SearchPage />
          </ProtectedRoute>
        )}
      </Route>
      
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Toaster />
      <Router />
    </QueryClientProvider>
  );
}

export default App;
