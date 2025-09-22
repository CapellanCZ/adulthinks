import { useEffect } from 'react';
import { useCommunityStore } from '../store/useCommunityStore';

export function useCommunity() {
  const {
    posts,
    selectedHashtag,
    isLoading,
    isLoadingMore,
    hasMore,
    error,
    fetchPosts,
    setSelectedHashtag,
    clearError,
  } = useCommunityStore();

  // Initial load
  useEffect(() => {
    fetchPosts(undefined, true);
  }, []);

  function loadMore() {
    if (!isLoadingMore && hasMore) {
      fetchPosts(selectedHashtag || undefined);
    }
  }

  function refresh() {
    fetchPosts(selectedHashtag || undefined, true);
  }

  function filterByHashtag(hashtag: string | null) {
    setSelectedHashtag(hashtag);
  }

  return {
    // State
    posts,
    selectedHashtag,
    isLoading,
    isLoadingMore,
    hasMore,
    error,
    
    // Actions
    loadMore,
    refresh,
    filterByHashtag,
    clearError,
  };
}
