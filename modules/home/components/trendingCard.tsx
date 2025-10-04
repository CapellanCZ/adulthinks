import React from 'react';
import { StyleSheet, Pressable } from 'react-native';

import { Avatar, AvatarImage } from '@/components/ui/avatar';
import { Text } from '@/components/ui/text';
import { View } from '@/components/ui/view';
import { useThemeColor } from '@/hooks/useThemeColor';

interface TrendingCardData {
  id: string;
  title: string;
  description?: string;
  author?: {
    name: string;
    avatarUrl?: string;
  };
  date?: string;
  category?: string;
}

interface TrendingCardProps {
  data: TrendingCardData;
  onPress?: (data: TrendingCardData) => void;
  containerStyle?: object;
  showAuthor?: boolean;
  showDate?: boolean;
  maxLines?: number;
}

export type { TrendingCardProps, TrendingCardData };

export const TrendingCard: React.FC<TrendingCardProps> = React.memo(({
  data,
  onPress,
  containerStyle,
  showAuthor = true,
  showDate = true,
  maxLines = 2,
}) => {
  const borderColor = useThemeColor({}, 'border');

  const handlePress = () => {
    onPress?.(data);
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'Recent';
    
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      });
    } catch {
      return dateString;
    }
  };

  return (
    <Pressable
      style={({ hovered, pressed }) => [
        styles.container,
        { borderColor },
        hovered && styles.hovered,
        pressed && styles.pressed,
        containerStyle,
      ]}
      onPress={handlePress}
      accessibilityRole="button"
      accessibilityLabel={`Read article: ${data.title}`}
      accessibilityHint="Tap to read the full article"
    >
      <View style={styles.content}>
        {/* Category Badge */}
        {data.category && (
          <View style={styles.categoryContainer}>
            <Text variant='caption' style={styles.category}>
              {data.category}
            </Text>
          </View>
        )}

        {/* Title and Description */}
        <View style={styles.textContainer}>
          <Text 
            numberOfLines={maxLines} 
            variant="subtitle" 
            style={styles.title}
          >
            {data.title}
          </Text>
          
          {data.description && (
            <Text 
              numberOfLines={maxLines} 
              variant='caption' 
              style={styles.description}
            >
              {data.description}
            </Text>
          )}
        </View>

        {/* Author and Date Section */}
        {(showAuthor || showDate) && (
          <View style={styles.metaContainer}>
            {showAuthor && data.author && (
              <View style={styles.authorContainer}>
                {data.author.avatarUrl && (
                  <Avatar size={18}>
                    <AvatarImage
                      source={{ uri: data.author.avatarUrl }}
                    />
                  </Avatar>
                )}
                <Text style={styles.authorName} variant='caption'>
                  {data.author.name}
                </Text>
              </View>
            )}
            
            {showDate && (
              <Text variant='caption' style={styles.date}>
                {formatDate(data.date)}
              </Text>
            )}
          </View>
        )}
      </View>
    </Pressable>
  );
});

TrendingCard.displayName = 'TrendingCard';

const styles = StyleSheet.create({
  container: {
    borderWidth: 1,
    flexDirection: 'column',
    borderRadius: 12,
    marginTop: 12,
    backgroundColor: 'white',
  },
  hovered: {
    transform: [{ scale: 1.01 }],
    borderWidth: 1.5,
    backgroundColor: '#f8f9fb',
  },
  pressed: {
    transform: [{ scale: 0.99 }],
    opacity: 0.95,
  },
  content: {
    padding: 20,
  },
  categoryContainer: {
    marginBottom: 8,
  },
  category: {
    fontSize: 12,
    opacity: 0.7,
    textTransform: 'uppercase',
    fontWeight: '600',
  },
  textContainer: {
    marginBottom: 12,
  },
  title: {
    fontSize: 15,
    marginBottom: 6,
    lineHeight: 20,
  },
  description: {
    lineHeight: 18,
    opacity: 0.8,
  },
  metaContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  authorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  authorName: {
    fontSize: 13,
    marginLeft: 6,
  },
  date: {
    fontSize: 13,
    opacity: 0.6,
  },
});