import { useCallback, useEffect } from "react";
import { router } from "expo-router";
import { useAuthStore } from "../store/useAuthStore";
import { useLoginFormStore } from "../store/useLoginFormStore";
import { usePasswordResetStore } from "../store/usePasswordResetStore";

export interface UseLoginReturn {
  // Form state
  formData: {
    email: string;
    password: string;
  };
  showPassword: boolean;
  rememberMe: boolean;
  loading: boolean;
  errors: {
    email?: string;
    password?: string;
    general?: string;
  };
  
  // Password reset state
  passwordReset: {
    email: string;
    isBottomSheetVisible: boolean;
    loading: boolean;
    error?: string;
    success: boolean;
    successMessage?: string;
  };
  
  // Form actions
  setEmail: (email: string) => void;
  setPassword: (password: string) => void;
  setShowPassword: (show: boolean) => void;
  setRememberMe: (remember: boolean) => void;
  togglePasswordVisibility: () => void;
  clearError: () => void;
  
  // Password reset actions
  setResetEmail: (email: string) => void;
  openPasswordResetBottomSheet: () => void;
  closePasswordResetBottomSheet: () => void;
  submitPasswordReset: () => Promise<void>;
  
  // Form submission
  handleLogin: () => Promise<void>;
  
  // Social login
  handleGoogleLogin: () => Promise<void>;
  handleAppleLogin: () => Promise<void>;
  
  // Navigation
  navigateToSignup: () => void;
  navigateToTabs: () => void;
}

export const useLogin = (): UseLoginReturn => {
  // Zustand stores
  const {
    email,
    password,
    showPassword,
    emailError,
    passwordError,
    rememberMe,
    setEmail,
    setPassword,
    setShowPassword,
    setRememberMe,
    validateForm,
    setSubmitting,
  } = useLoginFormStore();

  const { login, loading, error, clearError, loadSavedCredentials } = useAuthStore();

  const {
    resetEmail,
    isBottomSheetVisible,
    loading: resetLoading,
    error: resetError,
    success: resetSuccess,
    successMessage,
    setResetEmail,
    openBottomSheet,
    closeBottomSheet,
    submitPasswordReset,
  } = usePasswordResetStore();

  // Load saved credentials on hook initialization
  useEffect(() => {
    const loadCredentials = async () => {
      const savedCredentials = await loadSavedCredentials();
      if (savedCredentials?.email) {
        setEmail(savedCredentials.email);
        setRememberMe(savedCredentials.rememberMe || false);
      }
    };

    loadCredentials();
  }, [setEmail, setRememberMe, loadSavedCredentials]);

  const togglePasswordVisibility = useCallback(() => {
    setShowPassword(!showPassword);
  }, [showPassword, setShowPassword]);

  const handleLogin = useCallback(async () => {
    setSubmitting(true);
    clearError();

    // Validate form using store method
    const isValid = await validateForm();
    if (!isValid) {
      setSubmitting(false);
      return;
    }

    // Attempt login with remember me handled by store
    const result = await login(email, password, rememberMe);
    setSubmitting(false);

    if (result.success) {
      navigateToTabs();
    }
    // Errors are handled by the store automatically
  }, [email, password, rememberMe, validateForm, login, clearError, setSubmitting]);

  const handleGoogleLogin = useCallback(async () => {
    try {
      // TODO: Implement Google login flow
      console.log("Google login not yet implemented");
    } catch (error) {
      console.error("Google login error:", error);
    }
  }, []);

  const handleAppleLogin = useCallback(async () => {
    try {
      // TODO: Implement Apple login flow
      console.log("Apple login not yet implemented");
    } catch (error) {
      console.error("Apple login error:", error);
    }
  }, []);

  const navigateToSignup = useCallback(() => {
    router.push("/(auth)/signup");
  }, []);

  const navigateToTabs = useCallback(() => {
    router.replace("../(tabs)/" as any);
  }, []);

  const openPasswordResetBottomSheet = useCallback(() => {
    openBottomSheet();
  }, [openBottomSheet]);

  const closePasswordResetBottomSheet = useCallback(() => {
    closeBottomSheet();
  }, [closeBottomSheet]);

  const handlePasswordReset = useCallback(async () => {
    await submitPasswordReset();
  }, [submitPasswordReset]);

  return {
    // Form state
    formData: {
      email,
      password,
    },
    showPassword,
    rememberMe,
    loading,
    errors: {
      email: emailError,
      password: passwordError,
      general: error || undefined,
    },
    
    // Password reset state
    passwordReset: {
      email: resetEmail,
      isBottomSheetVisible,
      loading: resetLoading,
      error: resetError || undefined,
      success: resetSuccess,
      successMessage: successMessage || undefined,
    },
    
    // Form actions
    setEmail,
    setPassword,
    setShowPassword,
    setRememberMe,
    togglePasswordVisibility,
    clearError,
    
    // Password reset actions
    setResetEmail,
    openPasswordResetBottomSheet,
    closePasswordResetBottomSheet,
    submitPasswordReset: handlePasswordReset,
    
    // Form submission
    handleLogin,
    
    // Social login
    handleGoogleLogin,
    handleAppleLogin,
    
    // Navigation
    navigateToSignup,
    navigateToTabs,
  };
};
