// app/(tabs)/profile.tsx
import React from 'react';
import { StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs';

import { ScrollView } from '@/components/ui/scroll-view';
import { View } from '@/components/ui/view';

import { ProfileHeader } from '@/modules/profile/components/profileHeader';
import { MenuSection } from '@/modules/profile/components/menuSection';
import { MenuSeparator } from '@/modules/profile/components/menuSeperator';
import { useProfileScreen } from '@/modules/profile/hooks/useProfileScreen';

export default function ProfileScreen() {
  const bottom = useBottomTabBarHeight();
  const {
    userProfile,
    accountMenuSection,
    supportMenuSection,
    actionMenuSection,
    handleEditProfile,
  } = useProfileScreen();

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={[
          styles.contentContainer,
          { paddingBottom: bottom }
        ]}
        showsVerticalScrollIndicator={false}
      >
        <ProfileHeader 
          userProfile={userProfile}
          onEditProfile={handleEditProfile}
        />

        <View>
          <MenuSection 
            section={accountMenuSection}
            accessibilityLabel="Account settings"
          />
          
          <MenuSeparator />
          
          <MenuSection 
            section={supportMenuSection}
            accessibilityLabel="Support and help"
          />
          
          <MenuSeparator />
          
          <MenuSection 
            section={actionMenuSection}
            accessibilityLabel="Account actions"
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    paddingHorizontal: 20,
  },
  contentContainer: {
    flexGrow: 1,
  },
});