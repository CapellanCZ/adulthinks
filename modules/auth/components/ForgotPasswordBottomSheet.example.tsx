/**
 * Example usage of ForgotPasswordBottomSheet with Yup validation
 * 
 * This file shows how the enhanced component works with validation
 */

import React from 'react';
import { ForgotPasswordBottomSheet } from './ForgotPasswordBottomSheet';

// Example usage in a parent component
export const ForgotPasswordExample = () => {
  // Mock state - in real usage, this would come from your store
  const [isVisible, setIsVisible] = React.useState(false);
  const [resetEmail, setResetEmail] = React.useState('');
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [success, setSuccess] = React.useState(false);
  const [successMessage, setSuccessMessage] = React.useState<string | null>(null);

  const handleSubmit = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Your API call here
      const response = await fetch('/api/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: resetEmail }),
      });

      if (!response.ok) {
        throw new Error('Failed to send reset email');
      }

      setSuccess(true);
      setSuccessMessage('Password reset email sent successfully!');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ForgotPasswordBottomSheet
      isVisible={isVisible}
      onClose={() => setIsVisible(false)}
      resetEmail={resetEmail}
      onResetEmailChange={setResetEmail}
      onSubmit={handleSubmit}
      loading={loading}
      error={error}
      success={success}
      successMessage={successMessage}
    />
  );
};

/**
 * Validation Features:
 * 
 * 1. Email Format Validation:
 *    - Ensures proper email format (user@domain.com)
 *    - Shows "Please enter a valid email address" for invalid formats
 * 
 * 2. Required Field Validation:
 *    - Prevents submission with empty email
 *    - Shows "Email is required" for empty field
 * 
 * 3. Real-time Validation:
 *    - Clears validation errors as user types
 *    - Validates on form submission
 *    - Shows validation errors immediately
 * 
 * 4. Error Prioritization:
 *    - Validation errors take priority over API errors
 *    - Clear separation between client-side and server-side errors
 * 
 * 5. User Experience:
 *    - Input shows error state when validation fails
 *    - Error messages are clear and actionable
 *    - Maintains all existing functionality
 */