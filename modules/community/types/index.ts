export interface Profile {
  id: string;
  first_name: string | null;
  last_name: string | null;
  avatar_url: string | null;
}

export interface Post {
  id: string;
  user_id: string;
  content: string;
  hashtags: string[];
  image_url: string | null;
  likes_count: number;
  comments_count: number;
  created_at: string;
  updated_at: string;
  user_first_name: string | null;
  user_last_name: string | null;
  user_avatar_url: string | null;
  is_liked: boolean;
}

export interface Comment {
  id: string;
  post_id: string;
  parent_comment_id: string | null;
  user_id: string;
  content: string;
  likes_count: number;
  replies_count: number;
  created_at: string;
  updated_at: string;
  user_first_name: string | null;
  user_last_name: string | null;
  user_avatar_url: string | null;
  is_liked: boolean;
}

export interface Like {
  id: string;
  user_id: string;
  post_id: string | null;
  comment_id: string | null;
  created_at: string;
}

export interface CreatePostData {
  content: string;
  hashtags: string[];
  image_url?: string;
}

export interface CreateCommentData {
  post_id: string;
  content: string;
  parent_comment_id?: string;
}

export interface HashtagFilter {
  value: string;
  label: string;
  count?: number;
}

export interface CommunityState {
  posts: Post[];
  comments: Record<string, Comment[]>;
  selectedHashtag: string | null;
  isLoading: boolean;
  isLoadingMore: boolean;
  hasMore: boolean;
  error: string | null;
}

export interface CommunityActions {
  fetchPosts: (hashtag?: string, reset?: boolean) => Promise<void>;
  createPost: (data: CreatePostData) => Promise<void>;
  toggleLike: (postId?: string, commentId?: string) => Promise<void>;
  fetchComments: (postId: string) => Promise<void>;
  createComment: (data: CreateCommentData) => Promise<void>;
  setSelectedHashtag: (hashtag: string | null) => void;
  clearError: () => void;
}

export type CommunityStore = CommunityState & CommunityActions;
