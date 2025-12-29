import { useEffect, useState } from 'react';
import { useLocation } from 'wouter';
import { motion } from 'framer-motion';
import astronautRocket from "@assets/Adobe_Express_-_file_1766602010364.png";
import { useAuth } from '@/hooks/use-auth';

export default function OnboardingComplete() {
  const [, setLocation] = useLocation();
  const [progress, setProgress] = useState(0);
  const { user } = useAuth();

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          saveOnboardingData();
          return 100;
        }
        return prev + 2;
      });
    }, 30);

    return () => clearInterval(interval);
  }, []);

  const saveOnboardingData = async () => {
    if (!user) return;

    try {
      // Get onboarding data from localStorage
      const gender = localStorage.getItem('onboarding_gender') || '';
      const workouts = parseInt(localStorage.getItem('onboarding_workouts') || '0');
      const heightStr = localStorage.getItem('onboarding_height') || '';
      const weightStr = localStorage.getItem('onboarding_weight') || '';
      const goal = localStorage.getItem('onboarding_goal') || 'maintain';
      const bmr = parseInt(localStorage.getItem('user_bmr') || '0');
      const tdee = parseInt(localStorage.getItem('user_tdee') || '0');
      const targetCalories = parseInt(localStorage.getItem('user_target_calories') || '0');

      // Parse height (convert to cm)
      let heightCm = 175;
      if (heightStr.includes('ft')) {
        const [ftStr, inStr] = heightStr.split(' ');
        const feet = parseInt(ftStr) || 5;
        const inches = parseInt(inStr) || 10;
        heightCm = (feet * 12 + inches) * 2.54;
      } else {
        heightCm = parseInt(heightStr) || 175;
      }

      // Parse weight (convert to kg)
      let weightKg = 75;
      if (weightStr.includes('lbs')) {
        const lbs = parseInt(weightStr) || 165;
        weightKg = lbs * 0.453592;
      } else {
        weightKg = parseInt(weightStr) || 75;
      }

      // Save to database
      await fetch('/api/profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          userId: user.id,
          name: `${user.firstName || ''} ${user.lastName || ''}`.trim() || 'User',
          gender,
          heightCm,
          weightKg,
          workoutsPerWeek: workouts,
          goal,
          bmr,
          tdee,
          targetCalories,
          onboardingCompleted: 1,
        }),
      });

      // Clear localStorage
      localStorage.removeItem('onboarding_gender');
      localStorage.removeItem('onboarding_workouts');
      localStorage.removeItem('onboarding_height');
      localStorage.removeItem('onboarding_weight');
      localStorage.removeItem('onboarding_goal');
      localStorage.removeItem('user_bmr');
      localStorage.removeItem('user_tdee');
      localStorage.removeItem('user_target_calories');

      setTimeout(() => setLocation('/'), 500);
    } catch (error) {
      console.error('Error saving onboarding data:', error);
      // Still redirect even if save fails
      setTimeout(() => setLocation('/'), 500);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-6">
      <div className="max-w-md w-full text-center">
        <div className="flex gap-2 mb-12">
          <div className="flex-1 h-1 bg-gray-900 rounded-full"></div>
          <div className="flex-1 h-1 bg-gray-900 rounded-full"></div>
          <div className="flex-1 h-1 bg-gray-900 rounded-full"></div>
          <div className="flex-1 h-1 bg-gray-900 rounded-full"></div>
          <div className="flex-1 h-1 bg-gray-900 rounded-full"></div>
        </div>

        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="mb-8"
        >
          <div className="w-32 h-32 mx-auto relative">
            <img src={astronautRocket} alt="Success" className="w-full h-full object-contain" />
          </div>
        </motion.div>

        <motion.h1
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-[35px] font-bold font-display uppercase mb-3 tracking-tighter"
        >
          Generating Your Plan
        </motion.h1>
        
        <motion.p
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-gray-600 mb-12 font-bold tracking-tight"
        >
          Creating your personalized nutrition journey
        </motion.p>

        <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-orange-500 to-orange-600 rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>

        <p className="mt-4 text-2xl font-bold font-display">{progress}%</p>
      </div>
    </div>
  );
}
