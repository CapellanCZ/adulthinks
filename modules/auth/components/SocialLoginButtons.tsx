import React from 'react';
import { Button } from '@/components/ui/button';
import { Text } from '@/components/ui/text';
import { View } from '@/components/ui/view';
import { ExpoIcons, FlexibleIcon } from '@/components/ui/flexible-icon';
import { useLoginStyles } from '../styles/loginStyles';

interface SocialLoginButtonsProps {
  onGooglePress: () => Promise<void>;
  onApplePress: () => Promise<void>;
  loading?: boolean;
  disabled?: boolean;
  variant?: 'login' | 'signup';
}

export function SocialLoginButtons({
  onGooglePress,
  onApplePress,
  loading = false,
  disabled = false,
  variant = 'login',
}: SocialLoginButtonsProps) {
  const actionText = variant === 'login' ? 'Sign in' : 'Sign up';
  const styles = useLoginStyles();

  return (
    <>
      {/* Separator */}
      <View style={styles.separatorContainer}>
        <View style={styles.separatorLine} />
        <Text style={styles.separatorText}>Or continue with</Text>
        <View style={styles.separatorLine} />
      </View>

      {/* Social Login Buttons */}
      <View style={styles.socialButtonContainer}>
        <Button 
          variant="outline" 
          style={styles.socialButton}
          onPress={onGooglePress}
          disabled={loading || disabled}
          accessibilityLabel={`${actionText} with Google`}
          accessibilityHint={`Tap to ${actionText.toLowerCase()} using your Google account`}
        >
          <FlexibleIcon 
            icon={ExpoIcons.fontAwesome("google")} 
            size={22}
          />
          <Text>Google</Text>
        </Button>
        
        <Button 
          variant="outline" 
          style={styles.socialButton}
          onPress={onApplePress}
          disabled={loading || disabled}
          accessibilityLabel={`${actionText} with Apple`}
          accessibilityHint={`Tap to ${actionText.toLowerCase()} using your Apple ID`}
        >
          <FlexibleIcon 
            icon={ExpoIcons.fontAwesome("apple")} 
            size={22}
          />
          <Text>Apple</Text>
        </Button>
      </View>
    </>
  );
}

