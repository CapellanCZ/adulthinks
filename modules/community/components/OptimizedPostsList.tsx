import React, { useCallback, useMemo } from 'react';
import {
  FlatList,
  RefreshControl,
  ActivityIndicator,
  View,
  Text,
  ListRenderItem,
} from 'react-native';
import { useColorScheme } from 'react-native';
import { useCommunityStyles } from '../styles/communityStyles';
import { PostItem } from './PostItem';
import type { Post } from '../types';

interface OptimizedPostsListProps {
  posts: Post[];
  isLoading: boolean;
  isLoadingMore: boolean;
  hasMore: boolean;
  onRefresh: () => void;
  onLoadMore: () => void;
  selectedHashtag: string | null;
  onEditPost?: (post: Post) => void;
}

export const OptimizedPostsList = React.memo(function OptimizedPostsList({
  posts,
  isLoading,
  isLoadingMore,
  hasMore,
  onRefresh,
  onLoadMore,
  selectedHashtag,
  onEditPost,
}: OptimizedPostsListProps) {
  const styles = useCommunityStyles();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  const renderPost: ListRenderItem<Post> = useCallback(({ item }) => (
    <PostItem post={item} onEdit={onEditPost} />
  ), [onEditPost]);

  const renderFooter = useCallback(() => {
    if (!isLoadingMore) return null;
    
    return (
      <View style={{ padding: 20, alignItems: 'center' }}>
        <ActivityIndicator size="small" color="#007AFF" />
      </View>
    );
  }, [isLoadingMore]);

  const renderEmpty = useCallback(() => {
    if (isLoading) return null;

    return (
      <View style={styles.emptyContainer}>
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
  }, [isLoading, selectedHashtag, styles]);

  const keyExtractor = useCallback((item: Post) => item.id, []);

  const getItemLayout = useCallback((data: any, index: number) => ({
    length: 200, // Estimated item height
    offset: 200 * index,
    index,
  }), []);

  const refreshControl = useMemo(() => (
    <RefreshControl
      refreshing={isLoading}
      onRefresh={onRefresh}
      tintColor="#007AFF"
      colors={['#007AFF']}
      progressBackgroundColor={isDark ? '#333333' : '#ffffff'}
    />
  ), [isLoading, onRefresh, isDark]);

  return (
    <FlatList
      data={posts}
      renderItem={renderPost}
      keyExtractor={keyExtractor}
      refreshControl={refreshControl}
      onEndReached={onLoadMore}
      onEndReachedThreshold={0.5}
      ListFooterComponent={renderFooter}
      ListEmptyComponent={renderEmpty}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={posts.length === 0 ? { flex: 1 } : undefined}
      removeClippedSubviews={true}
      maxToRenderPerBatch={10}
      updateCellsBatchingPeriod={50}
      initialNumToRender={10}
      windowSize={10}
      getItemLayout={getItemLayout}
      maintainVisibleContentPosition={{
        minIndexForVisible: 0,
        autoscrollToTopThreshold: 100,
      }}
    />
  );
});
