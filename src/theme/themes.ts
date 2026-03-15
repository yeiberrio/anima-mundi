import { colors } from './colors';

export interface AppTheme {
  name: string;
  dark: boolean;
  colors: {
    background: string;
    card: string;
    text: string;
    textSecondary: string;
    primary: string;
    secondary: string;
    border: string;
    accent: string;
    notification: string;
  };
}

export const lightTheme: AppTheme = {
  name: 'Luz del Alba',
  dark: false,
  colors: {
    background: colors.cream,
    card: colors.white,
    text: colors.textMain,
    textSecondary: colors.textSoft,
    primary: colors.primary,
    secondary: colors.secondary,
    border: colors.border,
    accent: colors.greenHope,
    notification: colors.crimson,
  },
};

export const darkTheme: AppTheme = {
  name: 'Noche Profunda',
  dark: true,
  colors: {
    background: colors.darkBg,
    card: '#251D30',
    text: '#E8E0D4',
    textSecondary: '#9A8FB0',
    primary: '#7B5FAF',
    secondary: colors.secondary,
    border: colors.borderDark,
    accent: '#4CAF7D',
    notification: colors.crimson,
  },
};

export const sepiaTheme: AppTheme = {
  name: 'Pergamino',
  dark: false,
  colors: {
    background: '#F5E6C8',
    card: '#FDF2DC',
    text: '#3C2F1E',
    textSecondary: '#7A6B55',
    primary: '#5C3D2E',
    secondary: '#B8860B',
    border: '#D4C4A8',
    accent: '#556B2F',
    notification: colors.crimson,
  },
};

export const themes = {
  light: lightTheme,
  dark: darkTheme,
  sepia: sepiaTheme,
} as const;

export type ThemeKey = keyof typeof themes;
