import { StyleSheet, Dimensions } from 'react-native';
import { useColorScheme } from 'react-native';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');
const isTablet = screenWidth >= 768;
const isSmallScreen = screenWidth < 375;

export function useCommunityStyles() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  return StyleSheet.create({
    container: {
      flex: 1,
      marginBottom: '15%',
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
      color: isDark ? '#ffffff' : '#000000',
    },
    createPostButton: {
      backgroundColor: '#007AFF',
      paddingHorizontal: 16,
      paddingVertical: 8,
      borderRadius: 20,
      minWidth: 60,
      justifyContent: 'center',
      alignItems: 'center',
    },
    createPostButtonText: {
      color: '#ffffff',
      fontSize: 14,
      fontWeight: '600',
    },

    // Search bar styles
    searchContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: 16,
      paddingVertical: 12,
      backgroundColor: isDark ? '#111111' : '#f8f9fa',
      borderBottomWidth: 1,
      borderBottomColor: isDark ? '#333333' : '#e0e0e0',
    },
    searchInputContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: isDark ? '#222222' : '#ffffff',
      borderRadius: 20,
      paddingHorizontal: 12,
      paddingVertical: 8,
      borderWidth: 1,
      borderColor: isDark ? '#333333' : '#e0e0e0',
    },
    searchIcon: {
      marginRight: 8,
    },
    searchInput: {
      flex: 1,
      fontSize: 16,
      color: isDark ? '#ffffff' : '#000000',
      paddingVertical: 4,
    },
    clearButton: {
      padding: 4,
      marginLeft: 8,
    },
    cancelButtonContainer: {
      justifyContent: 'center',
      alignItems: 'center',
      overflow: 'hidden',
    },
    cancelButton: {
      padding: 8,
      justifyContent: 'center',
      alignItems: 'center',
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
      paddingHorizontal: isTablet ? 20 : 16,
      paddingVertical: isTablet ? 10 : 8,
      borderRadius: 20,
      marginRight: 8,
      minHeight: isTablet ? 44 : 36,
      justifyContent: 'center',
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
      marginBottom: isTablet ? 12 : 8,
      borderBottomWidth: 1,
      borderBottomColor: isDark ? '#333333' : '#e0e0e0',
      paddingHorizontal: isTablet ? 24 : 16,
    },
    postHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: isTablet ? 20 : 16,
      paddingBottom: 12,
    },
    avatar: {
      width: isTablet ? 48 : 40,
      height: isTablet ? 48 : 40,
      borderRadius: isTablet ? 24 : 20,
      backgroundColor: isDark ? '#333333' : '#e9ecef',
      marginRight: isTablet ? 16 : 12,
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
      paddingBottom: 12,
    },
    postText: {
      fontSize: 16,
      lineHeight: 22,
      color: isDark ? '#ffffff' : '#000000',
      marginBottom: 8,
    },
    postImageContainer: {
      marginTop: 8,
      borderRadius: 8,
      overflow: 'hidden',
    },
    postImage: {
      width: '100%',
      height: 200,
      borderRadius: 8,
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
    postOptionsButton: {
      padding: 8,
      borderRadius: 16,
      justifyContent: 'center',
      alignItems: 'center',
    },

    // Post options menu styles
    menuOverlay: {
      flex: 1,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      justifyContent: 'center',
      alignItems: 'center',
    },
    menuContainer: {
      margin: 20,
      borderRadius: 16,
      overflow: 'hidden',
    },
    menuContent: {
      backgroundColor: isDark ? '#222222' : '#ffffff',
      borderRadius: 16,
      paddingVertical: 8,
      minWidth: 200,
    },
    menuTitle: {
      fontSize: 16,
      fontWeight: '600',
      color: isDark ? '#ffffff' : '#000000',
      textAlign: 'center',
      paddingVertical: 12,
      paddingHorizontal: 16,
      borderBottomWidth: 1,
      borderBottomColor: isDark ? '#333333' : '#e0e0e0',
    },
    menuItem: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: 12,
      paddingHorizontal: 16,
    },
    menuItemDanger: {
      // No additional background for danger items
    },
    menuItemText: {
      fontSize: 16,
      color: isDark ? '#ffffff' : '#000000',
      marginLeft: 12,
      flex: 1,
    },
    menuItemTextDanger: {
      color: '#ff3040',
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
    replyIndicator: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      backgroundColor: isDark ? '#333333' : '#f0f0f0',
      paddingHorizontal: 12,
      paddingVertical: 6,
      borderRadius: 8,
      marginBottom: 8,
    },
    replyText: {
      fontSize: 12,
      color: isDark ? '#ffffff' : '#000000',
      fontWeight: '500',
    },

    // Reply Modal Styles
    originalComment: {
      backgroundColor: isDark ? '#222222' : '#f8f9fa',
      borderRadius: 12,
      padding: 16,
      marginBottom: 20,
      borderLeftWidth: 3,
      borderLeftColor: '#007AFF',
    },
    replyInputContainer: {
      flex: 1,
    },
    replyLabel: {
      fontSize: 16,
      fontWeight: '600',
      color: isDark ? '#ffffff' : '#000000',
      marginBottom: 12,
    },
    replyInput: {
      borderWidth: 1,
      borderColor: isDark ? '#333333' : '#e0e0e0',
      borderRadius: 12,
      padding: 16,
      fontSize: 16,
      color: isDark ? '#ffffff' : '#000000',
      backgroundColor: isDark ? '#222222' : '#ffffff',
      minHeight: 120,
      maxHeight: 200,
    },
    characterCount: {
      alignItems: 'flex-end',
      marginTop: 8,
    },
    characterCountText: {
      fontSize: 12,
      color: isDark ? '#888888' : '#6c757d',
    },

    // Create post modal styles
    modalContainer: {
      flex: 1,
      backgroundColor: isDark ? 'rgba(0,0,0,0.8)' : 'rgba(0,0,0,0.5)',
      justifyContent: 'flex-end',
    },
    modalContent: {
      backgroundColor: isDark ? '#111111' : '#ffffff',
      borderTopLeftRadius: 24,
      borderTopRightRadius: 24,
      paddingTop: 8,
      maxHeight: '90%',
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: -4,
      },
      shadowOpacity: 0.25,
      shadowRadius: 16,
      elevation: 16,
    },
    modalDragHandle: {
      width: 40,
      height: 4,
      backgroundColor: isDark ? '#444444' : '#d0d0d0',
      borderRadius: 2,
      alignSelf: 'center',
      marginTop: 8,
      marginBottom: 8,
    },
    modalHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingHorizontal: 16,
      paddingVertical: 16,
      borderBottomWidth: 1,
      borderBottomColor: isDark ? '#333333' : '#e0e0e0',
      backgroundColor: isDark ? '#111111' : '#ffffff',
      minHeight: 60,
    },
    modalTitle: {
      fontSize: 18,
      fontWeight: '600',
      color: isDark ? '#ffffff' : '#000000',
      flex: 1,
      textAlign: 'center',
      marginHorizontal: 16,
    },
    modalCloseButton: {
      padding: 8,
      borderRadius: 20,
      width: 40,
      height: 40,
      justifyContent: 'center',
      alignItems: 'center',
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
      gap: 8,
      alignItems: 'flex-start',
    },
    selectedHashtag: {
      backgroundColor: '#007AFF',
      paddingHorizontal: 12,
      paddingVertical: 6,
      borderRadius: 16,
      flexDirection: 'row',
      alignItems: 'center',
      flexShrink: 1,
      maxWidth: screenWidth * 0.4,
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

    // Image upload styles
    imageUploadButton: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      borderWidth: 2,
      borderColor: '#007AFF',
      borderStyle: 'dashed',
      borderRadius: 12,
      padding: 16,
      marginTop: 16,
      backgroundColor: isDark ? '#1a1a1a' : '#f8f9fa',
    },
    imageUploadButtonDisabled: {
      borderColor: isDark ? '#333333' : '#e0e0e0',
      backgroundColor: isDark ? '#111111' : '#f0f0f0',
    },
    imageUploadText: {
      fontSize: 16,
      color: '#007AFF',
      marginLeft: 8,
      fontWeight: '500',
    },
    imageUploadTextDisabled: {
      color: isDark ? '#666666' : '#adb5bd',
    },
    selectedImageContainer: {
      marginTop: 16,
      borderRadius: 12,
      overflow: 'hidden',
      position: 'relative',
    },
    selectedImage: {
      width: '100%',
      height: 200,
      borderRadius: 12,
    },
    removeImageButton: {
      position: 'absolute',
      top: 8,
      right: 8,
      backgroundColor: 'rgba(255, 255, 255, 0.9)',
      borderRadius: 12,
      padding: 4,
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
