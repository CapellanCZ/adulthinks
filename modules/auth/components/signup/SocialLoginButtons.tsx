import React from "react";
import { useColorScheme } from "react-native";
import { Button } from "@/components/ui/button";
import { ExpoIcons, FlexibleIcon } from "@/components/ui/flexible-icon";
import { Text } from "@/components/ui/text";
import { View } from "@/components/ui/view";
import { useSignupStyles, theme } from "../../styles/signupStyles";

interface SocialLoginButtonsProps {
  onGooglePress: () => void;
  onApplePress: () => void;
  loading?: boolean;
  disabled?: boolean;
}

export const SocialLoginButtons: React.FC<SocialLoginButtonsProps> = ({
  onGooglePress,
  onApplePress,
  loading = false,
  disabled = false,
}) => {
  const styles = useSignupStyles();
  const colorScheme = useColorScheme();
  const colors = theme.getThemeColors(colorScheme);

  return (
    <View style={styles.socialContainer}>
      {/* Separator */}
      <View style={styles.separatorContainer}>
        <View style={styles.separatorLine} />
        <Text style={styles.separatorText}>Or continue with</Text>
        <View style={styles.separatorLine} />
      </View>

      {/* Social Login Buttons */}
      <View style={styles.socialButtonsContainer}>
        <Button
          variant="outline"
          style={styles.socialButton}
          onPress={onGooglePress}
          disabled={loading || disabled}
          accessibilityLabel="Sign up with Google"
          accessibilityHint="Creates account using your Google account"
        >
          <FlexibleIcon icon={ExpoIcons.fontAwesome("google")} size={22} />
          <Text>Google</Text>
        </Button>
        
        <Button
          variant="outline"
          style={styles.socialButton}
          onPress={onApplePress}
          disabled={loading || disabled}
          accessibilityLabel="Sign up with Apple"
          accessibilityHint="Creates account using your Apple ID"
        >
          <FlexibleIcon icon={ExpoIcons.fontAwesome("apple")} size={22} />
          <Text>Apple</Text>
        </Button>
      </View>
    </View>
  );
};

