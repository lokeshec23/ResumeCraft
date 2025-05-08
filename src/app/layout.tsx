import type {Metadata} from 'next';
import { Inter } from 'next/font/google'; // Changed from Geist to Inter for a more common professional look
import './globals.css';
import { Toaster } from "@/components/ui/toaster";

const inter = Inter({
  variable: '--font-inter',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'ResumeCraft',
  description: 'Build your perfect resume with ResumeCraft.',
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
