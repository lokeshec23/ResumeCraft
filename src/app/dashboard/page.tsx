'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, Briefcase, Edit3, Settings, Bot } from 'lucide-react';
import Link from 'next/link';
import AppNavbar from '@/components/layout/AppNavbar';


export default function DashboardPage() {
  const { user, isLoggedIn, loading, logout } = useAuth();
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

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <AppNavbar />
      <main className="flex-grow container mx-auto p-4 sm:p-8">
        <header className="mb-8">
          <h1 className="text-4xl font-bold text-primary mb-2">Welcome, {user?.email}!</h1>
          <p className="text-lg text-muted-foreground">
            Manage your resumes and account settings from here.
          </p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card className="shadow-lg hover:shadow-xl transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center text-2xl">
                <Edit3 className="mr-3 h-7 w-7 text-accent" />
                Resume Builder
              </CardTitle>
              <CardDescription>Craft new resumes or edit existing ones.</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                Use our AI-powered tools to create professional resumes that stand out.
              </p>
              <Link href="/" passHref>
                <Button className="w-full">
                  Go to Resume Builder <Briefcase className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="shadow-lg hover:shadow-xl transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center text-2xl">
                <Bot className="mr-3 h-7 w-7 text-accent" />
                AI Features
              </CardTitle>
              <CardDescription>Explore AI tools to enhance your resume.</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                Leverage AI for summary generation, responsibility phrasing, and more.
              </p>
              {/* Link to a specific AI features page or section if available */}
              <Button variant="outline" className="w-full" disabled>
                Explore AI Tools (Coming Soon)
              </Button>
            </CardContent>
          </Card>
          
          <Card className="shadow-lg hover:shadow-xl transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center text-2xl">
                <Settings className="mr-3 h-7 w-7 text-accent" />
                Account Settings
              </CardTitle>
              <CardDescription>Manage your profile and preferences.</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                Update your email, password, or other account details.
              </p>
              <Button variant="outline" className="w-full" disabled>
                Manage Account (Coming Soon)
              </Button>
            </CardContent>
          </Card>
        </div>
      </main>
      <footer className="text-center p-4 text-sm text-muted-foreground border-t">
        © {new Date().getFullYear()} AI Resume Architect. All rights reserved.
      </footer>
    </div>
  );
}
