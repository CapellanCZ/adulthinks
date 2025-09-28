import React from "react";
import { StyleSheet } from "react-native";
import { User } from "lucide-react-native";
import { Text } from "@/components/ui/text";
import { View } from "@/components/ui/view";
import Yoga from "@/assets/svg/yoga";

interface SignupHeaderProps {
  title?: string;
  subtitle?: string;
  iconSize?: number;
  iconColor?: string;
}

export const SignupHeader: React.FC<SignupHeaderProps> = ({
  title = "Create an account",
  subtitle = "It takes less than a minute to create an account.",
  iconSize = 40,
  iconColor = "#666",
}) => {
  return (
    <View
      style={styles.container}
      accessibilityRole="header"
      accessibilityLabel={`${title}. ${subtitle}`}
    >
      <View style={styles.iconCircle}>
      </View>
      <Text variant="heading" style={styles.title}>
        {title}
      </Text>
      <Text variant="caption" style={styles.subtitle}>
        {subtitle}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
    alignItems: "flex-start",
  },
  iconCircle: {
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 25,
  },
  title: {
    marginBottom: 8,
  },
  subtitle: {
    textAlign: "left",
  },
});
