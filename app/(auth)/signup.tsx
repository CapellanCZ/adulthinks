import React from "react";
import { Pressable, TouchableOpacity, useColorScheme } from "react-native";
import { AlertCircle, ArrowLeft } from "lucide-react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { AvoidKeyboard } from "@/components/ui/avoid-keyboard";
import { Button } from "@/components/ui/button";
import { Text } from "@/components/ui/text";
import { View } from "@/components/ui/view";
import { useSignupStyles, theme } from "@/modules/auth/styles/signupStyles";

// Import auth modules
import { useSignup } from "@/modules/auth/hooks/useSignup";
import {
  SignupHeader,
  SignupFormFields,
  SocialLoginButtons,
  TermsAndConditions,
  SignupSuccessBottomSheet,
} from "@/modules/auth/components";

/**
 * SignupScreen Component
 * 
 * A clean, maintainable signup screen that follows separation of concerns:
 * - UI components are modular and reusable
 * - Business logic is handled by custom hooks
 * - State management is centralized in Zustand store
 * - Accessibility features are built-in
 * - Form validation is handled automatically
 */
export default function SignupScreen() {
  const {
    // Form state
    formData,
    loading,
    errors,
    showPassword,
    showConfirmPassword,
    success,

    // Form actions
    setFormField,
    togglePasswordVisibility,
    toggleConfirmPasswordVisibility,
    validateField,
    clearError,

    // Form submission
    handleSubmit,

    // Success handling
    handleSuccessClose,
    handleSuccessContinue,

    // Social login
    handleGoogleSignup,
    handleAppleSignup,

    // Navigation
    navigateToTerms,
    navigateToPrivacy,
    navigateBack,
  } = useSignup();

  const styles = useSignupStyles();
  const colorScheme = useColorScheme();
  const colors = theme.getThemeColors(colorScheme);

  return (
    <SafeAreaView style={styles.container}>
      {/* Header with Back Button */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={navigateBack}
          accessibilityLabel="Go back"
          accessibilityHint="Returns to the previous screen"
        >
          <ArrowLeft size={24} color={colors.icon} />
        </TouchableOpacity>
      </View>

      {/* Main Content - Centered */}
      <View style={styles.mainContent}>
        {/* Header Section */}
        <SignupHeader />

        {/* General Error Message */}
        {errors.general && (
          <View style={styles.errorContainer}>
            <AlertCircle size={18} color={colors.error} style={styles.errorIcon} />
            <Text style={styles.errorText}>{errors.general}</Text>
          </View>
        )}

        {/* Form Fields Section */}
        <SignupFormFields
          formData={formData}
          errors={errors}
          showPassword={showPassword}
          showConfirmPassword={showConfirmPassword}
          loading={loading}
          onFieldChange={setFormField}
          onFieldBlur={validateField}
          onTogglePasswordVisibility={togglePasswordVisibility}
          onToggleConfirmPasswordVisibility={toggleConfirmPasswordVisibility}
          onClearError={clearError}
        />

        {/* Submit Button */}
        <Button
          style={styles.submitButton}
          onPress={handleSubmit}
          loading={loading}
          disabled={loading}
          accessibilityLabel="Register account"
          accessibilityHint="Creates your new account with the provided information"
        >
          {loading ? "Creating Account..." : "Register"}
        </Button>

        <SocialLoginButtons
          onGooglePress={handleGoogleSignup} 
          onApplePress={handleAppleSignup}
        />

        <View style={styles.signupContainer}>
          <View style={styles.signupTextContainer}>
            <Text style={styles.signupPrompt}>Already have an account?</Text>
            <Pressable onPress={navigateBack}>
              <Text style={styles.signupLink}>
                Login
              </Text>
            </Pressable>
          </View>
        </View>

      </View>

      <AvoidKeyboard />

      {/* Success Bottom Sheet */}
      <SignupSuccessBottomSheet
        isVisible={success}
        onClose={handleSuccessClose}
        onContinue={handleSuccessContinue}
        email={formData.email}
      />
    </SafeAreaView>
  );
}

