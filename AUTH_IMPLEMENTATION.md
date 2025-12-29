# Authentication Implementation Guide

## Update Login Page

Replace `client/src/pages/login.tsx`:

```typescript
import { useState } from 'react';
import { useLocation } from 'wouter';
import { ArrowLeft } from 'lucide-react';
import { supabase } from '@/lib/supabase';

export default function LoginPage() {
  const [, setLocation] = useLocation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const { data, error: authError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (authError) throw authError;

      if (data.user) {
        setLocation('/');
      }
    } catch (err: any) {
      setError(err.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    // ... your existing JSX, just update the handleLogin function
  );
}
```

## Update Signup Page

```typescript
import { supabase } from "@/lib/supabase";

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
      const { error: profileError } = await supabase.from("users").insert({
        id: authData.user.id,
        email: email,
        name: name,
      });

      if (profileError) throw profileError;

      setLocation("/onboarding/gender");
    }
  } catch (err: any) {
    setError(err.message || "Signup failed");
  } finally {
    setLoading(false);
  }
};
```

## Protected Routes

Create `client/src/components/ProtectedRoute.tsx`:

```typescript
import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { supabase } from "@/lib/supabase";

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const [, setLocation] = useLocation();
  const [loading, setLoading] = useState(true);
  const [authenticated, setAuthenticated] = useState(false);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (!session) {
      setLocation("/welcome");
    } else {
      setAuthenticated(true);
    }

    setLoading(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return authenticated ? <>{children}</> : null;
}
```

Use it in App.tsx:

```typescript
<Route path="/">
  {() => (
    <ProtectedRoute>
      <Home />
    </ProtectedRoute>
  )}
</Route>
```

Done! Users can now sign up, log in, and their data is securely stored! 🔐
