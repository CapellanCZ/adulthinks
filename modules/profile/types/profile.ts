// types/profile.ts
import { LucideIcon } from 'lucide-react-native';

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  avatar: string;
  fallback: string;
  phoneNumber?: string;
  dateJoined?: string;
}

export interface MenuItemConfig {
  id: string;
  icon: LucideIcon;
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

export interface MenuSection {
  id: string;
  title: string;
  items: MenuItemConfig[];
}

export interface ProfileHeaderProps {
  userProfile: UserProfile;
  onEditProfile: () => void;
  showEditButton?: boolean;
}

export interface MenuSectionProps {
  section: MenuSection;
  accessibilityLabel?: string;
}

// Service interfaces
export interface ProfileService {
  logout: () => Promise<void>;
  updateProfile: (profile: Partial<UserProfile>) => Promise<UserProfile>;
  getUserProfile: (userId: string) => Promise<UserProfile>;
}