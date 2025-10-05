import { useState, useCallback } from 'react';
import { router } from 'expo-router';
import * as Haptics from 'expo-haptics';
import { OptionType } from '@/components/ui/combobox';

export const useHomeScreen = () => {
  const [selectedGovernmentId, setSelectedGovernmentId] = useState<OptionType | null>(null);

  const handleNotificationPress = useCallback(async () => {
    try {
      // Haptic feedback for better UX
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      
      // TODO: Implement notification logic
      // - Fetch notifications from API
      // - Navigate to notifications screen
      // - Update notification badge count
      console.log("Notification button pressed");
    } catch (error) {
      console.error('Error handling notification press:', error);
    }
  }, []);

  const handleSeeAllPress = useCallback((section: 'popular' | 'trending') => {
    try {
      // Navigate to the Identification Process index screen
      // Group segments are included to target the correct layout
      router.push('/(id-process)');
    } catch (error) {
      console.error(`Error handling see all press for ${section}:`, error);
    }
  }, []);

  const handleApplyNowPress = useCallback(() => {
    try {
      router.push('/(id-process)');
    } catch (error) {
      console.error('Error handling Apply Now press:', error);
    }
  }, []);

  const handleGovernmentIdSelect = useCallback((id: OptionType | null) => {
    try {
      setSelectedGovernmentId(id);
      
      if (id) {
        // TODO: Implement analytics tracking
        // - Track selected ID for recommendations
        // - Update user preferences
        console.log('Government ID selected:', id);
      }
    } catch (error) {
      console.error('Error handling government ID selection:', error);
    }
  }, []);

  return {
    selectedGovernmentId,
    setSelectedGovernmentId: handleGovernmentIdSelect,
    handleNotificationPress,
    handleSeeAllPress,
    handleApplyNowPress,
  };
};