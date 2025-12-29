import { useState } from 'react';
import { useLocation, Link } from 'wouter';
import { ArrowLeft } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { motion } from 'framer-motion';

export default function SignupPage() {
  const [, setLocation] = useLocation();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      // 1. Create auth user
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
      });

      if (authError) throw authError;

      if (authData.user) {
        // 2. Create user profile
        // Note: In a real app with RLS, this might fail if the user isn't created yet or policies block it.
        // Usually Supabase triggers handle profile creation, or we do it here if policies allow insert.
        // For this prototype, we'll attempt it.
        const { error: profileError } = await supabase.from("users").insert({
          id: authData.user.id,
          email: email,
          name: name,
        });

        if (profileError) {
             console.error("Profile creation error:", profileError);
             // Verify if it's just a duplicate or permission issue we can ignore for now
             // For mockup purposes, we proceed to onboarding
        }

        setLocation("/onboarding/gender");
      }
    } catch (err: any) {
      setError(err.message || "Signup failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6 flex flex-col justify-center">
      <div className="max-w-md mx-auto w-full">
        <Link href="/welcome">
          <button className="mb-8 p-2 hover:bg-gray-100 rounded-full transition-all">
            <ArrowLeft className="w-6 h-6" />
          </button>
        </Link>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-[35px] font-bold font-display uppercase mb-2 tracking-tighter">
            Create Account
          </h1>
          <p className="text-gray-600 mb-8 font-bold tracking-tight">
            Start your nutrition journey today
          </p>

          <form onSubmit={handleSignup} className="space-y-4">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-tight">
                Full Name
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-4 rounded-2xl border-2 border-gray-200 focus:border-gray-900 focus:outline-none transition-all font-medium"
                placeholder="Neil Armstrong"
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-tight">
                Email
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-4 rounded-2xl border-2 border-gray-200 focus:border-gray-900 focus:outline-none transition-all font-medium"
                placeholder="hello@example.com"
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-tight">
                Password
              </label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-4 rounded-2xl border-2 border-gray-200 focus:border-gray-900 focus:outline-none transition-all font-medium"
                placeholder="••••••••"
              />
            </div>

            {error && (
              <div className="p-4 bg-red-50 text-red-600 rounded-2xl text-sm font-bold">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gray-900 text-white py-4 rounded-full font-bold text-lg uppercase tracking-tight hover:bg-gray-800 transition-all disabled:opacity-50 mt-4 active:scale-98"
            >
              {loading ? 'Creating Account...' : 'Sign Up'}
            </button>
          </form>

          <p className="mt-8 text-center text-gray-500 font-medium">
            Already have an account?{' '}
            <Link href="/login" className="text-gray-900 font-bold underline">
              Sign in
            </Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
}
