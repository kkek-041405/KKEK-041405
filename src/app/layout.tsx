
import type {Metadata} from 'next';
import { Geist, Geist_Mono } from 'next/font/google'; // Corrected import to use next/font/google
import './globals.css';
import { Toaster } from "@/components/ui/toaster"; 

const geistSans = Geist({ // Corrected font import usage
  variable: '--font-geist-sans',
  subsets: ['latin'],
  display: 'swap',
});

const geistMono = Geist_Mono({ // Corrected font import usage
  variable: '--font-geist-mono',
  subsets: ['latin'],
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Your Name - Portfolio', // More generic title for root layout
  description: 'Personal portfolio website showcasing projects, skills, and experience of Your Name.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable}`}>
      <body className={`font-sans antialiased`}> {/* Use --font-geist-sans directly via font-sans Tailwind utility */}
        {children}
        <Toaster />
      </body>
    </html>
  );
}
