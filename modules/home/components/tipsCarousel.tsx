import React from 'react';
import { StyleSheet } from 'react-native';

import { Carousel, CarouselItem } from '@/components/ui/carousel';
import { Text } from '@/components/ui/text';
import { View } from '@/components/ui/view';
import { useThemeColor } from '@/hooks/useThemeColor';
import DigitalAds from '@/assets/svg/digital-ads';
import ChasingMoney from '@/assets/svg/chasing-money';
import Contact from '@/assets/svg/contact';

interface Tip {
  id: string;
  title: string;
  description: string;
  icon: React.ComponentType<any>;
  backgroundColor?: string;
}

interface TipsCarouselProps {
  autoPlay?: boolean;
  autoPlayInterval?: number;
  showIndicators?: boolean;
  showArrows?: boolean;
  loop?: boolean;
  customTips?: Tip[];
}

export type { TipsCarouselProps };

export const TipsCarousel: React.FC<TipsCarouselProps> = React.memo(({
  autoPlay = true,
  autoPlayInterval = 4000,
  showIndicators = true,
  showArrows = false,
  loop = true,
  customTips,
}) => {
  const primaryColor = useThemeColor({}, 'primary');
  const secondaryColor = useThemeColor({}, 'secondary');
  const accentColor = useThemeColor({}, 'accent');

  const defaultTips: Tip[] = [
    {
      id: 'tip-1',
      title: 'Tip #1',
      description: 'Book appointment online to avoid long queues.',
      icon: DigitalAds,
      backgroundColor: primaryColor,
    },
    {
      id: 'tip-2',
      title: 'Tip #2',
      description: 'Check office hours and location beforehand.',
      icon: Contact,
      backgroundColor: primaryColor,
    },
    {
      id: 'tip-3',
      title: 'Tip #3',
      description: 'Processing fees range from ₱150-₱200.',
      icon: ChasingMoney,
      backgroundColor: primaryColor,
    },
  ];

  const tips = customTips || defaultTips;

  const renderTipItem = (tip: Tip) => {
    const IconComponent = tip.icon;
    
    return (
      <CarouselItem 
        key={tip.id}
        style={[
          styles.carouselItem,
          { backgroundColor: tip.backgroundColor || primaryColor }
        ]}
      >
        <View style={[styles.tipContainer, { backgroundColor: tip.backgroundColor || primaryColor }]}>
          <View style={styles.tipContent}>
            <View style={styles.textContainer}>
              <Text variant='subtitle' style={styles.tipTitle}>
                {tip.title}
              </Text>
              <Text variant='body' style={styles.tipDescription}>
                {tip.description}
              </Text>
            </View>
            <View style={styles.iconContainer}>
              <IconComponent style={styles.tipIcon} />
            </View>
          </View>
        </View>
      </CarouselItem>
    );
  };

  return (
    <View style={styles.container}>
      <Carousel
        showIndicators={showIndicators}
        showArrows={showArrows}
        autoPlay={autoPlay}
        autoPlayInterval={autoPlayInterval}
        loop={loop}
      >
        {tips.map(renderTipItem)}
      </Carousel>
    </View>
  );
});

TipsCarousel.displayName = 'TipsCarousel';

const styles = StyleSheet.create({
  container: {
    marginBottom: 15,
  },
  carouselItem: {
    overflow: 'hidden',
    minHeight: 70,
  },
  tipContainer: {
    overflow: 'hidden',
  },
  tipContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'stretch',
    minHeight: 80,
  },
  textContainer: {
    flex: 1,
    gap: 6,
    justifyContent: 'center',
    maxWidth: '70%',
  },
  tipTitle: {
    color: 'white',
    flexShrink: 1,
  },
  tipDescription: {
    color: 'white',
    flexShrink: 1,
    marginRight: 5,
    flexWrap: 'wrap',
  },
  iconContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 80,
    maxWidth: '30%',
    paddingRight: 10,
    aspectRatio: 1,
  },
  tipIcon: {
    width: '90%',
    height: '90%',
    maxWidth: 85,
    maxHeight: 85,
  },
});