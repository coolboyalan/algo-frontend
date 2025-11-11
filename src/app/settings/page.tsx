'use client';

import React from 'react';
import { useTheme } from 'next-themes';
import { useSettingsStore, type FontFamily } from '@/store/settings-store';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Palette, Type, RotateCcw } from 'lucide-react';

export default function SettingsPage() {
  const { theme, setTheme } = useTheme();
  const {
    themeMode,
    setThemeMode,
    currentBaseTheme,
    setCurrentBaseTheme,
    customColors,
    updateCustomColor,
    resetToDefaults,
    fontFamily,
    setFontFamily,
  } = useSettingsStore();

  const handleThemeModeChange = (value: string) => {
    const mode = value as 'light' | 'dark' | 'custom';
    setThemeMode(mode);

    if (mode === 'light' || mode === 'dark') {
      setTheme(mode);
      setCurrentBaseTheme(mode);
    }
  };

  const handleBaseThemeChange = (value: string) => {
    const baseTheme = value as 'light' | 'dark';
    setCurrentBaseTheme(baseTheme);
    setTheme(baseTheme);
  };

  const handleColorChange = (key: string, value: string) => {
    updateCustomColor(key as any, value);
  };

  const convertHSLToHex = (hsl: string): string => {
    try {
      const [h, s, l] = hsl.split(' ').map(v => parseFloat(v.replace('%', '')));
      const hDecimal = h / 360;
      const sDecimal = s / 100;
      const lDecimal = l / 100;

      const hue2rgb = (p: number, q: number, t: number) => {
        if (t < 0) t += 1;
        if (t > 1) t -= 1;
        if (t < 1 / 6) return p + (q - p) * 6 * t;
        if (t < 1 / 2) return q;
        if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
        return p;
      };

      let r, g, b;
      if (sDecimal === 0) {
        r = g = b = lDecimal;
      } else {
        const q = lDecimal < 0.5 ? lDecimal * (1 + sDecimal) : lDecimal + sDecimal - lDecimal * sDecimal;
        const p = 2 * lDecimal - q;
        r = hue2rgb(p, q, hDecimal + 1 / 3);
        g = hue2rgb(p, q, hDecimal);
        b = hue2rgb(p, q, hDecimal - 1 / 3);
      }

      const toHex = (x: number) => {
        const hex = Math.round(x * 255).toString(16);
        return hex.length === 1 ? '0' + hex : hex;
      };

      return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
    } catch (error) {
      return '#000000';
    }
  };

  const convertHexToHSL = (hex: string): string => {
    const r = parseInt(hex.slice(1, 3), 16) / 255;
    const g = parseInt(hex.slice(3, 5), 16) / 255;
    const b = parseInt(hex.slice(5, 7), 16) / 255;

    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    let h = 0, s, l = (max + min) / 2;

    if (max === min) {
      h = s = 0;
    } else {
      const d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
      switch (max) {
        case r: h = ((g - b) / d + (g < b ? 6 : 0)) / 6; break;
        case g: h = ((b - r) / d + 2) / 6; break;
        case b: h = ((r - g) / d + 4) / 6; break;
      }
    }

    return `${Math.round(h * 360)} ${Math.round(s * 100)}% ${Math.round(l * 100)}%`;
  };

  const colorKeys = Object.keys(customColors.light) as Array<keyof typeof customColors.light>;

  const colorLabels: Record<string, string> = {
    heading: 'Heading',
    subheading: 'Subheading',
    text: 'Paragraph Text',
    primary: 'Primary Color',
    secondary: 'Secondary Color',
    tabBg: 'Tab Background',
    tabSelected: 'Selected Tab',
    tabHover: 'Tab Hover',
    sidebarBg: 'Sidebar Background',
    headerBg: 'Header Background',
    background: 'Page Background',
    foreground: 'Foreground',
    border: 'Border',
    input: 'Input Background',
    ring: 'Focus Ring',
  };

  const fontOptions: { value: FontFamily; label: string; description: string }[] = [
    { value: 'inter', label: 'Inter', description: 'Modern & Readable - Perfect for UIs' },
    { value: 'poppins', label: 'Poppins', description: 'Geometric & Friendly - Great for headings' },
    { value: 'raleway', label: 'Raleway', description: 'Elegant & Clean - Professional look' },
    { value: 'plus-jakarta', label: 'Plus Jakarta Sans', description: 'Contemporary & Stylish' },
    { value: 'work-sans', label: 'Work Sans', description: 'Optimized for screens - Highly readable' },
    { value: 'dm-sans', label: 'DM Sans', description: 'Low contrast & Modern' },
    { value: 'space-grotesk', label: 'Space Grotesk', description: 'Unique & Eye-catching' },
  ];

  return (
    <div className="container mx-auto p-6">
      <div className="max-w-5xl space-y-8">
        <div>
          <h1 className="text-3xl font-bold text-heading">Settings</h1>
          <p className="text-subheading mt-2">Customize your admin panel appearance and preferences.</p>
        </div>

        <Separator />

        {/* Theme Mode Selection */}
        <div className="space-y-6 bg-card p-6 rounded-lg border">
          <div className="flex items-center gap-3">
            <Palette className="h-6 w-6 text-primary" />
            <div>
              <h2 className="text-xl font-semibold text-heading">Theme Mode</h2>
              <p className="text-sm text-subheading mt-1">
                Choose your preferred color scheme
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="theme-mode">Theme Mode</Label>
              <Select value={themeMode} onValueChange={handleThemeModeChange}>
                <SelectTrigger id="theme-mode">
                  <SelectValue placeholder="Select theme" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="light">Light</SelectItem>
                  <SelectItem value="dark">Dark</SelectItem>
                  <SelectItem value="custom">Custom</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {themeMode === 'custom' && (
              <div className="space-y-2">
                <Label htmlFor="base-theme">Base Theme</Label>
                <Select value={currentBaseTheme} onValueChange={handleBaseThemeChange}>
                  <SelectTrigger id="base-theme">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="light">Light Base</SelectItem>
                    <SelectItem value="dark">Dark Base</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}
          </div>

          {themeMode === 'custom' && (
            <Badge variant="secondary" className="w-fit">
              Currently editing: {currentBaseTheme} theme colors
            </Badge>
          )}
        </div>

        {/* Font Selection */}
        <div className="space-y-6 bg-card p-6 rounded-lg border">
          <div className="flex items-center gap-3">
            <Type className="h-6 w-6 text-primary" />
            <div>
              <h2 className="text-xl font-semibold text-heading">Typography</h2>
              <p className="text-sm text-subheading mt-1">
                Select your preferred font family
              </p>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="font-family">Font Family</Label>
            <Select value={fontFamily} onValueChange={(value) => setFontFamily(value as FontFamily)}>
              <SelectTrigger id="font-family" className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {fontOptions.map((font) => (
                  <SelectItem key={font.value} value={font.value}>
                    <div className="flex flex-col">
                      <span className="font-medium">{font.label}</span>
                      <span className="text-xs text-muted-foreground">{font.description}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <p className="text-xs text-muted-foreground mt-2">
              ✨ All fonts are optimized and preloaded for maximum performance
            </p>
          </div>

          {/* Font Preview */}
          <div className="p-4 border rounded-md bg-background/50">
            <p className="text-xs text-muted-foreground mb-2">Preview:</p>
            <h3 className="text-2xl font-bold text-heading mb-2">The Quick Brown Fox</h3>
            <p className="text-subheading">Jumps over the lazy dog 0123456789</p>
          </div>
        </div>

        {/* Custom Theme Colors */}
        {themeMode === 'custom' && (
          <div className="space-y-6 bg-card p-6 rounded-lg border">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-semibold text-heading">Custom Colors</h2>
                <p className="text-sm text-subheading mt-1">
                  Customize colors for {currentBaseTheme} mode
                </p>
              </div>
              <Button onClick={resetToDefaults} variant="outline" size="sm">
                <RotateCcw className="h-4 w-4 mr-2" />
                Reset
              </Button>
            </div>

            {/* Color Pickers */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {colorKeys.map((key) => {
                const hslValue = customColors[currentBaseTheme][key];
                const hexValue = convertHSLToHex(hslValue);

                return (
                  <div key={key} className="flex items-center gap-3 p-3 rounded-md border bg-background/50">
                    <Input
                      type="color"
                      value={hexValue}
                      onChange={(e) => {
                        const hsl = convertHexToHSL(e.target.value);
                        handleColorChange(key, hsl);
                      }}
                      className="w-14 h-14 cursor-pointer border-2"
                    />
                    <div className="flex-1 min-w-0">
                      <Label className="text-sm font-medium">
                        {colorLabels[key] || key}
                      </Label>
                      <Input
                        type="text"
                        value={hslValue}
                        onChange={(e) => handleColorChange(key, e.target.value)}
                        className="mt-1 font-mono text-xs h-8"
                        placeholder="H S% L%"
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
