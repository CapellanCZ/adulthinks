import React from 'react';
import { StyleSheet, TextInput, TextInputProps } from 'react-native';
import { View } from '@/components/ui/view';
import { Text } from '@/components/ui/text';
import { useThemeColor } from '@/hooks/useThemeColor';

interface AddressInputProps extends Omit<TextInputProps, 'style'> {
  label?: string;
  error?: string;
  required?: boolean;
  helpText?: string;
}

export const AddressInput: React.FC<AddressInputProps> = ({
  label,
  error,
  required = false,
  helpText,
  ...textInputProps
}) => {
  const textColor = useThemeColor({}, 'text');
  const borderColor = useThemeColor({}, 'border');
  const backgroundColor = useThemeColor({}, 'background');

  const styles = StyleSheet.create({
    container: {
      marginBottom: 4,
    },
    label: {
      fontSize: 14,
      fontWeight: '500',
      color: textColor,
      marginBottom: 8,
    },
    requiredIndicator: {
      color: '#FF6B6B',
    },
    input: {
      borderWidth: 1,
      borderColor: error ? '#FF6B6B' : borderColor,
      borderRadius: 8,
      paddingHorizontal: 12,
      paddingVertical: 12,
      fontSize: 16,
      color: textColor,
      backgroundColor: backgroundColor,
    },
    errorText: {
      fontSize: 12,
      color: '#FF6B6B',
      marginTop: 4,
    },
    helpText: {
      fontSize: 12,
      color: textColor,
      opacity: 0.6,
      marginTop: 4,
    },
  });

  return (
    <View style={styles.container}>
      {label && (
        <Text style={styles.label}>
          {label} {required && <Text style={styles.requiredIndicator}>*</Text>}
        </Text>
      )}
      <TextInput
        style={styles.input}
        placeholderTextColor={`${textColor}80`}
        {...textInputProps}
      />
      {error && <Text style={styles.errorText}>{error}</Text>}
      {helpText && !error && <Text style={styles.helpText}>{helpText}</Text>}
    </View>
  );
};

export default AddressInput;