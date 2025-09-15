import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';

export interface UserAddress {
  // Basic address components
  houseNumber?: string;
  street?: string;
  subdivision?: string;
  barangay?: string;
  city?: string;
  province?: string;
  zipCode?: string;
  
  // Additional details
  landmark?: string;
  addressNotes?: string;
  
  // Geographic coordinates
  latitude?: number;
  longitude?: number;
  
  // Formatted address for display
  formattedAddress?: string;
  
  // Address validation status
  isValidated?: boolean;
  placeId?: string; // Google Places ID for reference
}

export interface AddressValidationErrors {
  houseNumber?: string;
  street?: string;
  subdivision?: string;
  barangay?: string;
  city?: string;
  province?: string;
  zipCode?: string;
  landmark?: string;
  addressNotes?: string;
  coordinates?: string;
}

interface UserAddressState {
  // Form data
  address: UserAddress;
  
  // Validation states
  errors: AddressValidationErrors;
  isValidating: boolean;
  
  // Geolocation states
  isLoadingLocation: boolean;
  locationPermissionStatus: 'granted' | 'denied' | 'pending' | 'unknown';
  locationError: string | null;
  
  // Map interaction states
  isMapReady: boolean;
  selectedCoordinates: { latitude: number; longitude: number } | null;
  
  // Search states
  searchQuery: string;
  searchResults: any[];
  isSearching: boolean;
  
  // Actions for address management
  setAddress: (address: Partial<UserAddress>) => void;
  setAddressField: (field: keyof UserAddress, value: string | number) => void;
  clearAddress: () => void;
  
  // Actions for validation
  setErrors: (errors: Partial<AddressValidationErrors>) => void;
  setFieldError: (field: keyof AddressValidationErrors, error?: string) => void;
  clearErrors: () => void;
  setValidating: (isValidating: boolean) => void;
  
  // Actions for geolocation
  setLocationPermission: (status: 'granted' | 'denied' | 'pending' | 'unknown') => void;
  setLoadingLocation: (isLoading: boolean) => void;
  setLocationError: (error: string | null) => void;
  requestLocationPermission: () => Promise<boolean>;
  getCurrentLocation: () => Promise<{ latitude: number; longitude: number } | null>;
  
  // Actions for map interaction
  setMapReady: (isReady: boolean) => void;
  setSelectedCoordinates: (coords: { latitude: number; longitude: number } | null) => void;
  updateAddressFromCoordinates: (coords: { latitude: number; longitude: number }) => Promise<void>;
  
  // Actions for address search
  setSearchQuery: (query: string) => void;
  setSearchResults: (results: any[]) => void;
  setSearching: (isSearching: boolean) => void;
  performAddressSearch: (query: string) => Promise<void>;
  selectSearchResult: (result: any) => void;
  
  // Utility actions
  validateAddress: () => Promise<boolean>;
  isAddressComplete: () => boolean;
  getFormattedAddress: () => string;
}

