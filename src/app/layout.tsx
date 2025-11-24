// app/layout.tsx (KEEP AS SERVER COMPONENT)
import type { Metadata } from 'next';
import './globals.css';
import { ThemeProvider } from '@/components/providers/theme-provider';
import { ToastProvider } from '@/components/providers/toast-provider';
import { ConditionalLayout } from '@/components/layout/conditional-layout';
import { inter, poppins, raleway, plusJakarta, workSans, dmSans, spaceGrotesk } from '@/lib/fonts';

export const metadata: Metadata = {
  title: 'Admin Panel',
  description: 'Dynamic admin panel with theme customization',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`
          ${inter.variable}
          ${poppins.variable}
          ${raleway.variable}
          ${plusJakarta.variable}
          ${workSans.variable}
          ${dmSans.variable}
          ${spaceGrotesk.variable}
        `}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange={false}
        >
          <ConditionalLayout>
            {children}
          </ConditionalLayout>
          <ToastProvider />
        </ThemeProvider>
      </body>
    </html>
  );
}

