import React from 'react';
import { View, ViewStyle } from 'react-native';
import { User } from 'lucide-react-native';
import { Text } from './text';
import { useThemeColor } from '@/hooks/useThemeColor';

interface TextLine {
  width: 'short' | 'medium' | 'long';
}

interface GovernmentIdCardData {
  id: string;
  title: string;
  subtitle?: string;
  textLines: TextLine[];
}

interface GovernmentIdCardProps {
  data: GovernmentIdCardData;
  style?: ViewStyle;
  config?: {
    iconSize?: number;
    iconColor?: string;
    textColor?: string;
    backgroundColor?: string;
    borderColor?: string;
    padding?: {
      horizontal?: number;
      top?: number;
      bottom?: number;
    };
    spacing?: {
      headerBottom?: number;
      iconRight?: number;
      textLineBottom?: number;
    };
    textLine?: {
      height?: number;
      borderRadius?: number;
      opacity?: number;
    };
    typography?: {
      titleSize?: number;
      subtitleSize?: number;
    };
  };
}

const GovernmentIdCard: React.FC<GovernmentIdCardProps> = ({ 
  data, 
  style,
  config = {}
}) => {
  // Get theme colors for responsive dark/light mode
  const textColor = useThemeColor({}, 'text');
  const mutedColor = useThemeColor({}, 'textMuted');
  const borderColor = useThemeColor({}, 'border');
  const cardColor = useThemeColor({}, 'card');

  const {
    iconSize = 38,
    iconColor = textColor,
    backgroundColor = 'transparent', // Remove background color for dark mode compatibility
    padding = {
      horizontal: 10,
      top: 10,
      bottom: 15,
    },
    spacing = {
      headerBottom: 24,
      iconRight: 20,
      textLineBottom: 10,
    },
    textLine = {
      height: 7,
      borderRadius: 3,
      opacity: 0.3,
    },
    typography = {
      titleSize: 15,
      subtitleSize: 11,
    },
  } = config;

  const getLineWidth = (width: 'short' | 'medium' | 'long') => {
    switch (width) {
      case 'short':
        return '50%';
      case 'medium':
        return '75%';
      case 'long':
      default:
        return '100%';
    }
  };

  return (
    <View
      style={[
        {
          alignItems: 'center',
          justifyContent: 'flex-start',
          paddingHorizontal: padding.horizontal,
          paddingTop: padding.top,
          paddingBottom: padding.bottom,
          borderRadius: 15,
        },
        style,
      ]}
    >
      {/* ID Card Header */}
      <View style={{ alignItems: "center", marginBottom: spacing.headerBottom }}>
        <Text 
          variant="caption" 
          style={{
            fontSize: typography.titleSize,
            fontWeight: "700",
            opacity: 0.9,
            letterSpacing: 0.5,
            color: textColor,
            textAlign: "center",
          }}
        >
          {data.title}
        </Text>
        {data.subtitle && (
          <Text 
            variant="caption" 
            style={{
              fontSize: typography.subtitleSize,
              fontWeight: "500",
              opacity: 0.7,
              marginTop: 4,
              color: textColor,
              textAlign: "center",
            }}
          >
            {data.subtitle}
          </Text>
        )}
      </View>
      
      {/* ID Card Content */}
      <View style={{
        flexDirection: "row",
        alignItems: "center",
        width: "100%",
        paddingHorizontal: 8,
      }}>
        {/* Left side - Person icon */}
        <View style={{
          alignItems: "center",
          justifyContent: "center",
          marginRight: spacing.iconRight,
        }}>
          <View style={{
            width: 60,
            height: 60,
            borderRadius: 15,
            backgroundColor: backgroundColor,
            alignItems: "center",
            justifyContent: "center",
            borderWidth: 1,
            borderColor: borderColor,
          }}>
            <User size={iconSize} color={iconColor} />
          </View>
        </View>
        
        {/* Right side - Text lines */}
        <View style={{
          flex: 1,
          justifyContent: "center",
        }}>
          {data.textLines.slice(0, 5).map((line, lineIndex) => (
            <View 
              key={lineIndex}
              style={{
                height: textLine.height,
                borderRadius: textLine.borderRadius,
                marginBottom: spacing.textLineBottom,
                backgroundColor: mutedColor,
                opacity: textLine.opacity,
                width: getLineWidth(line.width),
              }}
            />
          ))}
        </View>
      </View>
    </View>
  );
};

export { GovernmentIdCard };
export type { GovernmentIdCardData, GovernmentIdCardProps };