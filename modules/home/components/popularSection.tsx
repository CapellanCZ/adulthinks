import React from 'react';
import { Pressable, StyleSheet } from 'react-native';

import { Carousel, CarouselItem } from '@/components/ui/carousel';
import { GovernmentIdCard } from '@/components/ui/government-id-card';
import { Text } from '@/components/ui/text';
import { View } from '@/components/ui/view';
import { PHILIPPINE_GOVERNMENT_IDS } from '@/data/philippine-government-ids';

interface PopularSectionProps {
  onSeeAllPress: (section: 'popular' | 'trending') => void;
  title?: string;
  subtitle?: string;
  maxItems?: number;
}

export const PopularSection: React.FC<PopularSectionProps> = ({
  onSeeAllPress,
  title = "Popular",
  subtitle = "Most applied government IDs",
  maxItems = 3,
}) => {
  const popularIds = PHILIPPINE_GOVERNMENT_IDS.slice(0, maxItems);

  const handleSeeAllPress = () => {
    onSeeAllPress('popular');
  };

  return (
    <View style={styles.container}>
      <View style={styles.sectionHeader}>
        <View style={styles.titleContainer}>
          <Text variant="title">{title}</Text>
          <Text
            variant="caption"
            style={styles.subtitle}
          >
            {subtitle}
          </Text>
        </View>
        <Pressable 
          onPress={handleSeeAllPress}
          accessibilityRole="button"
          accessibilityLabel="See all popular government IDs"
          accessibilityHint="Tap to view the complete list of popular government IDs"
        >
          <Text variant="link" style={styles.seeAllText}>
            See All
          </Text>
        </Pressable>
      </View>

      <Carousel
        showIndicators={true}
        showArrows={true}
        autoPlay={true}
        loop={true}
        style={styles.carousel}
      >
        {popularIds.map((govId, index) => (
          <CarouselItem
            key={govId.id}
            style={styles.carouselItem}
          >
            <GovernmentIdCard 
              data={govId}
            />
          </CarouselItem>
        ))}
      </Carousel>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 3,
  },
  titleContainer: {
    flex: 1,
  },
  subtitle: {
    opacity: 0.7,
    marginBottom: 10,
  },
  seeAllText: {
    fontSize: 14,
  },
  carousel: {
    top: -23,
    marginBottom: -10,
  },
  carouselItem: {
    paddingHorizontal: -10,
    backgroundColor: "transparent",
    borderColor: "transparent",
  },
});