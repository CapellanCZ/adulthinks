import { router } from 'expo-router';
import {
    CircleQuestionMark, LockKeyhole, LogOut, LucideIcon, MapPinned, MessageSquareText, PencilLine,
    Settings, StickyNote
} from 'lucide-react-native';
import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { MenuItem } from '@/components/ui/menu-item';
import { ScrollView } from '@/components/ui/scroll-view';
import { Separator } from '@/components/ui/separator';
import { Text } from '@/components/ui/text';
import { View } from '@/components/ui/view';
import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs';

// Types for better type safety
interface UserProfile {
  name: string;
  email: string;
  avatar: string;
  fallback: string;
}

interface MenuItemConfig {
  icon: LucideIcon;
  text: string;
  onPress: () => void;
  textStyle?: any;
  iconColor?: string;
  showChevron?: boolean;
}

interface MenuSection {
  items: MenuItemConfig[];
}

export default function ProfileScreen() {
  const bottom = useBottomTabBarHeight();

  // User data - could come from context, state, or API
  const userProfile: UserProfile = {
    name: "John Doe",
    email: "johndoe@gmail.com",
    avatar: "https://avatars.githubusercontent.com/u/99088394?v=4",
    fallback: "JD" // Generate from name initials
  };

  // Menu configuration - easier to maintain and modify
  const accountMenuSection: MenuSection = {
    items: [
      {
        icon: Settings,
        text: "Settings",
        onPress: () => console.log("Settings pressed")
      },
      {
        icon: MapPinned,
        text: "Address", 
        onPress: () => console.log("Address pressed")
      },
      {
        icon: LockKeyhole,
        text: "Change Password",
        onPress: () => console.log("Change Password pressed")
      }
    ]
  };

  const supportMenuSection: MenuSection = {
    items: [
      {
        icon: CircleQuestionMark,
        text: "Help Center",
        onPress: () => console.log("Help Center pressed")
      },
      {
        icon: MessageSquareText,
        text: "FAQ",
        onPress: () => console.log("FAQ pressed")
      },
      {
        icon: StickyNote,
        text: "Privacy Policy",
        onPress: () => console.log("Privacy Policy pressed")
      }
    ]
  };

  const actionMenuSection: MenuSection = {
    items: [
      {
        icon: LogOut,
        text: "Log Out",
        textStyle: { color: "#e11000" },
        iconColor: "#e11000",
        showChevron: false,
        onPress: () => router.push("/login") 
      }
    ]
  };

  // Reusable function to render menu sections
  const renderMenuSection = (section: MenuSection) => (
    <>
      {section.items.map((item, index) => (
        <MenuItem
          key={`${item.text}-${index}`}
          icon={item.icon}
          text={item.text}
          onPress={item.onPress}
          textStyle={item.textStyle}
          iconColor={item.iconColor}
          showChevron={item.showChevron}
        />
      ))}
    </>
  );

  const renderSeparator = () => (
    <View style={{ marginHorizontal: 5 }}>
      <Separator style={{ height: 2, marginVertical: 15, opacity: 0.4 }} />
    </View>
  );

  return (
    <SafeAreaView>
      <ScrollView
        style={{ paddingHorizontal: 20, paddingTop: 20 }}
        contentContainerStyle={{ paddingBottom: bottom }}
      >
        <View
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Avatar size={80}>
            <AvatarImage source={{ uri: userProfile.avatar }} />
            <AvatarFallback>{userProfile.fallback}</AvatarFallback>
          </Avatar>

          <View style={{ alignItems: "center", marginTop: 8 }}>
            <Text variant="title">{userProfile.name}</Text>
            <Text variant="caption">{userProfile.email}</Text>
          </View>

          <Button icon={PencilLine} style={{ marginTop: 20 }}>
            Edit Profile
          </Button>
        </View>

        <View style={{ marginTop: 15 }}>
          {renderMenuSection(accountMenuSection)}
        </View>

        {renderSeparator()}

        <View>
          {renderMenuSection(supportMenuSection)}
        </View>

        {renderSeparator()}

        <View>
          {renderMenuSection(actionMenuSection)}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
