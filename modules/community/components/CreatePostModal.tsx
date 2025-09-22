import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Modal,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useColorScheme } from 'react-native';
import { useCommunityStyles } from '../styles/communityStyles';
import { useCommunityStore } from '../store/useCommunityStore';
import { createPostSchema } from '../validation/communitySchema';
import { CAVITE_ID_HASHTAGS } from './HashtagFilter';

interface CreatePostModalProps {
  visible: boolean;
  onClose: () => void;
}

export function CreatePostModal({ visible, onClose }: CreatePostModalProps) {
  const styles = useCommunityStyles();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  
  const [content, setContent] = useState('');
  const [selectedHashtags, setSelectedHashtags] = useState<string[]>([]);
  const [hashtagInput, setHashtagInput] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const { createPost } = useCommunityStore();

  function handleClose() {
    if (isSubmitting) return;
    
    setContent('');
    setSelectedHashtags([]);
    setHashtagInput('');
    onClose();
  }

  function addHashtag(hashtag: string) {
    const cleanHashtag = hashtag.toLowerCase().trim();
    
    if (cleanHashtag && !selectedHashtags.includes(cleanHashtag) && selectedHashtags.length < 5) {
      setSelectedHashtags([...selectedHashtags, cleanHashtag]);
    }
    setHashtagInput('');
  }

  function removeHashtag(hashtag: string) {
    setSelectedHashtags(selectedHashtags.filter(h => h !== hashtag));
  }

  function handleHashtagInputSubmit() {
    if (hashtagInput.trim()) {
      addHashtag(hashtagInput);
    }
  }

  function addPredefinedHashtag(hashtag: string) {
    if (!selectedHashtags.includes(hashtag) && selectedHashtags.length < 5) {
      setSelectedHashtags([...selectedHashtags, hashtag]);
    }
  }

  async function handleSubmit() {
    try {
      // Validate input
      await createPostSchema.validate({
        content: content.trim(),
        hashtags: selectedHashtags,
      });

      setIsSubmitting(true);
      
      await createPost({
        content: content.trim(),
        hashtags: selectedHashtags,
      });

      Alert.alert('Success', 'Post created successfully!');
      handleClose();
    } catch (error) {
      if (error instanceof Error) {
        Alert.alert('Error', error.message);
      } else {
        Alert.alert('Error', 'Failed to create post');
      }
    } finally {
      setIsSubmitting(false);
    }
  }

  const canSubmit = content.trim().length > 0 && !isSubmitting;

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={handleClose}
    >
      <KeyboardAvoidingView 
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        {/* Header */}
        <View style={styles.modalHeader}>
          <TouchableOpacity
            style={styles.modalCloseButton}
            onPress={handleClose}
            disabled={isSubmitting}
            accessibilityRole="button"
            accessibilityLabel="Close"
          >
            <Ionicons 
              name="close" 
              size={24} 
              color={isDark ? '#ffffff' : '#000000'} 
            />
          </TouchableOpacity>
          
          <Text style={styles.modalTitle}>Create Post</Text>
          
          <TouchableOpacity
            style={[
              styles.createPostButton,
              !canSubmit && styles.submitButtonDisabled
            ]}
            onPress={handleSubmit}
            disabled={!canSubmit}
            accessibilityRole="button"
            accessibilityLabel="Post"
          >
            <Text style={[
              styles.createPostButtonText,
              !canSubmit && styles.submitButtonTextDisabled
            ]}>
              {isSubmitting ? 'Posting...' : 'Post'}
            </Text>
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.modalBody}>
          {/* Content Input */}
          <TextInput
            style={styles.textInput}
            placeholder="What's on your mind about getting government IDs in Cavite?"
            placeholderTextColor={isDark ? '#666666' : '#adb5bd'}
            value={content}
            onChangeText={setContent}
            multiline
            maxLength={2000}
            accessibilityLabel="Post content"
          />
          
          <Text style={[styles.commentActionText, { textAlign: 'right', marginTop: 4 }]}>
            {content.length}/2000
          </Text>

          {/* Hashtag Input */}
          <View style={styles.hashtagInput}>
            <Text style={[styles.modalTitle, { fontSize: 16, marginBottom: 8 }]}>
              Add Hashtags (Optional)
            </Text>
            
            <TextInput
              style={styles.hashtagInputField}
              placeholder="Type a hashtag and press enter"
              placeholderTextColor={isDark ? '#666666' : '#adb5bd'}
              value={hashtagInput}
              onChangeText={setHashtagInput}
              onSubmitEditing={handleHashtagInputSubmit}
              returnKeyType="done"
              maxLength={30}
              accessibilityLabel="Hashtag input"
            />
            
            <Text style={[styles.commentActionText, { marginTop: 4 }]}>
              {selectedHashtags.length}/5 hashtags selected
            </Text>
          </View>

          {/* Selected Hashtags */}
          {selectedHashtags.length > 0 && (
            <View style={styles.selectedHashtags}>
              {selectedHashtags.map((hashtag) => (
                <View key={hashtag} style={styles.selectedHashtag}>
                  <Text style={styles.selectedHashtagText}>
                    #{hashtag}
                  </Text>
                  <TouchableOpacity
                    style={styles.removeHashtagButton}
                    onPress={() => removeHashtag(hashtag)}
                    accessibilityRole="button"
                    accessibilityLabel={`Remove ${hashtag} hashtag`}
                  >
                    <Ionicons name="close" size={12} color="#ffffff" />
                  </TouchableOpacity>
                </View>
              ))}
            </View>
          )}

          {/* Predefined Hashtags */}
          <View style={{ marginTop: 16 }}>
            <Text style={[styles.modalTitle, { fontSize: 16, marginBottom: 8 }]}>
              Popular Hashtags
            </Text>
            <View style={styles.selectedHashtags}>
              {CAVITE_ID_HASHTAGS.slice(0, 8).map((hashtag) => (
                <TouchableOpacity
                  key={hashtag.value}
                  style={[
                    styles.hashtagChip,
                    selectedHashtags.includes(hashtag.value) && styles.hashtagChipActive
                  ]}
                  onPress={() => addPredefinedHashtag(hashtag.value)}
                  disabled={selectedHashtags.includes(hashtag.value) || selectedHashtags.length >= 5}
                  accessibilityRole="button"
                  accessibilityLabel={`Add ${hashtag.label} hashtag`}
                >
                  <Text style={[
                    styles.hashtagChipText,
                    selectedHashtags.includes(hashtag.value) && styles.hashtagChipTextActive
                  ]}>
                    #{hashtag.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </Modal>
  );
}
