import * as yup from 'yup';

export const createPostSchema = yup.object({
  content: yup
    .string()
    .required('Post content is required')
    .min(1, 'Post content cannot be empty')
    .max(2000, 'Post content cannot exceed 2000 characters'),
  hashtags: yup
    .array()
    .of(yup.string().required())
    .max(5, 'Maximum 5 hashtags allowed')
    .default([]),
  image_url: yup.string().url('Invalid image URL').optional(),
});

export const createCommentSchema = yup.object({
  content: yup
    .string()
    .required('Comment content is required')
    .min(1, 'Comment content cannot be empty')
    .max(500, 'Comment content cannot exceed 500 characters'),
  post_id: yup.string().required('Post ID is required'),
  parent_comment_id: yup.string().optional(),
});

export const hashtagSchema = yup.object({
  hashtag: yup
    .string()
    .required('Hashtag is required')
    .matches(/^[a-zA-Z0-9_]+$/, 'Hashtag can only contain letters, numbers, and underscores')
    .min(2, 'Hashtag must be at least 2 characters')
    .max(30, 'Hashtag cannot exceed 30 characters'),
});

export type CreatePostFormData = yup.InferType<typeof createPostSchema>;
export type CreateCommentFormData = yup.InferType<typeof createCommentSchema>;
export type HashtagFormData = yup.InferType<typeof hashtagSchema>;
