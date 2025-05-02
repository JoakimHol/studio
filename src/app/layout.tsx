import type { Metadata } from 'next';
import { Inter } from 'next/font/google'; // Changed font to Inter for better readability
import './globals.css';
import { cn } from '@/lib/utils';
import { Toaster } from '@/components/ui/toaster'; // Import Toaster

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-sans', // Use standard variable name
});

export const metadata: Metadata = {
  title: 'HelpDesk HQ',
  description: 'Your friendly neighborhood helpdesk solution.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={cn(
          'min-h-screen bg-background font-sans antialiased',
          inter.variable
        )}
      >
        <div className="relative flex min-h-screen flex-col">
          <div className="flex-1">{children}</div>
        </div>
        <Toaster /> {/* Add Toaster component */}
      </body>
    </html>
  );
}
