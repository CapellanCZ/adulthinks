import { supabase } from '@/lib/supabase';
import { profileService } from '@/modules/profile/services/profileService';
import type { AuthUser } from '@/modules/auth/interfaces/AuthProvider';
import type { UserProfile } from '@/modules/profile/types/profile';

/**
 * Auth services wired to Supabase.
 * Provides login, signup, and profile fetching used by Zustand stores.
 */
export async function loginWithEmail(
  email: string,
  password: string
): Promise<{ user: AuthUser }> {
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) throw new Error(error.message);
  const user = (data?.user ?? null) as unknown as AuthUser;
  if (!user) throw new Error('Login succeeded but no user returned');
  return { user };
}

export async function signUpWithEmail(
  email: string,
  password: string
): Promise<{ user: AuthUser }> {
  const { data, error } = await supabase.auth.signUp({ email, password });
  if (error) throw new Error(error.message);
  const user = (data?.user ?? null) as unknown as AuthUser;
  if (!user) throw new Error('Signup succeeded but no user returned');
  return { user };
}

export async function fetchProfile(userId: string): Promise<UserProfile> {
  // Delegates to profile service (currently mocked). Replace with real API when ready.
  return await profileService.getUserProfile(userId);
}