import React, { useCallback } from "react";
import { Pressable, StyleSheet, useColorScheme } from "react-native";
import { Eye, EyeOff } from "lucide-react-native";
import { Input } from "@/components/ui/input";
import { View } from "@/components/ui/view";
import { SignupFormData, SignupFormErrors } from "../../store/useSignupFormStore";
import { theme } from "../../styles/signupStyles";

interface SignupFormFieldsProps {
  formData: SignupFormData;
  errors: SignupFormErrors;
  showPassword: boolean;
  showConfirmPassword: boolean;
  loading?: boolean;
  onFieldChange: (field: keyof SignupFormData, value: string) => void;
  onFieldBlur: (field: keyof SignupFormData) => void;
  onTogglePasswordVisibility: () => void;
  onToggleConfirmPasswordVisibility: () => void;
  onClearError: (field: keyof SignupFormErrors) => void;
}

export const SignupFormFields: React.FC<SignupFormFieldsProps> = ({
  formData,
  errors,
  showPassword,
  showConfirmPassword,
  loading = false,
  onFieldChange,
  onFieldBlur,
  onTogglePasswordVisibility,
  onToggleConfirmPasswordVisibility,
  onClearError,
}) => {
  const colorScheme = useColorScheme();
  const colors = theme.getThemeColors(colorScheme);
  // Memoized field handlers
  const handleEmailChange = useCallback((text: string) => {
    onFieldChange("email", text.trim().toLowerCase());
  }, [onFieldChange]);

  const handleEmailBlur = useCallback(() => {
    onFieldBlur("email");
  }, [onFieldBlur]);

  const handleEmailFocus = useCallback(() => {
    onClearError("email");
  }, [onClearError]);

  const handlePasswordChange = useCallback((text: string) => {
    onFieldChange("password", text);
  }, [onFieldChange]);

  const handlePasswordBlur = useCallback(() => {
    onFieldBlur("password");
  }, [onFieldBlur]);

  const handlePasswordFocus = useCallback(() => {
    onClearError("password");
  }, [onClearError]);

  const handleConfirmPasswordChange = useCallback((text: string) => {
    onFieldChange("confirmPassword", text);
  }, [onFieldChange]);

  const handleConfirmPasswordBlur = useCallback(() => {
    onFieldBlur("confirmPassword");
  }, [onFieldBlur]);

  const handleConfirmPasswordFocus = useCallback(() => {
    onClearError("confirmPassword");
  }, [onClearError]);

  return (
    <View style={styles.container}>
      {/* Email Field */}
      <View style={styles.fieldContainer}>
        <Input
          variant="outline"
          placeholder="Enter your email"
          value={formData.email}
          onChangeText={handleEmailChange}
          onBlur={handleEmailBlur}
          onFocus={handleEmailFocus}
          autoComplete="email"
          keyboardType="email-address"
          autoCapitalize="none"
          textContentType="emailAddress"
          accessibilityLabel="Email address"
          accessibilityHint="Enter your email address for account registration"
          error={errors.email}
          editable={!loading}
        />
      </View>

      {/* Password Field */}
      <View style={styles.fieldContainer}>
        <Input
          variant="outline"
          placeholder="Enter your password"
          value={formData.password}
          onChangeText={handlePasswordChange}
          onBlur={handlePasswordBlur}
          onFocus={handlePasswordFocus}
          secureTextEntry={!showPassword}
          textContentType="newPassword"
          autoComplete="password-new"
          accessibilityLabel="Password"
          accessibilityHint="Enter a secure password for your account"
          error={errors.password}
          editable={!loading}
          rightComponent={
            <Pressable
              onPress={onTogglePasswordVisibility}
              accessibilityRole="button"
              accessibilityLabel={showPassword ? "Hide password" : "Show password"}
              accessibilityHint="Toggles password visibility"
              style={styles.eyeButton}
            >
              {showPassword ? (
                <Eye size={22} color={colors.icon} />
              ) : (
                <EyeOff size={22} color={colors.icon} />
              )}
            </Pressable>
          }
        />
      </View>

      {/* Confirm Password Field */}
      <View style={styles.fieldContainer}>
        <Input
          variant="outline"
          placeholder="Confirm your password"
          value={formData.confirmPassword}
          onChangeText={handleConfirmPasswordChange}
          onBlur={handleConfirmPasswordBlur}
          onFocus={handleConfirmPasswordFocus}
          secureTextEntry={!showConfirmPassword}
          textContentType="newPassword"
          autoComplete="password-new"
          accessibilityLabel="Confirm password"
          accessibilityHint="Re-enter your password to confirm"
          error={errors.confirmPassword}
          editable={!loading}
          rightComponent={
            <Pressable
              onPress={onToggleConfirmPasswordVisibility}
              accessibilityRole="button"
              accessibilityLabel={showConfirmPassword ? "Hide confirm password" : "Show confirm password"}
              accessibilityHint="Toggles confirm password visibility"
              style={styles.eyeButton}
            >
              {showConfirmPassword ? (
                <Eye size={22} color={colors.icon} />
              ) : (
                <EyeOff size={22} color={colors.icon} />
              )}
            </Pressable>
          }
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    gap: 16,
  },
  fieldContainer: {
    gap: 8,
  },
  eyeButton: {
    padding: 4,
  },
});
