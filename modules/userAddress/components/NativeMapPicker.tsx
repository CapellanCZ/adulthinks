import React, { useEffect, useState, useCallback } from 'react';
import { StyleSheet, Alert, ActivityIndicator } from 'react-native';
// Temporarily removing expo-maps until proper configuration
// import { GoogleMaps } from 'expo-maps';
import { View } from '@/components/ui/view';
import { Text } from '@/components/ui/text';
import { Button } from '@/components/ui/button';
import { useThemeColor } from '@/hooks/useThemeColor';
import { useUserAddressStore } from '../stores/useUserAddressStore';
import { GeolocationService } from '../services/GeolocationService';
import { CAVITE_CENTER } from '../types/AddressTypes';

interface NativeMapPickerProps {
  onLocationSelect?: (location: { latitude: number; longitude: number }) => void;
  onAddressUpdate?: (address: string) => void;
  initialLocation?: {
    latitude: number;
    longitude: number;
  };
  height?: number;
}

const NativeMapPicker: React.FC<NativeMapPickerProps> = ({
  onLocationSelect,
  onAddressUpdate,
  initialLocation,
  height = 300,
}) => {
  // Theme colors
  const backgroundColor = useThemeColor({}, 'background');
  const textColor = useThemeColor({}, 'text');

  // Store hooks
  const {
    address,
    selectedCoordinates,
    setSelectedCoordinates,
    isLoadingLocation,
    setLoadingLocation,
    locationError,
    setLocationError,
  } = useUserAddressStore();

  // Local state
  const [markerPosition, setMarkerPosition] = useState({
    latitude: initialLocation?.latitude || selectedCoordinates?.latitude || CAVITE_CENTER.latitude,
    longitude: initialLocation?.longitude || selectedCoordinates?.longitude || CAVITE_CENTER.longitude,
  });

  const [isLoadingCurrentLocation, setIsLoadingCurrentLocation] = useState(false);

  // Get current location
  const getCurrentLocation = useCallback(async () => {
    try {
      setIsLoadingCurrentLocation(true);
      setLocationError(null);

      const geoService = GeolocationService.getInstance();
      const location = await geoService.getCurrentLocation();
      if (location) {
        const newPosition = {
          latitude: location.latitude,
          longitude: location.longitude,
        };
        
        setMarkerPosition(newPosition);
        setSelectedCoordinates(newPosition);
        
        // Notify parent components
        onLocationSelect?.(newPosition);
        
        // Update address if we have reverse geocoding working
        if (onAddressUpdate) {
          onAddressUpdate(`Location: ${location.latitude.toFixed(6)}, ${location.longitude.toFixed(6)}`);
        }
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to get location';
      setLocationError(errorMessage);
      Alert.alert('Location Error', errorMessage);
    } finally {
      setIsLoadingCurrentLocation(false);
      setLoadingLocation(false);
    }
  }, [onLocationSelect, onAddressUpdate, setSelectedCoordinates, setLocationError, setLoadingLocation]);

  // Initialize with current location if no initial location provided
  useEffect(() => {
    if (!initialLocation && !selectedCoordinates?.latitude) {
      getCurrentLocation();
    }
  }, [initialLocation, selectedCoordinates?.latitude, getCurrentLocation]);

  // Styles
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor,
    },
    map: {
      flex: 1,
      height,
    },
    mapPlaceholder: {
      flex: 1,
      height,
      backgroundColor: '#f5f5f5',
      justifyContent: 'center',
      alignItems: 'center',
      borderRadius: 8,
      marginBottom: 16,
      borderWidth: 2,
      borderColor: '#e0e0e0',
      borderStyle: 'dashed',
    },
    mapPlaceholderText: {
      fontSize: 16,
      color: '#666',
      textAlign: 'center',
      marginBottom: 8,
    },
    mapNote: {
      fontSize: 12,
      color: '#999',
      textAlign: 'center',
      fontStyle: 'italic',
    },
    buttonContainer: {
      flexDirection: 'row',
      justifyContent: 'space-around',
      padding: 16,
      backgroundColor,
    },
    locationButton: {
      flex: 1,
      marginHorizontal: 8,
    },
    loadingContainer: {
      position: 'absolute',
      top: 16,
      left: 16,
      right: 16,
      backgroundColor: 'rgba(0,0,0,0.8)',
      padding: 12,
      borderRadius: 8,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
    },
    loadingText: {
      color: 'white',
      marginLeft: 8,
      fontSize: 14,
    },
    errorContainer: {
      padding: 16,
      backgroundColor: '#ffebee',
      borderLeftWidth: 4,
      borderLeftColor: '#f44336',
      margin: 16,
      borderRadius: 4,
    },
    errorText: {
      color: '#c62828',
      fontSize: 14,
      fontWeight: '500',
    },
    coordinatesText: {
      fontSize: 12,
      color: textColor,
      marginBottom: 4,
    },
    coordinatesContainer: {
      padding: 16,
      backgroundColor,
      borderTopWidth: 1,
      borderTopColor: '#e0e0e0',
    },
    coordinatesTitle: {
      fontSize: 14,
      fontWeight: 'bold',
      color: textColor,
      marginBottom: 8,
    },
    addressText: {
      fontSize: 12,
      color: '#666',
      fontStyle: 'italic',
    },
  });

  return (
    <View style={styles.container}>
      {/* Map Placeholder (until native maps are properly configured) */}
      <View style={styles.mapPlaceholder}>
        <Text style={styles.mapPlaceholderText}>📍 Interactive Map</Text>
        <Text style={styles.mapNote}>
          Map will display once Google Maps API is configured
        </Text>
        {markerPosition && (
          <View style={{ marginTop: 16, alignItems: 'center' }}>
            <Text style={styles.coordinatesText}>
              📌 Selected Location:
            </Text>
            <Text style={styles.coordinatesText}>
              {markerPosition.latitude.toFixed(6)}, {markerPosition.longitude.toFixed(6)}
            </Text>
          </View>
        )}
      </View>

      {/* Loading indicator */}
      {(isLoadingCurrentLocation || isLoadingLocation) && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="small" color="white" />
          <Text style={styles.loadingText}>
            {isLoadingCurrentLocation ? 'Getting your location...' : 'Loading...'}
          </Text>
        </View>
      )}

      {/* Error display */}
      {locationError && (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{locationError}</Text>
        </View>
      )}

      {/* Controls */}
      <View style={styles.buttonContainer}>
        <Button 
          label="Use Current Location"
          onPress={getCurrentLocation}
          disabled={isLoadingCurrentLocation}
          style={styles.locationButton}
        />
      </View>

      {/* Location Details */}
      <View style={styles.coordinatesContainer}>
        <Text style={styles.coordinatesTitle}>Selected Location Details:</Text>
        <Text style={styles.coordinatesText}>
          Latitude: {markerPosition.latitude.toFixed(6)}
        </Text>
        <Text style={styles.coordinatesText}>
          Longitude: {markerPosition.longitude.toFixed(6)}
        </Text>
        {address.formattedAddress && (
          <Text style={styles.addressText}>
            Address: {address.formattedAddress}
          </Text>
        )}
      </View>
    </View>
  );
};

export default NativeMapPicker;