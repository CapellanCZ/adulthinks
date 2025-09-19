import * as yup from 'yup';
import { CAVITE_CITIES as LOCATION_DATA, getBarangaysForCity, getZipCodeForCity } from '../data/PhilippineLocations';

// Philippine ZIP code regex pattern
const PHILIPPINE_ZIP_REGEX = /^\d{4}$/;

// Street name validation regex (allows letters, numbers, spaces, common punctuation)
const STREET_NAME_REGEX = /^[a-zA-Z0-9\s.,'#/-]+$/;

// House number validation regex (flexible format)
const HOUSE_NUMBER_REGEX = /^[a-zA-Z0-9\s.#/-]+$/;

// Base validation schema for Philippine addresses
export const philippineAddressSchema = yup.object({
  houseNumber: yup
    .string()
    .optional()
    .matches(HOUSE_NUMBER_REGEX, 'Invalid house number format')
    .max(50, 'House number must be 50 characters or less'),

  street: yup
    .string()
    .required('Street address is required')
    .min(3, 'Street name must be at least 3 characters')
    .max(100, 'Street name must be 100 characters or less')
    .matches(STREET_NAME_REGEX, 'Street name contains invalid characters'),

  subdivision: yup
    .string()
    .optional()
    .min(2, 'Subdivision name must be at least 2 characters')
    .max(100, 'Subdivision name must be 100 characters or less')
    .matches(STREET_NAME_REGEX, 'Subdivision name contains invalid characters'),

  barangay: yup
    .string()
    .required('Barangay is required')
    .test(
      'valid-barangay-for-city',
      'Please select a valid barangay for the selected city',
      function(value) {
        if (!value) return false;
        
        const { city } = this.parent;
        if (!city) return true; // Will be caught by city validation
        
        // Get valid barangays for the selected city from our location data
        const validBarangays = getBarangaysForCity(city);
        return validBarangays.some(b => b.value === value);
      }
    ),

  city: yup
    .string()
    .required('City is required')
    .test(
      'valid-cavite-city',
      'Please select a valid city in Cavite',
      (value) => {
        if (!value) return false;
        // Use our comprehensive location data for validation
        return LOCATION_DATA.some(city => city.value === value);
      }
    ),

  province: yup
    .string()
    .required('Province is required')
    .oneOf(['Cavite'], 'Province must be Cavite'),

  zipCode: yup
    .string()
    .required('ZIP code is required')
    .matches(PHILIPPINE_ZIP_REGEX, 'ZIP code must be 4 digits')
    .test('valid-cavite-zip', 'ZIP code does not match the selected city', function(value) {
      if (!value) return true; // Let required validation handle empty values
      
      const { city } = this.parent;
      if (!city) return true; // Can't validate ZIP without city
      
      // Use our location data for accurate ZIP code validation
      const expectedZipCode = getZipCodeForCity(city);
      return expectedZipCode === value;
    }),

  landmark: yup
    .string()
    .optional()
    .max(200, 'Landmark description must be 200 characters or less'),

  addressNotes: yup
    .string()
    .optional()
    .max(300, 'Address notes must be 300 characters or less'),
});

// Coordinate validation schema
export const coordinateSchema = yup.object({
  latitude: yup
    .number()
    .required('Latitude is required')
    .min(-90, 'Latitude must be between -90 and 90')
    .max(90, 'Latitude must be between -90 and 90'),

  longitude: yup
    .number()
    .required('Longitude is required')
    .min(-180, 'Longitude must be between -180 and 180')
    .max(180, 'Longitude must be between -180 and 180'),
});

// Complete address validation schema (including coordinates)
export const completeAddressSchema = philippineAddressSchema.concat(
  yup.object({
    latitude: yup.number().optional(),
    longitude: yup.number().optional(),
    formattedAddress: yup.string().optional(),
    isValidated: yup.boolean().optional(),
    placeId: yup.string().optional(),
  })
);

// Step-by-step validation schemas for progressive validation
export const basicAddressSchema = yup.object({
  street: philippineAddressSchema.fields.street,
  barangay: philippineAddressSchema.fields.barangay,
  city: philippineAddressSchema.fields.city,
});

export const detailedAddressSchema = basicAddressSchema.concat(
  yup.object({
    houseNumber: philippineAddressSchema.fields.houseNumber,
    subdivision: philippineAddressSchema.fields.subdivision,
    zipCode: philippineAddressSchema.fields.zipCode,
  })
);

// Validation helper functions
export const validateAddressField = async (field: string, value: any, context?: any) => {
  try {
    const schema = yup.reach(philippineAddressSchema, field) as yup.AnySchema;
    await schema.validate(value, { context });
    return null; // No error
  } catch (error) {
    if (error instanceof yup.ValidationError) {
      return error.message;
    }
    return 'Validation error';
  }
};

export const validatePartialAddress = async (addressData: any) => {
  const errors: Record<string, string> = {};
  
  for (const [field, value] of Object.entries(addressData)) {
    if (value !== undefined && value !== null && value !== '') {
      const error = await validateAddressField(field, value, addressData);
      if (error) {
        errors[field] = error;
      }
    }
  }
  
  return errors;
};

export const validateCompleteAddress = async (addressData: any) => {
  try {
    await philippineAddressSchema.validate(addressData, { abortEarly: false });
    return {}; // No errors
  } catch (error) {
    if (error instanceof yup.ValidationError) {
      const errors: Record<string, string> = {};
      error.inner.forEach((err) => {
        if (err.path) {
          errors[err.path] = err.message;
        }
      });
      return errors;
    }
    return { general: 'Validation failed' };
  }
};

// Address completeness checker
export const isAddressComplete = (addressData: any): boolean => {
  const requiredFields = ['street', 'barangay', 'city', 'province', 'zipCode'];
  return requiredFields.every(field => 
    addressData[field] && 
    typeof addressData[field] === 'string' && 
    addressData[field].trim().length > 0
  );
};

// ZIP code suggestion based on city using our location data
export const suggestZipCodesForCity = (city: string): string[] => {
  const zipCode = getZipCodeForCity(city);
  return zipCode ? [zipCode] : [];
};

// Address formatting utility
export const formatPhilippineAddress = (addressData: any): string => {
  const parts = [
    addressData.houseNumber,
    addressData.street,
    addressData.subdivision && `(${addressData.subdivision})`,
    addressData.barangay && `Brgy. ${addressData.barangay}`,
    addressData.city,
    addressData.province,
    addressData.zipCode,
  ].filter(Boolean);

  return parts.join(', ');
};

// Export validation schemas as default
export default {
  philippineAddressSchema,
  coordinateSchema,
  completeAddressSchema,
  basicAddressSchema,
  detailedAddressSchema,
  validateAddressField,
  validatePartialAddress,
  validateCompleteAddress,
  isAddressComplete,
  suggestZipCodesForCity,
  formatPhilippineAddress,
};