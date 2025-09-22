import React from "react";
import { Pressable, StyleSheet } from "react-native";
import { Eye, EyeOff } from "lucide-react-native";
import { Input } from "@/components/ui/input";
import { Text } from "@/components/ui/text";
import { View } from "@/components/ui/view";
import { SignupFormData, SignupFormErrors } from "../../store/useSignupFormStore";

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
  return (
    <View style={styles.container}>
      {/* Email Field */}
      <View style={styles.fieldContainer}>
        <Input
          variant="outline"
          placeholder="Enter your email"
          value={formData.email}
          onChangeText={(text) => onFieldChange("email", text)}
          onBlur={() => onFieldBlur("email")}
          onFocus={() => onClearError("email")}
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
          onChangeText={(text) => onFieldChange("password", text)}
          onBlur={() => onFieldBlur("password")}
          onFocus={() => onClearError("password")}
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
                <EyeOff size={22} color="#888" />
              ) : (
                <Eye size={22} color="#888" />
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
          onChangeText={(text) => onFieldChange("confirmPassword", text)}
          onBlur={() => onFieldBlur("confirmPassword")}
          onFocus={() => onClearError("confirmPassword")}
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
                <EyeOff size={22} color="#888" />
              ) : (
                <Eye size={22} color="#888" />
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
