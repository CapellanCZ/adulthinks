import { router } from "expo-router";
import { Eye, EyeOff, AlertCircle } from "lucide-react-native";
import React, { useEffect } from "react";
import { Pressable, StyleSheet } from "react-native";

import { AvoidKeyboard } from "@/components/ui/avoid-keyboard";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Text } from "@/components/ui/text";
import { View } from "@/components/ui/view";
import { ForgotPasswordBottomSheet } from "@/modules/auth/components/ForgotPasswordBottomSheet";

import { useAuthStore } from "../../modules/auth/store/useAuthStore";
import { useLoginFormStore } from "../../modules/auth/store/useLoginFormStore";
import { usePasswordResetStore } from "../../modules/auth/store/usePasswordResetStore";
import { ExpoIcons } from "@/components/ui/flexible-icon";

export default function LoginScreen() {
  // Zustand stores
  const {
    email,
    password,
    showPassword,
    emailError,
    passwordError,
    rememberMe,
    setEmail,
    setPassword,
    setShowPassword,
    setRememberMe,
    validateForm,
    setSubmitting,
  } = useLoginFormStore();

  // Password reset store
  const {
    resetEmail,
    isBottomSheetVisible,
    loading: resetLoading,
    error: resetError,
    success: resetSuccess,
    successMessage,
    setResetEmail,
    openBottomSheet,
    closeBottomSheet,
    submitPasswordReset,
  } = usePasswordResetStore();

  // Remove local state - now managed by password reset store

  const { login, loading, error, clearError, loadSavedCredentials } =
    useAuthStore();

  // Load saved credentials on component mount using store method
  useEffect(() => {
    const loadCredentials = async () => {
      const savedCredentials = await loadSavedCredentials();
      if (savedCredentials?.email) {
        setEmail(savedCredentials.email);
        setRememberMe(savedCredentials.rememberMe || false);
      }
    };

    loadCredentials();
  }, [setEmail, setRememberMe, loadSavedCredentials]);

  // Standardized error handling - all through stores
  const handleLogin = async () => {
    setSubmitting(true);
    clearError();

    // Validate form using store method
    const isValid = await validateForm();
    if (!isValid) {
      setSubmitting(false);
      return;
    }

    // Attempt login with remember me handled by store
    const result = await login(email, password, rememberMe);
    setSubmitting(false);

    if (result.success) {
      // All error handling is now managed by the store
      router.replace("../(tabs)/" as any);
    }
    // Errors are handled by the store automatically
  };

  const handleForgotPassword = async () => {
    const result = await submitPasswordReset();
    if (result.success) {
      // Keep bottom sheet open to show success message
    }
  };

  return (
    <View
      style={{
        flex: 1,
        padding: 20,
      }}
    >
      {/* Main Content - Centered */}
      <View style={{ flex: 1, justifyContent: "center" }}>
        {/* Header */}
        <View
          style={{
            justifyContent: "center",
            alignItems: "center",
            marginBottom: 40,
          }}
        >
          <Text variant="heading" style={{ marginBottom: 10 }}>
            Welcome
          </Text>
          <Text variant="caption">
            Please enter your credentials to continue.
          </Text>
        </View>

        {/* Error Message */}
        {error && (
          <View style={styles.errorContainer}>
            <AlertCircle size={18} color="#dc2626" style={{ marginRight: 8 }} />
            <Text style={styles.errorText}>{error}</Text>
          </View>
        )}

        {/* Form Inputs */}
        <View style={{ gap: 16 }}>
          <Input
            variant="outline"
            placeholder="Enter your email"
            value={email}
            onChangeText={setEmail}
            autoComplete="email"
            keyboardType="email-address"
            error={emailError}
            editable={!loading}
          />

          <Input
            variant="outline"
            placeholder="Enter your password"
            value={password}
            onChangeText={setPassword}
            error={passwordError}
            keyboardType="visible-password"
            secureTextEntry={!showPassword}
            editable={!loading}
            rightComponent={
              <Pressable onPress={() => setShowPassword(!showPassword)}>
                {showPassword ? (
                  <Eye size={22} color="#888" />
                ) : (
                  <EyeOff size={22} color="#888" />
                )}
              </Pressable>
            }
          />
        </View>

        {/* Options */}
        <View
          style={{
            marginTop: 8,
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Checkbox
            checked={rememberMe}
            onCheckedChange={setRememberMe}
            label="Remember me"
            labelStyle={{ fontSize: 16 }}
          />

          <Pressable onPress={openBottomSheet}>
            <Text
              variant="caption"
              style={{ textAlign: "right", fontSize: 15 }}
            >
              Forgot Password?
            </Text>
          </Pressable>

          {/* Forgot Password Bottom Sheet */}
          <ForgotPasswordBottomSheet
            isVisible={isBottomSheetVisible}
            onClose={closeBottomSheet}
            resetEmail={resetEmail}
            onResetEmailChange={setResetEmail}
            onSubmit={handleForgotPassword}
            loading={resetLoading}
            error={resetError}
            success={resetSuccess}
            successMessage={successMessage}
          />
        </View>

        {/* Login Button */}
        <Button
          style={{ marginTop: 30, marginBottom: 30 }}
          onPress={handleLogin}
          disabled={loading}
        >
          {loading ? "Logging in..." : "Login"}
        </Button>

        {/* Separator */}
        <View style={styles.separatorContainer}>
          <View style={styles.separatorLine} />
          <Text style={styles.separatorText}>Or continue with</Text>
          <View style={styles.separatorLine} />
        </View>

        {/* Social Login Buttons */}
        <View style={{ flexDirection: 'row', gap: 12 }}>
          <Button
            flexibleIcon={ExpoIcons.fontAwesome("google")}
            variant="outline"
            style={{ flex: 1 }}
          >
            Google
          </Button>
          <Button
            flexibleIcon={ExpoIcons.fontAwesome("apple")}
            variant="outline"
            style={{ flex: 1 }}
          >
            Apple
          </Button>
        </View>
      </View>

      {/* Sign Up Link */}
      <View style={styles.signupContainer}>
        <View style={{ flexDirection: "row" }}>
          <Text style={{ fontSize: 15 }}>Don&apos;t have an account? </Text>
          <Pressable onPress={() => router.push("/(auth)/signup")}>
            <Text variant="link" style={{ fontSize: 15 }}>
              Sign Up
            </Text>
          </Pressable>
        </View>
      </View>

      <AvoidKeyboard />
    </View>
  );
}

const styles = StyleSheet.create({
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
  errorContainer: {
    backgroundColor: "#fee2e2",
    borderRadius: 8,
    padding: 15,
    marginBottom: 16,
    flexDirection: "row",
    alignItems: "center",
  },
  errorText: {
    color: "#dc2626",
    fontSize: 14,
    fontWeight: "500",
  },
  signupContainer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    alignItems: "center",
    paddingBottom: 40,
    backgroundColor: "white",
  },
});
