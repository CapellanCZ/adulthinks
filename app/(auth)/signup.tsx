import { router } from "expo-router";
import { EyeOff, User } from "lucide-react-native";
import React from "react";
import { Pressable, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { AvoidKeyboard } from "@/components/ui/avoid-keyboard";
import { Button } from "@/components/ui/button";
import { ExpoIcons, FlexibleIcon } from "@/components/ui/flexible-icon";
import { Input } from "@/components/ui/input";
import { Text } from "@/components/ui/text";
import { View } from "@/components/ui/view";

// TODO: Implement signup logic and form state management 
// TODO: Add validation and error handling
// TODO: Integrate with backend API for user registration
// TODO: Add social login functionality
// TODO: Add loading states and feedback for user actions

export default function SignupScreen() {
  return (
    <SafeAreaView
      style={{
        flex: 1,
        padding: 20,
        backgroundColor: "white",
      }}
    >
      {/* Main Content - Centered */}
      <View style={{ flex: 1, justifyContent: "center", paddingBottom: "12%" }}>
        {/* Header */}
        <View
          style={{
            justifyContent: "center",
            alignItems: "center",
            marginBottom: 40,
          }}
        >
          <View style={styles.iconCircle}>
            <User size={40} color="#666" />
          </View>
          <Text variant="heading" style={{ marginBottom: 10 }}>
            Create Account
          </Text>
          <Text variant="caption">Enter your details and register</Text>
        </View>

        {/* Form Inputs */}
        <View style={{ gap: 16 }}>
          <Input
            variant="outline"
            placeholder="Enter your email"
            autoComplete="email"
            keyboardType="email-address"
          />

          <Input
            variant="outline"
            placeholder="Enter your password"
            keyboardType="visible-password"
            secureTextEntry={true}
            rightComponent={
              <Pressable>
                <EyeOff size={22} color="#888" />
              </Pressable>
            }
          />

          <Input
            variant="outline"
            placeholder="Confirm your password"
            keyboardType="visible-password"
            secureTextEntry={true}
            rightComponent={
              <Pressable>
                <EyeOff size={22} color="#888" />
              </Pressable>
            }
          />
        </View>

        {/* Sign Up Button */}
        <Button style={{ marginTop: 40, marginBottom: 30 }}>Register</Button>

        {/* Separator */}
        <View style={styles.separatorContainer}>
          <View style={styles.separatorLine} />
          <Text style={styles.separatorText}>Or continue with</Text>
          <View style={styles.separatorLine} />
        </View>

        {/* Social Login Buttons */}
        <View style={{ flexDirection: "row", gap: 12 }}>
          <Button variant="outline" style={{ flex: 1 }}>
            <FlexibleIcon icon={ExpoIcons.fontAwesome("google")} size={22} />
            <Text>Google</Text>
          </Button>
          <Button variant="outline" style={{ flex: 1 }}>
            <FlexibleIcon icon={ExpoIcons.fontAwesome("apple")} size={22} />
            <Text>Apple</Text>
          </Button>
        </View>
      </View>

      {/* Terms and Conditions - Bottom */}
      <View style={styles.signupContainer}>
        <Text style={{ fontSize: 13, color: "#666" }}>
          By clicking &apos;Register&apos; you agree to our{" "}
        </Text>
        <View style={{ flexDirection: "row" }}>
          <Pressable>
            <Text style={{ fontSize: 13, color: "#666" }} variant="link">
              Terms & Conditions
            </Text>
          </Pressable>
          <Text style={{ fontSize: 13, color: "#666" }}> and </Text>
          <Pressable>
            <Text style={{ fontSize: 13, color: "#666" }} variant="link">
              Privacy Policy
            </Text>
          </Pressable>
        </View>
      </View>

      <AvoidKeyboard />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  iconCircle: {
    width: 75,
    height: 75,
    borderRadius: 40,
    backgroundColor: "#f7f7f7ff",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 25,
  },
  separatorContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 30,
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
  signupContainer: {
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
});
