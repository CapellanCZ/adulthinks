import * as Location from 'expo-location';
import { Coordinates, LocationPermissionStatus } from '../types/AddressTypes';

/**
 * GeolocationService - Handles GPS location detection, permissions, and error management
 * Provides a clean abstraction over expo-location with proper error handling
 */
export class GeolocationService {
  private static instance: GeolocationService;
  
  // Singleton pattern for consistent location service
  public static getInstance(): GeolocationService {
    if (!GeolocationService.instance) {
      GeolocationService.instance = new GeolocationService();
    }
    return GeolocationService.instance;
  }

  /**
   * Request foreground location permissions
   * @returns Promise<LocationPermissionStatus>
   */
  async requestLocationPermission(): Promise<LocationPermissionStatus> {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      
      switch (status) {
        case Location.PermissionStatus.GRANTED:
          return 'granted';
        case Location.PermissionStatus.DENIED:
          return 'denied';
        default:
          return 'unknown';
      }
    } catch (error) {
      console.error('Error requesting location permission:', error);
      return 'denied';
    }
  }

  /**
   * Check current location permission status
   * @returns Promise<LocationPermissionStatus>
   */
  async checkLocationPermission(): Promise<LocationPermissionStatus> {
    try {
      const { status } = await Location.getForegroundPermissionsAsync();
      
      switch (status) {
        case Location.PermissionStatus.GRANTED:
          return 'granted';
        case Location.PermissionStatus.DENIED:
          return 'denied';
        default:
          return 'unknown';
      }
    } catch (error) {
      console.error('Error checking location permission:', error);
      return 'unknown';
    }
  }

  /**
   * Get current device location with high accuracy
   * @returns Promise<Coordinates | null>
   */
  async getCurrentLocation(): Promise<Coordinates | null> {
    try {
      // Check permission first
      const permission = await this.checkLocationPermission();
      if (permission !== 'granted') {
        const requestResult = await this.requestLocationPermission();
        if (requestResult !== 'granted') {
          throw new Error('Location permission denied');
        }
      }

      // Check if location services are enabled
      const isEnabled = await Location.hasServicesEnabledAsync();
      if (!isEnabled) {
        throw new Error('Location services are disabled. Please enable location services in your device settings.');
      }

      // Get current position with high accuracy
      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High,
        timeInterval: 10000, // 10 seconds timeout
      });

      return {
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      };

    } catch (error) {
      console.error('Error getting current location:', error);
      
      if (error instanceof Error) {
        // Re-throw with user-friendly message
        if (error.message.includes('permission')) {
          throw new Error('Location permission is required to use this feature');
        } else if (error.message.includes('services')) {
          throw new Error('Please enable location services in your device settings');
        } else if (error.message.includes('timeout')) {
          throw new Error('Location request timed out. Please try again.');
        }
      }
      
      throw new Error('Unable to get your current location. Please try again or enter your address manually.');
    }
  }

  /**
   * Get location with custom accuracy settings
   * @param accuracy - Location accuracy level
   * @returns Promise<Coordinates | null>
   */
  async getLocationWithAccuracy(accuracy: Location.Accuracy = Location.Accuracy.Balanced): Promise<Coordinates | null> {
    try {
      const permission = await this.checkLocationPermission();
      if (permission !== 'granted') {
        const requestResult = await this.requestLocationPermission();
        if (requestResult !== 'granted') {
          throw new Error('Location permission denied');
        }
      }

      const location = await Location.getCurrentPositionAsync({
        accuracy,
        timeInterval: 15000, // 15 seconds timeout for lower accuracy
      });

      return {
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      };

    } catch (error) {
      console.error('Error getting location with custom accuracy:', error);
      return null;
    }
  }

  /**
   * Check if coordinates are within Cavite province bounds
   * @param coordinates - GPS coordinates to check
   * @returns boolean
   */
  isWithinCaviteBounds(coordinates: Coordinates): boolean {
    // Cavite province approximate bounds
    const CAVITE_BOUNDS = {
      north: 14.5,    // Northern boundary
      south: 14.0,    // Southern boundary  
      east: 121.1,    // Eastern boundary
      west: 120.5,    // Western boundary
    };

    return (
      coordinates.latitude >= CAVITE_BOUNDS.south &&
      coordinates.latitude <= CAVITE_BOUNDS.north &&
      coordinates.longitude >= CAVITE_BOUNDS.west &&
      coordinates.longitude <= CAVITE_BOUNDS.east
    );
  }

  /**
   * Calculate distance between two coordinates in kilometers
   * @param coord1 - First coordinate
   * @param coord2 - Second coordinate
   * @returns number - Distance in kilometers
   */
  calculateDistance(coord1: Coordinates, coord2: Coordinates): number {
    const R = 6371; // Earth's radius in kilometers
    const dLat = this.toRadians(coord2.latitude - coord1.latitude);
    const dLon = this.toRadians(coord2.longitude - coord1.longitude);
    
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(this.toRadians(coord1.latitude)) * Math.cos(this.toRadians(coord2.latitude)) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  }

  /**
   * Get user-friendly error message for location errors
   * @param error - Error object
   * @returns string - User-friendly error message
   */
  getLocationErrorMessage(error: any): string {
    if (error?.message) {
      const message = error.message.toLowerCase();
      
      if (message.includes('permission')) {
        return 'Location permission is required. Please enable location access in your device settings.';
      } else if (message.includes('timeout')) {
        return 'Location request timed out. Please check your GPS signal and try again.';
      } else if (message.includes('service')) {
        return 'Location services are disabled. Please enable GPS in your device settings.';
      } else if (message.includes('network')) {
        return 'Network error while getting location. Please check your internet connection.';
      }
    }
    
    return 'Unable to get your location. Please try again or enter your address manually.';
  }

  /**
   * Watch user location for continuous updates (for future use)
   * @param callback - Function to call when location updates
   * @param accuracy - Location accuracy level
   * @returns Location subscription object
   */
  async watchLocation(
    callback: (coordinates: Coordinates) => void,
    accuracy: Location.Accuracy = Location.Accuracy.Balanced
  ) {
    try {
      const permission = await this.checkLocationPermission();
      if (permission !== 'granted') {
        throw new Error('Location permission required for location tracking');
      }

      return await Location.watchPositionAsync(
        {
          accuracy,
          timeInterval: 5000, // Update every 5 seconds
          distanceInterval: 10, // Update when moved 10 meters
        },
        (location) => {
          callback({
            latitude: location.coords.latitude,
            longitude: location.coords.longitude,
          });
        }
      );

    } catch (error) {
      console.error('Error watching location:', error);
      throw error;
    }
  }

  /**
   * Convert degrees to radians (helper function)
   * @param degrees - Degrees to convert
   * @returns number - Radians
   */
  private toRadians(degrees: number): number {
    return degrees * (Math.PI / 180);
  }
}

// Export singleton instance
export const geolocationService = GeolocationService.getInstance();

// Export class for testing
export default GeolocationService;