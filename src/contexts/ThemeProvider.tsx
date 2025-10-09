import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LIGHT_THEME, DARK_THEME } from '../lib/theme';

type ThemeMode = 'light' | 'dark' | 'system';
type Theme = typeof LIGHT_THEME;

interface ThemeContextType {
  theme: Theme;
  themeMode: ThemeMode;
  toggleTheme: () => void;
  setThemeMode: (mode: ThemeMode) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [themeMode, setThemeMode] = useState<ThemeMode>('light');
  const [currentTheme, setCurrentTheme] = useState<Theme>(LIGHT_THEME);

  useEffect(() => {
    loadTheme();
  }, []);

  useEffect(() => {
    applyTheme();
    saveTheme();
  }, [themeMode]);

  const loadTheme = async () => {
    try {
      const savedTheme = await AsyncStorage.getItem('themeMode');
      if (savedTheme) {
        setThemeMode(savedTheme as ThemeMode);
      }
    } catch (error) {
      console.error('Error loading theme:', error);
    }
  };

  const saveTheme = async () => {
    try {
      await AsyncStorage.setItem('themeMode', themeMode);
    } catch (error) {
      console.error('Error saving theme:', error);
    }
  };

  const applyTheme = () => {
    let themeToApply: Theme;
    
    if (themeMode === 'system') {
      const systemTheme = Appearance.getColorScheme();
      themeToApply = systemTheme === 'dark' ? DARK_THEME : LIGHT_THEME;
    } else {
      themeToApply = themeMode === 'dark' ? DARK_THEME : LIGHT_THEME;
    }
    
    setCurrentTheme(themeToApply);
  };

  const toggleTheme = () => {
    setThemeMode(prev => {
      if (prev === 'light') return 'dark';
      if (prev === 'dark') return 'system';
      return 'light';
    });
  };

  return (
    <ThemeContext.Provider value={{ 
      theme: currentTheme, 
      themeMode, 
      toggleTheme, 
      setThemeMode 
    }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider');
  }
  return context;
}

// We need to import Appearance for system theme detection
import { Appearance } from 'react-native';