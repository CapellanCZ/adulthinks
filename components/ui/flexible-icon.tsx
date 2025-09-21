import { useThemeColor } from '@/hooks/useThemeColor';
import { LucideProps } from 'lucide-react-native';
import React from 'react';
import { Colors } from '@/theme/colors';

// Import Expo Vector Icons
import { 
  AntDesign, 
  Entypo, 
  EvilIcons, 
  Feather, 
  FontAwesome, 
  FontAwesome5, 
  FontAwesome6, 
  Foundation, 
  Ionicons, 
  MaterialCommunityIcons, 
  MaterialIcons, 
  Octicons, 
  SimpleLineIcons, 
  Zocial 
} from '@expo/vector-icons';

// Define Expo icon families
export type ExpoIconFamily = 
  | 'AntDesign' 
  | 'Entypo' 
  | 'EvilIcons' 
  | 'Feather' 
  | 'FontAwesome' 
  | 'FontAwesome5' 
  | 'FontAwesome6' 
  | 'Foundation' 
  | 'Ionicons' 
  | 'MaterialCommunityIcons' 
  | 'MaterialIcons' 
  | 'Octicons' 
  | 'SimpleLineIcons' 
  | 'Zocial';

// Define Expo icon props
export interface ExpoIconProps {
  family: ExpoIconFamily;
  name: string;
  size?: number;
  color?: string;
}

// Union type for both icon types
export interface LucideIconProps {
  type: 'lucide';
  component: React.ComponentType<LucideProps>;
}

export interface ExpoIconConfig {
  type: 'expo';
  family: ExpoIconFamily;
  name: string;
}

export type FlexibleIconConfig = LucideIconProps | ExpoIconConfig;

// Main FlexibleIcon props
export interface FlexibleIconProps {
  icon: FlexibleIconConfig;
  size?: number;
  color?: string;
  lightColor?: string;
  darkColor?: string;
  strokeWidth?: number; // Only applies to Lucide icons
}

// Icon family component map
const ExpoIconComponents = {
  AntDesign,
  Entypo,
  EvilIcons,
  Feather,
  FontAwesome,
  FontAwesome5,
  FontAwesome6,
  Foundation,
  Ionicons,
  MaterialCommunityIcons,
  MaterialIcons,
  Octicons,
  SimpleLineIcons,
  Zocial,
} as const;

export function FlexibleIcon({
  icon,
  size = 24,
  color,
  lightColor,
  darkColor,
  strokeWidth = 1.8,
}: Readonly<FlexibleIconProps>) {
  // Get theme from useThemeColor
  const theme = useThemeColor({}, 'background') === Colors.light.background ? 'light' : 'dark';
  // Use Colors.icon for current theme, allow override
  const themedColor = Colors[theme].icon;
  const iconColor = color ?? themedColor;
  // Render based on icon type
  if (icon.type === 'lucide') {
    const LucideComponent = icon.component;
    return (
      <LucideComponent
        color={iconColor}
        size={size}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
      />
    );
  }

  if (icon.type === 'expo') {
    const ExpoComponent = ExpoIconComponents[icon.family];
    return (
      <ExpoComponent
        name={icon.name as any} // Type assertion needed due to dynamic nature
        size={size}
        color={iconColor}
      />
    );
  }

  // Fallback - should never reach here with proper TypeScript
  return null;
}

// Helper functions for easier icon creation
export const createLucideIcon = (component: React.ComponentType<LucideProps>): LucideIconProps => ({
  type: 'lucide',
  component,
});

export const createExpoIcon = (family: ExpoIconFamily, name: string): ExpoIconConfig => ({
  type: 'expo',
  family,
  name,
});

// Common Expo icon shortcuts for convenience
export const ExpoIcons = {
  // Ionicons (most commonly used)
  ionicon: (name: string) => createExpoIcon('Ionicons', name),
  
  // Material Icons
  material: (name: string) => createExpoIcon('MaterialIcons', name),
  materialCommunity: (name: string) => createExpoIcon('MaterialCommunityIcons', name),
  
  // Font Awesome
  fontAwesome: (name: string) => createExpoIcon('FontAwesome', name),
  fontAwesome5: (name: string) => createExpoIcon('FontAwesome5', name),
  fontAwesome6: (name: string) => createExpoIcon('FontAwesome6', name),
  
  // Other popular ones
  antDesign: (name: string) => createExpoIcon('AntDesign', name),
  feather: (name: string) => createExpoIcon('Feather', name),
  entypo: (name: string) => createExpoIcon('Entypo', name),
};