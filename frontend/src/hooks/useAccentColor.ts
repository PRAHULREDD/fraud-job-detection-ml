import { useEffect, useState } from 'react';

const ACCENT_COLORS = {
  cyan: '189 94% 55%',
  green: '142 76% 45%',
  red: '0 84% 60%',
  orange: '25 95% 53%',
  purple: '271 76% 53%',
} as const;

export type AccentColorType = keyof typeof ACCENT_COLORS;

export const useAccentColor = () => {
  const [accentColor, setAccentColorState] = useState<AccentColorType>(() => {
    return (localStorage.getItem('accent-color') as AccentColorType) || 'cyan';
  });

  useEffect(() => {
    const root = document.documentElement;
    const hslValue = ACCENT_COLORS[accentColor];
    
    // Update CSS variables
    root.style.setProperty('--accent', hslValue);
    root.style.setProperty('--ring', hslValue);
    root.style.setProperty('--glow-primary', hslValue);
    
    // Save to localStorage
    localStorage.setItem('accent-color', accentColor);
  }, [accentColor]);

  const setAccentColor = (color: AccentColorType) => {
    setAccentColorState(color);
  };

  return { accentColor, setAccentColor, availableColors: ACCENT_COLORS };
};
