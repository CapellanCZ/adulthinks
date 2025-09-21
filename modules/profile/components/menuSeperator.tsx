// components/profile/MenuSeparator.tsx
import React from 'react';
import { StyleSheet } from 'react-native';

import { Separator } from '@/components/ui/separator';
import { View } from '@/components/ui/view';

interface MenuSeparatorProps {
  marginVertical?: number;
  marginHorizontal?: number;
  opacity?: number;
  height?: number;
}

export const MenuSeparator: React.FC<MenuSeparatorProps> = ({
  marginVertical = 15,
  marginHorizontal = 5,
  opacity = 0.4,
  height = 2,
}) => {
  return (
    <View style={[styles.container, { marginHorizontal }]}>
      <Separator 
        style={{
          height, 
          marginVertical, 
          opacity,
          backgroundColor: '#e0e0e0',
        }} 
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
});