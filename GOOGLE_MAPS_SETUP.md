# Google Maps API Setup Guide

## 🗺️ Setting up Google Maps for Address Collection

Your app now includes a comprehensive address collection system with interactive maps and location services. To fully activate these features, you need to configure Google Maps API.

## Step 1: Get Google Maps API Key

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable the following APIs:    
   - **Maps JavaScript API** (for map display)
   - **Places API** (for address search and autocomplete)
   - **Geocoding API** (for converting addresses to coordinates)

4. Go to "Credentials" → "Create Credentials" → "API Key"
5. Copy your API key

## Step 2: Configure Your App

1. Open the `.env` file in your project root
2. Replace `your_google_maps_api_key_here` with your actual API key:
   ```
   EXPO_PUBLIC_GOOGLE_MAPS_API_KEY=AIzaSyC4R6AN7SmxjPUIGI...
   ```

3. Also update `app.json` - replace `YOUR_GOOGLE_MAPS_API_KEY` with your API key in the react-native-maps plugin configuration

## Step 3: Secure Your API Key (Recommended)

1. In Google Cloud Console, go to your API key settings
2. Set **Application restrictions**:
   - For development: Select "None" 
   - For production: Select "Android apps" and/or "iOS apps" and add your bundle identifiers

3. Set **API restrictions** to only allow the APIs you're using:
   - Maps JavaScript API
   - Places API  
   - Geocoding API

## Step 4: Test Your Setup

1. Run your app: `npx expo start`
2. Go to the signup screen
3. Navigate to the Address step
4. Try the following features:
   - ✅ "Use Current Location" button (requires location permissions)
   - ✅ Address search and autocomplete
   - ✅ Interactive map with draggable marker
   - ✅ Address validation for Cavite area

## Features Included

### 🎯 **Smart Location Detection**
- GPS-based location detection
- Automatic reverse geocoding to address
- Location permission handling

### 🔍 **Address Search & Autocomplete**
- Real-time address search
- Philippine address formatting
- Cavite-focused results with fallback

### 🗺️ **Interactive Map**
- Draggable marker for precise selection
- Map centering on current/selected location
- Visual address confirmation

### ✅ **Address Validation**
- Philippine address format validation
- Required field validation
- Cavite province validation

### 💾 **State Management**
- Zustand store integration
- Form validation with Yup
- Persistent address data across app navigation

## Troubleshooting

### Map Not Loading
- Check if your API key is correctly set in both `.env` and `app.json`
- Verify that Maps JavaScript API is enabled
- Check the console for API key errors

### Location Not Working
- Ensure location permissions are granted
- Check if Expo Location is properly configured
- Test on a physical device (location may not work in simulator)

### Address Search Not Working
- Verify Places API is enabled and configured
- Check your API key restrictions
- Ensure you have sufficient quota for API calls

## Development vs Production

### Development
- Use unrestricted API key for easier testing
- Test on both simulator and physical devices
- Monitor API usage in Google Cloud Console

### Production
- Restrict API key to your app bundle IDs
- Set up proper billing and quotas
- Consider implementing API key rotation

---

**Your address collection system is now ready!** 🚀

The system supports the complete flow from location detection to address validation, specifically optimized for users in Cavite, Philippines.