import AsyncStorage from '@react-native-async-storage/async-storage';

const REMEMBER_ME_KEY = 'remember_me_credentials';

interface SavedCredentials {
  email: string;
  rememberMe: boolean;
}

export const rememberMeUtils = {
  // Save email if remember me is checked
  async saveCredentials(email: string, rememberMe: boolean): Promise<void> {
    try {
      if (rememberMe) {
        const credentials: SavedCredentials = { email, rememberMe };
        await AsyncStorage.setItem(REMEMBER_ME_KEY, JSON.stringify(credentials));
      } else {
        // Clear saved credentials if remember me is unchecked
        await AsyncStorage.removeItem(REMEMBER_ME_KEY);
      }
    } catch (error) {
      console.error('Error saving credentials:', error);
    }
  },

  // Get saved credentials on app startup
  async getSavedCredentials(): Promise<SavedCredentials | null> {
    try {
      const savedData = await AsyncStorage.getItem(REMEMBER_ME_KEY);
      if (savedData) {
        return JSON.parse(savedData) as SavedCredentials;
      }
      return null;
    } catch (error) {
      console.error('Error retrieving credentials:', error);
      return null;
    }
  },

  // Clear saved credentials (on logout)
  async clearSavedCredentials(): Promise<void> {
    try {
      await AsyncStorage.removeItem(REMEMBER_ME_KEY);
    } catch (error) {
      console.error('Error clearing credentials:', error);
    }
  },
};