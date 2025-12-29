import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { useEffect, useState } from "react";
import NotFound from "@/pages/not-found";
import Home from "@/pages/home";
import Leaderboard from "@/pages/leaderboard";
import SearchPage from "@/pages/search";
import CameraPage from "@/pages/camera";
import WelcomePage from "@/pages/welcome";
import OnboardingGender from "@/pages/onboarding/gender";
import OnboardingWorkouts from "@/pages/onboarding/workouts";
import OnboardingGoals from "@/pages/onboarding/goals";
import OnboardingHeightWeight from "@/pages/onboarding/height-weight";
import OnboardingCalculate from "@/pages/onboarding/calculate";
import OnboardingComplete from "@/pages/onboarding/complete";

function ProtectedHome() {
  const [checking, setChecking] = useState(true);
  
  useEffect(() => {
    const hasCompletedOnboarding = localStorage.getItem('onboarding_completed') === 'true';
    if (!hasCompletedOnboarding) {
      window.location.replace("/welcome");
    } else {
      setChecking(false);
    }
  }, []);
  
  if (checking) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    );
  }
  
  return <Home />;
}

function Router() {
  return (
    <Switch>
      {/* Welcome */}
      <Route path="/welcome" component={WelcomePage} />
      
      {/* Onboarding Routes */}
      <Route path="/onboarding/gender" component={OnboardingGender} />
      <Route path="/onboarding/workouts" component={OnboardingWorkouts} />
      <Route path="/onboarding/goals" component={OnboardingGoals} />
      <Route path="/onboarding/height-weight" component={OnboardingHeightWeight} />
      <Route path="/onboarding/calculate" component={OnboardingCalculate} />
      <Route path="/onboarding/complete" component={OnboardingComplete} />

      {/* Main App Routes */}
      <Route path="/" component={ProtectedHome} />
      <Route path="/leaderboard" component={Leaderboard} />
      <Route path="/camera" component={CameraPage} />
      <Route path="/search" component={SearchPage} />
      
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
