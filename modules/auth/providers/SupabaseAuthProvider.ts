import { supabase } from "@/lib/supabase";
import { 
  AuthProvider, 
  AuthUser, 
  AuthProfile, 
  LoginCredentials, 
  SignupCredentials, 
  AuthResult 
} from "../interfaces/AuthProvider";

export class SupabaseAuthProvider extends AuthProvider {
  readonly name = "supabase";
  readonly supportedFeatures = [
    "email-password", 
    "password-reset", 
    "profile-management", 
    "session-management"
  ];

  async signInWithEmail(credentials: LoginCredentials): Promise<AuthResult> {
    const { data, error } = await supabase.auth.signInWithPassword({
      email: credentials.email,
      password: credentials.password,
    });
    
    if (error) throw error;
    if (!data.user) throw new Error("Authentication failed");

    const user: AuthUser = {
      id: data.user.id,
      email: data.user.email!,
      emailVerified: !!data.user.email_confirmed_at,
      provider: "supabase",
      metadata: data.user.user_metadata,
    };

    return { user, session: data.session };
  }

  async signUpWithEmail(credentials: SignupCredentials): Promise<AuthResult> {
    const { data, error } = await supabase.auth.signUp({
      email: credentials.email,
      password: credentials.password,
      options: {
        data: {
          full_name: credentials.fullName,
          ...credentials.metadata,
        },
      },
    });

    if (error) throw error;
    if (!data.user) throw new Error("Registration failed");

    const user: AuthUser = {
      id: data.user.id,
      email: data.user.email!,
      emailVerified: !!data.user.email_confirmed_at,
      name: credentials.fullName,
      provider: "supabase",
      metadata: data.user.user_metadata,
    };

    return { user, session: data.session };
  }

  async signOut(): Promise<void> {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  }

  async fetchProfile(userId: string): Promise<AuthProfile> {
    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", userId)
      .single();

    if (error) throw error;
    
    return {
      id: data.id,
      email: data.email,
      fullName: data.full_name,
      avatar: data.avatar_url,
      createdAt: data.created_at,
      updatedAt: data.updated_at,
      metadata: data.metadata,
    };
  }

  async updateProfile(userId: string, updates: Partial<AuthProfile>): Promise<AuthProfile> {
    const { data, error } = await supabase
      .from("profiles")
      .update({
        full_name: updates.fullName,
        avatar_url: updates.avatar,
        metadata: updates.metadata,
        updated_at: new Date().toISOString(),
      })
      .eq("id", userId)
      .select()
      .single();

    if (error) throw error;
    
    return {
      id: data.id,
      email: data.email,
      fullName: data.full_name,
      avatar: data.avatar_url,
      createdAt: data.created_at,
      updatedAt: data.updated_at,
      metadata: data.metadata,
    };
  }

  async resetPassword(email: string, options?: { redirectTo?: string }): Promise<{ success: boolean; message: string }> {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: options?.redirectTo || `${process.env.EXPO_PUBLIC_SITE_URL}/auth/reset-password`,
    });

    if (error) throw error;
    
    return {
      success: true,
      message: "Password reset email sent successfully"
    };
  }

  async updatePassword(newPassword: string): Promise<{ success: boolean; message: string }> {
    const { error } = await supabase.auth.updateUser({
      password: newPassword
    });

    if (error) throw error;
    
    return {
      success: true,
      message: "Password updated successfully"
    };
  }

  async getCurrentUser(): Promise<AuthUser | null> {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) return null;

    return {
      id: user.id,
      email: user.email!,
      emailVerified: !!user.email_confirmed_at,
      provider: "supabase",
      metadata: user.user_metadata,
    };
  }

  async getSession(): Promise<any> {
    const { data: { session } } = await supabase.auth.getSession();
    return session;
  }

  async refreshSession(): Promise<any> {
    const { data: { session }, error } = await supabase.auth.refreshSession();
    if (error) throw error;
    return session;
  }

  // Optional: Email verification
  async verifyEmail(): Promise<{ success: boolean; message: string }> {
    // Implementation depends on your verification flow
    throw new Error("Email verification not implemented yet");
  }

  async resendVerification(): Promise<{ success: boolean; message: string }> {
    // Implementation depends on your verification flow  
    throw new Error("Email verification resend not implemented yet");
  }
}