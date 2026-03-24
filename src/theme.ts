export const lightTheme = {
  name: 'light',
  colors: {
    primary: '#FF6321',
    primaryHover: '#E85A1B',
    secondary: '#1a1a1a',
    background: '#fdfdfd',
    surface: '#ffffff',
    surfaceHover: '#f4f4f5',
    foreground: '#09090b',
    foregroundMuted: '#71717a',
    border: '#e4e4e7',
    borderHover: '#a1a1aa',
    success: '#10B981',
    successBg: '#dcfce7',
    warning: '#F59E0B',
    warningBg: '#fef3c7',
    error: '#EF4444',
    errorBg: '#fee2e2',
    info: '#3B82F6',
    infoBg: '#dbeafe',
    rating: '#FBBF24',
    badge: {
      new: '#10B981',
      sale: '#EF4444',
      top: '#1a1a1a',
    },
  },
  shadows: {
    sm: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
    md: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
    lg: '0 10px 15px -3px rgb(0 0 0 / 0.1)',
    xl: '0 20px 25px -5px rgb(0 0 0 / 0.1)',
    primary: '0 10px 15px -3px rgb(255 99 33 / 0.3)',
  },
};

export const darkTheme = {
  name: 'dark',
  colors: {
    primary: '#FF6321',
    primaryHover: '#FF7A3D',
    secondary: '#ffffff',
    background: '#050505',
    surface: '#18181b',
    surfaceHover: '#27272a',
    foreground: '#f8f8f8',
    foregroundMuted: '#a1a1aa',
    border: '#27272a',
    borderHover: '#3f3f46',
    success: '#34d399',
    successBg: '#052e16',
    warning: '#fbbf24',
    warningBg: '#1c1917',
    error: '#f87171',
    errorBg: '#450a0a',
    info: '#60a5fa',
    infoBg: '#172554',
    rating: '#FBBF24',
    badge: {
      new: '#34d399',
      sale: '#f87171',
      top: '#ffffff',
    },
  },
  shadows: {
    sm: '0 1px 2px 0 rgb(0 0 0 / 0.3)',
    md: '0 4px 6px -1px rgb(0 0 0 / 0.4)',
    lg: '0 10px 15px -3px rgb(0 0 0 / 0.5)',
    xl: '0 20px 25px -5px rgb(0 0 0 / 0.6)',
    primary: '0 10px 15px -3px rgb(255 99 33 / 0.4)',
  },
};

export type Theme = typeof lightTheme;
export type ThemeColors = typeof lightTheme.colors;

export const defaultTheme = lightTheme;

export const applyTheme = (theme: Theme) => {
  const root = document.documentElement;
  
  Object.entries(theme.colors).map(([key, value]) => {
    if (typeof value === 'object') {
      Object.entries(value).map(([subKey, subValue]) => {
        root.style.setProperty(`--color-${key}-${subKey}`, subValue);
      });
    } else {
      root.style.setProperty(`--color-${key}`, value);
    }
  });
  
  Object.entries(theme.shadows).map(([key, value]) => {
    root.style.setProperty(`--shadow-${key}`, value);
  });
};
