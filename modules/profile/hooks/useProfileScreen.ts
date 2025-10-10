// hooks/useProfileScreen.ts
import { useCallback, useMemo, useState } from 'react';
import { router } from 'expo-router';
import {
  CircleQuestionMark,
  LockKeyhole,
  LogOut,
  MapPinned,
  MessageSquareText,
  PencilLine,
  Settings,
  StickyNote
} from 'lucide-react-native';

// Define types locally since they may not be in the expected path
interface UserProfile {
  id: string;
  name: string;
  email: string;
  avatar: string;
  fallback: string;
  phoneNumber?: string;
  dateJoined?: string;
}

interface MenuItemConfig {
  id: string;
  icon: any;
  text: string;
  onPress: () => void;
  textStyle?: any;
  iconColor?: string;
  showChevron?: boolean;
  accessibilityLabel: string;
  accessibilityHint: string;
  disabled?: boolean;
  badge?: string | number;
}

interface MenuSection {
  id: string;
  title: string;
  items: MenuItemConfig[];
}

export const useProfileScreen = () => {
  // Local avatar state; in real app this would be persisted via API
  const [avatarUri, setAvatarUri] = useState<string>(
    'https://avatars.githubusercontent.com/u/99088394?v=4'
  );

  const userProfile: UserProfile = useMemo(() => ({
    id: '1',
    name: "John Doe",
    email: "johndoe@gmail.com",
    avatar: avatarUri,
    fallback: "JD"
  }), [avatarUri]);

  // Navigation handlers
  const handleEditProfile = useCallback(() => {
    try {
      router.push('/profile/edit');
    } catch (error) {
      console.error('Error navigating to edit profile:', error);
    }
  }, []);

  const handleSettings = useCallback(() => {
    try {
      // TODO: Navigate to settings screen
      // router.push('/settings');
      console.log("Settings pressed");
    } catch (error) {
      console.error('Error navigating to settings:', error);
    }
  }, []);

  const handleAddress = useCallback(() => {
    try {
      // TODO: Navigate to address management screen
      // router.push('/profile/address');
      console.log("Address pressed");
    } catch (error) {
      console.error('Error navigating to address:', error);
    }
  }, []);

  const handleChangePassword = useCallback(() => {
    try {
      // TODO: Navigate to change password screen
      // router.push('/profile/change-password');
      console.log("Change Password pressed");
    } catch (error) {
      console.error('Error navigating to change password:', error);
    }
  }, []);

  const handleHelpCenter = useCallback(() => {
    try {
      // TODO: Navigate to help center or open external URL
      // Linking.openURL('https://help.example.com');
      console.log("Help Center pressed");
    } catch (error) {
      console.error('Error opening help center:', error);
    }
  }, []);

  const handleFAQ = useCallback(() => {
    try {
      // TODO: Navigate to FAQ screen
      // router.push('/faq');
      console.log("FAQ pressed");
    } catch (error) {
      console.error('Error navigating to FAQ:', error);
    }
  }, []);

  const handlePrivacyPolicy = useCallback(() => {
    try {
      // TODO: Navigate to privacy policy or open external URL
      // Linking.openURL('https://example.com/privacy');
      console.log("Privacy Policy pressed");
    } catch (error) {
      console.error('Error opening privacy policy:', error);
    }
  }, []);

  const handleLogOut = useCallback(async () => {
    try {
      // TODO: Implement proper logout logic
      // - Clear user session
      // - Clear stored tokens
      // - Reset app state
      console.log('Logging out...');
      router.replace('/(auth)/login');
    } catch (error) {
      console.error('Error during logout:', error);
      // Show error toast or alert
    }
  }, []);

  // Menu configurations
  const accountMenuSection: MenuSection = useMemo(() => ({
    id: 'account',
    title: 'Account Settings',
    items: [
      {
        id: 'settings',
        icon: Settings,
        text: "Settings",
        onPress: handleSettings,
        accessibilityLabel: "Open settings",
        accessibilityHint: "Tap to access app settings and preferences"
      },
      {
        id: 'address',
        icon: MapPinned,
        text: "Address",
        onPress: handleAddress,
        accessibilityLabel: "Manage addresses",
        accessibilityHint: "Tap to add or edit your addresses"
      },
      {
        id: 'change-password',
        icon: LockKeyhole,
        text: "Change Password",
        onPress: handleChangePassword,
        accessibilityLabel: "Change password",
        accessibilityHint: "Tap to change your account password"
      }
    ]
  }), [handleSettings, handleAddress, handleChangePassword]);

  const supportMenuSection: MenuSection = useMemo(() => ({
    id: 'support',
    title: 'Support & Help',
    items: [
      {
        id: 'help-center',
        icon: CircleQuestionMark,
        text: "Help Center",
        onPress: handleHelpCenter,
        accessibilityLabel: "Open help center",
        accessibilityHint: "Tap to access help articles and support"
      },
      {
        id: 'faq',
        icon: MessageSquareText,
        text: "FAQ",
        onPress: handleFAQ,
        accessibilityLabel: "View frequently asked questions",
        accessibilityHint: "Tap to see answers to common questions"
      },
      {
        id: 'privacy-policy',
        icon: StickyNote,
        text: "Privacy Policy",
        onPress: handlePrivacyPolicy,
        accessibilityLabel: "View privacy policy",
        accessibilityHint: "Tap to read our privacy policy"
      }
    ]
  }), [handleHelpCenter, handleFAQ, handlePrivacyPolicy]);

  const actionMenuSection: MenuSection = useMemo(() => ({
    id: 'actions',
    title: 'Account Actions',
    items: [
      {
        id: 'logout',
        icon: LogOut,
        text: "Log Out",
        textStyle: { color: "#e11000" },
        iconColor: "#e11000",
        showChevron: false,
        onPress: handleLogOut,
        accessibilityLabel: "Log out of account",
        accessibilityHint: "Tap to sign out of your account"
      }
    ]
  }), [handleLogOut]);

  return {
    userProfile,
    accountMenuSection,
    supportMenuSection,
    actionMenuSection,
    handleEditProfile,
  };
};