import { useCallback } from "react";
import { router } from "expo-router";
import { useSignupFormStore } from "../store/useSignupFormStore";

export interface UseSignupReturn {
  // Form state
  formData: {
    email: string;
    password: string;
    confirmPassword: string;
  };
  loading: boolean;
  errors: {
    email?: string;
    password?: string;
    confirmPassword?: string;
    general?: string;
  };
  showPassword: boolean;
  showConfirmPassword: boolean;
  success: boolean;
  
  // Form actions
  setFormField: (field: "email" | "password" | "confirmPassword", value: string) => void;
  togglePasswordVisibility: () => void;
  toggleConfirmPasswordVisibility: () => void;
  validateField: (field: "email" | "password" | "confirmPassword") => void;
  clearError: (field: "email" | "password" | "confirmPassword" | "general") => void;
  
  // Form submission
  handleSubmit: () => Promise<void>;
  
  // Success handling
  handleSuccessClose: () => void;
  handleSuccessContinue: () => void;
  
  // Social login
  handleGoogleSignup: () => Promise<void>;
  handleAppleSignup: () => Promise<void>;
  
  // Navigation
  navigateToLogin: () => void;
  navigateBack: () => void;
  navigateToTerms: () => void;
  navigateToPrivacy: () => void;
}

export const useSignup = (): UseSignupReturn => {
  const {
    formData,
    loading,
    errors,
    showPassword,
    showConfirmPassword,
    success,
    setFormField,
    setShowPassword,
    setShowConfirmPassword,
    validateField,
    clearError,
    setSuccess,
    resetForm,
    submitForm,
  } = useSignupFormStore();

  const togglePasswordVisibility = useCallback(() => {
    setShowPassword(!showPassword);
  }, [showPassword, setShowPassword]);

  const toggleConfirmPasswordVisibility = useCallback(() => {
    setShowConfirmPassword(!showConfirmPassword);
  }, [showConfirmPassword, setShowConfirmPassword]);

  const handleSubmit = useCallback(async () => {
    const result = await submitForm();
    
    // Do not navigate to tabs on successful signup.
    // Let UI show success or prompt for email verification if required.
    // Any errors are already handled in the store via errors.general.
  }, [submitForm]);

  const handleGoogleSignup = useCallback(async () => {
    try {
      // Switch to Google provider and handle signup
      // TODO: Implement Google signup flow
      console.log("Google signup not yet implemented");
    } catch (error) {
      console.error("Google signup error:", error);
    }
  }, []);

  const handleAppleSignup = useCallback(async () => {
    try {
      // TODO: Implement Apple signup flow
      console.log("Apple signup not yet implemented");
    } catch (error) {
      console.error("Apple signup error:", error);
    }
  }, []);

  const navigateToLogin = useCallback(() => {
    resetForm();
    router.push("/(auth)/login");
  }, [resetForm]);

  const navigateBack = useCallback(() => {
    resetForm();
    router.back();
  }, [resetForm]);

  const navigateToTerms = useCallback(() => {
    // TODO: Navigate to terms and conditions
    console.log("Navigate to terms");
  }, []);

  const navigateToPrivacy = useCallback(() => {
    // TODO: Navigate to privacy policy
    console.log("Navigate to privacy policy");
  }, []);

  const handleSuccessClose = useCallback(() => {
    setSuccess(false);
    resetForm();
  }, [setSuccess, resetForm]);

  const handleSuccessContinue = useCallback(() => {
    setSuccess(false);
    resetForm();
    router.push("/(auth)/login");
  }, [setSuccess, resetForm]);

  return {
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
    navigateToLogin,
    navigateBack,
    navigateToTerms,
    navigateToPrivacy,
  };
};
