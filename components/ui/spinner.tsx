import { Text } from '@/components/ui/text';
import { useThemeColor } from '@/hooks/useThemeColor';
import { BORDER_RADIUS, FONT_SIZE } from '@/theme/globals';
import React from 'react';
import { ActivityIndicator, StyleSheet, View, ViewStyle } from 'react-native';

// Types
type SpinnerSize = 'default' | 'sm' | 'lg' | 'icon';
export type SpinnerVariant = 'default';

interface SpinnerProps {
  size?: SpinnerSize;
  variant?: SpinnerVariant;
  label?: string;
  showLabel?: boolean;
  style?: ViewStyle;
  color?: string;
}

interface LoadingOverlayProps extends SpinnerProps {
  visible: boolean;
  backdrop?: boolean;
  backdropColor?: string;
  backdropOpacity?: number;
}

interface SpinnerConfig {
  size: number;
  fontSize: number;
  gap: number;
}

// Configuration
const sizeConfig: Record<SpinnerSize, SpinnerConfig> = {
  sm: { size: 16, fontSize: 12, gap: 6 },
  default: { size: 24, fontSize: FONT_SIZE, gap: 8 },
  lg: { size: 32, fontSize: 16, gap: 10 },
  icon: { size: 24, fontSize: FONT_SIZE, gap: 8 },
};

// Main Spinner Component
export function Spinner({
  size = 'default',
  variant = 'default',
  label,
  showLabel = false,
  style,
  color,
}: SpinnerProps) {
  const primaryColor = useThemeColor({}, 'text');
  const textColor = useThemeColor({}, 'text');

  const config = sizeConfig[size];
  const spinnerColor = color || primaryColor;

  const containerStyle: ViewStyle = {
    alignItems: 'center',
    justifyContent: 'center',
    gap: config.gap,
  };

  return (
    <View style={[containerStyle, style]}>
      <ActivityIndicator
        size={config.size}
        color={spinnerColor}
        style={styles.spinner}
      />
      {(showLabel || label) && (
        <Text
          style={[
            styles.label,
            {
              color: textColor,
              fontSize: config.fontSize,
            },
          ]}
        >
          {label || 'Loading...'}
        </Text>
      )}
    </View>
  );
}

// Loading Overlay Component
export function LoadingOverlay({
  visible,
  backdrop = true,
  backdropColor,
  backdropOpacity = 0.5,
  ...spinnerProps
}: LoadingOverlayProps) {
  const backgroundColor = useThemeColor({}, 'background');
  const cardColor = useThemeColor({}, 'card');

  const defaultBackdropColor =
    backdropColor ||
    `${backgroundColor}${Math.round(backdropOpacity * 255)
      .toString(16)
      .padStart(2, '0')}`;

  if (!visible) return null;

  return (
    <View
      style={[
        styles.overlay,
        { backgroundColor: backdrop ? defaultBackdropColor : 'transparent' },
      ]}
      pointerEvents="auto"
    >
      <View style={[styles.overlayContent, { backgroundColor: cardColor }]}>
        <Spinner {...spinnerProps} />
      </View>
    </View>
  );
}

// Inline Loader Component (for buttons, etc.)
export function InlineLoader({
  size = 'sm',
  variant = 'default',
  color,
}: Omit<SpinnerProps, 'label' | 'showLabel'>) {
  return (
    <Spinner
      size={size}
      variant={variant}
      color={color}
      style={styles.inlineLoader}
    />
  );
}

const styles = StyleSheet.create({
  spinner: {
    alignSelf: 'center',
  },
  label: {
    textAlign: 'center',
    fontWeight: '500',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 9999,
  },
  overlayContent: {
    padding: 60,
    borderRadius: BORDER_RADIUS,
  },
  inlineLoader: {
    minHeight: 0,
    minWidth: 0,
  },
  buttonSpinner: {
    minHeight: 0,
    minWidth: 0,
  },
});
