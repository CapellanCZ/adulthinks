import React from 'react';
import { Pressable, useColorScheme } from 'react-native';
import { AlertCircle, Eye, EyeOff, SmilePlus } from 'lucide-react-native';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Text } from '@/components/ui/text';
import { View } from '@/components/ui/view';
import { ForgotPasswordBottomSheet } from './ForgotPasswordBottomSheet';
import { SocialLoginButtons } from '../../auth/components/signup/SocialLoginButtons';
import { useLoginStyles, theme } from '../styles/loginStyles';

interface LoginFormProps {
  // Form data
  email: string;
  password: string;
  showPassword: boolean;
  rememberMe: boolean;
  loading: boolean;
  
  // Errors
  emailError?: string;
  passwordError?: string;
  generalError?: string;
  
  // Password reset
  resetEmail: string;
  isResetBottomSheetVisible: boolean;
  resetLoading: boolean;
  resetError?: string;
  resetSuccess: boolean;
  resetSuccessMessage?: string;
  
  // Form actions
  onEmailChange: (email: string) => void;
  onPasswordChange: (password: string) => void;
  onTogglePasswordVisibility: () => void;
  onRememberMeChange: (remember: boolean) => void;
  
  // Password reset actions
  onResetEmailChange: (email: string) => void;
  onOpenPasswordReset: () => void;
  onClosePasswordReset: () => void;
  onSubmitPasswordReset: () => Promise<void>;
  
  // Form submission
  onSubmit: () => Promise<void>;
  
  // Social login
  onGoogleLogin: () => Promise<void>;
  onAppleLogin: () => Promise<void>;
  
  // Navigation
  onNavigateToSignup: () => void;
}

export function LoginForm({
  email,
  password,
  showPassword,
  rememberMe,
  loading,
  emailError,
  passwordError,
  generalError,
  resetEmail,
  isResetBottomSheetVisible,
  resetLoading,
  resetError,
  resetSuccess,
  resetSuccessMessage,
  onEmailChange,
  onPasswordChange,
  onTogglePasswordVisibility,
  onRememberMeChange,
  onResetEmailChange,
  onOpenPasswordReset,
  onClosePasswordReset,
  onSubmitPasswordReset,
  onSubmit,
  onGoogleLogin,
  onAppleLogin,
  onNavigateToSignup,
}: LoginFormProps) {
  const styles = useLoginStyles();
  const colorScheme = useColorScheme();
  const colors = theme.getThemeColors(colorScheme);
  
  return (
    <>
      {/* Header */}
      <View style={styles.headerContainer}>
        
        <Text 
          variant="heading" 
          style={styles.headerTitle}
        >
          Welcome back,
        </Text>
        <Text 
          variant="caption"
        >
          We are happy to see you here again. Enter your credentials to log in.
        </Text>
      </View>

      {/* Error Message */}
      {generalError && (
        <View 
          style={styles.errorContainer}
          accessibilityRole="alert"
          accessibilityLiveRegion="polite"
        >
          <AlertCircle 
            size={18} 
            color={colors.error} 
            style={styles.errorIcon}
          />
          <Text style={styles.errorText}>{generalError}</Text>
        </View>
      )}

      {/* Form Inputs */}
      <View style={styles.inputContainer}>
        <Input
          variant="outline"
          placeholder="Enter your email"
          value={email}
          onChangeText={onEmailChange}
          autoComplete="email"
          keyboardType="email-address"
          error={emailError}
          editable={!loading}
          accessibilityLabel="Email address"
          accessibilityHint="Enter your email address to log in"
          autoCapitalize="none"
          autoCorrect={false}
        />

        <Input
          variant="outline"
          placeholder="Enter your password"
          value={password}
          onChangeText={onPasswordChange}
          error={passwordError}
          keyboardType="visible-password"
          secureTextEntry={!showPassword}
          editable={!loading}
          accessibilityLabel="Password"
          accessibilityHint="Enter your password to log in"
          autoCapitalize="none"
          autoCorrect={false}
          rightComponent={
            <Pressable 
              onPress={onTogglePasswordVisibility}
              accessibilityRole="button"
              accessibilityLabel={showPassword ? "Hide password" : "Show password"}
              accessibilityHint={showPassword ? "Tap to hide your password" : "Tap to show your password"}
            >
              {showPassword ? (
                <Eye size={22} color={colors.icon} />
              ) : (
                <EyeOff size={22} color={colors.icon} />
              )}
            </Pressable>
          }
        />
      </View>

      {/* Options */}
      <View style={styles.optionsContainer}>
        <Checkbox
          checked={rememberMe}
          onCheckedChange={onRememberMeChange}
          label="Remember me"
          labelStyle={styles.checkboxLabel}
        />

        <Pressable 
          onPress={onOpenPasswordReset}
          accessibilityRole="button"
          accessibilityLabel="Forgot password"
          accessibilityHint="Tap to reset your password via email"
        >
          <Text
            variant="caption"
            style={styles.forgotPasswordText}
          >
            Forgot Password?
          </Text>
        </Pressable>
      </View>

      {/* Login Button */}
      <Button
        style={styles.loginButton}
        onPress={onSubmit}
        disabled={loading}
        accessibilityLabel={loading ? "Logging in" : "Log in"}
        accessibilityHint="Tap to log in to your account"
      >
        {loading ? "Logging in..." : "Login"}
      </Button>

      {/* Social Login */}
      <SocialLoginButtons
        onGooglePress={onGoogleLogin}
        onApplePress={onAppleLogin}
      />

      {/* Sign Up Link */}
      <View style={styles.signupContainer}>
        <View style={styles.signupTextContainer}>
          <Text style={styles.signupPrompt}>Don&apos;t have an account? </Text>
          <Pressable 
            onPress={onNavigateToSignup}
            accessibilityRole="button"
            accessibilityLabel="Sign up"
            accessibilityHint="Tap to create a new account"
          >
            <Text style={styles.signupLink}>
              Sign Up
            </Text>
          </Pressable>
        </View>
      </View>

      {/* Forgot Password Bottom Sheet */}
      <ForgotPasswordBottomSheet
        isVisible={isResetBottomSheetVisible}
        onClose={onClosePasswordReset}
        resetEmail={resetEmail}
        onResetEmailChange={onResetEmailChange}
        onSubmit={onSubmitPasswordReset}
        loading={resetLoading}
        error={resetError || null}
        success={resetSuccess}
        successMessage={resetSuccessMessage || null}
      />
    </>
  );
}

