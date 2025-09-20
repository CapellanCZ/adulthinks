import React from 'react';
import { View, ViewStyle } from 'react-native';
import { Text } from './text';
import { useThemeColor } from '@/hooks/useThemeColor';

interface StatsCardProps {
  title: string;
  value: string | number;
  unit?: string;
  subtitle?: string;
  icon?: React.ReactNode;
  style?: ViewStyle;
  size?: 'small' | 'medium' | 'large';
  accentColor?: string;
}

export const StatsCard: React.FC<StatsCardProps> = ({
  title,
  value,
  unit,
  subtitle,
  icon,
  style,
  size = 'medium',
  accentColor,
}) => {
  const cardColor = useThemeColor({}, 'card');
  const textColor = useThemeColor({}, 'text');
  const mutedTextColor = useThemeColor({}, 'textMuted');
  const borderColor = useThemeColor({}, 'border');

  const cardStyles = {
    backgroundColor: cardColor,
    borderRadius: 20,
    padding: size === 'small' ? 16 : size === 'large' ? 24 : 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 3,
    borderWidth: 1,
    borderColor: accentColor ? accentColor + '20' : borderColor + '20',
    minHeight: size === 'small' ? 80 : size === 'large' ? 120 : 100,
  };

  return (
    <View style={[cardStyles, style]}>
      {/* Header */}
      <View style={{ 
        flexDirection: 'row', 
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 12,
      }}>
        <Text 
          variant="caption" 
          style={{ 
            fontSize: size === 'small' ? 12 : 13,
            fontWeight: '500',
            color: mutedTextColor,
            opacity: 0.8,
          }}
        >
          {title}
        </Text>
        {icon && (
          <View style={{ opacity: 0.7 }}>
            {icon}
          </View>
        )}
      </View>

      {/* Value */}
      <View style={{ flex: 1, justifyContent: 'center' }}>
        <View style={{ flexDirection: 'row', alignItems: 'baseline' }}>
          <Text 
            style={{
              fontSize: size === 'small' ? 24 : size === 'large' ? 36 : 32,
              fontWeight: '700',
              color: accentColor || textColor,
              lineHeight: size === 'small' ? 28 : size === 'large' ? 40 : 36,
            }}
          >
            {value}
          </Text>
          {unit && (
            <Text 
              style={{
                fontSize: size === 'small' ? 14 : 16,
                fontWeight: '500',
                color: mutedTextColor,
                marginLeft: 4,
              }}
            >
              {unit}
            </Text>
          )}
        </View>
        
        {subtitle && (
          <Text 
            variant="caption"
            style={{
              fontSize: size === 'small' ? 11 : 12,
              color: mutedTextColor,
              marginTop: 4,
              opacity: 0.7,
            }}
          >
            {subtitle}
          </Text>
        )}
      </View>
    </View>
  );
};