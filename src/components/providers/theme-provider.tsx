'use client';

import * as React from 'react';
import { ThemeProvider as NextThemesProvider } from 'next-themes';
import { type ThemeProviderProps } from 'next-themes';
import { useSettingsStore } from '@/store/settings-store';
import { useTheme } from 'next-themes';

function ThemeSync({ children }: { children: React.ReactNode }) {
  const { theme, setTheme } = useTheme();
  const { themeMode, currentBaseTheme, setCurrentBaseTheme, customColors, fontFamily } = useSettingsStore();
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  // Sync current base theme with actual theme
  React.useEffect(() => {
    if (!mounted || !theme) return;

    if (themeMode === 'custom') {
      // In custom mode, track which base theme we're on
      if (theme === 'dark' || theme === 'light') {
        setCurrentBaseTheme(theme as 'light' | 'dark');
      }
    } else {
      // In light/dark mode, sync the theme
      if (theme !== themeMode) {
        setTheme(themeMode);
      }
      setCurrentBaseTheme(themeMode as 'light' | 'dark');
    }
  }, [theme, themeMode, mounted, setTheme, setCurrentBaseTheme]);

  // Apply custom CSS variables
  React.useEffect(() => {
    if (!mounted) return;

    const root = document.documentElement;

    if (themeMode === 'custom') {
      // Apply custom colors for current base theme
      const colors = customColors[currentBaseTheme];

      Object.entries(colors).forEach(([key, value]) => {
        const cssVar = `--${key.replace(/([A-Z])/g, '-$1').toLowerCase()}`;
        root.style.setProperty(cssVar, value);
      });
    } else {
      // Clear custom variables when not in custom mode
      const colors = customColors.light;
      Object.keys(colors).forEach((key) => {
        const cssVar = `--${key.replace(/([A-Z])/g, '-$1').toLowerCase()}`;
        root.style.removeProperty(cssVar);
      });
    }
  }, [themeMode, currentBaseTheme, customColors, mounted]);

  // Apply font family
  React.useEffect(() => {
    if (!mounted) return;
    document.documentElement.setAttribute('data-font', fontFamily);
  }, [fontFamily, mounted]);

  if (!mounted) {
    return null;
  }

  return <>{children}</>;
}

export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  return (
    <NextThemesProvider {...props}>
      <ThemeSync>{children}</ThemeSync>
    </NextThemesProvider>
  );
}
