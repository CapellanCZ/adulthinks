import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  Alert,
  Pressable,
  Animated,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useColorScheme } from 'react-native';
import * as Haptics from 'expo-haptics';
import { useCommunityStyles } from '../styles/communityStyles';
import { useCommunityStore } from '../store/useCommunityStore';
import { useCurrentUser } from '../hooks/useCurrentUser';
import type { Post } from '../types';

interface PostOptionsMenuProps {
  post: Post;
  onEdit: () => void;
}

export const PostOptionsMenu = React.memo(function PostOptionsMenu({
  post,
  onEdit,
}: PostOptionsMenuProps) {
  const styles = useCommunityStyles();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const [showMenu, setShowMenu] = useState(false);
  const { deletePost } = useCommunityStore();
  const { userId: currentUser } = useCurrentUser();
  
  const scaleAnim = React.useRef(new Animated.Value(0)).current;

  const handleMenuPress = useCallback(async () => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setShowMenu(true);
    
    Animated.spring(scaleAnim, {
      toValue: 1,
      useNativeDriver: true,
      tension: 100,
      friction: 8,
    }).start();
  }, [scaleAnim]);

  const closeMenu = useCallback(() => {
    Animated.timing(scaleAnim, {
      toValue: 0,
      duration: 150,
      useNativeDriver: true,
    }).start(() => {
      setShowMenu(false);
    });
  }, [scaleAnim]);

  const handleEdit = useCallback(async () => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    closeMenu();
    onEdit();
  }, [closeMenu, onEdit]);

  const handleDelete = useCallback(async () => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
    closeMenu();
    
    // Verify user ownership before showing delete dialog
    if (currentUser !== post.user_id) {
      Alert.alert('Error', 'You can only delete your own posts');
      return;
    }
    
    Alert.alert(
      'Delete Post',
      'Are you sure you want to delete this post? This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await deletePost(post.id);
              await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
              // Don't show success alert as the post disappears from the list
            } catch (error) {
              await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
              Alert.alert('Error', 'Failed to delete post. Please try again.');
            }
          },
        },
      ]
    );
  }, [closeMenu, deletePost, post.id, currentUser, post.user_id]);

  return (
    <>
      <Pressable
        style={({ pressed }) => [
          styles.postOptionsButton,
          pressed && { opacity: 0.7 }
        ]}
        onPress={handleMenuPress}
        accessibilityRole="button"
        accessibilityLabel="Post options"
        accessibilityHint="Edit or delete this post"
      >
        <Ionicons
          name="ellipsis-horizontal"
          size={20}
          color={isDark ? '#888888' : '#6c757d'}
        />
      </Pressable>

      <Modal
        visible={showMenu}
        transparent
        animationType="none"
        onRequestClose={closeMenu}
      >
        <Pressable style={styles.menuOverlay} onPress={closeMenu}>
          <Animated.View
            style={[
              styles.menuContainer,
              {
                transform: [{ scale: scaleAnim }],
              },
            ]}
          >
            <View style={styles.menuContent}>
              <Text style={styles.menuTitle}>Post Options</Text>
              
              <Pressable
                style={({ pressed }) => [
                  styles.menuItem,
                  pressed && { backgroundColor: isDark ? '#333333' : '#f0f0f0' }
                ]}
                onPress={handleEdit}
                accessibilityRole="button"
                accessibilityLabel="Edit post"
              >
                <Ionicons
                  name="create-outline"
                  size={20}
                  color={isDark ? '#ffffff' : '#000000'}
                />
                <Text style={styles.menuItemText}>Edit Post</Text>
              </Pressable>
              
              <Pressable
                style={({ pressed }) => [
                  styles.menuItem,
                  styles.menuItemDanger,
                  pressed && { backgroundColor: 'rgba(255, 48, 64, 0.1)' }
                ]}
                onPress={handleDelete}
                accessibilityRole="button"
                accessibilityLabel="Delete post"
              >
                <Ionicons
                  name="trash-outline"
                  size={20}
                  color="#ff3040"
                />
                <Text style={[styles.menuItemText, styles.menuItemTextDanger]}>
                  Delete Post
                </Text>
              </Pressable>
            </View>
          </Animated.View>
        </Pressable>
      </Modal>
    </>
  );
});
