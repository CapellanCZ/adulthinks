import { create } from "zustand";
import { sendPasswordResetEmail } from "../services/passwordResetServices";

interface PasswordResetState {
  // Form state
  resetEmail: string;
  
  // UI state
  isBottomSheetVisible: boolean;
  
  // Process state
  loading: boolean;
  error: string | null;
  success: boolean;
  successMessage: string | null;
  
  // Actions
  setResetEmail: (email: string) => void;
  openBottomSheet: () => void;
  closeBottomSheet: () => void;
  submitPasswordReset: () => Promise<{ success: boolean; error?: string }>;
  clearError: () => void;
  clearSuccess: () => void;
  reset: () => void;
}

export const usePasswordResetStore = create<PasswordResetState>((set, get) => ({
  // Initial state
  resetEmail: "",
  isBottomSheetVisible: false,
  loading: false,
  error: null,
  success: false,
  successMessage: null,
  
  // Actions
  setResetEmail: (email) => set({ resetEmail: email }),
  
  openBottomSheet: () => set({ 
    isBottomSheetVisible: true,
    error: null,
    success: false,
    successMessage: null
  }),
  
  closeBottomSheet: () => set({ 
    isBottomSheetVisible: false,
    error: null,
    success: false,
    successMessage: null
  }),
  
  submitPasswordReset: async () => {
    const { resetEmail } = get();
    
    if (!resetEmail.trim()) {
      set({ error: "Please enter your email address" });
      return { success: false, error: "Please enter your email address" };
    }
    
    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(resetEmail)) {
      set({ error: "Please enter a valid email address" });
      return { success: false, error: "Please enter a valid email address" };
    }
    
    set({ loading: true, error: null, success: false });
    
    try {
      const result = await sendPasswordResetEmail(resetEmail);
      set({ 
        loading: false, 
        success: true, 
        successMessage: result.message,
        error: null
      });
      return { success: true };
    } catch (error: any) {
      set({ 
        loading: false, 
        error: error.message || "Failed to send password reset email",
        success: false
      });
      return { success: false, error: error.message };
    }
  },
  
  clearError: () => set({ error: null }),
  
  clearSuccess: () => set({ success: false, successMessage: null }),
  
  reset: () => set({
    resetEmail: "",
    isBottomSheetVisible: false,
    loading: false,
    error: null,
    success: false,
    successMessage: null,
  }),
}));