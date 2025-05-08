import type {Metadata} from 'next';
import { Inter } from 'next/font/google'; // Changed from Geist to Inter for a more common professional look
import './globals.css';
import { Toaster } from "@/components/ui/toaster";

const inter = Inter({
  variable: '--font-inter',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'AI Resume Architect',
  description: 'Craft your perfect resume with AI-powered assistance.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning> {/* Added suppressHydrationWarning for potential theme/client-side state issues */}
      <body className={`${inter.variable} font-sans antialiased`}> {/* Use font-sans for Inter */}
        {children}
        <Toaster />
      </body>
    </html>
  );
}

