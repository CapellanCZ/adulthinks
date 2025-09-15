import React from "react";
import { Alert, Pressable, StyleSheet } from "react-native";
import { ProgressStep, ProgressSteps } from "react-native-progress-steps";
import { SafeAreaView } from "react-native-safe-area-context";

import { Button } from "@/components/ui/button";
import { DatePicker } from "@/components/ui/date-picker";
import { Input } from "@/components/ui/input";
import { Picker } from "@/components/ui/picker";
import { Separator } from "@/components/ui/separator";
import { Text } from "@/components/ui/text";
import { View } from "@/components/ui/view";
import { useSignupFormStore } from "@/stores/useSignupFormStore";

import type { UserAddress } from "@/modules/userAddress/types/AddressTypes";
export default function SignupScreen() {
  // Store hooks for managing form state
  const {
    activeStep,
    accountData,
    personalData,
    submitError,
    setAccountData,
    setPersonalData,
    setAddressData,
    validateAccountStep,
    validatePersonalStep,
    submitSignupForm,
  } = useSignupFormStore();

  const sexOptions = [
    { label: "Male", value: "male" },
    { label: "Female", value: "female" },
    { label: "Other", value: "other" },
  ];

  // Handle address completion
  const handleAddressComplete = (address: UserAddress) => {
    setAddressData(address);
    console.log("Address completed:", address);

    // Automatically submit the form or navigate to success
    if (validateAccountStep() && validatePersonalStep() && address) {
      submitSignupForm();
    }
  };

  // Handle address step back navigation
  const handleAddressBack = () => {
    // Could go back to personal step if needed
    console.log("Address step back pressed");
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      {submitError && (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{submitError}</Text>
        </View>
      )}
    
      <View style={{ flex: 1 }}>
        <ProgressSteps activeStep={activeStep} >
          <ProgressStep label="Account" buttonNextText="Continue">
            <View style={{ marginBottom: 25, alignItems: "center", gap: 10 }}>
              <Text variant="heading">Create Account</Text>
              <Text variant="caption" style={{ textAlign: "center" }}>
                Follow the steps to complete your registration and to get you
                started.
              </Text>
              <Separator style={{ marginTop: 15, opacity: 0.5 }} />
            </View>
            <View style={styles.progressStepContainer}>
              <Input
                variant="outline"
                placeholder="Enter your email"
                value={accountData.email}
                onChangeText={(email) => setAccountData({ email })}
                keyboardType="email-address"
                autoCapitalize="none"
              />
              <Input
                variant="outline"
                placeholder="Enter your password"
                value={accountData.password}
                onChangeText={(password) => setAccountData({ password })}
                secureTextEntry
              />
              <Input
                variant="outline"
                placeholder="Confirm your password"
                value={accountData.confirmPassword}
                onChangeText={(confirmPassword) =>
                  setAccountData({ confirmPassword })
                }
                secureTextEntry
              />

              {/* Validation hints */}
              {accountData.password && accountData.password.length < 8 ? (
                <Text style={styles.hintText}>
                  Password must be at least 8 characters
                </Text>
              ) : null}
              {accountData.password &&
              accountData.confirmPassword &&
              accountData.password !== accountData.confirmPassword ? (
                <Text style={styles.hintText}>Passwords do not match</Text>
              ) : null}
            </View>
            <View style={{ marginTop: 15, paddingHorizontal: 5, opacity: 0.7 }}>
              <Text
                style={{ textAlign: "center", fontSize: 12, color: "#666" }}
              >
                By clicking &quot;Continue...&quot; you agree to
                <Text style={{ fontSize: 12, color: "#666" }}> our </Text>
                <Pressable>
                  <Text
                    variant="link"
                    style={{ fontSize: 12, color: "#585858ff" }}
                  >
                    Terms & Conditions
                  </Text>
                </Pressable>
                <Text style={{ fontSize: 12, color: "#666" }}> and </Text>
                <Pressable>
                  <Text
                    variant="link"
                    style={{ fontSize: 12, color: "#585858ff" }}
                  >
                    Privacy Policy
                  </Text>
                </Pressable>
              </Text>
            </View>
          </ProgressStep>

          <ProgressStep label="Personal">
            <View style={{ marginBottom: 25, alignItems: "center", gap: 10 }}>
              <Text variant="heading">About You</Text>
              <Text variant="caption" style={{ textAlign: "center" }}>
                We need some basic information about yourself.
              </Text>
              <Separator style={{ marginTop: 15, opacity: 0.5 }} />
            </View>
            <View style={styles.progressStepContainer}>
              <Input
                variant="outline"
                placeholder="Enter your first name"
                value={personalData.firstName}
                onChangeText={(firstName) => setPersonalData({ firstName })}
                autoCapitalize="words"
              />
              <Input
                variant="outline"
                placeholder="Enter your last name"
                value={personalData.lastName}
                onChangeText={(lastName) => setPersonalData({ lastName })}
                autoCapitalize="words"
              />
              <Input
                variant="outline"
                placeholder="Enter your middle name (optional)"
                value={personalData.middleName}
                onChangeText={(middleName) => setPersonalData({ middleName })}
                autoCapitalize="words"
              />
              <Picker
                variant="outline"
                options={sexOptions}
                placeholder="Select your gender..."
                value={personalData.gender}
                onValueChange={(gender) => setPersonalData({ gender })}
              />
              <DatePicker
                variant="outline"
                label="Birthdate"
                value={personalData.birthdate}
                onChange={(birthdate) => setPersonalData({ birthdate })}
                placeholder="Choose your birthdate"
              />
            </View>
          </ProgressStep>

          <ProgressStep label="Address">
            <View style={{ marginBottom: 25, alignItems: "center", gap: 10 }}>
              <Text variant="heading">Set Your Address</Text>
              <Text variant="caption" style={{ textAlign: "center" }}>
                Detailed address information helps us serve you better.
              </Text>
              <Separator style={{ marginTop: 15, opacity: 0.5 }} />
            </View>
            <View style={styles.progressStepContainer}>
              <Input variant="outline" placeholder="House/Building Number" />
              <Input variant="outline" placeholder="Street Name" />
              <Input variant="outline" placeholder="Subdivision/Village" />
              <Picker
                variant="outline"
                placeholder="Select your barangay..."
                onValueChange={(barangay) => setAddressData({ barangay })}
              />
              <Picker
                variant="outline"
                placeholder="Select your city/municipality..."
                onValueChange={(city) => setAddressData({ city })}
              />
              <Input variant="outline" placeholder="Zip Code" />
            </View>
          </ProgressStep>
        </ProgressSteps>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  progressStepContainer: {
    alignItems: "center",
    gap: 16,
  },
  addressStepContainer: {
    flex: 1,
    paddingHorizontal: 0, // AddressStep manages its own padding
  },
  errorContainer: {
    backgroundColor: "#ffebee",
    padding: 12,
    marginHorizontal: 20,
    marginBottom: 10,
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: "#f44336",
  },
  errorText: {
    color: "#c62828",
    fontSize: 14,
    fontWeight: "500",
  },
  hintText: {
    fontSize: 12,
    color: "#666",
    fontStyle: "italic",
    textAlign: "center",
  },
});
