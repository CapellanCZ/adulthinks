import React from 'react';
import { Pressable, StyleSheet } from 'react-native';
import { Bell } from 'lucide-react-native';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Text } from '@/components/ui/text';
import { View } from '@/components/ui/view';
import { useThemeColor } from '@/hooks/useThemeColor';

interface HomeHeaderProps {
  onNotificationPress: () => void;
  userName?: string;
  userAvatarUrl?: string;
  userFallback?: string;
}

export const HomeHeader: React.FC<HomeHeaderProps> = ({
  onNotificationPress,
  userName = "John",
  userAvatarUrl = "https://avatars.githubusercontent.com/u/99088394?v=4",
  userFallback = "AB",
}) => {
  const primaryColor = useThemeColor({}, "primary");

  return (
    <View style={styles.header}>
      <View style={styles.headerContent}>
        <View style={styles.userSection}>
          <Avatar>
            <AvatarImage
              source={{ uri: userAvatarUrl }}
            />
            <AvatarFallback>{userFallback}</AvatarFallback>
          </Avatar>
          <View style={styles.userInfo}>
            <Text style={styles.greeting}>
              Hello,
              <Text style={styles.userName}> {userName} ⛅</Text>
            </Text>
            <Text 
              variant="caption" 
              style={styles.subtitle}
            >
              Let&apos;s get you started!
            </Text>
          </View>
        </View>

        <Pressable
          onPress={onNotificationPress}
          android_ripple={{ color: primaryColor + "20", borderless: true }}
          style={({ pressed }) => [
            styles.notificationButton,
            {
              opacity: pressed ? 0.7 : 1,
              transform: [{ scale: pressed ? 0.95 : 1 }],
              backgroundColor: pressed ? primaryColor + "10" : "transparent",
            },
          ]}
          accessibilityRole="button"
          accessibilityLabel="Open notifications"
          accessibilityHint="Tap to view your notifications"
        >
          <Bell 
            size={24} 
            color={primaryColor}
          />
        </Pressable>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    paddingTop: 64,
    paddingBottom: 15,
  },
  headerContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  userSection: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  userInfo: {
    flex: 1,
    marginLeft: 12,
    gap: 2,
  },
  greeting: {
    fontWeight: "400",
  },
  userName: {
    fontWeight: "600",
  },
  subtitle: {
    fontSize: 14,
  },
  notificationButton: {
    padding: 8,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    minWidth: 40,
    minHeight: 40,
  },
});