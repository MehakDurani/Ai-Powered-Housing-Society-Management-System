// src/theme/colors.ts
export const Colors = {
  primary: {
    50: '#ECFDF5', 
    100: '#D1FAE5', 
    200: '#A7F3D0', 
    300: '#6EE7B7', 
    400: '#34D399', 
    500: '#059669', 
    600: '#047857', 
    700: '#065F46', 
    800: '#064E3B', 
    900: '#064E3B', 
  },
  neutral: {
    50: '#FAFAFA',
    100: '#F5F5F5',
    200: '#EEEEEE',
    300: '#E0E0E0',
    400: '#BDBDBD',
    500: '#9E9E9E',
    600: '#757575',
    700: '#616161',
    800: '#424242',
    900: '#212121',
  },
  background: {
    primary: '#FFFFFF',
    secondary: '#F8F9FA',
    tertiary: '#F1F8F4',
  },
  text: {
    primary: '#1A1A1A',
    secondary: '#666666',
    tertiary: '#999999',
    inverse: '#FFFFFF',
  },
  error: {
    light: '#EF5350',
    main: '#F44336',
    dark: '#C62828',
  },
  warning: {
    light: '#FFB74D',
    main: '#FF9800',
    dark: '#F57C00',
  },
  success: {
    light: '#66BB6A',
    main: '#4CAF50',
    dark: '#388E3C',
  },
  info: {
    light: '#4FC3F7',
    main: '#03A9F4',
    dark: '#0288D1',
  },
  border: {
    light: '#E8E8E8',
    main: '#D1D1D1',
    dark: '#BDBDBD',
  },
  shadow: {
    light: 'rgba(76, 175, 80, 0.1)',
    medium: 'rgba(76, 175, 80, 0.2)',
    dark: 'rgba(76, 175, 80, 0.3)',
  },
} as const;

export type ColorScheme = typeof Colors;