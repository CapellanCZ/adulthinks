/**
 * TypeScript interfaces and types for Philippine address system
 * Focused on Cavite province requirements
 */

// Core address interface (re-export from store for consistency)
export interface UserAddress {
  houseNumber?: string;
  street?: string;
  subdivision?: string;
  barangay?: string;
  city?: string;
  province?: string;
  zipCode?: string;
  landmark?: string;
  addressNotes?: string;
  latitude?: number;
  longitude?: number;
  formattedAddress?: string;
  isValidated?: boolean;
  placeId?: string;
}

// Map region interface for expo-maps compatibility
export interface Region {
  latitude: number;
  longitude: number;
  latitudeDelta: number;
  longitudeDelta: number;
}

// Validation error types
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

// Geographic coordinate types
export interface Coordinates {
  latitude: number;
  longitude: number;
}

// Google Places API types
export interface PlaceDetails {
  place_id: string;
  formatted_address: string;
  geometry: {
    location: {
      lat: number;
      lng: number;
    };
  };
  address_components: AddressComponent[];
}

export interface AddressComponent {
  long_name: string;
  short_name: string;
  types: string[];
}

// Search result types
export interface AddressSearchResult {
  id: string;
  description: string;
  place_id: string;
  structured_formatting?: {
    main_text: string;
    secondary_text: string;
  };
}

// Geolocation permission types
export type LocationPermissionStatus = 'granted' | 'denied' | 'pending' | 'unknown';

// Map interaction types
export interface MapRegion {
  latitude: number;
  longitude: number;
  latitudeDelta: number;
  longitudeDelta: number;
}

// Philippine address component constants
export const CAVITE_CITIES = [
  'Bacoor',
  'Cavite City',
  'Dasmariñas',
  'General Trias',
  'Imus',
  'Kawit',
  'Rosario',
  'Trece Martires',
  'Carmona',
  'General Emilio Aguinaldo',
  'General Mariano Alvarez',
  'Silang',
  'Tagaytay',
  'Tanza',
  'Naic',
  'Maragondon',
  'Indang',
  'Mendez',
  'Alfonso',
  'Magallanes',
  'Amadeo',
  'Ternate',
] as const;

export type CaviteCity = typeof CAVITE_CITIES[number];

// ZIP code mapping for Cavite cities
export const CAVITE_ZIP_CODES: Record<string, string[]> = {
  'Bacoor': ['4102'],
  'Cavite City': ['4100'],
  'Dasmariñas': ['4114', '4115', '4116'],
  'General Trias': ['4107'],
  'Imus': ['4103'],
  'Kawit': ['4104'],
  'Rosario': ['4106'],
  'Trece Martires': ['4109'],
  'Carmona': ['4116'],
  'General Emilio Aguinaldo': ['4124'],
  'General Mariano Alvarez': ['4117'],
  'Silang': ['4118'],
  'Tagaytay': ['4120'],
  'Tanza': ['4108'],
  'Naic': ['4110'],
  'Maragondon': ['4113'],
  'Indang': ['4122'],
  'Mendez': ['4151'],
  'Alfonso': ['4123'],
  'Magallanes': ['4145'],
  'Amadeo': ['4119'],
  'Ternate': ['4111'],
};

// Address component hierarchy
export interface PhilippineAddressHierarchy {
  province: string;
  city: string;
  barangay: string;
  zipCode: string;
}

// Form field configuration
export interface AddressFieldConfig {
  id: keyof UserAddress;
  label: string;
  placeholder: string;
  required: boolean;
  type: 'text' | 'search' | 'select';
  options?: readonly string[] | string[];
}

export const ADDRESS_FIELD_CONFIGS: AddressFieldConfig[] = [
  {
    id: 'houseNumber',
    label: 'House/Building Number',
    placeholder: 'e.g., 123, Blk 5 Lot 10',
    required: false,
    type: 'text',
  },
  {
    id: 'street',
    label: 'Street Name',
    placeholder: 'e.g., Rizal Street, Main Road',
    required: true,
    type: 'text',
  },
  {
    id: 'subdivision',
    label: 'Subdivision/Village',
    placeholder: 'e.g., San Lorenzo Village (optional)',
    required: false,
    type: 'text',
  },
  {
    id: 'barangay',
    label: 'Barangay',
    placeholder: 'Select or type barangay name',
    required: true,
    type: 'search',
  },
  {
    id: 'city',
    label: 'City/Municipality',
    placeholder: 'Select city in Cavite',
    required: true,
    type: 'select',
    options: CAVITE_CITIES,
  },
  {
    id: 'zipCode',
    label: 'ZIP Code',
    placeholder: 'e.g., 4100',
    required: true,
    type: 'text',
  },
  {
    id: 'landmark',
    label: 'Landmark (Optional)',
    placeholder: 'e.g., Near SM Bacoor, Beside 7-Eleven',
    required: false,
    type: 'text',
  },
];

// Default map region for Cavite
export const DEFAULT_CAVITE_REGION: MapRegion = {
  latitude: 14.2456, // Central Cavite coordinates
  longitude: 120.8792,
  latitudeDelta: 0.5, // Covers most of Cavite province
  longitudeDelta: 0.5,
};

// Cavite center coordinates for map initialization
export const CAVITE_CENTER: Coordinates = {
  latitude: 14.2456,
  longitude: 120.8792,
};

// Cavite province boundaries
export const CAVITE_BOUNDS = {
  northeast: {
    latitude: 14.5,
    longitude: 121.0,
  },
  southwest: {
    latitude: 14.0,
    longitude: 120.6,
  },
};

// Map styling and configuration
export const MAP_CONFIG = {
  initialZoom: 0.01,
  searchRadius: 50000, // 50km radius for place searches
  markerColor: '#FF6B6B',
  strokeColor: '#FF6B6B',
  strokeWidth: 2,
} as const;