import React, { useState, useCallback } from 'react';
import {
  View,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  Pressable,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useColorScheme } from 'react-native';
import * as Haptics from 'expo-haptics';
import { useCommunityStyles } from '../../modules/community/styles/communityStyles';
import { useCommunity } from '../../modules/community/hooks/useCommunity';
import { HashtagFilter, CreatePostModal } from '../../modules/community/components';
import { OptimizedPostsList } from '../../modules/community/components/OptimizedPostsList';
import type { Post } from '../../modules/community/types';
import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs';
import { Text } from '@/components/ui/text';

export default function CommunityScreen() {
  const styles = useCommunityStyles();
  const colorScheme = useColorScheme();
  const bottom = useBottomTabBarHeight();
  const isDark = colorScheme === 'dark';
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingPost, setEditingPost] = useState<Post | undefined>();

  const {
    posts,
    selectedHashtag,
    isLoading,
    isLoadingMore,
    hasMore,
    error,
    loadMore,
    refresh,
    clearError,
  } = useCommunity();

  const handleCreatePost = useCallback(async () => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setEditingPost(undefined);
    setShowCreateModal(true);
  }, []);

  const handleEditPost = useCallback(async (post: Post) => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setEditingPost(post);
    setShowCreateModal(true);
  }, []);

  const handleCloseModal = useCallback(() => {
    setShowCreateModal(false);
    setEditingPost(undefined);
  }, []);

  const handleError = useCallback(() => {
    if (error) {
      Alert.alert(
        'Error',
        error,
        [
          { text: 'Retry', onPress: refresh },
          { text: 'Dismiss', onPress: clearError },
        ]
      );
    }
  }, [error, refresh, clearError]);

  // Show error alert when error occurs
  React.useEffect(() => {
    handleError();
  }, [error]);

  if (isLoading && posts.length === 0) {
    return (
      <SafeAreaView style={[styles.container]}>
        <View style={styles.header}>
          <Text variant="title" style={styles.headerTitle}>Community</Text>
          <Pressable
            style={({ pressed }) => [
              styles.createPostButton,
              pressed && { opacity: 0.8 }
            ]}
            onPress={handleCreatePost}
            accessibilityRole="button"
            accessibilityLabel="Create new post"
            accessibilityHint="Opens a form to create a new community post"
          >
            <Ionicons name="add" size={20} color="#ffffff" />
          </Pressable>
        </View>
        
        <HashtagFilter />
        
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#007AFF" />
          <Text style={[styles.emptySubtext, { marginTop: 16 }]}>
            Loading posts...
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.container]}>
      {/* Header */}
      <View style={styles.header}>
        <Text variant='title' style={styles.headerTitle}>Community</Text>
        <Pressable
          style={({ pressed }) => [
            styles.createPostButton,
            pressed && { opacity: 0.8 }
          ]}
          onPress={handleCreatePost}
          accessibilityRole="button"
          accessibilityLabel="Create new post"
          accessibilityHint="Opens a form to create a new community post"
        >
          <Ionicons name="add" size={20} color="#ffffff" />
        </Pressable>
      </View>

      {/* Hashtag Filter */}
      <HashtagFilter />

      {/* Posts List */}
      <OptimizedPostsList
        posts={posts}
        isLoading={isLoading}
        isLoadingMore={isLoadingMore}
        hasMore={hasMore}
        onRefresh={refresh}
        onLoadMore={loadMore}
        selectedHashtag={selectedHashtag}
        onEditPost={handleEditPost}
      />

      {/* Create Post Modal */}
      <CreatePostModal
        visible={showCreateModal}
        onClose={handleCloseModal}
        editPost={editingPost}
      />
    </SafeAreaView>
  );
}