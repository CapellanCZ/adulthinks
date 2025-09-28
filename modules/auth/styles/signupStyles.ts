import { StyleSheet, useColorScheme } from 'react-native';
import { Colors } from '@/theme/colors';

// Create theme-aware colors function
function getThemeColors(colorScheme: 'light' | 'dark' | null | undefined) {
  const isDark = colorScheme === 'dark';
  const colors = isDark ? Colors.dark : Colors.light;
  
  return {
    primary: colors.blue,
    background: colors.background,
    surface: colors.card,
    error: colors.red,
    errorBackground: isDark ? 'rgba(255, 69, 58, 0.1)' : '#FEE2E2',
    text: {
      primary: colors.text,
      secondary: colors.textMuted,
      caption: colors.textMuted,
      error: colors.red,
      link: colors.blue,
    },
    border: {
      light: colors.border,
      medium: colors.border,
    },
    icon: colors.icon,
  };
}

// Typography constants
const typography = {
  sizes: {
    small: 14,
    medium: 15,
    large: 16,
    heading: 24,
  },
  weights: {
    normal: '400' as const,
    medium: '500' as const,
    semibold: '600' as const,
  },
};

// Spacing constants
const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  xxxl: 30,
  huge: 40,
};

// Border radius constants
const borderRadius = {
  sm: 4,
  md: 8,
  lg: 12,
};

// Create theme-aware styles function
export function createSignupStyles(colorScheme: 'light' | 'dark' | null | undefined) {
  const colors = getThemeColors(colorScheme);
  
  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    header: {
      paddingHorizontal: spacing.xl,
      paddingTop: spacing.sm,
      paddingBottom: spacing.sm,
    },
    backButton: {
      padding: spacing.sm,
      borderRadius: borderRadius.md,
      backgroundColor: 'transparent',
      alignSelf: 'flex-start',
    },
    mainContent: {
      flex: 1,
      justifyContent: 'center',
      paddingBottom: '12%',
      paddingHorizontal: spacing.xl,
      gap: spacing.xl,
    },
    submitButton: {
      marginTop: spacing.sm,
    },
    errorContainer: {
      backgroundColor: colors.errorBackground,
      borderRadius: borderRadius.md,
      padding: spacing.md,
      marginBottom: -spacing.sm,
      flexDirection: 'row',
      alignItems: 'flex-start',
    },
    errorIcon: {
      marginRight: spacing.sm,
      marginTop: 1,
      flexShrink: 0,
    },
    errorText: {
      color: colors.error,
      fontSize: typography.sizes.small,
      fontWeight: typography.weights.medium,
      flex: 1,
      lineHeight: 20,
    },
    
    // Social login styles
    socialContainer: {
      gap: spacing.xxxl,
    },
    separatorContainer: {
      marginTop: 10,
      flexDirection: 'row',
      alignItems: 'center',
    },
    separatorLine: {
      flex: 1,
      height: 1,
      backgroundColor: colors.border.light,
    },
    separatorText: {
      marginHorizontal: spacing.lg,
      fontSize: typography.sizes.medium,
      color: colors.text.caption,
    },
    socialButtonsContainer: {
      flexDirection: 'row',
      gap: spacing.md,
    },
    socialButton: {
      flex: 1,
    },
    signupContainer: {
      alignItems: 'center',
      paddingTop: spacing.xl,
      paddingBottom: spacing.xl,
    },
    signupTextContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing.xs,
    },
    signupPrompt: {
      fontSize: typography.sizes.medium,
      color: colors.text.primary,
    },
    signupLink: {
      fontSize: typography.sizes.medium,
      color: colors.text.link,
      fontWeight: typography.weights.medium,
    },
  });
}

// Export theme constants for use in other components
export const theme = {
  getThemeColors,
  typography,
  spacing,
  borderRadius,
};

// Hook for using signup styles with current theme
export function useSignupStyles() {
  const colorScheme = useColorScheme();
  return createSignupStyles(colorScheme);
}
