'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';
import { Home, LogOut, UserCircle, Bot } from 'lucide-react';
import { ThemeToggleButton } from '@/components/theme/ThemeToggleButton';

export default function AppNavbar() {
  const { user, logout, isLoggedIn } = useAuth();

  if (!isLoggedIn) {
    return null; // Or a minimal navbar for non-logged-in users if needed elsewhere
  }

  return (
    <nav className="bg-primary text-primary-foreground p-3 shadow-md sticky top-0 z-50">
      <div className="container mx-auto flex justify-between items-center">
        <Link href="/dashboard" className="text-xl font-bold flex items-center">
          <Bot className="mr-2 h-6 w-6" />
          AI Dashboard
        </Link>
        <div className="flex items-center space-x-3">
          {user && (
            <span className="text-sm hidden sm:flex items-center">
              <UserCircle className="mr-1.5 h-5 w-5" />
              {user.email}
            </span>
          )}
          <Link href="/" passHref>
            <Button variant="secondary" size="sm" className="text-secondary-foreground bg-accent/20 hover:bg-accent/30">
              <Home className="mr-1.5 h-4 w-4" /> Resume Builder
            </Button>
          </Link>
          <ThemeToggleButton />
          <Button variant="ghost" size="sm" onClick={logout} className="hover:bg-primary/80 hover:text-primary-foreground">
            <LogOut className="mr-1.5 h-4 w-4" /> Logout
          </Button>
        </div>
      </div>
    </nav>
  );
}
