import { useState, useEffect, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface DraftPost {
  content: string;
  hashtags: string[];
  imageUrl?: string;
  lastSaved: number;
}

const DRAFT_KEY = 'community_draft_post';
const AUTO_SAVE_DELAY = 2000; // 2 seconds

export function useDraftPost() {
  const [draft, setDraft] = useState<DraftPost | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [autoSaveTimeout, setAutoSaveTimeout] = useState<ReturnType<typeof setTimeout> | null>(null);

  // Load draft on mount
  useEffect(() => {
    loadDraft();
  }, []);

  const loadDraft = useCallback(async () => {
    try {
      const savedDraft = await AsyncStorage.getItem(DRAFT_KEY);
      if (savedDraft) {
        const parsedDraft = JSON.parse(savedDraft) as DraftPost;
        // Only load drafts that are less than 24 hours old
        const isRecent = Date.now() - parsedDraft.lastSaved < 24 * 60 * 60 * 1000;
        if (isRecent) {
          setDraft(parsedDraft);
        } else {
          // Remove old draft
          await AsyncStorage.removeItem(DRAFT_KEY);
        }
      }
    } catch (error) {
      console.error('Failed to load draft:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const saveDraft = useCallback(async (draftData: Omit<DraftPost, 'lastSaved'>) => {
    try {
      const draftToSave: DraftPost = {
        ...draftData,
        lastSaved: Date.now(),
      };
      
      await AsyncStorage.setItem(DRAFT_KEY, JSON.stringify(draftToSave));
      setDraft(draftToSave);
    } catch (error) {
      console.error('Failed to save draft:', error);
    }
  }, []);

  const autoSaveDraft = useCallback((draftData: Omit<DraftPost, 'lastSaved'>) => {
    // Clear existing timeout
    if (autoSaveTimeout) {
      clearTimeout(autoSaveTimeout);
    }

    // Only auto-save if there's content
    if (!draftData.content.trim() && draftData.hashtags.length === 0 && !draftData.imageUrl) {
      return;
    }

    // Set new timeout
    const timeout = setTimeout(() => {
      saveDraft(draftData);
    }, AUTO_SAVE_DELAY);

    setAutoSaveTimeout(timeout);
  }, [saveDraft]); // Removed autoSaveTimeout from deps to prevent infinite loops

  const clearDraft = useCallback(async () => {
    try {
      await AsyncStorage.removeItem(DRAFT_KEY);
      setDraft(null);
      
      // Clear any pending auto-save
      if (autoSaveTimeout) {
        clearTimeout(autoSaveTimeout);
        setAutoSaveTimeout(null);
      }
    } catch (error) {
      console.error('Failed to clear draft:', error);
    }
  }, [autoSaveTimeout]);

  const hasDraft = useCallback(() => {
    return draft !== null && (
      draft.content.trim().length > 0 || 
      draft.hashtags.length > 0 || 
      draft.imageUrl
    );
  }, [draft]);

  const getDraftAge = useCallback(() => {
    if (!draft) return null;
    return Date.now() - draft.lastSaved;
  }, [draft]);

  const formatDraftAge = useCallback(() => {
    const age = getDraftAge();
    if (!age) return null;

    const minutes = Math.floor(age / (1000 * 60));
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (days > 0) return `${days} day${days > 1 ? 's' : ''} ago`;
    if (hours > 0) return `${hours} hour${hours > 1 ? 's' : ''} ago`;
    if (minutes > 0) return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
    return 'Just now';
  }, [getDraftAge]);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (autoSaveTimeout) {
        clearTimeout(autoSaveTimeout);
      }
    };
  }, [autoSaveTimeout]);

  return {
    draft,
    isLoading,
    saveDraft,
    autoSaveDraft,
    clearDraft,
    hasDraft,
    getDraftAge,
    formatDraftAge,
  };
}
