import React, { useState, useCallback, PropsWithChildren } from 'react';
import { LayoutAnimation, Platform, UIManager } from 'react-native';

import { Icon } from '@/components/ui/icon';
import { Text } from '@/components/ui/text';
import { View } from '@/components/ui/view';
import { ChevronDown, ChevronRight } from 'lucide-react-native';
import { useThemeColor } from '@/hooks/useThemeColor';

if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

interface CollapsibleProps {
  title: string;
  defaultOpen?: boolean;
}

export const Collapsible: React.FC<PropsWithChildren<CollapsibleProps>> = ({
  title,
  defaultOpen = false,
  children,
}) => {
  const [open, setOpen] = useState<boolean>(defaultOpen);
  const borderColor = useThemeColor({}, 'border');
  const headerBg = useThemeColor({}, 'secondary');
  const contentBg = useThemeColor({}, 'card');
  const iconColor = useThemeColor({}, 'icon');

  const toggle = useCallback(() => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setOpen((prev) => !prev);
  }, []);

  return (
    <View style={{ borderRadius: 12, borderWidth: 1, borderColor: borderColor, overflow: 'hidden' }}>
      <View
        onTouchEnd={toggle}
        style={{
          paddingHorizontal: 14,
          paddingVertical: 12,
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          backgroundColor: headerBg,
        }}
        accessibilityRole="button"
        accessibilityLabel={`${title} ${open ? 'collapse' : 'expand'}`}
        accessibilityHint="Toggles the visibility of the content section"
      >
        <Text style={{ fontSize: 14, fontWeight: '600', flex: 1 }}>{title}</Text>
        <Icon name={open ? ChevronDown : ChevronRight} size={18} color={iconColor} />
      </View>

      {open ? (
        <View style={{ paddingHorizontal: 14, paddingVertical: 12, backgroundColor: contentBg }}>
          {children}
        </View>
      ) : null}
    </View>
  );
};


