// services/profileService.ts
import { UserProfile, ProfileService } from '@/modules/profile/types/profile';

class ProfileServiceImpl implements ProfileService {
  
  async logout(): Promise<void> {
    try {
      // TODO: Implement actual logout logic
      // - Clear async storage
      // - Revoke tokens
      // - Clear user session
      
      console.log('Logging out user...');
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Clear stored data
      // await AsyncStorage.multiRemove(['userToken', 'userProfile']);
      
      console.log('User logged out successfully');
    } catch (error) {
      console.error('Logout failed:', error);
      throw new Error('Failed to logout. Please try again.');
    }
  }

  async getUserProfile(userId: string): Promise<UserProfile> {
    try {
      // TODO: Implement API call to get user profile
      console.log('Fetching user profile for:', userId);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Mock response
      return {
        id: userId,
        name: "John Doe",
        email: "johndoe@gmail.com",
        avatar: "https://avatars.githubusercontent.com/u/99088394?v=4",
        fallback: "JD",
        phoneNumber: "+1234567890",
        dateJoined: "2024-01-15"
      };
    } catch (error) {
      console.error('Failed to fetch user profile:', error);
      throw new Error('Failed to load profile. Please try again.');
    }
  }

  async updateProfile(profileData: Partial<UserProfile>): Promise<UserProfile> {
    try {
      // TODO: Implement API call to update user profile
      console.log('Updating user profile:', profileData);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock updated profile response
      const updatedProfile: UserProfile = {
        id: profileData.id || '1',
        name: profileData.name || "John Doe",
        email: profileData.email || "johndoe@gmail.com",
        avatar: profileData.avatar || "https://avatars.githubusercontent.com/u/99088394?v=4",
        fallback: profileData.fallback || "JD",
        phoneNumber: profileData.phoneNumber,
        dateJoined: profileData.dateJoined || new Date().toISOString().split('T')[0]
      };
      
      console.log('Profile updated successfully');
      return updatedProfile;
    } catch (error) {
      console.error('Failed to update profile:', error);
      throw new Error('Failed to update profile. Please try again.');
    }
  }

  // Additional utility methods
  generateUserFallback(name: string): string {
    return name
      .split(' ')
      .map(part => part.charAt(0).toUpperCase())
      .join('')
      .substring(0, 2);
  }

  validateEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  validatePhoneNumber(phone: string): boolean {
    const phoneRegex = /^\+?[\d\s\-\(\)]{10,}$/;
    return phoneRegex.test(phone);
  }
}

export const profileService = new ProfileServiceImpl();