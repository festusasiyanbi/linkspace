import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from 'react';
import {Appearance, ColorSchemeName} from 'react-native';
import { ThemeColors, ThemeType } from '../types/Theme';

type ThemeContextType = {
  theme: ThemeColors;
  toggleMode: () => void;
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

const theme: ThemeType = {
  light: {
    background: '#F1F1F1',
    text: '#0C0C0C',
    border: '#0C0C0C',
    icon: '#0C0C0C',
    overlay: 'rgba(0, 0, 0, 0.5)',
    primary: '#604CC3',
    secondary: '#AF47D2',
    tertiary: '#B1AFFF',
    accent: '#2D3E8B',
    highlight: '#7752d5',
  },
  dark: {
    background: '#000000',
    text: '#F1F1F1',
    border: '#F1F1F1',
    icon: '#F1F1F1',
    overlay: 'rgba(0, 0, 0, 0.5)',
    primary: '#604CC3',
    secondary: '#AF47D2',
    tertiary: '#B1AFFF',
    accent: '#6200EE',
    highlight: '#000',
  },
};

export const ThemeProvider: React.FC<{children: ReactNode}> = ({children}) => {
  const [mode, setMode] = useState<ColorSchemeName>(
    Appearance.getColorScheme(),
  );

  useEffect(() => {
    const subscription = Appearance.addChangeListener(({colorScheme}) => {
      setMode(colorScheme);
    });

    return () => {
      subscription.remove();
    };
  }, []);

  const toggleMode = () => {
    setMode(prevMode => (prevMode === 'light' ? 'dark' : 'light'));
  };

  const currentTheme = theme[mode || 'light'];

  return (
    <ThemeContext.Provider value={{theme: currentTheme, toggleMode}}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
