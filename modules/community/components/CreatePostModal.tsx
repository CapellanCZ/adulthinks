import React, { useState, useCallback, useEffect } from 'react';
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
  Pressable,
  Animated,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useColorScheme } from 'react-native';
import * as Haptics from 'expo-haptics';
import { useCommunityStyles } from '../styles/communityStyles';
import { useCommunityStore } from '../store/useCommunityStore';
import { createPostSchema } from '../validation/communitySchema';
import { CAVITE_ID_HASHTAGS } from './HashtagFilter';
import { useDraftPost } from '../hooks/useDraftPost';
import type { Post } from '../types';

interface CreatePostModalProps {
  visible: boolean;
  onClose: () => void;
  editPost?: Post;
}

export function CreatePostModal({ visible, onClose, editPost }: CreatePostModalProps) {
  const styles = useCommunityStyles();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  
  const [content, setContent] = useState('');
  const [selectedHashtags, setSelectedHashtags] = useState<string[]>([]);
  const [hashtagInput, setHashtagInput] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showDraftAlert, setShowDraftAlert] = useState(false);
  
  const { createPost, editPost: updatePost } = useCommunityStore();
  const { draft, autoSaveDraft, clearDraft, hasDraft, formatDraftAge } = useDraftPost();
  
  const isEditing = !!editPost;
  
  const slideAnim = React.useRef(new Animated.Value(0)).current;

  // Load edit data or draft when modal opens
  useEffect(() => {
    if (visible) {
      if (isEditing && editPost) {
        // Load edit data
        setContent(editPost.content);
        setSelectedHashtags(editPost.hashtags);
        
        // Animate in
        Animated.spring(slideAnim, {
          toValue: 1,
          useNativeDriver: true,
          tension: 100,
          friction: 8,
        }).start();
      } else if (draft && hasDraft()) {
        setShowDraftAlert(true);
      } else {
        // Animate in
        Animated.spring(slideAnim, {
          toValue: 1,
          useNativeDriver: true,
          tension: 100,
          friction: 8,
        }).start();
      }
    }
  }, [visible, draft, hasDraft, slideAnim, isEditing, editPost]);

  // Auto-save draft when content changes (only if not editing)
  useEffect(() => {
    if (visible && !isEditing && (content || selectedHashtags.length > 0)) {
      autoSaveDraft({
        content,
        hashtags: selectedHashtags,
        imageUrl: undefined,
      });
    }
  }, [content, selectedHashtags, visible, isEditing]); // Removed autoSaveDraft from deps

  const loadDraft = useCallback(() => {
    if (draft) {
      setContent(draft.content);
      setSelectedHashtags(draft.hashtags);
    }
    setShowDraftAlert(false);
    
    // Animate in
    Animated.spring(slideAnim, {
      toValue: 1,
      useNativeDriver: true,
      tension: 100,
      friction: 8,
    }).start();
  }, [draft, slideAnim]);

  const discardDraft = useCallback(async () => {
    await clearDraft();
    setShowDraftAlert(false);
    
    // Animate in
    Animated.spring(slideAnim, {
      toValue: 1,
      useNativeDriver: true,
      tension: 100,
      friction: 8,
    }).start();
  }, [clearDraft, slideAnim]);

  const handleClose = useCallback(() => {
    if (isSubmitting) return;
    
    // Animate out
    Animated.timing(slideAnim, {
      toValue: 0,
      duration: 200,
      useNativeDriver: true,
    }).start(() => {
      setContent('');
      setSelectedHashtags([]);
      setHashtagInput('');
      onClose();
    });
  }, [isSubmitting, onClose, slideAnim]);

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
      
      if (isEditing && editPost) {
        await updatePost(editPost.id, {
          content: content.trim(),
          hashtags: selectedHashtags,
        });
        Alert.alert('Success', 'Post updated successfully!');
      } else {
        await createPost({
          content: content.trim(),
          hashtags: selectedHashtags,
        });
        
        // Clear draft after successful post
        await clearDraft();
        Alert.alert('Success', 'Post created successfully!');
      }
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
        {/* Drag Handle */}
        <View style={styles.modalDragHandle} />
        
        {/* Header */}
        <View style={styles.modalHeader}>
          <Pressable
            style={({ pressed }) => [
              styles.modalCloseButton,
              pressed && { backgroundColor: isDark ? '#333333' : '#f0f0f0' }
            ]}
            onPress={handleClose}
            disabled={isSubmitting}
            accessibilityRole="button"
            accessibilityLabel="Close create post modal"
            accessibilityHint="Discards any unsaved changes"
          >
            <Ionicons 
              name="close" 
              size={24} 
              color={isDark ? '#ffffff' : '#000000'} 
            />
          </Pressable>
          
          <Text style={styles.modalTitle}>
            {isEditing ? 'Edit Post' : 'Create Post'}
          </Text>
          
          <Pressable
            style={({ pressed }) => [
              styles.createPostButton,
              !canSubmit && styles.submitButtonDisabled,
              pressed && canSubmit && { opacity: 0.8 }
            ]}
            onPress={handleSubmit}
            disabled={!canSubmit}
            accessibilityRole="button"
            accessibilityLabel="Publish post"
            accessibilityHint={canSubmit ? 'Publishes your post to the community' : 'Post content is required'}
          >
            <Text style={[
              styles.createPostButtonText,
              !canSubmit && styles.submitButtonTextDisabled
            ]}>
              {isSubmitting ? 'Posting...' : 'Post'}
            </Text>
          </Pressable>
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

      {/* Draft Alert Modal */}
      <Modal
        visible={showDraftAlert}
        transparent
        animationType="fade"
        onRequestClose={() => setShowDraftAlert(false)}
      >
        <View style={styles.modalContainer}>
          <View style={[styles.modalContent, { maxHeight: '40%' }]}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Draft Found</Text>
            </View>
            
            <View style={styles.modalBody}>
              <Text style={[styles.postText, { marginBottom: 16 }]}>
                You have an unsaved draft from {formatDraftAge()}. Would you like to continue with your draft or start fresh?
              </Text>
              
              <View style={{ flexDirection: 'row', gap: 12 }}>
                <Pressable
                  style={[styles.submitButton, { flex: 1, backgroundColor: isDark ? '#333333' : '#e9ecef' }]}
                  onPress={discardDraft}
                  accessibilityRole="button"
                  accessibilityLabel="Start fresh"
                >
                  <Text style={[styles.submitButtonText, { color: isDark ? '#ffffff' : '#000000' }]}>
                    Start Fresh
                  </Text>
                </Pressable>
                
                <Pressable
                  style={[styles.submitButton, { flex: 1 }]}
                  onPress={loadDraft}
                  accessibilityRole="button"
                  accessibilityLabel="Continue with draft"
                >
                  <Text style={styles.submitButtonText}>
                    Continue Draft
                  </Text>
                </Pressable>
              </View>
            </View>
          </View>
        </View>
      </Modal>
    </Modal>
  );
}
