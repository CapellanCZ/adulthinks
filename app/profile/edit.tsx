import React, { useCallback, useMemo, useState } from 'react';
import { Pressable, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Icon } from '@/components/ui/icon';
import { Input } from '@/components/ui/input';
import { ScrollView } from '@/components/ui/scroll-view';
import { Text } from '@/components/ui/text';
import { View } from '@/components/ui/view';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useThemeColor } from '@/hooks/useThemeColor';
import { Button } from '@/components/ui/button';
import { PencilLine } from 'lucide-react-native';

export default function EditProfileScreen() {
  const primary = useThemeColor({}, 'primary');
  const border = useThemeColor({}, 'border');
  const card = useThemeColor({}, 'card');

  const [avatarUri, setAvatarUri] = useState<string | undefined>(
    'https://avatars.githubusercontent.com/u/99088394?v=4'
  );
  const [firstName, setFirstName] = useState('Wilson');
  const [lastName, setLastName] = useState('Jenny');
  const [email, setEmail] = useState('wilsonjennyl@gmail.com');
  const [phone, setPhone] = useState('');

  const initials = useMemo(() => {
    const f = firstName?.[0] ?? '';
    const l = lastName?.[0] ?? '';
    return (f + l).toUpperCase();
  }, [firstName, lastName]);

  const handlePickImage = useCallback(async () => {
    try {
      const ImagePicker = await import('expo-image-picker');
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        console.warn('Permission to access photos was denied');
        return;
      }
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.85,
      });
      if (!result.canceled && result.assets?.length) {
        setAvatarUri(result.assets[0].uri);
      }
    } catch (e) {
      console.error('pick image error', e);
    }
  }, []);

  const handleSave = useCallback(() => {
    // TODO: persist via API later
    console.log('Save changes');
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.title}>Edit profile</Text>

        <View style={styles.avatarBlock}>
          <View style={styles.avatarWrapper}>
            <Avatar size={112} style={{ backgroundColor: card, borderColor: border, borderWidth: 1 }}>
              <AvatarImage source={{ uri: avatarUri }} />
              <AvatarFallback>{initials}</AvatarFallback>
            </Avatar>

            <Pressable
              onPress={handlePickImage}
              accessibilityRole="button"
              accessibilityLabel="Change profile photo"
              style={({ pressed }) => [
                styles.editIconButton,
                { backgroundColor: primary, opacity: pressed ? 0.8 : 1 },
              ]}
            >
              <Icon name={PencilLine} color={'#fff'} size={18} />
            </Pressable>
          </View>
        </View>

        <View style={styles.fields}>
          <View style={styles.groupRow}>
            <Input
              placeholder="First name"
              value={firstName}
              onChangeText={setFirstName}
              containerStyle={styles.input}
            />
            <Input
              placeholder="Last name"
              value={lastName}
              onChangeText={setLastName}
              containerStyle={styles.input}
            />
          </View>

          <Input
            placeholder="Email"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            containerStyle={styles.singleInput}
          />

          <View style={styles.groupRow}>
            <Input
              placeholder="+44"
              value={'+44'}
              editable={false}
              containerStyle={styles.codeInput}
            />
            <Input
              placeholder="Phone"
              value={phone}
              onChangeText={setPhone}
              keyboardType="phone-pad"
              containerStyle={styles.input}
            />
          </View>

          <Button style={styles.saveButton} onPress={handleSave}>
            Save Changes
          </Button>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    paddingHorizontal: 20,
  },
  contentContainer: {
    paddingBottom: 24,
  },
  title: {
    textAlign: 'center',
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 18,
  },
  avatarBlock: {
    alignItems: 'center',
    marginBottom: 28,
  },
  avatarWrapper: {
    position: 'relative',
  },
  editIconButton: {
    position: 'absolute',
    right: -4,
    bottom: -4,
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#fff',
  },
  groupRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 12,
  },
  input: {
    flex: 1,
  },
  codeInput: {
    width: 96,
  },
  singleInput: {
    marginBottom: 12,
  },
  fields: {
    marginTop: 8,
  },
  saveButton: {
    marginTop: 12,
    height: 48,
    borderRadius: 12,
  },
});


