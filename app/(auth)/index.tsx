import { router } from "expo-router";
import React from "react";
import { Pressable, StyleSheet } from "react-native";

import { Button } from "@/components/ui/button";
import { Text } from "@/components/ui/text";
import { View } from "@/components/ui/view";

import Learn from "@/assets/svg/learn"
import { useColorScheme } from "react-native";
import { theme } from "@/modules/auth/styles/signupStyles";
import { Icon } from '@/components/ui/icon';
import { SmilePlus } from 'lucide-react-native';

// This is the initial screen for the (auth) group
export default function AuthIndex() {
  const colors = theme.getThemeColors(useColorScheme());

  return (
    <View style={styles.container}>
      <View style={{ flexDirection: "row", alignItems: "center", gap: 5 }}>
        <Icon name={SmilePlus} size={32} strokeWidth={2} lightColor={colors.primary} darkColor={colors.primary} />
        <Text style={styles.brandTitle}>Adulthinks</Text>
      </View>

      <View style={styles.imageContainer}>
        <Learn width={340} height={340} />
      </View>

      <View style={styles.content}>

        <View>
          <View>
            <Text
              style={{ textAlign: "center" }}
              variant="heading"
            >
              Helping Young Adults to Secure Their
              <Text variant="heading" style={{ color: colors.primary }}> Future.</Text>
            </Text>
          </View>
        </View>

        <View style={{ gap: 10, marginTop: 15 }}>
          <Button onPress={() => router.push("/(auth)/signup")}>
            Get Started
          </Button>
          <Button
            variant="secondary"
            onPress={() => router.push("/(auth)/login")}
          >
            I already have an account
          </Button>
        </View>

        <View style={styles.disclaimerContainer}>
          <Text style={styles.disclaimerText}>
            By continuing you agree to our
          </Text>
          <View style={styles.disclaimerLinks}>
            <Pressable
              accessibilityRole="button"
              accessibilityHint="Opens terms and conditions"
              onPress={() => { }}
              hitSlop={8}
            >
              <Text variant="link" style={styles.disclaimerLink}>
                Terms and Conditions
              </Text>
            </Pressable>
            <Text style={styles.disclaimerText}>and </Text>
            <Pressable
              accessibilityRole="button"
              accessibilityHint="Opens privacy policy"
              onPress={() => { }}
              hitSlop={8}
            >
              <Text variant="link" style={styles.disclaimerLink}>
                Privacy Policy
              </Text>
            </Pressable>
          </View>
        </View>

      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: '15%',
    paddingBottom: 24,
    alignItems: "center",
  },
  brandTitle: {
    fontFamily: "Bingo",
    fontSize: 32,
    textAlign: "center",
  },
  imageContainer: {
    flex: 1,
    justifyContent: "flex-end",
  },
  content: {
    width: "100%",
    paddingBottom: 8,
  },
  disclaimerContainer: {
    marginTop: 12,
    alignItems: "center",
    paddingVertical: 16,
    paddingHorizontal: 16,
    gap: 6,
  },
  disclaimerText: {
    textAlign: "center",
    fontSize: 14,
    color: "#414141",
    opacity: 0.5,
  },
  disclaimerLink: {
    fontSize: 14,
    opacity: 0.5,
  },
  disclaimerLinks: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    flexWrap: "wrap",
    gap: 3,
  },
});
