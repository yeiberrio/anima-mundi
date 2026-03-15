export const colors = {
  primary: '#4A2F6E',
  primaryLight: '#6B4F8E',
  secondary: '#C9963A',
  secondaryLight: '#D4AD5E',
  cream: '#FAF6F0',
  darkBg: '#1A1420',
  greenHope: '#2D6A4F',
  crimson: '#8B2635',
  textMain: '#2C2C2C',
  textSoft: '#6B6B6B',
  white: '#FFFFFF',
  black: '#000000',
  border: '#E5E0D8',
  borderDark: '#3A2A4E',
} as const;

export type ColorKey = keyof typeof colors;
