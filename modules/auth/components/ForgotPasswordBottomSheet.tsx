import React, { useState } from 'react';
import { Mail, CheckCircle } from 'lucide-react-native';
import { useColorScheme, View } from 'react-native';
import * as yup from 'yup';

import { BottomSheet } from '@/components/ui/bottom-sheet';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Text } from '@/components/ui/text';
import { View as UIView } from '@/components/ui/view';
import Forgot from '@/assets/svg/forgot'
import { theme } from '../styles/signupStyles';

// Yup validation schema
const forgotPasswordSchema = yup.object().shape({
  email: yup
    .string()
    .email('Please enter a valid email address')
    .required('Email is required'),
});

interface ForgotPasswordBottomSheetProps {
  isVisible: boolean;
  onClose: () => void;
  resetEmail: string;
  onResetEmailChange: (email: string) => void;
  onSubmit: () => Promise<void>;
  loading: boolean;
  error: string | null;
  success: boolean;
  successMessage: string | null;
}

export const ForgotPasswordBottomSheet: React.FC<ForgotPasswordBottomSheetProps> = ({
  isVisible,
  onClose,
  resetEmail,
  onResetEmailChange,
  onSubmit,
  loading,
  error,
  success,
  successMessage,
}) => {
  const [validationError, setValidationError] = useState<string | null>(null);

  const handleEmailChange = (email: string) => {
    onResetEmailChange(email);
    // Clear validation error when user types
    if (validationError) {
      setValidationError(null);
    }
  };

  const handleSubmit = async () => {
    try {
      // Validate email using Yup schema
      await forgotPasswordSchema.validate({ email: resetEmail });
      setValidationError(null);
      
      // If validation passes, call the original onSubmit
      await onSubmit();
    } catch (validationErr) {
      if (validationErr instanceof yup.ValidationError) {
        setValidationError(validationErr.message);
      }
    }
  };

  // Determine which error to show (validation error takes priority)
  const displayError = validationError || error;
  const colors = theme.getThemeColors(useColorScheme());

  return (
    <BottomSheet
      isVisible={isVisible}
      onClose={onClose}
      snapPoints={[0.6]}
      style={{ padding: 5 }}
    >
      <UIView
        style={{
          justifyContent: "center",
          alignItems: "center",
          marginBottom: 25,
        }}
      >
        <Forgot 
          width={150}
          height={150}
        />
        <Text variant="heading" style={{ marginBottom: 10 }}>
          Forgot Password?
        </Text>
        <Text
          variant="caption"
          style={{ textAlign: "center", fontSize: 15 }}
        >
          Please enter your registered email address below. If you
          don&apos;t receive an email, please check your spam folder.
        </Text>
      </UIView>

      <Input
        variant="outline"
        placeholder="Email"
        icon={Mail}
        value={resetEmail}
        onChangeText={handleEmailChange}
        onSubmitEditing={handleSubmit}
        error={displayError || undefined}
      />

      {/* Show success message */}
      {success && successMessage && (
        <View
          style={{
            marginTop: 8,
            padding: 15,
            backgroundColor: "#dcfce7",
            borderRadius: 8,
            flexDirection: "row",
            alignItems: "center",
          }}
        >
          <CheckCircle
            size={16}
            color="#16a34a"
            style={{ marginRight: 8 }}
          />
          <Text
            style={{
              color: "#16a34a",
              fontSize: 14,
              flex: 1,
            }}
          >
            {successMessage}
          </Text>
        </View>
      )}

      <Button
        style={{ marginTop: 15 }}
        onPress={handleSubmit}
        disabled={loading}
      >
        {loading ? "Sending..." : "Send Reset Link"}
      </Button>
      
      <View style={{ marginTop: 20 }}>
        <Text
          variant="caption"
          style={{ textAlign: "center", fontSize: 15 }}
        >
          Remembered your password?{" "}
          <Text style={{ color: `${colors.primary}`, fontSize:15 }} onPress={onClose}>
            Login
          </Text>
        </Text>
      </View>
    </BottomSheet>
  );
};