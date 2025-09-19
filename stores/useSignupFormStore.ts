import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';
import type { UserAddress } from '@/modules/userAddress/types/AddressTypes';

/**
 * SignupFormStore - Complete signup form state management
 * Handles multi-step form progression, validation, and data persistence
 */

interface AccountData {
  email: string;
  password: string;
  confirmPassword: string;
}

interface PersonalData {
  firstName: string;
  lastName: string;
  middleName: string;
  gender: string;
  birthdate: Date | undefined;
}

interface SignupFormState {
  // Step Management
  activeStep: number;
  completedSteps: boolean[];
  
  // Form Data
  accountData: AccountData;
  personalData: PersonalData;
  addressData: UserAddress | null;
  
  // UI States
  isSubmitting: boolean;
  submitError: string | null;
  
  // Step Management Actions
  setActiveStep: (step: number) => void;
  nextStep: () => void;
  prevStep: () => void;
  markStepComplete: (step: number) => void;
  canAdvanceToStep: (step: number) => boolean;
  
  // Data Actions
  setAccountData: (data: Partial<AccountData>) => void;
  setPersonalData: (data: Partial<PersonalData>) => void;
  setAddressData: (data: Partial<UserAddress>) => void;
  
  // Validation
  validateAccountStep: () => boolean;
  validatePersonalStep: () => boolean;
  validateAddressStep: () => boolean;
  
  // Submission
  submitSignupForm: () => Promise<void>;
  resetForm: () => void;
}

const initialAccountData: AccountData = {
  email: '',
  password: '',
  confirmPassword: '',
};

const initialPersonalData: PersonalData = {
  firstName: '',
  lastName: '',
  middleName: '',
  gender: '',
  birthdate: undefined,
};

export const useSignupFormStore = create<SignupFormState>()(
  immer((set, get) => ({
    // Initial State
    activeStep: 0,
    completedSteps: [false, false, false],
    accountData: initialAccountData,
    personalData: initialPersonalData,
    addressData: null,
    isSubmitting: false,
    submitError: null,

    // Step Management Actions
    setActiveStep: (step) =>
      set((state) => {
        if (get().canAdvanceToStep(step)) {
          state.activeStep = step;
        }
      }),

    nextStep: () =>
      set((state) => {
        const currentStep = state.activeStep;
        let canAdvance = false;

        // Validate current step before advancing
        if (currentStep === 0 && get().validateAccountStep()) {
          state.completedSteps[0] = true;
          canAdvance = true;
        } else if (currentStep === 1 && get().validatePersonalStep()) {
          state.completedSteps[1] = true;
          canAdvance = true;
        } else if (currentStep === 2 && get().validateAddressStep()) {
          state.completedSteps[2] = true;
          canAdvance = true;
        }

        if (canAdvance && state.activeStep < 2) {
          state.activeStep += 1;
        }
      }),

    prevStep: () =>
      set((state) => {
        if (state.activeStep > 0) {
          state.activeStep -= 1;
        }
      }),

    markStepComplete: (step) =>
      set((state) => {
        state.completedSteps[step] = true;
      }),

    canAdvanceToStep: (step) => {
      const state = get();
      if (step === 0) return true;
      if (step === 1) return state.completedSteps[0];
      if (step === 2) return state.completedSteps[0] && state.completedSteps[1];
      return false;
    },

    // Data Actions
    setAccountData: (data) =>
      set((state) => {
        state.accountData = { ...state.accountData, ...data };
        state.submitError = null; // Clear errors when user types
      }),

    setPersonalData: (data) =>
      set((state) => {
        state.personalData = { ...state.personalData, ...data };
        state.submitError = null;
      }),

    setAddressData: (data) =>
      set((state) => {
        // Initialize addressData if it's null
        state.addressData ??= {};
        
        // Merge the partial data with existing address data
        Object.assign(state.addressData, data);
        
        // Mark address step as complete if we have required fields
        const hasRequired = 
          state.addressData.street && 
          state.addressData.barangay && 
          state.addressData.city && 
          state.addressData.zipCode;
        state.completedSteps[2] = !!hasRequired;
        
        state.submitError = null;
      }),

    // Validation Methods
    validateAccountStep: () => {
      const { accountData } = get();
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      
      return (
        emailRegex.test(accountData.email) &&
        accountData.password.length >= 8 &&
        accountData.password === accountData.confirmPassword
      );
    },

    validatePersonalStep: () => {
      const { personalData } = get();
      const nameRegex = /^[a-zA-Z\s]+$/;
      
      return (
        nameRegex.test(personalData.firstName) && personalData.firstName.length >= 2 &&
        nameRegex.test(personalData.lastName) && personalData.lastName.length >= 2 &&
        personalData.gender.length > 0 &&
        personalData.birthdate !== undefined
      );
    },

    validateAddressStep: () => {
      const { addressData } = get();
      return Boolean(
        addressData?.street && addressData.street.length > 0 &&
        addressData?.barangay && addressData.barangay.length > 0 &&
        addressData?.city && addressData.city.length > 0 &&
        addressData?.zipCode && addressData.zipCode.length > 0
      );
    },

    // Submission
    submitSignupForm: async () => {
      const state = get();
      
      if (!state.validateAccountStep() || !state.validatePersonalStep() || !state.validateAddressStep()) {
        set((draft) => {
          draft.submitError = 'Please complete all required fields correctly';
        });
        return;
      }

      set((draft) => {
        draft.isSubmitting = true;
        draft.submitError = null;
      });

      try {
        // Prepare signup data
        const signupData = {
          account: state.accountData,
          personal: state.personalData,
          address: state.addressData,
        };

        console.log('Submitting signup data:', signupData);
        
        // API integration planned - currently simulating successful signup
        await new Promise(resolve => setTimeout(resolve, 2000)); // Simulate API call
        
        // On success, could navigate to success screen
        console.log('Signup successful!');
        
      } catch (error) {
        set((draft) => {
          draft.submitError = error instanceof Error ? error.message : 'Signup failed. Please try again.';
        });
      } finally {
        set((draft) => {
          draft.isSubmitting = false;
        });
      }
    },

    resetForm: () =>
      set((state) => {
        state.activeStep = 0;
        state.completedSteps = [false, false, false];
        state.accountData = initialAccountData;
        state.personalData = initialPersonalData;
        state.addressData = null;
        state.isSubmitting = false;
        state.submitError = null;
      }),
  }))
);