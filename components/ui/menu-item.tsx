import * as Haptics from 'expo-haptics';
import { ChevronRight, LucideIcon } from 'lucide-react-native';
import React, { useRef } from 'react';
import { Animated, Pressable, TextStyle, TouchableOpacity, ViewStyle } from 'react-native';

import { useThemeColor } from '@/hooks/useThemeColor';

import { Text } from './text';

interface MenuItemProps {
  readonly icon: LucideIcon;
  readonly text: string;
  readonly onPress?: () => void;
  readonly backgroundColor?: string;
  readonly iconColor?: string;
  readonly iconFill?: string;
  readonly iconSize?: number;
  readonly iconStrokeWidth?: number;
  readonly textStyle?: TextStyle;
  readonly showChevron?: boolean;
  readonly chevronColor?: string;
  readonly chevronSize?: number;
  readonly containerStyle?: ViewStyle;
  readonly paddingHorizontal?: number;
  readonly paddingVertical?: number;
}

export function MenuItem({
  icon: Icon,
  text,
  onPress,
  backgroundColor,
  iconColor,
  iconFill = "transparent",
  iconSize = 28,
  iconStrokeWidth = 1.7,
  textStyle,
  showChevron = true,
  chevronColor,
  chevronSize = 28,
  containerStyle,
  paddingHorizontal = 10,
  paddingVertical = 10,
}: MenuItemProps) {
  // Animation setup
  const scaleValue = useRef(new Animated.Value(1)).current;

  // Use theme colors as defaults - white for dark mode, soft black for light mode
  const themeIconColor = useThemeColor(
    { light: "#333333", dark: "#FFFFFF" },
    "text"
  );

  const animateBounce = () => {
    Animated.sequence([
      Animated.timing(scaleValue, {
        toValue: 0.95,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(scaleValue, {
        toValue: 1,
        duration: 150,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const handlePress = () => {
    // Add haptic feedback and bounce animation
    animateBounce();
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onPress?.();
  };

  return (
    <Animated.View style={{ transform: [{ scale: scaleValue }] }}>
      <Pressable
        style={[
          {
            display: "flex",
            width: "100%",
            flexDirection: "row",
            paddingHorizontal,
            paddingVertical,
            alignItems: "center",
            backgroundColor: "transparent",
          },
          containerStyle,
        ]}
        onPress={handlePress}
      >
        {!showChevron ? (
          <TouchableOpacity activeOpacity={0.6} onPress={handlePress}>
            <Icon
              size={iconSize}
              color={iconColor || themeIconColor}
              fill={iconFill}
              strokeWidth={iconStrokeWidth}
            />
          </TouchableOpacity>
        ) : (
          <Icon
            size={iconSize}
            color={iconColor || themeIconColor}
            fill={iconFill}
            strokeWidth={iconStrokeWidth}
          />
        )}
        <Text style={[{ marginLeft: 12, color: themeIconColor }, textStyle]}>
          {text}
        </Text>
        {showChevron && (
          <TouchableOpacity
            style={{ marginLeft: "auto", padding: 4 }}
            activeOpacity={0.6}
            onPress={handlePress}
          >
            <ChevronRight
              size={chevronSize}
              color={chevronColor || themeIconColor}
              strokeWidth={1.5}
            />
          </TouchableOpacity>
        )}
      </Pressable>
    </Animated.View>
  );
}
