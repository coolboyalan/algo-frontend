import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type ThemeMode = 'light' | 'dark' | 'custom';

export interface CustomColors {
  heading: string;
  subheading: string;
  text: string;
  primary: string;
  secondary: string;
  tabBg: string;
  tabSelected: string;
  tabHover: string;
  sidebarBg: string;
  headerBg: string;
  background: string;
  foreground: string;
  border: string;
  input: string;
  ring: string;
}

export interface ThemeColors {
  light: CustomColors;
  dark: CustomColors;
}

export type FontFamily = 'inter' | 'poppins' | 'raleway' | 'plus-jakarta' | 'work-sans' | 'dm-sans' | 'space-grotesk';

interface SettingsState {
  themeMode: ThemeMode;
  currentBaseTheme: 'light' | 'dark';
  customColors: ThemeColors;
  fontFamily: FontFamily;
  sidebarOpen: boolean;
  setThemeMode: (mode: ThemeMode) => void;
  setCurrentBaseTheme: (theme: 'light' | 'dark') => void;
  updateCustomColor: (key: keyof CustomColors, value: string) => void;
  setFontFamily: (font: FontFamily) => void;
  toggleSidebar: () => void;
  setSidebarOpen: (open: boolean) => void;
  resetToDefaults: () => void;
}

const defaultLightColors: CustomColors = {
  heading: '0 0% 10%',
  subheading: '0 0% 29%',
  text: '0 0% 42%',
  primary: '217 91% 60%',
  secondary: '0 0% 96.1%',
  tabBg: '0 0% 96%',
  tabSelected: '217 91% 60%',
  tabHover: '0 0% 90%',
  sidebarBg: '0 0% 98%',
  headerBg: '0 0% 100%',
  background: '0 0% 100%',
  foreground: '0 0% 3.9%',
  border: '0 0% 89.8%',
  input: '0 0% 89.8%',
  ring: '217 91% 60%',
};

const defaultDarkColors: CustomColors = {
  heading: '0 0% 100%',
  subheading: '0 0% 82%',
  text: '0 0% 63%',
  primary: '209 100% 60%',
  secondary: '0 0% 14.9%',
  tabBg: '0 0% 12%',
  tabSelected: '209 100% 60%',
  tabHover: '0 0% 18%',
  sidebarBg: '0 0% 8%',
  headerBg: '0 0% 3.9%',
  background: '0 0% 3.9%',
  foreground: '0 0% 98%',
  border: '0 0% 14.9%',
  input: '0 0% 14.9%',
  ring: '209 100% 60%',
};

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      themeMode: 'light',
      currentBaseTheme: 'light',
      customColors: {
        light: defaultLightColors,
        dark: defaultDarkColors,
      },
      fontFamily: 'inter',
      sidebarOpen: true,
      setThemeMode: (mode) => set({ themeMode: mode }),
      setCurrentBaseTheme: (theme) => set({ currentBaseTheme: theme }),
      updateCustomColor: (key, value) =>
        set((state) => ({
          themeMode: 'custom',
          customColors: {
            ...state.customColors,
            [state.currentBaseTheme]: {
              ...state.customColors[state.currentBaseTheme],
              [key]: value,
            },
          },
        })),
      setFontFamily: (font) => set({ fontFamily: font }),
      toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
      setSidebarOpen: (open) => set({ sidebarOpen: open }),
      resetToDefaults: () =>
        set((state) => ({
          customColors: {
            ...state.customColors,
            [state.currentBaseTheme]: state.currentBaseTheme === 'light' ? defaultLightColors : defaultDarkColors,
          },
        })),
    }),
    {
      name: 'admin-settings',
    }
  )
);
