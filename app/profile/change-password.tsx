import React, { useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Input } from '@/components/ui/input';
import { ScrollView } from '@/components/ui/scroll-view';
import { Text } from '@/components/ui/text';
import { View } from '@/components/ui/view';
import { Button } from '@/components/ui/button';
import { Lock } from 'lucide-react-native';

export default function ChangePasswordScreen() {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const newPasswordError =
    newPassword && newPassword.length < 6
      ? 'New password must be at least 6 characters'
      : '';

  const confirmPasswordError =
    confirmPassword && confirmPassword !== newPassword
      ? 'Passwords do not match'
      : '';

  const handleSavePassword = () => {
    // TODO: Implement password change logic
    console.log('Changing password...');
  };

  const isFormValid = currentPassword && newPassword && confirmPassword && 
    newPassword.length >= 6 && newPassword === confirmPassword;

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ScrollView
        style={{ paddingHorizontal: 20 }}
        contentContainerStyle={{ paddingVertical: 16 }}
        showsVerticalScrollIndicator={false}
      >
        <View style={{ gap: 16 }}>
          <Text variant="title" style={{ marginBottom: 8, textAlign: 'center' }}>
            Change Password
          </Text>
          
          <Text variant="body" style={{ textAlign: 'center', marginBottom: 24, opacity: 0.7 }}>
            Enter your current password and choose a new one
          </Text>

          <Input
            label="Current Password"
            placeholder="Enter your current password"
            icon={Lock}
            value={currentPassword}
            onChangeText={setCurrentPassword}
            secureTextEntry
          />
          
          <Input
            label="New Password"
            placeholder="Enter your new password"
            icon={Lock}
            value={newPassword}
            onChangeText={setNewPassword}
            error={newPasswordError}
            secureTextEntry
          />
          
          <Input
            label="Confirm Password"
            placeholder="Re-enter your new password"
            icon={Lock}
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            error={confirmPasswordError}
            secureTextEntry
          />

          <Button 
            style={{ marginTop: 16, height: 48, borderRadius: 12 }}
            onPress={handleSavePassword}
            disabled={!isFormValid}
          >
            Change Password
          </Button>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
