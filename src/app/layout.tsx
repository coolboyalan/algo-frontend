import type { Metadata } from 'next';
import './globals.css';
import { ThemeProvider } from '@/components/providers/theme-provider';
import { ToastProvider } from '@/components/providers/toast-provider';
import { LayoutWrapper } from '@/components/layout/layout-wrapper';
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
          <LayoutWrapper>
            {children}
          </LayoutWrapper>
          <ToastProvider />
        </ThemeProvider>
      </body>
    </html>
  );
}

