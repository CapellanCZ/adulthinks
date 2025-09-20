import { useCallback } from "react";
import * as Haptics from "expo-haptics";
import { GovernmentIdData } from "@/components/ui/government-id-card";

export const useGovernmentIdCard = () => {
  const handleCardPress = useCallback(async (idData: GovernmentIdData) => {
    // Haptic feedback for better user experience
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    
    // Log the interaction for debugging
    console.log("Government ID card pressed:", idData.title);
    
    // Future: Navigate to ID details page or open modal
    // navigation.navigate('IdDetails', { idData });
    
  }, []);

  const handleCardLongPress = useCallback(async (idData: GovernmentIdData) => {
    // Stronger haptic feedback for long press
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
    
    console.log("Government ID card long pressed:", idData.title);
    
    // Future: Show context menu or additional options
    
  }, []);

  return {
    handleCardPress,
    handleCardLongPress,
  };
};