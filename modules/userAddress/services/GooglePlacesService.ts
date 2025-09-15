import { 
  Coordinates, 
  PlaceDetails, 
  AddressSearchResult, 
  UserAddress,
  AddressComponent 
} from '../types/AddressTypes';

/**
 * GooglePlacesService - Handles Google Places API integration for address search and geocoding
 * Provides address search, reverse geocoding, and place details functionality
 */
export class GooglePlacesService {
  private static instance: GooglePlacesService;
  private apiKey: string = '';

  private constructor() {
    // Initialize with environment variable if available
    this.apiKey = process.env.EXPO_PUBLIC_GOOGLE_MAPS_API_KEY || '';
  }

  // Singleton pattern
  public static getInstance(): GooglePlacesService {
    if (!GooglePlacesService.instance) {
      GooglePlacesService.instance = new GooglePlacesService();
    }
    return GooglePlacesService.instance;
  }

  /**
   * Initialize the service with Google Places API key
   * @param apiKey - Google Places API key
   */
  initialize(apiKey: string) {
    this.apiKey = apiKey;
  }

  /**
   * Search for places based on query text (autocomplete)
   * @param query - Search query
   * @param region - Optional region bias (defaults to Cavite)
   * @returns Promise<AddressSearchResult[]>
   */
  async searchPlaces(query: string, region: Coordinates = { latitude: 14.2456, longitude: 120.8792 }): Promise<AddressSearchResult[]> {
    try {
      if (!this.apiKey) {
        throw new Error('Google Places API key not configured');
      }

      if (query.length < 3) {
        return [];
      }

      const url = this.buildAutocompleteUrl(query, region);
      const response = await fetch(url);
      const data = await response.json();

      if (data.status === 'OK') {
        return data.predictions.map((prediction: any) => ({
          id: prediction.place_id,
          description: prediction.description,
          place_id: prediction.place_id,
          structured_formatting: prediction.structured_formatting,
        }));
      } else {
        console.warn('Google Places API error:', data.status, data.error_message);
        return [];
      }
    } catch (error) {
      console.error('Error searching places:', error);
      return [];
    }
  }

  /**
   * Get detailed information about a specific place
   * @param placeId - Google Places ID
   * @returns Promise<PlaceDetails | null>
   */
  async getPlaceDetails(placeId: string): Promise<PlaceDetails | null> {
    try {
      if (!this.apiKey) {
        throw new Error('Google Places API key not configured');
      }

      const url = this.buildPlaceDetailsUrl(placeId);
      const response = await fetch(url);
      const data = await response.json();

      if (data.status === 'OK') {
        return data.result;
      } else {
        console.warn('Google Places Details API error:', data.status, data.error_message);
        return null;
      }
    } catch (error) {
      console.error('Error getting place details:', error);
      return null;
    }
  }

  /**
   * Reverse geocode coordinates to get address information
   * @param coordinates - GPS coordinates
   * @returns Promise<UserAddress | null>
   */
  async reverseGeocode(coordinates: Coordinates): Promise<UserAddress | null> {
    try {
      if (!this.apiKey) {
        throw new Error('Google Places API key not configured');
      }

      const url = this.buildReverseGeocodeUrl(coordinates);
      const response = await fetch(url);
      const data = await response.json();

      if (data.status === 'OK' && data.results.length > 0) {
        const result = data.results[0];
        return this.parseAddressFromComponents(result.address_components, result.formatted_address);
      } else {
        console.warn('Reverse geocoding error:', data.status, data.error_message);
        return null;
      }
    } catch (error) {
      console.error('Error reverse geocoding:', error);
      return null;
    }
  }

  /**
   * Forward geocode address text to coordinates
   * @param address - Address string to geocode
   * @returns Promise<Coordinates | null>
   */
  async forwardGeocode(address: string): Promise<Coordinates | null> {
    try {
      if (!this.apiKey) {
        throw new Error('Google Places API key not configured');
      }

      const url = this.buildGeocodeUrl(address);
      const response = await fetch(url);
      const data = await response.json();

      if (data.status === 'OK' && data.results.length > 0) {
        const location = data.results[0].geometry.location;
        return {
          latitude: location.lat,
          longitude: location.lng,
        };
      } else {
        console.warn('Geocoding error:', data.status, data.error_message);
        return null;
      }
    } catch (error) {
      console.error('Error geocoding address:', error);
      return null;
    }
  }

