import { supabase } from '@/lib/supabase';

export async function sendPasswordResetEmail(
  email: string,
  options?: { redirectTo?: string }
): Promise<{ success: boolean; message: string }> {
  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: options?.redirectTo,
  });
  if (error) throw new Error(error.message);
  return { success: true, message: 'Password reset email sent. Please check your inbox.' };
}

export async function updatePassword(newPassword: string): Promise<{ success: boolean; message: string }> {
  const { error } = await supabase.auth.updateUser({ password: newPassword });
  if (error) throw new Error(error.message);
  return { success: true, message: 'Password updated successfully.' };
}