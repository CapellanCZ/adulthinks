import React from 'react';
import { StyleSheet, TouchableOpacity, Modal, FlatList } from 'react-native';
import { View } from '@/components/ui/view';
import { Text } from '@/components/ui/text';
import { useThemeColor } from '@/hooks/useThemeColor';

interface SelectOption {
  label: string;
  value: string;
}

interface AddressSelectProps {
  value: string;
  onValueChange: (value: string) => void;
  options: SelectOption[];
  placeholder?: string;
  label?: string;
  error?: string;
  required?: boolean;
  disabled?: boolean;
}

export const AddressSelect: React.FC<AddressSelectProps> = ({
  value,
  onValueChange,
  options,
  placeholder = 'Select an option',
  label,
  error,
  required = false,
  disabled = false,
}) => {
  const [isOpen, setIsOpen] = React.useState(false);
  
  const textColor = useThemeColor({}, 'text');
  const borderColor = useThemeColor({}, 'border');
  const backgroundColor = useThemeColor({}, 'background');

  const selectedOption = options.find(option => option.value === value);

  const handleSelect = (selectedValue: string) => {
    onValueChange(selectedValue);
    setIsOpen(false);
  };

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
    selector: {
      borderWidth: 1,
      borderColor: error ? '#FF6B6B' : borderColor,
      borderRadius: 8,
      paddingHorizontal: 12,
      paddingVertical: 12,
      backgroundColor: backgroundColor,
      opacity: disabled ? 0.5 : 1,
    },
    selectorText: {
      fontSize: 16,
      color: selectedOption ? textColor : `${textColor}80`,
    },
    arrow: {
      position: 'absolute',
      right: 12,
      top: 12,
      fontSize: 16,
      color: textColor,
    },
    errorText: {
      fontSize: 12,
      color: '#FF6B6B',
      marginTop: 4,
    },
    modal: {
      flex: 1,
      backgroundColor: 'rgba(0,0,0,0.5)',
      justifyContent: 'center',
      alignItems: 'center',
    },
    modalContent: {
      backgroundColor: backgroundColor,
      borderRadius: 12,
      maxHeight: 400,
      width: '90%',
      maxWidth: 400,
    },
    modalHeader: {
      padding: 16,
      borderBottomWidth: 1,
      borderBottomColor: borderColor,
    },
    modalTitle: {
      fontSize: 18,
      fontWeight: '600',
      color: textColor,
      textAlign: 'center',
    },
    optionsList: {
      maxHeight: 300,
    },
    option: {
      padding: 16,
      borderBottomWidth: 1,
      borderBottomColor: borderColor,
    },
    selectedOption: {
      backgroundColor: `${borderColor}40`,
    },
    optionText: {
      fontSize: 16,
      color: textColor,
    },
    selectedOptionText: {
      fontWeight: '600',
    },
    cancelButton: {
      padding: 16,
      alignItems: 'center',
    },
    cancelButtonText: {
      fontSize: 16,
      color: '#FF6B6B',
      fontWeight: '500',
    },
  });

  return (
    <View style={styles.container}>
      {label && (
        <Text style={styles.label}>
          {label} {required && <Text style={styles.requiredIndicator}>*</Text>}
        </Text>
      )}
      
      <TouchableOpacity
        style={styles.selector}
        onPress={() => !disabled && setIsOpen(true)}
        disabled={disabled}
      >
        <Text style={styles.selectorText}>
          {selectedOption ? selectedOption.label : placeholder}
        </Text>
        <Text style={styles.arrow}>▼</Text>
      </TouchableOpacity>

      {error && <Text style={styles.errorText}>{error}</Text>}

      <Modal
        visible={isOpen}
        transparent
        animationType="fade"
        onRequestClose={() => setIsOpen(false)}
      >
        <TouchableOpacity
          style={styles.modal}
          activeOpacity={1}
          onPress={() => setIsOpen(false)}
        >
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>
                {label || 'Select an option'}
              </Text>
            </View>
            
            <FlatList
              data={options}
              style={styles.optionsList}
              keyExtractor={(item) => item.value}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={[
                    styles.option,
                    item.value === value && styles.selectedOption,
                  ]}
                  onPress={() => handleSelect(item.value)}
                >
                  <Text
                    style={[
                      styles.optionText,
                      item.value === value && styles.selectedOptionText,
                    ]}
                  >
                    {item.label}
                  </Text>
                </TouchableOpacity>
              )}
            />
            
            <TouchableOpacity
              style={styles.cancelButton}
              onPress={() => setIsOpen(false)}
            >
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
};

export default AddressSelect;