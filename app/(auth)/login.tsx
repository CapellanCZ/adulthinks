import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';

import { AvoidKeyboard } from '@/components/ui/avoid-keyboard';
import { View } from '@/components/ui/view';
import { LoginForm } from '@/modules/auth/components/LoginForm';
import { ErrorBoundary } from '@/modules/auth/components/ErrorBoundary';
import { useLogin } from '@/modules/auth/hooks/useLogin';
import { useLoginStyles } from '@/modules/auth/styles/loginStyles';

export default function LoginScreen() {
  const loginHook = useLogin();
  const styles = useLoginStyles();

  return (
    <ErrorBoundary>
      <SafeAreaView style={styles.container}>
        {/* Main Content - Centered */}
        <View style={styles.centeredContent}>
          <LoginForm
            // Form data
            email={loginHook.formData.email}
            password={loginHook.formData.password}
            showPassword={loginHook.showPassword}
            rememberMe={loginHook.rememberMe}
            loading={loginHook.loading}
            
            // Errors
            emailError={loginHook.errors.email}
            passwordError={loginHook.errors.password}
            generalError={loginHook.errors.general}
            
            // Password reset
            resetEmail={loginHook.passwordReset.email}
            isResetBottomSheetVisible={loginHook.passwordReset.isBottomSheetVisible}
            resetLoading={loginHook.passwordReset.loading}
            resetError={loginHook.passwordReset.error}
            resetSuccess={loginHook.passwordReset.success}
            resetSuccessMessage={loginHook.passwordReset.successMessage}
            
            // Form actions
            onEmailChange={loginHook.setEmail}
            onPasswordChange={loginHook.setPassword}
            onTogglePasswordVisibility={loginHook.togglePasswordVisibility}
            onRememberMeChange={loginHook.setRememberMe}
            
            // Password reset actions
            onResetEmailChange={loginHook.setResetEmail}
            onOpenPasswordReset={loginHook.openPasswordResetBottomSheet}
            onClosePasswordReset={loginHook.closePasswordResetBottomSheet}
            onSubmitPasswordReset={loginHook.submitPasswordReset}
            
            // Form submission
            onSubmit={loginHook.handleLogin}
            
            // Social login
            onGoogleLogin={loginHook.handleGoogleLogin}
            onAppleLogin={loginHook.handleAppleLogin}
            
            // Navigation
            onNavigateToSignup={loginHook.navigateToSignup}
          />
        </View>

        <AvoidKeyboard />
      </SafeAreaView>
    </ErrorBoundary>
  );
}
