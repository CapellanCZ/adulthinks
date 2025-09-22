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
export function createLoginStyles(colorScheme: 'light' | 'dark' | null | undefined) {
  const colors = getThemeColors(colorScheme);
  
  return StyleSheet.create({
    // Container styles
    container: {
      flex: 1,
      padding: spacing.xl,
      backgroundColor: colors.background,
    },
    centeredContent: {
      flex: 1,
      justifyContent: 'center',
    },
    
    // Header styles
    headerContainer: {
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: spacing.huge,
    },
    headerTitle: {
      marginBottom: spacing.sm,
    },
    
    // Error styles
    errorContainer: {
      backgroundColor: colors.errorBackground,
      borderRadius: borderRadius.md,
      padding: spacing.md,
      marginBottom: spacing.lg,
      flexDirection: 'row',
      alignItems: 'center',
    },
    errorIcon: {
      marginRight: spacing.sm,
    },
    errorText: {
      color: colors.error,
      fontSize: typography.sizes.small,
      fontWeight: typography.weights.medium,
      flex: 1,
    },
    
    // Form styles
    inputContainer: {
      gap: spacing.lg,
    },
    optionsContainer: {
      marginTop: spacing.sm,
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    checkboxLabel: {
      fontSize: typography.sizes.large,
      color: colors.text.primary,
    },
    forgotPasswordText: {
      textAlign: 'right',
      fontSize: typography.sizes.medium,
      color: colors.text.link,
    },
    
    // Button styles
    loginButton: {
      marginTop: spacing.xxxl,
      marginBottom: spacing.lg, // Reduced from xxxl to lg
    },
    
    // Social login styles
    separatorContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      marginTop: spacing.lg,
      marginBottom: spacing.xxxl,
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
    socialButtonContainer: {
      flexDirection: 'row',
      gap: spacing.md,
    },
    socialButton: {
      flex: 1,
    },
    
    // Sign up link styles - FIXED: No longer absolute positioned
    signupContainer: {
      alignItems: 'center',
      paddingTop: spacing.xl,
      paddingBottom: spacing.xl,
      backgroundColor: colors.background,
    },
    signupTextContainer: {
      flexDirection: 'row',
    },
    signupPrompt: {
      fontSize: typography.sizes.medium,
      color: colors.text.primary,
    },
    signupLink: {
      fontSize: typography.sizes.medium,
      color: colors.text.link,
    },
    
    // Error boundary styles
    errorBoundaryContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      padding: spacing.xl,
      backgroundColor: colors.background,
    },
    errorBoundaryContent: {
      alignItems: 'center',
      maxWidth: 300,
    },
    errorBoundaryIcon: {
      marginBottom: spacing.xl,
    },
    errorBoundaryTitle: {
      marginBottom: spacing.md,
      textAlign: 'center',
      fontSize: typography.sizes.heading,
      fontWeight: typography.weights.semibold,
      color: colors.text.primary,
    },
    errorBoundaryMessage: {
      textAlign: 'center',
      fontSize: typography.sizes.large,
      color: colors.text.secondary,
      marginBottom: spacing.xxl,
      lineHeight: 22,
    },
    errorBoundaryRetryButton: {
      paddingHorizontal: 32,
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

// Hook for using login styles with current theme
export function useLoginStyles() {
  const colorScheme = useColorScheme();
  return createLoginStyles(colorScheme);
}
