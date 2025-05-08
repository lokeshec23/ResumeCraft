
'use client';

import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';
import { Loader2, LogIn } from 'lucide-react';

const PENDING_LOGIN_EMAIL_KEY = 'pendingLoginEmail';

const loginSchema = z.object({
  email: z.string().email({ message: 'Invalid email address.' }),
  password: z.string().min(6, { message: 'Password must be at least 6 characters.' }),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const { login, isLoggedIn, loading: authLoading } = useAuth();
  const router = useRouter();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  useEffect(() => {
    if (!authLoading && isLoggedIn) {
      router.replace('/dashboard');
      return; 
    }

    // Check if redirected from signup for email pre-fill
    try {
      const pendingEmail = sessionStorage.getItem(PENDING_LOGIN_EMAIL_KEY);
      if (pendingEmail) {
        form.setValue('email', pendingEmail);
        toast({
          title: 'Account Created!',
          description: 'Please enter your password to log in.',
        });
        sessionStorage.removeItem(PENDING_LOGIN_EMAIL_KEY);
      }
    } catch (error) {
      console.error("Error processing pending login email:", error);
      sessionStorage.removeItem(PENDING_LOGIN_EMAIL_KEY); // Clear potentially corrupted key
    }
  }, [isLoggedIn, authLoading, router, form, toast]);

  const onSubmit = async (data: LoginFormValues) => {
    setIsSubmitting(true);
    const success = await login(data.email, data.password);
    if (success) {
      toast({ title: 'Login Successful', description: 'Redirecting to dashboard...' });
      router.replace('/dashboard'); // Page handles redirection
    } else {
      toast({
        title: 'Login Failed',
        description: 'Invalid email or password. Please try again.',
        variant: 'destructive',
      });
    }
    setIsSubmitting(false);
  };
  
  if (authLoading) {
    return <div className="flex min-h-screen items-center justify-center bg-background"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>;
  }
  if (isLoggedIn) { 
    return <div className="flex min-h-screen items-center justify-center bg-background"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>;
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-background via-muted to-background p-4">
      <Card className="w-full max-w-md shadow-2xl">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-bold flex items-center justify-center">
            <LogIn className="mr-2 h-8 w-8 text-primary" /> Login
          </CardTitle>
          <CardDescription>Access your AI Resume Architect account.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                {...form.register('email')}
                disabled={isSubmitting}
              />
              {form.formState.errors.email && (
                <p className="text-sm text-destructive">{form.formState.errors.email.message}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                {...form.register('password')}
                disabled={isSubmitting}
              />
              {form.formState.errors.password && (
                <p className="text-sm text-destructive">{form.formState.errors.password.message}</p>
              )}
            </div>
            <Button type="submit" className="w-full" disabled={isSubmitting || authLoading}>
              {isSubmitting ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <LogIn className="mr-2 h-4 w-4" />
              )}
              Login
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex flex-col items-center space-y-2">
          <Link href="/signup" className="text-sm text-primary hover:underline">
            Don&apos;t have an account? Sign Up
          </Link>
        </CardFooter>
      </Card>
    </div>
  );
}
