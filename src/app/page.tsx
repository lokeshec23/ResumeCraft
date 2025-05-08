
'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import ResumeBuilder from '@/components/resume-craft/ResumeBuilder';
import { Loader2 } from 'lucide-react';

export default function HomePage() {
  const { isLoggedIn, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !isLoggedIn) {
      router.replace('/login');
    }
  }, [isLoggedIn, loading, router]);

  if (loading || !isLoggedIn) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
      </div>
    );
  }

  // If loading is false and isLoggedIn is true, render the ResumeBuilder
  return <ResumeBuilder />;
}
