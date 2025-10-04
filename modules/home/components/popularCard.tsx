import React from 'react';
import { StyleSheet, Pressable } from 'react-native';
import { ChevronRight, IdCard } from 'lucide-react-native';

import { Badge } from '@/components/ui/badge';
import { Text } from '@/components/ui/text';
import { View } from '@/components/ui/view';
import { useThemeColor } from '@/hooks/useThemeColor';

interface PopularCardData {
  id: string;
  title: string;
  description: string;
  category?: string;
  badges?: { label: string; variant?: 'default' | 'secondary' | 'destructive' | 'outline' | 'success' }[];
  icon?: React.ComponentType<any>;
}

interface PopularCardProps {
  data: PopularCardData;
  onPress?: (data: PopularCardData) => void;
  showChevron?: boolean;
  containerStyle?: object;
}

export type { PopularCardProps, PopularCardData };

export const PopularCard: React.FC<PopularCardProps> = React.memo(({
  data,
  onPress,
  showChevron = true,
  containerStyle,
}) => {
  const borderColor = useThemeColor({}, 'border');
  const secondaryColor = useThemeColor({}, 'secondary');
  const iconColor = useThemeColor({}, 'icon');
  const textMutedColor = useThemeColor({}, 'textMuted');
  const primaryColor = useThemeColor({}, 'primary');
  const cardColor = useThemeColor({}, 'card');
  const mutedColor = useThemeColor({}, 'muted');

  const IconComponent = data.icon || IdCard;

  const handlePress = () => {
    onPress?.(data);
  };

  return (
    <Pressable
      style={[styles.container, { borderColor }, containerStyle]}
      onPress={handlePress}
      accessibilityRole="button"
      accessibilityLabel={`View details for ${data.title}`}
      accessibilityHint="Tap to view more information about this government ID"
    >
      <View style={styles.content}>
        {/* Header Section */}
        <View style={styles.header}>
          <View style={[styles.iconContainer, { backgroundColor: secondaryColor }]}>
            <IconComponent color={iconColor} />
          </View>
          <View style={styles.titleContainer}>
            {data.category && (
              <Text variant='caption' style={styles.category}>
                {data.category}
              </Text>
            )}
            <Text style={styles.title}>{data.title}</Text>
          </View>
          {showChevron && (
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="View details"
              onPress={handlePress}
              style={({ pressed }) => [
                styles.chevron,
                styles.chevronButton,
                pressed && styles.chevronPressed,
                pressed && { backgroundColor: mutedColor },
              ]}
            >
              <ChevronRight 
                style={styles.chevronIcon}
                color={iconColor}
              />
            </Pressable>
          )}
        </View>

        {/* Description Section */}
        <View>
          <Text 
            variant='caption' 
            numberOfLines={2} 
            style={[styles.description, { borderBottomColor: borderColor }]}
          >
            {data.description}
          </Text>
        </View>

        {/* Badges Section */}
        {data.badges && data.badges.length > 0 && (
          <View style={styles.badgesContainer}>
            {data.badges.map((badge, index) => (
              <Badge
                key={index}
                variant={badge.variant || 'secondary'}
                textStyle={[styles.badgeText, { color: textMutedColor }]}
              >
                {badge.label}
              </Badge>
            ))}
          </View>
        )}
      </View>
    </Pressable>
  );
});

PopularCard.displayName = 'PopularCard';

const styles = StyleSheet.create({
  container: {
    borderWidth: 1,
    flexDirection: 'column',
    borderRadius: 12,
    backgroundColor: 'white',
  },
  content: {
    flexDirection: 'column',
    justifyContent: 'space-between',
    padding: 20,
  },
  header: {
    flexDirection: 'row',
  },
  iconContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    maxWidth: '30%',
    padding: 10,
    borderRadius: 25,
  },
  titleContainer: {
    gap: 3,
    flex: 1,
    marginLeft: 10,
  },
  category: {
    fontSize: 14,
    opacity: 0.6,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  chevron: {
    justifyContent: 'flex-end',
    opacity: 0.8,
  },
  chevronButton: {
    borderRadius: 20,
    alignSelf: 'flex-start',
    marginLeft: 'auto',
  },
  chevronPressed: {
    transform: [{ scale: 0.95 }],
    opacity: 0.3,
  },
  chevronIcon: {
    alignSelf: 'flex-end',
  },
  description: {
    paddingTop: 15,
    paddingBottom: 15,
    borderBottomWidth: 1,
    lineHeight: 20,
  },
  badgesContainer: {
    flexDirection: 'row',
    gap: 6,
    marginTop: 15,
    flexWrap: 'wrap',
  },
  badgeText: {
    fontSize: 12,
  },
});