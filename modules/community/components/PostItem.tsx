import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useColorScheme } from 'react-native';
import { useCommunityStyles } from '../styles/communityStyles';
import { useCommunityStore } from '../store/useCommunityStore';
import type { Post } from '../types';
import { CommentsList } from './index';

interface PostItemProps {
  post: Post;
}

export function PostItem({ post }: PostItemProps) {
  const styles = useCommunityStyles();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const [showComments, setShowComments] = useState(false);
  
  const { toggleLike, fetchComments } = useCommunityStore();

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
    const firstName = post.user_first_name || '';
    const lastName = post.user_last_name || '';
    return `${firstName} ${lastName}`.trim() || 'Anonymous User';
  }

  async function handleLike() {
    try {
      await toggleLike(post.id);
    } catch (error) {
      Alert.alert('Error', 'Failed to like post');
    }
  }

  async function handleShowComments() {
    if (!showComments) {
      await fetchComments(post.id);
    }
    setShowComments(!showComments);
  }

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
            {getUserDisplayName()}
          </Text>
          <Text style={styles.postTimestamp}>
            {formatTimestamp(post.created_at)}
          </Text>
        </View>
      </View>

      {/* Post Content */}
      <View style={styles.postContent}>
        <Text style={styles.postText}>
          {post.content}
        </Text>
        
        {post.image_url && (
          <Image 
            source={{ uri: post.image_url }} 
            style={styles.postImage}
            resizeMode="cover"
          />
        )}

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
        <TouchableOpacity 
          style={styles.actionButton}
          onPress={handleLike}
          accessibilityRole="button"
          accessibilityLabel={post.is_liked ? 'Unlike post' : 'Like post'}
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
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.actionButton}
          onPress={handleShowComments}
          accessibilityRole="button"
          accessibilityLabel={showComments ? 'Hide comments' : 'Show comments'}
        >
          <Ionicons
            name="chatbubble-outline"
            size={20}
            color={isDark ? '#888888' : '#6c757d'}
          />
          <Text style={styles.actionButtonText}>
            {post.comments_count}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.actionButton}
          accessibilityRole="button"
          accessibilityLabel="Share post"
        >
          <Ionicons
            name="share-outline"
            size={20}
            color={isDark ? '#888888' : '#6c757d'}
          />
        </TouchableOpacity>
      </View>

      {/* Comments Section */}
      {showComments && (
        <CommentsList postId={post.id} />
      )}
    </View>
  );
}
