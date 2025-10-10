import React, { useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Button } from '@/components/ui/button';
import { GroupedInput, GroupedInputItem } from '@/components/ui/input';
import { ScrollView } from '@/components/ui/scroll-view';
import { Text } from '@/components/ui/text';
import { View } from '@/components/ui/view';
import { MapPin, Home, Globe } from 'lucide-react-native';

export default function AddressChangeScreen() {
  const [formData, setFormData] = useState({
    address: '',
    city: '',
    province: '',
    postalCode: '',
    country: 'Philippines',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.address) newErrors.address = 'Address is required';
    if (!formData.city) newErrors.city = 'City/Municipality is required';
    if (!formData.province) newErrors.province = 'Province is required';
    if (!formData.postalCode) newErrors.postalCode = 'ZIP code is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (validateForm()) {
      alert('Address updated successfully!');
    }
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ScrollView
        style={{ paddingHorizontal: 20 }}
        contentContainerStyle={{ paddingVertical: 16 }}
        showsVerticalScrollIndicator={false}
      >
        <View style={{ gap: 24 }}>
          <Text variant="title" style={{ marginBottom: 8, textAlign: 'center' }}>
            Change Address
          </Text>
          
          <Text variant="body" style={{ textAlign: 'center', marginBottom: 24, opacity: 0.7 }}>
            Update your current address information
          </Text>

          <GroupedInput title="Update Address">
            <GroupedInputItem
              label="Street Address"
              placeholder="123 Mabini St."
              icon={Home}
              value={formData.address}
              onChangeText={(text) =>
                setFormData((prev) => ({ ...prev, address: text }))
              }
              error={errors.address}
            />
            <GroupedInputItem
              label="City / Municipality"
              placeholder="Quezon City"
              icon={MapPin}
              value={formData.city}
              onChangeText={(text) =>
                setFormData((prev) => ({ ...prev, city: text }))
              }
              error={errors.city}
            />
            <GroupedInputItem
              label="Province"
              placeholder="Metro Manila"
              icon={MapPin}
              value={formData.province}
              onChangeText={(text) =>
                setFormData((prev) => ({ ...prev, province: text }))
              }
              error={errors.province}
            />
            <GroupedInputItem
              label="ZIP Code"
              placeholder="1100"
              icon={MapPin}
              value={formData.postalCode}
              onChangeText={(text) =>
                setFormData((prev) => ({ ...prev, postalCode: text }))
              }
              error={errors.postalCode}
            />
            <GroupedInputItem
              label="Country"
              placeholder="Philippines"
              icon={Globe}
              value={formData.country}
              onChangeText={(text) =>
                setFormData((prev) => ({ ...prev, country: text }))
              }
              editable={false}
            />
          </GroupedInput>

          <Button 
            style={{ marginTop: 16, height: 48, borderRadius: 12 }}
            onPress={handleSubmit}
          >
            Update Address
          </Button>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