export const useUserAddressStore = create<UserAddressState>()(
  immer((set, get) => ({
    // Initial state
    address: {
      province: 'Cavite', // Default to Cavite as per requirement
    },
    errors: {},
    isValidating: false,
    isLoadingLocation: false,
    locationPermissionStatus: 'unknown',
    locationError: null,
    isMapReady: false,
    selectedCoordinates: null,
    searchQuery: '',
    searchResults: [],
    isSearching: false,

    // Address management actions
    setAddress: (newAddress) => set((state) => {
      state.address = { ...state.address, ...newAddress };
    }),

    setAddressField: (field, value) => set((state) => {
      state.address[field] = value;
      // Clear field error when user starts typing
      if (state.errors[field as keyof AddressValidationErrors]) {
        delete state.errors[field as keyof AddressValidationErrors];
      }
    }),

    clearAddress: () => set((state) => {
      state.address = { province: 'Cavite' }; // Keep Cavite default
      state.errors = {};
      state.selectedCoordinates = null;
    }),

    // Validation actions
    setErrors: (newErrors) => set((state) => {
      state.errors = { ...state.errors, ...newErrors };
    }),

    setFieldError: (field, error) => set((state) => {
      if (error) {
        state.errors[field] = error;
      } else {
        delete state.errors[field];
      }
    }),

    clearErrors: () => set((state) => {
      state.errors = {};
    }),

    setValidating: (isValidating) => set((state) => {
      state.isValidating = isValidating;
    }),

    // Geolocation actions
    setLocationPermission: (status) => set((state) => {
      state.locationPermissionStatus = status;
    }),

    setLoadingLocation: (isLoading) => set((state) => {
      state.isLoadingLocation = isLoading;
    }),

    setLocationError: (error) => set((state) => {
      state.locationError = error;
    }),

    requestLocationPermission: async () => {
      try {
        set((state) => {
          state.locationPermissionStatus = 'pending';
        });

        // This would typically use expo-location or react-native permissions
        // For now, we'll implement the basic structure
        const { status } = await import('expo-location').then(Location => 
          Location.requestForegroundPermissionsAsync()
        );

        const granted = status === 'granted';
        set((state) => {
          state.locationPermissionStatus = granted ? 'granted' : 'denied';
        });

        return granted;
      } catch (error) {
        set((state) => {
          state.locationPermissionStatus = 'denied';
          state.locationError = 'Failed to request location permission';
        });
        return false;
      }
    },

    getCurrentLocation: async () => {
      try {
        set((state) => {
          state.isLoadingLocation = true;
          state.locationError = null;
        });

        const hasPermission = await get().requestLocationPermission();
        if (!hasPermission) {
          throw new Error('Location permission denied');
        }

        const Location = await import('expo-location');
        const location = await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.High,
        });

        const coords = {
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
        };

        set((state) => {
          state.selectedCoordinates = coords;
          state.address.latitude = coords.latitude;
          state.address.longitude = coords.longitude;
          state.isLoadingLocation = false;
        });

        // Update address from coordinates
        await get().updateAddressFromCoordinates(coords);

        return coords;
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Failed to get current location';
        set((state) => {
          state.isLoadingLocation = false;
          state.locationError = errorMessage;
        });
        return null;
      }
    },

    // Map interaction actions
    setMapReady: (isReady) => set((state) => {
      state.isMapReady = isReady;
    }),

    setSelectedCoordinates: (coords) => set((state) => {
      state.selectedCoordinates = coords;
      if (coords) {
        state.address.latitude = coords.latitude;
        state.address.longitude = coords.longitude;
      }
    }),

    updateAddressFromCoordinates: async (coords) => {
      // This will be implemented when we create the GooglePlacesService
      // For now, just store the coordinates
      set((state) => {
        state.selectedCoordinates = coords;
        state.address.latitude = coords.latitude;
        state.address.longitude = coords.longitude;
      });
    },

    // Search actions
    setSearchQuery: (query) => set((state) => {
      state.searchQuery = query;
    }),

    setSearchResults: (results) => set((state) => {
      state.searchResults = results;
    }),

    setSearching: (isSearching) => set((state) => {
      state.isSearching = isSearching;
    }),

    performAddressSearch: async (query) => {
      // This will be implemented when we create the GooglePlacesService
      set((state) => {
        state.isSearching = true;
        state.searchQuery = query;
      });
      
      // Placeholder - will be replaced with actual Google Places API call
      setTimeout(() => {
        set((state) => {
          state.isSearching = false;
          state.searchResults = [];
        });
      }, 1000);
    },

    selectSearchResult: (result) => {
      // This will be implemented when we create the GooglePlacesService
      // Will populate address fields from selected place
    },

    // Utility actions
    validateAddress: async () => {
      const state = get();
      const { address } = state;
      const errors: AddressValidationErrors = {};

      // Basic validation - will be enhanced with Yup schemas
      if (!address.street) errors.street = 'Street address is required';
      if (!address.barangay) errors.barangay = 'Barangay is required';
      if (!address.city) errors.city = 'City is required';
      if (!address.zipCode) errors.zipCode = 'ZIP code is required';
      
      set((state) => {
        state.errors = errors;
      });

      return Object.keys(errors).length === 0;
    },

    isAddressComplete: () => {
      const { address } = get();
      return !!(
        address.street &&
        address.barangay &&
        address.city &&
        address.province &&
        address.zipCode
      );
    },

    getFormattedAddress: () => {
      const { address } = get();
      const parts = [
        address.houseNumber,
        address.street,
        address.subdivision,
        address.barangay,
        address.city,
        address.province,
        address.zipCode,
      ].filter(Boolean);

      return parts.join(', ');
    },
  }))
);