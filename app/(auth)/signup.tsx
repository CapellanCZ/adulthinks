import React from "react";
import { StyleSheet, TouchableOpacity } from "react-native";
import { AlertCircle, ArrowLeft } from "lucide-react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { AvoidKeyboard } from "@/components/ui/avoid-keyboard";
import { Button } from "@/components/ui/button";
import { Text } from "@/components/ui/text";
import { View } from "@/components/ui/view";

// Import auth modules
import { useSignup } from "@/modules/auth/hooks/useSignup";
import {
  SignupHeader,
  SignupFormFields,
  SocialLoginButtons,
  TermsAndConditions,
  SignupSuccessBottomSheet,
} from "@/modules/auth/components/signup";

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
          <ArrowLeft size={24} color="#666" />
        </TouchableOpacity>
      </View>

      {/* Main Content - Centered */}
      <View style={styles.mainContent}>
        {/* Header Section */}
        <SignupHeader />

        {/* General Error Message */}
        {errors.general && (
          <View style={styles.errorContainer}>
            <AlertCircle size={18} color="#dc2626" style={styles.errorIcon} />
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

        {/* Social Login Section */}
        <SocialLoginButtons
          onGooglePress={handleGoogleSignup}
          onApplePress={handleAppleSignup}
          loading={loading}
        />
      </View>

      {/* Terms and Conditions - Bottom */}
      <TermsAndConditions
        onTermsPress={navigateToTerms}
        onPrivacyPress={navigateToPrivacy}
      />

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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 10,
  },
  backButton: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: "transparent",
    alignSelf: "flex-start",
  },
  mainContent: {
    flex: 1,
    justifyContent: "center",
    paddingBottom: "12%",
    paddingHorizontal: 20,
    gap: 30,
  },
  submitButton: {
    marginTop: 10,
  },
  errorContainer: {
    backgroundColor: "#fee2e2",
    borderRadius: 8,
    padding: 12,
    marginBottom: -10,
    flexDirection: "row",
    alignItems: "flex-start",
  },
  errorIcon: {
    marginRight: 8,
    marginTop: 1,
    flexShrink: 0,
  },
  errorText: {
    color: "#dc2626",
    fontSize: 14,
    fontWeight: "500",
    flex: 1,
    lineHeight: 20,
  },
});
