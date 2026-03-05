
import type {Metadata} from 'next';
import { Inter, JetBrains_Mono } from 'next/font/google';
import './globals.css';
import { Toaster } from "@/components/ui/toaster"; 
import { cn } from '@/lib/utils';

const geistSans = Inter({ 
  variable: '--font-geist-sans',
  subsets: ['latin'],
  display: 'swap',
});

const geistMono = JetBrains_Mono({ 
  variable: '--font-geist-mono',
  subsets: ['latin'],
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'K. Komal Eshwara Kumar (KKEK) - Portfolio | Full-Stack Developer & AI Enthusiast', 
  description: 'Explore the portfolio of K. Komal Eshwara Kumar (KKEK), a 3rd Year CSE student, Full-Stack Developer, and AI Enthusiast. Discover projects built with React, Next.js, Firebase, and Genkit.',
  keywords: ['K. Komal Eshwara Kumar', 'KKEK', 'Portfolio', 'Full-Stack Developer', 'Web Developer', 'AI Enthusiast', 'Next.js', 'React', 'Firebase', 'Genkit', 'CSE', 'Software Developer'],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable} dark`} suppressHydrationWarning>
      <body className={`font-sans antialiased bg-black overflow-hidden`} suppressHydrationWarning={true}>
        <div className={cn("flex-1")}>
          {children}
        </div>
        <Toaster />
      </body>
    </html>
  );
}
