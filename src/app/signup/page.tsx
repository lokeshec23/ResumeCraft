
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
import { Loader2, UserPlus } from 'lucide-react';

const signupSchema = z
  .object({
    email: z.string().email({ message: 'Invalid email address.' }),
    password: z.string().min(6, { message: 'Password must be at least 6 characters.' }),
    confirmPassword: z.string().min(6, { message: 'Password must be at least 6 characters.' }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match.",
    path: ['confirmPassword'], // path of error
  });

type SignupFormValues = z.infer<typeof signupSchema>;

export default function SignupPage() {
  const { signup, isLoggedIn, loading: authLoading } = useAuth();
  const router = useRouter();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<SignupFormValues>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      email: '',
      password: '',
      confirmPassword: '',
    },
  });

  useEffect(() => {
    if (!authLoading && isLoggedIn) {
      router.replace('/'); // Redirect to home page (ResumeBuilder)
    }
  }, [isLoggedIn, authLoading, router]);

  const onSubmit = async (data: SignupFormValues) => {
    setIsSubmitting(true);
    const success = await signup(data.email, data.password);
    if (success) {
      toast({ title: 'Signup Successful', description: 'Redirecting...' });
      // Redirection is handled by the useEffect hook
    } else {
      toast({
        title: 'Signup Failed',
        description: 'Could not create account. Please try again.', // Generic error
        variant: 'destructive',
      });
    }
    setIsSubmitting(false);
  };

  if (authLoading) {
    return <div className="flex min-h-screen items-center justify-center bg-background"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>;
  }
   // If already logged in and not loading, useEffect will handle redirect.
  if (isLoggedIn) {
     return <div className="flex min-h-screen items-center justify-center bg-background"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>;
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-background via-muted to-background p-4">
      <Card className="w-full max-w-md shadow-2xl">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-bold flex items-center justify-center">
            <UserPlus className="mr-2 h-8 w-8 text-primary" /> Create Account
          </CardTitle>
          <CardDescription>Join AI Resume Architect today.</CardDescription>
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
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <Input
                id="confirmPassword"
                type="password"
                placeholder="••••••••"
                {...form.register('confirmPassword')}
                disabled={isSubmitting}
              />
              {form.formState.errors.confirmPassword && (
                <p className="text-sm text-destructive">
                  {form.formState.errors.confirmPassword.message}
                </p>
              )}
            </div>
            <Button type="submit" className="w-full" disabled={isSubmitting || authLoading}>
              {isSubmitting ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <UserPlus className="mr-2 h-4 w-4" />
              )}
              Sign Up
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex flex-col items-center space-y-2">
          <Link href="/login" className="text-sm text-primary hover:underline">
            Already have an account? Login
          </Link>
        </CardFooter>
      </Card>
    </div>
  );
}
