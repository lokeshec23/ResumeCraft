
'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';

const AUTH_SESSION_KEY = 'authUser'; // Key for the currently logged-in user session
const USER_CREDENTIALS_PREFIX = 'user_'; // Prefix for storing mock user credentials
const PENDING_LOGIN_EMAIL_KEY = 'pendingLoginEmail'; // Key for email to pre-fill on login page

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
      sessionStorage.removeItem(AUTH_SESSION_KEY); 
    } finally {
      setLoading(false);
    }
  }, []);

  const login = useCallback(async (email: string, password?: string): Promise<boolean> => {
    setLoading(true);
    await new Promise(resolve => setTimeout(resolve, 500)); // Simulate API call
    
    try {
      const storedUserCredentialsKey = `${USER_CREDENTIALS_PREFIX}${email}`;
      const storedUserCredentials = sessionStorage.getItem(storedUserCredentialsKey);

      if (storedUserCredentials) {
        const credentials = JSON.parse(storedUserCredentials);
        // MOCK CHECK: In a real app, password would be hashed and compared.
        if (credentials.password === password) { 
          const userData: AuthUser = { email, isLoggedIn: true };
          sessionStorage.setItem(AUTH_SESSION_KEY, JSON.stringify(userData));
          setUser(userData);
          setLoading(false);
          return true; // Indicate success to the calling page for redirection
        }
      }
      // If user not found or password doesn't match
      setLoading(false);
      return false;
    } catch (error) {
      console.error("Failed to process login", error);
      setLoading(false);
      return false;
    }
  }, []); // router removed as page will handle redirection

  const signup = useCallback(async (email: string, password?: string): Promise<boolean> => {
    setLoading(true);
    await new Promise(resolve => setTimeout(resolve, 500)); // Simulate API call
    
    try {
      // MOCK: Store "credentials". In a real app, this would be a DB call with hashed password.
      // This is NOT secure for production.
      const userCredentialsKey = `${USER_CREDENTIALS_PREFIX}${email}`;
      sessionStorage.setItem(userCredentialsKey, JSON.stringify({ email, password }));
      
      // Set email for pre-filling on the login page
      sessionStorage.setItem(PENDING_LOGIN_EMAIL_KEY, email);
      
      setLoading(false);
      return true; // Indicate success to the calling page for redirection
    } catch (error) {
      console.error("Failed to process signup", error);
      setLoading(false);
      return false;
    }
  }, []);

  const logout = useCallback(() => {
    try {
      sessionStorage.removeItem(AUTH_SESSION_KEY);
      // Optionally, clear pending login email if any
      sessionStorage.removeItem(PENDING_LOGIN_EMAIL_KEY);
      // Optionally, clear all mock user credentials (not typical for logout, but for a full reset in mock)
      // Object.keys(sessionStorage).forEach(key => {
      //   if (key.startsWith(USER_CREDENTIALS_PREFIX)) {
      //     sessionStorage.removeItem(key);
      //   }
      // });
      setUser(null);
      router.push('/login');
    } catch (error) {
       console.error("Failed to remove user from session storage", error);
    }
  }, [router]);

  return { user, loading, login, signup, logout, isLoggedIn: !!user?.isLoggedIn };
}
