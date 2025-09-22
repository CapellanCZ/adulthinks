import React, { useState, useCallback, useRef, useEffect } from 'react';
import {
  Modal,
  View,
  Text,
  TextInput,
  Pressable,
  Alert,
  Animated,
  KeyboardAvoidingView,
  Platform,
  Dimensions,
} from 'react-native';
// import { BlurView } from 'expo-blur'; // Commented out - may not be installed
import { Ionicons } from '@expo/vector-icons';
import { useColorScheme } from 'react-native';
import * as Haptics from 'expo-haptics';
import { useCommunityStyles } from '../styles/communityStyles';
import { useCommunityStore } from '../store/useCommunityStore';
import type { Comment } from '../types';

const { height: screenHeight } = Dimensions.get('window');

interface ReplyModalProps {
  visible: boolean;
  onClose: () => void;
  comment: Comment | null;
  postId: string;
}

export const ReplyModal = React.memo(function ReplyModal({
  visible,
  onClose,
  comment,
  postId,
}: ReplyModalProps) {
  const styles = useCommunityStyles();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  
  const [replyText, setReplyText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { createComment } = useCommunityStore();
  
  const slideAnim = useRef(new Animated.Value(screenHeight)).current;
  const inputRef = useRef<TextInput>(null);

  // Initialize reply text when comment changes
  useEffect(() => {
    if (comment && visible) {
      const userName = comment.user_first_name || 'User';
      setReplyText(`@${userName} `);
      
      // Animate in
      Animated.spring(slideAnim, {
        toValue: 0,
        useNativeDriver: true,
        tension: 100,
        friction: 8,
      }).start(() => {
        // Focus input after animation
        setTimeout(() => {
          inputRef.current?.focus();
        }, 100);
      });
    }
  }, [comment, visible, slideAnim]);

  const handleClose = useCallback(() => {
    // Animate out
    Animated.timing(slideAnim, {
      toValue: screenHeight,
      duration: 250,
      useNativeDriver: true,
    }).start(() => {
      setReplyText('');
      onClose();
    });
  }, [slideAnim, onClose]);

  const handleSubmit = useCallback(async () => {
    if (!replyText.trim() || isSubmitting || !comment) return;

    setIsSubmitting(true);
    try {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      
      await createComment({
        post_id: postId,
        content: replyText.trim(),
        parent_comment_id: comment.id,
      });

      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      handleClose();
    } catch (error) {
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      Alert.alert('Error', 'Failed to post reply. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  }, [replyText, isSubmitting, comment, postId, createComment, handleClose]);

  const canSubmit = replyText.trim().length > 0 && !isSubmitting;

  console.log('ReplyModal render - visible:', visible, 'comment:', comment?.id);
  
  if (!visible || !comment) return null;

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={handleClose}
    >
      {/* Background Overlay */}
      <View
        style={{
          flex: 1,
          backgroundColor: isDark ? 'rgba(0, 0, 0, 0.8)' : 'rgba(0, 0, 0, 0.5)',
          justifyContent: 'flex-end',
        }}
      >
        {/* Test Content */}
        <Pressable
          style={{
            backgroundColor: 'red',
            height: 100,
            justifyContent: 'center',
            alignItems: 'center',
            margin: 20,
          }}
          onPress={handleClose}
        >
          <Text style={{ color: 'white', fontSize: 18 }}>
            TEST MODAL - TAP TO CLOSE
          </Text>
        </Pressable>
      </View>
    </Modal>
  );
});
