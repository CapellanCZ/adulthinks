import React from "react";
import { StyleSheet } from "react-native";
import { Mail, Check } from "lucide-react-native";
import { BottomSheet } from "@/components/ui/bottom-sheet";
import { Button } from "@/components/ui/button";
import { Text } from "@/components/ui/text";
import { View } from "@/components/ui/view";

interface SignupSuccessBottomSheetProps {
  isVisible: boolean;
  onClose: () => void;
  onContinue: () => void;
  email?: string;
}

export const SignupSuccessBottomSheet: React.FC<SignupSuccessBottomSheetProps> = ({
  isVisible,
  onClose,
  onContinue,
  email,
}) => {
  return (
    <BottomSheet
      isVisible={isVisible}
      onClose={onClose}
      snapPoints={[0.6]}
      enableBackdropDismiss={false}
      disablePanGesture={true}
    >
      <View style={styles.outerContainer}>
        <View style={styles.container}>
          {/* Email Icon */}
          <View style={styles.iconContainer}>
            <Check size={48}  />
          </View>

          {/* Success Message */}
          <View style={styles.messageContainer}>
            <Text variant="heading" style={styles.title}>
              Register Success!
            </Text>
            <Text variant="body" style={styles.subtitle}>
              We've sent a confirmation link to verify your account. Please check your email.
            </Text>
            
            {email && (
              <View style={styles.emailContainer}>
                <Mail size={20} color="#6b7280" style={styles.emailIcon} />
                <Text style={styles.emailText}>{email}</Text>
              </View>
            )}
            
            {/* <Text variant="body" style={styles.description}>
              Please check your inbox and click the confirmation link to activate your account. Don't forget to check your spam folder!
            </Text> */}
          </View>

          {/* Action Buttons */}
          <View style={styles.buttonContainer}>
            <Button
              onPress={onContinue}
              style={styles.continueButton}
              accessibilityLabel="Go to login"
              accessibilityHint="Navigate to login screen to sign in after email verification"
            >
              Continue
            </Button>
            
            <Button
              variant="outline"
              onPress={onClose}
              style={styles.laterButton}
              accessibilityLabel="I'll verify later"
              accessibilityHint="Closes this dialog and stays on signup screen"
            >
              I'll verify later
            </Button>
          </View>
        </View>
      </View>
    </BottomSheet>
  );
};

const styles = StyleSheet.create({
  outerContainer: {
    flex: 1,
    padding: 16,
    backgroundColor: "#ffffff",
  },
  container: {
    alignItems: "center",
    paddingHorizontal: 10,
  },
  iconContainer: {
    marginBottom: 24,
    padding: 16,
    backgroundColor: "#f8fafc",
    borderRadius: 50,
  },
  messageContainer: {
    alignItems: "center",
    marginBottom: 5,
    width: "100%",
  },
  title: {
    textAlign: "center",
    marginBottom: 8,
    color: "#1f2937",
    fontSize: 24,
    fontWeight: "700",
  },
  subtitle: {
    textAlign: "center",
    marginBottom: 15,
    color: "#6b7280",
    fontSize: 16,
    lineHeight: 24,
  },
  emailContainer: {
    backgroundColor: "#f8fafc",
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 16,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: "#e2e8f0",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
  },
  emailIcon: {
    marginRight: 12,
    flexShrink: 0,
  },
  emailText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1e293b",
    flex: 1,
  },
  description: {
    textAlign: "center",
    lineHeight: 22,
    color: "#6b7280",
    fontSize: 14,
  },
  buttonContainer: {
    width: "100%",
    gap: 12,
  },
  continueButton: {
    // backgroundColor: "#22c55e",
  },
  laterButton: {
    borderColor: "#d1d5db",
  },
});
