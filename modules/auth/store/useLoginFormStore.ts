import { create } from "zustand";
import { loginSchema } from "../validation/authSchema";

interface LoginFormState {
  email: string;
  password: string;
  showPassword: boolean;
  emailError: string;
  passwordError: string;
  rememberMe: boolean;
  isSubmitting: boolean;
  setEmail: (email: string) => void;
  setPassword: (password: string) => void;
  setShowPassword: (show: boolean) => void;
  setEmailError: (error: string) => void;
  setPasswordError: (error: string) => void;
  setRememberMe: (remember: boolean) => void;
  clearErrors: () => void;
  validateForm: () => Promise<boolean>;
  setSubmitting: (submitting: boolean) => void;
  reset: () => void;
}

export const useLoginFormStore = create<LoginFormState>((set, get) => ({
  email: "",
  password: "",
  showPassword: false,
  emailError: "",
  passwordError: "",
  rememberMe: false,
  isSubmitting: false,
  setEmail: (email) => set({ email }),
  setPassword: (password) => set({ password }),
  setShowPassword: (show) => set({ showPassword: show }),
  setEmailError: (error) => set({ emailError: error }),
  setPasswordError: (error) => set({ passwordError: error }),
  setRememberMe: (remember) => set({ rememberMe: remember }),
  setSubmitting: (submitting) => set({ isSubmitting: submitting }),
  clearErrors: () => set({ emailError: "", passwordError: "" }),
  validateForm: async () => {
    const { email, password } = get();
    set({ emailError: "", passwordError: "" });
    
    try {
      await loginSchema.validate({ email, password }, { abortEarly: false });
      return true;
    } catch (err) {
      if (err instanceof Error && "inner" in err) {
        // @ts-ignore - yup.ValidationError
        err.inner.forEach((error) => {
          if (error.path === "email") set((state) => ({ ...state, emailError: error.message }));
          if (error.path === "password") set((state) => ({ ...state, passwordError: error.message }));
        });
      }
      return false;
    }
  },
  reset: () =>
    set({
      email: "",
      password: "",
      showPassword: false,
      emailError: "",
      passwordError: "",
      rememberMe: false,
      isSubmitting: false,
    }),
}));