  /**
   * Parse Google Places address components into UserAddress format
   * @param components - Address components from Google Places API
   * @param formattedAddress - Formatted address string
   * @returns UserAddress
   */
  private parseAddressFromComponents(components: AddressComponent[], formattedAddress: string): UserAddress {
    const address: UserAddress = {
      formattedAddress,
      province: 'Cavite', // Default to Cavite
    };

    components.forEach((component) => {
      const { long_name, types } = component;

      if (types.includes('street_number')) {
        address.houseNumber = long_name;
      } else if (types.includes('route')) {
        address.street = long_name;
      } else if (types.includes('sublocality') || types.includes('sublocality_level_1')) {
        address.barangay = long_name;
      } else if (types.includes('locality') || types.includes('administrative_area_level_2')) {
        address.city = long_name;
      } else if (types.includes('administrative_area_level_1')) {
        // Only use if it's actually Cavite
        if (long_name === 'Cavite') {
          address.province = long_name;
        }
      } else if (types.includes('postal_code')) {
        address.zipCode = long_name;
      } else if (types.includes('neighborhood')) {
        address.subdivision = long_name;
      }
    });

    return address;
  }

  /**
   * Build Google Places Autocomplete API URL
   * @param query - Search query
   * @param region - Region bias coordinates
   * @returns string
   */
  private buildAutocompleteUrl(query: string, region: Coordinates): string {
    const baseUrl = 'https://maps.googleapis.com/maps/api/place/autocomplete/json';
    const params = new URLSearchParams({
      input: query,
      key: this.apiKey,
      location: `${region.latitude},${region.longitude}`,
      radius: '50000', // 50km radius
      components: 'country:PH|administrative_area:Cavite', // Restrict to Philippines, bias to Cavite
      types: 'address',
      language: 'en',
    });

    return `${baseUrl}?${params.toString()}`;
  }

  /**
   * Build Google Places Details API URL
   * @param placeId - Place ID
   * @returns string
   */
  private buildPlaceDetailsUrl(placeId: string): string {
    const baseUrl = 'https://maps.googleapis.com/maps/api/place/details/json';
    const params = new URLSearchParams({
      place_id: placeId,
      key: this.apiKey,
      fields: 'address_components,formatted_address,geometry,place_id',
      language: 'en',
    });

    return `${baseUrl}?${params.toString()}`;
  }

  /**
   * Build Google Geocoding API URL for reverse geocoding
   * @param coordinates - GPS coordinates
   * @returns string
   */
  private buildReverseGeocodeUrl(coordinates: Coordinates): string {
    const baseUrl = 'https://maps.googleapis.com/maps/api/geocode/json';
    const params = new URLSearchParams({
      latlng: `${coordinates.latitude},${coordinates.longitude}`,
      key: this.apiKey,
      result_type: 'street_address',
      language: 'en',
    });

    return `${baseUrl}?${params.toString()}`;
  }

  /**
   * Build Google Geocoding API URL for forward geocoding
   * @param address - Address string
   * @returns string
   */
  private buildGeocodeUrl(address: string): string {
    const baseUrl = 'https://maps.googleapis.com/maps/api/geocode/json';
    const params = new URLSearchParams({
      address: `${address}, Cavite, Philippines`,
      key: this.apiKey,
      components: 'country:PH|administrative_area:Cavite',
      language: 'en',
    });

    return `${baseUrl}?${params.toString()}`;
  }

  /**
   * Validate if a place is within Cavite province
   * @param placeDetails - Place details from Google
   * @returns boolean
   */
  isPlaceInCavite(placeDetails: PlaceDetails): boolean {
    return placeDetails.address_components.some(
      (component) =>
        component.types.includes('administrative_area_level_1') &&
        component.long_name === 'Cavite'
    );
  }

  /**
   * Get suggestions for autocomplete without API call (fallback)
   * @param query - Search query
   * @returns string[] - Local suggestions
   */
  getLocalSuggestions(query: string): string[] {
    const caviteCities = [
      'Bacoor, Cavite',
      'Cavite City, Cavite',
      'Dasmariñas, Cavite',
      'General Trias, Cavite',
      'Imus, Cavite',
      'Kawit, Cavite',
      'Rosario, Cavite',
      'Trece Martires, Cavite',
      'Carmona, Cavite',
      'General Emilio Aguinaldo, Cavite',
      'General Mariano Alvarez, Cavite',
      'Silang, Cavite',
      'Tagaytay, Cavite',
      'Tanza, Cavite',
    ];

    if (!query || query.length < 2) {
      return [];
    }

    const lowerQuery = query.toLowerCase();
    return caviteCities.filter((city) =>
      city.toLowerCase().includes(lowerQuery)
    );
  }
}

// Export singleton instance
export const googlePlacesService = GooglePlacesService.getInstance();

// Export class for testing
export default GooglePlacesService;