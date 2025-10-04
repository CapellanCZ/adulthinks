import React from 'react';
import { Pressable, StyleSheet } from 'react-native';
import { TrendingUp, TrendingDown } from 'lucide-react-native';

import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Text } from '@/components/ui/text';
import { View } from '@/components/ui/view';
import { useThemeColor } from '@/hooks/useThemeColor';

interface TrendingTopic {
  id: string;
  title: string;
  description: string;
  trend: 'up' | 'down';
}

interface TrendingSectionProps {
  onSeeAllPress: (section: 'popular' | 'trending') => void;
  onTopicPress?: (topic: TrendingTopic) => void;
  title?: string;
  subtitle?: string;
}

export const TrendingSection: React.FC<TrendingSectionProps> = ({
  onSeeAllPress,
  onTopicPress,
  title = "Trending",
  subtitle = "Hot topics and discussions",
}) => {
  const primaryColor = useThemeColor({}, "primary");
  const trendingTextColor = useThemeColor({}, "text");

  const trendingTopics: TrendingTopic[] = [
    {
      id: "national-id-fast",
      title: "How to get your National ID fast",
      description: "Tips and requirements for a smooth application.",
      trend: "up",
    },
    {
      id: "sss-id-jobseekers",
      title: "SSS ID for first-time job seekers",
      description: "Why you need it and how to apply.",
      trend: "down",
    },
    {
      id: "postal-id-easiest",
      title: "Postal ID: The easiest valid ID?",
      description: "Step-by-step guide for young adults.",
      trend: "up",
    },
  ];

  const handleSeeAllPress = () => {
    onSeeAllPress('trending');
  };

  const handleTopicPress = (topic: TrendingTopic) => {
    if (onTopicPress) {
      onTopicPress(topic);
    }
  };

  const TrendIcon = ({ trend }: { trend: 'up' | 'down' }) => {
    const IconComponent = trend === 'up' ? TrendingUp : TrendingDown;
    return (
      <View style={styles.iconContainer}>
        <IconComponent
          size={18}
          color={primaryColor}
        />
      </View>
    );
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
      </View>
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
  },
  titleContainer: {
    flex: 1,
  },
  subtitle: {
    opacity: 0.7,
  },
  seeAllText: {
    // color provided dynamically using theme inside component
  },
  trendingCard: {
    borderRadius: 10,
    marginTop: 8,
  },
  topicContainer: {
    marginBottom: 0,
  },
  topicRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 15,
    paddingVertical: 4,
  },
  iconContainer: {
    justifyContent: "center",
    alignItems: "center",
    minHeight: 20,
    minWidth: 18,
  },
  topicContent: {
    flex: 1,
  },
  topicTitle: {
    fontWeight: "600",
    fontSize: 15,
    marginBottom: 2,
  },
  topicDescription: {
    fontSize: 13,
    lineHeight: 18,
  },
  separator: {
    marginVertical: 10,
    opacity: 0.1,
  },
});