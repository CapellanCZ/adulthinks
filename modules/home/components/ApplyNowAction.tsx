import React from 'react';
import { StyleSheet } from 'react-native';
import { FileInput } from 'lucide-react-native';

import { Button } from '@/components/ui/button';
import { useThemeColor } from '@/hooks/useThemeColor';
import { router } from 'expo-router';
import type { PopularCardData } from './popularCard';

interface ApplyNowActionProps {
  data: PopularCardData;
  onPress?: (data: PopularCardData) => void;
  style?: any;
  extraParams?: Record<string, string | number | undefined>;
  beforePress?: () => void; // used to perform actions like closing a sheet without altering UI
}

export const ApplyNowAction: React.FC<ApplyNowActionProps> = ({
  data,
  onPress,
  style,
  extraParams,
  beforePress,
}) => {
  // Theme-aware usage kept for future styling extensibility
  useThemeColor({}, 'icon');

  const handlePress = () => {
    if (onPress) {
      onPress(data);
      return;
    }

    // Allow the parent to perform actions (like closing a sheet) before navigation
    beforePress?.();

    router.push({
      pathname: '/(id-process)',
      params: {
        id: data.id,
        title: data.title,
        category: data.category ?? '',
        description: data.description,
        ...(extraParams ?? {}),
      },
    });
  };

  return (
    <Button style={style} icon={FileInput} onPress={handlePress} accessibilityLabel="Apply for this ID" accessibilityHint="Opens the application process">
      Apply Now
    </Button>
  );
};

ApplyNowAction.displayName = 'ApplyNowAction';

const styles = StyleSheet.create({});