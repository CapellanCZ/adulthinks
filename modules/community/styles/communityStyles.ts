import { StyleSheet } from 'react-native';
import { useColorScheme } from 'react-native';

export function useCommunityStyles() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: isDark ? '#000000' : '#ffffff',
    },
    
    // Header styles
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingHorizontal: 16,
      paddingVertical: 12,
      borderBottomWidth: 1,
      borderBottomColor: isDark ? '#333333' : '#e0e0e0',
      backgroundColor: isDark ? '#111111' : '#ffffff',
    },
    headerTitle: {
      fontSize: 20,
      fontWeight: '600',
      color: isDark ? '#ffffff' : '#000000',
    },
    createPostButton: {
      backgroundColor: isDark ? '#007AFF' : '#007AFF',
      paddingHorizontal: 16,
      paddingVertical: 8,
      borderRadius: 20,
    },
    createPostButtonText: {
      color: '#ffffff',
      fontSize: 14,
      fontWeight: '600',
    },

    // Hashtag filter styles
    hashtagContainer: {
      paddingVertical: 12,
      backgroundColor: isDark ? '#111111' : '#f8f9fa',
      borderBottomWidth: 1,
      borderBottomColor: isDark ? '#333333' : '#e0e0e0',
    },
    hashtagScrollView: {
      paddingHorizontal: 16,
    },
    hashtagChip: {
      backgroundColor: isDark ? '#333333' : '#e9ecef',
      paddingHorizontal: 16,
      paddingVertical: 8,
      borderRadius: 20,
      marginRight: 8,
    },
    hashtagChipActive: {
      backgroundColor: '#007AFF',
    },
    hashtagChipText: {
      color: isDark ? '#ffffff' : '#495057',
      fontSize: 14,
      fontWeight: '500',
    },
    hashtagChipTextActive: {
      color: '#ffffff',
    },

    // Post styles
    postContainer: {
      backgroundColor: isDark ? '#111111' : '#ffffff',
      marginBottom: 8,
      borderBottomWidth: 1,
      borderBottomColor: isDark ? '#333333' : '#e0e0e0',
    },
    postHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      padding: 16,
      paddingBottom: 12,
    },
    avatar: {
      width: 40,
      height: 40,
      borderRadius: 20,
      backgroundColor: isDark ? '#333333' : '#e9ecef',
      marginRight: 12,
    },
    postUserInfo: {
      flex: 1,
    },
    postUserName: {
      fontSize: 16,
      fontWeight: '600',
      color: isDark ? '#ffffff' : '#000000',
      marginBottom: 2,
    },
    postTimestamp: {
      fontSize: 12,
      color: isDark ? '#888888' : '#6c757d',
    },
    postContent: {
      paddingHorizontal: 16,
      paddingBottom: 12,
    },
    postText: {
      fontSize: 16,
      lineHeight: 22,
      color: isDark ? '#ffffff' : '#000000',
      marginBottom: 8,
    },
    postImage: {
      width: '100%',
      height: 200,
      borderRadius: 8,
      marginTop: 8,
    },
    postHashtags: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      marginTop: 8,
    },
    postHashtag: {
      color: '#007AFF',
      fontSize: 14,
      marginRight: 8,
      marginBottom: 4,
    },
    postActions: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: 16,
      paddingVertical: 12,
      borderTopWidth: 1,
      borderTopColor: isDark ? '#333333' : '#f0f0f0',
    },
    actionButton: {
      flexDirection: 'row',
      alignItems: 'center',
      marginRight: 24,
    },
    actionButtonText: {
      fontSize: 14,
      color: isDark ? '#888888' : '#6c757d',
      marginLeft: 6,
    },
    actionButtonTextActive: {
      color: '#007AFF',
    },

    // Comments styles
    commentsContainer: {
      backgroundColor: isDark ? '#0a0a0a' : '#f8f9fa',
      paddingHorizontal: 16,
      paddingVertical: 12,
    },
    commentItem: {
      flexDirection: 'row',
      marginBottom: 12,
    },
    commentAvatar: {
      width: 32,
      height: 32,
      borderRadius: 16,
      backgroundColor: isDark ? '#333333' : '#e9ecef',
      marginRight: 12,
    },
    commentContent: {
      flex: 1,
    },
    commentHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 4,
    },
    commentUserName: {
      fontSize: 14,
      fontWeight: '600',
      color: isDark ? '#ffffff' : '#000000',
      marginRight: 8,
    },
    commentTimestamp: {
      fontSize: 12,
      color: isDark ? '#888888' : '#6c757d',
    },
    commentText: {
      fontSize: 14,
      lineHeight: 18,
      color: isDark ? '#ffffff' : '#000000',
      marginBottom: 6,
    },
    commentActions: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    commentActionButton: {
      flexDirection: 'row',
      alignItems: 'center',
      marginRight: 16,
    },
    commentActionText: {
      fontSize: 12,
      color: isDark ? '#888888' : '#6c757d',
      marginLeft: 4,
    },

    // Create post modal styles
    modalContainer: {
      flex: 1,
      backgroundColor: isDark ? 'rgba(0,0,0,0.8)' : 'rgba(0,0,0,0.5)',
      justifyContent: 'flex-end',
    },
    modalContent: {
      backgroundColor: isDark ? '#111111' : '#ffffff',
      borderTopLeftRadius: 20,
      borderTopRightRadius: 20,
      paddingTop: 20,
      maxHeight: '80%',
    },
    modalHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingHorizontal: 20,
      paddingBottom: 20,
      borderBottomWidth: 1,
      borderBottomColor: isDark ? '#333333' : '#e0e0e0',
    },
    modalTitle: {
      fontSize: 18,
      fontWeight: '600',
      color: isDark ? '#ffffff' : '#000000',
    },
    modalCloseButton: {
      padding: 8,
    },
    modalBody: {
      padding: 20,
    },
    textInput: {
      borderWidth: 1,
      borderColor: isDark ? '#333333' : '#e0e0e0',
      borderRadius: 12,
      padding: 16,
      fontSize: 16,
      color: isDark ? '#ffffff' : '#000000',
      backgroundColor: isDark ? '#222222' : '#ffffff',
      minHeight: 120,
      textAlignVertical: 'top',
    },
    hashtagInput: {
      marginTop: 16,
    },
    hashtagInputField: {
      borderWidth: 1,
      borderColor: isDark ? '#333333' : '#e0e0e0',
      borderRadius: 8,
      padding: 12,
      fontSize: 14,
      color: isDark ? '#ffffff' : '#000000',
      backgroundColor: isDark ? '#222222' : '#ffffff',
    },
    selectedHashtags: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      marginTop: 8,
    },
    selectedHashtag: {
      backgroundColor: '#007AFF',
      paddingHorizontal: 12,
      paddingVertical: 6,
      borderRadius: 16,
      marginRight: 8,
      marginBottom: 8,
      flexDirection: 'row',
      alignItems: 'center',
    },
    selectedHashtagText: {
      color: '#ffffff',
      fontSize: 12,
      marginRight: 6,
    },
    removeHashtagButton: {
      padding: 2,
    },
    submitButton: {
      backgroundColor: '#007AFF',
      paddingVertical: 16,
      borderRadius: 12,
      alignItems: 'center',
      marginTop: 20,
    },
    submitButtonDisabled: {
      backgroundColor: isDark ? '#333333' : '#e9ecef',
    },
    submitButtonText: {
      color: '#ffffff',
      fontSize: 16,
      fontWeight: '600',
    },
    submitButtonTextDisabled: {
      color: isDark ? '#666666' : '#adb5bd',
    },

    // Loading and error styles
    loadingContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: isDark ? '#000000' : '#ffffff',
    },
    errorContainer: {
      padding: 20,
      alignItems: 'center',
    },
    errorText: {
      fontSize: 16,
      color: '#dc3545',
      textAlign: 'center',
      marginBottom: 16,
    },
    retryButton: {
      backgroundColor: '#007AFF',
      paddingHorizontal: 20,
      paddingVertical: 10,
      borderRadius: 8,
    },
    retryButtonText: {
      color: '#ffffff',
      fontSize: 14,
      fontWeight: '600',
    },

    // Empty state styles
    emptyContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      padding: 40,
    },
    emptyText: {
      fontSize: 18,
      color: isDark ? '#888888' : '#6c757d',
      textAlign: 'center',
      marginBottom: 16,
    },
    emptySubtext: {
      fontSize: 14,
      color: isDark ? '#666666' : '#adb5bd',
      textAlign: 'center',
    },
  });
}
