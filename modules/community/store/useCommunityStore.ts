import { create } from 'zustand';
import { supabase } from '../../../lib/supabase';
import type { 
  CommunityStore, 
  Post, 
  Comment, 
  CreatePostData, 
  CreateCommentData 
} from '../types';

const POSTS_PER_PAGE = 20;

export const useCommunityStore = create<CommunityStore>((set, get) => ({
  // State
  posts: [],
  comments: {},
  selectedHashtag: null,
  isLoading: false,
  isLoadingMore: false,
  hasMore: true,
  error: null,

  // Actions
  fetchPosts: async (hashtag?: string, reset = false) => {
    const state = get();
    
    if (reset) {
      set({ isLoading: true, error: null, posts: [], hasMore: true });
    } else {
      set({ isLoadingMore: true, error: null });
    }

    try {
      const { data: { user } } = await supabase.auth.getUser();
      const offset = reset ? 0 : state.posts.length;

      const { data, error } = await supabase.rpc('get_posts_with_details', {
        user_id_param: user?.id || null,
        hashtag_filter: hashtag || null,
        limit_param: POSTS_PER_PAGE,
        offset_param: offset,
      });

      if (error) throw error;

      const posts = data as Post[];
      const hasMore = posts.length === POSTS_PER_PAGE;

      set(state => ({
        posts: reset ? posts : [...state.posts, ...posts],
        hasMore,
        isLoading: false,
        isLoadingMore: false,
      }));
    } catch (error) {
      console.error('Error fetching posts:', error);
      set({
        error: error instanceof Error ? error.message : 'Failed to fetch posts',
        isLoading: false,
        isLoadingMore: false,
      });
    }
  },

  createPost: async (data: CreatePostData) => {
    set({ isLoading: true, error: null });

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const { error } = await supabase
        .from('posts')
        .insert({
          user_id: user.id,
          content: data.content,
          hashtags: data.hashtags,
          image_url: data.image_url || null,
        });

      if (error) throw error;

      // Refresh posts after creating
      await get().fetchPosts(get().selectedHashtag || undefined, true);
    } catch (error) {
      console.error('Error creating post:', error);
      set({
        error: error instanceof Error ? error.message : 'Failed to create post',
        isLoading: false,
      });
      throw error;
    }
  },

  toggleLike: async (postId?: string, commentId?: string) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      // Check if already liked
      const { data: existingLike } = await supabase
        .from('likes')
        .select('id')
        .eq('user_id', user.id)
        .eq(postId ? 'post_id' : 'comment_id', postId || commentId)
        .single();

      if (existingLike) {
        // Unlike
        const { error } = await supabase
          .from('likes')
          .delete()
          .eq('id', existingLike.id);

        if (error) throw error;
      } else {
        // Like
        const { error } = await supabase
          .from('likes')
          .insert({
            user_id: user.id,
            post_id: postId || null,
            comment_id: commentId || null,
          });

        if (error) throw error;
      }

      // Update local state
      if (postId) {
        set(state => ({
          posts: state.posts.map(post =>
            post.id === postId
              ? {
                  ...post,
                  is_liked: !post.is_liked,
                  likes_count: post.is_liked 
                    ? post.likes_count - 1 
                    : post.likes_count + 1,
                }
              : post
          ),
        }));
      } else if (commentId) {
        set(state => ({
          comments: Object.keys(state.comments).reduce((acc, postId) => {
            acc[postId] = state.comments[postId].map(comment =>
              comment.id === commentId
                ? {
                    ...comment,
                    is_liked: !comment.is_liked,
                    likes_count: comment.is_liked 
                      ? comment.likes_count - 1 
                      : comment.likes_count + 1,
                  }
                : comment
            );
            return acc;
          }, {} as Record<string, Comment[]>),
        }));
      }
    } catch (error) {
      console.error('Error toggling like:', error);
      set({
        error: error instanceof Error ? error.message : 'Failed to toggle like',
      });
    }
  },

  fetchComments: async (postId: string) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();

      const { data, error } = await supabase.rpc('get_comments_with_details', {
        post_id_param: postId,
        user_id_param: user?.id || null,
        parent_comment_id_param: null,
      });

      if (error) throw error;

      const comments = data as Comment[];

      set(state => ({
        comments: {
          ...state.comments,
          [postId]: comments,
        },
      }));
    } catch (error) {
      console.error('Error fetching comments:', error);
      set({
        error: error instanceof Error ? error.message : 'Failed to fetch comments',
      });
    }
  },

  createComment: async (data: CreateCommentData) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const { error } = await supabase
        .from('comments')
        .insert({
          user_id: user.id,
          post_id: data.post_id,
          content: data.content,
          parent_comment_id: data.parent_comment_id || null,
        });

      if (error) throw error;

      // Refresh comments after creating
      await get().fetchComments(data.post_id);
    } catch (error) {
      console.error('Error creating comment:', error);
      set({
        error: error instanceof Error ? error.message : 'Failed to create comment',
      });
      throw error;
    }
  },

  setSelectedHashtag: (hashtag: string | null) => {
    set({ selectedHashtag: hashtag });
    get().fetchPosts(hashtag || undefined, true);
  },

  clearError: () => {
    set({ error: null });
  },
}));
