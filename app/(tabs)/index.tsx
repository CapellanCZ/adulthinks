import React from 'react';
import { StyleSheet, Platform } from 'react-native';
import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs';

import { ScrollView } from '@/components/ui/scroll-view';
import { View } from '@/components/ui/view';
import { useThemeColor } from '@/hooks/useThemeColor';

import { 
  HomeHeader,
  PopularSection,
  TrendingSection,
  TipsCarousel,
  SearchSection,
  PopularCard,
  TrendingCard,
  ViewAllButton
} from '@/modules/home/components';
import { useHomeScreen } from '@/modules/home/hooks/useHomeScreen';
import { IdCard } from 'lucide-react-native';


export default React.memo(function HomeScreen() {
  const bottom = useBottomTabBarHeight();
  const backgroundColor = useThemeColor({}, 'background');

  const {
    selectedGovernmentId,
    setSelectedGovernmentId,
    handleNotificationPress,
    handleSeeAllPress,
    handleApplyNowPress,
  } = useHomeScreen();

  // Fallback handlers to ensure interactivity even if hook does not provide them
  const handleSearchPress = (query: string) => {
    console.log('Search submitted:', query);
  };

  const handlePopularItemPress = (data: any) => {
    console.log('Popular item pressed:', data?.title || data);
  };

  const handleTrendingItemPress = (data: any) => {
    console.log('Trending item pressed:', data?.title || data);
  };

  // Mock data for demonstration
  const popularCardData = {
    id: 'national-id',
    title: 'Philippine National ID',
    category: 'Primary',
    description: 'The National ID is a valid proof of identity issued after registration. It can be used for government and private transactions. It comes in three formats: physical card, paper ePhilID, and digital ID. All formats have equal validity and function.',
    icon: IdCard,
    badges: [
      { label: 'Quick', variant: 'secondary' as const },
      { label: 'Lifetime', variant: 'secondary' as const },
      { label: 'Online/Onsite', variant: 'secondary' as const },
    ],
    additionalInfo: {
      title: 'Minimum Age for Registration',
      content: 'Registration for the National ID is open to all Filipinos aged 1 and above. Ages 1–4 only need demographic data and a photo, linked to a parent or guardian. At age 5, full biometrics are collected. At age 15, biometrics are updated.'
    }
  };

  const trendingCardsData = [
    {
      id: 'trending-1',
      title: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris eget justo nec justo ultrices ultricies.',
      author: {
        name: 'Author',
        avatarUrl: 'https://avatars.githubusercontent.com/u/99088394?v=4',
      },
      date: '2025-10-04',
    },
    {
      id: 'trending-2',
      title: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris eget justo nec justo ultrices ultricies.',
      author: {
        name: 'Author',
        avatarUrl: 'https://avatars.githubusercontent.com/u/99088394?v=4',
      },
      date: '2025-10-04',
    },
  ];

  return (
    <ScrollView
      style={[styles.scrollView, { backgroundColor }]}
      contentContainerStyle={[
        styles.contentContainer,
        { paddingBottom: Math.max(bottom, 50) }
      ]}
      showsVerticalScrollIndicator={false}
      bounces={true}
      scrollEventThrottle={16}
    >
      {/* Header Section */}
      <View style={styles.headerSection}>
        <HomeHeader onNotificationPress={handleNotificationPress} />
      </View>

      {/* Search Section */}
      <View style={styles.searchSection}>
        <SearchSection
          placeholder="What are you looking for?"
          onSearch={handleSearchPress}
          containerStyle={{ borderRadius: 25 }}
        />
      </View>

      {/* Tips Carousel Section */}
      <View>
        <TipsCarousel
          autoPlay={true}
          autoPlayInterval={4000}
          showIndicators={true}
          showArrows={false}
          loop={true}
        />
      </View>

      {/* Popular Section */}
      <View style={styles.popularSection}>
        <PopularSection onSeeAllPress={handleSeeAllPress} />
        <PopularCard
          data={popularCardData}
          onPress={handlePopularItemPress}
          showChevron={true}
          onApplyNow={handleApplyNowPress}
        />
      </View>

      {/* Trending Section */}
      <View style={styles.trendingSection}>
        <TrendingSection onSeeAllPress={handleSeeAllPress} />
        {trendingCardsData.map((item) => (
          <TrendingCard
            key={item.id}
            data={item}
            onPress={handleTrendingItemPress}
            showAuthor={true}
            showDate={true}
            maxLines={2}
          />
        ))}
      </View>

      {/* Bottom Spacer for Better Scrolling Experience */}
      <View style={styles.bottomSpacer} />
    </ScrollView>
  );
});

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
  },
  contentContainer: {
    flexGrow: 1,
    paddingHorizontal: 20,
    paddingTop: Platform.OS === 'ios' ? 8 : 12,
  },

  // Header Section
  headerSection: {
    marginBottom: 5,
    zIndex: 10,
  },

  // Search Section
  searchSection: {
    paddingBottom: 4,
  },

  // Popular Section
  popularSection: {
    marginBottom: 20,
    paddingVertical: 2,
  },

  // Trending Section
  trendingSection: {
    marginBottom: 15,
    paddingVertical: 2,
  },

  // Bottom Spacer
  bottomSpacer: {
    height: 20,
    marginBottom: 8,
  },
});