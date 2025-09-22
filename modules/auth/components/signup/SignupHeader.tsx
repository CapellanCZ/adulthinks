import React from "react";
import { StyleSheet } from "react-native";
import { User } from "lucide-react-native";
import { Text } from "@/components/ui/text";
import { View } from "@/components/ui/view";

interface SignupHeaderProps {
  title?: string;
  subtitle?: string;
  iconSize?: number;
  iconColor?: string;
}

export const SignupHeader: React.FC<SignupHeaderProps> = ({
  title = "Create Account",
  subtitle = "Enter your details and register",
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
        <User size={iconSize} color={iconColor} />
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
    alignItems: "center",
  },
  iconCircle: {
    width: 75,
    height: 75,
    borderRadius: 40,
    backgroundColor: "#f7f7f7ff",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 25,
  },
  title: {
    marginBottom: 10,
  },
  subtitle: {
    textAlign: "center",
  },
});
