// components/ui/enhanced-menu-item.tsx
import React from 'react';
import { Pressable, StyleSheet, ViewStyle, TextStyle } from 'react-native';
import { ChevronRight, LucideIcon } from 'lucide-react-native';

import { Text } from '@/components/ui/text';
import { View } from '@/components/ui/view';
import { useThemeColor } from '@/hooks/useThemeColor';

interface EnhancedMenuItemProps {
  icon: LucideIcon;
  text: string;
  onPress: () => void;
  textStyle?: TextStyle;
  iconColor?: string;
  showChevron?: boolean;
  disabled?: boolean;
  accessibilityLabel: string;
  accessibilityHint: string;
  badge?: string | number;
  containerStyle?: ViewStyle;
  rightComponent?: React.ReactNode;
}

export const EnhancedMenuItem: React.FC<EnhancedMenuItemProps> = ({
  icon: Icon,
  text,
  onPress,
  textStyle,
  iconColor,
  showChevron = true,
  disabled = false,
  accessibilityLabel,
  accessibilityHint,
  badge,
  containerStyle,
  rightComponent,
}) => {
  const primaryColor = useThemeColor({}, 'primary');
  const textColor = useThemeColor({}, 'text');
  const mutedColor = useThemeColor({}, 'mutedForeground');
  
  const finalIconColor = iconColor || primaryColor;
  const finalTextColor = disabled ? mutedColor : (textStyle?.color || textColor);

  return (
    <Pressable
      style={({ pressed }) => [
        styles.container,
        containerStyle,
        {
          opacity: disabled ? 0.6 : pressed ? 0.7 : 1,
          backgroundColor: pressed ? `${primaryColor}10` : 'transparent',
        }
      ]}
      onPress={disabled ? undefined : onPress}
      disabled={disabled}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
      accessibilityHint={accessibilityHint}
      accessibilityState={{ disabled }}
    >
      <View style={styles.content}>
        <View style={styles.leftSection}>
          <View style={styles.iconContainer}>
            <Icon 
              size={20} 
              color={finalIconColor}
            />
          </View>
          
          <Text 
            style={[
              styles.text,
              textStyle,
              { color: finalTextColor }
            ]}
          >
            {text}
          </Text>
        </View>

        <View style={styles.rightSection}>
          {badge && (
            <View style={styles.badgeContainer}>
              <Text style={styles.badgeText}>
                {badge}
              </Text>
            </View>
          )}
          
          {rightComponent}
          
          {showChevron && !rightComponent && (
            <ChevronRight 
              size={18} 
              color={mutedColor}
            />
          )}
        </View>
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: 16,
    paddingHorizontal: 4,
    borderRadius: 8,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  leftSection: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  iconContainer: {
    marginRight: 16,
    width: 20,
    alignItems: 'center',
  },
  text: {
    fontSize: 16,
    fontWeight: '500',
    flex: 1,
  },
  rightSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  badgeContainer: {
    backgroundColor: '#ff4444',
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 6,
  },
  badgeText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '600',
  },
});