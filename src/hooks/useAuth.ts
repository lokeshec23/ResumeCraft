'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';

const AUTH_SESSION_KEY = 'authUser';

interface AuthUser {
  email: string;
  isLoggedIn: boolean;
}

export function useAuth() {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    try {
      const storedUser = sessionStorage.getItem(AUTH_SESSION_KEY);
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }
    } catch (error) {
      console.error("Failed to parse user from session storage", error);
      sessionStorage.removeItem(AUTH_SESSION_KEY); // Clear corrupted data
    } finally {
      setLoading(false);
    }
  }, []);

  const login = useCallback(async (email: string, /* password?: string */): Promise<boolean> => {
    // Mock login logic
    setLoading(true);
    await new Promise(resolve => setTimeout(resolve, 500)); // Simulate API call
    const userData: AuthUser = { email, isLoggedIn: true };
    try {
      sessionStorage.setItem(AUTH_SESSION_KEY, JSON.stringify(userData));
      setUser(userData);
      router.push('/dashboard');
      setLoading(false);
      return true;
    } catch (error) {
      console.error("Failed to save user to session storage", error);
      setLoading(false);
      return false;
    }
  }, [router]);

  const signup = useCallback(async (email: string, /* password?: string */): Promise<boolean> => {
    // Mock signup logic
    setLoading(true);
    await new Promise(resolve => setTimeout(resolve, 500)); // Simulate API call
    // For this example, signup will just log the user in directly.
    // In a real app, you might redirect to login or handle confirmation.
    const userData: AuthUser = { email, isLoggedIn: true };
     try {
      sessionStorage.setItem(AUTH_SESSION_KEY, JSON.stringify(userData));
      setUser(userData);
      router.push('/dashboard');
      setLoading(false);
      return true;
    } catch (error) {
      console.error("Failed to save user to session storage", error);
      setLoading(false);
      return false;
    }
  }, [router]);

  const logout = useCallback(() => {
    try {
      sessionStorage.removeItem(AUTH_SESSION_KEY);
      setUser(null);
      router.push('/login');
    } catch (error) {
       console.error("Failed to remove user from session storage", error);
    }
  }, [router]);

  return { user, loading, login, signup, logout, isLoggedIn: !!user?.isLoggedIn };
}
