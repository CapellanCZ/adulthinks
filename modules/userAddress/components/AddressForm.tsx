import React, { useCallback, useEffect, useState } from 'react';
import { StyleSheet, ScrollView, Alert } from 'react-native';
import { View } from '@/components/ui/view';
import { Text } from '@/components/ui/text';
import { Button } from '@/components/ui/button';
import { useThemeColor } from '@/hooks/useThemeColor';
import { useUserAddressStore } from '../stores/useUserAddressStore';
import { AddressInput } from './AddressInput';
import { AddressSelect } from './AddressSelect';
import { AddressSearchInput } from './AddressSearchInput';
import { 
  CAVITE_CITIES, 
  CAVITE_ZIP_CODES, 
  CaviteCity,
  UserAddress 
} from '../types/AddressTypes';
import { philippineAddressSchema } from '../validation/addressSchema';
import * as yup from 'yup';

interface AddressFormProps {
  onSubmit?: (address: UserAddress) => void;
  onValidationChange?: (isValid: boolean) => void;
  showCoordinateFields?: boolean;
  submitButtonText?: string;
  showSubmitButton?: boolean;
}

const AddressForm: React.FC<AddressFormProps> = ({
  onSubmit,
  onValidationChange,
  showCoordinateFields = false,
  submitButtonText = 'Save Address',
  showSubmitButton = true,
}) => {
  // Theme colors
  const backgroundColor = useThemeColor({}, 'background');
  const textColor = useThemeColor({}, 'text');
  const borderColor = useThemeColor({}, 'border');

  // Store hooks
  const {
    address,
    errors,
    isValidating,
    setAddressField,
    setErrors,
    setFieldError,
    clearErrors,
    setValidating,
  } = useUserAddressStore();

  // Local state for form handling
  const [localErrors, setLocalErrors] = useState<Record<string, string>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [isFormValid, setIsFormValid] = useState(false);

  // Available ZIP codes based on selected city
  const [availableZipCodes, setAvailableZipCodes] = useState<string[]>([]);

  // Update available ZIP codes when city changes
  useEffect(() => {
    if (address.city && CAVITE_ZIP_CODES[address.city]) {
      setAvailableZipCodes(CAVITE_ZIP_CODES[address.city]);
      
      // Auto-select ZIP code if only one option
      const zipCodes = CAVITE_ZIP_CODES[address.city];
      if (zipCodes.length === 1 && address.zipCode !== zipCodes[0]) {
        setAddressField('zipCode', zipCodes[0]);
      }
    } else {
      setAvailableZipCodes([]);
    }
  }, [address.city, address.zipCode, setAddressField]);

  // Real-time validation
  const validateField = useCallback(async (field: keyof UserAddress, value: any) => {
    try {
      // Create a temporary address object with the new value
      const tempAddress = { ...address, [field]: value };
      
      // Validate single field using Yup schema
      await philippineAddressSchema.validateAt(field as string, tempAddress);
      
      // Clear error if validation passes
      setLocalErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
      setFieldError(field as keyof typeof errors, undefined);
      
    } catch (error) {
      if (error instanceof yup.ValidationError) {
        const errorMessage = error.message;
        setLocalErrors(prev => ({ ...prev, [field]: errorMessage }));
        setFieldError(field as keyof typeof errors, errorMessage);
      }
    }
  }, [address, setFieldError]);

  // Handle field value changes
  const handleFieldChange = useCallback((field: keyof UserAddress, value: string) => {
    setAddressField(field, value);
    setTouched(prev => ({ ...prev, [field]: true }));
    
    // Validate field in real-time if it has been touched
    if (touched[field]) {
      validateField(field, value);
    }
  }, [setAddressField, touched, validateField]);

  // Handle field blur (when user leaves the field)
  const handleFieldBlur = useCallback((field: keyof UserAddress) => {
    setTouched(prev => ({ ...prev, [field]: true }));
    validateField(field, address[field]);
  }, [address, validateField]);

  // Validate entire form
  const validateForm = useCallback(async () => {
    try {
      setValidating(true);
      clearErrors();
      setLocalErrors({});

      await philippineAddressSchema.validate(address, { abortEarly: false });
      
      setIsFormValid(true);
      onValidationChange?.(true);
      return true;
      
    } catch (error) {
      if (error instanceof yup.ValidationError) {
        const validationErrors: Record<string, string> = {};
        
        error.inner.forEach((err) => {
          if (err.path) {
            validationErrors[err.path] = err.message;
          }
        });
        
        setLocalErrors(validationErrors);
        setErrors(validationErrors);
      }
      
      setIsFormValid(false);
      onValidationChange?.(false);
      return false;
      
    } finally {
      setValidating(false);
    }
  }, [address, setValidating, clearErrors, setErrors, onValidationChange]);

  // Handle form submission
  const handleSubmit = useCallback(async () => {
    const isValid = await validateForm();
    
    if (isValid) {
      onSubmit?.(address);
    } else {
      Alert.alert(
        'Incomplete Address',
        'Please fill in all required fields and correct any errors.',
        [{ text: 'OK' }]
      );
    }
  }, [validateForm, onSubmit, address]);

  // Auto-validate form when address changes
  useEffect(() => {
    const timer = setTimeout(() => {
      if (Object.keys(touched).length > 0) {
        validateForm();
      }
    }, 500); // Debounce validation

    return () => clearTimeout(timer);
  }, [address, touched, validateForm]);

  // Styles
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: backgroundColor,
    },
    scrollView: {
      flex: 1,
      paddingHorizontal: 16,
    },
    formSection: {
      marginBottom: 24,
    },
    sectionTitle: {
      fontSize: 18,
      fontWeight: '600',
      color: textColor,
      marginBottom: 16,
    },
    fieldContainer: {
      marginBottom: 16,
    },
    label: {
      fontSize: 14,
      fontWeight: '500',
      color: textColor,
      marginBottom: 8,
    },
    requiredIndicator: {
      color: '#FF6B6B',
    },
    helpText: {
      fontSize: 12,
      color: textColor,
      opacity: 0.6,
      marginTop: 4,
    },
    errorText: {
      fontSize: 12,
      color: '#FF6B6B',
      marginTop: 4,
    },
    coordinateSection: {
      backgroundColor: borderColor,
      padding: 16,
      borderRadius: 8,
      marginBottom: 16,
    },
    coordinateText: {
      fontSize: 12,
      color: textColor,
      opacity: 0.8,
    },
    submitButton: {
      marginVertical: 24,
      marginHorizontal: 16,
    },
    disabledButton: {
      opacity: 0.5,
    },
  });

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        
        {/* Basic Address Section */}
        <View style={styles.formSection}>
          <Text style={styles.sectionTitle}>📍 Address Details</Text>
          
          {/* House Number */}
          <View style={styles.fieldContainer}>
            <Text style={styles.label}>
              House/Building Number
            </Text>
            <AddressInput
              value={address.houseNumber || ''}
              onChangeText={(value: string) => handleFieldChange('houseNumber', value)}
              onBlur={() => handleFieldBlur('houseNumber')}
              placeholder="e.g., 123, Blk 5 Lot 10"
              error={localErrors.houseNumber || errors.houseNumber}
            />
          </View>

          {/* Street */}
          <View style={styles.fieldContainer}>
            <Text style={styles.label}>
              Street Name <Text style={styles.requiredIndicator}>*</Text>
            </Text>
            <AddressInput
              value={address.street || ''}
              onChangeText={(value: string) => handleFieldChange('street', value)}
              onBlur={() => handleFieldBlur('street')}
              placeholder="e.g., Rizal Street, Main Road"
              error={localErrors.street || errors.street}
              required
            />
          </View>

          {/* Subdivision */}
          <View style={styles.fieldContainer}>
            <Text style={styles.label}>Subdivision/Village</Text>
            <AddressInput
              value={address.subdivision || ''}
              onChangeText={(value: string) => handleFieldChange('subdivision', value)}
              onBlur={() => handleFieldBlur('subdivision')}
              placeholder="e.g., San Lorenzo Village (optional)"
              error={localErrors.subdivision || errors.subdivision}
            />
          </View>

          {/* Barangay */}
          <View style={styles.fieldContainer}>
            <Text style={styles.label}>
              Barangay <Text style={styles.requiredIndicator}>*</Text>
            </Text>
            <AddressSearchInput
              value={address.barangay || ''}
              onChangeText={(value: string) => handleFieldChange('barangay', value)}
              onBlur={() => handleFieldBlur('barangay')}
              placeholder="Select or type barangay name"
              error={localErrors.barangay || errors.barangay}
              searchType="barangay"
              city={address.city}
              required
            />
          </View>
        </View>

        {/* Location Section */}
        <View style={styles.formSection}>
          <Text style={styles.sectionTitle}>🏙️ Location</Text>
          
          {/* City */}
          <View style={styles.fieldContainer}>
            <Text style={styles.label}>
              City/Municipality <Text style={styles.requiredIndicator}>*</Text>
            </Text>
            <AddressSelect
              value={address.city || ''}
              onValueChange={(value: string) => handleFieldChange('city', value as CaviteCity)}
              placeholder="Select city in Cavite"
              options={CAVITE_CITIES.map(city => ({ label: city, value: city }))}
              error={localErrors.city || errors.city}
              required
            />
          </View>

          {/* ZIP Code */}
          <View style={styles.fieldContainer}>
            <Text style={styles.label}>
              ZIP Code <Text style={styles.requiredIndicator}>*</Text>
            </Text>
            {availableZipCodes.length > 1 ? (
              <AddressSelect
                value={address.zipCode || ''}
                onValueChange={(value: string) => handleFieldChange('zipCode', value)}
                placeholder="Select ZIP code"
                options={availableZipCodes.map(zip => ({ label: zip, value: zip }))}
                error={localErrors.zipCode || errors.zipCode}
                required
              />
            ) : (
              <AddressInput
                value={address.zipCode || ''}
                onChangeText={(value: string) => handleFieldChange('zipCode', value)}
                onBlur={() => handleFieldBlur('zipCode')}
                placeholder="e.g., 4100"
                error={localErrors.zipCode || errors.zipCode}
                keyboardType="numeric"
                maxLength={4}
                required
              />
            )}
            <Text style={styles.helpText}>
              {address.city && availableZipCodes.length > 0 
                ? `Available ZIP codes for ${address.city}: ${availableZipCodes.join(', ')}`
                : 'Select a city to see available ZIP codes'
              }
            </Text>
          </View>
        </View>

        {/* Additional Details Section */}
        <View style={styles.formSection}>
          <Text style={styles.sectionTitle}>📝 Additional Details</Text>
          
          {/* Landmark */}
          <View style={styles.fieldContainer}>
            <Text style={styles.label}>Landmark (Optional)</Text>
            <AddressInput
              value={address.landmark || ''}
              onChangeText={(value: string) => handleFieldChange('landmark', value)}
              onBlur={() => handleFieldBlur('landmark')}
              placeholder="e.g., Near SM Bacoor, Beside 7-Eleven"
              error={localErrors.landmark || errors.landmark}
              multiline
              numberOfLines={2}
            />
          </View>

          {/* Address Notes */}
          <View style={styles.fieldContainer}>
            <Text style={styles.label}>Delivery Notes</Text>
            <AddressInput
              value={address.addressNotes || ''}
              onChangeText={(value: string) => handleFieldChange('addressNotes', value)}
              onBlur={() => handleFieldBlur('addressNotes')}
              placeholder="Special delivery instructions (optional)"
              error={localErrors.addressNotes || errors.addressNotes}
              multiline
              numberOfLines={3}
            />
          </View>
        </View>

        {/* Coordinates Section (if enabled) */}
        {showCoordinateFields && (address.latitude || address.longitude) && (
          <View style={styles.coordinateSection}>
            <Text style={styles.sectionTitle}>🌍 GPS Coordinates</Text>
            <Text style={styles.coordinateText}>
              Latitude: {address.latitude?.toFixed(6) || 'Not set'}
            </Text>
            <Text style={styles.coordinateText}>
              Longitude: {address.longitude?.toFixed(6) || 'Not set'}
            </Text>
            {address.formattedAddress && (
              <Text style={styles.coordinateText}>
                📍 {address.formattedAddress}
              </Text>
            )}
          </View>
        )}

      </ScrollView>

      {/* Submit Button */}
      {showSubmitButton && (
        <View style={styles.submitButton}>
          <Button
            onPress={handleSubmit}
            disabled={isValidating || !isFormValid}
            style={!isFormValid ? styles.disabledButton : undefined}
          >
            <Text style={{ color: 'white', fontWeight: '600' }}>
              {isValidating ? 'Validating...' : submitButtonText}
            </Text>
          </Button>
        </View>
      )}
    </View>
  );
};

export default AddressForm;