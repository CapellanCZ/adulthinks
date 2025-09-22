// Components
export {
  PostItem,
  CommentsList,
  HashtagFilter,
  CreatePostModal,
  OptimizedPostsList,
  SearchBar,
  PostOptionsMenu,
  ReplyModal,
} from './components';

// Hooks
export { useCommunity } from './hooks/useCommunity';
export { useCurrentUser } from './hooks/useCurrentUser';

// Store
export { useCommunityStore } from './store/useCommunityStore';

// Types
export type {
  Profile,
  Post,
  Comment,
  Like,
  CreatePostData,
  CreateCommentData,
  HashtagFilter as HashtagFilterType,
  CommunityState,
  CommunityActions,
  CommunityStore,
} from './types';

// Validation
export {
  createPostSchema,
  createCommentSchema,
  hashtagSchema,
} from './validation/communitySchema';
export type {
  CreatePostFormData,
  CreateCommentFormData,
  HashtagFormData,
} from './validation/communitySchema';

// Styles
export { useCommunityStyles } from './styles/communityStyles';
