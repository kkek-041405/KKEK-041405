
import type {Metadata} from 'next';
import { Inter, JetBrains_Mono } from 'next/font/google';
import './globals.css';
import { Toaster } from "@/components/ui/toaster"; 
import { cn } from '@/lib/utils';
import { PortfolioHeader } from '@/components/portfolio-header';
import { PortfolioFooter } from '@/components/portfolio-footer';

const inter = Inter({ 
  variable: '--font-inter',
  subsets: ['latin'],
  display: 'swap',
});

const jetbrainsMono = JetBrains_Mono({ 
  variable: '--font-jetbrains-mono',
  subsets: ['latin'],
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'K. Komal Eshwara Kumar (KKEK) - Portfolio | Android Developer', 
  description: 'Explore the portfolio of K. Komal Eshwara Kumar (KKEK), a final-year CSE student and Android Developer specializing in Kotlin, Jetpack Compose, and Firebase.',
  keywords: ['K. Komal Eshwara Kumar', 'KKEK', 'Portfolio', 'Android Developer', 'Full-Stack Developer', 'Kotlin', 'Jetpack Compose', 'Next.js', 'React', 'Firebase', 'Genkit', 'CSE', 'Software Developer'],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${jetbrainsMono.variable} dark`} suppressHydrationWarning>
      <body className={`font-sans antialiased`} suppressHydrationWarning={true}>
        <PortfolioHeader />
        <div className={cn("flex-1")}>
          {children}
        </div>
        <PortfolioFooter />
        <Toaster />
      </body>
    </html>
  );
}
