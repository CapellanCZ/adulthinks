import React, { useState, useCallback, useEffect } from 'react';
import { StyleSheet, ScrollView, Alert } from 'react-native';
import { View } from '@/components/ui/view';
import { Text } from '@/components/ui/text';
import { Button } from '@/components/ui/button';
import { useThemeColor } from '@/hooks/useThemeColor';
import { useUserAddressStore } from '../stores/useUserAddressStore';
import NativeMapPicker from './NativeMapPicker';
import AddressForm from './AddressForm';
import { UserAddress } from '../types/AddressTypes';

interface AddressStepProps {
  onComplete?: (address: UserAddress) => void;
  onBack?: () => void;
  title?: string;
  showMapFirst?: boolean;
  mapHeight?: number;
  allowSkipMap?: boolean;
}

const AddressStep: React.FC<AddressStepProps> = ({
  onComplete,
  onBack,
  title = 'Set Your Address',
  showMapFirst = true,
  mapHeight = 300,
  allowSkipMap = false,
}) => {
  // Theme colors
  const backgroundColor = useThemeColor({}, 'background');
  const textColor = useThemeColor({}, 'text');
  const primaryColor = useThemeColor({}, 'tint');

  // Store hooks
  const {
    address,
    isValidating,
    selectedCoordinates,
    locationError,
    clearErrors,
  } = useUserAddressStore();

  // Local state for step management
  const [currentStep, setCurrentStep] = useState<'map' | 'form' | 'review'>('map');
  const [isMapSkipped, setIsMapSkipped] = useState(false);
  const [isFormValid, setIsFormValid] = useState(false);

  // Handle location selection from map
  const handleLocationSelect = useCallback((location: { latitude: number; longitude: number }) => {
    console.log('Location selected:', location);
  }, []);

  // Handle address update from map
  const handleAddressUpdate = useCallback((formattedAddress: string) => {
    console.log('Address updated from map:', formattedAddress);
  }, []);

  // Handle form validation changes
  const handleValidationChange = useCallback((isValid: boolean) => {
    setIsFormValid(isValid);
  }, []);

  // Handle step transitions
  const handleNextStep = useCallback(() => {
    if (currentStep === 'map') {
      setCurrentStep('form');
    } else if (currentStep === 'form') {
      setCurrentStep('review');
    }
  }, [currentStep]);

  const handlePrevStep = useCallback(() => {
    if (currentStep === 'review') {
      setCurrentStep('form');
    } else if (currentStep === 'form') {
      if (isMapSkipped || !showMapFirst) {
        onBack?.();
      } else {
        setCurrentStep('map');
      }
    } else if (currentStep === 'map') {
      onBack?.();
    }
  }, [currentStep, isMapSkipped, showMapFirst, onBack]);

  // Handle map skip
  const handleSkipMap = useCallback(() => {
    if (allowSkipMap) {
      setIsMapSkipped(true);
      setCurrentStep('form');
    }
  }, [allowSkipMap]);

  // Handle form submission
  const handleFormSubmit = useCallback((submittedAddress: UserAddress) => {
    setCurrentStep('review');
  }, []);

  // Handle final completion
  const handleComplete = useCallback(() => {
    if (!isFormValid) {
      Alert.alert(
        'Incomplete Address',
        'Please ensure all required fields are filled and valid.',
        [{ text: 'OK' }]
      );
      return;
    }

    onComplete?.(address);
  }, [isFormValid, address, onComplete]);

  // Initialize step based on props
  useEffect(() => {
    if (!showMapFirst) {
      setCurrentStep('form');
      setIsMapSkipped(true);
    }
  }, [showMapFirst]);

  // Clear errors when step changes
  useEffect(() => {
    clearErrors();
  }, [currentStep, clearErrors]);

  // Styles
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: backgroundColor,
    },
    header: {
      paddingHorizontal: 16,
      paddingVertical: 20,
      borderBottomWidth: 1,
      borderBottomColor: `${textColor}20`,
    },
    title: {
      fontSize: 24,
      fontWeight: 'bold',
      color: textColor,
      textAlign: 'center',
    },
    subtitle: {
      fontSize: 14,
      color: textColor,
      opacity: 0.7,
      textAlign: 'center',
      marginTop: 4,
    },
    stepIndicator: {
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      paddingHorizontal: 16,
      paddingVertical: 16,
    },
    stepDot: {
      width: 12,
      height: 12,
      borderRadius: 6,
      backgroundColor: `${textColor}30`,
      marginHorizontal: 4,
    },
    activeStepDot: {
      backgroundColor: primaryColor,
    },
    completedStepDot: {
      backgroundColor: '#4CAF50',
    },
    stepLine: {
      width: 24,
      height: 2,
      backgroundColor: `${textColor}20`,
      marginHorizontal: 4,
    },
    activeStepLine: {
      backgroundColor: primaryColor,
    },
    content: {
      flex: 1,
    },
    mapContainer: {
      padding: 16,
    },
    mapSection: {
      marginBottom: 20,
    },
    sectionTitle: {
      fontSize: 18,
      fontWeight: '600',
      color: textColor,
      marginBottom: 12,
    },
    sectionDescription: {
      fontSize: 14,
      color: textColor,
      opacity: 0.7,
      marginBottom: 16,
      lineHeight: 20,
    },
    skipButton: {
      marginTop: 12,
      alignSelf: 'center',
    },
    skipButtonText: {
      fontSize: 14,
      color: primaryColor,
      textDecorationLine: 'underline',
    },
    reviewSection: {
      padding: 16,
    },
    reviewCard: {
      backgroundColor: `${textColor}05`,
      borderRadius: 12,
      padding: 16,
      marginBottom: 16,
    },
    reviewTitle: {
      fontSize: 16,
      fontWeight: '600',
      color: textColor,
      marginBottom: 12,
    },
    reviewText: {
      fontSize: 14,
      color: textColor,
      lineHeight: 20,
      marginBottom: 8,
    },
    coordinateInfo: {
      fontSize: 12,
      color: textColor,
      opacity: 0.6,
    },
    buttonContainer: {
      flexDirection: 'row',
      paddingHorizontal: 16,
      paddingVertical: 16,
      gap: 12,
    },
    backButton: {
      flex: 1,
      backgroundColor: 'transparent',
      borderWidth: 1,
      borderColor: primaryColor,
    },
    backButtonText: {
      color: primaryColor,
      fontWeight: '500',
    },
    nextButton: {
      flex: 2,
      backgroundColor: primaryColor,
    },
    nextButtonText: {
      color: 'white',
      fontWeight: '600',
    },
    disabledButton: {
      opacity: 0.5,
    },
  });

  const getStepNumber = (step: string): number => {
    if (step === 'map') return 1;
    if (step === 'form') return 2;
    if (step === 'review') return 3;
    return 1;
  };

  const getStepTitle = (): string => {
    switch (currentStep) {
      case 'map':
        return 'Pin Your Location';
      case 'form':
        return 'Complete Address';
      case 'review':
        return 'Review & Confirm';
      default:
        return '';
    }
  };

  const getStepDescription = (): string => {
    switch (currentStep) {
      case 'map':
        return 'Drag the pin to your exact location or use "My Location" button for GPS.';
      case 'form':
        return 'Fill in your complete address details for accurate delivery.';
      case 'review':
        return 'Please review your address information before continuing.';
      default:
        return '';
    }
  };

  const canProceed = (): boolean => {
    switch (currentStep) {
      case 'map':
        return selectedCoordinates !== null || isMapSkipped;
      case 'form':
        return isFormValid;
      case 'review':
        return isFormValid;
      default:
        return false;
    }
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.subtitle}>{getStepTitle()}</Text>
      </View>

      {/* Step Indicator */}
      <View style={styles.stepIndicator}>
        {/* Step 1 - Map */}
        <View style={[
          styles.stepDot,
          getStepNumber(currentStep) >= 1 && styles.activeStepDot,
          (isMapSkipped || getStepNumber(currentStep) > 1) && styles.completedStepDot,
        ]} />
        <View style={[
          styles.stepLine,
          getStepNumber(currentStep) > 1 && styles.activeStepLine,
        ]} />

        {/* Step 2 - Form */}
        <View style={[
          styles.stepDot,
          getStepNumber(currentStep) >= 2 && styles.activeStepDot,
          getStepNumber(currentStep) > 2 && styles.completedStepDot,
        ]} />
        <View style={[
          styles.stepLine,
          getStepNumber(currentStep) > 2 && styles.activeStepLine,
        ]} />

        {/* Step 3 - Review */}
        <View style={[
          styles.stepDot,
          getStepNumber(currentStep) >= 3 && styles.activeStepDot,
        ]} />
      </View>

      {/* Content */}
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        
        {/* Map Step */}
        {currentStep === 'map' && (
          <View style={styles.mapContainer}>
            <View style={styles.mapSection}>
              <Text style={styles.sectionTitle}>📍 Pin Your Location</Text>
              <Text style={styles.sectionDescription}>
                {getStepDescription()}
              </Text>
              
              <NativeMapPicker
                onLocationSelect={handleLocationSelect}
                onAddressUpdate={handleAddressUpdate}
                height={mapHeight}
              />
              
              {allowSkipMap && (
                <Button
                  onPress={handleSkipMap}
                  style={styles.skipButton}
                >
                  <Text style={styles.skipButtonText}>
                    Skip and enter address manually
                  </Text>
                </Button>
              )}
            </View>
          </View>
        )}

        {/* Form Step */}
        {currentStep === 'form' && (
          <AddressForm
            onSubmit={handleFormSubmit}
            onValidationChange={handleValidationChange}
            showCoordinateFields={!!selectedCoordinates}
            showSubmitButton={false}
          />
        )}

        {/* Review Step */}
        {currentStep === 'review' && (
          <View style={styles.reviewSection}>
            <Text style={styles.sectionTitle}>📋 Review Your Address</Text>
            <Text style={styles.sectionDescription}>
              {getStepDescription()}
            </Text>

            <View style={styles.reviewCard}>
              <Text style={styles.reviewTitle}>Delivery Address</Text>
              
              <Text style={styles.reviewText}>
                <Text style={{fontWeight: '500'}}>Street:</Text> {address.street || 'Not provided'}
              </Text>
              
              {address.subdivision && (
                <Text style={styles.reviewText}>
                  <Text style={{fontWeight: '500'}}>Subdivision:</Text> {address.subdivision}
                </Text>
              )}
              
              <Text style={styles.reviewText}>
                <Text style={{fontWeight: '500'}}>Barangay:</Text> {address.barangay || 'Not provided'}
              </Text>
              
              <Text style={styles.reviewText}>
                <Text style={{fontWeight: '500'}}>City:</Text> {address.city || 'Not provided'}
              </Text>
              
              <Text style={styles.reviewText}>
                <Text style={{fontWeight: '500'}}>ZIP Code:</Text> {address.zipCode || 'Not provided'}
              </Text>
              
              {address.landmark && (
                <Text style={styles.reviewText}>
                  <Text style={{fontWeight: '500'}}>Landmark:</Text> {address.landmark}
                </Text>
              )}
              
              {address.addressNotes && (
                <Text style={styles.reviewText}>
                  <Text style={{fontWeight: '500'}}>Notes:</Text> {address.addressNotes}
                </Text>
              )}
              
              {selectedCoordinates && (
                <Text style={styles.coordinateInfo}>
                  📍 GPS: {selectedCoordinates.latitude.toFixed(6)}, {selectedCoordinates.longitude.toFixed(6)}
                </Text>
              )}
            </View>

            {locationError && (
              <View style={styles.reviewCard}>
                <Text style={[styles.reviewTitle, { color: '#FF6B6B' }]}>⚠️ Notice</Text>
                <Text style={[styles.reviewText, { color: '#FF6B6B' }]}>
                  {locationError}
                </Text>
              </View>
            )}
          </View>
        )}

      </ScrollView>

      {/* Bottom Buttons */}
      <View style={styles.buttonContainer}>
        <Button
          onPress={handlePrevStep}
          style={styles.backButton}
        >
          <Text style={styles.backButtonText}>
            {currentStep === 'map' ? 'Back' : 'Previous'}
          </Text>
        </Button>
        
        <Button
          onPress={currentStep === 'review' ? handleComplete : handleNextStep}
          disabled={!canProceed() || isValidating}
          style={[
            styles.nextButton,
            ...((!canProceed() || isValidating) ? [styles.disabledButton] : []),
          ]}
        >
          <Text style={styles.nextButtonText}>
            {(() => {
              if (isValidating) return 'Validating...';
              if (currentStep === 'review') return 'Complete';
              return 'Continue';
            })()}
          </Text>
        </Button>
      </View>
    </View>
  );
};

export default AddressStep;