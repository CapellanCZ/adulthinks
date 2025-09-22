import { useState, useEffect, useRef } from 'react';
import { supabase } from '../../../lib/supabase';

// Global state to prevent multiple auth calls
let globalUserId: string | null = null;
let globalLoading = true;
let isInitialized = false;
const subscribers = new Set<(userId: string | null, loading: boolean) => void>();

// Initialize user state once
const initializeUser = async () => {
  if (isInitialized) return;
  isInitialized = true;
  
  try {
    const { data: { user } } = await supabase.auth.getUser();
    globalUserId = user?.id || null;
    globalLoading = false;
    
    // Notify all subscribers
    subscribers.forEach(callback => callback(globalUserId, false));
  } catch (error) {
    console.error('Error getting current user:', error);
    globalUserId = null;
    globalLoading = false;
    subscribers.forEach(callback => callback(null, false));
  }
};

// Set up auth state listener once
let authListenerSetup = false;
const setupAuthListener = () => {
  if (authListenerSetup) return;
  authListenerSetup = true;
  
  supabase.auth.onAuthStateChange((event, session) => {
    const newUserId = session?.user?.id || null;
    if (newUserId !== globalUserId) {
      globalUserId = newUserId;
      globalLoading = false;
      subscribers.forEach(callback => callback(globalUserId, false));
    }
  });
};

export function useCurrentUser() {
  const [userId, setUserId] = useState<string | null>(globalUserId);
  const [loading, setLoading] = useState(globalLoading);
  const mountedRef = useRef(true);

  useEffect(() => {
    mountedRef.current = true;
    
    // Initialize if not done yet
    if (!isInitialized) {
      initializeUser();
    }
    
    // Setup auth listener if not done yet
    setupAuthListener();

    // If we already have the user, set it immediately
    if (!globalLoading && mountedRef.current) {
      setUserId(globalUserId);
      setLoading(false);
    }

    // Subscribe to changes
    const callback = (newUserId: string | null, newLoading: boolean) => {
      if (mountedRef.current) {
        setUserId(newUserId);
        setLoading(newLoading);
      }
    };
    
    subscribers.add(callback);

    // Cleanup subscription
    return () => {
      mountedRef.current = false;
      subscribers.delete(callback);
    };
  }, []); // Empty dependency array to prevent re-runs

  useEffect(() => {
    return () => {
      mountedRef.current = false;
    };
  }, []);

  return { userId, loading };
}
