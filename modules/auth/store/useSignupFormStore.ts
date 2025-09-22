import { create } from "zustand";
import { signUpWithEmail } from "../services/authServices";
import { signupSchema } from "../validation/authSchema";
import * as yup from "yup";

export interface SignupFormData {
  email: string;
  password: string;
  confirmPassword: string;
}

export interface SignupFormErrors {
  email?: string;
  password?: string;
  confirmPassword?: string;
  general?: string;
}

interface SignupFormState {
  // Form data
  formData: SignupFormData;
  
  // UI state
  loading: boolean;
  errors: SignupFormErrors;
  showPassword: boolean;
  showConfirmPassword: boolean;
  success: boolean;
  
  // Actions
  setFormField: (field: keyof SignupFormData, value: string) => void;
  setShowPassword: (show: boolean) => void;
  setShowConfirmPassword: (show: boolean) => void;
  validateField: (field: keyof SignupFormData) => void;
  validateForm: () => boolean;
  clearErrors: () => void;
  clearError: (field: keyof SignupFormErrors) => void;
  resetForm: () => void;
  setSuccess: (success: boolean) => void;
  submitForm: () => Promise<{ success: boolean; error?: string }>;
}

const initialFormData: SignupFormData = {
  email: "",
  password: "",
  confirmPassword: "",
};

export const useSignupFormStore = create<SignupFormState>((set, get) => ({
  // Initial state
  formData: initialFormData,
  loading: false,
  errors: {},
  showPassword: false,
  showConfirmPassword: false,
  success: false,

  // Actions
  setFormField: (field, value) => {
    const state = get();
    const newFormData = { ...state.formData, [field]: value };
    
    // Clear field error when user starts typing
    const newErrors = { ...state.errors };
    if (newErrors[field]) {
      delete newErrors[field];
    }
    
    set({ 
      formData: newFormData,
      errors: newErrors
    });
  },

  setShowPassword: (show) => set({ showPassword: show }),
  
  setShowConfirmPassword: (show) => set({ showConfirmPassword: show }),

  validateField: (field) => {
    const state = get();
    const { formData } = state;
    
    try {
      // Validate single field
      signupSchema.validateSyncAt(field, formData);
      
      // Clear error if validation passes
      const newErrors = { ...state.errors };
      delete newErrors[field];
      set({ errors: newErrors });
    } catch (error) {
      if (error instanceof yup.ValidationError) {
        set({
          errors: {
            ...state.errors,
            [field]: error.message,
          },
        });
      }
    }
  },

  validateForm: () => {
    const state = get();
    const { formData } = state;
    
    try {
      signupSchema.validateSync(formData, { abortEarly: false });
      set({ errors: {} });
      return true;
    } catch (error) {
      if (error instanceof yup.ValidationError) {
        const newErrors: SignupFormErrors = {};
        error.inner.forEach((err) => {
          if (err.path) {
            newErrors[err.path as keyof SignupFormErrors] = err.message;
          }
        });
        set({ errors: newErrors });
      }
      return false;
    }
  },

  clearErrors: () => set({ errors: {} }),
  
  clearError: (field) => {
    const state = get();
    const newErrors = { ...state.errors };
    delete newErrors[field];
    set({ errors: newErrors });
  },

  resetForm: () => set({
    formData: initialFormData,
    loading: false,
    errors: {},
    showPassword: false,
    showConfirmPassword: false,
    success: false,
  }),

  setSuccess: (success) => set({ success }),

  submitForm: async () => {
    const state = get();
    const { formData, validateForm } = state;
    
    // Validate form before submission
    if (!validateForm()) {
      return { success: false, error: "Please fix the validation errors" };
    }
    
    set({ loading: true, errors: {} });
    
    try {
      const result = await signUpWithEmail(formData.email, formData.password);
      set({ loading: false });
      
      if (result.user) {
        // Set success state to show bottom sheet
        set({ loading: false, success: true });
        return { success: true };
      } else {
        return { success: false, error: "Signup failed" };
      }
    } catch (error: any) {
      console.error("Signup error details:", error);
      
      // Map common Supabase duplicate-account errors to the email field
      const message: string = error?.message || "An error occurred during signup";
      const code: string | undefined = error?.code;
      
      // Comprehensive list of duplicate email patterns
      const duplicatePatterns = [
        "user_already_exists",
        "email_exists", 
        "already registered",
        "already exists",
        "duplicate",
        "email address already in use",
        "user with this email already exists",
        "email already taken",
        "account already exists",
        "email is already registered"
      ];

      // Check for duplicate email scenarios
      const isDuplicate =
        code === "user_already_exists" ||
        code === "email_exists" ||
        code === "email_address_already_in_use" ||
        code === "duplicate_email" ||
        duplicatePatterns.some((pattern) => 
          message.toLowerCase().includes(pattern.toLowerCase())
        );

      if (isDuplicate) {
        set({
          loading: false,
          errors: {
            email: "An account with this email already exists. Please use a different email or try logging in.",
          },
        });
        return { success: false, error: "Email already exists" };
      }

      // Handle other specific Supabase errors
      if (code === "invalid_credentials") {
        set({
          loading: false,
          errors: { general: "Invalid email or password format." },
        });
        return { success: false, error: message };
      }

      if (code === "weak_password") {
        set({
          loading: false,
          errors: { password: "Password is too weak. Please choose a stronger password." },
        });
        return { success: false, error: message };
      }

      // Generic error handling
      set({
        loading: false,
        errors: { general: message },
      });
      return { success: false, error: message };
    }
  },
}));
