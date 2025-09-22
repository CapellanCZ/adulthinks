import React, { useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  RefreshControl,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useColorScheme } from 'react-native';
import { useCommunityStyles } from '../../modules/community/styles/communityStyles';
import { useCommunity } from '../../modules/community/hooks/useCommunity';
import { PostItem, HashtagFilter, CreatePostModal } from '../../modules/community/components';
import type { Post } from '../../modules/community/types';

export default function CommunityScreen() {
  const styles = useCommunityStyles();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const [showCreateModal, setShowCreateModal] = useState(false);

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

  function renderPost({ item }: { item: Post }) {
    return <PostItem post={item} />;
  }

  function renderFooter() {
    if (!isLoadingMore) return null;
    
    return (
      <View style={{ padding: 20, alignItems: 'center' }}>
        <ActivityIndicator size="small" color="#007AFF" />
      </View>
    );
  }

  function renderEmpty() {
    if (isLoading) return null;

    return (
      <View style={styles.emptyContainer}>
        <Ionicons 
          name="chatbubbles-outline" 
          size={64} 
          color={isDark ? '#333333' : '#e9ecef'} 
        />
        <Text style={styles.emptyText}>
          {selectedHashtag 
            ? `No posts found for #${selectedHashtag}` 
            : 'No posts yet'
          }
        </Text>
        <Text style={styles.emptySubtext}>
          {selectedHashtag 
            ? 'Try selecting a different hashtag or create the first post!' 
            : 'Be the first to share your experience about getting government IDs in Cavite!'
          }
        </Text>
      </View>
    );
  }

  function handleError() {
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
  }

  // Show error alert when error occurs
  React.useEffect(() => {
    handleError();
  }, [error]);

  if (isLoading && posts.length === 0) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Community</Text>
          <TouchableOpacity
            style={styles.createPostButton}
            onPress={() => setShowCreateModal(true)}
            accessibilityRole="button"
            accessibilityLabel="Create new post"
          >
            <Ionicons name="add" size={20} color="#ffffff" />
          </TouchableOpacity>
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
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Community</Text>
        <TouchableOpacity
          style={styles.createPostButton}
          onPress={() => setShowCreateModal(true)}
          accessibilityRole="button"
          accessibilityLabel="Create new post"
        >
          <Ionicons name="add" size={20} color="#ffffff" />
        </TouchableOpacity>
      </View>

      {/* Hashtag Filter */}
      <HashtagFilter />

      {/* Posts List */}
      <FlatList
        data={posts}
        renderItem={renderPost}
        keyExtractor={(item) => item.id}
        refreshControl={
          <RefreshControl
            refreshing={isLoading}
            onRefresh={refresh}
            tintColor="#007AFF"
            colors={['#007AFF']}
          />
        }
        onEndReached={loadMore}
        onEndReachedThreshold={0.5}
        ListFooterComponent={renderFooter}
        ListEmptyComponent={renderEmpty}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={posts.length === 0 ? { flex: 1 } : undefined}
      />

      {/* Create Post Modal */}
      <CreatePostModal
        visible={showCreateModal}
        onClose={() => setShowCreateModal(false)}
      />
    </SafeAreaView>
  );
}