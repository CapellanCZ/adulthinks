import React from 'react';
import { StyleSheet } from 'react-native';
import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs';

import { ScrollView } from '@/components/ui/scroll-view';
import { View } from '@/components/ui/view';
import { useThemeColor } from '@/hooks/useThemeColor';

import { HomeHeader } from '@/modules/home/components/homeHeader';
import { GovernmentIdSelector } from '@/modules/home/components/governmentIdSelector';
import { EssentialTips } from '@/modules/home/components/essentialTips';
import { PopularSection } from '@/modules/home/components/popularSection';
import { TrendingSection } from '@/modules/home/components/trendingSection';
import { useHomeScreen } from '@/modules/home/hooks/useHomeScreen';

export default function HomeScreen() {
  const bottom = useBottomTabBarHeight();
  const {
    selectedGovernmentId,
    setSelectedGovernmentId,
    handleNotificationPress,
    handleSeeAllPress,
  } = useHomeScreen();

  return (
    <ScrollView
      style={styles.scrollView}
      contentContainerStyle={[
        styles.contentContainer,
        { paddingBottom: bottom + 35 }
      ]}
      showsVerticalScrollIndicator={false}
    >
      <HomeHeader onNotificationPress={handleNotificationPress} />
      
      <View style={styles.selectorContainer}>
        <GovernmentIdSelector
          value={selectedGovernmentId}
          onValueChange={setSelectedGovernmentId}
        />
      </View>

      <View style={styles.tipsContainer}>
        <EssentialTips />
      </View>

      <View style={styles.popularContainer}>
        <PopularSection onSeeAllPress={handleSeeAllPress} />
      </View>
      
      <View style={styles.trendingContainer}>
        <TrendingSection onSeeAllPress={handleSeeAllPress} />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
  },
  contentContainer: {
    paddingHorizontal: 20,
  },
  selectorContainer: {
    marginBottom: 20,
  },
  tipsContainer: {
    marginBottom: 20,
  },
  popularContainer: {
    marginBottom: 20,
  },
  trendingContainer: {
    marginBottom: 10,
  },
});