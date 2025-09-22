import React, { useState, useCallback, useMemo, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  Alert,
  Pressable,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useColorScheme } from 'react-native';
import * as Haptics from 'expo-haptics';
import { useCommunityStyles } from '../styles/communityStyles';
import { useCommunityStore } from '../store/useCommunityStore';
import { useCurrentUser } from '../hooks/useCurrentUser';
import { CommentsList } from './CommentsList';
import { PostOptionsMenu } from './PostOptionsMenu';
import type { Post } from '../types';

interface PostItemProps {
  post: Post;
  onEdit?: (post: Post) => void;
}

export const PostItem = React.memo(function PostItem({ post, onEdit }: PostItemProps) {
  const styles = useCommunityStyles();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const [showComments, setShowComments] = useState(false);
  
  const { toggleLike, fetchComments } = useCommunityStore();
  const { userId: currentUser } = useCurrentUser();
  
  const isOwner = currentUser === post.user_id;

  const formattedTimestamp = useMemo(() => {
    const date = new Date(post.created_at);
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
  }, [post.created_at]);

  const userDisplayName = useMemo(() => {
    const firstName = post.user_first_name || '';
    const lastName = post.user_last_name || '';
    return `${firstName} ${lastName}`.trim() || 'Anonymous User';
  }, [post.user_first_name, post.user_last_name]);

  const handleLike = useCallback(async () => {
    try {
      // Haptic feedback for better UX
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      await toggleLike(post.id);
    } catch (error) {
      Alert.alert('Error', 'Failed to like post');
    }
  }, [post.id, toggleLike]);

  const handleShowComments = useCallback(async () => {
    try {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      if (!showComments) {
        await fetchComments(post.id);
      }
      setShowComments(!showComments);
    } catch (error) {
      console.error('Error loading comments:', error);
    }
  }, [showComments, post.id, fetchComments]);


  return (
    <View style={styles.postContainer}>
      {/* Post Header */}
      <View style={styles.postHeader}>
        <View style={styles.avatar}>
          {post.user_avatar_url ? (
            <Image 
              source={{ uri: post.user_avatar_url }} 
              style={styles.avatar}
            />
          ) : (
            <View style={[styles.avatar, { justifyContent: 'center', alignItems: 'center' }]}>
              <Ionicons 
                name="person" 
                size={20} 
                color={isDark ? '#666666' : '#adb5bd'} 
              />
            </View>
          )}
        </View>
        <View style={styles.postUserInfo}>
          <Text style={styles.postUserName}>
            {userDisplayName}
          </Text>
          <Text style={styles.postTimestamp}>
            {formattedTimestamp}
          </Text>
        </View>
        
        {isOwner && onEdit && (
          <PostOptionsMenu
            post={post}
            onEdit={() => onEdit(post)}
          />
        )}
      </View>

      {/* Post Content */}
      <View style={styles.postContent}>
        <Text style={styles.postText}>
          {post.content}
        </Text>
        

        {post.hashtags.length > 0 && (
          <View style={styles.postHashtags}>
            {post.hashtags.map((hashtag, index) => (
              <Text key={index} style={styles.postHashtag}>
                #{hashtag}
              </Text>
            ))}
          </View>
        )}
      </View>

      {/* Post Actions */}
      <View style={styles.postActions}>
        <Pressable 
          style={({ pressed }) => [
            styles.actionButton,
            pressed && { opacity: 0.7 }
          ]}
          onPress={handleLike}
          accessibilityRole="button"
          accessibilityLabel={post.is_liked ? 'Unlike post' : 'Like post'}
          accessibilityHint={`Currently ${post.likes_count} likes`}
        >
          <Ionicons
            name={post.is_liked ? 'heart' : 'heart-outline'}
            size={20}
            color={post.is_liked ? '#ff3040' : (isDark ? '#888888' : '#6c757d')}
          />
          <Text style={[
            styles.actionButtonText,
            post.is_liked && styles.actionButtonTextActive
          ]}>
            {post.likes_count}
          </Text>
        </Pressable>

        <Pressable 
          style={({ pressed }) => [
            styles.actionButton,
            pressed && { opacity: 0.7 }
          ]}
          onPress={handleShowComments}
          accessibilityRole="button"
          accessibilityLabel={showComments ? 'Hide comments' : 'Show comments'}
          accessibilityHint={`${post.comments_count} comments available`}
        >
          <Ionicons
            name="chatbubble-outline"
            size={20}
            color={isDark ? '#888888' : '#6c757d'}
          />
          <Text style={styles.actionButtonText}>
            {post.comments_count}
          </Text>
        </Pressable>

        <Pressable 
          style={({ pressed }) => [
            styles.actionButton,
            pressed && { opacity: 0.7 }
          ]}
          accessibilityRole="button"
          accessibilityLabel="Share post"
          accessibilityHint="Share this post with others"
        >
          <Ionicons
            name="share-outline"
            size={20}
            color={isDark ? '#888888' : '#6c757d'}
          />
        </Pressable>
      </View>

      {/* Comments Section */}
      {showComments && (
        <CommentsList postId={post.id} />
      )}

    </View>
  );
});
