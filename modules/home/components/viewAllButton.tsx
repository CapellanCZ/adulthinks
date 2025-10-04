import React from 'react';
import { StyleSheet, Pressable } from 'react-native';
import { ChevronRight } from 'lucide-react-native';

import { Text } from '@/components/ui/text';
import { View } from '@/components/ui/view';
import { useThemeColor } from '@/hooks/useThemeColor';

interface ViewAllButtonProps {
  title?: string;
  onPress: () => void;
  containerStyle?: object;
  textStyle?: object;
  showIcon?: boolean;
  iconSize?: number;
  disabled?: boolean;
}

export type { ViewAllButtonProps };

export const ViewAllButton: React.FC<ViewAllButtonProps> = React.memo(({
  title = 'View All',
  onPress,
  containerStyle,
  textStyle,
  showIcon = true,
  iconSize = 16,
  disabled = false,
}) => {
  const primaryColor = useThemeColor({}, 'primary');
  const textColor = useThemeColor({}, 'text');

  const handlePress = () => {
    if (!disabled) {
      onPress();
    }
  };

  return (
    <Pressable
      style={[
        styles.container,
        containerStyle,
        disabled && styles.disabled,
      ]}
      onPress={handlePress}
      disabled={disabled}
      accessibilityRole="button"
      accessibilityLabel={title}
      accessibilityHint="Tap to view all items"
    >
      <View style={styles.content}>
        <Text
          variant="body"
          style={[
            styles.text,
            { color: disabled ? textColor : primaryColor },
            textStyle,
          ]}
        >
          {title}
        </Text>
        
        {showIcon && (
          <ChevronRight
            size={iconSize}
            color={disabled ? textColor : primaryColor}
            style={styles.icon}
          />
        )}
      </View>
    </Pressable>
  );
});

ViewAllButton.displayName = 'ViewAllButton';

const styles = StyleSheet.create({
  container: {
    alignSelf: 'flex-start',
    paddingVertical: 8,
    paddingHorizontal: 4,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  text: {
    fontSize: 14,
    fontWeight: '600',
  },
  icon: {
    marginLeft: 4,
  },
  disabled: {
    opacity: 0.5,
  },
});