// components/profile/MenuSection.tsx
import React from 'react';
import { StyleSheet } from 'react-native';

import { MenuItem } from '@/components/ui/menu-item';
import { View } from '@/components/ui/view';
// Define interfaces locally since types file may not be in the expected location
interface MenuItemConfig {
  id: string;
  icon: any; // LucideIcon
  text: string;
  onPress: () => void;
  textStyle?: any;
  iconColor?: string;
  showChevron?: boolean;
  accessibilityLabel: string;
  accessibilityHint: string;
  disabled?: boolean;
  badge?: string | number;
}

interface MenuSection {
  id: string;
  title: string;
  items: MenuItemConfig[];
}

interface MenuSectionProps {
  section: MenuSection;
  accessibilityLabel?: string;
}

export const MenuSection: React.FC<MenuSectionProps> = ({
  section,
  accessibilityLabel,
}) => {
  return (
    <View 
      style={styles.container}
      accessible={false} // Let individual items be accessible instead
      accessibilityLabel={accessibilityLabel}
    >
      {section.items.map((item: MenuItemConfig) => (
        <MenuItem
          key={item.id}
          icon={item.icon}
          text={item.text}
          onPress={item.onPress}
          textStyle={item.textStyle}
          iconColor={item.iconColor}
          showChevron={item.showChevron}
        />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
});