import React from "react";
import { Pressable, StyleSheet } from "react-native";
import { Text } from "@/components/ui/text";
import { View } from "@/components/ui/view";

interface TermsAndConditionsProps {
  onTermsPress: () => void;
  onPrivacyPress: () => void;
}

export const TermsAndConditions: React.FC<TermsAndConditionsProps> = ({
  onTermsPress,
  onPrivacyPress,
}) => {
  return (
    <View 
      style={styles.container}
      accessibilityRole="text"
      accessibilityLabel="Terms and conditions agreement"
    >
      <Text style={styles.text}>
        By clicking 'Register' you agree to our{" "}
      </Text>
      <View style={styles.linksContainer}>
        <Pressable
          onPress={onTermsPress}
          accessibilityRole="link"
          accessibilityLabel="Terms and Conditions"
          accessibilityHint="Opens terms and conditions page"
        >
          <Text style={styles.text} variant="link">
            Terms & Conditions
          </Text>
        </Pressable>
        <Text style={styles.text}> and </Text>
        <Pressable
          onPress={onPrivacyPress}
          accessibilityRole="link"
          accessibilityLabel="Privacy Policy"
          accessibilityHint="Opens privacy policy page"
        >
          <Text style={styles.text} variant="link">
            Privacy Policy
          </Text>
        </Pressable>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    bottom: "3%",
    left: 0,
    right: 0,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 20,
    paddingHorizontal: 20,
    opacity: 0.8,
  },
  text: {
    fontSize: 13,
    color: "#666",
  },
  linksContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
});
