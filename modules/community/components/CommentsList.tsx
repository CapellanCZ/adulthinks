import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  Alert,
  Image,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useColorScheme } from 'react-native';
import { useCommunityStyles } from '../styles/communityStyles';
import { useCommunityStore } from '../store/useCommunityStore';
import type { Comment } from '../types';

interface CommentsListProps {
  postId: string;
}

interface CommentItemProps {
  comment: Comment;
}

function CommentItem({ comment }: CommentItemProps) {
  const styles = useCommunityStyles();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const { toggleLike } = useCommunityStore();

  function formatTimestamp(timestamp: string): string {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) {
      const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
      return diffInMinutes < 1 ? 'Just now' : `${diffInMinutes}m ago`;
    } else if (diffInHours < 24) {
      return `${diffInHours}h ago`;
    } else {
      const diffInDays = Math.floor(diffInHours / 24);
      return `${diffInDays}d ago`;
    }
  }

  function getUserDisplayName(): string {
    const firstName = comment.user_first_name || '';
    const lastName = comment.user_last_name || '';
    return `${firstName} ${lastName}`.trim() || 'Anonymous User';
  }

  async function handleLike() {
    try {
      await toggleLike(undefined, comment.id);
    } catch (error) {
      Alert.alert('Error', 'Failed to like comment');
    }
  }

  return (
    <View style={styles.commentItem}>
      <View style={styles.commentAvatar}>
        {comment.user_avatar_url ? (
          <Image 
            source={{ uri: comment.user_avatar_url }} 
            style={styles.commentAvatar}
          />
        ) : (
          <View style={[styles.commentAvatar, { justifyContent: 'center', alignItems: 'center' }]}>
            <Ionicons 
              name="person" 
              size={16} 
              color={isDark ? '#666666' : '#adb5bd'} 
            />
          </View>
        )}
      </View>
      
      <View style={styles.commentContent}>
        <View style={styles.commentHeader}>
          <Text style={styles.commentUserName}>
            {getUserDisplayName()}
          </Text>
          <Text style={styles.commentTimestamp}>
            {formatTimestamp(comment.created_at)}
          </Text>
        </View>
        
        <Text style={styles.commentText}>
          {comment.content}
        </Text>
        
        <View style={styles.commentActions}>
          <TouchableOpacity 
            style={styles.commentActionButton}
            onPress={handleLike}
            accessibilityRole="button"
            accessibilityLabel={comment.is_liked ? 'Unlike comment' : 'Like comment'}
          >
            <Ionicons
              name={comment.is_liked ? 'heart' : 'heart-outline'}
              size={14}
              color={comment.is_liked ? '#ff3040' : (isDark ? '#888888' : '#6c757d')}
            />
            <Text style={styles.commentActionText}>
              {comment.likes_count}
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.commentActionButton}
            accessibilityRole="button"
            accessibilityLabel="Reply to comment"
          >
            <Ionicons
              name="chatbubble-outline"
              size={14}
              color={isDark ? '#888888' : '#6c757d'}
            />
            <Text style={styles.commentActionText}>
              Reply
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

export function CommentsList({ postId }: CommentsListProps) {
  const styles = useCommunityStyles();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const [commentText, setCommentText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const { comments, createComment } = useCommunityStore();
  const postComments = comments[postId] || [];

  async function handleSubmitComment() {
    if (!commentText.trim() || isSubmitting) return;

    setIsSubmitting(true);
    try {
      await createComment({
        post_id: postId,
        content: commentText.trim(),
      });
      setCommentText('');
    } catch (error) {
      Alert.alert('Error', 'Failed to post comment');
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <View style={styles.commentsContainer}>
      {/* Comment Input */}
      <View style={[styles.commentItem, { marginBottom: 16 }]}>
        <View style={styles.commentAvatar}>
          <View style={[styles.commentAvatar, { justifyContent: 'center', alignItems: 'center' }]}>
            <Ionicons 
              name="person" 
              size={16} 
              color={isDark ? '#666666' : '#adb5bd'} 
            />
          </View>
        </View>
        
        <View style={[styles.commentContent, { flex: 1 }]}>
          <TextInput
            style={[styles.textInput, { minHeight: 40, marginBottom: 8 }]}
            placeholder="Write a comment..."
            placeholderTextColor={isDark ? '#666666' : '#adb5bd'}
            value={commentText}
            onChangeText={setCommentText}
            multiline
            maxLength={500}
            accessibilityLabel="Comment input"
          />
          
          {commentText.trim().length > 0 && (
            <TouchableOpacity
              style={[
                styles.submitButton,
                { paddingVertical: 8, marginTop: 0 },
                isSubmitting && styles.submitButtonDisabled
              ]}
              onPress={handleSubmitComment}
              disabled={isSubmitting}
              accessibilityRole="button"
              accessibilityLabel="Post comment"
            >
              <Text style={[
                styles.submitButtonText,
                isSubmitting && styles.submitButtonTextDisabled
              ]}>
                {isSubmitting ? 'Posting...' : 'Post'}
              </Text>
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Comments List */}
      {postComments.map((comment) => (
        <CommentItem key={comment.id} comment={comment} />
      ))}
      
      {postComments.length === 0 && (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>No comments yet</Text>
          <Text style={styles.emptySubtext}>Be the first to comment!</Text>
        </View>
      )}
    </View>
  );
}
