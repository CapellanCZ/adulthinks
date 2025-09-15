// Address Collection Module - Complete Components Export
// Modular architecture for Philippine address collection with React Native Maps integration

// Core Components
export { default as NativeMapPicker } from './components/NativeMapPicker';
export { default as AddressForm } from './components/AddressForm';
export { default as AddressStep } from './components/AddressStep';

// UI Components
export { default as AddressInput } from './components/AddressInput';
export { default as AddressSelect } from './components/AddressSelect';
export { default as AddressSearchInput } from './components/AddressSearchInput';

// Store and State Management
export { useUserAddressStore } from './stores/useUserAddressStore';

// Types and Interfaces
export type {
  UserAddress,
  AddressValidationErrors,
  Coordinates,
  PlaceDetails,
  AddressSearchResult,
  CaviteCity,
  LocationPermissionStatus,
  MapRegion,
} from './types/AddressTypes';

export {
  CAVITE_CITIES,
  CAVITE_ZIP_CODES,
  CAVITE_CENTER,
  CAVITE_BOUNDS,
  DEFAULT_CAVITE_REGION,
  MAP_CONFIG,
} from './types/AddressTypes';

// Validation Schemas
export {
  philippineAddressSchema,
  completeAddressSchema,
  basicAddressSchema,
  detailedAddressSchema,
} from './validation/addressSchema';

// Services
export { default as GeolocationService, geolocationService } from './services/GeolocationService';
export { default as GooglePlacesService } from './services/GooglePlacesService';

// Usage Instructions:
/*
Complete Address Collection Implementation:

1. BASIC USAGE - Simple Address Form:
```tsx
import { AddressForm, useUserAddressStore } from '@/modules/userAddress';

function MyAddressScreen() {
  const { address } = useUserAddressStore();
  
  return (
    <AddressForm
      onSubmit={(address) => console.log('Address submitted:', address)}
      onValidationChange={(isValid) => console.log('Form valid:', isValid)}
    />
  );
}
```

2. MAP-INTEGRATED USAGE - With Location Picker:
```tsx
import { AddressStep, UserAddress } from '@/modules/userAddress';

function AddressSetupScreen() {
  const handleComplete = (address: UserAddress) => {
    // Save address to backend or local storage
    console.log('Complete address:', address);
  };
  
  return (
    <AddressStep
      title="Set Your Delivery Address"
      onComplete={handleComplete}
      showMapFirst={true}
      allowSkipMap={true}
      mapHeight={300}
    />
  );
}
```

3. CUSTOM USAGE - Individual Components:
```tsx
import { 
  NativeMapPicker, 
  AddressInput, 
  AddressSelect,
  CAVITE_CITIES 
} from '@/modules/userAddress';

function CustomAddressScreen() {
  return (
    <View>
      <NativeMapPicker
        height={250}
        onLocationSelect={(coords) => console.log(coords)}
        onAddressUpdate={(address) => console.log(address)}
      />
      
      <AddressSelect
        value=""
        onValueChange={(city) => console.log(city)}
        options={CAVITE_CITIES.map(city => ({ label: city, value: city }))}
        placeholder="Select your city"
      />
      
      <AddressInput
        value=""
        onChangeText={(text) => console.log(text)}
        placeholder="Enter street address"
        required
      />
    </View>
  );
}
```

4. STORE USAGE - Direct State Management:
```tsx
import { useUserAddressStore } from '@/modules/userAddress';

function AddressStatus() {
  const {
    address,
    isValidating,
    errors,
    validateAddress,
    setAddressField,
    getCurrentLocation,
  } = useUserAddressStore();
  
  const handleSave = async () => {
    const isValid = await validateAddress();
    if (isValid) {
      // Save address logic
    }
  };
  
  return (
    <View>
      <Text>Current Address: {address.formattedAddress}</Text>
      <Button onPress={() => getCurrentLocation()}>
        Get My Location
      </Button>
    </View>
  );
}
```

FEATURES:
✅ Philippine Address Structure (Cavite Province Focus)
✅ Google Places API Integration
✅ React Native Maps with Draggable Pins
✅ GPS Location Detection (Expo Location)
✅ Real-time Address Validation (Yup)
✅ Barangay Search and Autocomplete
✅ ZIP Code Auto-Selection
✅ Modular Component Architecture
✅ TypeScript Type Safety
✅ Zustand State Management
✅ Error Handling and User Feedback
✅ Responsive UI with Theme Support

REQUIREMENTS:
- react-native-maps
- expo-location  
- zustand
- yup
- Google Places API Key (for search/geocoding)

CONFIGURATION:
1. Add Google Places API key to GooglePlacesService
2. Configure react-native-maps for your platform
3. Set up location permissions in app.json/info.plist
4. Customize theme colors in your theme provider
*/