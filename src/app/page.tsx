'use client'; // Keep as client component as ResumeBuilder and its children are client components

import ResumeBuilder from '@/components/resume-craft/ResumeBuilder';

export default function HomePage() {
  // The ResumeBuilder is now the main content of the home page.
  // Authentication checks for dashboard are handled on the /dashboard route.
  // Login/Signup pages will redirect if already logged in.
  return <ResumeBuilder />;
}
