import { create } from "zustand";
import { loginWithEmail, fetchProfile } from "../services/authServices";
import { rememberMeUtils } from "../utils/rememberMe";

interface AuthState {
  user: any;
  profile: any;
  loading: boolean;
  error: string | null;
  login: (email: string, password: string, rememberMe?: boolean) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  clearError: () => void;
  loadSavedCredentials: () => Promise<{ email?: string; rememberMe?: boolean } | null>;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  profile: null,
  loading: false,
  error: null,
  login: async (email, password, rememberMe = false) => {
    set({ loading: true, error: null });
    try {
      const { user } = await loginWithEmail(email, password);
      const profile = await fetchProfile(user.id);
      set({ user, profile, loading: false });
      
      // Handle remember me credentials with error management
      if (rememberMe) {
        try {
          await rememberMeUtils.saveCredentials(email, rememberMe);
        } catch (rememberError: any) {
          console.warn('Failed to save remember me credentials:', rememberError.message);
          // Don't fail the login for remember me errors
        }
      } else {
        try {
          await rememberMeUtils.clearSavedCredentials();
        } catch (clearError: any) {
          console.warn('Failed to clear remember me credentials:', clearError.message);
        }
      }
      
      return { success: true };
    } catch (error: any) {
      set({ error: error.message, loading: false });
      return { success: false, error: error.message };
    }
  },
  logout: () => {
    set({ user: null, profile: null, error: null });
    // Clear remember me credentials on logout
    rememberMeUtils.clearSavedCredentials().catch(error => 
      console.error('Error clearing saved credentials:', error)
    );
  },
  clearError: () => set({ error: null }),
  
  loadSavedCredentials: async () => {
    try {
      const savedCredentials = await rememberMeUtils.getSavedCredentials();
      return savedCredentials;
    } catch (error: any) {
      console.warn('Failed to load saved credentials:', error.message);
      return null;
    }
  },
}));