import React from "react";
import { StyleSheet } from "react-native";
import { Button } from "@/components/ui/button";
import { ExpoIcons, FlexibleIcon } from "@/components/ui/flexible-icon";
import { Text } from "@/components/ui/text";
import { View } from "@/components/ui/view";

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
  return (
    <View style={styles.container}>
      {/* Separator */}
      <View style={styles.separatorContainer}>
        <View style={styles.separatorLine} />
        <Text style={styles.separatorText}>Or continue with</Text>
        <View style={styles.separatorLine} />
      </View>

      {/* Social Login Buttons */}
      <View style={styles.buttonsContainer}>
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

const styles = StyleSheet.create({
  container: {
    gap: 30,
  },
  separatorContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  separatorLine: {
    flex: 1,
    height: 1,
    backgroundColor: "#e0e0e0",
  },
  separatorText: {
    marginHorizontal: 16,
    fontSize: 15,
    color: "#666",
  },
  buttonsContainer: {
    flexDirection: "row",
    gap: 12,
  },
  socialButton: {
    flex: 1,
  },
});
