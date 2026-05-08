import React, { createContext, useContext, useState, useEffect } from 'react';
import { ThemePlate } from '../types';
import { THEME_PLATES } from '../constants';

interface ThemeContextType {
  theme: ThemePlate;
  setTheme: (theme: ThemePlate) => void;
  config: typeof THEME_PLATES['slate'];
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setTheme] = useState<ThemePlate>(() => {
    const saved = localStorage.getItem('yajur-theme');
    return (saved as ThemePlate) || 'slate';
  });

  useEffect(() => {
    localStorage.setItem('yajur-theme', theme);
  }, [theme]);

  const config = THEME_PLATES[theme];

  return (
    <ThemeContext.Provider value={{ theme, setTheme, config }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) throw new Error('useTheme must be used within ThemeProvider');
  return context;
};
