import type {Metadata} from 'next';
import { Geist, Geist_Mono } from 'next/font/google'; // Corrected import for Geist
import './globals.css';

const geistSans = Geist({ // Corrected usage of Geist
  variable: '--font-geist-sans',
  subsets: ['latin'],
  display: 'swap', // Added display swap for better font loading
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
  display: 'swap', // Added display swap
});

export const metadata: Metadata = {
  title: 'NoteNest - Your Personal Note Organizer',
  description: 'An app that helps store and summarize your notes, built with Next.js and AI.',
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
      </body>
    </html>
  );
}
