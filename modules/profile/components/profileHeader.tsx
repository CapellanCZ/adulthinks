// components/profile/ProfileHeader.tsx
import React from 'react';
import { StyleSheet } from 'react-native';
import { PencilLine } from 'lucide-react-native';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Text } from '@/components/ui/text';
import { View } from '@/components/ui/view';

interface UserProfile {
  id: string;
  name: string;
  email: string;
  avatar: string;
  fallback: string;
}

interface ProfileHeaderProps {
  userProfile: UserProfile;
  onEditProfile: () => void;
  showEditButton?: boolean;
}

export const ProfileHeader: React.FC<ProfileHeaderProps> = ({
  userProfile,
  onEditProfile,
  showEditButton = true,
}) => {
  return (
    <View 
      style={styles.container}
      accessible={true}
      accessibilityLabel={`Profile header for ${userProfile.name}`}
      accessibilityRole="header"
    >
      <View 
        style={styles.avatarContainer}
        accessible={true}
        accessibilityLabel={`Profile picture for ${userProfile.name}`}
      >
        <Avatar size={80}>
          <AvatarImage 
            source={{ uri: userProfile.avatar }}
          />
          <AvatarFallback>{userProfile.fallback}</AvatarFallback>
        </Avatar>
      </View>

      <View style={styles.userInfo}>
        <Text 
          variant="title" 
          style={styles.userName}
          accessibilityRole="text"
          accessibilityLabel={`User name: ${userProfile.name}`}
        >
          {userProfile.name}
        </Text>
        <Text 
          variant="caption" 
          style={styles.userEmail}
          accessibilityRole="text"
          accessibilityLabel={`Email: ${userProfile.email}`}
        >
          {userProfile.email}
        </Text>
      </View>

      {showEditButton && (
        <Button 
          icon={PencilLine} 
          style={styles.editButton}
          onPress={onEditProfile}
          accessibilityLabel="Edit profile"
          accessibilityHint="Tap to edit your profile information"
        >
          Edit Profile
        </Button>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 20,
  },
  avatarContainer: {
    marginBottom: 12,
  },
  userInfo: {
    alignItems: "center",
    marginBottom: 20,
  },
  userName: {
    fontSize: 22,
    fontWeight: '600',
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 14,
    opacity: 0.7,
  },
  editButton: {
    minWidth: 120,
  },
});